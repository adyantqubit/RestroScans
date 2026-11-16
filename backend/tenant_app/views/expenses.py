from datetime import date, datetime
from decimal import Decimal, InvalidOperation
from django.db import IntegrityError, transaction
from django.db.models import Sum
from pathlib import Path
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from admin_app.authentication import ROLE_OWNER, staff_identity_for_tenant
from admin_app.middlewares import bearer_token
from admin_app.plan_catalog import codes_for_tenant
from tenant_app.models import ExpenseCategory, ExpenseSubType, RestaurantExpense, StaffEmployee, StaffPayroll, StaffSalaryPayment, StaffSalaryAdvance


def guard(request):
    tenant = getattr(request, 'tenant', None)
    if not tenant or tenant.schema_name == 'public':
        return Response({'error': 'Restaurant tenant required'}, status=403)
    identity = staff_identity_for_tenant(bearer_token(request), tenant.schema_name)
    if not identity or identity.role != ROLE_OWNER:
        return Response({'error': 'Restaurant owner access required'}, status=403)
    if 'expense' not in codes_for_tenant(tenant):
        return Response({'error': 'Expenses are not included in this restaurant plan'}, status=403)
    return None


def category_data(obj):
    return {'id': obj.pk, 'name': obj.name, 'is_active': obj.is_active}


def subtype_data(obj):
    return {'id': obj.pk, 'category_id': obj.category_id, 'name': obj.name, 'is_active': obj.is_active}


def invoice_url(request, obj):
    if not obj.invoice_file:
        return ''
    return request.build_absolute_uri(obj.invoice_file.url)


def expense_data(obj, request=None):
    return {'id': obj.pk, 'category_id': obj.category_id, 'category': obj.category.name,
            'name': obj.name, 'expense_nature': obj.expense_nature, 'sub_type_id': obj.sub_type_id, 'sub_type': obj.sub_type.name if obj.sub_type_id else '',
            'party_name': obj.party_name, 'invoice_number': obj.invoice_number,
            'invoice_date': obj.invoice_date.isoformat() if obj.invoice_date else '',
            'invoice_url': invoice_url(request, obj) if request else '',
            'expense_date': obj.expense_date.isoformat(),
            'expense_time': obj.expense_time.strftime('%H:%M'),
            'quantity': str(obj.quantity) if obj.quantity is not None else '',
            'amount': str(obj.amount), 'created_by': obj.created_by,
            'paid_by': obj.paid_by, 'payment_type': obj.payment_type, 'remark': obj.remark}


def expense_filters(request):
    qs = RestaurantExpense.objects.select_related('category', 'sub_type').all()
    start, end = request.query_params.get('start_date'), request.query_params.get('end_date')
    if start:
        qs = qs.filter(expense_date__gte=date.fromisoformat(start))
    if end:
        qs = qs.filter(expense_date__lte=date.fromisoformat(end))
    category = request.query_params.get('category_id')
    if category:
        qs = qs.filter(category_id=int(category))
    nature = request.query_params.get('expense_nature')
    if nature in ('Direct', 'Indirect'): qs = qs.filter(expense_nature=nature)
    subtype = request.query_params.get('sub_type_id')
    if subtype: qs = qs.filter(sub_type_id=int(subtype))
    search = request.query_params.get('search', '').strip()
    if search:
        from django.db.models import Q
        qs = qs.filter(Q(name__icontains=search) | Q(paid_by__icontains=search) | Q(remark__icontains=search) | Q(party_name__icontains=search) | Q(invoice_number__icontains=search))
    payment = request.query_params.get('payment_type')
    if payment:
        qs = qs.filter(payment_type=payment)
    return qs


def validate_invoice(upload):
    if upload is None: return
    extension = Path(upload.name).suffix.lower()
    if extension not in ('.pdf', '.jpg', '.jpeg', '.png'):
        raise ValueError('Invoice must be PDF, JPG, JPEG or PNG')
    if upload.size > 10 * 1024 * 1024:
        raise ValueError('Invoice must be 10 MB or smaller')
    upload.seek(0)
    header = upload.read(8)
    upload.seek(0)
    if extension == '.pdf' and not header.startswith(b'%PDF-'):
        raise ValueError('Invalid PDF invoice')
    if extension in ('.jpg', '.jpeg') and not header.startswith(b'\xff\xd8\xff'):
        raise ValueError('Invalid JPEG invoice')
    if extension == '.png' and not header.startswith(b'\x89PNG\r\n\x1a\n'):
        raise ValueError('Invalid PNG invoice')


