"""Who may touch an order: staff, or the customer whose phone was verified by OTP. No database needed."""

import os
import unittest
from datetime import timedelta
from types import SimpleNamespace
from unittest import mock

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

import jwt  # noqa: E402
from django.conf import settings  # noqa: E402
from django.test import override_settings  # noqa: E402
from django.utils import timezone  # noqa: E402
from rest_framework.exceptions import PermissionDenied  # noqa: E402

from tenant_app import order_access  # noqa: E402
from tenant_app.services.otp_service import order_token_is_valid  # noqa: E402


def _token(phone='9876543210', tenant='demo', expires_in=timedelta(minutes=20), purpose='order_otp'):
    payload = {'purpose': purpose, 'phone': phone, 'tenant': tenant, 'exp': timezone.now() + expires_in}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')


def _request(token=None, staff=False):
    headers = {'X-Order-Token': token} if token else {}
    return SimpleNamespace(headers=headers, data={}, tenant=SimpleNamespace(schema_name='demo'), _staff=staff)


def _order(phone='9876543210'):
    return SimpleNamespace(customer_id=SimpleNamespace(contact_number=phone))


class OrderTokenTests(unittest.TestCase):
    def test_valid_token_for_same_phone(self):
        self.assertTrue(order_token_is_valid(_token(), '9876543210', 'demo'))

    def test_phone_is_compared_by_last_ten_digits(self):
        self.assertTrue(order_token_is_valid(_token(), '+91 98765 43210', 'demo'))

    def test_other_phone_other_tenant_and_wrong_purpose_are_rejected(self):
        self.assertFalse(order_token_is_valid(_token(), '9000000000', 'demo'))
        self.assertFalse(order_token_is_valid(_token(), '9876543210', 'other'))
        self.assertFalse(order_token_is_valid(_token(purpose='something_else'), '9876543210', 'demo'))

    def test_garbage_and_missing_tokens_are_rejected(self):
        self.assertFalse(order_token_is_valid('', '9876543210', 'demo'))
        self.assertFalse(order_token_is_valid('not-a-jwt', '9876543210', 'demo'))

    def test_expired_token_needs_leeway(self):
        expired = _token(expires_in=timedelta(minutes=-30))
        self.assertFalse(order_token_is_valid(expired, '9876543210', 'demo'))
        self.assertTrue(order_token_is_valid(expired, '9876543210', 'demo', leeway_seconds=3600))


class OrderAccessTests(unittest.TestCase):
    def _allowed(self, request, order, staff=False):
        with mock.patch.object(order_access, 'staff_identity_for_tenant',
                               return_value=object() if staff else None):
            return order_access.customer_may_access(request, 'demo', order)

    def test_verified_owner_is_allowed(self):
        self.assertTrue(self._allowed(_request(_token()), _order()))

    def test_owner_is_still_allowed_after_otp_window_within_grace(self):
        late = _token(expires_in=timedelta(hours=-2))
        self.assertTrue(self._allowed(_request(late), _order()))

    def test_owner_is_locked_out_after_grace(self):
        very_late = _token(expires_in=timedelta(hours=-13))
        self.assertFalse(self._allowed(_request(very_late), _order()))

    def test_someone_elses_order_is_denied(self):
        self.assertFalse(self._allowed(_request(_token('9000000000')), _order('9876543210')))

    def test_no_token_is_denied(self):
        self.assertFalse(self._allowed(_request(), _order()))

    def test_staff_is_allowed_without_a_token(self):
        self.assertTrue(self._allowed(_request(), _order(), staff=True))

    @override_settings(ORDER_ACCESS_ENFORCED=False)
    def test_switch_turns_the_check_off(self):
        self.assertTrue(self._allowed(_request(), _order()))

    def test_ensure_raises_403(self):
        with mock.patch.object(order_access, 'staff_identity_for_tenant', return_value=None):
            with self.assertRaises(PermissionDenied):
                order_access.ensure_order_access(_request(), 'demo', _order())


if __name__ == '__main__':
    unittest.main()
