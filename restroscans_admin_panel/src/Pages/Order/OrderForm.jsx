import React, { useEffect } from "react";
import style from "./orderform.module.css";
import Header from "../GlobalComponent/Header";
import { Message } from "../../App";

import { useLocation, useNavigate } from "react-router-dom";
import {
  getOrderDetailsApi,
  saveOrderDetailsApi,
} from "../../Api/services";
import { useState } from "react";

const OrderForm = () => {
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
  const [orderDetailsObj, setorderDetailsObj] = useState({});

  const [tablenumber, setTablenumber] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [paymentStatus, setPaymemntStatus] = useState(null);
  const [paymentMode, setPaymentMode] = useState(null);
  const [cancelledBy, setCancelledBy] = useState(null);
  const [cancelReaon, setCancelReason] = useState(null);

  const [discountRupee, setDiscountRupee] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState(null);
  const [discountReason, setDiscountReason] = useState(null);
  const [applyLoyalityPoint, setApplyLoyalityPoint] = useState(null);
  const [loyalityPointPrice, setLoyalityPointPrice] = useState(null);
  const [loyalityPointStatus, setLoyalityPointStatus] = useState(null);
  const [loyalityPointCalculated, setLoyalityPointCalculated] = useState(null);
  const [customerLoyalitypoint, setcustomerLoyalitypoint] = useState(null);


  const [subTotal, setSubTotal] = useState(null);
  const [cgst, setCGST] = useState(null);
  const [total, setTotal] = useState(null);
  const [sgst, setSGST] = useState(null);
  const [finalAmount, setFinalAmount] = useState(null);
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState(null);

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
    discount_reason: ""
  });
  const [validationForOrderCancel, setValidationForOrderCancel] = useState("")
  // End of addition by Om Shrivastava on 18-06-23

  useEffect(() => {
    getOrderDetail();
  }, []);
  /**
* Added by - Om Shrivastava on 16-06-23
* Reason - created api that will get Order details data
*/
  const getOrderDetail = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await getOrderDetailsApi(tenant);
    if (response.msg) {
      // setSettingData(response.setting);
      if (id != 0) {
        var filterOrderObj = response.orderData.filter(
          (dt) => dt.id == id
        )[0];
        setorderDetailsObj(filterOrderObj);

        setOrderId(filterOrderObj.order_id);
        setTablenumber(filterOrderObj.table_number);

        setOrderStatus(filterOrderObj.order_status);
        setPaymemntStatus(filterOrderObj.payment_status);
        setPaymentMode(filterOrderObj.payment_mode);
        setCancelledBy(filterOrderObj.cancelled_by);
        setCancelReason(filterOrderObj.cancel_reason);

        setDiscountRupee(filterOrderObj.discount_rupees);
        setDiscountPercentage(filterOrderObj.discount_percentage);
        setDiscountReason(filterOrderObj.discount_reason);
        setApplyLoyalityPoint(filterOrderObj.apply_loyality_point);
        setLoyalityPointPrice(filterOrderObj.loyality_point_price);
        setLoyalityPointStatus(filterOrderObj.loyality_point_status);
        setLoyalityPointCalculated(filterOrderObj.loyality_point_calculated);
        setcustomerLoyalitypoint(filterOrderObj.customer_loyality_point);

        setSubTotal(filterOrderObj.sub_total);
        setCGST(filterOrderObj.cgst);
        setSGST(filterOrderObj.sgst);
        setTotal(filterOrderObj.total);
        setFinalAmount(filterOrderObj.final_amount);
        setRating(filterOrderObj.rating);
        setReview(filterOrderObj.review);

      }
    }
    // setThemeList(response.themeOptions);
  };
  // console.log(orderStatus,paymentStatus,cancelledBy)

  /**
   * End of code addition by - Om Shrivastava on 16-06-23
   * Reason - created api get Order details data
   */

  /**
   * Added by - Om Shrivastava on 18-06-23
   * Reason - Created validation method for show the validations in some fields
   */
  const validateOnBlur = (inputName, value) => {

    if (inputName == "apply_loyality_point") {
      if (value.toString().length > 0) {
        if (!isNaN(value)) {
          if (value < 0 || customerLoyalitypoint < value) {
            const error = {
              apply_loyality_point: "Loyality point must be greater than 0 and below the customer loyality point.",
            };
            setValidationErrors({ ...validationErrors, ...error });
          } else {
            const error = {
              apply_loyality_point: "",
            };
            setValidationErrors({ ...validationErrors, ...error });
          }
        } else {
          const error = {
            apply_loyality_point: "Loyality point must be a number.",
          };
          setValidationErrors({ ...validationErrors, ...error });
        }
      } else {
        const error = {
          apply_loyality_point: "Please enter loyality point.",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }

    if (inputName == "discount_rupees") {
      if (value.toString().length > 0) {
        if (!isNaN(value)) {
          if (value < 0 || finalAmount < value) {
            const error = {
              discount_rupees: "Discount must be greater than or equal to 0 and below the grand total.",
            };
            setValidationErrors({ ...validationErrors, ...error });
          } else {
            const error = {
              discount_rupees: "",
            };
            setValidationErrors({ ...validationErrors, ...error });
          }
        } else {
          const error = {
            discount_rupees: "discount must be a number.",
          };
          setValidationErrors({ ...validationErrors, ...error });
        }
      } else {
        const error = {
          discount_rupees: "Please enter discount.",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }

    if (inputName == "discount_percentage") {
      if (value.toString().length > 0) {
        if (!isNaN(value)) {
          if (value < 0 || value >= 100) {
            const error = {
              discount_percentage: "Discount in percentage must be greater than or equal to 0 and 100",
            };
            setValidationErrors({ ...validationErrors, ...error });
          } else {
            const error = {
              discount_percentage: "",
            };
            setValidationErrors({ ...validationErrors, ...error });
          }
        } else {
          const error = {
            discount_percentage: "discount in percentage must be a number.",
          };
          setValidationErrors({ ...validationErrors, ...error });
        }
      } else {
        const error = {
          discount_percentage: "Please enter discount in percentage",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }

    // if (inputName == "cancel_reason") {
    //   if ((cancelReaon == null || cancelReaon == undefined || cancelReaon.toString().trim() == '') && orderStatus == "Cancelled") {
    //     const error = {
    //       cancel_reason: "Please enter cancel reason"
    //     };
    //     setValidationForOrderCancel({ ...validationForOrderCancel, ...error });
    //   }
    //   else {
    //     const error = {
    //       cancel_reason: "",
    //     };
    //     setValidationForOrderCancel({ ...validationForOrderCancel, ...error });
    //   }
    // }

  };
  /**
   * End of code addition by - Om Shrivastava on 18-06-23
   * Reason - Created validation method for show the validations in some fields
   */

  const validateOnInput = (inputName, value) => {
    if (inputName == "cancel_reason") {
      if (value.toString().length > 0) {
        setValidationForOrderCancel("");
      } else {
        setValidationForOrderCancel("Cancel reason must be 255 characters long");
      }
    }

    // if (inputName == "sgst") {
    //   if (value.toString().length > 0) {
    //     if (isNaN(value)) {
    //       const error = {
    //         sgst: "SGST must be a number",
    //       };
    //       setValidationErrors({ ...validationErrors, ...error });
    //     } else {
    //       const error = {
    //         sgst: "",
    //       };
    //       setValidationErrors({ ...validationErrors, ...error });
    //     }
    //   } else {
    //     const error = {
    //       sgst: "",
    //     };
    //     setValidationErrors({ ...validationErrors, ...error });
    //   }
    // }

    // if (inputName == "per_loyality_point_value") {
    //   if (value.toString().length > 0) {
    //     if (isNaN(value)) {
    //       const error = {
    //         per_loyality_point_value: "Value for this field must be a number",
    //       };
    //       setValidationErrors({ ...validationErrors, ...error });
    //     } else {
    //       const error = {
    //         per_loyality_point_value: "",
    //       };
    //       setValidationErrors({ ...validationErrors, ...error });
    //     }
    //   } else {
    //     const error = {
    //       per_loyality_point_value: "",
    //     };
    //     setValidationErrors({ ...validationErrors, ...error });
    //   }
    // }

    // if (inputName == "amount_for_single_loyality_point") {
    //   if (value.toString().length > 0) {
    //     if (isNaN(value)) {
    //       const error = {
    //         amount_for_single_loyality_point:
    //           "Value for this field must be a number",
    //       };
    //       setValidationErrors({ ...validationErrors, ...error });
    //     } else {
    //       const error = {
    //         amount_for_single_loyality_point: "",
    //       };
    //       setValidationErrors({ ...validationErrors, ...error });
    //     }
    //   } else {
    //     const error = {
    //       amount_for_single_loyality_point: "",
    //     };
    //     setValidationErrors({ ...validationErrors, ...error });
    //   }
    // }

    // if (inputName == "whatsapp_number") {
    //   if (value.toString().length > 0) {
    //     if (isNaN(value)) {
    //       const error = {
    //         whatsapp_number: "Whatsapp number must be digits only",
    //       };
    //       setValidationErrors({ ...validationErrors, ...error });
    //     } else {
    //       const error = {
    //         whatsapp_number: "",
    //       };
    //       setValidationErrors({ ...validationErrors, ...error });
    //     }
    //   } else {
    //     const error = {
    //       whatsapp_number: "",
    //     };
    //     setValidationErrors({ ...validationErrors, ...error });
    //   }
    // }
  };

  const saveOrder = async () => {

    var allowDataPost = false;

    if (validationErrors.apply_loyality_point == "") {
      allowDataPost = true;
    }
    else {
      allowDataPost = false
    }
// Commented by Om Shrivastava on 21-06-23
// Reason : Need to change the usestsate of this fields to another usestate
    // if (validationErrors.discount_rupees == "") {
    //   allowDataPost = true;
    // }
    // else {
    //   allowDataPost = false
    // }

    // if (validationErrors.discount_percentage == "") {
    //   allowDataPost = true;
    // }
    // else {
    //   allowDataPost = false
    // }
  // End of commented by Om Shrivastava on 21-06-23

    if ((cancelReaon == null || cancelReaon == undefined || cancelReaon.toString().trim() == '') && orderStatus == "Cancelled") {
      allowDataPost = false;

      // const error = {
      //   cancel_reason: "Please enter cancel reason"
      // };
      setValidationForOrderCancel("Please enter cancel reason");
      // setValidationForOrderCancel({ ...validationForOrderCancel, ...error });

      console.log('if part')
    }
    // else {
    //   allowDataPost = false

    //   const error = {
    //     cancel_reason: "",
    //   };
    //   // setValidationForOrderCancel("");
    //   setValidationForOrderCancel({ ...validationForOrderCancel, ...error });
    //   console.log('else')
    // }


    if (allowDataPost) {

      const updatedOrderData = new FormData();
      if (id != 0) {
        updatedOrderData.append("id", id);
      }
      updatedOrderData.append("discount_rupees", discountRupee);
      updatedOrderData.append("discount_percentage", discountPercentage);
      updatedOrderData.append("apply_loyality_point", applyLoyalityPoint);
      updatedOrderData.append("order_status", orderStatus);
      updatedOrderData.append("payment_status", paymentStatus);
      updatedOrderData.append("cancelled_by", cancelledBy);
      updatedOrderData.append("cancel_reason", cancelReaon);
      updatedOrderData.append("discount_reason", discountReason);


      const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
      const response = await saveOrderDetailsApi(tenant, updatedOrderData);
      if (response.msg) {
        Message("Order saved successfully.", "success");
        navigate(-1);
      } else {
        Message("Something went wrong", "error");
      }
    }
    else {
      // Message("Please provide value for this field", "info");
    }
  };
  // console.log(discountReason, '55555')


  return (
    <Header>
      <div className={style.container}>
        <div className={style.titleContainer}>
          {/* <div className={style.backButton}><BiArrowBack style={{width:"30px",height:"30px"}}/></div> */}
          <div className={style.pageTitle} style={{fontSize:"25px"}}>Order</div>
        </div>
        <form className={style.settingSection}>
          <div className={style.formContainer} style={{display:'flex',
          flexWrap:'wrap'
          }}>
            <div className={`${style.sectionInsideForm}`}>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Order Id</div>
                  <input
                    className={`${style.textInputBox}`}
                    type="text"
                    name="order_id"
                    value={orderId}
                    disabled

                    // style={{ width: "200px" }}
                    // onFocus={(e)=>{
                    //   if(whatsappNumber.length==13)
                    //     setWhatsappNumber(whatsappNumber.substring(3,13))
                    // }}
                    // onChange={(e) => {
                    //   setWhatsappNumber(e.target.value);
                    //   validateOnInput("whatsapp_number", e.target.value);
                    // }}
                    // onBlur={(e) => {
                    //   validateOnBlur("whatsapp_number", e.target.value);
                    // }}
                    maxLength={10}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.whatsapp_number} */}
                </div>
              </div>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Table number</div>
                  <input
                    className={`${style.textInputBox}`}
                    type="text"
                    name="table_number"
                    value={tablenumber}
                    disabled
                    // style={{ width: "200px" }}
                    // onFocus={(e)=>{
                    //   if(whatsappNumber.length==13)
                    //     setWhatsappNumber(whatsappNumber.substring(3,13))
                    // }}
                    // onChange={(e) => {
                    //   setWhatsappNumber(e.target.value);
                    //   validateOnInput("whatsapp_number", e.target.value);
                    // }}
                    // onBlur={(e) => {
                    //   validateOnBlur("whatsapp_number", e.target.value);
                    // }}
                    maxLength={10}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.whatsapp_number} */}
                </div>
              </div>


              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Order Status</div>
                  <select
                    className={`${style.textInputBox}`}
                    name="order_status"
                    style={{ width: "200px" }}

                    // value={orderStatus}
                    // defaultValue={orderStatus ? orderStatus : null}

                    onChange={(e) => {
                      setOrderStatus(e.target.value);
                      //   validateOnInput("app_theme", e.target.value);
                    }}
                  >
                    <option value="Placed" selected={orderStatus == "Placed" ? true : false}>Placed</option>
                    <option value="Confirm" selected={orderStatus == "Confirm" ? true : false}>Confirm</option>
                    <option value="Cooked" selected={orderStatus == "Cooked" ? true : false}>Cooked</option>
                    <option value="Served" selected={orderStatus == "Served" ? true : false} >Served</option>
                    <option value="Cancelled" selected={orderStatus == "Cancelled" ? true : false} >Cancelled</option>

                  </select>
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {validationErrors.order_status}
                </div>
              </div>

              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Payment Status</div>
                  <select
                    className={`${style.textInputBox}`}
                    name="payment_status"
                    style={{ width: "200px" }}
                    // defaultValue={paymentStatus ? paymentStatus : null}
                    onChange={(e) => {
                      setPaymemntStatus(e.target.value);
                      // validateOnInput("app_theme", e.target.value);
                    }}
                  >
                    <option value="Pending" selected={paymentStatus == "Pending" ? true : false}>Pending</option>
                    <option value="Completed" selected={paymentStatus == "Completed" ? true : false}>Completed</option>

                  </select>
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {validationErrors.payment_status}
                </div>
              </div>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Payment mode</div>
                  <input
                    className={`${style.textInputBox}`}
                    type="text"
                    name="payment_mode"
                    value={paymentMode && paymentMode ? paymentMode : '----'}
                    disabled

                    // style={{ width: "200px" }}
                    // onFocus={(e)=>{
                    //   if(whatsappNumber.length==13)
                    //     setWhatsappNumber(whatsappNumber.substring(3,13))
                    // }}
                    // onChange={(e) => {
                    //   setWhatsappNumber(e.target.value);
                    //   validateOnInput("whatsapp_number", e.target.value);
                    // }}
                    // onBlur={(e) => {
                    //   validateOnBlur("whatsapp_number", e.target.value);
                    // }}
                    maxLength={10}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.whatsapp_number} */}
                </div>
              </div>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Order is cancelled by </div>
                  <select
                    className={`${style.textInputBox}`}
                    name="cancelled_by"
                    style={{ width: "200px" }}
                    onChange={(e) => {
                      setCancelledBy(e.target.value);
                      // validateOnInput("app_theme", e.target.value);
                    }}
                  >
                    <option value="" selected={cancelledBy == null ? true : false}>---</option>
                    <option value="Customer" selected={cancelledBy == "Customer" ? true : false}>Customer</option>
                    <option value="Admin" selected={cancelledBy == "Admin" ? true : false}>Admin</option>

                  </select>
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {validationErrors.cancelled_by}
                </div>
              </div>


              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Cancel reason</div>
                  <textarea
                    className={`${style.textInputBox}`}
                    type="text"
                    name="cancel_reason"
                    value={cancelReaon}
                    style={{ width: "200px", height: "100px", resize: 'none' }}
                    disabled={paymentStatus == "Completed" || cancelReaon > 0 ? true : false}
                    // onFocus={(e)=>{
                    //   if(whatsappNumber.length==13)
                    //     setWhatsappNumber(whatsappNumber.substring(3,13))
                    // }}
                    onChange={(e) => {
                      setCancelReason(e.target.value);
                      validateOnInput("cancel_reason", e.target.value);
                    }}
                    // onBlur={(e) => {
                    //   validateOnBlur("cancel_reason", e.target.value);
                    // }}
                    maxLength={255}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {validationForOrderCancel}
                </div>
              </div>

            </div>

            <div className={`${style.sectionInsideForm}`}>




              

              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>
                    {/* Modification and addition by Om Shrivastava on 22-06-23
                    Reason : Need to change the name */}
                    {/* Customer loyality point */}
                    Customer earn point
                  {/* End of addition and modifciation by Om Shrivastava on 22-06-23 */}
                  </div>
                  <input
                    className={`${style.textInputBox} ${style.disabledInputBox}`}
                    type="text"
                    name="customer_loyality_point"
                    style={{ width: "100px" }}
                    value={customerLoyalitypoint}
                    disabled
                    onChange={(e) => {
                      // setcustomerLoyalitypoint(e.target.value);
                      // validateOnInput(
                      //   "amount_for_single_loyality_point",
                      //   e.target.value
                      // );
                    }}
                  // onBlur={(e) => {
                  //   validateOnBlur(
                  //     "amount_for_single_loyality_point",
                  //     e.target.value
                  //   );
                  // }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.cus} */}
                </div>

              </div>

              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>
                    Apply loyality point
                  </div>
                  <input
                    className={`${style.textInputBox}`}
                    type="text"
                    // type="number"
                    name="apply_loyality_point"
                    style={{ width: "200px" }}
                    value={applyLoyalityPoint}
                    // onkeydown="if(event.key==='.'){event.preventDefault();}"
                    // oninput="event.target.value = event.target.value.replace(/[^0-9]*/g,'');"
                    disabled={paymentStatus == "Completed" || orderStatus == "Cancelled" ? true : false}
                    onChange={(e) => {
                      setApplyLoyalityPoint(e.target.value);
                      // validateOnInput(
                      //   "apply_loyality_point",
                      //   e.target.value
                      // );
                    }}
                    onBlur={(e) => {
                      validateOnBlur(
                        "apply_loyality_point",
                        e.target.value
                      );
                    }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {validationErrors.apply_loyality_point}
                </div>

              </div>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>
                    Loyality point price
                  </div>
                  <input
                    className={`${style.textInputBox} ${style.disabledInputBox}`}
                    type="text"
                    name="loyality_point_price"
                    style={{ width: "100px" }}
                    value={loyalityPointPrice}
                    disabled
                  // onChange={(e) => {
                  //   setAmountForSingleLoyalityPoint(e.target.value);
                  //   validateOnInput(
                  //     "amount_for_single_loyality_point",
                  //     e.target.value
                  //   );
                  // }}
                  // onBlur={(e) => {
                  //   validateOnBlur(
                  //     "amount_for_single_loyality_point",
                  //     e.target.value
                  //   );
                  // }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.amount_for_single_loyality_point} */}
                </div>
              </div>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>
                    Loyality point status
                  </div>
                  <input
                    className={`${style.textInputBox} ${style.disabledInputBox}`}
                    type="text"
                    name="loyality_point_status"
                    style={{ width: "100px" }}
                    value={loyalityPointStatus}
                    disabled

                  // onChange={(e) => {
                  //   setAmountForSingleLoyalityPoint(e.target.value);
                  //   validateOnInput(
                  //     "amount_for_single_loyality_point",
                  //     e.target.value
                  //   );
                  // }}
                  // onBlur={(e) => {
                  //   validateOnBlur(
                  //     "amount_for_single_loyality_point",
                  //     e.target.value
                  //   );
                  // }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.amount_for_single_loyality_point} */}
                </div>
              </div>
              {/* <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>
                    Loyality point calculated
                  </div>
                  <input
                    className={`${style.textInputBox}`}
                    type="checkbox"
                    name="allow_loyality_points"
                    style={{ width: "18px", height: "18px" }}
                    checked={loyalityPointCalculated}
                    disabled
                    
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>

                </div>
              </div> */}
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>
                    Discount in (₹)
                  </div>
                  <input
                    className={`${style.textInputBox}`}
                    type="text"
                    name="discount_rupees"
                    style={{ width: "200px" }}
                    value={discountRupee}
                    disabled={paymentStatus == "Completed" || orderStatus == "Cancelled" ? true : false}

                    onChange={(e) => {
                      setDiscountRupee(e.target.value);
                      // validateOnInput(
                      //   "amount_for_single_loyality_point",
                      //   e.target.value
                      // );
                    }}
                    onBlur={(e) => {
                      validateOnBlur(
                        "discount_rupees",
                        e.target.value
                      );
                    }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {validationErrors.discount_rupees}
                </div>
              </div>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Discount in (%)</div>
                  <input
                    className={`${style.textInputBox}`}
                    type="number"
                    name="discount_percentage"
                    style={{ width: "200px" }}
                    value={discountPercentage}
                    disabled={paymentStatus == "Completed" || orderStatus == "Cancelled" ? true : false}
                    onChange={(e) => {
                      setDiscountPercentage(e.target.value);
                      // validateOnInput("cgst", e.target.value);
                    }}
                    onBlur={(e) => {
                      validateOnBlur("discount_percentage", e.target.value);
                    }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {validationErrors.discount_percentage}
                </div>
              </div>

              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Discount reason</div>
                  <textarea
                    className={`${style.textInputBox}`}
                    type="text"
                    name="discount_reason"
                    style={{ width: "200px", height: "100px", resize: 'none' }}
                    value={discountReason}
                    disabled={paymentStatus == "Completed" || orderStatus == "Cancelled" || discountReason == undefined ? true : false}
                    onChange={(e) => {
                      setDiscountReason(e.target.value);
                      // validateOnInput("sgst", e.target.value);
                    }}
                    // onBlur={(e) => {
                    //   validateOnBlur("sgst", e.target.value);
                    // }}
                    maxLength={255}

                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {validationErrors.discount_reason}
                </div>
              </div>
            </div>



            {/* <div className={`${style.sectionInsideForm}`}>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Allow Half Price</div>
                  <input
                    className={`${style.textInputBox}`}
                    type="checkbox"
                    name="allow_half_price"
                    style={{ width: "18px", height: "18px" }}
                    checked={allowHalfPrice}
                    onChange={(e) => {
                      setAllowHalfPrice(e.target.checked);
                      validateOnInput("allow_half_price", e.target.value);
                    }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {validationErrors.allow_half_price}
                </div>
              </div>
            </div> */}
            {/* Aadded by Om Shrivastava on 22-06-23 
            Reason : Add Two classname for some fields like : calculation section, loyality point section, and rating review section */}
            <div className={`${style.sectionInsideForm} ${style.sectionInsideForm2}`}>


              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                  <div className={`${style.inputLabel} ${style.inputLabel2}`}>Subtotal</div>
                  <input
                    className={`${style.textInputBox} ${style.disabledInputBox} `}
                    type="text"
                    name="sub_total"
                    // style={{ width: "200px" }}
                    value={subTotal}
                    disabled

                  // maxLength={15}
                  // onChange={(e) => {
                  //   setGstin(e.target.value);
                  //   validateOnInput("gstin", e.target.value);
                  // }}
                  // onBlur={(e) => {
                  //   validateOnBlur("gstin", e.target.value);
                  // }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.gstin} */}
                </div>
              </div>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                  <div className={`${style.inputLabel} ${style.inputLabel2}`}>CGST</div>
                  <input
                    className={`${style.textInputBox} ${style.disabledInputBox}`}
                    type="text"
                    name="cgst"
                    // style={{ width: "200px" }}
                    value={cgst}
                    disabled

                  // maxLength={15}
                  // onChange={(e) => {
                  //   setGstin(e.target.value);
                  //   validateOnInput("gstin", e.target.value);
                  // }}
                  // onBlur={(e) => {
                  //   validateOnBlur("gstin", e.target.value);
                  // }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.gstin} */}
                </div>
              </div>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                  <div className={`${style.inputLabel} ${style.inputLabel2}`}>SGST</div>
                  <input
                    className={`${style.textInputBox} ${style.disabledInputBox}`}
                    type="text"
                    name="sgst"
                    // style={{ width: "200px" }}
                    value={sgst}
                    disabled

                  // maxLength={15}
                  // onChange={(e) => {
                  //   setGstin(e.target.value);
                  //   validateOnInput("gstin", e.target.value);
                  // }}
                  // onBlur={(e) => {
                  //   validateOnBlur("gstin", e.target.value);
                  // }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.gstin} */}
                </div>
              </div>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                  <div className={`${style.inputLabel} ${style.inputLabel2}`}>Total</div>
                  <input
                    className={`${style.textInputBox} ${style.disabledInputBox}`}
                    type="text"
                    name="total"
                    // style={{ width: "200px" }}
                    value={total}
                    disabled

                  // maxLength={15}
                  // onChange={(e) => {
                  //   setGstin(e.target.value);
                  //   validateOnInput("gstin", e.target.value);
                  // }}
                  // onBlur={(e) => {
                  //   validateOnBlur("gstin", e.target.value);
                  // }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.gstin} */}
                </div>
              </div>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                  <div className={`${style.inputLabel} ${style.inputLabel2}`}>Grand Total</div>
                  <input
                    className={`${style.textInputBox} ${style.disabledInputBox}`}
                    type="text"
                    name="grand_total"
                    // style={{ width: "200px" }}
                    value={finalAmount}
                    disabled

                  // maxLength={15}
                  // onChange={(e) => {
                  //   setGstin(e.target.value);
                  //   validateOnInput("gstin", e.target.value);
                  // }}
                  // onBlur={(e) => {
                  //   validateOnBlur("gstin", e.target.value);
                  // }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.gstin} */}
                </div>
              </div>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                  <div className={`${style.inputLabel} ${style.inputLabel2}`}>Rating</div>
                  <input
                    className={`${style.textInputBox} ${style.disabledInputBox}`}
                    type="text"
                    name="rating"
                    // style={{ width: "200px" }}
                    value={rating && rating ? rating : '----'}
                    disabled

                  // maxLength={15}
                  // onChange={(e) => {
                  //   setGstin(e.target.value);
                  //   validateOnInput("gstin", e.target.value);
                  // }}
                  // onBlur={(e) => {
                  //   validateOnBlur("gstin", e.target.value);
                  // }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.gstin} */}
                </div>
              </div>

              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                  <div className={`${style.inputLabel} ${style.inputLabel2}`}>Review</div>
                  {/* <textarea
                  
                    className=   {review && review ? `${style.hyyy} `:`${style.textInputBox} ${style.disabledInputBox} ${style.textAreaDefaultHeight}`}
                    type="text"
                    name="review"
                    style={{ resize:'none' }}
                    value={review && review ? review : '---'}
                    disabled
                  /> */}
                  <p
                  className= {`${style.textInputBox} ${style.disabledInputBox} `}
                  
                  style={{wordBreak:'break-word'}}>{review && review ?review:'ghjghj hghugyut fdstdtretrerterterererere gfgfgtr ewew'}</p>
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.fssaino} */}
                </div>
              </div>
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

            {/* <div
              className={` ${style.cancelButton}`}
              style={{
                marginRight: "10px",
              }}
              onClick={(e) => {
                resetSettingsForm();
                window.scrollTo(0, 0);
              }}
            >
              Clear
            </div> */}

            <div
              className={` ${style.proceedButton}`}
              onClick={() => {
                saveOrder();
                window.scrollTo(0, 0);
              }}
            >
              Save
            </div>
          </div>
        </form>
      </div>
    </Header>
  );
};

export default OrderForm;
