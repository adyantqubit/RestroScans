"""Push notifications and order events after orders and order items change.

The ``send_notifications_*`` flags are set by the order rules in
``services/order_rules.py`` while saving.
"""

import logging

from django.core import serializers
from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver
from firebase_admin.messaging import Message, Notification

from .models import FcmNotification, Order, OrderItem, Menu, Category, Item, Offer

logger = logging.getLogger('custom_logger')


@receiver(pre_save, sender=Order)
def remember_order_state(sender, instance, **kwargs):
    if not instance.pk:
        instance._previous_state = None
        return
    previous = Order.objects.filter(pk=instance.pk).values(
        'order_status', 'payment_status', 'total', 'table_number').first()
    instance._previous_state = previous


def _push_order_update(order):
    devices = FcmNotification.objects.filter(phone_number=order.customer_id.contact_number)
    if not devices.exists():
        return
    items = OrderItem.objects.filter(order_id=order.pk).order_by('-id')
    devices.send_message(Message(
        notification=Notification(title='Restroscans.com', body='Order Status'),
        data={'order': serializers.serialize('json', [order]), 'orderItem': serializers.serialize('json', items)},
    ))


def _order_needs_push(order):
    return (
        (order.send_notifications_on_order_update and order.order_status in ('Confirm', 'Served'))
        or (order.send_notifications_on_payment_update and order.payment_status == 'Completed')
        or order.send_notifications_on_amount_update
        or order.send_notification_on_tableNum_update
        or order.order_status == 'Cancelled'
    )


@receiver(post_save, sender=Order)
def on_order_saved(sender, instance, created, **kwargs):
    try:
        from .services.notification_service import record_order_change
        record_order_change(instance, created)
    except Exception:
        logger.exception('order event recording failed')
    if created or not _order_needs_push(instance):
        return
    try:
        _push_order_update(instance)
    except Exception:
        logger.exception('order push notification failed for order %s', instance.pk)


def _note_items(instance):
    try:
        from .services.notification_service import record_items_changed
        record_items_changed(Order.objects.get(pk=instance.order_id_id))
    except Exception:
        logger.exception('order item event failed for item %s', getattr(instance, 'pk', None))


@receiver(post_save, sender=OrderItem)
def on_order_item_saved(sender, instance, created, **kwargs):
    _note_items(instance)
    if created or not instance.send_notifications_on_item_update:
        return
    if instance.item_status not in ('Confirm', 'Cancelled', 'Pending'):
        return
    try:
        _push_order_update(Order.objects.select_related('customer_id').get(pk=instance.order_id_id))
    except Exception:
        logger.exception('order item push notification failed for item %s', instance.pk)


@receiver(post_delete, sender=OrderItem)
def on_order_item_deleted(sender, instance, **kwargs):
    _note_items(instance)


@receiver(pre_save, sender=Menu)
@receiver(pre_save, sender=Category)
@receiver(pre_save, sender=Item)
@receiver(pre_save, sender=Offer)
def compress_catalog_image(sender, instance, **kwargs):
    """Compress only newly uploaded images; never re-encode existing saved files."""
    from .services.image_compression import optimize_image
    field_name = "offer_image" if sender.__name__ == "Offer" else "icon"
    field = getattr(instance, field_name, None)
    if not field or getattr(field, "_committed", True):
        return
    category = sender.__name__.lower()
    optimized = optimize_image(field, category)
    setattr(instance, field_name, optimized)
