import appStyle from "./App.module.css";

import Cover from "./component/cover/Cover";

import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import MenuItem from "./component/MenuItem/MenuItem";
import Footer from "./component/footer/Footer";
import Cart from "./component/cart/Cart";
import { FaClipboardList } from "react-icons/fa"
import { useContext,useState } from "react";
import { GlobalContext } from "./context/Context";
import InvoiceDetails from "./component/InvoiceDetails/InvoiceDetails";
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

import { getFCMToken } from './firebase';
import { useEffect } from "react";
import { Modal } from 'antd';

function App() {
  const { colors, restaurant_name, subscribePlan } = useContext(GlobalContext)

  // Added by Om on 30-04-23
  // Reason : Connectivity with backend to firebase than UI
  
  var seperatedWords =  window.location.pathname.split('/') // Find the path of tenant name
  var tenant = seperatedWords[1]
  useEffect(()=>{
    /**
     * Added by - Om shrivastava on 01-05-2023
     * Reason - To store tenant name
     */
    localStorage.setItem("tenantName",tenant)
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
      console.log('Notification permission granted.');
      getFCMToken()
    })
    .catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });
  }

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
          <Route exact path="/cart" element={subscribePlan?.includes("order")?<Cart />:<Navigate to="/menu-item"/>} />
          <Route exact path="/billing" element={<Billing/>} />
          {/* <Route exact path="/<str:tenant>/tenant-details/" element={<Cover />} /> */}

          {/* Added by :- Parineeta Gedam
              Date :- 07-04-2023
              Reason : show the invoice, payment, and bill success page.
          */}

          <Route exact path="/invoice" element={<InvoiceDetails />} />
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
              Date :- 24-04-2023
              Reason : show the rating and review page.
          */}
          <Route exact path="/rating-review" element={secureLocalStorage.getItem("order")?<RatingAndReview/>:<Navigate to="/menu-item"/>} />
          {/* <Route exact path="/billing" element={<Billing2 />} /> */}
          {/* End of added code */}

          {/* Added by - Rohan knasari - 26/4/23 */}
           <Route path="/Verification" element={secureLocalStorage.getItem('order')?<Navigate to="/cart"/>:<Otppopup/>}/>
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
