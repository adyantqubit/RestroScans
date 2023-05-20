import React, { useEffect, useRef, useState } from 'react'
import style from "./forget.module.css"
import image from "../../assets/registerbg.jpg"
import { postRestaurantDetail, restaurentAuthentication, sendOtpApi, updatePasswordApi } from '../../Api/services';
import { Alert, AlertIcon} from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import { Message } from '../../App';
import {AiOutlineEye,AiOutlineEyeInvisible} from "react-icons/ai"


// import NiceInputPassword from 'react-nice-input-password';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import PasswordField from 'password-field'


// Modified By Rohan Kansari - 29/5/23
// Reason - To change all validation message 
const Forget = () => {

    // Saving all error message in errors variable to 
    var [errors, setError] = useState([])
    const [email,setEmail]=useState("")
    const [paswrdEye,setPswdEyeVisible]=useState(true)
    const [cnfrmPaswrdEye,setCnfrmPswdEyeVisible]=useState(true)
    const pswrdRef=useRef()
    const cnfrmpwsdRef=useRef()
    const nav= useNavigate()

    const [isSuccessfull,setSuccessfull]=useState(false)
    const [isDisableForm,setDisableForm]=useState(true)
    const [isDisableBtn,setDisablebtn]=useState(false)

    // Saving all timeout id to kill when new generated - it is mandotory to kill first then genrate new timeout
    const timerObj = useRef({ obj: 0 })


    useEffect(() => {
        console.log(errors)
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
        errors = errors.filter(e => Object.keys(e) != "Email")
        setError(errors)
        if (text.length == 0)
            errors=[...errors, { "Email": "Please enter email" }]
        if (text.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) == null)
            errors=[...errors, { "Email": "Please enter email in this format example@gmail.com" }]
        setError(errors)    
    }
   
    function validateOTP(text) {
        errors = errors.filter(e => Object.keys(e) != "OTP")
        setError(errors)
        if (text.length == 0 )
            errors=[...errors, { "OTP": "Please enter OTP" }]
        if (text.length !=0 && text.length<4 )
        errors=[...errors, { "OTP": "OTP should not be less than 4 digits" }]    
        setError(errors)    
    }


    function validatePassword(text) {
        errors = errors.filter(e => Object.keys(e) != "password")
        setError(errors)
        if (text.length == 0)
            errors=[...errors, { "password": "Please enter password" }]
        if (text.length < 8 && text.length != 0)
            errors=[...errors, { "password": "Password should not be less than 8 characters" }]
        setError(errors)    

    }

    function validateConfirmPassword(text) {
        errors = errors.filter(e => Object.keys(e) != "confirm_password")
        setError(errors)
        if (text.length == 0)
            errors=[...errors, { "confirm_password": "Please Confirm Your Password" }]
        if (text.length < 8 && text.length != 0)
            errors=[...errors, { "confirm_password": "Confirm password should not be less than 8 characters" }]
        if(document.getElementById("Password").value != text)    
            errors=[...errors, { "confirm_password": "Password and Confirm Password should be same" }]

        setError(errors)
    }

    async function Submit(e) {
        setDisablebtn(true)
        e.preventDefault();
        
        // if(document.getElementById("Email").value)
        // validateEmail(document.getElementById("Email").value)
        // else
        // validateEmail("")
        // validatePassword(document.getElementById("Password").value)
    
        const data = new FormData(e.currentTarget);
        validateEmail(data.get("Email"))
        setEmail(data.get("Email"))
        var inputs={
            email:data.get("Email"),
          }

          if (errors.length==0)
         await sendOtpApi(inputs)
          .then( (res) => {
              if(res.msg){
                setDisablebtn(false)
                Message(res.msg,"success")
                setDisableForm(false)
              }
              else{
                setDisablebtn(false)
                // document.getElementById("subitOtpBtn").currentTarget.style.cursor="pointer"
                Message(res.error,"error")
              }
              console.log(res)
          }).catch((err) => {
            setDisablebtn(false)
            // document.getElementById("subitOtpBtn").currentTarget.style.cursor="pointer"
            Message("Something went wrong! Please try again later.","error");
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
          updatePasswordApi(inputs).then(async (res) => {
            console.log(res)
            if (res.msg) {
              Message("Successfully Reset your password","success")
            } else {
                Message("Something went wrong","warning")
            }
            if (res.error) {
                Message(res.error,"error")
            }
          });

          console.log(inputs)   
        };
          


    // End of code- Rohan KAnsari - 29/5/23 

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
                            Forget Password?
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

                       {/* Modified by Rohan Kansari - 29/5/23 
                           Reason - */}

                        {/*End of code - 29/5/23  */}
                        <div className={style.inputContainer}>
                             {/* Modified By Rohan Kansari - 29/5/23
                                Reason - Because requirement is to remove copy pasting from password field */}
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
                            {/* End of code - ROhan Kansari - 29/5/23 */}
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