import './App.css';
import { Routes,Route, Navigate } from 'react-router-dom';
import Registration from './Pages/Auth/Registration';
import Login from './Pages/Auth/Login';
import Forget from './Pages/Auth/ForgetPassword';
import style from "./app.module.css";
import { useEffect, useState } from 'react';
import { Alert, AlertIcon } from '@chakra-ui/react';
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
// Commented and modified by - Ashish Dewangan on 14-06-2023
// Reason - To have naming convention
// import Menu from "./Pages/Menu/menu";
import Menu from "./Pages/Menu/Menu";
// End of code modification by - Ashish Dewangan on 14-06-2023
import Category from "./Pages/Menu/Category";
import Item from "./Pages/Menu/Item";
import FooterDescription from './Pages/FooterDescription/FooterDescription';
import CustomerDetail from "./Pages/CustomerDetail/CustomerDetail";
import Order from "./Pages/Order/Order";
import OrderItem from "./Pages/Order/OrderItem";
import OrderItemForm from "./Pages/Order/OrderItemForm";
import PaymentMethod from "./Pages/PaymentDetail/PaymentMethod";
import Revenue from "./Pages/Revenue/Revenue";
import Setting from './Pages/Setting/Setting';
import SettingForm from './Pages/Setting/SettingForm';
import SocialMediaList from './Pages/socialMedia/SocialMediaList';
import SocialMediaForm from './Pages/socialMedia/SocialMediaForm';
import OrderForm from './Pages/Order/OrderForm'
import MenuForm from './Pages/Menu/MenuForm';
import CategoryForm from './Pages/Menu/CategoryForm';
import EditItemForm from './Pages/Menu/EditItemForm';
import RestaurantRatingReview from './Pages/RestaurantRatingReview/RestaurantRatingReview'
import NewOrderReport from './Pages/Report/NewOrderReport';
import Waiter from './Pages/Waiter/Waiter';
import ReservationForm from './Pages/TableReservation/ReservationForm';
import ReservationList from './Pages/TableReservation/ReservationList';
var Message=0;
var AutoValidateToken=0
var tokenRecheck=0
// Added by Rohan kansari - 25/6/23
// Reason - declaring global function
var enableHeader=0
var disableHeader=0
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


  // Added by ROhan kansari - 25/6/23
  // Reason - To making gblobal functionso we can define where header is anable or not
 enableHeader=()=>{
  if(document.getElementById('header')){
  document.getElementById('header').style.display="grid"
  document.getElementById('sidebar').style.display="block"
  document.getElementById('footer').style.display="block"
  }
 }

 disableHeader=()=>{
 if(document.getElementById('header')){
  document.getElementById('header').style.display="none"
  document.getElementById('sidebar').style.display="none"
  document.getElementById('footer').style.display="none"
  }
 }
