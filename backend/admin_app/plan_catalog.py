"""Plan catalog shared by the customer site, the admin panel and the API.

Plan names and feature codes are fixed. PlanFeature stores the default features
of a plan, so editing a plan changes every restaurant on that plan. A restaurant
stores only its plan name, plus any extra features added for that restaurant alone.
"""

STARTER = ('menu', 'whatsapp', 'social', 'admin', 'staff')
DELIGHTFUL = STARTER + ('order', 'order_cancel', 'report', 'rating', 'discount')
YUMMY = DELIGHTFUL + ('reservation', 'payment', 'loyalty')
DELICIOUS = YUMMY + ('expense', 'account')

# code, label shown in Django admin.
FEATURES = (
    ('menu', 'menu see/scan qr code to see menu'),
    ('whatsapp', 'whatsapp chat icon'),
    ('social', 'show social media icons'),
    ('admin', 'admin panel'),
    ('order', 'order'),
    ('order_cancel', 'order cancel'),
    ('report', 'report'),
    ('rating', 'customer rating and feedback'),
    ('discount', 'discount'),
    ('reservation', 'reservation'),
    ('payment', 'payment gateway'),
    ('loyalty', 'loyality point'),
    ('staff', 'staff management'),
    ('expense', 'expense'),
    ('account', 'account'),
)

PLANS = (
    ('starter', STARTER),
    ('delightful', DELIGHTFUL),
    ('yummy', YUMMY),
    ('delicious', DELICIOUS),
)

FEATURE_CHOICES = FEATURES
FEATURE_LABELS = dict(FEATURES)
PLAN_CHOICES = tuple((name, name.capitalize()) for name, _bundle in PLANS)
PLAN_DEFAULTS = dict(PLANS)

# A feature on the right cannot be ticked unless the plan also has the one on the left.
FEATURE_REQUIRES = {
    'order_cancel': ('order',),
    'report': ('order',),
    'discount': ('order',),
    'payment': ('order',),
    'loyalty': ('order',),
}

ALIASES = {label.lower(): code for code, label in FEATURES}
ALIASES['menu view'] = 'menu'
ALIASES['loyalty point'] = 'loyalty'
KNOWN_CODES = {code for code, _label in FEATURES}

# First URL segment under /api/v1/ and the feature it needs.
# Menu, theme, settings and footer stay open on every plan.
PATH_FEATURE = {
    'expenses': 'expense',
    'customer-details': 'order',
    'update-orders': 'order',
    'add_order_items': 'order',
    'update_order_items': 'order',
    'delete_order_items': 'order',
    'check-order-confirm': 'order',
    'get_order_items_and_order': 'order',
    'get_billing_data': 'order',
    'check-payment-status': 'order',
    'order-events': 'order',
    'dashboard-data': 'order',
    'all-order-status-update': 'order',
    'order-payment-status': 'order',
    'order-item-status': 'order',
    'order-item-update': 'order',
    'update-order-status': 'order',
    'update-payment-status': 'order',
    'all-orders': 'order',
    'order-count': 'order',
    'order-list-v2': 'order',
    'order-details': 'order',
    'order-items': 'order',
    'order-item-details': 'order',
    'order-item-list-v2': 'order',
    'order-item-data': 'order',
    'order-item-show': 'order',
    'all-customers': 'order',
    'customers-count': 'order',
    'customer-list': 'order',
    'check-table-number': 'order',
    'dining-tables': 'order',
    'waiter-list': 'order',
    'waiter-dashboard': 'order',
    'all-order-report-query': 'report',
    'all-order-item-report-query': 'report',
    'revenue-order-report': 'report',
    'total-revenue-details': 'report',
    'get-customer-report': 'report',
    'post_reservations': 'reservation',
    'get_reservations_list': 'reservation',
    'update-reservation': 'reservation',
    'rating-review': 'rating',
    'update-rating-review': 'rating',
    'restaurant-rating': 'rating',
    'restaurant-rating-count': 'rating',
    'restaurant-rating-list': 'rating',
    'get-scanner': 'payment',
    'update-payment-mode': 'payment',
    'get-payment-mode': 'payment',
    'social-links': 'social',
}

