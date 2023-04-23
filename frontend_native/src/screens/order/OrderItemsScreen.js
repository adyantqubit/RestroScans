import { View, Text, StyleSheet, Button, Pressable, Alert } from "react-native";
import React from "react";
import { getOrderItemsApi, updateOrderAndPaymentStatus } from "../../api/Services";
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

export default function OrderItemsScreen({ route, navigation }) {
  var { render, setRender,settings } = useContext(AppStateContext); //Need to use settings, for GST number.
  const isFocused=useIsFocused();
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
  function SubtotalOfItems(){
    var total=0
    orderItems.filter(o=>{
       total+=o.price*o.quantity
    })
    return total
}
function ExtractDateTime(format) {
  var d = new Date(format);
  var date = d.toLocaleDateString()
  var time = d.toLocaleTimeString()

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

    var restaurantName = JSON.parse(await SecureStore.getItemAsync('userData')).restaurant_name
    var restaurantAddress = JSON.parse(await SecureStore.getItemAsync('userData')).address

    // var status = {
    //   order_status: orderStatusSelected,
    //   payment_status: paymentStatusSelected,
    // };
    var itemStr=""
    for (var i = 0; i < orderItems.length; i++) {
      // if () {
      itemStr =
        itemStr +
        `<div class="tableContents ">
                  <div class="titleText">${orderItems[i].item} (${orderItems[i].serving_size})</div>
                  <div class="quantityText">${orderItems[i].quantity}</div>
                  <div class="rateText">₹ ${orderItems[i].price}</div>
                  <div class="totalText"> ₹ ${orderItems[i].quantity * orderItems[i].price}</div>

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
              <div class="centerLabel">FSSAI NO :- ${settings.setting.gstin}</div>
            </div>
            <hr>

            <div class="inLineContainer">
              <div class="label">Date :  </div>
              <div class="text"> ${new Date(orderDetail.date).toLocaleDateString()}</div>
              <div class="label">Time :  </div>
              <div class="text">${ExtractDateTime(orderDetail.date).time}</div>

            </div>
            <div class="inLineContainer">
              <div class="label">Bill :  </div>
              <div class="text"> ${orderDetail.order_id}</div>
              <div class="label">Table : </div>
              <div class="text">${!orderDetail.table_number? "N/A":orderDetail.table_number}</div>
              
            </div>
            <div class="inLineContainer">
            <div class="label">Pax : </div>
            <div class="text"> ${orderDetail.pax}</div>
            <div class="label">Sess :   </div>
            <div class="text">${orderDetail.sess}</div>
            </div>
            <div class="inLineContainer">
              <div class="label">Dshr :   </div>
              <div class="text">${!orderDetail.dshr? "N/A":orderDetail.dshr}</div>
              <div class="label">Capt :   </div>
              <div class="text">${!orderDetail.capt? "N/A":orderDetail.capt}</div>
            </div>
            <div class="inLineContainer">
              <div class="label">Payment :   </div>
              <div class="text">${orderDetail.payment_mode}</div>
              <div class="label">Status :   </div>
              <div class="text">${orderDetail.payment_status}</div>
            </div>
            <div class="tableHeader">
              <div class="titleHeading"> Item Name   </div>
              <div class="quantityHeading">Qty</div>
              <div class="rateHeading">     Rate </div>
              <div class="totalHeading"> Amount</div>
            </div>
            
          ${itemStr} 
          <hr>
          <div class='CalculationBoxContainer'>
            <div class="calculationBox">
              <div class="calculationLine">
                <div  class="calculationLabel" > Sub -Total :</div>
                <div  class="calculationText" > ${SubtotalOfItems()}</div>
              </div>
              <div class="calculationLine">
                <div  class="calculationLabel" > CGST %${(orderDetail.cgst/SubtotalOfItems()*100).toFixed(2)}</div>
                <div  class="calculationText" >₹ ${orderDetail.cgst}  </div>
              </div>
              <div class="calculationLine">
                <div  class="calculationLabel" > SGST %${(orderDetail.sgst/SubtotalOfItems()*100).toFixed(2)}</div>
                <div  class="calculationText" >₹ ${orderDetail.sgst} </div>
              </div>
              <hr>
              <div class="calculationLine">
                <div  class="calculationLabel" > Total :</div>
                <div  class="calculationText" >₹ ${SubtotalOfItems()+orderDetail.cgst+orderDetail.sgst}</div>
              </div>
            </div>
          </div> 
          <hr>
          <div class="TotalBoxContainer">
            <div class="TotalBox">
                <div class="calculationLine">
                  <div class="TotalLabel">Total :</div>
                  <div class="grandTotalText">₹ ${SubtotalOfItems()+orderDetail.cgst+orderDetail.sgst}</div>
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
  min-width: 22%;
  font-size: 12px;
  font-weight: 700;
  padding: 0 3%;
  text-align: start;
  white-space: nowrap;
}
.text {
  min-width: 22%;
  word-break: break-all;
  font-size: 12px;
  font-weight: 700;
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
  font-size: 12px;
  width: 60%;
  padding: 2% 0%;
  padding-right: 8%;
  font-weight: 700;
  text-align: start;
}
.quantityHeading {
  font-size: 12px;
  width: 20%;
  padding: 2% 4%;
  font-weight: 700;
}
.rateHeading {
  font-size: 12px;
  width: 15%;
  padding: 2% 4%;
  font-weight: 700;
}
.totalHeading {
  font-size: 12px;
  width: 15%;
  padding: 2% 4%;
  font-weight: 700;
}
.tableContents {
  min-height: 30px;
  width: 320px;
  margin:0 auto;
  margin: 1px 0;
  display: flex;
  gap: 4px;
}
.titleText {
  font-size: 12px;
  width: 58%;
  padding: 0.5% 4%;
  font-weight: 700;
}
.quantityText {
  font-size: 12px;
  width: 5%;
  padding: 2% 2%;
  font-weight: 700;
}
.rateText {
  font-size: 12px;
  width: 30%;
  padding: 2% 2%;
  font-weight: 700;
  text-align: end;
  white-space: nowrap;
}
.totalText {
  font-size: 12px;
  width: 30%;
  padding: 2% 2%;
  font-weight: 700;
  text-align: end;
  white-space: nowrap;
}
.CalculationBoxContainer {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: flex-end;
}
.calculationBox {
  width: 60%;
  margin-right: 4%;
  margin-bottom: 2%;
  height: 100px;
}
.calculationLine {
  display: flex;
  justify-content: space-between;
}
.calculationLabel {
  font-size: 12px;
  width: 20%;
  padding: 2% 4%;
  font-weight: 700;
  width: 100%;
  white-space: nowrap;
}
.calculationText {
  width: 50%;
  text-align: end;
  font-size: 12px;
  white-space: nowrap;
  padding: 2% 4%;
  font-weight: 700;
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
    var restaurantName = JSON.parse(await SecureStore.getItemAsync('userData')).restaurant_name

    var orderItem=""
    for (var i = 0; i < orderItems.length; i++) {
      if (orderItems[i].item_status == "Pending") {
        orderItem =
          orderItem +
          `<div class="tableContents ">
              <div class="quantityText">${i+1}</div>
              <div class="titleText">${orderItems[i].item} (${orderItems[i].serving_size})</div>
              <div class="rateText">${orderItems[i].quantity}</div>
              <div class="totalText"></div>
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
            <div class="label">Date :  </div>
            <div class="text"> ${new Date(orderDetail.date).toLocaleDateString()}</div>
            <div class="label">Time :  </div>
            <div class="text">${ExtractDateTime(orderDetail.date).time}</div>

          </div>
          <div class="inLineContainer">
            <div class="label">Order id :  </div>
            <div class="text"> ${orderDetail.order_id}</div>
            <div class="label">Table : </div>
            <div class="text">${!orderDetail.table_number? "N/A":orderDetail.table_number}</div>
            
          </div>
          <div class="tableHeader">
              <div class="quantityHeading"> SNo   </div>
              <div class="titleHeading">Item Name</div>
              <div class="rateHeading">   Qty   </div>
              <div class="totalHeading"> </div>
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
      min-width: 22%;
      font-size: 12px;
      font-weight: 700;
      padding: 0 3%;
      text-align: start;
      white-space: nowrap;
    }
    .text {
      min-width: 22%;
      word-break: break-all;
      font-size: 12px;
      font-weight: 700;
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
      font-size: 12px;
      width: 60%;
      padding: 2% 0%;
      padding-right: 8%;
      font-weight: 700;
      text-align: start;
    }
    .quantityHeading {
      font-size: 12px;
      width: 20%;
      padding: 2% 4%;
      font-weight: 700;
    }
    .rateHeading {
      font-size: 12px;
      width: 15%;
      padding: 2% 4%;
      font-weight: 700;
    }
    .totalHeading {
      font-size: 12px;
      width: 15%;
      padding: 2% 4%;
      font-weight: 700;
    }
    .tableContents {
      min-height: 30px;
      width: 320px;
      margin:0 auto;
      margin: 1px 0;
      display: flex;
      gap: 4px;
    }
    .titleText {
      font-size: 12px;
      width: 58%;
      padding: 0.5% 4%;
      font-weight: 700;
    }
    .quantityText {
      font-size: 12px;
      width: 5%;
      padding: 2% 2%;
      font-weight: 700;
    }
    .rateText {
      font-size: 12px;
      width: 30%;
      padding: 2% 2%;
      font-weight: 700;
      text-align: end;
      white-space: nowrap;
    }
    .totalText {
      font-size: 12px;
      width: 30%;
      padding: 2% 2%;
      font-weight: 700;
      text-align: end;
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
      navigation.pop()
      // End of addition

      /**
       * End of code addition by Ashish Dewangan on 19-04-2023
       */
    }
  };

  return (
    <ScrollView>
      <View style={{ padding: 10 }}>
        <View>
          <Text style={{ marginTop: 5 }}>
            <Text>Order ID</Text> : {orderDetail.order_id}
          </Text>
          <Text style={{ marginTop: 5 }}>
            <Text>Table No.</Text> : {orderDetail.table_number}
          </Text>
          
          <Text style={{ marginTop: 5 }}>
            <Text>Name</Text> : {customerDetail.name}
          </Text>
          {customerDetail.email && (
            <Text style={{ marginTop: 5 }}>
              <Text>Email</Text> : {customerDetail.email}
            </Text>
          )}
          <Text style={{ marginTop: 5 }}>
            <Text>Phone</Text> : {customerDetail.contact_number}
          </Text>
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
              <Text style={styles.costContainer}>Cost</Text>
            </View>
            {orderItems.map((orderItem, id) => (
              <View key={id} style={styles.tableContainer}>
                <Text style={styles.itemContainer}>
                  {orderItem.item} ({orderItem.serving_size})
                </Text>
                <Text style={styles.qtyContainer}>{orderItem.quantity}</Text>
                {/* Added by - Ashish Dewangan on 19-04-2023
                  Reason - To show item status */}
                <Text style={styles.itemStatusContainer}>
                  {orderItem.item_status}
                </Text>
                {/* End of code addition by Ashish on 19-04-2023 */}
                <Text style={styles.costContainer}>
                  ₹ {orderItem.quantity * orderItem.price}
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
          <View style={styles.amountRow}>
            <Text>Total Price :</Text>
            <Text>₹ {orderDetail.sub_total}</Text>
          </View>
          {/* Commented by Yuvraj Sahu on 17-4-2023
          Reason - to remove gst */}
          {/* <View style={styles.amountRow}>
            <Text>GST :</Text>
            <Text>{orderDetail.tax}</Text>
          </View> */}
          {/* End of removal */}
          {/* Added by Yuvraj Sahu on 17-4-2023
          Reason - to add cgst and sgst */}
          <View style={styles.amountRow}>
            <Text>CGST :</Text>
            <Text>₹ {orderDetail.cgst}</Text>
          </View>
          <View style={styles.amountRow}>
            <Text>SGST :</Text>
            <Text>₹ {orderDetail.sgst}</Text>
          </View>
          {/* End of addition */}
          <View style={styles.amountRow}>
            <Text>Grand Total :</Text>
            <Text>₹ {orderDetail.total}</Text>
          </View>
        </View>
      </View>
      <View style={styles.statusContainer}>
        <View style={{ marginTop: 20 }}>
          <View style={styles.orderStatusContainer}>
            <Text>Order status</Text>
            <SelectList
              setSelected={setOrderStatus}
              data={orderStatusData}
              search={false}
              dropdownStyles={{
                // width: "93%",
                alignSelf: "center",
                marginTop: 1,
                height: 125,
                width: 130
              }}
              boxStyles={{
                // width: "93%",
                alignSelf: "center",
                borderRadius: 5,
                borderColor: "black",
                // marginTop: 10,
                width: 130
              }}
              //override default styles
              defaultOption={{
                key: orderDetail.order_status,
                value: orderDetail.order_status,
              }}
            />
          </View>

          {/* Modified by Om on 20-04-23
        Reason : When order status is served than this payment status is work */}
          {/* {orderDetail.order_status == "Served" ? (
            <> */}
          <View style={styles.orderStatusContainer}>
            <Text>Payment status</Text>
            <SelectList
              setSelected={setPaymentStatus}
              data={paymentStatusData}
              search={false}
              dropdownStyles={{
                alignSelf: "center",
                marginTop: 1,
                height: 100,
                width: 130
              }}
              boxStyles={{
                alignSelf: "center",
                borderRadius: 5,
                borderColor: "black",
                width: 130
              }}
              defaultOption={{
                key: orderDetail.payment_status,
                value: orderDetail.payment_status,
              }}
            />
          </View>
          {/* </>
          ) : null} */}
          {/* End of modification */}

        </View>
      </View>
      <View style={styles.btns}>
        {/* <Button title="Save"/> */}
        <Pressable
          onPress={handleUpdate}
          // disabled={isDisable}
          style={{
            // backgroundColor: isDisable ? "grey" : colors.btnColor,
            backgroundColor: colors.btnColor,
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
            Update
          </Text>
        </Pressable>
      </View>
      {/* Added by Om  on 21-04-23
      Reason : When order status is served than payent status is completed functionality */}
      {orderDetail.order_status == "Served" && orderDetail.payment_status == "Completed" ? (
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
      ) : null}
      {/* End of the addition */}
    </ScrollView>
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
  statusContainer: {},
  orderStatusContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 5,
    paddingRight: 10,
    paddingLeft: 10,
    // backgroundColor: "white",
    borderRadius: 5,
    padding: 5,
    // marginTop: 20
  },
  btns: {
    width: 150,
    alignSelf: "center",
    marginTop: 10,
  },
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
  // End of table design
});