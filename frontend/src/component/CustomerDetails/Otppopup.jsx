// Created by Rohan Kansari- 26/4/23
// Reason- This page show when Customer place their order so, otp box show to confirm order

import React, { useContext, useEffect, useState } from 'react'
import style from "./otp.module.css"
import { IoIosArrowRoundBack } from "react-icons/io"
import { useLocation, useNavigate } from 'react-router-dom'
import { GlobalContext } from '../../context/Context'
import verificationImg from "../../images/verification.png"
import OTPInput, { ResendOTP } from "otp-input-react";
import { Spin } from 'antd';
import {firebase,auth} from '../../firebase'
import secureLocalStorage from 'react-secure-storage'
import { postCustomerDetails } from '../../api/Services'
import {
  RadiusUprightOutlined,
} from '@ant-design/icons';

import { notification } from 'antd'



const Otppopup = () => {
  const state = useLocation()
  console.log(state.state.contact_number)
  
  const [api, contextHolder] =notification.useNotification()
  const navigate = useNavigate()
  const { colors,setCart } = useContext(GlobalContext)
  const [OTP, setOTP] = useState("");
  const [isLoading, setLoading] = useState(false)
  
   useEffect(()=>{

   
    if(state.state.contact_number){
    configureCaptcha()
    onSignInSubmit()
    }

   },[state.state.contact_number])
  // Firebase Authentication method


   const configureCaptcha = () =>{
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          
          notify("Sending OTP, please wait.","success")
        },
        defaultCountry: "IN",
      
      });
    }
  
    
    const onSignInSubmit = () => {

      // Added by Rohan kansari - 6/5/23
      // Reason - To reset blank otp value on sending otp
      setOTP("")
      
      const phoneNumber = "+91" + state.state.contact_number
      firebase.auth().signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
          .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
            notify("OTP has been sent","success")
            // ...
          }).catch((error) => {
            // Error; SMS not sent
            // ...
            notify("Please retry ! Something went wrong","error")
          });
    }
  
  
    const onSubmitOTP = (e) =>{
      setLoading(true)
      e.preventDefault()
      const code = OTP
      console.log(code)

      // Modified by ROhankansari - 29/4/23
      // Reason - sending error if nothing is entered
      if(code.length>0){
      window.confirmationResult.confirm(code).then((result) => {
        // User signed in successfully.
        const user = result.user;
        console.log(JSON.stringify(user))
        
        notify("Proceeding Your order.","success")

        setTimeout(()=>{
          SubmitOrder()
        },1500)
       
        // ...
      }).catch((error) => {
       setLoading(false)
        //  Modification and added by Om Shrivastava on 19-05-23
        //  Reason : Need to change the OTP message
        // notify(" OTP dosen't match. Please try again","error")
        notify(" OTP is expired ","error")
        // End of addition by Om Shrivastava on 19-05-23
        // User couldn't sign in (bad verification code?)
        // ...
      });
    }
    // If enterted length is 0 then this notification message is shown
      else
      {
        setLoading(false)
        notify("Please enter OTP","error")
      }

      // End of code - Rohankansari - 29/4/23

    }



      function notify(msg,type) {

        if(type=="success")
        api.success({
          
        message: `${msg} `,
        RadiusUprightOutlined,
        duration:3,
        style:{
          // Modified by ROhan - 7/5/23
            // Reason- to centeralized message box
            top:"8vh",
            background:colors.subheadingBackgroundColor,
            color:colors.subHeadingColor,
            width: "max-content",
            right: "0px",
            left: "0px",
            position: "fixed",
            minHeight: "50px",
            margin:"auto",
            fontFamily:"Times New Roman"
            // End of code - 7/5/23
        },
          key: 1,
        
        })

        if (type=="error")
        api.error({
          
          message: `${msg} `,
          RadiusUprightOutlined,
          duration:3,
          style:{
            // Modified by ROhan - 7/5/23
            // Reason- to centeralized message box
              top:"8vh",
              background:colors.subheadingBackgroundColor,
              color:colors.subHeadingColor,
              width: "max-content",
              right: "0px",
              left: "0px",
              position: "fixed",
              minHeight: "50px",
              margin:"auto",
              fontFamily:"Times New Roman"
              // End of code - 7/5/23
          },
            key: 1,
          
          })

      }
    


    const SubmitOrder=async ()=>{
      var tenantName = localStorage.getItem("tenantName")
      const response = await postCustomerDetails(state.state, tenantName);
      if (response.msg) {
        secureLocalStorage.setItem("invoice_detail", response.data)
        //added by rohan- 18/4/23 - to set tenant validation
        secureLocalStorage.setItem("customer_details",state.state)
        secureLocalStorage.setItem("order", response.data.order_details)
        secureLocalStorage.setItem("orderItem", response.data.order_items)
  
        // Added by :- Parineeta Gedam
        // Date :- 14-04-2023
        // Reason :- remove cart data from local storage
  
        localStorage.removeItem('cart');
        setCart([])
        navigate("/invoice")
    }

  }

  // added by Rohan kansari- 3/5/23
  // Reason - to apply styles after all component rendered
  useEffect(()=>{
  document.querySelectorAll("input").forEach(Element=>{
    Element.style.fontSize="24px"
  })
  },[document.querySelectorAll("input")])

  return (
    <>
    <div id='sign-in-button'></div>
    {contextHolder}
    <div className={style.otpContainer} >
      <div className={style.header}>
        <IoIosArrowRoundBack
          className={style.backButton}
          style={{ color: colors.headingColor }}
          onClick={e => navigate(-1)} /></div>
      <div className={style.bgImgBox}>
        <img alt="" className={style.verificationImg} src={verificationImg} />
      </div>
      <div className={style.formContainer} style={{ background: colors.subheadingBackgroundColor }}>
        <div className={style.formTitle}>OTP Verification</div>
        {/* Modified by ROhan kansari - 4/5/23 
            Reason -changing message */}
        <div className={style.reasonText}>Enter OTP received on {state.state.contact_number}</div>

        <OTPInput value={OTP} onChange={setOTP} autoFocus OTPLength={6} otpType="number" disabled={false} secure className={style.inputBox} />

        <ResendOTP 
        // Added by Om Shrivastava on 18-05-23
        // Need to change the styling of the button 
        style={{justifyContent: 'center',flexDirection:'row-reverse',columnGap:'12px'}}
        // End of addition by Om Shrivastava on 18-05-23
         maxTime={30}  onResendClick={() => {onSignInSubmit()}} className={style.resendBtn} />

        {isLoading?<Spin className={style.spin}/>:<button className={style.submitBtn} style={{background:colors.bannerColor, color: colors.backgroundTheme}}  onClick={onSubmitOTP}>
               Verify
              </button>}
      </div>
    </div>
    </>
  )
}

export default Otppopup