import React, { useEffect } from "react";
import style from "./orderform.module.css";
import Header from "../GlobalComponent/Header";
import { Message } from "../../App";
import { Input, Button, Modal, notification, Drawer, Form, message, Rate, Popconfirm,Select } from 'antd';
import { enableHeader } from "../../App";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getOrderDetailsApi,
  getOrderItemsApi,
  saveOrderDetailsApi,
} from "../../Api/services";
import { useState } from "react";
import AddOrderItemForm from "./AddOrderItemForm";
import { BsPencilSquare } from "react-icons/bs";
import Loader from "../../../src/Pages/GlobalComponent/Loader";

const OrderForm = () => {
  const navigate = useNavigate();
  const { Option } = Select;

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
  // Modification and addition by Om Shrivastava on 02-09-23
  // Reason : Set the data in onchange
  // const [orderStatus, setOrderStatus] = useState(null);
  const [orderStatus, setOrderStatus] = useState("Placed");
  // End of Modification and addition by Om Shrivastava on 02-09-23
  // Reason : Set the data in onchange

  // Modification and addition by Om Shrivastava on 02-09-23
  // Reason : Set the data in onchange
  // const [paymentStatus, setPaymemntStatus] = useState(null);
  const [paymentStatus, setPaymemntStatus] = useState("Pending");
  // End of Modification and addition by Om Shrivastava on 02-09-23
  // Reason : Set the data in onchange
  // Modified by pratap sahu on 26-09-2023
  // Reason:To set default mode as cash
  // const [paymentMode, setPaymentMode] = useState(null);
  const [paymentMode, setPaymentMode] = useState("Cash");
  //End of Modification by pratap sahu on 26-09-2023
  // Reason:To set default mode as cash

  // Modification and addition by Om Shrivastava on 02-09-23
  // Reason : Set the data in onchange
  // const [cancelledBy, setCancelledBy] = useState(null);
  const [cancelledBy, setCancelledBy] = useState("Admin");
  // End of Modification and addition by Om Shrivastava on 02-09-23
  // Reason : Set the data in onchange
  const [cancelReaon, setCancelReason] = useState(null);

  const [discountRupee, setDiscountRupee] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  /* Added by ROhan kansari - 28/6/23 */
  const [discountprice, setDiscountprice] = useState(null)
  /* Modified by ROhan kansari - 30/6/23 */
  const [discountReason, setDiscountReason] = useState("");
  const [applyLoyalityPoint, setApplyLoyalityPoint] = useState(null);
  const [loyalityPointPrice, setLoyalityPointPrice] = useState(null);
  const [loyalityPointStatus, setLoyalityPointStatus] = useState(null);
  const [loyalityPointCalculated, setLoyalityPointCalculated] = useState(null);
  const [customerLoyalitypoint, setcustomerLoyalitypoint] = useState(null);
  /* Added by ROhan kansari - 28/6/23 */
  const [settings, setSettings] = useState({})

  const [subTotal, setSubTotal] = useState(null);
  const [cgst, setCGST] = useState(null);
  const [total, setTotal] = useState(null);
  const [sgst, setSGST] = useState(null);
  const [finalAmount, setFinalAmount] = useState(null);
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState(null);

  var [orderItems, setOrderItems] = useState([]);
  // const [orderStatusSelected, setOrderStatus] = useState("");

  // Added by Rohan knasari - 4/8/23
  // Reason - To Make table number changable otherwise show as label
  var [IsTableEditable, setTableEditable] = useState(false)
  // End of code - Rohan kansari - 4/8/23 

  // Added by Om on 02-09-23
  // Reason : Add Loader whenever the data enter from backend site
  const [isLoader, setIsLoader] = useState(true)
  // End of addition by Om Shrivastava on 02-09-23

  // Added by Om Shrivatava on on 18-06-23
  // Reason : Set the validation in all fields

  const [validationErrors, setValidationErrors] = useState({
    // Commented code by Om Shrivastava on 30-07-23
    // Reason : Set new usestate for validation 
    // discount_rupees: "",
    // discount_percentage: "",
    // End of commented code by Om Shrivastava on 30-07-23
    // Reason : Set new usestate for validation 
    apply_loyality_point: "",
    order_status: "",
    payment_status: "",
    cancelled_by: "",
    // cancel_reason:"",
    discount_reason: ""
  });

  // Addition by Om Shrivastava on 30-07-23
  // Reason : Set new usestate for validation 
  const [validationDiscountErrors, setDiscountValidationErrors] = useState({
    discount_rupees: "",
    discount_percentage: "",
  });
  // End of Addition by Om Shrivastava on 30-07-23
  // Reason : Set new usestate for validation 

  const [validationForOrderCancel, setValidationForOrderCancel] = useState("")
  // End of addition by Om Shrivastava on 18-06-23

  useEffect(() => {
    // Added By Rohan Kansari - 25/6/23
    // Reason - To enable headerSiderbar
    enableHeader()
    // End of code - Rohan kansari - 25/6/23
    getOrderDetail();
  }, []);


  //   {/* Added by Om Shrivastava on 24-06-23
  //  Reason: When user add more item than show the modal */}

  const [modalVisible, setModalVisible] = useState(false);
  //  const handlemoreItemOk = () => {
  //   setModalVisible(false);
  //  };
  const handlemoreItemCancel = () => {
    setModalVisible(false);
    //  form.resetFields()
  };

  const showmoreItemModal = () => {
    setModalVisible(true);
  };

  //  End of addition by Om Shrivastava on 24-06-23 
  //  Reason: When user add more item than show the modal

  // Added by Om Shrivastava on 25-06-23
  // Reason : Get all order items

  useEffect(() => {
    getOrderItems();
  }, []);
  // End of addition

  useEffect(() => {
    getOrderItems();
  }, [modalVisible]);

  const getOrderItems = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    var response = await getOrderItemsApi(tenant, id);
    if (response.msg) {
      setOrderItems(response.orderItems);
      // setOrderStatus(response.orderDetail.order_status);
      // setCustomerDetail(response.customerDetail);
      // setOrderDetail(response.orderDetail);

      // setPaymentStatus(response.orderDetail.payment_status);
      // setDiscountReason(response.orderDetail.discount_reason);
      // setDiscountRupees("" + response.orderDetail.discount_rupees)
      // setDiscountPercentage("" + response.orderDetail.discount_percentage)
      // setLoyalityAmount("" + response.orderDetail.apply_loyality_point)
      // setSettingData(response.settingData)
      // setOriginalResponseOrderItem(response.orderItems)
      // setOriginalResponseOrder(response.orderDetail)
      // setOrderCancelReason(response.orderDetail.cancel_reason);


    }
  };
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
        // Added by Om on 02-09-23
        // Reason : Add Loader whenever the data enter from backend site
        setIsLoader(false)
        // End of addition by Om Shrivastava on 02-09-23
        setorderDetailsObj(filterOrderObj);
        setOrderId(filterOrderObj.order_id);
        setTablenumber(filterOrderObj.table_number);

        setOrderStatus(filterOrderObj.order_status);
        setPaymemntStatus(filterOrderObj.payment_status);
        setPaymentMode(filterOrderObj.payment_mode);
        setCancelledBy(filterOrderObj.cancelled_by);
        setCancelReason(filterOrderObj.cancel_reason);

        setDiscountRupee(filterOrderObj.discount_rupees);
        /* Added by ROhan kansari - 28/6/23 */
        setDiscountprice(filterOrderObj.discount_rupees)
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

        // Added by Rohan Kansari - 28/6/23
        // Reason - To set setting values
        setSettings(response.setting)
        // end of code - ROhan kansari - 28/6/23
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
            // Modification and addition by Om Shrivastava on 12-07-23 Reason :Set the validation when loyality price is greater to subtotal
            // const error = {
            //   apply_loyality_point: "",
            // };
            // setValidationErrors({ ...validationErrors, ...error });
            if (subTotal < loyalityPointPrice) {
              const error = {
                apply_loyality_point: "Loyality price should be less than to sub-total.",
              };
              setValidationErrors({ ...validationErrors, ...error });
            } else {
              const error = {
                apply_loyality_point: "",
              };
              setValidationErrors({ ...validationErrors, ...error });
            }
            //End of Modification and addition by Om Shrivastava on 12-07-23 Reason :Set the validation when loyality price is greater to subtotal
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

          // if (value < 0 || finalAmount < value) {
          if (value < 0 || subTotal < value) {

            const error = {

              // discount_rupees: "Discount must be greater than or equal to 0 and below the grand total.",
              discount_rupees: "Discount should not be greater than to Sub-Total.",

            };
            // Modification and addition by Om Shrivastava on 30-07-23
            // Reason : Set new usestate for validation 
            // setValidationErrors({ ...validationErrors, ...error });
            setDiscountValidationErrors({ ...validationDiscountErrors, ...error });
            // End of addition and modification by Om Shrivastava on 30-07-23
            // Reason : Set new usestate for validation 

          } else {
            const error = {
              discount_rupees: "",
            };
            // Modification and addition by Om Shrivastava on 30-07-23
            // Reason : Set new usestate for validation 
            // setValidationErrors({ ...validationErrors, ...error });
            setDiscountValidationErrors({ ...validationDiscountErrors, ...error });
            // End of addition and modification by Om Shrivastava on 30-07-23
            // Reason : Set new usestate for validation 

          }
        } else {
          const error = {
            discount_rupees: "discount must be a number.",
          };
          // Modification and addition by Om Shrivastava on 30-07-23
          // Reason : Set new usestate for validation 
          // setValidationErrors({ ...validationErrors, ...error });
          setDiscountValidationErrors({ ...validationDiscountErrors, ...error });
          // End of addition and modification by Om Shrivastava on 30-07-23
          // Reason : Set new usestate for validation 


        }
      } else {
        const error = {
          discount_rupees: "Please enter discount.",
        };
        // Modification and addition by Om Shrivastava on 30-07-23
        // Reason : Set new usestate for validation 
        // setValidationErrors({ ...validationErrors, ...error });
        setDiscountValidationErrors({ ...validationDiscountErrors, ...error });
        // End of Modification and addition by Om Shrivastava on 30-07-23
        // Reason : Set new usestate for validation 

      }
    }

    if (inputName == "discount_percentage") {
      if (value.toString().length > 0) {
        if (!isNaN(value)) {
          if (value < 0 || value >= 100) {
            const error = {

              discount_percentage: "Discount in percentage must be greater than or equal to 0 and 100",

            };
            // Modification and addition by Om Shrivastava on 30-07-23
            // Reason : Set new usestate for validation 
            // setValidationErrors({ ...validationErrors, ...error });
            setDiscountValidationErrors({ ...validationDiscountErrors, ...error });
            // End of modification  // Modification and addition by Om Shrivastava on 30-07-23
            // Reason : Set new usestate for validation 


          } else {
            const error = {
              discount_percentage: "",
            };
            // Modification and addition by Om Shrivastava on 30-07-23
            // Reason : Set new usestate for validation 
            // setValidationErrors({ ...validationErrors, ...error });
            setDiscountValidationErrors({ ...validationDiscountErrors, ...error });
            // End of modification  // Modification and addition by Om Shrivastava on 30-07-23
            // Reason : Set new usestate for validation 

          }
        } else {
          const error = {
            discount_percentage: "discount in percentage must be a number.",
          };
          // Modification and addition by Om Shrivastava on 30-07-23
          // Reason : Set new usestate for validation 
          // setValidationErrors({ ...validationErrors, ...error });
          setDiscountValidationErrors({ ...validationDiscountErrors, ...error });
          // End of modification  // Modification and addition by Om Shrivastava on 30-07-23
          // Reason : Set new usestate for validation 

        }
      } else {
        const error = {
          discount_percentage: "Please enter discount in percentage",
        };
        // Modification and addition by Om Shrivastava on 30-07-23
        // Reason : Set new usestate for validation 
        // setValidationErrors({ ...validationErrors, ...error });
        setDiscountValidationErrors({ ...validationDiscountErrors, ...error });
        // End of modification  // Modification and addition by Om Shrivastava on 30-07-23
        // Reason : Set new usestate for validation 

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
  // Added by Om Shrivastava on 02-09-23
  // Reason : Set the data in onchange
  const handleChangeCancellStatus = (value) => {
    setCancelledBy(value);
   
  };

  //Commented and Added by Pratap sahu on 19-09-2023
  // Reason - To pass validation message on changing of order status

  // const handleChangeOrderStatus = (value) => {
  //   setOrderStatus(value);
  // };
  // const handleChangePaymentStatus = (value,) => {
  //   setPaymemntStatus(value);
 // };
  function handleChangeStatus(order_status, payment_status, msgEnable) {
    if (orderDetailsObj?.order_status == "Placed" && (order_status == "Cooked" || order_status == "Served")) {
        if (msgEnable)
            Message("Please first change order status to confirm ", "error")
        return false;
    }

    else if (orderDetailsObj?.order_status == "Confirm" && (order_status == "Placed")) {
        if (msgEnable)
            Message("You cant change order status confirm to placed", "error")
        return false;
    }

    else if (orderDetailsObj?.order_status == "Cooked" && (order_status == "Confirm" || order_status == "Placed")) {
        if (msgEnable)
            Message(`You cant change order status cooked to ${order_status}`, "error")
        return false;
    }
    else if (orderDetailsObj?.order_status == "Served" && (order_status == "Confirm" || order_status == "Placed" || order_status == "Cooked")) {
        if (msgEnable)
            Message(`You cant change order status served to ${order_status}`, "error")
        return false;
    }
    else if (orderDetailsObj?.order_status == "Cancelled" && (order_status == "Pending" || order_status == "Confirm" || order_status == "Placed" || order_status == "Cooked" || order_status == "Served")) {
        if (msgEnable)
            Message(`You cant change order status cancel to ${order_status}`, "error")
        return false;
    }
    else if (orderDetailsObj?.order_status == "Placed" && payment_status == "Completed") {
        if (msgEnable)
            Message(`You cant change payment status completed till order is not confirmed.`, "error")
        return false;
    }
    else if (orderDetailsObj?.payment_status == "Completed" && (payment_status == "Pending")) {
        if (msgEnable)
            Message(`You cant change payment status completed to ${payment_status}`, "error")
        return false;
    }
    else if ((orderDetailsObj?.payment_status == "Completed" || orderDetailsObj?.payment_status == "Paid") && (order_status == "Cancelled")) {
        if (msgEnable)
            Message(`You can't cancel order if payment is ${payment_status}`, "error")
        return false;
    }

    else if (orderDetailsObj?.order_status == "Cancelled" && (payment_status == "Completed")) {
        if (msgEnable)
            Message(`You can't complete payment if order is ${order_status}`, "error")
        return false;
    }

    else if (orderDetailsObj?.order_status == "Cancelled") {
        if (msgEnable)
            Message("You Can't change status if order is cancelled", "error")

        return false;
    }
    else
        return true;
  }
    // End of Addition by Pratap sahu on 19-09-2023
    // Reason - To pass validation message on changing of order status
  
  // End of addition by Om Shrivastava on 02-09-23
  // Reason : Set the data in onchange
  const saveOrder = async () => {

    var allowDataPost = false;

    // Commented by Rohan kansari - 4/8/23
    // Reason - To make only one condition block
    // if (validationErrors.apply_loyality_point == "") {
    //   allowDataPost = true;
    //   console.log("validation error true")

    // }
    // else {
    //   allowDataPost = false
    //   console.log("validation error false")

    // }
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

    // if ((cancelReaon == null || cancelReaon == undefined || cancelReaon.toString().trim() == '') && orderStatus == "Cancelled") {
    //   allowDataPost = false;

    //   // const error = {
    //   //   cancel_reason: "Please enter cancel reason"
    //   // };
    //   setValidationForOrderCancel("Please enter cancel reason");
    //   // setValidationForOrderCancel({ ...validationForOrderCancel, ...error });

    //   console.log('if part')
    // }

    // End of commeting - Rohan kansari - 4/8/23


    // Addition by Om Shrivastava on 31-07-23
    // Reason : Set the validation error for discount percentage and discount rupee
    // Modified by Rohan kansari - 4/8/23
    // Reason - To change validation and make only one condition block for all error
    // if (validationDiscountErrors.discount_percentage != "" || validationDiscountErrors.discount_rupees != ""  || (typeof validationErrors.table_number !="undefined" && validationErrors.table_number!="")  ) {
    // Modified by Rohan kansari -21/8/23- To check is there is key present or not  
    if ((typeof validationErrors.discount_percentage !="undefined" &&  validationDiscountErrors.discount_percentage != "") || (typeof validationErrors.discount_rupees !="undefined" && validationDiscountErrors.discount_rupees != "")  || (typeof validationErrors.table_number !="undefined" && validationErrors.table_number!="") || (typeof validationErrors.apply_loyality_point !="undefined" && validationErrors.apply_loyality_point != "") ) {
      if((cancelReaon == null || cancelReaon == undefined || cancelReaon.toString().trim() == '') && orderStatus == "Cancelled"){
        setValidationForOrderCancel("Please enter cancel reason");
      }
      allowDataPost = false
      console.log("validation error false",validationErrors.table_number)
    }
    else {
      allowDataPost = true
      console.log("validation error true")
      if((cancelReaon == null || cancelReaon == undefined || cancelReaon.toString().trim() == '') && orderStatus == "Cancelled"){
        setValidationForOrderCancel("Please enter cancel reason");
        allowDataPost=false
      }
    }
    // End of Modification - Rohan kansari - 4/8/23 - To change validation and make only one condition block for all error

    // End of addition by Om Shrivastava on 31-07-23
    // Reason : Set the validation error for discount percentage and discount rupee

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
      // Added by Rohan kansari - 30/6/23 - To update table no. also
      updatedOrderData.append("table_number", tablenumber);
      updatedOrderData.append("discount_rupees", discountRupee);
      updatedOrderData.append("discount_percentage", discountPercentage);
      updatedOrderData.append("apply_loyality_point", applyLoyalityPoint);
      updatedOrderData.append("order_status", orderStatus);
      updatedOrderData.append("payment_status", paymentStatus);
      updatedOrderData.append("cancelled_by", cancelledBy);
      updatedOrderData.append("cancel_reason", cancelReaon);
      updatedOrderData.append("discount_reason", discountReason);
        // Added by pratap sahu on 26-09-2023
        // Reason: To Update Payment Mode
      updatedOrderData.append("payment_mode",paymentMode);
        // End of Addition by pratap sahu on 26-09-2023
        // Reason: To Update Payment Mode

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

  // Added by Rohan kansari - 28/6/23
  // Reason - To validate field again
  // useEffect(() => {
  //   if (discountPercentage != null) {
  //     validateOnBlur("discount_percentage", discountPercentage);
  //   }
  //   if (discountRupee != null)
  //     validateOnBlur(
  //       "discount_rupees",
  //       discountRupee
  //     );
   
  // }, [discountRupee, discountPercentage])
  // End of code - Rohan kansari - 28/6/23

  // Addition by Om Shrivastava on 31-07-23
  // Reason : Set the validation error for discount percentage and discount rupee
  const resetValidation = () => {

    // modified by - Rohan kansari - 18/8/23
    // Reason - To set object type in resetting
    // setValidationErrors("")
    setValidationErrors({})
    // End of code by - Rohan kansari - 18/8/23
    // setDiscountValidationErrors("")
    setValidationForOrderCancel("")
  };
  // End of addition by Om Shrivastava on 31-07-23
  // Reason : Set the validation error for discount percentage and discount rupee


  return (
    // Modified by Rohan Kansari - 25/6/23
    // Reason - removing header from each page and making it global
    // <Header>
    <div className={style.container}>
      <div className={style.titleContainer}>
        {/* <div className={style.backButton}><BiArrowBack style={{width:"30px",height:"30px"}}/></div> */}
        <div className={style.pageTitle} style={{ fontSize: "25px" }}>Order</div>
      </div>
      {/* // Addition by Om Shrivastava on 02-09-23
    // Reason : Apply the loader in order form page */}
      {isLoader == true ? <Loader/> :  
    <div >
      {/* End of addition by Om Shrivastava on 02-09-23
    // Reason : Apply the loader in order form page */}
      <form className={style.settingSection}>
        {/* Added by Om Shrivastava on 30-06-23 Reason : Need to show the add more item in top right corner */}
        {/* <div style={{display:'flex',justifyContent:'end',margin:'-5px',}}>
          <div
            className={orderDetailsObj.payment_status == "Completed" || orderDetailsObj.order_status == "Cancelled" ? `${style.addMoreItemButtonDisabled}` : ` ${style.addMoreItemButton}`}
            style={{
              marginRight: "10px",
            }}
            onClick={(e) => {
              //// resetSettingsForm();
              //// window.scrollTo(0, 0);
              setModalVisible(true)
            }}
          >
            Add more item
          </div>
        </div> */}
        {/* End of addition by Om Shrivastava on 30-06-23 Reason : Need to show the add more item in top right corner */}
        <div className={style.formContainer} style={{
          display: 'flex',
          flexWrap: 'wrap'
        }}>
          <div className={`${style.sectionInsideForm}`}>
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>Order Id</div>
                <input
                  // Modifed by ROhan kansari - 30/6/23
                  // Reason - To make order id non editable
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
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
                {/* Added by ROhan kansari - 4/8/23 
                    Reason - To send table number change alert message  */}
                {IsTableEditable ?
                  <><input
                    className={orderDetailsObj.payment_status == "Completed" && orderDetailsObj.order_status == "Cancelled" ? `${style.disabledInputBox}` : `${style.textInputBox}`}
                    disabled={orderDetailsObj.payment_status == "Completed"? true : false}
                    type="text"
                    name="table_number"
                    value={tablenumber}
                    // Modifed by ROhan kansari - 30/6/23
                    // Reason - To make tabel no. editable
                    onChange={e => {
                      if(e.target.value.length==0){
                        validationErrors.table_number="Table should not be blank."
                        setValidationErrors({...validationErrors})
                        setTablenumber(e.target.value)
                      }else{
                        validationErrors.table_number=""
                        setValidationErrors({...validationErrors})
                        setTablenumber(e.target.value)
                      }
                    }}
                    style={{ width: "200px" }}
                    // onFocus={(e)=>{
                    //   if(whatsappNumber.length==13)
                    //     setWhatsappNumber(whatsappNumber.substring(3,13))
                    // }}
                    // onChange={(e) => {
                    //   setWhatsappNumber(e.target.value);
                    //   validateOnInput("whatsapp_number", e.target.value);
                    // }}
                    onKeyUp={e => {
                      if (e.key == "Enter" || e.keyCode == 13) {
                        if(tablenumber.length>0)
                        setTableEditable(false)
                      }
                    }}
                    onBlur={(e) => {
                      if(tablenumber.length>0)
                      setTableEditable(false)
                    }}
                    maxLength={10}
                  />
                  </>
                  :
                  <>
                    {tablenumber}
                    <Popconfirm
                      title="Are you sure you want to change table number?"
                      onConfirm={e => { setTableEditable(true) }}
                      // onCancel={e => { setTableConfirm(false) }}
                      cancelText="Cancel"
                      okText="Ok"
                      placement='bottomLeft'
                    >
                      <BsPencilSquare onClick={e => {
                        // if (inputEnable != "tableEdit") {

                        // }
                        // else setInputEnable(null)
                      }
                      } style={{ margin: "5px 10px" }} />
                    </Popconfirm>
                  </>}
                  {/* ENd of code - ROhan kansari - 4/8/23 */}
              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationErrors.table_number}
              </div>
            </div>


            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>Order Status</div>
                <Select
                  className={`${style.textInputBox}`}
                  name="order_status"
                  style={{ width: "200px" }}

                  value={orderStatus}
                  // defaultValue={orderStatus ? orderStatus : null}
                  // Modification and additon by Om Shrivastava on 02-09-23
                  // Reason : Set the data in onchange of order cancell by status
                  // onChange={(e) => {
                  //   setOrderStatus(e.target.value);
                  //   //   validateOnInput("app_theme", e.target.value);
                  // }}

              // Addition by Pratap sahu on 19-09-2023
              // Reason - To pass validation message on changing of order status
                  // onChange={handleChangeOrderStatus}
                  onChange={e=>{if(handleChangeStatus(e,orderDetailsObj.payment_status,true))setOrderStatus(e);}}
                  disabled={orderDetailsObj.payment_status == "Completed"? true : false}

              // End of Addition by Pratap sahu on 19-09-2023
              // Reason - To pass validation message on changing of order status

                  // End of Modification and additon by Om Shrivastava on 02-09-23
                  // Reason : Set the data in onchange of order cancell by status
                >
                   {/* Modification and addition by Om Shrivastava on 31-08-23
                  Reason : change the option html tag to antd option tag */}
                  {/* <option value="Placed" selected={orderStatus == "Placed" ? true : false}>Placed</option>
                  <option value="Confirm" selected={orderStatus == "Confirm" ? true : false}>Confirm</option>
                  <option value="Cooked" selected={orderStatus == "Cooked" ? true : false}>Cooked</option>
                  <option value="Served" selected={orderStatus == "Served" ? true : false} >Served</option>
                  <option value="Cancelled" selected={orderStatus == "Cancelled" ? true : false} >Cancelled</option> */}
                  <Option value="Placed">Placed</Option> 
                  <Option value="Confirm">Confirm</Option> 
                  <Option value="Cooked">Cooked</Option> 
                  <Option value="Served">Served</Option> 
                  <Option value="Cancelled">Cancelled</Option>
                  {/* End of modification and addition by Om Shrivastava on 31-08-23
                  Reason : change the option html tag to antd option tag  */}
                </Select>
              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationErrors.order_status}
              </div>
            </div>

            {/* Added by Rohan kansari - 30/6/23
                Reason - To change location of cancel reason */}
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>Cancel reason</div>
                <textarea
                  // Modifed by ROhan kansari - 30/6/23
                  // Reason - To make tabel no. editable
                  // className={orderDetailsObj.payment_status == "Completed" && orderDetailsObj.order_status == "Cancelled" ? `${style.disabledInputBox}` : `${style.textInputBox}`}

                // commented and modified by pratap sahu on 20-09-2023
                // Reason: for cancel reason input box syling when disabled
                  // className={orderDetailsObj.order_status == "Cancelled"? `${style.textInputBox}` : `${style.disabledReasonInputBox}`}
                  className={orderDetailsObj.order_status == "Cancelled"|| orderDetailsObj.payment_status == "Completed" ? `${style.disabledReasonInputBox}` : `${style.textInputBox}`}
                // End of comment and modification by pratap sahu on 20-09-2023
                // Reason: for cancel reason input box syling when disabled

                  type="text"
                  name="cancel_reason"
                  value={cancelReaon}
                  // style={orderDetailsObj.payment_status == "Completed" &&
                  //   orderDetailsObj.order_status == "Cancelled" ? { padding: "10px 0", minHeight: "20px", resize: 'none' } :
                  //   { width: "200px", height: "100px", resize: 'none' }}
                    // Commented and modified by pratap sahu on 20-09-2023
                    // Reason:To Disable the field when payment paymentStatus is completed & vise versa for orderStatus is canceled
                  // disabled={orderDetailsObj.payment_status == "Completed" && orderDetailsObj.order_status == "Cancelled" ? true : false}
                  disabled={orderDetailsObj.payment_status == "Completed"|| orderDetailsObj.order_status == "Cancelled"? true : false}
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



            {/* End of code - Rohan kansari - 30/6/23 */}

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>Payment Status</div>
                <Select
                  className={`${style.textInputBox}`}
                  name="payment_status"
                  style={{ width: "200px" }}
                  // Modification and addition by Om Shrivastava on 02-09-23
                  // Reason : Set the payment status in usestate 
                  value={paymentStatus}
                  // defaultValue={paymentStatus ? paymentStatus : null}
                  // onChange={(e) => {
                  //   setPaymemntStatus(e.target.value);
                  //   // validateOnInput("app_theme", e.target.value);
                  // }}              
              // Addition by Pratap sahu on 19-09-2023
              // Reason - To pass validation message on changing of order status & implement disable feature
                  // onChange={handleChangePaymentStatus}
                  onChange={e=>{if(handleChangeStatus(orderDetailsObj.order_status,e,true))setPaymemntStatus(e);}}
                  disabled={orderDetailsObj.payment_status == "Completed" || orderDetailsObj.order_status=="Cancelled"? true : false}
              // End of Addition by Pratap sahu on 19-09-2023
              // Reason - To pass validation message on changing of order status

                  // End of Modification and addition by Om Shrivastava on 02-09-23
                  // Reason : Set the payment status in usestate  
                >
                  {/* Added by Om Shrivastava on 04-08-23
                  Reason : Set the payment status paid  */}
                  {/* {orderDetailsObj.payment_status == "Paid" ?
                    <option value="Paid" disabled selected={paymentStatus == "Paid" ? true : false}>Paid</option>
                    :null} */}
                  {/* End of addition by Om Shrivastava on 04-08-23
                  Reason : Set the payment status paid */}
                  {/* <option value="Pending" selected={paymentStatus == "Pending" ? true : false}>Pending</option>
                  <option value="Completed" selected={paymentStatus == "Completed" ? true : false}>Completed</option> */}
                  <Option value="Pending">Pending</Option> 
                  <Option value="Completed">Completed</Option>
                  {/* // End of Modification and addition by Om Shrivastava on 02-09-23
                  // Reason : Set the payment status in usestate and change the option html tag to antd option tag */}
                </Select>
              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationErrors.payment_status}
              </div>
            </div>
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel} `}>Payment mode</div>
              {/* Commented & Added by pratap sahu on 26-09-2023
                  Reason: To Add Select DropDown Functionality in Payment Mode */}
                {/* <input
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
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
                /> */}
                  <Select
                        name="payment"
                        value={orderDetailsObj?.payment_mode}
                        onChange={(value) => {
                            setPaymentMode(value);
                            orderDetailsObj.payment_mode = value;
                        }}
                        disabled={(orderDetailsObj.payment_status == "Completed" || orderDetailsObj.order_status=="Cancelled")? true : false}
                        style={{
                            width: 200,
                            height:35,
                            border: "0.5px solid black",
                            borderRadius: "5px",
                            fontSize: "8px",
                        }}>
                        <Option value="Cash">Cash</Option>
                        <Option value="Scanner">Scanner</Option>
                    </Select>
                    {/*End of Comment & Addition by pratap sahu on 26-09-2023
                        Reason: To Add Select DropDown Functionality in Payment Mode */}

              </div>
              <div className={`${style.inputErrorArea}`}>
                {/* {validationErrors.whatsapp_number} */}
              </div>
            </div>
            {/* Modification by Om Shrivastava on 02-07-23 REason : Change the position of cards in this page */}
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>Order cancelled by </div>
                {/* Addition and Modification by Om Shrivastava on 23-06-23
                  Reason : Show the cancel field, only read only */}
                <Select
                  className={`${style.textInputBox}`}
                  name="cancelled_by"
                  style={{ width: "200px" }}
                  value={cancelledBy}
                  // Modification and additon by Om Shrivastava on 02-09-23
                  // Reason : Set the data in onchange of order cancell by status
                  // onChange={(e) => {
                  //   setCancelledBy(e.target.value);
                  //   // validateOnInput("app_theme", e.target.value);
                  // }}
                  onChange={handleChangeCancellStatus}
                  // End of Modification and additon by Om Shrivastava on 02-09-23
                  // Reason : Set the data in onchange of order cancell by status
                >
                  {/* <option value=""  selected={cancelledBy && cancelledBy ||cancelledBy == ""||cancelledBy == null||cancelledBy == undefined ? true : false}>---</option> */}
                  {/* Modification and addition by Om Shrivastava on 31-08-23
                  Reason : change the option html tag to antd option tag */}
                  {/* <option value="Admin" selected={cancelledBy == "Admin" ? true : false}>Admin</option>
                  <option value="Customer" selected={cancelledBy == "Customer" ? true : false}>Customer</option> */}
                  <Option value="Admin">Admin</Option> 
                  <Option value="Customer">Customer</Option>
                  {/* End of modification and addition by Om Shrivastava on 31-08-23
                  Reason : change the option html tag to antd option tag  */}
                </Select>
                {/* <input
                    className={`${style.textInputBox} ${style.disabledInputBox}`}
                    type="text"
                    name="cancelled_by"
                    style={{ width: "100px" }}
                    value={cancelledBy && cancelledBy ?cancelledBy:"----"}
                    disabled
                  /> */}
                {/* End of addition and Modification by Om Shrivastava on 23-06-23 */}
                {/* End of addition by Om Shrivastava on 23-06-23 */}
              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationErrors.cancelled_by}
              </div>
            </div>
            {/* End of addition by Om Shrivastava on 02-07-23 */}
            {/* Modification and addition by Om Shrivastava on 12-07-23 
            Reason : When user cannot select the loyality point status in setting table than loyality point labels doesn't show */}
            {settings.allow_loyality_points && settings.allow_loyality_points == true ?
              <>
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
                  {/* End of addition by Om Shrivastava on 02-07-23 */}

                </div>
                {/* Modification by Om Shrivastava on 02-07-23 REason : Change the position of cards in this page */}

                <div className={`${style.inputContainer}`}>
                  <div className={`${style.inputArea}`}>
                    <div className={`${style.inputLabel}`}>
                      Apply loyality point
                    </div>
                    <input
                      // Modification and addition by Om Shrivastava on 01-07-23 Reason : When payment status is paid than this field is disable
                      // Modification and addition by Om Shrivastava on 15-07-23 
                      // Reason : Set the validation for apply loyality point
                      // className={loyalityPointStatus == "is used" || paymentStatus == "Paid" || orderDetailsObj.payment_status == "Completed" || orderDetailsObj.order_status == "Cancelled" ? `${style.disabledInputBox}` : `${style.textInputBox}`}
                      // Modification and addition by Om Shrivastava on 21-07-23
                      // Reason : When payment status is paid or completed then loyality field is disable
                      // className={orderDetailsObj.loyality_point_status == "is used" || orderDetailsObj.payment_status == "Paid" || orderDetailsObj.payment_status == "Completed" || orderDetailsObj.order_status == "Cancelled" ? `${style.disabledInputBox}` : `${style.textInputBox}`}
                      className={orderDetailsObj.payment_status == "Paid" || orderDetailsObj.payment_status == "Completed" || orderDetailsObj.order_status == "Cancelled" ? `${style.disabledInputBox}` : `${style.textInputBox}`}
                      // End of addition and modification and addition by Om Shrivastava on 21-07-23
                      // Reason : When payment status is paid or completed then loyality field is disable
                      // End of addition and modification by Om Shrivastava on 15-07-23 
                      // Reason : Set the validation for apply loyality point
                      // End of addition by Om Shrivastava on 01-07-23 Reason :  When payment status is paid than this field is disable
                      type="text"
                      // type="number"
                      name="apply_loyality_point"
                      style={{ width: "200px" }}
                      value={applyLoyalityPoint}
                      // onkeydown="if(event.key==='.'){event.preventDefault();}"
                      // oninput="event.target.value = event.target.value.replace(/[^0-9]*/g,'');"
                      // Modification and addition by Om Shrivastava on 01-07-23 Reason : When payment status is paid than this field is disable
                      // Modification and addition by Om Shrivastava on 15-07-23 
                      // Reason : Set the validation for apply loyality point
                      // disabled={paymentStatus == "Completed" || orderStatus == "Cancelled" || loyalityPointStatus == "is used" || paymentStatus == "Paid" ? true : false}
                      // Modification and addition by Om Shrivastava on 21-07-23
                      // Reason : When payment status is paid or completed then loyality field is disable
                      // disabled={orderDetailsObj.payment_status == "Completed" || orderDetailsObj.order_status == "Cancelled" || orderDetailsObj.loyality_point_status == "is used" || orderDetailsObj.payment_status == "Paid" ? true : false}
                      disabled={orderDetailsObj.payment_status == "Completed" || orderDetailsObj.order_status == "Cancelled" || orderDetailsObj.payment_status == "Paid" ? true : false}
                      // Reason : Set the validation for apply loyality point
                      // End of addition by Om Shrivastava on 01-07-23 Reason :  When payment status is paid than this field is disable
                      // End of addition and modification by Om Shrivastava on 15-07-23 
                      // Reason : Set the validation for apply loyality point
                      // End of addition by Om Shrivastava on 01-07-23 Reason :  When payment status is paid than this field is disable
                      onChange={(e) => {
                        setApplyLoyalityPoint(e.target.value);
                        setLoyalityPointPrice(settings.per_loyality_point_value * e.target.value)
                        // subtracting subtotal - to loyality point then we get total
                        var total = orderDetailsObj.sub_total - (settings.per_loyality_point_value * e.target.value) - discountprice
                        setTotal(total)

                        //Modification and Added by Om shrivastava on 22-07-23
                        // Reason : Set the cgst and sgst
                        var get_cgst = (orderDetailsObj.cgst / orderDetailsObj.total) * 100
                        var cgst = (total / 100) * get_cgst
                        setCGST(cgst)
                        // Added by Om Shrivastava on 23-07-23 
                        // Reason : Set the sgst new value in onchange
                        var get_sgst = (orderDetailsObj.sgst / orderDetailsObj.total) * 100
                        var sgst = (total / 100) * get_sgst
                        setSGST(sgst)
                        // End of addition by Om Shrivastava on 23-07-23 
                        // Reason : Set the sgst new value in onchange
                        var final = total + cgst + sgst
                        setFinalAmount(final)
                        // End of addition by Om shrivastava on 22-07-23
                        // Reason : Set the cgst and sgst

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
              </>
              : null}
            {/* End of addition and modifciation by Om Shrivastava on 12-07-23 
            Reason : When user cannot select the loyality point status in setting table than loyality point labels doesn't show  */}

            {/* End of addition and Modification by Om Shrivastava on 01-07-23 */}

            {/* Modification by Om Shrivastava on 02-07-23 REason : Change the position of cards in this page */}

            {/* <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>Cancel reason</div>
                <textarea
                  // Modifed by ROhan kansari - 30/6/23
                  // Reason - To make tabel no. editable
                  className={orderDetailsObj.payment_status == "Completed" && orderDetailsObj.order_status == "Cancelled" ? `${style.disabledInputBox}` : `${style.textInputBox}`}
                  type="text"
                  name="cancel_reason"
                  value={cancelReaon}
                  style={{ width: "200px", height: "100px", resize: 'none' }}
                  disabled={orderDetailsObj.payment_status == "Completed" && orderDetailsObj.order_status == "Cancelled"? true : false}
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
            </div> */}

          </div>
          {/* Modification by Om Shrivastava on 02-07-23 REason : Change the position of cards in this page */}

          <div className={`${style.sectionInsideForm}`}>

            {/* <div className={`${style.inputContainer}`}>
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
                <div className={`${style.inputErrorArea}`}> */}
            {/* {validationErrors.amount_for_single_loyality_point} */}
            {/* </div>
              </div> */}

            {/* Commented by Rohan kansari - 30/6/23
                  Reason - To hide loyality status */}
            {/* <div className={`${style.inputContainer}`}>
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
            {/* </div>
            </div>  */}
            {/* End of code - Rohan kansari - 30/6/23 */}

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
                  // Modifed by ROhan kansari - 30/6/23
                  // Reason - To make tabel no. editable
                  // Added by Om Shrivastava on 08-07-23 
                  // Reason : Cannot enter discount when payment status is Paid
                  // Added by Om Shrivastava on 31-07-23 
                  // Reason : Cannot enter discount when payment status is Paid and order status is cancelled
                  // className={orderDetailsObj.payment_status == "Paid" || orderDetailsObj.payment_status == "Completed" || orderDetailsObj.order_status == "Cancelled" ? `${style.disabledInputBox}` : `${style.textInputBox}`}
                  className={orderDetailsObj.payment_status == "Paid" || orderDetailsObj.payment_status == "Completed" || orderDetailsObj.order_status == "Cancelled" || settings.discount_in != "Discount in (₹)" ? `${style.disabledInputBox}` : `${style.textInputBox}`}
                  // End of addition by Om Shrivastava on 31-07-23
                  // Reason : Set the validation error for discount percentage and discount rupee

                  // End of addition by Om Shrivastava on 08-07-23 Reason : Need to disable the field when payment status is Paid

                  // type="text"
                  type="number"

                  name="discount_rupees"
                  style={{ width: "200px" }}
                  value={discountRupee}
                  // Added by Om Shrivastava on 08-07-23 
                  // Reason : Need to disable the field when payment status is Paid
                  // Added by Om Shrivastava on 31-07-23 
                  // Reason : Cannot enter discount when payment status is Paid and order status is cancelled
                  // disabled={paymentStatus == "Paid" || paymentStatus == "Completed" || orderStatus == "Cancelled"  ? true : false}
                  disabled={paymentStatus == "Paid" || paymentStatus == "Completed" || orderStatus == "Cancelled" || settings.discount_in != "Discount in (₹)" ? true : false}
                  // End of addition by Om Shrivastava on 31-07-23 Reason : Need to disable the field when payment status is Paid

                  // End of addition by Om Shrivastava on 08-07-23 Reason : Need to disable the field when payment status is Paid
                  onChange={(e) => {
                    // Added by Rohan kansari -30/6/23
                    // Reason - To block minus sign
                    if (e.target.value.includes("-") && e.target.value.length > 1)
                      e.target.value = 0
                    // End of code - ROhan kansari - 30/6/23
                    // Modified by ROhan kansari - 4/8/23
                    // Reason - To make percentage reflect on change
                    setDiscountRupee(e.target.value);
                    setDiscountprice(e.target.value);
                    var percentage=e.target.value/(orderDetailsObj.sub_total/100)
                    setDiscountPercentage(percentage.toFixed(2))
                    // End of code - Rohan kansari - 4/8/23
                    // subtracting subtotal - to loyality point then we get total
                    var total = orderDetailsObj.sub_total - loyalityPointPrice - e.target.value
                    setTotal(total)

                    // Added by Om shrivastava on 22-07-23
                    // Reason : Set the cgst and sgst
                    var get_cgst = (orderDetailsObj.cgst / orderDetailsObj.total) * 100
                    var cgst = (total / 100) * get_cgst
                    setCGST(cgst)

                    // Added by Om Shrivastava on 23-07-23 
                    // Reason : Set the sgst new value in onchange
                    var get_sgst = (orderDetailsObj.sgst / orderDetailsObj.total) * 100
                    var sgst = (total / 100) * get_sgst
                    setSGST(sgst)
                    // End of addition by Om Shrivastava on 23-07-23 
                    // Reason : Set the sgst new value in onchange

                    var final = total + cgst + sgst
                    setFinalAmount(final)
                    // Added by Rohan kansari - 4/8/23
                    // Reason - To call validation function on change
                    validateOnBlur(
                      "discount_rupees",
                      e.target.value
                    );
                    // ENd of code - Rohan kansari - 4/8/23
                    // End of addition by Om shrivastava on 22-07-23
                    // Reason : Set the cgst and sgst
                    // validateOnInput(
                    //   "amount_for_single_loyality_point",
                    //   e.target.value
                    // );
                  }}
                  // Added by Om Shrivastava on 30-07-23
                  // Reason - to disable the encrease and decrease discount amount
                  onWheel={(e) => e.target.blur()}
                  // End of addition by Om Shrivastava on 30-07-23
                  onBlur={(e) => {
                    validateOnBlur(
                      "discount_rupees",
                      e.target.value
                    );
                  }}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {/* // Added by Om Shrivastava on 31-07-23 
                 // Reason : Set the validation for error discount */}
                {/* {validationErrors.discount_rupees} */}
                {validationDiscountErrors.discount_rupees}
                {/* End of addition by Om Shrivastava on 31-07-23 
                 // Reason : Set the validation for error discount*/}
              </div>
            </div>
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>Discount in (%)</div>
                <input
                  // Modifed by ROhan kansari - 30/6/23
                  // Reason - To make tabel no. editable
                  // Added by Om Shrivastava on 08-07-23 
                  // Reason : Cannot enter discount percentage when payment status is Paid

                  // Added by Om Shrivastava on 31-07-23 
                  // Reason : Cannot enter discount percentage when payment status is Paid
                  // className={orderDetailsObj.payment_status == "Paid" || orderDetailsObj.payment_status == "Completed" || orderDetailsObj.order_status == "Cancelled" ? `${style.disabledInputBox}` : `${style.textInputBox}`}
                  className={orderDetailsObj.payment_status == "Paid" || orderDetailsObj.payment_status == "Completed" || orderDetailsObj.order_status == "Cancelled" || settings.discount_in == "Discount in (₹)" ? `${style.disabledInputBox}` : `${style.textInputBox}`}
                  // End of addition by Om Shrivastava on 31-07-23 Reason : Cannot enter discount percentage when payment status is Paid

                  // End of addition by Om Shrivastava on 08-07-23 Reason : Cannot enter discount percentage when payment status is Paid
                  type="number"
                  name="discount_percentage"
                  style={{ width: "200px" }}
                  value={discountPercentage}
                  // Added by Om Shrivastava on 08-07-23 
                  // Reason : Cannot enter discount percentage when payment status is Paid
                  // disabled={paymentStatus == "Paid" || paymentStatus == "Completed" || orderStatus == "Cancelled" ? true : false}
                  // Added by Om Shrivastava on 31-07-23 
                  // Reason : Cannot enter discount percentage when payment status is Paid
                  // disabled={paymentStatus == "Paid" || paymentStatus == "Completed" || orderStatus == "Cancelled" || settings.discount_in=="Discount in (₹)"? true : false}
                  disabled={orderDetailsObj.payment_status == "Paid" || orderDetailsObj.payment_status == "Completed" || orderDetailsObj.order_status == "Cancelled" || settings.discount_in == "Discount in (₹)" ? true : false}
                  // End of addition by Om Shrivastava on 31-07-23 Reason : Cannot enter discount percentage when payment status is Paid

                  // End of addition by Om Shrivastava on 08-07-23 Reason : Cannot enter discount percentage when payment status is Paid
                  onChange={(e) => {
                    // Added by Rohan kansari -30/6/23
                    // Reason - To block minus sign
                    if (e.target.value < 0)
                      e.target.value = 0
                    // End of code - ROhan kansari - 30/6/23

                    // Modified by ROhan kansari - 4/8/23
                    // Reason - To make rupees reflect on change
                    setDiscountPercentage(e.target.value);
                    var percantagePrice = (subTotal / 100) * e.target.value
                    setDiscountRupee(percantagePrice.toFixed(2))
                    setDiscountprice(percantagePrice.toFixed(2))
                    // End of code - Rohan kansari - 4/8/23

                    // subtracting subtotal - to loyality point then we get total
                    var total = orderDetailsObj.sub_total - loyalityPointPrice - percantagePrice
                    setTotal(total)
                    // Added by Om shrivastava on 22-07-23
                    // Reason : Set the cgst and sgst
                    var get_cgst = (orderDetailsObj.cgst / orderDetailsObj.total) * 100
                    var cgst = (total / 100) * get_cgst
                    setCGST(cgst)

                    // Added by Om Shrivastava on 23-07-23 
                    // Reason : Set the sgst new value in onchange
                    var get_sgst = (orderDetailsObj.sgst / orderDetailsObj.total) * 100
                    var sgst = (total / 100) * get_sgst
                    setSGST(sgst)
                    // End of addition by Om Shrivastava on 23-07-23 
                    // Reason : Set the sgst new value in onchange

                    var final = total + cgst + sgst
                    setFinalAmount(final)
                    // Added by ROhan kansari - 4/8/23
                    // Reason - To call validation function in on change
                    validateOnBlur("discount_percentage", e.target.value);
                    // End of addition by Om shrivastava on 22-07-23
                    // Reason : Set the cgst and sgst
                    // validateOnInput("cgst", e.target.value);
                  }}
                  // Added by Om Shrivastava on 30-07-23
                  // Reason - to disable the encrease and decrease discount amount
                  onWheel={(e) => e.target.blur()}
                  // End of addition by Om Shrivastava on 30-07-23
                  // Added by Yuvraj Sahu on 15-07-2023
                  onBlur={(e) => {
                    validateOnBlur("discount_percentage", e.target.value);
                  }}

                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {/* Modification and addition by Om Shrivastava on 31-07-23
                Reason : Set the  validation for discount percentage*/}
                {/* {validationErrors.discount_percentage} */}
                {validationDiscountErrors.discount_percentage}
                {/* // End of addition by Om Shrivastava on 31-07-23 Reason : Set the validation for error for discount percentage  */}

              </div>
            </div>
            {/* Modification and addition by Om Shrivastava on 22-07-23
            Reason : When user enter discount rupee or percent then discount reason block is open */}
            {discountRupee != 0 || discountPercentage != 0 ?
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Discount reason</div>
                  <textarea
                    // Modifed by ROhan kansari - 30/6/23
                    // Reason - To make tabel no. editable
                    // Added by Om Shrivastava on 08-07-23 
                    // Reason : Cannot enter discount reason when payment status is Paid
                    // Modification and addition by Om Shrivastava on 22-07-23
                    // Reason : Set the validation for discount reason 
                    // className={orderDetailsObj.payment_status == "Paid" || orderDetailsObj.payment_status == "Completed" || orderDetailsObj.order_status == "Cancelled" ? `${style.disabledInputBox}` : `${style.textInputBox}`}
                    // className={orderDetailsObj.payment_status == "Paid" || orderDetailsObj.payment_status == "Completed" || orderDetailsObj.order_status == "Cancelled" ? `${style.disabledInputBox}` : `${style.textInputBox}`}
                    className={orderDetailsObj.payment_status == "Paid" || orderDetailsObj.payment_status == "Completed" || orderDetailsObj.order_status == "Cancelled" ? `${style.disabledInputBox}` : `${style.textInputBox}`}
                    //  End of Modification and addition by Om Shrivastava on 22-07-23
                    // Reason : Set the validation for discount reason 
                    // End of addition by Om Shrivastava on 08-07-23
                    type="text"
                    name="discount_reason"

                    // Modification and addition by Om Shrivastava on 22-07-23
                    // Reason : Set the validation for discount reason 
                    // style={orderDetailsObj.payment_status == "Completed"
                    //   || orderDetailsObj.order_status == "Cancelled"
                    //   ? { resize: 'none' } : { width: "200px", height: "100px", resize: 'none' }}
                    style={orderDetailsObj.payment_status == "Completed" || orderDetailsObj.payment_status == "Paid" ||
                      orderDetailsObj.order_status == "Cancelled"
                      ? { resize: 'none' } : { width: "200px", height: "100px", resize: 'none' }}
                    //  End of Modification and addition by Om Shrivastava on 22-07-23

                    value={discountReason == null ? "----" : discountReason}
                    // Added by Om Shrivastava on 08-07-23 
                    // Reason : Cannot enter discount reason when payment status is Paid

                    // Modification and addition by Om Shrivastava on 22-07-23
                    // Reason : Set the validation for discount reason 
                    // disabled={paymentStatus == "Paid" || paymentStatus == "Completed" || orderStatus == "Cancelled" || discountReason == undefined ? true : false}
                    disabled={orderDetailsObj.payment_status == "Paid" || orderDetailsObj.payment_status == "Completed" || orderDetailsObj.order_status == "Cancelled" || discountReason == undefined ? true : false}
                    //  End of Modification and addition by Om Shrivastava on 22-07-23

                    // End of addition by Om Shrivastava on 08-07-23 Reason : Cannot enter discount reason when payment status is Paid
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
              : null}
            {/* End of addition and modifciation by Om Shrivastava on 22-07-23  Reason : When user enter discount rupee or percent then discount reason block is open */}
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                <div className={`${style.inputLabel} ${style.inputLabel2}`}>Subtotal</div>
                <input
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
                  type="text"
                  name="sub_total"
                  // style={{ width: "200px" }}
                  //  Modified by Rohan kansari - 28/6/23
                  //   Reason - to show float with 2 decimal point 
                  value={subTotal?.toFixed(2)}
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
              </div>
            </div>
            {/* Modification and addition by Om Shrivastava on 12-07-23 
            Reason : When user cannot select the loyality point status in setting table than loyality point labels doesn't show */}
            {settings.allow_loyality_points && settings.allow_loyality_points == true ?
              <>
                <div className={`${style.inputContainer}`}>
                  {/* Added by Om Shrivastava on 20-07-23 Reason : Add classname in mobileview */}
                  <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                    {/* End of added by Om Shrivastava on 20-07-23 Reason : Add classname in mobileview */}
                    <div className={`${style.inputLabel} `}>
                      Loyality point price
                    </div>
                    <input
                      // {/* Added by Om Shrivastava on 20-07-23 Reason : Add classname in mobileview */
                      className={`${style.textInputBox} ${style.disabledInputBox}`}
                      // {/* End of added by Om Shrivastava on 20-07-23 Reason : Add classname in mobileview */
                      type="text"
                      name="loyality_point_price"
                      style={{ width: "100px" }}
                      //  Modified by Rohan kansari - 28/6/23
                      //   Reason - to show float with 2 decimal point
                      value={loyalityPointPrice?.toFixed(2)}
                      disabled

                    />
                  </div>
                  <div className={`${style.inputErrorArea}`}>
                  </div>
                </div>
              </>
              : null}
            {/* End of addition and modifciation by Om Shrivastava on 12-07-23 
            Reason : When user cannot select the loyality point status in setting table than loyality point labels doesn't show  */}

            <div className={`${style.inputContainer}`}>
              {/* Added by Om Shrivastava on 20-07-23 Reason : Add classname in mobileview */}
              <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                {/* // {/* End of added by Om Shrivastava on 20-07-23 Reason : Add classname in mobileview */}

                <div className={`${style.inputLabel}`}>
                  Discount
                </div>
                <input
                  // {/* Added by Om Shrivastava on 20-07-23 Reason : Add classname in mobileview */
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
                  // {/* End of added by Om Shrivastava on 20-07-23 Reason : Add classname in mobileview */
                  type="text"
                  name="discount"
                  style={{ width: "100px" }}
                  value={discountprice}
                  disabled
                />
              </div>
            </div>
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                <div className={`${style.inputLabel} ${style.inputLabel2}`}>Total</div>
                <input
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
                  type="text"
                  name="total"
                  ////  Modified by Rohan kansari - 28/6/23
                  ////   Reason - to show float with 2 decimal point
                  value={total?.toFixed(2)}
                  disabled
                />
              </div>
            </div>
            {/* End of code - Rohan kansari - 28/6/23 */}
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                <div className={`${style.inputLabel} ${style.inputLabel2}`}>CGST</div>
                <input
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
                  type="text"
                  name="cgst"
                  // style={{ width: "200px" }}
                  //  Modified by Rohan kansari - 28/6/23
                  //   Reason - to show float with 2 decimal point
                  value={cgst?.toFixed(2)}
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
                  //  Modified by Rohan kansari - 28/6/23
                  //   Reason - to show float with 2 decimal point
                  value={sgst?.toFixed(2)}
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
            {/* Commented by Rohan Kansari - 28/6/23
                  Reason - to change position  */}
            {/* <div className={`${style.inputContainer}`}>
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
                </div> */}
            {/* <div className={`${style.inputErrorArea}`}> */}
            {/* {validationErrors.gstin} */}
            {/* </div>
              </div> */}
            {/* ENd of code - Rohan kansari - 28/6/23 */}
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                <div className={`${style.inputLabel} ${style.inputLabel2}`}>Grand Total</div>
                <input
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
                  type="text"
                  name="grand_total"
                  // style={{ width: "200px" }}
                  value={finalAmount?.toFixed(2)}
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
                  className={`${style.textInputBox} ${style.disabledInputBox} `}

                  style={{ wordBreak: 'break-word' }}>{review && review ? review : '----'}</p>
              </div>
              <div className={`${style.inputErrorArea}`}>
                {/* {validationErrors.fssaino} */}
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
          {/* <div className={`${style.sectionInsideForm} ${style.sectionInsideForm2}`}> */}

          {/* Commented by Om  shrivastava on 01-07-23 */}



          {/* <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                <div className={`${style.inputLabel} ${style.inputLabel2}`}>Subtotal</div>
                <input
                  className={`${style.textInputBox} ${style.disabledInputBox} `}
                  type="text"
                  name="sub_total"
                  //// style={{ width: "200px" }}
                  ////  Modified by Rohan kansari - 28/6/23
                  ////   Reason - to show float with 2 decimal point 
                  value={subTotal?.toFixed(2)}
                  disabled

                //// maxLength={15}
                //// onChange={(e) => {
                ////   setGstin(e.target.value);
                ////   validateOnInput("gstin", e.target.value);
                //// }}
                //// onBlur={(e) => {
                ////   validateOnBlur("gstin", e.target.value);
                //// }}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
              </div>
            </div> */}

          {/* Added by ROhan kansari - 28/6/23
                  Reason - To show loyality point below sub total */}
          {/* <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  Loyality point price
                </div>
                <input
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
                  type="text"
                  name="loyality_point_price"
                  style={{ width: "100px" }}
                  //  Modified by Rohan kansari - 28/6/23
                  //   Reason - to show float with 2 decimal point
                  value={loyalityPointPrice?.toFixed(2)}
                  disabled
                
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
              </div>
            </div> */}
          {/* <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  Discount
                </div>
                <input
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
                  type="text"
                  name="discount"
                  style={{ width: "100px" }}
                  value={discountprice}
                  disabled
                />
              </div>
            </div> */}
          {/* <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                <div className={`${style.inputLabel} ${style.inputLabel2}`}>Total</div>
                <input
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
                  type="text"
                  name="total"
                  ////  Modified by Rohan kansari - 28/6/23
                  ////   Reason - to show float with 2 decimal point
                  value={total?.toFixed(2)}
                  disable
                />
              </div>
            </div> */}
          {/* End of code - Rohan kansari - 28/6/23 */}
          {/* <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                <div className={`${style.inputLabel} ${style.inputLabel2}`}>CGST</div>
                <input
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
                  type="text"
                  name="cgst"
                  //// style={{ width: "200px" }}
                  ////  Modified by Rohan kansari - 28/6/23
                  ////   Reason - to show float with 2 decimal point
                  value={cgst?.toFixed(2)}
                  disabled

                />
              </div>
              <div className={`${style.inputErrorArea}`}>
              </div>
            </div> */}



          {/* <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                <div className={`${style.inputLabel} ${style.inputLabel2}`}>SGST</div>
                <input
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
                  type="text"
                  name="sgst"
                  //// style={{ width: "200px" }}
                  ////  Modified by Rohan kansari - 28/6/23
                  ////   Reason - to show float with 2 decimal point
                  value={sgst?.toFixed(2)}
                  disabled

                />
              </div>
              <div className={`${style.inputErrorArea}`}>
              </div>
            </div> */}
          {/* Commented by Rohan Kansari - 28/6/23
                  Reason - to change position  */}
          {/* <div className={`${style.inputContainer}`}>
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
                </div> */}
          {/* <div className={`${style.inputErrorArea}`}> */}
          {/* {validationErrors.gstin} */}
          {/* </div>
              </div> */}
          {/* ENd of code - Rohan kansari - 28/6/23 */}
          {/* <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                <div className={`${style.inputLabel} ${style.inputLabel2}`}>Grand Total</div>
                <input
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
                  type="text"
                  name="grand_total"
                  //// style={{ width: "200px" }}
                  value={finalAmount?.toFixed(2)}
                  disabled

                
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
              </div>
            </div> */}
          {/* <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                <div className={`${style.inputLabel} ${style.inputLabel2}`}>Rating</div>
                <input
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
                  type="text"
                  name="rating"
                  //// style={{ width: "200px" }}
                  value={rating && rating ? rating : '----'}
                  disabled

                />
              </div>
              <div className={`${style.inputErrorArea}`}>
              </div>
            </div> */}

          {/* <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea} ${style.inputAreaForResponsive}`}>
                <div className={`${style.inputLabel} ${style.inputLabel2}`}>Review</div>
                
                <p
                  className={`${style.textInputBox} ${style.disabledInputBox} `}

                  style={{ wordBreak: 'break-word' }}>{review && review ? review : '----'}</p>
              </div>
              <div className={`${style.inputErrorArea}`}>
              </div>
            </div> */}
          {/* </div> */}
        </div>
        {/* End of addition by Om Shrivastava on 22-06-23 */}


        <div className={style.actionContainer}>

          <div
            className={` ${style.backButton}`}
            style={{
              // marginRight: "10px",
            }}
            onClick={(e) => {
              getOrderDetail();
              // Addition by Om Shrivastava on 30-07-23
              // Reason : Reset the validation for when user hit the clear button
              resetValidation();
              // End of Addition by Om Shrivastava on 30-07-23
              // Reason : Reset the validation for when user hit the clear button
            }}
          >
            Clear
          </div>

          <div
            className={` ${style.backButton}`}
            style={{
              // marginRight: "10px",
            }}
            onClick={(e) => {
              navigate(-1);
            }}
          >
            Back
          </div>

          <div
            className={` ${style.proceedButton} `}
            onClick={() => {
              saveOrder();
              window.scrollTo(0, 0);
            }}
          >
            Save
          </div>
          <div
            className={orderDetailsObj.payment_status == "Completed" || orderDetailsObj.order_status == "Cancelled" ? `${style.addMoreItemButtonDisabled}` : ` ${style.addMoreItemButton}`}
            style={{
              // marginRight: "10px",
            }}
            onClick={(e) => {
              setModalVisible(true)
            }}
          >
            Add more item
          </div>
          {/* <div
            className={` ${style.proceedButton}`}
            onClick={() => {
              saveOrder();
              window.scrollTo(0, 0);
            }}
          >
            Add
          </div> */}

          {/* Addition and modifciation by Om Shrivastava on 23-06-23
            Reason : Add more item functionality in the order list page */}
          {/* <div
            className={orderDetailsObj.payment_status == "Completed" || orderDetailsObj.order_status == "Cancelled" ? `${style.addMoreItemButtonDisabled}` : ` ${style.addMoreItemButton}`}
            style={{
              marginRight: "10px",
            }}
            onClick={(e) => {
              //// resetSettingsForm();
              //// window.scrollTo(0, 0);
              setModalVisible(true)
            }}
          >
            Add more item
          </div> */}
        </div>
      </form>
      {/* // Addition by Om Shrivastava on 02-09-23
    // Reason : Apply the loader in order form page */}
    </div>
    }
{/* // End of addition by Om Shrivastava on 02-09-23
    // Reason : Apply the loader in order form page */}

      {/* Added by Om Shrivastava on 14-06-23
 Reason: When user add more item than show the modal  */}
      <Modal
        animationType="slide"
        transparent={true}
        footer={null}
        open={modalVisible}
        closable={false}
        keyboard={false}
      // onCancel={handlemoreItemCancel}

      >
        <AddOrderItemForm orderId={orderDetailsObj.order_id} id={orderDetailsObj.id} modalvisibilityFn={setModalVisible} modalvisibility={modalVisible} onCancel={handlemoreItemCancel}
          setOrderItems={setOrderItems}
          setOrderDetail={setorderDetailsObj} setOrderStatus={setOrderStatus} getOrderDetail={getOrderDetail} />
      </Modal>
      {/* <>
        <Modal style={{ padding: '0% !important' }} footer={null} open={moreItem} onOk={handlemoreItemOk} onCancel={handlemoreItemCancel}>
          <div className='rating_review_heading' style={{ marginTop: '2%' }}></div>
          <Form
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 40 }}
           
            scrollToFirstError
            name="comment"
          >
            <div
            >
              <Form.Item
                name='rating'
                label='Rating'
              
                style={{
                  marginBottom: '10px'
                }}
              >
                <div
                >
                 
                </div>
              </Form.Item>
            </div>

            <Form.Item
              name='review'
              label='Review'
              rules={[
                {
                  required: false,
                  message: 'Please enter your review',
                },
              ]}
              style={{
                marginBottom: '10px'
              }}
            >
            </Form.Item>

            <Form.Item>
              
            </Form.Item>
          </Form>
        </Modal>
      </> */}
      {/* End of addition by Om Shrivastava on 01-06-23 Reason : When user add more item than show the modal */}

    </div>
    // </Header>
  );
};

export default OrderForm;
