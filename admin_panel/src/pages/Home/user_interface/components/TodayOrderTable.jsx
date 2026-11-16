import React from "react";
import style from "../style/todayOrder.module.css";
import StatusBadge from "./StatusBadge";
import { canPrintServiceBill, canPrintServiceKot, nextServiceStep, ticketSummary } from "../../services/todayOrderRules";

const Message = ({ children }) => (
  <div className={style.row}>
    <div className={style.EmptyText}>{children}</div>
  </div>
);

const OrderRow = ({ order, number, lines, onTick, onMore, onAdvance, onKot, onBill }) => {
  const step = nextServiceStep(order);
  const summary = ticketSummary(lines);
  return (
    <div className="ticket">
      <div className={style.row}>
        <div className={style.columnData1}>
          <input
            className={style.checkbox}
            id="checkbox"
            onChange={(e) => onTick(order, e.target.checked)}
            type="checkbox"
            disabled={order.order_status === "Cancelled"}
          />
          {number}
        </div>
        <div className={style.columnData2}>{order.table_number}</div>
        <div className={style.columnData8}>{order.order_id}</div>
        <div className={style.columnData3}>
          <StatusBadge status={order.order_status} />
        </div>
        <div className={style.columnData4}>{order.date.substring(11, 16)}</div>
        <div className={style.columnData5}>{order.final_amount}</div>
        <div className={style.columnData6}>
          <StatusBadge status={order.payment_status} />
        </div>
        <div className={`${style.columnData7} ticket-actions`}>
          {step ? (
            <button type="button" className="desk-action" onClick={() => onAdvance(order)}>{step.label}</button>
          ) : null}
          <button type="button" className="desk-action desk-action--quiet" disabled={!canPrintServiceKot(order)} onClick={() => onKot(order)}>KOT</button>
          <button type="button" className="desk-action desk-action--quiet" disabled={!canPrintServiceBill(order)} onClick={() => onBill(order)}>Bill</button>
          <button type="button" className={style.printBtn} onClick={() => onMore(order)}>More</button>
        </div>
      </div>
      {summary ? <div className="ticket-lines">{summary}</div> : null}
    </div>
  );
};

const TodayOrderTable = ({ orders, lines, isLoading, onTickAll, onTick, onMore, onAdvance, onKot, onBill }) => (
  <div className={style.container}>
    <div className={style.TabelContainer}>
      <div className={style.table}>
        <div className={style.tableHeading}>
          <div className={style.column1}>
            <input
              className={style.checkbox}
              id="ParentCheckbox"
              type="checkbox"
              onChange={(e) => onTickAll(e.target.checked)}
            />
            S.No
          </div>
          <div className={style.column2}>Table No </div>
          <div className={style.column8}>Order No</div>
          <div className={style.column3}>Order Status</div>
          <div className={style.column4}>Time</div>
          <div className={style.column5}>Amount</div>
          <div className={style.column6}>Payment Status</div>
          <div className={style.column7}>Action</div>
        </div>

        {orders && orders.length > 0 ? (
          orders.map((order, i) => (
            <OrderRow
              key={order.id ?? i}
              order={order}
              number={i + 1}
              lines={(lines || []).filter((line) => line.order_id == order.order_id)}
              onTick={onTick}
              onMore={onMore}
              onAdvance={onAdvance}
              onKot={onKot}
              onBill={onBill}
            />
          ))
        ) : isLoading ? (
          <Message> Please wait For Result .....</Message>
        ) : (
          <Message> No order found !</Message>
        )}
      </div>
    </div>
  </div>
);

export default TodayOrderTable;
