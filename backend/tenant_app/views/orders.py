# import logging

# from django.db import transaction
# from rest_framework import status
# from rest_framework.response import Response
# from rest_framework.views import APIView

# from admin_app.authentication import staff_identity_for_tenant
# from admin_app.middlewares import bearer_token
# from common.listing import date_bounds, list_page

# from ..models import CustomerDetail, FcmNotification, Item, Order, OrderItem, Setting
# from ..order_access import ensure_order_access
# from ..serializers import (
#     AllOrderSerializer,
#     CustomerDetailSerializer,
#     OrderItemSerializer,
#     OrderItemWithOrderIdSerializer,
#     OrderSerializer,
#     SettingSaveSerializer,
#     SettingSerializer,
# )
# from ..services.order_board import basic_board, full_board, restaurant_detail, todays_items
# from ..services.order_service import (
#     cart_line_price,
#     lock_order_numbers,
#     orderCreation,
#     orderItemsCreation,
#     responseDataCreation,
#     validateTable,
# )
# from ..services.otp_service import order_token_is_valid
# from ..services.pricing import money

# logger = logging.getLogger(__name__)


# def _with_value(current, value):
#     """Comma separated list of every name / email the customer has ordered with."""
#     current = current or ''
#     if not value or value in current.split(','):
#         return current
#     return f'{current},{value}' if current else value


# def _remember_customer(data):
#     name = data.get('name') or ''
#     email = data.get('email') or ''
#     customer = CustomerDetail.objects.filter(contact_number=data['contact_number']).first()
#     if customer is None:
#         serializer = CustomerDetailSerializer(data={
#             'last_customer_name': name,
#             'name': name,
#             'email': email,
#             'contact_number': data['contact_number'],
#         })
#         serializer.is_valid(raise_exception=True)
#         return serializer.save()
#     customer.name = _with_value(customer.name, name)
#     customer.email = _with_value(customer.email, email)
#     customer.last_customer_name = name
#     customer.last_email = email
#     customer.save()
#     return customer


# def _date_range(queryset, data):
#     bounds = date_bounds(data)
#     return queryset.filter(date__gte=bounds[0], date__lt=bounds[1]) if bounds else queryset


# def _active_total(order_items):
#     return money(sum(item.price for item in order_items if item.item_status != 'Cancelled'))


# class PostCustomerDetailsAPIView(APIView):
#     def post(self, request, tenant):
#         staff_ok = staff_identity_for_tenant(bearer_token(request), request.tenant.schema_name) is not None
#         if not staff_ok:
#             token = request.headers.get('X-Order-Token') or request.data.get('order_token')
#             if not order_token_is_valid(token, request.data.get('contact_number'), tenant):
#                 return Response(
#                     {'success': False, 'message': 'Verify OTP before placing the order.', 'msg': ''},
#                     status=status.HTTP_403_FORBIDDEN,
#                 )
#         else:
#             payload = request.data.copy()
#             if payload.get('order_created_by') not in ('Admin', 'Waiter'):
#                 payload['order_created_by'] = 'Admin'
#             request._full_data = payload

#         data = request.data
#         if data.get('fcmToken'):
#             FcmNotification.objects.filter(registration_id=data['fcmToken']).update(
#                 phone_number=data['contact_number'])

#         if data.get('validate_table') is True and not validateTable(data.get('table_number')):
#             return Response({'tabel_error': 'Tabel number is already running'})

#         with transaction.atomic():
#             lock_order_numbers()
#             customer = _remember_customer(data)
#             created = orderCreation(tenant, request)
#             items = orderItemsCreation(request, created['order_obj'])

#         response = responseDataCreation(
#             created['orderSerializer'].data,
#             items['orderItemSerializer'].data,
#             customer,
#             SettingSaveSerializer(Setting.objects.last()).data,
#         )
#         return Response({'msg': 'Saved Successfully', 'data': response}, status=status.HTTP_201_CREATED)


# class updateOrdersAPIView(APIView):
#     def put(self, request, tenant):
#         order = Order.objects.select_related('customer_id').get(order_id=request.data['orders'])
#         ensure_order_access(request, tenant, order)
#         with transaction.atomic():
#             orderItemsCreation(request, order)

#         order_items = list(OrderItem.objects.filter(order_id=order).select_related('item_id').order_by('-id'))
#         sub_total = sum(
#             cart_line_price(line.item_id, line.serving_size, line.quantity) if line.item_id else line.price
#             for line in order_items if line.item_status != 'Cancelled'
#         )
#         serializer = OrderSerializer(order, data={'sub_total': money(sub_total), 'order_status': 'Placed'},
#                                      partial=True)
#         if serializer.is_valid():
#             serializer.save()
#         else:
#             logger.warning('Order %s update rejected: %s', order.order_id, serializer.errors)
#         return Response({
#             'orderItemSerializer': OrderItemSerializer(order_items, many=True).data,
#             'order': serializer.data,
#         })


