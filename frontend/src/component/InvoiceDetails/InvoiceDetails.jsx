// Added by :- Parineeta Gedam
// Date :- 07-04-2023   
// Reason :- show the invoice

import { React, useContext, useEffect, useState } from 'react';
import { Rate, Button } from 'antd';
import { useNavigate } from "react-router-dom";
import './InvoiceDetails.css';
import { GlobalContext } from "../../context/Context";
import secureLocalStorage from "react-secure-storage";

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
  // Reason :- get all order items

  var orders = secureLocalStorage.getItem('order');
  var customerDetails = secureLocalStorage.getItem('customerDetails');
  var tenantName = localStorage.getItem("tenantName");

  const [value, setValue] = useState(3);
  const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

  console.log("o xc ", customerDetails)
  // 
  const navigate = useNavigate();
  const updateOrderItemsData = () => {
    navigate("/payment");
  }
  // 

  return (
    <>
      <div className='invoice_heading_container'>
        <h1 className='invoice_heading' style={{ backgroundColor: colors.headingBackgroundColor }}>Invoice</h1>
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
          <span className='invoice_details_value'>{customerDetails.contact_number}</span>
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
        {orderItems.map((items, i,) => (
          <>
            <div className='invoice_cart_container' id={"order" + i} key={"order" + items.id}>
              <div className='invoice_data_container'>
                <div className='invoice_item_container'>
                  <span className='invoice__second_sub_heading'>{items.item}</span>
                </div>
                <div className='invoice_price_container'>
                  <span className="invoice_second_sub_heading">{items.quantity}</span>
                </div>
                <div className='invoice_total_price_container'>
                  <span className="invoice_total_rating_sub_heading">{items.quantity * items.price}</span>
                </div>
              </div>
              <div className='invoice_rating_container' id={items.id}>
                <span>
                  <Rate allowHalf tooltips={desc} onChange={setValue} value={value} id={items.id} />
                </span>
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
          style={{
            backgroundColor: colors.bannerColor,
            color: colors.backgroundTheme,
            border: "none",
            fontWeight: "600",
          }}
          onClick={(e) => updateOrderItemsData()}
        >
          Proceed to pay
        </Button>
      </div>
    </>
  )
}
// End of added code 07-04-2023
