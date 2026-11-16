"""Rules applied whenever an Order or OrderItem is saved or validated.

Ported from the original model save()/clean() hooks with the same results.
They live here so each rule is stated once and can be tested on its own.
"""

import math

from django.apps import apps
from django.core.exceptions import ValidationError
from django.utils import timezone

from .pricing import line_price, money, offer_discount_for_item, unit_price

RUPEES = 'Discount in (₹)'
PERCENT = 'Discount in (%)'
LOYALTY_USED = 'is used'


def _model(name):
    return apps.get_model('tenant_app', name)


# --- validation (admin forms call Model.clean) ---------------------------------

def validate_order(order):
    if order.order_status == 'Cancelled' and order.payment_status in ('Completed', 'Paid'):
        raise ValidationError({'payment_status': 'Order is cancelled'})
    if order.order_status == 'Cancelled' and not order.cancel_reason:
        raise ValidationError({'cancel_reason': 'Please give the cancel reason'})
    if order.payment_status == 'Paid' and order.discount_rupees and order.discount_rupees > 0:
        raise ValidationError({'discount_rupees': 'Payment is completed you can not add the discount'})
    if order.apply_loyality_point:
        if order.payment_status == 'Completed':
            raise ValidationError(
                {'apply_loyality_point': 'Payment status is completed you can not add the loyality point'})
        if order.order_status == 'Cancelled':
            raise ValidationError(
                {'apply_loyality_point': 'Order status is cancelled you can not add the loyality point'})
        if int(order.customer_id.loyality_points or 0) < int(order.apply_loyality_point):
            raise ValidationError({'apply_loyality_point': 'Please enter below the customer loyality point.'})


def validate_order_item(item):
    if item.item_status == 'Cancelled' and item.cancel_reason is None:
        raise ValidationError({'cancel_reason': 'Please give the cancel reason'})


# --- order save ------------------------------------------------------------------

def before_order_save(order):
    """Everything the original Order.save did before writing the row."""
    order.discount_reason = order.discount_reason or ''
    order.cancel_reason = order.cancel_reason or ''

    order.send_notification_on_tableNum_update = order.has_changed('table_number')
    order.send_notifications_on_order_update = order.has_changed('order_status')
    order.send_notifications_on_payment_update = order.has_changed('payment_status')

    _apply_status_side_effects(order)
    setting = _model('Setting').objects.first()
    _apply_loyalty(order, setting)

    if order.pk is None:
        # New orders are priced without discounts (the discount fields are still normalised);
        # discounts take effect from the next save.
        try:
            _discounted_totals(order, setting)
        except (TypeError, AttributeError, ZeroDivisionError):
            pass
        _plain_totals(order, setting)
    else:
        try:
            _discounted_totals(order, setting)
        except (TypeError, AttributeError, ZeroDivisionError):
            _plain_totals(order, setting)
    _settle_loyalty(order, setting)
    order.send_notifications_on_amount_update = order.initial('final_amount') != order.final_amount


def _apply_status_side_effects(order):
    OrderItem = _model('OrderItem')
    if order.pk is not None and order.order_status == 'Confirm':
        OrderItem.objects.filter(order_id=order.pk, item_status='Pending').update(
            item_status='Confirm', kot_print_status=True)
    if order.payment_status == 'Completed' and order.payment_confirmation_date_time is None:
        order.payment_confirmation_date_time = timezone.localtime().strftime('%d/%m/%Y %H:%M:%S')
    if order.pk is not None and order.order_status == 'Cancelled':
        OrderItem.objects.filter(order_id=order.pk).update(item_status='Cancelled')


def _apply_loyalty(order, setting):
    """Preview redemption; settle balance once when payment completes."""
    applied = int(order.apply_loyality_point or 0)
    enabled = bool(setting and setting.allow_loyality_points)
    if order.payment_status not in ('Paid', 'Completed'):
        order.loyality_point_price = round(float(setting.per_loyality_point_value or 0) * applied, 2) if enabled else 0
        order.loyality_point_status = LOYALTY_USED if enabled and applied else 'not used'
        return
    if order.loyality_point_calculated:
        return
    if not enabled:
        return
    # The caller must save the order and this customer update in one DB transaction.
    CustomerDetail = _model('CustomerDetail')
    customer = CustomerDetail.objects.select_for_update().get(pk=order.customer_id_id)
    balance = int(customer.loyality_points or 0)
    if applied > balance:
        raise ValidationError({'apply_loyality_point': 'Not enough loyalty points for this payment.'})
    order.loyality_point_price = round(float(setting.per_loyality_point_value or 0) * applied, 2)
    order.loyality_point_status = LOYALTY_USED if applied else 'not used'
    # Totals are recalculated after this hook; compute payable from existing
    # order amount only after the price calculation in before_order_save.