# class getOrdersAPI(APIView):
#     def get(self, request, tenant):
#         orders = Order.objects.select_related('customer_id').order_by('-date')
#         return Response({'msg': 'success', 'allOrders': AllOrderSerializer(orders, many=True).data})


# class getOrderItemsAPI(APIView):
#     def get(self, request, tenant, pk):
#         order = Order.objects.select_related('customer_id').get(id=pk)
#         return Response({
#             'msg': 'success',
#             'orderItems': OrderItemSerializer(OrderItem.objects.filter(order_id=pk).order_by('-id'), many=True).data,
#             'customerDetail': CustomerDetailSerializer(order.customer_id).data,
#             'orderDetail': AllOrderSerializer(order).data,
#             'settingData': SettingSaveSerializer(Setting.objects.last()).data,
#         })


# class UpdateOrderPaymentStatus(APIView):
#     def put(self, request, tenant, orderID):
#         from admin_app.plan_catalog import order_write_data
#         payload, denied = order_write_data(request, request.data)
#         if denied is not None:
#             return denied
#         order = Order.objects.get(order_id=orderID)
#         new_status = payload.get('order_status')
#         if new_status == 'Confirm':
#             OrderItem.objects.filter(order_id=order, item_status='Pending').update(
#                 item_status='Confirm', kot_print_status=True)
#         if new_status == 'Cancelled':
#             order.cancelled_by = 'Admin'

#         serializer = OrderSerializer(order, payload, partial=True)
#         if not serializer.is_valid():
#             return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
#         try:
#             serializer.save()
#         except Exception:
#             logger.exception('Could not update order %s', orderID)
#             return Response({'error': 'error'})
#         return Response({
#             'success': 'Updated status',
#             'order_items': todays_items(),
#             **basic_board(),
#             'order': serializer.data,
#         }, status=status.HTTP_201_CREATED)


# class UpdateItemStatus(APIView):
#     def put(self, request, tenant, orderID):
#         order_pk = Order.objects.values_list('id', flat=True).get(order_id=orderID)
#         prices = []
#         with transaction.atomic():
#             for data in request.data:
#                 line = OrderItem.objects.get(id=data['id'])
#                 if data['item_status'] != 'Cancelled':
#                     line.quantity = data['quantity']
#                     line.price = data['price']
#                     line.item_status = data['item_status']
#                     line.save()
#                     prices.append(line.price)
#                     continue
#                 line.item_status = 'Cancelled'
#                 line.save()
#                 if not OrderItem.objects.filter(order_id=order_pk).exclude(item_status='Cancelled').exists():
#                     cancelled = OrderSerializer(Order.objects.get(id=order_pk),
#                                                 data={'cancelled_by': 'Admin', 'order_status': 'Cancelled'},
#                                                 partial=True)
#                     if cancelled.is_valid():
#                         cancelled.save()
#                 else:
#                         logger.warning('Order %s cancel rejected: %s', orderID, cancelled.errors)

#             order = Order.objects.get(id=order_pk)
#             order.sub_total = money(sum(prices))
#         order.save()

#         order_items = OrderItem.objects.filter(order_id=order_pk).select_related('order_id').order_by('-id')
#         return Response({
#             'success': 'Updated status',
#             'order_items': OrderItemWithOrderIdSerializer(order_items, many=True).data,
#             'order': OrderSerializer(Order.objects.select_related('customer_id').get(id=order_pk)).data,
#             **basic_board(),
#         }, status=status.HTTP_201_CREATED)


# class UpdateAllOrderStatus(APIView):
#     def post(self, request, tenant):
#         from admin_app.plan_catalog import order_write_data
#         payload, denied = order_write_data(request, request.data)
#         if denied is not None:
#             return denied
#         changes = {}
#         if 'order_status' in payload:
#             changes['order_status'] = payload['order_status']
#             if 'cancelled_by' in payload:
#                 changes['cancelled_by'] = payload['cancelled_by']
#         with transaction.atomic():
#             for data in payload['orders']:
#                 order = Order.objects.get(order_id=data['order_id'])
#                 if changes:
#                     serializer = OrderSerializer(order, data=changes, partial=True)
#                     if serializer.is_valid():
#                         order = serializer.save()
#                 if 'payment_status' in payload:
#                     serializer = OrderSerializer(order, data={'payment_status': payload['payment_status']},
#                                                  partial=True)
#                     serializer.is_valid(raise_exception=True)
#                     serializer.save()

