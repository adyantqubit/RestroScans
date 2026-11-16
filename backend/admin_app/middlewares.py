"""Resolve the tenant from the request host and switch the Postgres schema.

tenant1.restroscans.com/api/v1/menu-list/  -> schema tenant1
restroscans.com/admin_app/...               -> public schema

Older clients that still call /api/v1/<tenant>/... keep working. When a
subdomain is present it wins, so a path cannot point the request at another
restaurant.
"""

import inspect
import logging

from django.conf import settings
from django.core.cache import cache
from django.db import connection
from django.http import JsonResponse
from tenant_schemas.middleware import BaseTenantMiddleware
from tenant_schemas.utils import get_public_schema_name

from admin_app.authentication import staff_identity_for_tenant
from common.request_context import clear_actor, set_actor
from common.tenant_resolution import is_private_address, tenant_cache_key, tenant_slug_from_host
from tenant_app.access import requires_staff_token

logger = logging.getLogger('custom_logger')
API_PREFIX = '/api/v1/'


class MutitenantMiddleware(BaseTenantMiddleware):
    def process_request(self, request):
        blocked = self._assign_tenant_slug(request)
        if blocked is not None:
            return blocked
        return super().process_request(request)

    def get_tenant(self, model, hostname, request):
        slug = getattr(request, '_resolved_slug', None)
        if not slug:
            public = _tenant_for_slug(model, get_public_schema_name())
            if public is None:
                raise model.DoesNotExist(get_public_schema_name())
            return public

        tenant = _tenant_for_slug(model, slug)
        if tenant is None:
            raise model.DoesNotExist(slug)

        request.tenant_slug = tenant.schema_name
        logger.info('tenant resolved host=%s schema=%s', hostname, tenant.schema_name)
        return tenant

    def process_view(self, request, view_func, view_args, view_kwargs):
        slug = getattr(request, 'tenant_slug', None) or getattr(request, '_resolved_slug', None)
        if slug:
            self._inject_tenant_kwarg(request, view_func, view_kwargs, slug)

        if requires_staff_token(request.method, request.path_info):
            tenant = getattr(request, 'tenant', None)
            identity = staff_identity_for_tenant(bearer_token(request), getattr(tenant, 'schema_name', None))
            if identity is None:
                return _error('Your session has expired. Please sign in again.', 401)
            request.staff = identity
            request.staff_user_id = identity.user_id
            set_actor(f'{identity.role}:{identity.user_id}')
        elif request.path_info.startswith(API_PREFIX):
            set_actor('customer')

        from admin_app.plan_catalog import plan_denied
        denied = plan_denied(request)
        if denied is not None:
            return denied
        return None

    def process_response(self, request, response):
        clear_actor()
        return response

    def _assign_tenant_slug(self, request):
        connection.set_schema_to_public()
        host = request.get_host()
        path = request.path_info or '/'
        request.tenant_slug = None
        request._resolved_slug = None

        if _is_shared_path(path):
            logger.info('public path host=%s path=%s', host, path)
            return None

        from admin_app.models import Tenant

        host_slug = tenant_slug_from_host(host, getattr(settings, 'BASE_DOMAIN', 'restroscans.com'))
        segment, remainder = _api_segment(path)

        if host_slug:
            other = _tenant_for_slug(Tenant, segment) if segment and segment != host_slug else None
            if other is not None:
                logger.warning('tenant spoof blocked host=%s path_tenant=%s', host, segment)
                return _error('This restaurant address does not match the request.', 403)
            tenant = _tenant_for_slug(Tenant, host_slug)
            if tenant is None:
                return _error('Unknown restaurant.', 404)
            if segment == host_slug or segment == tenant.tenant_name:
                _strip_api_prefix(request, remainder)
            request._resolved_slug = tenant.schema_name
            return None

        legacy = _tenant_for_slug(Tenant, segment) if segment else None
        if legacy is not None:
            _strip_api_prefix(request, remainder)
            request._resolved_slug = legacy.schema_name
            return None

        header_slug = (request.headers.get('X-Tenant') or '').strip().lower()
        remote = request.META.get('REMOTE_ADDR', '')
        # X-Tenant is trusted only when the host is an IP (127.0.0.1 or a LAN address).
        # A named host such as tenant1.restroscans.com already chose the restaurant.
        local_client = is_private_address(host) and is_private_address(remote)
        if header_slug and local_client:
            tenant = _tenant_for_slug(Tenant, header_slug)
            if tenant is None:
                return _error('Unknown restaurant.', 404)
            request._resolved_slug = tenant.schema_name
            return None

        if path.startswith(API_PREFIX) and not path.startswith(f'{API_PREFIX}admin/'):
            return _error('Open this API on the restaurant subdomain.', 400)
        return None

    def _inject_tenant_kwarg(self, request, view_func, view_kwargs, slug):
        if 'tenant' in view_kwargs:
            return
        view_cls = getattr(view_func, 'cls', None)
        if view_cls is None:
            return
        handler_name = request.method.lower()
        if handler_name == 'head':
            handler_name = 'get'
        handler = getattr(view_cls, handler_name, None)
        if handler is None:
            return
        try:
            parameters = inspect.signature(handler).parameters
        except (TypeError, ValueError):
            return
        if 'tenant' in parameters:
            view_kwargs['tenant'] = slug


def bearer_token(request):
    header = request.headers.get('Authorization', '')
    if header.startswith('Bearer '):
        return header[7:].strip()
    return ''


def _error(message, status):
    return JsonResponse({'success': False, 'message': message, 'data': {}}, status=status)


def _is_shared_path(path):
    lowered = path.lower()
    return (
        path.startswith('/site/')
        or path.startswith('/admin_app/')
        or '/media/' in lowered
        or 'favicon' in lowered
        or path.startswith('/static')
        or path.startswith('/staticfiles')
    )


def _api_segment(path):
    if not path.startswith(API_PREFIX):
        return '', ''
    rest = path[len(API_PREFIX):]
    segment, _, remainder = rest.partition('/')
    return segment, remainder


def _strip_api_prefix(request, remainder):
    new_path = API_PREFIX + remainder
    request.path_info = new_path
    request.path = new_path
    request.META['PATH_INFO'] = new_path


TENANT_CACHE_SECONDS = getattr(settings, 'TENANT_CACHE_SECONDS', 30)
_MISSING = 'missing'


def _tenant_for_slug(model, slug):
    """Tenant whose schema or name is ``slug`` (None when there is none), cached for a few seconds.

    Every API request resolves the restaurant, sometimes several times. The cache is cleared
    whenever a Tenant is saved or deleted (see ``admin_app.models``).
    """
    if not slug:
        return None
    key = tenant_cache_key(slug)
    cached = cache.get(key)
    if cached is not None:
        return None if cached == _MISSING else cached
    tenant = model.objects.filter(schema_name=slug).first() or model.objects.filter(tenant_name=slug).first()
    cache.set(key, tenant if tenant is not None else _MISSING, TENANT_CACHE_SECONDS)
    return tenant
