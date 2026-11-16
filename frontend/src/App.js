import appStyle from "./App.module.css";

import Cover from "./screens/Cover/user_interface/containers/Cover";

import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import MenuItem from "./screens/Menu/user_interface/containers/MenuItem";
import Footer from "./screens/Footer/user_interface/containers/Footer";
import Cart from "./screens/Cart/user_interface/containers/Cart";
import { FaClipboardList } from "react-icons/fa"
import { useContext,useState } from "react";
import { GlobalContext } from "./context/Context";
import Payment from "./screens/Payment/user_interface/containers/Payment";
import Billing from "./screens/Billing/user_interface/containers/Billing";
import BillSuccess from "./screens/BillSuccess/user_interface/containers/BillSuccess";
import "./App.css"
import landscapeMode from './images/landscape.png'
import GlobalColor from "./screens/Theme/user_interface/containers/GlobalColor";
import RatingAndReview from "./screens/Rating/user_interface/containers/RatingAndReview";
import secureLocalStorage from "react-secure-storage";
import Otppopup from "./screens/Customer/user_interface/components/Otppopup";

import { getFCMToken } from './firebase';
import { useEffect, useRef } from "react";
import siteConfig from "./config/config";
import { Modal } from 'antd';
import OrderDetails from "./screens/Order/user_interface/containers/OrderDetails";
import InvoiceDetail from "./screens/Invoice/user_interface/containers/InvoiceDetail";
import { CheckCircleOutlined } from '@ant-design/icons';
import { message } from "antd";
import { useAppState } from "./usestate/appState";
import { resolveTenantSlug } from './utils/tenant';
import { hasFeature } from './plans';
import API from './http/http_client';
import { getOrderItemsAndOrderAPI } from './screens/Order/services/orderService';