#         return Response({
#             'success': 'Updated status',
#             'order_items': todays_items(),
#             **full_board(),
#         }, status=status.HTTP_201_CREATED)


# class CheckOrderConfirmAPIView(APIView):
#     def post(self, request, tenant):
#         order = Order.objects.select_related('customer_id').get(order_id=request.data['order_id'])
#         ensure_order_access(request, tenant, order)
#         return Response({'order': OrderSerializer(order).data}, 200)
       

# class DeleteOrderItemsAPIView(APIView):
#     def put(self, request, tenant):
#         line = OrderItem.objects.select_related('order_id__customer_id').get(id=request.data['orderItem'])
#         ensure_order_access(request, tenant, line.order_id)
#         line.item_status = 'Cancelled'
#         line.save()

#         order = Order.objects.get(order_id=request.data['order'])
#         order_items = list(OrderItem.objects.filter(order_id=order.id).order_by('-id'))
#         changes = {'sub_total': _active_total(order_items)}
#         if all(item.item_status == 'Cancelled' for item in order_items):
#             changes['cancelled_by'] = request.data.get('cancelled_by', 'Admin')
#             changes['order_status'] = 'Cancelled'

#         serializer = OrderSerializer(order, data=changes, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#         else:
#             logger.warning('Order %s update rejected: %s', order.order_id, serializer.errors)
#         return Response({'orderItem': OrderItemSerializer(order_items, many=True).data, 'order': serializer.data})


# class PostUpdateOrderItemsAPIView(APIView):
#     def put(self, request, tenant):
#         updated = []
#         with transaction.atomic():
#             for cart in request.data['orderItems']:
#                 if cart['item_status'] == 'Cancelled':
#                     continue
#                 line = OrderItem.objects.select_related('order_id__customer_id').get(id=cart['id'])
#                 ensure_order_access(request, tenant, line.order_id)
#                 line.quantity = cart['quantity']
#                 line.price = cart['price']
#                 line.item_status = cart['item_status']
#                 line.save()
#                 updated.append(line)

#             order = Order.objects.select_related('customer_id').get(order_id=request.data['orders'])
#             order.sub_total = money(sum(line.price for line in updated))
#             order.save()
#         return Response({
#             'orderItem': OrderItemSerializer(updated, many=True).data,
#             'order': AllOrderSerializer(order).data,
#         })


# class GetOrderItemsAndOrderAPIView(APIView):
#     def post(self, request, tenant):
#         order = Order.objects.select_related('customer_id').get(order_id=request.data['order'])
#         ensure_order_access(request, tenant, order)
#         return Response({
#             'orderItem': OrderItemSerializer(OrderItem.objects.filter(order_id=order.id).order_by('-id'),
#                                              many=True).data,
#             'order': OrderSerializer(order).data,
#         })


# class AddOrderItemsAPIView(APIView):
#     def post(self, request, tenant):
#         data = request.data
#         item = Item.objects.get(id=data['item_id'])
#         target = Order.objects.select_related('customer_id').get(order_id=data['order_order_id'])
#         ensure_order_access(request, tenant, target)
#         with transaction.atomic():
#             existing = OrderItem.objects.filter(
#                 order_id__order_id=data['order_order_id'],
#                 item_id=item.id,
#                 serving_size=data['serving_size'],
#                 item_status='Pending',
#             ).first()
#             if existing is not None:
#                 quantity = int(data['quantity']) + existing.quantity
#                 serializer = OrderItemSerializer(existing, data={
#                     'quantity': quantity,
#                     'price': cart_line_price(item, data['serving_size'], quantity),
#                     'item_status': 'Pending',
#                 }, partial=True)
#                 if not serializer.is_valid():
#                     return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
#                 serializer.save()
#             else:
#                 OrderItem(
#                     order_id=target,
#                     item=data['item'],
#                     item_id=item,
#                     serving_size=data['serving_size'],
#                     quantity=data['quantity'],
#                     item_status=data['item_status'],
#                 ).save()

#             order_items = list(OrderItem.objects.filter(order_id__order_id=data['order_order_id'])
#                                .select_related('order_id').order_by('-id'))
#             order = Order.objects.select_related('customer_id').get(order_id=data['order_order_id'])
#             order.sub_total = _active_total(order_items)
#             order.order_status = 'Placed'
#             order.save()

#         return Response({
#             'msg': 'success',
#             'orderItems': OrderItemWithOrderIdSerializer(order_items, many=True).data,
#             'order': AllOrderSerializer(order).data,
#         })


