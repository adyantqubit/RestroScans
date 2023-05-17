// Added by :- Parineeta Gedam
// Date :- 07-04-2023   
// Reason :- show the invoice

import { React, useContext, useEffect, useState } from 'react';
import { Rate, Button, message } from 'antd';
import { useNavigate } from "react-router-dom";
import './InvoiceDetails.css';
import { GlobalContext } from "../../context/Context";
import secureLocalStorage from "react-secure-storage";
import { updateRatingAndReviewApi } from '../../api/Services';


export default function InvoiceDetails() {

  // get colors from context 
  var { colors, setCart,rupee_sign } = useContext(GlobalContext);

  // Added by Parineeta Date : 14-04-2022
  // Reason : Add serial no in invoice
  var i = 1;
  // end of code

  // Added by :-  Parineeta Gedam
  // Date :- 9-04-2023
  // Reason :- get order items from local stroage and map the data.

  // modified by :- Parineeta gedam on 15-04-2023
  const [orderItems, setOrderItem] = useState([])
  useEffect(() => {

    // window.onpopstate = () => { if(allow_pop){localStorage.removeItem('cart'); setCart([]);}}
    setOrderItem(secureLocalStorage.getItem('orderItem'))
  }, [])
  // End of added code 09-04-2023


  // Added by :- Parineeta Gedam
  // Date :- 09-04-2023
  // Reason :- get data from local stroage

  var orders = secureLocalStorage.getItem('order');
  var orderItem = secureLocalStorage.getItem('orderItem');
  var invoiceDetail = secureLocalStorage.getItem('invoice_detail');
  var customerDetail = secureLocalStorage.getItem('customer_details');
  var tenantName = localStorage.getItem("tenantName");

  // Commented by :- Parineeta Gedam
  // Date :- 14-04-2023
  // Reason :- From Invoice page remove the rating and review  

  // Added by :- Parineeta Gedam
  // reason :- get rating value

  // const getRatingValue = (id, e) => {
  //   document.getElementById("order" + id + "rating").value = e
  // }

  // Added by :- Parineeta Gedam
  // Date :- 11-04-2023
  // reason :- update the rating and review 
  // const navigate = useNavigate();

  // const updateInvoiceData = async () => {

  //   var invoiceData = [];
  //   for (var i = 0; i < orderItem.length; i++) {

  //     var data = {
  //       id: orderItem[i].id,
  //       rating: document.getElementById("order" + orderItem[i].id + "rating").value  ,
  //       review: document.getElementById("order" + orderItem[i].id + "review").value,
  //     };
  //     invoiceData.push(data);
  //   }
  //   const response = await updateRatingAndReviewApi(tenantName, invoiceData);
  //   if (response.msg) {
  //     // commented by :- Parineeta Gedam
  //     // Reason :- don't show msg
  //     // message.success({
  //     //   content: "success",
  //     //   key: 1,
  //     //   // icon: <CheckCircleOutlined />,
  //     //   style: {
  //     //     marginTop: '5vh',
  //     //     fontSize: "16px",
  //     //     letterSpacing: "1.3px",
  //     //     fontFamily: "Times News Roman",
  //     //     color: colors.headingColor,
  //     //   },
  //     // });
  //     // End of commented code
  //     navigate("/payment");
  //   }
  //   else {
  //     message.error({
  //       content: "error",
  //       key: 1,
  //       // icon: <CheckCircleOutlined />,
  //       style: {
  //         marginTop: '5vh',
  //         fontSize: "16px",
  //         letterSpacing: "1.3px",
  //         fontFamily: "Times News Roman",
  //         color: colors.headingColor,
  //       },
  //     });
  //   }
  // }
  // // End of added code 11-04-2023

  // Added by :- Parineeta Gedam
  // Date :- 14-04-2023
  // Reason :- Navigate to the payment page.  

  const navigate = useNavigate();

  const updateInvoiceData = async () => {
    navigate("/payment");
  }

  // End of added code 14-04-2023

  return (
    <>
    <div className='order_details_container' style={{ background: colors.backgroundTheme }}>
      <div className='invoice_heading_container' style={{ color: colors.headingColor }}>Order Details
        {/* <h1 className='invoice_heading' style={{ backgroundColor: colors.headingBackgroundColor }}>Invoice</h1> */}
      </div>

      <div className='invoice_parent_container'>
        <div className='invoice_Details_container'>
          {/* Commented by :- Parineeta Gedam
              Date :- 14-04-2023
              Reason :- don't show hotel name
          */}
          {/* <div className='invoice_details_1'>
            <span className='invoice_details_heading'>Hotel Name </span>
            <span className='invoice_details_colon'>: </span>
            <span className='invoice_details_value'>{tenantName}</span>
          </div> */}
          {/* End of commented code 14-04-2023*/}

          {/* Modified by :- Parineeta Gedam
              Date :- 14-04-2023
              Reason :- re-arrange the details.
          */}

          <div className='invoice_details_1'>
            <span className='invoice_details_heading'>Order Id </span>
            <span className='invoice_details_colon'>: </span>
            <span className='invoice_details_value'>{orders.order_id}</span>
          </div>
          <div className='invoice_details_1'>
            <span className='invoice_details_heading'>Table Number </span>
            <span className='invoice_details_colon'>: </span>
            <span className='invoice_details_value'>{orders.table_number}</span>
          </div>
          <div className='invoice_details_1'>
            <span className='invoice_details_heading'>Name </span>
            <span className='invoice_details_colon'>: </span>
            {/* commented by :- Parineeta Gedam on 17-04-2023 */}
            {/* <span className='invoice_details_value'>{customerDetail.last_customer_name}</span> */}
            {/* End of commented code on 17-04-2023  */}

            {/* Added by :- Parineeta Gedam on 17-04-2023 */}
            {/* modiefied by rohan -18/4/23 - reason - changes in customer json object*/}
            {customerDetail.name ?
              <>
                <span className='invoice_details_value'>{customerDetail.name}</span>
              </> :
              <><span className='invoice_details_value'>-</span></>}
            {/* End of commented code on 17-04-2023  */}

          </div>
          <div className='invoice_details_1'>
            <span className='invoice_details_heading'>Contact Number </span>
            <span className='invoice_details_colon'>: </span>
            <span className='invoice_details_value'>{customerDetail.contact_number}</span>
          </div>
          <div className='invoice_details_1'>
            <span className='invoice_details_heading'>Date </span>
            <span className='invoice_details_colon'>: </span>
            {/* modified by :- Parineeta, to show date. */}
            <span className='invoice_details_value'>{new Date(orders.date).toLocaleDateString()}</span>
          </div>
          <div className='invoice_details_1'>
            <span className='invoice_details_heading'>Time </span>
            <span className='invoice_details_colon'>: </span>
            <span className='invoice_details_value'>{new Date(orders.date).toLocaleTimeString()}</span>
          </div>
        </div>

        {/* End of added code 14-04-2023 */}

        {/* Modified by :- Parineeta Gedam
          Date :- 21-04-2023
          reason :- showing extra white spacing
      */}
        {/* <hr class="invoice_horizontal_line"></hr> */}
        <div class="invoice_horizontal_line"></div>
        {/* End of modified code on 21-4-2023 */}

        <div className='invoice_table_heading_container'>
          <div className='invoice_data_container'>
            <div className='invoice_serial_no_container'>
              <span className='invoice_serial_no_sub_heading'>S.no</span>
            </div>
            <div className='invoice_item_container'>
              <span className='invoice_table_sub_heading'>Item</span>
            </div>
            <div className='invoice_qty_container'>
              <span className="invoice_table_sub_heading">Qty</span>
            </div>
            <div className='invoice_total_price_container'>
              {/* <span className="invoice_table_price_sub_heading">Cost</span> */}
              <span className="invoice_table_price_sub_heading">Price</span>
            </div>
          </div>
        </div>

        {/* Modified by :- Parineeta Gedam
          Date :- 21-04-2023
          reason :- showing extra white spacing
      */}
        {/* <hr class="invoice_horizontal_line"></hr> */}
        <div class="invoice_horizontal_line"></div>
        {/* End of modified code on 21-4-2023 */}

        <div className='invoice_child_container'>
          {orderItems.map((items, index) => (
            <>
              <div className='invoice_cart_container' id={"order" + items.id} key={index}
                // Added by :- Parineeta Gedam
                // Date :- 14-04-2023
                // reason :- added color
                style={{
                  background:
                    index % 2 === 0
                      ? "#EAE5E3"
                      : "white"
                }}
              // End of added code 14-04-2023
              >
                <div className='invoice_data_container'>
                  <div className='invoice_serial_no_container'>
                    <span className='invoice_serial_no_second_sub_heading'>{i++}</span>
                  </div>
                  <div className='invoice_item_container'>
                    <span className='invoice__second_sub_heading'>{items.item}&nbsp;({items.serving_size})</span>
                  </div>
                  <div className='invoice_qty_container'>
                    <span className="invoice_qunatity_sub_heading">{items.quantity}</span>
                  </div>
                  <div className='invoice_total_price_container'>
                    {/* Modified by :- Parineeta Gedam on 21-04-2023 */}
                    {/* <span className="invoice_total_rating_sub_heading"> ₹ {items.quantity * items.price}</span> */}
                     {/* // Modified and commented by Om Shrivastava on 08-05-23
                    // Reason : Create the rupee sign globally for using the config file. */}
                    {/* <span className="invoice_total_rating_sub_heading"> ₹ {items.price}</span> */}
                    <span className="invoice_total_rating_sub_heading"> {rupee_sign} {items.price}</span>
                    {/* End of addition by Om Shrivastava on 08-05-23 */}
                    {/* End of modified code on 21-04-2023 */}
                  </div>
                </div>

                {/* Commented by :- Parineeta Gedam
                  Date :- 14-04-2023
                  Reason :- In invoice not show the rating and review.
              */}
                {/* <div className='invoice_rating_container' id={"order" + items.id + "rating"} name="rating">
                <span>
                  <Rate name="rating" onChange={e => getRatingValue(items.id, e)} />
                  <input name="rating" id={"order" + items.id + "rating"} style={{ display: "none" }} />
                </span>
              </div>
              <div className='invoice_review_container' name="review"  >
                <label className='invoice_review_label'>Review</label>
                <input className='invoice_review_input' name="review" id={"order" + items.id + "review"} />
              </div> */}
                {/* End of commented code 14-04-2023 */}

              </div>
              {/* Commented by :- Parineeta Gedam
                  Date :- 14-04-2023              
              */}
              {/* <hr class="invoice_horizontal_line"></hr> */}
              {/* End of commented code 14-04-2023 */}
            </>
          ))}

          {/* Modified by :- Parineeta Gedam
          Date :- 21-04-2023
          reason :- showing extra white spacing
      */}
          {/* <hr class="invoice_horizontal_line"></hr> */}
          <div class="invoice_horizontal_line"></div>
          {/* End of modified code on 21-4-2023 */}

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
          <div className='invoice_second_container'>
          {orders?.cgst>0||orders?.sgst>0?<div className='invoice_second_data_container'>
              <div className="invoice_sub_heading">Subtotal : </div>
               {/* // Modified and commented by Om Shrivastava on 08-05-23
              // Reason : Create the rupee sign globally for using the config file. */}
              {/* <div className="invoice_second_sub_heading">₹ {orders.sub_total}</div> */}
              <div className="invoice_second_sub_heading"> {rupee_sign} {orders.sub_total.toFixed(2)}</div>
              {/* End of addition by Om Shrivastava on 08-05-23 */}
            </div>:null}

            {/* Modified by - ROhan KAnsari - 13/5/23 to dont show cgst if it is zero*/}
            {orders?.cgst>0?<div className='invoice_second_data_container'>
              <div className="invoice_sub_heading">CGST : </div>
              {/* Added by rohan- 14/4/23 -------------------------------- */}
              {/* Modified by rohan- 16-04-2023 -------------------------------- */}
               {/* // Modified and commented by Om Shrivastava on 08-05-23
              // Reason : Create the rupee sign globally for using the config file. */}
              {/* <div className="invoice_second_sub_heading"> ₹ {orders.cgst}</div> */}
              <div className="invoice_second_sub_heading"> {rupee_sign} {orders.cgst.toFixed(2)}</div>
              {/* End of addition by Om Shrivastava on 08-05-23 */}
            </div>:null}

            {/* Modified by rohan- 16-04-2023 -------------------------------- */}
            {/* Modified by - ROhan KAnsari - 13/5/23 to dont show cgst if it is zero*/}
           {orders?.sgst>0?<div className='invoice_second_data_container'>
              <div className="invoice_sub_heading">SGST : </div>
              {/* // Modified and commented by Om Shrivastava on 08-05-23
              // Reason : Create the rupee sign globally for using the config file. */}
              {/* <div className="invoice_second_sub_heading"> ₹ {orders.sgst}</div> */}
              <div className="invoice_second_sub_heading"> {rupee_sign}  {orders.sgst.toFixed(2)}</div>
              {/* End of addition by Om Shrivastava on 08-05-23 */}
            </div>:null}
            {/* End of added code on 16-04-2023 */}

            <div className='invoice_second_data_container'>
              <div className="invoice_sub_heading"><b>Total : </b></div>
              {/* Modified by :- Parineeta Gedam on 19-04-2023 */}
              {/* <span className="invoice_second_sub_heading"><b> ₹ {orders.total}</b></span> */}
              {/* // Modified and commented by Om Shrivastava on 08-05-23
              // Reason : Create the rupee sign globally for using the config file. */}
              {/* <div className="invoice_second_sub_heading"><b> ₹ {orders.total}</b></div> */}
              <div className="invoice_second_sub_heading"><b>  {rupee_sign}  {orders.total.toFixed(2)}</b></div>
              {/* End of addition by Om Shrivastava on 08-05-23 */}

              {/* End of modified code on 19-04-2023 */}
            </div>
          </div>
          {/* End of added code */}
        </div>
      </div>

      {/* Modified by :- Parineeta Gedam
          Date :- 21-04-2023
          reason :- showing extra white spacing
      */}
      {/* <hr style={{ backgroundColor: "black", height: "1px", width: "94%", borderTop: "1px solid black", marginBottom:"0px" }}></hr> */}
      <div style={{width:"93%", border:"1.5px solid black", margin:"0px 10px 0px 10px"}}></div>
      {/* End of modified code on 21-4-2023 */}

      {/* commented by :- Parineeta Gedam
          Date :- 16-04-2023
          Reason :- now this functionality not showing 
      */}
      <div className='invoice_btn_container'>
        <Button
          id="signBtn"
          type="primary"
          htmlType="submit"
          block
          className='invoice_btn_heading'
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
      </div>
      {/* End of added code 16-04-2023 */}
      </div>
    </>
  )
}
// End of added code 07-04-2023
