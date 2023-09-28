"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""
import os
# Modified by Rohan Kansari - 28/9/23
# REason - To connect websocket 
from channels.routing import ProtocolTypeRouter,URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from django.core.asgi import get_asgi_application
from tenant_app.consumers import OrderProgress
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = get_asgi_application()

ws_pattern= [
    path('ws/order/<order_id>/<tenant>',OrderProgress.as_asgi()),
]

application= ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": URLRouter(ws_pattern),
    }
)

# End of Modification by Rohan Kansari - 28/9/23
# Reason - To connect websocket 