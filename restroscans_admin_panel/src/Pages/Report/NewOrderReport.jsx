import React, { useEffect, useState } from 'react'
import style from "./NewOrderReport.module.css"
import Header from '../GlobalComponent/Header'
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { AiFillCalendar, AiFillEye, AiOutlineCalendar, AiOutlineClose, AiOutlineSortAscending, } from 'react-icons/ai';
import "./checkbox.scss"
import { OrderFilterQueryAPI, getOrdersItemDetailApi, getOrderItemsApi, getOrderCount } from '../../Api/services';
import { Message, enableHeader } from '../../App';
import { Modal } from 'antd'
import {
    BsSortAlphaDownAlt, BsSortAlphaDown, BsSortNumericDownAlt, BsSortNumericDown,
} from "react-icons/bs";
import { Pagination } from "antd";
import { MdArrowDropUp } from "react-icons/md";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { useLocation } from 'react-router-dom';


// Added by Rohan Kansari - 1/9/23 - To download report in excel sheet
export const ExportToExcel = ({ apiData, fileName }) => {
    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    
    var filteredData=apiData.map(e=>{
        delete e["last_customer_name"]
        delete Object.assign(e, {"Customer Number": e["customer_number"] })["customer_number"];
        delete Object.assign(e, {"Customer Loyality Point": e["customer_loyality_point"] })["customer_loyality_point"];
        delete Object.assign(e, {"Order Id": e["order_id"] })["order_id"];
        delete Object.assign(e, {"Table Number": e["table_number"] })["table_number"];
        delete Object.assign(e, {"Sub Total": e["sub_total"] })["sub_total"];
        delete Object.assign(e, {"Total": e["total"] })["total"];
        delete Object.assign(e, {"CGST": e["cgst"] })["cgst"];
        delete Object.assign(e, {"SGST": e["sgst"] })["sgst"];
        delete Object.assign(e, {"Order Status": e["order_status"] })["order_status"];
        delete Object.assign(e, {"Payment Status": e["payment_status"] })["payment_status"];
        delete Object.assign(e, {"Date": e["date"] })["date"]
        delete Object.assign(e, {"Payment Mode": e["payment_mode"] })["payment_mode"]
        delete Object.assign(e, {"Discount Rupees": e["discount_rupees"] })["discount_rupees"]
        delete Object.assign(e, {"Discount Percentage": e["discount_percentage"] })["discount_percentage"]
        delete e["discount_reason"]
        delete Object.assign(e, {"Final Amount": e["final_amount"] })["final_amount"]
        delete e["review"]
        delete e["rating"]
        delete Object.assign(e, {"Payment Confirmation Date Time": e["payment_confirmation_date_time"] })["payment_confirmation_date_time"]
        delete Object.assign(e, {"Cancelled By": e["cancelled_by"] })["cancelled_by"]
        delete Object.assign(e, {"Cancel Reason": e["cancel_reason"] })["cancel_reason"]
        delete Object.assign(e, {"Apply Loyality Point": e["apply_loyality_point"] })["apply_loyality_point"]
        delete Object.assign(e, {"Loyality Point Price": e["loyality_point_price"] })["loyality_point_price"]
        delete e["loyality_point_status"]
        delete e["loyality_point_calculated"]
        delete e["send_notifications_on_order_update"]
        delete e["send_notifications_on_payment_update"]
        delete e["send_notifications_on_amount_update"]
        delete e["send_notification_on_tableNum_update"]
        delete Object.assign(e, {"Customer Name": e["customer_name"] })["customer_name"]
        delete Object.assign(e, {"Customer Email": e["customer_email"] })["customer_email"]
        delete Object.assign(e, {"Customer Id": e["customer_id"] })["customer_id"]
               
        return e;
    })
    
    const exportToCSV = (filteredData, fileName) => {
        if(filteredData.length){
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
        }else{
            Message("No Data is Found","warning")
        }
    };
    return (
        <button className={style.PrintBtn} onClick={(e) => exportToCSV(apiData, fileName)}>Export</button>
    );
};
// End of code addition - Rohan kansari - 1/9/23 - To download data in excel sheet

