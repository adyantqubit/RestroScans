import React, { useEffect, useRef, useState } from 'react'
import style from "./login.module.css"
import image from "../../assets/registerbg.jpg"
import { postRestaurantDetail, restaurentAuthentication } from '../../Api/services';
import { Alert, AlertIcon } from '@chakra-ui/react'
import { json, useNavigate } from "react-router-dom";
import { Message, tokenRecheck } from '../../App';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

// import NiceInputPassword from 'react-nice-input-password';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import PasswordField from 'password-field'

{/* Modified by Rohan Kansari - 29/5/23 
Reason - To change all validation messages*/}


const Login = () => {

    // Saving all error message in errors variable to 
    var [errors, setError] = useState([])
    const [paswrdEye, setPswdEyeVisible] = useState(true)
    const pswrdRef = useRef()
    const nav = useNavigate()

    const [isSuccessfull, setSuccessfull] = useState(false)

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
            errors = [...errors, { "Email": "Please enter email" }]
        if (text.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) == null)
            errors = [...errors, { "Email": "Please enter email in this format example@gmail.com" }]
        setError(errors)
    }






    function validatePassword(text) {
        errors = errors.filter(e => Object.keys(e) != "password")
        setError(errors)
        if (text.length == 0)
            errors = [...errors, { "password": "Please enter password" }]
        if (text.length < 8 && text.length != 0)
            errors = [...errors, { "password": "Password must be atleast 8 characters" }]
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
            restaurentAuthentication(inputs).then(async (res) => {
                if (res.token) {
                    localStorage.removeItem("userData");
                    localStorage.removeItem("token");
                    localStorage.removeItem("tenantInfo");
                    // End of addition
                    // Added by Om shrivastava on 16-4-2023
                    // Reason - to delete previous data datas from securestorage
                    localStorage.removeItem("qrCodeTenant");
                    // End of addition

                    // Removed by Roahn KAnsari - 26/5/23
                    // Reason - Becuase stringify is creating issue when value is undefined
                    localStorage.setItem("token", res.token);
                    localStorage.setItem("refresh_token", res.refreshToken)
                    // End of code -Rohan Kansari 26/5/23

                    localStorage.setItem(
                        "userData",
                        JSON.stringify(res.userData[0])
                    );
                    localStorage.setItem(
                        "tenantInfo",
                        JSON.stringify(res.tenantInfo)
                    );
                    Message("Successfully Logged In", "success")
                    // Added by Om Shrivastava on 03-06-23
                    // Reason : Need to fix the logout issue
                    tokenRecheck()
                    // End of addition by Om Shrivastava on 03-06-23
                    nav("/Dashboard")
                }
                else if(res.notAproved){
                    Message(res.notAproved, "warning")
                }
                else {
                    Message(res.invalid, "error")
                }
            }).catch((err) => {
                Message("Something went wrong! Please try again later.", "error");
            });

    }

{/*End of code -Rohan kansari- 29/5/23  */}
    return (
        <>



            <div className={style.registrationContainer}>
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
                                {/* Modified by Rohan Kansari - 29/5/23 
                                    Reason -To remove copy paste fromn password */}
                                <input name='Password' type={paswrdEye ? 'password' : 'text'}
                                    onPaste={(e) => {
                                        e.preventDefault()
                                        return false;
                                    }} onCopy={(e) => {
                                        e.preventDefault()
                                        return false;
                                    }} 
                                    ref={pswrdRef} id="Password" className={style.inputBox} onChange={e => scheduleTimer(0, validatePassword, e.currentTarget.value)} onBlur={e => validatePassword(e.currentTarget.value)} />
                                {/*End of code -Rohan Kansari 29/5/23  */}

                                {/* Added by Om Shrivastava on 03-06-23
                                Reason : Redesign the forgot password */}
                                {/* <div>
                                <div style={{textAlign:'right',color:'blue',whiteSpace: "nowrap",fontSize:'12px',padding:'0',margin:'0',cursor:'pointer'}} onClick={e => nav("/Forget")}>
                               Forgot password?
                                </div>
                                </div> */}
                                {/* End of addition by Om Shrivastava on 03-06-23 */}
                                <label className={style.forgetText}
                                    style={{ justifyContent: errors.filter(e => Object.keys(e)[0] == "password").length > 0 ? "space-between" : "" }}>
                                    {errors.filter(e => Object.keys(e)[0] == "password").length > 0 ?
                                        <span className={style.errorText} >
                                            {errors.filter(e => Object.keys(e)[0] == "password")[0].password}
                                        </span>
                                        :
                                        null}
                                        {/* Commented by Om Shrivastava on 03-06-23
                                        Reason :Redesign the Forgot password  */}
                                    {/* Add classname and remove some style properties by Om Shrivastava on 11-06-23 */}
                                    <span className='forget_content' style={{fontSize:"12px"}} onClick={e => nav("/Forget")}>
                                        {/* Modifcation and addition by Om Shrivastava on 12-06-23
                                        Reason : Fix the bug 139 : Need to change the spelling of Forget password */}
                                        {/* Forget Password? */}
                                        Forgot Password?
                                        {/* End of addition by Om Shrivastava on 12-06-23 */}
                                        </span>
                                {/* End of addition by Om Shrivastava on 03-06-23 */}
                                </label>
                                {/* {errors.filter(e => Object.keys(e)[0] == "password").length > 0 ? <span className={style.errorText}>{errors.filter(e => Object.keys(e)[0] == "password")[0].password}</span> : null} */}
                            </div>
                        </div>

                        <button className={style.submitBtn} type='submit'>Login</button>

                        <div className={style.registrationText}>Don't have an account ? <span className={style.highlightCreate} onClick={e => nav("/Registration")}> Create account</span></div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login