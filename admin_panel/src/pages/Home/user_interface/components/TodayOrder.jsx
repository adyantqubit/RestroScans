import React, { useEffect } from 'react'
import { explainFailure } from '../../../../http/http_client'
import { PrintKot } from './PrintKot'
import PrintBill from './PrintBill'
import { loadDashboard, saveAllOrderStatus } from '../../services/homeService'
import { buildBulkUpdate, DEFAULT_TAB_KEY, nextServiceStep, ORDER_TABS, tabByKey } from '../../services/todayOrderRules'
import { useApp } from '../../../../Context/AppContext'
import "../style/checkboxNcoin.scss"
import OrderModel from '../../../DashboardModel/user_interface/containers/OrderModel'
import { useTodayOrderState } from "../../usestate/todayOrderState";
import TodayOrderTabs from './TodayOrderTabs'
import TodayOrderTable from './TodayOrderTable'
import BulkUpdateBar from './BulkUpdateBar'

const tenantName = () => JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;

const TodayOrder = (props) => {
    const { Message } = useApp();

    var {
        todaysPendingOrder,
        setPendingOrders,
        todaysCompletedOrder,
        setCompletedOrders,
        newlyPlaced,
        setNewlyPlacedOrders,
        todaysServedOrder,
        setServedOrder,
        todaysPaidOrder,
        setPaidOrder,
        todaysCancelledOrder,
        setCancelledOrder,
        orderItemList,
        setOrderItem,
        selectedOrder,
        setSelectedOrder,
        checkedItems,
        setCheckedItem,
        isLoading,
        setLoading,
        restroDetail,
        setRestroDetail,
        settings,
        setSettings,
        selectedOrderObject,
        setSelectedOrderObject,
        selectedOrderItemsObject,
        setSelectedOrderItemsObject,
        IsModalOpen,
        setModelVisiblity,
    } = useTodayOrderState();

    if (localStorage.getItem("selectedTab") == null)
        localStorage.setItem("selectedTab", DEFAULT_TAB_KEY);

    // The orders each tab shows, as last received from the server.
    const ordersByTab = {
        Newly_placed: newlyPlaced,
        Pending: todaysPendingOrder,
        Served: todaysServedOrder,
        Paid: todaysPaidOrder,
        Completed: todaysCompletedOrder,
        Cancelled: todaysCancelledOrder,
    };

    useEffect(() => {
        if (JSON.parse(localStorage.getItem("tenantInfo"))?.tenant_name)
            BackendCall()
    }, [props.recall, IsModalOpen])

    // Gets all of today's orders from the server and shows the tab the user was last on.
    async function BackendCall() {
        const response = await loadDashboard(tenantName());
        if (response) {
            setLoading(false)
            setNewlyPlacedOrders(response.todays_newly_placed_orders);
            setPendingOrders(response.todays_pending_orders);
            setCompletedOrders(response.todays_completed_orders);
            setServedOrder(response.todays_served_orders);
            setPaidOrder(response.todays_paid_orders);
            setCancelledOrder(response.todays_cancelled_orders);

            setSettings(response.setting);
            setRestroDetail(response.tenant);
            setOrderItem(response.order_item);
            if (IsModalOpen && selectedOrderObject && selectedOrderObject.order_id) {
                const lists = [
                    response.todays_newly_placed_orders,
                    response.todays_pending_orders,
                    response.todays_served_orders,
                    response.todays_paid_orders,
                    response.todays_completed_orders,
                    response.todays_cancelled_orders,
                ].filter(Array.isArray);
                const fresh = lists.flat().find((order) => order.order_id === selectedOrderObject.order_id);
                if (fresh) {
                    setSelectedOrderObject({ ...fresh });
                    setSelectedOrderItemsObject((response.order_item || []).filter((item) => item.order_id == fresh.order_id));
                }
            }

            const tab = tabByKey(localStorage.getItem("selectedTab"));
            if (tab) {
                setSelectedOrder(response[tab.listKey])
                if (tab.fade) uncheckAll({ fade: true })
            }
        }
    }

    function setCheckedItems(data, checked) {
        if (checked)
            setCheckedItem([...checkedItems, data])
        else
            setCheckedItem(checkedItems.filter(e => e.id != data.id))
    }

    function applyBoard(r) {
        setNewlyPlacedOrders(r.todays_newly_placed_orders);
        setPendingOrders(r.todays_pending_orders);
        setServedOrder(r.todays_served_orders);
        setPaidOrder(r.todays_paid_orders);
        setCancelledOrder(r.todays_cancelled_orders);
        setCompletedOrders(r.todays_completed_orders);
        setOrderItem(r.order_items)
        const shownTab = ORDER_TABS.find(tab => document.getElementById(tab.id)?.checked)
        if (shownTab) {
            setSelectedOrder(r[shownTab.listKey])
        }
    }

    async function updateAll(status) {
        const data = buildBulkUpdate(checkedItems, status)

        if (checkedItems.length > 0)
            await saveAllOrderStatus(tenantName(), data).then(r => {
                if (r.success) {
                    applyBoard(r)
                    checkedItems = []
                    setCheckedItem(checkedItems)
                    uncheckAll()
                }
                else {
                    Message(explainFailure(r, "Those orders were not updated."), "warning")
                }
            })
        else
            Message("No item is selected to update", "warning")
    }

    async function advanceOne(order) {
        const step = nextServiceStep(order)
        if (!step) return
        const r = await saveAllOrderStatus(tenantName(), buildBulkUpdate([order], step.change))
        if (r.success) {
            applyBoard(r)
            uncheckAll()
        } else {
            Message(explainFailure(r, "This order was not updated."), "warning")
        }
    }

    function linesFor(order) {
        return (orderItemList || []).filter((line) => line.order_id == order.order_id)
    }

    function printKot(order) {
        const items = linesFor(order).filter((line) => line.item_status !== "Cancelled" && line.item_status !== "cancelled")
        if (!items.length) {
            Message("This order has no items for the kitchen", "warning")
            return
        }
        PrintKot(order, items, restroDetail, settings)
    }

    function printBill(order) {
        const items = linesFor(order)
        if (!items.length) {
            Message("This order has no items to bill", "warning")
            return
        }
        PrintBill(order, items, restroDetail, settings)
    }

    function uncheckAll(data) {
        document.querySelectorAll("#checkbox").forEach(box => { box.checked = false })
        document.querySelectorAll("#ParentCheckbox").forEach(box => { box.checked = false })

        setCheckedItem([])

        const bar = document.getElementById("allupdate")
        if (data?.fade) {
            bar.style.display = "none"
            bar.style.pointerEvents = "none"
        } else {
            bar.style.background = "unset"
            bar.style.opacity = "unset"
            bar.style.pointerEvents = "unset"
            bar.style.display = "flex"
        }
    }

    function checkAndUncheckAll(value) {
        // Ticking the parent box ticks every order shown; unticking it clears them all.
        if (value) {
            checkedItems = selectedOrder
            setCheckedItem(selectedOrder)
        }
        else
            setCheckedItem([])

        if (checkedItems.length > 0) {
            document.querySelectorAll("#checkbox").forEach(box => { box.checked = value })
        }
        else if (value) {
            uncheckAll()
            Message("No item present", "warning")
        }
    }

    function showTab(tab) {
        setSelectedOrder(ordersByTab[tab.key]);
        localStorage.setItem("selectedTab", tab.key);
        uncheckAll({ fade: tab.fade })
    }

    function openOrder(data) {
        setSelectedOrderObject({ ...data })
        setSelectedOrderItemsObject([...orderItemList.filter(i => i.order_id == data.order_id)])
        setModelVisiblity(true)
    }

    return (
        <>
            <OrderModel isOpen={IsModalOpen} setting={settings} restroDetail={restroDetail} selectedOrder={selectedOrderObject} setSelectedOrder={setSelectedOrderObject} selectedOrderItems={selectedOrderItemsObject} setSelectedOrderItems={setSelectedOrderItemsObject} setModelVisiblity={setModelVisiblity}
            />

            <TodayOrderTabs onSelect={showTab} />

            <TodayOrderTable
                orders={selectedOrder}
                lines={orderItemList}
                isLoading={isLoading}
                onTickAll={checkAndUncheckAll}
                onTick={setCheckedItems}
                onMore={openOrder}
                onAdvance={advanceOne}
                onKot={printKot}
                onBill={printBill}
            />

            <BulkUpdateBar
                tickedCount={checkedItems.length}
                newlyPlaced={newlyPlaced}
                pendingOrders={todaysPendingOrder}
                servedOrders={todaysServedOrder}
                onUpdate={updateAll}
            />
        </>
    )
}

export default TodayOrder
