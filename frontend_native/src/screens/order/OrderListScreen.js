import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { getOrdersApi } from "../../api/Services";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import Footer from "../../components/Footer/Footer";
import { useIsFocused } from "@react-navigation/native";

export default function OrderListScreen({ route, navigation }) {
  // Added by Yuvraj Sahu on 17-4-2023
  // Reason - to re render the screen
  const isFocused = useIsFocused();
  // End of re render

  // Added by Yuvraj Sahu on 9-4-2023
  // Reason - to call function when page is render
  // This function is used for calling
  // function when page render

  // Added by Yuvraj Sahu on 17-4-2023
  // Reason - to re render the screen
  useEffect(() => {
    allOrders();
  }, [isFocused]);
  // End of addition

  // Added by Yuvraj Sahu on 9-4-2023
  // Reason - to set all order
  // This react hooks is used to set all orders
  // Which is used for map and showing data to user
  var [orders, setOrders] = useState([]);
  // End of setting orders

  // Added by Yuvraj Sahu on 13-4-2023
  // Reason - to show loading when we call backend
  // This react hooks is used to set loading for response
  var [isLoading, setLoading] = useState(false);
  // End of loading

  // Added by Yuvraj Sahu on 9-4-2023
  // Reason - to get orders
  // This function is created for getting all orders
  const allOrders = async () => {
    // Added by Yuvraj Sahu on 13-4-2023
    setLoading(true);
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    var response = await getOrdersApi(tenant);
    if (response.msg) {
      setLoading(false);
      setOrders(response.allOrders);
    }
  };

  // Added by Yuvraj Sahu on 9-4-2023
  // Reason - to get id and navigate
  // This method is created for navigate the order
  // and sreen and send the order id after navigation
  // it will be used for getting order items
  const handleOrder = async (id, order_id) => {
    // Added and modified by Yuvraj Sahu on 17-4-2023
    // Reason - to send order_id in order itema screen
    navigation.navigate("OrderItemsScreen", {
      id: id,
      orderID: order_id,
    });
    // And of modification
  };

  // Added by- Suman Sahu on 29-4-2023
  // Reason - to show time in order list screen
  function ExtractDateTime(format) {
    var d = new Date(format);
    var time = d.toLocaleTimeString();

    return { time };
  }
  // End of addition 29-4-2023

  return (
    <>
      {/* Added byYuvraj Sahu on 27-4-2023
    Reason - to click at one time on button when cursor stays on input */}
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* End of addition - button click */}
        {/* This function is used to map or show the data  */}
        {orders.length > 0 ? (
          <>
            {orders.map((order, id) => (
              <Pressable
                key={id}
                style={styles.orderListContainer}
                onPress={(e) => handleOrder(order.id, order.order_id)}
              >
                {/* Modified by Yuvraj Sahu 20-4-2023
                Reason - to add order id and show date */}
                <View
                  // Modified by Yuvraj Sahu on 24-4-2023
                  // Reason - to fix overflow
                  style={{ width: "45%" }}
                  // End of modification
                >
                  <Text style={styles.customerName}>{order.last_customer_name}</Text>
                  <Text style={styles.tableNo}>
                    Table no. : {order.table_number}
                  </Text>
                  <Text style={styles.tableNo}>
                    Order ID : {order.order_id}
                  </Text>
                </View>
                <View
                  // Modified by Yuvraj Sahu on 24-4-2023
                  // Reason - to fix overflow
                  style={{
                    width: "55%",
                  }}
                  // End of modification
                >
                  <Text style={styles.orderandPaymentStatus}>
                    Order status : {order.order_status}
                  </Text>
                  <Text style={styles.orderandPaymentStatus}>
                    Payment status : {order.payment_status}
                  </Text>
                  <Text style={styles.tableNo}>
                    Date :{" "}
                    {/* Added and commeted by Yuvraj Sahu on 30-4-2023
                    Reason - to formate date in dd/mm/yy */}
                    {/* Date - {new Date(order.date).toLocaleDateString()} */}
                    {new Date(order.date)
                      .toISOString()
                      .split("T")[0]
                      .split("-")
                      .reverse()
                      .join("/")}
                    {/* End of modification */}
                  </Text>

                  {/* Added by- Suman Sahu on 29-4-2023
                      Reason - to show time in order list screen */}
                  <Text style={styles.tableNo}>
                    Time - {ExtractDateTime(order.date).time}
                  </Text>
                  {/* End of addition 29-04-2023 */}
                </View>
                {/* End of designing */}
              </Pressable>
            ))}
          </>
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No data available
          </Text>
        )}
      </ScrollView>
      {/* Added by Om on 18-04-23 For showing the footer*/}
      <Footer />
      {/* End of addition */}
    </>
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
    padding: 10,
    // Added by Yuvraj Sahu on 20-4-2023
    // Reason - to design card
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  // End of designing
  customerName: {
    fontSize: 16,
  },
  tableNo: {
    fontSize: 14,
    marginTop: 4,
    // Added by Yuvraj Sahu on 24-4-2023
    // Reason - to fix overflow
    flexShrink: 1,
    flexWrap: "wrap",
    width: "100%",
    // End of addition
  },
  // Added by Om on 26-04-23
  // Reason : Create the order and payment status class name
  orderandPaymentStatus: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: "bold",
    flexShrink: 1,
    flexWrap: "wrap",
    width: "100%",
    fontWeight: "bold",
  },
  // End of addition
});