function App() {
  const { colors, restaurant_name, subscribePlan, orderItems, setOrderItem, orders, setOrders } = useContext(GlobalContext)

  // The plan arrives a moment after the page opens. Wait for it instead of treating it as empty and redirecting.
  const planGate = (feature, element) => {
    if (subscribePlan === null) return null
    return hasFeature(subscribePlan, feature) ? element : <Navigate to="/menu-item" />
  }

  var tenant = resolveTenantSlug()
  useEffect(() => {
     if(tenant)
    localStorage.setItem("temporaryTenant",tenant)
    localStorage.removeItem("sentToServer")
    if (!('Notification' in window)) {
      return
    }
    if (Notification.permission === 'granted') {
      getFCMToken()
    } else if (Notification.permission !== 'denied') {
      Promise.resolve(Notification.requestPermission())
        .then((permission) => { if (permission === 'granted') getFCMToken() })
        .catch(() => {})
    }
  },[])

  useEffect(() => {
    let lastStatus = ''
    let lastPayment = ''
    let lastItems = ''
    const pullOrder = async () => {
      const stored = secureLocalStorage.getItem('order')
      if (!stored || !stored.order_id) {
        return
      }
      const response = await getOrderItemsAndOrderAPI({ order: stored.order_id }, resolveTenantSlug())
      if (!response || !response.order) {
        return
      }
      const nextStatus = response.order.order_status
      const nextPayment = response.order.payment_status
      const itemsKey = JSON.stringify((response.orderItem || []).map((item) => [item.id, item.quantity, item.item_status, item.price]))
      if (!lastStatus) {
        lastStatus = nextStatus
        lastPayment = nextPayment
        lastItems = itemsKey
        return
      }
      if (nextStatus === lastStatus && nextPayment === lastPayment && itemsKey === lastItems) {
        return
      }
      lastStatus = nextStatus
      lastPayment = nextPayment
      lastItems = itemsKey
      // The API already returns flat item rows (price, quantity, ...), the shape the pages read.
      updateOrderOnUI({ fields: response.order }, response.orderItem || [])
    }
    pullOrder()
    let connected = false
    const timer = setInterval(() => {
      if (!connected) pullOrder()
    }, 20000)
    let socket
    let closed = false
    let retry
    const openSocket = async () => {
      try {
        const stored = secureLocalStorage.getItem('order')
        if (!stored || !stored.order_id) return
        const response = await API.post('/order-events/ws-ticket/', { order_id: stored.order_id })
        const ticket = response.data && response.data.data ? response.data.data.ticket : ''
        if (!ticket || closed) return
        const pageProto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const origin = siteConfig.wsOrigin || `${pageProto}//${window.location.host}`
        const params = new URLSearchParams({ ticket })
        const slug = resolveTenantSlug()
        if (siteConfig.wsOrigin && slug) params.set('tenant', slug)
        socket = new WebSocket(`${origin}/ws/orders/?${params.toString()}`)
        socket.onopen = () => { connected = true }
        socket.onmessage = () => pullOrder()
        socket.onclose = () => {
          connected = false
          if (!closed) retry = setTimeout(openSocket, 5000)
        }
      } catch (err) {
        connected = false
      }
    }
    openSocket()
    return () => {
      closed = true
      clearInterval(timer)
      clearTimeout(retry)
      if (socket) socket.close()
    }
  }, [])

  // Push notifications forwarded by the service worker carry the latest order and its items.
  const pushHandler = useRef(() => {})
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return
    }
    const onPush = (event) => {
      const data = event.data && event.data.data
      if (!data || !data.order || !data.orderItem) {
        return
      }
      try {
        pushHandler.current(JSON.parse(data.order)[0], JSON.parse(data.orderItem))
      } catch (err) {
      }
    }
    navigator.serviceWorker.addEventListener('message', onPush)
    return () => navigator.serviceWorker.removeEventListener('message', onPush)
  }, [])

  const applyPushedOrder = (updatedOrderData, updatedOrderItemsData) => {
    var orderItemsField = []

    updatedOrderItemsData.forEach((data) => {
      var orderItem = {
      cancel_reason : data.fields.cancel_reason,
      date : data.fields.date,
      item : data.fields.item,
      item_id : data.fields.item_id,
      item_status : data.fields.item_status,
      order_id : data.fields.order_id,
      price : data.fields.price,
      quantity : data.fields.quantity,
      rating : data.fields.rating,
      review : data.fields.review,
      serving_size : data.fields.serving_size,
      id : data.pk
      }
      orderItemsField.push(orderItem)
    })
    updateOrderOnUI(updatedOrderData, orderItemsField);
  }
  pushHandler.current = applyPushedOrder

  var { isLoading, setLoading } = useAppState();

  const updateOrderOnUI = (updatedOrderData, orderItemsField) => {
    if (updatedOrderData.fields.order_status == "Confirm") {
      message.success({
        content: "Order Confirmed",
        duration: 3,
        key: 1,
        maxCount : 1,
        icon: <CheckCircleOutlined />,
        style: {
          marginTop: '5vh',
          fontSize: "16px",
          letterSpacing: "1.3px",
          fontFamily: "Times News Roman",
          color: colors.headingColor,
        },
      });
    }

      if (updatedOrderData.fields.payment_status == "Completed") {
        message.success({
          content: "Your payment is completed, please get your bill",
          duration: 3,
          maxCount : 1,
          key: 1,
          icon: <CheckCircleOutlined />,
          style: {
            marginTop: '5vh',
            fontSize: "16px",
            letterSpacing: "1.3px",
            fontFamily: "Times News Roman",
            color: colors.headingColor,
          },
        });
    }

    setLoading(true);
    if (secureLocalStorage.getItem("order") && secureLocalStorage.getItem("orderItem")) {
      secureLocalStorage.removeItem('order');
      secureLocalStorage.removeItem('orderItem');
      secureLocalStorage.setItem("order", updatedOrderData.fields)
      secureLocalStorage.setItem("orderItem", orderItemsField)
      setOrders(secureLocalStorage.getItem("order"))
      setOrderItem(secureLocalStorage.getItem("orderItem"))
    }

    if (updatedOrderData.fields.order_status == "Cancelled") {
      message.error({
        content: "Order Cancelled",
        duration: 3,
        maxCount : 1,
        key: 1,
        icon: <CheckCircleOutlined />,
        style: {
          marginTop: '5vh',
          fontSize: "16px",
          letterSpacing: "1.3px",
          fontFamily: "Times News Roman",
          color: colors.headingColor,
        },
      });
      secureLocalStorage.removeItem('order');
      secureLocalStorage.removeItem('orderItem');
      secureLocalStorage.removeItem("setting_data");
      secureLocalStorage.removeItem("customer_details");
      secureLocalStorage.removeItem("invoice_detail");
      window.location = `/menu-item`
    }
    setLoading(false);
  }

  return (
    <BrowserRouter>

      <div className={`${appStyle.container}`}

        style={{ background: colors.backgroundTheme }}
      >

        <div><GlobalColor /></div>

        <div className="heading_container" id="header" style={{position:"sticky",top:"0",zIndex:"99",background:colors.backgroundTheme}} >
          <h2 style={{ color: colors.headingColor }}
            className={restaurant_name.length > 14 ? 'restaurant_name' : 'restaurant_fontsize'}>
            {restaurant_name.toUpperCase()}
          </h2>

        </div>
        {/* end of heading */}

        <Routes>
          <Route exact path="/*" element={<Cover />} />
          <Route exact path="/menu-item" element={<MenuItem />} />
          <Route exact path="/menu-item/table/:tableNumber" element={<MenuItem />} />
          <Route exact path="/menu-item/floor/:floorNumber/table/:tableNumber" element={<MenuItem />} />
          <Route exact path="/cart" element={planGate('order', <Cart />)} />
          <Route exact path="/billing" element={planGate('order', <Billing />)} />

          <Route exact path="/order" element={planGate('order', <OrderDetails />)} />
          <Route exact path="/payment" element={planGate('payment', <Payment />)} />

          <Route exact path="/bill-success" element={planGate('order', <BillSuccess />)} />

          <Route exact path="/invoice" element={planGate('order', <InvoiceDetail />)} />

          <Route exact path="/rating-review" element={planGate('rating', <RatingAndReview />)} />

          <Route path="/Verification" element={secureLocalStorage.getItem('order') ? <Navigate to="/cart" /> : (planGate('order', <Otppopup />))} />

        </Routes>
        <Footer />
      </div>

      <div className="inlandscapemode" id="landscape" style={{ color: colors.subHeadingColor }}>
        <img src={landscapeMode} style={{ height: '80vh' }} alt="" className="landscapimg" />
      </div>
    </BrowserRouter>
  );
}

export default App;
