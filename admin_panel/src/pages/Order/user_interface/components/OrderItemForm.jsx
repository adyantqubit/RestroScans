import React, { useEffect } from "react";
import { explainFailure } from "../../../../http/http_client";
import style from "../style/orderitemform.module.css";
import Header from "../../../../components/Header/Header";
import { useApp } from "../../../../Context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import {
  loadOrderDetails,
  loadOrderItemData,
  loadOrderItems,
  saveOrderDetails,
  saveOrderItem,
  saveOrderItemStatus,
} from "../../services/orderService";

import Loader from "../../../../components/Loader/Loader";
import { useOrderItemFormState } from "../../usestate/orderItemFormState";

const OrderItemForm = () => {
  const { Message, enableHeader } = useApp();
  const navigate = useNavigate();

  const { state } = useLocation();
  const { id } = state;
  var {
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
  } = useOrderItemFormState();

  useEffect(() => {
    enableHeader();
    getOrderItemDetail();
  }, []);

  const getOrderItemDetail = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await loadOrderItemData(tenant);
    if (response.msg) {
      if (id != 0) {
        var filterOrderObj = response.orderItemData.filter(
          (dt) => dt.id == id
        )[0];
        setIsLoader(false);
        setorderItemDetailsObj(filterOrderObj);

        setOrderId(filterOrderObj.order_id);
        setItemName(filterOrderObj.item);
        setQuantity(filterOrderObj.quantity);
        setServingSize(filterOrderObj.serving_size);
        setItemStatus(filterOrderObj.item_status);
        setPrice(filterOrderObj.price);
        setRating(filterOrderObj.rating);
        setReview(filterOrderObj.review);
      }
    }
  };

  const validateOnBlur = (inputName, value) => {
  };

  const validateOnInput = (inputName, value) => {
  };

  const saveOrderItem = async () => {
  const updatedOrderData = orderItemDetailsObj;

    updatedOrderData["item_status"]= itemStatus;

    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await saveOrderItemStatus(tenant, orderId,[orderItemDetailsObj],updatedOrderData);
    if (response.success) {
      Message("Order item saved successfully.", "success");
      navigate(-1);
    } else {
      Message(explainFailure(response, "The order item was not saved."), "error");
    }
  };

  return (
    <div className={style.container}>
      <div className={style.titleContainer}>
        <div className={style.pageTitle} style={{ fontSize: "25px" }}>
          Order item
        </div>
      </div>
      {isLoader == true ? <Loader/> :
    <div >
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
                  value={orderId ?? ""}
                  disabled
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
              </div>
            </div>

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>Item name</div>
                <input
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
                  type="text"
                  name="item"
                  value={itemName ?? ""}
                  disabled
                  style={{ width: "230px" }}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
              </div>
            </div>

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>Serving size </div>
                <input
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
                  type="text"
                  name="serving_size"
                  value={servingSize ?? ""}
                  disabled
                  maxLength={10}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
              </div>
            </div>
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel} `}>Quantity</div>
                <input
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
                  type="text"
                  name="quantity"
                  value={quantity ?? ""}
                  disabled
                  maxLength={10}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
              </div>
            </div>
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>Item Status</div>
                  <input
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
                  type="text"
                  name="item_status"
                  value={itemStatus ?? ""}
                  disabled
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
              </div>
            </div>
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel} `}>Price</div>
                <input
                  className={`${style.textInputBox} ${style.disabledInputBox}`}
                  type="text"
                  name="payment_mode"
                  value={price ?? ""}
                  disabled
                  maxLength={10}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
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
                  value={rating && rating ? rating : "----"}
                  disabled
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
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
        </div>
      </form>
    </div>
    }
    </div>
  );
};

export default OrderItemForm;
