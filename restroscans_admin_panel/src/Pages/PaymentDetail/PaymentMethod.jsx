import { useEffect, useState } from "react";
import style from "./paymentmethod.module.css";
import Header from "../GlobalComponent/Header";
import { enableHeader } from "../../App";
import {
  getMenuDetails,
  savePaymentMethodApi,
  getPaymentMethodApi,
} from "../../Api/services";
import { Message } from "../../App";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../Api/config";

const PaymentMethod = () => {
  // Commented by :- Parineeta Gedam on 12-07-2023
  // Added By Rohan Kansari - 25/6/23
  // Reason - To enable headerSiderbar
  // enableHeader()
  // End of code - Rohan kansari - 25/6/23
  // End of Commented by :- Parineeta Gedam on 12-07-2023

  const navigate = useNavigate();
  const location = useLocation();
  const [paymentData, setPaymentData] = useState({});
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [name, setName] = useState(null);
  const [contactNumber, setContactNumber] = useState(null);
  const [icon, setIcon] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  /**
   * Added by - Parineeta Gedam  on 13-07-2023
   * Reason - To handle validation differently
   */
  const [nameError, setNameError] = useState("");
  const [contactNumberError, setContactNumberError] = useState("");
  const [iconError, setIconError] = useState("");
  const [iconSizeError, setIconSizeError] = useState("");
  /**
   * End of code addition by - Ashish dewangan on 17-06-2023
   * Reason - To handle validation differently
   */

  /**
   * Added by - Parineeta Gedam  on 13-07-2023
   * Reason - method that will execute when page loads and then call api
   */

  useEffect(() => {
    getPaymentData();
  }, []);

  /**
   * End of code addition by - Parineeta Gedam on 13-07-2023
   * Reason - method that will execute when page loads and then call api
   */

  /**
   * Added by - Parineeta Gedam on 13-07-2023
   * Reason - created api that will get payment data
   */
  const getPaymentData = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await getPaymentMethodApi(tenant, paymentMethodId);
    if (response.length > 0) {
      // modified by :- Parineeta Gedam on 15-07-2023
      setPaymentData(response[0]);
      // End of modified code by :- Parineeta Gedam on 15-07-2023
      setPaymentMethodId(response[0].id);
      setName(response[0].name);
      setContactNumber(response[0].contact_number);
      setIcon(response[0].scanner);
    }
  };

  /**
   * End of code addition by - Parineeta Gedam on 13-07-2023
   * Reason - created api that will get payment data
   */

  /**
   * Added by - Parineeta Gedam on 13-07-2023
   * Reason - method to validate inputs when user is entering some data
   */
  const validateOnInput = (inputName, value) => {
    if (inputName == "name") {
      if (value != null || value != undefined || value.trim() != "") {
        setNameError("");
      }
    }
    if (inputName == "contact_number") {
      // if (value != null || value != undefined || value.trim() != "") {
      //   setContactNumberError("");
      // }
      if (value.length == 0)
        setContactNumberError("Please enter contact number");
      if (value.length < 10)
        setContactNumberError(
          "Contact number should not be less than 10 digits"
        );
      if (value.length > 10)
        setContactNumberError(
          "Contact number should not be greater than 10 digits"
        );
      if (value.length == 10) setContactNumberError("");
      // if (value.length > 10) {
      // } else {
      //   setContactNumberError(value);
      // }
    }
  };
  /**
   * End of code addition by - Parineeta Gedam on 13-07-2023
   * Reason -  method to validate input when user is entering some data
   */

  /**
   * Added by - Parineeta Gedam on 13-07-2023
   * Reason - method to validate image when user is entering some data
   */
  const validateOnFileInput = (inputName, value) => {
    if (inputName == "icon") {
      setIconError("")
      if (value != null && value != undefined) {
        if (value.size / 1024 > 200) {
          setIconSizeError("File size must be below 200 KB");
        } else {
          setIconSizeError("");
        }
      } else {
        setIconSizeError("");
      }
    }
  };
  /**
   * End of code addition by - Parineeta Gedam on 13-07-2023
   * Reason -  method to validate images when user is entering some data
   */

  /**
   * Added by - Parineeta Gedam on 13-07-2023
   * Reason - created api to save payment data. After saving the payment data redirect to dashboard.
   */
  const postPaymentData = async () => {
    var allowDataPost = false;
    if (icon == null || icon == undefined) {
      if (selectedImage == null || selectedImage == undefined) {
        setIconError("Please select image");
        allowDataPost = false;
      } else {
        setIconError("");
        if (contactNumberError == "" && iconSizeError == "") {
          allowDataPost = true;
        } else {
          allowDataPost = false;
        }
      }
    } else {
      allowDataPost = true;
    }

    if (allowDataPost) {
      const updatedMenuData = new FormData();
      if (paymentMethodId) {
        updatedMenuData.append("id", paymentMethodId);
      }
      if (name) {
        updatedMenuData.append("name", name.trim());
      }

      if (contactNumber) {
        updatedMenuData.append("contact_number", contactNumber.trim());
      }

      if (selectedImage != null || selectedImage != undefined) {
        updatedMenuData.append("scanner", selectedImage);
      }
      const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
      const response = await savePaymentMethodApi(tenant, updatedMenuData);
      if (response.msg) {
        Message("Payment Updated.", "success");
        navigate("/dashboard");
      } else {
        Message("Something went wrong", "error");
      }
    }
    /**
     * End of code addition by - Parineeta Gedam on 12-07-2023
     * Reason - created api to save menu. After saving the menu it will redirect to menu list page.
     */
  };

  /**
   * Added by - Parineeta Gedam on 13-07-2023
   * Reason - Method to reset payment form
   */
  const resetPaymentForm = (event) => {
    setName(paymentData.name ? paymentData.name : "");
    // setContactNumber(paymentData.name ? paymentData.name : "");
    // setIcon(paymentData.icon ? paymentData.icon : "");
    setContactNumber(
      paymentData.contact_number ? paymentData.contact_number : ""
    );

    // Modified by :- Parineeta Gedam on 15-07-2023
    // setIcon(paymentData.scanner ? paymentData.scanner : "");
    setIcon(paymentData.scanner ? paymentData.scanner : null);
    // End of modified code by :- Parineeta Gedam on 15-07-2023

    setSelectedImageName(null);
    setSelectedImage(null);
    document.getElementById("icon").value = "";
    setIconError("");
    setNameError("");
    setContactNumberError("");
  };
  // End of added code by :- Parineeta gedam on 13-07-2023 reason :- Method to reset payment form

  return (
    // Commented by :- Parineeta Gedam on 12-07-2023 reason :- payment method implementations
    // Modified by Rohan Kansari - 25/6/23
    // Reason - removing header from each page and making it global
    // <Header>
    // <div className={style.Container}>
    //   <h1 className={style.heading}>PaymentMethod</h1>
    // </div>
    //  </Header>
    // End of commented code by :- Parineeta Gedam on 12-07-2023 reason :- payment method implementations

    // Added by :- PArineeta Gedam on 12-07-2023 reason :- payment method implementations
    <div className={style.container}>
      <div className={style.titleContainer}>
        <div className={style.pageTitle}>Payment Method</div>
      </div>
      <form className={style.menuSection}>
        <div className={style.formContainer}>
          <div className={`${style.sectionInsideForm}`}>
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.mendatoryField}></span>Name
                </div>
                <input
                  className={`${style.textInputBox}`}
                  type="text"
                  name="name"
                  value={name}
                  style={{ width: "200px" }}
                  onChange={(e) => {
                    setName(e.target.value.toString());
                    validateOnInput("name", e.target.value.toString());
                  }}
                  maxLength={30}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>{nameError}</div>
            </div>

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.mendatoryField}></span>Contact number
                </div>
                <input
                  className={`${style.textInputBox}`}
                  type="number"
                  name="contact_number"
                  ng-pattern="/^[0-9]{10}$/"
                  value={contactNumber}
                  style={{ width: "200px" }}
                  onChange={(e) => {
                    setContactNumber(e.target.value);
                    validateOnInput("contact_number", e.target.value);
                  }}
                  maxLength={10}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {contactNumberError}
              </div>
            </div>

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.mendatoryField}>* </span>Scanner
                </div>
                <div className={style.menuImageContainer}>
                  {selectedImageName ? (
                    selectedImageName
                  ) : icon ? (
                    <img
                      src={config.staticBaseURL + icon}
                      className={style.menuImage}
                      width={"200px"}
                      height={"200px"}
                    />
                  ) : null}
                </div>
              </div>
            </div>

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.optionalField}>* </span>Select new
                  scanner
                </div>

                <input
                  className={`${style.textInputBox}`}
                  type="file"
                  name="icon"
                  id="icon"
                  accept="image/png,image/jpg,image/jpeg"
                  style={{ width: "200px" }}
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setSelectedImageName(e.target.files[0].name);
                      setSelectedImage(e.target.files[0]);
                      validateOnFileInput("icon", e.target.files[0]);
                    } else {
                      setSelectedImageName(null);
                      setSelectedImage(null);
                    }
                  }}
                />
              </div>

              <div className={`${style.inputErrorArea}`}><p>{iconError}</p><p>{iconSizeError}</p></div>
            </div>
          </div>
        </div>

        <div className={style.actionContainer}>
          <div
            className={` ${style.backButton}`}
            style={{
              marginRight: "10px",
            }}
            onClick={(e) => {
              navigate("/dashboard");
            }}
          >
            Back
          </div>

          <div
            className={` ${style.cancelButton}`}
            style={{
              marginRight: "10px",
            }}
            onClick={(e) => {
              resetPaymentForm();
              window.scrollTo(0, 0);
            }}
          >
            Clear
          </div>

          <div
            className={` ${style.proceedButton}`}
            onClick={() => {
              postPaymentData();
              window.scrollTo(0, 0);
            }}
          >
            Save
          </div>
        </div>
      </form>
    </div>

    // End of Added code by :- Parineeta Gedam on 12-07-2023 reason :- payment method implementations
  );
};

export default PaymentMethod;
