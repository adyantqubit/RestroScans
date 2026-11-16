from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from common.listing import list_page
from ..models import Order, OrderItem, Reservation, Setting
from ..order_access import ensure_order_access
from ..serializers import OrderItemSerializer, OrderSerializer, ReservationSerializer, SettingSaveSerializer
from ..services.reservation_service import notify_if_confirmed

RESERVATION_SORT_COLUMNS = {
    'id': 'id',
    'name': 'name',
    'contact_number': 'contact_number',
    'table_number': 'table_number',
    'reservation_status': 'reservation_status',
    'date': 'date',
    'time': 'time',
    'number_of_person': 'number_of_person',
}


class PostReservationAPIView(APIView):
    """Customer site: request a table. New requests always start as Pending."""

    def post(self, request, tenant, *args, **kwargs):
        data = request.data.copy()
        data['reservation_status'] = 'Pending'
        data.pop('table_number', None)
        serializer = ReservationSerializer(data=data)
        if not serializer.is_valid():
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response({'msg': 'success', 'reservation': serializer.data}, status=status.HTTP_201_CREATED)


class GetReservationsAPIView(APIView):
    """Admin panel reservation list."""

    def get(self, request, tenant):
        reservations = Reservation.objects.all().order_by('-id')
        return Response({'msg': 'success', 'reservationList': ReservationSerializer(reservations, many=True).data})

    def post(self, request, tenant):
        payload = request.data.copy()
        when = payload.pop('when', None)
        today = timezone.localdate()
        bookings = Reservation.objects.all()
        if when == 'today':
            bookings = bookings.filter(date=today)
        elif when == 'upcoming':
            bookings = bookings.filter(date__gte=today)
        rows, count = list_page(
            bookings,
            payload,
            search_fields=('name', 'table_number', 'contact_number'),
            sort_columns=RESERVATION_SORT_COLUMNS,
            default_order='time' if when == 'today' else 'date',
            filter_fields={'reservation_status': 'reservation_status'},
        )
        return Response({
            'msg': 'success',
            'reservation': ReservationSerializer(rows, many=True).data,
            'reservationListCount': count,
        })


class GetBillingDataAPIView(APIView):
    def post(self, request, tenant):
        order = (Order.objects.select_related('customer_id')
                 .filter(customer_id__contact_number=request.data['contact_number']).latest('date'))
        ensure_order_access(request, tenant, order)
        order_items = OrderItem.objects.filter(order_id=order.pk).order_by('-id')
        restaurant = request.tenant.restaurant_name
        return Response({
            'msg': 'success',
            'order': OrderSerializer(order).data,
            'orderItem': OrderItemSerializer(order_items, many=True).data,
            'setting': SettingSaveSerializer(Setting.objects.last()).data,
            'tenant': {
                'name': restaurant.restaurant_name if restaurant else '',
                'address': restaurant.address if restaurant else '',
            },
        })


class UpdateReservationAPI(APIView):
    def post(self, request, tenant):
        reservation = Reservation.objects.filter(id=request.data.get('id')).first() if request.data.get('id') else None
        previous_status = reservation.reservation_status if reservation else None
        serializer = ReservationSerializer(reservation, data=request.data) if reservation else ReservationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'msg': 'Not Saved', 'error': serializer.errors}, status=status.HTTP_200_OK)
        saved = serializer.save()
        notify_if_confirmed(saved, previous_status)
        return Response({'msg': 'Saved Successfully', 'reservationData': serializer.data}, status=status.HTTP_201_CREATED)
