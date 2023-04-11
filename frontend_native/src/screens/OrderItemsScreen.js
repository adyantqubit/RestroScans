import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { getOrderItemsApi } from "../api/Services";
import { useState } from "react";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useContext } from "react";
import { AppStateContext } from "../context/AppStateProvider";

export default function OrderItemsScreen({ route, navigation }) {

  var {render, setRender} = useContext(AppStateContext)

  /* Get the order id using params */
  const { orderID } = route.params;

  // Added by Yuvraj Sahu on 9-4-2023
  // Reason - to call function when page is render
  // This function is used for calling function when first time page render
  useEffect(() => {
    getOrderItems();
  }, []);
  // End of addition

  // Added by Yuvraj Sahu on 9-4-2023
  // Reason - to set all order
  // This react hooks is used to set order items
  // Which is used for map and showing data to user
  var [orderItems, setOrderItems] = useState([]);
  // End of setting orders

  // Added by Yuvraj Sahu on 9-4-2023
  // Reason - to set all order
  // This react hooks is used to set customer detail
  // Which is used for map and showing data to user
  var [customerDetail, setCustomerDetail] = useState([]);
  // End of setting orders

// Added by Yuvraj Sahu on 12-4-2023
// Reason - to set calculated data
  var [amount, setAmount] = useState({ totalPrice: 0, Gst: 0, grandTotal: 0 });
  useEffect(()=>{
  },[amount.totalPrice])
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

      // Added by Yuvraj Sahu on 11-4-2023
      // Reason - to calculate total price, gst and grand total
      {
        /* This function is created for calculation like Total Price , gst and grand total */
      }
      for (var i = 0; i < orderItems.length; i++) {
        // orderItems.map((price)=>(
        setAmount(amount.totalPrice + orderItems[i].price);
        console.log("aaaaaaaaaaa"+JSON.stringify(amount.totalPrice + orderItems[i].price))
      }
      // ))
      // End of addition
    }
  };

  // alert(amount.totalPrice);

  return (
    <View>
      <Text>OrderItemsScreen</Text>
      <View>
        <Text>Name : {customerDetail.name}</Text>
        {customerDetail.email && <Text>Email : {customerDetail.email}</Text>}
        <Text>Phone : {customerDetail.contact_number}</Text>
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
      {/* Added by Yuvraj Sahu on 11-4-2023
      Reason - to design order detail */}
      <View style={styles.totalBorder} />
      <View>
        <View>
          <Text>Total Price :</Text>
          <Text>{amount.totalPrice}</Text>
        </View>
        <View>
          <Text>GST :</Text>
          <Text></Text>
        </View>
        <View>
          <Text>Grand Total :</Text>
          <Text></Text>
        </View>
      </View>
    </View>
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
  },
  totalBorder: {
    borderBottomColor: "black",
    borderWidth: 0.5,
    marginTop: 10,
  },
});
