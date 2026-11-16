import { useState } from 'react';

export function useOrderItemFormState() {
  const [orderItemDetailsObj, setorderItemDetailsObj] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [itemName, setItemName] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [servingSize, setServingSize] = useState(null);
  const [itemStatus, setItemStatus] = useState(null);
  const [price, setPrice] = useState(null);
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState(null);
  const [isLoader, setIsLoader] = useState(true);
  const [validationErrors, setValidationErrors] = useState({
    discount_rupees: "",
    discount_percentage: "",
    apply_loyality_point: "",
    order_status: "",
    payment_status: "",
    cancelled_by: "",
    discount_reason: "",
  });
  const [validationForOrderCancel, setValidationForOrderCancel] = useState("");
  return {
    orderItemDetailsObj,
    setorderItemDetailsObj,
    orderId,
    setOrderId,
    itemName,
    setItemName,
    quantity,
    setQuantity,
    servingSize,
    setServingSize,
    itemStatus,
    setItemStatus,
    price,
    setPrice,
    rating,
    setRating,
    review,
    setReview,
    isLoader,
    setIsLoader,
    validationErrors,
    setValidationErrors,
    validationForOrderCancel,
    setValidationForOrderCancel,
  };
}
