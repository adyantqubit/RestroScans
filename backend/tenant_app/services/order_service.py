"""Order creation from the customer / staff cart."""

import zlib

from django.db import connection
from rest_framework.exceptions import ValidationError

from ..models import CustomerDetail, Item, Order, OrderItem, Waiter
from ..serializers import CustomerDetailSerializer, OrderItemSerializer, OrderSerializer
from .pricing import line_price, money, offer_discount_for_item, unit_price

FIRST_ORDER_NUMBER = 100001
SERVE_SIZES = {'Half Plate': 'Half', 'Full Plate': 'Full'}


def lock_order_numbers():
    """Serialise order-number generation for this restaurant until the transaction ends."""
    key = zlib.crc32(f'order-number:{connection.schema_name}'.encode('utf-8'))
    with connection.cursor() as cursor:
        cursor.execute('SELECT pg_advisory_xact_lock(%s)', [key])


def orderNoGeneration(tenant):
    prefix = tenant[:3]
    last = Order.objects.order_by('-id').values_list('order_id', flat=True).first()
    if last is None:
        return prefix + str(FIRST_ORDER_NUMBER)
    return prefix + str(int(last[3:9]) + 1)


def _cart_items(cart_lines):
    """Catalogue items for the cart, keyed by the id exactly as the client sent it."""
    found = {str(pk): item for pk, item in Item.objects.in_bulk([line['id'] for line in cart_lines]).items()}
    missing = [line['id'] for line in cart_lines if str(line['id']) not in found]
    if missing:
        raise Item.DoesNotExist(f'Items not found: {missing}')
    if any(not found[str(line['id'])].kitchen_available for line in cart_lines):
        raise ValidationError('One or more menu items are currently unavailable.')
    return {line['id']: found[str(line['id'])] for line in cart_lines}


def _serving_size(cart):
    return SERVE_SIZES.get(cart.get('serve_size'), 'Full')


def cart_line_price(item, serving_size, quantity):
    return line_price(unit_price(item, serving_size), quantity, offer_discount_for_item(item.id))


def orderCreation(tenant, request):
    data = request.data
    items = _cart_items(data['cart'])
    sub_total = sum(
        cart_line_price(items[cart['id']], _serving_size(cart), cart['quantity']) for cart in data['cart']
    )
    order_data = {
        'order_id': orderNoGeneration(tenant),
        'customer_id': CustomerDetail.objects.get(contact_number=data['contact_number']).id,
        'table_number': data['table_number'],
        'dining_table': data.get('dining_table') or None,
        'sub_total': money(sub_total),
        'order_status': 'Placed',
        'payment_mode': 'Cash',
        'customer_name': data['name'],
        'customer_email': data['email'],
        'order_created_by': data['order_created_by'],
    }
    waiter_number = data.get('waiter_contact_number') or ''
    if waiter_number:
        waiter = Waiter.objects.filter(contact_number=waiter_number).first()
        if waiter is not None:
            order_data['waiter_contact_number'] = waiter_number
            order_data['waiter_name'] = waiter.name

    serializer = OrderSerializer(data=order_data)
    serializer.is_valid(raise_exception=True)
    return {'order_obj': serializer.save(), 'orderSerializer': serializer}


def _new_item_row(order, item, cart, serving_size):
    return {
        'item_id': item.id,
        'order_id': order.id,
        'item': cart['name'],
        'serving_size': serving_size,
        'quantity': cart['quantity'],
        'price': cart_line_price(item, serving_size, cart['quantity']),
        'item_status': 'Pending',
    }


def orderItemsCreation(request, order_obj):
    """Add the cart to an order.

    When the request names an existing order (``orders``), a cart line for an item and size that is
    still Pending on that order increases its quantity instead of adding a new row.
    """
    data = request.data
    items = _cart_items(data['cart'])
    merge = 'orders' in data
    pending = OrderItem.objects.filter(order_id__order_id=data['orders'], item_status='Pending') if merge else None

    new_rows = []
    updated = []
    for cart in data['cart']:
        item = items[cart['id']]
        serving_size = _serving_size(cart)
        existing = pending.filter(item_id=item.id, serving_size=serving_size).first() if merge else None
        if existing is None:
            new_rows.append(_new_item_row(order_obj, item, cart, serving_size))
            continue
        quantity = cart['quantity'] + existing.quantity
        serializer = OrderItemSerializer(existing, data={
            **cart,
            'serving_size': serving_size,
            'quantity': quantity,
            'price': cart_line_price(item, serving_size, quantity),
        }, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        updated.append(serializer)

    created = OrderItemSerializer(data=new_rows, many=True)
    created.is_valid(raise_exception=True)
    created.save()
    if merge:
        return {'orderItemSerializer': updated + [created]}
    return {'orderItemSerializer': created}


def validateTable(table_number):
    """A table is free when it has no open (not cancelled, not completed) order today."""
    from django.utils import timezone

    today = timezone.localdate()
    return not Order.objects.filter(
        date__date__gte=today,
        payment_status__in=('Pending', 'Paid'),
        table_number=table_number,
    ).exclude(order_status='Cancelled').exists()


def responseDataCreation(order, orderItems, cutomer, setting):
    return {
        'customer': CustomerDetailSerializer(cutomer).data,
        'order_details': order,
        'order_items': orderItems,
        'setting_data': setting,
    }
