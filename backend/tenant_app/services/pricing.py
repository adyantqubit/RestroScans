"""Item price helpers shared by order creation and order item updates."""

from django.apps import apps
from django.core.exceptions import ValidationError


def money(value):
    """Round to 2 decimals exactly like the original "{:.2f}" based calculations."""
    return round(float('{:.2f}'.format(value)), 2)


def parse_discount(raw):
    """Offer.discount is free text (e.g. "10"); anything unparsable counts as no discount."""
    if raw in (None, ''):
        return 0.0
    try:
        return float(raw)
    except (TypeError, ValueError):
        return 0.0


def offer_discount_for_item(item_id):
    OfferItem = apps.get_model('tenant_app', 'OfferItem')
    raw = OfferItem.objects.filter(
        item_name_id=item_id,
        offer_name__is_active=True,
    ).values_list('offer_name__discount', flat=True).first()
    return parse_discount(raw)


def unit_price(item, serving_size):
    price = item.price_half if serving_size == 'Half' else item.price_full
    if price is None:
        raise ValidationError({'serving_size': f'{item.name} has no {serving_size.lower()} price.'})
    return float(price)


def line_price(unit, quantity, discount):
    gross = float(unit) * float(quantity)
    return gross - float(gross / 100) * float(discount)
