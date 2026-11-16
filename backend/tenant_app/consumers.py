import json
from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings

from common.tenant_resolution import is_private_address, tenant_slug_from_host
from .services.ws_ticket import read_ws_ticket


class OrderEventsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        query = parse_qs(self.scope.get('query_string', b'').decode('utf-8'))
        host = _header(self.scope, 'host')
        slug = tenant_slug_from_host(host, getattr(settings, 'BASE_DOMAIN', 'restroscans.com'))
        if not slug and is_private_address(host):
            slug = (query.get('tenant') or [''])[0].strip().lower()
        ticket = (query.get('ticket') or [''])[0].strip()
        schema = await _schema_for(slug) if slug else None
        if not schema:
            await self.close()
            return
        # The ticket (from POST order-events/ws-ticket/) says whether this is staff or one order's customer.
        order_id = read_ws_ticket(ticket, schema)
        if order_id is None:
            await self.close()
            return
        self.order_id = order_id
        self.group = f'orders_{schema}'
        await self.channel_layer.group_add(self.group, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        group = getattr(self, 'group', None)
        if group:
            await self.channel_layer.group_discard(group, self.channel_name)

    async def order_event(self, event):
        if self.order_id and event.get('order_id') != self.order_id:
            return
        await self.send(text_data=json.dumps(event.get('payload') or {}))


def _header(scope, name):
    target = name.encode('utf-8')
    for key, value in scope.get('headers') or []:
        if key == target:
            return value.decode('utf-8').split(':', 1)[0]
    return ''


@database_sync_to_async
def _schema_for(slug):
    from django.db import connection
    from admin_app.models import Tenant

    connection.set_schema_to_public()
    tenant = Tenant.objects.filter(schema_name=slug).first() or Tenant.objects.filter(tenant_name=slug).first()
    return tenant.schema_name if tenant else None
