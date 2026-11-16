import unittest

from common.tenant_resolution import is_local_host, is_private_address, tenant_slug_from_host
from tenant_app.access import requires_staff_token


class TenantHostTests(unittest.TestCase):
    def test_subdomain_is_the_tenant(self):
        self.assertEqual(tenant_slug_from_host('tenant1.restroscans.com'), 'tenant1')

    def test_apex_and_www_are_public(self):
        self.assertIsNone(tenant_slug_from_host('restroscans.com'))
        self.assertIsNone(tenant_slug_from_host('www.restroscans.com'))

    def test_local_subdomain(self):
        self.assertEqual(tenant_slug_from_host('tenant1.localhost:8000'), 'tenant1')
        self.assertIsNone(tenant_slug_from_host('localhost:8000'))
        self.assertTrue(is_local_host('127.0.0.1:8000'))
        self.assertTrue(is_private_address('192.168.1.4:8000'))
        self.assertFalse(is_private_address('tenant1.restroscans.com'))

    def test_nested_subdomain_is_not_guessed(self):
        self.assertIsNone(tenant_slug_from_host('a.b.restroscans.com'))


class AccessTests(unittest.TestCase):
    def test_menu_read_is_public_and_menu_write_is_staff(self):
        self.assertFalse(requires_staff_token('GET', '/api/v1/menu-list/'))
        self.assertTrue(requires_staff_token('POST', '/api/v1/menu-list/'))

    def test_customer_order_write_stays_open(self):
        self.assertFalse(requires_staff_token('POST', '/api/v1/customer-details/'))
        self.assertFalse(requires_staff_token('POST', '/api/v1/otp/send/'))

    def test_dashboard_requires_staff(self):
        self.assertTrue(requires_staff_token('GET', '/api/v1/dashboard-data/'))

    def test_preflight_is_open(self):
        self.assertFalse(requires_staff_token('OPTIONS', '/api/v1/dashboard-data/'))


if __name__ == '__main__':
    unittest.main()
