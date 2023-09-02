import React, { useEffect, useRef, useState } from 'react'
import style from './todayOrder.module.css'
import { TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot, PopoverTrigger, IconButton, FocusLock, PopoverArrow, PopoverContent, PopoverCloseButton } from '@chakra-ui/react'
import { GrFormCheckmark, GrFormClose, GrAddCircle } from 'react-icons/gr'
import { GiRiceCooker } from "react-icons/gi"
import { getDashboardData, saveOrderDetailsApi, updateAllOrderAPI, updateItemStatus, updateOrderAndPaymentStatus } from '../../../Api/services'
import { AiOutlineClose, AiOutlineMinus, AiOutlinePlus, AiOutlineRight } from 'react-icons/ai'
import { MdKeyboardArrowDown, MdDownloading, MdArrowDropUp, MdAddCircleOutline } from "react-icons/md"
import { RiErrorWarningLine } from "react-icons/ri"
import { TiTick } from "react-icons/ti"
import { BsPencilSquare } from "react-icons/bs"
import { Popover, Modal, Radio, Popconfirm } from 'antd'
import { Message } from '../../../App'
import { useNavigate } from 'react-router-dom'
// import ReactPaginate from 'react-paginate';
import "./checkboxNcoin.scss"
import AddOrderItemForm from '../../Order/AddOrderItemForm'
import { FaGrinAlt } from 'react-icons/fa'
import PrintBill from "./PrintBill"
import { PrintKot } from './PrintKot'


// Modified by Rohan kansari - 29/6/23
// Reason - To remove icons 
function getStatusBtn(status) {
    if (status == "Placed")
        // return <button className={style.statusBtn} style={{ background: "rgba(255, 206, 115, 0.6)" }}>
        //     <span>{status}</span> <RiErrorWarningLine style={{ margin: "4px 2px" }} />
        // </button>
        return <button className={style.statusBtn} style={{ background: "rgba(255, 206, 115, 1)" }}>
            <span>{status}</span>
        </button>
    if (status == "Confirm")
        // return <button className={style.statusBtn} style={{ background: "rgba(225, 252, 126, 1)" }}>
        //     <span>{status}</span> <MdDownloading style={{ margin: "2px 0" }} />
        // </button>
        return <button className={style.statusBtn} style={{ background: "rgba(225, 252, 126, 1)" }}>
            <span>{status}</span>
        </button>
    if (status == "Cooked")
        // return <button className={style.statusBtn} style={{ background: "rgba(115, 222, 255, 1)" }}>
        //     <span>{status}</span> <GiRiceCooker style={{ margin: "2px 0" }} />
        // </button>
        return <button className={style.statusBtn} style={{ background: "rgba(115, 222, 255, 1)" }}>
            <span>{status}</span>
        </button>
    if (status == "Served")
        // return <button className={style.statusBtn} style={{ background: "rgba(144, 238, 144,1)" }}>
        //     <span>{status}</span> <GrFormCheckmark style={{ margin: "2px 0" }} />
        // </button>
        return <button className={style.statusBtn} style={{ background: "rgba(144, 238, 144,1)" }}>
            <span>{status}</span>
        </button>
    if (status == "Pending")
        // return <button className={style.statusBtn} style={{ background: "rgba(255, 206, 115, 1)" }}>
        //     <span>{status}</span> <RiErrorWarningLine style={{ margin: "4px 2px" }} />
        // </button>
        return <button className={style.statusBtn} style={{ background: "rgba(255, 206, 115, 1)" }}>
            <span>{status}</span>
        </button>
    // Added by Rohan Kansari- 30/5/23
    // Reason to add paid status button also
    if (status == "Paid")
        // return <button className={style.statusBtn} style={{ background: "rgba(115, 222, 255, 1)" }}>
        //     <span>{status}</span> <RiErrorWarningLine style={{ margin: "4px 2px" }} />
        // </button>
        return <button className={style.statusBtn} style={{ background: "rgba(115, 222, 255, 1)" }}>
            <span>{status}</span>
        </button>
    // End of code - Rohan Kansari - 30/5/23

    if (status == "Completed")
        // return <button className={style.statusBtn} style={{ background: "rgba(144, 238, 144,1)" }}>
        //     <span>{status}</span> <GrFormCheckmark style={{ margin: "2px 0" }} />
        // </button>
        return <button className={style.statusBtn} style={{ background: "rgba(144, 238, 144,1)" }}>
            <span>{status}</span>
        </button>
    // Addded by Rohan kansari - 21/6/23
    // Reason - to add one more buton
    if (status == "Cancelled")
        // return <button className={style.statusBtn} style={{ background: "rgba(255, 206, 115, 1)" }}>
        //     <span>{status}</span> <GrFormCheckmark style={{ margin: "2px 0" }} />
        // </button>
        return <button className={style.statusBtn} style={{ background: "rgba(255, 206, 115, 1)" }}>
            <span>{status}</span>
        </button>
}

// End of code - Rohan kansari - 29/6/23

