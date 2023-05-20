import './App.css';
import { Routes,Route } from 'react-router-dom';
import Registration from './Pages/Auth/Registration';
import Login from './Pages/Auth/Login';
import Forget from './Pages/Auth/ForgetPassword';
import style from "./app.module.css"
import { useState } from 'react';
import { Alert, AlertIcon } from '@chakra-ui/react'
import Dashboard from './Pages/Home/Dashboard';
import Header from './Pages/GlobalComponent/Header';
import Billing from './Pages/Billing/Billing';
import { tokenValidationAPI } from './Api/services';
import Footer from './Pages/GlobalComponent/Footer';
import QRCode from './Pages/Home/QRcode';
import Kot from './Pages/Kot/Kot';
import Report from './Pages/Report/Report';

var Message=0;
var AutoValidateToken=0
function App() {
  const [isSuccessfull,setSuccessfull]=useState(false)
  // set all message type in smaller character
  const [notificationType,setNotification]=useState("success")
  const [notificationText,setNotificationText]=useState("SuccessFully")

  
  Message= (text,type)=> {
    setNotificationText(text)
    setNotification(type)
    setSuccessfull(true)
    setTimeout(()=>{setSuccessfull(false)},5000)
  }

  // Modified by By - Rohan KAnsari - 26/5/23
  // Reason - throwing some undifned issue
  AutoValidateToken=async ()=>{
    console.log(typeof localStorage.getItem("refresh_token")=="string")
   if(localStorage.getItem("refresh_token")){
    const tokens={
      access:localStorage.getItem("token"),
      refresh:localStorage.getItem("refresh_token")
    }
    await tokenValidationAPI(tokens).then(r=>{
      if(r){
        localStorage.setItem("token",r.access_token)
        localStorage.setItem("refresh_token",r.refresh_token)
      }
      else{
        localStorage.clear()
        window.location="/Login"
        Message("Unathenticate ! please login again")
      }
    })
   }
  }
  // End of code - Rohan KAnsari - 26/5/23

  setInterval(AutoValidateToken,72000)

  return (
    <>
    {isSuccessfull?
    <Alert status={notificationType} className={`${style.label} ${style.alert}`} id="pot" >
      <AlertIcon />
      {notificationText}
    </Alert>:null}

    <Routes>
      <Route path='/Registration' element={<Registration/>} />
      <Route path="/Login" element={<Login/>} />
      <Route path="/Forget" element={<Forget/>}/>
    </Routes>
  {/* <Header> */}
    <Routes>
      {/* <Route path='/Registration' element={<Registration/>} />
      <Route path="/Login" element={<Login/>} />
      <Route path="/Forget" element={<Forget/>}/> */}
      <Route path="/Dashboard" element={<Dashboard/>} />
      <Route path="/Billing" element={ <Billing/>} />
      {/* Added by Rohan Kansari - 25/5/23
          Reason - Kot page added */}
      <Route path="/kot" element={<Kot/>}/>
      {/*End of code- Rohan Kansari - 25/5/23  */}
      {/* Added by Rohan Kansari - 26/5/23
          Reason - Report page added */}
      <Route path="/Report" element={<Report/>}/>
      {/*End of code- Rohan Kansari - 26/5/23  */}
    </Routes>
    <Footer/>
    {/* </Header> */}
    </>
  );
}

export default App;

export {Message,AutoValidateToken}

