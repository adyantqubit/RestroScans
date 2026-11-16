import React from "react";
import style from "../style/ordermodel.module.css";
import { isLoyaltyEnabled } from "../../services/orderCalculations";

const RULE_ABOVE = { borderTop: "1px solid black" };

export default function PriceSummary({ orderObject, setting }) {
  // A tax is shown as the percentage it is of the total.
  const taxPercent = (tax) => {
    const percent = tax / (orderObject.total / 100);
    return isNaN(percent) ? 0 : percent.toFixed(2);
  };

  return (
    <div className={style.pricingContent}>
      {isLoyaltyEnabled(setting, orderObject) ? (
        <div className={style.priceInformation}>
          <label className={style.InputLabel}>Loyalty Price :- </label>
          <label className={style.InputLabel}>
            ₹ {orderObject.loyality_point_price}
          </label>
        </div>
      ) : null}
      <div className={style.priceInformation}>
        <label className={style.InputLabel}>Discount Price :- </label>
        <label className={style.InputLabel}>
          ₹ {orderObject.discount_rupees}
        </label>
      </div>
      <div className={style.priceInformation}>
        <label className={style.InputLabel}></label>
        <label className={style.InputLabel} style={RULE_ABOVE}>
          Total Price :- ₹{orderObject.total?.toFixed(2)}
        </label>
      </div>
      <div className={style.priceInformation}>
        <label className={style.InputLabel}>
          CGST ({taxPercent(orderObject.cgst)}
          %):-{" "}
        </label>
        <label className={style.InputLabel}>
          {" "}
          ₹ {orderObject.cgst?.toFixed(2)}
        </label>
      </div>
      <div className={style.priceInformation}>
        <label className={style.InputLabel}>
          SGST ({taxPercent(orderObject.sgst)}
          %) :-{" "}
        </label>
        <label className={style.InputLabel}>
          ₹ {orderObject.sgst?.toFixed(2)}
        </label>
      </div>
      <div className={style.priceInformation}>
        <label className={style.InputLabel}></label>
        <label className={style.InputLabel} style={RULE_ABOVE}>
          Grand Total :- ₹ {orderObject.final_amount?.toFixed(2)}
        </label>
      </div>
    </div>
  );
}
