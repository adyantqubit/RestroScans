"""Short-lived tickets for opening the order WebSocket.

Browsers cannot send an ``Authorization`` header on a WebSocket, so the page used to put its
staff access token in the URL, where proxies and access logs keep it. Instead the page now asks
the API for a ticket (proving who it is there, over a normal request) and puts only the ticket in
the URL. A ticket works for ``WS_TICKET_SECONDS``, for one restaurant, and for either the whole
restaurant (staff) or one order (customer).
"""

from datetime import timedelta

import jwt
from django.conf import settings
from django.utils import timezone

PURPOSE = 'order_ws'


def issue_ws_ticket(schema, order_id=None):
    payload = {
        'purpose': PURPOSE,
        'tenant': schema,
        'order_id': order_id or '',
        'exp': timezone.now() + timedelta(seconds=int(getattr(settings, 'WS_TICKET_SECONDS', 60))),
    }
    ticket = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return ticket.decode('utf-8') if isinstance(ticket, bytes) else ticket


def read_ws_ticket(ticket, schema):
    """The order number the ticket is limited to ('' means the whole restaurant), or None if it is not valid."""
    if not ticket:
        return None
    try:
        payload = jwt.decode(ticket, settings.SECRET_KEY, algorithms=['HS256'])
    except Exception:
        return None
    if payload.get('purpose') != PURPOSE or payload.get('tenant') != schema:
        return None
    return payload.get('order_id') or ''
