import React from "react";
import style from "../style/ordermodel.module.css";
import { isLoyaltyEnabled, isSettled } from "../../services/orderCalculations";

// The little spinning coin next to the customer's earned points (animated by checkboxNcoin.scss).
function SpinningCoin() {
  return (
    <div className="spinningasset coin is-sm">
      <div>
        <div></div>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <em></em>
        <em></em>
        <div></div>
      </div>
    </div>
  );
}

export default function DiscountAndCancelForm({
  editable,
  errorText,
  inputIvalidationDiscountRupees,
  inputValidationDiscountPercentage,
  orderObject,
  setCancelReason,
  setErrorText,
  setOrderobject,
  setting,
  updateOrderDetail,
  validateLoyalityPoint,
}) {
  // Waiters may cancel but not discount, and nothing can change once an order is paid, completed or cancelled.
  const isWaiter = Boolean(localStorage.getItem("waiterData"));
  const settled = isSettled(orderObject);
  const loyaltyOn = isLoyaltyEnabled(setting, orderObject);

  const discountBoxClass = (discountIn) =>
    settled
      ? `${style.disabledBox} ${style.inputBox}`
      : `${style.inputBox} ${setting?.discount_in == discountIn ? null : style.disbaleBtn}`;

  const reasonBoxClass = settled ? style.TextInputBoxDis : style.TextInputBox;

  return (
    <div className={`${style.DiscountNCancelSection} ${editable ? null : style.disbaleBtn}`}>
      <div className={style.inputContainerFlex}>
        {!isWaiter ? (
          <div className={style.inputBoxContainer}>
            <label className={style.InputLabel}>Discount </label>
            <div className={style.flexDoubleInput}>
              <div className={style.discountColumn}>
                <div className={style.discountRow}>
                  <div className={style.Column}>
                    <label className={style.subInputLabel}>
                      ( In ₹ ){" "}
                    </label>
                    <input
                      id="discount_rupees"
                      type="text"
                      className={discountBoxClass("Discount in (₹)")}
                      value={orderObject.discount_rupees}
                      onChange={inputIvalidationDiscountRupees}
                    />
                  </div>
                  <div className={style.Column}>
                    <label className={style.subInputLabel}>
                      ( In % ){" "}
                    </label>
                    <input
                      id="discount_percentage"
                      className={discountBoxClass("Discount in (%)")}
                      value={orderObject.discount_percentage}
                      onChange={inputValidationDiscountPercentage}
                    />
                  </div>
                </div>
                <div className={style.errorText}>{errorText.discount_price ? errorText.discount_price : null}</div>
              </div>
            </div>
          </div>
        ) : null}

        {!isWaiter ? (
          <div className={style.inputBoxContainer}>
            <div className={style.discountRow} style={{ justifyContent: "space-between" }}>
              {loyaltyOn ? (
                <div className={style.rewardbox}>
                  Earn Point &nbsp;
                  <div className={style.coinBox}>
                    <div className={style.cointPoints}>{orderObject.customer_loyality_point}</div>
                    <SpinningCoin />
                  </div>
                </div>
              ) : null}
              {loyaltyOn ? (
                <div className={style.loyalityColumn}>
                  <label className={style.subInputLabel}>
                    Apply Loyalty Point{" "}
                  </label>
                  <input
                    id="loyality_point"
                    className={settled ? style.disabledBox : style.inputBox}
                    value={orderObject?.apply_loyality_point}
                    onChange={validateLoyalityPoint}
                  />
                  <div className={style.errorText}>{errorText.loyality_point ? errorText.loyality_point : null}</div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
        <div className={style.inputContainerFlex}>
          <div className={style.inputBoxContainer}>
            <label className={style.InputLabel}>Cancel Reason </label>
            <textarea
              className={reasonBoxClass}
              id="cancelInput"
              value={orderObject.cancel_reason}
              onChange={(e) => {
                orderObject.cancel_reason = e.target.value;
                setOrderobject({ ...orderObject });
                setCancelReason(e.target.value);
                ((document.getElementById("cancelInput") || { style: {} }).style.border = "1px solid #9c9c9c");
                errorText["cancelReason"] = "";
                setErrorText({ ...errorText });
              }}
            />
            <div className={style.errorText}>{errorText.cancelReason ? errorText.cancelReason : null}</div>
          </div>
          {!isWaiter ? (
            <div className={style.inputBoxContainer}>
              <label className={style.InputLabel}>
                Discount Reason{" "}
              </label>
              <textarea
                className={reasonBoxClass}
                value={orderObject.discount_reason}
                onChange={(e) => {
                  orderObject.discount_reason = e.target.value;
                  setOrderobject({ ...orderObject });
                }}
              />
            </div>
          ) : null}
        </div>

        <div className={style.inputContainerFlex}>
          <div className={style.inputBoxContainer}>
            <label className={style.InputLabel} />
          </div>
          <div className={style.UpdateDIscountBtn}>
            <button
              className={settled ? style.ApplyBtnDisabled : style.ApplyBtn}
              onClick={() => updateOrderDetail("Order details")}>
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
