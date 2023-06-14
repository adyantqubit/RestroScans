import React, { useEffect, useRef, useState } from 'react'
import style from './todayOrder.module.css'
import { TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot, PopoverTrigger, IconButton, FocusLock, PopoverArrow, PopoverContent, PopoverCloseButton } from '@chakra-ui/react'
import { GrFormCheckmark } from 'react-icons/gr'
import { GiRiceCooker } from "react-icons/gi"
import { getDashboardData, updateAllOrderAPI, updateItemStatus, updateOrderAndPaymentStatus } from '../../../Api/services'
import { AiOutlineClose } from 'react-icons/ai'
import { MdKeyboardArrowDown, MdDownloading } from "react-icons/md"
import { RiErrorWarningLine } from "react-icons/ri"
import { Popover, Modal } from 'antd'
import { Message } from '../../../App'
import { useNavigate } from 'react-router-dom'
// import ReactPaginate from 'react-paginate';


function getStatusBtn(status) {
    if (status == "Placed")
        return <button className={style.statusBtn} style={{ background: "rgba(255, 206, 115, 0.6)" }}>
            <span>{status}</span> <RiErrorWarningLine style={{ margin: "4px 2px" }} />
        </button>
    if (status == "Confirm")
        return <button className={style.statusBtn} style={{ background: "rgba(225, 252, 126, 0.6)" }}>
            <span>{status}</span> <MdDownloading style={{ margin: "2px 0" }} />
        </button>
    if (status == "Cooked")
        return <button className={style.statusBtn} style={{ background: "rgba(115, 222, 255, 0.6)" }}>
            <span>{status}</span> <GiRiceCooker style={{ margin: "2px 0" }} />
        </button>
    if (status == "Served")
        return <button className={style.statusBtn} style={{ background: "rgba(144, 238, 144,0.6)" }}>
            <span>{status}</span> <GrFormCheckmark style={{ margin: "2px 0" }} />
        </button>
    if (status == "Pending")
        return <button className={style.statusBtn} style={{ background: "rgba(255, 206, 115, 0.6)" }}>
            <span>{status}</span> <RiErrorWarningLine style={{ margin: "4px 2px" }} />
        </button>
    // Added by Rohan Kansari- 30/5/23
    // Reason to add paid status button also
    if (status == "Paid")
        return <button className={style.statusBtn} style={{ background: "rgba(115, 222, 255, 0.6)" }}>
            <span>{status}</span> <RiErrorWarningLine style={{ margin: "4px 2px" }} />
        </button>
    // End of code - Rohan Kansari - 30/5/23

    if (status == "Completed")
        return <button className={style.statusBtn} style={{ background: "rgba(144, 238, 144,0.6)" }}>
            <span>{status}</span> <GrFormCheckmark style={{ margin: "2px 0" }} />
        </button>

}

