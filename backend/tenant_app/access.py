# """Which tenant API calls are public, and which require a staff token.

# Customer menu and ordering stay open. Restaurant management calls do not.
# """

# STAFF_ONLY_PREFIXES = {
#     'owner-dashboard',
#     'workforce',
#     'dashboard-data',
#     'all-orders',
#     'order-items',
#     'all-customers',
#     'customers-count',
#     'customer-list',
#     'revenue-order-report',
#     'total-revenue-details',
#     'all-order-report-query',
#     'all-order-item-report-query',
#     'order-payment-status',
#     'order-item-status',
#     'order-item-update',
#     'all-order-status-update',
#     'update-order-status',
#     'update-payment-status',
#     'menu-count',
#     'menu-list-v2',
#     'menu-details',
#     'category-count',
#     'category-list-v2',
#     'category-details',
#     'item-count',
#     'item-list-v2',
#     'item-details',
#     'order-count',
#     'order-list-v2',
#     'order-details',
#     'order-item-details',
#     'order-item-list-v2',
#     'order-item-data',
#     'order-item-show',
#     'restaurant-rating-count',
#     'restaurant-rating-list',
#     'offer-banner-count',
#     'offer-banner-list',
#     'offer-item-count',
#     'offer-item-list',
#     'offer-item-details',
#     'offer-item-save',
#     'offer-banner-details',
#     'offer-banner-save',
#     'waiter-list',
#     'waiter-dashboard',
#     'get-customer-report',
#     'get_reservations_list',
#     'update-reservation',
#     'get-menus',
#     'get-categories',
#     'menu-category-item-offer',
#     'dining-tables',
#     'plan-features',
# }

# PUBLIC_WRITE_PREFIXES = {
#     'customer-details',
#     'update-orders',
#     'update-rating-review',
#     'update-payment-mode',
#     'check-payment-status',
#     'store-fcm-token',
#     'check-order-confirm',
#     'delete_order_items',
#     'update_order_items',
#     'get_order_items_and_order',
#     'add_order_items',
#     'post_reservations',
#     'get_billing_data',
#     'rating-review',
#     'otp',
#     'waiter-login',
#     'order-events',
# }


# def _relative(path):
#     prefix = '/api/v1/'
#     if not path.startswith(prefix):
#         return None
#     return path[len(prefix):].lstrip('/')


# def _segment(path):
#     relative = _relative(path)
#     if relative is None:
#         return None
#     return relative.split('/', 1)[0]


# def requires_staff_token(method, path):
#     if method == 'OPTIONS':
#         return False
#     if path.startswith('/api/v1/admin/'):
#         return False
#     segment = _segment(path)
#     if segment is None:
#         return False
#     if segment in STAFF_ONLY_PREFIXES:
#         return True
#     if method in ('GET', 'HEAD', 'OPTIONS'):
#         return False
#     return segment not in PUBLIC_WRITE_PREFIXES



"""Which tenant API calls are public, and which require a staff token.

Customer menu and ordering stay open. Restaurant management calls do not.
"""

STAFF_ONLY_PREFIXES = {
    'owner-dashboard',
    'workforce',
    'dashboard-data',
    'all-orders',
    'order-items',
    'all-customers',
    'customers-count',
    'customer-list',
    'revenue-order-report',
    'total-revenue-details',
    'all-order-report-query',
    'all-order-item-report-query',
    'order-payment-status',
    'order-item-status',
    'order-item-update',
    'all-order-status-update',
    'update-order-status',
    'update-payment-status',
    'menu-count',
    'menu-list-v2',
    'menu-details',
    'category-count',
    'category-list-v2',
    'category-details',
    'item-count',
    'item-list-v2',
    'item-details',
    'order-count',
    'order-list-v2',
    'order-details',
    'order-item-details',
    'order-item-list-v2',
    'order-item-data',
    'order-item-show',
    'restaurant-rating-count',
    'restaurant-rating-list',
    'offer-banner-count',
    'offer-banner-list',
    'offer-item-count',
    'offer-item-list',
    'offer-item-details',
    'offer-item-save',
    'offer-banner-details',
    'offer-banner-save',
    'waiter-list',
    'waiter-dashboard',
    'get-customer-report',
    'get_reservations_list',
    'update-reservation',
    'get-menus',
    'get-categories',
    'menu-category-item-offer',
    'dining-tables',
    'plan-features',
}

PUBLIC_WRITE_PREFIXES = {
    'customer-manual-payment',  # Customer POST claim; order_access checks X-Order-Token.
    'customer-details',
    'update-orders',
    'update-rating-review',
    'update-payment-mode',
    'check-payment-status',
    'store-fcm-token',
    'check-order-confirm',
    'delete_order_items',
    'update_order_items',
    'get_order_items_and_order',
    'add_order_items',
    'post_reservations',
    'get_billing_data',
    'rating-review',
    'otp',
    'waiter-login',
    'order-events',
}


def _relative(path):
    prefix = '/api/v1/'
    if not path.startswith(prefix):
        return None
    return path[len(prefix):].lstrip('/')


def _segment(path):
    relative = _relative(path)
    if relative is None:
        return None
    return relative.split('/', 1)[0]


def requires_staff_token(method, path):
    if method == 'OPTIONS':
        return False
    if path.startswith('/api/v1/admin/'):
        return False
    segment = _segment(path)
    if segment is None:
        return False
    if segment in STAFF_ONLY_PREFIXES:
        return True
    if method in ('GET', 'HEAD', 'OPTIONS'):
        return False
    return segment not in PUBLIC_WRITE_PREFIXES