# ORDER_LIST_SORT = {
#     'order_id': 'order_id',
#     'table_number': 'table_number',
#     'order_status': 'order_status',
#     'payment_status': 'payment_status',
#     'payment_mode': 'payment_mode',
#     'date': 'date',
# }


# class OrderAPI(APIView):
#     def get(self, request, tenant):
#         order_items = OrderItem.objects.select_related('order_id').order_by('-id')
#         return Response({
#             'msg': 'success',
#             'orderCount': Order.objects.count(),
#             'order_item': OrderItemWithOrderIdSerializer(order_items, many=True).data,
#             'setting': SettingSaveSerializer(Setting.objects.last()).data,
#             'tenant': restaurant_detail(request),
#         })

#     def post(self, request, tenant):
#         orders = _date_range(Order.objects.select_related('customer_id'), request.data)
#         page, count = list_page(
#             orders,
#             request.data,
#             search_fields=('table_number', 'order_id', 'order_status', 'payment_status'),
#             sort_columns=ORDER_LIST_SORT,
#             filter_fields={'order_status': 'order_status', 'payment_status': 'payment_status'},
#         )
#         return Response({
#             'msg': 'success',
#             'orderList': AllOrderSerializer(page, many=True).data,
#             'orderListCount': count,
#         })


# class OrderDetailAPIView(APIView):
#     def get(self, request, tenant):
#         return Response({
#             'msg': 'success',
#             'orderData': AllOrderSerializer(Order.objects.select_related('customer_id'), many=True).data,
#             'setting': SettingSerializer(Setting.objects.last()).data,
#         })

#     def post(self, request, tenant):
#         from admin_app.plan_catalog import order_write_data
#         payload, denied = order_write_data(request, request.data)
#         if denied is not None:
#             return denied
#         if 'id' in payload:
#             serializer = AllOrderSerializer(Order.objects.get(id=payload['id']), data=payload, partial=True)
#         else:
#             serializer = AllOrderSerializer(data=payload)
#         if not serializer.is_valid():
#             return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
#         order = serializer.save()
#         order = Order.objects.select_related('customer_id').get(id=order.id)
#         return Response({
#             'msg': 'Saved Successfully',
#             'orderData': AllOrderSerializer(order).data,
#             'orderItems': OrderItemSerializer(OrderItem.objects.filter(order_id=order.id), many=True).data,
#         }, status=status.HTTP_201_CREATED)


# ORDER_ITEM_LIST_SORT = {
#     'order_id': 'order_id__order_id',
#     'item_status': 'item_status',
#     'item': 'item',
#     'quantity': 'quantity',
#     'price': 'price',
#     'serving_size': 'serving_size',
#     'date': 'date',
# }


# class GetAllOrderItemAPI(APIView):
#     def get(self, request, tenant):
#         return Response({'msg': 'success', 'orderItemCount': OrderItem.objects.count()})

#     def post(self, request, tenant):
#         order_items = _date_range(OrderItem.objects.select_related('order_id'), request.data)
#         page, count = list_page(
#             order_items,
#             request.data,
#             search_fields=('order_id__order_id', 'item_status', 'item', 'quantity', 'serving_size'),
#             sort_columns=ORDER_ITEM_LIST_SORT,
#             filter_fields={'item_status': 'item_status'},
#         )
#         return Response({
#             'msg': 'success',
#             'orderItemList': OrderItemWithOrderIdSerializer(page, many=True).data,
#             'orderItemListCount': count,
#         })


# class OrderItemDetailAPIView(APIView):
#     def get(self, request, tenant):
#         order_items = OrderItem.objects.select_related('order_id')
#         return Response({'msg': 'success', 'orderItemData': OrderItemWithOrderIdSerializer(order_items, many=True).data})

#     def post(self, request, tenant):
#         if 'id' in request.data:
#             serializer = OrderItemSerializer(OrderItem.objects.get(id=request.data['id']), data=request.data,
#                                              partial=True)
#         else:
#             serializer = OrderItemSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({'msg': 'Saved Successfully'}, status=status.HTTP_201_CREATED)
#         return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# class GetAllOrderItemDetailsAPI(APIView):
#     def get(self, request, tenant):
#         order_items = OrderItem.objects.select_related('order_id')
#         return Response({'msg': 'success', 'orderItemData': OrderItemWithOrderIdSerializer(order_items, many=True).data})


# class UpdateOrderStatus(APIView):
#     def post(self, request, tenant):
#         serializer = OrderSerializer(Order.objects.get(order_id=request.data['order_id']), data=request.data,
#                                      partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({'msg': 'Order Status Updated'})
#         return Response({'msg': 'error'})


