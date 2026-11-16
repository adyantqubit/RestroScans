
import {
  getOrderItemsAndOrderAPI as requestOrderItemsAndOrder,
  CheckOrderConfirmAPI as requestCheckOrderConfirm,
} from "../api/orderApi";

export function getOrderItemsAndOrderAPI(data, tenantId) {
  return requestOrderItemsAndOrder(data, tenantId);
}

export function CheckOrderConfirmAPI(order, tenantId) {
  return requestCheckOrderConfirm(order, tenantId);
}

export function extractOrderDateTime(format) {
  var clock = new Date(format);
  var time = clock.toLocaleTimeString("en-US", { hour12: false });
  var date = `${format}`.split("T")[0].split("-").reverse().join("/");
  return { time, date };
}

function numberOrZero(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function activeSubtotal(items) {
  return roundMoney((items || []).reduce((sum, item) => {
    if (item.item_status === "Cancelled") return sum;
    return sum + numberOrZero(item.price);
  }, 0));
}

export function calculateOrderTotals(order, items, cgstRate = 0, sgstRate = 0) {
  const subtotal = activeSubtotal(items);
  const discount = Math.min(subtotal, Math.max(0, numberOrZero(order?.discount_rupees)));
  const loyalty = Math.max(0, numberOrZero(order?.loyality_point_price));
  const taxable = Math.max(0, roundMoney(subtotal - discount - loyalty));
  const cgst = roundMoney(taxable * numberOrZero(cgstRate) / 100);
  const sgst = roundMoney(taxable * numberOrZero(sgstRate) / 100);

  return {
    ...order,
    sub_total: subtotal,
    total: taxable,
    cgst,
    sgst,
    final_amount: roundMoney(taxable + cgst + sgst),
  };
}

export function changeOrderItemQuantity(orderItems, orders, item, delta, cgstRate, sgstRate) {
  const index = (orderItems || []).findIndex(line => line.id === item.id);
  if (index === -1) return { orderItems, orders, blocked: true };

  const lines = orderItems.map(line => ({ ...line }));
  const currentQuantity = numberOrZero(lines[index].quantity);
  const nextQuantity = currentQuantity + delta;

  if (nextQuantity < 1 || currentQuantity < 1) {
    return { orderItems, orders, blocked: true };
  }

  const unitPrice = numberOrZero(lines[index].price) / currentQuantity;
  lines[index].quantity = nextQuantity;
  lines[index].price = roundMoney(nextQuantity * unitPrice);

  return {
    orderItems: lines,
    orders: calculateOrderTotals(orders, lines, cgstRate, sgstRate),
    blocked: false,
  };
}