const NewOrderReport = () => {

    // Added by :- Parineeta Gedam on 04-08-2023 reason :- foe showing the order serial no and order item serial umber
    var i = 1;
    var orderItemsSerialNo = 1;
    var backgroundColor = 1;
    // End of Added by :- Parineeta Gedam on 04-08-2023 reason :- foe showing the order serial no and order item serial umber

    // Commented and modified by :- PArineeta Gedam on 04-08-2023
    // Reason :- first time show the data from this year
    var currentDate2 = new Date;
    var currentDate3 = new Date;
    // const [fromDate, onChangeFrom] = useState(new Date());
    // const [toDate, onChangeTo] = useState(new Date());
    // const [fromDate, onChangeFrom] = useState(new Date(currentDate2.setDate(currentDate2.getDate() - currentDate2.getDay() - 365)));
    // const [toDate, onChangeTo] = useState(new Date(currentDate3.setDate(currentDate3.getDate() - currentDate3.getDay())));
    // Commented and modified by :- PArineeta Gedam on 04-08-2023
    // Reason :- first time show the data from this year

    // ===========================================
    var [quickSelect, setQuickSelect] = useState({
        today: false,
        week: false,
        month: false,
        year: true,
    });

    // Modofication by ROhan kansari - 19/8/23
    // Reason - To set date by Default null
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    //ENd of Modification by ROhan kansari - 19/8/23
    // Reason - To set date by Default null

    // ============================================

    var [isAmountSort, setAmountSort] = useState(false)
    const [pageIndex, setPageIndex] = useState(1)
    const [order, setOrder] = useState(null)

    // Modified by :- Parineeta Gedam on 06-09-2023 reason :- apply multiple filter
    // Added by :- Parineeta Gedam on 02-08-2023
    // Reason :- set the order status
    // const [orderStatus, setOrderStatus] = useState("")
    const [orderStatus, setOrderStatus] = useState({
        placed: false,
        confirm: false,
        cooked: false,
        served: false,
        cancelled: false,
    })  
    // End of Added code by :- Parineeta Gedam on 02-08-2023
    // Reason :- set the order status
    // Modified by :- Parineeta Gedam on 06-09-2023 reason :- apply multiple filter


    // Modified by :- Parineeta Gedam on 06-09-2023 reason :- apply multiple filter 
    // Added by :- Parineeta Gedam on 02-08-2023
    // Reason :- set the order status
    // const [paymentStatus, setPaymentStatus] = useState("Completed")
    var [paymentStatus, setPaymentStatus] = useState({
        pending: false,
        completed: true,
    })

    // End of Added code by :- Parineeta Gedam on 02-08-2023
    // Reason :- set the order status

    // Added by :- Parineeta Gedam on 02-08-2023
    // Reason :- sorting by order no
    var [isOrderNoSort, setOrderNoSort] = useState(false)
    // End of Added code by :- Parineeta Gedam on 02-08-2023
    // Reason :-  sorting by order no

    // Added by :- Parineeta Gedam on 05-08-2023
    // Reason :- used for shorting 
    const [showSortingIcon, setShowSortingIcon] = useState(false);
    const [columnToSort, setColumnToSort] = useState("order_id");
    const [columnSortingOrder, setColumnSortingOrder] = useState("descending");
    // End of Added code by :- Parineeta Gedam on 05-08-2023
    // Reason :-  used for shorting 

    // Added by :- Parineeta Gedam on 05-08-2023
    // Reason :- used for paginations
    const [listPerPage, setListPerPage] = useState(localStorage.getItem("listPerPage"));

    var [currentPage, setCurrentPage] = useState(1);
    const [backendOrderCount, setOrderCount] = useState(0);
    
    // Added by Rohan kansari - 1/9/23 - To set all data of report list
    const [allReportData,setAllReportData]=useState([])
    // ENd of code - Rohan kansari - 1/9/23 - To set all data of report list

    // End of Added code by :- Parineeta Gedam on 05-08-2023
    // Reason :-  used for paginations

     const state=useLocation()
    // Added By Parineeta Gedam on 05-08-2023
    // Reason - To set global Page index Whenever its index updated
    useEffect(() => {
        enableHeader()
        if (localStorage.getItem("globalPageIndex")) {
            currentPage = parseInt(localStorage.getItem("globalPageIndex"))
            setCurrentPage(parseInt(localStorage.getItem("globalPageIndex")))
        }

        // Added by Rohan kansari - 28/8/23 - 
        // if filter data is coming from other page through navigation so set it of filter
        if(state.state){
        quickSelect=state.state
        setQuickSelect({...state.state})
        paymentStatus={
            pending: false,
            completed: false,
        }
        setPaymentStatus({
            pending: false,
            completed: false,
        })
        }
        // End of code addition by Rohan kansari - 28/8/23 
        // if filter data is coming from other page through navigation so set it of filter
    }, [])
    // Added By Parineeta Gedam on 05-08-2023
    // Reason - To set global Page index Whenever its index updated

    useEffect(() => {
        getCountofOrder();
        postOrderQuery();
    }, []);

    const getCountofOrder = async () => {
        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
        const response = await getOrderCount(tenant);
        setOrderCount(response.orderCount);
    };


    // Commented by :- Parineeta Gedam on 05-08-2023 reason :- update the useEffect calling
    // useEffect(() => {
    //     // Added By Rohan Kansari - 25/6/23
    //     // Reason - To enable headerSiderbar
    //     enableHeader()
    //     // End of code - Rohan kansari - 25/6/23
    //     postOrderQuery()
    // }, [])
    // End of Commented Code by :- Parineeta Gedam on 05-08-2023 reason :- update the useEffect calling

    // Added by :- Parineeta Gedam on 05-08-2023 reason :- update the useEffect calling for sorting filter
    useEffect(() => {
        enableHeader()
        postOrderQuery()
        localStorage.setItem("globalPageIndex", currentPage)
    }, [columnToSort, columnSortingOrder, currentPage, listPerPage,])
    // End of Added Code by :- Parineeta Gedam on 05-08-2023 reason :- update the useEffect calling for sorting and filter

    async function postOrderQuery() {
        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
        // Added by :-Parineeta Gedam on 05-08-2023
        // reason :- making a data for sorting and paginations
        const paginationDetails = {
            currentPage: currentPage,
            listPerPage: listPerPage,
        };

        // End of Added code by :-Parineeta Gedam on 05-08-2023
        // reason :- making a data for sorting and paginations
        const queryData = {
            // dateTo: toDate,
            // dateFrom: fromDate,
            amountSort: isAmountSort,
            pageIndex: pageIndex,

            // Added by :- Parineeta Gedam on 03-08-2023 
            // reason :- arrange the data in key value pair. 
            quickSelect: quickSelect,
            startDate: startDate,
            endDate: endDate,
            paginationDetails: paginationDetails,
            columnToSort: columnToSort,
            columnSortingOrder: columnSortingOrder,
            paymentStatus: paymentStatus,
            orderStatus: orderStatus,
            // End of Added by :- Parineeta Gedam on 03-08-2023 
            // reason :- arrange the data in key value pair. 

        }
        console.log(queryData)
        await OrderFilterQueryAPI(tenant, queryData).then(r => {
            setOrder(r)
            console.log(r)

            setOrder(r.orderList)
            setOrderCount(r.orderListCount)
            // Added by Rohan kansari - 1/9/23 - To set all order report 
            setAllReportData(r.allReportList)
        })
    }

    // function setThisMonthDate(value) {
    //     if (value) {
    //         document.getElementById("today").checked = false
    //         document.getElementById("week").checked = false
    //         document.getElementById("year").checked = false
    //         var date = new Date();
    //         var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    //         var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    //         onChangeFrom(firstDay)
    //         onChangeTo(lastDay)
    //     }
    //     else {
    //         onChangeFrom("")
    //         onChangeTo("")
    //     }
    // }

    // function setThisWeak(value) {
    //     if (value) {
    //         document.getElementById("today").checked = false
    //         document.getElementById("month").checked = false
    //         document.getElementById("year").checked = false
    //         var curr = new Date;
    //         var first = curr.getDate() - curr.getDay();
    //         var last = first - 6;

    //         var firstday = new Date(curr.setDate(first));
    //         var lastday = new Date(curr.setDate(last));
    //         onChangeFrom(lastday)
    //         onChangeTo(firstday)
    //     }
    //     else {
    //         onChangeFrom("")
    //         onChangeTo("")
    //     }
    // }

    // function setThisYear(value) {
    //     if (value) {
    //         document.getElementById("today").checked = false
    //         document.getElementById("month").checked = false
    //         document.getElementById("week").checked = false

    //         var curr = new Date;
    //         var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
    //         var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() - 365));

    //         onChangeFrom(lastday)
    //         onChangeTo(firstday)
    //     }
    //     else {
    //         onChangeFrom("")
    //         onChangeTo("")
    //     }
    // }

    // function setTodayDate(value) {

    //     if (value) {
    //         document.getElementById("month").checked = false
    //         document.getElementById("week").checked = false
    //         document.getElementById("year").checked = false
    //         var curr = new Date();
    //         var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
    //         var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
    //         // var firstday = new Date();
    //         // var lastday = new Date();
    //         onChangeFrom(lastday)
    //         onChangeTo(firstday)
    //     }
    //     else {
    //         onChangeFrom("")
    //         onChangeTo("")
    //     }
    // }

    // ================================================
    const [disable, setDisable] = useState(true);
    const [customeDisable, setcustomDisable] = useState(false);


    const handleChangeFromDate = (value) => {
        setEndDate("")
        setStartDate(value)
        // modified by Rohan kansari - 21/8/23
        // Reason - To dont save end date in time of from date set
        // setEndDate(value)
        setDisable(false)
    };

    const handleChangeToDate = (value) => {
        setEndDate(value)
    };

    function handleCustomSelect(e) {
        setcustomDisable(true);
    }

    const handleQuickSelect = (e) => {
        if (e == "today") {
            setcustomDisable(false)
            setStartDate("")
            setEndDate("")
            if (document.getElementById("today").checked == true) {
                setQuickSelect((select) => {
                    select.today = true
                    select.week = false
                    select.month = false
                    select.year = false
                    select.custom = false
                    return { ...select }
                })
            }
        }
        if (e == "week") {
            setcustomDisable(false)
            setStartDate("")
            setEndDate("")
            if (document.getElementById("week").checked == true) {
                setQuickSelect((select) => {
                    select.week = true
                    select.today = false
                    select.month = false
                    select.year = false
                    select.custom = false
                    return { ...select }
                })
            }
        }
        if (e == "month") {
            setcustomDisable(false)
            setStartDate("")
            setEndDate("")
            if (document.getElementById("month").checked == true) {
                setQuickSelect((select) => {
                    select.month = true
                    select.week = false
                    select.today = false
                    select.year = false
                    select.custom = false
                    return { ...select }
                })
            }
        }
        if (e == "year") {
            setcustomDisable(false)
            setStartDate("")
            setEndDate("")
            if (document.getElementById("year").checked == true) {
                setQuickSelect((select) => {
                    select.year = true
                    select.today = false
                    select.week = false
                    select.month = false
                    select.custom = false
                    return { ...select }
                })
            }
        }
        if (e == "custom") {
            setcustomDisable(true)
            if (document.getElementById("custom").checked == true) {
                setQuickSelect((select) => {
                    select.custom = true
                    select.year = false
                    select.today = false
                    select.week = false
                    select.month = false
                    return { ...select }
                })
            }
        }

    }
    // ================================================

    // Modified by :- Parineeta Gedam on 06-08-2023 reason :- apply multiple filters
    // Added by :- Parineeta Gedam on 05-08-2023 
    // reason :- if change the order status then call this handleChnageOrderStatus method for set the order status.
    function handleOrderStatus(e) {
        console.log("e", e)
        if (e == "Placed") {
            if (document.getElementById("placed").checked == true) {
                setOrderStatus((orderStatus) => {
                    orderStatus.placed = true
                    return { ...orderStatus }
                })
            } else {
                setOrderStatus((orderStatus) => {
                    orderStatus.placed = false
                    return { ...orderStatus }
                })
            }
        }
        if (e == "Confirm") {
            if (document.getElementById("confirm").checked == true) {
                setOrderStatus((orderStatus) => {
                    orderStatus.confirm = true
                    return { ...orderStatus }
                })
            } else {
                setOrderStatus((orderStatus) => {
                    orderStatus.confirm = false
                    return { ...orderStatus }
                })
            }
        }
        if (e == "Cooked") {
            if (document.getElementById("cooked").checked == true) {
                setOrderStatus((orderStatus) => {
                    orderStatus.cooked = true
                    return { ...orderStatus }
                })
            } else {
                setOrderStatus((orderStatus) => {
                    orderStatus.cooked = false
                    return { ...orderStatus }
                })
            }
        }
        if (e == "Served") {
            if (document.getElementById("served").checked == true) {
                setOrderStatus((orderStatus) => {
                    orderStatus.served = true
                    return { ...orderStatus }
                })
            } else {
                setOrderStatus((orderStatus) => {
                    orderStatus.served = false
                    return { ...orderStatus }
                })
            }
        }
        if (e == "Cancelled") {
            if (document.getElementById("cancelled").checked == true) {
                setOrderStatus((orderStatus) => {
                    orderStatus.cancelled = true
                    return { ...orderStatus }
                })
            } else {
                setOrderStatus((orderStatus) => {
                    orderStatus.cancelled = false
                    return { ...orderStatus }
                })
            }
        }
    }
    // End of Added code by :- Parineeta Gedam on 05-08-2023 
    // reason :- if change the order status then call this handleChnageOrderStatus method for set the order status. 
    // Modified by :- Parineeta Gedam on 06-08-2023 reason :- apply multiple filters

    // Added by :- Parineeta Gedam on 06-08-2023 
    // reason :- if change the payment status then call this handleChnagePaymentStatus method for set the payment status.
    // Added by :- Parineeta Gedam on 05-08-2023 
    // reason :- if change the payment status then call this handleChnagePaymentStatus method for set the payment status.
    function handlePaymentStatus(e) {
        console.log("e", e)
        if (e == "Pending") {
            if (document.getElementById("pending").checked == true) {
                setPaymentStatus((paymentStatus) => {
                    paymentStatus.pending = true
                    return { ...paymentStatus }
                })
            }
            else {
                setPaymentStatus((paymentStatus) => {
                    paymentStatus.pending = false
                    return { ...paymentStatus }
                })
            }
        }
        if (e == "Completed") {
            if (document.getElementById("completed").checked == true) {
                setPaymentStatus((paymentStatus) => {
                    paymentStatus.completed = true
                    return { ...paymentStatus }
                })
            }
            else {
                document.getElementById("completed").checked = false
                setPaymentStatus((paymentStatus) => {
                    paymentStatus.completed = false
                    return { ...paymentStatus }
                })
            }
        }
    }
    // End of Added code by :- Parineeta Gedam on 05-08-2023 
    // reason :- if change the payment status then call this handleChnagePaymentStatus method for set the payment status.
    // End of Added code by :- Parineeta Gedam on 06-08-2023 

    // Added by Parineeta Gedam on 03-08-2023 
    // Reason - To open selected orders in the modal of more button in the action of dashboard
    const [orderByOrderId, setOrderByOrderId] = useState({})
    // End of code - Parineeta Gedam on 03-08-2023 

    // Added by :- Parineeta Gedam on 03-08-2023 
    // reason :- if we click on eye icon then model will be open
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = (data) => {
        setOrderByOrderId({ ...{ "order_detail": data } });
        setIsModalOpen(true);
        allOrderItems(data.id)
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    // End of Added code by :- Parineeta Gedam on 03-08-2023 
    // reason :- if we click on eye icon then model will be open

    // Added by :- Parineeta Gedam on 03-08-2023 
    // reason :- if we click on eye icon then model will be open and order items will be get
    const [orderItems, setOrderItems] = useState([]);
    const allOrderItems = async (id) => {
        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
        var response = await getOrderItemsApi(tenant, id);
        if (response.msg) {
            setOrderItems(response.orderItems);
        }
    }
    // End of Added code by :- Parineeta Gedam on 03-08-2023 
    // reason :- if we click on eye icon then model will be open and order items will be get

    // Added code by :- Parineeta Gedam on 04-08-2023 
    // reason :- date validations
    function ExtractDateTime(format) {
        var d = new Date(format);
        var date = format.substring(0, 10).split('-').reverse().join('/')
        var time = format.substring(11, 19)
        return { date, time }
    }
    // End of Added code by :- Parineeta Gedam on 04-08-2023 
    // reason :- date validations


    // Added by :- Parineeta Gedam on 05-08-2023 
    // Reason :- for sorting the order no

    const sortOrderId = (columnName) => {
        if (columnToSort == columnName) {
            if (columnSortingOrder == "descending") {
                setColumnSortingOrder("ascending");
            } else {
                setColumnSortingOrder("descending");
            }
        }
        setColumnToSort(columnName);
    };
    // End of Added by :- Parineeta Gedam on 05-08-2023 
    // Reason :- for sorting the order no

    /**
   * Added by - Parineeta Gedam on 05-08-2023
   * Reason -  When user changes page number, this method will set page number which will be sent to backend.
   */
    const handlePageChange = async (pageNumber) => {
        localStorage.setItem("globalPageIndex", pageNumber)
        setCurrentPage(pageNumber);
    };
    /**
     * End of code addition by - PArineeta Gedam on 05-08-2023
     * Reason -  When user changes page number, this method will set page number which will be sent to backend.
     */

    // Added by PArineeta gedam on 05-08-2023
    // Reason - To toggle dropdown visiblity on click
    function toggelDropdown() {
        if (document.getElementById("dropdown").style.display.length == 0)
            document.getElementById("dropdown").style.display = "block"
        else
            document.getElementById("dropdown").style.display = ""
    }

    function hideDropdown() {
        document.getElementById("dropdown").style.display = ""
    }
    // End of Added code by PArineeta gedam on 05-08-2023

    return (
        // Modified by Rohan Kansari - 25/6/23
        // Reason - removing header from each page and making it global
        // <Header>
        <div className={style.orderContainer}>
            <div className={style.filterContainer}>
                {/* FIlter 3 */}
                {customeDisable === true && (
                    <div className={style.dateContainer}>
                        <div className={style.toDate}>
                            <div className={style.label} style={{ fontFamily: "ui-serif" }}>Date From :</div>
                            <div className={style.label} style={{ fontFamily: "ui-serif" }}>Date To :</div>
                        </div>
                        <div className={style.fromDate}>
                            {/* <div className={style.datepicker1}><DatePicker calendarClassName={style.calendar} className={style.dateInput} calendarIcon={<AiOutlineCalendar />} clearIcon={<AiOutlineClose />} onChange={onChangeFrom} value={fromDate} format="dd/MM/yyyy" /></div>
                       <div className={style.datepicker1}><DatePicker calendarClassName={style.calendar} className={style.dateInput} calendarIcon={<AiOutlineCalendar />} clearIcon={<AiOutlineClose />} onChange={onChangeTo} value={toDate} format="dd/MM/yyyy" /></div> */}
                            <div className={style.datepicker1}><DatePicker calendarClassName={style.calendar} className={style.dateInput} calendarIcon={<AiOutlineCalendar />} clearIcon={<AiOutlineClose />} onChange={handleChangeFromDate} value={startDate} format="dd/MM/yyyy" /></div>
                            <div className={style.datepicker1}><DatePicker calendarClassName={style.calendar} className={style.dateInput} calendarIcon={<AiOutlineCalendar />} clearIcon={<AiOutlineClose />} onChange={handleChangeToDate} value={endDate} disabled={disable} format="dd/MM/yyyy" /></div>
                        </div>
                    </div>
                )}
                {/* Modified by Rohan kansari - 28/8/23 - To modify checkbox and radio button to checked according to usestate value */}
                <div className={style.quickSelectConatiner}>
                    <div className={style.quickHeading}>Quick Select</div>
                    <div className={style.quickOptions}>
                        <div className={style.parentSelectContainer}>
                            <div className={style.selectContainer}>
                                {/* Commented and modified by :- Parineeta Gedam on 03-08-2023 reason :- remove the default checked */}
                                {/* <div><input type="checkbox" defaultChecked={true} id="today" onChange={e => setTodayDate(e.target.checked)} /></div> */}
                                {/* <div><input type="checkbox" id="today" onChange={e => setTodayDate(e.target.checked)} /></div> */}
                                <div><input type="radio" id="today" name="quick_select" value="today" checked={quickSelect.today} onChange={e => handleQuickSelect(e.target.value)} /></div>
                                {/* Commented and modified by :- Parineeta Gedam on 03-08-2023 reason :- remove the default checked */}
                                <div className={style.label}>Today</div>
                            </div>
                            <div className={style.selectContainer}>
                                <div>
                                    {/* <input type="checkbox" id="week" onChange={e => setThisWeak(e.target.checked)} /> */}
                                    <input type="radio" id="week" name="quick_select" value="week" checked={quickSelect.week} onChange={e => handleQuickSelect(e.target.value)} />
                                </div>
                                <div className={style.label}>This Week</div>
                            </div>
                            <div className={style.selectContainer}>
                                <div>
                                    {/* <input type="checkbox" id="week" onChange={e => setThisWeak(e.target.checked)} /> */}
                                    <input type="radio" id="custom" name="quick_select" value="custom" onChange={e => handleQuickSelect(e.target.value)} />
                                </div>
                                <div className={style.label}>Custom</div>
                            </div>
                        </div>
                        <div className={style.parentSelectContainer}>
                            <div className={style.selectContainer}>
                                <div>
                                    {/* <input type="checkbox" id="month" onChange={e => setThisMonthDate(e.target.checked)} /> */}
                                    <input type="radio" id="month" name="quick_select" value="month" checked={quickSelect.month} onChange={e => handleQuickSelect(e.target.value)} />
                                </div>
                                <div className={style.label}>This Month</div>
                            </div>
                            <div className={style.selectContainer}>
                                <div>
                                    {/* <input type="checkbox" id="year" defaultChecked={true} onChange={e => setThisYear(e.target.checked)} /> */}
                                    <input type="radio" id="year" name="quick_select" value="year" checked={quickSelect.year}  onChange={e => {
                                        handleQuickSelect(e.target.value);
                                        // Modofication by ROhan kansari - 19/8/23
                                        // Reason - dont open date 
                                        // handleCustomSelect(e)
                                    }} />
                                </div>
                                <div className={style.label}>This Year</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Added by :- Parineeta Gedam on 02-08-2023 
                    reason :- Add filter by order status */}
                <div className={style.quickSelectConatiner}>
                    <div className={style.quickHeading}>Order Status</div>
                    <div className={style.quickOptions}>
                        <div className={style.parentSelectContainer}>
                            <div className={style.selectContainer}>
                                <div><input type="checkbox" id="placed" value="Placed" onChange={e => handleOrderStatus(e.target.value)} /></div>
                                <div className={style.label}>Placed</div>
                            </div>
                            <div className={style.selectContainer}>
                                <div><input type="checkbox" id="confirm" value="Confirm" onChange={e => handleOrderStatus(e.target.value)} /></div>
                                <div className={style.label}>Confirm</div>
                            </div>
                            <div className={style.selectContainer}>
                                <div><input type="checkbox" id="cancelled" value="Cancelled" onChange={e => handleOrderStatus(e.target.value)} /></div>
                                <div className={style.label}>Cancelled</div>
                            </div>
                        </div>
                        <div className={style.parentSelectContainer}>
                            <div className={style.selectContainer}>
                                <div><input type="checkbox" id="cooked" value="Cooked" onChange={e => handleOrderStatus(e.target.value)} /></div>
                                <div className={style.label}>Cooked</div>
                            </div>
                            <div className={style.selectContainer}>
                                <div><input type="checkbox" id="served" value="Served" onChange={e => handleOrderStatus(e.target.value)} /></div>
                                <div className={style.label}>Served</div>
                            </div>
                            <div className={style.selectContainer}>
                                <div></div>
                                <div className={style.label}></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End of Added by :- Parineeta Gedam on 02-08-2023 
                    reason :- Add filter by order status */}

                {/* Added by :- Parineeta Gedam on 02-08-2023 
                    reason :- Add filter by Payment status */}
                <div className={style.quickSelectConatiner}>
                    <div className={style.quickHeading}>Payment Status</div>
                    <div className={style.quickOptions}>
                        <div className={style.parentSelectContainer}>
                            <div className={style.selectContainer}>
                                <div><input type="checkbox" id="pending" value="Pending"
                                checked={paymentStatus.pending} onChange={e => handlePaymentStatus(e.target.value)} /></div>
                                <div className={style.label}>Pending</div>
                            </div>
                            <div className={style.selectContainer}>
                                <div><input type="checkbox" id="completed"
                                    checked={paymentStatus.completed}
                                    value="Completed" onChange={e => handlePaymentStatus(e.target.value)} /></div>
                                <div className={style.label}>Completed</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End of Added by :- Parineeta Gedam on 02-08-2023 
                    reason :- Add filter by Payment status */}
            </div>
            {/* End of Modification by Rohan kansari - 28/8/23 - To modify checkbox and radio button to checked according to usestate value */}

            {/* Added by :- Parineeta Gedam on 02-08-2023 
                    reason :- change the positions of button */}
            <div className={style.buttonSelectConatiner}>
                <div className={style.BtnContainer}>
                    <button className={style.GenerateBtn} onClick={postOrderQuery}>Generate Report</button>
                </div>
                <div className={style.BtnContainer}>
                 {/* Added by Rohan Kansari - 1/9/23 - To download report in excel sheet */}
                    <ExportToExcel apiData={allReportData} fileName="MyFile" />
                    {/* <button className={style.PrintBtn}>Print Report</button> */}
                 {/* End of Addition by Rohan Kansari - 1/9/23 - To download report in excel sheet */}
   
                </div>
            </div>
            {/* End of Added by :- Parineeta Gedam on 02-08-2023 
                    reason :- change the positions of button */}

            {/*============================================================================================= */}
            <div className={style.orderListSection} >
                <div className={style.tableContainer}>
                    {/* Modified by Rohan kansari - 26/8/23 
                        Reason - To give heading according to column name size*/}
                    <div className={style.table}>
                        <div className={style.tableHeadingContainer}
                        // Added by Rohan Kansari - 22/6/23
                        // Reason- To hide page size dropdown on outer click
                        // onClick={hideDropdown}
                        // onTouchStart={hideDropdown}
                        // End of code - ROhan KAnsari - 22/6/23
                        >
                            {/* Modified by Rohan kansari - 25/8/23 
                                Reason - To change column width according to columns needs*/}
                            <div
                                // className={`${style.commonColumnTitle} ${style.smallColumnWidth} ${style.sNoColumn}`}
                                className={style.sNoColumn}
                            >
                                S.No{" "}
                            </div>
                            <div
                                // className={`${style.commonColumnTitle} ${style.smallColumnWidth}`}
                                className={style.actionColumn}
                            >
                                Action
                            </div>
                            <div
                                // className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                                className={style.OrderIdColumn}
                                onClick={(e) => {
                                    setShowSortingIcon(false);
                                    sortOrderId("order_id");
                                }}
                                onMouseEnter={(e) => {
                                    if (columnToSort != "order_id") {
                                        setShowSortingIcon(true);
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (columnToSort != "order_id") {
                                        setShowSortingIcon(false);
                                    }
                                }}
                            >
                                Order ID{" "}
                                {columnToSort == "order_id" &&
                                    columnSortingOrder == "ascending" && (
                                        <BsSortNumericDown className={style.sortingIcon} />
                                    )}
                                {columnToSort == "order_id" &&
                                    columnSortingOrder == "descending" && (
                                        <BsSortNumericDownAlt className={style.sortingIcon} />
                                    )}
                                {columnToSort != "order_id" && showSortingIcon && (
                                    <BsSortNumericDown
                                        color="grey"
                                        className={style.sortingIcon}
                                    />
                                )}
                            </div>
                            {/* End of modifciation by Om Shrivastava on 21-06-23 */}
                            <div
                                // className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                                className={style.tableNoColumn}

                            //   onClick={(e) => {
                            //     setShowSortingIcon(false);
                            //     sortOrderId("table_number");
                            //   }}
                            //   onMouseEnter={(e) => {
                            //     if (columnToSort != "table_number") {
                            //       setShowSortingIcon(true);
                            //     }
                            //   }}
                            //   onMouseLeave={(e) => {
                            //     if (columnToSort != "table_number") {
                            //       setShowSortingIcon(false);
                            //     }
                            //   }}
                            >
                                Table No{" "}
                                {/* {columnToSort == "table_number" &&
                                    columnSortingOrder == "ascending" && (
                                        <BsSortNumericDown className={style.sortingIcon} />
                                    )}
                                {columnToSort == "table_number" &&
                                    columnSortingOrder == "descending" && (
                                        <BsSortNumericDownAlt className={style.sortingIcon} />
                                    )}
                                {columnToSort != "table_number" && showSortingIcon && (
                                    <BsSortNumericDown
                                        color="grey"
                                        className={style.sortingIcon}
                                    />
                                )} */}
                            </div>
                            <div
                                // className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                                className={style.dateColumn}
                            //   onClick={(e) => {
                            //     setShowSortingIcon(false);
                            //     sortOrderId("date");
                            //   }}
                            //   onMouseEnter={(e) => {
                            //     if (columnToSort != "date") {
                            //       setShowSortingIcon(true);
                            //     }
                            //   }}
                            //   onMouseLeave={(e) => {
                            //     if (columnToSort != "date") {
                            //       setShowSortingIcon(false);
                            //     }
                            //   }}
                            >
                                Date
                                {/* {columnToSort == "date" &&
                                    columnSortingOrder == "ascending" && (
                                    <BsSortNumericDown className={style.sortingIcon} />
                                    )}
                                {columnToSort == "date" &&
                                    columnSortingOrder == "descending" && (
                                    <BsSortNumericDownAlt className={style.sortingIcon} />
                                    )}
                                {columnToSort != "date" && showSortingIcon && (
                                    <BsSortNumericDown
                                    color="grey"
                                    className={style.sortingIcon}
                                    /> */}
                                {/* )} */}
                            </div>

                            <div
                                // className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                                className={style.orderStatusColumn}

                            //   onClick={(e) => {
                            //     setShowSortingIcon(false);
                            //     sortOrderId("order_status");
                            //   }}
                            //   onMouseEnter={(e) => {
                            //     if (columnToSort != "order_status") {
                            //       setShowSortingIcon(true);
                            //     }
                            //   }}
                            //   onMouseLeave={(e) => {
                            //     if (columnToSort != "order_status") {
                            //       setShowSortingIcon(false);
                            //     }
                            //   }}

                            > Order Status
                                {/* {columnToSort == "order_status" &&
                                columnSortingOrder == "ascending" && (
                                <BsSortAlphaDown className={style.sortingIcon} />
                                )}
                            {columnToSort == "order_status" &&
                                columnSortingOrder == "descending" && (
                                <BsSortAlphaDownAlt className={style.sortingIcon} />
                                )}
                            {columnToSort != "order_status" && showSortingIcon && (
                                <BsSortAlphaDown
                                color="grey"
                                className={style.sortingIcon}
                                />
                            )} */}

                            </div>

                            <div
                                // className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                                className={style.paymentStatusColumn}
                            // Added by Om Shrivatava on 16-06-23
                            // Reason : Apply sorting through the payment status
                            //   onClick={(e) => {
                            //     setShowSortingIcon(false);
                            //     sortOrderId("payment_status");
                            //   }}
                            //   onMouseEnter={(e) => {
                            //     if (columnToSort != "payment_status") {
                            //       setShowSortingIcon(true);
                            //     }
                            //   }}
                            //   onMouseLeave={(e) => {
                            //     if (columnToSort != "payment_status") {
                            //       setShowSortingIcon(false);
                            //     }
                            //   }}
                            // End of addition by Om Shrivastava on 16-06-23
                            >
                                Payment Status
                                {/* // Added by Om Shrivatava on 16-06-23
                                    // Reason : Apply sorting through the payment status */}
                                {/* {columnToSort == "payment_status" &&
                                        columnSortingOrder == "ascending" && (
                                        <BsSortAlphaDown className={style.sortingIcon} />
                                        )}
                                    {columnToSort == "payment_status" &&
                                        columnSortingOrder == "descending" && (
                                        <BsSortAlphaDownAlt className={style.sortingIcon} />
                                        )}
                                    {columnToSort != "payment_status" && showSortingIcon && (
                                        <BsSortAlphaDown
                                        color="grey"
                                        className={style.sortingIcon}
                                        />
                                    )} */}
                                {/* // End of addition by Om Shrivastava on 16-06-23 */}

                            </div>
                            <div
                                // className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                                className={style.subtotalColumn}
                            >
                                Sub Total
                            </div>
                            <div
                                // className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                                className={style.discountColumn}
                            >
                                Discount
                            </div>
                            <div 
                            // className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                            className={style.loayltyColumn}
                            >
                                Loyality
                            </div>
                            <div 
                            // className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                            className={style.totalColumn}
                            >
                                Total
                            </div>
                            <div 
                            // className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                            className={style.cgstColumn}
                            >
                                CGST
                            </div>
                            <div 
                            // className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                            className={style.sgstColumn}
                            >
                                SGST
                            </div>
                            <div 
                            // className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                            className={style.finalRupees}
                            >
                                Final Amount
                            </div>


                        </div>
                        {/* End of addition by Om shrivastava on 01-07-23 */}
                        <div
                            className={style.tableDataContainer}
                            style={{
                                backgroundColor: "#efefef",
                            }}
                        // Added by Rohan Kansari - 22/6/23
                        // Reason- To hide page size dropdown on outer click
                        // onClick={hideDropdown}
                        // onTouchStart={hideDropdown}
                        // End of code - ROhan KAnsari - 22/6/23
                        >
                            {order && order.length > 0 ? (
                                order.map((orderDetail, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={style.tableData}
                                            style={{
                                                padding: "2px",
                                                marginTop: "2px",
                                                marginBottom:
                                                    order.length == index + 1 ? "2px" : "0px",
                                                // Added by :- Parineeta Gedam on 06-08-2023 reason :- Add color in rows.
                                                background: backgroundColor++ % 2 == 0 ? "white" : "#1677ff14",
                                                // End of Added by :- Parineeta Gedam on 06-08-2023 reason :- Add color in rows.
                                            }}
                                        >
                                            <div
                                                // className={`${style.commonColumnData} ${style.sNoColumn}`}
                                                className={`${style.sNoColumn} ${style.commonColumnData} `}
                                            >
                                                {/* Added by Parineeta Gedam - 05/08/23 
                                                Reason - Serial no. impact from list perpage so i set serial no. according to list per page */}
                                                {(currentPage * listPerPage - listPerPage) + index + 1}
                                                {/* {(currentPage * listPerPage - listPerPage) + index + 1} */}
                                                {/* End of code - Parineeta Gedam - 05/08/23 */}

                                            </div>
                                            <div
                                                // className={`${style.commonColumnData} ${style.smallColumnWidth} ${style.eyeIcon}`} 
                                                className={`${style.actionColumn} ${style.commonColumnData} `}
                                                onClick={e => { showModal(orderDetail) }}
                                            >

                                                {/* Added by :- Parineeta Gedam on 06-08-2023 reason :- increase the eye icon size  */}
                                                {/* <AiFillEye/> */}
                                                <AiFillEye style={{ fontSize: 15, color: "rgb(24, 94, 224)" }} />
                                                {/* End of Added by :- Parineeta Gedam on 06-08-2023 reason :- increase the eye icon size  */}

                                            </div>

                                            <div
                                                // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                                                className={`${style.OrderIdColumn} ${style.commonColumnData} `}
                                            // Modification and added by Om Shrivastava on 27-06-23
                                            // Reason : Need to remove onclick by div than added in span tag

                                            // onClick={() => {
                                            //   navigate(`/update-order/${orderDetail.id}`, {
                                            //     state: { id: orderDetail.id },
                                            //    });
                                            // }}
                                            >
                                                <span
                                                // onClick={() => {
                                                //     navigate(`/update-order/${orderDetail.id}`, {
                                                //         state: { id: orderDetail.id },
                                                //     });
                                                // }}
                                                > {orderDetail.order_id}</span>
                                            </div>
                                            {/* End of addition by Om Shrivastava on 27-06-23 Reason : Need to remove onclick by div than added in span tag*/}

                                            {/* End of Modification by Om Shrivastava on 21-06-23 */}
                                            {/* Modofication by Om Shrivastava on 21-06-23 because need to change the sequence of table number and order id  */}
                                            <div
                                                // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                                                className={`${style.tableNoColumn} ${style.commonColumnData} `}
                                            // Added by Om Shrivastava on 21-06-23
                                            // Reason : Need to navigate when user click the table no
                                            // onClick={() => {
                                            //     navigate(`/update-order/${orderDetail.id}`, {
                                            //         state: { id: orderDetail.id },
                                            //     });
                                            // }}
                                            // End of addition by Om Shrivastava on 21-06-23
                                            >
                                                <span
                                                // onClick={() => {
                                                //     navigate(`/update-order/${orderDetail.id}`, {
                                                //         state: { id: orderDetail.id },
                                                //     });
                                                // }}
                                                > {orderDetail.table_number}  </span>
                                                {/* End of addition by Om Shrivastava on 27-06-23 Reason : Need to remove onclick by div than added in span tag*/}

                                            </div>
                                            <div
                                                // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                                                className={`${style.dateColumn } ${style.commonColumnData} `}
                                            >
                                                {ExtractDateTime(orderDetail.date).date}
                                            </div>

                                            <div
                                                // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                                                className={`${style.orderStatusColumn} ${style.commonColumnData} `}
                                                style={{ display: "flex", justifyContent: "center" }}
                                            >
                                                {orderDetail.order_status}
                                                {/* <div
                                                    className={` ${style.primaryButton}`}
                                                    onClick={() => openOrderDetails(orderDetail.id)}
                                                >
                                                    View
                                                </div> */}
                                            </div>
                                            <div
                                                // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                                                className={`${style.paymentStatusColumn} ${style.commonColumnData} `}
                                            >
                                                {orderDetail.payment_status}
                                            </div>
                                            <div
                                                // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                                                className={`${style.subtotalColumn} ${style.commonColumnData} `}
                                            >
                                                {orderDetail.sub_total}
                                            </div>
                                            <div
                                                // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                                                className={`${style.discountColumn} ${style.commonColumnData} `}
                                            >
                                                {orderDetail.discount_rupees}
                                            </div>
                                            <div 
                                            // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                                            className={`${style.loayltyColumn} ${style.commonColumnData} `}
                                            >
                                                {orderDetail.loyality_point_price}
                                            </div>
                                            <div 
                                            // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                                            className={`${style.totalColumn} ${style.commonColumnData} `}
                                            >
                                                {orderDetail.total}
                                            </div>
                                            <div 
                                            // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                                            className={`${style.cgstColumn} ${style.commonColumnData} `}
                                            >
                                                {orderDetail.cgst}
                                            </div>
                                            <div 
                                            // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                                            className={`${style.sgstColumn} ${style.commonColumnData} `}
                                            >
                                                {orderDetail.sgst}
                                            </div>
                                            <div 
                                            // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                                            className={`${style.finalRupees} ${style.commonColumnData} `}
                                            >
                                                {orderDetail.final_amount}
                                            </div>

                                        </div>
                                    );
                                })
                            ) : (
                                <div style={{ textAlign: "center" }}>No records found!</div>
                            )}
                        </div>
                    </div>
                    {/* End of modification by Rohan kansari - 26/8/23 
                        Reason - To give heading according to column name size*/}
                </div>
            </div>

            {/* Added by :- PArineeta Gedam on 04-08-2023
                reason :-when click on eye icon open model to show the order items 
            */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalOpen}
                className={style.modelContainer}
                closeIcon={<AiOutlineClose className={style.closeIcon} />}
                onOk={handleOk} onCancel={handleCancel}
                footer={null}
            >
                <div className={style.CustomerInformationBox}>
                    <div className={style.flexContainer}>
                        <div className={style.informationContainer}>
                            <div className={style.information} >
                                <div className={style.WhiteLabel1}>
                                    {/* Order No : */}
                                    {/* Modified by Rohan kansari - 25/8/23 - To change colon alignment */}
                                    <div className={style.labelName}>Order ID</div> <div className={style.labelColon}>:</div>
                                    {/* End of code - Rohan kansari - 25/8/23 - To change colon alignment */}
                                </div>
                                <div className={style.data}>
                                    {orderByOrderId?.order_detail?.order_id}
                                </div>
                            </div>
                            <div className={style.information} >
                                <div className={style.WhiteLabel1}>
                                    {/* Name : */}
                                    {/* Modified by Rohan kansari - 25/8/23 - To change colon alignment */}
                                    <div className={style.labelName}>Name</div> <div className={style.labelColon}>:</div>
                                    {/* End of code - Rohan kansari - 25/8/23 - To change colon alignment */}
                                </div>
                                <div className={style.data}>
                                    {orderByOrderId?.order_detail?.customer_name}
                                </div>
                            </div>
                            <div className={style.information} >
                                <div className={style.WhiteLabel1}>
                                    {/* Email : */}
                                    {/* Modified by Rohan kansari - 25/8/23 - To change colon alignment */}
                                    <div className={style.labelName}>Email</div> <div className={style.labelColon}>:</div>
                                    {/* End of code - Rohan kansari - 25/8/23 - To change colon alignment */}
                                </div>
                                <div className={style.data}>
                                   {orderByOrderId?.order_detail?.customer_email?.split(",")[0]} 
                                </div>
                            </div>

                            {/*  */}
                            <div className={style.information}>
                                <div className={style.WhiteLabel1}>
                                    {/* Date & Time: */}
                                    {/* Modified by Rohan kansari - 25/8/23 - To change colon alignment */}
                                    <div className={style.labelName}>Date </div> <div className={style.labelColon}>:</div>
                                    {/* End of code - Rohan kansari - 25/8/23 - To change colon alignment */}
                                </div>
                                <div className={style.data}>
                                    {orderByOrderId?.order_detail?.date.substring(0, 10).split("-").reverse().join("/")}
                                    {/* {new Date(orderByOrderId?.order_detail?.date).toLocaleDateString('en-GB') + " " + new Date(orderByOrderId?.order_detail?.date).toTimeString().substring(0, 5)} */}
                                </div>
                            </div>
                        </div>
                        <div className={style.informationContainer}>

                            <div className={style.information} >
                                <div className={style.WhiteLabel}>
                                    {/* Table : */}
                                    {/* Modified by Rohan kansari - 25/8/23 - To change colon alignment */}
                                    <div className={style.labelName}>Table</div> <div className={style.labelColon}>:</div>
                                    {/* End of code - Rohan kansari - 25/8/23 - To change colon alignment */}
                                </div>
                                <div className={style.data}>
                                    {orderByOrderId?.order_detail?.table_number}
                                </div>
                            </div>
                            <div className={style.information} >
                                <div className={style.WhiteLabel}>
                                    {/* Contact : */}
                                    {/* Modified by Rohan kansari - 25/8/23 - To change colon alignment */}
                                    <div className={style.labelName}>Contact</div> <div className={style.labelColon}>:</div>
                                    {/* End of code - Rohan kansari - 25/8/23 - To change colon alignment */}
                                </div>
                                <div className={style.data}>
                                    {orderByOrderId?.order_detail?.customer_number}
                                </div>
                            </div>

                            <div className={style.information}>
                                <div className={style.WhiteLabel}>
                                    {/* Payment Mode : */}
                                    {/* Modified by Rohan kansari - 25/8/23 - To change colon alignment */}
                                    <div className={style.labelName}>Payment Mode</div> <div className={style.labelColon}>:</div>
                                    {/* End of code - Rohan kansari - 25/8/23 - To change colon alignment */}
                                </div>
                                <div className={style.data}>
                                    {orderByOrderId?.order_detail?.payment_mode}
                                </div>
                            </div>

                            {/*  */}
                            <div className={style.information}>
                                <div className={style.WhiteLabel}>
                                    {/* Date & Time: */}
                                    {/* Modified by Rohan kansari - 25/8/23 - To change colon alignment */}
                                    <div className={style.labelName}>Time </div> <div className={style.labelColon}>:</div>
                                    {/* End of code - Rohan kansari - 25/8/23 - To change colon alignment */}
                                </div>
                                <div className={style.data}>
                                    {orderByOrderId?.order_detail?.date.substring(11, 16)}
                                    {/* {new Date(orderByOrderId?.order_detail?.date).toLocaleDateString('en-GB') + " " + new Date(orderByOrderId?.order_detail?.date).toTimeString().substring(0, 5)} */}
                                </div>
                            </div>
                        </div>

                        <div className={style.informationContainer}>



                        </div>
                    </div>
                    <div className={style.scrollContainer}>
                        <div className={style.orderItemContainer}>
                            {/* Modified by ROhan kansari - 20/8/23 
                                Reason - To set same height of item list container*/}
                            {/* <div style={{ width: "100%", overflow: "auto" , minHeight:"20vh" }}> */}
                            <div style={{ width: "100%", overflow: "auto", minHeight: "20vh", maxHeight: "40vh" }}>
                                {/* End of code modification by Rohan kansari - 20/8/23 
                                Reason - To set same height of item list container*/}
                                <div className={style.orderItemHeader}>
                                    <div className={style.quantityHeadingRes}>
                                        #
                                    </div>
                                    <div className={style.SnoHeading}>
                                        {/* SNo. */}
                                        S.No.
                                    </div>
                                    <div className={style.item_heading}>
                                        Item Name
                                    </div>

                                    {/* <div className={style.serving_heading}>
                                        Serving size
                                    </div> */}

                                    <div className={style.QtyNPriceHeadings}>
                                        <div className={style.quantityHeadingRes}>
                                            Qty
                                        </div>
                                        <div className={style.quantityHeading}>
                                            Quantity
                                        </div>
                                        <div className={style.priceHeading}>
                                            Price (₹)
                                        </div>
                                    </div>

                                    <div className={style.status_list}>
                                        <div className={style.status}>
                                            Item Status
                                        </div>
                                    </div>
                                </div>

                                <div className={style.itemsContent}>
                                    <div className={style.itemList}>
                                        {orderItems?.map((item, index) => (
                                            <div className={style.orderItemHeader}>
                                                {/* Modified by Rohan kansari- 20/8/23 
                                                    Reason - to change font style
                                                */}
                                                <div className={style.quantityHeadingRes}>
                                                    {index + 1}
                                                </div>
                                                <div className={`${style.SnoHeading} ${style.dataText}`}>
                                                    {index + 1}
                                                </div>
                                                <div className={`${style.item_heading} ${style.dataText}`}>
                                                    {item.item} ({item.serving_size})
                                                </div>
                                                {/* <div className={`${style.serving_heading} ${style.dataText}`}>
                                                    {item.serving_size}
                                                </div> */}

                                                <div className={style.QtyNPriceHeadings}>
                                                    <div className={style.quantityHeadingRes}>
                                                        {item.quantity}
                                                    </div>
                                                    <div className={`${style.quantityHeading} ${style.dataText}`}>
                                                        {item.quantity}
                                                    </div>
                                                    <div className={`${style.priceHeading} ${style.dataText}`}>
                                                        {item.price.toFixed(2)}
                                                    </div>
                                                </div>

                                                {/* End of code  Modification Rohan kansari- 20/8/23 
                                                    Reason - to change font style
                                                 */}

                                                <div className={style.status_list}>
                                                    <div className={style.status}>
                                                        {item.item_status}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Amount sections */}
                    {/* Modified by :- Parineeta Gedam on 06-08-2023 reason :- UI desiging chances */}
                    <div className={`${style.calculationsContainer}`} >
                        <div>
                            <div className={`${style.inputContainer}`}>
                                <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                                    <div className={`${style.inputLabel} ${style.inputLabel2}`}>
                                        {/* Subtotal */}
                                        {/* Modified by Rohan kansari - 25/8/23 - To change colon alignment */}
                                        <div className={style.labelName}>Subtotal (₹)</div> <div className={style.labelColon}>:</div>
                                        {/* End of code - Rohan kansari - 25/8/23 - To change colon alignment */}
                                    </div>
                                    <input
                                        className={`${style.textInputBox} ${style.disabledInputBox}`}
                                        type="text"
                                        name="sub_total"
                                        value={orderByOrderId?.order_detail?.sub_total.toFixed(2)}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className={`${style.inputContainer}`}>
                                <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                                    <div className={`${style.inputLabel} ${style.inputLabel2}`}>
                                        {/* Loyality */}
                                        {/* Modified by Rohan kansari - 25/8/23 - To change colon alignment */}
                                        <div className={style.labelName}>Loyalty (₹)</div> <div className={style.labelColon}>:</div>
                                        {/* End of code - Rohan kansari - 25/8/23 - To change colon alignment */}

                                    </div>
                                    <input
                                        className={`${style.textInputBox} ${style.disabledInputBox}`}
                                        type="text"
                                        name="loyality_point_price"
                                        value={orderByOrderId?.order_detail?.loyality_point_price.toFixed(2)}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className={`${style.inputContainer}`}>
                                <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                                    <div className={`${style.inputLabel} ${style.inputLabel2}`}>
                                        {/* Discount */}
                                        {/* Modified by Rohan kansari - 25/8/23 - To change colon alignment */}
                                        <div className={style.labelName}>Discount (₹)</div> <div className={style.labelColon}>:</div>
                                        {/* End of code - Rohan kansari - 25/8/23 - To change colon alignment */}

                                    </div>
                                    <input
                                        className={`${style.textInputBox} ${style.disabledInputBox}`}
                                        type="text"
                                        name="discount_rupees"
                                        value={orderByOrderId?.order_detail?.discount_rupees.toFixed(2)}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className={`${style.inputContainer}`}>
                                <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                                    <div className={`${style.inputLabel} ${style.inputLabel2}`}>
                                        {/* Total */}
                                        {/* Modified by Rohan kansari - 25/8/23 - To change colon alignment */}
                                        <div className={style.labelName}>Total (₹)</div> <div className={style.labelColon}>:</div>
                                        {/* End of code - Rohan kansari - 25/8/23 - To change colon alignment */}
                                    </div>
                                    <input
                                        className={`${style.textInputBox} ${style.disabledInputBox}`}
                                        type="text"
                                        name="total"
                                        value={orderByOrderId?.order_detail?.total.toFixed(2)}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <div>

                            {orderByOrderId?.order_detail?.cgst > 0 ? <div className={`${style.inputContainer}`}>
                                <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                                    <div className={`${style.inputLabel} ${style.inputLabel2}`}>
                                        {/* CGST */}
                                        {/* Modified by Rohan kansari - 25/8/23 - To change colon alignment */}
                                        <div className={style.labelName}>CGST ({(orderByOrderId?.order_detail?.cgst / (orderByOrderId?.order_detail?.total / 100)).toFixed(2)}%)</div> <div className={style.labelColon}>:</div>
                                        {/* End of code - Rohan kansari - 25/8/23 - To change colon alignment */}
                                    </div>
                                    <input
                                        className={`${style.textInputBox} ${style.disabledInputBox}`}
                                        type="text"
                                        name="total"
                                        value={orderByOrderId?.order_detail?.cgst.toFixed(2)}
                                        disabled
                                    />
                                </div>
                            </div> : null}

                            {orderByOrderId?.order_detail?.sgst > 0 ? <div className={`${style.inputContainer}`}>
                                <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                                    <div className={`${style.inputLabel} ${style.inputLabel2}`}>
                                        {/* SGST */}
                                        {/* Modified by Rohan kansari - 25/8/23 - To change colon alignment */}
                                        <div className={style.labelName}>SGST ({(orderByOrderId?.order_detail?.sgst / (orderByOrderId?.order_detail?.total / 100)).toFixed(2)}%)</div> <div className={style.labelColon}>:</div>
                                        {/* End of code - Rohan kansari - 25/8/23 - To change colon alignment */}
                                    </div>
                                    <input
                                        className={`${style.textInputBox} ${style.disabledInputBox}`}
                                        type="text"
                                        name="total"
                                        value={orderByOrderId?.order_detail?.sgst.toFixed(2)}
                                        disabled
                                    />
                                </div>
                            </div> : null}

                            {orderByOrderId?.order_detail?.sgst > 0 || orderByOrderId?.order_detail?.cgst > 0 ? <div className={`${style.inputContainer}`}>
                                <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                                    <div className={`${style.inputLabel} ${style.inputLabel2}`}>
                                        {/* Grand Total */}
                                        {/* Modified by Rohan kansari - 25/8/23 - To change colon alignment */}
                                        <div className={style.labelName}>Grand Total (₹) </div> <div className={style.labelColon}>:</div>
                                        {/* End of code - Rohan kansari - 25/8/23 - To change colon alignment */}
                                    </div>
                                    <input
                                        className={`${style.textInputBox} ${style.disabledInputBox}`}
                                        type="text"
                                        name="final_amount"
                                        value={orderByOrderId?.order_detail?.final_amount.toFixed(2)}
                                        disabled
                                    />
                                </div>
                            </div> : null}
                        </div>
                    </div>
                    {/* Amount sections */}
                    {/* End of Modified by :- Parineeta Gedam on 06-08-2023 reason :- UI desiging chances */}
                </div>
            </Modal>


            {/* Added by :- PArineeta Gedam on 05-08-2023 reason :- Add paginations */}
            <div className={style.paginationContainer}>
                {order && order.length > 0 ? (


                    < div className={style.paginationContent}>
                        <Pagination
                            defaultCurrent={currentPage}
                            current={currentPage}
                            simple
                            total={backendOrderCount}
                            defaultPageSize={listPerPage}

                            pageSize={listPerPage}
                            onChange={handlePageChange}
                        />

                        <div className={style.dropdown} onClick={toggelDropdown}>
                            <button className={style.dropbtn}>{listPerPage} / Page <MdArrowDropUp style={{ margin: "5px 0" }} /></button>
                            <div className={style.dropdown_content} id="dropdown">

                                {backendOrderCount > 40 ? <span href="#" onClick={e => { setListPerPage(50); setCurrentPage(1); localStorage.setItem("listPerPage", 50) }} >50 / Page</span> : null}
                                {backendOrderCount > 30 ? <span href="#" onClick={e => { setListPerPage(40); setCurrentPage(1); localStorage.setItem("listPerPage", 40) }} >40 / Page</span> : null}
                                {backendOrderCount > 20 ? <span href="#" onClick={e => { setListPerPage(30); setCurrentPage(1); localStorage.setItem("listPerPage", 30) }} >30 / Page</span> : null}
                                <span href="#" onClick={e => { setListPerPage(20); setCurrentPage(1); localStorage.setItem("listPerPage", 20) }}>20 / Page</span>
                                <span href="#" onClick={e => { setListPerPage(10); localStorage.setItem("listPerPage", 10) }}>10 / Page</span>

                            </div>
                        </div>
                    </div>
                ) : null}

            </div>
            {/* End of Added code by :- PArineeta Gedam on 05-08-2023 reason :- Add paginations */}

        </div>




        // </Header>
    )
}

export default NewOrderReport;


