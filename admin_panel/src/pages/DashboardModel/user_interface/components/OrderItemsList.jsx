import React from "react";
import style from "../style/ordermodel.module.css";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { Popconfirm } from "../../../../ui";

// The three round buttons at the end of each row: Pending, Confirm, Cancel.
const ITEM_STATUSES = [
  { number: 1, status: "Pending", labelClass: "statuslabel", mark: <div id="tick_mark"></div> },
  { number: 2, status: "Confirm", labelClass: "statuslabel", mark: <div id="tick_mark"></div> },
  { number: 3, status: "Cancelled", labelClass: "statuslabel cancelled", mark: <div id="cross"></div> },
];

const DISABLED_BUTTON = { background: "rgba(0,0,0,0.2)", pointerEvents: "none" };

export default function OrderItemsList({
  AddTickedOrderitem,
  editable,
  increaseAndDecrease,
  orderItem,
  orderObject,
  setOrderItem,
  tickedItems,
  unUpdatedOrderItemObj,
  updateOrderItemStatus,
}) {
  const savedItems = JSON.parse(unUpdatedOrderItemObj);

  // The row is tinted by the status that was last saved, not the one just clicked.
  const rowTint = (index) => {
    const savedStatus = savedItems[index]?.item_status;
    if (savedStatus == "Confirm") return style.confirmRow;
    if (savedStatus == "Pending") return null;
    return style.cancelledRow;
  };

  // Give every ticked item the same status and save all items.
  const setTickedStatus = (status) =>
    updateOrderItemStatus(
      orderItem.map((o) => {
        const ticked = tickedItems.filter((e) => e.id == o.id);
        if (ticked.length > 0) {
          ticked[0].item_status = status;
          return ticked[0];
        }
        return o;
      })
    );

  const bulkButtonStyle = tickedItems.length > 0 ? null : DISABLED_BUTTON;

  return (
    <div className={style.orderItemContainer}>
      <div style={{ width: "100%", overflow: "auto" }}>
        <div className={style.orderItemHeader}>
          <div className={style.ItemInformation}>
            <div className={style.item_heading}>Item Name</div>

            <div className={style.QtyNPriceHeadings}>
              <div className={style.quantityHeading}>Quantity</div>
              <div className={style.priceHeading}>Price</div>
            </div>
          </div>

          <div className={style.status_list}>
            <div className={style.status}>Pending</div>
            <div className={style.status}>Confirm</div>
            <div className={style.status}>Cancel</div>
          </div>
        </div>

        <div className={style.itemsContent}>
          <div className={style.itemList}>
            {orderItem?.map((data, index) => (
              <div className={`${style.itemrow} ${rowTint(index)}`} key={data.id}>
                <div className={style.ItemInformation}>
                  <div className={style.checkboxNTitleFlex}>
                    <div className="checkbox-wrapper-24">
                      <input
                        type="checkbox"
                        id={`status0${index}`}
                        name="check"
                        checked={tickedItems.filter((i) => i.id == data.id).length > 0}
                        onChange={(e) => AddTickedOrderitem(e.target.checked, data, index)}
                      />
                      <label htmlFor={`status0${index}`}>
                        <span></span>
                      </label>
                    </div>
                    <div className={style.title}>
                      {data.item} ({data.serving_size})
                    </div>
                  </div>
                  <div className={style.quantityNPriceFlex}>
                    <div className={style.quantity}>
                      <div className={style.decrease}>
                        <AiOutlineMinus onClick={() => increaseAndDecrease("-", index)} />
                      </div>
                      <div className={style.quantityValue}>{data.quantity}</div>
                      <div className={style.increase}>
                        <AiOutlinePlus onClick={() => increaseAndDecrease("+", index)} />
                      </div>
                    </div>
                    <div className={style.price}>{data.price.toFixed(2)}</div>
                  </div>
                </div>
                <div className={style.checkboxContainer}>
                  <div className={style.statusRow}>
                    {ITEM_STATUSES.map(({ number, status, labelClass, mark }) => (
                      <div className={style.checkboxContain} key={status}>
                        <input
                          type="checkbox"
                          className="_checkbox"
                          checked={data.item_status == status}
                          id={`status${number}${index}`}
                        />
                        <label
                          className={labelClass}
                          htmlFor={`status${number}${index}`}
                          onClick={() => {
                            orderItem[index].item_status = status;
                            setOrderItem([...orderItem]);
                          }}>
                          {mark}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={style.AllStatusContainer}>
        <Popconfirm
          className={`${editable ? null : style.disbaleBtn} ${style.link}`}
          style={{ maxWidth: "150px" }}
          title="Are you sure you want to update?"
          onConfirm={() => updateOrderItemStatus(orderItem)}
          cancelText="Cancel"
          okText="Ok">
          <button className={`${style.AllUpdateButton}`}>Update Items</button>
        </Popconfirm>
        <div className={style.StatusBtnContainer}>
          <button className="button" id="cut" style={bulkButtonStyle}>
            <span>Pending</span>
          </button>
          <button className="button" id="copy" style={bulkButtonStyle} onClick={() => setTickedStatus("Confirm")}>
            <span>Confirm</span>
          </button>
          <button className="button" id="paste" style={bulkButtonStyle} onClick={() => setTickedStatus("Cancelled")}>
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
}
