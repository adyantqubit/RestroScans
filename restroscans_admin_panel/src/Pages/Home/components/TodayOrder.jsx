import React, { useEffect, useRef, useState } from 'react'
import style from './todayOrder.module.css'
import { TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot, PopoverTrigger, IconButton, FocusLock, PopoverArrow, PopoverContent, PopoverCloseButton } from '@chakra-ui/react'
import { GrFormCheckmark } from 'react-icons/gr'
import { GiRiceCooker } from "react-icons/gi"
import { getDashboardData, updateAllOrderAPI, updateItemStatus, updateOrderAndPaymentStatus } from '../../../Api/services'
import { AiOutlineClose } from 'react-icons/ai'
import { MdKeyboardArrowDown, MdDownloading, MdArrowDropUp } from "react-icons/md"
import { RiErrorWarningLine } from "react-icons/ri"
import { Popover, Modal, Radio } from 'antd'
import { Message } from '../../../App'
import { useNavigate } from 'react-router-dom'
// import ReactPaginate from 'react-paginate';


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

const TodayOrder = () => {

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

    const [todaysPendingOrder, setPendingOrders] = useState(null)
    const [todaysCompletedOrder, setCompletedOrders] = useState(null)
    const [popupOpen, setPopupOpen] = useState(false)
    const [popupOrderItem, setPopupOrderItem] = useState(false)
    const [newlyPlaced, setNewlyPlacedOrders] = useState(null)
    var [orderItemList, setOrderItem] = useState(null)
    var updatedStatus = useRef({ value: [] })
    var [selectedOrder, setSelectedOrder] = useState([])

    // var selectedOrdersItemIndex=0;
    // Added by Suman sahu - 11/06/2023
    // Reason - To open selected items in the modal of table no. data in the dashboard
    // Modified by ROhan kansari - 26/6/23- to dont loose value on state change
    var selectedItemArr = useRef({ items: [] })
    const [openModalNumOrderItem, setOpenModalNumOrderItem] = useState({})
    // End of code - 11/06/2023 by - Suman sahu

    // Added by Suman sahu - 11/06/2023
    // Reason - To open selected orders in the modal of more button in the action of dashboard
    var selectedOrderCopy = {}
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

    // Billing data
    const [restroDetail, setRestroDetail] = useState(null)
    const [gstFssai, setGstFsaai] = useState(null)
    const nav = useNavigate()

    useEffect(() => {

        // Added by Om Shrivastava on 02-06-23
        // Reason : Fix the logout issue
        if (JSON.parse(localStorage.getItem("tenantInfo"))?.tenant_name)
            // End of addition by Om Shrivastava on 02-06-23
            BackendCall()



    }, [])

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
            setGstFsaai(response.setting)
            setRestroDetail(response.tenant)
            setOrderItem(response.order_item)
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


    function statusValidation(orderStatus, paymentStatus, m) {
        // Modified by ROhan Kansari - 26/5/23
        // Reason - To pass validion message if served is not done done payment want to completed by admin

        // Modified By ROhan Kansari - 26/5/23
        // Reason - To pass proper validation on each change and admin can able move backward after changing order status
        // if (orderStatus != "Served" && paymentStatus == "Completed") {
        //     Message("You can not change the status to completed until this order is severd.", "error")
        //     return false
        // }
        // else if (orderStatus == "Served" && paymentStatus == "Completed") {
        //     return true
        // }
        // else
        //     return true

        // Modified by Rohan kansari - 26/6/23
        // Reason - To add cancel feature in status check
        // Changes by Rohan kansari - 28/6/23
        // Reason - admin can able to change cancle status in any time
        if (m.order.order_status == "Placed" && (orderStatus == "Cooked" || orderStatus == "Served")) {
            Message("Please first change order status to confirm ", "error")
            return false;
        }
        else if (m.order.order_status == "Confirm" && (orderStatus == "Placed")) {
            Message("You cant change order status confirm to placed", "error")
            return false;
        }
        else if (m.order.order_status == "Confirm" && (orderStatus == "Served")) {
            Message(`You cant change order status confirm to ${orderStatus}`, "error")
            return false;
        }
        else if (m.order.order_status == "Cooked" && (orderStatus == "Confirm" || orderStatus == "Placed")) {
            Message(`You cant change order status cooked to ${orderStatus}`, "error")
            return false;
        }
        else if (m.order.order_status == "Served" && (orderStatus == "Confirm" || orderStatus == "Placed" || orderStatus == "Cooked")) {
            Message(`You cant change order status cooked to ${orderStatus}`, "error")
            return false;
        }
        else if (m.order.order_status == "Cancelled" && (orderStatus == "Pending" || orderStatus == "Confirm" || orderStatus == "Placed" || orderStatus == "Cooked" || orderStatus == "Served")) {
            Message(`You cant change order status cancel to ${orderStatus}`, "error")
            return false;
        }
        else if (m.order.payment_status == "Completed" && (paymentStatus == "Pending")) {
            Message(`You cant change payment status completed to ${paymentStatus}`, "error")
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

    function model(m, i) {
        var paymentStatus = m.payment_status
        var orderStatus = m.order_status

        // Modified by Rohan Kansari - 24/6/23
        // Reason - To
        var canWeUpdate = statusValidation(orderStatus, paymentStatus, m)
        if (canWeUpdate)
            // added by - suman sahu on 11/06/2023
            // reason - for call that function in the antd modal
            updateStatus();
        // end of addition 11/06/2023 by - suman sahu

        else {
            document.getElementById("order_status_selectBox").value = m.order.order_status
            return false
        }


        async function updateStatus() {
            const status = {
                order_status: orderStatus,
                payment_status: paymentStatus,
            }

            const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name

            // commented by - suman sahu on 11/06/2023
            // reason - fix issue when update order status and payment status in the modal

            // if ((m.order_status !== orderStatus || m.payment_status !== paymentStatus) && statusValidation(orderStatus, paymentStatus, m)) {
            await updateOrderAndPaymentStatus(tenant, status, m.order_id).then(r => {
                if (r.success) {
                    /**
                     * Added by yuvraj Sahu on 08-07-2023
                     * Reason - to change the message for status updation
                     */
                    if (selectedOrderStatus != "" && selectedPaymentStatus != ""){
                        Message("Successfully status updated ", "success")
                    } else {
                        if (selectedOrderStatus != ""){
                            Message("Successfully order status updated ", "success")
                        }
                        if (selectedPaymentStatus != ""){
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
                    setOrderItem(r.order_items)
                    setPopupOpen(!popupOpen)

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
            })
            // }
            // end of commentation - 11/06/2023 by - suman sahu

        }

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
    }

    // end of commentation code on 11/06/2023 by - suman sahu


    // added by - Suman sahu On 10/06/2023
    // reason - for close modal when click on cross icon or outside click on that modal

    const closeModalOrderItem = () => {
        setPopupOrderItem(false);
    };
    // end of addition by suman sahu on 10/06/2023

    function orderItemModel(filteredOrderItemList, i) {
        updatedStatus.current.value = []
        filteredOrderItemList?.filter(e => updatedStatus.current.value.push(e.item_status))
        // added by - suman sahu on 10/06/2023
        // reason - for call that function in the antd modal
        updateStatus();
        // end of addition by - suman sahu on 10/06/2023

        async function updateStatus() {

            const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name
            await updateItemStatus(tenant, filteredOrderItemList, filteredOrderItemList[0].order_id).then(r => {
                updatedStatus.current.value = []
                var newOrderItemList = []

                r.order_items.filter(e => {
                    updatedStatus.current.value.push(e.item_status);
                    /**
                     * Commented and modified by - Ashish Dewangan on 18-06-2023
                     * Reason - Fixed issue where when we change item status then some items were not appearing on modal
                     */
                    // newOrderItemList = [...orderItemList.filter(o => o.id != e.id), e]
                    // Modified by Rohan Kansari- 24/6/23
                    // Reason - To get updated value before it is setting old values 
                    // newOrderItemList = [...orderItemList.filter(o => o.id != e.id), ...orderItemList.filter(o => o.id==e.id )]
                    newOrderItemList = [...orderItemList.filter(o => o.id != e.id),
                    ...orderItemList.filter(o => { if (o.id == e.id) return o.item_status = e.item_status })]
                    //  ENd of code - ROhan Kansari - 24/6/23
                    /**
                     * End of code modifciation by - Ashish Dewangan on 18-06-2023
                     * Reason - Fixed issue where when we change item status then some items were not appearing on modal
                     */
                })

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


                // End of code - 25/6/23 - ROhan kansari 
                setOrderItem(newOrderItemList)
                // Modified by ROhan kansari - 26/6/23 - to delete persist data
                selectedItemArr.current.items = []

                // Modified by Rohan Kansari- 24/5/23
                // Reason - Select box is not updated 
                // var option = document.querySelectorAll("select option")
                var option = document.getElementsByClassName("item_selected");
                for (var i = 0; i < option.length; i++) {
                    // option[i].defaultSelected=option[i].selected
                    option[i].value = r.order_items[i].item_status
                }
            }
            )
            setPopupOrderItem(null)
        }

        // commented by - suman sahu On 10/06/2023
        // reason - change that popup to antd modal (when click on table no. data in the dashbord)

        // function resetingSelectbox() {
        //     // This is to reseting the all value of select box on closing without updating
        //     var option = document.querySelectorAll("select option");
        //     for (var i = 0; i < option.length; i++) {
        //         option[i].selected = option[i].defaultSelected;
        //         if (filteredOrderItemList[i])
        //             filteredOrderItemList[i].item_status = updatedStatus.current.value[i];
        //     }

        //     // Reseting end code
        // }

        // if (popupOrderItem)
        //     return <div className={style.popupItemContainer}>
        //         <div className={style.closeContainer}><button className={style.closeBtn} onClick={e => {
        //             setPopupOrderItem(false);
        //             resetingSelectbox()
        //         }}><AiOutlineClose /></button></div>
        //         Added by ROhan kansari - 29/5/23
        //             Reason - To add overflow div and set max height of parent 300px
        //         <div className={style.itemlist}>
        //             {filteredOrderItemList?.map((orderItem, i) => (
        //                 <div key={i} className={style.itemListContainer}>
        //                     <div className={style.title}>{i + 1 + ". "}{orderItem.item}</div>
        //                     <div className={style.itemStatusContainer} >
        //                         <label className={style.lable}>Item Status</label>
        //                         <div className={style.selctedContentBox}>
        //                             <select defaultValue={orderItem.item_status} onChange={e => { filteredOrderItemList[i].item_status = e.target.value }} id="payment_status_selected">
        //                                 <option className={style.options} value="Pending">Pending</option>
        //                                 <option className={style.options} value="Confirm">Confirm</option>
        //                             </select>
        //                         </div>
        //                     </div>
        //                 </div>

        //             ))}
        //         </div>
        //         End of addition - Rohan kansari - 29/5/23
        //         <div className={style.itemStatusContainer}>
        //             <div className={style.selectionContainer}>
        //                 <button className={style.btnUpdate} onClick={e => { updateStatus(); }}>Update</button>                                    {/* <div className={style.selctedContentBox}>Pending<div className={style.icon}>{">"}</div></div> */}
        //             </div>
        //             <div className={style.selectionContainer}>
        //                 <button className={style.btnUpdate} onClick={e => {  resetingSelectbox(); setPopupOrderItem(false); }}>Cancel</button>
        //             </div>
        //         </div>
        //     </div>

        // end of commentation on 10/06/2023 by suman sahu

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

    async function updateAll() {

        const data = {
            /**
             * Commeted and modified by Yuvraj Sahu on 28-06-2023
             * Reason - to replace dropdown with radio value
             */
            // order_status: document.getElementById("all_order_status_selected").value,
            // payment_status: document.getElementById("all_payment_status_selected").value,
            order_status: selectedOrderStatus != "" ? selectedOrderStatus : document.getElementById("all_order_status_selected").value,
            payment_status: selectedPaymentStatus != "" ? selectedPaymentStatus : document.getElementById("all_payment_status_selected").value,
            /**
             * End of modification by yuvraj sahu on 28-06-2023
             */
            orders: checkedItems
        }

        if (selectedOrderStatus == ""){
            delete data.order_status
        }
        if (selectedPaymentStatus == ""){
            delete data.payment_status
        }

        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;


        if (checkedItems.length > 0)
            await updateAllOrderAPI(tenant, data).then(r => {

                if (r.success) {
                    Message("Successfully status updated ", "success")
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
    var kotData = {}

    function printKot() {
        // Modified by Rohan KAnsari - 26/6/23
        // Reason - To dont print cancelled items
        var filterKotItems = orderItemList.filter((o) => { return o.order_id == openActionPopupModal.order_id && o.item_status != "Cancelled" })
        var state = { gstFssai: gstFssai, restro_detail: restroDetail, order: openActionPopupModal, orderItem: filterKotItems }
        // setKot(state)   
        kotData = state

        console.log(kotData)

        function ExtractDateTime(format) {
            var date = format.substring(0, 10)
            var time = format.substring(11, 19)
            return { date, time }
        }

        var a = window.open('', '', 'height=800, width=1200');

        a.document.write(`<html>
        <head>
        <style>
        
        .container{
            width: 100%;
            height: auto;
            position: relative;
        }


        .kotContainer {
            font-family:monospace;
            letter-spacing: 0.6px;
            width: 300px;   
            height:auto;
            margin:auto auto;
            border-radius: 5px;
            padding: 2px 0;
            overflow-x: hidden;
            padding-bottom: 50px;
            padding-top: 60px;
            border: 1px solid black
        }
        .billingContainer {
            font-family:monospace;
            letter-spacing: 0.6px;
            width: 320px;
            height: auto;
            margin: 0 auto;
            border-radius: 5px;
            padding: 2px 0;
            padding-bottom: 150px;
            border: 1px solid black;
        }
        .inLineContainer {
            min-width: 100%;
            min-height: 10px;
            margin: 4px 5px;
            display: flex;
            justify-content: space-between;
        }
        .Hotellabel{
            min-width: 100%;
            font-size: 17px;
            font-weight: 900;
            padding: 0 3%;
            text-align: center;
        }
        .centerLabel{
            min-width: 100%;
            font-size: 12px;
            font-weight: 700;
            text-align: center;
        }
        .column1{
            min-width:50%;
            display: flex;
        }
        
        .label {
            min-width: 45%;
            font-size: 12px;
            font-weight: 700;
            text-align: start;
            white-space: nowrap;
            display: flex;
            }

        .label1{
            min-width: 32%;
            font-size: 12px;
            font-weight: 700;
            text-align: start;
            white-space: nowrap;
            display: flex;
        }
        
        .text {
            min-width: 50%;
            word-break: break-all;
            font-size: 12px;
            font-weight: 600;
            text-align: left;
        }

        .tableHeader {
            height: 30px;
            width: 95%;
            margin: auto;
            border-top: 1px solid black;
            margin-top: 20px;
            border-bottom: 1px solid black;
            display: flex;
            gap: 8px;
        }
        .serialNo {
            font-size: 12px;
            width: 15%;
            padding: 2% 0%;
            font-weight: 700;
        }
        .titleHeading {
            font-size: 12px;
            width: 67%;
            padding: 2% 0%;
            padding-right: 8%;
            font-weight: 700;
            text-align: start;
        }
        
        .qtyHeading {
            font-size: 12px;
            width: 17%;
            padding: 2% 0% 0% 0%;
            font-weight: 700;
        }
        
        .tableContents {
            min-height: 30px;
            width: 95%;
            margin:0 auto;
            margin: 1px 0;
            display: flex;
            gap: 4px;
        }
        .quantityText {
            font-size: 10px;
            width: 10%;
            padding: 2% 0% 0% 5%;
            font-weight: 600;
        }
        .titleText {
            font-size: 10px;
            width: 70%;
            font-weight: 600;
            padding: 2% 0% 0% 8%;
            text-align:left
        }
        .rateText {
            font-size: 12px;
            width: 15%;
            font-weight: 600;
            text-align: end;
            white-space: nowrap;
            padding: 2% 0% 0% 5%;
            text-align:left
        }
        .totalText {
            font-size: 12px;
            width: 30%;
            padding: 2% 2%;
            font-weight: 700;
            text-align: center;
            white-space: nowrap;
        }
        #line{
            background-color: black;
            height: .5px;
            width: 95%;
            margin: 0 auto;
            border: .5px solid #9c9c9c;
        }

        .btnContainer{
            width: 280px;
            min-height: 40px;
            position: fixed;
            top: 8px;
            left: 0;
            right: 0;
            margin: 0 auto;
            background-color:#fff ;
            display: flex;
            justify-content: space-around;
        }

        .btn{
            width: 45%;
            height: 100%;
            background-color: #185ee0;
            border-radius: 5px;
            color: #e6eef9;
            margin: auto 0;
        }

        .btn:hover{
            background-color: #e6eef9;
            color: #185ee0;
            border: 1px solid #185ee0;
        }
        @media print{
            .btn{
                display: none;
            }

            .kotContainer{
            padding-top: 0;
            }

            .btnContainer{
            display: none;
            }
            @page{margin:0;}
        }
        </style>
        </head>
        <body>
        <div class="container" style={{ paddingBottom: "50px", background: "grey" }} >
            <div class="kotContainer" style={{ background: "white", border: "2px solid black" }}>
                <div class="inLineContainer" >
                    <div class="Hotellabel" style={{ textAlign: "center" }}>${kotData.restro_detail.name.toUpperCase()}</div>
                </div>
                <hr />
                <div class="inLineContainer">
                    <div class="column1"><div class="label1"><div style={{ width: "90%" }}>Date</div><div>:</div>  </div><div class="text">${new Date(
            kotData.order.date
        ).toLocaleDateString("en-GB")}</div></div>
                    <div class="column1"><div class="label"><div style={{ width: "90%" }}>Time</div><div>:</div> </div><div class="text"> ${ExtractDateTime(kotData.order.date).time}</div></div>
                </div>
                <div class="inLineContainer">
                    <div class="column1"><div class="label1"><div style={{ width: "90%" }}>Order id</div><div>:</div>  </div><div class="text"> ${kotData.order.order_id}</div></div>
                    <div class="column1"><div class="label"><div style={{ width: "90%" }}>Table</div><div>:</div>  </div><div class="text">${!kotData.order.table_number ? "N/A" : kotData.order.table_number
            }</div></div>

                </div>
                <div class="tableHeader">
                    <div class="serialNo"> SNo   </div>
                    <div class="titleHeading">Item Name</div>
                    <div class="qtyHeading">   Qty   </div>
                </div>`+
            kotData.orderItem.map((item, i) =>
                `<div class="tableContents">
                        <div class="quantityText">${i + 1}</div>
                        <div class="titleText">${item.item} (${item.serving_size
                })</div>
                        <div class="rateText">${item.quantity}</div>
                    </div>`
            ).join("")
            + `</div>
               
        </div>
        </body>
        </html>`)
        a.document.close();

        if (filterKotItems.length > 0)
            a.print();
        a.close();
    }
    /**
     * End of addition by Yuvraj Sahu on 22-06-2023
     */
    // -------------------------------------- End print kot by Yuvraj Sahu -----------------------------------


    // Added by ROhan kansari - 26/6/23
    // Reason - to restore old selected value in state
    function oldStatusReverting() {
        console.log(selectedItemArr)
        var tempOrderItemList = orderItemList;
        selectedItemArr.current.items.filter(e => {
            var index = orderItemList.findIndex(o => o.id == e.id)
            tempOrderItemList[index].item_status = e.status
        })
        setOrderItem([...tempOrderItemList])

        selectedItemArr.current.items = []

        //    selectedItemArr)
    }
    // End of code - Rohan kansari - 26/6/23

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
                                        onChange={e => setCheckedItems(data, e.target.checked)} type="checkbox" />
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

                                <div className={style.columnData2} onClick={e => { setOpenModalNumOrderItem(data); setPopupOrderItem(true) }} >{data.table_number}</div>
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

                                    <div className={style.columnData7} onClick={e => { setOpenActionPopupModal(data); setPopupOpen(true) }}><button className={style.printBtn}>More</button></div>
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
                    <div className={style.lable} style={{ fontWeight: "500", marginLeft: "20px" }}>Order status</div>
                    <div className={style.selctedContentBox}>
                    {/* Added and commeted by Yuvraj Sahu on 28-06-2023
                    Reason - to replace dropdown with radio */}
                    <Radio.Group onChange={handleOrderStatus} value={selectedOrderStatus} id="all_order_status_selected">
                        <Radio value="Placed">Placed</Radio>
                        <Radio value="Confirm">Confirm</Radio>
                        <Radio value="Cooked">Cooked</Radio>
                        <Radio value="Served">Served</Radio>
                        <Radio value="Cancelled">Cancelled</Radio>
                    </Radio.Group>
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
                    <div className={style.lable} style={{ fontWeight: "500", marginLeft: "20px" }}>Payment status</div>
                    <div className={style.selctedContentBox}>
                    {/* Added and commeted by Yuvraj Sahu on 28-06-2023
                    Reason - to replace dropdown with radio */}
                    <Radio.Group onChange={handlePaymentStatus} value={selectedPaymentStatus} id="all_payment_status_selected">
                        <Radio value="Pending">Pending</Radio>
                        <Radio value="Completed">Completed</Radio>
                    </Radio.Group>
                        {/* <select id="all_payment_status_selected" onChange={e => document.getElementById("all_payment_status_selected").value = e.target.value}>
                            <option value="Pending" className={style.options}>Pending</option>
                            <option value="Completed" className={style.options}>Completed</option>
                        </select> */}
                    {/* End of modification by yuvraj Sahu on 28-06-2023 */}
                    </div>
                </div>
                <div className={style.updateBtn} onClick={e => updateAll()}>Update All</div>

                {/* added by - suman sahu on 10/06/2023
                    reason - change the popup when click the data of table no. in the dashbord */}

                {/*Modified by ROhan kansari - 26/6/23
                     Reason - To save and resatore select box value  */}
                <Modal open={popupOrderItem} onCancel={e => {
                    oldStatusReverting();
                    closeModalOrderItem();
                }} footer={null} className={style.modalContainer}>

                    <div className={style.popupItemContainer}>
                        <div className={style.itemlist}>
                            {/* Addd by Rohan kansari - 30/6/23 
                                Reason - To display always sorted value */}
                            {/* {orderItemList?.map((orderItem, i) => { */}
                            {orderItemList?.sort((a,b)=>a.id<b.id).map((orderItem, i) => {
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
                                        <div className={style.itemStatusContainer} >
                                            <label className={style.lable}>Item Status</label>
                                            <div className={style.selctedContentBox}>
                                                <select
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
                                                    {/* Modified by Rohan Kansari - 24/6/23
                                                         Reason - facing issue on showing default value so changing flow where
                                                          i am giving condition in in each option */}
                                                    {/* <option className={style.options} value="Pending" >Pending</option>
                                                     <option className={style.options} value="Confirm" >Confirm</option> */}
                                                    <option className={style.options} value="Pending" selected={orderItem.item_status == "Pending"}>Pending</option>
                                                    <option className={style.options} value="Confirm" selected={orderItem.item_status == "Confirm"}>Confirm</option>
                                                    <option className={style.options} value="Cancelled" selected={orderItem.item_status == "Cancelled"}>Cancelled</option>
                                                    {/* End of code by Rohan Kansari - 24/5/23 - To add cancel option in item status */}
                                                </select>
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
                </Modal>
                {/* End of code - ROhan kansari - 26/6/23 */}
                {/* end of addition by - suman sahu on 10/06/2023 */}

                {/* added by - suman sahu on 11/06/2023
                    reason - change the popup when click the data of action in the dashbord */}

                <Modal open={popupOpen} onCancel={closePopupOpen} footer={null} className={style.modalContainer} >
                    <div className={style.popupContainer}
                        onLoad={e => {
                            console.log(document.getElementById("order_status_selected").selected)
                            console.log(document.getElementById("payment_status_selected").selected)
                        }}>


                        {selectedOrder?.map((orderItem, i) => {

                            if (orderItem.order_id == openActionPopupModal.order_id) {
                                selectedOrderCopy["order_id"] = openActionPopupModal.order_id
                                // Added by Rohan kansari - 24/6/23
                                // Reason - To save ordr object also to send for validation
                                selectedOrderCopy["order"] = orderItem
                                // End of code - Rohan Kansari - 24/6/23

                                // added by - Suman sahu on - 14/06/2023
                                // reason - to save order status & payment status and render that value on select box after updating
                                selectedOrderCopy["order_status"] = openActionPopupModal.order_status
                                selectedOrderCopy["payment_status"] = openActionPopupModal.payment_status
                                {/* end of addition by - Suman sahu on 14/06/2023 */ }

                                // Added by Rohan kansari - 24/6/23
                                // Reason - Select box issue solved, Passing update value in select box
                                if (document.getElementById("order_status_selectBox")) {
                                    document.getElementById("order_status_selectBox").value = orderItem.order_status
                                    document.getElementById("payment_status_selectBox").value = orderItem.payment_status
                                }
                                // End of code - Rohan Kansari - 24/6/23


                                return <>
                                    {/* modified by - Suman sahu on 17/06/2023 */}
                                    <div className={style.customername}><label className={style.lable}>Contact Number : &nbsp;</label>{orderItem.customer_number}</div>
                                    <div className={style.OrderTime}><label className={style.lable}>Table No : &nbsp;</label>{orderItem.table_number}</div>
                                    <div className={style.OrderTime}><label className={style.lable}>Date & Time : &nbsp;</label>{orderItem.date.substring(0, 10).split('-').reverse().join("/") + ' ' + orderItem.date.substring(11, 16)}</div>
                                    <div className={style.OrderTime}><label className={style.lable}>Payment Mode : &nbsp;</label>{orderItem.payment_mode}</div>
                                    {/* commented and modified by - Suman sahu on 17/06/2023 
                                        reason - take 2 decimal values in subtotal */}
                                    {/* <div className={style.OrderTime}><label className={style.lable}>Subtotal :</label>{orderItem.sub_total}</div> */}
                                    <div className={style.OrderTime}><label className={style.lable}>Subtotal : &nbsp;</label>{(orderItem.sub_total).toFixed(2)}</div>
                                    {/* end of modification by - Suman sahu on 17/06/2023 */}

                                    {/* commented and modified by - Suman sahu on 16/06/2023 
                                        reason - take 2 decimal values in CGST and SGST */}
                                    {/* <div className={style.OrderTime}><label className={style.lable}>CGST : </label>{orderItem.cgst}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label className={style.lable}>SGST : </label>{orderItem.sgst}</div> */}
                                    <div className={style.OrderTime}><label className={style.lable}>CGST : &nbsp;</label>{(orderItem.cgst).toFixed(2)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label className={style.lable}>SGST : &nbsp;</label>{(orderItem.sgst).toFixed(2)}</div>
                                    {/* end of modification by - Suman sahu on 16/06/2023 */}

                                    {/* commented and modified by - Suman sahu on 17/06/2023 
                                        reason - take 2 decimal values in total */}
                                    {/* <div className={style.OrderTime}><label className={style.Highlightlable}>Total : {orderItem.total} </label></div> */}
                                    <div className={style.OrderTime}><label className={style.Highlightlable}>Total : &nbsp; {(orderItem.total).toFixed(2)} </label></div>
                                    {/* end of modification by - Suman sahu on 17/06/2023 */}

                                    {/* end of modification by - suman sahu on - 17/06/2023 */}

                                    <div className={style.btnContainer}>
                                        <div className={style.selectionContainer}>
                                            <label className={style.lable}>Order Status</label>
                                            <div className={style.selctedContentBox}>
                                                <select
                                                    id="order_status_selectBox"
                                                    defaultValue={orderItem.order_status}
                                                    onChange={e => { selectedOrderCopy["order_status"] = e.target.value }}
                                                >
                                                    <option value="Placed" className={style.options}>Placed</option>
                                                    <option value="Confirm" className={style.options}>Confirm</option>
                                                    <option value="Cooked" className={style.options}>Cooked</option>
                                                    <option value="Served" className={style.options}>Served</option>
                                                    <option value="Cancelled" className={style.options}>Cancel</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className={style.selectionContainer}>
                                            <label className={style.lable}>Payment Status</label>
                                            <div className={style.selctedContentBox}>
                                                <select
                                                    id="payment_status_selectBox"
                                                    defaultValue={orderItem.payment_status}
                                                    onChange={e => { selectedOrderCopy["payment_status"] = e.target.value }}
                                                >
                                                    <option className={style.options} value="Pending">Pending</option>
                                                    <option className={style.options} value="Completed">Completed</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                        })}
                        <div className={style.btnContainer}>
                            <div className={style.selectionContainer}>
                                <button className={style.btnUpdate}
                                    onClick={e => { model(selectedOrderCopy); }}
                                >Update</button>
                            </div>
                            <div className={style.selectionContainer}>
                                <button className={style.btnUpdate}
                                    onClick={e => { setPopupOpen(!popupOpen); selectboxReset() }}
                                >Cancel</button>
                            </div>
                        </div>

                        <div className={style.btnContainer}>
                            <div className={style.selectionContainer} style={{ textAlign: "center" }}>
                                <div className={style.visitLink}>See Order</div>
                            </div>
                            <div className={style.selectionContainer}>
                                <span className={style.visitLink}>See Order Item</span>
                            </div>
                        </div>

                        {/* added by - Suman sahu on - 11/06/2023 */}
                        <div className={style.btnContainer} style={{ paddingBottom: "10px" }}>
                            <div className={style.selectionContainer}>
                                <button className={style.kotPrint}
                                    // Modified by ROhan kansari - 28/6/23
                                    // Reason - to disable button 
                                    style={openActionPopupModal.order_status == "Cancelled" || openActionPopupModal.order_status == "Served" ? { background: "rgba(128,128,128,0.3)", pointerEvents: "none", textDecoration: "line-through" } : {}}
                                    // Commeted and added by yuvraj Sahu on 22-06-2023
                                    // Reason - to print kot from completed section
                                    // onClick={e => nav("/kot", { state: { "gstFssai": gstFssai, "restro_detail": restroDetail, "order":openActionPopupModal, "orderItem": orderItemList.filter((o) => { return o.order_id == openActionPopupModal.order_id }) } })}
                                    onClick={printKot}
                                // End of modification by Yuvraj Sahu on 22-06-2023
                                >Print KOT</button>
                            </div>
                            <div className={style.selectionContainer}>
                                <button className={style.billPrint}
                                    // Modified by ROhan kansari - 28/6/23
                                    // Reason - to disable button 
                                    style={openActionPopupModal.payment_status != "Completed" || openActionPopupModal.order_status == "Cancelled" ? { background: "rgba(128,128,128,0.3)", pointerEvents: "none", textDecoration: "line-through" } : {}}
                                    onClick={e => nav("/Billing", { state: { "gstFssai": gstFssai, "restro_detail": restroDetail, "order": openActionPopupModal, "orderItem": orderItemList.filter((o) => { return o.order_id == openActionPopupModal.order_id }) } })}
                                >Print</button>
                            </div>
                        </div>
                        {/* end of addition by - Suman sahu on - 11/06/2023 */}

                    </div>
                </Modal>
                {/* end of addition by - suman sahu on 11/06/2023 */}

            </div>

            {/* <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
            /> */}

            {/*End of code - ROhan Kansari - 26/5/23*/}
        </>
    )
}

export default TodayOrder


