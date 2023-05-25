import React, { useEffect, useRef, useState } from 'react'
import style from './todayOrder.module.css'
import { TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot, PopoverTrigger, IconButton, FocusLock, PopoverArrow, PopoverContent, PopoverCloseButton } from '@chakra-ui/react'
import { GrFormCheckmark } from 'react-icons/gr'
import { GiRiceCooker } from "react-icons/gi"
import { getDashboardData, updateItemStatus, updateOrderAndPaymentStatus } from '../../../Api/services'
import { AiOutlineClose } from 'react-icons/ai'
import { MdKeyboardArrowDown, MdDownloading } from "react-icons/md"
import { RiErrorWarningLine } from "react-icons/ri"
import { Popover } from 'antd'
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

    // Billing data
    const [restroDetail, setRestroDetail] = useState(null)
    const [gstFssai, setGstFsaai] = useState(null)
    const nav = useNavigate()

    useEffect(() => {
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
        if ((orderStatus == "Placed" || orderStatus == "Confirm" || orderStatus == "Cooked") && paymentStatus == "Completed") {
            Message("You can not change the status to completed until this order is severd.", "error")
            return false
        }
        else if (orderStatus == "Served" && paymentStatus == "Completed") {
            return true
        }
        else
            return true
    }



    function model(m, i) {
        var paymentStatus = m.payment_status
        var orderStatus = m.order_status


        async function updateStatus() {

            const status = {
                order_status: orderStatus,
                payment_status: paymentStatus,
            }

            const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name

            if ((m.order_status !== orderStatus || m.payment_status !== paymentStatus) && statusValidation(orderStatus, paymentStatus, m)) {
                await updateOrderAndPaymentStatus(tenant, status, m.order_id).then(r => {
                    if (r.success) {
                        Message("Succefully status updated ", "success")
                        setNewlyPlacedOrders(r.todays_newly_placed_orders);
                        setPendingOrders(r.todays_pending_orders);
                        setCompletedOrders(r.todays_completed_orders);
                        setOrderItem(r.order_item)
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
            }

        }
        if (popupOpen)
            return <div className={style.popupContainer}
                onLoad={e => {
                    console.log(document.getElementById("order_status_selected").selected)
                    console.log(document.getElementById("payment_status_selected").selected)
                }}>
                <div className={style.closeContainer}><button className={style.closeBtn} onClick={e => {
                    selectboxReset()
                    setPopupOpen(false)
                }}><AiOutlineClose /></button></div>
                <div className={style.customername}><label className={style.lable}>Customer Number : </label>{m.customer_number}</div>
                <div className={style.OrderTime}><label className={style.lable}>Table No : </label>{m.table_number}</div>
                <div className={style.OrderTime}><label className={style.lable}>Date & Time : </label>{m.date.substring(0, 10).split('-').reverse().join("/") + ' ' + m.date.substring(11, 16)}</div>
                <div className={style.OrderTime}><label className={style.lable}>Subtotal :</label>{m.sub_total}</div>
                <div className={style.OrderTime}><label className={style.lable}>Cgst : </label>{m.cgst}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label className={style.lable}>Sgst : </label>{m.sgst}</div>
                <div className={style.OrderTime}><label className={style.Highlightlable}>Total : {m.total} </label></div>
                <div className={style.btnContainer}>
                    <div className={style.selectionContainer}>
                        <label className={style.lable}>Order Status</label>
                        <div className={style.selctedContentBox}>
                            <select defaultValue={orderStatus} onChange={e => orderStatus = e.target.value} id="order_status_selected">
                                <option value="Placed" className={style.options}>Placed</option>
                                <option value="Confirm" className={style.options}>Confirm</option>
                                <option value="Cooked" className={style.options}>Cooked</option>
                                <option value="Served" className={style.options}>Served</option>
                            </select>
                        </div>
                        {/* <div className={style.selctedContentBox}>Pending<div className={style.icon}><MdKeyboardArrowDown /></div></div> */}

                    </div>
                    <div className={style.selectionContainer}>
                        <label className={style.lable}>Payment Status</label>
                        <div className={style.selctedContentBox}>
                            <select defaultValue={paymentStatus} onChange={e => paymentStatus = e.target.value} id="payment_status_selected">
                                <option className={style.options} value="Pending">Pending</option>
                                <option className={style.options} value="Completed">Completed</option>
                            </select>
                        </div>
                        {/* <div className={style.selctedContentBox}>Pending<div className={style.icon}><MdKeyboardArrowDown /></div></div> */}
                    </div>
                </div>
                <div className={style.btnContainer}>
                    <div className={style.selectionContainer}>
                        <button className={style.btnUpdate} onClick={e => updateStatus()}>Update</button>                                    {/* <div className={style.selctedContentBox}>Pending<div className={style.icon}>{">"}</div></div> */}
                    </div>
                    <div className={style.selectionContainer}>
                        <button className={style.btnUpdate} onClick={e => { setPopupOpen(!popupOpen); selectboxReset() }}>Cancel</button>
                    </div>
                </div>

                <div className={style.btnContainer}>
                    <div className={style.selectionContainer} style={{ textAlign: "center" }}>
                        <div className={style.visitLink}>See Order</div>                                    {/* <div className={style.selctedContentBox}>Pending<div className={style.icon}>{">"}</div></div> */}
                    </div>
                    <div className={style.selectionContainer}>
                        <span className={style.visitLink}>See Order Item</span>
                    </div>
                </div>

                <div className={style.btnContainer} style={{ paddingBottom: "10px" }}>
                    <div className={style.selectionContainer}>
                        <button className={style.kotPrint}>Print KOT</button>                                    {/* <div className={style.selctedContentBox}>Pending<div className={style.icon}>{">"}</div></div> */}
                    </div>
                    <div className={style.selectionContainer}>
                        <button className={style.billPrint}
                            style={m.payment_status != "Completed" ? { background: "rgba(128,128,128,0.3)", pointerEvents: "none", textDecoration: "line-through" } : {}}
                            onClick={e => nav("/Billing", { state: { "gstFssai": gstFssai, "restro_detail": restroDetail, "order": m, "orderItem": orderItemList.filter((o) => { return o.order_id == m.order_id }) } })}
                        >Print</button>
                    </div>
                </div>

            </div>
    }


    function orderItemModel(filteredOrderItemList, i) {
        updatedStatus.current.value = []
        filteredOrderItemList?.filter(e => updatedStatus.current.value.push(e.item_status))


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

        function resetingSelectbox() {
            // This is to reseting the all value of select box on closing without updating
            var option = document.querySelectorAll("select option");
            for (var i = 0; i < option.length; i++) {
                option[i].selected = option[i].defaultSelected;
                if (filteredOrderItemList[i])
                    filteredOrderItemList[i].item_status = updatedStatus.current.value[i];
            }

            // Reseting end code
        }

        if (popupOrderItem)
            return <div className={style.popupItemContainer}>
                <div className={style.closeContainer}><button className={style.closeBtn} onClick={e => {
                    setPopupOrderItem(false);
                    resetingSelectbox()
                }}><AiOutlineClose /></button></div>
                {filteredOrderItemList?.map((orderItem, i) => (
                    <div key={i} className={style.itemListContainer}>
                        <div className={style.title}>{i + 1 + ". "}{orderItem.item}</div>
                        <div className={style.itemStatusContainer} >
                            <label className={style.lable}>Item Status</label>
                            <div className={style.selctedContentBox}>
                                <select defaultValue={orderItem.item_status} onChange={e => { filteredOrderItemList[i].item_status = e.target.value }} id="payment_status_selected">
                                    <option className={style.options} value="Pending">Pending</option>
                                    <option className={style.options} value="Confirm">Confirm</option>
                                </select>
                            </div>
                        </div>
                    </div>

                ))}

                <div className={style.itemStatusContainer}>
                    <div className={style.selectionContainer}>
                        <button className={style.btnUpdate} onClick={e => { updateStatus(); }}>Update</button>                                    {/* <div className={style.selctedContentBox}>Pending<div className={style.icon}>{">"}</div></div> */}
                    </div>
                    <div className={style.selectionContainer}>
                        <button className={style.btnUpdate} onClick={e => { setPopupOrderItem(false); resetingSelectbox() }}>Cancel</button>
                    </div>
                </div>
            </div>
    }


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

    return (
        <>
            <div className={style.radioGroup}>
                <input className={style.radioButton} type='radio' id="radio1" name="group" defaultChecked={true} />
                <label className={style.tabLabel} htmlFor='radio1' onClick={e => setSelectedOrder(newlyPlaced)}>Newly Placed</label>
                <input className={style.radioButton} id='radio2' type='radio' name="group" />
                <label className={style.tabLabel} htmlFor='radio2' onClick={e => setSelectedOrder(todaysPendingOrder)}>Pending</label>
                <input className={style.radioButton} id='radio3' type='radio' name="group" />
                <label className={style.tabLabel} htmlFor='radio3' onClick={e => setSelectedOrder(todaysCompletedOrder)}>Completed</label>
            </div>
            <div className={style.container} >
                <div className={style.TabelContainer}>

                    <div className={style.table}>
                        <div className={style.tableHeading}>
                            <div className={style.column1}>Sno</div>
                            <div className={style.column2}>Table No </div>
                            <div className={style.column8}>Order no</div>
                            <div className={style.column3}>Order Status</div>
                            <div className={style.column4}>Time</div>
                            <div className={style.column5}>Amount</div>
                            <div className={style.column6}>Payment Status</div>
                            <div className={style.column7}>Action</div>
                        </div>

                        {selectedOrder && selectedOrder.length > 0 ? selectedOrder.map((m, i) => (
                            <div className={style.row} >
                                <div className={style.columnData1}>{i + 1}</div>
                                <Popover placement="right"
                                    trigger="click"
                                    onOpenChange={e => {
                                        if (!e) {
                                            selectboxReset()
                                        }
                                    }}
                                    content={e => orderItemModel(orderItemList?.filter(o => o.order_id == m.order_id), i)}
                                >
                                    <div className={style.columnData2} onClick={e => setPopupOrderItem(true)}>
                                        {m.table_number}
                                    </div>
                                    {/* <button className={style.printBtn} onClick={e => setPopupOpen({ [`${i}`]: true })}>More</button> */}
                                </Popover>

                                <div className={style.columnData8}>{m.order_id}</div>
                                <div className={style.columnData3}>{getStatusBtn(m.order_status)}</div>
                                <div className={style.columnData4}>{m.date.substring(11, 16)}</div>
                                <div className={style.columnData5}>{m.total}</div>
                                <div className={style.columnData6}>{getStatusBtn(m.payment_status)}</div>
                                <div className={style.columnData7}>
                                    <Popover placement="left"
                                        content={e => model(m, i)}
                                        onOpenChange={e => {
                                            if (!e) {
                                                selectboxReset()
                                            }
                                        }}
                                        trigger='click'>
                                        <button className={style.printBtn} onClick={e => setPopupOpen(true)}>More</button>
                                    </Popover>
                                </div>
                            </div>
                        )) : <div className={style.row}>
                            <div className={style.EmptyText}> No order created yet !</div>
                        </div>}
                    </div>

                </div>
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


        </>
    )
}

export default TodayOrder


