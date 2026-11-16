import {
  applyDiscountPercentage,
  applyDiscountRupees,
  applyLoyaltyPoints,
  cleanPercentageInput,
  cleanRupeeInput,
  hasBlockingErrors,
  isCancelReasonLocked,
  isCancelReasonMissing,
  isDiscountLocked,
  isOrderFinished,
  validateCancelReason,
  validateDiscountPercentage,
  validateDiscountRupees,
  validateLoyaltyPoints,
  validateTableNumber,
} from './orderFormRules';

describe('validateLoyaltyPoints', () => {
  const context = { customerPoints: 40, subTotal: 300, pointsPrice: 20 };

  test('accepts points the customer has', () => {
    expect(validateLoyaltyPoints('10', context)).toBe('');
    expect(validateLoyaltyPoints('40', context)).toBe('');
    expect(validateLoyaltyPoints('0', context)).toBe('');
  });

  test('rejects too many, negative, non-numeric and empty', () => {
    expect(validateLoyaltyPoints('41', context)).toMatch(/below the customer loyality point/);
    expect(validateLoyaltyPoints('-1', context)).toMatch(/greater than 0/);
    expect(validateLoyaltyPoints('abc', context)).toBe('Loyality point must be a number.');
    expect(validateLoyaltyPoints('', context)).toBe('Please enter loyality point.');
  });

  test('rejects points worth more than the sub-total', () => {
    expect(validateLoyaltyPoints('10', { ...context, pointsPrice: 301 })).toBe(
      'Loyality price should be less than to sub-total.',
    );
  });
});

describe('validateDiscountRupees', () => {
  test('accepts 0 up to the sub-total', () => {
    expect(validateDiscountRupees('0', 300)).toBe('');
    expect(validateDiscountRupees('300', 300)).toBe('');
    expect(validateDiscountRupees(299.5, 300)).toBe('');
  });

  test('rejects more than the sub-total, negative, non-numeric and empty', () => {
    expect(validateDiscountRupees('301', 300)).toBe('Discount should not be greater than to Sub-Total.');
    expect(validateDiscountRupees('-1', 300)).toBe('Discount should not be greater than to Sub-Total.');
    expect(validateDiscountRupees('abc', 300)).toBe('discount must be a number.');
    expect(validateDiscountRupees('', 300)).toBe('Please enter discount.');
  });
});

describe('validateDiscountPercentage', () => {
  test('accepts 0 up to just under 100', () => {
    expect(validateDiscountPercentage('0')).toBe('');
    expect(validateDiscountPercentage('99.99')).toBe('');
  });

  test('rejects 100 and over, negative, non-numeric and empty', () => {
    expect(validateDiscountPercentage('100')).toMatch(/greater than or equal to 0 and 100/);
    expect(validateDiscountPercentage('-3')).toMatch(/greater than or equal to 0 and 100/);
    expect(validateDiscountPercentage('abc')).toBe('discount in percentage must be a number.');
    expect(validateDiscountPercentage('')).toBe('Please enter discount in percentage');
  });
});

describe('table number and cancel reason', () => {
  test('a table number cannot be blank', () => {
    expect(validateTableNumber('')).toBe('Table should not be blank.');
    expect(validateTableNumber('5')).toBe('');
  });

  test('cancel reason text', () => {
    expect(validateCancelReason('')).toBe('Cancel reason must be 255 characters long');
    expect(validateCancelReason('Guest left')).toBe('');
  });

  test('a reason is missing only when cancelling', () => {
    expect(isCancelReasonMissing(null, 'Cancelled')).toBe(true);
    expect(isCancelReasonMissing(undefined, 'Cancelled')).toBe(true);
    expect(isCancelReasonMissing('   ', 'Cancelled')).toBe(true);
    expect(isCancelReasonMissing('Guest left', 'Cancelled')).toBe(false);
    expect(isCancelReasonMissing('', 'Served')).toBe(false);
  });
});

describe('hasBlockingErrors', () => {
  test('table number and loyalty point messages block the save', () => {
    expect(hasBlockingErrors({ table_number: 'Table should not be blank.' })).toBe(true);
    expect(hasBlockingErrors({ apply_loyality_point: 'Loyality point must be a number.' })).toBe(true);
  });

  test('empty or missing messages do not', () => {
    expect(hasBlockingErrors({})).toBe(false);
    expect(hasBlockingErrors({ table_number: '', apply_loyality_point: '' })).toBe(false);
  });

  test('other messages do not', () => {
    expect(hasBlockingErrors({ order_status: 'x', payment_status: 'y', discount_reason: 'z' })).toBe(false);
  });
});