DISCOUNT_FIELDS = ('discount_rupees', 'discount_percentage', 'discount_reason')
LOYALTY_FIELDS = (
    'apply_loyality_point',
    'loyality_point_price',
    'loyality_point_status',
    'loyality_point_calculated',
)


def feature_code(value):
    text = (value or '').strip().lower()
    if text in KNOWN_CODES:
        return text
    return ALIASES.get(text, '')


def missing_requirements(features):
    """Labels of features whose parent feature is not in the same set. Empty when the set is valid."""
    have = set(features)
    gaps = []
    for code in features:
        for parent in FEATURE_REQUIRES.get(code, ()):
            if parent not in have:
                gaps.append('%s needs %s' % (FEATURE_LABELS[code], FEATURE_LABELS[parent]))
    return gaps


def _plan_key(plan):
    plan = (plan or '').strip().lower()
    return plan if plan in PLAN_DEFAULTS else 'starter'


def forget_plan_features():
    from django.core.cache import cache
    cache.delete_many(['plan-defaults:%s' % name for name, _label in PLAN_CHOICES])


def forget_tenant_extras(tenant_id):
    from django.core.cache import cache
    if tenant_id:
        cache.delete('tenant-extras:%s' % tenant_id)


def _known(codes):
    return [code for code in codes if code in KNOWN_CODES]


def combine_features(plan_codes, extras):
    """Plan defaults plus one restaurant's extras. Does not change either list."""
    merged = []
    for code in list(plan_codes or []) + list(extras or []):
        if code in KNOWN_CODES and code not in merged:
            merged.append(code)
    return merged


def extras_to_store(plan_codes, posted):
    """Extra ticks that the plan does not already include."""
    included = set(plan_codes or [])
    return [code for code in _known(posted or []) if code not in included]


def codes_for_plan(plan):
    """Default features saved for a plan. An empty table still uses the catalog."""
    plan = _plan_key(plan)
    from django.core.cache import cache

    key = 'plan-defaults:%s' % plan
    cached = cache.get(key)
    if cached is not None:
        return list(cached)
    from tenant_schemas.utils import get_public_schema_name, schema_context

    from admin_app.models import PlanFeature

    with schema_context(get_public_schema_name()):
        if not PlanFeature.objects.exists():
            codes = list(PLAN_DEFAULTS[plan])
        else:
            codes = _known(PlanFeature.objects.filter(plan=plan).values_list('feature', flat=True))
    cache.set(key, codes, None)
    return list(codes)


def extra_codes(tenant_id):
    if not tenant_id:
        return []
    from django.core.cache import cache

    key = 'tenant-extras:%s' % tenant_id
    cached = cache.get(key)
    if cached is not None:
        return list(cached)
    from tenant_schemas.utils import get_public_schema_name, schema_context

    from admin_app.models import TenantExtraFeature

    with schema_context(get_public_schema_name()):
        codes = _known(TenantExtraFeature.objects.filter(tenant_id=tenant_id).values_list('feature', flat=True))
    cache.set(key, codes, None)
    return list(codes)


def replace_plan_features(chosen):
    """Save each plan's default features. Does not change which plan a restaurant is on."""
    from django.db import transaction
    from tenant_schemas.utils import get_public_schema_name, schema_context

    from admin_app.models import PlanFeature, TenantExtraFeature

    cleaned = {name: _known(codes) for name, codes in chosen.items()}
    with schema_context(get_public_schema_name()):
        extra_tenants = list(TenantExtraFeature.objects.values_list('tenant_id', 'tenant__Subscribe_plan', 'feature'))
        with transaction.atomic():
            PlanFeature.objects.all().delete()
            PlanFeature.objects.bulk_create([
                PlanFeature(plan=plan, feature=code)
                for plan, codes in cleaned.items() for code in codes
            ])
            for tenant_id, plan_name, feature in extra_tenants:
                if feature in cleaned.get(_plan_key(plan_name), []):
                    TenantExtraFeature.objects.filter(tenant_id=tenant_id, feature=feature).delete()
    forget_plan_features()
    for tenant_id, _plan_name, _feature in extra_tenants:
        forget_tenant_extras(tenant_id)


