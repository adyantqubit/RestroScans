import { React, useContext, useEffect, useState } from "react";
import { notification, message, Popconfirm } from "antd";

import { useNavigate } from "react-router-dom";
import "../style/OrderDetails.css";
import { GlobalContext } from "../../../../context/Context";
import secureLocalStorage from "react-secure-storage";
import { updateRatingAndReviewApi } from '../../../Rating/services/ratingService';
import { postUpdateOrderItems, deleteOrderItems } from '../../../Cart/services/cartService';
import { CheckOrderConfirmAPI, getOrderItemsAndOrderAPI, extractOrderDateTime, changeOrderItemQuantity, calculateOrderTotals } from '../../services/orderService';
import {
  CloseCircleOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { getManualPaymentApi } from "../../../Payment/services/paymentService";
import Spinner from "../../../../components/Spinner/Spinner";
import SocialLinks from "../../../Footer/user_interface/components/SocialLinks";
import { useOrderDetailsState } from "../../usestate/orderDetailsState";

export default function OrderDetails() {
  const [api, contextHolder] = notification.useNotification();
  const [liveStatus, setLiveStatus] = useState(null);
  const [goldPoints, setGoldPoints] = useState(null);
  const [trackingError, setTrackingError] = useState(false);

  // get colors from context
  var {
    colors,
    setCart,
    rupee_sign,
    setOrderItem,
    orderItems,
    setOrders,
    orders,
  } = useContext(GlobalContext);

  var i = 1;

  var backgroundColor = 1;

  var { isLoading, setLoading } = useOrderDetailsState();

  useEffect(() => {
    getOrderItemsAndOrder();
  }, []);

  var orderItem = secureLocalStorage.getItem("orderItem");
  var invoiceDetail = secureLocalStorage.getItem("invoice_detail");
  var customerDetail = secureLocalStorage.getItem("customer_details");
  var tenantName = localStorage.getItem("tenantName");

  var settingData = secureLocalStorage.getItem("setting_data");

  useEffect(() => {
    const orderId = orders?.order_id || secureLocalStorage.getItem("order")?.order_id;
    if (!orderId) return;
    let active = true;
    const refreshStatus = async () => {
      try {
        const result = await getOrderItemsAndOrderAPI({ order: orderId }, localStorage.getItem("tenantName"));
        if (!active) return;
        if (result?.order?.order_status) {
          setLiveStatus(result.order.order_status);
          // Keep the shared order context in sync so payment actions appear
          // immediately when the restaurant marks the order Served.
          setOrders((current) => {
            if (!current || current.order_id !== orderId || current.order_status === result.order.order_status) return current;
            return { ...current, order_status: result.order.order_status };
          });
          setTrackingError(false);
        } else {
          setTrackingError(true);
        }
      } catch (_) {
        if (active) setTrackingError(true);
      }
    };
    refreshStatus();
    getManualPaymentApi(orderId).then((data) => setGoldPoints(data?.loyalty_enabled ? data.loyalty_points : null)).catch(() => { });
    const interval = window.setInterval(refreshStatus, 3000);
    const onFocus = () => refreshStatus();
    window.addEventListener("focus", onFocus);
    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [orders?.order_id]);

  const getOrderItemsAndOrder = async () => {
    var tenantName = localStorage.getItem("tenantName")
    const data = {
      order: orders.order_id,
    };
    const response = await getOrderItemsAndOrderAPI(data, tenantName);
    if (response && response.order) {
      setLoading(true);
      setLiveStatus(response.order.order_status);
      secureLocalStorage.setItem("order", response.order);
      secureLocalStorage.setItem("orderItem", response.orderItem);
      setOrderItem(response.orderItem);
      setOrders(calculateOrderTotals(response.order, response.orderItem, settingData?.cgst, settingData?.sgst));
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const updateInvoiceData = async () => {
    navigate("/payment");
  }

  function increamentQuantiy(items) {
    const next = changeOrderItemQuantity(orderItems, orders, items, 1, settingData.cgst, settingData.sgst);
    setOrderItem([...next.orderItems]);
    setOrders({ ...next.orders });
  }

  function decreamentQuantiy(items) {
    const next = changeOrderItemQuantity(orderItems, orders, items, -1, settingData.cgst, settingData.sgst);
    if (next.blocked) {
      message.warning({
        content: "Quantity can't be less than 1",
        key: 1,
        className: "custom-class",
        style: {
          marginTop: "15vh",
        },
      });
      return;
    }
    setOrderItem([...next.orderItems]);
    setOrders({ ...next.orders });
  }

  const submitUpdateOrders = async () => {
    setLoading(true);
    var tenantName = localStorage.getItem("tenantName");
    const updateOrders = {
      orders: orders.order_id,
      orderItems: orderItems,
      tenant: tenantName,
      order: orders,
    };
    const response = await postUpdateOrderItems(tenantName, updateOrders);
    if (response) {
      secureLocalStorage.removeItem("orderItem");
      secureLocalStorage.removeItem("order");
      secureLocalStorage.setItem("orderItem", response.orderItem);
      secureLocalStorage.setItem("order", response.order);
      setOrderItem(response.orderItem);
      setOrders(calculateOrderTotals(response.order, response.orderItem, settingData?.cgst, settingData?.sgst));
      setLoading(false);
    }
  };

  const confirm = (items) => {
    new Promise((resolve) => {
      setTimeout(() => resolve(null), 5000);
      handleRemove(items.id);
    });
  };
  const handleRemove = async (id) => {
    setLoading(true);
    var tenantName = localStorage.getItem("tenantName");
    const data = {
      order: orders.order_id,
      orderItem: id,
      tenant: tenantName,
    };

    if (orderItems.filter((dt) => dt.item_status == "Pending").length == 1) {
      data["cancelled_by"] = "Customer"
    }

    const response = await deleteOrderItems(tenantName, data);
    if (response.orderItem) {
      secureLocalStorage.removeItem("orderItem");
      secureLocalStorage.removeItem("order");
      secureLocalStorage.setItem("orderItem", response.orderItem);
      secureLocalStorage.setItem("order", response.order);
      setOrderItem(response.orderItem);
      setOrders(calculateOrderTotals(response.order, response.orderItem, settingData?.cgst, settingData?.sgst))
      setLoading(false);

      {
        if (response.order && response.order.order_status == "Cancelled") {
          secureLocalStorage.removeItem('order');
          secureLocalStorage.removeItem('orderItem');
          secureLocalStorage.removeItem("setting_data");
          secureLocalStorage.removeItem("customer_details");
          secureLocalStorage.removeItem("invoice_detail");
          navigate("/menu-item");
        }
      }

      const rem = message.info({
        content: "Item has been removed from your cart",
        key: 1,
        className: "custom-class",
        icon: <InfoCircleOutlined style={{ color: "blue" }} />,
        style: {
          marginTop: "13vh",
        },
      });
    }
    getOrderItemsAndOrder();
  };

  const checkOrderConfirm = async () => {
    var tenantName = localStorage.getItem("tenantName");
    const order = {
      order_id: orders.order_id,
    };
    const response = await CheckOrderConfirmAPI(order, tenantName);
    if (response.order) {
      navigate("/invoice");
    }
    else {
      message.error({
        content: "Please wait for order confirmations",
        key: 1,
        icon: <CheckCircleOutlined />,
        style: {
          marginTop: "5vh",
          fontSize: "16px",
          letterSpacing: "1.3px",
          fontFamily: "Times News Roman",
          color: colors.headingColor,
        },
      });
    }
  };

  function ExtractDateTime(format) {
    return extractOrderDateTime(format);
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div
            className="order_details_container"
            style={{ background: colors.backgroundTheme }}
          >
            <div
              className="invoice_heading_container"
              style={{ color: colors.headingColor }}
            >
              Order Details
            </div>

            <section className="rs-live-tracking" aria-label="Live order tracking">
              <div className="rs-live-tracking-head">
                <div><strong>Live Order Status</strong><small>Updates automatically every 5 seconds</small></div>
                {goldPoints !== null && <span style={{ marginRight: 8, padding: "6px 10px", background: "#fff5d6", color: "#8a6000", borderRadius: 20, fontWeight: 700 }}>🪙 Loyalty Point {goldPoints}</span>}
                <span className="rs-live-status">{liveStatus === "Confirm" ? "Accepted" : liveStatus === "Cooked" ? "Ready to Serve" : (liveStatus || orders?.order_status || "Placed")}</span>
              </div>
              {(liveStatus || orders?.order_status) === "Cancelled" ? (
                <p className="rs-live-cancelled">This order has been cancelled. Please contact the restaurant if you need help.</p>
              ) : (
                <div className="rs-live-steps">
                  {[
                    ["Placed", "Order Placed"],
                    ["Confirm", "Accepted & Preparing"],
                    ["Cooked", "Ready to Serve"],
                    ["Served", "Served"]
                  ].map(([key, label], index, steps) => {
                    const current = liveStatus || orders?.order_status || "Placed";
                    const currentIndex = steps.findIndex(([status]) => status === current);
                    return <div className={"rs-live-step " + (index <= currentIndex ? "is-done" : "")} key={key}>
                      <span className="rs-live-dot">{index < currentIndex ? "✓" : index + 1}</span>
                      <span>{label}</span>
                    </div>;
                  })}
                </div>
              )}
              {(liveStatus || orders?.order_status) === "Confirm" && <p className="rs-live-message">Your order has been accepted and is being prepared. The restaurant will update the status when it is ready.</p>}
              {trackingError && <p className="rs-live-warning">Unable to refresh right now. Showing the last known status.</p>}
            </section>

            <div className="invoice_parent_container">
              <div className="invoice_Details_container">

                <div className="invoice_details_1">
                  <span className="invoice_details_heading">Order Id </span>
                  <span className="invoice_details_colon">: </span>
                  <span className="invoice_details_value">
                    {orders.order_id}
                  </span>
                </div>
                <div className="invoice_details_1">
                  <span className="invoice_details_heading">Table Number </span>
                  <span className="invoice_details_colon">: </span>
                  <span className="invoice_details_value">
                    {orders.table_number}
                  </span>
                </div>
                <div className="invoice_details_1">
                  <span className="invoice_details_heading">Name </span>
                  <span className="invoice_details_colon">: </span>

                  {orders.customer_name ? (
                    <>
                      <span className="invoice_details_value">
                        {orders.customer_name}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="invoice_details_value">-</span>
                    </>
                  )}
                </div>
                <div className="invoice_details_1">
                  <span className="invoice_details_heading">
                    Contact Number{" "}
                  </span>
                  <span className="invoice_details_colon">: </span>
                  <span className="invoice_details_value">
                    {customerDetail.contact_number}
                  </span>
                </div>
                <div className="invoice_details_1">
                  <span className="invoice_details_heading">Date </span>
                  <span className="invoice_details_colon">: </span>
                  <span className="invoice_details_value">
                    {ExtractDateTime(orders.date).date}
                  </span>
                </div>
                <div className="invoice_details_1">
                  <span className="invoice_details_heading">Time </span>
                  <span className="invoice_details_colon">: </span>
                  <span className="invoice_details_value">
                    {ExtractDateTime(orders.date).time}
                  </span>
                </div>
              </div>

              <div class="invoice_horizontal_line"></div>

              <div className="invoice_table_heading_container">
                <div className="invoice_data_container">
                  <div className="invoice_serial_no_container">
                    <span className="invoice_serial_no_sub_heading">S.no</span>
                  </div>
                  <div className="invoice_item_container">
                    <span className="invoice_table_sub_heading">Item</span>
                  </div>
                  <div className="invoice_qty_container">
                    <span className="invoice_table_sub_heading">Qty</span>
                  </div>
                  <div className="invoice_total_price_container">
                    <span className="invoice_table_price_sub_heading">
                      Price
                    </span>
                  </div>
                  <div className="invoice_action_container">
                    <span className="invoice_action_sub_heading">Action</span>
                  </div>
                </div>
              </div>

              <div class="invoice_horizontal_line"></div>

              <div className="invoice_child_container">
                {orderItems.map((items, index) => (
                  <>
                    {items.item_status == "Cancelled" ? null : (
                      <>
                        <div
                          className="invoice_cart_container"
                          id={"order" + items.id}
                          key={index}
                          style={{
                            background: backgroundColor++ % 2 == 0 ? "#EAE5E3" : "white",
                          }}
                        >
                          <div className="invoice_data_container">
                            <div className="invoice_serial_no_container">
                              <span className="invoice_serial_no_second_sub_heading">
                                {i++}
                              </span>
                            </div>
                            <div className="invoice_item_container">
                              <span className="invoice__second_sub_heading">
                                {items.item}&nbsp;({items.serving_size})
                              </span>
                            </div>

                            <div className="invoice_qty_data_container" style={{ justifyContent: "center" }}>
                              <div className="invoice_qunatity_sub_heading">{items.quantity}</div>
                            </div>

                            <div className="invoice_total_price_container">
                              <span className="invoice_total_rating_sub_heading">
                                {rupee_sign} {items.price.toFixed(2)}
                              </span>
                            </div>

                            <div className="invoice_action_container">
                              <span aria-label="Order item locked" style={{ color: "#89939e" }}>—</span>
                            </div>
                          </div>

                        </div>
                      </>
                    )}
                  </>
                ))}

                <div class="invoice_horizontal_line"></div>

                <div className="order-calculation-box-ontainer">
                  <div className="order-calculation-box">
                    {orders.discount_rupees > 0 ? (
                      <>
                        <div className="order-calculation-line">
                          <div className="order-calculation-label">
                            <div style={{ width: "98%" }}>Sub-Total</div>
                            <div>:</div>{" "}
                          </div>
                          <div className="order-calculation-text">
                            {rupee_sign}
                            {orders.sub_total.toFixed(2)}
                          </div>
                        </div>
                        <div className="order-calculation-line">
                          <div className="order-calculation-label">
                            <div style={{ width: "98%" }}>Discount</div>
                            <div>:</div>
                          </div>
                          <div className="order-calculation-text">
                            {rupee_sign}
                            {orders.discount_rupees.toFixed(2)}
                          </div>
                        </div>
                        {orders.loyality_point_price > 0 ? (
                          <>
                            <div className="order-calculation-line">
                              <div className="order-calculation-label">
                                <div style={{ width: "98%" }}>Loyality price</div>
                                <div>:</div>{" "}
                              </div>{" "}
                              <div className="order-calculation-text">
                                {rupee_sign}
                                {orders.loyality_point_price.toFixed(2)}
                              </div>
                            </div>
                          </>) : null}

                        {orders?.cgst > 0 || orders?.sgst > 0 ? (
                          <div className="order-calculation-line">
                            <div className="order-calculation-label">
                              <div style={{ width: "98%", fontWeight: 600 }}>
                                Total
                              </div>
                              <div>:</div>{" "}
                            </div>{" "}
                            <div
                              className="order-calculation-text"
                              style={{ fontWeight: 600 }}
                            >
                              {rupee_sign}
                              {orders.total.toFixed(2)}
                            </div>
                          </div>
                        ) : null}

                        {orders?.cgst > 0 ? (
                          <div className="order-calculation-line">
                            <div className="order-calculation-label">
                              <div style={{ width: "98%" }}>CGST</div>
                              <div>
                                (
                                {(Math.round((orders.cgst / orders.total) * 100).toFixed(
                                  2
                                ))}{" "}
                                %) :
                              </div>{" "}
                            </div>{" "}
                            <div className="order-calculation-text">
                              {rupee_sign}
                              {orders.cgst.toFixed(2)}
                            </div>
                          </div>
                        ) : null}
                        {orders?.sgst > 0 ? (
                          <div className="order-calculation-line">
                            <div className="order-calculation-label">
                              <div style={{ width: "98%" }}>SGST</div>
                              <div>
                                (
                                {(
                                  Math.round((orders.sgst / orders.total) * 100).toFixed(
                                    2
                                  ))}{" "}
                                %) :
                              </div>{" "}
                            </div>{" "}
                            <div className="order-calculation-text">
                              {rupee_sign}
                              {orders.sgst.toFixed(2)}
                            </div>
                          </div>
                        ) : null}
                        {orders?.cgst > 0 || orders?.sgst > 0 ? (
                          <div
                            className="order-break-line"
                            style={{ width: "98%" }}
                          />
                        ) : null}
                        <div className="order-calculation-line">
                          <div className="order-calculation-label">
                            <div style={{ width: "98%", fontWeight: 600 }}>
                              Grand Total
                            </div>
                            <div>:</div>
                          </div>{" "}
                          <div
                            className="order-calculation-text"
                            style={{ fontWeight: 600 }}
                          >
                            {rupee_sign}
                            {orders.final_amount.toFixed(2)}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {orders?.cgst > 0 || orders?.sgst > 0 || orders.loyality_point_price > 0 ? (
                          <>
                            <div className="order-calculation-line">
                              <div className="order-calculation-label">
                                <div style={{ width: "98%" }}>Sub-Total</div>
                                <div>:</div>{" "}
                              </div>{" "}
                              <div className="order-calculation-text">
                                {rupee_sign}
                                {orders.sub_total.toFixed(2)}
                              </div>
                            </div>

                            {orders.loyality_point_price > 0 ? (
                              <>
                                <div className="order-calculation-line">
                                  <div className="order-calculation-label">
                                    <div style={{ width: "98%" }}>Loyality price</div>
                                    <div>:</div>{" "}
                                  </div>{" "}
                                  <div className="order-calculation-text">
                                    {rupee_sign}
                                    {orders.loyality_point_price.toFixed(2)}
                                  </div>
                                </div>

                                {orders?.cgst > 0 || orders?.sgst > 0 ?
                                  <div className="order-calculation-line">
                                    <div className="order-calculation-label">
                                      <div style={{ width: "98%" }}>Total</div>
                                      <div>:</div>{" "}
                                    </div>{" "}
                                    <div className="order-calculation-text">
                                      {rupee_sign}
                                      {orders.total.toFixed(2)}
                                    </div>
                                  </div>
                                  : null}
                              </>) : null}
                          </>
                        ) : null}

                        {orders?.cgst > 0 ? (
                          <div className="order-calculation-line">
                            <div className="order-calculation-label">
                              <div style={{ width: "98%" }}>CGST</div>
                              <div>
                                {orders.loyality_point_price > 0 ?
                                  <>
                                    (
                                    {(
                                      Math.round((orders.cgst / orders.total) *
                                        100
                                      ).toFixed(2))}
                                    %) :
                                  </>
                                  : <>
                                    (
                                    {(
                                      Math.round((orders.cgst / orders.sub_total) *
                                        100
                                      ).toFixed(2))}
                                    %) :
                                  </>}
                              </div>{" "}
                            </div>{" "}
                            <div className="order-calculation-text">
                              {rupee_sign}
                              {orders.cgst.toFixed(2)}
                            </div>
                          </div>
                        ) : null}
                        {orders?.sgst > 0 ? (
                          <div className="order-calculation-line">
                            <div className="order-calculation-label">
                              <div style={{ width: "98%" }}>SGST</div>
                              <div>
                                {orders.loyality_point_price > 0 ?
                                  <>
                                    (
                                    {(
                                      Math.round((orders.sgst / orders.total) *
                                        100
                                      ).toFixed(2))}
                                    %) :
                                  </>
                                  : <>
                                    (
                                    {(
                                      Math.round((orders.sgst / orders.sub_total) *
                                        100
                                      ).toFixed(2))}
                                    %) :
                                  </>}
                              </div>{" "}
                            </div>{" "}
                            <div className="order-calculation-text">
                              {rupee_sign}
                              {orders.sgst.toFixed(2)}
                            </div>
                          </div>
                        ) : null}
                        {orders?.cgst > 0 || orders?.sgst > 0 ? (
                          <div
                            className="order-break-line"
                            style={{ width: "98%" }}
                          />
                        ) : null}
                        <div className="order-calculation-line">
                          <div className="order-calculation-label">
                            <div style={{ width: "98%", fontWeight: 600 }}>
                              Total
                            </div>
                            <div>:</div>
                          </div>{" "}
                          <div
                            className="order-calculation-text"
                            style={{ fontWeight: 600 }}
                          >
                            {rupee_sign}
                            {orders.final_amount.toFixed(2)}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>

            <div
              style={{
                width: "93%",
                border: "1.5px solid black",
                margin: "0px 10px 0px 10px",
              }}
            ></div>

            <div className="order_add_item_btn_container">
              <button
                className="invoice_btn_update_order"
                style={{
                  background: colors.bannerColor,
                  color: colors.backgroundTheme,
                }}
                onClick={(e) => navigate('/menu-item')}
              >
                Add More Item
              </button>
            </div>

            <div className="invoice_btn_container">
              {(liveStatus || orders?.order_status) === "Served" ? (
                <button
                  className="invoice_btn_heading"
                  style={{ background: colors.bannerColor, color: colors.backgroundTheme }}
                  onClick={() => checkOrderConfirm()}
                >
                  Proceed to Payment
                </button>
              ) : null}
            </div>

          </div>
          <div
            style={{
              position: "fixed",
              bottom: 5,
              height: "65px",
              width: "100%",
              background: colors.backgroundTheme,
            }}
          >
            <SocialLinks />
          </div>
        </>
      )}
    </>
  );
}