const TodayOrder = () => {

    const [todaysPendingOrder, setPendingOrders] = useState(null)
    const [todaysCompletedOrder, setCompletedOrders] = useState(null)
    const [popupOpen, setPopupOpen] = useState(false)
    const [popupOrderItem, setPopupOrderItem] = useState(false)
    const [newlyPlaced, setNewlyPlacedOrders] = useState(null)
    var [orderItemList, setOrderItem] = useState(null)
    var updatedStatus = useRef({ value: [] })
    var [selectedOrder, setSelectedOrder] = useState([])

    var selectedOrdersItemIndex=0;
    // Added by Suman sahu - 11/6/23
    // Reason - To open selected items in the modal of table no. data in the dashboard
    var selectedItemArr=[]
    const [openModalNumOrderItem,setOpenModalNumOrderItem]=useState({})
    // End of code - 11/6/23 by - suman sahu

    // Added by Suman sahu - 11/6/23
    // Reason - To open selected orders in the modal of more button in the action of dashboard
    var selectedOrderCopy={}
    const [openPopupModalOpen,setOpenPopupModalOpen]=useState({})
    // End of code - 11/6/23 by - suman sahu

    // Added by ROhan Kansari - 25/5/23
    // Reason - To save checked item and update
    var [checkedItems, setCheckedItem] = useState([])
    // End of code - 25/5/23

    {/* Modified by Rohan Kansari - 29/5/23 
        Reason - To add loading functionality*/}
    var [isLoading,setLoading]=useState(true)
    // End of code - ROhan Kansari - 29/5/23

    // Billing data
    const [restroDetail, setRestroDetail] = useState(null)
    const [gstFssai, setGstFsaai] = useState(null)
    const nav = useNavigate()

    useEffect(() => {
        // Added by Om Shrivastava on 02-06-23
        // Reason : Fix the logout issue
        if(JSON.parse(localStorage.getItem("tenantInfo"))?.tenant_name)
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
            setSelectedOrder(response.todays_newly_placed_orders)
        }
    }


    function statusValidation(orderStatus, paymentStatus, m) {
        // Modified by ROhan Kansari - 26/5/23
        // Reason - To pass validion message if served is not done done payment want to completed by admin
        if (orderStatus != "Served" && paymentStatus == "Completed") {
            Message("You can not change the status to completed until this order is severd.", "error")
            return false
        }
        else if (orderStatus == "Served" && paymentStatus == "Completed") {
            return true
        }
        else
            return true

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
        // added by - suman sahu on 11/06/2023
        // reason - for call that function in the antd modal
        updateStatus();
        // end of addition 11/06/2023 by - suman sahu


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
                        Message("Successfully status updated ", "success")
                        setNewlyPlacedOrders(r.todays_newly_placed_orders);
                        setPendingOrders(r.todays_pending_orders);
                        setCompletedOrders(r.todays_completed_orders);
                        setOrderItem(r.order_items)
                        setPopupOpen(!popupOpen)

                        var radioInputs = document.querySelectorAll("input")
                        if (radioInputs[0].checked) {
                            setSelectedOrder(r.todays_newly_placed_orders)
                        }
                        else if (radioInputs[1].checked) {
                            setSelectedOrder(r.todays_pending_orders)
                        }
                        else if (radioInputs[2].checked) {
                            setSelectedOrder(r.todays_completed_orders)
                        }

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
                r.filter(e => {
                    updatedStatus.current.value.push(e.item_status);
                    newOrderItemList = [...orderItemList.filter(o => o.id != e.id), e]
                })

                setOrderItem(newOrderItemList)
                var option = document.querySelectorAll("select option");
                for (var i = 0; i < option.length; i++) {
                    option[i].defaultSelected = option[i].selected;
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
            order_status: document.getElementById("all_order_status_selected").value,
            payment_status: document.getElementById("all_payment_status_selected").value,
            orders: checkedItems
        }

        console.log(data)
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
                    var radioInputs = document.querySelectorAll("input")
                    if (radioInputs[0].checked) {
                        setSelectedOrder(r.todays_newly_placed_orders)
                    }
                    else if (radioInputs[1].checked) {
                        setSelectedOrder(r.todays_pending_orders)
                    }
                    else if (radioInputs[2].checked) {
                        setSelectedOrder(r.todays_completed_orders)
                    }
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
            document.getElementById("allupdate").style.background = "rgb(232,232,232)"
            // document.getElementById("allupdate").style.opacity = ".6"
            // End of addition by Om Shrivastava on 03-06-23
            document.getElementById("allupdate").style.pointerEvents = "none"
        } else {
            document.getElementById("allupdate").style.background = "unset"
            document.getElementById("allupdate").style.opacity = "unset"
            document.getElementById("allupdate").style.pointerEvents = "unset"

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


    return (
        <>
            {/* Added and modified by - ROhan Kansari - 25/5/23
            Reason - added checkbox and change name of mapped data  */}
            {/*modified by - ROhan Kansari - 26/5/23
            Reason - Managing checkbox ui  */}
            <div className={style.radioGroup}>
                <input className={style.radioButton} type='radio' id="radio1" name="group" defaultChecked={true} />
                <label className={style.tabLabel} htmlFor='radio1' onClick={e => { setSelectedOrder(newlyPlaced); uncheckAll({ fade: false }) }}>Newly Placed</label>
                <input className={style.radioButton} id='radio2' type='radio' name="group" />
                <label className={style.tabLabel} htmlFor='radio2' onClick={e => { setSelectedOrder(todaysPendingOrder); uncheckAll({ fade: false }) }}>Pending</label>
                <input className={style.radioButton} id='radio3' type='radio' name="group" />
                <label className={style.tabLabel} htmlFor='radio3' onClick={e => { setSelectedOrder(todaysCompletedOrder); uncheckAll({ fade: true }) }}>Completed</label>
            </div>

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

                                <div className={style.columnData2} onClick={e =>{ setOpenModalNumOrderItem(data);setPopupOrderItem(true)}} >{data.table_number}</div>
                                {/* end of modification on 10/06/2023 */}

                                <div className={style.columnData8}>{data.order_id}</div>
                                <div className={style.columnData3}>{getStatusBtn(data.order_status)}</div>
                                <div className={style.columnData4}>{data.date.substring(11, 16)}</div>
                                <div className={style.columnData5}>{data.total}</div>
                                <div className={style.columnData6}>{getStatusBtn(data.payment_status)}</div>
                                <div className={style.columnData7}>
                                {/* // Commented and modification by - Suman sahu On 12/06/2023
                                    // reason - change that popup to antd modal */}
                                    <Popover placement="left" 
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
                                    </Popover>

                                    <div className={style.columnData7} onClick={e =>{ setOpenPopupModalOpen(data); setPopupOpen(true)}}><button className={style.printBtn}>More</button></div>
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
                        <select id="all_order_status_selected" onChange={e => document.getElementById("all_order_status_selected").value = e.target.value}>
                            <option value="Placed" className={style.options}>Placed</option>
                            <option value="Confirm" className={style.options}>Confirm</option>
                            <option value="Cooked" className={style.options}>Cooked</option>
                            <option value="Served" className={style.options}>Served</option>
                        </select>
                    </div>
                </div>
                <div className={style.updateflexContainer}>
                    <div className={style.lable} style={{ fontWeight: "500", marginLeft: "20px" }}>Payment status</div>
                    <div className={style.selctedContentBox}>
                        <select id="all_payment_status_selected" onChange={e => document.getElementById("all_payment_status_selected").value = e.target.value}>
                            <option value="Pending" className={style.options}>Pending</option>
                            <option value="Completed" className={style.options}>Completed</option>
                        </select>
                    </div>
                </div>
                <div className={style.updateBtn} onClick={e => updateAll()}>Update All</div>

                {/* added by - suman sahu on 10/06/2023
                    reason - change the popup when click the data of table no. in the dashbord */}

                <Modal open={popupOrderItem} onCancel={closeModalOrderItem}  footer={null} className={style.modalContainer}>
                    <div className={style.popupItemContainer}>
                        <div className={style.itemlist}>
                            {orderItemList?.map((orderItem, i) => {
                                
                                if(orderItem.order_id==openModalNumOrderItem.order_id){
                                    
                                    {selectedItemArr.push(orderItem) }
                                    return <div key={i} className={style.itemListContainer}>
                                        <div className={style.title}>
                                        {orderItem.item}
                                        </div>
                                        <div className={style.itemStatusContainer} >
                                            <label className={style.lable}>serving_size</label>
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
                                                defaultValue={orderItem.item_status}
                                                onChange={e => { selectedItemArr.forEach((item)=>{
                                                    if(item.id==orderItem.id){
                                                        item.item_status=e.target.value
                                                    }
                                                }) }} 
                                                id="payment_status_selected">
                                                    <option className={style.options} value="Pending">Pending</option>
                                                    <option className={style.options} value="Confirm">Confirm</option>
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
                            onClick={e => { orderItemModel(selectedItemArr); }}
                            >Update</button>                                    
                        </div>
                        <div className={style.selectionContainer}>
                            <button className={style.btnUpdate} 
                            onClick={e => { setPopupOrderItem(false);}}
                            >Cancel</button>
                        </div>
                    </div>
                </Modal>
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

                            if(orderItem.order_id==openPopupModalOpen.order_id){
                                selectedOrderCopy["order_id"]=openPopupModalOpen.order_id
                                selectedOrderCopy["order_status"]=openPopupModalOpen.order_status
                                selectedOrderCopy["payment_status"]=openPopupModalOpen.payment_status
                                return <>
                                    <div className={style.customername}><label className={style.lable}>Contact Number : {orderItem.customer_number}</label></div>
                                    <div className={style.OrderTime}><label className={style.lable}>Table No : {orderItem.table_number}</label></div>
                                    <div className={style.OrderTime}><label className={style.lable}>Date & Time : </label>{orderItem.date.substring(0, 10).split('-').reverse().join("/") + ' ' + orderItem.date.substring(11, 16)}</div>
                                    <div className={style.OrderTime}><label className={style.lable}>Payment Mode :</label>{orderItem.payment_mode}</div>
                                    <div className={style.OrderTime}><label className={style.lable}>Subtotal :</label>{orderItem.sub_total}</div>
                                    <div className={style.OrderTime}><label className={style.lable}>CGST : </label>{orderItem.cgst}<label className={style.lable}>SGST : </label>{orderItem.sgst}</div>
                                    <div className={style.OrderTime}><label className={style.Highlightlable}>Total : {orderItem.total} </label></div>
                                
                        
                                <div className={style.btnContainer}>
                                    <div className={style.selectionContainer}>
                                        <label className={style.lable}>Order Status</label>
                                        <div className={style.selctedContentBox}>
                                            <select 
                                            defaultValue={orderItem.order_status} 
                                            onChange={e => { selectedOrderCopy["order_status"] = e.target.value }} 
                                            >
                                                <option value="Placed" className={style.options}>Placed</option>
                                                <option value="Confirm" className={style.options}>Confirm</option>
                                                <option value="Cooked" className={style.options}>Cooked</option>
                                                <option value="Served" className={style.options}>Served</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className={style.selectionContainer}>
                                        <label className={style.lable}>Payment Status</label>
                                        <div className={style.selctedContentBox}>
                                            <select 
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

                        <div className={style.btnContainer} style={{ paddingBottom: "10px" }}>
                            <div className={style.selectionContainer}>
                                <button className={style.kotPrint}
                                    onClick={e => nav("/kot", { state: { "gstFssai": gstFssai, "restro_detail": restroDetail, "order":openPopupModalOpen, "orderItem": orderItemList.filter((o) => { return o.order_id == openPopupModalOpen.order_id }) } })}
                                >Print KOT</button>                                   
                            </div>
                            <div className={style.selectionContainer}>
                                <button className={style.billPrint}
                                    style={openPopupModalOpen.payment_status != "Completed" ? { background: "rgba(128,128,128,0.3)", pointerEvents: "none", textDecoration: "line-through" } : {}}
                                    onClick={e => nav("/Billing", { state: { "gstFssai": gstFssai, "restro_detail": restroDetail, "order": openPopupModalOpen, "orderItem": orderItemList.filter((o) => { return o.order_id == openPopupModalOpen.order_id }) } })}
                                >Print</button>
                            </div>
                        </div>

                    </div>
                </Modal>
                {/* end of addition by - suman sahu on 10/06/2023 */}

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


