// Added by :- Parineeta Gedam
// Date :- 17-05-2023   
// Reason :- show the invoice page

import { React, useContext, useEffect, useState } from 'react';
import { Button } from 'antd';
import { useNavigate } from "react-router-dom";
import './InvoiceDetail.css';
import { GlobalContext } from "../../context/Context";
import secureLocalStorage from "react-secure-storage";
import Payment from '../Payment/Payment';


export default function InvoiceDetail() {

  // get colors from context 
  var { colors, setCart, rupee_sign, setOrderItem, orderItems, setOrders, orders } = useContext(GlobalContext);

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




  return (
    <>
      <div className='inv_details_container' style={{ background: colors.backgroundTheme }}>
        <div className='inv_heading_container' style={{ color: colors.headingColor }}>Invoice Details
        </div>

        <div className='inv_parent_container'>
          <div className='inv_Details_container'>
            <div className='inv_details_1'>
              <span className='inv_details_heading'>Order Id </span>
              <span className='inv_details_colon'>: </span>
              <span className='inv_details_value'>{orders.order_id}</span>
            </div>
            <div className='inv_details_1'>
              <span className='inv_details_heading'>Table Number </span>
              <span className='inv_details_colon'>: </span>
              <span className='inv_details_value'>{orders.table_number}</span>
            </div>
            <div className='inv_details_1'>
              <span className='inv_details_heading'>Name </span>
              <span className='inv_details_colon'>: </span>
              {customerDetail.name ?
                <>
                  <span className='inv_details_value'>{customerDetail.name}</span>
                </> :
                <><span className='inv_details_value'>-</span></>
              }
            </div>
            <div className='inv_details_1'>
              <span className='inv_details_heading'>Contact Number </span>
              <span className='inv_details_colon'>: </span>
              <span className='inv_details_value'>{customerDetail.contact_number}</span>
            </div>
            <div className='inv_details_1'>
              <span className='inv_details_heading'>Date </span>
              <span className='inv_details_colon'>: </span>
              <span className='inv_details_value'>{new Date(orders.date).toLocaleDateString()}</span>
            </div>
            <div className='inv_details_1'>
              <span className='inv_details_heading'>Time </span>
              <span className='inv_details_colon'>: </span>
              <span className='inv_details_value'>{new Date(orders.date).toLocaleTimeString()}</span>
            </div>
          </div>

          <div class="inv_horizontal_line"></div>

          <div className='inv_table_heading_container'>
            <div className='inv_data_container'>
              <div className='inv_serial_no_container'>
                <span className='inv_serial_no_sub_heading'>S.no</span>
              </div>
              <div className='inv_item_container'>
                <span className='inv_table_sub_heading'>Item</span>
              </div>
              <div className='inv_qty_container'>
                <span className="inv_table_sub_heading">Qty</span>
              </div>
              <div className='inv_total_price_container'>
                <span className="inv_table_price_sub_heading">Price</span>
              </div>
            </div>
          </div>

          <div class="inv_horizontal_line"></div>

          <div className='inv_child_container'>
            {orderItems.map((items, index) => (
              <>
                {/* Modified by :- Parineeta Gedam on  */}
                {items.item_status == "Cancelled" ? null :
                  <>
                    <div className='inv_cart_container' id={"order" + items.id} key={index}
                      style={{
                        background:
                          index % 2 === 0
                            ? "#EAE5E3"
                            : "white"
                      }}
                    >
                      <div className='inv_data_container'>
                        <div className='inv_serial_no_container'>
                          <span className='inv_serial_no_second_sub_heading'>{i++}</span>
                        </div>
                        <div className='inv_item_container'>
                          <span className='inv__second_sub_heading'>{items.item}&nbsp;({items.serving_size})</span>
                        </div>
                        <div className='inv_qty_container'>
                          <span className="inv_qunatity_sub_heading">{items.quantity}</span>
                        </div>
                        <div className='inv_total_price_container'>
                          <span className="inv_total_rating_sub_heading"> {rupee_sign} {items.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </>

                }
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

            {/* Added by :- Parineeta Gedam on 24-04-2023
              Reason :- changes in desiging
          */}
            <div className='inv_second_container'>
              {orders?.cgst > 0 || orders?.sgst > 0 ? <div className='inv_second_data_container'>
                <div className="inv_sub_heading">Subtotal : </div>
                {/* // Modified and commented by Om Shrivastava on 08-05-23
              // Reason : Create the rupee sign globally for using the config file. */}
                {/* <div className="invoice_second_sub_heading">₹ {orders.sub_total}</div> */}
                <div className="inv_second_sub_heading"> {rupee_sign} {orders.sub_total.toFixed(2)}</div>
                {/* End of addition by Om Shrivastava on 08-05-23 */}
              </div> : null}

              {/* Modified by - ROhan KAnsari - 13/5/23 to dont show cgst if it is zero*/}
              {orders?.cgst > 0 ? <div className='inv_second_data_container'>
                <div className="inv_sub_heading">CGST : </div>
                {/* Added by rohan- 14/4/23 -------------------------------- */}
                {/* Modified by rohan- 16-04-2023 -------------------------------- */}
                {/* // Modified and commented by Om Shrivastava on 08-05-23
              // Reason : Create the rupee sign globally for using the config file. */}
                {/* <div className="invoice_second_sub_heading"> ₹ {orders.cgst}</div> */}
                <div className="inv_second_sub_heading"> {rupee_sign} {orders.cgst.toFixed(2)}</div>
                {/* End of addition by Om Shrivastava on 08-05-23 */}
              </div> : null}

              {/* Modified by rohan- 16-04-2023 -------------------------------- */}
              {/* Modified by - ROhan KAnsari - 13/5/23 to dont show cgst if it is zero*/}
              {orders?.sgst > 0 ? <div className='inv_second_data_container'>
                <div className="inv_sub_heading">SGST : </div>
                {/* // Modified and commented by Om Shrivastava on 08-05-23
              // Reason : Create the rupee sign globally for using the config file. */}
                {/* <div className="invoice_second_sub_heading"> ₹ {orders.sgst}</div> */}
                <div className="inv_second_sub_heading"> {rupee_sign}  {orders.sgst.toFixed(2)}</div>
                {/* End of addition by Om Shrivastava on 08-05-23 */}
              </div> : null}
              {/* End of added code on 16-04-2023 */}

              <div className='inv_second_data_container'>
                <div className="inv_sub_heading"><b>Total : </b></div>
                {/* Modified by :- Parineeta Gedam on 19-04-2023 */}
                {/* <span className="invoice_second_sub_heading"><b> ₹ {orders.total}</b></span> */}
                {/* // Modified and commented by Om Shrivastava on 08-05-23
              // Reason : Create the rupee sign globally for using the config file. */}
                {/* <div className="invoice_second_sub_heading"><b> ₹ {orders.total}</b></div> */}
                <div className="inv_second_sub_heading"><b>  {rupee_sign}  {orders.total.toFixed(2)}</b></div>
                {/* End of addition by Om Shrivastava on 08-05-23 */}

                {/* End of modified code on 19-04-2023 */}
              </div>
            </div>
            {/* End of added code */}
          </div>
        </div>

        <div style={{ width: "93%", border: "1.5px solid black", margin: "0px 10px 0px 10px" }}></div>

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
  )
}
// End of added code 07-04-2023
