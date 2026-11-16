import useRestaurantLoginBackground from "./useRestaurantLoginBackground";
import React, { useEffect, useRef } from 'react'
import style from "../style/login.module.css"
import image from "../../../../assets/registerbg.jpg"
import { loginRestaurant, loginWaiter, waiterLoginField } from '../../services/authService';
import { useNavigate } from "react-router-dom";
import { useApp } from '../../../../Context/AppContext';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useWaiterLoginState } from "../../usestate/waiterLoginState";
import { storeFeatures } from "../../../../plans";

const WaiterLogin = () => {

    const { Message, disableHeader, tokenRecheck } = useApp();

    var {
        errorText,
        setError,
        paswrdEye,
        setPswdEyeVisible,
        formData,
        setFormData,
    } = useWaiterLoginState();
    const loginBackgroundUrl = useRestaurantLoginBackground(formData.tenant);

    const pswrdRef = useRef()
    const nav = useNavigate()

    useEffect(() => {
        disableHeader()
    }, [errorText])

    async function Submit(e) {
        e.preventDefault();

        validate("contact_number", formData.contact_number)
        validate("password", formData.password)
        validate("tenant", formData.tenant)

        const tenant = formData.tenant;

        if (Object.keys(errorText).length == 0)
            try {
                var response = await loginWaiter(tenant, formData)

                if (response.token) {
                    localStorage.clear();

                    localStorage.setItem("token", response.token);
                    localStorage.setItem("refresh_token", response.refresh_token)

                    localStorage.setItem(
                        "waiterData",
                        JSON.stringify(response.waiter)
                    );

                    localStorage.setItem(
                        "tenantInfo",
                        JSON.stringify(response.tenantInfo)
                    );
                    storeFeatures(response.features);

                    tokenRecheck()
                    nav("/Workforce")
                }
                else if (response.error) {
                    Message(response.error, "error")
                }
            }
            catch (e) {
                Message("Please enter valid tenant name", "error")
            }
    }

    function validate(field, value) {
        waiterLoginField(errorText, field, value)
        setError({ ...errorText })
    }

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
                                <label className={style.label} htmlFor='Name'>Tenant Name *</label>
                                <input type='text' className={style.inputBox}
                                    onChange={e => { formData.tenant = e.target.value; setFormData({ ...formData }); validate("tenant", e.target.value) }}
                                    onBlur={e => validate("tenant", e.target.value)} />
                                {errorText.tenantError ? <span className={style.errorText}
                                    style={{ width: "100%" }}>{errorText.tenantError}</span> : null}
                            </div>
                        </div>

                        <div className={style.inputContainer}>
                            <div className={style.fullInputContainer}>
                                <label className={style.label} htmlFor='Name'>Mobile Number *</label>
                                <input type='number' className={style.inputBox}
                                    onChange={e => { formData.contact_number = e.target.value; setFormData({ ...formData }); validate("contact_number", e.target.value) }}
                                    onBlur={e => validate("contact_number", e.target.value)} />
                                {errorText.numberError ? <span className={style.errorText}
                                    style={{ width: "100%" }}>{errorText.numberError}</span> : null}
                            </div>
                        </div>

                        <div className={style.inputContainer}>
                            <div className={style.fullInputContainer}>
                                <label className={style.label} htmlFor='Password'>Password *</label>
                                {pswrdRef?.current?.value.length > 0 ? <div className={style.eyeContainer}>{paswrdEye ? <AiOutlineEyeInvisible onClick={e => setPswdEyeVisible(!paswrdEye)} /> : <AiOutlineEye onClick={e => setPswdEyeVisible(!paswrdEye)} />}</div> : null}

                                <input type={paswrdEye ? 'password' : 'text'}
                                    onPaste={(e) => {
                                        e.preventDefault()
                                        return false;
                                    }}
                                    onCopy={(e) => {
                                        e.preventDefault()
                                        return false;
                                    }}
                                    ref={pswrdRef}
                                    autoComplete='new-password'
                                    className={style.inputBox}
                                    onChange={e => { formData.password = e.target.value; setFormData({ ...formData }); validate("password", e.target.value) }}
                                    onBlur={e => validate("password", e.target.value)} />
                                {errorText.passwordError ?
                                    <span className={style.errorText}
                                        style={{ width: "100%" }}>{errorText.passwordError ? errorText.passwordError : null}</span> : null}
                            </div>
                        </div>

                        <button className={style.submitBtn} type='submit'>Login</button>

                        <div className={style.waiterloginText}>Login as Admin? <span className={style.highlightCreate} onClick={e => nav("/Login")}>Login</span></div>

                    </form>
                </div>
            </div>
        </>
    )
}

export default WaiterLogin
