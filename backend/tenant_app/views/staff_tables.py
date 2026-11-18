"""Staff-only table dashboard; existing customer order service is reused for waiter orders."""
from django.db.models import Q
from django.db import transaction
from rest_framework.exceptions import ValidationError
from tenant_app.serializers import OrderSerializer, OrderItemSerializer
from tenant_app.services.order_service import cart_line_price
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from tenant_app.models import DiningTable, RestaurantFloor, Order, OrderItem, Item, Waiter
from tenant_app.views.workforce import logged_employee, staff_plan_features, normalized_phone, staff_login_key
from tenant_app.views.orders import PostCustomerDetailsAPIView
from admin_app.authentication import ROLE_OWNER, ROLE_WAITER, staff_identity_for_tenant
from admin_app.middlewares import bearer_token

OPEN_STATUSES = ('Placed', 'Accepted', 'Preparing', 'Ready to Serve', 'Served', 'Pending')

class StaffTableDashboardAPI(APIView):
    def _staff(self, request):
        if 'order' not in staff_plan_features(request):
            return None
        identity = staff_identity_for_tenant(bearer_token(request), request.tenant.schema_name)
        if identity and identity.role == ROLE_OWNER:
            return {'id': identity.user_id, 'name': 'Restaurant Admin', 'owner': True}
        employee = logged_employee(request)
        return {'id': employee.id, 'name': employee.name, 'owner': False} if employee else None

    def get(self, request):
        employee = self._staff(request)
        if not employee:
            return Response({'error': 'Staff login and order-enabled restaurant plan required.'}, status=403)
        floors = list(RestaurantFloor.objects.filter(is_active=True).order_by('name').values('id', 'name'))
        tables = DiningTable.objects.select_related('floor').filter(Q(floor__isnull=True) | Q(floor__is_active=True)).order_by('floor__name', 'name')
        table_ids = [t.id for t in tables]
        open_orders = Order.objects.filter(dining_table_id__in=table_ids).exclude(order_status__in=['Completed', 'Cancelled', 'Delivered']).exclude(payment_status__in=['Completed', 'Paid']).order_by('date', 'id')
        active = {}
        for order in open_orders:
            active.setdefault(order.dining_table_id, {'id': order.id, 'order_id': order.order_id, 'status': order.order_status, 'date': timezone.localtime(order.date).isoformat()})
        result = []
        for t in tables:
            status = 'unavailable' if not t.is_active or t.staff_status == 'unavailable' else 'occupied' if t.id in active else 'available'
            result.append({'id': t.id, 'name': t.name, 'floor_id': t.floor_id, 'floor_name': t.floor.name if t.floor_id else 'Ground Floor', 'seats': t.seats, 'status': status, 'order': active.get(t.id)})
        return Response({'floors': floors, 'tables': result, 'employee': {'id': employee['id'], 'name': employee['name']}, 'unavailable_items': list(Item.objects.filter(is_active=True, kitchen_available=False).values('id', 'name'))})

    def post(self, request):
        employee = self._staff(request)
        if not employee:
            return Response({'error': 'Staff login and order-enabled restaurant plan required.'}, status=403)
        action = request.data.get('action')
        table = DiningTable.objects.select_related('floor').filter(pk=request.data.get('table_id')).first()
        if not table or not table.is_active or (table.floor_id and not table.floor.is_active):
            return Response({'error': 'Table is not available.'}, status=400)
        open_order = Order.objects.filter(dining_table=table).exclude(order_status__in=['Completed', 'Cancelled', 'Delivered']).exclude(payment_status__in=['Completed', 'Paid']).exists()
        if action == 'status':
            state = request.data.get('status')
            if state not in ('available', 'occupied', 'unavailable'):
                return Response({'error': 'Invalid table status.'}, status=400)
            if state != 'occupied' and open_order:
                return Response({'error': 'Finish the existing order/payment before releasing this table.'}, status=409)
            table.staff_status = state
            table.save(update_fields=['staff_status'])
            return Response({'success': True})
        if action != 'order':
            return Response({'error': 'Invalid action.'}, status=400)
        if table.staff_status == 'unavailable':
            return Response({'error': 'This table is unavailable.'}, status=409)
        if open_order:
            return Response({'error': 'This table already has an open order. Open it from Orders.'}, status=409)
        identity = staff_identity_for_tenant(bearer_token(request), request.tenant.schema_name)
        is_owner = bool(identity and identity.role == ROLE_OWNER and employee['owner'])
        waiter = Waiter.objects.filter(pk=identity.user_id, is_active=True).first() if identity and identity.role == ROLE_WAITER else None
        if not is_owner and (not waiter or staff_login_key(waiter.contact_number) != staff_login_key(logged_employee(request).phone)):
            return Response({'error': 'Waiter identity could not be verified.'}, status=403)
        phone = str(request.data.get('contact_number') or '').strip() or (normalized_phone(waiter.contact_number) if waiter else '')
        if len(phone) != 10 or not phone.isdigit():
            return Response({'error': 'Enter a valid 10-digit customer phone.'}, status=400)
        cart = request.data.get('cart')
        if not isinstance(cart, list) or not cart:
            return Response({'error': 'Add at least one item.'}, status=400)
        label = f'{table.floor.name} · {table.name}' if table.floor_id else f'Direct · {table.name}'
        payload = request.data.copy()
        payload.update({'contact_number': phone, 'table_number': label, 'dining_table': table.pk,
                        'order_created_by': 'Admin' if is_owner else 'Waiter',
                        'waiter_contact_number': '' if is_owner else waiter.contact_number,
                        'name': str(request.data.get('name') or '').strip(),
                        'email': str(request.data.get('email') or '').strip(), 'validate_table': True})
        # Same validated customer/order/cart creation and pricing logic as the existing customer API.
        request._full_data = payload
        result = PostCustomerDetailsAPIView().post(request, request.tenant.schema_name)
        if result.status_code == 201:
            table.staff_status = 'occupied'
            table.save(update_fields=['staff_status'])
        return result
