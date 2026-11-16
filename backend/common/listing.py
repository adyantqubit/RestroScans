"""Search / sort / paginate helper for the admin panel list screens.

Request body used by every list screen:
    {
        "paginationDetails": {"currentPage": 1, "listPerPage": 10},
        "columnToSort": "name",
        "columnSortingOrder": "ascending" | "descending",
        "searchText": "abc"
    }
"""

import datetime
from functools import reduce
from operator import or_

from django.core.paginator import Paginator
from django.db.models import Q
from django.utils import timezone
from django.utils.dateparse import parse_date, parse_datetime


def _int(value, default):
    try:
        number = int(value)
    except (TypeError, ValueError):
        return default
    return number if number > 0 else default


def _aware(value):
    """Parse an ISO date or datetime from the UI into an aware datetime (None when unusable)."""
    if isinstance(value, datetime.datetime):
        parsed = value
    elif isinstance(value, datetime.date):
        parsed = datetime.datetime.combine(value, datetime.time.min)
    else:
        text = str(value or '').strip()
        parsed = parse_datetime(text)
        if parsed is None:
            day = parse_date(text[:10])
            parsed = datetime.datetime.combine(day, datetime.time.min) if day else None
    if parsed is None:
        return None
    return timezone.make_aware(parsed) if timezone.is_naive(parsed) else parsed


def date_bounds(data):
    """``(start, end)`` for the ``startDate``/``endDate`` request keys, or None.

    The UI sends the day after the last selected day as ``endDate``, so the range is [start, end).
    A date-only ``endDate`` equal to ``startDate`` covers that whole day.
    """
    start = _aware(data.get('startDate'))
    end = _aware(data.get('endDate'))
    if start is None or end is None:
        return None
    if end <= start:
        end = start + datetime.timedelta(days=1)
    return start, end


def search(queryset, text, fields):
    text = (text or '').strip()
    if not text or not fields:
        return queryset
    return queryset.filter(reduce(or_, (Q(**{f'{field}__icontains': text}) for field in fields)))


def sort(queryset, column, direction, columns, default='-id'):
    """``columns`` maps the column name sent by the UI to an ORM field (or a tuple of fields)."""
    target = columns.get(column) if column else None
    if not target or direction not in ('ascending', 'descending'):
        return queryset.order_by(default) if default else queryset
    fields = target if isinstance(target, (list, tuple)) else (target,)
    prefix = '-' if direction == 'descending' else ''
    return queryset.order_by(*(prefix + field for field in fields), default if default else 'pk')


def paginate(queryset, data, max_per_page=200):
    """Return (rows on the requested page, total row count)."""
    details = data.get('paginationDetails') or {}
    per_page = min(_int(details.get('listPerPage'), 10), max_per_page)
    paginator = Paginator(queryset, per_page)
    page = paginator.get_page(_int(details.get('currentPage'), 1))
    return page.object_list, paginator.count


def apply_filters(queryset, data, fields):
    """Exact filters from ``filters`` in the request. Empty and ``all`` are ignored."""
    raw = data.get('filters') or {}
    if not isinstance(raw, dict):
        return queryset
    for key, orm_field in fields.items():
        if key not in raw:
            continue
        value = raw[key]
        if value in ('', None, 'all'):
            continue
        if isinstance(value, str) and value.lower() in ('true', 'false'):
            value = value.lower() == 'true'
        queryset = queryset.filter(**{orm_field: value})
    return queryset


def list_page(queryset, data, search_fields=(), sort_columns=None, default_order='-id', filter_fields=None):
    """Apply the UI's filters, search text, sort column and page to ``queryset``."""
    if filter_fields:
        queryset = apply_filters(queryset, data, filter_fields)
    queryset = search(queryset, data.get('searchText'), search_fields)
    queryset = sort(
        queryset,
        data.get('columnToSort'),
        data.get('columnSortingOrder'),
        sort_columns or {},
        default_order,
    )
    return paginate(queryset, data)
