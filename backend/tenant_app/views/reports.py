from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Avg, Count, FloatField, Q, Sum, Value
from django.db.models.functions import Coalesce, Lower
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView

from backend.config import rupee_sign
from common.listing import date_bounds, list_page, paginate, search, sort
from common.printable import RECEIPT_PAGE, printable_response

from ..models import Category, CustomerDetail, Item, Menu, Order, OrderItem, Setting
from ..serializers import CustomerDetailSerializer, OrderSerializer, SettingSaveSerializer
from ..services.order_board import full_board, period_starts, restaurant_detail, revenue_summary, todays_items

REPORT_PERIODS = {
    'today': ('today', "Today's"),
    'this_week': ('week', "This Week's"),
    'this_month': ('month', "This Month's"),
    'this_year': ('year', "This Year's"),
}


class DashboardAPI(APIView):
    def get(self, request, tenant):
        return Response({
            **full_board(),
            'revenue_details': revenue_summary(),
            'order_item': todays_items(newest_first=True),
            'setting': SettingSaveSerializer(Setting.objects.last()).data,
            'tenant': restaurant_detail(request),
        })


def _receipt_context(request, pk):
    order = Order.objects.select_related('customer_id').get(id=pk)
    order_items = list(OrderItem.objects.filter(order_id=order).order_by('id'))
    return {
        'restaurant_settings': Setting.objects.all().values(),
        'restaurant_details': {**restaurant_detail(request), 'rupee_symbol': rupee_sign},
        'customer': CustomerDetailSerializer(order.customer_id).data,
        'order': order,
        'order_items': order_items,
        'sub_total': sum(item.price for item in order_items),
        'total_amount': order.total,
        'rate': [int(item.price / item.quantity) if item.quantity else 0 for item in order_items],
    }


@staff_member_required
def generate_pdf_view(request, pk):
    context = _receipt_context(request, pk)
    return printable_response(request, 'admin/receipt.html', context, RECEIPT_PAGE)


@staff_member_required
def generate_pdf_kot_view(request, pk):
    context = _receipt_context(request, pk)
    return printable_response(request, 'admin/order.html', context, RECEIPT_PAGE)


def _report_period(report_period):
    key, label = REPORT_PERIODS.get(report_period, REPORT_PERIODS['today'])
    return period_starts()[key], label


@staff_member_required
def order_report(request, report_period):
    start, label = _report_period(report_period)
    orders = Order.objects.filter(date__gte=start, payment_status='Completed').order_by('date')
    totals = orders.aggregate(count=Count('id'), revenue=Sum('final_amount'))
    return printable_response(request, 'admin/order_report.html', {
        'restaurant_details': {**restaurant_detail(request), 'rupee_symbol': rupee_sign},
        'report_title': f'{label} Order Report',
        'date': timezone.localdate(),
        'total_orders': totals['count'],
                                   'orders': orders,
        'total_revenue': totals['revenue'],
    })


@staff_member_required
def item_report(request, report_period):
    start, label = _report_period(report_period)
    confirmed = OrderItem.objects.filter(date__gte=start, item_status='Confirm')

    def by_item(serving_size):
        return (confirmed.filter(serving_size=serving_size).values('item').order_by('item')
                .annotate(count=Sum('quantity'), sum=Sum('price')))

    return printable_response(request, 'admin/item_report.html', {
        'restaurant_details': {**restaurant_detail(request), 'rupee_symbol': rupee_sign},
        'report_title': f'{label} Item Report',
        'date': timezone.localdate(),
        'order_items_half': by_item('Half'),
        'order_items_full': by_item('Full'),
    })


class RevenueOrderReport(APIView):
    def get(self, request, tenant):
            return Response({
            'revenue_details': revenue_summary(count_completed_only=True),
            'date': timezone.localdate(),
            })


class GetTotalRevenueDetails(APIView):
    def get(self, request, tenant):
        return Response({
            'revenue_details': {
                'totalCategories': Menu.objects.count(),
                'totalSubCategories': Category.objects.count(),
                'totalItems': Item.objects.count(),
            },
        })


def _date_filtered(queryset, data):
    """Apply the report screens' quick period selection or custom ``startDate``/``endDate`` range."""
    bounds = date_bounds(data)
    if bounds:
        return queryset.filter(date__gte=bounds[0], date__lt=bounds[1])
    quick = data.get('quickSelect') or {}
    if not isinstance(quick, dict):
        quick = {str(quick): True}
    starts = period_starts()
    for key in ('today', 'week', 'month', 'year'):
        if quick.get(key):
            return queryset.filter(date__gte=starts[key])
    return queryset


