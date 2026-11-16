import {
  applyDiscountPercentage,
  applyDiscountRupees,
  applyLoyaltyPoints,
  canPrintBill,
  capitalizeWords,
  changeQuantity,
  isEditable,
  isLoyaltyEnabled,
  isSettled,
} from './orderCalculations';

// A saved order: 300 of food with 7.50 CGST and 7.50 SGST (2.5% each), so 315 to pay.
const baseline = {
  sub_total: 300,
  total: 300,
  cgst: 7.5,
  sgst: 7.5,
  final_amount: 315,
  loyality_point_price: 0,
  customer_loyality_point: 40,
  apply_loyality_point: 0,
  discount_rupees: 0,
};
const order = { ...baseline };

describe('applyDiscountRupees', () => {
  test('a valid discount lowers the total and keeps the tax rate', () => {
    const { fields, errors, borders } = applyDiscountRupees(order, baseline, '50');
    expect(fields.total).toBe(250);
    expect(fields.cgst).toBeCloseTo(6.25);
    expect(fields.sgst).toBeCloseTo(6.25);
    expect(fields.final_amount).toBeCloseTo(262.5);
    expect(fields.discount_rupees).toBe('50');
    expect(fields.discount_percentage).toBe('16.67');
    expect(errors).toEqual({ discount_price: '' });
    expect(borders).toEqual([
      ['discount_rupees', '1px solid black'],
      ['discount_percentage', '1px solid black'],
    ]);
  });

  test('keeps only two decimals of what was typed', () => {
    expect(applyDiscountRupees(order, baseline, '50.567').fields.discount_rupees).toBe('50.56');
  });

  test('a discount at or above the sub-total is rejected and changes nothing', () => {
    const result = applyDiscountRupees(order, baseline, '9999');
    expect(result.fields).toEqual({});
    expect(result.errors.discount_price).toBe('Total Price should not be greater than SubTotal');
    expect(result.borders).toEqual([['discount_rupees', '1px solid red']]);
  });

  test('discount plus loyalty value may not exceed the sub-total', () => {
    const withLoyalty = { ...order, loyality_point_price: 280 };
    expect(applyDiscountRupees(withLoyalty, baseline, '30').errors.discount_price).toMatch(/not be greater/);
    expect(applyDiscountRupees(withLoyalty, baseline, '10').errors.discount_price).toBe('');
  });

  test('a loyalty value already applied is taken off as well', () => {
    const withLoyalty = { ...order, loyality_point_price: 20 };
    expect(applyDiscountRupees(withLoyalty, baseline, '50').fields.total).toBe(230);
  });

  test('clearing the box puts the saved totals back', () => {
    const { fields, errors } = applyDiscountRupees({ ...order, total: 250 }, baseline, '');
    expect(fields).toMatchObject({ discount_percentage: 0, discount_rupees: 0, total: 300, cgst: 7.5, sgst: 7.5 });
    expect(fields.final_amount).toBe(315);
    expect(errors).toEqual({});
  });

  test('letters are rejected', () => {
    const result = applyDiscountRupees(order, baseline, 'abc');
    expect(result.errors.discount_price).toBe('Discount price should be in digit');
    expect(result.borders).toEqual([['discount_rupees', '1px solid red']]);
    expect(result.fields).toEqual({});
  });
});

describe('applyDiscountPercentage', () => {
  test('a valid percentage', () => {
    const { fields, errors, borders } = applyDiscountPercentage(order, baseline, '10');
    expect(fields.discount_rupees).toBe('30.00');
    expect(fields.discount_percentage).toBe('10');
    expect(fields.total).toBe(270);
    expect(fields.final_amount).toBeCloseTo(283.5);
    expect(errors).toEqual({ discount_price: '' });
    expect(borders).toEqual([
      ['discount_percentage', '1px solid #9c9c9c'],
      ['discount_rupees', '1px solid #9c9c9c'],
    ]);
  });

  test('decimals are allowed', () => {
    expect(applyDiscountPercentage(order, baseline, '12.5').fields.discount_rupees).toBe('37.50');
  });

  test('100% is the most', () => {
    expect(applyDiscountPercentage(order, baseline, '100').errors.discount_price).toBe('');
    expect(applyDiscountPercentage(order, baseline, '150').errors.discount_price).toBe(
      'Total Price should not be greater than SubTotal',
    );
  });

  test('percentage plus loyalty value may not exceed the sub-total', () => {
    const withLoyalty = { ...order, loyality_point_price: 280 };
    expect(applyDiscountPercentage(withLoyalty, baseline, '10').errors.discount_price).toMatch(/not be greater/);
  });

  test('clearing the box puts the saved totals back', () => {
    const { fields } = applyDiscountPercentage({ ...order, total: 270 }, baseline, '');
    expect(fields).toMatchObject({ discount_percentage: 0, discount_rupees: 0, total: 300 });
    expect(fields.final_amount).toBe(315);
  });

  test('letters are rejected', () => {
    const result = applyDiscountPercentage(order, baseline, 'abc');
    expect(result.errors.discount_price).toBe('Discount price should be in digit');
    expect(result.borders).toEqual([['discount_percentage', '1px solid red']]);
  });
});

