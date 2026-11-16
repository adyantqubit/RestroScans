import React from "react";
import { useApp } from "../../../../Context/AppContext";
import style from "../style/ordermodel.module.css";
import { TiTick } from "react-icons/ti";
import { Popconfirm, Select } from "../../../../ui";
import { BsPencilSquare } from "react-icons/bs";
import { capitalizeWords } from "../../services/orderCalculations";

const { Option } = Select;

const EMAIL_PATTERN = /[a-z0-9]+@[a-z]+.[a-z]{2,3}/;
const NAME_MAX_LENGTH = 50;
const TABLE_MAX_LENGTH = 6;

// One labelled value in the details grid.
function InfoRow({ label, children }) {
  return (
    <div className={style.information}>
      <div className={style.WhiteLabel}>{label}</div>
      {children}
    </div>
  );
}

// The box and tick shown while a value is being edited. Enter or the tick saves; leaving the box restores.
function InlineEdit({ value, onChange, onRestore, onSubmit, maxLength }) {
  return (
    <>
      <input
        className={style.EditableInput}
        onKeyUp={(e) => {
          if (e.key == "Enter" || e.keyCode == 13) onSubmit();
        }}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        onBlur={onRestore}
        maxLength={maxLength}
      />
      <TiTick className={style.inputChecked} onClick={onSubmit} />
    </>
  );
}

export default function CustomerDetails({
  editable,
  inputEnable,
  orderObject,
  setInputEnable,
  setOrderobject,
  unUpdatedOrderObj,
  updateCustomerDetail,
}) {
  const { Message } = useApp();
  const savedOrder = JSON.parse(unUpdatedOrderObj);

  // Props for the edit box of one field: typing changes the order, leaving the box brings the saved value back.
  const editBox = (field, transform = (text) => text) => ({
    value: orderObject[field],
    onChange: (text) => {
      orderObject[field] = transform(text);
      setOrderobject({ ...orderObject });
    },
    onRestore: () => {
      orderObject[field] = savedOrder[field];
      setOrderobject({ ...orderObject });
      setInputEnable("");
    },
  });

  const saveTable = () => {
    if (orderObject.table_number.length > 0) {
      updateCustomerDetail("Table Number");
      setInputEnable(null);
    } else {
      Message("Please enter table number", "warning");
    }
  };

  const saveName = () => {
    if (!(orderObject.customer_name.length > NAME_MAX_LENGTH)) {
      updateCustomerDetail("Name");
      setInputEnable("");
    } else {
      Message("Name should not be greater than 50 characters", "error");
    }
  };

  const saveEmail = () => {
    if (EMAIL_PATTERN.test(orderObject.customer_email)) {
      updateCustomerDetail("Email");
      setInputEnable("");
    } else {
      Message("Please enter valid email", "error");
    }
  };

  const pencilClass = `${editable ? null : style.disbaleBtn}`;

  return (
    <div className={style.flex}>
      <div className={style.informationContainer}>
        <InfoRow label="Table :">
          <div className={style.data}>
            {inputEnable == "tableEdit" ? (
              <InlineEdit {...editBox("table_number")} onSubmit={saveTable} maxLength={TABLE_MAX_LENGTH} />
            ) : (
              <>
                {orderObject.table_number}
                <Popconfirm
                  className={`${editable ? null : style.disbaleBtn} ${style.link}`}
                  title="Are you sure you want to change table number?"
                  cancelText="Cancel"
                  okText="Ok"
                  onConfirm={() => setInputEnable("tableEdit")}
                  placement="bottomLeft">
                  <BsPencilSquare style={{ margin: "5px 10px" }} />
                </Popconfirm>
              </>
            )}
          </div>
        </InfoRow>
        <InfoRow label="Name :">
          <div className={style.data}>
            {inputEnable == "nameEdit" ? (
              <InlineEdit {...editBox("customer_name", capitalizeWords)} onSubmit={saveName} />
            ) : (
              <>
                {orderObject.customer_name}
                <BsPencilSquare
                  className={pencilClass}
                  onClick={() => setInputEnable("nameEdit")}
                  style={{ margin: "5px 10px" }}
                />
              </>
            )}
          </div>
        </InfoRow>
      </div>

      <div className={style.informationContainer}>
        <InfoRow label="Email :">
          <div className={style.data}>
            {inputEnable == "emailEdit" ? (
              <InlineEdit {...editBox("customer_email")} onSubmit={saveEmail} />
            ) : (
              <>
                {orderObject.customer_email}
                <BsPencilSquare
                  className={pencilClass}
                  style={{ margin: "5px 10px" }}
                  onClick={() => setInputEnable("emailEdit")}
                />
              </>
            )}
          </div>
        </InfoRow>
        <InfoRow label="Contact :">
          <div className={style.data}>{orderObject.customer_number}</div>
        </InfoRow>
      </div>

      {orderObject?.waiter_name?.length > 0 ? (
        <div className={style.informationContainer}>
          <InfoRow label="Waiter Detail :">
            <div className={style.data}>
              {orderObject.waiter_name} , {orderObject.waiter_contact_number}
            </div>
          </InfoRow>
          <InfoRow label="Cancelled By :">
            <div className={style.data}>{orderObject.cancelled_by}</div>
          </InfoRow>
        </div>
      ) : (
        <div className={style.informationContainer}>
          <InfoRow label="Order Created By :">
            <div className={style.data}>{orderObject.order_created_by}</div>
          </InfoRow>
          <InfoRow label="Cancelled By :">
            <div className={style.data}>{orderObject.cancelled_by}</div>
          </InfoRow>
        </div>
      )}

      <div className={`${style.informationContainer}`}>
        <InfoRow label="Date & Time:">
          <div className={style.data}>
            {new Date(orderObject.date).toLocaleDateString("en-GB") +
              " " +
              new Date(orderObject.date).toTimeString().substring(0, 5)}
          </div>
        </InfoRow>
        <InfoRow label="Payment Mode :">
          <Select
            name="payment"
            value={orderObject?.payment_mode}
            disabled={orderObject.payment_status == "Completed" || orderObject.order_status == "Cancelled"}
            onChange={(value) => {
              orderObject.payment_mode = value;
              setOrderobject({ ...orderObject });
              updateCustomerDetail("payment_mode");
            }}
            style={{
              width: 90,
              border: "0.5px solid black",
              borderRadius: "5px",
            }}>
            <Option value="Cash" className={`${style.paymentModeInputBox}`}>
              Cash
            </Option>
            <Option value="Scanner" className={`${style.paymentModeInputBox}`}>
              Scanner
            </Option>
          </Select>
        </InfoRow>
      </div>
    </div>
  );
}
