import React, { useEffect } from 'react'
import style from "../style/waiterDashboard.module.css"
import { useApp } from '../../../../Context/AppContext'
import { loadWaiterDashboard } from '../../services/waiterService'
import OrderModel from '../../../DashboardModel/user_interface/containers/OrderModel'
import PrintBill from '../../../Home/user_interface/components/PrintBill'
import OrderCreation from '../../../Home/user_interface/components/OrderCreation'
import { useWaiterDashboardState } from "../../usestate/waiterDashboardState";

const WaiterDashboard = () => {
  const { Message, enableHeader, tokenRecheck } = useApp();

  var {
    placedOrders,
    setPlacedOrders,
    pendingOrders,
    setPendingOrders,
    completedorders,
    setCompletedOrders,
    orderItems,
    setOrderItems,
    selectedOrder,
    setSelectedOrder,
    selectedOrderItems,
    setSelectedOrderItems,
    IsModalOpen,
    setModelVisiblity,
    setting,
    setSettings,
    restroDetail,
    setRestroDetail,
    IsOrderPopupVisible,
    setOrderPopupvisible,
    recall,
    setRecall,
  } = useWaiterDashboardState();

  useEffect(() => {
    enableHeader();
    getDashboardData();
  }, [recall, IsOrderPopupVisible, IsModalOpen])

  useEffect(() => {
    const onLive = () => setRecall((current) => [...current, String(Date.now())])
    window.addEventListener('order-live', onLive)
    return () => window.removeEventListener('order-live', onLive)
  }, [])

  async function getDashboardData() {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const waiterId = JSON.parse(localStorage.getItem("waiterData")).id

    await loadWaiterDashboard(tenant, waiterId).then(r => {
      if (r.waiter_error) {
        localStorage.clear()
        tokenRecheck()
        Message("Waiter is not active any more", "error")
      }
      else {
        setPlacedOrders(r.todays_newly_placed_orders);
        setPendingOrders(r.todays_pending_orders);
        setCompletedOrders(r.todays_completed_orders);
        setOrderItems(r.order_item)
        setSettings(r.setting);
        setRestroDetail(r.tenant);
        if (IsModalOpen && selectedOrder && selectedOrder.order_id) {
          const lists = [r.todays_newly_placed_orders, r.todays_pending_orders, r.todays_completed_orders].filter(Array.isArray);
          const fresh = lists.flat().find((order) => order && order.order_id === selectedOrder.order_id);
          if (fresh) {
            setSelectedOrder({ ...fresh });
            setSelectedOrderItems((r.order_item || []).filter((item) => item.order_id == fresh.order_id));
          }
        }
      }
    })
  }

  useEffect(() => {
    var ItemInformationWithOrderDetail = placedOrders.map(obj => {
      obj["total_item"] = orderItems.filter(e => e.order_id == obj.order_id).length
      obj["confirm_item"] = orderItems.filter(e => e.order_id == obj.order_id && e.item_status == "Confirm").length
      obj["cancelled_item"] = orderItems.filter(e => e.order_id == obj.order_id && e.item_status == "Cancelled").length

      return obj
    })

    setPlacedOrders([...ItemInformationWithOrderDetail])
  }, [orderItems])

  return (
    <div className={style.container}>
      <a
        href="/Workforce"
        style={{
          display: 'inline-block',
          padding: '10px 16px',
          margin: '12px 0',
          background: '#087f89',
          color: '#ffffff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600
        }}
      >
        Staff & Payroll
      </a>
      <OrderModel isOpen={IsModalOpen} setting={setting} restroDetail={restroDetail} selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} selectedOrderItems={selectedOrderItems} setSelectedOrderItems={setSelectedOrderItems} setModelVisiblity={setModelVisiblity} />
      <OrderCreation recall={recall} setRecall={setRecall} IsOrderPopupVisible={IsOrderPopupVisible} setOrderPopupvisible={setOrderPopupvisible} />

      <div className={style.contains}>

        <div className={style.containsHeading}>
          <div className={style.dashboardHeading}>Dashboard</div>

          <button className={style.createBtn}
            onClick={e => {
              setOrderPopupvisible(true)
            }}>Create Order +</button>
        </div>

        <div className={style.orderContainer}>
          <div className={style.orderContainerHeading}>Newly Placed Orders</div>
          <div className={style.tableContainer}>

            {placedOrders.map(data =>
              <div className={style.card} onClick={e => {
                setSelectedOrder({ ...data });
                setSelectedOrderItems([...orderItems.filter(e => data.order_id == e.order_id)]);
                setModelVisiblity(true)
              }}>
                <div className={style.tableLabel}>Table No - <span className={style.tabelNum}>{data.table_number}</span></div>
                <div className={style.ItemLabel}>Total Item - <span className={style.Item}>{data.total_item}</span></div>
                <div className={style.ItemLabel}>Confirm - <span className={style.Item}>{data.confirm_item}</span></div>
                <div className={style.ItemLabel}>Cancelled - <span className={style.Item}>{data.cancelled_item}</span></div>
              </div>
            )}
          </div>
        </div>

        <div className={style.orderContainer2}>
          <div className={style.orderContainerHeading}>Pending Orders</div>
          <div className={style.tableContainer}>
            {pendingOrders.map(data =>
              <div className={style.card2} onClick={e => {
                setSelectedOrder({ ...data });
                setSelectedOrderItems([...orderItems.filter(e => data.order_id == e.order_id)]);
                setModelVisiblity(true)
              }}>
                <div className={style.tableLabel}>Tabel No - <span className={style.tabelNum}>{data.table_number}</span></div>
                <div className={style.ItemLabel}>Order Status - <span className={style.Item}>{data.order_status}</span></div>
              </div>
            )}
          </div>
        </div>

        <div className={style.orderContainer3}>
          <div className={style.orderContainerHeading}>Completed Orders</div>
          <div className={style.tableContainer}>
            {completedorders.map(data =>
              <div className={style.card3} >
                <div className={style.tableLabel}
                  onClick={e => {
                    setSelectedOrder({ ...data });
                    setSelectedOrderItems([...orderItems.filter(e => data.order_id == e.order_id)]);
                    setModelVisiblity(true)
                  }}>Tabel No - <span className={style.tabelNum}>{data.table_number}</span></div>
                <button className={style.printBillBtn}
                  onClick={e => PrintBill(data,
                    orderItems.filter(e => e.order_id == data.order_id),
                    restroDetail, setting)}>Print Bill </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default WaiterDashboard
