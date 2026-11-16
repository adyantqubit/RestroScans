"""Who may read or change one order through the public customer endpoints.

Order numbers are sequential (``dem100001``, ``dem100002``, ...), so knowing one must not be
enough to read a stranger's name, phone and email, cancel their items or mark their bill paid.

Access is granted to:

* staff (owner or waiter token of this restaurant), and
* the customer who proved they own the order's phone number with the OTP. The customer app
  already sends that proof as ``X-Order-Token`` on every request.

The OTP token only lives for ``OTP_TOKEN_MINUTES`` because it also lets a person *place* orders. Reading
and updating an order that already exists is allowed for ``ORDER_ACCESS_GRACE_HOURS`` more, so a diner
who waits for the food or the bill is not locked out of their own order.
"""

from django.conf import settings
from rest_framework.exceptions import PermissionDenied

from admin_app.authentication import staff_identity_for_tenant
from admin_app.middlewares import bearer_token

from .services.otp_service import order_token_is_valid

DENIED_MESSAGE = 'Please verify your phone number to view or change this order.'


def customer_may_access(request, tenant, order):
    """True when the caller is staff of this restaurant or the verified owner of ``order``.

    ``tenant`` is the tenant name the view receives; it is what the OTP token was issued for.
    """
    if not getattr(settings, 'ORDER_ACCESS_ENFORCED', True):
        return True
    if staff_identity_for_tenant(bearer_token(request), request.tenant.schema_name) is not None:
        return True
    token = request.headers.get('X-Order-Token') or request.data.get('order_token')
    grace = int(getattr(settings, 'ORDER_ACCESS_GRACE_HOURS', 12)) * 3600
    return order_token_is_valid(token, order.customer_id.contact_number, tenant, leeway_seconds=grace)


def ensure_order_access(request, tenant, order):
    """Raise a 403 unless :func:`customer_may_access` allows it. ``order.customer_id`` is read."""
    if not customer_may_access(request, tenant, order):
        raise PermissionDenied(DENIED_MESSAGE)