def validated_payload(data, existing=None):
    def field(key, default=''):
        return data.get(key, getattr(existing, key, default) if existing else default)
    category = ExpenseCategory.objects.get(pk=int(field('category_id', getattr(existing, 'category_id', 0))), is_active=True)
    name = str(field('name')).strip()
    paid_by = str(field('paid_by')).strip()
    if not name or not paid_by:
        raise ValueError('Expense name and Paid By are required')
    amount = Decimal(str(field('amount')))
    if not amount.is_finite() or amount <= 0 or amount > Decimal('9999999999.99'):
        raise ValueError('Amount must be greater than zero')
    raw_quantity = field('quantity', None)
    quantity = None if raw_quantity in ('', None) else Decimal(str(raw_quantity))
    if quantity is not None and (not quantity.is_finite() or quantity <= 0 or quantity > Decimal('9999999999.99')):
        raise ValueError('Quantity must be greater than zero')
    expense_date = date.fromisoformat(str(field('expense_date', timezone.localdate().isoformat())))
    raw_time = str(field('expense_time', timezone.localtime().strftime('%H:%M')))
    expense_time = datetime.strptime(raw_time[:5], '%H:%M').time()
    payment_type = str(field('payment_type', 'Cash'))
    if payment_type not in ('Cash', 'UPI', 'Bank', 'Card', 'Other'):
        raise ValueError('Invalid payment type')
    nature = str(field('expense_nature', 'Direct')).strip()
    if nature not in ('Direct', 'Indirect'):
        raise ValueError('Choose Direct Expense or Indirect Expense')
    raw_subtype = field('sub_type_id', getattr(existing, 'sub_type_id', None))
    subtype = None
    if raw_subtype not in ('', None):
        subtype = ExpenseSubType.objects.get(pk=int(raw_subtype), category=category, is_active=True)
    invoice_date = getattr(existing, 'invoice_date', None) if existing else None
    party_name = str(field('party_name'))[:180].strip()
    invoice_number = str(field('invoice_number'))[:100].strip()
    return dict(category=category, expense_nature=nature, sub_type=None, party_name=party_name,
                invoice_number=invoice_number, invoice_date=invoice_date,
                name=name, paid_by=paid_by, amount=amount, quantity=quantity,
                expense_date=expense_date, expense_time=expense_time, payment_type=payment_type,
                remark=str(field('remark'))[:3000])


class ExpenseCategoriesAPI(APIView):
    def get(self, request):
        denied = guard(request)
        if denied is not None: return denied
        return Response({'results': [category_data(c) for c in ExpenseCategory.objects.all()]})

    def post(self, request):
        denied = guard(request)
        if denied is not None: return denied
        name = str(request.data.get('name', '')).strip()
        if not name or len(name) > 100:
            return Response({'error': 'Category name must be 1-100 characters'}, status=400)
        try:
            with transaction.atomic():
                category = ExpenseCategory.objects.create(name=name)
            return Response(category_data(category), status=201)
        except IntegrityError:
            return Response({'error': 'Category already exists'}, status=400)


class ExpenseSubTypesAPI(APIView):
    def get(self, request):
        denied = guard(request)
        if denied is not None: return denied
        qs = ExpenseSubType.objects.select_related('category').all()
        category = request.query_params.get('category_id')
        if category: qs = qs.filter(category_id=category)
        return Response({'results': [subtype_data(item) for item in qs]})

    def post(self, request):
        denied = guard(request)
        if denied is not None: return denied
        name = str(request.data.get('name', '')).strip()
        try:
            category = ExpenseCategory.objects.get(pk=int(request.data.get('category_id')), is_active=True)
            if not name or len(name) > 100: raise ValueError('Sub type name must be 1-100 characters')
            obj = ExpenseSubType.objects.create(category=category, name=name)
            return Response(subtype_data(obj), status=201)
        except (ValueError, TypeError, ExpenseCategory.DoesNotExist, IntegrityError) as exc:
            return Response({'error': 'Could not create sub type: ' + str(exc)}, status=400)


