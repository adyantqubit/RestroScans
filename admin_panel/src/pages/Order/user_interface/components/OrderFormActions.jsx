import React from "react";
import style from "../style/orderform.module.css";

const OrderFormActions = ({ order, onClear, onBack, onSave, onAddItem }) => {
  const itemsLocked = order.payment_status === "Completed" || order.order_status === "Cancelled";

  return (
    <div className={style.actionContainer}>
      <div className={style.backButton} onClick={onClear}>
        Clear
      </div>
      <div className={style.backButton} onClick={onBack}>
        Back
      </div>
      <div className={style.proceedButton} onClick={onSave}>
        Save
      </div>
      <div
        className={itemsLocked ? style.addMoreItemButtonDisabled : style.addMoreItemButton}
        onClick={onAddItem}
      >
        Add more item
      </div>
    </div>
  );
};

export default OrderFormActions;
