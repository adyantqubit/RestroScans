import React from "react";
import style from "../style/orderform.module.css";
import { FormField, ReadOnlyField } from "./OrderFormField";
import { DISCOUNT_IN_RUPEES, isDiscountLocked } from "../../services/orderFormRules";

// Typed amounts can be "", "0" or "0.00": all of them mean no discount.
const isNonZero = (value) => value === null || Number(value) !== 0;

const blurOnWheel = (event) => event.target.blur();

const DiscountInRupees = ({ order, settings, values, error, on }) => {
  // The input looks locked by the saved order but is disabled by the statuses picked on screen.
  const lockedLook = isDiscountLocked(order) || settings.discount_in !== DISCOUNT_IN_RUPEES;
  const lockedNow =
    isDiscountLocked({ payment_status: values.paymentStatus, order_status: values.orderStatus }) ||
    settings.discount_in !== DISCOUNT_IN_RUPEES;

  return (
    <FormField label="Discount in (₹)" error={error}>
      <input
        className={lockedLook ? style.disabledInputBox : style.textInputBox}
        type="number"
        name="discount_rupees"
        style={{ width: "200px" }}
        value={values.discountRupee ?? ""}
        disabled={lockedNow}
        onChange={on.discountRupeesChange}
        onWheel={blurOnWheel}
        onBlur={on.discountRupeesBlur}
      />
    </FormField>
  );
};

const DiscountInPercentage = ({ order, settings, values, error, on }) => {
  const locked = isDiscountLocked(order) || settings.discount_in === DISCOUNT_IN_RUPEES;

  return (
    <FormField label="Discount in (%)" error={error}>
      <input
        className={locked ? style.disabledInputBox : style.textInputBox}
        type="number"
        name="discount_percentage"
        style={{ width: "200px" }}
        value={values.discountPercentage ?? ""}
        disabled={locked}
        onChange={on.discountPercentageChange}
        onWheel={blurOnWheel}
        onBlur={on.discountPercentageBlur}
      />
    </FormField>
  );
};

const DiscountReason = ({ order, reason, error, onChange }) => {
  const locked = isDiscountLocked(order);

  return (
    <FormField label="Discount reason" error={error}>
      <textarea
        className={locked ? style.disabledInputBox : style.textInputBox}
        type="text"
        name="discount_reason"
        style={locked ? { resize: "none" } : { width: "200px", height: "100px", resize: "none" }}
        value={reason === null || reason === undefined ? "----" : reason}
        disabled={locked || reason === undefined || reason === null}
        onChange={onChange}
        maxLength={255}
      />
    </FormField>
  );
};

// The right-hand column of the order form: the discount inputs and the read-only amounts.
const OrderAmountFields = ({ order, settings, values, errors, on, showDiscount = true, showLoyalty = true }) => (
  <div className={style.sectionInsideForm}>
    {showDiscount ? <DiscountInRupees order={order} settings={settings} values={values} error={errors.discountRupees} on={on} /> : null}
    {showDiscount ? <DiscountInPercentage
      order={order}
      settings={settings}
      values={values}
      error={errors.discountPercentage}
      on={on}
    /> : null}
    {showDiscount && (isNonZero(values.discountRupee) || isNonZero(values.discountPercentage)) && (
      <DiscountReason
        order={order}
        reason={values.discountReason}
        error={errors.discountReason}
        onChange={on.discountReasonChange}
      />
    )}

    <ReadOnlyField label="Subtotal" name="sub_total" value={values.subTotal?.toFixed(2)} />
    {showLoyalty && settings.allow_loyality_points === true && (
      <ReadOnlyField
        label="Loyality point price"
        name="loyality_point_price"
        value={values.loyaltyPointPrice?.toFixed(2)}
        width="100px"
        labelClass={null}
      />
    )}
    {showDiscount ? <ReadOnlyField
      label="Discount"
      name="discount"
      value={values.discountPrice}
      width="100px"
      showErrorArea={false}
      labelClass={null}
    /> : null}
    <ReadOnlyField label="Total" name="total" value={values.total?.toFixed(2)} showErrorArea={false} />
    <ReadOnlyField label="CGST" name="cgst" value={values.cgst?.toFixed(2)} />
    <ReadOnlyField label="SGST" name="sgst" value={values.sgst?.toFixed(2)} />
    <ReadOnlyField label="Grand Total" name="grand_total" value={values.finalAmount?.toFixed(2)} />
    <ReadOnlyField label="Rating" name="rating" value={values.rating || "----"} />
    <FormField label="Review" areaClass={style.inputAreaForResponsive} labelClass={style.inputLabel2}>
      <p
        className={`${style.textInputBox} ${style.disabledInputBox}`}
        style={{ wordBreak: "break-word" }}
      >
        {values.review || "----"}
      </p>
    </FormField>
  </div>
);

export default OrderAmountFields;
