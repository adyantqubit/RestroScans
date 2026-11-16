"""Order pricing / loyalty rules, run without a database."""

import os
import unittest
from types import SimpleNamespace
from unittest import mock

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.core.exceptions import ValidationError  # noqa: E402
from django.db import models  # noqa: E402
from tenant_app import models as tm  # noqa: E402
from tenant_app.services import order_rules  # noqa: E402
from tenant_app.services.pricing import line_price, parse_discount  # noqa: E402

RUPEES = 'Discount in (₹)'
PERCENT = 'Discount in (%)'


def make_setting(**overrides):
    values = dict(allow_loyality_points=False, per_loyality_point_value=0, amount_for_single_loyality_point=0,
                  discount_in=RUPEES, cgst=2.5, sgst=2.5)
    values.update(overrides)
    return SimpleNamespace(**values)


class OrderSaveRulesTests(unittest.TestCase):
    def save(self, setting, initial=None, points=0, **fields):
        values = dict(id=7, order_id='ABC1', sub_total=333.33, discount_rupees=0.0, discount_percentage=0.0,
                      loyality_point_price=0.0, loyality_point_status='not used', apply_loyality_point=0,
                      order_status='Placed', payment_status='Pending', table_number='1', final_amount=0.0)
        values.update(fields)
        order = tm.Order(**values)
        order.customer_id = tm.CustomerDetail(id=1, contact_number='9999999999', loyality_points=points)
        if initial is not None:
            order._initial_values.update(initial)

        self.customer_updates = []
        customers = mock.MagicMock()
        customers.filter.return_value.update.side_effect = lambda **kw: self.customer_updates.append(kw)
        settings_manager = mock.MagicMock()
        settings_manager.first.return_value = setting
        with mock.patch.object(models.Model, 'save', lambda *a, **k: None), \
                mock.patch.object(tm.Setting, 'objects', settings_manager), \
                mock.patch.object(tm.CustomerDetail, 'objects', customers), \
                mock.patch.object(tm.OrderItem, 'objects', mock.MagicMock()):
            order.save()
        return order

    def test_plain_totals_with_taxes(self):
        order = self.save(make_setting(), sub_total=100.0)
        self.assertEqual((order.total, order.cgst, order.sgst, order.final_amount), (100.0, 2.5, 2.5, 105.0))

    def test_rupee_discount_on_existing_order(self):
        order = self.save(make_setting(discount_in=RUPEES), discount_rupees=10.0)
        self.assertEqual(order.discount_percentage, 3.0)
        self.assertEqual((order.total, order.cgst, order.sgst, order.final_amount), (323.33, 8.08, 8.08, 339.5))

    def test_percent_discount_on_existing_order(self):
        order = self.save(make_setting(discount_in=PERCENT), sub_total=200.0, discount_percentage=10.0)
        self.assertEqual(order.discount_rupees, 20.0)
        self.assertEqual((order.total, order.final_amount), (180.0, 189.0))

    def test_new_order_ignores_discount_in_totals(self):
        order = self.save(make_setting(discount_in=RUPEES), id=None, sub_total=200.0, discount_rupees=50.0)
        self.assertEqual((order.total, order.final_amount), (200.0, 210.0))

    def test_zero_subtotal_with_discount_falls_back_to_plain_totals(self):
        order = self.save(make_setting(discount_in=RUPEES), sub_total=0.0, discount_rupees=10.0)
        self.assertEqual((order.total, order.final_amount), (0.0, 0.0))

    def test_without_settings_totals_are_untouched(self):
        order = self.save(None, total=11.0, final_amount=13.0)
        self.assertEqual((order.total, order.final_amount), (11.0, 13.0))

    def test_first_loyalty_use_takes_points(self):
        setting = make_setting(allow_loyality_points=True, per_loyality_point_value=2)
        order = self.save(setting, points=20, apply_loyality_point=5, initial={'apply_loyality_point': 5})
        self.assertEqual(order.loyality_point_price, 10.0)
        self.assertEqual(order.loyality_point_status, 'is used')
        self.assertEqual(self.customer_updates, [{'loyality_points': 15}])

    def test_completed_order_earns_points_once(self):
        setting = make_setting(allow_loyality_points=True, amount_for_single_loyality_point=100)
        order = self.save(setting, points=4, payment_status='Completed', final_amount=350.0,
                          initial={'payment_status': 'Pending'})
        self.assertTrue(order.loyality_point_calculated)
        self.assertEqual(self.customer_updates, [{'loyality_points': 7}])
        self.assertTrue(order.send_notifications_on_payment_update)
        self.assertIsNotNone(order.payment_confirmation_date_time)

    def test_status_and_table_change_flags(self):
        order = self.save(make_setting(), order_status='Confirm', table_number='5',
                          initial={'order_status': 'Placed', 'table_number': '1'})
        self.assertTrue(order.send_notifications_on_order_update)
        self.assertTrue(order.send_notification_on_tableNum_update)
        self.assertFalse(order.send_notifications_on_payment_update)


class OrderValidationTests(unittest.TestCase):
    def order(self, points=5, **fields):
        order = tm.Order(order_id='A', **fields)
        order.customer_id = tm.CustomerDetail(id=1, contact_number='1', loyality_points=points)
        return order

    def test_cancelled_order_needs_reason(self):
        with self.assertRaises(ValidationError):
            order_rules.validate_order(self.order(order_status='Cancelled', cancel_reason=''))

    def test_paid_order_cannot_get_discount(self):
        with self.assertRaises(ValidationError):
            order_rules.validate_order(self.order(payment_status='Paid', discount_rupees=5.0))

    def test_cannot_apply_more_points_than_balance(self):
        with self.assertRaises(ValidationError):
            order_rules.validate_order(self.order(apply_loyality_point=10))

    def test_valid_order_passes(self):
        order_rules.validate_order(self.order(apply_loyality_point=3))


class PricingTests(unittest.TestCase):
    def test_line_price_applies_offer_percentage(self):
        self.assertEqual(line_price(120, 2, 10), 216.0)

    def test_unparsable_discount_counts_as_zero(self):
        self.assertEqual(parse_discount('10'), 10.0)
        self.assertEqual(parse_discount(''), 0.0)
        self.assertEqual(parse_discount('ten'), 0.0)


if __name__ == '__main__':
    unittest.main()