const TodayOrder = (props) => {

    /**
     * Added by yuvraj Sahu on 28-06-2023
     * Reason - to handle radio group
     */
    var [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");
    var [selectedOrderStatus, setSelectedOrderStatus] = useState("");
    /**
     * End of addition by yuvraj Sahu on 28-06-2023
     */

    // Added by Rohan kansari - 23/6/23
    // Reason - To set Default selected tab when nothing is selected
    if (localStorage.getItem("selectedTab") == null)
        localStorage.setItem("selectedTab", "Newly_placed");
    //    End of code - Rohan kansari - 23/6/23


    // Uses - this all is saving data on pending order newly placed order and completed order separatly
    const [todaysPendingOrder, setPendingOrders] = useState(null)
    const [todaysCompletedOrder, setCompletedOrders] = useState(null)
    const [newlyPlaced, setNewlyPlacedOrders] = useState(null)

    // Uses - this state save to show where more button popup is opened or not
    const [popupOpen, setPopupOpen] = useState(false)
    // uses - all order item of all order is saved here You can extract selected items from order_id
    var [orderItemList, setOrderItem] = useState(null)

    // Uses - saving current database order item status here and pushing only required field only
    var updatedStatus = useRef({ value: [] })

    // Added by Rohan kansari - 15/7/23 - To save order detail database value 
    var OldOrdervalue = useRef({ value: {} })

    // Uses - Set checked order row in this use state ( multiple selection together data) 
    var [selectedOrder, setSelectedOrder] = useState([])

    // var selectedItemArr = useRef({ items: [] })

    // Added by Rohan kansari - 3/7/23 - To save selected order details
    const [selectedOrderData, setSelectedorderData] = useState({})
    // End of code - Rohan kansari - 3/7/23

    // Added by Suman sahu - 11/06/2023
    // Reason - To open selected orders in the modal of more button in the action of dashboard
    const [openActionPopupModal, setOpenActionPopupModal] = useState({})
    // End of code - 11/06/2023 by - suman sahu

    // Added by ROhan Kansari - 25/5/23
    // Reason - To save checked item and update
    var [checkedItems, setCheckedItem] = useState([])
    // End of code - 25/5/23

    {/* Modified by Rohan Kansari - 29/5/23 
        Reason - To add loading functionality*/}
    var [isLoading, setLoading] = useState(true)
    // End of code - ROhan Kansari - 29/5/23

    // Added by Rohan kansari - 15/7/23 - To save selected order item
    var [tickedItems, setTickedItems] = useState([])
    // End of code - ROhan kansari - 15/7/23

    // Billing data
    const [restroDetail, setRestroDetail] = useState(null)
    const [gstFssai, setGstFsaai] = useState(null)



    // This state is use for table number is editable or not
    const [inputEnable, setInputEnable] = useState(null)

    // Added by ROhan kansari - 20/7/23 
    // Reason - Declaring useState for opening add more item model 
    const [AddMoreItemmodalVisible, setAddMoreItemModalVisible] = useState(false)
    // ENd of code - ROhan kansari - 20/7/23

    // Added by ROhan kansari - 20/7/23
    // Reason - Getting all thing of order and setting it all in use state for on change

    const [orderDetailsObj, setorderDetailsObj] = useState({});

    const [selectedOrderItemList, setSelectedOrderItemList] = useState([])

    const [tablenumber, setTablenumber] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [orderStatus, setOrderStatus] = useState(null);
    const [paymentStatus, setPaymemntStatus] = useState(null);
    const [paymentMode, setPaymentMode] = useState(null);
    // Modified by Rohan kansari - 13/8/23 - giving default value admin
    const [cancelledBy, setCancelledBy] = useState("Admin");
    const [cancelReaon, setCancelReason] = useState(null);

    const [discountRupee, setDiscountRupee] = useState(null);
    const [discountPercentage, setDiscountPercentage] = useState(null);
    const [discountprice, setDiscountprice] = useState(null)
    const [discountReason, setDiscountReason] = useState("");
    const [applyLoyalityPoint, setApplyLoyalityPoint] = useState(null);
    const [loyalityPointPrice, setLoyalityPointPrice] = useState(null);
    const [loyalityPointStatus, setLoyalityPointStatus] = useState(null);
    const [loyalityPointCalculated, setLoyalityPointCalculated] = useState(null);
    const [customerLoyalitypoint, setcustomerLoyalitypoint] = useState(null);
    const [settings, setSettings] = useState({})

    const [subTotal, setSubTotal] = useState(null);
    const [cgst, setCGST] = useState(null);
    const [total, setTotal] = useState(null);
    const [sgst, setSGST] = useState(null);
    const [finalAmount, setFinalAmount] = useState(null);
    const [rating, setRating] = useState(null);
    const [review, setReview] = useState(null);

    const [name, setName] = useState("")
    const [IsnameEditable, setNameEditable] = useState(false)

    const [email, setEmail] = useState("")
    const [IsemailEditable, setEmailEditable] = useState(false)

    // Added by Rohan kansari - 23/7/23 
    // Reason - To add Loyality price 
    const [errorText, setErrorText] = useState({})
    // End of code - Rohan Kansari - 23/7/23 


    // Added by Rohan kansari - 4/8/23 
    // Reason - To set wether cancellred button is already clicked then no need to press
    //  again after submit cancel reason. directly on saving of cancela reason cancel status hits
    const [IsCancelClicked, setCancelClicked] = useState(false)
    // End of code - Rohan Kansari - 4/8/23 

    // End of code - Rohan kansari - 20/7/23 - Getting all thing of order and setting it all in use state for on change


    // var [cancel_reason, setCancelReason] = useState("")
    // const [popupOrderItem, setPopupOrderItem] = useState(false)
    // var [orderStatus, setOrderStatus] = useState("Confirm")

    // var selectedOrdersItemIndex=0;
    // Added by Suman sahu - 11/06/2023
    // Reason - To open selected items in the modal of table no. data in the dashboard
    // Modified by ROhan kansari - 26/6/23- to dont loose value on state change

    // const [openModalNumOrderItem, setOpenModalNumOrderItem] = useState({})
    //    var selectedOrderCopy = {}

    // Added by Rohan kansari - 15/7/23 - to open confirmation box for table number
    // const nav=useNavigate()
    // const [OpenTableCofirmation, setTableConfirm] = useState(false)

    // End of code - 11/06/2023 by - Suman sahu

    useEffect(() => {

        // Added by Om Shrivastava on 02-06-23
        // Reason : Fix the logout issue
        if (JSON.parse(localStorage.getItem("tenantInfo"))?.tenant_name)
            // End of addition by Om Shrivastava on 02-06-23
            BackendCall()
        //    Added by ROhan kansari -Given dependency in useEffect to recall backend whenver needed
    }, [props.recall])


    // this function is used to get all today's updated order from backend
    async function BackendCall() {

        const response = await getDashboardData(JSON.parse(localStorage.getItem("tenantInfo")).tenant_name);
        if (response) {
            // setRevenueDetails(response.revenue_details);
            // setTodaysSummary(response.revenue_details.todays_summary);
            // setThisWeeksSummary(response.revenue_details.this_weeks_summary);
            // setThisMonthsSummary(response.revenue_details.this_months_summary);
            // setThisYearsSummary(response.revenue_details.this_years_summary);
            // console.log(response)

            setLoading(false)
            setNewlyPlacedOrders(response.todays_newly_placed_orders);
            setPendingOrders(response.todays_pending_orders);
            setCompletedOrders(response.todays_completed_orders);
            setGstFsaai(response.setting);
            setSettings(response.setting);
            setRestroDetail(response.tenant);
            setOrderItem(response.order_item);
            // Added by Rohan kansari - 23/6/23 
            // Reason - To set current selected tab items in useState
            // setSelectedOrder(response.todays_newly_placed_orders)

            if (localStorage.getItem("selectedTab") == "Newly_placed") {
                setSelectedOrder(response.todays_newly_placed_orders)
            }
            else if (localStorage.getItem("selectedTab") == "Pending") {
                setSelectedOrder(response.todays_pending_orders)
            }
            else if (localStorage.getItem("selectedTab") == "Completed") {
                setSelectedOrder(response.todays_completed_orders)
                // Modified by ROhan kansari - 26/6/23- desable update all functionality in complete
                uncheckAll({ fade: true })
            }

            // End of code - Rohan kansari - 23/6/23
        }
    }


    // uses - This function is call at time of status change and it will allow to move 
    // step by step If not then it pass an error
    function statusValidation(order_status, payment_status, m, msgEnable) {
        // Modified by ROhan Kansari - 26/5/23
        // Reason - To pass validion message if served is not done done payment want to completed by admin

        // Modified By ROhan Kansari - 26/5/23
        // Reason - To pass proper validation on each change and admin can able move backward after changing order status
        // if (order_status != "Served" && payment_status == "Completed") {
        //     Message("You can not change the status to completed until this order is severd.", "error")
        //     return false
        // }
        // else if (order_status == "Served" && payment_status == "Completed") {
        //     return true
        // }
        // else
        //     return true

        // Modified by Rohan kansari - 26/6/23
        // Reason - To add cancel feature in status check
        // Changes by Rohan kansari - 28/6/23
        // Reason - admin can able to change cancle status in any time
        if (m?.order_status == "Placed" && (order_status == "Cooked" || order_status == "Served")) {
            if (msgEnable)
                Message("Please first change order status to confirm ", "error")
            return false;
        }

        else if (m?.order_status == "Confirm" && (order_status == "Placed")) {
            if (msgEnable)
                Message("You cant change order status confirm to placed", "error")
            return false;
        }

        else if (m?.order_status == "Cooked" && (order_status == "Confirm" || order_status == "Placed")) {
            if (msgEnable)
                Message(`You cant change order status cooked to ${order_status}`, "error")
            return false;
        }
        else if (m?.order_status == "Served" && (order_status == "Confirm" || order_status == "Placed" || order_status == "Cooked")) {
            if (msgEnable)
                Message(`You cant change order status served to ${order_status}`, "error")
            return false;
        }
        else if (m?.order_status == "Cancelled" && (order_status == "Pending" || order_status == "Confirm" || order_status == "Placed" || order_status == "Cooked" || order_status == "Served")) {
            if (msgEnable)
                Message(`You cant change order status cancel to ${order_status}`, "error")
            return false;
        }
        else if (m?.order_status == "Placed" && payment_status == "Completed") {
            if (msgEnable)
                Message(`You cant change payment status completed till order is not confirmed.`, "error")
            return false;
        }
        else if (m?.payment_status == "Completed" && (payment_status == "Pending")) {
            if (msgEnable)
                Message(`You cant change payment status completed to ${payment_status}`, "error")
            return false;
        }
        else if ((m?.payment_status == "Completed" || m?.payment_status == "Paid") && (order_status == "Cancelled")) {
            if (msgEnable)
                Message(`You can't cancel order if payment is ${payment_status}`, "error")
            return false;
        }

        else if (m?.order_status == "Cancelled" && (payment_status == "Completed")) {
            if (msgEnable)
                Message(`You can't complete payment if order is ${order_status}`, "error")
            return false;
        }

        else if (m?.order_status == "Cancelled") {
            if (msgEnable)
                Message("You Can't change status if order is cancelled", "error")

            return false;
        }

        // End of code - ROhan kansari - 28/6/23
        else
            return true;




        //End of code - Rohan Kansari - 26/5/23 
    }


    // added by - Suman sahu On 11/06/2023
    // reason - for close modal when click on cross icon or outside click on modal

    const closePopupOpen = () => {
        setPopupOpen(false);
    };
    // end of addition - 11/06/2023 by - suman sahu

    // function model(m, i) {
    //     var paymentStatus = m.payment_status
    //     var order_status = m.order_status

    //     // Modified by Rohan Kansari - 24/6/23
    //     // Reason - To
    //     var canWeUpdate = statusValidation(orderStatus, paymentStatus, m)
    //     // Added by Rohan kansari - 3/7/23
    //     if (m.order_status == "Cancelled" && cancel_reason.length == 0) {
    //         Message("please enter cancellation message", "error")
    //         return false
    //     }
    //     // End of code - ROhan kansari - 3/7/23
    //     if (canWeUpdate)
    //         // added by - suman sahu on 11/06/2023
    //         // reason - for call that function in the antd modal
    //         updateStatus();
    // end of addition 11/06/2023 by - suman sahu

    // else {
    //     // document.getElementById("order_status_selectBox").value = m.order.order_status
    //     // Modified by Rohan kansari - 3/7/23
    //     // Reason - To use method instead of dom manipulation
    //     oldOrderDataReverting()
    //     return false
    // }


    // async function updateStatus() {
    //     const status = {
    //         order_status: orderStatus,
    //         payment_status: paymentStatus,
    //         cancel_reason: cancel_reason
    //     }

    //     const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name

    // commented by - suman sahu on 11/06/2023
    // reason - fix issue when update order status and payment status in the modal

    // if ((m.order_status !== orderStatus || m.payment_status !== paymentStatus) && statusValidation(orderStatus, paymentStatus, m)) {
    // await updateOrderAndPaymentStatus(tenant, status, m.order_id).then(r => {
    //     if (r.success) {
    /**
     * Added by yuvraj Sahu on 08-07-2023
     * Reason - to change the message for status updation
     */
    // if (selectedOrderStatus != "" && selectedPaymentStatus != "") {
    //     Message("Successfully status updated ", "success")
    // } else {
    //     if (selectedOrderStatus != "") {
    //         Message("Successfully order status updated ", "success")
    //     }
    //     if (selectedPaymentStatus != "") {
    //         Message("Successfully payment status updated ", "success")
    //     }
    // }
    // Message("Successfully status updated ", "success")
    /**
     * End of addition by yuvraj Sahu on 08-07-2023
     */
    // setNewlyPlacedOrders(r.todays_newly_placed_orders);
    // setPendingOrders(r.todays_pending_orders);
    // setCompletedOrders(r.todays_completed_orders);
    // setOrderItem(r.order_items)
    // setPopupOpen(!popupOpen)

    // Modified by ROhan kansari - 23/6/23
    // Reason - To enhance code and making easy to understand
    // completed,pending_order,newly_placed
    // var radioInputs = document.querySelectorAll("input")
    // if (radioInputs[0].checked) {
    //     setSelectedOrder(r.todays_newly_placed_orders)
    // }
    // else if (radioInputs[1].checked) {
    //     setSelectedOrder(r.todays_pending_orders)
    // }
    // else if (radioInputs[2].checked) {
    //     setSelectedOrder(r.todays_completed_orders)
    // }

    //         if (document.getElementById("newly_placed").checked) {
    //             setSelectedOrder(r.todays_newly_placed_orders)
    //         }
    //         else if (document.getElementById("pending_order").checked) {
    //             setSelectedOrder(r.todays_pending_orders)
    //         }
    //         else if (document.getElementById("completed").checked) {
    //             setSelectedOrder(r.todays_completed_orders)
    //         }

    //         // End of code - Rohan Kansari - 23/6/23- To enhance the code

    //         selectedOrderData.current.order = []
    //     }
    // })
    // }
    // end of commentation - 11/06/2023 by - suman sahu

    // }

    // commented by - suman sahu on 11/06/2023
    // reason - change that popup to antd modal (when click on more button in the action of dashbord)

    //     if (popupOpen)
    //         return <div className={style.popupContainer}
    //             onLoad={e => {
    //                 console.log(document.getElementById("order_status_selected").selected)
    //                 console.log(document.getElementById("payment_status_selected").selected)
    //             }}>
    //             <div className={style.closeContainer}><button className={style.closeBtn} onClick={e => {
    //                 selectboxReset()
    //                 setPopupOpen(false)
    //             }}><AiOutlineClose /></button></div>
    //             <div className={style.customername}><label className={style.lable}>Contact Number : </label>{m.customer_number}</div>
    //             <div className={style.OrderTime}><label className={style.lable}>Table No : </label>{m.table_number}</div>
    //             <div className={style.OrderTime}><label className={style.lable}>Date & Time : </label>{m.date.substring(0, 10).split('-').reverse().join("/") + ' ' + m.date.substring(11, 16)}</div>
    //             <div className={style.OrderTime}><label className={style.lable}>Payment Mode :</label>{m.payment_mode}</div>
    //             <div className={style.OrderTime}><label className={style.lable}>Subtotal :</label>{m.sub_total}</div>
    //             <div className={style.OrderTime}><label className={style.lable}>CGST : </label>{m.cgst}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label className={style.lable}>SGST : </label>{m.sgst}</div>
    //             <div className={style.OrderTime}><label className={style.Highlightlable}>Total : {m.total} </label></div>
    //             <div className={style.btnContainer}>
    //                 <div className={style.selectionContainer}>
    //                     <label className={style.lable}>Order Status</label>
    //                     <div className={style.selctedContentBox}>
    //                         <select defaultValue={orderStatus} onChange={e => orderStatus = e.target.value} id="order_status_selected">
    //                             <option value="Placed" className={style.options}>Placed</option>
    //                             <option value="Confirm" className={style.options}>Confirm</option>
    //                             <option value="Cooked" className={style.options}>Cooked</option>
    //                             <option value="Served" className={style.options}>Served</option>
    //                         </select>
    //                     </div>
    //                     {/* <div className={style.selctedContentBox}>Pending<div className={style.icon}><MdKeyboardArrowDown /></div></div> */}

    //                 </div>
    //                 <div className={style.selectionContainer}>
    //                     <label className={style.lable}>Payment Status</label>
    //                     <div className={style.selctedContentBox}>
    //                         <select defaultValue={paymentStatus} onChange={e => paymentStatus = e.target.value} id="payment_status_selected">
    //                             <option className={style.options} value="Pending">Pending</option>
    //                             <option className={style.options} value="Completed">Completed</option>
    //                         </select>
    //                     </div>
    //                     {/* <div className={style.selctedContentBox}>Pending<div className={style.icon}><MdKeyboardArrowDown /></div></div> */}
    //                 </div>
    //             </div>
    //             <div className={style.btnContainer}>
    //                 <div className={style.selectionContainer}>
    //                     <button className={style.btnUpdate} onClick={e => updateStatus()}>Update</button>                                    {/* <div className={style.selctedContentBox}>Pending<div className={style.icon}>{">"}</div></div> */}
    //                 </div>
    //                 <div className={style.selectionContainer}>
    //                     <button className={style.btnUpdate} onClick={e => { setPopupOpen(!popupOpen); selectboxReset() }}>Cancel</button>
    //                 </div>
    //             </div>

    //             <div className={style.btnContainer}>
    //                 <div className={style.selectionContainer} style={{ textAlign: "center" }}>
    //                     <div className={style.visitLink}>See Order</div>                                    {/* <div className={style.selctedContentBox}>Pending<div className={style.icon}>{">"}</div></div> */}
    //                 </div>
    //                 <div className={style.selectionContainer}>
    //                     <span className={style.visitLink}>See Order Item</span>
    //                 </div>
    //             </div>

    //             <div className={style.btnContainer} style={{ paddingBottom: "10px" }}>
    //                 <div className={style.selectionContainer}>
    //                     <button className={style.kotPrint}
    //                         // Added  by Rohan Kansari - to manage kot print bill - 25/5/23
    //                         onClick={e => nav("/kot", { state: { "gstFssai": gstFssai, "restro_detail": restroDetail, "order": m, "orderItem": orderItemList.filter((o) => { return o.order_id == m.order_id }) } })}
    //                     >Print KOT</button>                                    {/* <div className={style.selctedContentBox}>Pending<div className={style.icon}>{">"}</div></div> */}
    //                 </div>
    //                 <div className={style.selectionContainer}>
    //                     <button className={style.billPrint}
    //                         style={m.payment_status != "Completed" ? { background: "rgba(128,128,128,0.3)", pointerEvents: "none", textDecoration: "line-through" } : {}}
    //                         onClick={e => nav("/Billing", { state: { "gstFssai": gstFssai, "restro_detail": restroDetail, "order": m, "orderItem": orderItemList.filter((o) => { return o.order_id == m.order_id }) } })}
    //                     >Print</button>
    //                 </div>
    //             </div>

    //         </div>
    // }

    // end of commentation code on 11/06/2023 by - suman sahu


    // added by - Suman sahu On 10/06/2023
    // reason - for close modal when click on cross icon or outside click on that modal

    // const closeModalOrderItem = () => {
    //     setPopupOrderItem(false);
    // };
    // end of addition by suman sahu on 10/06/2023

    // Uses - Check whether current data is doesnt equal to old one and then call update method to change order item
    function orderItemModel(filteredOrderItemList, i) {

        // Uses - Check wheter your old data is not equal to current changed data
        if (JSON.stringify(JSON.parse(OldOrdervalue.current.value).order_item) == JSON.stringify(filteredOrderItemList)) {
            Message("No changes detected", "error")
        }
        else {
            updatedStatus.current.value = []
            var kotItems = selectedOrderData.order_item.filter((o) =>
                o.kot_print_status == false &&
                o.item_status == "Confirm"
            )
            PrintKot(selectedOrderData.order_detail, kotItems, restroDetail, gstFssai, settings)

            // printKot(selectedOrderData.order_item.filter((o) => {
            //     if (o.kot_print_status == false &&
            //         o.item_status=="Confirm"){
            //         console.log(o)
            //        return o;}
            // }
            // ))


            updateStatus(filteredOrderItemList);
        }


    }




    // Uses this function updated all item chnages and resetting all updated value from backend
    async function updateStatus(filteredOrderItemList) {

        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name
        console.log(filteredOrderItemList)
        await updateItemStatus(tenant, filteredOrderItemList, filteredOrderItemList[0].order_id).then(r => {
            updatedStatus.current.value = []
            var newOrderItemList = []

            // console.log("backend order item" , r.order_items.filter(o => o.order_id == filteredOrderItemList[0].order_id))

            r.order_items.filter(e => {

                updatedStatus.current.value.push({ "quantity": e.quantity, "item_status": e.item_status, "price": e.price });
                /**
                 * Commented and modified by - Ashish Dewangan on 18-06-2023
                 * Reason - Fixed issue where when we change item status then some items were not appearing on modal
                 */
                // newOrderItemList = [...orderItemList.filter(o => o.id != e.id), e]
                // Modified by Rohan Kansari- 24/6/23
                // Reason - To get updated value before it is setting old values 
                // newOrderItemList = [...orderItemList.filter(o => o.id != e.id), ...orderItemList.filter(o => o.id==e.id )]

                // uses - setting other order_id order item first then setting updated order_item which we got from backend 
                // So old data will alsos not affected and new data is also get
                newOrderItemList = [...orderItemList.filter(o => o.id != e.id),
                ...orderItemList.filter(o => { if (o.id == e.id) { o.item_status = e.item_status; o.kot_print_status = e.kot_print_status; o.quantity = e.quantity; o.price = e.price; return o; } })]
                //  ENd of code - ROhan Kansari - 24/6/23
                /**
                 * End of code modifciation by - Ashish Dewangan on 18-06-2023
                 * Reason - Fixed issue where when we change item status then some items were not appearing on modal
                 */
            })

            // Added by Rohan kansari - 16/8/23
            // Reason - To uncheck all selected multiple items
            setTickedItems([])

            // Added by Rohan Kansari - 25/6/23
            // Reason - To get latest all data order data set it to slected order

            setNewlyPlacedOrders(r.todays_newly_placed_orders);
            setPendingOrders(r.todays_pending_orders);
            setCompletedOrders(r.todays_completed_orders);


            if (document.getElementById("newly_placed").checked) {
                setSelectedOrder(r.todays_newly_placed_orders)
            }
            else if (document.getElementById("pending_order").checked) {
                setSelectedOrder(r.todays_pending_orders)
            }
            else if (document.getElementById("completed").checked) {
                setSelectedOrder(r.todays_completed_orders)
            }

            // console.log("--------------newly placed", newOrderItemList.filter(i => i.order_id == filteredOrderItemList[0].order_id))

            // Added by ROhan kansari - 13/7/23 - To get all order and reseting selected order in oped popup
            var all_orders = [...r.todays_completed_orders, ...r.todays_pending_orders, ...r.todays_newly_placed_orders]
            var order = all_orders.filter(o => o.order_id == selectedOrderData.order_detail.order_id)[0]
            setSelectedorderData({
                ...{
                    "order_detail": order
                    , "order_item": newOrderItemList.filter(i => i.order_id == filteredOrderItemList[0].order_id)
                }
            })
            //End of code - Rohan kansari - 13/7/23 - To get all order and reseting selected order in oped popup

            updatedStatus.current.value = []

            newOrderItemList.filter(i => { if (i.order_id == order.order_id) { updatedStatus.current.value.push({ "quantity": i.quantity, "item_status": i.item_status, "price": i.price }); i.order_id = orderDetailsObj.order_id; } })


            OldOrdervalue.current.value = JSON.stringify(
                {
                    ...{
                        "order_detail": order
                        , "order_item": filteredOrderItemList[0].order_id
                    }
                }
            )

            setSelectedOrderItemList([...newOrderItemList.filter(i => i.order_id == filteredOrderItemList[0].order_id)])

            // Added by ROhan kansari - 23/7/23
            // Reason - To save updated order in orderdetail state and all other prices
            UpdatingOpenedOrder(order)

            // End of code - Rohan kansari - 23/7/23
            // End of code - 25/6/23 - ROhan kansari 
            setOrderItem(newOrderItemList)


            // Modified by ROhan kansari - 26/6/23 - to delete persist data
            // selectedItemArr.current.items = []

            // Modified by Rohan Kansari- 24/5/23
            // Reason - Select box is not updated 
            // var option = document.querySelectorAll("select option")
            // var option = document.getElementsByClassName("item_selected");
            // for (var i = 0; i < option.length; i++) {
            //     // option[i].defaultSelected=option[i].selected
            //     option[i].value = r.order_items[i].item_status
            // }


            // console.log(newOrderItemList.filter(i => i.order_id == filteredOrderItemList[0].order_id), "kjdkdkdkd")
            var CheckboxForItem = document.getElementsByClassName("checkbox-wrapper-24")
            for (var i = 0; i < CheckboxForItem.length; i++) {
                CheckboxForItem[i].children[0].checked = false;
            }

            Message("Successfully status updated ", "success")
        }
        )
    }

    // end of modification code on 10/06/2023

    function selectboxReset() {
        // This is to reseting the all value of select box on closing without updating
        var option = document.querySelectorAll("select option");
        for (var i = 0; i < option.length; i++) {
            option[i].selected = option[i].defaultSelected;
        }

        // Reseting end code
    }


    //     // Pagination functionality
    //     // Here we use item offsets; we could also use page offsets
    //   // following the API or data you're working with.
    //   const [itemOffset, setItemOffset] = useState(0);

    //   // Simulate fetching selectedOrder from another resources.
    //   // (This could be selectedOrder from props; or selectedOrder loaded in a local state
    //   // from an API endpoint with useEffect and useState)
    //   const endOffset = itemOffset + 2;
    //   console.log(`Loading selectedOrder from ${itemOffset} to ${endOffset}`);
    //   const currentItems = selectedOrder.slice(itemOffset, endOffset);
    //   const pageCount = Math.ceil(selectedOrder.length / 2);

    //   // Invoke when user click to request another page.
    //   const handlePageClick = (event) => {
    //     const newOffset = (event.selected * 2) % selectedOrder.length;
    //     console.log(
    //       `User requested page number ${event.selected}, which is offset ${newOffset}`
    //     );
    //     setItemOffset(newOffset);
    //   };

    // Added by ROhan KAnsari - 26/5/23 
    // Reason - To manage all checkbox in todays order table

    function setCheckedItems(data, checked) {

        if (checked)
            setCheckedItem([...checkedItems, data])
        else
            setCheckedItem(checkedItems.filter(e => e.id != data.id))

        console.log(checkedItems)
    }

    async function updateAll(status) {

        /**
         * Added by Yuvraj Sahu on 02-08-2023
         * Reason - to update the order and payment status 
         */

        // const data = {
        //     /**
        //      * Commeted and modified by Yuvraj Sahu on 28-06-2023
        //      * Reason - to replace dropdown with radio value
        //      */
        //     // order_status: document.getElementById("all_order_status_selected").value,
        //     // payment_status: document.getElementById("all_payment_status_selected").value,
        //     order_status: selectedOrderStatus != "" ? selectedOrderStatus : document.getElementById("all_order_status_selected").value,
        //     payment_status: selectedPaymentStatus != "" ? selectedPaymentStatus : document.getElementById("all_payment_status_selected").value,
        //     /**
        //      * End of modification by yuvraj sahu on 28-06-2023
        //      */
        //     orders: checkedItems
        // }

        const data = {
            orders: checkedItems
        }
        if ("order_status" in status) {
            data["order_status"] = status.order_status
        }
        if ("payment_status" in status) {
            data["payment_status"] = status.payment_status
        }

        // if (selectedOrderStatus == "") {
        //     delete data.order_status
        // }
        // if (selectedPaymentStatus == "") {
        //     delete data.payment_status
        // }

        /**
         * End of modification by yuvraj Sahu on 02-08-2023
         */

        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;


        if (checkedItems.length > 0)
            await updateAllOrderAPI(tenant, data).then(r => {

                if (r.success) {
                    /**
                     * Added by yuvraj Sahu on 08-07-2023
                     * Reason - to change the message for status updation
                     */
                    if (selectedOrderStatus != "" && selectedPaymentStatus != "") {
                        Message("Successfully status updated ", "success")
                    } else {
                        if (selectedOrderStatus != "") {
                            Message("Successfully order status updated ", "success")
                        }
                        if (selectedPaymentStatus != "") {
                            Message("Successfully payment status updated ", "success")
                        }
                    }
                    // Message("Successfully status updated ", "success")
                    /**
                     * End of addition by yuvraj Sahu on 08-07-2023
                     */
                    setNewlyPlacedOrders(r.todays_newly_placed_orders);
                    setPendingOrders(r.todays_pending_orders);
                    setCompletedOrders(r.todays_completed_orders);
                    checkedItems = []
                    setCheckedItem(checkedItems)
                    uncheckAll()
                    setOrderItem(r.order_items)

                    // Modified by ROhan kansari - 23/6/23
                    // Reason - To enhance code and making easy to understand
                    // completed,pending_order,newly_placed
                    // var radioInputs = document.querySelectorAll("input")
                    // if (radioInputs[0].checked) {
                    //     setSelectedOrder(r.todays_newly_placed_orders)
                    // }
                    // else if (radioInputs[1].checked) {
                    //     setSelectedOrder(r.todays_pending_orders)
                    // }
                    // else if (radioInputs[2].checked) {
                    //     setSelectedOrder(r.todays_completed_orders)
                    // }

                    /**
                     * Added by Yuvraj Sahu on 18-06-2023
                     * Reason - to reset the overall order and payment status
                     */
                    setSelectedOrderStatus("")
                    setSelectedPaymentStatus("")
                    /**
                     * End of addition by yuvraj Sahu on 28-06-2023
                     */

                    if (document.getElementById("newly_placed").checked) {
                        setSelectedOrder(r.todays_newly_placed_orders)
                    }
                    else if (document.getElementById("pending_order").checked) {
                        setSelectedOrder(r.todays_pending_orders)
                    }
                    else if (document.getElementById("completed").checked) {
                        setSelectedOrder(r.todays_completed_orders)
                    }

                    // End of code - Rohan Kansari - 23/6/23- To enhance the code
                }
                else {
                    Message("Something went wrong ! Please Try again later", "warning")
                }
            })
        else
            Message("No item is selected to update", "warning")
    }

    // Added by Rohan Kansari - 26/5/23
    // Reason - To untick all selected checkbox 

    function uncheckAll(data) {
        var allCheckboxes = document.querySelectorAll("#checkbox")
        for (let index = 0; index < allCheckboxes.length; index++) {
            allCheckboxes[index].checked = false
        }

        allCheckboxes = document.querySelectorAll("#ParentCheckbox")
        for (let index = 0; index < allCheckboxes.length; index++) {
            allCheckboxes[index].checked = false
        }

        setCheckedItem([])

        if (data?.fade) {
            // Modification and addition by Om Shrivastava on 03-06-23
            // Reason : Fix the overlap issue
            // document.getElementById("allupdate").style.background = "rgba(128,128,128,.1)"

            // commented and added by - Suman sahu on - 17/06/2023
            // reason - for hide order status and payment status when click on completed option on the dashboard

            // document.getElementById("allupdate").style.background = "rgb(232,232,232)"
            document.getElementById("allupdate").style.display = "none"

            // end of addition by - Suman sahu on - 17/06/2023

            // document.getElementById("allupdate").style.opacity = ".6"
            // End of addition by Om Shrivastava on 03-06-23
            document.getElementById("allupdate").style.pointerEvents = "none"
        } else {
            document.getElementById("allupdate").style.background = "unset"
            document.getElementById("allupdate").style.opacity = "unset"
            document.getElementById("allupdate").style.pointerEvents = "unset"

            // commented and added by - Suman sahu on - 17/06/2023
            // reason - for reset order status and payment status when click on completed option then click on Newly placed and Pending on the dashboard
            document.getElementById("allupdate").style.display = "flex"
            // end of addition by - Suman sahu on - 17/06/2023

        }

    }

    function checkAndUncheckAll(value) {
        // To store all item in checked item if value get false then remove all from checked item
        if (value) {
            checkedItems = selectedOrder
            setCheckedItem(selectedOrder)
        }
        else
            setCheckedItem([])

        if (checkedItems.length > 0) {
            var allCheckboxes = document.querySelectorAll("#checkbox")
            for (let index = 0; index < allCheckboxes.length; index++) {
                allCheckboxes[index].checked = value
            }
        }
        else if (value) {
            uncheckAll()
            Message("No item present", "warning")
        }

    }

    // End of code - ROhan Kansari - 26/5/23





    // -------------------------------------- print kot by Yuvraj Sahu -----------------------------------
    /**
     * Added by yuvraj Sahu on 22-06-2023
     * Reason - to print kot from dashboard (Completed section)
     */
    // var [kotData, setKot] = useState({})
    // var kotData = {}

    // function printKot(kotItems) {
    //     // Modified by Rohan KAnsari - 26/6/23
    //     // Reason - To dont print cancelled items
    //     console.log()
    //     var filterKotItems = kotItems
    //     var state = { gstFssai: gstFssai, restro_detail: restroDetail, order: openActionPopupModal.order_detail, orderItem: filterKotItems }
    //     // setKot(state)   
    //     kotData = state

    //     console.log(kotData)

    //     function ExtractDateTime(format) {
    //         var date = format.substring(0, 10)
    //         var time = format.substring(11, 19)
    //         return { date, time }
    //     }

    //     var a = window.open('', '', 'height=800, width=1200');

    //     a.document.write(`<html>
    //     <head>
    //     <style>

    //     .container{
    //         width: 100%;
    //         height: auto;
    //         position: relative;
    //     }


    //     .kotContainer {
    //         font-family:monospace;
    //         letter-spacing: 0.6px;
    //         width: 300px;   
    //         height:auto;
    //         margin:auto auto;
    //         border-radius: 5px;
    //         padding: 2px 0;
    //         overflow-x: hidden;
    //         padding-bottom: 50px;
    //         padding-top: 60px;
    //         border: 1px solid black
    //     }
    //     .billingContainer {
    //         font-family:monospace;
    //         letter-spacing: 0.6px;
    //         width: 320px;
    //         height: auto;
    //         margin: 0 auto;
    //         border-radius: 5px;
    //         padding: 2px 0;
    //         padding-bottom: 150px;
    //         border: 1px solid black;
    //     }
    //     .inLineContainer {
    //         min-width: 100%;
    //         min-height: 10px;
    //         margin: 4px 5px;
    //         display: flex;
    //         justify-content: space-between;
    //     }
    //     .Hotellabel{
    //         min-width: 100%;
    //         font-size: 17px;
    //         font-weight: 900;
    //         padding: 0 3%;
    //         text-align: center;
    //     }
    //     .centerLabel{
    //         min-width: 100%;
    //         font-size: 12px;
    //         font-weight: 700;
    //         text-align: center;
    //     }
    //     .column1{
    //         min-width:50%;
    //         display: flex;
    //     }

    //     .label {
    //         min-width: 45%;
    //         font-size: 12px;
    //         font-weight: 700;
    //         text-align: start;
    //         white-space: nowrap;
    //         display: flex;
    //         }

    //     .label1{
    //         min-width: 32%;
    //         font-size: 12px;
    //         font-weight: 700;
    //         text-align: start;
    //         white-space: nowrap;
    //         display: flex;
    //     }

    //     .text {
    //         min-width: 50%;
    //         word-break: break-all;
    //         font-size: 12px;
    //         font-weight: 600;
    //         text-align: left;
    //     }

    //     .tableHeader {
    //         height: 30px;
    //         width: 95%;
    //         margin: auto;
    //         border-top: 1px solid black;
    //         margin-top: 20px;
    //         border-bottom: 1px solid black;
    //         display: flex;
    //         gap: 8px;
    //     }
    //     .serialNo {
    //         font-size: 12px;
    //         width: 15%;
    //         padding: 2% 0%;
    //         font-weight: 700;
    //     }
    //     .titleHeading {
    //         font-size: 12px;
    //         width: 67%;
    //         padding: 2% 0%;
    //         padding-right: 8%;
    //         font-weight: 700;
    //         text-align: start;
    //     }

    //     .qtyHeading {
    //         font-size: 12px;
    //         width: 17%;
    //         padding: 2% 0% 0% 0%;
    //         font-weight: 700;
    //     }

    //     .tableContents {
    //         min-height: 30px;
    //         width: 95%;
    //         margin:0 auto;
    //         margin: 1px 0;
    //         display: flex;
    //         gap: 4px;
    //     }
    //     .quantityText {
    //         font-size: 10px;
    //         width: 10%;
    //         padding: 2% 0% 0% 5%;
    //         font-weight: 600;
    //     }
    //     .titleText {
    //         font-size: 10px;
    //         width: 70%;
    //         font-weight: 600;
    //         padding: 2% 0% 0% 8%;
    //         text-align:left
    //     }
    //     .rateText {
    //         font-size: 12px;
    //         width: 15%;
    //         font-weight: 600;
    //         text-align: end;
    //         white-space: nowrap;
    //         padding: 2% 0% 0% 5%;
    //         text-align:left
    //     }
    //     .totalText {
    //         font-size: 12px;
    //         width: 30%;
    //         padding: 2% 2%;
    //         font-weight: 700;
    //         text-align: center;
    //         white-space: nowrap;
    //     }
    //     #line{
    //         background-color: black;
    //         height: .5px;
    //         width: 95%;
    //         margin: 0 auto;
    //         border: .5px solid #9c9c9c;
    //     }

    //     .btnContainer{
    //         width: 280px;
    //         min-height: 40px;
    //         position: fixed;
    //         top: 8px;
    //         left: 0;
    //         right: 0;
    //         margin: 0 auto;
    //         background-color:#fff ;
    //         display: flex;
    //         justify-content: space-around;
    //     }

    //     .btn{
    //         width: 45%;
    //         height: 100%;
    //         background-color: #185ee0;
    //         border-radius: 5px;
    //         color: #e6eef9;
    //         margin: auto 0;
    //     }

    //     .btn:hover{
    //         background-color: #e6eef9;
    //         color: #185ee0;
    //         border: 1px solid #185ee0;
    //     }
    //     @media print{
    //         .btn{
    //             display: none;
    //         }

    //         .kotContainer{
    //         padding-top: 0;
    //         }

    //         .btnContainer{
    //         display: none;
    //         }
    //         @page{margin:0;}
    //     }
    //     </style>
    //     </head>
    //     <body>
    //     <div class="container" style={{ paddingBottom: "50px", background: "grey" }} >
    //         <div class="kotContainer" style={{ background: "white", border: "2px solid black" }}>
    //             <div class="inLineContainer" >
    //                 <div class="Hotellabel" style={{ textAlign: "center" }}>${kotData.restro_detail.name.toUpperCase()}</div>
    //             </div>
    //             <hr />
    //             <div class="inLineContainer">
    //                 <div class="column1"><div class="label1"><div style={{ width: "90%" }}>Date</div><div>:</div>  </div><div class="text">${new Date(
    //         kotData.order.date
    //     ).toLocaleDateString("en-GB")}</div></div>
    //                 <div class="column1"><div class="label"><div style={{ width: "90%" }}>Time</div><div>:</div> </div><div class="text"> ${ExtractDateTime(kotData.order.date).time}</div></div>
    //             </div>
    //             <div class="inLineContainer">
    //                 <div class="column1"><div class="label1"><div style={{ width: "90%" }}>Order id</div><div>:</div>  </div><div class="text"> ${kotData.order.order_id}</div></div>
    //                 <div class="column1"><div class="label"><div style={{ width: "90%" }}>Table</div><div>:</div>  </div><div class="text">${!kotData.order.table_number ? "N/A" : kotData.order.table_number
    //         }</div></div>

    //             </div>
    //             <div class="tableHeader">
    //                 <div class="serialNo"> SNo   </div>
    //                 <div class="titleHeading">Item Name</div>
    //                 <div class="qtyHeading">   Qty   </div>
    //             </div>`+
    //         kotData.orderItem.map((item, i) =>
    //             `<div class="tableContents">
    //                     <div class="quantityText">${i + 1}</div>
    //                     <div class="titleText">${item.item} (${item.serving_size
    //             })</div>
    //                     <div class="rateText">${item.quantity}</div>
    //                 </div>`
    //         ).join("")
    //         + `</div>

    //     </div>
    //     </body>
    //     </html>`)
    //     a.document.close();

    //     if (filterKotItems.length > 0)
    //         a.print();
    //     a.close();
    // }
    /**
     * End of addition by Yuvraj Sahu on 22-06-2023
     */
    // -------------------------------------- End print kot by Yuvraj Sahu -----------------------------------


    // Added by ROhan kansari - 26/6/23
    // Reason - to restore old selected value in state
    // function oldStatusReverting() {
    //     console.log(selectedItemArr)
    //     var tempOrderItemList = orderItemList;
    //     selectedItemArr.current.items.filter(e => {
    //         var index = orderItemList.findIndex(o => o.id == e.id)
    //         tempOrderItemList[index].item_status = e.status
    //     })
    //     setOrderItem([...tempOrderItemList])

    //     selectedItemArr.current.items = []

    //     //    selectedItemArr)
    // }
    // End of code - Rohan kansari - 26/6/23

    // Added by ROhan kansari - 3/7/23
    // Reason - to restore old selected value in state
    // function oldOrderDataReverting() {
    //     console.log(selectedOrderData.current.order[0].order_status)
    //     if (selectedOrderData.current.order.length > 0) {
    //         var index = selectedOrder.findIndex(e => e.id == selectedOrderData.current.order[0].id)
    //         selectedOrder[index].order_status = selectedOrderData.current.order[0].order_status;
    //         selectedOrder[index].payment_status = selectedOrderData.current.order[0].payment_status;
    //         setSelectedOrder([...selectedOrder])

    //         selectedOrderData.current.order = []
    //     }




    // }

    // End of code - Rohan kansari - 3/7/23


    /**
     * Added by yuvraj Sahu on 28-06-2023
     * Reason - to handle radio group
     */
    // const [value, setValue] = useState(1);
    const handlePaymentStatus = (e) => {
        console.log('radio checked', e.target.value);
        setSelectedPaymentStatus(e.target.value);
    };
    const handleOrderStatus = (e) => {
        console.log('radio checked', e.target.value);
        setSelectedOrderStatus(e.target.value);
    };
    /**
     * End of addition by Yuvraj Sahu on 28-06-2023
     */

    // Added by Rohan kansari - 14/7/23
    // Reason - To Increase and decreasing Value

    function increaseAndDecrease(sign, index, orderId) {
        if (sign == "-") {
            if (selectedOrderData.order_item[index].quantity != 1) {
                // It will decrease value first then
                selectedOrderData.order_item[index].quantity = --selectedOrderData.order_item[index].quantity
                // getting price from updated quantity and price of one item of product
                selectedOrderData.order_item[index].price = (selectedOrderData.order_item[index].price /
                    (selectedOrderData.order_item[index].quantity + 1)) *
                    selectedOrderData.order_item[index].quantity
                // var subtotal = 0
                // Only get prices of item which is not cancelled
                // selectedOrderData.order_item.filter(i => { if (i.item_status != "Cancelled") subtotal = subtotal + i.price })
                // then set updated subtotal into order detail
                // selectedOrderData.order_detail.sub_total = subtotal
                setSelectedorderData({
                    ...{
                        "order_detail": selectedOrderData.order_detail,
                        "order_item": selectedOrderData.order_item
                    }
                })
            }
        } else {
            // Uses - same goes for increasing value
            selectedOrderData.order_item[index].quantity = ++selectedOrderData.order_item[index].quantity
            selectedOrderData.order_item[index].price = (selectedOrderData.order_item[index].price /
                (selectedOrderData.order_item[index].quantity - 1)) *
                selectedOrderData.order_item[index].quantity

            // var subtotal = 0
            // selectedOrderData.order_item.filter(i => { if (i.item_status != "Cancelled") subtotal = subtotal + i.price })
            // selectedOrderData.order_detail.sub_total = subtotal
            setSelectedorderData({
                ...{
                    "order_detail": selectedOrderData.order_detail,
                    "order_item": selectedOrderData.order_item
                }
            })
        }

    }


    // Added by Rohan kansari - 15/7/23
    // Reason - To add Selected Order item or Remove 
    function AddTickedOrderitem(DoIAdd, data, index) {
        if (DoIAdd) {
            setTickedItems([...tickedItems, data])
        } else {
            setTickedItems([...tickedItems.filter(t => t.id != data.id)])
        }

        console.log(tickedItems)
    }

    // End of code - ROhan kansari - 15/7/23

    // Uses - update form data which consist discount in rupees, in percentage , loyalty point 
    // , cancel reason, discount reason 
    async function UpdateorderDetail() {

        if (cancelReaon.length > 0) {
            document.getElementById("cancelInput").style.border = "1px solid #9c9c9c"
            errorText["cancelReason"] = ""
            setErrorText({ ...errorText })
        }

        const updatedOrderData = new FormData();

        updatedOrderData.append("id", selectedOrderData.order_detail.id);

        // Added by Rohan kansari - 30/6/23 - To update table no. also
        updatedOrderData.append("table_number", JSON.parse(OldOrdervalue.current.value).order_detail.table_number);
        updatedOrderData.append("discount_rupees", discountprice);
        updatedOrderData.append("discount_percentage", discountPercentage);
        updatedOrderData.append("apply_loyality_point", applyLoyalityPoint);
        updatedOrderData.append("payment_status", JSON.parse(OldOrdervalue.current.value).order_detail.payment_status);
        // updatedOrderData.append("cancelled_by", cancelledBy);
        updatedOrderData.append("cancelled_by", JSON.parse(OldOrdervalue.current.value).order_detail.cancelled_by);

        var IsProceed = true;
        if (IsCancelClicked) {
            if (cancelReaon.length == 0) {
                document.getElementById("cancelInput").style.borderBottom = "1px solid red"
                errorText["cancelReason"] = "Please enter reason and apply"
                setErrorText({ ...errorText })
                IsProceed = false
            }
            else {
                document.getElementById("cancelInput").style.borderBottom = "1px solid black"
                errorText["cancelReason"] = ""
                setErrorText({ ...errorText })
                updatedOrderData.append("order_status", "Cancelled");
                updatedOrderData.append("cancelled_by", "Admin");
                IsProceed = true;
            }
        }
        else {

            updatedOrderData.append("order_status", JSON.parse(OldOrdervalue.current.value).order_detail.order_status);
        }

        updatedOrderData.append("cancel_reason", cancelReaon);
        updatedOrderData.append("discount_reason", discountReason);

        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
        if (IsProceed) {
            const response = await saveOrderDetailsApi(tenant, updatedOrderData);
            if (response.msg) {
                Message("Order detail saved successfully", "success");
                UpdatingOpenedOrder(response.orderData)
                // Modified by Rohan kansari - 17/8/23 - To arrange order item 
                // setSelectedOrderItemList(response.orderItems)
                setSelectedOrderItemList(response.orderItems.sort((a, b) => b.id - a.id))
                document.getElementById("discount_rupees").style.border = "1px solid black"
                document.getElementById("discount_percentage").style.border = "1px solid black"
                setErrorText({})
            } else {
                Message("Something went wrong", "error");
            }
        }


    }




    // Uses - this only update table table and sending all old data
    // Modified by Rohan kansari- 21/8/23 - To give proper function name
    async function updateCustomerDetail(field) {
        const updatedOrderData = new FormData();

        updatedOrderData.append("id", selectedOrderData.order_detail.id);

        // Added by Rohan kansari - 30/6/23 - To update table no. also
        updatedOrderData.append("table_number", tablenumber);
        updatedOrderData.append("customer_name", name);
        updatedOrderData.append("customer_email", email);

        updatedOrderData.append("discount_rupees", JSON.parse(OldOrdervalue.current.value).order_detail.discount_rupees);

        updatedOrderData.append("discount_rupees", JSON.parse(OldOrdervalue.current.value).order_detail.discount_rupees);
        updatedOrderData.append("discount_percentage", JSON.parse(OldOrdervalue.current.value).order_detail.discount_percentage);
        updatedOrderData.append("apply_loyality_point", JSON.parse(OldOrdervalue.current.value).order_detail.apply_loyality_point);
        updatedOrderData.append("order_status", JSON.parse(OldOrdervalue.current.value).order_detail.order_status);
        updatedOrderData.append("payment_status", JSON.parse(OldOrdervalue.current.value).order_detail.payment_status);
        updatedOrderData.append("cancelled_by", JSON.parse(OldOrdervalue.current.value).order_detail.cancelled_by);
        updatedOrderData.append("cancel_reason", JSON.parse(OldOrdervalue.current.value).order_detail.cancel_reason);
        updatedOrderData.append("discount_reason", JSON.parse(OldOrdervalue.current.value).order_detail.discount_reason);


        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
        const response = await saveOrderDetailsApi(tenant, updatedOrderData);
        if (response.msg) {
            // Modified by Rohan kansari - 21/8/23 - To show error message according to filed updation
            // Message(`Table number saved successfully.`, "success");
            Message(`${field} saved successfully.`, "success");
            UpdatingOpenedOrder(response.orderData)
            // Modified by Rohan kansari - 17/8/23 - To arrange order item 
            // setSelectedOrderItemList(response.orderItems)
            setSelectedOrderItemList(response.orderItems.sort((a, b) => b.id - a.id))

        } else {
            Message("Something went wrong", "error");
        }
    }


    async function UpdateOrderStatusDetail(status) {

        const updatedOrderData = new FormData();

        updatedOrderData.append("id", selectedOrderData.order_detail.id);
        updatedOrderData.append("table_number", JSON.parse(OldOrdervalue.current.value).order_detail.table_number);
        updatedOrderData.append("discount_rupees", JSON.parse(OldOrdervalue.current.value).order_detail.discount_rupees);
        updatedOrderData.append("discount_percentage", JSON.parse(OldOrdervalue.current.value).order_detail.discount_percentage);
        updatedOrderData.append("apply_loyality_point", JSON.parse(OldOrdervalue.current.value).order_detail.apply_loyality_point);
        if (status.order_status) {
            updatedOrderData.append("order_status", status.order_status);
            updatedOrderData.append("payment_status", paymentStatus);
        }
        else {
            updatedOrderData.append("order_status", orderStatus);
            updatedOrderData.append("payment_status", status.payment_status);
        }


        updatedOrderData.append("cancelled_by", JSON.parse(OldOrdervalue.current.value).order_detail.cancelled_by);
        if (status.order_status == "Cancelled") {
            updatedOrderData.append("cancel_reason", cancelReaon);
            updatedOrderData.append("cancelled_by", "Admin");

        }
        else
            updatedOrderData.append("cancel_reason", JSON.parse(OldOrdervalue.current.value).order_detail.cancel_reason);
        updatedOrderData.append("discount_reason", JSON.parse(OldOrdervalue.current.value).order_detail.discount_reason);

        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
        const response = await saveOrderDetailsApi(tenant, updatedOrderData);
        if (response.msg) {
            Message("Order detail saved successfully", "success");
            UpdatingOpenedOrder(response.orderData)
            // Modified by Rohan kansari - 17/8/23 - To arrange order item 
            // setSelectedOrderItemList(response.orderItems)
            setSelectedOrderItemList(response.orderItems.sort((a, b) => b.id - a.id))
            setErrorText({})
            document.getElementById("discount_rupees").style.border = "1px solid black"
            document.getElementById("discount_percentage").style.border = "1px solid black"

        } else {
            Message("Something went wrong", "error");
        }

    }



    // Added by ROhan kansari - 20/7/23
    // Reason - To add all order object data in their usestate to perform on change functionality

    function UpdatingOpenedOrder(data) {

        console.log(data)
        setorderDetailsObj(data);
        setOrderId(data.order_id);
        setTablenumber(data.table_number);
        setOrderStatus(data.order_status);
        setPaymemntStatus(data.payment_status);
        setPaymentMode(data.payment_mode);
        setCancelledBy(data.cancelled_by);
        setCancelReason(data.cancel_reason);
        setDiscountRupee(data.discount_rupees);
        setDiscountprice(data.discount_rupees);
        setDiscountPercentage(data.discount_percentage);
        setDiscountReason(data.discount_reason);
        setApplyLoyalityPoint(data.apply_loyality_point);
        setLoyalityPointPrice(data.loyality_point_price);
        setLoyalityPointStatus(data.loyality_point_status);
        setLoyalityPointCalculated(data.loyality_point_calculated);
        setcustomerLoyalitypoint(data.customer_loyality_point);
        setSubTotal(data.sub_total);
        setCGST(data.cgst);
        setSGST(data.sgst);
        setTotal(data.total);
        setFinalAmount(data.final_amount);
        setRating(data.rating);
        setReview(data.review);

        // Modified by Rohan kansari- 29/8/23 - to capitalize and arrage according to requirement 
        // setName(data.customer_name);
        // setEmail(data.customer_email);
        setName(capitalizeFLetter(data.customer_name));
        setEmail(data.customer_email.toLowerCase());
        // End of Modification by Rohan kansari- 29/8/23 - to capitalize and arrage according to requirement 

    }


    const handlemoreItemCancel = () => {
        setAddMoreItemModalVisible(false);
    };


    // This is used for setting added item in list so, reseting with updated value in all required variable
    useEffect(() => {

        if (selectedOrderItemList.length > 0) {


            BackendCall()

            // Added by Rohan kansari - 16/8/23
            // Reason - To uncheck all selected multiple items
            setTickedItems([])

            // setting selected order with new data
            setSelectedorderData({
                ...{
                    "order_detail": orderDetailsObj
                    , "order_item": selectedOrderItemList
                }
            })

            // Setting datas for containing json string we will not updating in 
            // on change till we dosent get update value from backend
            OldOrdervalue.current.value = JSON.stringify(
                {
                    "order_detail": orderDetailsObj
                    , "order_item": selectedOrderItemList
                }
            )

            // All containing status we goes blank because we need updated status according to new added item
            updatedStatus.current.value = []
            selectedOrderItemList.filter(i => { updatedStatus.current.value.push({ "quantity": i.quantity, "item_status": i.item_status, "price": i.price }); i.order_id = orderDetailsObj.order_id; })


            setOpenActionPopupModal(
                {
                    ...{
                        "order_detail": orderDetailsObj
                        , "order_item": selectedOrderItemList
                    }
                }
            )

        }

    }, [selectedOrderItemList])


    // ENd of code - ROhan kansari - 20/7/23



    // Added by ROhan kansari -21/7/23
    // Reason - adding status method to get status frequently

    function getOrderStatus() {
        // console.log(selectedOrderData)
        if (selectedOrderData?.order_detail?.order_status != "Cancelled"
            && selectedOrderData?.order_detail?.payment_status == "Pending") {
            return true;
        }
        else {
            return false;
        }
    }

    // Added by ROhan kansari - 29/5/23
    // Reason - To continuously checking bill print allow
    function getbillStatus() {
        // console.log(selectedOrderData)
        // selectedOrderData?.order_detail?.order_status != "Cancelled"
        // &&
        if (selectedOrderData?.order_detail?.payment_status == "Completed" && selectedOrderData?.order_detail?.order_status != "Cancelled") {
            return true;
        }
        else {
            return false;
        }
    }
    // ENd of code - Rohan kansari - 21/7/23


    // Added by ROhan kansari - 23/7/23 
    // Reason - to validate discount rupees and percantage
    function inputIvalidationDiscountRupees(e) {
        var subtotal = JSON.parse(OldOrdervalue.current.value).order_detail.sub_total
        console.log(e.target.value)

        if (e.target.value.length > 0 && e.target.value < subTotal && (/^\d+$/.test(e.target.value) || e.target.value.includes("."))) {
            var total_price = subtotal - e.target.value - loyalityPointPrice
            var CGST = (cgst / (total / 100)) * total_price / 100
            var SGST = (sgst / (total / 100)) * total_price / 100
            setCGST(CGST)
            setSGST(SGST)
            setTotal(total_price)

            var discount_percentage = e.target.value / (subtotal / 100)
            setFinalAmount(total_price + SGST + CGST)
            setDiscountPercentage(discount_percentage.toFixed(2))
            // we are using this for setting max decimal till 2 decimal point 
            setDiscountRupee(e.target.value.indexOf(".") >= 0 ? e.target.value.slice(0, e.target.value.indexOf(".") + 3) : e.target.value)
            setDiscountprice(parseFloat(e.target.value))
            errorText["discount_price"] = ""
            setErrorText({ ...errorText })
            document.getElementById("discount_rupees").style.border = "1px solid black"
            document.getElementById("discount_percentage").style.border = "1px solid black"

        }
        else if (e.target.value.length == 0) {
            var discount_percentage = 0.00
            setDiscountRupee("")
            setDiscountprice(0.00)
            setDiscountPercentage(0.00)
            var total_price = subtotal - e.target.value - loyalityPointPrice
            var CGST = (cgst / (total / 100)) * total_price / 100
            var SGST = (sgst / (total / 100)) * total_price / 100
            setCGST(CGST)
            setSGST(SGST)
            setTotal(total_price)
            setFinalAmount(total + SGST + CGST)
            errorText["discount_price"] = "Please enter discount"
            setErrorText({ ...errorText })

            document.getElementById("discount_rupees").style.border = "1px solid red"
        }
        else if (! /^\d+$/.test(e.target.value)) {
            errorText["discount_price"] = "Discount price should be in digit"
            setErrorText({ ...errorText })
            document.getElementById("discount_rupees").style.border = "1px solid red"
        }
        else if (e.target.value > subTotal) {
            errorText["discount_price"] = "Discount price should not be greater than Subtotal"
            setErrorText({ ...errorText })
            document.getElementById("discount_rupees").style.border = "1px solid red"
        }
    }

    function inputValidationDiscountPercentage(e) {
        var subtotal = JSON.parse(OldOrdervalue.current.value).order_detail.sub_total

        if (e.target.value.length > 0 && e.target.value < 101 && (/^\d+$/.test(e.target.value) || e.target.value.includes("."))) {
            var discount_percentage = e.target.value * (subtotal / 100)
            var total_price = subtotal - discount_percentage - loyalityPointPrice
            var CGST = (cgst / (total / 100)) * total_price / 100
            var SGST = (sgst / (total / 100)) * total_price / 100
            setCGST(CGST)
            setSGST(SGST)
            setTotal(total_price)
            setFinalAmount(subtotal - loyalityPointPrice - discount_percentage + SGST + CGST)
            setDiscountPercentage(e.target.value)
            setDiscountRupee(discount_percentage.toFixed(2))
            setDiscountprice(parseFloat(discount_percentage))
            document.getElementById("discount_percentage").style.border = "1px solid black"
            document.getElementById("discount_rupees").style.border = "1px solid black"
            errorText["discount_price"] = ""
            setErrorText({ ...errorText })
        }
        else if (e.target.value.length == 0) {
            var discount_percentage = 0.00
            setDiscountRupee(0)
            setDiscountprice(0.00)
            setDiscountPercentage("")
            var total_price = subtotal - discount_percentage - loyalityPointPrice
            var CGST = (cgst / (total / 100)) * total_price / 100
            var SGST = (sgst / (total / 100)) * total_price / 100
            setCGST(CGST)
            setSGST(SGST)
            setTotal(total_price)
            setFinalAmount(subtotal - loyalityPointPrice - discount_percentage + SGST + CGST)
            document.getElementById("discount_percentage").style.border = "1px solid red"
            errorText["discount_price"] = "Please enter discount"
            setErrorText({ ...errorText })
        }
        else if (! /^\d+$/.test(e.target.value)) {
            errorText["discount_price"] = "Discount price should be in digit"
            setErrorText({ ...errorText })
            document.getElementById("discount_percentage").style.border = "1px solid red"
        }
        else if (e.target.value > 100) {
            errorText["discount_price"] = "Discount price should not be greater than 100%"
            setErrorText({ ...errorText })
            document.getElementById("discount_percentage").style.border = "1px solid red"

        }
    }

    function validateLoyalityPoint(e) {
        // if(e.target.value.length<applyLoyalityPoint.length){
        //     // console.log(applyLoyalityPoint[applyLoyalityPoint.length-1])
        //     setcustomerLoyalitypoint(parseInt(customerLoyalitypoint)+parseInt(applyLoyalityPoint[applyLoyalityPoint.length-1]))
        // }
        var loyality_price = settings.per_loyality_point_value * e.target.value
        var customer_earn = parseInt(customerLoyalitypoint) + JSON.parse(OldOrdervalue.current.value).order_detail.apply_loyality_point
        if (e.target.value > -1 && (/^\d+$/.test(e.target.value) || e.target.value.includes(".")) && e.target.value.length > 0 && e.target.value < customer_earn + 1 && loyality_price < subTotal + 1) {
            setApplyLoyalityPoint(e.target.value)
            var loyalityPrice = settings.per_loyality_point_value * e.target.value
            setLoyalityPointPrice(loyalityPrice)
            var total_price = subTotal - loyalityPrice - discountprice
            var CGST = (cgst / (total / 100)) * total_price / 100
            var SGST = (sgst / (total / 100)) * total_price / 100
            setCGST(CGST)
            setSGST(SGST)
            setTotal(total_price)
            setFinalAmount(total_price + SGST + CGST)
            errorText["loyality_point"] = ""
            setErrorText({ ...errorText })

        }
        else if (e.target.value.length == 0) {
            setApplyLoyalityPoint("")
            var loyalityPrice = settings.per_loyality_point_value * e.target.value
            setLoyalityPointPrice(loyalityPrice)
            var total_price = subTotal - loyalityPrice - discountprice
            var CGST = (cgst / (total / 100)) * total_price / 100
            var SGST = (sgst / (total / 100)) * total_price / 100
            setCGST(CGST)
            setSGST(SGST)
            setTotal(total_price)
            setFinalAmount(total_price + SGST + CGST)

        }
        else if (! /^\d+$/.test(e.target.value)) {
            errorText["loyality_point"] = "Loyality point should always in digit"
            setErrorText({ ...errorText })
        }

        else if (e.target.value > customer_earn) {
            errorText["loyality_point"] = "Loyality point should not be less then earn point"
            setErrorText({ ...errorText })
        }
        else if (loyality_price >= subTotal + 1) {
            errorText["loyality_point"] = "Loyality point should not be greater then sub-total"
            setErrorText({ ...errorText })
        }

    }


    // ENd of code - Rohan kansari - 21/7/23 


    function settingClickedData(data) {
        // Sending all datas in openActionPopupModel variable
        setOpenActionPopupModal({
            ...{
                "order_detail": data
                , "order_item": orderItemList.filter(i => i.order_id == data.order_id)
            }
        });

        setPopupOpen(true);

        // This line will push Original status in array and change only when update Order Item COmes from backend
        OldOrdervalue.current.value = JSON.stringify({
            "order_detail": data
            , "order_item": orderItemList.filter(i => i.order_id == data.order_id)
        })

        // This state contain selected order item and sending in add mor eitem for new updation 
        setSelectedOrderItemList(orderItemList.filter(i => i.order_id == data.order_id))

        // Updating  order item status in useRef state for save unchanged data for reverting value
        orderItemList.filter(i => { if (i.order_id == data.order_id) return updatedStatus.current.value.push({ "quantity": i.quantity, "item_status": i.item_status, "price": i.price }) })

        // Setting all order data seperatly in each usestate
        UpdatingOpenedOrder(data)

        // Added by Rohan kansari - 4/8/23
        // Reason - to reset cancel reason



        console.log({
            "order_detail": data
            , "order_item": orderItemList.filter(i => i.order_id == data.order_id)
        })
    }

    // Added by Rohan kansari - 28/7/23 
    // Reason - To arrange sending print data 

    function sendPrintDatas() {
        PrintBill(selectedOrderData.order_detail,
            selectedOrderData.order_item,
            restroDetail, gstFssai, settings)
    }

    // End of code - ROhan kansari - 28/7/23

    // Added by Rohan kansari - 28/8/23 - To capitalize first letetr of each word
    function capitalizeFLetter(string) {
        var stringArr = string.split(" ").map(e => {
            if (e.length > 1)
                return e.charAt(0).toUpperCase() + e.slice(1).toLowerCase()
            else
                return e.toUpperCase()
        })

        return stringArr.join(" ");
    }
    // End of modification - Rohan kansari - 28/8/23 - To capitalize first letetr of each word

    return (
        <>
            {/* Added and modified by - ROhan Kansari - 25/5/23
            Reason - added checkbox and change name of mapped data  */}
            {/*modified by - ROhan Kansari - 26/5/23
            Reason - Managing checkbox ui  */}

            {/* Modified by Rohan kansari - 23/6/23
                Reason - To save selected tab in localstorage and consist admin on same tab in back also */}
            {/* <div className={style.radioGroup}>
                <input className={style.radioButton} type='radio' id="radio1" name="group" defaultChecked={true} />
                <label className={style.tabLabel} htmlFor='radio1' onClick={e => { setSelectedOrder(newlyPlaced); uncheckAll({ fade: false }) }}>Newly Placed</label>
                <input className={style.radioButton} id='radio2' type='radio' name="group" />
                <label className={style.tabLabel} htmlFor='radio2' onClick={e => { setSelectedOrder(todaysPendingOrder); uncheckAll({ fade: false }) }}>Pending</label>
                <input className={style.radioButton} id='radio3' type='radio' name="group" />
                <label className={style.tabLabel} htmlFor='radio3' onClick={e => { setSelectedOrder(todaysCompletedOrder); uncheckAll({ fade: true }) }}>Completed</label>
            </div> */}

            <div className={style.radioGroup}>
                <input className={style.radioButton} type='radio' id="newly_placed" name="group" defaultChecked={localStorage.getItem("selectedTab") == "Newly_placed"} />
                <label className={style.tabLabel} htmlFor='newly_placed' onClick={e => { setSelectedOrder(newlyPlaced); localStorage.setItem("selectedTab", "Newly_placed"); uncheckAll({ fade: false }) }}>Newly Placed</label>
                <input className={style.radioButton} id='pending_order' type='radio' name="group" defaultChecked={localStorage.getItem("selectedTab") == "Pending"} />
                <label className={style.tabLabel} htmlFor='pending_order' onClick={e => { setSelectedOrder(todaysPendingOrder); localStorage.setItem("selectedTab", "Pending"); uncheckAll({ fade: false }) }}>Pending</label>
                <input className={style.radioButton} id='completed' type='radio' name="group" defaultChecked={localStorage.getItem("selectedTab") == "Completed"} />
                <label className={style.tabLabel} htmlFor='completed' onClick={e => { setSelectedOrder(todaysCompletedOrder); localStorage.setItem("selectedTab", "Completed"); uncheckAll({ fade: true }) }}>Completed</label>
            </div>
            {/* End of code - ROhan kansari - 23/6/23 */}

            <div className={style.container} >
                <div className={style.TabelContainer}>

                    <div className={style.table}>
                        <div className={style.tableHeading}>
                            <div className={style.column1}><input className={style.checkbox} id="ParentCheckbox" type="checkbox" onChange={e => checkAndUncheckAll(e.target.checked)} />S.No</div>
                            <div className={style.column2}>Table No </div>
                            <div className={style.column8}>Order No</div>
                            <div className={style.column3}>Order Status</div>
                            <div className={style.column4}>Time</div>
                            <div className={style.column5}>Amount</div>
                            <div className={style.column6}>Payment Status</div>
                            <div className={style.column7}>Action</div>
                        </div>

                        {selectedOrder && selectedOrder.length > 0 ? selectedOrder.map((data, i) => (
                            <div className={style.row} >
                                <div className={style.columnData1}>
                                    <input className={style.checkbox} id="checkbox"
                                        onChange={e => setCheckedItems(data, e.target.checked)} type="checkbox"
                                        // Added by Yuvraj Sahu on 03-08-2023
                                        // Reason - to disable the order checkbox
                                        disabled={data.order_status == "Cancelled" ? true : false}
                                    // End of addition by Yuvraj Sahu on 03-08-2023
                                    />
                                    {i + 1}
                                </div>
                                {/* <input className={style.checkbox} id="checkbox"
                                        onChange={e => setCheckedItems(data, e.target.checked)} type="checkbox" /> */}

                                {/* // Commented and modification by - Suman sahu On 10/06/2023
                                    // reason - change that popup to antd modal */}

                                {/* <Popover placement="right"
                                    content={e => orderItemModel(orderItemList.filter(o => o.order_id == data.order_id), i)}
                                    Added by Om Shrivastava on 05-06-23
                                    Reason : Fix the arrow issue when we click cancel button
                                    open={popupOrderItem}
                                    End of addition by Om Shrivastava on 05-06-23
                                    onOpenChange={e => {
                                        if (!e) {
                                            selectboxReset()
                                            Added by Om Shrivastava on 05-06-23
                                            Reason : Fix the arrow issue when we click cancel button
                                            setPopupOrderItem(!popupOrderItem)
                                            End of addition by Om Shrivastava on 05-06-23
                                        }
                                    }}
                                    trigger="click"
                                >
                                    <div className={style.columnData2} onClick={e => setPopupOrderItem(true)}>

                                        {data.table_number}
                                    </div>

                                    <button className={style.printBtn} onClick={e => setPopupOpen({ [`${i}`]: true })}>More</button>
                                </Popover> */}

                                <div className={style.columnData2}
                                // Commented by ROhan kansari - 20/7/23
                                // Reason - No where using it now , its for order item model but now all code is moved on to one sigle model
                                // onClick={e => { setOpenModalNumOrderItem(data); setPopupOrderItem(true) }} 
                                >{data.table_number}</div>
                                {/* end of modification on 10/06/2023 */}

                                <div className={style.columnData8}>{data.order_id}</div>
                                <div className={style.columnData3}>{getStatusBtn(data.order_status)}</div>
                                <div className={style.columnData4}>{data.date.substring(11, 16)}</div>
                                <div className={style.columnData5}>{data.total}</div>
                                <div className={style.columnData6}>{getStatusBtn(data.payment_status)}</div>
                                <div className={style.columnData7}>
                                    {/* // Commented and modification by - Suman sahu On 12/06/2023
                                    // reason - change that popup to antd modal */}
                                    {/* <Popover placement="left"
                                        content={e => model(data, i)}
                                        // Added by Om Shrivastava on 05-06-23
                                        // Reason : Fix the arrow issue when we click cancel button
                                        // open={popupOpen}
                                        // End of addition by Om Shrivastava on 05-06-23
                                        onOpenChange={e => {
                                            if (!e) {
                                                selectboxReset()
                                                // Added by Om Shrivastava on 05-06-23
                                                // Reason : Fix the arrow issue when we click cancel button
                                                // setPopupOrderItem(!popupOrderItem)
                                                // setPopupOpen(!popupOpen)
                                                // End of addition by Om Shrivastava on 05-06-23
                                            }
                                        }}
                                        trigger='click'>
                                        {/* <button className={style.printBtn} onClick={e => setPopupOpen(true)}>More</button> */}
                                    {/* </Popover>  */}

                                    {/* Modofied by Rohan kansari - 13/7/23- Reason - Adding selected order data and order item */}
                                    {/* <div className={style.columnData7} onClick={e => { setOpenActionPopupModal(data); setPopupOpen(true) }}>
                                    <button className={style.printBtn}>More</button></div> */}

                                    <div className={style.columnData7}
                                        onClick={e => { settingClickedData(data) }}><button className={style.printBtn}>More</button>
                                    </div>
                                    {/* ENd of code - Rohan kansari - 13/7/23 */}
                                    {/* end of modification on 12/06/2023 */}
                                </div>
                            </div>
                            // Added by Rohan Kansari - 30/5/23 
                            // Reason - To set Loading message till data is not get
                        )) : isLoading ? <div className={style.row}>
                            <div className={style.EmptyText}> Please wait For Result .....</div>
                        </div> :
                            <div className={style.row}>
                                <div className={style.EmptyText}> No order found !</div>
                            </div>
                            // End of code - Rohan KAnsari - 30/5/23
                        }
                    </div>

                </div>
            </div>
            <div className={style.MultiupdateContainer} id="allupdate">
                <div className={style.updateflexContainer}>
                    {/* Commeted and added by yuvraj Sahu on 03-08-2023
                    Reason - to change the lable stayle give button for update order */}
                    {/* <div className={style.lable} style={{ fontWeight: "500", marginLeft: "20px" }}>Order status</div> */}
                    <div className={style.statusLable} style={{ fontWeight: "500", marginLeft: "20px" }}>Order status</div>
                    <div className={style.selctedContentBox}>
                        {/* Added and commeted by Yuvraj Sahu on 28-06-2023
                        Reason - to replace dropdown with radio */}
                        {/* Added And modified by Yuvraj Sahu on 02-08-2023
                        Reason - to design radio to button */}
                        {/* <Radio.Group onChange={handleOrderStatus} value={selectedOrderStatus} id="all_order_status_selected">
                            <Radio value="Placed">Placed</Radio>
                            <Radio value="Confirm">Confirm</Radio>
                            <Radio value="Cooked">Cooked</Radio>
                            <Radio value="Served">Served</Radio>
                            <Radio value="Cancelled">Cancelled</Radio>
                        </Radio.Group> */}
                        {/* Modifed by Yuvraj Sahu on 03-08-2023
                            Reason - to disable the area when order not chekced */}
                        {/* <div className={style.updateAllOrderstatusBtnContainer}> */}
                        <div className={style.updateAllOrderstatusBtnContainer} >
                            {/* End of disable button colors by Yuvraj Sahu on 03-08-2023 */}
                            <div className={style.orderStatusArrowBtnContainerDashboard}>
                                {/* Modified by Yuvraj Sahu on 03-08-2023
                                Reason - to design a button  */}
                                {/* Modified by Yuvraj Sahu on 09-08-2023
                                Reason - to design button */}
                                <p className={style.statusBtnDesign}><button className={`order-btn-right`}
                                    onClick={e => {
                                        // if (statusValidation("Placed", paymentStatus, selectedOrderData.order_detail))
                                        updateAll({
                                            "order_status": "Placed"
                                        })
                                    }
                                    }
                                    style={{ opacity: 0.4 }}
                                    // Added by Yuvraj Sahu on 03-08-2023
                                    // Reason - to disable the button
                                    disabled={true}
                                // End of addition by yuvraj Sahu on 03-08-2023
                                ><a href="#">Placed</a></button></p>
                                <p className={style.statusBtnDesign}><button className={`order-btn-right`}
                                    onClick={e => {
                                        updateAll({
                                            "order_status": "Confirm"
                                        })
                                        // if (statusValidation("Confirm", paymentStatus, selectedOrderData.order_detail)) {
                                        //     printKot(selectedOrderData.order_item.filter((o) => {
                                        //         if (o.order_id == openActionPopupModal.order_detail.order_id &&
                                        //             o.kot_print_status == false &&
                                        //             o.item_status != "Cancelled")
                                        //             return o
                                        //     }
                                        //     ))
                                        // }
                                    }}
                                    // Added by Yuvraj Sahu on 03-08-2023
                                    // Reason - to disable the button
                                    style={{ opacity: checkedItems.length > 0 ? 1 : 0.4 }}
                                    disabled={checkedItems.length > 0 ? false : true}
                                // End of addition by yuvraj Sahu on 03-08-2023
                                ><a href="#">Confirm</a></button></p>
                                <p className={style.statusBtnDesign}><button className={`order-btn-right`}
                                    onClick={e => {
                                        // if (statusValidation("Cooked", paymentStatus, selectedOrderData.order_detail))
                                        updateAll({
                                            "order_status": "Cooked"
                                        })
                                    }}
                                    // Added by Yuvraj Sahu on 03-08-2023
                                    // Reason - to disable the button
                                    style={{ opacity: checkedItems.length > 0 ? 1 : 0.4 }}
                                    disabled={checkedItems.length > 0 ? false : true}
                                // End of addition by yuvraj Sahu on 03-08-2023
                                ><a href="#">Cooked</a></button></p>
                                <p className={style.statusBtnDesign}><button className={`order-btn-right`}
                                    onClick={e => {
                                        // if (statusValidation("Served", paymentStatus, selectedOrderData.order_detail))
                                        updateAll({
                                            "order_status": "Served"
                                        })
                                    }}
                                    // Added by Yuvraj Sahu on 03-08-2023
                                    // Reason - to disable the button
                                    style={{ opacity: checkedItems.length > 0 ? 1 : 0.4 }}
                                    disabled={checkedItems.length > 0 ? false : true}
                                // End of addition by yuvraj Sahu on 03-08-2023
                                ><a href="#">Served</a></button></p>
                            </div>
                            {/* <button className={`${style.orderCancelBtn} ${orderStatus == "Cancelled" ? "CancelStatusBtn" : null}`}
                                onClick={e => {
                                    if (statusValidation("Cancelled", paymentStatus, selectedOrderData.order_detail)) {
                                        if (selectedOrderData.order_detail.cancel_reason.length == 0 && orderStatus != "Cancelled") {
                                            document.getElementById("cancelInput").scrollIntoView()
                                            document.getElementById("cancelInput").style.border = "1px solid red"
                                            errorText["cancelReason"] = "Please enter reason and apply"
                                            setErrorText({ ...errorText })
                                        } else {
                                            document.getElementById("cancelInput").scrollIntoView()
                                            document.getElementById("cancelInput").style.border = "1px solid #9c9c9c"
                                            errorText["cancelReason"] = ""
                                            setErrorText({ ...errorText })
                                            UpdateOrderStatusDetail({
                                                "order_status": "Cancelled"
                                            })
                                        }
                                    }
                                }}>Cancel</button> */}
                        </div>
                        {/* End of designing by Yuvraj Sahu on 02-08-2023 */}
                        {/* <select id="all_order_status_selected" onChange={e => document.getElementById("all_order_status_selected").value = e.target.value}>
                            <option value="Placed" className={style.options}>Placed</option>
                            <option value="Confirm" className={style.options}>Confirm</option>
                            <option value="Cooked" className={style.options}>Cooked</option>
                            <option value="Served" className={style.options}>Served</option>
                        </select> */}
                        {/* End of modification by yuvraj Sahu on 28-06-2023 */}
                    </div>
                </div>
                <div className={style.updateflexContainer}>
                    {/* Commeted and modified by Yuvraj Sahu on 03-08-2023
                    Reason - to design a payment button and remove radio */}
                    {/* <div className={style.lable} style={{ fontWeight: "500", marginLeft: "20px" }}>Payment status</div> */}
                    <div className={style.statusLable} style={{ fontWeight: "500", marginLeft: "20px" }}>Payment status</div>

                    {/* Modifed by Yuvraj Sahu on 03-08-2023
                        Reason - to disable the area when order not chekced */}
                    {/* <div className={style.selctedContentBox}> */}
                    <div className={style.selctedContentBox} >
                        {/* End of disable button colors by Yuvraj Sahu on 03-08-2023 */}
                        {/* Added and commeted by Yuvraj Sahu on 28-06-2023
                        Reason - to replace dropdown with radio */}

                        {/* Commeted and modified by yuvraj Sahu on 02-08-2023
                        Reason - to update the payment status  */}
                        {/* <Radio.Group onChange={handlePaymentStatus} value={selectedPaymentStatus} id="all_payment_status_selected">
                            <Radio value="Pending">Pending</Radio>
                            <Radio value="Completed">Completed</Radio>
                        </Radio.Group> */}
                        <div className={style.updateAllOrderstatusBtnContainer} >
                            <div className={style.orderStatusArrowBtnContainerDashboard}>
                                <p className={style.statusBtnDesign}><button className={`payment-btn-right`}
                                    onClick={e => {
                                        // if (statusValidation(orderStatus, "Pending", selectedOrderData.order_detail))
                                        updateAll({
                                            "payment_status": "Pending"
                                        })
                                    }}
                                    // Added by Yuvraj Sahu on 03-08-2023
                                    // Reason - to disable the button
                                    style={{ opacity: checkedItems.length > 0 ? 1 : 0.4 }}
                                    disabled={checkedItems.length > 0 ? false : true}
                                // End of addition by yuvraj Sahu on 03-08-2023
                                ><a href="#"
                                >Pending</a></button></p>
                                <p className={style.statusBtnDesign}><button className={`payment-btn-right`}
                                    onClick={e => {
                                        // if (statusValidation(orderStatus, "Completed", selectedOrderData.order_detail))
                                        updateAll({
                                            "payment_status": "Completed"
                                        })
                                    }}
                                    // Added by Yuvraj Sahu on 03-08-2023
                                    // Reason - to disable the button
                                    style={{ opacity: checkedItems.length > 0 ? 1 : 0.4 }}
                                    disabled={checkedItems.length > 0 ? false : true}
                                // End of addition by yuvraj Sahu on 03-08-2023
                                ><a href="#">Completed</a></button></p>
                                {/* End of modification by Yuvraj Sahu on 09-08-2023 */}
                            </div>
                        </div>
                        {/* End of modification by Yuvraj Sahu on 02-08-2023 */}

                        {/* <select id="all_payment_status_selected" onChange={e => document.getElementById("all_payment_status_selected").value = e.target.value}>
                            <option value="Pending" className={style.options}>Pending</option>
                            <option value="Completed" className={style.options}>Completed</option>
                        </select> */}
                        {/* End of modification by yuvraj Sahu on 28-06-2023 */}
                    </div>
                </div>

                {/* Added by Yuvraj Sahu on 03-08-2023
                Reason - to cancel the order */}
                <div className={style.updateflexContainer}>
                    {/* <div className={style.statusLable} style={{ fontWeight: "500", marginLeft: "20px" }}>Order</div> */}
                    <div className={style.selctedContentBox} >
                        {/* <div className={style.updateAllOrderstatusBtnContainer} >
                            <div className={style.orderStatusArrowBtnContainerDashboard}>
                                <p><button className={`cancel-btn-right`}
                                    onClick={e => {
                                        // if (statusValidation(orderStatus, "Pending", selectedOrderData.order_detail))
                                            updateAll({
                                                "order_status": "Cancelled"
                                            })
                                    }}
                                    // style={{opacity : checkedItems.length > 0 ? 1 : 0.5}}
                                    // disabled ={checkedItems.length > 0 ? false : true}
                                ><a href="#"
                                >Cancel</a></button></p>
                            </div>
                        </div> */}

                        <button className={`${style.checkOrderCancelBtn}`}
                            onClick={e => {
                                updateAll({
                                    "order_status": "Cancelled"
                                })
                                // if (statusValidation("Cancelled", paymentStatus, selectedOrderData.order_detail)) {
                                //     if (selectedOrderData.order_detail.cancel_reason.length == 0 && orderStatus != "Cancelled") {
                                //         document.getElementById("cancelInput").scrollIntoView()
                                //         document.getElementById("cancelInput").style.border = "1px solid red"
                                //         errorText["cancelReason"] = "Please enter reason and apply"
                                //         setErrorText({ ...errorText })
                                //     } else {
                                //         document.getElementById("cancelInput").scrollIntoView()
                                //         document.getElementById("cancelInput").style.border = "1px solid #9c9c9c"
                                //         errorText["cancelReason"] = ""
                                //         setErrorText({ ...errorText })
                                //         UpdateOrderStatusDetail({
                                //             "order_status": "Cancelled"
                                //         })
                                //     }
                                // }
                            }}
                            // Added by Yuvraj Sahu on 03-08-2023
                            // Reason - to disable the button
                            style={{ opacity: checkedItems.length > 0 ? 1 : 0.3 }}
                            disabled={checkedItems.length > 0 ? false : true}
                        // End of addition by yuvraj Sahu on 03-08-2023
                        >Order cancel</button>
                        {/* End of modification by Yuvraj Sahu on 02-08-2023 */}

                        {/* <select id="all_payment_status_selected" onChange={e => document.getElementById("all_payment_status_selected").value = e.target.value}>
                            <option value="Pending" className={style.options}>Pending</option>
                            <option value="Completed" className={style.options}>Completed</option>
                        </select> */}
                        {/* End of modification by yuvraj Sahu on 28-06-2023 */}
                    </div>
                </div>
                {/* End of addition by Yuvraj Sahu on 03-08-2023 */}

                {/* Commeted by Yuvraj Sahu on 02-08-2023
                Reason - to remove the update button */}
                {/* <div className={style.updateBtn} onClick={e => updateAll()}>Update All</div> */}
                {/* End of modification by yuvraj Sahu on 02-08-2023 */}

                {/* added by - suman sahu on 10/06/2023
                    reason - change the popup when click the data of table no. in the dashbord */}

                {/*Modified by ROhan kansari - 26/6/23
                     Reason - To save and resatore select box value  */}

                {/*Commented by ROhan kansari - 10/7/23
                     Reason - To remove order item model and move it to more button model*/}
                {/* <Modal open={popupOrderItem} onCancel={e => {
                    oldStatusReverting();
                    closeModalOrderItem();
                }} footer={null} className={style.modalContainer}>

                    <div className={style.popupItemContainer}>
                        <div className={style.itemlist}>
                               /* Addd by Rohan kansari - 30/6/23 
                                Reason - To display always sorted value */
                            /* {orderItemList?.map((orderItem, i) => { ----
                            {orderItemList?.sort((a, b) => a.id < b.id).map((orderItem, i) => {
                                // End of code - Rohan kansari - 30/6/23

                                if (orderItem.order_id == openModalNumOrderItem.order_id && popupOrderItem) {
                                    if (selectedItemArr.current.items.length == 0)
                                        orderItemList.filter((item, index) => { if (item.order_id == openModalNumOrderItem.order_id) selectedItemArr.current.items.push({ "id": item.id, "status": item.item_status }) })

                                    return <div key={i} className={style.itemListContainer}
                                        // added by - Suman sahu on - 17/06/2023
                                        style={{
                                            marginTop: "5px",
                                            background:
                                                i % 2 === 0
                                                    ? " rgb(234, 229, 227) "
                                                    : " #faf5f5 ",
                                        }}
                                    //   end of addition by - Suman sahu on - 17/06/2023
                                    >
                                        <div className={style.title}>
                                            {orderItem.item}
                                        </div>
                                        <div className={style.itemStatusContainer} >
                                            <label className={style.lable}>Serving Size</label>
                                            <div className={style.quantityContainer}>{orderItem.serving_size}</div>
                                        </div>
                                        <div className={style.itemStatusContainer} >
                                            <label className={style.lable}>Quantity</label>
                                            <div className={style.quantityContainer}>{orderItem.quantity}</div>
                                        </div>
                                        {console.log(orderItem.item_status)}
                                        <div className={style.itemStatusContainer} >
                                            <label className={style.lable}>Item Status</label>
                                            <div className={style.selctedContentBox}>
                                                {orderItem.item_status != "Cancelled" ? <select
                                                    value={orderItem.item_status}
                                                    // checked={orderItem.item_status}
                                                    // added by - Suman sahu on - 14/06/2023
                                                    // reason - to save item status and render that value on select box after updating
                                                    onChange={e => {
                                                        orderItemList[i].item_status = e.target.value
                                                        setOrderItem([...orderItemList])
                                                        console.log(selectedItemArr)
                                                        // console.log(e.target.value)
                                                    }}
                                                    // end of addition by - Suman sahu on - 14/06/2023
                                                    className="item_selected">
                                                    /* Modified by Rohan Kansari - 24/6/23
                                                         Reason - facing issue on showing default value so changing flow where
                                                          i am giving condition in in each option */
                                                    /* <option className={style.options} value="Pending" >Pending</option>
                                                     <option className={style.options} value="Confirm" >Confirm</option> --
                                                    <option className={style.options} value="Pending" selected={orderItem.item_status == "Pending"}>Pending</option>
                                                    <option className={style.options} value="Confirm" selected={orderItem.item_status == "Confirm"}>Confirm</option>
                                                    <option className={style.options} value="Cancelled" selected={orderItem.item_status == "Cancelled"}>Cancelled</option>
                                                    /* End of code by Rohan Kansari - 24/5/23 - To add cancel option in item status ---
                                                </select> : orderItem.item_status}
                                            </div>
                                        </div>
                                    </div>
                                }
                            })}
                        </div>
                    </div>
                    <div className={style.btnContainer}>
                        <div className={style.selectionContainer}>
                            <button className={style.btnUpdate}
                                onClick={e => { orderItemModel(orderItemList.filter((item, index) => item.order_id == openModalNumOrderItem.order_id)) }}
                            >Update</button>
                        </div>
                        <div className={style.selectionContainer}>
                            <button className={style.btnUpdate}
                                onClick={e => { oldStatusReverting(); closeModalOrderItem(); }}
                            >Cancel</button>
                        </div>
                    </div>
                </Modal> */}
                {/* End of code - Rohan kansari - 10/7/23 - To remove order item model */}
                {/* End of code - ROhan kansari - 26/6/23 */}
                {/* end of addition by - suman sahu on 10/06/2023 */}

                {/* added by - suman sahu on 11/06/2023
                    reason - change the popup when click the data of action in the dashbord */}

                {/* Modified by Rohan kansari- 11/7/23 
                    Reason - New Ui changes and Functionality  */}
                <Modal open={popupOpen}
                    afterOpenChange={e => { if (e) setSelectedorderData(openActionPopupModal) }
                    }

                    onCancel={e => {

                        BackendCall()
                        updatedStatus.current.value = []
                        OldOrdervalue.current.value = {}
                        closePopupOpen();
                        // oldOrderDataReverting() 
                    }}

                    // style={{ top: 0, bottom: 0, margin: "10px auto", minWidth: "60vw", padding: "0" }}
                    // width="60vw"
                    footer={null} className={style.modalContainer} closeIcon={<AiOutlineClose />}>
                    {popupOpen ? <div className={style.popupContainer}>

                        <div className={style.CustomerInformationBox}>
                            {/* This content is fixed it not scrolled up */}
                            <div className={style.topHeading}>
                                <div className={style.Order_idText}>{selectedOrderData?.order_detail?.order_id}</div>
                                <div className={style.ActionBtn}>
                                    <button className={`${style.orderCancelBtn} ${getOrderStatus() ? null : style.disbaleBtn}`}
                                        onClick={e => {
                                            // console.log(statusValidation("Cancelled", paymentStatus, selectedOrderData.order_detail))
                                            if (statusValidation("Cancelled", paymentStatus, selectedOrderData.order_detail, true)) {
                                                if (selectedOrderData.order_detail.cancel_reason.length == 0 && orderStatus != "Cancelled") {
                                                    document.getElementById("cancelInput").scrollIntoView()
                                                    document.getElementById("cancelInput").style.borderBottom = "1px solid red"
                                                    errorText["cancelReason"] = "Please enter reason and apply"
                                                    setErrorText({ ...errorText })
                                                    setCancelClicked(true)
                                                } else {
                                                    // document.getElementById("cancelInput").scrollIntoView()
                                                    document.getElementById("cancelInput").style.borderBottom = "1px solid #9c9c9c"
                                                    errorText["cancelReason"] = ""
                                                    setErrorText({ ...errorText })
                                                    UpdateOrderStatusDetail({
                                                        "order_status": "Cancelled"
                                                    })
                                                }
                                            }
                                        }}>Cancel Order</button>
                                    <button className={`${selectedOrderData.order_detail?.order_status == "Cancelled" || selectedOrderData.order_detail?.order_status == "Placed" ? style.disbaleBtn : null} ${style.KotBtn}`} onClick={e => {
                                        PrintKot(selectedOrderData.order_detail, selectedOrderData.order_item.filter(e => e.item_status == "Confirm"), restroDetail, gstFssai, settings)
                                    }}>Print Kot</button>
                                    <button className={`${style.getbill} ${getbillStatus() ? null : style.disbaleBtn}`}
                                        onClick={e => { if (getbillStatus()) sendPrintDatas() }}>Get Bill</button>

                                </div>
                            </div>


                            <div className={style.flex}>
                                <div className={style.informationContainer}>
                                    <div className={style.information} >
                                        <div className={style.WhiteLabel}>
                                            Table :
                                        </div>
                                        <div className={style.data}>
                                            {inputEnable == "tableEdit" ? <>

                                                <input className={style.EditableInput} onKeyUp={e => {
                                                    if (e.key == "Enter" || e.keyCode == 13) {
                                                        // Modified by Rohan kansari - 19/8/23
                                                        // Reason - to send error message for blank table number
                                                        if (tablenumber.length > 0) {
                                                            updateCustomerDetail("Table Number"); setInputEnable(null);
                                                        } else {
                                                            Message("Please enter table number", "warning")
                                                        }
                                                        // End of Modification by Rohan kansari - 19/8/23
                                                        // Reason - to send error message for blank table number
                                                    }
                                                }

                                                } onChange={e => {
                                                    selectedOrderData.order_detail.table_number = e.target.value
                                                    setSelectedorderData({ ...selectedOrderData })
                                                    setTablenumber(e.target.value)
                                                }}
                                                    value={selectedOrderData.order_detail.table_number}
                                                    onBlur={e => {
                                                        selectedOrderData.order_detail.table_number = JSON.parse(OldOrdervalue.current.value).order_detail.table_number
                                                        setSelectedorderData({ ...selectedOrderData })
                                                        setInputEnable(null)
                                                    }}
                                                    maxLength={6}
                                                />
                                                <TiTick className={style.inputChecked} onClick={e => {
                                                    // Modified by Rohan kansari - 19/8/23
                                                    // Reason - to send error message for blank table number
                                                    if (tablenumber.length > 0) {
                                                        updateCustomerDetail("Table Number"); setInputEnable(null);
                                                    } else {
                                                        Message("Please enter table number", "warning")
                                                    }
                                                    // End of Modification by Rohan kansari - 19/8/23
                                                    // Reason - to send error message for blank table number
                                                }} />

                                            </>
                                                :
                                                <>
                                                    {selectedOrderData?.order_detail?.table_number}
                                                    <Popconfirm
                                                        className={`${getOrderStatus() ? null : style.disbaleBtn} ${style.link}`}
                                                        title="Are you sure you want to change table number?"
                                                        onConfirm={e => { setInputEnable("tableEdit"); }}
                                                        // onCancel={e => { setTableConfirm(false) }}
                                                        cancelText="Cancel"
                                                        okText="Ok"
                                                        placement='bottomLeft'
                                                    >
                                                        <BsPencilSquare onClick={e => {
                                                            if (inputEnable != "tableEdit") {

                                                            }
                                                            else setInputEnable(null)
                                                        }
                                                        } style={{ margin: "5px 10px" }} />
                                                    </Popconfirm>
                                                </>
                                            }
                                        </div>
                                    </div>

                                    <div className={style.information} >
                                        <div className={style.WhiteLabel}>
                                            Email :
                                        </div>
                                        {/* Modified by Rohan kansari - 16/8/23
                                            Reason - To make email editable*/}
                                        <div className={style.data}>
                                            {/* {selectedOrderData?.order_detail?.customer_email?.split(",")[selectedOrderData.order_detail.customer_email.split(",").length - 1]} */}
                                            {inputEnable == "emailEdit" ? <>

                                                <input className={style.EditableInput} onKeyUp={e => {
                                                    if (e.key == "Enter" || e.keyCode == 13) {
                                                        let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
                                                        if (regex.test(email)) {
                                                            updateCustomerDetail("Email");
                                                            setInputEnable(null);
                                                        }
                                                        else {
                                                            Message("Please enter valid email", "error")
                                                        }
                                                    }
                                                }

                                                } onChange={e => {
                                                    // Added by Rohan kansari - 29/8/23 - To change capitaliztion accoridng to requirement
                                                    selectedOrderData.order_detail.customer_email = e.target.value
                                                    setSelectedorderData({ ...selectedOrderData })
                                                    setEmail(e.target.value.toLowerCase())
                                                    // End of addition by Rohan kansari - 29/8/23 - To change capitaliztion accoridng to requirement

                                                }}
                                                    value={selectedOrderData.order_detail.customer_email}
                                                    onBlur={e => {
                                                        selectedOrderData.order_detail.customer_email = JSON.parse(OldOrdervalue.current.value).order_detail.customer_email
                                                        setSelectedorderData({ ...selectedOrderData })
                                                        setInputEnable(null)
                                                    }}

                                                />
                                                <TiTick className={style.inputChecked} onClick={e => {
                                                    let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
                                                    if (regex.test(email)) {
                                                        updateCustomerDetail("Email");
                                                        setInputEnable(null);
                                                    } else {
                                                        Message("Please enter valid email", "error")
                                                    }
                                                }} />

                                            </>
                                                :
                                                <>
                                                    {selectedOrderData?.order_detail?.customer_email}
                                                    {/* <Popconfirm
                                                        className={`${getOrderStatus() ? null : style.disbaleBtn} ${style.link}`}
                                                        title="Are you sure you want to change table number?"
                                                        onConfirm={e => { setInputEnable("emailEdit"); }}
                                                        // onCancel={e => { setTableConfirm(false) }}
                                                        cancelText="Cancel"
                                                        okText="Ok"
                                                        placement='bottomLeft'
                                                    > */}
                                                    <BsPencilSquare
                                                        className={`${getOrderStatus() ? null : style.disbaleBtn}`}
                                                        onClick={e => {
                                                            if (inputEnable != "emailEdit") {
                                                                setInputEnable("emailEdit")
                                                            }
                                                            else setInputEnable(null)
                                                        }
                                                        } style={{ margin: "5px 10px" }} />
                                                    {/* </Popconfirm> */}
                                                </>
                                            }
                                        </div>
                                        {/* End of code by Rohan kansari - 16/8/23
                                            Reason - To make email editable*/}
                                    </div>
                                </div>
                                <div className={style.informationContainer}>
                                    <div className={style.information} >
                                        <div className={style.WhiteLabel}>
                                            Contact :
                                        </div>
                                        <div className={style.data}>
                                            {selectedOrderData?.order_detail?.customer_number}
                                        </div>
                                    </div>
                                    <div className={style.information} >
                                        <div className={style.WhiteLabel}>
                                            Name :
                                        </div>
                                        {/* Modified by Rohan kansari - 16/8/23
                                                    Reason - To make name editable*/}
                                        <div className={style.data}>
                                            {/* Modified by ROhan kansari - 16/8/23 - set ordered customer name  */}
                                            {/* {selectedOrderData?.order_detail?.last_customer_name} */}
                                            {inputEnable == "nameEdit" ? <>

                                                <input className={style.EditableInput} onKeyUp={e => {
                                                    if (e.key == "Enter" || e.keyCode == 13) {
                                                        if (!(name.length > 50)) {
                                                            updateCustomerDetail("Name"); setInputEnable(null);
                                                        }
                                                        else {
                                                            Message("Name should not be greater than 50 characters", "error")
                                                        }
                                                    }
                                                }

                                                } onChange={e => {
                                                    // Added by Rohan kansari - 29/8/23 - To change capitaliztion accoridng to requirement
                                                    selectedOrderData.order_detail.customer_name = capitalizeFLetter(e.target.value)
                                                    setSelectedorderData({ ...selectedOrderData })
                                                    setName(capitalizeFLetter(e.target.value))
                                                    // End of addition by Rohan kansari - 29/8/23 - To change capitaliztion accoridng to requirement

                                                }}
                                                    value={selectedOrderData?.order_detail?.customer_name}
                                                    onBlur={e => {
                                                        selectedOrderData.order_detail.customer_name = JSON.parse(OldOrdervalue.current.value).order_detail.customer_name
                                                        setSelectedorderData({ ...selectedOrderData })
                                                        setInputEnable(null)
                                                    }}

                                                />
                                                <TiTick className={style.inputChecked} onClick={e => {
                                                    if (!(name.length > 50)) {
                                                        updateCustomerDetail("Name"); setInputEnable(null);
                                                    } else {
                                                        Message("Name should not be greater than 50 characters", "error")
                                                    }
                                                }} />

                                            </>
                                                :
                                                <>
                                                    {selectedOrderData?.order_detail?.customer_name}
                                                    {/* <Popconfirm
                                                        className={`${getOrderStatus() ? null : style.disbaleBtn} ${style.link}`}
                                                        title="Are you sure you want to change table number?"
                                                        onConfirm={e => { setInputEnable("emailEdit"); }}
                                                        // onCancel={e => { setTableConfirm(false) }}
                                                        cancelText="Cancel"
                                                        okText="Ok"
                                                        placement='bottomLeft'
                                                    > */}
                                                    <BsPencilSquare
                                                        className={`${getOrderStatus() ? null : style.disbaleBtn}`}
                                                        onClick={e => {
                                                            if (inputEnable != "nameEdit") {
                                                                setInputEnable("nameEdit")
                                                            }
                                                            else setInputEnable(null)
                                                        }
                                                        } style={{ margin: "5px 10px" }} />
                                                    {/* </Popconfirm> */}
                                                </>
                                            }
                                        </div>
                                        {/* End of modification Rohan kansari - 16/8/23
                                            Reason - To make name editable*/}
                                    </div>
                                </div>

                                <div className={`${style.informationContainer}`}>
                                    <div className={style.information}>
                                        <div className={style.WhiteLabel}>
                                            Date & Time:
                                        </div>
                                        <div className={style.data}>
                                            {new Date(selectedOrderData?.order_detail?.date).toLocaleDateString('en-GB') + " " + new Date(selectedOrderData?.order_detail?.date).toTimeString().substring(0, 5)}
                                        </div>
                                    </div>
                                    <div className={style.information}>
                                        <div className={style.WhiteLabel}>
                                            Payment Mode :
                                        </div>
                                        <div className={style.data}>
                                            {selectedOrderData?.order_detail?.payment_mode}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        {/* End of fixed content  */}


                        {/* Added by Rohan kansari - 11/8/23 
                            Reason - enhancement part */}
                        <div style={{ display: "flex", flexWrap: "wrap", columnGap: "20px", marginBottom: "10px" }}>
                            <div>
                                <label className={style.InputLabel} style={{ padding: "0 10px" }}>Order Status </label>
                                <div className={style.OrderstatusBtnContainer}>
                                    <div className={style.StatusArrowBtnContainer}>
                                        <p><button className={` ${statusValidation("Placed", paymentStatus, selectedOrderData.order_detail, false) ? 'btn-right' : "btn-disable"} ${orderStatus == "Placed" ? 'activeStatusBtn' : null}`}
                                            onClick={e => {
                                                if (statusValidation("Placed", paymentStatus, selectedOrderData.order_detail, true))
                                                    UpdateOrderStatusDetail({
                                                        "order_status": "Placed"
                                                    })
                                            }
                                            }><a href="#">Placed</a></button></p>
                                        <p><button className={`${statusValidation("Confirm", paymentStatus, selectedOrderData.order_detail, false) ? 'btn-right' : "btn-disable"} ${orderStatus == "Confirm" ? 'activeStatusBtn' : null}`}
                                            onClick={e => {
                                                if (statusValidation("Confirm", paymentStatus, selectedOrderData.order_detail, true)) {
                                                    PrintKot(selectedOrderData.order_detail
                                                        , selectedOrderData.order_item.filter(e => e.item_status != "Cancelled" && e.kot_print_status == false)
                                                        , restroDetail, gstFssai, settings)
                                                    UpdateOrderStatusDetail({
                                                        "order_status": "Confirm"
                                                    })
                                                }
                                            }}><a href="#">Confirm</a></button></p>
                                        <p><button className={`${statusValidation("Cooked", paymentStatus, selectedOrderData.order_detail, false) ? 'btn-right' : "btn-disable"} ${orderStatus == "Cooked" ? 'activeStatusBtn' : null}`}
                                            onClick={e => {
                                                if (statusValidation("Cooked", paymentStatus, selectedOrderData.order_detail, true))
                                                    UpdateOrderStatusDetail({
                                                        "order_status": "Cooked"
                                                    })
                                            }}><a href="#">Cooked</a></button></p>
                                        <p><button className={`${statusValidation("Served", paymentStatus, selectedOrderData.order_detail, false) ? 'btn-right' : "btn-disable"} ${orderStatus == "Served" ? 'activeStatusBtn' : null}`}
                                            onClick={e => {
                                                if (statusValidation("Served", paymentStatus, selectedOrderData.order_detail, true))
                                                    UpdateOrderStatusDetail({
                                                        "order_status": "Served"
                                                    })
                                            }}><a href="#">Served</a></button></p>
                                    </div>

                                </div>
                            </div>

                            <div>
                                <label className={style.InputLabel} style={{ padding: "0 10px" }}>Payment Status </label>
                                <div className={style.OrderstatusBtnContainer} >
                                    <div className={style.StatusArrowBtnContainer}>
                                        <p><button className={`${paymentStatus == "Pending" ? 'activeStatusBtn' : null} ${statusValidation(orderStatus, "Pending", selectedOrderData.order_detail, false) ? 'btn-right' : "btn-disable"} `}
                                            onClick={e => {
                                                if (statusValidation(orderStatus, "Pending", selectedOrderData.order_detail, true))
                                                    UpdateOrderStatusDetail({
                                                        "payment_status": "Pending"
                                                    })
                                            }}
                                        ><a href="#"
                                        >Pending</a></button></p>
                                        {/* Added by ROhan kansari - 16/8/23 
                                            Reason - To add paid btn in payment status section */}
                                        {selectedOrderData.order_detail?.payment_status == "Paid" ? <p><button className='btn-right activeStatusBtn'
                                        ><a href="#"
                                        >Paid</a></button></p> : null}
                                        {/* End of code - ROhan kansari - 16/8/23 
                                            Reason - To add paid btn in payment status section */}
                                        <p><button className={`${statusValidation(orderStatus, "Completed", selectedOrderData.order_detail, false) ? 'btn-right' : "btn-disable"} ${selectedOrderData.order_detail?.order_status == "Cancelled" ? style.disbaleBtn : null} ${paymentStatus == "Completed" ? 'activeStatusBtn' : null}`}
                                            onClick={e => {
                                                if (statusValidation(orderStatus, "Completed", selectedOrderData.order_detail, true))
                                                    UpdateOrderStatusDetail({
                                                        "payment_status": "Completed"
                                                    })
                                            }}><a href="#">Completed</a></button></p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* ENd of code - ROhan kansari - 11/8/23 */}

                        <div className={style.scrollContainer}>


                            <div className={style.orderItemContainer}>
                                <div style={{ width: "100%", overflow: "auto" }}>
                                    <div className={style.orderItemHeader}>
                                        {/* <div className={style.priceHeading} style={{ marginLeft: "30px" }}>
                                            SNo.
                                        </div> */}
                                        <div className={style.ItemInformation}>
                                            <div className={style.item_heading}>
                                                Item Name
                                            </div>

                                            <div className={style.QtyNPriceHeadings}>
                                                <div className={style.quantityHeading}>
                                                    Quantity
                                                </div>
                                                <div className={style.priceHeading}>
                                                    Price
                                                </div>
                                            </div>
                                        </div>

                                        <div className={style.status_list}>
                                            <div className={style.status}>
                                                Pending
                                            </div>
                                            <div className={style.status}>
                                                Confirm
                                            </div>
                                            <div className={style.status}>
                                                Cancel
                                            </div>
                                        </div>

                                    </div>

                                    <div className={style.itemsContent}>

                                        <div className={style.itemList}>
                                            {selectedOrderData.order_item?.map((item, index) => (

                                                <div className={`${style.itemrow} 
                                                          ${updatedStatus.current.value[index]?.item_status == "Confirm" ?
                                                        style.confirmRow
                                                        :
                                                        updatedStatus.current.value[index]?.item_status == "Pending" ?
                                                            null
                                                            :
                                                            style.cancelledRow}`} >

                                                    <div className={`${style.ItemInformation} ${updatedStatus.current.value[index]?.item_status != "Pending" ?
                                                        style.pointer_event
                                                        :
                                                        null}`} >

                                                        <div className={style.checkboxNTitleFlex} >

                                                            <div class="checkbox-wrapper-24">
                                                                <input type="checkbox" id={`status0${index}`} name="check" checked={tickedItems.filter(i => i.id == item.id).length > 0} onChange={e => AddTickedOrderitem(e.target.checked, item, index)} />
                                                                <label for={`status0${index}`}>
                                                                    <span></span>
                                                                </label>
                                                            </div>
                                                            <div className={style.title}>
                                                                {/* <div className={style.index}>{index}. </div>  */}
                                                                {item.item} ({item.serving_size})</div>
                                                        </div>
                                                        <div className={style.quantityNPriceFlex}>
                                                            <div className={style.quantity}>
                                                                <div className={style.decrease} onClick={e => increaseAndDecrease("-", index, selectedOrderData.order_detail.order_id)}>
                                                                    <AiOutlineMinus />
                                                                </div>
                                                                <div className={style.quantityValue}>{item.quantity}</div>
                                                                <div className={style.increase} onClick={e => { increaseAndDecrease("+", index, selectedOrderData.order_detail.order_id); }}>
                                                                    <AiOutlinePlus />
                                                                </div>
                                                            </div>
                                                            <div className={style.price}>{item.price.toFixed(2)}</div>
                                                        </div>
                                                    </div>

                                                    <div className={`${style.checkboxContainer} ${updatedStatus.current.value[index]?.item_status != "Pending" ?
                                                        style.pointer_event
                                                        :
                                                        null}`}>
                                                        <div className={style.statusRow}>
                                                            <div className={style.checkboxContain}>
                                                                <input type="checkbox" className="_checkbox" id={`status1${index}`} checked={item.item_status == "Pending"} onClick={e => { selectedOrderData.order_item[index].item_status = "Pending"; setSelectedorderData({ ...selectedOrderData }); }} />
                                                                <label className='statuslabel' for={`status1${index}`}>
                                                                    <div id="tick_mark"></div>
                                                                </label>
                                                            </div>
                                                            <div className={style.checkboxContain}>
                                                                <input type="checkbox" className="_checkbox" id={`status2${index}`} checked={item.item_status == "Confirm"} onClick={e => { selectedOrderData.order_item[index].item_status = "Confirm"; setSelectedorderData({ ...selectedOrderData }) }} />
                                                                <label className='statuslabel' for={`status2${index}`}>
                                                                    <div id="tick_mark"></div>
                                                                </label>
                                                            </div>
                                                            <div className={style.checkboxContain}>
                                                                <input type="checkbox" className="_checkbox" id={`status3${index}`} checked={item.item_status == "Cancelled"} onClick={e => { selectedOrderData.order_item[index].item_status = "Cancelled"; setSelectedorderData({ ...selectedOrderData }) }} />
                                                                <label className='statuslabel cancelled' for={`status3${index}`}>
                                                                    <div id="cross"></div>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className={style.AllStatusContainer}>
                                    <Popconfirm
                                        className={`${getOrderStatus() ? null : style.disbaleBtn} ${style.link}`}
                                        style={{ maxWidth: "150px" }}
                                        title="Are you sure you want to update?"
                                        onConfirm={e => { orderItemModel(selectedOrderData.order_item) }}
                                        // onCancel={e=>{setTableConfirm(false)}}
                                        cancelText="Cancel"
                                        okText="Ok"
                                    >
                                        <button className={`${style.AllUpdateButton}`} >Update Items</button>
                                    </Popconfirm>
                                    <div className={style.StatusBtnContainer}>
                                        <button class="button" id="cut" style={tickedItems.length > 0 ? null : { background: "rgba(0,0,0,0.2)", pointerEvents: "none" }}><span>Pending</span></button>
                                        <button class="button" id="copy" style={tickedItems.length > 0 ? null : { background: "rgba(0,0,0,0.2)", pointerEvents: "none" }}
                                            onClick={e => orderItemModel(selectedOrderData.order_item.filter((t, i) => {
                                                if (updatedStatus.current.value[i].item_status == "Pending" && tickedItems.findIndex(d => d.id == t.id) != -1) {
                                                    t.item_status = "Confirm"
                                                    return t;
                                                }
                                                else {
                                                    t.item_status = updatedStatus.current.value[i].item_status
                                                    t.quantity = updatedStatus.current.value[i].quantity
                                                    t.price = updatedStatus.current.value[i].price
                                                    return t;
                                                }
                                            }))}><span>Confirm</span></button>
                                        <button class="button" id="paste" style={tickedItems.length > 0 ? null : { background: "rgba(0,0,0,0.2)", pointerEvents: "none" }}
                                            onClick={e => orderItemModel(selectedOrderData.order_item.filter((t, i) => {
                                                if (t.item_status == "Pending" && tickedItems.findIndex(d => d.id == t.id) != -1) {
                                                    t.item_status = "Cancelled"
                                                    return t;
                                                }
                                                else {
                                                    t.item_status = updatedStatus.current.value[i].item_status
                                                    t.quantity = updatedStatus.current.value[i].quantity
                                                    t.price = updatedStatus.current.value[i].price
                                                    return t;
                                                }
                                            }))}><span>Cancel</span></button>
                                    </div>
                                </div>
                            </div>


                            <div className={style.UpdateItemContainer}>
                                <button className={`${style.UpdateItemBTN} ${getOrderStatus() ? null : style.disbaleBtn}`} onClick={e => setAddMoreItemModalVisible(true)} disable={!getOrderStatus()}>Add More items <MdAddCircleOutline style={{ fontSize: "18px" }} /></button>
                                <div className={style.WhiteLabel} >Subtotal : ₹{selectedOrderData?.order_detail?.sub_total.toFixed(2)}</div>
                            </div>

                            <div className={style.TotalContainer} >
                                <div className={style.PricingContainer}>
                                    <div className={`${style.DiscountNCancelSection} 
                                        ${getOrderStatus()
                                            ? null : style.disbaleBtn}`}>
                                        <div className={style.inputContainerFlex}>
                                            <div className={style.inputBoxContainer}>
                                                <label className={style.InputLabel}>Discount </label>
                                                <div className={style.flexDoubleInput}>
                                                    <div className={style.discountColumn}>
                                                        <div className={style.discountRow}>
                                                            <div className={style.Column}>
                                                                <label className={style.subInputLabel}>( In ₹ ) </label>
                                                                {/* Added by Rohan kansari - 21/7/23
                                                                Reason - Discount rupees functionality added */}
                                                                <input id="discount_rupees"
                                                                    type="text"
                                                                    className={`${style.inputBox} ${settings.discount_in == "Discount in (₹)" ? null : style.disbaleBtn}`} value={discountRupee}
                                                                    onChange={e => {
                                                                        inputIvalidationDiscountRupees(e)
                                                                    }} />
                                                            </div>
                                                            <div className={style.Column}>
                                                                <label className={style.subInputLabel}>( In % ) </label>
                                                                <input id="discount_percentage"
                                                                    className={`${style.inputBox} ${settings.discount_in == "Discount in (%)" ? null : style.disbaleBtn}`}
                                                                    value={discountPercentage}
                                                                    onChange={e => {
                                                                        inputValidationDiscountPercentage(e)
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className={style.errorText}>{errorText.discount_price ? errorText.discount_price : null}</div>
                                                    </div>

                                                    {settings.allow_loyality_points ? <div className={style.loyalityColumn} >
                                                        <label className={style.subInputLabel}>Apply Loyalty Point </label>
                                                        <input className={style.inputBox} value={applyLoyalityPoint}
                                                            onChange={e => { validateLoyalityPoint(e) }}
                                                        />
                                                        <div className={style.errorText}>{errorText.loyality_point ? errorText.loyality_point : null}</div>
                                                    </div> : null}
                                                </div>
                                            </div>
                                            <div className={style.inputBoxContainer} >
                                                <div className={style.discountRow} style={{ justifyContent: "space-between" }}>
                                                    {settings.allow_loyality_points ? <div className={style.rewardbox}>
                                                        Earn Point &nbsp;
                                                        <div className={style.coinBox}>
                                                            <div className={style.cointPoints}>{999 + customerLoyalitypoint}</div>
                                                            <div class="spinningasset coin is-sm">
                                                                <div>
                                                                    <div></div>
                                                                    <i></i>
                                                                    <i></i>
                                                                    <i></i>
                                                                    <i></i>
                                                                    <i></i>
                                                                    <i></i>
                                                                    <i></i>
                                                                    <i></i>
                                                                    <i></i>
                                                                    <i></i>
                                                                    <i></i>
                                                                    <em></em>
                                                                    <em></em>
                                                                    <div></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> : null}

                                                    <div className={style.loyalityColumn} >
                                                        <label className={style.subInputLabel}>Cancelled By </label>
                                                        <input id="cancelled_by"
                                                            type="text"
                                                            className={`${style.inputBox} ${style.disbaleBtn}`}
                                                            value={cancelledBy}
                                                        />
                                                        {/* <select
                                                            id="cancelled_by"
                                                            className={style.inputBox}
                                                            name="cancelled_by"
                                                            onChange={(e) => {
                                                                setCancelledBy(e.target.value);
                                                            }}
                                                        >
                                                            <option value="Admin" selected={cancelledBy == "Admin" ? true : false}>Admin</option>
                                                            <option value="Customer" selected={cancelledBy == "Customer" ? true : false}>Customer</option>

                                                        </select> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={style.inputContainerFlex}>
                                            <div className={style.inputBoxContainer}>
                                                <label className={style.InputLabel} >Cancel Reason </label>
                                                <textarea className={style.TextInputBox} value={cancelReaon} id="cancelInput" onChange={e => {
                                                    e.target.style.borderBottom = "1px solid #9c9c9c";
                                                    errorText["cancelReason"] = "";
                                                    setErrorText(errorText)
                                                    setCancelReason(e.target.value);
                                                }} />
                                                <div className={style.errorText}>{errorText.cancelReason ? errorText.cancelReason : null}</div>

                                            </div>
                                            <div className={style.inputBoxContainer}>
                                                <label className={style.InputLabel}>Discount Reason </label>
                                                <textarea className={style.TextInputBox} value={discountReason} onChange={e => setDiscountReason(e.target.value)} />
                                            </div>
                                        </div>

                                        <div className={style.inputContainerFlex}>
                                            <div className={style.inputBoxContainer}>
                                                <label className={style.InputLabel} />
                                            </div>
                                            <div className={style.UpdateDIscountBtn}>
                                                <button className={`${style.ApplyBtn} ${getOrderStatus() ? null : style.disbaleBtn}`} onClick={e => {
                                                    UpdateorderDetail();
                                                }}>Apply</button>
                                            </div>
                                        </div>

                                    </div>

                                    <div className={style.pricingContent}>
                                        {settings.allow_loyality_points ? <div className={style.priceInformation}>
                                            <label className={style.InputLabel}>Loyalty Price :- </label>
                                            <label className={style.InputLabel}>₹{loyalityPointPrice.toFixed(2)}</label>
                                        </div> : null}
                                        <div className={style.priceInformation}>
                                            <label className={style.InputLabel}>Discount Price :- </label>
                                            <label className={style.InputLabel}>₹{discountprice.toFixed(2)}</label>
                                        </div>
                                        <div className={style.priceInformation} >
                                            <label className={style.InputLabel}></label>
                                            <label className={style.InputLabel} style={{ borderTop: "1px solid black" }}>Total :- ₹{total.toFixed(2)}</label>
                                        </div>
                                        {settings.cgst > 0 ? <div className={style.priceInformation}>
                                            <label className={style.InputLabel}>CGST ({settings.cgst}%):- </label>
                                            <label className={style.InputLabel}> ₹{cgst.toFixed(2)}</label>
                                        </div> : null}
                                        {settings.sgst > 0 ? <div className={style.priceInformation}>
                                            <label className={style.InputLabel}>SGST ({settings.sgst}%) :- </label>
                                            <label className={style.InputLabel}>₹{sgst.toFixed(2)}</label>
                                        </div> : null}
                                        {settings.sgst > 0 || settings.cgst > 0 ? <div className={style.priceInformation}>
                                            <label className={style.InputLabel}></label>
                                            <label className={style.InputLabel} style={{ borderTop: "1px solid black" }}>Grand Total :- ₹{finalAmount.toFixed(2)}</label>
                                        </div> : null}
                                    </div>
                                </div>

                                {/* Modified by ROhan kansari - 11/8/23 - I shifted this section at the top */}
                                {/* Order status button section */}




                                <div className={style.PricingContainer}>
                                    <div className={style.inputContainerFlex}>
                                        {/* Commented by ROhan kansari - 24/7/23
                                            Reason - position changed  */}
                                        {/* <div className={style.pricingContent}>
                                            <div className={style.priceInformation}>
                                                <label className={style.InputLabel}>Loyality Price :- </label>
                                                <label className={style.InputLabel}>{loyalityPointPrice.toFixed(2)}</label>
                                            </div>
                                            <div className={style.priceInformation}>
                                                <label className={style.InputLabel}>Discount Price :- </label>
                                                <label className={style.InputLabel}>{discountprice.toFixed(2)}</label>
                                            </div>
                                            <div className={style.priceInformation} >
                                                <label className={style.InputLabel}></label>
                                                <label className={style.InputLabel} style={{ borderTop: "1px solid black" }}>Total :- {total.toFixed(2)}</label>
                                            </div>
                                            <div className={style.priceInformation}>
                                                <label className={style.InputLabel}>Cgst :- </label>
                                                <label className={style.InputLabel}> {cgst.toFixed(2)}</label>
                                            </div>
                                            <div className={style.priceInformation}>
                                                <label className={style.InputLabel}>Sgst :- </label>
                                                <label className={style.InputLabel}>{sgst.toFixed(2)}</label>
                                            </div>
                                            <div className={style.priceInformation}>
                                                <label className={style.InputLabel}></label>
                                                <label className={style.InputLabel} style={{ borderTop: "1px solid black" }}>Grand Total :- {finalAmount.toFixed(2)}</label>
                                            </div>
                                        </div> */}
                                        {/* End of code - Rohan kansari - 24/7/23 -position changed  */}
                                        <div className={style.PrintNBack}>
                                            <button className={style.BackBtn} onClick={e => setPopupOpen(false)}>Close</button>
                                        </div>

                                    </div>
                                </div>

                            </div>

                        </div>     {/* Scroller div end*/}

                    </div> : null}


                    {/* Adding by Rohan kansari -  20/7/23
                        reason - To add -  add more item model here and open up on button click */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        footer={null}
                        open={AddMoreItemmodalVisible}
                        closable={false}
                        keyboard={false}
                    >

                        <AddOrderItemForm orderId={orderDetailsObj.order_id} id={orderDetailsObj.id} modalvisibilityFn={setAddMoreItemModalVisible} modalvisibility={AddMoreItemmodalVisible} onCancel={handlemoreItemCancel}
                            setOrderItems={setSelectedOrderItemList}
                            setOrderDetail={setorderDetailsObj} setOrderStatus={setOrderStatus} getOrderDetail={UpdatingOpenedOrder} />
                    </Modal>

                    {/* End of code - Rohan kansari - 20/7/23*/}
                </Modal >
                {/* End of code - ROhan kansari -  */}
                {/* end of addition by - suman sahu on 11/06/2023 */}

            </div >
        </>
    )
}

export default TodayOrder

