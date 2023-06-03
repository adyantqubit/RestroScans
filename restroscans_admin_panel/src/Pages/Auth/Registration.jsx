import React, { useEffect, useRef, useState } from 'react'
import style from "./registration.module.css"
import { FileUploader } from "react-drag-drop-files";
import image from "../../assets/registerbg.jpg"
import { postRestaurantDetail } from '../../Api/services';
// import NiceInputPassword from 'react-nice-input-password';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import PasswordField from 'password-field'
import {AiOutlineEye,AiOutlineEyeInvisible} from "react-icons/ai"
import { Message } from '../../App';
import { useNavigate } from 'react-router-dom';
const fileTypes = ["JPG", "PNG", "SVG","GIF"];


{/* Modified by Rohan Kansari - 29/5/23 
Reason - To correct all validation messages*/}  
const Registration = () => {

    // Saving all error message in errors variable to 
    var [errors, setError] = useState([])
    const [paswrdEye,setPswdEyeVisible]=useState(true)
    const [cnfrmPaswrdEye,setCnfrmPswdEyeVisible]=useState(true)
    const [telephoneNumber,setTelephoneNumber]=useState("")
    const [mobileNumber,setMobilePhone]=useState("")
    const pswrdRef=useRef()
    const cnfrmpwsdRef=useRef()
    var nav=useNavigate()

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
    function validateOwner(text) {
        errors = errors.filter(e => Object.keys(e) != "owner_error")
        setError(errors)
        if (text.length == 0)
            errors=[...errors, { "owner_error": "Please enter owner name" }]
        if (text.match(/\d+/g))
            errors=[...errors, { "owner_error": "Please enter only characters" }]
        setError(errors)
    }

    function validateEmail(text) {
        errors = errors.filter(e => Object.keys(e) != "Email")
        setError(errors)
        if (text.length == 0)
            errors=[...errors, { "Email": "Please enter email" }]
        if (text.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) == null)
            errors=[...errors, { "Email": "Please enter email in this format example@gmail.com" }]
        setError(errors)    
    }


    function validateRestaurant(text) {
        errors = errors.filter(e => Object.keys(e) != "Restaurant_name")
        setError(errors)
        if (text.length == 0)
            errors=[...errors, { "Restaurant_name": "Please enter restaurant name" }]
        setError(errors)    
    }

    function validateAddress(text) {
        errors = errors.filter(e => Object.keys(e) != "Address")
        setError(errors)
        if (text.length == 0)
            errors=[...errors, { "Address": "Please enter restaurant address" }]
        setError(errors)    
    }

    function validateMobile(text) {
        errors = errors.filter(e => Object.keys(e) != "Mobile")
        setError(errors)
        if (text.length == 0)
            errors=[...errors, { "Mobile": "Please enter mobile number" }]
        if (text.length < 10)
            errors=[...errors, { "Mobile": "Mobile number should not be less than 10 digits" }]
        if (text.length > 10)
        {

        } 
        else{
            setMobilePhone(text)
        }    
        setError(errors)    

    }

    function validateTelephone(text) {
        errors = errors.filter(e => Object.keys(e) != "Telephone")
        setError(errors)
        if (text.length < 11 && text.length != 0)
            errors=[...errors, { "Telephone": "Telephone number should not be less than 11 digits" }]
        if (text.length > 11 && text.length != 0)
        {

        }        
       else
        {
            setTelephoneNumber(text)
        }    
        setError(errors)    

    }

    function validatePassword(text) {
        errors = errors.filter(e => Object.keys(e) != "password")
        setError(errors)
        if (text.length == 0)
            errors=[...errors, { "password": "Please enter password" }]
        if (text.length < 8 && text.length != 0)
            errors=[...errors, { "password": "Password must be atleast 8 characters" }]
        setError(errors)    

    }

    function validateConfirmPassword(text) {
        errors = errors.filter(e => Object.keys(e) != "confirm_password")
        setError(errors)
        if (text.length == 0)
            errors=[...errors, { "confirm_password": "Please confirm your password" }]
        // Commented by Om Shrivastava on 03-06-23
        // Reason : According to requirements not need to show confirm password validation message    
        // if (text.length < 8 && text.length != 0)
        //     errors=[...errors, { "confirm_password": "Confirm Password must be atleast 8 characters" }]
        // End of addition by Om Shrivastava on 02-06-23
        if(document.getElementById("Password").value != text)    
            errors=[...errors, { "confirm_password": "Password and Confirm Password should be same" }]

        setError(errors)
    }

    function validateBg(text){
        console.log(text)
        errors = errors.filter(e => Object.keys(e) != "bg")
        setError(errors)
        if (text.size>1024*200)
            setError([...errors, { "bg": "Image should be less than 200KB" }])
       
    }

    function validateLogo(text){
        console.log(text)
        errors = errors.filter(e => Object.keys(e) != "logo")
        setError(errors)
        // console.log(text)
        if (text.size>1024*200)
            setError([...errors, { "logo": "Image should be less than 200KB" }])
        
    }

    async function Submit(e) {
        e.preventDefault();

        validateOwner(document.getElementById("Name").value.trimEnd().trimStart())
        validateEmail(document.getElementById("Email").value.trimEnd().trimStart())
        validateRestaurant(document.getElementById("Restaurant").value.trimEnd().trimStart())
        validateAddress(document.getElementById("Address").value.trimEnd().trimStart())
        validateMobile(document.getElementById("Mobile").value.trimEnd().trimStart())
        validateTelephone(document.getElementById("Telephone").value.trimEnd().trimStart())
        validatePassword(document.getElementById("Password").value.trimStart())
        validateConfirmPassword(document.getElementById("Confirm").value.trimStart())
        
        

        const data = new FormData(e.currentTarget);
        console.log(data.get("bg").name=='')
        if(data.get("bg").name==''){
        errors = errors.filter(e => Object.keys(e) != "bg")
        errors=[...errors, { "bg": "Please add background image" }]
        setError(errors)
        }   
        
        if(data.get("logo").name==''){
            errors = errors.filter(e => Object.keys(e) != "logo")
            errors=[...errors, { "logo": "Please add logo" }]
            setError(errors)
        } 

        const inputs =
        {
            "owner_name": data.get("Name").trimEnd().trimStart(),
            "email": data.get("Email").trimEnd().trimStart().toLowerCase(),
            "restaurant_name": data.get('Restaurant').trimEnd().trimStart(),
            "address": data.get("Address").trimEnd().trimStart(),
            "tag_line": data.get("Tag").trimEnd().trimStart(),
            "mobile_number": data.get("Mobile").trimEnd().trimStart(),
            "telephone_number": data.get("Telephone").trimEnd().trimStart(),
            "password": data.get("Password").trimStart(),
            "Confirm": data.get("Confirm").trimStart(),
            "restaurant_background_img": data.get("bg"),
            "restaurant_logo": data.get("logo")
        }

        if(errors.length==0)
        await postRestaurantDetail(inputs).then(r =>{if(r.msg=="Registered Successfully"){
                    //    setSuccessfull(true);
                       Message("Successfully Registered!","success")
                       nav("/Login")
                     
        }else{
            Message(r.duplicate,"warning")
        }
    }).catch((err) => {
        Message("Something went wrong! Please try again later.","error");
      });

    }

