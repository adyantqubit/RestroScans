from rest_framework.views import APIView

from admin_app.authentication import staff_identity_for_tenant
from admin_app.middlewares import bearer_token
from common.responses import api_response
from ..models import Order, OrderEvent
from ..order_access import ensure_order_access
from ..services.ws_ticket import issue_ws_ticket


class OrderEventsAPI(APIView):
    """Changes since `after` for one order, or for the whole restaurant when staff is signed in."""

    def get(self, request, tenant):
        try:
            after = int(request.GET.get('after') or 0)
        except (TypeError, ValueError):
            after = 0
        order_id = (request.GET.get('order_id') or '').strip()
        queryset = OrderEvent.objects.select_related('order').filter(id__gt=after).order_by('id')
        if order_id:
            order = Order.objects.select_related('customer_id').filter(order_id=order_id).first()
            if order is not None:
                ensure_order_access(request, tenant, order)
            queryset = queryset.filter(order__order_id=order_id)
        elif staff_identity_for_tenant(bearer_token(request), request.tenant.schema_name) is None:
            return api_response(False, 'Sign in required.', status_code=401)

        events = []
        for event in queryset[:100]:
            events.append({
                'id': event.id,
                'event_type': event.event_type,
                'order_id': event.order.order_id,
                'order_status': event.order_status,
                'payment_status': event.payment_status,
                'actor': event.actor,
                'summary': event.summary,
                'created_at': event.created_at.isoformat() if event.created_at else '',
            })
        return api_response(True, '', {'events': events})


class WsTicketAPI(APIView):
    """Hand out a one-minute ticket for ``/ws/orders/``.

    Staff get a restaurant-wide ticket. A customer sends ``order_id`` and gets a ticket for that order
    only, if they own it (see ``order_access``).
    """

    def post(self, request, tenant):
        order_id = str(request.data.get('order_id') or '').strip()
        if order_id:
            order = Order.objects.select_related('customer_id').get(order_id=order_id)
            ensure_order_access(request, tenant, order)
        elif staff_identity_for_tenant(bearer_token(request), request.tenant.schema_name) is None:
            return api_response(False, 'Sign in required.', status_code=401)
        return api_response(True, '', {'ticket': issue_ws_ticket(request.tenant.schema_name, order_id)})
