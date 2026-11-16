import React, { useEffect, useRef } from 'react'
import { explainFailure } from '../../../../http/http_client'
import style from "../style/forget.module.css"
import image from "../../../../assets/registerbg.jpg"
import { sendPasswordOtp, updatePassword, emailErrors, otpErrors, resetPasswordErrors, resetConfirmErrors, applyFieldErrors } from '../../services/authService';
import { Alert, AlertIcon} from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import { useApp } from '../../../../Context/AppContext';
import {AiOutlineEye,AiOutlineEyeInvisible} from "react-icons/ai"
import { useForgetState } from "../../usestate/forgetState";

const Forget = () => {
    const { Message, disableHeader } = useApp();

    // Saving all error message in errors variable to
    var {
    errors,
    setError,
    email,
    setEmail,
    paswrdEye,
    setPswdEyeVisible,
    cnfrmPaswrdEye,
    setCnfrmPswdEyeVisible,
    isSuccessfull,
    setSuccessfull,
    isDisableForm,
    setDisableForm,
    isDisableBtn,
    setDisablebtn,
  } = useForgetState();

    const pswrdRef=useRef()
    const cnfrmpwsdRef=useRef()
    const nav= useNavigate()

    // Saving all timeout id to kill when new generated - it is mandotory to kill first then genrate new timeout
    const timerObj = useRef({ obj: 0 })

    useEffect(() => {
        disableHeader()
    }, [errors])

    function scheduleTimer(sec, func, value) {
        if (timerObj.current.obj)
            window.clearTimeout(timerObj.current.obj)

        timerObj.current.obj = setTimeout(() => {
            func(value)
        }, sec)
    }

    // Validation for owner name

    function validateEmail(text) {
        errors = applyFieldErrors(errors, "Email", emailErrors(text))
        setError(errors)
    }

    function validateOTP(text) {
        errors = applyFieldErrors(errors, "OTP", otpErrors(text))
        setError(errors)
    }

    function validatePassword(text) {
        errors = applyFieldErrors(errors, "password", resetPasswordErrors(text))
        setError(errors)
    }

    function validateConfirmPassword(text) {
        errors = applyFieldErrors(errors, "confirm_password", resetConfirmErrors(text, document.getElementById("Password").value))
        setError(errors)
    }

    async function Submit(e) {
        setDisablebtn(true)
        e.preventDefault();

        const data = new FormData(e.currentTarget);
        validateEmail(data.get("Email"))
        setEmail(data.get("Email"))
        var inputs={
            email:data.get("Email"),
          }

          if (errors.length==0)
         await sendPasswordOtp(inputs)
          .then( (res) => {
              if(res.msg){
                setDisablebtn(false)
                Message(res.msg,"success")
                setDisableForm(false)
              }
              else{
                setDisablebtn(false)
                Message(res.error,"error")
              }
          }).catch((err) => {
            setDisablebtn(false)
            Message(err.userMessage || "The reset request was not sent.", "error");
          });
          else
          setDisablebtn(false)
    }

    async function SubmitChange(e){
        e.preventDefault();

        validateOTP(document.getElementById("OTP").value)
        validatePassword(document.getElementById("Password").value)
        validateConfirmPassword(document.getElementById("Confirm").value)

        const data = new FormData(e.currentTarget);
        var inputs={
            email:email,
            otp:data.get("OTP"),
            password: data.get("Password"),
            confirm_password: data.get("Confirm"),
          }

          if(errors.length==0)
          updatePassword(inputs).then(async (res) => {
            if (res.msg) {
              Message("Successfully Reset your password","success")
            nav("/Login")
            } else {
                Message(explainFailure(res, "The password was not reset."), "warning")
            }
          });
        };

    return (
        <>

            {isSuccessfull?<Alert status='success' className={`${style.label} ${style.alert}`}  >
                <AlertIcon />
                Data uploaded to the server. Fire on!
            </Alert>:null}
            <div className={style.registrationContainer}>
                <div className={style.BackgroundImageContainer}>
                    <img className={style.RegisterImg} alt="" src={image} />
                </div>

                <div className={style.formContent}>
                    <form  onSubmit={Submit} className={style.FormContainer}>
                        <div className={style.heading}>
                            Forgot Password?
                        </div>
                        <div className={style.headingLabel}>Enter your details to login your restroscans account</div>

                        <div className={style.inputContainer}>

                            <div className={style.fullInputContainer}>
                                <label className={style.label} htmlFor='Name'>Email *</label>
                                <input name='Email' type='email' id="Email" className={style.inputBox} onChange={e => scheduleTimer(0, validateEmail, e.currentTarget.value)} onBlur={e => validateEmail(e.currentTarget.value)} disabled={isDisableBtn}/>
                                {errors.filter(e => Object.keys(e)[0] == "Email").length > 0 ? <span className={style.errorText}>{errors.filter(e => Object.keys(e)[0] == "Email")[0].Email}</span> : null}
                            </div>
                        </div>

                        <button className={style.submitBtn} type='submit' id="subitOtpBtn" style={isDisableBtn?{cursor:"not-allowed",opacity:".6"}:{}} disabled={isDisableBtn}>Send OTP</button>
                        </form>

                        <form onSubmit={SubmitChange} className={style.FormContainer} style={{marginTop:"0"}}>
                        <div className={isDisableForm?style.disable:null}>
                        <div className={style.inputContainer}>
                            <div className={style.fullInputContainer}>
                                <label className={style.label} htmlFor='Name'>Enter OTP</label>
                                <input name='OTP' type='text' id="OTP" className={style.inputBox} onChange={e => scheduleTimer(0, validateOTP, e.currentTarget.value)} onBlur={e => validateOTP(e.currentTarget.value)} />
                                {errors.filter(e => Object.keys(e)[0] == "OTP").length > 0 ? <span className={style.errorText}>{errors.filter(e => Object.keys(e)[0] == "OTP")[0].OTP}</span> : null}
                            </div>
                        </div>

                        <div className={style.inputContainer}>
                            <div className={style.fullInputContainer}>
                                <label className={style.label} htmlFor='Password'>Password *</label>
                                {pswrdRef?.current?.value.length>0 ?<div className={style.eyeContainer}>{paswrdEye?<AiOutlineEyeInvisible onClick={e=>setPswdEyeVisible(!paswrdEye)}/>:<AiOutlineEye onClick={e=>setPswdEyeVisible(!paswrdEye)}/>}</div>:null}
                                <input name='Password' type={paswrdEye?'password':'text'} ref={pswrdRef}
                                 onPaste={(e) => {
                                    e.preventDefault()
                                    return false;
                                }} onCopy={(e) => {
                                    e.preventDefault()
                                    return false;
                                }}
                                id="Password" className={style.inputBox} onChange={e => scheduleTimer(0, validatePassword, e.currentTarget.value)} onBlur={e => validatePassword(e.currentTarget.value)} />
                                {errors.filter(e => Object.keys(e)[0] == "password").length > 0 ? <span className={style.errorText}>{errors.filter(e => Object.keys(e)[0] == "password")[0].password}</span> : null}
                            </div>
                        </div>

                        <div className={style.inputContainer}>

                            <div className={style.fullInputContainer}>
                                <label className={style.label} htmlFor='confirm'>Confirm Password *</label>
                                {cnfrmpwsdRef?.current?.value.length>0 ?<div className={style.eyeContainer}>{cnfrmPaswrdEye?<AiOutlineEyeInvisible onClick={e=>setCnfrmPswdEyeVisible(!cnfrmPaswrdEye)}/>:<AiOutlineEye onClick={e=>setCnfrmPswdEyeVisible(!cnfrmPaswrdEye)}/>}</div>:null}
                                <input name='Confirm' type={cnfrmPaswrdEye?'password':'text'} ref={cnfrmpwsdRef}
                                 onPaste={(e) => {
                                    e.preventDefault()
                                    return false;
                                }} onCopy={(e) => {
                                    e.preventDefault()
                                    return false;
                                }}
                                id="Confirm" className={style.inputBox} onChange={e => scheduleTimer(0, validateConfirmPassword, e.currentTarget.value)} onBlur={e => validateConfirmPassword(e.currentTarget.value)}/>
                                {errors.filter(e => Object.keys(e)[0] == "confirm_password").length > 0 ? <span className={style.errorText}>{errors.filter(e => Object.keys(e)[0] == "confirm_password")[0].confirm_password}</span> : null}
                            </div>
                        </div>

                        <button className={style.submitBtn} type='submit'>Change Password</button>

                        </div>
                        <div className={style.registrationText}>Wanna try to login again? <span className={style.highlightCreate} onClick={e=>nav("/Login")}>Login</span></div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Forget
