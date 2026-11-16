import { React, useContext, useEffect, useState } from 'react';
import { Button } from 'antd';
import { useNavigate } from "react-router-dom";
import '../style/InvoiceDetail.css';
import { GlobalContext } from "../../../../context/Context";
import secureLocalStorage from "react-secure-storage";
import Payment from "../../../Payment/user_interface/containers/Payment";
import { getOrderItemsAndOrderAPI, extractOrderDateTime } from '../../../Order/services/orderService';
import Spinner from "../../../../components/Spinner/Spinner";
import { useInvoiceDetailState } from "../../usestate/invoiceDetailState";

export default function InvoiceDetail() {
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

  var customerDetail = secureLocalStorage.getItem('customer_details');

  var { isLoading, setLoading } = useInvoiceDetailState();

  useEffect(() => {
    getOrderItemsAndOrder();
  }, []);

  const getOrderItemsAndOrder = async () => {
    var tenantName = localStorage.getItem("tenantName");
    const data = {
      order: orders.order_id,
    };
    const response = await getOrderItemsAndOrderAPI(data, tenantName);
    if (response) {
      setLoading(true);
      if (
        secureLocalStorage.getItem("order") &&
        secureLocalStorage.getItem("orderItem")
      ) {
        secureLocalStorage.removeItem("order");
        secureLocalStorage.removeItem("orderItem");
        secureLocalStorage.setItem("order", response.order);
        secureLocalStorage.setItem("orderItem", response.orderItem);
        setOrderItem(secureLocalStorage.getItem("orderItem"));
        setOrders(secureLocalStorage.getItem("order"));
      } else {
        secureLocalStorage.setItem("order", response.order);
        secureLocalStorage.setItem("orderItem", response.orderItem);
        setOrderItem(secureLocalStorage.getItem("orderItem"));
        setOrders(secureLocalStorage.getItem("order"));
      }
      setLoading(false);
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
            className="inv_details_container"
            style={{ background: colors.backgroundTheme }}
          >
            <div
              className="inv_heading_container"
              style={{ color: colors.headingColor }}
            >
              Invoice Details
            </div>

            <div className="inv_parent_container">
              <div className="inv_Details_container">
                <div className="inv_details_1">
                  <span className="inv_details_heading">Order Id </span>
                  <span className="inv_details_colon">: </span>
                  <span className="inv_details_value">{orders.order_id}</span>
                </div>
                <div className="inv_details_1">
                  <span className="inv_details_heading">Table Number </span>
                  <span className="inv_details_colon">: </span>
                  <span className="inv_details_value">
                    {orders.table_number}
                  </span>
                </div>
                <div className="inv_details_1">
                  <span className="inv_details_heading">Name </span>
                  <span className="inv_details_colon">: </span>
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
                <div className="inv_details_1">
                  <span className="inv_details_heading">Contact Number </span>
                  <span className="inv_details_colon">: </span>
                  <span className="inv_details_value">
                    {customerDetail.contact_number}
                  </span>
                </div>
                <div className="inv_details_1">
                  <span className="inv_details_heading">Date </span>
                  <span className="inv_details_colon">: </span>
              <span className='inv_details_value'>{ExtractDateTime(orders.date).date}</span>
                </div>
                <div className="inv_details_1">
                  <span className="inv_details_heading">Time </span>
                  <span className="inv_details_colon">: </span>
              <span className='inv_details_value'>{ExtractDateTime(orders.date).time}</span>
                </div>
              </div>

              <div class="inv_horizontal_line"></div>

              <div className="inv_table_heading_container">
                <div className="inv_data_container">
                  <div className="inv_serial_no_container">
                    <span className="inv_serial_no_sub_heading">S.no</span>
                  </div>
                  <div className="inv_item_container">
                    <span className="inv_table_sub_heading">Item</span>
                  </div>
                  <div className="inv_qty_container">
                    <span className="inv_table_sub_heading">Qty</span>
                  </div>
                  <div className="inv_total_price_container">
                    <span className="inv_table_price_sub_heading">Price</span>
                  </div>
                </div>
              </div>

              <div class="inv_horizontal_line"></div>

              <div className="inv_child_container">
                {orderItems.map((items, index) => (
                  <>
                    {items.item_status == "Cancelled" ? null : (
                      <>
                        <div
                          className="inv_cart_container"
                          id={"order" + items.id}
                          key={index}
                          style={{
                            background: backgroundColor++ % 2 == 0 ? "#EAE5E3" : "white",
                          }}
                        >
                          <div className="inv_data_container">
                            <div className="inv_serial_no_container">
                              <span className="inv_serial_no_second_sub_heading">
                                {i++}
                              </span>
                            </div>
                            <div className="inv_item_container">
                              <span className="inv__second_sub_heading">
                                {items.item}&nbsp;({items.serving_size})
                              </span>
                            </div>
                            <div className="inv_qty_container">
                              <span className="inv_qunatity_sub_heading">
                                {items.quantity}
                              </span>
                            </div>
                            <div className="inv_total_price_container">
                              <span className="inv_total_rating_sub_heading">
                                {" "}
                                {rupee_sign} {items.price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ))}

                <div class="inv_horizontal_line"></div>

                <div className="CalculationBoxContainer">
                  <div className="calculationBox">
                    {orders.discount_rupees > 0 ? (
                      <>
                        <div className="calculationLine">
                          <div className="calculationLabel">
                            <div style={{ width: "98%" }}>Sub-Total</div>
                            <div>:</div>{" "}
                          </div>{" "}
                          <div className="calculationText">
                            {rupee_sign}
                            {orders.sub_total.toFixed(2)}
                          </div>
                        </div>
                        <div className="calculationLine">
                          <div className="calculationLabel">
                            <div style={{ width: "98%" }}>Discount</div>
                            <div>:</div>{" "}
                          </div>{" "}
                          <div className="calculationText">
                            {rupee_sign}
                            {orders.discount_rupees.toFixed(2)}
                          </div>
                        </div>
                        {orders.loyality_point_price > 0 ?(
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
                            </>):null}

                        {orders?.cgst > 0 || orders?.sgst > 0 ? (
                        <div className="calculationLine">
                          <div className="calculationLabel">
                            <div style={{ width: "98%" }}>Total</div>
                            <div>:</div>{" "}
                          </div>{" "}
                          <div className="calculationText">
                            {rupee_sign}
                            {orders.total.toFixed(2)}
                          </div>
                        </div>
                         ) : null}

                        {orders?.cgst > 0 ? (
                          <div className="calculationLine">
                            <div className="calculationLabel">
                              <div style={{ width: "98%" }}>CGST</div>
                              <div>
                                (
                                {(Math.round((orders.cgst / orders.total) * 100).toFixed(
                                  2
                                ))}
                                %) :
                              </div>{" "}
                            </div>{" "}
                            <div className="calculationText">
                              {rupee_sign}
                              {orders.cgst.toFixed(2)}
                            </div>
                          </div>
                        ) : null}
                        {orders?.sgst > 0 ? (
                          <div className="calculationLine">
                            <div className="calculationLabel">
                              <div style={{ width: "98%" }}>SGST</div>
                              <div>
                                (
                                {(Math.round((orders.sgst / orders.total) * 100).toFixed(
                                  2
                                ))}
                               %) :
                              </div>{" "}
                            </div>{" "}
                            <div className="calculationText">
                              {rupee_sign}
                              {orders.sgst.toFixed(2)}
                            </div>
                          </div>
                        ) : null}
                        {orders?.cgst > 0 || orders?.sgst > 0 ? (
                          <div className="breakLine" style={{ width: "98%" }} />
                        ) : null}
                        <div className="calculationLine">
                          <div className="calculationLabel">
                            <div style={{ width: "98%", fontWeight: 600 }}>
                              Grand Total
                            </div>
                            <div>:</div>
                          </div>{" "}
                          <div
                            className="calculationText"
                            style={{ fontWeight: 600 }}
                          >
                            {rupee_sign}
                            {orders.final_amount.toFixed(2)}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {orders?.cgst > 0 || orders?.sgst > 0 || orders.loyality_point_price>0? (
                          <>
                          <div className="calculationLine">
                            <div className="calculationLabel">
                              <div style={{ width: "98%" }}>Sub-Total</div>
                              <div>:</div>{" "}
                            </div>{" "}
                            <div className="calculationText">
                              {rupee_sign}
                              {orders.sub_total.toFixed(2)}
                            </div>
                          </div>

                          {orders.loyality_point_price > 0 ?(
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
                              {orders?.cgst > 0 || orders?.sgst > 0  ?
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
                              :null}
                            </>):null}
                          </>
                        ) : null}

                        {orders?.cgst > 0 ? (
                          <div className="calculationLine">
                            <div className="calculationLabel">
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
                               :<>
                                (
                                {(
                                Math.round((orders.cgst / orders.sub_total) *
                                  100
                                ).toFixed(2))}
                               %) :
                               </>}
                              </div>{" "}
                            </div>{" "}
                            <div className="calculationText">
                              {rupee_sign}
                              {orders.cgst.toFixed(2)}
                            </div>
                          </div>
                        ) : null}
                        {orders?.sgst > 0 ? (
                          <div className="calculationLine">
                            <div className="calculationLabel">
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
                               :<>
                                (
                                {(
                                Math.round((orders.sgst / orders.sub_total) *
                                  100
                                ).toFixed(2))}
                               %) :
                               </>}
                              </div>{" "}
                            </div>{" "}
                            <div className="calculationText">
                              {rupee_sign}
                              {orders.sgst.toFixed(2)}
                            </div>
                          </div>
                        ) : null}
                        {orders?.cgst > 0 || orders?.sgst > 0 ? (
                          <div className="breakLine" style={{ width: "98%" }} />
                        ) : null}
                        <div className="calculationLine">
                          <div className="calculationLabel">
                            <div style={{ width: "98%", fontWeight: 600 }}>
                              Total
                            </div>
                            <div>:</div>
                          </div>{" "}
                          <div
                            className="calculationText"
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

            <Payment />

          </div>
        </>
      )}
    </>
  );
}
