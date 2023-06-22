import appStyle from "./App.module.css";

import Cover from "./component/cover/Cover";

import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import MenuItem from "./component/MenuItem/MenuItem";
import Footer from "./component/footer/Footer";
import Cart from "./component/cart/Cart";
import { FaClipboardList } from "react-icons/fa"
import { useContext,useState } from "react";
import { GlobalContext } from "./context/Context";
import Payment from "./component/Payment/Payment";
import Billing from "./component/Billing/Billing";
import BillSuccess from "./component/BillSuccess/BillSuccess";
import Billing2 from "./component/BillPage/Billing";
import "./App.css"
import landscapeMode from './images/landscape.png'
import GlobalColor from "./component/Colors/GlobalColor";
import RatingAndReview from "./component/RatingAndReviewPage/RatingAndReview";
import secureLocalStorage from "react-secure-storage";
import Otppopup from "./component/CustomerDetails/Otppopup";

import { getFCMToken,onMessageListener } from './firebase';
import { useEffect } from "react";
import { Modal } from 'antd';
import OrderDetails from "./component/OrderDetails/OrderDetails";
import InvoiceDetail from "./component/InvoiceDetailPage/InvoiceDetail";
import { CheckCircleOutlined } from '@ant-design/icons';
import { message } from "antd";