def replace_extra_features(tenant, codes):
    """Save extra features for this restaurant only."""
    from django.db import transaction
    from tenant_schemas.utils import get_public_schema_name, schema_context

    from admin_app.models import TenantExtraFeature

    codes = _known(codes)
    with schema_context(get_public_schema_name()):
        with transaction.atomic():
            TenantExtraFeature.objects.filter(tenant_id=tenant.pk).delete()
            TenantExtraFeature.objects.bulk_create([
                TenantExtraFeature(tenant_id=tenant.pk, feature=code) for code in codes
            ])
    forget_tenant_extras(tenant.pk)


def plan_name_of(tenant):
    """The plan a restaurant is on. Blank is Starter."""
    name = (getattr(tenant, 'Subscribe_plan', '') or '').strip().lower()
    return name if name in PLAN_DEFAULTS else 'starter'


def codes_for_tenant(tenant):
    """This restaurant's plan defaults, plus extras saved for this restaurant only."""
    if tenant is None:
        return list(STARTER)
    return combine_features(
        codes_for_plan(getattr(tenant, 'Subscribe_plan', '')),
        extra_codes(getattr(tenant, 'pk', None)),
    )


def codes_for_request(request):
    """None on the public site (no restaurant to limit). A list once a restaurant is resolved."""
    tenant = getattr(request, 'tenant', None)
    if tenant is None or getattr(tenant, 'schema_name', None) in (None, 'public'):
        return None
    return codes_for_tenant(tenant)


def required_feature(path):
    if not path or not path.startswith('/api/v1/'):
        return ''
    segment = path[len('/api/v1/'):].split('/', 1)[0]
    return PATH_FEATURE.get(segment, '')


def plan_denied(request):
    """403 response when this restaurant's plan does not include the API, else None."""
    needed = required_feature(getattr(request, 'path_info', '') or '')
    if not needed:
        return None
    codes = codes_for_request(request)
    if codes is None or needed in codes:
        return None
    from django.http import JsonResponse
    return JsonResponse(
        {'success': False, 'message': 'This plan does not include that feature.', 'data': {}},
        status=403,
    )


def _copied(data):
    if hasattr(data, 'copy'):
        return data.copy()
    return dict(data)


def order_write_data(request, data):
    """Drop discount and loyalty fields the plan does not include. Block a cancel the plan does not include."""
    codes = codes_for_request(request)
    if codes is None:
        return data, None
    data = _copied(data)
    if data.get('order_status') == 'Cancelled' and 'order_cancel' not in codes:
        from rest_framework import status
        from rest_framework.response import Response
        return data, Response(
            {'error': 'Order cancel is not included in this plan.'},
            status=status.HTTP_403_FORBIDDEN,
        )
    if 'discount' not in codes:
        for key in DISCOUNT_FIELDS:
            if key in data:
                data.pop(key)
    if 'loyalty' not in codes:
        for key in LOYALTY_FIELDS:
            if key in data:
                data.pop(key)
    return data, None


def setting_write_data(request, data):
    codes = codes_for_request(request)
    if codes is None:
        return data
    data = _copied(data)
    if 'loyalty' not in codes:
        data['allow_loyality_points'] = False
    if 'discount' not in codes and 'discount_in' in data:
        data.pop('discount_in')
    if 'whatsapp' not in codes and 'whatsapp_number' in data:
        data.pop('whatsapp_number')
    return data


def seed_catalog(apps):
    """Create the four plans and their features. A plan that already has features is left as the superuser set it."""
    Features = apps.get_model('admin_app', 'Features')
    Plans = apps.get_model('admin_app', 'Plans')
    PlannedFeatures = apps.get_model('admin_app', 'PlannedFeatures')

    features = {}
    for code, label in FEATURES:
        row = Features.objects.filter(code=code).first() or Features.objects.filter(feature_name__iexact=label).first()
        if row is None:
            row = Features.objects.create(code=code, feature_name=label)
        elif not row.code:
            row.code = code
            row.save(update_fields=['code'])
        features[code] = row

    for plan_name, bundle in PLANS:
        plan = Plans.objects.filter(plan_name__iexact=plan_name).first()
        if plan is None:
            plan = Plans.objects.create(plan_name=plan_name)
        if PlannedFeatures.objects.filter(plan_selected=plan).exists():
            continue
        for code in bundle:
            PlannedFeatures.objects.create(plan_selected=plan, feature_selected=features[code])
