// Rules of the order edit form: what each field accepts, when a field is locked, and how the amounts
// follow a loyalty or discount change. Plain functions, no React or page access.

// ---- Validation ---------------------------------------------------------------------------------------

export function validateLoyaltyPoints(value, { customerPoints, subTotal, pointsPrice }) {
  value = value == null ? '' : value;
  if (value.toString().length === 0) return 'Please enter loyality point.';
  if (isNaN(value)) return 'Loyality point must be a number.';
  if (value < 0 || customerPoints < value) {
    return 'Loyality point must be greater than 0 and below the customer loyality point.';
  }
  if (subTotal < pointsPrice) return 'Loyality price should be less than to sub-total.';
  return '';
}

export function validateDiscountRupees(value, subTotal) {
  value = value == null ? '' : value;
  if (value.toString().length === 0) return 'Please enter discount.';
  if (isNaN(value)) return 'discount must be a number.';
  if (value < 0 || subTotal < value) return 'Discount should not be greater than to Sub-Total.';
  return '';
}

export function validateDiscountPercentage(value) {
  value = value == null ? '' : value;
  if (value.toString().length === 0) return 'Please enter discount in percentage';
  if (isNaN(value)) return 'discount in percentage must be a number.';
  if (value < 0 || value >= 100) return 'Discount in percentage must be greater than or equal to 0 and 100';
  return '';
}

export function validateTableNumber(value) {
  return !value || value.length === 0 ? 'Table should not be blank.' : '';
}

export function validateCancelReason(value) {
  return value != null && value.toString().length > 0 ? '' : 'Cancel reason must be 255 characters long';
}

export function isCancelReasonMissing(cancelReason, orderStatus) {
  const blank = cancelReason === null || cancelReason === undefined || cancelReason.toString().trim() === '';
  return blank && orderStatus === 'Cancelled';
}

// Only a table number or loyalty point message holds back the save. A message on a discount field is shown
// to the cashier but does not stop it (the server checks discounts again).
export function hasBlockingErrors(validationErrors) {
  const shown = (message) => message !== undefined && message !== '';
  return shown(validationErrors.table_number) || shown(validationErrors.apply_loyality_point);
}

// ---- Locked fields -----------------------------------------------------------------------------------

// A paid, completed or cancelled order can no longer be given a discount or loyalty points.
export function isDiscountLocked(order) {
  return order.payment_status === 'Paid' || order.payment_status === 'Completed' || order.order_status === 'Cancelled';
}

// A completed or cancelled order can no longer change status or payment mode.
export function isOrderFinished(order) {
  return order.payment_status === 'Completed' || order.order_status === 'Cancelled';
}

// The cancel reason is only open while the selected status is not one of the "live" ones.
export function isCancelReasonLocked(order, selectedOrderStatus) {
  return (
    order.order_status === 'Cancelled' ||
    order.payment_status === 'Completed' ||
    selectedOrderStatus === 'Placed' ||
    selectedOrderStatus === 'Confirm' ||
    selectedOrderStatus === 'Served'
  );
}

export const DISCOUNT_IN_RUPEES = 'Discount in (₹)';

// ---- Amounts -----------------------------------------------------------------------------------------

// CGST and SGST keep the rate the order was saved with; the total they apply to is the new one.
function amountsFor(order, total) {
  const cgstRate = (order.cgst / order.total) * 100;
  const cgst = (total / 100) * cgstRate;
  const sgstRate = (order.sgst / order.total) * 100;
  const sgst = (total / 100) * sgstRate;
  return { total, cgst, sgst, finalAmount: total + cgst + sgst };
}

export function applyLoyaltyPoints(order, { points, perPointValue, discountPrice }) {
  const loyaltyPointPrice = perPointValue * points;
  return {
    loyaltyPointPrice,
    ...amountsFor(order, order.sub_total - perPointValue * points - discountPrice),
  };
}

export function applyDiscountRupees(order, { value, loyaltyPointPrice }) {
  const percentage = value / (order.sub_total / 100);
  return {
    discountPercentage: percentage.toFixed(2),
    ...amountsFor(order, order.sub_total - loyaltyPointPrice - value),
  };
}

export function applyDiscountPercentage(order, { value, subTotal, loyaltyPointPrice }) {
  const discount = (subTotal / 100) * value;
  return {
    discountRupee: discount.toFixed(2),
    ...amountsFor(order, order.sub_total - loyaltyPointPrice - discount),
  };
}

// A minus sign typed or pasted into a discount in rupees becomes 0; a negative percentage becomes 0.
export function cleanRupeeInput(value) {
  return value.includes('-') && value.length > 1 ? '0' : value;
}

export function cleanPercentageInput(value) {
  return value < 0 ? '0' : value;
}
