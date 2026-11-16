import React from "react";
import style from "../style/ordermodel.module.css";
import { PrintKot } from "../../../Home/user_interface/components/PrintKot";

export default function OrderActionBar({ billable, cancelOrder, editable, orderObject, restroDetail, sendPrintDatas, setting, unUpdatedOrderItemObj, unUpdatedOrderObj }) {
  return (
    <div className={style.CustomerInformationBox}>
        <div className={style.topHeading}>
            <div className={style.Order_idText}>{orderObject.order_id}</div>
            <div className={style.actionBtn}>
                <button
                    className={`${style.orderCancelBtn} ${editable ? null : style.disbaleBtn
                                    }`}
                    onClick={(e) => {
                        cancelOrder("Order cancelled");
                    }}>
                    Cancel Order
                </button>
                <button
                    className={`${JSON.parse(unUpdatedOrderObj)?.order_status == "Cancelled" ||
                                    JSON.parse(unUpdatedOrderObj)?.order_status == "Placed"
                                    ? style.disbaleBtn
                                    : null
                                    } ${style.KotBtn}`}
                    onClick={(e) =>
                        PrintKot(
                            orderObject,
                            JSON.parse(unUpdatedOrderItemObj).filter(
                                (e) => e.item_status == "Confirm"
                            ),
                            restroDetail,
                            setting
                        )
                    }>
                    Print Kot
                </button>
                <button
                    className={`${style.getbill} ${billable ? null : style.disbaleBtn
                                    }`}
                    onClick={(e) => {
                        sendPrintDatas();
                    }}>
                    Get Bill
                </button>
            </div>
        </div>
    </div>
  );
}
