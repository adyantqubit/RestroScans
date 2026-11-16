"""Today's orders grouped the way the admin panel dashboard and KOT screens show them."""

import datetime

from django.db.models import Count, Q, Sum
from django.utils import timezone

from ..models import Order, OrderItem
from ..serializers import OrderItemWithOrderIdSerializer, OrderSerializer


def start_of(day):
    return timezone.make_aware(datetime.datetime.combine(day, datetime.time.min))


def period_starts(today=None):
    today = today or timezone.localdate()
    return {
        'today': start_of(today),
        'week': start_of(today - datetime.timedelta(days=today.weekday())),
        'month': start_of(today.replace(day=1)),
        'year': start_of(today.replace(month=1, day=1)),
    }


def todays_orders():
    return Order.objects.filter(date__gte=period_starts()['today'])


def todays_items(newest_first=False):
    items = OrderItem.objects.filter(date__gte=period_starts()['today']).select_related('order_id')
    if newest_first:
        items = items.order_by('-id')
    return OrderItemWithOrderIdSerializer(items, many=True).data


def _serialized_today():
    """Today's orders, newest first, as (order, serialized order) pairs. Each order is serialized once."""
    orders = list(todays_orders().select_related('customer_id').order_by('-id'))
    return list(zip(orders, OrderSerializer(orders, many=True).data))


def _column(pairs, keep):
    return [data for order, data in pairs if keep(order)]


def basic_board():
    """Placed / in progress (any non-placed order not yet completed) / completed."""
    pairs = _serialized_today()
    return {
        'todays_newly_placed_orders': _column(pairs, lambda o: o.order_status == 'Placed'),
        'todays_pending_orders': _column(
            pairs, lambda o: o.order_status != 'Placed' and o.payment_status in ('Pending', 'Paid')),
        'todays_completed_orders': _column(pairs, lambda o: o.payment_status == 'Completed'),
    }


def full_board():
    """The dashboard columns: placed, confirmed, served, paid, cancelled, completed."""
    pairs = _serialized_today()
    return {
        'todays_newly_placed_orders': _column(pairs, lambda o: o.order_status == 'Placed'),
        'todays_pending_orders': _column(
            pairs, lambda o: o.order_status == 'Confirm' and o.payment_status == 'Pending'),
        'todays_served_orders': _column(
            pairs, lambda o: o.order_status == 'Served' and o.payment_status == 'Pending'),
        'todays_cancelled_orders': _column(
            pairs, lambda o: o.order_status == 'Cancelled' and o.payment_status != 'Completed'),
        'todays_paid_orders': _column(
            pairs, lambda o: o.payment_status == 'Paid' and o.order_status != 'Cancelled'),
        'todays_completed_orders': _column(pairs, lambda o: o.payment_status == 'Completed'),
    }

def revenue_summary(count_completed_only=False):
    """Order count and completed revenue for today / this week / this month / this year, in one query."""
    starts = period_starts()
    completed = Q(payment_status='Completed')
    aggregates = {}
    for name, start in starts.items():
        in_period = Q(date__gte=start)
        aggregates[f'{name}_count'] = Count('id', filter=in_period & completed if count_completed_only else in_period)
        aggregates[f'{name}_revenue'] = Sum('final_amount', filter=in_period & completed)
    totals = Order.objects.aggregate(**aggregates)
    labels = {'today': 'todays_summary', 'week': 'this_weeks_summary',
              'month': 'this_months_summary', 'year': 'this_years_summary'}
    return {
        labels[name]: {'order_count': totals[f'{name}_count'], 'total_revenue': totals[f'{name}_revenue']}
        for name in starts
    }


def restaurant_detail(request):
    restaurant = request.tenant.restaurant_name
    return {
        'name': restaurant.restaurant_name if restaurant else '',
        'address': restaurant.address if restaurant else '',
    }
