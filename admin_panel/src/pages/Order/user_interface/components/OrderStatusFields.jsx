import React from "react";
import { Popconfirm, Select } from "../../../../ui";
import { BsPencilSquare } from "react-icons/bs";
import style from "../style/orderform.module.css";
import { FormField } from "./OrderFormField";
import { isCancelReasonLocked, isDiscountLocked, isOrderFinished } from "../../services/orderFormRules";

const { Option } = Select;

const TableNumberField = ({ order, tableNumber, isEditable, error, on }) => (
  <FormField label="Table number" error={error}>
    {isEditable ? (
      <input
        className={
          order.payment_status === "Completed" && order.order_status === "Cancelled"
            ? style.disabledInputBox
            : style.textInputBox
        }
        disabled={order.payment_status === "Completed"}
        type="text"
        name="table_number"
        value={tableNumber ?? ""}
        onChange={on.tableNumberChange}
        style={{ width: "200px" }}
        onKeyUp={on.tableNumberKeyUp}
        onBlur={on.tableNumberDone}
        maxLength={10}
      />
    ) : (
      <>
        {tableNumber}
        <Popconfirm
          title="Are you sure you want to change table number?"
          onConfirm={on.editTableNumber}
          cancelText="Cancel"
          okText="Ok"
          placement="bottomLeft"
        >
          <BsPencilSquare style={{ margin: "5px 10px" }} />
        </Popconfirm>
      </>
    )}
  </FormField>
);

const LoyaltyFields = ({ order, customerPoints, appliedPoints, error, on }) => {
  const locked = isDiscountLocked(order);
  return (
    <>
      <FormField label="Customer earn point">
        <input
          className={`${style.textInputBox} ${style.disabledInputBox}`}
          type="text"
          name="customer_loyality_point"
          style={{ width: "100px" }}
          value={customerPoints ?? ""}
          disabled
        />
      </FormField>
      <FormField label="Apply loyality point" error={error}>
        <input
          className={locked ? style.disabledInputBox : style.textInputBox}
          type="text"
          name="apply_loyality_point"
          style={{ width: "200px" }}
          value={appliedPoints ?? ""}
          disabled={locked}
          onChange={on.loyaltyChange}
          onBlur={on.loyaltyBlur}
        />
      </FormField>
    </>
  );
};

// The left-hand column of the order form: order id, table, statuses, cancel reason, payment mode and loyalty.
const OrderStatusFields = ({ order, settings, values, errors, on, allowCancel = true, showLoyalty = true, staffMode = false, waiterLoyalty = null }) => {
  const finished = isOrderFinished(order);
  const cancelReasonLocked = isCancelReasonLocked(order, values.orderStatus);

  return (
    <div className={style.sectionInsideForm}>
      <FormField label="Order Id">
        <input
          className={`${style.textInputBox} ${style.disabledInputBox}`}
          type="text"
          name="order_id"
          value={values.orderId ?? ""}
          disabled
          maxLength={10}
        />
      </FormField>

      <TableNumberField
        order={order}
        tableNumber={values.tableNumber}
        isEditable={values.isTableEditable}
        error={errors.tableNumber}
        on={on}
      />

      <FormField label="Order Status" error={errors.orderStatus}>
        <Select
          className={style.textInputBox}
          name="order_status"
          style={{ width: "200px" }}
          value={values.orderStatus}
          onChange={on.orderStatusChange}
          disabled={finished}
        >
          <Option value="Placed">Placed</Option>
          <Option value="Confirm">Confirm</Option>
          <Option value="Cooked">Cooked / Ready to Serve</Option>
          <Option value="Served">Served</Option>
          {allowCancel ? <Option value="Cancelled">Cancelled</Option> : null}
        </Select>
      </FormField>

      {allowCancel ? <FormField label="Cancel reason" error={errors.cancelReason}>
        <textarea
          className={cancelReasonLocked ? style.disabledReasonInputBox : style.textInputBox2}
          type="text"
          name="cancel_reason"
          value={values.cancelReason ?? ""}
          disabled={cancelReasonLocked}
          onChange={on.cancelReasonChange}
          maxLength={255}
        />
      </FormField> : null}

      <FormField label="Payment Status" error={errors.paymentStatus}>
        <Select
          className={style.textInputBox}
          name="payment_status"
          style={{ width: "200px" }}
          value={values.paymentStatus}
          onChange={on.paymentStatusChange}
          disabled={values.orderStatus !== "Served" || finished}
        >
          <Option value="Pending">Pending</Option>
          <Option value="Completed">Completed</Option>
          <Option value="Paid">Paid</Option>
        </Select>
      </FormField>

      <FormField label="Payment mode">
        <Select
          name="payment"
          value={values.paymentMode}
          onChange={on.paymentModeChange}
          disabled={values.orderStatus !== "Served" || finished}
          style={{
            width: 200,
            height: 35,
            border: "0.5px solid black",
            borderRadius: "5px",
            fontSize: "8px",
          }}
        >
          <Option value="Cash">Cash</Option>
          <Option value="Scanner">Scanner</Option>
        </Select>
      </FormField>

      {allowCancel ? <FormField label="Order cancelled by " error={errors.cancelledBy}>
        <Select
          className={style.textInputBox}
          name="cancelled_by"
          style={{ width: "200px" }}
          value={values.cancelledBy}
          onChange={on.cancelledByChange}
        >
          <Option value="Admin">Admin</Option>
          <Option value="Customer">Customer</Option>
        </Select>
      </FormField> : null}

      {waiterLoyalty && (
        <>
          <FormField label="Loyalty Points">
            <input
              className={style.textInputBox}
              type="number"
              min="0"
              max={waiterLoyalty.available}
              step="1"
              title={`Available: ${waiterLoyalty.available} points`}
              disabled={waiterLoyalty.disabled}
              value={waiterLoyalty.points}
              onChange={waiterLoyalty.onChange}
              style={{ width: "200px" }}
            />
          </FormField>
          <FormField label="Loyalty Rupees (₹)">
            <input
              className={`${style.textInputBox} ${style.disabledInputBox}`}
              type="text"
              value={waiterLoyalty.rupees}
              disabled
              style={{ width: "200px" }}
            />
          </FormField>
        </>
      )}

      {showLoyalty && settings.allow_loyality_points === true && (
        <LoyaltyFields
          order={order}
          customerPoints={values.customerLoyaltyPoints}
          appliedPoints={values.appliedLoyaltyPoints}
          error={errors.loyaltyPoints}
          on={on}
        />
      )}
    </div>
  );
};

export default OrderStatusFields;
