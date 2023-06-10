/**
 * Created by Yuvraj Sahu on 29-05-2023
 * Reason - to save new social media data
 */

import React, { useEffect, useRef, useState } from "react";
import style from "./AddSocialMedia.module.css";
import { FileUploader } from "react-drag-drop-files";
import image from "../../assets/registerbg.jpg";
import { postRestaurantDetail, saveSocialMediaApi } from "../../Api/services";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Message } from "../../App";
import { useNavigate } from "react-router-dom";
import Header from "../GlobalComponent/Header";
const fileTypes = ["JPG", "PNG", "SVG", "GIF"];

const AddSocialMedia = () => {
  // Saving all error message in errors variable to
  var [errors, setError] = useState([]);
  const [paswrdEye, setPswdEyeVisible] = useState(true);
  const [cnfrmPaswrdEye, setCnfrmPswdEyeVisible] = useState(true);
  const pswrdRef = useRef();
  const cnfrmpwsdRef = useRef();
  var nav = useNavigate();

  // Saving all timeout id to kill when new generated - it is mandotory to kill first then genrate new timeout
  const timerObj = useRef({ obj: 0 });

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  function scheduleTimer(sec, func, value) {
    if (timerObj.current.obj) window.clearTimeout(timerObj.current.obj);

    timerObj.current.obj = setTimeout(() => {
      func(value);
    }, sec);
  }

  // Validation for owner name
  function validateOwner(text) {
    errors = errors.filter((e) => Object.keys(e) != "owner_error");
    setError(errors);
    if (text.length == 0)
      errors = [...errors, { owner_error: "This field should not be blank" }];
    if (text.match(/\d+/g))
      errors = [...errors, { owner_error: "Please enter only characters" }];
    setError(errors);
  }

  function validateEmail(text) {
    errors = errors.filter((e) => Object.keys(e) != "Email");
    setError(errors);
    if (text.length == 0)
      errors = [...errors, { Email: "This field should not be blank" }];
    if (
      text.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ) == null
    )
      errors = [
        ...errors,
        { Email: "This field should contain this format example@gmail.com" },
      ];
    setError(errors);
  }

  function validateSocialMediaName(text) {
    errors = errors.filter((e) => Object.keys(e) != "social_media_name");
    setError(errors);
    if (text.length == 0)
      errors = [
        ...errors,
        { social_media_name: "Social media name is required!" },
      ];
    setError(errors);
  }

  function validateSocialMediaLink(text) {
    errors = errors.filter((e) => Object.keys(e) != "social_media_link");
    setError(errors);
    if (text.length == 0)
      errors = [
        ...errors,
        { social_media_link: "Social media link is required!" },
      ];
    setError(errors);
  }

  function validateMobile(text) {
    errors = errors.filter((e) => Object.keys(e) != "Mobile");
    setError(errors);
    if (text.length == 0)
      errors = [...errors, { Mobile: "This field should not be blank" }];
    if (text.length < 10)
      errors = [
        ...errors,
        { Mobile: "This field should not be less than 10 digits" },
      ];
    if (text.length > 10)
      errors = [
        ...errors,
        { Mobile: "This field should not be more than 10 digits" },
      ];
    setError(errors);
  }

  function validateTelephone(text) {
    errors = errors.filter((e) => Object.keys(e) != "Telephone");
    setError(errors);
    if (text.length < 10 && text.length != 0)
      errors = [
        ...errors,
        { Telephone: "This field should not be less than 10 digits" },
      ];
    if (text.length > 10 && text.length != 0)
      errors = [
        ...errors,
        { Telephone: "This field should not be more than 10 digits" },
      ];
    setError(errors);
  }

  function validatePassword(text) {
    errors = errors.filter((e) => Object.keys(e) != "password");
    setError(errors);
    if (text.length == 0)
      errors = [...errors, { password: "This field should not be blank" }];
    if (text.length < 8 && text.length != 0)
      errors = [
        ...errors,
        { password: "This field should not be less than 8 characters" },
      ];
    setError(errors);
  }

  function validateConfirmPassword(text) {
    errors = errors.filter((e) => Object.keys(e) != "confirm_password");
    setError(errors);
    if (text.length == 0)
      errors = [
        ...errors,
        { confirm_password: "This field should not be blank" },
      ];
    if (text.length < 8 && text.length != 0)
      errors = [
        ...errors,
        { confirm_password: "This field should not be less than 8 characters" },
      ];
    if (document.getElementById("Password").value != text)
      errors = [
        ...errors,
        { confirm_password: "Confirm password should be same as password" },
      ];

    setError(errors);
  }

  function validateBg(text) {
    console.log(text);
    errors = errors.filter((e) => Object.keys(e) != "bg");
    setError(errors);
    if (text.size > 1024 * 200)
      setError([...errors, { bg: "Image should be less than 200KB" }]);
  }

  function validateLogo(text) {
    console.log(text);
    errors = errors.filter((e) => Object.keys(e) != "social_media_icon");
    setError(errors);
    // console.log(text)
    if (text.size > 1024 * 200)
      setError([
        ...errors,
        { social_media_icon: "Image should be less than 200KB" },
      ]);
  }

  async function Submit(e) {
    e.preventDefault();

    validateSocialMediaName(document.getElementById("social_media_name").value);
    validateSocialMediaLink(document.getElementById("social_media_link").value);
    // validateRestaurant(document.getElementById("Restaurant").value)
    // validateAddress(document.getElementById("Address").value)
    // validateMobile(document.getElementById("Mobile").value)
    // validateTelephone(document.getElementById("Telephone").value)
    // validatePassword(document.getElementById("Password").value)
    // validateConfirmPassword(document.getElementById("Confirm").value)

    const data = new FormData(e.currentTarget);
    // console.log(data.get("bg").name == "");
    // if (data.get("bg").name == "") {
    //   errors = errors.filter((e) => Object.keys(e) != "bg");
    //   errors = [...errors, { bg: "This filled must be filled" }];
    //   setError(errors);
    // }

    if (data.get("social_media_icon").social_media_icon == "") {
      errors = errors.filter((e) => Object.keys(e) != "social_media_icon");
      errors = [
        ...errors,
        { social_media_icon: "Social media icon is required!" },
      ];
      setError(errors);
    }

    const inputs = {
      social_media_name: data.get("social_media_name"),
      social_media_link: data.get("social_media_link"),
      // "restaurant_name": data.get('Restaurant'),
      // "address": data.get("Address"),
      // "tag_line": data.get("Tag"),
      // "mobile_number": data.get("Mobile"),
      // "telephone_number": data.get("Telephone"),
      // "password": data.get("Password"),
      // "Confirm": data.get("Confirm"),
      // "restaurant_background_img": data.get("bg"),
      social_media_icon: data.get("social_media_icon"),
    };

    console.log(inputs);
    if (errors.length == 0)
      var tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    await saveSocialMediaApi(inputs, tenant)
      .then((r) => {
        if (r.msg) {
          //    setSuccessfull(true);
          Message(r.msg, "success");
          //    nav("/Login")
          document.getElementById("social_media_name").value = ""
          document.getElementById("social_media_link").value = ""
        //   document.getElementById("social_media_icon").value = ""
        } else {
          // Message(r.duplicate,"warning")
          Message("Something went wrong! Please try again later.", "error");
        }
      })
      .catch((err) => {
        Message("Something went wrong! Please try again later.", "error");
      });
  }

  return (
    <Header>
      {/* <div className={style.registrationContainer}> */}
      {/* <div className={style.BackgroundImageContainer}>
                    <img className={style.RegisterImg} alt="" src={image} />
                </div> */}

      <div className={style.formContent}>
        <form onSubmit={Submit} className={style.FormContainer}>
          <div className={style.heading}>Add Social Media</div>
          {/* <div className={style.headingLabel}>Enter your details to create your restroscans account</div> */}

          {/* <div className={style.inputContainer}>
                            <div className={style.halfInputContainer}>
                                <label className={style.label} htmlFor='Name'>Social media Name *</label>
                                <input name='social_media_name' type='text' id="social_media_name" onChange={e => scheduleTimer(0, validateOwner, e.currentTarget.value)} onBlur={e => validateOwner(e.currentTarget.value)} className={style.inputBox} />
                                {errors.filter(e => Object.keys(e)[0] == "owner_error").length > 0 ? <span className={style.errorText}>{errors.filter(e => Object.keys(e)[0] == "owner_error")[0].owner_error}</span> : null}
                            </div>
                            <div className={style.halfInputContainer}>
                                <label className={style.label} htmlFor='Name'>Email *</label>
                                <input name='Email' type='email' id="Email" className={style.inputBox} onChange={e => scheduleTimer(0, validateEmail, e.currentTarget.value)} onBlur={e => validateEmail(e.currentTarget.value)} />
                                {errors.filter(e => Object.keys(e)[0] == "Email").length > 0 ? <span className={style.errorText}>{errors.filter(e => Object.keys(e)[0] == "Email")[0].Email}</span> : null}
                            </div>
                        </div> */}

          <div className={style.inputContainer}>
            <div className={style.fullInputContainer}>
              <label className={style.label} htmlFor="Name">
                Social media name *
              </label>
              <input
                name="social_media_name"
                type="text"
                id="social_media_name"
                className={style.inputBox}
                onChange={(e) =>
                  scheduleTimer(
                    0,
                    validateSocialMediaName,
                    e.currentTarget.value
                  )
                }
                onBlur={(e) => validateSocialMediaName(e.currentTarget.value)}
              />
              {errors.filter((e) => Object.keys(e)[0] == "social_media_name")
                .length > 0 ? (
                <span className={style.errorText}>
                  {
                    errors.filter(
                      (e) => Object.keys(e)[0] == "social_media_name"
                    )[0].social_media_name
                  }
                </span>
              ) : null}
            </div>
          </div>

          {/* <div className={style.inputContainer}>
                            <div className={style.fullInputContainer}>
                                <label className={style.label} htmlFor='Name'>Tag Line <label className={style.subLabel}>(Optional)</label> </label>
                                <input name='Tag' type='text' className={style.inputBox} />
                            </div>
                        </div> */}

          <div className={style.inputContainer}>
            <div className={style.fullInputContainer}>
              <label className={style.label} htmlFor="Name">
                Social media link *
              </label>
              <input
                name="social_media_link"
                type="text"
                id="social_media_link"
                className={style.inputBox}
                onChange={(e) =>
                  scheduleTimer(
                    0,
                    validateSocialMediaLink,
                    e.currentTarget.value
                  )
                }
                onBlur={(e) => validateSocialMediaLink(e.currentTarget.value)}
              />
              {errors.filter((e) => Object.keys(e)[0] == "social_media_link")
                .length > 0 ? (
                <span className={style.errorText}>
                  {
                    errors.filter(
                      (e) => Object.keys(e)[0] == "social_media_link"
                    )[0].social_media_link
                  }
                </span>
              ) : null}
            </div>
          </div>

          {/* <div className={style.inputContainer}>
                            <div className={style.halfInputContainer}>
                                <label className={style.label} htmlFor='Name' >Mobile Number *</label>
                                <input name='Mobile' type='number' id='Mobile' className={style.inputBox} onChange={e => scheduleTimer(0, validateMobile, e.currentTarget.value)} onBlur={e => validateMobile(e.currentTarget.value)} />
                                {errors.filter(e => Object.keys(e)[0] == "Mobile").length > 0 ? <span className={style.errorText}>{errors.filter(e => Object.keys(e)[0] == "Mobile")[0].Mobile}</span> : null}
                            </div>
                            <div className={style.halfInputContainer}>
                                <label className={style.label} htmlFor='Name'>Telephone Number <label className={style.subLabel}>(Optional)</label> </label>
                                <input name='Telephone' type='number' id="Telephone" className={style.inputBox} onChange={e => scheduleTimer(0, validateTelephone, e.currentTarget.value)} onBlur={e => validateTelephone(e.currentTarget.value)} />
                                {errors.filter(e => Object.keys(e)[0] == "Telephone").length > 0 ? <span className={style.errorText}>{errors.filter(e => Object.keys(e)[0] == "Telephone")[0].Telephone}</span> : null}
                            </div>
                        </div> */}

          {/* <div className={style.inputContainer}>
                            <div className={style.halfInputContainer}>
                                <label className={style.label} htmlFor='Password'>Password *</label>
                                {pswrdRef?.current?.value.length>0 ?<div className={style.eyeContainer}>{paswrdEye?<AiOutlineEyeInvisible onClick={e=>setPswdEyeVisible(!paswrdEye)}/>:<AiOutlineEye onClick={e=>setPswdEyeVisible(!paswrdEye)}/>}</div>:null}
                                <input name='Password' type={paswrdEye?'password':'text'} ref={pswrdRef} id="Password" className={style.inputBox} onChange={e => scheduleTimer(0, validatePassword, e.currentTarget.value)} onBlur={e => validatePassword(e.currentTarget.value)}/>
                                {errors.filter(e => Object.keys(e)[0] == "password").length > 0 ? <span className={style.errorText}>{errors.filter(e => Object.keys(e)[0] == "password")[0].password}</span> : null}

                            </div>
                            <div className={style.halfInputContainer}>
                                <label className={style.label} htmlFor='confirm'>Confirm Password *</label>
                                {cnfrmpwsdRef?.current?.value.length>0 ?<div className={style.eyeContainer}>{cnfrmPaswrdEye?<AiOutlineEyeInvisible onClick={e=>setCnfrmPswdEyeVisible(!cnfrmPaswrdEye)}/>:<AiOutlineEye onClick={e=>setCnfrmPswdEyeVisible(!cnfrmPaswrdEye)}/>}</div>:null}
                                <input name='Confirm' type={cnfrmPaswrdEye?'password':'text'} id="Confirm" ref={cnfrmpwsdRef} className={style.inputBox} onChange={e => scheduleTimer(0, validateConfirmPassword, e.currentTarget.value)} onBlur={e => validateConfirmPassword(e.currentTarget.value)} />
                                {errors.filter(e => Object.keys(e)[0] == "confirm_password").length > 0 ? <span className={style.errorText}>{errors.filter(e => Object.keys(e)[0] == "confirm_password")[0].confirm_password}</span> : null}
                            </div>
                        </div> */}

          {/* <div className={style.inputContainer}>
                            <div className={style.fullInputContainer}>
                                <label className={style.label} htmlFor='Name'>Background Image *</label>
                                <FileUploader name="bg" types={fileTypes} id="bg" style={{ width: "100%" }} handleChange={validateBg}  />
                                {errors.filter(e => Object.keys(e)[0] == "bg").length > 0 ? <span className={style.errorText}>{errors.filter(e => Object.keys(e)[0] == "bg")[0].bg}</span> : null}
                            </div>
                        </div> */}

          <div className={style.inputContainer}>
            <div className={style.fullInputContainer}>
              <label className={style.label} htmlFor="Name">
                Social media icon *
              </label>
              <FileUploader
                name="social_media_icon"
                types={fileTypes}
                id="social_media_icon"
                style={{ width: "100%" }}
                handleChange={validateLogo}
              />
              {errors.filter((e) => Object.keys(e)[0] == "social_media_icon")
                .length > 0 ? (
                <span className={style.errorText}>
                  {
                    errors.filter(
                      (e) => Object.keys(e)[0] == "social_media_icon"
                    )[0].social_media_icon
                  }
                </span>
              ) : null}
            </div>
          </div>

          <button className={style.submitBtn} type="submit">
            Save
          </button>

          {/* <div className={style.registrationText}>Already have an account ? <span className={style.highlightCreate} onClick={e=>nav("/Login")}> Login</span></div> */}
        </form>
      </div>
      {/* </div> */}
    </Header>
  );
};

export default AddSocialMedia;
