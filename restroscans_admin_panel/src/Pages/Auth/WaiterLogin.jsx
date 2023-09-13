import React, { useEffect, useRef, useState } from 'react'
import style from "./login.module.css"
import image from "../../assets/registerbg.jpg"
import { restaurentAuthentication, waiterAuthentication } from '../../Api/services';
import { useNavigate } from "react-router-dom";
import { Message, disableHeader, tokenRecheck } from '../../App';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"



const WaiterLogin = () => {

    var [errorText, setError] = useState([])
    const [paswrdEye, setPswdEyeVisible] = useState(true)
    const pswrdRef = useRef()
    const nav = useNavigate()

    const [formData, setFormData] = useState({
        "contact_number": "",
        "password": "",
        "tenant": "",
    }
    )


    useEffect(() => {
        console.log("disable header")
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
                var response = await waiterAuthentication(tenant, formData)

                if (response.token) {

                    localStorage.clear();

                    localStorage.setItem("token", response.token);
                    localStorage.setItem("refresh_token", response.refresh_token)
                    // End of code -Rohan Kansari 26/5/23

                    localStorage.setItem(
                        "waiterData",
                        JSON.stringify(response.waiter)
                    );

                    localStorage.setItem(
                        "tenantInfo",
                        JSON.stringify(response.tenantInfo)
                    );

                    tokenRecheck()
                    nav("/waiterDashboard")

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

        if (field === "contact_number") {
            if (value.length == 0) {
                errorText["numberError"] = "Number should not be blank"
            }
            else if (value.length < 10) {
                errorText["numberError"] = "Number should not be less than 10 digits"
            }
            else if (value.length > 10) {
                errorText["numberError"] = "Number should not be more than 10 digits"
            }
            else {
                delete errorText["numberError"]
            }
        }

        if (field == "password") {
            if (value.length == 0)
                errorText["passwordError"] = "Password should not be blank"
            else if (value.length < 5)
                errorText["passwordError"] = "Password should not be less than 5 characters"
            else {
                delete errorText["passwordError"]
            }
        }

        if (field == "tenant") {
            if (value.length == 0)
                errorText["tenantError"] = "Tenant should not be blank"
            else {
                delete errorText["tenantError"]
            }
        }

        setError({ ...errorText })
    }


    return (
        <>



            <div className={style.registrationContainer} >
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