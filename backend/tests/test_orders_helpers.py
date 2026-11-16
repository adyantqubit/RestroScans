"""Order view / service helpers, run without a database."""

import datetime
import os
import unittest
from unittest import mock

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from common.listing import date_bounds, sort  # noqa: E402
from tenant_app.services import order_board, order_service  # noqa: E402
from tenant_app.views.orders import _with_value  # noqa: E402


class CustomerHistoryTests(unittest.TestCase):
    def test_appends_new_values_once(self):
        self.assertEqual(_with_value('Asha', 'Ravi'), 'Asha,Ravi')
        self.assertEqual(_with_value('Asha,Ravi', 'Ravi'), 'Asha,Ravi')

    def test_handles_empty_and_missing(self):
        self.assertEqual(_with_value(None, 'Asha'), 'Asha')
        self.assertEqual(_with_value('', 'Asha'), 'Asha')
        self.assertEqual(_with_value('Asha', ''), 'Asha')
        self.assertEqual(_with_value(None, None), '')


class OrderNumberTests(unittest.TestCase):
    def _next(self, last):
        queryset = mock.Mock()
        queryset.order_by.return_value.values_list.return_value.first.return_value = last
        with mock.patch.object(order_service.Order, 'objects', queryset):
            return order_service.orderNoGeneration('demo')

    def test_first_order(self):
        self.assertEqual(self._next(None), 'dem100001')

    def test_increments_last_order(self):
        self.assertEqual(self._next('dem100041'), 'dem100042')


class ServingSizeTests(unittest.TestCase):
    def test_cart_labels(self):
        self.assertEqual(order_service._serving_size({'serve_size': 'Half Plate'}), 'Half')
        self.assertEqual(order_service._serving_size({'serve_size': 'Full Plate'}), 'Full')
        self.assertEqual(order_service._serving_size({}), 'Full')


class PeriodTests(unittest.TestCase):
    def test_period_starts(self):
        starts = order_board.period_starts(datetime.date(2026, 10, 8))
        self.assertEqual(starts['today'].date(), datetime.date(2026, 10, 8))
        self.assertEqual(starts['week'].date(), datetime.date(2026, 10, 5))
        self.assertEqual(starts['month'].date(), datetime.date(2026, 10, 1))
        self.assertEqual(starts['year'].date(), datetime.date(2026, 1, 1))
        self.assertIsNotNone(starts['today'].tzinfo)


class SortTests(unittest.TestCase):
    def test_unknown_column_or_direction_keeps_default(self):
        queryset = mock.Mock()
        sort(queryset, 'name', '', {'name': 'name'}, '-id')
        queryset.order_by.assert_called_with('-id')
        sort(queryset, 'bogus', 'ascending', {'name': 'name'}, '-id')
        queryset.order_by.assert_called_with('-id')

    def test_known_column(self):
        queryset = mock.Mock()
        sort(queryset, 'name', 'descending', {'name': 'name'}, '-id')
        queryset.order_by.assert_called_with('-name', '-id')


class DateBoundsTests(unittest.TestCase):
    def test_iso_timestamps_from_the_ui(self):
        start, end = date_bounds({'startDate': '2026-10-06T18:30:00.000Z', 'endDate': '2026-10-08T18:30:00.000Z'})
        self.assertEqual(end - start, datetime.timedelta(days=2))
        self.assertIsNotNone(start.tzinfo)

    def test_plain_dates_become_aware(self):
        start, end = date_bounds({'startDate': '2026-10-01', 'endDate': '2026-10-02'})
        self.assertIsNotNone(start.tzinfo)
        self.assertEqual(end - start, datetime.timedelta(days=1))

    def test_same_day_covers_whole_day(self):
        start, end = date_bounds({'startDate': '2026-10-01', 'endDate': '2026-10-01'})
        self.assertEqual(end - start, datetime.timedelta(days=1))

    def test_missing_or_invalid_values_are_ignored(self):
        self.assertIsNone(date_bounds({}))
        self.assertIsNone(date_bounds({'startDate': '2026-10-01'}))
        self.assertIsNone(date_bounds({'startDate': 'nonsense', 'endDate': 'x'}))


if __name__ == '__main__':
    unittest.main()