//  ENd of code - Rohan kansari

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
        {/* Added by Rohan kansari - 27/8/23 - To navigate blank link to dashboard */}
        <Route path="/" element={<Navigate to="/Revenue"/>}></Route>
        {/* End of code - Rohan kansari - 27/8/23 - To navigate blank link to dashboard  */}
        {/* Added by Rohan kansari - 8/9/23 - To make revenue page default */}
        <Route path='/Registration' element={tokenExist ? <Navigate to="/Revenue" /> : <Registration />} />
        <Route path="/Login" element={tokenExist ? <Navigate to="/Revenue" /> : <Login />} />
        <Route path="/Forget" element={tokenExist ? <Navigate to="/Revenue" /> : <Forget />} />
        {/* End of code addition by Rohan kansari - 8/9/23 - To make revenue page default */}
        
        {/* Added by ROhan kansari - 25/6/23 - To because non header containing pages define in other part  */}
        <Route path="/kot" element={!tokenExist ? <Navigate to="/Login" /> : <Kot />} />
        <Route path="/Billing" element={!tokenExist ? <Navigate to="/Login" /> : <Billing />} />
        {/* End of code - Rohan kansari - 25/6/24 */}
      </Routes>

       {/* Modified by Rohan Kansari - 25/6/23
     Reason - adding header from each page and making it global */}
      <Header>
      <Routes>
        {/* <Route path='/Registration' element={<Registration/>} />
      <Route path="/Login" element={<Login/>} />
      <Route path="/Forget" element={<Forget/>}/> */}
        <Route path="/Dashboard" element={!tokenExist ? <Navigate to="/Login" /> : <Dashboard />} />
        {/* REmoved by ROhan kansari - 25/3/26 */}
        {/* <Route path="/Billing" element={!tokenExist ? <Navigate to="/Login" /> : <Billing />} /> */}
        {/* Added by Rohan Kansari - 25/5/23
          Reason - Kot page added */}
          {/* REmoved by ROhan kansari - 25/3/26 */}
        {/* <Route path="/kot" element={!tokenExist ? <Navigate to="/Login" /> : <Kot />} /> */}
        {/*End of code- Rohan Kansari - 25/5/23  */}

        {/* Added by Rohan Kansari - 26/5/23
          Reason - Report page added */}

          {/* Commented and modified by Parineeta Gedam - 05-08-2023
          Reason - Report page added */}
        {/* <Route path="/OrderReport" element={!tokenExist ? <Navigate to="/Login" /> : <OrderReport />} /> */}
        <Route path="/NewOrderReport" element={!tokenExist ? <Navigate to="/Login" /> : <NewOrderReport />} />
       {/* End of Commented and modified by Parineeta Gedam - 05-08-2023
          Reason - Report page added */}
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
        {/* Added by - Ashish Dewangan on 15-06-2023
        Reason - Added route for menu form page */}
        <Route path="/MenuForm" element={<MenuForm />} />
        {/* End of code addition by - Ashish Dewangan on 15-06-2023
        Reason - Added route for menu form page */}
        {/*  */}
        <Route path="/Category" element={<Category />} />
        {/* Added by - Yuvraj Sahu on 17-06-2023
        Reason - Added route for category form page */}
        <Route path="/CategoryForm" element={<CategoryForm />} />
        {/* End of code addition by - Yuvraj Sahu on 17-06-2023
        Reason - Added route for menu form page */}
        <Route path="/Item" element={<Item />} />
        {/* Added by - Yuvraj Sahu on 01-07-2023
        Reason - Added route for edit item form page */}
        <Route path="/editItemForm" element={<EditItemForm />} />
        {/* End of code addition by - Yuvraj Sahu on 01-07-2023
        Reason - Added route for add item form page */}
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

        {/* Modification and addition by Om Shrivastava on 29-06-23
        Reason : When user has no token than after hit back button than need to show the same login page */}
        {/* <Route path="/Order" element={<Order />} /> */}
        <Route path="/Order" element={!tokenExist ? <Navigate to="/Login" /> : <Order />} />
        {/* End of addition and modification by Om Shrivastava on 29-06-23   Reason : When user has no token than after hit back button than need to show the same login page */} 
       
        {/* Modification and addition by Om Shrivastava on 30-06-23
        Reason : When user has no token than after hit back button than need to show the same login page */}
        {/* <Route path="/OrderItem" element={<OrderItem />} /> */}
        <Route path="/OrderItem" element={!tokenExist ? <Navigate to="/Login" /> : <OrderItem/>} />
        {/* End of addition and modification by Om Shrivastava on 30-06-23   Reason : When user has no token than after hit back button than need to show the same login page */} 

        <Route path="/PaymentMethod" element={<PaymentMethod />} />
        {/* end of addition by - Suman sahu On 26/05/2023 */}

        <Route path="/Revenue" element={!tokenExist ? <Navigate to="/Login" /> : <Revenue />} />

        {/* Added by Yuvraj Sahu on 29-05-2023
      	Reason - to define route of social media page */}
      	<Route path="/social-media" element={<SocialMediaList/>} />
      	{/* End of addition by Yuvraj Sahu on 29-05-2023 */}

        {/* Added by Yuvraj Sahu on 29-05-2023
      	Reason - to define route of add social media page */}
      	<Route path="/add-social-media" element={<SocialMediaForm/>} />
      	{/* End of addition by Yuvraj Sahu on 29-05-2023 */}

        {/* Added by Yuvraj Sahu on 07-06-2023
      	Reason - to define route of update social media page */}
      	<Route path="/update-social-media/:id" element={<SocialMediaForm/>} />
      	{/* End of addition by Yuvraj Sahu on 07-06-2023 */}

         {/* Added by Om shrivastava on 16-06-23
      	Reason - to define route of update order details*/}
        {/* Modification and addition by Om Shrivastava on 29-06-23
        Reason : When user has no token than after hit back button than need to show the same login page */}
      	{/* <Route path="/update-order/:id" element={<OrderForm/>} /> */}
      	<Route path="/update-order/:id" element={!tokenExist ? <Navigate to="/Login" /> : <OrderForm/>} />
        {/* End of addition and modification by Om Shrivastava on 29-06-23   Reason : When user has no token than after hit back button than need to show the same login page */} 
 
      	{/* End of addition by Om shrivastava on 16-06-23 */}
        
        {/* {/* Added by Om shrivastava on 30-06-23 Reason : Show the order item form page*} */}
      	<Route path="/update-order-item/:id" element={!tokenExist ? <Navigate to="/Login" /> : <OrderItemForm/>} />
      	{/* End of addition by Om shrivastava on 30-06-23 Reason : Show the order item form page */}
        
        {/* {/* Added by Om shrivastava on 24-07-23 Reason : Show the restaurant rating and review*} */}
        <Route path="/RatingReview" element={<RestaurantRatingReview />} />
      	{/* End of addition by Om shrivastava on 24-07-23 Reason : Show the restaurant rating and review */}

       <Route path="/Waiter" element={<Waiter/>} />
       
        {/* {/* Added by Pratap Sahu on 21-08-23 Reason : To Display Table Reservation Form & List *} */}
        <Route path="/ReservationForm" element={<ReservationForm/>}/>
        <Route path="/ReservationList" element={<ReservationList/>}/>
         {/* end of modification by -  Pratap Sahu on 21-08-23 */}

      </Routes>
      {/* <Footer /> */}
      </Header>
    </>
  );
}

export default App;

export { Message, AutoValidateToken,tokenRecheck,enableHeader,disableHeader }

