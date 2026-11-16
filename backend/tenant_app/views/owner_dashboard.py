"""Owner-only overview, scoped to the current restaurant schema."""
from datetime import timedelta
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from admin_app.authentication import ROLE_OWNER, staff_identity_for_tenant
from admin_app.middlewares import bearer_token
from admin_app.models import Tenant
from admin_app.plan_catalog import codes_for_tenant
from tenant_app.models import Order, StaffEmployee, StaffAttendance, StaffLeave, Reservation, RestaurantExpense, DiningTable


class OwnerDashboardAPI(APIView):
    def get(self, request, tenant=None):
        identity = staff_identity_for_tenant(bearer_token(request), request.tenant.schema_name)
        if not identity or identity.role != ROLE_OWNER:
            return Response({'error': 'Owner access required.'}, status=403)
        restaurant = Tenant.objects.filter(schema_name=request.tenant.schema_name).first()
        features = set(codes_for_tenant(restaurant))
        today = timezone.localdate()
        result = {'date': today.isoformat(), 'features': sorted(features), 'staff': {}, 'sales': None, 'reservations': None, 'expenses': None}
        if 'staff' in features:
            employees = StaffEmployee.objects.filter(is_active=True)
            attendance = StaffAttendance.objects.filter(date=today, employee__is_active=True)
            present_ids = attendance.filter(check_in__isnull=False).values('employee_id').distinct()
            result['staff'] = {
                'total': employees.count(),
                'present': present_ids.count(),
                'not_checked_in': max(0, employees.count() - present_ids.count()),
                'on_approved_leave': StaffLeave.objects.filter(employee__is_active=True, status='Approved', start_date__lte=today, end_date__gte=today).values('employee_id').distinct().count(),
                'pending_leaves': StaffLeave.objects.filter(status='Pending', employee__is_active=True).count(),
                'recent_activity': list(attendance.select_related('employee').order_by('-check_in')[:8].values('employee__name', 'check_in', 'check_out')),
            }
        if 'order' in features:
            orders = Order.objects.filter(date__date=today)
            paid = orders.filter(payment_status__in=['Paid', 'Completed']).exclude(order_status='Cancelled')
            last_week = today - timedelta(days=6)
            trend = (Order.objects.filter(date__date__gte=last_week, date__date__lte=today, payment_status__in=['Paid', 'Completed'])
                     .exclude(order_status='Cancelled').annotate(day=TruncDate('date')).values('day').annotate(amount=Sum('final_amount'), count=Count('id')).order_by('day'))
            sales = {
                'total_orders': orders.count(), 'paid_orders': paid.count(),
                'revenue': round(paid.aggregate(total=Sum('final_amount'))['total'] or 0, 2),
                'unpaid_orders': orders.filter(payment_status='Pending').exclude(order_status='Cancelled').count(),
                'cancelled_orders': orders.filter(order_status='Cancelled').count(),
                'active_orders': orders.exclude(order_status__in=['Cancelled', 'Served']).count(),
                'cash': round(paid.filter(payment_mode__iexact='cash').aggregate(total=Sum('final_amount'))['total'] or 0, 2),
                'non_cash': round(paid.exclude(payment_mode__iexact='cash').aggregate(total=Sum('final_amount'))['total'] or 0, 2),
                'tables': DiningTable.objects.filter(is_active=True).count(),
                'trend': [{'date': str(row['day']), 'amount': round(row['amount'] or 0, 2), 'count': row['count']} for row in trend],
                'recent_orders': list(orders.order_by('-date').values('order_id', 'order_status', 'payment_status', 'final_amount', 'table_number', 'date')[:8]),
            }
            result['sales'] = sales
        if 'reservation' in features:
            reservations = Reservation.objects.filter(date=today)
            result['reservations'] = {'today': reservations.count(), 'pending': reservations.filter(reservation_status='Pending').count(), 'confirmed': reservations.filter(reservation_status='Confirm').count()}
        if 'expense' in features:
            expenses = RestaurantExpense.objects.filter(expense_date=today)
            amount = expenses.aggregate(total=Sum('amount'))['total'] or 0
            result['expenses'] = {'today': float(amount), 'entries': expenses.count()}
            if result['sales'] is not None:
                result['expenses']['after_expenses'] = round(result['sales']['revenue'] - float(amount), 2)
        return Response(result)
