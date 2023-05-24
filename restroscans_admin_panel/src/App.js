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

  AutoValidateToken=async ()=>{
   if(JSON.parse(localStorage.getItem("refresh_token"))){
    const tokens={
      access:JSON.parse(localStorage.getItem("token")),
      refresh:JSON.parse(localStorage.getItem("refresh_token"))
    }
    await tokenValidationAPI(tokens).then(r=>{
      if(r){
        localStorage.setItem("token",JSON.stringify(r.access_token))
        localStorage.setItem("refresh_token",JSON.stringify(r.refresh_token))
      }
      else{
        localStorage.clear()
        window.location="/Login"
        Message("Unathenticate ! please login again")
      }
    })
   }
  }

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
      <Route path="/Billing" element={<Billing/>} />
      <Route path="/QRcode" element={<QRCode/>} />
    </Routes>
    <Footer/>
    {/* </Header> */}
    </>
  );
}

export default App;

export {Message,AutoValidateToken}

