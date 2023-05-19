// Added by:- Suman sahu On 05/04/2023
// Reason:- Create Home page for RestroScans

import React, { useRef } from "react";
import "./restroscans.css";
import { RestaurantRequestPostApi } from "../api/service";
import { message } from "antd";
import {
  faPhone,
  faEnvelope,
  faUser,
  faCutlery,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

function RestroScans() {
  // Added by:- Suman sahu On 13/04/2023
  // Reason:- created for nevigate one page to another page
  const navigate = useNavigate();
  // End of added code 13/04/2023

  // Added by:- Suman sahu On 13/04/2023
  // when click on submit button this function will be call
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    var owner = {
      restaurant_name: e.target.restaurant_name.value,
      owner_name: e.target.owner_name.value,
      email: e.target.email.value,
      mobile_number: e.target.mobile_number.value,
    };

    if (owner.owner_name === "") {
      document.getElementById("ownerName").innerText =
        "Please enter owner name";
      return false;
    } else {
      document.getElementById("ownerName").innerText = "";
    }

    // Added by- Suman sahu On 19/05/2023
    // Reason- for show length validation in owner name input field
    if (owner.owner_name.length > 20) {
      document.getElementById("ownerName").innerText =
        "Name should be below 20 characters";
      return false;
    } else {
      document.getElementById("ownerName").innerText = "";
    }
    // End of addition by Suman sahu On 19/05/2023

    if (owner.restaurant_name === "") {
      document.getElementById("restaurant_name").innerText =
        "Please enter restaurant name";
      return false;
    } else {
      document.getElementById("restaurant_name").innerText = "";
    }

    if (owner.email === "") {
      document.getElementById("email").innerText = "Please enter email";
      return false;
    } else {
      document.getElementById("email").innerText = "";
    }

    if (owner.mobile_number === "") {
      document.getElementById("mobile_number").innerText =
        "Please enter mobile number";
      return false;
    } else {
      document.getElementById("mobile_number").innerText = "";
    }
    // Added by- Suman sahu On 19/05/2023
    // Reason- for show length validation in mobile number input field
    if (owner.mobile_number.length > 10) {
      document.getElementById("mobile_number").innerText =
        "Pleace enter only 10 digits";
      return false;
    } else {
      document.getElementById("mobile_number").innerText = "";
    }
    // End of addition by Suman sahu On 19/05/2023

    const response = await RestaurantRequestPostApi(owner);
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
    } else {
      message.error({
        content: "Retry!!!",
        key: 1,
        style: {
          marginTop: "7vh",
        },
      });
    }
  };
  // End of added code 13/04/2023

  // Added by:- Suman sahu  Date:- 19/05/2023
  // Reason:- When click on cancel button, that fuction will be call
  const ResetForm = async () => {
    document.getElementById("form").reset();
    // added by- Suman sahu On 20/05/2023
    // reset error message after click cancle button
    var arr=document.getElementsByClassName("restroscans_error_msg");
    console.log(arr)
    for(var i=0;i<arr.length;i++){
      arr[i].innerHTML =""
    }
    // end of addition by- Suman sahu On 20/05/2023
  };
  // End of added code by- Suman sahu On 19/05/2023

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
      <div className="restroscans_container" id="restro">
        <form
          onSubmit={handleFormSubmit}
          id="form"
          className="getrestroscans_form"
        >
          <div className="restroscans_main_div">
            <h1 className="get_restroscans_heading">Get RestroScans</h1>
            <div className="inner_div">
              <div className="input_div">
                <FontAwesomeIcon icon={faUser} className="input_icons" />
                <input
                  className="input_box"
                  type="text"
                  name="owner_name"
                  placeholder="* Owner Name"
                />
                <p id="ownerName" className="restroscans_error_msg"></p>
              </div>

              <div className="input_div">
                <FontAwesomeIcon icon={faCutlery} className="input_icons" />
                <input
                  className="input_box"
                  type="text"
                  name="restaurant_name"
                  placeholder="* Restaurant Name"
                />
                <p id="restaurant_name" className="restroscans_error_msg"></p>
              </div>

              <div className="input_div">
                <FontAwesomeIcon icon={faEnvelope} className="input_icons" />
                <input
                  className="input_box"
                  type="email"
                  name="email"
                  placeholder="* Email"
                />
                <p id="email" className="restroscans_error_msg"></p>
              </div>

              <div className="input_div">
                <FontAwesomeIcon icon={faPhone} className="input_icons" />
                <input
                  className="input_box"
                  type="number"
                  onkeypress={(e) => validate(e)}
                  name="mobile_number"
                  placeholder="* Mobile Number"
                  maxLength={10}
                />
                <p id="mobile_number" className="restroscans_error_msg"></p>
              </div>
            </div>

            <div className="btn_div">
              <button className="submit_btn" type="submit">
                Submit
              </button>
              <button
                className="submit_btn"
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

export default RestroScans;
/* End of added code 05/04/2023 */
