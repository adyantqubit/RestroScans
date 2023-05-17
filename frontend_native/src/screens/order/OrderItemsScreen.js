import { View, Text, StyleSheet, Button, Pressable, Alert } from "react-native";
import React from "react";
import {
  getOrderItemsApi,
  updateOrderAndPaymentStatus,
} from "../../api/Services";
import { useState } from "react";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useContext } from "react";
import { AppStateContext } from "../../context/AppStateProvider";
import { ScrollView } from "react-native-gesture-handler";
import { SelectList } from "react-native-dropdown-select-list";
import { colors } from "../../Colours/globalColor";
import * as Print from "expo-print";
import { useIsFocused } from "@react-navigation/native";
import Footer from "../../components/Footer/Footer";
import { FontAwesome } from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import { AntDesign } from "@expo/vector-icons";

export default function OrderItemsScreen({ route, navigation }) {
  var { render, setRender, settings,rupee_sign } = useContext(AppStateContext); //Need to use settings, for GST number.
  const isFocused = useIsFocused();
  /* Get the order id using params */
  // Added and modified by Yuvraj Sahu on 17-4-2023
  // Reason - to get order id in from router
  const { id, orderID } = route.params;
  // End of modification

  // Added by Yuvraj Sahu on 9-4-2023
  // Reason - to call function when page is render
  // This function is used for calling function when first time page render
  useEffect(() => {
    getOrderItems();
  }, [isFocused]);
  // End of addition

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
  ];
  // End of addition

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
       * End of addition by yuvraj Sahu on 04-05-2023
       */
      // End of addition
    }
  };

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
  function SubtotalOfItems() {
    var total = 0;
    orderItems.filter((o) => {
      total += o.price;
    });
    return total;
  }
  function ExtractDateTime(format) {
    var date = format.substring(0, 10)
    var time = format.substring(11, 16)

    return { date, time }
  }
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
      // if () {
      itemStr =
        itemStr +
        `<div class="tableContents ">
                  <div class="titleText">${orderItems[i].item} (${
          orderItems[i].serving_size
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

    str = `<div class="billingContainer">
            <div class="inLineContainer" >
              <div class="Hotellabel"  style="text-align:center;"> ${restaurantName}</div>
            </div>
            <div class="inLineContainer"  style="text-align:center;">
              <div class="centerLabel">${restaurantAddress} </div>
            </div>
            <div class="inLineContainer">
              <div class="centerLabel">GSTIN :- ${settings.setting.gstin}</div>
            </div>
            <div class="inLineContainer">
              <div class="centerLabel">FSSAI NO :- ${
                settings.setting.fssaino
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
              ${ExtractDateTime(orderDetail.payment_confirmation_date_time).date}
               ${
                //new Date(orderDetail.date)
              //   .toISOString()
              //   .split("T")[0]
              //   .split("-")
              //   .reverse()
              //   .join("/")
              ``
            }
              </div>
              <div class="label">Time  </div>
              <div class="text">  ${
                ExtractDateTime(orderDetail.payment_confirmation_date_time).time
              }</div>
              <!-- ENd of code - 12/5/23 - Rohan Kansari --!>
            </div>
            <div class="inLineContainer">
              <div class="label">Bill   </div>
              <div class="text"> ${orderDetail.order_id}</div>
              <div class="label">Table </div>
              <div class="text">  ${
                !orderDetail.table_number ? "N/A" : orderDetail.table_number
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
          ${orderDetail.cgst||orderDetail.sgst? `<div class="calculationLine">
                <div  class="calculationLabel" style= "text-align:right"> Sub -Total :</div>
                <div  class="calculationText" >${rupee_sign}${SubtotalOfItems().toFixed(
                  2
                )}</div>
              </div>`:``}

             ${orderDetail.cgst? `<div class="calculationLine">
             <div  class="calculationLabel" > CGST (%${(
               (orderDetail.cgst / SubtotalOfItems()) *
               100
             ).toFixed(2)}) :</div>
             <div  class="calculationText" >${rupee_sign}${orderDetail.cgst}  </div>
           </div>`:''} 
             ${orderDetail.sgst? `<div class="calculationLine">
                <div  class="calculationLabel" > SGST (%${(
                  (orderDetail.sgst / SubtotalOfItems()) *
                  100
                ).toFixed(2)}) :</div>
                <div  class="calculationText" >${rupee_sign}${orderDetail.sgst} </div>
              </div>`:''}
              
              ${orderDetail.cgst||orderDetail.sgst?`<hr>`:``}
              <div class="calculationLine">
                <div  class="calculationLabel" > Total :</div>
                <div  class="calculationText" >${rupee_sign}${(
                  SubtotalOfItems() +
                  orderDetail.cgst +
                  orderDetail.sgst
                ).toFixed(2)}</div>
              </div>
            </div>
          </div> 
          <hr>
          <div class="TotalBoxContainer">
            <div class="TotalBox">
                <div class="calculationLine">
                  <div class="TotalLabel">Total </div>
                  <div class="TotalLabel">: </div>

                  <div class="grandTotalText">${rupee_sign}${(
                    SubtotalOfItems() +
                    orderDetail.cgst +
                    orderDetail.sgst
                  ).toFixed(2)}</div>
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
  height: auto;
  display: flex;
  justify-content: flex-end;
}
.calculationBox {
  width: 60%;
  margin-right: 4%;
  margin-bottom: 2%;
  height: auto;
}
.calculationLine {
  display: flex;
  justify-content: space-between;
}
.calculationLabel {
  font-size: 10px;
  width: 20%;
  padding: 2% 4%;
  font-weight: 600;
  width: 100%;
  white-space: nowrap;
  text-align:center
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
  font-weight: 800;
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
  const handleUpdate = async () => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;

    var status = {
      order_status: orderStatusSelected,
      payment_status: paymentStatusSelected,
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
              <div class="titleText">${orderItems[i].item} (${
            orderItems[i].serving_size
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
             <div class="text">: ${new Date(
               orderDetail.date
             ).toLocaleDateString("en-GB")}</div>
            <div class="label">Time</div>
            <div class="text">: ${ExtractDateTime(orderDetail.date).time}</div>

          </div>
          <div class="inLineContainer">
            <div class="label">Order id</div>
            <div class="text">: ${orderDetail.order_id}</div>
            <div class="label">Table</div>
            <div class="text">: ${
              !orderDetail.table_number ? "N/A" : orderDetail.table_number
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
    if (orderStatusSelected == "Confirm") {
      printDoc();
    }
    /**
     * End of code addition by Ashish Dewangan on 19-04-2023
     */

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
  };

  /**
   * Added by Yuvraj Sahu on 07-05-2023
   * Reason - to add date in order detail
   */
  const dt = `${orderDetail.date}`.split("T")[0].split("-").reverse().join("/");
  /**
   * End of addition by yuvraj Sahu on 07-05-2023
   */

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
              <Text>Name</Text> : {customerDetail.last_customer_name  !=undefined && customerDetail.last_customer_name  !=null && customerDetail.last_customer_name.length>0 ?customerDetail.last_customer_name:"---" }
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
              {dt}
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
            {/* Addition by Om Shrivastava on 13-05-23
            Reason : Show the all over restaurant review   */}
              {orderDetail.review && (
            <Text style={{ marginTop: 5 }}>
                
                      <Text>Review : {orderDetail.review}</Text>
            </Text>

                    )}
            {/* End of addition by Om Shrivastava on 13-05-23 */}
            {/* End of addition by Yuvraj Sahu on 07-05-2023 */}
          </View>
          {orderItems.length > 0 ? (
            <>
              <View style={styles.itemHeadingContainer}>
                <Text style={styles.itemContainer}>Item</Text>
                <Text style={styles.qtyContainer}>Qty</Text>
                {/* Added by - Ashish Dewangan on 19-04-2023
                  Reason - To show item status */}
                <Text style={styles.itemStatusContainer}>Status</Text>
                {/* End of code addition by Ashish on 19-04-2023 */}
                {/* Add rupees icon by Om on 26-04-23  */}
                {/* // Added by Om Shrivastava on 08-05-23
                // Reason : Create the rupee sign globally for use the context file */}
                {/* <Text style={styles.costContainer}>Cost(₹)</Text> */}
                <Text style={styles.costContainer}>Cost({rupee_sign})</Text>
                {/* End of addition by Om on 08-05-23 */}

              </View>
              {orderItems.map((orderItem, id) => (
                <View key={id} style={styles.tableContainer}>
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
                  <Text style={styles.qtyContainer}>{orderItem.quantity}</Text>
                  {/* Added by - Ashish Dewangan on 19-04-2023
                  Reason - To show item status */}
                  <Text style={styles.itemStatusContainer}>
                    {orderItem.item_status}
                  </Text>
                  {/* End of code addition by Ashish on 19-04-2023 */}
                  <Text style={styles.costContainer}>
                    {/* Added by om - 24/4/23
                      Reason - To fixed subtotal calculation */}
                    {/* ₹ {orderItem.quantity * orderItem.price} */}
                    {/* ₹  removed by Om on 26-04-23 */}
                    {orderItem.price}
                    {/* End of code - om - 24/4/23 */}
                  </Text>
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
            {orderDetail.cgst || orderDetail.sgst? <View style={styles.amountRow}>
              {/* Modified by Yuvraj Sahu on 06-05-2023
              Reason - to design total price area */}
              <Text style={styles.totalPriceLables}>Total Price</Text>
              <Text>:</Text>
              {/* End of designing by yuvraj Sahu on 06-05-2023 */}

              {/* // Added by Om Shrivastava on 08-05-23
                // Reason : Create the rupee sign globally for use the context file */}
              {/* <Text style={styles.totalPrices}>₹ {orderDetail.sub_total}</Text> */}
              <Text style={styles.totalPrices}>{rupee_sign}{orderDetail.sub_total}</Text>
              {/* End of addition by Om shrivastava 08-05-23 */}
            </View>:null}
            {/* Commented by Yuvraj Sahu on 17-4-2023
            Reason - to remove gst */}
            {/* <View style={styles.amountRow}>
            <Text>GST :</Text>
            <Text>{orderDetail.tax}</Text>
            </View> */}
            {/* End of removal */}
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
              
              <Text style={styles.totalPrices}>{rupee_sign} {orderDetail.cgst}</Text>
              {/* End of addition by Om Shrivastava on 08-05-23    */}
              
            </View>
            </>:null}
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
              <Text style={styles.totalPrices}>{rupee_sign}{orderDetail.sgst}</Text>
              {/* End of addition by Om Shrivastava on 08-05-23    */}

            </View>
            </>:null}
            {/* End of addition by Om shrivastava on 13-05-23 */}

            {/* End of addition */}
            <View style={styles.amountRow}>
              {/* Style added by Om on 26-04-23 for bold the grand total and increas the font size*/}
              {/* <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                Grand Total :
              </Text> */}
              {/* Modified by Yuvraj Sahu on 06-05-2023
              Reason - to design total price area */}
              <Text
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
              
              {/* // Added by Om Shrivastava on 08-05-23
                // Reason : Create the rupee sign globally for use the context file */}
              {/* <Text style={styles.totalPrices}>₹ {orderDetail.total}</Text> */}
              <Text style={styles.totalPrices}>{rupee_sign}{orderDetail.total}</Text>
              {/* End of addition by Om Shrivastava on 08-05-23    */}
            </View>
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
                defaultValue={
                  orderStatusData.filter((e) => {
                    return e.value == orderDetail.order_status;
                  })[0]
                }
                data={orderStatusData}
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
                  backgroundColor: "white",
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
                  // return selectedOrderStatus.value;
                  return orderStatusSelected;
                }}
                rowTextForSelection={(order, index) => {
                  return order.value;
                }}
              />
              {/* End of changing dropdown library by yuvraj Sahu on 04-05-2023 */}
            </View>

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
                defaultValue={
                  paymentStatusData.filter((e) => {
                    return e.value == orderDetail.payment_status;
                  })[0]
                }
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
                  backgroundColor: "white",
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
                  return paymentStatusSelected;
                  // return selectedPaymentStatus.value
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
            <View style={styles.btns}>
              <Pressable
                onPress={handleUpdate}
                // disabled={isDisable}
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
                  Update
                </Text>
              </Pressable>
            </View>
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
    padding: 10,
    justifyContent: "space-between",
  },
  itemHeadingContainer: {
    borderWidth: 1,
    borderRightColor: "white",
    borderLeftColor: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
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
  // Added by Yuvraj Sahu on 17-4-2023
  // Reason - to design table
  itemContainer: {
    width: "45%",
  },
  qtyContainer: {
    width: "10%",
    textAlign: "center",
  },
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
    width: "25%",
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
});
