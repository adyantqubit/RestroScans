import React, { useContext, useEffect, useState } from 'react'
import style from "../style/otp.module.css"
import { IoIosArrowRoundBack } from "react-icons/io"
import { useLocation, useNavigate } from 'react-router-dom'
import { GlobalContext } from '../../../../context/Context'
import verificationImg from "../../../../images/verification.png"
import OTPInput, { ResendOTP } from "otp-input-react";
import { Spin } from 'antd';
import secureLocalStorage from 'react-secure-storage'
import { postCustomerDetails } from '../../services/customerService';
import {
  RadiusUprightOutlined,
} from '@ant-design/icons';

import { notification } from 'antd'

import { useOtppopupState } from "../../usestate/otppopupState";
import { verifyOrderOtp } from '../../services/customerService';
import { confirmPhoneCode, phoneAuthMessage, sendPhoneCode } from '../../../../firebasePhone';

const Otppopup = () => {
  const state = useLocation()

  const [api, contextHolder] =notification.useNotification()
  const navigate = useNavigate()
  const { colors,setCart } = useContext(GlobalContext)
  var { OTP, setOTP, isLoading, setLoading } = useOtppopupState();

   useEffect(()=>{
    if(state.state && state.state.contact_number){
      onSignInSubmit()
    }
   },[state.state && state.state.contact_number])

    const onSignInSubmit = async () => {
      setOTP("")
      try {
        await sendPhoneCode(state.state.contact_number)
        notify("OTP has been sent","success")
      } catch (err) {
        notify(phoneAuthMessage(err),"error")
      }
    }

    const onSubmitOTP = async (e) =>{
      setLoading(true)
      if (e && e.preventDefault) e.preventDefault()
      const code = OTP
      if(code.length>0){
        try {
          const idToken = await confirmPhoneCode(code)
          const response = await verifyOrderOtp(state.state.contact_number, idToken)
          if (response && response.success && response.data && response.data.order_token) {
            localStorage.setItem("orderToken", response.data.order_token)
            notify("Proceeding Your order.","success")
            setTimeout(()=>{ SubmitOrder() }, 800)
            return
          }
          setLoading(false)
          notify((response && response.message) || " OTP is wrong. Please try again","error")
        } catch (err) {
          setLoading(false)
          notify(phoneAuthMessage(err),"error")
        }
      }
      else
      {
        setLoading(false)
        notify("Please enter OTP","error")
      }
    }

      function notify(msg,type) {
        if(type=="success")
        api.success({
        message: `${msg} `,
        RadiusUprightOutlined,
        duration:3,
        style:{
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
        },
          key: 1,
        })

        if (type=="error")
        api.error({
          message: `${msg} `,
          RadiusUprightOutlined,
          duration:3,
          style:{
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
          },
            key: 1,
          })
      }

    const SubmitOrder=async ()=>{
      var tenantName = localStorage.getItem("tenantName")
      const response = await postCustomerDetails(state.state, tenantName);
      if (response.msg) {
        secureLocalStorage.setItem("invoice_detail", response.data)
        secureLocalStorage.setItem("customer_details",state.state)
        secureLocalStorage.setItem("order", response.data.order_details)
        secureLocalStorage.setItem("orderItem", response.data.order_items)

        secureLocalStorage.setItem("setting_data", response.data.setting_data)

        localStorage.removeItem('cart');
        setCart([])
        navigate("/order")
    } else {
        setLoading(false)
        notify(response.tabel_error ? "Table number is not vacant, please try other"
          : (response.message || "We could not place your order. Please try again."), "error")
    }
  }

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
        <div className={style.reasonText}>Enter OTP received on {state.state.contact_number}</div>

         <div className={style.newDiv}>
        <OTPInput value={OTP} onChange={setOTP} autoFocus OTPLength={6} otpType="number" disabled={false} secure className={style.inputBox} />
        </div>
        <ResendOTP
        style={{justifyContent: 'center',flexDirection:'row-reverse',columnGap:'12px'}}
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