def _settle_loyalty(order, setting):
    if not setting or not setting.allow_loyality_points or order.loyality_point_calculated:
        return
    if order.payment_status not in ('Completed', 'Paid'):
        return
    CustomerDetail = _model('CustomerDetail')
    customer = CustomerDetail.objects.select_for_update().get(pk=order.customer_id_id)
    balance = int(customer.loyality_points or 0)
    used = int(order.apply_loyality_point or 0)
    if used > balance:
        raise ValidationError({'apply_loyality_point': 'Insufficient loyalty balance.'})
    per_point = int(setting.amount_for_single_loyality_point or 0)
    earned = math.floor(max(0, float(order.final_amount or 0)) / per_point) if per_point > 0 else 0
    customer.loyality_points = balance - used + earned
    customer.save(update_fields=['loyality_points'])
    order.loyality_point_calculated = True


def _tax_rates(setting):
    return (setting.cgst or 0), (setting.sgst or 0)


def _set_totals(order, taxable, setting):
    cgst_rate, sgst_rate = _tax_rates(setting)
    cgst = taxable * cgst_rate / 100
    sgst = taxable * sgst_rate / 100
    order.cgst = money(cgst)
    order.sgst = money(sgst)
    order.total = money(taxable)
    order.final_amount = money(taxable + cgst + sgst)


def _plain_totals(order, setting):
    if setting is not None:
        _set_totals(order, order.sub_total, setting)


def _discounted_totals(order, setting):
    sub_total = order.sub_total
    if order.discount_rupees > 0:
        if setting.discount_in == RUPEES:
            order.discount_percentage = money(order.discount_rupees / sub_total * 100)
        else:
            order.discount_rupees = money(sub_total / 100 * order.discount_percentage)
        taxable = float('{:.2f}'.format(sub_total - order.discount_rupees - order.loyality_point_price))
        _set_totals(order, taxable, setting)
    elif order.discount_percentage > 0:
        if setting.discount_in == PERCENT:
            order.discount_rupees = sub_total / 100 * order.discount_percentage
            taxable = float('{:.2f}'.format(sub_total - order.discount_rupees - order.loyality_point_price))
            _set_totals(order, taxable, setting)
    elif setting is not None:
        _set_totals(order, sub_total, setting)
        if order.loyality_point_status == LOYALTY_USED:
            order.total = max(0, sub_total - order.loyality_point_price)
            cgst_rate, sgst_rate = _tax_rates(setting)
            cgst = order.total * cgst_rate / 100
            sgst = order.total * sgst_rate / 100
            order.cgst = money(cgst)
            order.sgst = money(sgst)
            order.final_amount = money(order.total + cgst + sgst)


# --- order item save ---------------------------------------------------------------

def before_order_item_save(item):
    OrderItem = _model('OrderItem')
    previous = None
    if item.pk is not None:
        previous = OrderItem.objects.filter(pk=item.pk).values('item_status', 'price').first()

    if item.item_status == 'Confirm' and not item.kot_print_status:
        item.kot_print_status = True
        pending = OrderItem.objects.filter(order_id=item.order_id_id, item_status='Pending').count()
        if pending == 1:
            # Confirming the last pending item confirms the order.
            order = _model('Order').objects.get(pk=item.order_id_id)
            order.order_status = 'Confirm'
            order.save()

    if item.item_id_id is not None:
        item.price = line_price(
            unit_price(item.item_id, item.serving_size),
            item.quantity,
            offer_discount_for_item(item.item_id_id),
        )

    item.send_notifications_on_item_update = bool(
        previous and (previous['item_status'] != item.item_status or previous['price'] != item.price)
    )
