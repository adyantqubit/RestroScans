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
  var { colors } = useContext(GlobalContext);

  // Added by :-  Parineeta Gedam
  // Date :- 9-04-2023
  // Reason :- get order items from local stroage and map the data.
  const [orderItems, setOrderItem] = useState([])
  useEffect(() => {
    window.onpopstate = () => { }
    setOrderItem(secureLocalStorage.getItem('orderItem'))
  }, [])
  // End of added code 09-04-2023


  // Added by :- Parineeta Gedam
  // Date :- 09-04-2023
  // Reason :- get data from local stroage

  var orders = secureLocalStorage.getItem('order');
  var orderItem = secureLocalStorage.getItem('orderItem');
  var invoiceDetail = secureLocalStorage.getItem('invoice_detail');
  var tenantName = localStorage.getItem("tenantName");

  // Added by :- Parineeta Gedam
  // reason :- get rating value

  const getRatingValue = (id, e) => {
    document.getElementById("order" + id + "rating").value = e
  }

  // Added by :- Parineeta Gedam
  // Date :- 11-04-2023
  // reason :- update the rating and review 
  const navigate = useNavigate();

  const updateInvoiceData = async () => {

    var invoiceData = [];
    for (var i = 0; i < orderItem.length; i++) {

      var data = {
        id: orderItem[i].id,
        rating: document.getElementById("order" + orderItem[i].id + "rating").value  ,
        review: document.getElementById("order" + orderItem[i].id + "review").value,
      };
      invoiceData.push(data);
    }
    const response = await updateRatingAndReviewApi(tenantName, invoiceData);
    if (response.msg) {
      // commented by :- Parineeta Gedam
      // Reason :- don't show msg
      // message.success({
      //   content: "success",
      //   key: 1,
      //   // icon: <CheckCircleOutlined />,
      //   style: {
      //     marginTop: '5vh',
      //     fontSize: "16px",
      //     letterSpacing: "1.3px",
      //     fontFamily: "Times News Roman",
      //     color: colors.headingColor,
      //   },
      // });
      // End of commented code
      navigate("/payment");
    }
    else {
      message.error({
        content: "error",
        key: 1,
        // icon: <CheckCircleOutlined />,
        style: {
          marginTop: '5vh',
          fontSize: "16px",
          letterSpacing: "1.3px",
          fontFamily: "Times News Roman",
          color: colors.headingColor,
        },
      });
    }
  }
  // End of added code 11-04-2023

  return (
    <>
      <div className='invoice_heading_container'style={{ backgroundColor: colors.headingBackgroundColor, color: colors.headingColor }}>Order Details
        {/* <h1 className='invoice_heading' style={{ backgroundColor: colors.headingBackgroundColor }}>Invoice</h1> */}
      </div>

      <div className='invoice_Details_container'>
        <div className='invoice_details_1'>
          <span className='invoice_details_heading'>Hotel Name </span>
          <span className='invoice_details_colon'>: </span>
          <span className='invoice_details_value'>{tenantName}</span>
        </div>
        <div className='invoice_details_1'>
          <span className='invoice_details_heading'>Contact Number </span>
          <span className='invoice_details_colon'>: </span>
          <span className='invoice_details_value'>{invoiceDetail.contact_number}</span>
        </div>
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
      </div>

      <div className='invoice_table_heading_container'>
        <div className='invoice_data_container'>
          <div className='invoice_item_container'>
            <span className='invoice_table_sub_heading'>Item</span>
          </div>
          <div className='invoice_price_container'>
            <span className="invoice_table_sub_heading">Qty</span>
          </div>
          <div className='invoice_total_price_container'>
            <span className="invoice_table_price_sub_heading">Cost</span>
          </div>
        </div>
      </div>

      <hr class="invoice_horizontal_line"></hr>

      <div className='invoice_parent_container'>
        {orderItems.map((items, index) => (
          <>
            <div className='invoice_cart_container' id={"order" + items.id} key={index}>
              <div className='invoice_data_container'>
                <div className='invoice_item_container'>
                  <span className='invoice__second_sub_heading'>{items.item}&nbsp;({items.serving_size})</span>
                </div>
                <div className='invoice_price_container'>
                  <span className="invoice_second_sub_heading">{items.quantity}</span>
                </div>
                <div className='invoice_total_price_container'>
                  <span className="invoice_total_rating_sub_heading">{items.quantity * items.price}</span>
                </div>
              </div>
              <div className='invoice_rating_container' id={"order" + items.id + "rating"} name="rating">
                <span>
                  <Rate name="rating" onChange={e => getRatingValue(items.id, e)} />
                  <input name="rating" id={"order" + items.id + "rating"} style={{ display: "none" }} />
                </span>
              </div>
              <div className='invoice_review_container' name="review"  >
                <label className='invoice_review_label'>Review</label>
                <input className='invoice_review_input' name="review" id={"order" + items.id + "review"} />
              </div>
            </div>
            <hr class="invoice_horizontal_line"></hr>
          </>
        ))}
        <div className='invoice_second_container'>
          <div className='invoice_second_data_container'>
            <span className="invoice_sub_heading">Subtotal</span>
            <span className="invoice_second_sub_heading">{orders.sub_total}</span>
          </div>
          <div className='invoice_second_data_container'>
            <span className="invoice_sub_heading">Tax </span>
            <span className="invoice_second_sub_heading">{orders.tax}</span>
          </div>
          <div className='invoice_second_data_container'>
            <span className="invoice_sub_heading">Total</span>
            <span className="invoice_second_sub_heading">{orders.total}</span>
          </div>
        </div>
      </div>

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
          }}
          onClick={(e) => updateInvoiceData()}
        >
          Proceed to pay
        </Button>
      </div>
    </>
  )
}
// End of added code 07-04-2023