ORDER_REPORT_SORT = {
    'order_id': 'order_id',
    'table_number': 'table_number',
    'date': 'date',
    'subtotal': 'sub_total',
    'discount': 'discount_rupees',
    'loyalty': 'loyality_point_price',
    'total': 'total',
    'cgst': 'cgst',
    'sgst': 'sgst',
    'final_amount': 'final_amount',
}
ORDER_STATUS_FILTERS = {
    'placed': 'Placed', 'confirm': 'Confirm', 'cooked': 'Cooked', 'served': 'Served', 'cancelled': 'Cancelled',
}


class OrderFilterAPIView(APIView):
    def post(self, request, tenant):
        data = request.data
        orders = _date_filtered(Order.objects.select_related('customer_id'), data)

        payment = data.get('paymentStatus') or {}
        if payment.get('completed') and not payment.get('pending'):
            orders = orders.filter(payment_status='Completed')
        elif payment.get('pending') and not payment.get('completed'):
            orders = orders.filter(payment_status='Pending')

        selected = [status for key, status in ORDER_STATUS_FILTERS.items() if (data.get('orderStatus') or {}).get(key)]
        if selected:
            orders = orders.filter(order_status__in=selected)

        orders = sort(orders, data.get('columnToSort'), data.get('columnSortingOrder'), ORDER_REPORT_SORT, 'id')
        page, count = paginate(orders, data)
        return Response({
            'msg': 'success',
            'orderList': OrderSerializer(page, many=True).data,
            'orderListCount': count,
            'allReportList': OrderSerializer(orders, many=True).data,
        })


ITEM_REPORT_SORT = {
    'itemName': 'item',
    'orderCount': 'item_count',
    'rating': 'average_rating',
    'cancellation': 'cancellation_count',
    'totalAmount': 'sum_price',
    'completion': 'completion_count',
}


class OrderItemFilterAPIView(APIView):
    def post(self, request, tenant):
        data = request.data
        cancelled = Q(item_status='Cancelled')
        rows = (
            _date_filtered(OrderItem.objects.filter(serving_size__in=('Half', 'Full')), data)
            .values('item', 'serving_size')
            .annotate(
                item_count=Sum('quantity') - Count('item_status', filter=cancelled),
                cancellation_count=Count('item_status', filter=cancelled),
                sum_price=Sum('price', filter=~cancelled),
                average_rating=Avg('rating'),
                completion_count=Count('order_id__payment_status', filter=Q(order_id__payment_status='Completed')),
            )
        )
        rows = search(rows, data.get('searchText'), ('item',))
        rows = sort(rows, data.get('columnToSort'), data.get('columnSortingOrder'), ITEM_REPORT_SORT, 'item')
        page, count = paginate(rows, data)
        return Response({'item': list(page), 'orderItemCount': count})


CUSTOMER_REPORT_SORT = {
    'last_customer_name': 'name_key',
    'contact_number': 'contact_number',
    'email': 'email_key',
    'totalAmount': 'totalAmount',
    'numberOfOrders': 'numberOfOrders',
    'pendingOrders': 'pendingOrders',
    'cancelledOrder': 'cancelledOrder',
    'completedOrder': 'completedOrder',
    'loyality_points': 'loyality_points',
}
CUSTOMER_REPORT_FIELDS = (
    'last_customer_name', 'contact_number', 'email', 'numberOfOrders', 'cancelledOrder',
    'completedOrder', 'loyality_points', 'totalAmount', 'pendingOrders',
)


class CustomerReportAPI(APIView):
    def post(self, request, tenant):
        completed = Q(order__payment_status='Completed')
        cancelled = Q(order__order_status='Cancelled')
        customers = CustomerDetail.objects.annotate(
            display_email=Coalesce('last_email', 'email'),
            name_key=Lower(Coalesce('last_customer_name', Value(''))),
            email_key=Lower(Coalesce('last_email', 'email', Value(''))),
            numberOfOrders=Count('order'),
            cancelledOrder=Count('order', filter=cancelled),
            completedOrder=Count('order', filter=completed),
            pendingOrders=Count('order', filter=~completed & ~cancelled),
            totalAmount=Coalesce(Sum('order__final_amount', filter=completed), Value(0.0), output_field=FloatField()),
        )
        customers, count = list_page(
            customers,
            request.data,
            search_fields=('last_customer_name', 'last_email', 'contact_number'),
            sort_columns=CUSTOMER_REPORT_SORT,
            default_order='id',
        )
        rows = [
            {field: getattr(customer, 'display_email' if field == 'email' else field) for field in CUSTOMER_REPORT_FIELDS}
            for customer in customers
        ]
        return Response({
            'customerList': rows,
            'customerListCount': count,
        }, 200)
