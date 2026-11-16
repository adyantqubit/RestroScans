// Rules behind the order report's filters, sorting and Excel export. Plain functions, no React or page access.

export const QUICK_RANGES = ['today', 'week', 'month', 'year', 'custom'];

// Exactly one quick range is selected at a time.
export function selectQuickRange(previous, chosen) {
  const next = { ...previous };
  QUICK_RANGES.forEach((range) => {
    next[range] = range === chosen;
  });
  return next;
}

// Tick or untick one status in an order-status or payment-status filter ("Placed" -> placed).
export function setStatusFlag(previous, statusName, checked) {
  return { ...previous, [statusName.toLowerCase()]: checked };
}

// Clicking a heading sorts by it; clicking the heading already sorted by flips the direction.
export function nextSort(current, column) {
  let order = current.order;
  if (current.column === column) {
    order = current.order === 'descending' ? 'ascending' : 'descending';
  }
  return { column, order };
}

// The column changes the Excel export makes to each order, in the order they were always applied.
const EXPORT_STEPS = [
  ['drop', 'last_customer_name'],
  ['rename', 'customer_number', 'Customer Number'],
  ['rename', 'customer_loyality_point', 'Customer Loyality Point'],
  ['rename', 'order_id', 'Order Id'],
  ['rename', 'table_number', 'Table Number'],
  ['rename', 'sub_total', 'Sub Total'],
  ['rename', 'total', 'Total'],
  ['rename', 'cgst', 'CGST'],
  ['rename', 'sgst', 'SGST'],
  ['rename', 'order_status', 'Order Status'],
  ['rename', 'payment_status', 'Payment Status'],
  ['rename', 'date', 'Date'],
  ['rename', 'payment_mode', 'Payment Mode'],
  ['rename', 'discount_rupees', 'Discount Rupees'],
  ['rename', 'discount_percentage', 'Discount Percentage'],
  ['drop', 'discount_reason'],
  ['rename', 'final_amount', 'Final Amount'],
  ['drop', 'review'],
  ['drop', 'rating'],
  ['rename', 'payment_confirmation_date_time', 'Payment Confirmation Date Time'],
  ['rename', 'cancelled_by', 'Cancelled By'],
  ['rename', 'cancel_reason', 'Cancel Reason'],
  ['rename', 'apply_loyality_point', 'Apply Loyality Point'],
  ['rename', 'loyality_point_price', 'Loyality Point Price'],
  ['drop', 'loyality_point_status'],
  ['drop', 'loyality_point_calculated'],
  ['drop', 'send_notifications_on_order_update'],
  ['drop', 'send_notifications_on_payment_update'],
  ['drop', 'send_notifications_on_amount_update'],
  ['drop', 'send_notification_on_tableNum_update'],
  ['rename', 'customer_name', 'Customer Name'],
  ['rename', 'customer_email', 'Customer Email'],
  ['rename', 'customer_id', 'Customer Id'],
];

// Rows for the spreadsheet: readable column names, internal columns left out. The orders passed in are
// left alone, so exporting twice gives the same sheet twice.
export function toExportRows(orders) {
  return orders.map((order) => {
    const row = { ...order };
    EXPORT_STEPS.forEach(([action, key, newName]) => {
      if (action === 'rename') row[newName] = row[key];
      delete row[key];
    });
    return row;
  });
}