# class checkTableNumberApi(APIView):
#     def get(self, request, tenant, table_number):
#         if validateTable(table_number):
#             return Response({'message': 'table number is available'})
#         return Response({'error': 'not available'})




import logging

from django.db import transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from admin_app.authentication import staff_identity_for_tenant
from admin_app.middlewares import bearer_token
from common.listing import date_bounds, list_page

from ..models import CustomerDetail, FcmNotification, Item, Order, OrderItem, Setting
from ..order_access import ensure_order_access
from ..serializers import (
    AllOrderSerializer,
    CustomerDetailSerializer,
    OrderItemSerializer,
    OrderItemWithOrderIdSerializer,
    OrderSerializer,
    SettingSaveSerializer,
    SettingSerializer,
)
from ..services.order_board import basic_board, full_board, restaurant_detail, todays_items
from ..services.order_service import (
    cart_line_price,
    lock_order_numbers,
    orderCreation,
    orderItemsCreation,
    responseDataCreation,
    validateTable,
)
from ..services.otp_service import order_token_is_valid
from ..services.pricing import money

logger = logging.getLogger(__name__)


def _with_value(current, value):
    """Comma separated list of every name / email the customer has ordered with."""
    current = current or ''
    if not value or value in current.split(','):
        return current
    return f'{current},{value}' if current else value


def _remember_customer(data):
    name = data.get('name') or ''
    email = data.get('email') or ''
    customer = CustomerDetail.objects.filter(contact_number=data['contact_number']).first()
    if customer is None:
        serializer = CustomerDetailSerializer(data={
            'last_customer_name': name,
            'name': name,
            'email': email,
            'contact_number': data['contact_number'],
        })
        serializer.is_valid(raise_exception=True)
        return serializer.save()
    customer.name = _with_value(customer.name, name)
    customer.email = _with_value(customer.email, email)
    customer.last_customer_name = name
    customer.last_email = email
    customer.save()
    return customer


def _date_range(queryset, data):
    bounds = date_bounds(data)
    return queryset.filter(date__gte=bounds[0], date__lt=bounds[1]) if bounds else queryset


def _active_total(order_items):
    return money(sum(item.price for item in order_items if item.item_status != 'Cancelled'))


class PostCustomerDetailsAPIView(APIView):
    def post(self, request, tenant):
        staff_ok = staff_identity_for_tenant(bearer_token(request), request.tenant.schema_name) is not None
        if not staff_ok:
            token = request.headers.get('X-Order-Token') or request.data.get('order_token')
            if not order_token_is_valid(token, request.data.get('contact_number'), tenant):
                return Response(
                    {'success': False, 'message': 'Verify OTP before placing the order.', 'msg': ''},
                    status=status.HTTP_403_FORBIDDEN,
                )
        else:
            payload = request.data.copy()
            if payload.get('order_created_by') not in ('Admin', 'Waiter'):
                payload['order_created_by'] = 'Admin'
            request._full_data = payload

        data = request.data
        table_id = data.get('dining_table')
        if table_id not in (None, ''):
            from ..models import DiningTable
            row = DiningTable.objects.select_related('floor').filter(pk=table_id, is_active=True).first()
            if not row or (row.floor_id and not row.floor.is_active):
                return Response({'message': 'Invalid or inactive table QR code.'}, status=400)
            expected = f'{row.floor.name} · {row.name}' if row.floor_id else f'Direct · {row.name}'
            if data.get('table_number') != expected:
                return Response({'message': 'Table location does not match the QR code.'}, status=400)
        if data.get('fcmToken'):
            FcmNotification.objects.filter(registration_id=data['fcmToken']).update(
                phone_number=data['contact_number'])

        if data.get('validate_table') is True and not validateTable(data.get('table_number')):
            return Response({'tabel_error': 'Tabel number is already running'})

        with transaction.atomic():
            lock_order_numbers()
            customer = _remember_customer(data)
            created = orderCreation(tenant, request)
            items = orderItemsCreation(request, created['order_obj'])

        response = responseDataCreation(
            created['orderSerializer'].data,
            items['orderItemSerializer'].data,
            customer,
            SettingSaveSerializer(Setting.objects.last()).data,
        )
        return Response({'msg': 'Saved Successfully', 'data': response}, status=status.HTTP_201_CREATED)


