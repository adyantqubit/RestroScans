
import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../../config/config";
import httpClient, { explainFailure } from "../../../../http/http_client";
import style from "../style/orderform.module.css";
import { useApp } from "../../../../Context/AppContext";
import { Modal } from "../../../../ui";
import { useLocation, useNavigate } from "react-router-dom";
import {
  loadOrderDetails,
  loadOrderItems,
  saveOrderDetails,
} from "../../services/orderService";
import { orderFormStatusChange } from "../../../Home/services/homeService";
import {
  applyDiscountPercentage,
  applyDiscountRupees,
  applyLoyaltyPoints,
  cleanPercentageInput,
  cleanRupeeInput,
  hasBlockingErrors,
  isCancelReasonMissing,
  validateCancelReason,
  validateDiscountPercentage,
  validateDiscountRupees,
  validateLoyaltyPoints,
  validateTableNumber,
} from "../../services/orderFormRules";
import AddOrderItemForm from "./AddOrderItemForm";
import Loader from "../../../../components/Loader/Loader";
import { useOrderFormState } from "../../usestate/orderFormState";
import OrderStatusFields from "./OrderStatusFields";
import OrderAmountFields from "./OrderAmountFields";
import { hasFeature } from "../../../../plans";
import OrderFormActions from "./OrderFormActions";

const tenantName = () => {
  try {
    const admin = JSON.parse(localStorage.getItem("tenantInfo") || "null");
    if (admin?.tenant_name) return admin.tenant_name;
    const staff = JSON.parse(sessionStorage.getItem("restroStaffSession") || "null");
    if (staff?.tenant) return staff.tenant;
  } catch (_) { /* Ignore malformed cached session. */ }
  return window.location.hostname.split(".")[0];
};

