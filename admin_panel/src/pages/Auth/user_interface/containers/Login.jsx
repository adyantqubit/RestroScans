import useRestaurantLoginBackground from "./useRestaurantLoginBackground";
import React, { useEffect, useRef } from 'react'
import style from "../style/login.module.css"
import image from "../../../../assets/registerbg.jpg"
import { loginRestaurant, loginEmailErrors, passwordErrors, applyFieldErrors } from '../../services/authService';
import { Alert, AlertIcon } from '@chakra-ui/react'
import { json, useNavigate } from "react-router-dom";
import { useApp } from '../../../../Context/AppContext';
import { homePath, storeFeatures } from '../../../../plans';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useLoginState } from "../../usestate/loginState";

{ }

const Login = () => {
    const loginBackgroundUrl = useRestaurantLoginBackground();
    const { Message, disableHeader, tokenRecheck } = useApp();

    // Saving all error message in errors variable to
    var {
        errors,
        setError,
        paswrdEye,
        setPswdEyeVisible,
        isSuccessfull,
        setSuccessfull,
    } = useLoginState();

    const pswrdRef = useRef()
    const nav = useNavigate()

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
        errors = applyFieldErrors(errors, "Email", loginEmailErrors(text))
        setError(errors)
    }

    function validatePassword(text) {
        errors = applyFieldErrors(errors, "password", passwordErrors(text))
        setError(errors)
    }

    async function Submit(e) {
        e.preventDefault();

        validateEmail(document.getElementById("Email").value)
        validatePassword(document.getElementById("Password").value)

        const data = new FormData(e.currentTarget);

        const inputs =
        {
            "email": data.get("Email").toLowerCase(),
            "password": data.get("Password"),
        }

        if (errors.length == 0)
            loginRestaurant(inputs).then(async (res) => {
                if (res.token) {
                    localStorage.removeItem("waiterData");
                    localStorage.removeItem("userData");
                    localStorage.removeItem("token");
                    localStorage.removeItem("tenantInfo");
                    localStorage.removeItem("qrCodeTenant");

                    localStorage.setItem("token", res.token);
                    localStorage.setItem("refresh_token", res.refreshToken)

                    localStorage.setItem(
                        "userData",
                        JSON.stringify(res.userData[0])
                    );
                    localStorage.setItem(
                        "tenantInfo",
                        JSON.stringify(res.tenantInfo)
                    );
                    storeFeatures(res.features);
                    Message("Successfully Logged In", "success")
                    tokenRecheck()

                    nav(homePath())
                }
                else if (res.notAproved) {
                    Message(res.notAproved, "warning")
                }
                else {
                    Message(res.invalid, "error")
                }
            }).catch((err) => {
                Message(err.userMessage || "Could not sign in. Check the email and password, then try again.", "error");
            });
    }

    { }
    return (
        <>

            <div className={style.registrationContainer} style={loginBackgroundUrl ? {backgroundImage: `linear-gradient(105deg, rgba(7,23,35,.65), rgba(9,48,54,.35)), url(${JSON.stringify(loginBackgroundUrl)})`} : undefined}>
                <div className={style.BackgroundImageContainer}>
                    <img className={style.RegisterImg} alt="" src={image} />
                </div>

                <div className={style.formContent}>
                    <form onSubmit={Submit} className={style.FormContainer}>
                        <div className={style.heading}>
                            Login
                        </div>
                        <div className={style.headingLabel}>Enter your details to login your restroscans account</div>

                        <div className={style.inputContainer}>

                            <div className={style.fullInputContainer}>
                                <label className={style.label} htmlFor='Name'>Email *</label>
                                <input name='Email' type='email' id="Email" className={style.inputBox} onChange={e => scheduleTimer(0, validateEmail, e.currentTarget.value)} onBlur={e => validateEmail(e.currentTarget.value)} />
                                {errors.filter(e => Object.keys(e)[0] == "Email").length > 0 ? <span className={style.errorText}>{errors.filter(e => Object.keys(e)[0] == "Email")[0].Email}</span> : null}
                            </div>
                        </div>

                        <div className={style.inputContainer}>
                            <div className={style.fullInputContainer}>
                                <label className={style.label} htmlFor='Password'>Password *</label>
                                {pswrdRef?.current?.value.length > 0 ? <div className={style.eyeContainer}>{paswrdEye ? <AiOutlineEyeInvisible onClick={e => setPswdEyeVisible(!paswrdEye)} /> : <AiOutlineEye onClick={e => setPswdEyeVisible(!paswrdEye)} />}</div> : null}
                                <input name='Password' type={paswrdEye ? 'password' : 'text'}
                                    onPaste={(e) => {
                                        e.preventDefault()
                                        return false;
                                    }} onCopy={(e) => {
                                        e.preventDefault()
                                        return false;
                                    }}
                                    ref={pswrdRef} id="Password" className={style.inputBox} onChange={e => scheduleTimer(0, validatePassword, e.currentTarget.value)} onBlur={e => validatePassword(e.currentTarget.value)} />

                                <label className={style.forgetText}
                                    style={{ justifyContent: errors.filter(e => Object.keys(e)[0] == "password").length > 0 ? "space-between" : "" }}>
                                    {errors.filter(e => Object.keys(e)[0] == "password").length > 0 ?
                                        <span className={style.errorText} >
                                            {errors.filter(e => Object.keys(e)[0] == "password")[0].password}
                                        </span>
                                        :
                                        null}
                                    <span className='forget_content' style={{ fontSize: "12px" }} onClick={e => nav("/Forget")}>
                                        Forgot Password?
                                    </span>
                                </label>
                            </div>
                        </div>

                        <button className={style.submitBtn} type='submit'>Login</button>

                        <div className={style.waiterloginText}>Login as waiter? <span className={style.highlightCreate} onClick={e => nav("/WaiterLogin")}>Login</span></div>

                    </form>
                </div>
            </div>
        </>
    )
}

export default Login