function App() {
  const { colors, restaurant_name, subscribePlan, orderItems, setOrderItem, orders, setOrders } = useContext(GlobalContext)

  // For navigations
  // const navigate = useNavigate();

  // Added by Om on 30-04-23
  // Reason : Connectivity with backend to firebase than UI

  var seperatedWords = window.location.pathname.split('/') // Find the path of tenant name
  var tenant = seperatedWords[1]
  useEffect(() => {
    /**
     * Added by - Om shrivastava on 01-05-2023
     * Reason - To store tenant name
     */
     if(seperatedWords[seperatedWords.length-1]=="home")
    localStorage.setItem("temporaryTenant",tenant)
    /**
     * End of code addition by Om shrivastava on 01-05-2023
     */
    localStorage.removeItem("sentToServer")
    // Added by - Ashish Dewangan on 30-04-2023
    //Reason - To delete old token from localstorage when user reloads the page
    localStorage.removeItem("fcmToken")
    //End of code addition by Ashish dewanan on 30-04-2023
    if (Notification.permission === 'granted') {
      getFCMToken()
    }else{
      // showModal()
      var getPermission=Notification.requestPermission();
      if(getPermission)
        getFCMToken();
    }
  },[])
  
  function requestBrowserPermission(){
    Notification.requestPermission()
    .then(function() {
      // console.log('Notification permission granted.');
      getFCMToken()
    })
    .catch(function(err) {
      // console.log('Unable to get permission to notify.', err);
    });
  }

  /**
   * Added by - Ashish Dewangan on 19-05-2023
   * Reason - To receive latest order details from push notification
   */
  navigator.serviceWorker.onmessage = (event) => {
    var updatedOrderData = JSON.parse(event.data.data.order)[0];
    var updatedOrderItemsData = JSON.parse(event.data.data.orderItem);
    // console.log('message from sw order', (updatedOrderData.fields));
    // console.log('message from sw order Item', updatedOrderItemsData);
    var orderItemsField = []

    // Commented and Modified by :- Parineeta Gedam on 22-06-2023
    // Ticket no :- 316
    // Reason :- Customer UI - Blank page is displayed, when click on update button after served.

    // updatedOrderItemsData.forEach((data) => {
    //   orderItemsField.push(data.fields)
    // orderItemsField.push(data.fields)
    // })

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
    // End of commented and modified code by :- Parineeta Gedam on 22-06-2023
    updateOrderOnUI(updatedOrderData, orderItemsField);
  }

  /**
   * End of code addition by Ashish Dewangan on 19-05-2023 for receiving push notification
   */

  const [isLoading, setLoading] = useState(false)

  /**
   * Added by - Ashish Dewangan on 19-05-2023
   * Reason - To take action according to new order status
   */
  const updateOrderOnUI = (updatedOrderData, orderItemsField) => {
    // Added by :- Parineeta Gedam on 25-05-2023
    // Reason :- update using push notification. 
    if (updatedOrderData.fields.order_status == "Confirm") {
      message.success({
        content: "Order Confirm",
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

    // Commented by :- Parineeta Gedam on 15-06-2023 
    // reason :- not show this message on UI side

    // if (updatedOrderData.fields.order_status == "Served") {
    //   console.log("Served", updatedOrderData.fields.order_status)
    //   message.success({
    //     content: "Order Served",
    //     key: 1,
    //     icon: <CheckCircleOutlined />,
    //     style: {
    //       marginTop: '5vh',
    //       fontSize: "16px",
    //       letterSpacing: "1.3px",
    //       fontFamily: "Times News Roman",
    //       color: colors.headingColor,
    //     },
    //   });
    // }

    // if (updatedOrderData.fields.order_status == "Cooked") {
    //   console.log("Cooked", updatedOrderData.fields.order_status)
    //   message.success({
    //     content: "Order Cooked",
    //     key: 1,
    //     icon: <CheckCircleOutlined />,
    //     style: {
    //       marginTop: '5vh',
    //       fontSize: "16px",
    //       letterSpacing: "1.3px",
    //       fontFamily: "Times News Roman",
    //       color: colors.headingColor,
    //     },
    //   });
    // }

    // End of commented code by :- Parineeta gedam on 15-06-2023 
    
    // Modified by :- Parineeta Gedam on 15-06-2023 
    // reason :- only once, show the payment complete message 
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
    // End of added code by :- Parineeta Gedam on 15-06-2023 reason :- only once, show the payment complete message 
    
    // Added by :- Parineeta Gedam on 15-06-2023
    // reason :- only once, show the order cancel message 
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
      window.location = `/menu-item`
    }
    // End of added code by :- Parineeta Gedam on 15-06-2023 reason :- only once, show the order cancel message 


    // for (var i = 0; orderItemsField.length > 0; i++) {
    //   console.log("==========", orderItemsField[i].item_status)
    //   if (orderItemsField[i].item_status == "Confirm") {
    //     console.log("8888888888888")
    //     message.error({
    //       content: "order item confirm",
    //       key: 1,
    //       icon: <CheckCircleOutlined />,
    //       style: {
    //         marginTop: '5vh',
    //         fontSize: "16px",
    //         letterSpacing: "1.3px",
    //         fontFamily: "Times News Roman",
    //         color: colors.headingColor,
    //       },
    //     });
    //   }
    // }

    // for (var i = 0; orderItemsField.length > 0; i++) {
    //   console.log("==========")
    //   if (orderItemsField[i].item_status == "Cancelled") {
    //     console.log("8888888888888")
    //     message.error({
    //       content: "order item cancelled",
    //       key: 1,
    //       icon: <CheckCircleOutlined />,
    //       style: {
    //         marginTop: '5vh',
    //         fontSize: "16px",
    //         letterSpacing: "1.3px",
    //         fontFamily: "Times News Roman",
    //         color: colors.headingColor,
    //       },
    //     });
    //   }
    // }
    setLoading(true);
    if (secureLocalStorage.getItem("order") && secureLocalStorage.getItem("orderItem")) {
      secureLocalStorage.removeItem('order');
      secureLocalStorage.removeItem('orderItem');
      secureLocalStorage.setItem("order", updatedOrderData.fields)
      secureLocalStorage.setItem("orderItem", orderItemsField)
      setOrders(secureLocalStorage.getItem("order"))
      setOrderItem(secureLocalStorage.getItem("orderItem"))
    }
    else {
      secureLocalStorage.setItem("order", updatedOrderData.fields)
      secureLocalStorage.setItem("orderItem", orderItemsField)
      setOrders(secureLocalStorage.getItem("order"))
      setOrderItem(secureLocalStorage.getItem("orderItem"))
    }
    setLoading(false);
    // End of modifications code by :- Parineeta Gedam on 17-05-2023
  }
  /**
   * End of code addition by Ashish Dewangan on 19-05-2023 to taking action for new order status
   */

  return (
    <BrowserRouter>

      <div className={`${appStyle.container}`}
    
        style={{ background: colors.backgroundTheme }}
      >

        {/* Added by :- Parineeta Gedam 21-04-2023
        Reason :- Apply global color 
     */}
        <div><GlobalColor /></div>
        {/* End of added code 21-04-2023 */}

        {/*added by rohan- on 6/4/23
          reason- here i am adding cart and back button   */}
        <div className="heading_container" id="header" style={{position:"sticky",top:"0",zIndex:"99",background:colors.backgroundTheme}} >
          <h2 style={{ color: colors.headingColor }}
            // className="restaurant_name"
            // Modified by Rohankansari - 30/4/23
            // Reason - To arrange font according to length
            className={restaurant_name.length > 14 ? 'restaurant_name' : 'restaurant_fontsize'}>
            {restaurant_name.toUpperCase()}
          </h2>

          

        </div>
        {/* end of heading */}

        <Routes>
          <Route exact path="/*" element={<Cover />} />
          <Route exact path="/menu-item" element={<MenuItem />} />
          <Route exact path="/cart" element={subscribePlan?.includes("order") ? <Cart /> : <Navigate to="/menu-item" />} />
          <Route exact path="/billing" element={<Billing />} />
          {/* <Route exact path="/<str:tenant>/tenant-details/" element={<Cover />} /> */}

          {/* Added by :- Parineeta Gedam
              Date :- 07-04-2023
              Reason : show the invoice, payment, and bill success page.
          */}

          {/* <Route exact path="/invoice" element={<InvoiceDetails />} /> */}
          <Route exact path="/order" element={<OrderDetails />} />
          <Route exact path="/payment" element={<Payment />} />

          {/* End of added code */}

          {/* Added by :- Parineeta Gedam
              Date :- 11-04-2023
              Reason : show the bill success page and Billing.
          */}
          <Route exact path="/bill-success" element={<BillSuccess />} />
          {/* <Route exact path="/billing" element={<Billing2 />} /> */}
          {/* End of added code */}

          {/* Added by :- Parineeta Gedam
              Date :- 17-05-2023
              Reason : show the order confirmations page
          */}
          <Route exact path="/invoice" element={<InvoiceDetail />} />
          {/* End of added code */}

          {/* Added by :- Parineeta Gedam
              Date :- 24-04-2023
              Reason : show the rating and review page.
          */}
          {/* <Route exact path="/rating-review" element={secureLocalStorage.getItem("order") ? <RatingAndReview /> : <Navigate to="/menu-item" />} /> */}
          <Route exact path="/rating-review" element={<RatingAndReview />} />

          {/* <Route exact path="/billing" element={<Billing2 />} /> */}
          {/* End of added code */}

          {/* Added by - Rohan knasari - 26/4/23 */}
          <Route path="/Verification" element={secureLocalStorage.getItem('order') ? <Navigate to="/cart" /> : <Otppopup />} />
          {/* End of addition - 26/4/23 - ROhan */}

        </Routes>
        <Footer />
      </div>
      
      {/* added by rohan- to show landscape error msg for all pages
          date-13/4/34 */}
      <div className="inlandscapemode" id="landscape" style={{ color: colors.subHeadingColor }}>
        <img src={landscapeMode} style={{ height: '80vh' }} alt="" className="landscapimg" />
      </div>
      {/* end of code */}
    </BrowserRouter>

  );
}

export default App;
