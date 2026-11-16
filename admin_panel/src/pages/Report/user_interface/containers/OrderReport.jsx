import React, { useEffect } from 'react'
import style from "../style/orderReport.module.css"
import Header from '../../../../components/Header/Header'
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { AiFillCalendar, AiOutlineCalendar, AiOutlineClose, AiOutlineSortAscending } from 'react-icons/ai';
import "../style/checkbox.scss"
import { loadOrderReport, monthDateRange, weekDateRange, yearDateRange, todayDateRange } from '../../services/reportService';
import { useApp } from '../../../../Context/AppContext';
import { useOrderReportState } from "../../usestate/orderReportState";

const OrderReport = () => {
    const { enableHeader } = useApp();
    var {
    fromDate,
    onChangeFrom,
    toDate,
    onChangeTo,
    isAmountSort,
    setAmountSort,
    pageIndex,
    setPageIndex,
    order,
    setOrder,
  } = useOrderReportState();

    useEffect(() => {
        enableHeader()
        postOrderQuery()
    }, [])

    async function postOrderQuery() {
        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;

        const queryData = {
            dateTo: toDate,
            dateFrom: fromDate,
            amountSort: isAmountSort,
            pageIndex: pageIndex
        }
        await loadOrderReport(tenant, queryData).then(r => {
            setOrder(r)
        })
    }

    function setThisMonthDate(value) {
        if (value) {
            document.getElementById("today").checked = false
            document.getElementById("week").checked = false
            document.getElementById("year").checked = false
            var range = monthDateRange()
            onChangeFrom(range.from)
            onChangeTo(range.to)
        }
        else {
            onChangeFrom("")
            onChangeTo("")
        }
    }

    function setThisWeak(value) {
        if (value) {
            document.getElementById("today").checked = false
            document.getElementById("month").checked = false
            document.getElementById("year").checked = false
            var range = weekDateRange()
            onChangeFrom(range.from)
            onChangeTo(range.to)
        }
        else {
            onChangeFrom("")
            onChangeTo("")
        }
    }

    function setThisYear(value) {
        if (value) {
            document.getElementById("today").checked = false
            document.getElementById("month").checked = false
            document.getElementById("week").checked = false

            var range = yearDateRange()
            onChangeFrom(range.from)
            onChangeTo(range.to)
        }
        else {
            onChangeFrom("")
            onChangeTo("")
        }
    }

    function setTodayDate(value) {
        if (value) {
            document.getElementById("month").checked = false
            document.getElementById("week").checked = false
            document.getElementById("year").checked = false

            var range = todayDateRange()
            onChangeFrom(range.from)
            onChangeTo(range.to)
        }
        else {
            onChangeFrom("")
            onChangeTo("")
        }
    }

    return (
            <div className={style.orderContainer}>
                <div className={style.filterContainer}>

                    <div className={style.dateContainer}>
                        <div className={style.toDate}>
                            <div className={style.label}>Date From :</div>
                            <div className={style.label}>Date To :</div>
                        </div>
                        <div className={style.fromDate}>
                            <div className={style.datepicker1}><DatePicker calendarClassName={style.calendar} className={style.dateInput} calendarIcon={<AiOutlineCalendar />} clearIcon={<AiOutlineClose />} onChange={onChangeFrom} value={fromDate} /></div>
                            <div className={style.datepicker1}><DatePicker calendarClassName={style.calendar} className={style.dateInput} calendarIcon={<AiOutlineCalendar />} clearIcon={<AiOutlineClose />} onChange={onChangeTo} value={toDate} /></div>
                        </div>
                    </div>
                    <div className={style.quickSelectConatiner}>
                        <div className={style.quickHeading}>Quick Select</div>
                        <div className={style.quickOptions}>
                            <div className={style.parentSelectContainer}>
                                <div className={style.selectContainer}>
                                    <div><input type="checkbox" defaultChecked={true} id="today" onChange={e => setTodayDate(e.target.checked)} /></div>
                                    <div className={style.label}>Today</div>
                                </div>
                                <div className={style.selectContainer}>
                                    <div><input type="checkbox" id="week" onChange={e => setThisWeak(e.target.checked)} /></div>
                                    <div className={style.label}>This Week</div>
                                </div>
                            </div>
                            <div className={style.parentSelectContainer}>
                                <div className={style.selectContainer}>
                                    <div><input type="checkbox" id="month" onChange={e => setThisMonthDate(e.target.checked)} /></div>
                                    <div className={style.label}>This Month</div>
                                </div>
                                <div className={style.selectContainer}>
                                    <div><input type="checkbox" id="year" onChange={e => setThisYear(e.target.checked)} /></div>
                                    <div className={style.label}>This Year</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={style.BtnContainer}>
                        <button className={style.GenerateBtn} onClick={postOrderQuery}>Generate Report</button>
                    </div>
                </div>

                <div className={style.tabelContainer}>
                    <div className={style.container} >
                        <div className={style.TabelContainer}>

                            <div className={style.table}>
                                <div className={style.tableHeading}>
                                    <div className={style.column1}>Sno</div>
                                    <div className={style.column2}><input type='checkbox' name="Amount" id="Amount" style={{display:"none"}} checked={isAmountSort} onChange={e => { isAmountSort=e.target.checked; setAmountSort(e.target.checked); postOrderQuery() }} /><label className={style.sortingLabel} htmlFor='Amount'><AiOutlineSortAscending className={style.SortIcon}/>Amount</label></div>
                                    <div className={style.column8}>Order no</div>
                                    <div className={style.column3}>Tax</div>
                                    <div className={style.column4}>Date</div>
                                    <div className={style.column5}>Discount</div>
                                    <div className={style.column8}>Loyality discount(rs.)</div>
                                    <div className={style.column6}>Payment Status</div>
                                    <div className={style.column7}>Customer</div>
                                </div>

                                {order && order.length > 0 ?
                                    order.map((item, i) =>
                                        <div className={style.row} >
                                            <div className={style.columnData1}>{i + 1}</div>
                                            <div className={style.columnData2}>{item.total}</div>
                                            <div className={style.columnData8}>{item.order_id}</div>
                                            <div className={style.columnData3}>{item.cgst + item.sgst}</div>
                                            <div className={style.columnData4}>{new Date(item.date).toLocaleDateString() }</div>
                                            <div className={style.columnData5}>{item.manual_discount}</div>
                                            <div className={style.columnData8}>{item.loyality_point_price}</div>
                                            <div className={style.columnData6}>{item.payment_status}</div>
                                            <div className={style.columnData7}>
                                                <button className={style.printBtn} >{item.customer_number}</button>
                                            </div>
                                        </div>
                                    ) : <div className={style.NoItemFound}>
                                        No Items Detected
                                    </div>}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
    )
}

export default OrderReport
