"""Order events for open pages and existing Firebase push.

WebSocket delivery uses Django Channels when it is installed. The HTTP
order-events feed works on the current WSGI server, so a restaurant still
sees new orders when Redis is not running.
"""

import logging

from asgiref.sync import async_to_sync
from django.db import connection

from common.request_context import get_actor

logger = logging.getLogger('custom_logger')


def record_order_change(order, created):
    previous = getattr(order, '_previous_state', None) or {}
    event_type = _event_type(order, previous, created)
    if not event_type:
        return None
    if event_type == 'OrderModified' and _recent_modification(order):
        return None

    summary = _summary(order, previous, event_type)
    event = _save_event(order, event_type, summary)
    _publish(order, event_type, summary, event)
    return event


def record_items_changed(order):
    """An item was added, changed, or removed. Skipped when the order row just recorded the same change."""
    if order is None or _recent_modification(order):
        return None
    summary = f'Order {order.order_id} items updated'
    event = _save_event(order, 'OrderModified', summary)
    _publish(order, 'OrderModified', summary, event)
    return event


def _recent_modification(order):
    from datetime import timedelta

    from django.utils import timezone

    from ..models import OrderEvent

    return OrderEvent.objects.filter(
        order_id=order.pk,
        event_type='OrderModified',
        created_at__gte=timezone.now() - timedelta(seconds=2),
    ).exists()


def _event_type(order, previous, created):
    if created or not previous:
        return 'OrderCreated' if created else None
    if previous.get('order_status') != order.order_status:
        if order.order_status == 'Cancelled':
            return 'OrderCancelled'
        if order.order_status == 'Confirm':
            return 'OrderConfirmed'
        return 'OrderStatusChanged'
    if previous.get('payment_status') != order.payment_status:
        return 'OrderStatusChanged'
    if previous.get('total') != order.total or previous.get('table_number') != order.table_number:
        return 'OrderModified'
    return None


def _summary(order, previous, event_type):
    if event_type == 'OrderCreated':
        return f'Order {order.order_id} placed for table {order.table_number}'
    if previous.get('order_status') != order.order_status:
        return f'Order {order.order_id} status {previous.get("order_status")} -> {order.order_status}'
    if previous.get('payment_status') != order.payment_status:
        return f'Order {order.order_id} payment {previous.get("payment_status")} -> {order.payment_status}'
    if previous.get('table_number') != order.table_number:
        return f'Order {order.order_id} table {previous.get("table_number")} -> {order.table_number}'
    return f'Order {order.order_id} updated'


def _save_event(order, event_type, summary):
    try:
        from ..models import OrderEvent
        return OrderEvent.objects.create(
            order=order,
            event_type=event_type,
            order_status=order.order_status or '',
            payment_status=order.payment_status or '',
            actor=get_actor(),
            summary=summary[:255],
        )
    except Exception:
        logger.exception('order event was not stored')
        return None


def _publish(order, event_type, summary, event):
    payload = {
        'event_type': event_type,
        'order_id': order.order_id,
        'order_status': order.order_status,
        'payment_status': order.payment_status,
        'summary': summary,
        'actor': get_actor(),
        'event_id': getattr(event, 'id', None),
    }
    schema = getattr(connection, 'schema_name', None)
    if not schema or schema == 'public':
        return
    try:
        from channels.layers import get_channel_layer
        layer = get_channel_layer()
        if layer is None:
            return
        async_to_sync(layer.group_send)(
            f'orders_{schema}',
            {'type': 'order.event', 'order_id': order.order_id, 'payload': payload},
        )
    except Exception:
        logger.info('websocket publish skipped schema=%s', schema)
