import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { getOrdersApi } from "../api/Services";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";

export default function OrdersScreen({ route, navigation }) {
  // Added by Yuvraj Sahu on 9-4-2023
  // Reason - to call function when page is render
  // This function is used for calling
  // function when page render
  useEffect(() => {
    allOrders();
  }, []);
  // End of addition

  // Added by Yuvraj Sahu on 9-4-2023
  // Reason - to set all order
  // This react hooks is used to set all orders
  // Which is used for map and showing data to user
  var [orders, setOrders] = useState([]);
  // End of setting orders

  // Added by Yuvraj Sahu on 9-4-2023
  // Reason - to get orders
  // This function is created for getting all orders
  const allOrders = async () => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    var response = await getOrdersApi(tenant);
    if (response.msg) {
      setOrders(response.allOrders);
    }
  };

  // Added by Yuvraj Sahu on 9-4-2023
  // Reason - to get id and navigate
  // This method is created for navigate the order
  // and sreen and send the order id after navigation
  // it will be used for getting order items
  const handleOrder = async (id) => {
    navigation.navigate("OrderItemsScreen", {orderID: id})
  }


  return (
    <ScrollView>
      {/* This function is used to map or show the data  */}
      {orders.length > 0 ? (
      <>
      {orders.map((order, id) => (
        <Pressable
          key={id}
          style={styles.orderListContainer}
          onPress={(e) => handleOrder(order.id)}
        >
          <View>
          <Text style={styles.customerName}>{order.customer_name}</Text>
          <Text style={styles.tableNo}>Table no. - {order.table_number}</Text>
          </View>
          <View style={{alignItems: "flex-end"}}>
          <Text style={styles.tableNo}>Order status - {order.order_status}</Text>
          <Text style={styles.tableNo}>Payment status -  {order.payment_status}</Text>
          </View>
        </Pressable>
      ))}
      </>
      )
      : 
      <Text>Loading.....</Text>
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  orderListContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    width: "95%",
    // height: 80,
    alignSelf: "center",
    padding: 10
  },
  customerName: {
    fontSize: 16,
  },
  tableNo: {
    fontSize: 14,
    marginTop: 4
  }
});