class updateOrdersAPIView(APIView):
    def put(self, request, tenant):
        order = Order.objects.select_related('customer_id').get(order_id=request.data['orders'])
        ensure_order_access(request, tenant, order)
        with transaction.atomic():
            orderItemsCreation(request, order)

        order_items = list(OrderItem.objects.filter(order_id=order).select_related('item_id').order_by('-id'))
        sub_total = sum(
            cart_line_price(line.item_id, line.serving_size, line.quantity) if line.item_id else line.price
            for line in order_items if line.item_status != 'Cancelled'
        )
        serializer = OrderSerializer(order, data={'sub_total': money(sub_total), 'order_status': 'Placed'},
                                     partial=True)
        if serializer.is_valid():
            serializer.save()
        else:
            logger.warning('Order %s update rejected: %s', order.order_id, serializer.errors)
        return Response({
            'orderItemSerializer': OrderItemSerializer(order_items, many=True).data,
            'order': serializer.data,
        })


class getOrdersAPI(APIView):
    def get(self, request, tenant):
        orders = Order.objects.select_related('customer_id').order_by('-date')
        return Response({'msg': 'success', 'allOrders': AllOrderSerializer(orders, many=True).data})


class getOrderItemsAPI(APIView):
    def get(self, request, tenant, pk):
        order = Order.objects.select_related('customer_id').get(id=pk)
        return Response({
            'msg': 'success',
            'orderItems': OrderItemSerializer(OrderItem.objects.filter(order_id=pk).order_by('-id'), many=True).data,
            'customerDetail': CustomerDetailSerializer(order.customer_id).data,
            'orderDetail': AllOrderSerializer(order).data,
            'settingData': SettingSaveSerializer(Setting.objects.last()).data,
        })


class UpdateOrderPaymentStatus(APIView):
    def put(self, request, tenant, orderID):
        from admin_app.plan_catalog import order_write_data
        payload, denied = order_write_data(request, request.data)
        if denied is not None:
            return denied
        if 'payment_status' in payload or 'payment_mode' in payload:
            return Response({'error': 'Use manual payment verification to confirm payment.'}, status=403)
        order = Order.objects.get(order_id=orderID)
        new_status = payload.get('order_status')
        if new_status == 'Confirm':
            OrderItem.objects.filter(order_id=order, item_status='Pending').update(
                item_status='Confirm', kot_print_status=True)
        if new_status == 'Cancelled':
            order.cancelled_by = 'Admin'

        serializer = OrderSerializer(order, payload, partial=True)
        if not serializer.is_valid():
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        try:
            serializer.save()
        except Exception:
            logger.exception('Could not update order %s', orderID)
            return Response({'error': 'error'})
        return Response({
            'success': 'Updated status',
            'order_items': todays_items(),
            **basic_board(),
            'order': serializer.data,
        }, status=status.HTTP_201_CREATED)


class UpdateItemStatus(APIView):
    def put(self, request, tenant, orderID):
        order_pk = Order.objects.values_list('id', flat=True).get(order_id=orderID)
        prices = []
        with transaction.atomic():
            for data in request.data:
                line = OrderItem.objects.get(id=data['id'])
                if data['item_status'] != 'Cancelled':
                    line.quantity = data['quantity']
                    line.price = data['price']
                    line.item_status = data['item_status']
                    line.save()
                    prices.append(line.price)
                    continue
                line.item_status = 'Cancelled'
                line.save()
                if not OrderItem.objects.filter(order_id=order_pk).exclude(item_status='Cancelled').exists():
                    cancelled = OrderSerializer(Order.objects.get(id=order_pk),
                                                data={'cancelled_by': 'Admin', 'order_status': 'Cancelled'},
                                                partial=True)
                    if cancelled.is_valid():
                        cancelled.save()
                else:
                        logger.warning('Order %s cancel rejected: %s', orderID, cancelled.errors)

            order = Order.objects.get(id=order_pk)
            order.sub_total = money(sum(prices))
        order.save()

        order_items = OrderItem.objects.filter(order_id=order_pk).select_related('order_id').order_by('-id')
        return Response({
            'success': 'Updated status',
            'order_items': OrderItemWithOrderIdSerializer(order_items, many=True).data,
            'order': OrderSerializer(Order.objects.select_related('customer_id').get(id=order_pk)).data,
            **basic_board(),
        }, status=status.HTTP_201_CREATED)


class UpdateAllOrderStatus(APIView):
    def post(self, request, tenant):
        from admin_app.plan_catalog import order_write_data
        payload, denied = order_write_data(request, request.data)
        if denied is not None:
            return denied
        changes = {}
        if 'order_status' in payload:
            changes['order_status'] = payload['order_status']
            if 'cancelled_by' in payload:
                changes['cancelled_by'] = payload['cancelled_by']
        with transaction.atomic():
            for data in payload['orders']:
                order = Order.objects.get(order_id=data['order_id'])
                if changes:
                    serializer = OrderSerializer(order, data=changes, partial=True)
                    if serializer.is_valid():
                        order = serializer.save()
                if 'payment_status' in payload:
                    serializer = OrderSerializer(order, data={'payment_status': payload['payment_status']},
                                                 partial=True)
                    serializer.is_valid(raise_exception=True)
                    serializer.save()

        return Response({
            'success': 'Updated status',
            'order_items': todays_items(),
            **full_board(),
        }, status=status.HTTP_201_CREATED)


