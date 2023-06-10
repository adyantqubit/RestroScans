import './App.css';
import { Routes,Route, Navigate } from 'react-router-dom';
import Registration from './Pages/Auth/Registration';
import Login from './Pages/Auth/Login';
import Forget from './Pages/Auth/ForgetPassword';
import style from "./app.module.css"
import { useEffect, useState } from 'react';
import { Alert, AlertIcon } from '@chakra-ui/react'
import Dashboard from './Pages/Home/Dashboard';
import Header from './Pages/GlobalComponent/Header';
import Billing from './Pages/Billing/Billing';
import { tokenValidationAPI } from './Api/services';
import Footer from './Pages/GlobalComponent/Footer';
import QRCode from './Pages/Home/QRcode';
import Kot from './Pages/Kot/Kot';
import OrderReport from './Pages/Report/OrderReport';
import OrderItemReport from './Pages/Report/OrderItemReport';
import CustomerReport from './Pages/Report/CustomerReport';
import BannerOffer from "./Pages/BannerOffer/BannerOffer";
import BannerOfferItem from "./Pages/BannerOffer/BannerOfferItem";
import Menu from "./Pages/Menu/menu";
import Category from "./Pages/Menu/Category";
import Item from "./Pages/Menu/Item";
import FooterDescription from "./Pages/Home/FooterDescription";
import CustomerDetail from "./Pages/CustomerDetail/CustomerDetail";
import Order from "./Pages/Order/Order";
import OrderItem from "./Pages/Order/OrderItem";
import PaymentMethod from "./Pages/PaymentDetail/PaymentMethod";
import Revenue from "./Pages/Revenue/Revenue";
import Setting from './Pages/Setting/Setting';
import SettingForm from './Pages/Setting/SettingForm';

