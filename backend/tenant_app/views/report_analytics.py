from datetime import datetime, timedelta
from decimal import Decimal
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView
from ..models import (Order, OrderItem, RestaurantExpense, StaffPayroll, StaffSalaryPayment, StaffSalaryAdvance, Reservation, CustomerDetail)

MODULES = ('orders', 'revenue', 'items', 'expenses', 'payroll', 'customers', 'reservations')

def as_number(value):
    return round(float(value or 0), 2)

def make_row(module, date, name, category, amount=0, detail='', ref=''):
    return {'module': module, 'date': str(date)[:10], 'name': str(name or ''), 'category': str(category or 'Other'), 'amount': as_number(amount), 'detail': str(detail or ''), 'reference': str(ref or '')}

def collect(start, end, module):
    rows = []
    if module in ('all', 'orders', 'revenue'):
        qs = Order.objects.filter(date__date__gte=start, date__date__lte=end).order_by('-date')
        for o in qs.iterator():
            ref = o.order_id or str(o.pk)
            if module in ('all', 'orders'):
                rows.append(make_row('orders', o.date.date(), ref, o.order_status, o.final_amount, f'Table {o.table_number} | Payment: {o.payment_status}', ref))
            if module in ('all', 'revenue') and o.payment_status == 'Completed':
                rows.append(make_row('revenue', o.date.date(), ref, o.payment_mode or 'Other', o.final_amount, 'Completed payment (grouped by order date)', ref))
    if module in ('all', 'items'):
        for item in OrderItem.objects.filter(date__date__gte=start, date__date__lte=end).select_related('order_id').order_by('-date').iterator():
            rows.append(make_row('items', item.date.date(), item.item, item.item_status, item.price if item.item_status != 'Cancelled' else 0, f'{item.quantity} × {item.serving_size}', item.order_id.order_id))
    if module in ('all', 'expenses'):
        for e in RestaurantExpense.objects.filter(expense_date__gte=start, expense_date__lte=end).select_related('category').order_by('-expense_date').iterator():
            rows.append(make_row('expenses', e.expense_date, e.name, str(e.category), e.amount, f'{e.payment_type} | {e.party_name}', f'EXP-{e.pk}'))
    if module in ('all', 'payroll', 'expenses'):
        for p in StaffSalaryPayment.objects.filter(payment_date__gte=start, payment_date__lte=end).select_related('payroll__employee').order_by('-payment_date').iterator():
            employee = p.payroll.employee.name
            row = make_row('payroll', p.payment_date, employee, 'Monthly Salary', p.amount, f'{p.payroll.month:02d}/{p.payroll.year} | {p.payment_mode} | {p.remark}', f'SAL-{p.pk}')
            if module != 'expenses': rows.append(row)
            else: rows.append({**row, 'module': 'expenses', 'category': 'Salary Payment'})
        for a in StaffSalaryAdvance.objects.filter(date__gte=start, date__lte=end).select_related('employee').order_by('-date').iterator():
            row = make_row('payroll', a.date, a.employee.name, 'Salary Advance', a.amount, a.remark, f'ADV-{a.pk}')
            if module != 'expenses': rows.append(row)
            else: rows.append({**row, 'module': 'expenses'})
    if module in ('all', 'customers'):
        # Customer records do not have a reliable created_at field: derive activity from orders.
        for o in Order.objects.filter(date__date__gte=start, date__date__lte=end).select_related('customer_id').order_by('-date').iterator():
            c = o.customer_id
            rows.append(make_row('customers', o.date.date(), getattr(c, 'last_customer_name', '') or getattr(c, 'contact_number', '') or f'Customer {c.pk}', 'Paid' if o.payment_status == 'Completed' else 'Unpaid', o.final_amount if o.payment_status == 'Completed' else 0, o.order_id, f'CUS-{c.pk}'))
    if module in ('all', 'reservations'):
        for r in Reservation.objects.filter(date__gte=start, date__lte=end).order_by('-date').iterator():
            rows.append(make_row('reservations', r.date, r.name or r.contact_number, r.reservation_status, 0, f'Table {r.table_number} | Guests: {r.number_of_person}', f'RES-{r.pk}'))
    return rows

class ReportAnalyticsAPI(APIView):
    def get(self, request, tenant):
        today = timezone.localdate()
        try:
            start = datetime.strptime(request.query_params.get('start', str(today.replace(day=1))), '%Y-%m-%d').date()
            end = datetime.strptime(request.query_params.get('end', str(today)), '%Y-%m-%d').date()
        except ValueError:
            return Response({'error': 'Invalid date. Use YYYY-MM-DD.'}, status=400)
        if end < start or (end-start).days > 366:
            return Response({'error': 'Choose a valid date range of at most 366 days.'}, status=400)
        module = request.query_params.get('module', 'all').lower()
        if module not in ('all', *MODULES):
            return Response({'error': 'Unknown report module.'}, status=400)
        source = request.query_params.get('source', 'all').strip().lower()
        if source not in ('all', *MODULES):
            return Response({'error': 'Unknown report source.'}, status=400)
        # The source filter is only relevant to the Master Report.
        rows = collect(start, end, module if module != 'all' else source)
        q = request.query_params.get('search', '').strip().lower()[:120]
        if q:
            words = q.split()
            def matches(row):
                haystack = ' '.join((row['date'], row['name'], row['category'], row['detail'], row['reference'], row['module'])).lower()
                return all(word in haystack for word in words)
            rows = [r for r in rows if matches(r)]
        # A Master report contains different metrics; never add them into a single money total.
        groups = {}
        for row in rows:
            key = row['module'] if module == 'all' else row['category']
            group = groups.setdefault(key, {'name': key, 'count': 0, 'amount': 0})
            group['count'] += 1
            group['amount'] = round(group['amount'] + row['amount'], 2)
        breakdown = sorted(groups.values(), key=lambda g: -g['count'])
        count = len(rows)
        for group in breakdown:
            group['percentage'] = round(group['count'] * 100 / count, 1) if count else 0
        rows.sort(key=lambda r: (r['date'], r['reference']), reverse=True)
        try:
            page = max(1, int(request.query_params.get('page', 1)))
        except ValueError:
            page = 1
        page_size = 5
        page = min(page, max(1, (count+page_size-1)//page_size))
        return Response({'module': module, 'source': source, 'start': str(start), 'end': str(end), 'total': count, 'breakdown': breakdown, 'rows': rows[(page-1)*page_size:page*page_size], 'page': page, 'page_size': page_size, 'pages': max(1, (count+page_size-1)//page_size)})
