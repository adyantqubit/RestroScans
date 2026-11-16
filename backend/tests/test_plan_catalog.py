"""Plan codes and API gates, without a database."""

import os
import unittest
from types import SimpleNamespace

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from admin_app.plan_catalog import (  # noqa: E402
    STARTER,
    codes_for_tenant,
    combine_features,
    extras_to_store,
    feature_code,
    missing_requirements,
    order_write_data,
    plan_denied,
    plan_name_of,
    required_feature,
)


def restaurant(plan=''):
    return SimpleNamespace(
        path_info='',
        tenant=SimpleNamespace(schema_name='cafe', Subscribe_plan=plan),
    )


class PlanCatalogTests(unittest.TestCase):
    def test_labels_and_legacy_names_map_to_codes(self):
        self.assertEqual(feature_code('order cancel'), 'order_cancel')
        self.assertEqual(feature_code('menu view'), 'menu')
        self.assertEqual(feature_code('loyality point'), 'loyalty')
        self.assertEqual(feature_code('order'), 'order')

    def test_ordering_api_is_refused_on_the_starter_plan(self):
        request = restaurant()
        request.path_info = '/api/v1/customer-details/'
        self.assertEqual(required_feature(request.path_info), 'order')
        denied = plan_denied(request)
        self.assertIsNotNone(denied)
        self.assertEqual(denied.status_code, 403)

    def test_menu_api_stays_open_on_the_starter_plan(self):
        request = restaurant()
        request.path_info = '/api/v1/menu-list/'
        self.assertEqual(required_feature(request.path_info), '')
        self.assertIsNone(plan_denied(request))

    def test_public_site_is_not_gated(self):
        request = SimpleNamespace(path_info='/api/v1/customer-details/', tenant=SimpleNamespace(schema_name='public'))
        self.assertIsNone(plan_denied(request))

    def test_starter_cannot_cancel_or_keep_a_discount_on_an_order_save(self):
        request = restaurant()
        _data, denied = order_write_data(request, {'order_status': 'Cancelled', 'discount_rupees': '10'})
        self.assertEqual(denied.status_code, 403)

        data, denied = order_write_data(request, {'order_status': 'Confirm', 'discount_rupees': '10'})
        self.assertIsNone(denied)
        self.assertNotIn('discount_rupees', data)

    def test_no_plan_is_the_starter_set(self):
        self.assertIn('menu', STARTER)
        self.assertNotIn('order', STARTER)


class ChoiceFieldTests(unittest.TestCase):
    def test_misspelled_plan_or_feature_is_rejected(self):
        from django.core.exceptions import ValidationError
        from admin_app.models import PlanFeature, Tenant, TenantExtraFeature
        with self.assertRaises(ValidationError):
            Tenant._meta.get_field('Subscribe_plan').clean('yammy', None)
        Tenant._meta.get_field('Subscribe_plan').clean('yummy', None)
        with self.assertRaises(ValidationError):
            PlanFeature(plan='yammy', feature='menu').full_clean(validate_unique=False)
        PlanFeature(plan='yummy', feature='order').full_clean(validate_unique=False)
        with self.assertRaises(ValidationError):
            TenantExtraFeature(feature='reservations').full_clean(exclude=['tenant'], validate_unique=False)

    def test_a_feature_cannot_be_saved_without_the_one_it_needs(self):
        self.assertTrue(missing_requirements(['discount']))
        self.assertEqual(missing_requirements(['order', 'discount', 'payment']), [])

    def test_a_blank_plan_is_reported_as_starter_without_a_lookup(self):
        restaurant = SimpleNamespace(Subscribe_plan='')
        self.assertEqual(plan_name_of(restaurant), 'starter')
        self.assertEqual(codes_for_tenant(restaurant), list(STARTER))

    def test_an_extra_feature_stays_on_the_restaurant_it_was_added_to(self):
        defaults = ['menu', 'admin', 'order']
        first = combine_features(defaults, [])
        second = combine_features(defaults, ['staff'])
        self.assertNotIn('staff', first)
        self.assertIn('staff', second)
        self.assertNotIn('staff', defaults)

    def test_a_feature_the_plan_already_has_is_not_stored_as_an_extra(self):
        self.assertEqual(extras_to_store(['menu', 'order'], ['order', 'staff']), ['staff'])

if __name__ == '__main__':
    unittest.main()