{/*End of code -Rohan Kansari 29/5/23  */}
    return (
        <>
            <div className={style.registrationContainer}>
                <div className={style.BackgroundImageContainer}>
                    <img className={style.RegisterImg} alt="" src={image} />
                </div>

                <div className={style.formContent}>
                    <form onSubmit={Submit} className={style.FormContainer}>
                        <div className={style.heading}>
                            Sign Up
                        </div>
                        <div className={style.headingLabel}>Enter your details to create your restroscans account</div>

                        <div className={style.inputContainer}>
                            <div className={style.halfInputContainer}>
                                <label className={style.label} htmlFor='Name'>Owner Name *</label>
                                <input name='Name' type='text' id="Name" onChange={e => scheduleTimer(0, validateOwner, e.currentTarget.value.trimEnd().trimStart())} onBlur={e => validateOwner(e.currentTarget.value.trimEnd().trimStart())} className={style.inputBox} />
                                {errors.filter(e => Object.keys(e)[0] == "owner_error").length > 0 ? <span className={style.errorText}>{errors.filter(e => Object.keys(e)[0] == "owner_error")[0].owner_error}</span> : null}
                            </div>
                            <div className={style.halfInputContainer}>
                                <label className={style.label} htmlFor='Name'>Email *</label>
                                <input name='Email' type='email' id="Email" className={style.inputBox} onChange={e => scheduleTimer(0, validateEmail, e.currentTarget.value.trimEnd().trimStart())} onBlur={e => validateEmail(e.currentTarget.value.trimEnd().trimStart())} />
                                {errors.filter(e => Object.keys(e)[0] == "Email").length > 0 ? <span className={style.errorText}>{errors.filter(e => Object.keys(e)[0] == "Email")[0].Email}</span> : null}
                            </div>
                        </div>

                        <div className={style.inputContainer}>
                            <div className={style.fullInputContainer}>
                                <label className={style.label} htmlFor='Name'>Restaurant Name *</label>
                                <input name='Restaurant' type='text' id='Restaurant' className={style.inputBox} onChange={e => scheduleTimer(0, validateRestaurant, e.currentTarget.value.trimEnd().trimStart())} onBlur={e => validateRestaurant(e.currentTarget.value.trimEnd().trimStart())} />
                                {errors.filter(e => Object.keys(e)[0] == "Restaurant_name").length > 0 ? <span className={style.errorText}>{errors.filter(e => Object.keys(e)[0] == "Restaurant_name")[0].Restaurant_name}</span> : null}
                            </div>
                        </div>

                        <div className={style.inputContainer}>
                            <div className={style.fullInputContainer}>
                                <label className={style.label} htmlFor='Name'>Tag Line <label className={style.subLabel}>(Optional)</label> </label>
                                <input name='Tag' type='text' className={style.inputBox} />
                            </div>
                        </div>

                        <div className={style.inputContainer}>
                            <div className={style.fullInputContainer}>
                                <label className={style.label} htmlFor='Name'>Restaurant Address *</label>
                                <input name='Address' type='text' id="Address" className={style.inputBox} onChange={e => scheduleTimer(0, validateAddress, e.currentTarget.value.trimEnd().trimStart())} onBlur={e => validateAddress(e.currentTarget.value.trimEnd().trimStart())} />
                                {errors.filter(e => Object.keys(e)[0] == "Address").length > 0 ? <span className={style.errorText}>{errors.filter(e => Object.keys(e)[0] == "Address")[0].Address}</span> : null}

                            </div>
                        </div>

                        <div className={style.inputContainer}>
                            <div className={style.halfInputContainer}>
                                <label className={style.label} htmlFor='Name' >Mobile Number *</label>
                                <input name='Mobile' type='number' id='Mobile' value={mobileNumber} className={style.inputBox} onChange={e => scheduleTimer(0, validateMobile, e.currentTarget.value.trimEnd().trimStart())} onBlur={e => validateMobile(e.currentTarget.value.trimEnd().trimStart())} />
                                {errors.filter(e => Object.keys(e)[0] == "Mobile").length > 0 ? <span className={style.errorText}>{errors.filter(e => Object.keys(e)[0] == "Mobile")[0].Mobile}</span> : null}
                            </div>
                            <div className={style.halfInputContainer}>
                                <label className={style.label} htmlFor='Name'>Telephone Number <label className={style.subLabel}>(Optional)</label> </label>
                                <input name='Telephone' type='number' id="Telephone" className={style.inputBox} value={telephoneNumber}  onChange={e => scheduleTimer(0, validateTelephone, e.currentTarget.value.trimEnd().trimStart())} onBlur={e => validateTelephone(e.currentTarget.value.trimEnd().trimStart())} />
                                {errors.filter(e => Object.keys(e)[0] == "Telephone").length > 0 ? <span className={style.errorText}>{errors.filter(e => Object.keys(e)[0] == "Telephone")[0].Telephone}</span> : null}
                            </div>
                        </div>

                        <div className={style.inputContainer}>
                            <div className={style.halfInputContainer}>
                                <label className={style.label} htmlFor='Password'>Password *</label>
                                {pswrdRef?.current?.value.length>0 ?<div className={style.eyeContainer}>{paswrdEye?<AiOutlineEyeInvisible onClick={e=>setPswdEyeVisible(!paswrdEye)}/>:<AiOutlineEye onClick={e=>setPswdEyeVisible(!paswrdEye)}/>}</div>:null}
                                {/* Modified by Rohan Kansari - 29/5/23 
                                    Reason - To disable copy paste */}
                                <input name='Password' type={paswrdEye?'password':'text'} 
                                 onPaste={(e) => {
                                    e.preventDefault()
                                    return false;
                                }} onCopy={(e) => {
                                    e.preventDefault()
                                    return false;
                                }} 
                                ref={pswrdRef} id="Password" className={style.inputBox} onChange={e => scheduleTimer(0, validatePassword, e.currentTarget.value.trimEnd().trimStart())} onBlur={e => validatePassword(e.currentTarget.value.trimEnd().trimStart())}/>
                                {errors.filter(e => Object.keys(e)[0] == "password").length > 0 ? <span className={style.errorText}>{errors.filter(e => Object.keys(e)[0] == "password")[0].password}</span> : null}

                            </div>
                            <div className={style.halfInputContainer}>
                                <label className={style.label} htmlFor='confirm'>Confirm Password *</label>
                                {cnfrmpwsdRef?.current?.value.length>0 ?<div className={style.eyeContainer}>{cnfrmPaswrdEye?<AiOutlineEyeInvisible onClick={e=>setCnfrmPswdEyeVisible(!cnfrmPaswrdEye)}/>:<AiOutlineEye onClick={e=>setCnfrmPswdEyeVisible(!cnfrmPaswrdEye)}/>}</div>:null}
                                <input name='Confirm' type={cnfrmPaswrdEye?'password':'text'} id="Confirm" 
                                 onPaste={(e) => {
                                    e.preventDefault()
                                    return false;
                                }} onCopy={(e) => {
                                    e.preventDefault()
                                    return false;
                                }} 
                                ref={cnfrmpwsdRef} className={style.inputBox} onChange={e => scheduleTimer(0, validateConfirmPassword, e.currentTarget.value.trimEnd().trimStart())} onBlur={e => validateConfirmPassword(e.currentTarget.value.trimEnd().trimStart())} />
                                {/*End of code -Rohan Kansari 29/5/23  */}
                                {errors.filter(e => Object.keys(e)[0] == "confirm_password").length > 0 ? <span className={style.errorText}>{errors.filter(e => Object.keys(e)[0] == "confirm_password")[0].confirm_password}</span> : null}
                            </div>
                        </div>

                        <div className={style.inputContainer}>
                            <div className={style.fullInputContainer}>
                                <label className={style.label} htmlFor='Name'>Background Image *</label>
                                <FileUploader name="bg" types={fileTypes} id="bg" style={{ width: "100%" }} handleChange={validateBg}  />
                                {errors.filter(e => Object.keys(e)[0] == "bg").length > 0 ? <span className={style.errorText}>{errors.filter(e => Object.keys(e)[0] == "bg")[0].bg}</span> : null}
                            </div>
                        </div>

                        <div className={style.inputContainer}>
                            <div className={style.fullInputContainer}>
                                <label className={style.label} htmlFor='Name'>Logo Image *</label>
                                <FileUploader name="logo" types={fileTypes} id="logo" style={{ width: "100%" }} handleChange={validateLogo}   />
                                {errors.filter(e => Object.keys(e)[0] == "logo").length > 0 ? <span className={style.errorText}>{errors.filter(e => Object.keys(e)[0] == "logo")[0].logo}</span> : null}
                            </div>
                        </div>

                        <button className={style.submitBtn} type='submit'>Sign Up</button>

                        <div className={style.registrationText}>Already have an account ? <span className={style.highlightCreate} onClick={e=>nav("/Login")}> Login</span></div>

                    </form>
                </div>
            </div>
        </>
    )
}

export default Registration