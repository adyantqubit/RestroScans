"""ASGI entry. HTTP stays on Django. WebSockets are added when Channels is installed."""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

django_asgi = get_asgi_application()

try:
    from channels.routing import ProtocolTypeRouter, URLRouter
    from tenant_app.routing import websocket_urlpatterns

    application = ProtocolTypeRouter({
        'http': django_asgi,
        'websocket': URLRouter(websocket_urlpatterns),
    })
except Exception:
    application = django_asgi