class CheckOrderConfirmAPIView(APIView):
    def post(self, request, tenant):
        order = Order.objects.select_related('customer_id').get(order_id=request.data['order_id'])
        ensure_order_access(request, tenant, order)
        return Response({'order': OrderSerializer(order).data}, 200)
       

class DeleteOrderItemsAPIView(APIView):
    def put(self, request, tenant):
        line = OrderItem.objects.select_related('order_id__customer_id').get(id=request.data['orderItem'])
        ensure_order_access(request, tenant, line.order_id)
        line.item_status = 'Cancelled'
        line.save()

        order = Order.objects.get(order_id=request.data['order'])
        order_items = list(OrderItem.objects.filter(order_id=order.id).order_by('-id'))
        changes = {'sub_total': _active_total(order_items)}
        if all(item.item_status == 'Cancelled' for item in order_items):
            changes['cancelled_by'] = request.data.get('cancelled_by', 'Admin')
            changes['order_status'] = 'Cancelled'

        serializer = OrderSerializer(order, data=changes, partial=True)
        if serializer.is_valid():
            serializer.save()
        else:
            logger.warning('Order %s update rejected: %s', order.order_id, serializer.errors)
        return Response({'orderItem': OrderItemSerializer(order_items, many=True).data, 'order': serializer.data})


class PostUpdateOrderItemsAPIView(APIView):
    def put(self, request, tenant):
        updated = []
        with transaction.atomic():
            for cart in request.data['orderItems']:
                if cart['item_status'] == 'Cancelled':
                    continue
                line = OrderItem.objects.select_related('order_id__customer_id').get(id=cart['id'])
                ensure_order_access(request, tenant, line.order_id)
                line.quantity = cart['quantity']
                line.price = cart['price']
                line.item_status = cart['item_status']
                line.save()
                updated.append(line)

            order = Order.objects.select_related('customer_id').get(order_id=request.data['orders'])
            order.sub_total = money(sum(line.price for line in updated))
            order.save()
        return Response({
            'orderItem': OrderItemSerializer(updated, many=True).data,
            'order': AllOrderSerializer(order).data,
        })


class GetOrderItemsAndOrderAPIView(APIView):
    def post(self, request, tenant):
        order = Order.objects.select_related('customer_id').get(order_id=request.data['order'])
        ensure_order_access(request, tenant, order)
        return Response({
            'orderItem': OrderItemSerializer(OrderItem.objects.filter(order_id=order.id).order_by('-id'),
                                             many=True).data,
            'order': OrderSerializer(order).data,
        })


class AddOrderItemsAPIView(APIView):
    def post(self, request, tenant):
        data = request.data
        item = Item.objects.get(id=data['item_id'])
        if not item.is_active or not item.kitchen_available:
            return Response({'error': 'This menu item is unavailable.'}, status=409)
        target = Order.objects.select_related('customer_id').get(order_id=data['order_order_id'])
        ensure_order_access(request, tenant, target)
        with transaction.atomic():
            existing = OrderItem.objects.filter(
                order_id__order_id=data['order_order_id'],
                item_id=item.id,
                serving_size=data['serving_size'],
                item_status='Pending',
            ).first()
            if existing is not None:
                quantity = int(data['quantity']) + existing.quantity
                serializer = OrderItemSerializer(existing, data={
                    'quantity': quantity,
                    'price': cart_line_price(item, data['serving_size'], quantity),
                    'item_status': 'Pending',
                }, partial=True)
                if not serializer.is_valid():
                    return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
                serializer.save()
            else:
                OrderItem(
                    order_id=target,
                    item=data['item'],
                    item_id=item,
                    serving_size=data['serving_size'],
                    quantity=data['quantity'],
                    item_status=data['item_status'],
                ).save()

            order_items = list(OrderItem.objects.filter(order_id__order_id=data['order_order_id'])
                               .select_related('order_id').order_by('-id'))
            order = Order.objects.select_related('customer_id').get(order_id=data['order_order_id'])
            order.sub_total = _active_total(order_items)
            order.order_status = 'Placed'
            order.save()

        return Response({
            'msg': 'success',
            'orderItems': OrderItemWithOrderIdSerializer(order_items, many=True).data,
            'order': AllOrderSerializer(order).data,
        })


