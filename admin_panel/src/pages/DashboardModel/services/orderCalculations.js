// The arithmetic and rules behind the order popup. Everything here is a plain function: it reads the
// order, the saved copy of the order ("baseline") and what the user typed, and returns what should change.
// The popup applies the result; nothing in this file touches the page or React.
//
//   fields  - values to write onto the order
//   errors  - messages to show (an empty string clears one)
//   borders - [element id, CSS border] pairs the popup paints on the inputs

export const RED_BORDER = '1px solid red';
export const GREY_BORDER = '1px solid #9c9c9c';
const BLACK_BORDER = '1px solid black';
const LOYALTY_GREY_BORDER = '1px solid #9C9C9C';

const DIGITS_ONLY = /^\d+$/;
const NO_CHANGE = { fields: {}, errors: {}, borders: [] };

const looksNumeric = (value) => DIGITS_ONLY.test(value) || value.includes('.');

// Tax is kept at the saved rate: each tax's share of the saved total, applied to the new total.
function taxShare(baseline, totalPrice) {
  return {
    cgst: ((baseline.cgst / (baseline.total / 100)) * totalPrice) / 100,
    sgst: ((baseline.sgst / (baseline.total / 100)) * totalPrice) / 100,
  };
}

// A discount typed in rupees.
export function applyDiscountRupees(order, baseline, value) {
  if (value > order.sub_total || Number(value) + order.loyality_point_price > order.sub_total) {
    return {
      fields: {},
      errors: { discount_price: 'Total Price should not be greater than SubTotal' },
      borders: [['discount_rupees', RED_BORDER]],
    };
  }
  if (value.length > 0 && value < order.sub_total && looksNumeric(value)) {
    const total = order.sub_total - value - order.loyality_point_price;
    const { cgst, sgst } = taxShare(baseline, total);
    const percentage = value / (order.sub_total / 100);
    return {
      fields: {
        cgst,
        sgst,
        total,
        final_amount: total + sgst + cgst,
        discount_percentage: percentage.toFixed(2),
        // at most two decimals
        discount_rupees: value.indexOf('.') >= 0 ? value.slice(0, value.indexOf('.') + 3) : value,
      },
      errors: { discount_price: '' },
      borders: [
        ['discount_rupees', BLACK_BORDER],
        ['discount_percentage', BLACK_BORDER],
      ],
    };
  }
  if (value.length === 0) {
    const total = baseline.total;
    const { cgst, sgst } = taxShare(baseline, total);
    return {
      fields: { discount_percentage: 0.0, discount_rupees: 0, cgst, sgst, total, final_amount: total + sgst + cgst },
      errors: {},
      borders: [],
    };
  }
  if (!DIGITS_ONLY.test(value)) {
    return {
      fields: {},
      errors: { discount_price: 'Discount price should be in digit' },
      borders: [['discount_rupees', RED_BORDER]],
    };
  }
  return NO_CHANGE;
}

// A discount typed as a percentage of the sub-total.
export function applyDiscountPercentage(order, baseline, value) {
  const asRupees = value * (order.sub_total / 100);
  if (asRupees > order.sub_total || asRupees + order.loyality_point_price > order.sub_total) {
    return {
      fields: {},
      errors: { discount_price: 'Total Price should not be greater than SubTotal' },
      borders: [['discount_rupees', RED_BORDER]],
    };
  }
  if (value.length > 0 && value < 101 && looksNumeric(value)) {
    const discount = value * (order.sub_total / 100);
    const total = baseline.sub_total - discount - order.loyality_point_price;
    const { cgst, sgst } = taxShare(baseline, total);
    return {
      fields: {
        cgst,
        sgst,
        total,
        final_amount: total + cgst + sgst,
        discount_percentage: value,
        discount_rupees: discount.toFixed(2),
      },
      errors: { discount_price: '' },
      borders: [
        ['discount_percentage', GREY_BORDER],
        ['discount_rupees', GREY_BORDER],
      ],
    };
  }
  if (value.length === 0) {
    const total = baseline.total;
    const { cgst, sgst } = taxShare(baseline, total);
    return {
      fields: { discount_percentage: 0.0, discount_rupees: 0.0, cgst, sgst, total, final_amount: total + cgst + sgst },
      errors: {},
      borders: [],
    };
  }
  if (!DIGITS_ONLY.test(value)) {
    return {
      fields: {},
      errors: { discount_price: 'Discount price should be in digit' },
      borders: [['discount_percentage', RED_BORDER]],
    };
  }
  if (value > 100) {
    return {
      fields: {},
      errors: { discount_price: 'Discount price should not be greater than 100%' },
      borders: [['discount_percentage', RED_BORDER]],
    };
  }
  return NO_CHANGE;
}

