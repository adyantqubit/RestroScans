import { View, Text, StyleSheet, Button, Pressable, Alert, Modal } from "react-native";
import React from "react";
import {
  getOrderItemsApi,
  updateOrderAndPaymentStatus, deleteOrderItemApi, postUpdateOrderItemsApi,
} from "../../api/Services";
import { useState } from "react";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useContext } from "react";
import { AppStateContext } from "../../context/AppStateProvider";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { SelectList } from "react-native-dropdown-select-list";
import { colors } from "../../Colours/globalColor";
import * as Print from "expo-print";
import { useIsFocused } from "@react-navigation/native";
import Footer from "../../components/Footer/Footer";
import { FontAwesome } from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import { AntDesign } from "@expo/vector-icons";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { Feather } from '@expo/vector-icons';
import AddOrderItemForm from "../../components/orderItem/AddOrderItemForm";
import { MaterialIcons } from '@expo/vector-icons';

export default function OrderItemsScreen({ route, navigation }) {
  var { render, setRender, settings, rupee_sign } = useContext(AppStateContext); //Need to use settings, for GST number.
  const isFocused = useIsFocused();
  /* Get the order id using params */
  // Added and modified by Yuvraj Sahu on 17-4-2023
  // Reason - to get order id in from router
  const { id, orderID } = route.params;
  // End of modification

  // Added by Parineeta Date : 24-05-2023
  // Reason : Add serial no in invoice
  var i = 1;
  // end of code by Parineeta Date : 24-05-2023

  // Added by Yuvraj Sahu on 9-4-2023
  // Reason - to call function when page is render
  // This function is used for calling function when first time page render
  useEffect(() => {
    getOrderItems();
  }, [isFocused]);
  // End of addition

  useEffect(() => {
    getOrderItems();
  }, [modalVisible]);

  // Added by Yuvraj Sahu on 9-4-2023
  // Reason - to set all order
  // This react hooks is used to set order items
  // Which is used for map and showing data to user
  var [orderItems, setOrderItems] = useState([]);
  // End of setting orders

  // Added by Yuvraj Sahu on 9-4-2023
  // Reason - to set customer detail
  // This react hooks is used to set customer detail
  // Which is used for map and showing data to user
  var [customerDetail, setCustomerDetail] = useState([]);
  // End of set customer detail

  // Added by Yuvraj Sahu on 14-4-2023
  // Reason - to order detail
  // This react hooks is used to set order detail
  // Which is used for map and showing data for tax calculation
  var [orderDetail, setOrderDetail] = useState([]);
  // End of setting orders

  // Added by Yuvraj Sahu on 14-4-2023
  // Reason - to set order status selection
  {
    /* This is used for set order status selcted data */
  }
  const [orderStatusSelected, setOrderStatus] = React.useState("");
  // End of order status set

  // Added by Yuvraj Sahu on 14-4-2023
  // Reason - to set payment status selection
  {
    /* This is used for set order status selcted data */
  }
  const [paymentStatusSelected, setPaymentStatus] = React.useState("");
  // End of payment status set

  // Added by :- Parineeta Gedam on 25-05-2023
  // Reason - to get and map setting data
  const [settingData, setSettingData] = useState("");
  // End of payment status set

  // Added by :- Parineeta Gedam on 18-06-2023
  // Reason - set origin response
  const [originalResponseOrderItem, setOriginalResponseOrderItem] = useState([]);
  const [originalResponseOrder, setOriginalResponseOrder] = useState({});
  // End of code by :- Parineeta Gedam on 18-06-2023 Reason - set origin response

  // Added by Yuvraj Sahu on 14-4-2023
  // Reason - to store order status data
  {
    /* This is array holds order status data */
  }
  // Modified by Yuvraj Sahu on 18-4-2023
  // Reason - to change status name
  var d = orderDetail.order_status;
  var orderStatusData = [
    { key: "Placed", value: "Placed" },
    { key: "Confirm", value: "Confirm" },
    { key: "Cooked", value: "Cooked" },
    { key: "Served", value: "Served" },

    // Added by :- Parineeta Gedam on 13-05-2023 
    { key: "Cancelled", value: "Cancelled" },
    // End of added code by :- Parineeta gedam on 13-05-2023
  ];
  // End of modification
  // End of addition

  // Added by Yuvraj Sahu on 14-4-2023
  // Reason - to store payment status data
  {
    /* This is array holds payment status data */
  }
  var paymentStatusData = [
    { key: "Pending", value: "Pending" },
    { key: "Completed", value: "Completed" },
    // Commented by :- PArineeta Gedam on 12-06-2023 reason :- not show the paid option for admin 
    // Added by :- Parineeta Gedam on 30-05-2023 
    // { key: "Paid", value: "Paid" },
    // End of commented code by :- PArineeta Gedam on 12-06-2023 reason :- not show the paid option for admin 
  ];
  // End of addition

  // Added by Parineeta Gedam on 03-06-2023
  // Reason - to set item status 
  var ItemStatusData = [
    { key: "Pending", value: "Pending" },
    { key: "Confirm", value: "Confirm" },
    { key: "Cancelled", value: "Cancelled" },
  ];
  // End of addition code by Parineeta Gedam on 03-06-2023

  // Added by Yuvraj Sahu on 9-4-2023
  // Reason - to get orders
  // This function is created for getting all orders
  const getOrderItems = async () => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    // Modified by Yuvraj Sahu on 18-4-2023
    // Reason - to change order ir to id
    var response = await getOrderItemsApi(tenant, id);
    // End of modification
    if (response.msg) {
      setOrderItems(response.orderItems);
      setCustomerDetail(response.customerDetail);
      // Added by Yuvraj Sahu on 14-4-2023
      // Reason - to set order detail in state
      setOrderDetail(response.orderDetail);
      /**
       * Added by Yuvraj Sahu on 04-05-2023
       * Reason - to set default value in dropdown
       */
      setOrderStatus(response.orderDetail.order_status);
      setPaymentStatus(response.orderDetail.payment_status);
      /**
       * Added by Yuvraj Sahu on 14-06-2023
       * Reason - to
       */
      setDiscountReason(response.orderDetail.discount_reason);
      /**
       * End of addition by yuvraj Sahu on 04-05-2023
       */

      // Added by :- Parineeta Gedam on 08-05-2023
      // Reason - to set discount amount (manual discount)
      // setDiscountAmount("" + response.orderDetail.manual_discount)
      // setDiscountType(response.orderDetail.discount_type)
      // End of added code by :- Parineeta Gedam on 08-05-2023

      // Added by :- Parineeta Gedam on 03-06-2023
      // Reason - to set discount amount (manual discount)
      setDiscountRupees("" + response.orderDetail.discount_rupees)
      setDiscountPercentage("" + response.orderDetail.discount_percentage)
      // End of added code by :- Parineeta Gedam on 08-05-2023

      // Added by :- Om Shrivastava on 05-06-23
      // Reason - to set loyality point value
      setLoyalityAmount("" + response.orderDetail.apply_loyality_point)
      // setDiscountType(response.orderDetail.discount_type)
      // End of added code by :- Parineeta Gedam on 08-05-2023

      // Added by :- Parineeta Gedam on 25-05-2023
      // Reason - get cgst sgst
      setSettingData(response.settingData)
      // End of added code by :- Parineeta Gedam on 25-05-2023

      // Added and modified code by :- Parineeta Gedam on 18-06-2023 
      // Reason - set origin response
      // setAllResponseOrderItem(response.orderItems)
      // setAllResponseOrder(response.orderDetail)
      setOriginalResponseOrderItem(response.orderItems)
      setOriginalResponseOrder(response.orderDetail)
      // End of added code by :- Parineeta Gedam on on 18-06-2023 Reason - set origin response

      /**
      * Added by Parineeta Gedam on 13-05-2023
      * Reason - to set order cancel reason
      */
      setOrderCancelReason(response.orderDetail.cancel_reason);
      /**
       * End of addition by Parineeta Gedam on 13-05-2023
       */

    }
  };

  // Added by :- Parineeta Gedam on 24-05-2023 
  // reason :- for model open 

  const [modalVisible, setModalVisible] = useState(false);

  // End of added code by :- PArineeta Gedam on 24-05-2023

  /**
   * Added by - Ashish Dewangan on 19-04-2023
   * Reason - To print order items for kitchen whenever order status is changed by admin to confirm
   */
  var str = "";
  var html = "";

  const printDoc = async () => {
    await Print.printAsync({
      html,
    });
  };
  /**
   * End of code addition by Ashish Dewangan on 19-04-2023
   */

  // Added by Om on 23-04-23
  // Reason : Show the subtotal and current order date

  // Modified by :- Parineeta Gedam on 29-05-2023
  function SubtotalOfItems() {
    var total = 0;
    orderItems.filter((o) => {
      if (o.item_status != "Cancelled") {
        total += o.price;
      }
    });
    return total;
  }
  // End of Modified code by :- Parineeta Gedam on 29-05-2023

  /**
   * Commeted and modified by Yuvraj Sahu on 09-06-2023
   * Reason - to change date time formate
   */
  /**
   * Commeted and added by Yuvraj Sahu on 09-06-2023
   * Reason - to change the date time format bill, customer detail
   */
  /**
   * modified by Yuvraj Sahu on 18-06-2023
   * Reason - to not display time in bill page
   */
  // -------------------------------------- payment completed ------------------
  /**
   * Modified by Yuvraj Sahu on 18-06-2023
   * Reason - to show date on bill
   */
  function BillDateTime(format) {
    var date = format.substring(0, 10)
    var time = format.substring(11, 19)
    return { date, time }
  }
  /**
   * End of modification by Yuvraj Sahu on 18-06-2023
   */
  /**
   * End of addition by Yuvraj Sahu on 18-06-2023
   */

  function ExtractDateTime(format) {
    var d = new Date(format);
    var time = d.toLocaleTimeString();
    var date = `${orderDetail.date}`.split("T")[0].split("-").reverse().join("/")
    return { time, date };
  }
  /**
   * End of change date time formate by Yuvraj Sahu on 09-06-2023
   */
  /**
   * End of modification date time formate by Yuvraj Sahu on 09-06-2023
   */
  // End of addition

  // Added by Yuvraj Sahu on 17-4-2023
  // Reason - to update order and payment status
  {
    /**
     * This method is created for API calling to update the order and payment status
     */
  }
  // Added by Om on 23-04-23
  // Reason : To perform the print functionality of native site
  const printBill = async () => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;

    var restaurantName = JSON.parse(
      await SecureStore.getItemAsync("userData")
    ).restaurant_name;
    var restaurantAddress = JSON.parse(
      await SecureStore.getItemAsync("userData")
    ).address;

    // var status = {
    //   order_status: orderStatusSelected,
    //   payment_status: paymentStatusSelected,
    // };
    var itemStr = "";
    for (var i = 0; i < orderItems.length; i++) {
      if (orderItems[i].item_status != "Cancelled") {
        itemStr =
          itemStr +
          `<div class="tableContents ">
                  <div class="titleText">${orderItems[i].item} (${orderItems[i].serving_size
          })</div>
                  <div class="quantityText">${orderItems[i].quantity}</div>
                  <div class="rateText">${(
            orderItems[i].price / orderItems[i].quantity
          ).toFixed(2)}</div>
                  <div class="totalText"> ${orderItems[i].price.toFixed(
            2
          )}</div>

                </div>`;
      }
    }


    var discountCalculations = '';
    // Commented by :- Parineeta Gedam on 07-06-2023 reason :- change the flow of discount
    // Added by :- Parineeta Gedam on 11-05-2023
    // Reason :- calculations by discount type

    // if (orderDetail.manual_discount > 0) {
    //   if (orderDetail.discount_type == "Discount in (₹)") {
    //     discountCalculations = `<div class="calculationLine">
    //     <div  class="calculationLabel">
    //     <div style= "width:98%">Discount</div>
    //     <div>:</div></div>
    //     <div  class="calculationText" >${rupee_sign}${orderDetail.manual_discount.toFixed(2)}</div>
    //   </div>`
    //   }
    //   else {
    //     discountCalculations = `<div class="calculationLine">
    //     <div  class="calculationLabel">
    //     <div style= "width:98%">Discount</div>
    //     <div>(${orderDetail.manual_discount.toFixed(2)}%):</div></div>
    //     <div  class="calculationText" >${rupee_sign}${((orderDetail.sub_total / 100) * orderDetail.manual_discount).toFixed(2)}</div>
    //   </div>`
    //   }
    //   discountCalculations = discountCalculations + `<div class="calculationLine">
    //     <div  class="calculationLabel"> 
    //     <div style= "width:98%">Total</div>
    //     <div>:</div></div>
    //     <div  class="calculationText" >${rupee_sign}${orderDetail.total.toFixed(2)}</div>
    //   </div>
    //   <div class="calculationLine">
    //     <div  class="calculationLabel" > 
    //     <div style= "width:98%">CGST</div>
    //     <div> (%${((orderDetail.cgst / orderDetail.total * 100)).toFixed(2)}):</div></div>
    //     <div  class="calculationText" >${rupee_sign}${orderDetail.cgst}  </div>
    //   </div>
    //   <div class="calculationLine">
    //     <div  class="calculationLabel" > 
    //     <div style= "width:98%">SGST</div>
    //     <div> (%${((orderDetail.sgst / orderDetail.total * 100)).toFixed(2)}):</div></div>
    //     <div  class="calculationText" >${rupee_sign}${orderDetail.sgst} </div>
    //   </div>`
    // End of commented code by :- Parineeta Gedam on 07-06-2023

    // Added by :- Parineeta Gedam on 07-06-2023 
    // reason :- change the flow of discount
     if (orderDetail.discount_rupees > 0) {
        discountCalculations = `<div class="calculationLine">
        <div  class="calculationLabel">
        <div style= "width:98%">Discount</div>
        <div>:</div></div>
        <div  class="calculationText" >${rupee_sign}${orderDetail.discount_rupees.toFixed(2)}</div>
      </div>
      ${orderDetail.loyality_point_price > 0 && orderDetail.loyality_point_price != null ?

        `<div class="calculationLine">
    <div  class="calculationLabel" > 
    <div style= "width:98%">Loyality Price</div>
    <div>:</div></div>
    <div  class="calculationText" >${rupee_sign}${orderDetail.loyality_point_price} </div>
  </div>
  

  <hr>
  <div class="calculationLine">
  <div  class="calculationLabel" > 
  <div style= "width:98%">Total</div>
  <div>:</div></div>
  <div  class="calculationText" >${rupee_sign}${orderDetail.total.toFixed(2)}  </div>
  </div>`

        : ``}  `

      


      discountCalculations = discountCalculations + `<div class="calculationLine">
        <div  class="calculationLabel"> 
        <div style= "width:98%">Total</div>
        <div>:</div></div>
        <div  class="calculationText" >${rupee_sign}${orderDetail.total.toFixed(2)}</div>
      </div>
      <div class="calculationLine">
        <div  class="calculationLabel" > 
        <div style= "width:98%">CGST</div>
        <div> (%${((orderDetail.cgst / orderDetail.total * 100)).toFixed(2)}):</div></div>
        <div  class="calculationText" >${rupee_sign}${orderDetail.cgst}  </div>
      </div>
      <div class="calculationLine">
        <div  class="calculationLabel" > 
        <div style= "width:98%">SGST</div>
        <div> (%${((orderDetail.sgst / orderDetail.total * 100)).toFixed(2)}):</div></div>
        <div  class="calculationText" >${rupee_sign}${orderDetail.sgst} </div>
      </div>`
    // End of Added code by :- Parineeta Gedam on 07-06-2023

    }
    else {
      discountCalculations =
        // Added by Om Shrivastava on 06-06-23
        // Reason : Show the loyality point price in bill section
        `
     ${orderDetail.loyality_point_price > 0 && orderDetail.loyality_point_price != null ?

          `<div class="calculationLine">
      <div  class="calculationLabel" > 
      <div style= "width:98%">Loyality Price</div>
      <div>:</div></div>
      <div  class="calculationText" >${rupee_sign}${orderDetail.loyality_point_price} </div>
    </div>
    

    <hr>
    <div class="calculationLine">
    <div  class="calculationLabel" > 
    <div style= "width:98%">Total</div>
    <div>:</div></div>
    <div  class="calculationText" >${rupee_sign}${orderDetail.total.toFixed(2)}  </div>
    </div>`

          : ``}

      <div class="calculationLine">
      <div  class="calculationLabel" > 
      <div style= "width:98%">CGST</div>
      <div>(%${((orderDetail.cgst / SubtotalOfItems() * 100)).toFixed(2)}):</div></div>
      <div  class="calculationText" >${rupee_sign}${orderDetail.cgst.toFixed(2)}  </div>
      </div>
      <div class="calculationLine">
      <div  class="calculationLabel" > 
      <div style= "width:98%">SGST</div>
      <div>(%${((orderDetail.sgst / SubtotalOfItems() * 100)).toFixed(2)}):</div></div>
      <div  class="calculationText" >${rupee_sign}${orderDetail.sgst.toFixed(2)} </div>
    </div>`
    }
    // End of added code on 11-05-2023

    str = `<div class="billingContainer">
            <div class="inLineContainer" >
              <div class="Hotellabel"  style="text-align:center;"> ${restaurantName}</div>
            </div>
            <div class="inLineContainer"  style="text-align:center;">
              <div class="centerLabel">${restaurantAddress} </div>
            </div>
            <div class="inLineContainer">
              <div class="centerLabel">GSTIN :- ${settingData.gstin}</div>
            </div>
            <div class="inLineContainer">
              <div class="centerLabel">FSSAI NO :- ${settingData.fssaino
      }</div>
            </div>
            <hr>

            <div class="inLineContainer">
              <div class="label">Name   </div>
              <div class="text">  ${customerDetail.last_customer_name}</div>
              <div class="label">Contact   </div>
              <div class="text">  ${customerDetail.contact_number}</div>
            </div>
            
            <div class="inLineContainer">
              <div class="label">Date </div>
              <div class="text">
              <!-- Eddited By Rohan Kansari - 12/5/23
              Reason - To show payment confirmation time in bill --!>
              ${
                BillDateTime(orderDetail.payment_confirmation_date_time).date
              }
              </div>
              <div class="label">Time  </div>
              <div class="text">  ${BillDateTime(orderDetail.payment_confirmation_date_time).time
      }</div>
              <!-- ENd of code - 12/5/23 - Rohan Kansari --!>
            </div>
            <div class="inLineContainer">
              <div class="label">Bill   </div>
              <div class="text"> ${orderDetail.order_id}</div>
              <div class="label">Table </div>
              <div class="text">  ${!orderDetail.table_number ? "N/A" : orderDetail.table_number
      }</div>
              
            </div>
         
            <div class="inLineContainer">
              <div class="label">Payment   </div>
              <div class="text" style= "margin-right:53%">  ${orderDetail.payment_mode}</div>
              
            </div>
            <div class="tableHeader">
              <div class="titleHeading"> Item Name   </div>
              <div class="quantityHeading">Qty</div>
              <div class="rateHeading">     Rate(${rupee_sign}) </div>
              <div class="totalHeading"> Amt(${rupee_sign})</div>
            </div>
            
            ${itemStr} 
          <hr>
          <div class='CalculationBoxContainer'>
          <div class="calculationBox">
          ${orderDetail.cgst || orderDetail.sgst || orderDetail.loyality_point_price > 0 ? `<div class="calculationLine">
          
                <div  class="calculationLabel"> 
                <div style= "width:98%">Sub-Total</div>
                <div>:</div></div>
                <div  class="calculationText" >${rupee_sign}${SubtotalOfItems().toFixed(
        2
      )}</div>
              </div>`: ``}

              ${discountCalculations}
              
              ${orderDetail.cgst || orderDetail.sgst ? `<hr>` : ``}
              <div class="calculationLine">
                <div  class="calculationLabel"> 
                <div style= "width:98%">Total</div>
                <div>:</div></div>
                <div  class="calculationText" >${rupee_sign}${(orderDetail.final_amount.toFixed(2))}</div>
              </div>
            </div>
          </div> 
          <hr>
          <div class="TotalBoxContainer">
            <div class="TotalBox">
                <div class="calculationLine">
                  <div class="TotalLabel">Total </div>
                  <div class="TotalLabel">: </div>
                  <div class="grandTotalText">${rupee_sign}${(orderDetail.final_amount.toFixed(2))}
                  </div>
                </div>
            </div>
          </div>
          <hr>
          <div class="calculationLine">
            <div class="calculationLabel">
            ****** THANK YOU VISIT AGAIN ******
            </div>
          </div>

    </div>`;

    str = str + `</div>`;

    html = `
    <html>
    <head>
<style>
.billingContainer {
  font-family:monospace;
  letter-spacing: 0.6px;
  width: 300px;
  height: auto;
  margin: 0 auto;
  border-radius: 5px;
  padding: 2px 0;
  padding-bottom: 150px;
  border: 1px solid black;
}
.inLineContainer {
  min-width: 100%;
  min-height: 10px;
  margin: 4px 0;
  display: flex;
  justify-content: space-between;
}
.Hotellabel{
  min-width: 100%;
  font-size: 17px;
  font-weight: 900;
  padding: 0 3%;
  text-align: center;
}
.centerLabel{
  min-width: 100%;
  font-size: 10px;
  font-weight: 700;
  text-align: center;
}
.label {
  min-width: 15%;
  font-size: 10px;
  font-weight: 700;
  padding: 0 2%;
  text-align: start;
  white-space: nowrap;
}
.text {
  min-width: 22%;
  word-break: break-all;
  font-size: 10px;
  font-weight: 600;
  text-align: left;
}
.tableHeader {
  height: 30px;
  width: 95%;
  margin: auto;
  border-top: 1px solid black;
  margin-top: 20px;
  border-bottom: 1px solid black;
  display: flex;
  gap: 8px;
}
.titleHeading {
  font-size: 10px;
  width: 60%;
  padding: 2% 0% 2% 1%;
  
  font-weight: 600;
  text-align: start;
}
.quantityHeading {
  font-size: 10px;
  width: 20%;
  padding: 2% 0% 2% 12%;
  font-weight: 600;
}
.rateHeading {
  font-size: 10px;
  width: 15%;
  padding: 2% 4%;
  font-weight: 600;
}
.totalHeading {
  font-size: 10px;
  width: 15%;
  padding: 2% 4%;
  font-weight: 600;
}
.tableContents {
  min-height: 30px;
  width: 95%;
  margin:0 auto;
  margin: 1px 0 !important;
  display: flex;
  gap: 4px;
}
.titleText {
  font-size: 10px;
  width: 58% !important;
  padding: 0.5% 4%;
  font-weight: 600;
}
.quantityText {
  font-size: 10px;
  width: 5%;
  padding: 2% 2%;
  font-weight: 600;
}
.rateText {
  font-size: 10px;
  width: 30%;
  padding: 2% 2%;
  font-weight: 600;
  text-align: end;
  white-space: nowrap;
}
.totalText {
  font-size: 10px;
  width: 30%;
  padding: 2% 2%;
  font-weight: 600;
  text-align: end;
  white-space: nowrap;
}
.CalculationBoxContainer {
  width: 100%;
  min-height: 100px;
  display: flex;
  justify-content: flex-end;
}
.calculationBox {
  width: 75%;
  margin-right: 4%;
  margin-bottom: 2%;
}
.calculationLine {
  display: flex;
  justify-content: space-between;
}
.calculationLabel {
  font-size: 12px;
  width: 20%;
  padding: 2% 2%;
  font-weight: 600;
  width: 100%;
  white-space: nowrap;
  display: flex;
}
.calculationText {
  width: 50%;
  text-align: end;
  font-size: 10px;
  white-space: nowrap;
  padding: 2% 4%;
  font-weight: 600;
}
.TotalBoxContainer{
  width: 100%;
  height: auto;
  padding: 0 15%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.TotalBox{
  width: 70%;
  margin-right: 4%;
  margin-bottom: 2%;
  height: auto;  
}
.TotalLabel{
  font-size: 17px;
  width: 20%;
  padding: 2% 4%;
  // font-weight: 800;
  width: 100%;
  letter-spacing: 2px;
}
.grandTotalText{
  font-size: 17px;
  width: 80%;
  text-align: end;
  padding: 2% 4%;
  font-weight: 800;
  width: 100%;
  letter-spacing: 2px;
}

</style>
</head>
      <body>
          <div >
          ${str}
        </div>
      </body>
    </html>
    `;
    if (orderStatusSelected == "Served") {
      printDoc();
    }
  };
  // End of addition

  // Added by :- Parineeta Gedam on :- 08-05-2023
  // Modified by :- Parineeta Gedam on :- 07-06-2023
  // reason :- This react hooks is used to show the error msg if discount amount in (%) is greater then 100.
  var [discountRupeesErrorMsg, setDiscountRupeesErrorMsg] = useState(false);
  // var [discountAmountPercentageErrorMsg, setDiscountAmountPercentageErrorMsg] = useState(false);
  // End of added code on 08-05-2023
  // End of modified code by PArineeta Gedam on 07-06-2023

  // Modified by :- Parineeta Gedam on :- 03-06-2023
  // reason :- This react hooks is used to show the error msg if discount amount in rupees is greater then 100.
  // var [discountAmountErrorMsg, setDiscountAmountErrorMsg] = useState(false);
  var [discountPercentageErrorMsg, setDiscountPercentageErrorMsg] = useState(false);
  // End of added code on 08-05-2023
  // End of modified code by PArineeta Gedam on 03-06-2023

  // Added by :- Parineeta Gedam on :- 08-05-2023
  // Modified by :- Parineeta Gedam on :- 07-06-2023
  // reason :- This react hooks is used to set discount amount in rupees
  // var [discountAmount, setDiscountAmount] = useState(0);
  var [discountRupees, setDiscountRupees] = useState(0);
  // End of added code by :- Parineeta Gedam on :- 03-06-2023

  var [loyalityPoint, setLoyalityAmount] = useState(0);

  // Added by Om Shrivastava on 08-06-23
  // Reason : Through the error message when user apply the max loyality point as compare to customer loyality point
  var[loyalityErrorMsg,setLoyalityErrorMsg] = useState(false)
  // End of addition by Om Shrivastava on 08-06-23

  // Added by :- Parineeta Gedam on :- 07-06-2023
  // reason :- This react hooks is used to set discount amount in precentage
  var [discountPercentage, setDiscountPercentage] = useState(0);
  // End of added code on 08-05-2023

  // Added by :- Parineeta Gedam on :- 08-05-2023
  // reason :- This react hooks is used to set discount type
  var [discountType, setDiscountType] = useState("Discount in (₹)");
  // End of added code on 08-05-2023

  // Added by :- Parineeta Gedam on :- 18-06-2023
  // reason :- this hooks used for show the cancel reason error msg
  var [orderCancelReasonErrorMsg, setOrderCancelReasonErrorMsg] = useState(false);
  // End of added code by :- Parineeta Gedam on :- 18-06-2023

  // Commented by :- Parineeta Gedam on 07-06-2023
  // Added by :- Parineeta Gedam on 10-05-2023
  // Reason :- on discount amount box show the error message.
  // const discountHandleChange = (e) => {
  //     setDiscountAmount(e)
  //     if (discountType == "Discount in (%)") {
  //         if (e > 100) {
  //             setDiscountAmountErrorMsg(true)
  //         }
  //         else {
  //             setDiscountAmountErrorMsg(false)
  //         }
  //     }
  // }
  // End of added code on 10-05-2023
  // End of commented code by PArineeta Gedam on 07-06-2023

  // Added by Om Shrivastava on 07-06-23
  // Reason : When admin want to change the loyality point than its change
    const loyalityHandleChange = (e) => {
      setLoyalityAmount(e)
        if (e > customerDetail.loyality_points) {
          setLoyalityErrorMsg(true)
        }
        else {
          setLoyalityErrorMsg(false)
        }
      }
    // End of addition by Om Shrivastava on 07-06-23


  // Added by :- Parineeta Gedam on 03-06-2023
  // Reason :- on discount amount show in rupees
  const handleChangeDiscountRupees = (e) => {
    setDiscountRupees(e)
    var discountPercentages = (e / orderDetail.sub_total) * 100
    setDiscountPercentage("" + discountPercentages.toFixed(2))
    if (e > orderDetail.sub_total) {
      setDiscountRupeesErrorMsg(true)
    }
    else {
      setDiscountRupeesErrorMsg(false)
    }
  }
  // End of added code by Parineeta Gedam on 07-06-2023

  // Added by :- Parineeta Gedam on 07-06-2023
  // Reason :- on discount amount show in percentage
  const handleChangeDiscountAmountPercentage = (e) => {
    setDiscountPercentage(e)
    var discountRupees = (orderDetail.sub_total / 100) * e
    setDiscountRupees("" + discountRupees.toFixed(2))
      if (e > 100) {
        setDiscountPercentageErrorMsg(true)
      }
      else {
        setDiscountPercentageErrorMsg(false)
    }
  }
  // End of added code by :- Parineeta Gedam on 07-06-2023

  // Added by :- Parineeta Gedam on 10-05-2023
  // Reason :- on discount amount box show the error message.
  var [isShowCancel, setShowCancel] = useState(false);
  // End of added code on 10-05-2023

  const handleUpdate = async () => {

    // Added by :- Parineeta Gedam on 25-05-2023 reason :- update the order items
    submitUpdateOrderItem()
    // End of added code by :- Parineeta Gedam on 25-05-2023 reason :- update the order items

    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;

    var status = {
      order_status: orderStatusSelected,
      payment_status: paymentStatusSelected,

      // Commented code by :- Parineeta Gedam on :- 07-06-2023 
      // Added by :- Parineeta Gedam on :- 08-05-2023 
      // Reason :- update the manual discount
      // discount_type: discountType,
      // manual_discount: discountAmount,
      // End of added code on 08-05-2023
      // End of commented code on 07-06-2023


       // Added by :- Parineeta Gedam on :- 08-05-2023 
      // Reason :- update the manual discount
      discount_rupees: discountRupees,
      // manual_discount: discountAmount,
      // End of added code on 08-05-2023

      // Added by Om Shrivastava on 07-06-23
      // Reason : Save the loyality point through the native
      apply_loyality_point: loyalityPoint,
      // End of addition by Om Shrivastava on 07-06-23

      // Added by Yuvraj Sahu on 14-06-23
      // Reason : Save the discount reason
      discount_reason: discountReason,
      // End of addition by Yuvraj Sahu on 14-06-2023

      // Added by Parineeta Gedam on 13-05-23
      // Reason : Save the order cancel reason
      cancel_reason: orderCancelReason,
      // End of addition by Parineeta Gedam on 13-05-23
    };

    var restaurantName = JSON.parse(
      await SecureStore.getItemAsync("userData")
    ).restaurant_name;

    var orderItem = "";
    var SNumberIncreasing = 1;
    for (var i = 0; i < orderItems.length; i++) {
      if (orderItems[i].item_status == "Pending") {
        orderItem =
          orderItem +
          `<div class="tableContents ">
              <div class="quantityText">${SNumberIncreasing++}</div>
              <div class="titleText">${orderItems[i].item} (${orderItems[i].serving_size
          })</div>
              <div class="rateText">${orderItems[i].quantity}</div>
            </div>`;
      }
    }
    /**
     * Added by - Ashish Dewangan on 19-04-2023
     * Reason - To print pending order items for kitchen whenever order status is changed by admin to confirm
     */
    // Modification by Om on 23-04-23
    // Reason : Need to proper designing
    str = `<div class="billingContainer">
            <div class="inLineContainer" >
              <div class="Hotellabel"  style="text-align:center;"> ${restaurantName}</div>
            </div>
            <hr>
            <div class="inLineContainer">
            <div class="label">Date</div>
             <div class="text">: ${ExtractDateTime(orderDetail.date).date}</div>
            <div class="label">Time</div>
            <div class="text">: ${ExtractDateTime(orderDetail.date).time}</div>

          </div>
          <div class="inLineContainer">
            <div class="label">Order id</div>
            <div class="text">: ${orderDetail.order_id}</div>
            <div class="label">Table</div>
            <div class="text">: ${!orderDetail.table_number ? "N/A" : orderDetail.table_number
      }</div>
            
          </div>
          <div class="tableHeader">
              <div class="serialNo"> SNo   </div>
              <div class="titleHeading">Item Name</div>
              <div class="qtyHeading">   Qty   </div>
            </div>
            ${orderItem} 
    </div>`;

    str = str + `</div>`;
    html = `
    <html>
    <head>
    <style>
    .billingContainer {
      font-family:monospace;
      letter-spacing: 0.6px;
      width: 320px;
      height: auto;
      margin: 0 auto;
      border-radius: 5px;
      padding: 2px 0;
      padding-bottom: 150px;
      border: 1px solid black;
    }
    .inLineContainer {
      min-width: 100%;
      min-height: 10px;
      margin: 4px 0;
      display: flex;
      justify-content: space-between;
    }
    .Hotellabel{
      min-width: 100%;
      font-size: 17px;
      font-weight: 900;
      padding: 0 3%;
      text-align: center;
    }
    .centerLabel{
      min-width: 100%;
      font-size: 12px;
      font-weight: 700;
      text-align: center;
    }
    .label {
      min-width: 15%;
      font-size: 10px;
      font-weight: 700;
      padding: 0 2%;
      text-align: start;
      white-space: nowrap;
    }
    .text {
      min-width: 22%;
      word-break: break-all;
      font-size: 10px;
      font-weight: 600;
      text-align: left;
    }
    .tableHeader {
      height: 30px;
      width: 95%;
      margin: auto;
      border-top: 1px solid black;
      margin-top: 20px;
      border-bottom: 1px solid black;
      display: flex;
      gap: 8px;
    }
    .serialNo {
      font-size: 12px;
      width: 20%;
      padding: 2% 0%;
      font-weight: 700;
    }
    .titleHeading {
      font-size: 12px;
      width: 50%;
      padding: 2% 0%;
      padding-right: 8%;
      font-weight: 700;
      text-align: start;
    }
    
    .qtyHeading {
      font-size: 12px;
      width: 30%;
      padding: 2% 0% 0% 0%;
      font-weight: 700;
    }
    
    .tableContents {
      min-height: 30px;
      width: 95%;
      margin:0 auto;
      margin: 1px 0;
      display: flex;
      gap: 4px;
    }
    .quantityText {
      font-size: 10px;
      width: 10%;
      padding: 2% 0% 0% 5%;
      font-weight: 600;
    }
    .titleText {
      font-size: 10px;
      width: 70%;
      font-weight: 600;
      padding: 2% 0% 0% 8%;
      text-align:left
    }
    .rateText {
      font-size: 12px;
      width: 15%;
      font-weight: 600;
      text-align: end;
      white-space: nowrap;
      padding: 2% 0% 0% 5%;
      text-align:left
    }
    .totalText {
      font-size: 12px;
      width: 30%;
      padding: 2% 2%;
      font-weight: 700;
      text-align: center;
      white-space: nowrap;
    }
    </style>
    </head>
      <body style="text-align: center;">
          <h1 >
          ${str}
        </h1>
      </body>
    </html>
    `;
    // End of addition

    // Modified by :- Parineeta Gedam on 10-05-2023 
    // reason :- check order status and discount amount conditions
    // Modified by :- Parineeta Gedam on 07-06-2023 

    // Added by Om Shrivastava on 08-06-23
    // Reason : Through the error message when user apply the max loyality point as compare to customer loyality point
    // if (orderStatusSelected == "Confirm" && discountRupeesErrorMsg == false && discountPercentageErrorMsg == false ) {

    // Commented and Modified by :- Parineeta Gedam on 18-06-2023 reason :- add order cancel validations msg false
    // if (orderStatusSelected == "Confirm" && discountRupeesErrorMsg == false && discountPercentageErrorMsg == false && loyalityErrorMsg==false) {
    if (orderStatusSelected == "Confirm" && discountRupeesErrorMsg == false && discountPercentageErrorMsg == false && loyalityErrorMsg == false && orderCancelReasonErrorMsg == false) {
      // End of Commented and Modified by :- Parineeta Gedam on 18-06-2023 reason :- add order cancel validations msg false

      //  End of addition by Om Shrivastava on 08-06-23 
      printDoc();
    }
    // End of added code by :- Parineeta Gedam on 10-05-2023

    /**
     * End of code addition by Ashish Dewangan on 19-04-2023
     */

    // Modified by :- Parineeta Gedam on 10-05-2023 
    // Modified by :- Parineeta Gedam on 07-06-2023 

    // Added by Om Shrivastava on 08-06-23
    // Reason : Through the error message when user apply the max loyality point as compare to customer loyality point
    // if (discountRupeesErrorMsg == false && discountPercentageErrorMsg == false) {

    // Commented and Modified by :- Parineeta Gedam on 18-06-2023 reason :- add order cancel validations msg false
    // if (discountRupeesErrorMsg == false && discountPercentageErrorMsg == false && loyalityErrorMsg == false) {
    if (discountRupeesErrorMsg == false && discountPercentageErrorMsg == false && loyalityErrorMsg == false && orderCancelReasonErrorMsg == false) {
      // End of Commented and Modified by :- Parineeta Gedam on 18-06-2023 reason :- add order cancel validations msg false

      // End of addition by Om Shrivastava on 08-06-23

      var response = await updateOrderAndPaymentStatus(tenant, status, orderID);
      if (response.success) {
        /**
         * Added by - Ashish Dewangan on 19-04-2023
         * Reason - To set latest status of items inside the order
         */
        setOrderItems(response.order_items);
        Alert.alert("Order Updated");

        // Added by Om on 21-04-23
        // Reason : Navigate the home page
        navigation.pop();
        // End of addition

        /**
         * End of code addition by Ashish Dewangan on 19-04-2023
         */
      }
    }
    // End of modifications code by :- Parineeta Gedam on 10-05-2023 
  };

  /**
   * Added by Yuvraj Sahu on 07-05-2023
   * Reason - to add date in order detail
   */
  /**
   * Commeted by Yuvraj Sahu on 09-06-2023
   * Reason - to send date in extracteddatetime function
   */
  // const dt = `${orderDetail.date}`.split("T")[0].split("-").reverse().join("/");
  /**
   * End of commet by Yuvraj Sahu on 09-06-2023
   */
  /**
   * End of addition by yuvraj Sahu on 07-05-2023
   */

  // Added by :- Parineeta Gedam on 25-05-2023
  // Reason :- admin can decrease the quantity of items.
  function decreamentQuantiy(items) {
    const index = orderItems.indexOf(items);
    const allOrderItem = orderItems;
    var singalPrice = allOrderItem[index].price / allOrderItem[index].quantity;
    if (allOrderItem[index].quantity != 1) {
      var updateQuantity = allOrderItem[index].quantity -= 1;
      var updatePrice = allOrderItem[index].price = updateQuantity * singalPrice;
      var newSubTotal = 0.0;
      for (var i = 0; i < allOrderItem.length; i++) {
        if (allOrderItem[i].item_status != "Cancelled") {
          newSubTotal += allOrderItem[i].price;
        }
      }
      // Commented by :- PArineeta Gedam on 12-06-2023 reason :-
      // orderDetail.sub_total = newSubTotal
      // var cgst = ((orderDetail.sub_total * settingData.cgst) / 100)
      // orderDetail.cgst = cgst
      // orderDetail.sgst = (orderDetail.sub_total * settingData.sgst) / 100
      // var a = (orderDetail.sub_total * settingData.cgst) / 100 + (orderDetail.sub_total * settingData.sgst) / 100
      // orderDetail.total = a + orderDetail.sub_total
      // End of commented code by Parineeta Gedam on 12-06-2023

      // commented by :- Parineeta Gedam on 18-06-2023 reason :- for code optimizations
      // Added and modified by :- Parineeta Gedam on 10-06-2023
      // reason :- add discount functionality
      // Ticket no :- 307
      // if (orderDetail.discount_rupees) {
      //   orderDetail.sub_total = newSubTotal;
      //   var total = newSubTotal - orderDetail.discount_rupees;
      //   orderDetail.total = total;
      //   orderDetail.cgst = (total * settingData.cgst) / 100;
      //   orderDetail.sgst = (total * settingData.sgst) / 100;
      //   var a =
      //     (total * settingData.cgst) / 100 + (total * settingData.sgst) / 100;
      //   orderDetail.final_amount = a + newSubTotal;
      // } else {
      //   orderDetail.sub_total = newSubTotal;
      //   orderDetail.cgst = (newSubTotal * settingData.cgst) / 100;
      //   orderDetail.sgst = (newSubTotal * settingData.sgst) / 100;
      //   var a =
      //     (newSubTotal * settingData.cgst) / 100 +
      //     (newSubTotal * settingData.sgst) / 100;
      //   orderDetail.final_amount = a + newSubTotal;
      // }
      //  Modified code by Parineeta Gedam on 10-06-2023 Ticket no :- 307
      // End of commented code by Parineeta Gedam on 18-06-2023 Ticket no :- 307 reason :- for code optimizations


      // Added  by :- Parineeta Gedam on 18-06-2023
      // reason :- add discount functionality and for code optimizations
      var copyOrder = orderDetail
      if (copyOrder.discount_rupees) {
        copyOrder.sub_total = newSubTotal;
        var total = newSubTotal - copyOrder.discount_rupees;
        copyOrder.total = total;
        copyOrder.cgst = (total * settingData.cgst) / 100;
        copyOrder.sgst = (total * settingData.sgst) / 100;
        var a =
          (total * settingData.cgst) / 100 + (total * settingData.sgst) / 100;
        copyOrder.final_amount = a + newSubTotal;
      } else {
        copyOrder.sub_total = newSubTotal;
        copyOrder.cgst = (newSubTotal * settingData.cgst) / 100;
        copyOrder.sgst = (newSubTotal * settingData.sgst) / 100;
        var a =
          (newSubTotal * settingData.cgst) / 100 +
          (newSubTotal * settingData.sgst) / 100;
        copyOrder.final_amount = a + newSubTotal;
      }
    }
    else {
      Alert.alert("Quantity can't be less than 1");
    }
    setOrderItems([...allOrderItem])
    setOrderDetail(copyOrder)
    // End of added code by :- Parineeta Gedam on 18-06-2023 reason :- add discount functionality and for code optimizations
  }
  // End of added code by :- Parineeta Gedam on 25-05-2023

  // Added by :- Parineeta Gedam on 25-05-2023
  // Reason :- admin can increase the quantity of items.
  function increamentQuantiy(items) {
    const index = orderItems.indexOf(items);
    const allOrderItem = orderItems;
    var singalPrice = allOrderItem[index].price / allOrderItem[index].quantity;
    var updateQuantity = allOrderItem[index].quantity += 1;
    var updatePrice = allOrderItem[index].price = updateQuantity * singalPrice;
    var newSubTotal = 0.0;
    for (var i = 0; i < allOrderItem.length; i++) {
      if (allOrderItem[i].item_status != "Cancelled") {
        newSubTotal += allOrderItem[i].price;
      }
    }
    // Commented by :- PArineeta Gedam on 12-06-2023 reason :- add discount functionality
    // orderDetail.sub_total = newSubTotal
    // orderDetail.cgst = (newSubTotal * settingData.cgst) / 100
    // orderDetail.sgst = (newSubTotal * settingData.sgst) / 100
    // var a = (newSubTotal * settingData.cgst) / 100 + (newSubTotal * settingData.sgst) / 100
    // orderDetail.total = a + newSubTotal
    // End of commented code by Parineeta Gedam on 12-06-2023

    // Commented code by :- Parineeta Gedam on 18-06-2023 reason :- add discount functionality
    // Added and modified by :- Parineeta Gedam on 10-06-2023
    // reason :- add discount functionality
    // Ticket no :- 307
    // if (orderDetail.discount_rupees) {
    //   orderDetail.sub_total = newSubTotal;
    //   var total = newSubTotal - orderDetail.discount_rupees;
    //   orderDetail.total = total;
    //   orderDetail.cgst = (total * settingData.cgst) / 100;
    //   orderDetail.sgst = (total * settingData.sgst) / 100;
    //   var a =
    //     (total * settingData.cgst) / 100 + (total * settingData.sgst) / 100;
    //   orderDetail.final_amount = a + newSubTotal;
    // } else {
    //   orderDetail.sub_total = newSubTotal;
    //   orderDetail.cgst = (newSubTotal * settingData.cgst) / 100;
    //   orderDetail.sgst = (newSubTotal * settingData.sgst) / 100;
    //   var a =
    //     (newSubTotal * settingData.cgst) / 100 +
    //     (newSubTotal * settingData.sgst) / 100;
    //   orderDetail.final_amount = a + newSubTotal;
    // }
    //  Modified code by Parineeta Gedam on 10-06-2023 Ticket no :- 307
    //  End of commented code by Parineeta Gedam on 18-06-2023 Ticket no :- 307

    // Added  by :- Parineeta Gedam on 18-06-2023
    // reason :- add discount functionality and for code optimizations
      var copyOrder = orderDetail
      if (copyOrder.discount_rupees) {
          copyOrder.sub_total = newSubTotal;
          var total = newSubTotal - copyOrder.discount_rupees;
          copyOrder.total = total;
          copyOrder.cgst = (total * settingData.cgst) / 100;
          copyOrder.sgst = (total * settingData.sgst) / 100;
          var a =
            (total * settingData.cgst) / 100 + (total * settingData.sgst) / 100;
          copyOrder.final_amount = a + newSubTotal;
        } else {
          copyOrder.sub_total = newSubTotal;
          copyOrder.cgst = (newSubTotal * settingData.cgst) / 100;
          copyOrder.sgst = (newSubTotal * settingData.sgst) / 100;
          var a =
            (newSubTotal * settingData.cgst) / 100 +
            (newSubTotal * settingData.sgst) / 100;
          copyOrder.final_amount = a + newSubTotal;
        }
    setOrderItems([...allOrderItem])
    setOrderDetail(copyOrder)
  // End of added code by :- PArineeta Gedam on 18-06-2023 reason :- add discount functionality and for code optimizations
  }
  // End of added code by :- Parineeta Gedam on 25-05-2023

  // Added by :- Parineeta Gedam on 25-05-2023
  // Reason :- delete the order items
  function deleteOrderItemPermission(orderItem) {
    Alert.alert("Confirmation", "Are you sure you want to delete this item?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          handleRemoveOrderItem(orderItem.id);
        },
      },
    ]);
  }

  const handleRemoveOrderItem = async (id) => {
    var tenantName = JSON.parse(await SecureStore.getItemAsync("tenantInfo")).tenant_name;
    const data = {
      order: orderDetail.order_id,
      orderItem: id,
      tenant: tenantName,
    }
    const response = await deleteOrderItemApi(tenantName, data);
    if (response.orderItem) {
      setOrderItems(response.orderItem)
      setOrderDetail(response.order)
      setItemStatus("")
      if (orderItems.filter(dt => dt.item_status == "Pending").length == 1) {
        Navigator.navigate('/OrdersScreen')
      }
    }
  };
  // End of added code by :- Parineeta Gedam on 25-05-2023

  // Added by :- Parineeta Gedam on 03-06-2023
  // Reason :- admin can change the item status

  // Added by :- Parineeta Gedam on 05-06-2023
  // Reason - to get and map Item status
  const [itemStatusSelected, setItemStatus] = useState([]);
  // End of payment status set

  function updateItemStatus(items, itemStatus) {
    // Modified code by :- Parineeta Gedam on 18-06-2023 reason :- update item status
    const index = orderItems.indexOf(items);
    const allOrderItem = orderItems;
    var a = allOrderItem[index].item_status = itemStatus;
    setOrderItems([...allOrderItem])
    // End of modified code by :- Parineeta Gedam on 18-06-2023 reason :- update item status
  }

  // End of added code by :- Parineeta Gedam on 03-06-2023

  // Added by :- Parineeta Gedam on 25-05-2023
  // Reason :- update the order item

  const submitUpdateOrderItem = async () => {

    var tenantName = JSON.parse(await SecureStore.getItemAsync("tenantInfo")).tenant_name;
    const updateOrderItems = {
      orders: orderDetail.order_id,
      orderItems: orderItems,
      tenant: tenantName,
      order: orderDetail,
    };
    const response = await postUpdateOrderItemsApi(tenantName, updateOrderItems);
    if (response) {
      setOrderItems(response.orderItem)
      setOrderDetail(response.order)
    }
  }
  // End of added code by :- Parineeta Gedam on 14-05-2023

  /**
   * Added by Yuvraj Sahu on 14-06-2023
   * Reason - to save and show discount reason
   */
  var [discountReason, setDiscountReason] = useState("");
  const handleDiscountReason = (reason) => {
    setDiscountReason(reason);
  };
  /**
   * End of addition by Yuvraj Sahu on 14-06-2023
   */

  /**
   * Added by Parineeta Gedam on 13-05-2023
   * Reason - to save and show order cancel reason
   */
  var [orderCancelReason, setOrderCancelReason] = useState("");
  const handleOrderCancelReason = (reason) => {
    setOrderCancelReason(reason);
    // Added by :- Parineeta GEdam on 18-06-2023 reason :- order cancel reason box validations message should be false
    setOrderCancelReasonErrorMsg(false)
    // End of Added by :- Parineeta GEdam on 18-06-2023
  };
  /**
   * End of addition by Parineeta Gedam on 13-05-2023
   */


  // MOdified by :- Parineeta Gedam on 18-06-2023
  // reason :- show validations message when admin not enter any cancel reason 

  // Added by :- Parineeta Gedam on 17-06-2023
  // reason :- show confirmations message when admin select the cancel 

  function orderCancelPermission() {
    if (orderCancelReason == "" || orderCancelReason == null) {
      setOrderCancelReasonErrorMsg(true)
    }
    else {
      Alert.alert("Confirmation", "Are you sure you want to cancel this order?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            handleUpdate();
          },
        },
      ]);
    }
  }

  // End of added code by :- Parineeta Gedam on 17-06-2023 reason :- show confirmations message when admin select the cancel
  // End of Modified by :- Parineeta Gedam on 18-06-2023 reason :- show validations message when admin not enter any cancel reason 

  return (
    <>
      {/* Added byYuvraj Sahu on 27-4-2023
    Reason - to click at one time on button when cursor stays on input */}
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* End of addition - button click */}
        <View style={{ padding: 10 }}>
          <View>
            <Text style={{ marginTop: 5 }}>
              <Text>Order ID</Text> : {orderDetail.order_id}
            </Text>
            <Text style={{ marginTop: 5 }}>
              <Text>Table No.</Text> : {orderDetail.table_number}
            </Text>

            <Text style={{ marginTop: 5 }}>
              {/* Modify by- Suman sahu  On 30/04/2023
                  Reason- show only latest name on the order details */}
              {/* <Text>Name</Text> : {customerDetail.name} */}
              {/* Modification and addition by Om Shrivastava on 17-05-23
              Reason : When customer name is not show than show the "---" */}
              {/* <Text>Name</Text> : {customerDetail.last_customer_name} */}
              <Text>Name</Text> : {customerDetail.last_customer_name != undefined && customerDetail.last_customer_name != null && customerDetail.last_customer_name.length > 0 ? customerDetail.last_customer_name : "---"}
              {/* End of modification and addition by Om Shrivastava on 17-05-23 */}
              {/* End of modification 30/04/2023 */}
            </Text>
            {customerDetail.email && (
              <Text style={{ marginTop: 5 }}>
                {/* Added and modified by yuvraj Sahu on 05-05-2023
                Reason - to get latest email  */}
                {/* <Text>Email</Text> : {customerDetail.email} */}
                <Text>Email</Text> : {customerDetail.last_email}
                {/* End of addition by Yuvraj Sahu on 05-05-2023 */}
              </Text>
            )}
            <Text style={{ marginTop: 5 }}>
              <Text>Phone</Text> : {customerDetail.contact_number}
            </Text>
            {/* Added by Yuvraj Sahu on 07-05-2023
            Reason - to add date and time */}
            <Text style={{ marginTop: 5 }}>
              <Text>Date</Text> :{""}
              {/* Commeted and added by Yuvraj Sahu on 09-06-2023
              Reason - to change date format */}
              {/* {dt} */}
              {ExtractDateTime(orderDetail.date).date}
              {/* End of modification by Yuvraj Sahu on 09-06-2023 */}
              {/* {new Date(orderDetail.date)
                .toISOString()
                .split("T")[0]
                .split("-")
                .reverse()
                .join("/")} */}
            </Text>
            <Text style={{ marginTop: 5 }}>
              <Text>Time</Text> :{ExtractDateTime(orderDetail.date).time}
            </Text>

            {/* Addition by Om Shrivastava on 16-06-23
            Reason : Show the payment mode*/}
               {orderDetail.payment_mode!=null ?
               <Text style={{ marginTop: 5 }}>

               <Text>Payment mode : {orderDetail.payment_mode}</Text>
             </Text>
               :
               <Text style={{ marginTop: 5 }}>

               <Text>Payment mode : ----</Text>
             </Text>
               }
            {/* End of addition by Om Shrivastava on 16-06-23 */}

            {/* Addition by Om Shrivastava on 13-05-23
            Reason : Show the all over restaurant review   */}
            {orderDetail.review && (
              <Text style={{ marginTop: 5 }}>

                <Text>Review : {orderDetail.review}</Text>
              </Text>

            )}
            {/* End of addition by Om Shrivastava on 13-05-23 */}

            {/* Addition by Yuvraj Sahu on 15-06-2023
            Reason : Show the all over restaurant rating   */}
            {orderDetail.rating && (
              <Text style={{ marginTop: 5 }}>
                <Text>Rating : {orderDetail.rating}  <FontAwesome name="star" size={13} color="black" /></Text>
              </Text>
            )}
            {/* End of addition by Yuvraj Sahu on 15-06-2023 */}

            {/* End of addition by Yuvraj Sahu on 07-05-2023 */}

            {/* Added by :- Parineeta Gedam on 24-05-2023 
                reason :- Add button, when click on button then open a model for add new order item. 
            */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
            >
              <AddOrderItemForm orderId={orderDetail.order_id} id={orderDetail.id} modalvisibilityFn={setModalVisible} modalvisibility={modalVisible} setOrderItems={setOrderItems} setOrderDetail={setOrderDetail} setOrderStatus={setOrderStatus} />
            </Modal>

            {orderDetail.payment_status == "Completed" || orderDetail.payment_status == "Paid" || orderDetail.order_status == "Cancelled" ?
              null
              : <View style={styles.addOrderItemBtn}>
                <Pressable
                  onPress={() => setModalVisible(true)}
                  style={{
                    backgroundColor: colors.btnColor,
                    height: 30,
                    alignSelf: "flex-end",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                    width: "45%",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    <Feather name="plus-circle" size={17} color="white" /> Add More Item
                  </Text>
                </Pressable>
              </View>}


            {/* End of added code by Parineeta Gedam on 24-05-2023 */}
          </View>
          {orderItems.length > 0 ? (
            <>
              <View style={styles.itemHeadingContainer}>
                {/* Added by :- Parineeta Gedam on 24-05-2023 
                    reason :-  add serial no
                */}
                <Text style={styles.sNoContainer}>#</Text>
                {/* End of added code by :- Parineeta Gedam on 24-05-2023 */}

                <Text style={styles.itemContainer}>Item</Text>
                <Text style={styles.qtyContainer}>Qty</Text>

                {/* Commented by :- Parineeta Gedam on 25-05-2023 reason :- not now show status */}
                {/* Added by - Ashish Dewangan on 19-04-2023
                  Reason - To show item status */}
                {/* <Text style={styles.itemStatusContainer}>Status</Text> */}
                {/* End of code addition by Ashish on 19-04-2023 */}
                {/* End of added code by Parineeta Gedam on 25-05-2023 */}


                {/* Add rupees icon by Om on 26-04-23  */}
                {/* // Added by Om Shrivastava on 08-05-23
                // Reason : Create the rupee sign globally for use the context file */}
                {/* <Text style={styles.costContainer}>Cost(₹)</Text> */}
                <Text style={styles.costContainer}>Cost({rupee_sign})</Text>
                {/* End of addition by Om on 08-05-23 */}

                {/* Added by :- Parineeta Gedam on 24-05-2023 
                    reason :-  add Action
                */}
                <Text style={styles.actionContainer}>Action</Text>
                {/* End of added code by :- Parineeta Gedam on 24-05-2023 */}

              </View>
              {orderItems.map((orderItem, index) => (
                <View key={index}>

                  {/* Modified by :- Parineeta Gedam on 25-05-2023 */}
                  {/* {orderItem.item_status == "Cancelled" ? null : */}
                  <>
                    <View style={styles.tableContainer}>
                      {/* Added by :- Parineeta Gedam on 24-05-2023 
                              reason :-  add serial no
                          */}
                      <Text style={styles.sNoDataContainer}>{i++}</Text>
                      {/* End of added code by :- Parineeta Gedam on 24-05-2023 */}

                      <View style={styles.itemContainer}>
                        <Text>
                          {orderItem.item} ({orderItem.serving_size})
                        </Text>
                        {orderItem.rating && (
                          <Text>
                            {/* Commeted and modified by Yuvraj Sahu on 05-05-2023
                              Reason - to remove lable rating */}
                            {/* Rating : {orderItem.rating}{" "} */}
                            {orderItem.rating}{" "}
                            {/* End of commented by Yuvraj Sahu on 05-05-2023 */}
                            <FontAwesome name="star" size={13} color="black" />
                          </Text>
                        )}
                        {orderItem.review && (
                          <Text>Review : {orderItem.review}</Text>
                        )}
                      </View>

                      {/* Commented by :- Parineeta Gedam on 14-05-2023 
                        reason :- for updations change the functionality
                      */}
                      {/* <Text style={styles.qtyContainer}>{orderItem.quantity}</Text> */}
                      {/* End of commented code by :- Parineeta Gedam on 14-05-2023 */}

                      {/* Added by :- Parineeta Gedam on 14-05-2023 
                        reason :- for updations change the functionality [increment and decrement the qunatity]
                      */}
                      {
                        // MOdified by :- PArineeta Gedam on 11-06-2023 reason :- to check condition
                        orderItem.item_status == "Confirm" ||
                        orderDetail.payment_status == "Completed" ||
                          orderItem.item_status == "Cancelled" || orderDetail.order_status == "Cancelled" ?
                          <View style={styles.qtyParentContainer}>
                            <Text style={styles.qtyDecrementDisable}>-</Text>
                            <Text style={styles.qtyDataContainer}>{orderItem.quantity}</Text>
                            <Text style={styles.qtyIncrementDisable}>+</Text>
                          </View>
                          : <View style={styles.qtyParentContainer}>
                            <Pressable
                              onPress={(e) => {
                                // setDecrement(true); 
                                decreamentQuantiy(orderItem)
                                // handleUpdatedData(orderItem)
                              }}
                            >
                              <Text style={styles.qtyDecrementContainer}>-</Text>
                            </Pressable>
                            <Text style={styles.qtyDataContainer}>{orderItem.quantity}</Text>
                            <Pressable
                              onPress={(e) => increamentQuantiy(orderItem)}
                            >
                              <Text style={styles.qtyIncrementContainer}>+</Text>
                            </Pressable>

                          </View>}

                      {/* End of commented code by :- Parineeta Gedam on 14-05-2023 */}

                      {/* Commented by :- Parineeta Gedam on 25-05-2023 reason :- not now show status */}
                      {/* Added by - Ashish Dewangan on 19-04-2023
                        Reason - To show item status */}
                      {/* <Text style={styles.itemStatusContainer}>
                        {orderItem.item_status}
                       </Text> */}
                      {/* End of code addition by Ashish on 19-04-2023 */}
                      {/* End of added code by Parineeta Gedam on 25-05-2023 */}

                      <Text style={styles.costContainer}>
                        {/* Added by om - 24/4/23
                      Reason - To fixed subtotal calculation */}
                        {/* ₹ {orderItem.quantity * orderItem.price} */}
                        {/* ₹  removed by Om on 26-04-23 */}
                        {/* MOdified by :- Parineeta Gedam on 25-05-2023 */}
                        {orderItem.price.toFixed(2)}
                        {/* End of modifications code by :- Parineeta Gedam on 25-05-2023 */}
                        {/* End of code - om - 24/4/23 */}
                      </Text>

                      {/* Added by :- Parineeta gedam on 25-05-2023 
                      Reason :- if admin cancelled the order then show and admin can give the order cancel reason.
                    */}
                      {/* Commented by :- Parineeta gedam on 03-05-2023 
                      Reason :- if admin cancelled the order then show and admin can give the order cancel reason.
                    */}
                      {/* {orderItem.item_status == "Confirm" || orderItem.item_status == "Cancelled" ?
                          <>
                            <Text style={styles.actionContainer}>
                              <MaterialIcons name="cancel" size={22} color="grey"/>
                            </Text>
                          </> : <>
                            <Text style={styles.actionContainer}>
                              <Pressable onPress={(e) => deleteOrderItemPermission(orderItem)}>
                                <MaterialIcons name="cancel" size={22} color="red"/>
                              </Pressable>
                            </Text>
                          </>} */}
                      {/* End of added code by Parineeta Gedam on 25-05-2023 */}
                      {/* End of commented code by Parineeta Gedam on 01-06-2023 */}

                      {/* Added by :- Parineeta gedam on 01-06-2023 
                      Reason :- if admin cancelled the order then show and admin can give the order cancel reason.
                    */}
                      <View style={styles.actionContainer}>
                        {
                          // MOdified by :- PArineeta Gedam on 11-06-2023 reason :- to check condition
                          orderItem.item_status == "Confirm" || 
                          orderItem.item_status == "Cancelled" || orderDetail.payment_status == "Completed" || orderDetail.order_status == "Cancelled" ?
                            // {allResponseOrderItem.filter(e => e.id == orderItem.id)[0].item_status == "Confirm" || orderItems.filter(e => e.id == orderItem.id)[0].item_status == "Cancelled" ?
                            <><Text style={styles.actionDataContainer}>{orderItem.item_status}</Text></>
                            : <SelectDropdown
                              data={ItemStatusData}
                              defaultValue={
                                ItemStatusData.filter((e) => {
                                  return e.value == orderItem.item_status;
                                })[0]
                              }
                              dropdownOverlayColor="rgba(0,0,0,0)"
                              buttonTextStyle={{ fontSize: 14 }}
                              rowTextStyle={{ fontSize: 14 }}
                              rowStyle={{ height: 30 }}
                              selectedRowStyle={{ backgroundColor: "#d2d2d2" }}
                              dropdownStyle={{
                                borderRadius: 10,
                                backgroundColor: "white",
                                borderWidth: 1,
                              }}
                              renderDropdownIcon={() => {
                                return <AntDesign name="down" size={12} color="black" />;
                              }}
                              buttonStyle={{
                                height: 20,
                                borderColor: "black",
                                borderWidth: 1,
                                borderRadius: 10,
                                backgroundColor: "white",
                                width: "100%",
                                // alignSelf: "center",
                              }}
                              onSelect={(selectedItemStatus) => {
                                setItemStatus(selectedItemStatus.value);
                                selectedItemStatus.value == "Cancelled" ? deleteOrderItemPermission(orderItem) : null
                                selectedItemStatus.value == "Confirm" ? updateItemStatus(orderItem, selectedItemStatus.value) : null

                              }}
                              buttonTextAfterSelection={(selectedItemStatus, index) => {
                                return selectedItemStatus.value;
                              }}
                              rowTextForSelection={(itemStatus, index) => {
                                return itemStatus.value;
                              }}
                            />}
                      </View>
                    </View>
                  </>
                  {/* }  */}
                </View>
              ))}
            </>
          ) : (
            <Text>No data</Text>
          )}
          {/* Modified by Yuvraj Sahu on 11-4-2023
          Reason - to design order detail */}
          <View style={styles.totalBorder} />
          <View>
            {/* Modified by Yuvraj Sahu on 14-4-2023
            Reason - to show total price */}
            {orderDetail.cgst || orderDetail.sgst ?
              <View style={styles.amountRow}>
                {/* Modified by Yuvraj Sahu on 06-05-2023
              Reason - to design total price area */}
                {/* <Text style={styles.totalPriceLables}>Total Price</Text> */}
                <Text style={styles.totalPriceLables}>Sub-Total</Text>
                <Text>:</Text>
                {/* End of designing by yuvraj Sahu on 06-05-2023 */}

                {/* // Added by Om Shrivastava on 08-05-23
                // Reason : Create the rupee sign globally for use the context file */}
                {/* <Text style={styles.totalPrices}>₹ {orderDetail.sub_total}</Text> */}
                <Text style={styles.totalPrices}>{rupee_sign}{orderDetail.sub_total.toFixed(2)}</Text>
                {/* End of addition by Om shrivastava 08-05-23 */}
              </View> : null}
            {/* Commented by Yuvraj Sahu on 17-4-2023
            Reason - to remove gst */}
            {/* <View style={styles.amountRow}>
            <Text>GST :</Text>
            <Text>{orderDetail.tax}</Text>
            </View> */}
            {/* End of removal */}


            {/* Commented by :- Parineeta Gedam on 03-06-2023
                Reason :- to show manual discount and final amount
              */}
            {/* Added by :- Parineeta Gedam on 08-05-2023
                Reason :- to show manual discount and final amount
              */}
            {/* <View style={styles.amountRow}>
              <View style={{ marginTop: 0, width: "50%", alignItems: "flex-end" }}>
                <Text style={styles.totalPriceLables}>Discount</Text>
                <RadioButtonGroup
                  containerStyle={{ marginBottom: 10 }}
                  selected={discountType}
                  onSelected={(value) => { setDiscountType(value); setDiscountAmountErrorMsg(false); (discountAmount > 100) && setDiscountAmount(0) }}
                  radioBackground={colors.btnColor}
                  size={15}
                >
                  <RadioButtonItem style={{ borderWidth: 1 }} value="Discount in (₹)" label="Discount in (₹)" />
                  <RadioButtonItem style={{ borderWidth: 1 }} value="Discount in (%)" label="Discount in (%)" />
                </RadioButtonGroup>
              </View>
              <Text>:</Text>
              <View style={{ width: "20%" }}>
                <TextInput style={styles.discoutAmount}
                  numeric
                  keyboardType={'numeric'}
                  value={discountAmount}
                  onChangeText={(e) => discountHandleChange(e)} />
                {discountAmountErrorMsg &&
                  <Text style={{ color: "red", fontSize: 10 }}>Discount should not be greater than 100</Text>
                }
              </View>
            </View> */}
            {/* End of commented code by Parineeta Gedam on 07-06-2023 */}

            {/* Added by :- Parineeta Gedam on 07-06-2023
                Reason :- to show discount
              */}
            <View style={styles.amountRow}>
              <View style={{ marginTop: 0, width: "50%", alignItems: "flex-end" }}>
                {/* Modified by :- Parineeta Gedam on 12-06-2023 reason :- changes in desiging */}
                {/* <Text style={styles.totalPriceLables}>Discount in (₹)</Text> */}
                <Text>Discount in (₹)</Text>
                {/* End of added code by :- PArineeta Gedam on 12-06-2023 */}
              </View>
              <Text>:</Text>
              <View style={{ width: "20%" }}>
                {/* Modified by :- Parineeta Gedam by :- Parineeta Gedam on 08-06-2023
                    reason :- if payment is completed then disable that fields
                */}
                <TextInput style={styles.discoutAmount}
                  numeric
                  keyboardType={'numeric'}
                  value={discountRupees}
                  // Added by :- Parineeta Gedam on 10-06-2023 reason :- if payment is completed or paid then admin can not add discount T.no :- 307  
                  editable={orderDetail.payment_status == "Paid" || orderDetail.payment_status == "Completed" || orderDetail.order_status == "Cancelled" ? false : true}
                  // End of added code by :- Parineeta Gedam on 10-06-2023
                  onChangeText={(e) => handleChangeDiscountRupees(e)} />
                {discountRupeesErrorMsg &&
                  <Text style={{ color: "red", fontSize: 10 }}>Discount should not be greater than total price</Text>
                }
                {/* End of modifications code by :- Parineeta Gedam on 08-06-2023 */}
              </View>
            </View>
            <View style={styles.amountRow}>
              <View style={{ marginTop: 0, width: "50%", alignItems: "flex-end" }}>
                {/* Modified by :- Parineeta Gedam on 12-06-2023 reason :- changes in desiging */}
                {/* <Text style={styles.totalPriceLables}>Discount in (%)</Text> */}
                <Text>Discount in (%)</Text>
                {/* End of added code by :- PArineeta Gedam on 12-06-2023 */}

              </View>
              <Text>:</Text>
              <View style={{ width: "20%" }}>
                {/* Modified by :- Parineeta Gedam by :- Parineeta Gedam on 08-06-2023
                    reason :- if payment is completed then disable that fields
                */}
                <TextInput style={styles.discoutAmount}
                  numeric
                  keyboardType={'numeric'}
                  value={discountPercentage}
                  // Added by :- Parineeta Gedam on 10-06-2023 reason :- if payment is completed or paid and order status is cancelled then admin can not add discount T.no :- 307  
                  editable={orderDetail.payment_status == "Paid" || orderDetail.payment_status == "Completed" || orderDetail.order_status == "Cancelled" ? false : true}
                  // End of added code by :- Parineeta Gedam on 10-06-2023
                  onChangeText={(e) => handleChangeDiscountAmountPercentage(e)} />
                {discountPercentageErrorMsg &&
                  <Text style={{ color: "red", fontSize: 10 }}>Discount should not be greater than 100</Text>
                }
                {/* End of modifications code by :- Parineeta Gedam on 08-06-2023 */}
              </View>
            </View>

            {/* Added by Yuvraj Sahu on 14-06-2023
            Reason - to save and show discount reason */}
            {/* ---------------------------------------------------------------------------------------------- */}
            <View
              style={[
                styles.discountReasonContainer,
                { opacity: discountRupees > 0 ? 1 : 0.3 },
              ]}
            >
              <View style={styles.discountReasonSpace}>
                <Text>Discount reason</Text>
                <TextInput
                  style={styles.discountReasonInput}
                  value={discountRupees <= 0 ? "" : discountReason}
                  onChangeText={(txt) => handleDiscountReason(txt)}
                  multiline={true}
                  editable={
                    orderDetail.payment_status == "Paid" ||
                      orderDetail.payment_status == "Completed" ||
                      (orderDetail.order_status == "Cancelled" &&
                        discountRupees > 0)
                      ? false
                      : discountRupees > 0
                        ? true
                        : false
                  }
                />
              </View>
            </View>
            {/* End of addition by Yuvraj Sahu on 14-06-2023 */}

            {/* End of added code by :- Parineeta Gedam on 07-06-2023 */}

            {/* Added by Om Shrivastava on 05-06-23
            Reason : Add the loyality point price field and loyality point value */}
            <View style={styles.amountRow}>
              <View style={{ marginTop: 0, width: "50%", alignItems: "flex-end" }}>
                <Text >Apply loyality point</Text>
              </View>
              <Text>:</Text>
              <View style={{ width: "20%" }}>
                <TextInput style={styles.discoutAmount}
                  numeric
                  // Added by :- Om shrivastava on 16-06-23 reason :- if payment is completed or paid then admin can not add loyality point  
                  editable={
                    orderDetail.payment_status == "Paid" || orderDetail.payment_status == "Completed" || orderDetail.order_status == "Cancelled" ||
                      loyalityPoint > 0
                      ? false : true}
                  // End of added code by :- Om shrivastava on 16-06-23
                  keyboardType={'numeric'}
                  value={loyalityPoint}
                  onChangeText={(e) => loyalityHandleChange(e)} />
                {loyalityErrorMsg &&
                  <Text style={{ color: "red", fontSize: 10 }}>Please enter below the customer loyality point</Text>
                }
              </View>
            </View>

            <View style={styles.amountRow}>
                
                <Text style={styles.totalPriceLables}>Customer loyality point</Text>
                <Text>:</Text>
               
                <Text style={styles.totalPrices}>
                 {customerDetail.loyality_points}
                 
                 </Text>

              </View>

            {orderDetail.loyality_point_price ? <>
              <View style={styles.amountRow}>

                <Text style={styles.totalPriceLables}>Loyality Point price</Text>
                <Text>:</Text>

                <Text style={styles.totalPrices}>{rupee_sign}
                  {orderDetail.loyality_point_price}
                </Text>

              </View>
            </> : null}
            {orderDetail.loyality_point_price && orderDetail.payment_status == "Completed" ? <>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 12 }}>
                <View style={{ flex: 1, height: 1.2, backgroundColor: 'black' }} />
              </View>
            </>
              : null}
            {orderDetail.loyality_point_price && orderDetail.payment_status == "Completed" || orderDetail.discount_rupees > 0 ? <>
              <View style={styles.amountRow}>

                <Text style={styles.totalPriceLables}>Total</Text>
                <Text>:</Text>

                <Text style={styles.totalPrices}>{rupee_sign}
                  {orderDetail.total.toFixed(2)}
                </Text>
              </View>
            </> : null}


            {/* End of addition by Om Shrivastava on 05-06-23 */}

            {/* End of added code by :- Parineeta Gedam on 08-05-2023 */}





            {/* Added by :- Parineeta Gedam on 10-05-2023 */}
            {/* {orderDetail.discount_rupees > 0 &&
              <View style={styles.amountRow}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    textAlign: "right",
                    width: "50%",
                  }}
                >
                  Total
                </Text>
                <Text>:</Text>
                <Text style={styles.totalPrices}>{rupee_sign}{orderDetail.total.toFixed(2)}</Text>
              </View>
            } */}
            {/* End of added code by :- Parineeta Gedam on 10-05-2023 */}


            {/* Added by Yuvraj Sahu on 17-4-2023
            Reason - to add cgst and sgst */}
            {/* If no cgst apply than its div is not show, added by Om Shrivastava on 13-05-23 */}
            {orderDetail.cgst ? <>
              <View style={styles.amountRow}>
                {/* Modified by Yuvraj Sahu on 06-05-2023
              Reason - to design total price area */}
                <Text style={styles.totalPriceLables}>CGST</Text>
                <Text>:</Text>
                {/* End of designing by yuvraj Sahu on 06-05-2023 */}

                {/* // Added by Om Shrivastava on 08-05-23
                // Reason : Create the rupee sign globally for use the context file */}
                {/* <Text style={styles.totalPrices}>₹ {orderDetail.cgst}</Text> */}

                <Text style={styles.totalPrices}>{rupee_sign} {orderDetail.cgst.toFixed(2)}</Text>
                {/* End of addition by Om Shrivastava on 08-05-23    */}

              </View>
            </> : null}
            {/* End of addition by Om shrivastava on 13-05-23 */}

            {/* If no cgst apply than its div is not show, added by Om Shrivastava on 13-05-23 */}
            {orderDetail.sgst ? <>
              <View style={styles.amountRow}>
                {/* Modified by Yuvraj Sahu on 06-05-2023
              Reason - to design total price area */}
                <Text style={styles.totalPriceLables}>SGST</Text>
                <Text>:</Text>
                {/* End of designing by yuvraj Sahu on 06-05-2023 */}

                {/* // Added by Om Shrivastava on 08-05-23
                // Reason : Create the rupee sign globally for use the context file */}
                {/* <Text style={styles.totalPrices}>₹ {orderDetail.sgst}</Text> */}
                <Text style={styles.totalPrices}>{rupee_sign}{orderDetail.sgst.toFixed(2)}</Text>
                {/* End of addition by Om Shrivastava on 08-05-23    */}

              </View>
            </> : null}
            {/* End of addition by Om shrivastava on 13-05-23 */}

            {/* End of addition */}
            <View style={styles.amountRow}>
              {/* Style added by Om on 26-04-23 for bold the grand total and increas the font size*/}
              {/* <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                Grand Total :
              </Text> */}
              {/* Modified by Yuvraj Sahu on 06-05-2023
              Reason - to design total price area
              // Commented by :- Parineeta Gedam on 10-05-2023
              */}
              {/* <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 15,
                  textAlign: "right",
                  width: "50%",
                }}
              >
                Grand Total
              </Text>
              <Text>:</Text>
              {/* End of designing by yuvraj Sahu on 06-05-2023 */}
              {/* End of commented code on 10-05-2023 */}

              {/* // Added by Om Shrivastava on 08-05-23
                // Reason : Create the rupee sign globally for use the context file */}
              {/* <Text style={styles.totalPrices}>₹ {orderDetail.total}</Text> */}
              {/* <Text style={styles.totalPrices}>{rupee_sign}{orderDetail.total}</Text> */}
              {/* End of addition by Om Shrivastava on 08-05-23    */}
            </View>

            {orderDetail.manual_discount > 0 ?
              <View style={styles.amountRow}>
                <Text style={{
                  fontWeight: "bold",
                  fontSize: 15,
                  textAlign: "right",
                  width: "50%",
                }}>Grand Total</Text>
                <Text>:</Text>
                {/* Modified by :- Parineeta gedam on 12-06-2023 reason :- remove the hardcode of rupees sign */}
                {/* <Text style={styles.totalPrices}>₹{orderDetail.final_amount}</Text> */}
                <Text style={styles.totalPrices}>{rupee_sign}{orderDetail.final_amount}</Text>
              </View>
              : <View style={styles.amountRow}>
                <Text style={{
                  fontWeight: "bold",
                  fontSize: 15,
                  textAlign: "right",
                  width: "50%",
                }}>Grand Total</Text>
                <Text>:</Text>
                {/* {alert(orderDetail.total)} */}
                {/* Modification and addition by Om Shrivastava on 07-06-23
                Reason : Shwo the final amount, not total */}
                {/* <Text style={styles.totalPrices}>₹{orderDetail.total}</Text> */}
                {/* Modified by :- Parineeta gedam on 12-06-2023 reason :- remove the hardcode of rupees sign */}
                {/* <Text style={styles.totalPrices}>₹{orderDetail.final_amount}</Text> */}
                <Text style={styles.totalPrices}>{rupee_sign}{orderDetail.final_amount}</Text>
                {/* End of additon by Om Shrivastava on 07-06-23 */}
              </View>}
            {/* End of addition */}
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={{ marginTop: 20 }}>
            <View style={styles.orderStatusContainer}>
              {/* Font weight apply by Om on 27-04-23 */}
              <Text style={{ fontWeight: "bold" }}>Order status</Text>

              {/* Commeted and added by Yuvraj Sahu on 04-05-2023
              Reason - to change the dropdown library */}
              {/* <SelectList
                setSelected={setOrderStatus}
                data={orderStatusData}
                search={false}
                dropdownStyles={{
                  // width: "93%",
                  alignSelf: "center",
                  marginTop: 1,
                  height: 125,
                  // Added by Yuvraj Sahu on 04-05-2023 Reason - to set width of dropdown
                  width: 120,
                  // End addition by yuvraj Sahu on 04-05-2023
                }}
                boxStyles={{
                  // width: "93%",
                  alignSelf: "center",
                  borderRadius: 5,
                  borderColor: "black",
                  // marginTop: 10,
                  // Added by Yuvraj Sahu on 04-05-2023 Reason - to set width of dropdown
                  width: 120,
                  // End addition by yuvraj Sahu on 04-05-2023
                }}
                //override default styles
                defaultOption={{
                  key: orderDetail.order_status,
                  value: orderDetail.order_status,
                }}
              /> */}

              <SelectDropdown

                // Commented and modified by :- Parineeta Gedam on 18-06-2023 reason :-once when admin select the dropdown value then update the dropdown and highlight that value 
                // defaultValue={
                //   orderStatusData.filter((e) => {
                //     return e.value == orderDetail.order_status;
                //   })[0]
                // }
                defaultValueByIndex={orderDetail.order_status == "Placed" ? 0 : orderDetail.order_status == "Confirm" ? 1 : orderDetail.order_status == "Cooked" ? 2 : orderDetail.order_status == "Served" ? 3 : orderDetail.order_status == "Cancelled" ? 4 : null}
                // End of Commented and modified by :- Parineeta Gedam on 18-06-2023 reason :-once when admin select the dropdown value then update the dropdown and highlight that value
                
                data={orderStatusData}
                dropdownOverlayColor="rgba(0,0,0,0)"
                buttonTextStyle={{ fontSize: 16 }}
                rowTextStyle={{ fontSize: 16 }}
                // Modified by :- Parineeta gedam on 18-06-2023 reasson :- if order status is cancelled then dropdown will be disable
                // Modified by :- PArineeta gEdam on 08-06-2023
                disabled={orderDetail.payment_status == "Completed" || orderDetail.order_status == "Cancelled" ? true : false}
                // End of modified code on 08-06-2023
                // End of modified code on 18-06-2023 reasson :- if order status is cancelled then dropdown will be disable


                /** Added by Yuvraj Sahu on 07-05-2023
                 * Reson - to give hieght in dropdown
                 */
                rowStyle={{ height: 30 }}
                /**
                 * End of addition by Yuvraj Sahu on 07-05-2023
                 */
                selectedRowStyle={{ backgroundColor: "#d2d2d2" }}
                dropdownStyle={{
                  borderRadius: 10,
                  backgroundColor: "white",
                  borderWidth: 1,
                }}
                renderDropdownIcon={() => {
                  return <AntDesign name="down" size={14} color="black" />;
                }}
                buttonStyle={{
                  /** Added by Yuvraj Sahu on 07-05-2023
                   * Reson - to give hieght in dropdown
                   */
                  height: 30,
                  borderColor: "black",
                  borderWidth: 1,
                  borderRadius: 10,
                  // MOdified by :- PArineeta GEdam on 18-06-2023 reason :- disable 
                  backgroundColor: orderDetail.payment_status == "Completed" || orderDetail.order_status == "Cancelled" ? "#EAE5E3" : "white",
                  // End  MOdified by :- PArineeta GEdam on 18-06-2023 reason :- disable 

                  width: "40%",
                  alignSelf: "center",
                  // marginBottom: 10,
                  /**
                   * End of addition by Yuvraj Sahu on 07-05-2023
                   */
                }}
                onSelect={(selectedOrderStatus, index) => {
                  setOrderStatus(selectedOrderStatus.value);
                  // setOrderStatusChange(selectedOrderStatus.value)
                }}
                buttonTextAfterSelection={(selectedOrderStatus, index) => {
                  return selectedOrderStatus.value;
                  // return orderStatusSelected;
                }}
                rowTextForSelection={(order, index) => {
                  return order.value;
                }}
              />
              {/* End of changing dropdown library by yuvraj Sahu on 04-05-2023 */}
            </View>

            {/* Added by Parineeta Gedam on 13-05-2023
            Reason - to save and show order cancel reason */}
            {/* ---------------------------------------------------------------------------------------------- */}
            {orderStatusSelected == "Cancelled" ?
              <>
                <View >
                  <View>
                    <View style={styles.orderStatusContainer}>
                      <Text style={{ fontWeight: "bold" }}>Order cancel reason</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.CancelReasonContainer}>
                  <View style={styles.textAreaContainer} >
                    <TextInput
                      style={styles.textArea}
                      value={orderCancelReason}
                      onChangeText={(txt) => handleOrderCancelReason(txt)}
                      placeholder="Please enter cancel reason"
                      placeholderTextColor="black"
                      multiline={true}
                      editable={
                        orderDetail.order_status == "Cancelled" ? false : true
                      }
                    />
                  </View>
                  {/* Added by :- Parineeta Gedam on 18-06-2023 reason :- show validations message */}
                  {orderCancelReasonErrorMsg &&
                    <Text style={{ color: "red", fontSize: 10 }}>Please enter order cancel reason</Text>
                  }
                  {/* End of Added by :- Parineeta Gedam on 18-06-2023 reason :- show validations message */}
                </View>
              </>
              : null}
            {/* End of addition by Parineeta Gedam on 13-05-2023 */}






            {/* Modified by Om on 20-04-23
            Reason : When order status is served than this payment status is work */}
            {/* {orderDetail.order_status == "Served" ? (
            <> */}
            <View style={styles.orderStatusContainer}>
              {/* Font weight apply by Om on 27-04-23 */}
              <Text style={{ fontWeight: "bold" }}>Payment status</Text>

              {/* Commeted and added by Yuvraj Sahu on 04-05-2023
              Reason - to change the dropdown library */}
              {/* <SelectList
                setSelected={setPaymentStatus}
                data={paymentStatusData}
                search={false}
                dropdownStyles={{
                  alignSelf: "center",
                  marginTop: 1,
                  height: 100,
                  // Added by Yuvraj Sahu on 04-05-2023 Reason - to set width of dropdown
                  width: 120,
                  // End addition by yuvraj Sahu on 04-05-2023
                }}
                boxStyles={{
                  alignSelf: "center",
                  borderRadius: 5,
                  borderColor: "black",
                  // Added by Yuvraj Sahu on 04-05-2023 Reason - to set width of dropdown
                  width: 120,
                  // End addition by yuvraj Sahu on 04-05-2023
                }}
                defaultOption={{
                  key: orderDetail.payment_status,
                  value: orderDetail.payment_status,
                }}
              /> */}

              <SelectDropdown

                // Commented and modified by :- Parineeta Gedam on 18-06-2023 reason :-once when admin select the dropdown value then update the dropdown and highlight that value 

                // defaultValue={
                //   paymentStatusData.filter((e) => {
                //     return e.value == orderDetail.payment_status;
                //   })[0]
                // }
                defaultValueByIndex={orderDetail.payment_status == "Pending" ? 0 : orderDetail.payment_status == "Completed" ? 1 : null}
                //End of Commented and modified by :- Parineeta Gedam on 18-06-2023 reason :-once when admin select the dropdown value then update the dropdown and highlight that value 


                // Added by :- PArineeta Gedam on 12-06-2023 reason :- admin can not select paid option
                defaultButtonText={orderDetail.payment_status == "Pending" && (orderDetail.payment_mode == "Cash" || orderDetail.payment_mode == "Scanner") ? "Paid" : "Paid"}
                // End of added code by :- Parineeta Gedam on 12-06-2023 

                // Added and Modified by :- Parineeta gedam on 18-06-2023 reason :- if order status is cancelled then payment will be disable
                disabled={orderDetail.order_status == "Cancelled" ? true : false}
                // End of modified code by :- Parineeta gedam  on 18-06-2023

                data={paymentStatusData}
                dropdownOverlayColor="rgba(0,0,0,0)"
                buttonTextStyle={{ fontSize: 16 }}
                rowTextStyle={{ fontSize: 16 }}
                /** Added by Yuvraj Sahu on 07-05-2023
                 * Reson - to give hieght in dropdown
                 */
                rowStyle={{ height: 30 }}

                /**
                 * End of addition by Yuvraj Sahu on 07-05-2023
                 */
                selectedRowStyle={{ backgroundColor: "#d2d2d2" }}
                dropdownStyle={{
                  borderRadius: 10,
                  backgroundColor: "white",
                  borderWidth: 1,
                }}
                renderDropdownIcon={() => {
                  return <AntDesign name="down" size={14} color="black" />;
                }}
                buttonStyle={{
                  /** Added by Yuvraj Sahu on 07-05-2023
                   * Reson - to give hieght in dropdown
                   */
                  height: 30,
                  borderColor: "black",
                  borderWidth: 1,
                  borderRadius: 10,

                  // Commented and modified code by :- PArineeta Gedam on 18-06-2023 reason :- if order status is cancelled then payment will be disable
                  backgroundColor: "white",
                  backgroundColor: orderDetail.order_status == "Cancelled" ? "#EAE5E3" : "white",
                  // End of Commented and modified code by :- PArineeta Gedam on 18-06-2023 reason :- if order status is cancelled then payment will be disable

                  width: "40%",
                  alignSelf: "center",
                  // marginBottom: 10,
                  /**
                   * End of addition by Yuvraj Sahu on 07-05-2023
                   */
                }}
                onSelect={(selectedPaymentStatus, index) => {
                  setPaymentStatus(selectedPaymentStatus.value);
                }}
                buttonTextAfterSelection={(selectedPaymentStatus, index) => {
                  // return paymentStatusSelected;
                  return selectedPaymentStatus.value
                }}
                rowTextForSelection={(order, index) => {
                  return order.value;
                }}
              />
              {/* End of changing dropdown library by yuvraj Sahu on 04-05-2023 */}
            </View>
            {/* </>
            ) : null} */}
            {/* End of modification */}
          </View>
        </View>

        {/* Added by :- Parineeta gedam on 13-05-2023 
            Reason :- if admin cancelled the order then show and admin can give the order cancel reason.
        */}

        {/* {orderDetail.order_status == "Cancelled"}
        <View style={styles.statusContainer}>
          <View style={{ marginTop: 10 }}>
            <View style={styles.orderStatusContainer}>
              <Text style={{ fontWeight: "bold" }}>Cancel reason</Text>
            </View>
          </View>
        </View>

        <View style={styles.CancelReasonContainer}>
          <View style={styles.textAreaContainer} >
            <TextInput
              style={styles.textArea}
              placeholder="Please write cancel reason"
              placeholderTextColor="black"
              multiline={true}
            />
          </View>
        </View> */}


        {/* End of added code by :- Parineeta gedam on 13-05-2023 */}


        <View>
          {/* <Button title="Save"/> */}
          {/* Modification by Om on 26-04-23
        Reason : Fix the button designin  */}
          {orderDetail.order_status == "Served" &&
            orderDetail.payment_status == "Completed" ? (
            <View style={styles.mainButtonDiv}>
              <Pressable
                onPress={handleUpdate}
                // disabled={isDisable}
                style={{
                  // backgroundColor: isDisable ? "grey" : colors.btnColor,
                  backgroundColor: colors.btnColor,
                  height: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  width: "35%",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Update
                </Text>
              </Pressable>
              <Pressable
                onPress={printBill}
                style={{
                  // backgroundColor: isDisable ? "grey" : colors.btnColor,
                  backgroundColor: colors.btnColor,
                  height: 30,
                  alignSelf: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  width: "35%",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {/* Content changes by Om on 27-04-23 */}
                  Print bill
                </Text>
              </Pressable>
            </View>
          ) : (
            <>
             {/* Added by :- Parineeta Gedam on 19-06-2023 reason :- reset the data */}
             <View style={styles.mainButtonDiv}>
              <Pressable
                onPress={(e) =>{getOrderItems()
                }}
                style={{
                  backgroundColor: colors.btnColor,
                  height: 30,
                  alignSelf: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  width: "35%",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Reset
                </Text>
              </Pressable>
            {/* </View> */}

            {/*End of Added code  by :- Parineeta Gedam on 19-06-2023 reason :- reset the data */}

            {/* <View style={styles.btns}> */}
              <Pressable
                // Modified by :- Parineeta Gedam on 17-06-2023
                // reason :-  when admin select the order status = "cancelled" then show the confirmation message.
                // onPress={handleUpdate}
                onPress={() => orderStatusSelected == "Cancelled" ? orderCancelPermission() : handleUpdate()}
                // End of modified code by :- Parineeta Gedam on 17-06-2023  reason :-  when admin select the order status = "cancelled" then show the confirmation message.
                // disabled={isDisable}
                style={{
                  // backgroundColor: isDisable ? "grey" : colors.btnColor,

                  // Commented and modified code by :- Parineeta Gedam on 18-06-2023 reason :- if order status is cancelled then update button will be disable 
                  // backgroundColor: colors.btnColor,
                  backgroundColor: orderDetail.order_status == "Cancelled" ? "grey" : colors.btnColor,
                  // End of Commented and modified code by :- Parineeta Gedam on 18-06-2023 reason :- if order status is cancelled then update button will be disable 

                  height: 30,
                  alignSelf: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  width: "35%",
                }}
                disabled={orderDetail.order_status == "Cancelled" ? true : false}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Update
                </Text>
              </Pressable>
            </View>
            </>
          )}
        </View>
        {/* Added by Om  on 21-04-23
      Reason : When order status is served than payent status is completed functionality */}
        {/* {orderDetail.order_status == "Served" && orderDetail.payment_status == "Completed" ? (
        <>
          <View style={styles.btns}>
            <Pressable
              onPress={printBill}
              style={{
                backgroundColor: colors.anotherButton,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Get bill
              </Text>
            </Pressable>
          </View>
        </>
      ) : null} */}
        {/* End of the addition */}
      </ScrollView>
      {/* Added by Om on 18-04-23 For showing the footer*/}
      <>
        <Footer />
      </>
      {/* End of addition */}
    </>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    // Modified by :- Parineeta Gedam on 24-05-2023 reason :- re-designig of table
    // padding: 10,
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 2,
    paddingRight: 5,
    // End of added code by :- Parineeta Gedam on 24-04-202
    justifyContent: "space-between",
  },
  itemHeadingContainer: {
    borderWidth: 1,
    borderRightColor: "white",
    borderLeftColor: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    // Modified by :- Parineeta Gedam on 24-05-2023 reason :- re-designig of table
    // padding: 10,
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 2,
    paddingRight: 5,
    // End of added code by :- Parineeta Gedam on 24-04-202
    marginTop: 20,
  },
  totalBorder: {
    borderBottomColor: "black",
    borderWidth: 0.5,
    marginTop: 10,
  },
  // Added by Yuvraj Sahu on 14-4-2023
  // Reason - to design
  amountRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingRight: 10,
    paddingLeft: 10,
  },
  /**
   * Added by Yuvraj Sahu on 07-05-2023
   * Reason - to reduce gap between status lables and dropdown box
   */
  statusContainer: {
    paddingHorizontal: 30,
  },
  /**
   * End of addition  by Yuvraj Sahu on 07-05-2023
   */
  orderStatusContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 5,
    paddingRight: 10,
    paddingLeft: 10,
    /**
     * Added by Yuvraj Sahu on 07-05-2023
     */
    alignItems: "center",
    /**
     * End of addition by yuvraj Sahu on 07-05-2023
     */
    // backgroundColor: "white",
    borderRadius: 5,
    padding: 5,
    // marginTop: 20
  },
  btns: {
    // Modified by - Suman sahu  On 30/04/2023
    // Reason- fix and redesign button

    // width: 150,
    // alignSelf: "center",
    // marginTop: 10,
    // marginBottom: 12, // Added by Om on 26-04-23 for apply the padding above the button

    marginBottom: 30,
    marginHorizontal: 10,
    marginTop: 15,
  },
  // End of modification 30/04/2023
  // End of addition

  // Added by by :- Parineeta Gedam on 24-05-2023
  // Reason - to design table

  sNoContainer: {
    width: "6%",
  },
  sNoDataContainer: {
    width: "6%",
  },
  actionContainer: {
    width: "22%",
    textAlign: "right",
  },
  actionDataContainer: {
    width: "100%",
    textAlign: "right",
  },

  /* End of added code by :- Parineeta Gedam on 24-05-2023 */

  // Added by Yuvraj Sahu on 17-4-2023
  // Reason - to design table
  itemContainer: {
    // Modified by :- Parineeta Gedam on 25-05-2023 reason :- changes in desiging. 
    // width: "45%",
    width: "30%",
    // End of added code by :- Parineeta Gedam on 25-05-2023 reason :- changes in desiging. 
  },
  qtyContainer: {
    width: "20%",
    textAlign: "center",
  },

  /* Added by :- Parineeta Gedam on 24-05-2023 
      reason :-  designig 
               */
  qtyParentContainer: {
    display: "flex",
    flexDirection: "row",
    width: "18%",
    height: "50%",
  },
  qtyDecrementContainer: {
    width: 20,
    height: 20,
    borderRadius: 5,
    textAlign: "center",
    borderColor: "green",
    borderWidth: 2,
    fontWeight: "900"
  },
  qtyDataContainer: {
    width: 20,
    height: 20,
    borderRadius: 5,
    textAlign: "center",

  },
  qtyIncrementContainer: {
    width: 20,
    height: 20,
    borderRadius: 5,
    textAlign: "center",
    borderColor: "green",
    borderWidth: 2,
    fontWeight: "900"
  },

  qtyDecrementDisable: {
    width: 20,
    height: 20,
    borderRadius: 5,
    textAlign: "center",
    borderColor: "grey",
    borderWidth: 1,
    fontWeight: "900"
  },
  qtyIncrementDisable: {
    width: 20,
    height: 20,
    borderRadius: 5,
    textAlign: "center",
    borderColor: "grey",
    borderWidth: 1,
    fontWeight: "900"
  },
  // End of added code by :- Parineeta Gedam on 24-05-2023
  /**
   * Added by - Ashish Dewangan on 19-04-2023
   * Reason - To have css style for item status
   */
  itemStatusContainer: {
    width: "20%",
    textAlign: "center",
  },
  /**
   * End of code addition by Ashish Dewangan on 19-04-2023
   */
  costContainer: {
    width: "18%",
    display: "flex",
    textAlign: "right",
  },
  // Added by Om on 26-04-23
  // Reason : Fix the button designing
  mainButtonDiv: {
    alignSelf: "center",
    marginTop: 10,
    flexDirection: "row",
    marginBottom: 12,
  },
  // End of table design
  /**
   * Added by yuvraj Sahu on 06-05-2023
   * Reason - to design total price content
   */
  totalPriceLables: {
    width: "50%",
    textAlign: "right",
  },
  totalPrices: {
    width: "20%",
    textAlign: "right",
  },
  /**
   * End of addition by Yuvraj Sahu on 06-05-2023
   */

  /**
    * Added by :- Parineeta Gedam on 11-05-2023
    * Reason - to design discount amount content
    */
  discoutAmount: {
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 5,
    height: 25
  },

  /**
     * End of addition by Parineeta Gedam on 11-05-2023
     */

  /**
    * Added by :- Parineeta Gedam on 11-05-2023
    * Reason - to design cancel reason
    */

  CancelReasonContainer: {
    paddingHorizontal: 12,
  },
  textAreaContainer: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  textArea: {
    height: 50,
    justifyContent: "flex-start",
  },
  /**
     * End of addition by Parineeta Gedam on 11-05-2023
     */

  // Added by - Parineeta Gedam On 24/05/2023
  // Reason- design add order items button
  addOrderItemBtn: {
    marginBottom: 2,
    marginHorizontal: 10,
    marginTop: 15,
  },

  /**
   * Added by Yuvraj Sahu on 14-06-2023
   * Reason - to design a discount reason conainer
   */
  discountReasonInput: {
    width: "100%",
    borderWidth: 1,
    minHeight: 50,
    alignSelf: "flex-end",
    borderRadius: 5,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  discountReasonContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  discountReasonSpace: { width: "80%", alignSelf: "flex-end" },
  /**
   * End of addition by Yuvraj Sahu on 14-06-2023
   */
});
