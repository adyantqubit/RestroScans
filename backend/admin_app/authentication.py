"""JWT helpers for restaurant staff (owners and waiters).

Each token names the restaurant schema it was issued for, so a token from one
restaurant can never be used against another one.
"""

import datetime
from dataclasses import dataclass

import jwt
from django.conf import settings
from rest_framework import exceptions

ROLE_OWNER = 'owner'
ROLE_WAITER = 'waiter'


@dataclass(frozen=True)
class StaffIdentity:
    user_id: int
    role: str
    tenant: str


def _encode(identity, secret, lifetime):
    now = datetime.datetime.utcnow()
    return jwt.encode(
        {
            'user_id': identity.user_id,
            'role': identity.role,
            'tenant': identity.tenant,
            'iat': now,
            'exp': now + lifetime,
        },
        secret,
        algorithm='HS256',
    )


def _decode(token, secret):
    try:
        payload = jwt.decode(token, secret, algorithms=['HS256'])
        identity = StaffIdentity(payload['user_id'], payload['role'], payload['tenant'])
    except Exception:
        raise exceptions.AuthenticationFailed('unauthenticated')
    if identity.role not in (ROLE_OWNER, ROLE_WAITER) or not identity.tenant:
        raise exceptions.AuthenticationFailed('unauthenticated')
    return identity


def issue_tokens(user_id, role, tenant):
    identity = StaffIdentity(user_id, role, tenant)
    return (
        _encode(identity, settings.JWT_ACCESS_SECRET, datetime.timedelta(hours=settings.JWT_ACCESS_HOURS)),
        _encode(identity, settings.JWT_REFRESH_SECRET, datetime.timedelta(days=settings.JWT_REFRESH_DAYS)),
    )


def decode_access_token(token):
    return _decode(token, settings.JWT_ACCESS_SECRET)


def decode_refresh_token(token):
    return _decode(token, settings.JWT_REFRESH_SECRET)


def staff_identity_for_tenant(token, tenant_schema):
    """Return the identity when the access token belongs to ``tenant_schema``, else None."""
    if not token:
        return None
    try:
        identity = decode_access_token(token)
    except exceptions.AuthenticationFailed:
        return None
    if identity.tenant != tenant_schema:
        return None
    if identity.role == ROLE_WAITER and not _waiter_is_active(identity.user_id):
        return None
    return identity


def _waiter_is_active(waiter_id):
    from tenant_app.models import Waiter

    return Waiter.objects.filter(id=waiter_id, is_active=True).exists()
