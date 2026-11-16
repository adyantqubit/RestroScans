import React from "react";
import style from "../style/todayOrder.module.css";
import { canBulkMove } from "../../services/todayOrderRules";

const LABEL_STYLE = { fontWeight: "500", marginLeft: "20px" };

const StepButton = ({ className, label, enabled, onClick }) => (
  <p className={style.statusBtnDesign}>
    <button
      className={className}
      onClick={onClick}
      style={{ opacity: enabled ? 1 : 0.4 }}
      disabled={!enabled}
    >
      <a href="#">{label}</a>
    </button>
  </p>
);

// The bar under the list that updates every ticked order at once.
const BulkUpdateBar = ({ tickedCount, newlyPlaced, pendingOrders, servedOrders, onUpdate }) => {
  const canServePayment = canBulkMove(tickedCount, servedOrders, "Served");

  return (
    <div className={style.MultiupdateContainer} id="allupdate">
      <div className={style.updateflexContainer}>
        <div className={style.statusLable} style={LABEL_STYLE}>Order status</div>
        <div className={style.selctedContentBox}>
          <div className={style.updateAllOrderstatusBtnContainer}>
            <div className={style.orderStatusArrowBtnContainerDashboard}>
              <StepButton className="order-btn-right" label="Placed" enabled={false} />
              <StepButton
                className="order-btn-right"
                label="Confirm"
                enabled={canBulkMove(tickedCount, newlyPlaced, "Placed")}
                onClick={() => onUpdate({ order_status: "Confirm" })}
              />
              <StepButton
                className="order-btn-right"
                label="Served"
                enabled={canBulkMove(tickedCount, pendingOrders, "Confirm")}
                onClick={() => onUpdate({ order_status: "Served" })}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={style.updateflexContainer}>
        <div className={style.statusLable} style={LABEL_STYLE}>Payment status</div>
        <div className={style.selctedContentBox}>
          <div className={style.updateAllOrderstatusBtnContainer}>
            <div className={style.orderStatusArrowBtnContainerDashboard}>
              <StepButton
                className="payment-btn-right"
                label="Pending"
                enabled={canServePayment}
                onClick={() => onUpdate({ payment_status: "Pending" })}
              />
              <StepButton
                className="payment-btn-right"
                label="Completed"
                enabled={canServePayment}
                onClick={() => onUpdate({ payment_status: "Completed" })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={style.updateflexContainer}>
        <div className={style.selctedContentBox}>
          <button
            className={style.checkOrderCancelBtn}
            onClick={() => onUpdate({ order_status: "Cancelled" })}
            style={{ opacity: tickedCount > 0 ? 1 : 0.3 }}
            disabled={tickedCount === 0}
          >
            Order cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkUpdateBar;
