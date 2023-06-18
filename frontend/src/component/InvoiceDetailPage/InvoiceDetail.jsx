// Added by :- Parineeta Gedam
// Date :- 17-05-2023   
// Reason :- show the invoice page

import { React, useContext, useEffect, useState } from 'react';
import { Button } from 'antd';
import { useNavigate } from "react-router-dom";
import './InvoiceDetail.css';
import { GlobalContext } from "../../context/Context";
import secureLocalStorage from "react-secure-storage";
import Payment from "../Payment/Payment";
import { getOrderItemsAndOrderAPI } from "../../api/Services";
import Spinner from "../../Spinner/Spinner";

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

  // Added by Parineeta Date : 14-04-2022
  // Reason : Add serial no in invoice
  var i = 1;
  // end ofthe added code by Parineeta Date : 14-04-2022

  // Added by :-  Parineeta Gedam
  // Date :- 9-04-2023
  // Reason :- get order items from local stroage and map the data.

  // const [orderItems, setOrderItem] = useState([])
  // useEffect(() => {
  //   setOrderItem(secureLocalStorage.getItem('orderItem'))
  // }, [])
  // End of added code 09-04-2023

  // Added by :- Parineeta Gedam
  // Date :- 09-04-2023
  // Reason :- get data from local stroage

  // var orders = secureLocalStorage.getItem('order');
  // var orderItem = secureLocalStorage.getItem('orderItem');
  // var invoiceDetail = secureLocalStorage.getItem('invoice_detail');
  var customerDetail = secureLocalStorage.getItem('customer_details');
  // var tenantName = localStorage.getItem("tenantName");

  // Added by :- Parineeta Gedam
  // Date :- 14-04-2023
  // Reason :- Navigate to the payment page.  

  // const navigate = useNavigate();

  // const updateInvoiceData = async () => {
  //   navigate("/payment");
  // }
  // 
  // End of added code 14-04-2023

  // Added by :- Parineeta Gedam
  // Date :- 09-06-2023
  // Reason :- get order and order item
  const [isLoading, setLoading] = useState(false);

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

  // End of added code by :- Parineeta Gedam on 09-06-2023
 /**
   * Added by Yuvraj Sahu on 09-06-2023
   * Reason - to change date format
   */
  function ExtractDateTime(format) {
    var d = new Date(format);
    // var time = d.toLocaleTimeString();
    var time = d.toLocaleTimeString('en-US', {hour12: false})
    var date = `${orders.date}`.split("T")[0].split("-").reverse().join("/")
    return { time, date };
  }
  /**
   * End of changing date format by Yuvraj Sahu on 09-06-2023
   */

  return (
    // MOdified by :- Parineeta Gedam on 11-06-2023 reason :- add loding condition.
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
                  {customerDetail.name ? (
                    <>
                      <span className="inv_details_value">
                        {customerDetail.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="inv_details_value">-</span>
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
                   {/* Commeted and modified by Yuvraj Sahu on 09-06-2023
              Reason - to change the date format */}
              {/* <span className='inv_details_value'>{new Date(orders.date).toLocaleDateString()}</span> */}
              <span className='inv_details_value'>{ExtractDateTime(orders.date).date}</span>
              {/* End of modification by Yuvraj Sahu on 09-06-2023 */}
                </div>
                <div className="inv_details_1">
                  <span className="inv_details_heading">Time </span>
                  <span className="inv_details_colon">: </span>
                  {/* Commeted and modified by Yuvraj Sahu on 09-06-2023
              Reason - to change the time format */}
              {/* <span className='inv_details_value'>{new Date(orders.date).toLocaleTimeString()}</span> */}
              <span className='inv_details_value'>{ExtractDateTime(orders.date).time}</span>
              {/* End of modification by Yuvraj Sahu on 09-06-2023 */}
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
                    {/* Modified by :- Parineeta Gedam on  */}
                    {items.item_status == "Cancelled" ? null : (
                      <>
                        <div
                          className="inv_cart_container"
                          id={"order" + items.id}
                          key={index}
                          style={{
                            background: index % 2 === 0 ? "#EAE5E3" : "white",
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

                {/* Added by :- Parineeta Gedam on :- 24-04-2023
                    Reason :- changes in desiging
                */}
                {/* <div className='invoice_second_container'>
                        <div className='invoice_second_data_container'>
                          <span className="invoice_sub_heading">Subtotal</span>
                          <span className="invoice_second_sub_heading">₹ {orders.sub_total}</span>
                        </div>
                        <div className='invoice_second_data_container'>
                          <span className="invoice_sub_heading">CGST </span>
                          <span className="invoice_second_sub_heading"> ₹ {orders.cgst}</span>
                        </div>

                        <div className='invoice_second_data_container'>
                          <span className="invoice_sub_heading">SGST</span>
                          <span className="invoice_second_sub_heading"> ₹ {orders.sgst}</span>
                        </div>

                        <div className='invoice_second_data_container'>
                          <span className="invoice_sub_heading"><b>Total</b></span>
                          <span className="invoice_second_sub_heading"><b> ₹ {orders.total}</b></span>
                        </div>
                      </div> */}
                {/* End of commented code on 24-04-2023 */}

                {/* Commented by :- Parineeta Gedam on 09-06-2023
                                reason :- show the discount 
                            */}

                {/* Added by :- Parineeta Gedam on 24-04-2023
                          Reason :- changes in desiging
                      */}
                {/* <div className='inv_second_container'>
                              {orders?.cgst > 0 || orders?.sgst > 0 ? <div className='inv_second_data_container'>
                                <div className="inv_sub_heading">Subtotal : </div> */}
                {/* // Modified and commented by Om Shrivastava on 08-05-23
                          // Reason : Create the rupee sign globally for using the config file. */}
                {/* <div className="invoice_second_sub_heading">₹ {orders.sub_total}</div> */}
                {/* <div className="inv_second_sub_heading"> {rupee_sign} {orders.sub_total.toFixed(2)}</div> */}
                {/* End of addition by Om Shrivastava on 08-05-23 */}
                {/* </div> : null} */}

                {/* Modified by - ROhan KAnsari - 13/5/23 to dont show cgst if it is zero*/}
                {/* {orders?.cgst > 0 ? <div className='inv_second_data_container'> */}
                {/* <div className="inv_sub_heading">CGST : </div> */}
                {/* Added by rohan- 14/4/23 -------------------------------- */}
                {/* Modified by rohan- 16-04-2023 -------------------------------- */}
                {/* // Modified and commented by Om Shrivastava on 08-05-23
                          // Reason : Create the rupee sign globally for using the config file. */}
                {/* <div className="invoice_second_sub_heading"> ₹ {orders.cgst}</div> */}
                {/* <div className="inv_second_sub_heading"> {rupee_sign} {orders.cgst.toFixed(2)}</div> */}
                {/* End of addition by Om Shrivastava on 08-05-23 */}
                {/* </div> : null} */}

                {/* Modified by rohan- 16-04-2023 -------------------------------- */}
                {/* Modified by - ROhan KAnsari - 13/5/23 to dont show cgst if it is zero*/}
                {/* {orders?.sgst > 0 ? <div className='inv_second_data_container'> */}
                {/* <div className="inv_sub_heading">SGST : </div> */}
                {/* // Modified and commented by Om Shrivastava on 08-05-23
                          // Reason : Create the rupee sign globally for using the config file. */}
                {/* <div className="invoice_second_sub_heading"> ₹ {orders.sgst}</div> */}
                {/* <div className="inv_second_sub_heading"> {rupee_sign}  {orders.sgst.toFixed(2)}</div> */}
                {/* End of addition by Om Shrivastava on 08-05-23 */}
                {/* </div> : null} */}
                {/* End of added code on 16-04-2023 */}

                {/* <div className='inv_second_data_container'> */}
                {/* <div className="inv_sub_heading"><b>Total : </b></div> */}
                {/* Modified by :- Parineeta Gedam on 19-04-2023 */}
                {/* <span className="invoice_second_sub_heading"><b> ₹ {orders.total}</b></span> */}
                {/* // Modified and commented by Om Shrivastava on 08-05-23
                          // Reason : Create the rupee sign globally for using the config file. */}
                {/* <div className="invoice_second_sub_heading"><b> ₹ {orders.total}</b></div> */}
                {/* <div className="inv_second_sub_heading"><b>  {rupee_sign}  {orders.total.toFixed(2)}</b></div> */}
                {/* End of addition by Om Shrivastava on 08-05-23 */}

                {/* End of modified code on 19-04-2023 */}
                {/* </div> */}
                {/* </div> */}
                {/* End of added code */}
                {/* /End of commented code on 09-06-2023 */}

                {/* Added by :- PArineeta Gedam on 09-06-2023
                                reason :- show the discount amount
                            */}

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
                        {/* Addition by Om Shrivastava on 14-06-23
                        Reason : Show the loyality price in invoice details page */}
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
                        {/* End of addition by Om Shrivastava on 14-06-23 */}
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
                        {orders?.cgst > 0 ? (
                          <div className="calculationLine">
                            <div className="calculationLabel">
                              <div style={{ width: "98%" }}>CGST</div>
                              <div>
                                (
                                {((orders.cgst / orders.total) * 100).toFixed(
                                  2
                                )}
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
                                {((orders.sgst / orders.total) * 100).toFixed(
                                  2
                                )}
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
                              Grant Total
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
                      {/* Add some condition when cgst and sgst is not apply by Om Shrivastava on 17-06-23 */}
                        {orders?.cgst > 0 || orders?.sgst > 0 || orders.loyality_point_price>0? (
                          // Modification and addition by Om Shrivastava on 14-06-23
                          // Reason : Save the loayality point price in order details page
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
                      {/* Add some condition when cgst and sgst is not apply by Om Shrivastava on 17-06-23 */}
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

                        {/* End of addition and modification by Om Shrivastava on 14-06-23 */}

                        {orders?.cgst > 0 ? (
                          <div className="calculationLine">
                            <div className="calculationLabel">
                              <div style={{ width: "98%" }}>CGST</div>
                              <div>
                                (
                                {(
                                  (orders.cgst / orders.sub_total) *
                                  100
                                ).toFixed(2)}
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
                                {(
                                  (orders.sgst / orders.sub_total) *
                                  100
                                ).toFixed(2)}
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

                {/* End of added code by :- Parineeta G3edam on 09-06-2023 */}
              </div>
            </div>

            <div
              style={{
                width: "93%",
                border: "1.5px solid black",
                margin: "0px 10px 0px 10px",
              }}
            ></div>

            {/* Added by :- Parineeta Gedam on 21-05-2023 
        reason:- changes in ui, here show the payment method */}

            <Payment />

            {/* End of added code by :- Parineeta Gedam on 21-05-2023 */}

            {/* Added by :- Parineeta Gedam on 21-05-2023 
          reason :- don't show this button 
      */}
            {/* <div className='inv_btn_container'>
          <Button
            id="signBtn"
            type="primary"
            htmlType="submit"
            block
            className='inv_btn_heading'
            style={{
              backgroundColor: colors.bannerColor,
              color: colors.backgroundTheme,
              border: "none",
              marginBottom: '30%',

            }}
            onClick={(e) => updateInvoiceData()}
          >
            Proceed to pay
          </Button>
        </div> */}
            {/* End of added code by:- PArineeta Gedam on 21-05-2023 */}
          </div>
        </>
      )}
    </>
    // End of modified code by :- Parineeta Gedam on 11-06-2023
  );
}
// End of added code 07-04-2023
