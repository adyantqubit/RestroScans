from django.db.models import Q
from django.utils.timezone import datetime
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from admin_app.authentication import ROLE_WAITER, issue_tokens
from admin_app.models import Tenant
from ..models import Order, OrderItem, Setting, Waiter
from ..serializers import OrderItemWithOrderIdSerializer, OrderSerializer, SettingSaveSerializer, WaiterSerializer
from common.listing import list_page
from ..utils.encryption import hash_password, verify_password


class WaiterPageAPI(APIView):
    """Paged waiter list. Search, sort, status and page run in the database."""

    def post(self, request, tenant):
        rows, total = list_page(
            Waiter.objects.all(),
            request.data,
            ('name', 'contact_number'),
            {'name': 'name', 'contact_number': 'contact_number', 'is_active': 'is_active'},
            default_order='id',
            filter_fields={'is_active': 'is_active'},
        )
        return Response({'data': WaiterSerializer(rows, many=True).data, 'count': total})


class WaiterAPI(APIView):
    def get(self, request, tenant):
        waiters = Waiter.objects.all().order_by('-id')
        return Response({'data': WaiterSerializer(waiters, many=True).data})

    def post(self, request, tenant):
        data = request.data.copy()
        password = str(data.get('password') or '')
        waiter_id = data.get('id')

        if waiter_id:
            waiter = Waiter.objects.get(id=waiter_id)
            if password:
                data['password'] = hash_password(password)
            else:
                data.pop('password', None)
            serializer = WaiterSerializer(waiter, data=data, partial=True)
        else:
            if not password:
                return Response({'error': {'password': ['Password should not be blank']}})
            data['password'] = hash_password(password)
            serializer = WaiterSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        return Response({'error': serializer.errors})


class WaiterAuthenticateAPI(APIView):
    def post(self, request, tenant):
        login_id = (request.data.get('contact_number') or '').strip()
        waiter = Waiter.objects.filter(contact_number__iexact=login_id).first()
        if waiter is None:
            return Response({'error': 'Please enter valid contact number'})

        valid, needs_upgrade = verify_password(request.data.get('password'), waiter.password)
        if not valid:
            return Response({'error': 'Please enter valid password'})
        if needs_upgrade:
            waiter.password = hash_password(request.data.get('password'))
            waiter.save(update_fields=['password'])
        if not waiter.is_active:
            return Response({'error': 'Waiter is not active'})

        access_token, refresh_token = issue_tokens(waiter.id, ROLE_WAITER, request.tenant.schema_name)
        from admin_app.plan_catalog import codes_for_tenant
        return Response({
            'token': access_token,
            'refresh_token': refresh_token,
            'waiter': WaiterSerializer(waiter).data,
            'tenantInfo': Tenant.objects.filter(schema_name=request.tenant.schema_name).values().first(),
            'features': codes_for_tenant(request.tenant),
        })


class WaiterDashboardAPI(APIView):
    def get(self, request, tenant, waiterId):
        staff = getattr(request, 'staff', None)
        if staff is not None and staff.role == ROLE_WAITER and str(staff.user_id) != str(waiterId):
            return Response({'waiter_error': 'You can only open your own dashboard.'}, status=status.HTTP_403_FORBIDDEN)

        waiter = Waiter.objects.get(id=waiterId)
        if not waiter.is_active:
            return Response({'waiter_error': 'Waiter is not active'})

        today = datetime.today().date()
        own_orders = Order.objects.filter(date__gte=today, waiter_contact_number=waiter.contact_number).order_by('-id')

        newly_placed = own_orders.filter(order_status='Placed')
        pending = own_orders.filter(~Q(order_status='Placed'), Q(payment_status='Pending') | Q(payment_status='Paid'))
        completed = own_orders.filter(payment_status='Completed')
        order_items = OrderItem.objects.filter(date__gte=today).select_related('order_id').order_by('-id')

        restaurant = request.tenant.restaurant_name
        return Response({
            'todays_pending_orders': OrderSerializer(pending, many=True).data,
            'order_item': OrderItemWithOrderIdSerializer(order_items, many=True).data,
            'todays_newly_placed_orders': OrderSerializer(newly_placed, many=True).data,
            'setting': SettingSaveSerializer(Setting.objects.last()).data,
            'todays_completed_orders': OrderSerializer(completed, many=True).data,
            'tenant': {
                'name': restaurant.restaurant_name if restaurant else '',
                'address': restaurant.address if restaurant else '',
            },
        })