// Loyalty points typed in; each point is worth `perPointValue` rupees.
export function applyLoyaltyPoints(order, baseline, value, perPointValue) {
  const loyaltyPrice = perPointValue * value;
  const pointsAvailable = baseline.customer_loyality_point - baseline.apply_loyality_point;

  if (loyaltyPrice > order.sub_total || parseInt(loyaltyPrice) + parseInt(order.discount_rupees) > order.sub_total) {
    return {
      fields: {},
      errors: { loyality_point: 'Total Price should not be greater than SubTotal' },
      borders: [['loyality_point', RED_BORDER]],
    };
  }
  if (
    value > -1 &&
    looksNumeric(value) &&
    value.length > 0 &&
    value < pointsAvailable + 1 &&
    loyaltyPrice < baseline.sub_total + 1
  ) {
    const total = order.sub_total - loyaltyPrice - order.discount_rupees;
    const { cgst, sgst } = taxShare(baseline, total);
    return {
      fields: {
        apply_loyality_point: value,
        loyality_point_price: loyaltyPrice,
        cgst,
        sgst,
        total,
        final_amount: total + cgst + sgst,
      },
      errors: { loyality_point: '' },
      borders: [['loyality_point', LOYALTY_GREY_BORDER]],
    };
  }
  if (value.length === 0) {
    const total = baseline.total;
    const { cgst, sgst } = taxShare(baseline, total);
    return {
      fields: { apply_loyality_point: 0, loyality_point_price: 0, cgst, sgst, total, final_amount: total + cgst + sgst },
      errors: {},
      borders: [],
    };
  }
  if (!DIGITS_ONLY.test(value)) {
    return { fields: {}, errors: { loyality_point: 'Loyality point should always in digit' }, borders: [] };
  }
  if (value > pointsAvailable) {
    return { fields: {}, errors: { loyality_point: 'Loyalty point should not be greater than earn point' }, borders: [] };
  }
  if (loyaltyPrice >= baseline.sub_total + 1) {
    return { fields: {}, errors: { loyality_point: 'Loyality point should not be greater then sub-total' }, borders: [] };
  }
  return NO_CHANGE;
}

// One more or one fewer of an item; the line price moves in proportion. A quantity never goes below 1.
export function changeQuantity(item, sign) {
  const current = Number(item.quantity);
  if (sign === '-') {
    if (current === 1) return null;
    const quantity = current - 1;
    return { quantity, price: (item.price / (quantity + 1)) * quantity };
  }
  const quantity = current + 1;
  return { quantity, price: (item.price / (quantity - 1)) * quantity };
}

// Open orders that are still unpaid can be edited, cancelled or have items added.
export function isEditable(baseline) {
  return baseline.order_status !== 'Cancelled' && baseline.payment_status === 'Pending';
}

// A paid-up, not cancelled order can have its bill printed.
export function canPrintBill(baseline) {
  return baseline.payment_status === 'Completed' && baseline.order_status !== 'Cancelled';
}

// Nothing about the order may change any more.
export function isSettled(order) {
  return (
    order.payment_status === 'Completed' || order.order_status === 'Cancelled' || order.payment_status === 'Paid'
  );
}

// Loyalty points are shown when the restaurant has them switched on, or when this order already used them.
export function isLoyaltyEnabled(setting, order) {
  return setting?.allow_loyality_points === true || order.loyality_point_calculated === true;
}

// "asha RAO" -> "Asha Rao"; one-letter words are upper-cased.
export function capitalizeWords(text) {
  return text
    .split(' ')
    .map((word) => (word.length > 1 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word.toUpperCase()))
    .join(' ');
}
