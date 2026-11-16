import { buildBulkUpdate, canBulkMove, ORDER_TABS, STATUS_COLORS, tabByKey } from './todayOrderRules';

describe('tabs', () => {
  test('six tabs in order, each with its own id, key and list', () => {
    expect(ORDER_TABS.map((t) => t.label)).toEqual(['Placed', 'Confirm', 'Served', 'Paid', 'Completed', 'Cancelled']);
    expect(new Set(ORDER_TABS.map((t) => t.id)).size).toBe(6);
    expect(new Set(ORDER_TABS.map((t) => t.key)).size).toBe(6);
    expect(new Set(ORDER_TABS.map((t) => t.listKey)).size).toBe(6);
  });

  test('only Completed and Cancelled hide the bulk bar', () => {
    expect(ORDER_TABS.filter((t) => t.fade).map((t) => t.key)).toEqual(['Completed', 'Cancelled']);
  });

  test('finds a tab by its remembered key', () => {
    expect(tabByKey('Pending').id).toBe('pending_order');
    expect(tabByKey('Nope')).toBeUndefined();
  });
});

describe('STATUS_COLORS', () => {
  test('has a colour for each known status and none for others', () => {
    ['Placed', 'Confirm', 'Cooked', 'Served', 'Pending', 'Paid', 'Completed', 'Cancelled'].forEach((s) => {
      expect(STATUS_COLORS[s]).toMatch(/^rgba\(/);
    });
    expect(STATUS_COLORS.Unknown).toBeUndefined();
  });
});

describe('buildBulkUpdate', () => {
  const orders = [{ id: 1 }, { id: 2 }];

  test('an order status change is recorded as done by the admin', () => {
    expect(buildBulkUpdate(orders, { order_status: 'Cancelled' })).toEqual({
      orders,
      order_status: 'Cancelled',
      cancelled_by: 'Admin',
    });
  });

  test('a payment status change carries only the payment status', () => {
    expect(buildBulkUpdate(orders, { payment_status: 'Completed' })).toEqual({ orders, payment_status: 'Completed' });
  });
});

describe('canBulkMove', () => {
  test('needs ticked orders and a source tab starting with the right status', () => {
    const placed = [{ order_status: 'Placed' }];
    expect(canBulkMove(1, placed, 'Placed')).toBe(true);
    expect(canBulkMove(0, placed, 'Placed')).toBe(false);
    expect(canBulkMove(1, placed, 'Confirm')).toBe(false);
    expect(canBulkMove(1, [], 'Placed')).toBe(false);
    expect(canBulkMove(1, null, 'Placed')).toBe(false);
  });
});
