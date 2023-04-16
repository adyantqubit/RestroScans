import { View, Text, StyleSheet, Button, Pressable } from "react-native";
import React from "react";
import { getOrderItemsApi } from "../api/Services";
import { useState } from "react";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useContext } from "react";
import { AppStateContext } from "../context/AppStateProvider";
import { ScrollView } from "react-native-gesture-handler";
import { SelectList } from "react-native-dropdown-select-list";
import { colors } from "../Colours/globalColor";

export default function OrderItemsScreen({ route, navigation }) {
  var { render, setRender } = useContext(AppStateContext);

  /* Get the order id using params */
  const { orderID } = route.params;

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
  var orderStatusData = [
    { key: "In Process", value: "In Process" },
    { key: "Cooking", value: "Cooking" },
    { key: "Served", value: "Served" },
  ];
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
    var response = await getOrderItemsApi(tenant, orderID);
    if (response.msg) {
      setOrderItems(response.orderItems);
      setCustomerDetail(response.customerDetail);
      // Added by Yuvraj Sahu on 14-4-2023
      // Reason - to set order detail in state
      setOrderDetail(response.orderDetail);
      // End of addition
    }
  };

  // alert(amount.totalPrice);

  return (
    <ScrollView>
      <View style={{ padding: 10 }}>
        <View>
          <Text style={{marginTop: 5}}>Name : {customerDetail.name}</Text>
          {customerDetail.email && <Text style={{marginTop: 5}}>Email : {customerDetail.email}</Text>}
          <Text style={{marginTop: 5}}>Phone : {customerDetail.contact_number}</Text>
        </View>
        {orderItems.length > 0 ? (
          <>
            <View style={styles.itemHeadingContainer}>
              <Text>Item</Text>
              <Text>Qty</Text>
              <Text>Cost</Text>
            </View>
            {orderItems.map((customer, id) => (
              <View key={id} style={styles.tableContainer}>
                <Text>{customer.item}</Text>
                <Text>{customer.quantity}</Text>
                <Text>{customer.quantity * customer.price}</Text>
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
            <Text>{orderDetail.sub_total}</Text>
          </View>
          <View style={styles.amountRow}>
            <Text>GST :</Text>
            <Text>{orderDetail.tax}</Text>
          </View>
          <View style={styles.amountRow}>
            <Text>Grand Total :</Text>
            <Text>{orderDetail.total}</Text>
          </View>
        </View>
      </View>
      <View style={styles.statusContainer}>
        <View style={{marginTop: 20}}>
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
          // onPress={handleSubmit(handleRegister)}
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
            Save
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
    marginTop: 20
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
});
