import React from "react";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { AiOutlineCalendar, AiOutlineClose } from "react-icons/ai";
import style from "../style/NewOrderReport.module.css";
import "../style/checkbox.scss";

// One radio button or checkbox with its label. Inputs left without `checked` stay uncontrolled.
const Option = ({ label, ...inputProps }) => (
  <div className={style.selectContainer}>
    <div>
      <input {...inputProps} />
    </div>
    <div className={style.label}>{label}</div>
  </div>
);

const QuickRange = ({ id, label, quickSelect, onChange, controlled = true }) => (
  <Option
    type="radio"
    id={id}
    name="quick_select"
    value={id}
    checked={controlled ? quickSelect[id] : undefined}
    onChange={onChange}
    label={label}
  />
);

const StatusBox = ({ id, label, checked, onChange }) => (
  <Option type="checkbox" id={id} value={label} checked={checked} onChange={onChange} label={label} />
);

const CustomDateRange = ({ startDate, endDate, disable, onFromDate, onToDate }) => (
  <div className={style.dateContainer}>
    <div className={style.toDate}>
      <div className={style.label} style={{ fontFamily: "ui-serif" }}>
        Date From :
      </div>
      <div className={style.label} style={{ fontFamily: "ui-serif" }}>
        Date To :
      </div>
    </div>
    <div className={style.fromDate}>
      <div className={style.datepicker1}>
        <DatePicker
          calendarClassName={style.calendar}
          className={style.dateInput}
          calendarIcon={<AiOutlineCalendar />}
          clearIcon={<AiOutlineClose />}
          onChange={onFromDate}
          value={startDate}
          format="dd/MM/yyyy"
        />
      </div>
      <div className={style.datepicker1}>
        <DatePicker
          calendarClassName={style.calendar}
          className={style.dateInput}
          calendarIcon={<AiOutlineCalendar />}
          clearIcon={<AiOutlineClose />}
          onChange={onToDate}
          value={endDate}
          disabled={disable}
          format="dd/MM/yyyy"
        />
      </div>
    </div>
  </div>
);

// The filter panel of the order report: date range, quick select, order status and payment status.
const ReportFilters = ({
  quickSelect,
  paymentStatus,
  showCustomDates,
  startDate,
  endDate,
  disableToDate,
  onFromDate,
  onToDate,
  onQuickSelect,
  onOrderStatus,
  onPaymentStatus,
}) => (
  <div className={style.filterContainer}>
    {showCustomDates && (
      <CustomDateRange
        startDate={startDate}
        endDate={endDate}
        disable={disableToDate}
        onFromDate={onFromDate}
        onToDate={onToDate}
      />
    )}
    <div className={style.quickSelectConatiner1}>
      <div className={style.quickHeading}>Quick Select</div>
      <div className={style.new}>
        <div className={style.quickOptions}>
          <div className={style.parentSelectContainer}>
            <QuickRange id="today" label="Today" quickSelect={quickSelect} onChange={onQuickSelect} />
            <QuickRange id="week" label="This Week" quickSelect={quickSelect} onChange={onQuickSelect} />
            <QuickRange id="month" label="This Month" quickSelect={quickSelect} onChange={onQuickSelect} />
          </div>
        </div>
        <div className={style.quickOptions1}>
          <div className={style.parentSelectContainer1}>
            <QuickRange id="year" label="This Year" quickSelect={quickSelect} onChange={onQuickSelect} />
            <QuickRange
              id="custom"
              label="Custom"
              quickSelect={quickSelect}
              onChange={onQuickSelect}
              controlled={false}
            />
          </div>
        </div>
      </div>
    </div>

    <div className={style.quickSelectConatiner}>
      <div className={style.quickHeading}>Order Status</div>
      <div className={style.quickOptions}>
        <div className={style.parentSelectContainer}>
          <StatusBox id="placed" label="Placed" onChange={onOrderStatus} />
          <StatusBox id="confirm" label="Confirm" onChange={onOrderStatus} />
          <StatusBox id="served" label="Served" onChange={onOrderStatus} />
        </div>
        <div className={style.parentSelectContainer}>
          <StatusBox id="cancelled" label="Cancelled" onChange={onOrderStatus} />
          <div className={style.selectContainer}>
            <div></div>
            <div className={style.label}></div>
          </div>
        </div>
      </div>
    </div>

    <div className={style.quickSelectConatiner}>
      <div className={style.quickHeading}>Payment Status</div>
      <div className={style.quickOptions1}>
        <div className={style.parentSelectContainer}>
          <StatusBox id="pending" label="Pending" checked={paymentStatus.pending} onChange={onPaymentStatus} />
          <StatusBox id="completed" label="Completed" checked={paymentStatus.completed} onChange={onPaymentStatus} />
        </div>
      </div>
    </div>
  </div>
);

export default ReportFilters;