const OrderForm = ({ embedded = false, recordId = null, onSaved, onClose, staffMode = false }) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const id = embedded ? recordId : (state ? state.id : null);
  const { Message, enableHeader } = useApp();
  const [verification, setVerification] = useState(null);
  const [verificationBusy, setVerificationBusy] = useState(false);
  const [stockCatalog, setStockCatalog] = useState([]);
  const [stockOpenId, setStockOpenId] = useState(null);
  const [stockBusy, setStockBusy] = useState(false);
  const [stockError, setStockError] = useState("");
  const stockApi = async (method, data = null, params = null) => {
    const session = JSON.parse(sessionStorage.getItem("restroStaffSession") || "null");
    if (!staffMode) {
      const response = method === "get"
        ? await httpClient.get("/api/v1/workforce/staff-order-actions/", { params })
        : await httpClient.post("/api/v1/workforce/staff-order-actions/", data);
      return response.data;
    }
    if (!session?.token || !session?.tenant) throw new Error("Staff session expired");
    const response = await axios({
      baseURL: config.staticBaseURL,
      url: "/api/v1/workforce/staff-order-actions/",
      method,
      headers: { Authorization: `Bearer ${session.token}`, "X-Tenant": session.tenant },
      ...(method === "get" ? { params } : { data }),
    });
    return response.data;
  };
  useEffect(() => {
    let active = true;
    const refresh = () => stockApi("get", null, { catalog: 1 })
      .then((data) => { if (active) setStockCatalog(data.items || []); })
      .catch(() => { });
    refresh();
    window.addEventListener("restro-availability-updated", refresh);
    return () => { active = false; window.removeEventListener("restro-availability-updated", refresh); };
  }, [staffMode]);
  const setStockAvailability = async (item, available, line = null) => {
    // Stock status is restaurant-wide; cancelling a pending line is explicitly confirmed.
    let removeCurrentLine = false;
    if (!available && line && ["Pending", "Confirm"].includes(line.item_status)) {
      removeCurrentLine = window.confirm(
        `${item.name} is unavailable.\n\nPress OK to also remove this unprepared item from the current order and recalculate the bill.\nPress Cancel to only mark it unavailable for new orders.`
      );
    }
    setStockBusy(true);
    setStockError("");
    try {
      const payload = { action: "availability", item_id: item.id, available };
      if (removeCurrentLine) payload.remove_current_line_id = line.id;
      await stockApi("post", payload);
      setStockCatalog((rows) => rows.map((row) => row.id === item.id ? { ...row, kitchen_available: available } : row));
      setStockOpenId(null);
      window.dispatchEvent(new Event("restro-availability-updated"));
      if (removeCurrentLine) {
        await Promise.all([getOrderDetail(), getOrderItems()]);
        window.dispatchEvent(new CustomEvent("order-live", { detail: { order_id: orderId } }));
        if (onSaved) onSaved();
      }
    } catch (error) {
      setStockError(error.response?.data?.error || error.message || "Unable to update item availability");
    } finally { setStockBusy(false); }
  };

  const staffApi = async (method, data = null) => {
    const session = JSON.parse(sessionStorage.getItem("restroStaffSession") || "null");
    if (!session?.token || !session?.tenant) throw new Error("Staff session expired");
    const response = await axios({
      baseURL: config.staticBaseURL,
      url: "/api/v1/workforce/staff-operations/",
      method,
      headers: { Authorization: `Bearer ${session.token}`, "X-Tenant": session.tenant },
      ...(method === "get" ? { params: { section: "orders" } } : { data: { section: "orders", ...data } }),
    });
    return response.data;
  };

  const verificationApi = async (method, payload = {}) => {
    const url = "/api/v1/manual-payment/verify/";
    const args = method === "get" ? { params: { order_id: id } } : { order_id: id, ...payload };

    if (!staffMode) {
      const response = method === "get"
        ? await httpClient.get(url, args)
        : await httpClient.post(url, args);
      return response.data;
    }

    const session = JSON.parse(sessionStorage.getItem("restroStaffSession") || "null");
    if (!session?.token || !session?.tenant) throw new Error("Staff session expired");
    const response = await axios({
      baseURL: config.staticBaseURL,
      url,
      method,
      headers: { Authorization: `Bearer ${session.token}`, "X-Tenant": session.tenant },
      ...(method === "get" ? { params: { order_id: id } } : { data: args }),
    });
    return response.data;
  };

  const refreshVerification = async () => {
    if (!id) return;
    try {
      setVerification(await verificationApi("get"));
    } catch (error) {
      setVerification({ error: error.response?.data?.error || error.message });
    }
  };

  const verifyPayment = async (action) => {
    setVerificationBusy(true);
    try {
      await verificationApi("post", { action });
      Message(
        action === "confirm_paid"
          ? "Payment verified successfully."
          : "Payment claim rejected.",
        "success"
      );
      await refreshVerification();
      await getOrderDetail();
      if (onSaved) onSaved();
    } catch (error) {
      Message(error.response?.data?.error || error.message || "Verification failed", "error");
    } finally {
      setVerificationBusy(false);
    }
  };

  useEffect(() => {
    refreshVerification();
  }, [id, staffMode]);

  const finish = () => {
    if (embedded && onSaved) onSaved();
    else navigate(-1);
  };

  const back = () => {
    if (embedded && onClose) onClose();
    else navigate(-1);
  };

  const {
    orderDetailsObj,
    setorderDetailsObj,
    tablenumber,
    setTablenumber,
    orderId,
    setOrderId,
    orderStatus,
    setOrderStatus,
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
    setLoyalityPointStatus,
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
  } = useOrderFormState();

  useEffect(() => {
    if (!embedded) enableHeader();
    if (id != null) getOrderDetail();
  }, [id, embedded]);

  const getOrderItems = async () => {
    if (id == null) return;
    const response = staffMode
      ? await staffApi("get").then((data) => ({
        msg: true,
        orderItems: (data.order_items || []).filter(
          (item) => String(item.order_id_id) === String(id)
        ),
      }))
      : await loadOrderItems(tenantName(), id);

    if (response.msg) {
      setOrderItems(response.orderItems || []);
    }
  };

  useEffect(() => {
    getOrderItems();
  }, [id, modalVisible]);

  useEffect(() => {
    const onLive = (event) => {
      const detail = event.detail || {};
      if (orderId && detail.order_id && detail.order_id !== orderId) return;
      getOrderDetail();
      getOrderItems();
    };

    window.addEventListener("order-live", onLive);


    return () => window.removeEventListener("order-live", onLive);
  }, [orderId]);

  // Staff and owner use the same discount, loyalty and tax preview rules.
  const handleWaiterLoyaltyChange = (event) => changeLoyaltyPoints(event);

  const getOrderDetail = async () => {
    const response = staffMode
      ? await staffApi("get").then((data) => ({
        msg: true,
        orderData: data.results || [],
        setting: data.settings || {},
      }))
      : await loadOrderDetails(tenantName());

    if (response.msg && Number(id) !== 0) {
      const order = response.orderData.filter(
        (dt) => String(dt.id) === String(id)
      )[0];

      if (!order) {
        Message("Order not found", "error");
        setIsLoader(false);
        return;
      }

      setIsLoader(false);
      setorderDetailsObj(order);
      setOrderId(order.order_id);
      setTablenumber(order.table_number);
      setOrderStatus(order.order_status);
      setPaymemntStatus(order.payment_status);
      setPaymentMode(order.payment_mode);
      setCancelledBy(order.cancelled_by);
      setCancelReason(order.cancel_reason);
      setDiscountRupee(order.discount_rupees);
      setDiscountprice(order.discount_rupees);
      setDiscountPercentage(order.discount_percentage);
      setDiscountReason(order.discount_reason);
      setApplyLoyalityPoint(order.apply_loyality_point);
      setLoyalityPointPrice(order.loyality_point_price);
      setLoyalityPointStatus(order.loyality_point_status);
      setLoyalityPointCalculated(order.loyality_point_calculated);
      setcustomerLoyalitypoint(order.customer_loyality_point);
      setSubTotal(order.sub_total);
      setCGST(order.cgst);
      setSGST(order.sgst);
      setTotal(order.total);
      setFinalAmount(order.final_amount);
      setRating(order.rating);
      setReview(order.review);
      setSettings(response.setting);
    }
  };

  const showAmounts = (amounts) => {
    setTotal(amounts.total);
    setCGST(amounts.cgst);
    setSGST(amounts.sgst);
    setFinalAmount(amounts.finalAmount);
  };

  const showLoyaltyError = (value) => {
    const errorMessage = validateLoyaltyPoints(value, {
      customerPoints: customerLoyalitypoint,
      subTotal,
      pointsPrice: loyalityPointPrice,
    });
    setValidationErrors({
      ...validationErrors,
      apply_loyality_point: errorMessage,
    });
  };

  const showDiscountRupeesError = (value) => {
    setDiscountValidationErrors({
      ...validationDiscountErrors,
      discount_rupees: validateDiscountRupees(value, subTotal),
    });
  };

  const showDiscountPercentageError = (value) => {
    setDiscountValidationErrors({
      ...validationDiscountErrors,
      discount_percentage: validateDiscountPercentage(value),
    });
  };

  const closeTableEditorWhenFilled = () => {
    if (String(tablenumber || "").length > 0) {
      setTableEditable(false);
    }
  };

  function handleChangeStatus(nextOrderStatus, nextPaymentStatus) {
    const result = orderFormStatusChange(
      orderDetailsObj,
      nextOrderStatus,
      nextPaymentStatus,
      orderStatus,
      paymentStatus
    );

    if (!result.allowed) {
      Message(result.message, "error");
      return false;
    }

    if (result.clearCancel) setCancelReason("");
    return true;
  }

  const changeLoyaltyPoints = (event) => {
    const points = event.target.value;
    setApplyLoyalityPoint(points);

    const result = applyLoyaltyPoints(orderDetailsObj, {
      points,
      perPointValue: settings.per_loyality_point_value,
      discountPrice: discountprice,
    });

    setLoyalityPointPrice(result.loyaltyPointPrice);
    showAmounts(result);
  };

  const changeDiscountRupees = (event) => {
    const value = cleanRupeeInput(event.target.value);
    if (value !== event.target.value) event.target.value = value;

    setDiscountRupee(value);
    setDiscountprice(value);

    const result = applyDiscountRupees(orderDetailsObj, {
      value,
      loyaltyPointPrice: loyalityPointPrice,
    });

    setDiscountPercentage(result.discountPercentage);
    showAmounts(result);
    showDiscountRupeesError(value);
  };

  const changeDiscountPercentage = (event) => {
    const value = cleanPercentageInput(event.target.value);
    if (value !== event.target.value) event.target.value = value;

    setDiscountPercentage(value);

    const result = applyDiscountPercentage(orderDetailsObj, {
      value,
      subTotal,
      loyaltyPointPrice: loyalityPointPrice,
    });

    setDiscountRupee(result.discountRupee);
    setDiscountprice(result.discountRupee);
    showAmounts(result);
    showDiscountPercentageError(value);
  };

  const saveOrder = async () => {
    const cancelReasonMissing = isCancelReasonMissing(
      cancelReaon,
      orderStatus
    );

    if (cancelReasonMissing) {
      setValidationForOrderCancel("Please enter cancel reason");
    }

    if (cancelReasonMissing || hasBlockingErrors(validationErrors)) {
      return;
    }

    const updatedOrderData = new FormData();

    if (Number(id) !== 0) {
      updatedOrderData.append("id", id);
    }

    updatedOrderData.append("table_number", tablenumber);
    updatedOrderData.append("discount_rupees", discountRupee);
    updatedOrderData.append("discount_percentage", discountPercentage);
    updatedOrderData.append("apply_loyality_point", applyLoyalityPoint);
    updatedOrderData.append("order_status", orderStatus);
    updatedOrderData.append("cancelled_by", cancelledBy);
    updatedOrderData.append("cancel_reason", cancelReaon);
    updatedOrderData.append("discount_reason", discountReason);

    let response;

    if (staffMode) {
      try {
        const payload = Object.fromEntries(updatedOrderData.entries());

        for (const field of [
          "discount_rupees",
          "discount_percentage",
          "apply_loyality_point",
        ]) {
          if (
            Number(payload[field] || 0) ===
            Number(orderDetailsObj?.[field] || 0)
          ) {
            delete payload[field];
          }
        }

        // Payment confirmation is handled by the existing verification API,
        // never by the generic order-edit endpoint.
        const collectPayment = ["Paid", "Completed"].includes(paymentStatus) &&
          !["Paid", "Completed"].includes(orderDetailsObj?.payment_status);
        delete payload.payment_status;
        delete payload.payment_mode;
        if (collectPayment) {
          const requestedPoints = Number(applyLoyalityPoint || 0);
          const availablePoints = Math.max(0, Math.floor(Number(customerLoyalitypoint) || 0));
          if (settings.allow_loyality_points === true && requestedPoints > availablePoints) {
            throw new Error(`Only ${availablePoints} loyalty points are available. Please reduce Loyalty Points before confirming payment.`);
          }
        }
        response = await staffApi("post", {
          action: "edit",
          order_id: id,
          changes: payload,
        });
        if (response.status !== "updated") throw new Error("Order update failed");
        if (collectPayment) {
          if (orderStatus !== "Served") throw new Error("Serve the order before collecting payment");
          if (!window.confirm(`Confirm actual receipt of ₹${Number(finalAmount || 0).toFixed(2)} via ${paymentMode === "Scanner" ? "UPI" : "Cash"}?`)) {
            throw new Error("Payment confirmation cancelled; order changes may have been saved");
          }
          await verificationApi("post", {
            action: "staff_received",
            method: paymentMode === "Scanner" ? "UPI" : paymentMode,
            loyalty_points: settings.allow_loyality_points === true ? Number(applyLoyalityPoint || 0) : 0,
          });
        }
        response = { msg: true };
      } catch (error) {
        response = {
          error:
            error?.response?.data?.error ||
            error.message ||
            "Order edit failed",
        };
      }
    } else {
      const collectPayment = ["Paid", "Completed"].includes(paymentStatus) &&
        !["Paid", "Completed"].includes(orderDetailsObj?.payment_status);
      // Never update payment status through generic order editing.
      response = await saveOrderDetails(tenantName(), updatedOrderData);
      if (response?.msg && collectPayment) {
        try {
          if (orderStatus !== "Served") throw new Error("Serve the order before collecting payment");
          if (!window.confirm(`Confirm actual receipt of ₹${Number(finalAmount || 0).toFixed(2)} via ${paymentMode === "Scanner" ? "UPI" : "Cash"}?`)) {
            throw new Error("Payment confirmation cancelled; order changes may have been saved");
          }
          await verificationApi("post", {
            action: "staff_received",
            method: paymentMode === "Scanner" ? "UPI" : paymentMode,
            loyalty_points: settings.allow_loyality_points === true ? Number(applyLoyalityPoint || 0) : 0,
          });
        } catch (error) {
          response = { error: error?.response?.data?.error || error.message || "Payment confirmation failed" };
        }
      }
    }

    if (response.msg) {
      Message("Order saved successfully.", "success");
      finish();
    } else {
      Message(
        explainFailure(response, "The order was not saved."),
        "error"
      );
    }
  };

  const resetValidation = () => {
    setValidationErrors({});
    setValidationForOrderCancel("");
  };

  const handlers = {
    tableNumberChange: (event) => {
      const value = event.target.value;
      setValidationErrors({
        ...validationErrors,
        table_number: validateTableNumber(value),
      });
      setTablenumber(value);
    },

    tableNumberKeyUp: (event) => {
      if (event.key === "Enter" || event.keyCode === 13) {
        closeTableEditorWhenFilled();
      }
    },

    tableNumberDone: closeTableEditorWhenFilled,
    editTableNumber: () => setTableEditable(true),

    orderStatusChange: (value) => {
      if (
        handleChangeStatus(
          value,
          orderDetailsObj.payment_status
        )
      ) {
        setOrderStatus(value);
      }
    },

    paymentStatusChange: (value) => {
      if (orderStatus === "Served" && !["Paid", "Completed"].includes(orderDetailsObj?.payment_status)) {
        setPaymemntStatus(value);
        return;
      }
      if (handleChangeStatus(orderDetailsObj.order_status, value)) {
        setPaymemntStatus(value);
      }
    },

    paymentModeChange: setPaymentMode,
    cancelledByChange: setCancelledBy,

    cancelReasonChange: (event) => {
      setCancelReason(event.target.value);
      setValidationForOrderCancel(
        validateCancelReason(event.target.value)
      );
    },

    loyaltyChange: changeLoyaltyPoints,
    loyaltyBlur: (event) => showLoyaltyError(event.target.value),
    discountRupeesChange: changeDiscountRupees,
    discountRupeesBlur: (event) =>
      showDiscountRupeesError(event.target.value),
    discountPercentageChange: changeDiscountPercentage,
    discountPercentageBlur: (event) =>
      showDiscountPercentageError(event.target.value),
    discountReasonChange: (event) =>
      setDiscountReason(event.target.value),
  };

  const statusValues = {
    orderId,
    tableNumber: tablenumber,
    isTableEditable: IsTableEditable,
    orderStatus,
    paymentStatus,
    paymentMode,
    cancelledBy,
    cancelReason: cancelReaon,
    customerLoyaltyPoints: customerLoyalitypoint,
    appliedLoyaltyPoints: applyLoyalityPoint,
  };

  const amountValues = {
    orderStatus,
    paymentStatus,
    discountRupee,
    discountPercentage,
    discountReason,
    discountPrice: discountprice,
    subTotal,
    loyaltyPointPrice: loyalityPointPrice,
    total,
    cgst,
    sgst,
    finalAmount,
    rating,
    review,
  };

  const statusErrors = {
    tableNumber: validationErrors.table_number,
    orderStatus: validationErrors.order_status,
    cancelReason: validationForOrderCancel,
    paymentStatus: validationErrors.payment_status,
    cancelledBy: validationErrors.cancelled_by,
    loyaltyPoints: validationErrors.apply_loyality_point,
  };

  const amountErrors = {
    discountRupees: validationDiscountErrors.discount_rupees,
    discountPercentage:
      validationDiscountErrors.discount_percentage,
    discountReason: validationErrors.discount_reason,
  };

  return (
    <div className={style.container}>
      <div className={style.titleContainer}>
        <div
          className={style.pageTitle}
          style={{ fontSize: "25px" }}
        >
          Order
        </div>
      </div>

      {isLoader ? (
        <Loader />
      ) : (
        <div>
          <form className={style.settingSection}>
            <div
              style={{
                padding: "12px 16px",
                marginBottom: 14,
                border: "1px solid #d8e2e9",
                borderRadius: 10,
              }}
            >
              <strong>Payment Verification</strong>

              {verification?.error ? (
                <p style={{ color: "#b45309" }}>
                  {verification.error}
                </p>
              ) : (
                <>
                  <p>
                    Method:{" "}
                    <strong>
                      {verification?.method || "Not selected"}
                    </strong>
                    {" | "}
                    Amount:{" "}
                    <strong>
                      ₹{verification?.amount || "0.00"}
                    </strong>
                  </p>

                  <p>
                    Customer claim:{" "}
                    <strong>
                      {verification?.verification_state ===
                        "awaiting_verification"
                        ? "Awaiting Verification"
                        : verification?.verification_state ===
                          "verified"
                          ? "Verified"
                          : verification?.verification_state ===
                            "rejected"
                            ? "Rejected"
                            : "Not submitted"}
                    </strong>
                  </p>

                  {verification?.verification_state ===
                    "awaiting_verification" && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 10,
                        }}
                      >
                        <button
                          type="button"
                          disabled={verificationBusy}
                          onClick={() => {
                            if (
                              window.confirm(
                                "Have you verified the actual cash/UPI receipt and exact amount?"
                              )
                            ) {
                              verifyPayment("confirm_paid");
                            }
                          }}
                        >
                          {verificationBusy
                            ? "Processing..."
                            : "Mark as Paid"}
                        </button>

                        <button
                          type="button"
                          disabled={verificationBusy}
                          onClick={() => verifyPayment("reject")}
                        >
                          Reject Claim
                        </button>
                      </div>
                    )}
                </>
              )}
            </div>

            <div
              className={style.formContainer}
              style={{
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              <OrderStatusFields
                order={orderDetailsObj}
                settings={settings}
                values={statusValues}
                errors={statusErrors}
                on={handlers}
                allowCancel={hasFeature("order_cancel")}
                showLoyalty={!staffMode && hasFeature("loyalty")}
                staffMode={staffMode}
                waiterLoyalty={staffMode && settings.allow_loyality_points === true ? {
                  points: applyLoyalityPoint ?? 0,
                  rupees: Number(loyalityPointPrice || 0).toFixed(2),
                  available: Math.max(0, Number(customerLoyalitypoint || 0)),
                  disabled: ["Paid", "Completed"].includes(orderDetailsObj?.payment_status),
                  onChange: handleWaiterLoyaltyChange,
                } : null}
              />

              <OrderAmountFields
                order={orderDetailsObj}
                settings={settings}
                values={amountValues}
                errors={amountErrors}
                on={handlers}
                showDiscount={hasFeature("discount")}
                showLoyalty={!staffMode && hasFeature("loyalty")}
              />
            </div>

            {stockError && <p role="alert" style={{ color: "#b91c1c", marginBottom: 8 }}>{stockError}</p>}
            <div className="erp-lines-scroll erp-lines-compact">
              <table className="erp-lines-table erp-lines-compact">
                <thead>
                  <tr>
                    <th className="erp-col-item">Item</th>
                    <th>Status</th>
                    <th>Size</th>
                    <th className="erp-col-num">Qty</th>
                    <th className="erp-col-price">Price</th>
                  </tr>
                </thead>

                <tbody>
                  {(orderItems || []).length === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        No items on this order
                      </td>
                    </tr>
                  ) : (
                    orderItems.map((line) => (
                      <tr key={line.id}>
                        <td className="erp-col-item">
                          {(() => {
                            const item = stockCatalog.find((row) => String(row.id) === String(line.item_id?.id || line.item_id) || row.name?.trim().toLowerCase() === String(line.item || "").trim().toLowerCase());
                            if (!item) return line.item;
                            return <div style={{ position: "relative", display: "inline-block" }}>
                              <button type="button" disabled={stockBusy} onClick={() => setStockOpenId((current) => current === line.id ? null : line.id)} style={{ border: 0, background: "none", padding: 0, color: "#087e88", cursor: "pointer", textDecoration: "underline", font: "inherit", fontWeight: 600 }} aria-expanded={stockOpenId === line.id}>{line.item}</button>
                              {item.kitchen_available === false && <span style={{ color: "#b91c1c", fontSize: 12, marginLeft: 7 }}>Unavailable</span>}
                              {stockOpenId === line.id && <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "8px 0" }}>
                                <button type="button" disabled={stockBusy || item.kitchen_available === true} onClick={() => setStockAvailability(item, true)}>Available</button>
                                <button type="button" disabled={stockBusy || item.kitchen_available === false} onClick={() => setStockAvailability(item, false, line)}>Unavailable</button>
                              </div>}
                            </div>;
                          })()}
                        </td>
                        <td>{line.item_status}</td>
                        <td>{line.serving_size}</td>
                        <td className="erp-col-num">
                          {line.quantity}
                        </td>
                        <td className="erp-col-price">
                          {Number(line.price || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <OrderFormActions
              order={orderDetailsObj}
              onClear={() => {
                getOrderDetail();
                resetValidation();
              }}
              onBack={() => back()}
              onSave={() => {
                saveOrder();
                window.scrollTo(0, 0);
              }}
              onAddItem={() => setModalVisible(true)}
            />
          </form>
        </div>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        footer={null}
        open={modalVisible}
        closable={false}
        keyboard={false}
      >
        <AddOrderItemForm
          orderId={orderDetailsObj.order_id}
          id={orderDetailsObj.id}
          staffMode={staffMode}
          modalvisibilityFn={setModalVisible}
          modalvisibility={modalVisible}
          onCancel={() => setModalVisible(false)}
          setOrderItems={setOrderItems}
          setOrderDetail={setorderDetailsObj}
          setOrderStatus={setOrderStatus}
          getOrderDetail={getOrderDetail}
        />
      </Modal>
    </div>
  );
};

export default OrderForm;
