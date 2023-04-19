import { View, Text, StyleSheet, Button, Pressable, Alert } from "react-native";
import React from "react";
import { getOrderItemsApi, updateOrderAndPaymentStatus } from "../api/Services";
import { useState } from "react";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useContext } from "react";
import { AppStateContext } from "../context/AppStateProvider";
import { ScrollView } from "react-native-gesture-handler";
import { SelectList } from "react-native-dropdown-select-list";
import { colors } from "../Colours/globalColor";
import * as Print from "expo-print";

export default function OrderItemsScreen({ route, navigation }) {
  var { render, setRender } = useContext(AppStateContext);

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
  }, [render]);
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

  // Added by Yuvraj Sahu on 17-4-2023
  // Reason - to update order and payment status
  {
    /**
     * This method is created for API calling to update the order and payment status
     */
  }

  const handleUpdate = async () => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;

    var status = {
      order_status: orderStatusSelected,
      payment_status: paymentStatusSelected,
    };

    /**
     * Added by - Ashish Dewangan on 19-04-2023
     * Reason - To print pending order items for kitchen whenever order status is changed by admin to confirm
     */
    str = `<div style="display:flex;flex-direction:column;width=100%;border-bottom:1px solid black;">
      <div style="display:flex;flex-direction:row;width=100%;">
        <div style="width:30%;text-align:left;">Order No </div><div>:  ${orderDetail.order_id}</div>
      </div>
      <div style="display:flex;flex-direction:row;width=100%;">
        <div style="width:30%;text-align:left;">Table No </div><div>:  ${orderDetail.table_number}</div>
      </div>
      <div style="display:flex;flex-direction:row;width=100%;">
        <div style="width:30%;text-align:left;">Name </div><div>:  ${customerDetail.name}</div>
      </div>
      <div style="display:flex;flex-direction:row;width=100%;">
        <div style="width:30%;text-align:left;">Email </div><div>:  ${customerDetail.email}</div>
      </div>
      <div style="display:flex;flex-direction:row;width=100%;">
        <div style="width:30%;text-align:left;">Contact No </div><div>:  ${customerDetail.contact_number}</div>
      </div>
    </div>
    
    <div style="width:100%;display:flex;flex-direction:row;border-bottom:1px solid black;">
      <div style="width:70%;font-weight:bold;text-align:left;">Item</div>
      <div style="width:30%;font-weight:bold;">Quantity</div>
    </div>`;
    for (var i = 0; i < orderItems.length; i++) {
      if (orderItems[i].item_status == "Pending") {
        str =
          str +
          `<div style="width:100%;display:flex;flex-direction:row;">
                  <div style="width:70%;text-align:left;">${orderItems[i].item} (${orderItems[i].serving_size})</div>
                  <div style="width:30%;">${orderItems[i].quantity}</div>
                </div>`;
      }
    }
    str = str + `</div>`;
    html = `
    <html>
      <body style="text-align: center;">
          <h1 >
          ${str}
        </h1>
      </body>
    </html>
    `;
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
      /**
       * End of code addition by Ashish Dewangan on 19-04-2023
       */
    }
  };
  // End of addition

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
              }}
              boxStyles={{
                // width: "93%",
                alignSelf: "center",
                borderRadius: 5,
                borderColor: "black",
                // marginTop: 10,
              }}
              //override default styles
              defaultOption={{
                key: orderDetail.order_status,
                value: orderDetail.order_status,
              }}
            />
          </View>
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
              }}
              boxStyles={{
                alignSelf: "center",
                borderRadius: 5,
                borderColor: "black",
              }}
              defaultOption={{
                key: orderDetail.payment_status,
                value: orderDetail.payment_status,
              }}
            />
          </View>
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
            borderRadius: 3,
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