class ExpensesAPI(APIView):
    def get(self, request):
        denied = guard(request)
        if denied is not None: return denied
        try:
            qs = expense_filters(request)
            count = qs.count()
            total = qs.aggregate(value=Sum('amount'))['value'] or Decimal('0')
            page = max(1, int(request.query_params.get('page', 1)))
            page_size = min(100, max(1, int(request.query_params.get('page_size', 5))))
            rows = qs[(page - 1) * page_size:page * page_size]
            return Response({'results': [expense_data(e, request) for e in rows], 'count': count,
                             'total_amount': str(total), 'page': page, 'page_size': page_size})
        except (ValueError, TypeError, OverflowError) as exc:
            return Response({'error': 'Invalid filter: ' + str(exc)}, status=400)

    def post(self, request):
        denied = guard(request)
        if denied is not None: return denied
        try:
            validate_invoice(request.FILES.get('invoice_file'))
            payload = validated_payload(request.data)
            with transaction.atomic():
                identity = staff_identity_for_tenant(bearer_token(request), request.tenant.schema_name)
                obj = RestaurantExpense.objects.create(**payload, created_by=f'Owner #{identity.user_id}')
                if request.FILES.get('invoice_file'):
                    obj.invoice_file = request.FILES['invoice_file']
                    obj.save(update_fields=['invoice_file'])
            return Response(expense_data(obj, request), status=201)
        except (ValueError, TypeError, InvalidOperation, ExpenseCategory.DoesNotExist) as exc:
            return Response({'error': 'Invalid expense details: ' + str(exc)}, status=400)


class ExpenseDetailAPI(APIView):
    def patch(self, request, pk):
        denied = guard(request)
        if denied is not None: return denied
        obj = RestaurantExpense.objects.filter(pk=pk).first()
        if obj is None: return Response({'error': 'Expense not found'}, status=404)
        try:
            validate_invoice(request.FILES.get('invoice_file'))
            payload = validated_payload(request.data, obj)
            for key, value in payload.items(): setattr(obj, key, value)
            if request.FILES.get('invoice_file'):
                obj.invoice_file = request.FILES['invoice_file']
            if str(request.data.get('remove_invoice', '')).lower() == 'true':
                obj.invoice_file = None
            obj.save()
            return Response(expense_data(obj, request))
        except (ValueError, TypeError, InvalidOperation, ExpenseCategory.DoesNotExist) as exc:
            return Response({'error': 'Invalid expense details: ' + str(exc)}, status=400)

    def delete(self, request, pk):
        denied = guard(request)
        if denied is not None: return denied
        deleted, _ = RestaurantExpense.objects.filter(pk=pk).delete()
        if not deleted: return Response({'error': 'Expense not found'}, status=404)
        return Response({'status': 'deleted'})


class ExpenseStaffAPI(APIView):
    def get(self, request):
        denied = guard(request)
        if denied is not None: return denied
        return Response({'results': [{'id': e.pk, 'name': e.name} for e in StaffEmployee.objects.filter(is_active=True).order_by('name')]})


class ExpensePayrollSyncAPI(APIView):
    """Read payroll transactions directly; write via the existing validated payroll API."""
    def get(self, request):
        denied = guard(request)
        if denied is not None: return denied
        start, end = request.query_params.get('start_date'), request.query_params.get('end_date')
        try:
            start = date.fromisoformat(start) if start else None
            end = date.fromisoformat(end) if end else None
        except ValueError:
            return Response({'error': 'Invalid date filter'}, status=400)
        payments = StaffSalaryPayment.objects.select_related('payroll__employee').all()
        advances = StaffSalaryAdvance.objects.select_related('employee').all()
        if start:
            payments = payments.filter(payment_date__gte=start)
            advances = advances.filter(date__gte=start)
        if end:
            payments = payments.filter(payment_date__lte=end)
            advances = advances.filter(date__lte=end)
        rows = []
        for p in payments:
            rows.append({'id': 'salary-' + str(p.pk), 'employee': p.payroll.employee.name, 'employee_id': p.payroll.employee_id, 'kind': 'Salary Payment', 'amount': str(p.amount), 'date': str(p.payment_date), 'mode': p.payment_mode, 'month': f'{p.payroll.year}-{p.payroll.month:02d}', 'remark': p.remark, 'source': 'Staff & Payroll'})
        for a in advances:
            rows.append({'id': 'advance-' + str(a.pk), 'employee': a.employee.name, 'employee_id': a.employee_id, 'kind': 'Salary Advance', 'amount': str(a.amount), 'date': str(a.date), 'mode': 'Not recorded', 'month': a.date.strftime('%Y-%m'), 'remark': a.remark, 'source': 'Staff & Payroll'})
        rows.sort(key=lambda r: (r['date'], r['id']), reverse=True)
        return Response({'results': rows, 'count': len(rows), 'total_amount': str(sum((Decimal(r['amount']) for r in rows), Decimal('0')))})