ORDER_LIST_SORT = {
    'order_id': 'order_id',
    'table_number': 'table_number',
    'order_status': 'order_status',
    'payment_status': 'payment_status',
    'payment_mode': 'payment_mode',
    'date': 'date',
}


class OrderAPI(APIView):
    def get(self, request, tenant):
        order_items = OrderItem.objects.select_related('order_id').order_by('-id')
        return Response({
            'msg': 'success',
            'orderCount': Order.objects.count(),
            'order_item': OrderItemWithOrderIdSerializer(order_items, many=True).data,
            'setting': SettingSaveSerializer(Setting.objects.last()).data,
            'tenant': restaurant_detail(request),
        })

    def post(self, request, tenant):
        orders = _date_range(Order.objects.select_related('customer_id'), request.data)
        page, count = list_page(
            orders,
            request.data,
            search_fields=('table_number', 'order_id', 'order_status', 'payment_status'),
            sort_columns=ORDER_LIST_SORT,
            filter_fields={'order_status': 'order_status', 'payment_status': 'payment_status'},
        )
        return Response({
            'msg': 'success',
            'orderList': AllOrderSerializer(page, many=True).data,
            'orderListCount': count,
        })


class OrderDetailAPIView(APIView):
    def get(self, request, tenant):
        return Response({
            'msg': 'success',
            'orderData': AllOrderSerializer(Order.objects.select_related('customer_id'), many=True).data,
            'setting': SettingSerializer(Setting.objects.last()).data,
        })

    def post(self, request, tenant):
        from admin_app.plan_catalog import order_write_data
        payload, denied = order_write_data(request, request.data)
        if denied is not None:
            return denied
        if 'payment_status' in payload or 'payment_mode' in payload:
            return Response({'error': 'Payment status and method require manual payment verification.'}, status=403)
        if 'id' in payload:
            serializer = AllOrderSerializer(Order.objects.get(id=payload['id']), data=payload, partial=True)
        else:
            serializer = AllOrderSerializer(data=payload)
        if not serializer.is_valid():
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        order = serializer.save()
        order = Order.objects.select_related('customer_id').get(id=order.id)
        return Response({
            'msg': 'Saved Successfully',
            'orderData': AllOrderSerializer(order).data,
            'orderItems': OrderItemSerializer(OrderItem.objects.filter(order_id=order.id), many=True).data,
        }, status=status.HTTP_201_CREATED)


ORDER_ITEM_LIST_SORT = {
    'order_id': 'order_id__order_id',
    'item_status': 'item_status',
    'item': 'item',
    'quantity': 'quantity',
    'price': 'price',
    'serving_size': 'serving_size',
    'date': 'date',
}


class GetAllOrderItemAPI(APIView):
    def get(self, request, tenant):
        return Response({'msg': 'success', 'orderItemCount': OrderItem.objects.count()})

    def post(self, request, tenant):
        order_items = _date_range(OrderItem.objects.select_related('order_id'), request.data)
        page, count = list_page(
            order_items,
            request.data,
            search_fields=('order_id__order_id', 'item_status', 'item', 'quantity', 'serving_size'),
            sort_columns=ORDER_ITEM_LIST_SORT,
            filter_fields={'item_status': 'item_status'},
        )
        return Response({
            'msg': 'success',
            'orderItemList': OrderItemWithOrderIdSerializer(page, many=True).data,
            'orderItemListCount': count,
        })


class OrderItemDetailAPIView(APIView):
    def get(self, request, tenant):
        order_items = OrderItem.objects.select_related('order_id')
        return Response({'msg': 'success', 'orderItemData': OrderItemWithOrderIdSerializer(order_items, many=True).data})

    def post(self, request, tenant):
        if 'id' in request.data:
            serializer = OrderItemSerializer(OrderItem.objects.get(id=request.data['id']), data=request.data,
                                             partial=True)
        else:
            serializer = OrderItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Saved Successfully'}, status=status.HTTP_201_CREATED)
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class GetAllOrderItemDetailsAPI(APIView):
    def get(self, request, tenant):
        order_items = OrderItem.objects.select_related('order_id')
        return Response({'msg': 'success', 'orderItemData': OrderItemWithOrderIdSerializer(order_items, many=True).data})


class UpdateOrderStatus(APIView):
    def post(self, request, tenant):
        serializer = OrderSerializer(Order.objects.get(order_id=request.data['order_id']), data=request.data,
                                     partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Order Status Updated'})
        return Response({'msg': 'error'})


class checkTableNumberApi(APIView):
    def get(self, request, tenant, table_number):
        if validateTable(table_number):
            return Response({'message': 'table number is available'})
        return Response({'error': 'not available'})