describe('applyLoyaltyPoints', () => {
  const perPoint = 2;

  test('valid points are worth their rupee value off the total', () => {
    const { fields, errors, borders } = applyLoyaltyPoints(order, baseline, '5', perPoint);
    expect(fields).toMatchObject({ apply_loyality_point: '5', loyality_point_price: 10, total: 290 });
    expect(fields.final_amount).toBeCloseTo(304.5);
    expect(errors).toEqual({ loyality_point: '' });
    expect(borders).toEqual([['loyality_point', '1px solid #9C9C9C']]);
  });

  test('an existing rupee discount comes off too', () => {
    const { fields } = applyLoyaltyPoints({ ...order, discount_rupees: 50 }, baseline, '5', perPoint);
    expect(fields.total).toBe(240);
  });

  test('more than the customer has earned is rejected', () => {
    expect(applyLoyaltyPoints(order, baseline, '41', perPoint).errors.loyality_point).toBe(
      'Loyalty point should not be greater than earn point',
    );
  });

  test('points already applied to this order are available again', () => {
    const applied = { ...baseline, customer_loyality_point: 40, apply_loyality_point: 30 };
    expect(applyLoyaltyPoints(order, applied, '10', perPoint).errors.loyality_point).toBe('');
    expect(applyLoyaltyPoints(order, applied, '11', perPoint).errors.loyality_point).toMatch(/earn point/);
  });

  test('points worth more than the sub-total are rejected and the box goes red', () => {
    const result = applyLoyaltyPoints(order, baseline, '200', 2);
    expect(result.errors.loyality_point).toBe('Total Price should not be greater than SubTotal');
    expect(result.borders).toEqual([['loyality_point', '1px solid red']]);
    expect(result.fields).toEqual({});
  });

  test('points plus the rupee discount may not exceed the sub-total', () => {
    const result = applyLoyaltyPoints({ ...order, discount_rupees: 295 }, baseline, '5', perPoint);
    expect(result.errors.loyality_point).toMatch(/SubTotal/);
  });

  test('clearing the box removes the points', () => {
    const { fields } = applyLoyaltyPoints({ ...order, apply_loyality_point: 5, total: 290 }, baseline, '', perPoint);
    expect(fields).toMatchObject({ apply_loyality_point: 0, loyality_point_price: 0, total: 300 });
  });

  test('letters and negatives are rejected', () => {
    expect(applyLoyaltyPoints(order, baseline, 'abc', perPoint).errors.loyality_point).toBe(
      'Loyality point should always in digit',
    );
    expect(applyLoyaltyPoints(order, baseline, '-1', perPoint).errors.loyality_point).toBe(
      'Loyality point should always in digit',
    );
  });
});

describe('changeQuantity', () => {
  const item = { quantity: 2, price: 200 };

  test('adding one scales the price', () => {
    expect(changeQuantity(item, '+')).toEqual({ quantity: 3, price: 300 });
  });

  test('removing one scales the price', () => {
    expect(changeQuantity(item, '-')).toEqual({ quantity: 1, price: 100 });
  });

  test('never goes below one', () => {
    expect(changeQuantity({ quantity: 1, price: 100 }, '-')).toBeNull();
  });

  test('a quantity that arrived as text is still a number', () => {
    expect(changeQuantity({ quantity: '2', price: 200 }, '+')).toEqual({ quantity: 3, price: 300 });
  });
});

describe('order state helpers', () => {
  test('isEditable: only open, unpaid orders', () => {
    expect(isEditable({ order_status: 'Confirm', payment_status: 'Pending' })).toBe(true);
    expect(isEditable({ order_status: 'Cancelled', payment_status: 'Pending' })).toBe(false);
    expect(isEditable({ order_status: 'Served', payment_status: 'Paid' })).toBe(false);
  });

  test('canPrintBill: completed and not cancelled', () => {
    expect(canPrintBill({ order_status: 'Served', payment_status: 'Completed' })).toBe(true);
    expect(canPrintBill({ order_status: 'Cancelled', payment_status: 'Completed' })).toBe(false);
    expect(canPrintBill({ order_status: 'Served', payment_status: 'Paid' })).toBe(false);
  });

  test('isSettled: completed, paid or cancelled', () => {
    expect(isSettled({ order_status: 'Served', payment_status: 'Pending' })).toBe(false);
    expect(isSettled({ order_status: 'Served', payment_status: 'Paid' })).toBe(true);
    expect(isSettled({ order_status: 'Served', payment_status: 'Completed' })).toBe(true);
    expect(isSettled({ order_status: 'Cancelled', payment_status: 'Pending' })).toBe(true);
  });

  test('isLoyaltyEnabled: switched on in settings, or already used by this order', () => {
    expect(isLoyaltyEnabled({ allow_loyality_points: true }, {})).toBe(true);
    expect(isLoyaltyEnabled({ allow_loyality_points: false }, {})).toBe(false);
    expect(isLoyaltyEnabled(undefined, {})).toBe(false);
    expect(isLoyaltyEnabled({ allow_loyality_points: false }, { loyality_point_calculated: true })).toBe(true);
    expect(isLoyaltyEnabled(undefined, { loyality_point_calculated: true })).toBe(true);
  });

  test('capitalizeWords', () => {
    expect(capitalizeWords('asha RAO')).toBe('Asha Rao');
    expect(capitalizeWords('a b')).toBe('A B');
    expect(capitalizeWords('priya   sharma')).toBe('Priya   Sharma');
    expect(capitalizeWords('')).toBe('');
  });
});
