import React from "react";
import { Modal } from "../../../../ui";
import { AiOutlineClose } from "react-icons/ai";
import style from "../style/NewOrderReport.module.css";

const InfoRow = ({ label, value, labelClass }) => (
  <div className={style.information}>
    <div className={labelClass}>
      <div className={style.labelName}>{label}</div> <div className={style.labelColon}>:</div>
    </div>
    <div className={style.data}>{value}</div>
  </div>
);

// A read-only amount, like "Subtotal (₹) : 300.00".
const AmountRow = ({ label, name, value }) => (
  <div className={`${style.inputContainer}`}>
    <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
      <div className={`${style.inputLabel} ${style.inputLabel2}`}>
        <div className={style.labelName}>{label}</div> <div className={style.labelColon}>:</div>
      </div>
      <input
        className={`${style.textInputBox} ${style.disabledInputBox}`}
        type="text"
        name={name}
        value={value}
        disabled
      />
    </div>
  </div>
);

const taxLabel = (tax, taxAmount, total) => `${tax} (${(taxAmount / (total / 100)).toFixed(2)}%)`;

const OrderItems = ({ items }) => (
  <div className={style.scrollContainer}>
    <div className={style.orderItemContainer}>
      <div style={{ width: "100%", overflow: "auto", minHeight: "20vh", maxHeight: "40vh" }}>
        <div className={style.orderItemHeader}>
          <div className={style.quantityHeadingRes}>#</div>
          <div className={style.SnoHeading}>S.No.</div>
          <div className={style.item_heading}>Item Name</div>
          <div className={style.QtyNPriceHeadings}>
            <div className={style.quantityHeadingRes}>Qty</div>
            <div className={style.quantityHeading}>Quantity</div>
            <div className={style.priceHeading}>Price (₹)</div>
          </div>
          <div className={style.status_list}>
            <div className={style.status}>Item Status</div>
          </div>
        </div>

        <div className={style.itemsContent}>
          <div className={style.itemList}>
            {items?.map((item, index) => (
              <div className={style.orderItemHeader} key={index}>
                <div className={style.quantityHeadingRes}>{index + 1}</div>
                <div className={`${style.SnoHeading} ${style.dataText}`}>{index + 1}</div>
                <div className={`${style.item_heading} ${style.dataText}`}>
                  {item.item} ({item.serving_size})
                </div>
                <div className={style.QtyNPriceHeadings}>
                  <div className={style.quantityHeadingRes}>{item.quantity}</div>
                  <div className={`${style.quantityHeading} ${style.dataText}`}>{item.quantity}</div>
                  <div className={`${style.priceHeading} ${style.dataText}`}>{item.price.toFixed(2)}</div>
                </div>
                <div className={style.status_list}>
                  <div className={style.status}>{item.item_status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Pop-up with one order's customer details, items and amounts. `order` is `{ order_detail }`.
const OrderDetailsModal = ({ isOpen, order, items, onOk, onCancel }) => {
  const detail = order?.order_detail;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      className={style.modelContainer}
      closeIcon={<AiOutlineClose className={style.closeIcon} />}
      onOk={onOk}
      onCancel={onCancel}
      footer={null}
    >
      <div className={style.CustomerInformationBox}>
        <div className={style.flexContainer}>
          <div className={style.informationContainer}>
            <InfoRow label="Order ID" labelClass={style.WhiteLabel1} value={detail?.order_id} />
            <InfoRow label="Name" labelClass={style.WhiteLabel1} value={detail?.customer_name} />
            <InfoRow
              label="Email"
              labelClass={style.WhiteLabel1}
              value={detail?.customer_email?.split(",")[0]}
            />
            <InfoRow
              label="Date "
              labelClass={style.WhiteLabel1}
              value={detail?.date.substring(0, 10).split("-").reverse().join("/")}
            />
          </div>
          <div className={style.informationContainer}>
            <InfoRow label="Table" labelClass={style.WhiteLabel} value={detail?.table_number} />
            <InfoRow label="Contact" labelClass={style.WhiteLabel} value={detail?.customer_number} />
            <InfoRow label="Payment Mode" labelClass={style.WhiteLabel} value={detail?.payment_mode} />
            <InfoRow label="Time " labelClass={style.WhiteLabel} value={detail?.date.substring(11, 16)} />
          </div>

          <div className={style.informationContainer1}>
            <div className={style.WhiteLabel1}>
              <div className={style.labelName}>Cancel Reason :</div>
            </div>
            <div className={style.data1}>{detail?.cancel_reason}</div>
          </div>
        </div>

        <OrderItems items={items} />

        <div className={`${style.calculationsContainer}`}>
          <div>
            <AmountRow label="Subtotal (₹)" name="sub_total" value={detail?.sub_total.toFixed(2)} />
            <AmountRow
              label="Loyalty (₹)"
              name="loyality_point_price"
              value={detail?.loyality_point_price.toFixed(2)}
            />
            <AmountRow label="Discount (₹)" name="discount_rupees" value={detail?.discount_rupees.toFixed(2)} />
            <AmountRow label="Total (₹)" name="total" value={detail?.total.toFixed(2)} />
          </div>
          <div>
            {detail?.cgst > 0 ? (
              <AmountRow label={taxLabel("CGST", detail.cgst, detail.total)} name="total" value={detail.cgst.toFixed(2)} />
            ) : null}
            {detail?.sgst > 0 ? (
              <AmountRow label={taxLabel("SGST", detail.sgst, detail.total)} name="total" value={detail.sgst.toFixed(2)} />
            ) : null}
            {detail?.sgst > 0 || detail?.cgst > 0 ? (
              <AmountRow label="Grand Total (₹) " name="final_amount" value={detail.final_amount.toFixed(2)} />
            ) : null}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailsModal;
