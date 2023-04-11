import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { getOrderItemsApi } from "../api/Services";
import { useState } from "react";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";

export default function OrderItemsScreen({ route, navigation }) {
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
    }
  };

  return (
    <View>
      <Text>OrderItemsScreen</Text>
      {/* {customerDetail.length > 0 ? 
      <> */}
      {/* {customerDetail.map((customer, id) => ( */}
        <View key={id}>
            <Text>Name : {customerDetail.name}</Text>
            <Text>Email : {customerDetail.email}</Text>
            <Text>Name : {customerDetail.contact_number}</Text>
        </View>
    {/* //   ))} */}
      {/* </>
      :
      <Text>No data</Text>
      } */}
      {orderItems.length > 0 ? 
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
            <Text>{customer.price}</Text>
        </View>
      ))}
      </>
      :
      <Text>No data</Text>
      }
    </View>
  );
}


const styles = StyleSheet.create({
    tableContainer: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        padding: 10,
        justifyContent: "space-between"
    },
    itemHeadingContainer: {
        borderWidth: 1,
        borderRightColor: "white",
        borderLeftColor: "white",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10
    }
})