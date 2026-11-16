import React from "react";
import { AiFillEye } from "react-icons/ai";
import {
  BsSortAlphaDownAlt,
  BsSortAlphaDown,
  BsSortNumericDownAlt,
  BsSortNumericDown,
} from "react-icons/bs";
import style from "../style/NewOrderReport.module.css";
import { displayDateTime } from "../../services/reportService";

const NUMERIC_ICONS = { ascending: BsSortNumericDown, descending: BsSortNumericDownAlt };
const ALPHA_ICONS = { ascending: BsSortAlphaDown, descending: BsSortAlphaDownAlt };

// A column heading that sorts the report when clicked and shows the sort direction (or a grey hint on hover).
const SortableHeading = ({
  label,
  column,
  className,
  numeric,
  columnToSort,
  columnSortingOrder,
  showSortingIcon,
  setShowSortingIcon,
  onSort,
}) => {
  const icons = numeric ? NUMERIC_ICONS : ALPHA_ICONS;
  const isSorted = columnToSort === column;
  const SortedIcon = icons[columnSortingOrder];
  const HintIcon = icons.ascending;

  return (
    <div
      className={className}
      onClick={() => {
        setShowSortingIcon(false);
        onSort(column);
      }}
      onMouseEnter={() => {
        if (!isSorted) setShowSortingIcon(column);
      }}
      onMouseLeave={() => {
        if (!isSorted) setShowSortingIcon("");
      }}
    >
      {label}
      {isSorted && SortedIcon && <SortedIcon className={style.sortingIcon} />}
      {!isSorted && showSortingIcon === column && (
        <HintIcon color="grey" className={style.sortingIcon} />
      )}
    </div>
  );
};

// Columns that can be sorted, left to right after the plain S.No and Action columns.
const HEADINGS_BEFORE_STATUS = [
  { label: "Order ID ", column: "order_id", className: style.OrderIdColumn, numeric: true },
  { label: "Table No ", column: "table_number", className: style.tableNoColumn, numeric: true },
  { label: "Date", column: "date", className: style.dateColumn, numeric: true },
];

const HEADINGS_AFTER_STATUS = [
  { label: "Sub Total", column: "subtotal", className: style.subtotalColumn },
  { label: "Discount", column: "discount", className: style.discountColumn },
  { label: "Loyality", column: "loyalty", className: style.loayltyColumn },
  { label: "Total", column: "total", className: style.totalColumn },
  { label: "CGST", column: "cgst", className: style.cgstColumn },
  { label: "SGST", column: "sgst", className: style.sgstColumn },
  { label: "Final Amount", column: "final_amount", className: style.finalRupees },
];

const Cell = ({ className, children, ...rest }) => (
  <div className={`${className} ${style.commonColumnData} `} {...rest}>
    {children}
  </div>
);

const OrderRow = ({ order, index, rowNumber, isLast, onView }) => (
  <div
    className={style.tableData}
    style={{
      padding: "2px",
      marginTop: "2px",
      marginBottom: isLast ? "2px" : "0px",
      background: index % 2 === 0 ? "#1677ff14" : "white",
    }}
  >
    <Cell className={style.sNoColumn}>{rowNumber}</Cell>
    <Cell className={style.actionColumn} onClick={() => onView(order)}>
      <AiFillEye style={{ fontSize: 15, color: "rgb(24, 94, 224)" }} />
    </Cell>
    <Cell className={style.OrderIdColumn}>
      <span> {order.order_id}</span>
    </Cell>
    <Cell className={style.tableNoColumn}>
      <span> {order.table_number} </span>
    </Cell>
    <Cell className={style.dateColumn}>{displayDateTime(order.date).date}</Cell>
    <Cell
      className={style.orderStatusColumn}
      style={{ display: "flex", justifyContent: "center" }}
    >
      {order.order_status}
    </Cell>
    <Cell className={style.paymentStatusColumn}>{order.payment_status}</Cell>
    <Cell className={style.subtotalColumn}>{order.sub_total}</Cell>
    <Cell className={style.discountColumn}>{order.discount_rupees}</Cell>
    <Cell className={style.loayltyColumn}>{order.loyality_point_price}</Cell>
    <Cell className={style.totalColumn}>{order.total}</Cell>
    <Cell className={style.cgstColumn}>{order.cgst}</Cell>
    <Cell className={style.sgstColumn}>{order.sgst}</Cell>
    <Cell className={style.finalRupees}>{order.final_amount}</Cell>
  </div>
);

// The report's table: sortable headings and one row per order.
const ReportTable = ({
  orders,
  currentPage,
  listPerPage,
  columnToSort,
  columnSortingOrder,
  showSortingIcon,
  setShowSortingIcon,
  onSort,
  onView,
}) => {
  const sortProps = { columnToSort, columnSortingOrder, showSortingIcon, setShowSortingIcon, onSort };
  const headings = (list) =>
    list.map((heading) => <SortableHeading key={heading.column} {...heading} {...sortProps} />);

  return (
    <div className={style.orderListSection}>
      <div className={style.tableContainer}>
        <div className={style.table}>
          <div className={style.tableHeadingContainer}>
            <div className={style.sNoColumn}>S.No </div>
            <div className={style.actionColumn}>Action</div>
            {headings(HEADINGS_BEFORE_STATUS)}
            <div className={style.orderStatusColumn}> Order Status</div>
            <div className={style.paymentStatusColumn}>Payment Status</div>
            {headings(HEADINGS_AFTER_STATUS)}
          </div>
          <div className={style.tableDataContainer} style={{ backgroundColor: "#efefef" }}>
            {orders && orders.length > 0 ? (
              orders.map((order, index) => (
                <OrderRow
                  key={index}
                  order={order}
                  index={index}
                  rowNumber={currentPage * listPerPage - listPerPage + index + 1}
                  isLast={orders.length === index + 1}
                  onView={onView}
                />
              ))
            ) : (
              <div style={{ textAlign: "center" }}>No records found!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportTable;
