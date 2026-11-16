import { useState } from 'react';

export function useOrderFormState() {
  const [orderDetailsObj, setorderDetailsObj] = useState({});
  const [tablenumber, setTablenumber] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [orderStatus, setOrderStatus] = useState("Placed");
  const [paymentStatusTemp, setPaymentStatusTemp] = useState("Cancelled");
  const [paymentStatus, setPaymemntStatus] = useState("Pending");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [cancelledBy, setCancelledBy] = useState("Admin");
  const [cancelReaon, setCancelReason] = useState(null);
  const [discountRupee, setDiscountRupee] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountprice, setDiscountprice] = useState(null);
  const [discountReason, setDiscountReason] = useState("");
  const [applyLoyalityPoint, setApplyLoyalityPoint] = useState(null);
  const [loyalityPointPrice, setLoyalityPointPrice] = useState(null);
  const [loyalityPointStatus, setLoyalityPointStatus] = useState(null);
  const [loyalityPointCalculated, setLoyalityPointCalculated] = useState(null);
  const [customerLoyalitypoint, setcustomerLoyalitypoint] = useState(null);
  const [settings, setSettings] = useState({});
  const [subTotal, setSubTotal] = useState(null);
  const [cgst, setCGST] = useState(null);
  const [total, setTotal] = useState(null);
  const [sgst, setSGST] = useState(null);
  const [finalAmount, setFinalAmount] = useState(null);
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [IsTableEditable, setTableEditable] = useState(false);
  const [isLoader, setIsLoader] = useState(true);
  const [validationErrors, setValidationErrors] = useState({
    apply_loyality_point: "",
    order_status: "",
    payment_status: "",
    cancelled_by: "",
    discount_reason: ""
  });
  const [validationDiscountErrors, setDiscountValidationErrors] = useState({
    discount_rupees: "",
    discount_percentage: "",
  });
  const [validationForOrderCancel, setValidationForOrderCancel] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  return {
    orderDetailsObj,
    setorderDetailsObj,
    tablenumber,
    setTablenumber,
    orderId,
    setOrderId,
    orderStatus,
    setOrderStatus,
    paymentStatusTemp,
    setPaymentStatusTemp,
    paymentStatus,
    setPaymemntStatus,
    paymentMode,
    setPaymentMode,
    cancelledBy,
    setCancelledBy,
    cancelReaon,
    setCancelReason,
    discountRupee,
    setDiscountRupee,
    discountPercentage,
    setDiscountPercentage,
    discountprice,
    setDiscountprice,
    discountReason,
    setDiscountReason,
    applyLoyalityPoint,
    setApplyLoyalityPoint,
    loyalityPointPrice,
    setLoyalityPointPrice,
    loyalityPointStatus,
    setLoyalityPointStatus,
    loyalityPointCalculated,
    setLoyalityPointCalculated,
    customerLoyalitypoint,
    setcustomerLoyalitypoint,
    settings,
    setSettings,
    subTotal,
    setSubTotal,
    cgst,
    setCGST,
    total,
    setTotal,
    sgst,
    setSGST,
    finalAmount,
    setFinalAmount,
    rating,
    setRating,
    review,
    setReview,
    orderItems,
    setOrderItems,
    IsTableEditable,
    setTableEditable,
    isLoader,
    setIsLoader,
    validationErrors,
    setValidationErrors,
    validationDiscountErrors,
    setDiscountValidationErrors,
    validationForOrderCancel,
    setValidationForOrderCancel,
    modalVisible,
    setModalVisible,
  };
}
