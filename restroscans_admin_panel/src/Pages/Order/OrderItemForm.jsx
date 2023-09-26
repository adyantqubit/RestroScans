// Created by Om Shrivastava on 30-06-23
// Reaosn : Need to show order item form

import React, { useEffect } from "react";
import style from "./orderitemform.module.css";
import Header from "../GlobalComponent/Header";
import { Message } from "../../App";
import { enableHeader } from "../../App";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getOrderDetailsApi,
  getOrderItemDataApi,
  getOrderItemsApi,
  saveOrderDetailsApi,
  saveOrderItemDetailsApi,
  updateOrderItemStatus,
} from "../../Api/services";
import { useState } from "react";
import Loader from "../GlobalComponent/Loader";
import { message } from "antd";

const OrderItemForm = () => {
  const navigate = useNavigate();

  /**
   * Added by Om Shrivastava on 16-06-23
   * Reason - to recieve id for update Order details
   */
  const { state } = useLocation();
  const { id } = state; // Read values passed on state
  /**
   * End of addition by Om Shrivastava on 16-06-23
   */
  // const [orderItemDetailsObj, setorderItemDetailsObj] = useState({});
  const [orderItemDetailsObj, setorderItemDetailsObj] = useState([]);

  const [orderId, setOrderId] = useState(null);
  const [itemName, setItemName] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [servingSize, setServingSize] = useState(null);
  const [itemStatus, setItemStatus] = useState(null);
  // const [cancelReason, setCancelReason] = useState(null);
  const [price, setPrice] = useState(null);
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState(null);

  // Added by Om on 02-09-23
  // Reason : Add Loader whenever the data enter from backend site
  const [isLoader, setIsLoader] = useState(true);
  // End of addition by Om Shrivastava on 02-09-23

  // Added by Om Shrivatava on on 18-06-23
  // Reason : Set the validation in all fields

  const [validationErrors, setValidationErrors] = useState({
    discount_rupees: "",
    discount_percentage: "",
    apply_loyality_point: "",
    order_status: "",
    payment_status: "",
    cancelled_by: "",
    // cancel_reason:"",
    discount_reason: "",
  });
  const [validationForOrderCancel, setValidationForOrderCancel] = useState("");
  // End of addition by Om Shrivastava on 18-06-23

  useEffect(() => {
    // Added By Rohan Kansari - 25/6/23
    // Reason - To enable headerSiderbar
    enableHeader();
    // End of code - Rohan kansari - 25/6/23
    getOrderItemDetail();
  }, []);

  // console.log(itemStatus,'888')

  /**
   * Added by - Om Shrivastava on 16-06-23
   * Reason - created api that will get Order details data
   */
  const getOrderItemDetail = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await getOrderItemDataApi(tenant);
    if (response.msg) {
      // setSettingData(response.setting);
      if (id != 0) {
        var filterOrderObj = response.orderItemData.filter(
          (dt) => dt.id == id
        )[0];
        // Added by Om on 02-09-23
        // Reason : Add Loader whenever the data enter from backend site
        setIsLoader(false);
        // End of addition by Om Shrivastava on 02-09-23
        setorderItemDetailsObj(filterOrderObj);

        setOrderId(filterOrderObj.order_id);
        setItemName(filterOrderObj.item);
        setQuantity(filterOrderObj.quantity);
        setServingSize(filterOrderObj.serving_size);
        setItemStatus(filterOrderObj.item_status);
        //   setCancelReason(filterOrderObj.cancel_reason);
        setPrice(filterOrderObj.price);
        setRating(filterOrderObj.rating);
        setReview(filterOrderObj.review);
      }
    }
  };
  // console.log(orderItemDetailsObj,orderId,'dataaaa')

  /**
   * End of code addition by - Om Shrivastava on 16-06-23
   * Reason - created api get Order details data
   */

  /**
   * Added by - Om Shrivastava on 18-06-23
   * Reason - Created validation method for show the validations in some fields
   */

  const validateOnBlur = (inputName, value) => {
    //   if (inputName == "apply_loyality_point") {
    //     if (value.toString().length > 0) {
    //       if (!isNaN(value)) {
    //         if (value < 0 || customerLoyalitypoint < value) {
    //           const error = {
    //             apply_loyality_point: "Loyality point must be greater than 0 and below the customer loyality point.",
    //           };
    //           setValidationErrors({ ...validationErrors, ...error });
    //         } else {
    //           const error = {
    //             apply_loyality_point: "",
    //           };
    //           setValidationErrors({ ...validationErrors, ...error });
    //         }
    //       } else {
    //         const error = {
    //           apply_loyality_point: "Loyality point must be a number.",
    //         };
    //         setValidationErrors({ ...validationErrors, ...error });
    //       }
    //     } else {
    //       const error = {
    //         apply_loyality_point: "Please enter loyality point.",
    //       };
    //       setValidationErrors({ ...validationErrors, ...error });
    //     }
    //   }
    //   if (inputName == "discount_rupees") {
    //     if (value.toString().length > 0) {
    //       if (!isNaN(value)) {
    //         if (value < 0 || finalAmount < value) {
    //           const error = {
    //             discount_rupees: "Discount must be greater than or equal to 0 and below the grand total.",
    //           };
    //           setValidationErrors({ ...validationErrors, ...error });
    //         } else {
    //           const error = {
    //             discount_rupees: "",
    //           };
    //           setValidationErrors({ ...validationErrors, ...error });
    //         }
    //       } else {
    //         const error = {
    //           discount_rupees: "discount must be a number.",
    //         };
    //         setValidationErrors({ ...validationErrors, ...error });
    //       }
    //     } else {
    //       const error = {
    //         discount_rupees: "Please enter discount.",
    //       };
    //       setValidationErrors({ ...validationErrors, ...error });
    //     }
    //   }
    //   if (inputName == "discount_percentage") {
    //     if (value.toString().length > 0) {
    //       if (!isNaN(value)) {
    //         if (value < 0 || value >= 100) {
    //           const error = {
    //             discount_percentage: "Discount in percentage must be greater than or equal to 0 and 100",
    //           };
    //           setValidationErrors({ ...validationErrors, ...error });
    //         } else {
    //           const error = {
    //             discount_percentage: "",
    //           };
    //           setValidationErrors({ ...validationErrors, ...error });
    //         }
    //       } else {
    //         const error = {
    //           discount_percentage: "discount in percentage must be a number.",
    //         };
    //         setValidationErrors({ ...validationErrors, ...error });
    //       }
    //     } else {
    //       const error = {
    //         discount_percentage: "Please enter discount in percentage",
    //       };
    //       setValidationErrors({ ...validationErrors, ...error });
    //     }
    //   }
  };
  /**
   * End of code addition by - Om Shrivastava on 18-06-23
   * Reason - Created validation method for show the validations in some fields
   */

  const validateOnInput = (inputName, value) => {
    //   if (inputName == "cancel_reason") {
    //     if (value.toString().length > 0) {
    //       setValidationForOrderCancel("");
    //     } else {
    //       setValidationForOrderCancel("Cancel reason must be 255 characters long");
    //     }
    //   }
  };
  console.log(id,'idd')

  const saveOrderItem = async () => {
    //   var allowDataPost = false;

    //   if (validationErrors.apply_loyality_point == "") {
    //     allowDataPost = true;
    //   }
    //   else {
    //     allowDataPost = false
    //   }

    //   if ((cancelReaon == null || cancelReaon == undefined || cancelReaon.toString().trim() == '') && orderStatus == "Cancelled") {
    //     allowDataPost = false;

    //     setValidationForOrderCancel("Please enter cancel reason");

    //     console.log('if part')
    //   }

    // if (allowDataPost) {

// Commented by Om Shrivastava on 16-09-23
    // const updatedOrderData = new FormData();
    // if (id != 0) {
    //   updatedOrderData.append("id", id);
    // }

    // updatedOrderData.append("item_status", itemStatus);
    // // updatedOrderData.append("cancel_reason", cancelReaon);

    // const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    // const response = await saveOrderItemDetailsApi(tenant, updatedOrderData);
    // if (response.msg) {
    //   Message("Order item saved successfully.", "success");
    //   navigate(-1);
    // } else {
    //   Message("Something went wrong", "error");
    // }
  // End of commented code
  const updatedOrderData = orderItemDetailsObj;
  
    updatedOrderData["item_status"]= itemStatus;
    
    // updatedOrderData.append("cancel_reason", cancelReaon);
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    console.log(updatedOrderData,'updated... data')
    // Modification and addition by Om Shrivastava on 19-09-23
    // Reason : Need to use this API for the update the item status
    const response = await updateOrderItemStatus(tenant, orderId,[orderItemDetailsObj],updatedOrderData);
    if (response.success) {
      Message("Order item saved successfully.", "success");
      navigate(-1);
    } else {
      Message("Something went wrong", "error");
    }
    // End of modification and addition by Om Shrivastava on 22-09-23
    // Reason : Need to use this API for the update the item status 

    // }
    // else {
    //     // Message("Please provide value for this field", "info");
    // }
  };
  
  // Added by Rohan kansari - 28/6/23
  // Reason - To validate filed again
  // useEffect(() => {
  //   if (discountRupee != null)
  //     validateOnBlur(
  //       "discount_rupees",
  //       discountRupee
  //     );
  //   if (discountPercentage != null) {
  //     validateOnBlur("discount_percentage", discountPercentage);
  //   }
  // }, [discountRupee, discountPercentage])
  // End of code - Rohan kansari - 28/6/23

  return (
    // Modified by Rohan Kansari - 25/6/23
    // Reason - removing header from each page and making it global
    // <Header>
    <div className={style.container}>
      <div className={style.titleContainer}>
        {/* <div className={style.backButton}><BiArrowBack style={{width:"30px",height:"30px"}}/></div> */}
        <div className={style.pageTitle} style={{ fontSize: "25px" }}>
          Order item
        </div>
      </div>
{/* // Addition by Om Shrivastava on 02-09-23
    // Reason : Apply the loader in order form page */}
      {isLoader == true ? <Loader/> :  
    <div >
      {/* End of addition by Om Shrivastava on 02-09-23
    // Reason : Apply the loader in order form page */}
      <form className={style.settingSection}>
        <div
          className={style.formContainer}
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <div className={`${style.sectionInsideForm}`}>
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>Order Id</div>
                <input
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
                  type="text"
                  name="order_id"
                  value={orderId}
                  disabled
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {/* {validationErrors.whatsapp_number} */}
              </div>
            </div>

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>Item name</div>
                <input
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
                  type="text"
                  name="item"
                  value={itemName}
                  disabled
                  // Added by Om Shrivastava on 12-07-23
                  // Reason : Increase the width of input
                  style={{ width: "230px" }}
                  // End of added code by Om Shrivastava on 12-07-23
                  // Reason : Increase the width of input
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {/* {validationErrors.whatsapp_number} */}
              </div>
            </div>

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>Serving size </div>
                <input
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
                  type="text"
                  name="serving_size"
                  //   value={paymentMode && paymentMode ? paymentMode : '----'}
                  value={servingSize}
                  disabled
                  maxLength={10}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {/* {validationErrors.cancelled_by} */}
              </div>
            </div>
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel} `}>Quantity</div>
                <input
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
                  type="text"
                  name="quantity"
                  //   value={paymentMode && paymentMode ? paymentMode : '----'}
                  value={quantity}
                  disabled
                  maxLength={10}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {/* {validationErrors.whatsapp_number} */}
              </div>
            </div>
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>Item Status</div>
                {/* Modification and addition by Om Shrivastava on 26-09-23
                Reason : No need to perform the updation functionality for the item status */}
                {/* <select
                  className={`${style.textInputBox}`}
                  name="item_status"
                  // Modification by Om Shrivastava on 12-07-23 Reason : Decrease the width of Item status
                  // style={{ width: "200px" }}
                  style={{ width: "120px" }}
                  //End of code Modification by Om Shrivastava on 12-07-23 Reason : Decrease the width of Item status
                  onChange={(e) => {
                    setItemStatus(e.target.value);
                    // validateOnInput("app_theme", e.target.value);
                  }}
                  value={itemStatus}
                >
                  <option
                    value="Pending"
                    selected={itemStatus == "Pending" ? true : false}
                  >
                    Pending
                  </option>
                  <option
                    value="Confirm"
                    selected={itemStatus == "Confirm" ? true : false}
                  >
                    Confirm
                  </option>
                  <option
                    value="Cancelled"
                    selected={itemStatus == "Cancelled" ? true : false}
                  >
                    Cancelled
                  </option>
                </select> */}
                  <input
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
                  type="text"
                  name="item_status"
                  value={itemStatus}
                  disabled
                />
                {/* End of modificaion and addition by Om Shrivastava on 26-09-23
                Reason : No need to perform the updation functionality for the item status */}
              </div>
              <div className={`${style.inputErrorArea}`}>
                {/* {validationErrors.payment_status} */}
              </div>
            </div>
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel} `}>Price</div>
                <input
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
                  type="text"
                  name="payment_mode"
                  //   value={paymentMode && paymentMode ? paymentMode : '----'}
                  value={price}
                  disabled
                  maxLength={10}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {/* {validationErrors.whatsapp_number} */}
              </div>
            </div>
            <div className={`${style.inputContainer}`}>
              <div
                className={`${style.inputArea} ${style.inputAreaForResponsive}`}
              >
                <div className={`${style.inputLabel} ${style.inputLabel2}`}>
                  Rating
                </div>
                <input
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
                  type="text"
                  name="rating"
                  // style={{ width: "200px" }}
                  value={rating && rating ? rating : "----"}
                  disabled
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {/* {validationErrors.gstin} */}
              </div>
            </div>

            <div className={`${style.inputContainer}`}>
              <div
                className={`${style.inputArea} ${style.inputAreaForResponsive}`}
              >
                <div className={`${style.inputLabel} ${style.inputLabel2}`}>
                  Review
                </div>
                <p
                  className={`${style.textInputBox} ${style.disabledInputBox} `}
                  style={{ wordBreak: "break-word" }}
                >
                  {review && review ? review : "----"}
                </p>
              </div>
              <div className={`${style.inputErrorArea}`}>
                {/* {validationErrors.fssaino} */}
              </div>
            </div>

            {/* <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>Cancel reason</div>
                <textarea
                  className={`${style.textInputBox}`}
                  type="text"
                  name="cancel_reason"
                  value={cancelReaon}
                  style={{ width: "200px", height: "100px", resize: 'none' }}
                  disabled={paymentStatus == "Completed" || cancelReaon > 0 ? true : false}
                  
                  onChange={(e) => {
                    setCancelReason(e.target.value);
                    validateOnInput("cancel_reason", e.target.value);
                  }}
                 
                  maxLength={255}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationForOrderCancel}
              </div>
            </div> */}
          </div>
        </div>
        {/* End of addition by Om Shrivastava on 22-06-23 */}

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
          {/* Commented by Om Shrivastava on 26-09-23
          Reason : No longer required */}
          {/* <div
            className={` ${style.proceedButton}`}
            onClick={() => {
              saveOrderItem();
              window.scrollTo(0, 0);
            }}
          >
            Save
          </div> */}
          {/* Commented by Om Shrivastava on 26-09-23
          Reason : No longer required */}
        </div>
      </form>
       {/* // Addition by Om Shrivastava on 02-09-23
    // Reason : Apply the loader in order form page */}
    </div>
    }
{/* // End of addition by Om Shrivastava on 02-09-23
    // Reason : Apply the loader in order form page */}
    </div>
    // </Header>
  );
};

export default OrderItemForm;
