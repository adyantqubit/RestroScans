import React, { useEffect, useRef } from 'react'
import style from "../style/registration.module.css"
import { FileUploader } from "react-drag-drop-files";
import image from "../../../../assets/registerbg.jpg"
import { registerRestaurant, ownerNameErrors, emailErrors, restaurantNameErrors, addressErrors, mobileErrors, passwordErrors, confirmPasswordErrors, imageSizeErrors, applyFieldErrors } from '../../services/authService';
import {AiOutlineEye,AiOutlineEyeInvisible} from "react-icons/ai"
import { useApp } from '../../../../Context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useRegistrationState } from "../../usestate/registrationState";
const fileTypes = ["JPG", "PNG", "SVG","GIF"];

{}
const Registration = () => {
    const { Message, disableHeader } = useApp();

    // Saving all error message in errors variable to
    var {
    errors,
    setError,
    paswrdEye,
    setPswdEyeVisible,
    cnfrmPaswrdEye,
    setCnfrmPswdEyeVisible,
    telephoneNumber,
    setTelephoneNumber,
    mobileNumber,
    setMobilePhone,
  } = useRegistrationState();

    const pswrdRef=useRef()
    const cnfrmpwsdRef=useRef()
    var nav=useNavigate()

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
    function validateOwner(text) {
        errors = applyFieldErrors(errors, "owner_error", ownerNameErrors(text))
        setError(errors)
    }

    function validateEmail(text) {
        errors = applyFieldErrors(errors, "Email", emailErrors(text))
        setError(errors)
    }

    function validateRestaurant(text) {
        errors = applyFieldErrors(errors, "Restaurant_name", restaurantNameErrors(text))
        setError(errors)
    }

    function validateAddress(text) {
        errors = applyFieldErrors(errors, "Address", addressErrors(text))
        setError(errors)
    }

    function validateMobile(text) {
        errors = applyFieldErrors(errors, "Mobile", mobileErrors(text))
        if (text.length <= 10) setMobilePhone(text)
        setError(errors)
    }

    function validateTelephone(text) {
      setTelephoneNumber(text)
    }

    function validatePassword(text) {
        errors = applyFieldErrors(errors, "password", passwordErrors(text))
        setError(errors)
    }

    function validateConfirmPassword(text) {
        errors = applyFieldErrors(errors, "confirm_password", confirmPasswordErrors(text, document.getElementById("Password").value))
        setError(errors)
    }

    function validateBg(text){
        setError(applyFieldErrors(errors, "bg", imageSizeErrors(text, "bg")))
    }

    function validateLogo(text){
        setError(applyFieldErrors(errors, "logo", imageSizeErrors(text, "logo")))
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
        await registerRestaurant(inputs).then(r =>{if(r.msg=="Registered Successfully"){
                       Message("Successfully Registered!","success")
                       nav("/Login")
        }else{
            Message(r.duplicate,"warning")
        }
    }).catch((err) => {
        Message(err.userMessage || "The account was not created.", "error");
      });
    }

{}
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
                                <input name='Telephone' type='number' id="Telephone" className={style.inputBox} value={telephoneNumber}  onChange={e => scheduleTimer(0, validateTelephone ,e.currentTarget.value.trimEnd().trimStart())} onBlur={e => validateTelephone(e.currentTarget.value.trimEnd().trimStart())} />
                                {errors.filter(e => Object.keys(e)[0] == "Telephone").length > 0 ? <span className={style.errorText}>{errors.filter(e => Object.keys(e)[0] == "Telephone")[0].Telephone}</span> : null}
                            </div>
                        </div>

                        <div className={style.inputContainer}>
                            <div className={style.halfInputContainer}>
                                <label className={style.label} htmlFor='Password'>Password *</label>
                                {pswrdRef?.current?.value.length>0 ?<div className={style.eyeContainer}>{paswrdEye?<AiOutlineEyeInvisible onClick={e=>setPswdEyeVisible(!paswrdEye)}/>:<AiOutlineEye onClick={e=>setPswdEyeVisible(!paswrdEye)}/>}</div>:null}
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
