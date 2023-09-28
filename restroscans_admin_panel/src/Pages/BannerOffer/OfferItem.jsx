// Added by Om Shrivastava on 27-09-23
// Reason : Create offer banner item page
import { useEffect, useState } from "react";
import style from "./offeritem.module.css";
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
import { AiFillEye } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";

const OfferItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentData, setPaymentData] = useState({});
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [name, setName] = useState(null);
  const [contactNumber, setContactNumber] = useState(null);
  const [icon, setIcon] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [nameError, setNameError] = useState("");
  const [contactNumberError, setContactNumberError] = useState("");
  const [iconError, setIconError] = useState("");
  const [iconSizeError, setIconSizeError] = useState("");

  useEffect(() => {
    getPaymentData();
  }, []);

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
      // if (value.length == 0)
      //   setContactNumberError("Please enter contact number");
      if (value.length < 10)
        setContactNumberError(
          "Contact number should not be less than 10 digits"
        );
      if (value.length > 10)
        setContactNumberError(
          "Contact number should not be greater than 10 digits"
        );
      // Added By pratap sahu on 15-09-2023
      // Reason: to remove validation on empty contact number
      // if (value.length == 10) setContactNumberError("");
      if (value.length == 10 || value.length == 0) setContactNumberError("");
      // if (value.length > 10) {
      // } else {
      //   setContactNumberError(value);
      // }
      // End of Addition By pratap sahu on 15-09-2023
      // Reason: to remove validation on empty contact number
    }
  };
  /**
   * End of code addition by - Parineeta Gedam on 13-07-2023
   * Reason -  method to validate input when user is entering some data
   */

  /**
   * Modified by  - Parineeta Gedam on 17-07-2023
   * Reason - implementation of Payment Method >> Above 200 kb image is also taken in scanner.
   */
  /**
   * Added by - Parineeta Gedam on 13-07-2023
   * Reason - method to validate image when user is entering some data
   */
  const validateOnFileInput = (inputName, value) => {
    if (inputName == "icon") {
      setIconError("");
      if (value != null && value != undefined) {
        if (value.size / 1024 > 200) {
          setIconSizeError("File size must be below 200 KB");
          setSelectedImageName(null);
        } else {
          setSelectedImageName(value.name);
          setSelectedImage(value);
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
   * End of code Modified by  - Parineeta Gedam on 17-07-2023
   * Reason - implementation of Payment Method >> Above 200 kb image is also taken in scanner.

   */

  /**
   * Modified by  - Parineeta Gedam on 17-07-2023
   * Reason - implementation of Payment Method >> Above 200 kb image is also taken in scanner.
   */
  /**
   * Added by - Parineeta Gedam on 13-07-2023
   * Reason - created api to save payment data. After saving the payment data redirect to dashboard.
   */
  const postPaymentData = async () => {
    var allowDataPost = false;
    if (icon == null || icon == undefined) {
      if (selectedImage == null || selectedImage == undefined) {
        if (iconSizeError != "") {
          setIconSizeError("File size must be below 200 KB");
        } else {
          setIconError("Please select image");
        }
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
      // Modified by Rohan kansari - 21/8/23
      // Reason - To validate all field in one place
      if (iconSizeError != "" || contactNumberError != "") {
        allowDataPost = false;
      } else {
        allowDataPost = true;
      }
      // End of Modification by Rohan kansari - 21/8/23
      // Reason - To validate all field in one place

      // Added by :- Parineeta Gedam on 28-07-2023
      // reason :- If we add 11th digit in contact number and click on save button then Error message is display in page.
      // if (contactNumberError == "") {
      //   allowDataPost = true;
      // } else {
      //   allowDataPost = false;
      // }
      // End of Added code by :- Parineeta Gedam on 28-07-2023
      // reason :- If we add 11th digit in contact number and click on save button then Error message is display in page.
    }

    if (allowDataPost) {
      const updatedMenuData = new FormData();
      if (paymentMethodId) {
        updatedMenuData.append("id", paymentMethodId);
      }
      // commented & Added By pratap sahu on 15-09-2023
      // Reason: to save empty name
      // if (name) {
      //   updatedMenuData.append("name", name.trim());
      // }
      updatedMenuData.append("name", name ? name : " ");
      // End of comment & Addition By pratap sahu on 15-09-2023
      // Reason: to save empty name

      // commented & Added By pratap sahu on 15-09-2023
      // Reason: to save empty name
      // if (contactNumber) {
      //   updatedMenuData.append("contact_number", contactNumber.trim());
      // }
      updatedMenuData.append(
        "contact_number",
        contactNumber ? contactNumber : ""
      );
      // End of comment & Addition By pratap sahu on 15-09-2023
      // Reason: to save empty name

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
    /**
     * End of code Modified by  - Parineeta Gedam on 17-07-2023
     * Reason - implementation of Payment Method >> Above 200 kb image is also taken in scanner.
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

    // Added by :- Parineeta Gedam on 28-07-2023
    // reason :- if we add above 200kb image in scanner section,then click on clear button then image is clear but still validation is display in page.
    setIconSizeError("");
    // End of Added by :- Parineeta Gedam on 28-07-2023
    // reason :- if we add above 200kb image in scanner section,then click on clear button then image is clear but still validation is display in page.
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
    <div className={style.Container}>
      <div className={style.titleContainer}>
        <div className={style.pageTitle}>Offer-Banner Item</div>
      </div>
      <form className={style.menuSection}>
        <div className={style.formContainer}>
          <div className={`${style.sectionInsideForm}`}>
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.mendatoryField}></span>Offer name
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

            <div className={`${style.menuCatItemContainer}`}>
              <div className={`${style.menuCatItemdropdown}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>
                    <span className={style.mendatoryField}></span>Menu
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
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>
                    <span className={style.mendatoryField}></span>Category
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
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>
                    <span className={style.mendatoryField}></span>Item
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
              </div>

              <div className={` ${style.addButton}`}>Add</div>
            </div>
          </div>
        </div>

        <div
        style={{paddingTop:'3%' }}
        >
          <div className={style.titleContainer}>
            <div className={style.pageTitle}>Added item list</div>
          </div>

          <div className={style.itemListSection}>
            <div className={style.tableContainer}>
              <div className={style.table}>
                <div className={style.tableHeadingContainer}>
                  <div className={style.sNoColumn}>Edit </div>
                  <div className={style.actionColumn}>S.No</div>
                  <div className={style.OrderIdColumn}>Menu</div>

                  <div className={style.orderStatusColumn}>Category</div>

                  <div className={style.orderStatusColumn}>Item</div>
                  <div className={style.paymentStatusColumn}> Price full</div>

                  <div className={style.subtotalColumn}>Price half</div>

                  {/* <div
                    className={style.cgstColumn}
                  
                  >
                    Price
                   
                  </div> */}

                  {/* <div
                    className={style.dateColumn}
                  >
                    Date{" "}
                  </div>

                  <div
                    className={style.totalColumn}
                  >
                    {" "}
                    Time{" "}
                  </div> */}
                </div>

                <div
                  className={style.tableDataContainer}
                  style={{
                    backgroundColor: "#efefef",
                  }}
                >
                  {/* {orderItems && orderItems.length > 0 ? (
                    orderItems.map((orderDetail, index) => {
                      return ( */}
                  <div
                    //   key={index}
                    className={style.tableData}
                    style={{
                      padding: "2px",
                      marginTop: "2px",
                      // marginBottom:
                      //   orderItems.length == index + 1 ? "2px" : "0px",
                      // background:
                      //   backgroundColor++ % 2 == 0
                      //     ? "white"
                      //     : "#1677ff14",
                    }}
                  >
                    <div
                      className={`${style.sNoColumn} ${style.commonColumnData} `}
                    >
                      <FiEdit
                        // onClick={(e) => {
                        //   openCategoryDetails(
                        //     bannerOfferDetails.id
                        //   );
                        // }}
                        // disabled={disabled}
                        style={{
                          //   border: "1px solid black",
                          marginLeft: "12px",
                          width: "14px",
                          height: "14px",
                        }}
                      />
                    </div>

                    <div
                      className={`${style.actionColumn} ${style.commonColumnData} `}
                    >
                      1
                    </div>

                    <div
                      className={`${style.OrderIdColumn} ${style.commonColumnData} `}
                      style={{ wordBreak: "break-word" }}
                    >
                      Maincourse
                      {/* {orderDetail.order_id} */}
                    </div>

                    <div
                      className={`${style.orderStatusColumn} ${style.commonColumnData} `}
                      style={{ wordBreak: "break-word" }}
                    >
                      Chienese
                      {/* {orderDetail.item} */}
                    </div>

                    <div
                      className={`${style.orderStatusColumn} ${style.commonColumnData} `}
                      style={{ wordBreak: "break-word" }}
                    >
                      Paneer corn soup
                      {/* {orderDetail.item_status} */}
                    </div>

                    <div
                      className={`${style.paymentStatusColumn} ${style.commonColumnData} `}
                      style={{ wordBreak: "break-word" }}
                    >
                      <h4>
                        {" "}
                        <strike>500.00</strike>
                      </h4>
                      <h4> 380.00</h4>
                      {/* {orderDetail.serving_size} */}
                    </div>
                    <div
                      className={`${style.subtotalColumn} ${style.commonColumnData} `}
                    >
                      <h4>
                        {" "}
                        <strike>300.00</strike>
                      </h4>
                      <h4> 230.00</h4>
                    </div>

                    {/* <div
                            className={`${style.cgstColumn} ${style.commonColumnData} `}
                          >
                            6575.00
                          </div> */}

                    {/* <div
                            className={`${style.dateColumn} ${style.commonColumnData} `}
                          >
                            29/09/23
                          </div>

                          <div
                          
                            className={`${style.totalColumn} ${style.commonColumnData} `}
                          >
                            12.00.00
                          </div> */}
                  </div>
                  {/* );
                    })
                  ) : (
                    <div style={{ textAlign: "center" }}>No records found!</div>
                  )} */}
                </div>
              </div>
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
              navigate(-1);
            }}
          >
            Back
          </div>

          {/* <div
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
          </div> */}

          <div
            className={` ${style.proceedButton}`}
            // onClick={() => {
            //   postPaymentData();
            //   window.scrollTo(0, 0);
            // }}
          >
            Save
          </div>
        </div>
      </form>
    </div>

    // End of Added code by :- Parineeta Gedam on 12-07-2023 reason :- payment method implementations
  );
};

export default OfferItem;
// End of addition by Om Shrivastava on 27-09-23
// Reason : Create offer banner item page