var Message=0;
var AutoValidateToken=0
var tokenRecheck=0
function App() {
  const [isSuccessfull,setSuccessfull]=useState(false)
  // set all message type in smaller character
  const [notificationType,setNotification]=useState("success")
  const [notificationText,setNotificationText]=useState("SuccessFully")
  // Added by Om Shrivastava on 03-06-23
  // Reason : Fix the logout issue
  const [tokenExist,setTokenExist]=useState(false)  // I change this statement true to false in 04-06-23

// Added by Om Shrivastava on 04-06-23
// Reason : When we refresh the page than dashboard is shown
  useEffect(()=>{
   tokenRecheck()
  },[])
  // End of addition by Om Shrivastava on 04-06-23

  tokenRecheck = ()=>{
    if (localStorage.getItem('token')){
      setTokenExist(true)
      // console.log('token exist')
    }
    else{
      setTokenExist(false)
      // console.log('not exist')
    }

  }
// End of addition by Om Shrivastava on 02-06-23

  
  Message= (text,type)=> {
    setNotificationText(text)
    setNotification(type)
    setSuccessfull(true)
    setTimeout(()=>{setSuccessfull(false)},3000)
  }

  // Modified by By - Rohan KAnsari - 26/5/23
  // Reason - throwing some undifned issue
  AutoValidateToken=async ()=>{
    console.log(typeof localStorage.getItem("refresh_token")=="string")
    if(localStorage.getItem('refresh_token')){
    const tokens={
      access:localStorage.getItem("token"),
      refresh:localStorage.getItem("refresh_token")
    }
    await tokenValidationAPI(tokens).then(r=>{
      if(r){
        localStorage.setItem("token",r.access_token)
        localStorage.setItem("refresh_token",r.refresh_token)
        tokenRecheck()
      }
      else{
        localStorage.clear()
        tokenRecheck()
        window.location="/Login"
        Message("Unathenticate ! please login again")
      }
    })
  }else{
    localStorage.clear()
  }
   
  }
  // End of code - Rohan KAnsari - 26/5/23

  setInterval(AutoValidateToken,72000)

  return (
    <>
      {isSuccessfull ?
        <Alert
        // Added by Om Shrivastava on 09-06-23
        // Reson : Need to fix the width of alert
        maxW="350px"
        // End of addition by Om shrivastava on 09-06-23
        status={notificationType} className={`${style.label} ${style.alert}`} id="pot">
          <AlertIcon />
          {notificationText}
        </Alert> : null}

      {/* Modified by Rohan KAnsari - 29/5/23
        Reason - To validate token in all page  */}
      <Routes>
        <Route path='/Registration' element={tokenExist ? <Navigate to="/Dashboard" /> : <Registration />} />
        <Route path="/Login" element={tokenExist ? <Navigate to="/Dashboard" /> : <Login />} />
        <Route path="/Forget" element={tokenExist ? <Navigate to="/Dashboard" /> : <Forget />} />
      </Routes>
      {/* <Header> */}
      <Routes>
        {/* <Route path='/Registration' element={<Registration/>} />
      <Route path="/Login" element={<Login/>} />
      <Route path="/Forget" element={<Forget/>}/> */}
        <Route path="/Dashboard" element={!tokenExist ? <Navigate to="/Login" /> : <Dashboard />} />
        <Route path="/Billing" element={!tokenExist ? <Navigate to="/Login" /> : <Billing />} />
        {/* Added by Rohan Kansari - 25/5/23
          Reason - Kot page added */}
        <Route path="/kot" element={!tokenExist ? <Navigate to="/Login" /> : <Kot />} />
        {/*End of code- Rohan Kansari - 25/5/23  */}

        {/* Added by Rohan Kansari - 26/5/23
          Reason - Report page added */}
        <Route path="/OrderReport" element={!tokenExist ? <Navigate to="/Login" /> : <OrderReport />} />
        {/*End of code- Rohan Kansari - 26/5/23  */}

        {/* Added by Rohan Kansari - 26/5/23
          Reason - Report page added */}
        <Route path="/OrderItemReport" element={!tokenExist ? <Navigate to="/Login" /> : <OrderItemReport />} />
        {/*End of code- Rohan Kansari - 26/5/23  */}

        {/* Added by Rohan Kansari - 26/5/23
          Reason - Report page added */}
        <Route path="/CustomerReport" element={!tokenExist ? <Navigate to="/Login" /> : <CustomerReport />} />
        {/*End of code- Rohan Kansari - 26/5/23  */}
        {/* End of code Modification - Rohan Kansari - 29/5/23 */}

        {/* added by - Suman sahu On 25/05/2023 */}
        <Route path="/QRcode" element={<QRCode />} />
        {/* end of addition by - Suman sahu On 25/05/2023 */}

        {/* added by - Suman sahu On 26/05/2023 */}
        <Route path="/BannerOffer" element={<BannerOffer />} />
        <Route path="/BannerOfferItem" element={<BannerOfferItem />} />
        <Route path="/Menu" element={<Menu />} />
        <Route path="/Category" element={<Category />} />
        <Route path="/Item" element={<Item />} />
        {/* Commented by - Ashish Dewangan on 04-06-2023
        Reason - No need to display setting list because we can have only one setting */}
        {/* <Route path="/Setting" element={<Setting/>} /> */}
        {/* End of comment - Ashish Dewangan on 04-06-2023
        Reason - No need to display setting list because we can have only one setting */}
        
        {/* Added by - Ashish Dewangan on 02-06-2023
        Reason - To have route for setting form */}
        <Route path="/SettingForm" element={ <SettingForm/>  }/>
        {/* End of code addition by - Ashish Dewangan on 02-06-2023
        Reason - To have route for setting form */}
        <Route path="/FooterDescription" element={<FooterDescription />} />
        <Route path="/CustomerDetail" element={<CustomerDetail />} />
        <Route path="/Order" element={<Order />} />
        <Route path="/OrderItem" element={<OrderItem />} />
        <Route path="/PaymentMethod" element={<PaymentMethod />} />
        {/* end of addition by - Suman sahu On 26/05/2023 */}

        <Route path="/Revenue" element={<Revenue />} />
      </Routes>
      {/* <Footer /> */}
      {/* </Header> */}
    </>
  );
}

export default App;

export { Message, AutoValidateToken,tokenRecheck }

