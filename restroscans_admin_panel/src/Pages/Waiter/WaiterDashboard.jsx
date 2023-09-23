import React, { useEffect, useState } from 'react'
import style from "./waiterDashboard.module.css"
import { Message, enableHeader, tokenRecheck } from '../../App'
import { waiterDashboardData } from '../../Api/services'
import OrderModel from '../DashboardModel/OrderModel'
import PrintBill from '../Home/components/PrintBill'
import OrderCreation from '../Home/components/OrderCreation'

const WaiterDashboard = () => {

  var [placedOrders, setPlacedOrders] = useState([])
  var [pendingOrders, setPendingOrders] = useState([])
  var [completedorders, setCompletedOrders] = useState([])
  var [orderItems, setOrderItems] = useState([])

  var [selectedOrder, setSelectedOrder] = useState({})
  var [selectedOrderItems, setSelectedOrderItems] = useState([])
  var [IsModalOpen, setModelVisiblity] = useState(false)
  const [setting, setSettings] = useState(null)
  const [restroDetail, setRestroDetail] = useState(null)


  const [IsOrderPopupVisible, setOrderPopupvisible] = useState(false)

  const [recall, setRecall] = useState([]);

  useEffect(() => {
    enableHeader();
    getDashboardData();
  }, [recall,IsOrderPopupVisible,IsModalOpen])


  async function getDashboardData() {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const waiterId= JSON.parse(localStorage.getItem("waiterData")).id

    await waiterDashboardData(tenant,waiterId).then(r => {
      if(r.waiter_error){
          localStorage.clear()
          tokenRecheck()
          Message("Waiter is not active any more","error")
      }
      else{
      setPlacedOrders(r.todays_newly_placed_orders);
      setPendingOrders(r.todays_pending_orders);
      setCompletedOrders(r.todays_completed_orders);
      setOrderItems(r.order_item)
      setSettings(r.setting);
      setRestroDetail(r.tenant);
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
      <OrderModel isOpen={IsModalOpen} setting={setting} restroDetail={restroDetail} selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} selectedOrderItems={selectedOrderItems} setSelectedOrderItems={setSelectedOrderItems} setModelVisiblity={setModelVisiblity} />
      <OrderCreation recall={recall} setRecall={setRecall} IsOrderPopupVisible={IsOrderPopupVisible} setOrderPopupvisible={setOrderPopupvisible} />
      
      <div className={style.contains}>

        <div className={style.containsHeading}>
          <div className={style.dashboardHeading}>Dashboard</div>

          <button className={style.createBtn} 
            onClick={e => {
              setOrderPopupvisible(true)
            }}>create order +</button>
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
                <div className={style.ItemLabel}>Confirm Item - <span className={style.Item}>{data.confirm_item}</span></div>
                <div className={style.ItemLabel}>Cancelled Item - <span className={style.Item}>{data.cancelled_item}</span></div>
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