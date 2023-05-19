// created by:- Suman sahu On 14/04/2023
// reason- create contactus page for restroscans website

import React, { useRef, useState } from "react";
import "./contactus.css";
import { ContactUsPostApi } from "../api/service";
import { message } from "antd";
import {
  faPhone,
  faEnvelope,
  faUser,
  faPen,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UKFlag from "../images/ukflag.png";
import USFlag from "../images/usflag.png";
import IndiaFlag from "../images/indiaflag.png";
import NewzelandFlag from "../images/new.png";
import { Link, useNavigate } from "react-router-dom";

function ContactUs() {
  const [number, setNumber] = useState(0);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    var user = {
      name: e.target.name.value,
      email: e.target.email.value,
      mobile_number: e.target.mobile_number.value,
      query: e.target.query.value,
    };

    if (user.name === "") {
      document.getElementById("errName").innerText = "Please enter your name";
      return false;
    } else {
      document.getElementById("errName").innerText = "";
    }

    // Added by- Suman sahu On 19/05/2023
    // Reason- for show length validation in name input field
    if (user.name.length > 20) {
      document.getElementById("errName").innerText =
        "Name should be below 20 characters";
      return false;
    } else {
      document.getElementById("errName").innerText = "";
    }
    // End of addition by Suman sahu On 19/05/2023

    if (user.email === "") {
      document.getElementById("errEmail").innerText = "Please enter your email";
      return false;
    } else {
      document.getElementById("errEmail").innerText = "";
    }

    if (user.mobile_number === "") {
      document.getElementById("errMobileNumber").innerText =
        "Please enter your mobile number";
      return false;
    } else {
      document.getElementById("errMobileNumber").innerText = "";
    }
    // Added by- Suman sahu On 19/05/2023
    // Reason- for show length validation in mobile number input field
    if (user.mobile_number.length > 10) {
      document.getElementById("errMobileNumber").innerText =
        "Pleace enter only 10 digits";
      return false;
    } else {
      document.getElementById("errMobileNumber").innerText = "";
    }
    // End of addition by Suman sahu On 19/05/2023

    if (user.query === "") {
      document.getElementById("errQuery").innerText = "Please enter your query";
      return false;
    } else {
      document.getElementById("errQuery").innerText = "";
    }

    const response = await ContactUsPostApi(user);
    if (response["success"]) {
      document.getElementById("form").reset();
      var succesNotification = response["success"];
      message.success({
        content: succesNotification,
        key: 1,
        style: {
          marginTop: "7vh",
        },
      });
    }
  };

  // Added by:- Suman sahu  Date:- 19/05/2023
  // Reason:- When click on cancel button, that fuction will be call
  const ResetForm = async () => {
    document.getElementById("form").reset();
    // added by- Suman sahu On 20/05/2023
    // reset error message after click cancle button
    var arr = document.getElementsByClassName("contactus_error_msg");
    console.log(arr);
    for (var i = 0; i < arr.length; i++) {
      arr[i].innerHTML = "";
    }
    // end of addition by- Suman sahu On 20/05/2023
  };
  // End of added code by- Suman sahu On 19/05/2023

  // Added by:- Suman sahu  Date:- 07/04/2023
  // Reason:- When click on logo of adyant, open site of Adyant in a new tab

  const openLinksInNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
  };
  // End of added code

  // Added by:- Suman sahu On 30/04/2023
  // Reason:- created for nevigate one page to another page
  const navigate = useNavigate();
  // End of added code 30/04/2023

  // Added by- Suman sahu On 19/05/2023
  // Reason- show validation when user type characters in mobile number input field
  function validate(evt) {
    evt = evt ? evt : window.event;
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  // End of addition by Suman sahu On 19/05/2023

  return (
    <>
      <div className="contactus_container">
        <div className="about_adyant">
          <div className="contactus_heading1">Contact Us</div>
          <p className="adyant_description_contactus">
            We know that our clients have unique needs and circumstances. Tell
            us more about your project, and we will get back to you soon with
            some ideas of how we can address those circumstances while creating
            the most stable software possible.
          </p>
          <p className="adyant_content1">Adyant SoftTech Pvt. Ltd.</p>
          <p className="adyant_content2">Raipur, Chhattisgarh, India</p>

          <div className="flags_container">
            <Link
              className="flags_div"
              onClick={() =>
                openLinksInNewTab("https://adyant.co.in/contact-us-india-1")
              }
            >
              <img src={IndiaFlag} className="india_flag_icon" />
              <p className="india_flag_label">INDIA</p>
            </Link>

            <Link
              className="flags_div"
              onClick={() =>
                openLinksInNewTab("https://adyant.co.in/contact-us-us-1")
              }
            >
              <img src={USFlag} className="us_flag_icon" />
              <p className="us_flag_label">US</p>
            </Link>

            <Link
              className="flags_div"
              onClick={() =>
                openLinksInNewTab("https://adyant.co.in/contact-us-uk")
              }
            >
              <img src={UKFlag} className="uk_flag_icon" />
              <p className="uk_flag_label">UK</p>
            </Link>

            <Link
              className="flags_div"
              onClick={() =>
                openLinksInNewTab(
                  "https://adyant.co.in/contact-us-new-zealand-1"
                )
              }
            >
              <img src={NewzelandFlag} className="newzeland_flag_icon" />
              <p className="newzeland_flag_label">NEW ZELAND</p>
            </Link>
          </div>

          <div className="adyant_info_div">
            <Link
              className="ady_link_div"
              onClick={() => openLinksInNewTab("https://adyant.co.in/")}
            >
              <FontAwesomeIcon
                icon="fa-solid fa-globe"
                className="ady_link_icon"
              />
              <label className="ady_link_label">adyant.co.in</label>
            </Link>

            <Link
              className="ady_link_div"
              onClick={() => openLinksInNewTab("mailto:adyant.co.in")}
            >
              <FontAwesomeIcon icon={faEnvelope} className="ady_link_icon" />
              <label className="ady_link_label">info@adyant.co.in</label>
            </Link>
          </div>
        </div>
        <form onSubmit={handleFormSubmit} id="form" className="contactus_form">
          <div className="contactus_main_div">
            <h1 className="contactus_heading">Contact Us</h1>
            <div className="contactus_inner_div">
              <div className="contactus_input_div">
                <FontAwesomeIcon
                  icon={faUser}
                  className="contactus_input_icons"
                />
                <input
                  class="contactus_input_box"
                  type="text"
                  name="name"
                  id="name"
                  placeholder="* Name"
                />
                <p id="errName" className="contactus_error_msg"></p>
              </div>

              <div className="contactus_input_div">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="contactus_input_icons"
                />
                <input
                  className="contactus_input_box"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="* Email"
                />
                <p id="errEmail" className="contactus_error_msg"></p>
              </div>

              <div className="contactus_input_div">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="contactus_input_icons"
                />
                <input
                  className="contactus_input_box"
                  type="number"
                  onkeypress={(e) => validate(e)}
                  name="mobile_number"
                  id="mobile_number"
                  // value={number}
                  placeholder="* Mobile Number"
                  maxLength={10}
                />
                <p id="errMobileNumber" className="contactus_error_msg"></p>
              </div>
            </div>

            <div className="contactus_input_div">
              <FontAwesomeIcon icon={faPen} className="contactus_query_icon" />
              <textarea
                className="query_input_box"
                type="text"
                name="query"
                id="query"
                placeholder="* Your queries"
              />
              <p id="errQuery" className="contactus_error_msg"></p>
            </div>

            <div className="contactus_btn_div">
              <button className="contactus_submit_btn" type="submit">
                Submit
              </button>
              <button
                className="contactus_submit_btn"
                type="button"
                // onClick={() => navigate(-1)}
                onClick={ResetForm}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default ContactUs;
/* End of created code by - Suman sahu 05/04/2023 */