describe('locked fields', () => {
  test('discount and loyalty lock for Paid, Completed and Cancelled', () => {
    expect(isDiscountLocked({ payment_status: 'Pending', order_status: 'Confirm' })).toBe(false);
    expect(isDiscountLocked({ payment_status: 'Paid', order_status: 'Confirm' })).toBe(true);
    expect(isDiscountLocked({ payment_status: 'Completed', order_status: 'Served' })).toBe(true);
    expect(isDiscountLocked({ payment_status: 'Pending', order_status: 'Cancelled' })).toBe(true);
  });

  test('status and payment mode lock for Completed and Cancelled (not Paid)', () => {
    expect(isOrderFinished({ payment_status: 'Paid', order_status: 'Confirm' })).toBe(false);
    expect(isOrderFinished({ payment_status: 'Completed', order_status: 'Served' })).toBe(true);
    expect(isOrderFinished({ payment_status: 'Pending', order_status: 'Cancelled' })).toBe(true);
  });

  test('cancel reason is open only while cancelling a live order', () => {
    const live = { payment_status: 'Pending', order_status: 'Confirm' };
    expect(isCancelReasonLocked(live, 'Confirm')).toBe(true);
    expect(isCancelReasonLocked(live, 'Placed')).toBe(true);
    expect(isCancelReasonLocked(live, 'Served')).toBe(true);
    expect(isCancelReasonLocked(live, 'Cancelled')).toBe(false);
    expect(isCancelReasonLocked({ ...live, payment_status: 'Completed' }, 'Cancelled')).toBe(true);
    expect(isCancelReasonLocked({ ...live, order_status: 'Cancelled' }, 'Cancelled')).toBe(true);
  });
});

describe('amounts', () => {
  const order = { sub_total: 300, total: 300, cgst: 7.5, sgst: 7.5 };

  test('loyalty points reduce the total and keep the tax rates', () => {
    const result = applyLoyaltyPoints(order, { points: '10', perPointValue: 2, discountPrice: 30 });
    expect(result.loyaltyPointPrice).toBe(20);
    expect(result.total).toBe(250);
    expect(result.cgst).toBeCloseTo(6.25);
    expect(result.sgst).toBeCloseTo(6.25);
    expect(result.finalAmount).toBeCloseTo(262.5);
  });

  test('a discount in rupees also gives the percentage', () => {
    const result = applyDiscountRupees(order, { value: '30', loyaltyPointPrice: 20 });
    expect(result.discountPercentage).toBe('10.00');
    expect(result.total).toBe(250);
    expect(result.finalAmount).toBeCloseTo(262.5);
  });

  test('a discount in percentage also gives the rupees', () => {
    const result = applyDiscountPercentage(order, { value: '10', subTotal: 300, loyaltyPointPrice: 0 });
    expect(result.discountRupee).toBe('30.00');
    expect(result.total).toBe(270);
    expect(result.cgst).toBeCloseTo(6.75);
    expect(result.finalAmount).toBeCloseTo(283.5);
  });

  test('no loyalty and no discount leaves the order as it was', () => {
    const result = applyDiscountRupees(order, { value: '0', loyaltyPointPrice: 0 });
    expect(result.total).toBe(300);
    expect(result.finalAmount).toBeCloseTo(315);
  });

  test('does not change the order it is given', () => {
    const copy = { ...order };
    applyLoyaltyPoints(copy, { points: '5', perPointValue: 2, discountPrice: 0 });
    expect(copy).toEqual(order);
  });
});

describe('typed discount cleaning', () => {
  test('a minus sign in rupees becomes 0, a lone minus is left alone', () => {
    expect(cleanRupeeInput('-5')).toBe('0');
    expect(cleanRupeeInput('5-')).toBe('0');
    expect(cleanRupeeInput('-')).toBe('-');
    expect(cleanRupeeInput('12.5')).toBe('12.5');
  });

  test('a negative percentage becomes 0', () => {
    expect(cleanPercentageInput('-3')).toBe('0');
    expect(cleanPercentageInput('3')).toBe('3');
    expect(cleanPercentageInput('')).toBe('');
  });
});
