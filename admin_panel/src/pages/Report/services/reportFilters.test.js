import { nextSort, QUICK_RANGES, selectQuickRange, setStatusFlag, toExportRows } from './reportFilters';

describe('selectQuickRange', () => {
  test('selects one range and clears the rest', () => {
    const initial = { today: false, week: true, month: false, year: false };
    expect(selectQuickRange(initial, 'today')).toEqual({
      today: true,
      week: false,
      month: false,
      year: false,
      custom: false,
    });
  });

  test('works for every range', () => {
    QUICK_RANGES.forEach((chosen) => {
      const result = selectQuickRange({}, chosen);
      expect(Object.keys(result).sort()).toEqual([...QUICK_RANGES].sort());
      expect(QUICK_RANGES.filter((r) => result[r])).toEqual([chosen]);
    });
  });

  test('does not change what it was given', () => {
    const initial = { today: false, week: true };
    selectQuickRange(initial, 'month');
    expect(initial).toEqual({ today: false, week: true });
  });
});

describe('setStatusFlag', () => {
  test('ticks and unticks one status by its label', () => {
    const start = { placed: false, confirm: false, cancelled: false };
    const ticked = setStatusFlag(start, 'Cancelled', true);
    expect(ticked).toEqual({ placed: false, confirm: false, cancelled: true });
    expect(setStatusFlag(ticked, 'Cancelled', false).cancelled).toBe(false);
    expect(start.cancelled).toBe(false);
  });
});

describe('nextSort', () => {
  test('a new column keeps the current direction', () => {
    expect(nextSort({ column: 'order_id', order: 'descending' }, 'date')).toEqual({ column: 'date', order: 'descending' });
    expect(nextSort({ column: 'order_id', order: 'ascending' }, 'date')).toEqual({ column: 'date', order: 'ascending' });
  });

  test('the same column flips the direction', () => {
    expect(nextSort({ column: 'date', order: 'descending' }, 'date')).toEqual({ column: 'date', order: 'ascending' });
    expect(nextSort({ column: 'date', order: 'ascending' }, 'date')).toEqual({ column: 'date', order: 'descending' });
  });
});

describe('toExportRows', () => {
  const order = {
    id: 9,
    order_id: 'ORD-1',
    table_number: '4',
    date: '2026-01-02T10:30:00',
    order_status: 'Served',
    payment_status: 'Completed',
    payment_mode: 'Cash',
    sub_total: 300,
    discount_rupees: 20,
    discount_percentage: 6.67,
    discount_reason: 'regular',
    loyality_point_price: 10,
    total: 270,
    cgst: 6.75,
    sgst: 6.75,
    final_amount: 283.5,
    customer_name: 'Asha',
    customer_email: 'asha@example.test',
    customer_number: '9999999999',
    customer_id: 3,
    customer_loyality_point: 5,
    last_customer_name: 'x',
    cancel_reason: '',
    cancelled_by: '',
    review: 'ok',
    rating: 4,
    apply_loyality_point: 5,
    loyality_point_status: true,
    loyality_point_calculated: false,
    payment_confirmation_date_time: '2026-01-02T11:00:00',
    send_notifications_on_order_update: true,
    send_notifications_on_payment_update: true,
    send_notifications_on_amount_update: true,
    send_notification_on_tableNum_update: true,
  };

  test('gives readable names and leaves internal columns out', () => {
    const [row] = toExportRows([order]);
    expect(row).toEqual({
      id: 9,
      'Customer Number': '9999999999',
      'Customer Loyality Point': 5,
      'Order Id': 'ORD-1',
      'Table Number': '4',
      'Sub Total': 300,
      Total: 270,
      CGST: 6.75,
      SGST: 6.75,
      'Order Status': 'Served',
      'Payment Status': 'Completed',
      Date: '2026-01-02T10:30:00',
      'Payment Mode': 'Cash',
      'Discount Rupees': 20,
      'Discount Percentage': 6.67,
      'Final Amount': 283.5,
      'Payment Confirmation Date Time': '2026-01-02T11:00:00',
      'Cancelled By': '',
      'Cancel Reason': '',
      'Apply Loyality Point': 5,
      'Loyality Point Price': 10,
      'Customer Name': 'Asha',
      'Customer Email': 'asha@example.test',
      'Customer Id': 3,
    });
  });

  test('columns come out in a stable order: untouched ones first, then renamed ones in sequence', () => {
    const keys = Object.keys(toExportRows([order])[0]);
    expect(keys[0]).toBe('id');
    expect(keys.slice(1, 4)).toEqual(['Customer Number', 'Customer Loyality Point', 'Order Id']);
    expect(keys[keys.length - 1]).toBe('Customer Id');
  });

  test('does not change the orders it is given, so a second export is the same as the first', () => {
    const orders = [order];
    const first = toExportRows(orders);
    const second = toExportRows(orders);
    expect(orders[0]).toBe(order);
    expect(order.order_id).toBe('ORD-1');
    expect(second).toEqual(first);
  });

  test('no orders, no rows', () => {
    expect(toExportRows([])).toEqual([]);
  });
});
