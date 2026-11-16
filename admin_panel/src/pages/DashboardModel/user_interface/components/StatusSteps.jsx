import React from "react";
import style from "../style/ordermodel.module.css";
import { PrintKot } from "../../../Home/user_interface/components/PrintKot";

// One arrow in a status row. `canMove(true)` also shows the reason when the move is not allowed.
function StatusStep({ label, isCurrent, canMove, onMove }) {
  return (
    <p>
      <button
        className={` ${canMove(false) ? "btn-right" : "btn-disable"} ${isCurrent ? "activeStatusBtn" : null}`}
        onClick={() => {
          if (canMove(true)) onMove();
        }}>
        <a href="#">{label}</a>
      </button>
    </p>
  );
}

export default function StatusSteps({
  UpdateOrderStatusDetail,
  UpdatePaymentStatusDetail,
  orderObject,
  restroDetail,
  setting,
  statusValidation,
  unUpdatedOrderItemObj,
  unUpdatedOrderObj,
}) {
  const saved = JSON.parse(unUpdatedOrderObj);

  // Moving the order to a new status is checked against the current payment status ...
  const orderStep = (label, onMove = () => UpdateOrderStatusDetail(label, "Order status")) => (
    <StatusStep
      label={label}
      isCurrent={saved.order_status == label}
      canMove={(showReason) => statusValidation(label, orderObject.payment_status, saved, showReason)}
      onMove={onMove}
    />
  );

  // ... and moving the payment to a new status against the current order status.
  const paymentStep = (label) => (
    <StatusStep
      label={label}
      isCurrent={saved.payment_status == label}
      canMove={(showReason) => statusValidation(orderObject.order_status, label, saved, showReason)}
      onMove={() => UpdatePaymentStatusDetail(label, "Payment status")}
    />
  );

  const confirmOrder = () => {
    PrintKot(
      orderObject,
      JSON.parse(unUpdatedOrderItemObj).filter((e) => e.item_status != "Cancelled" && e.kot_print_status == false),
      restroDetail,
      setting
    );
    UpdateOrderStatusDetail("Confirm", "Order status");
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: "20px",
        margin: "10px 0",
      }}>
      <div>
        <label className={style.InputLabel} style={{ padding: "0 10px" }}>
          Order Status{" "}
        </label>
        <div className={style.OrderstatusBtnContainer}>
          <div className={style.StatusArrowBtnContainer}>
            {orderStep("Placed")}
            {orderStep("Confirm", confirmOrder)}
            {orderStep("Served")}
          </div>
        </div>
      </div>

      <div>
        <label className={style.InputLabel} style={{ padding: "0 10px" }}>
          Payment Status{" "}
        </label>
        <div className={style.OrderstatusBtnContainer}>
          <div className={style.StatusArrowBtnContainer}>
            {paymentStep("Pending")}
            {saved.payment_status == "Paid" ? paymentStep("Paid") : null}
            {paymentStep("Completed")}
          </div>
        </div>
      </div>
    </div>
  );
}
