// Rules of the dashboard's "today's orders" list: the tabs, the colours of status badges and the bulk update payload.
// Plain functions, no React or page access.

// One entry per tab, left to right. `key` is what is remembered in localStorage, `listKey` is the field the
// server sends that tab's orders in, `fade` hides the bulk update bar (nothing can be updated on that tab).
export const ORDER_TABS = [
  { id: 'newly_placed', key: 'Newly_placed', label: 'Placed', listKey: 'todays_newly_placed_orders', fade: false },
  { id: 'pending_order', key: 'Pending', label: 'Confirm', listKey: 'todays_pending_orders', fade: false },
  { id: 'served_order', key: 'Served', label: 'Served', listKey: 'todays_served_orders', fade: false },
  { id: 'paid_order', key: 'Paid', label: 'Paid', listKey: 'todays_paid_orders', fade: false },
  { id: 'completed', key: 'Completed', label: 'Completed', listKey: 'todays_completed_orders', fade: true },
  { id: 'cancelled', key: 'Cancelled', label: 'Cancelled', listKey: 'todays_cancelled_orders', fade: true },
];

export const DEFAULT_TAB_KEY = 'Newly_placed';

export function tabByKey(key) {
  return ORDER_TABS.find((tab) => tab.key === key);
}

const ORANGE = 'rgba(255, 206, 115, 1)';
const YELLOW = 'rgba(225, 252, 126, 1)';
const BLUE = 'rgba(115, 222, 255, 1)';
const GREEN = 'rgba(144, 238, 144,1)';

// Background of the badge shown for an order or payment status. Unknown statuses get no badge.
export const STATUS_COLORS = {
  Placed: ORANGE,
  Confirm: YELLOW,
  Cooked: BLUE,
  Served: GREEN,
  Pending: ORANGE,
  Paid: BLUE,
  Completed: GREEN,
  Cancelled: ORANGE,
};

// What is sent to update the ticked orders. Cancelling is always recorded as done by the admin.
export function buildBulkUpdate(orders, change) {
  const data = { orders };
  if ('order_status' in change) {
    data.order_status = change.order_status;
    data.cancelled_by = 'Admin';
  }
  if ('payment_status' in change) {
    data.payment_status = change.payment_status;
  }
  return data;
}

// A bulk move is offered when something is ticked and the first order of the source tab is in the right status.
export function canBulkMove(tickedCount, sourceOrders, requiredStatus) {
  return tickedCount > 0 && sourceOrders?.[0]?.order_status === requiredStatus;
}

// The one next thing staff do with an order. Each step is a single save.
export function nextServiceStep(order) {
  if (!order || order.order_status === 'Cancelled') return null;
  if (order.order_status === 'Placed') return { label: 'Accept', change: { order_status: 'Confirm' } };
  if (order.order_status === 'Confirm') return { label: 'Cooked', change: { order_status: 'Cooked' } };
  if (order.order_status === 'Cooked') return { label: 'Served', change: { order_status: 'Served' } };
  // Payment confirmation is exclusively handled by ManualPaymentVerificationAPI.
  return null;
}

export function canPrintServiceKot(order) {
  return Boolean(order) && order.order_status !== 'Placed' && order.order_status !== 'Cancelled';
}

export function canPrintServiceBill(order) {
  return Boolean(order) && order.order_status !== 'Cancelled';
}

export function ticketSummary(items) {
  const lines = (items || []).filter((line) => line.item_status !== 'Cancelled' && line.item_status !== 'cancelled');
  if (!lines.length) return '';
  return lines.map((line) => `${line.quantity || 1}× ${line.item || 'Item'}`).join(', ');
}

export function tableStillSeated(order) {
  return Boolean(order) && order.order_status !== 'Cancelled' && order.payment_status !== 'Completed';
}
