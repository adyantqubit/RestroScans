/**
 * Created by Yuvraj Sahu on 01-05-2023
 * Reason - to get all customer list for restaurant
 */

import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { getAllCustomerApi } from "../../api/Services";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import Footer from "../../components/Footer/Footer";
import { useIsFocused } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../../Colours/globalColor";

export default function CustomerListScreen({ route, navigation }) {
  const isFocused = useIsFocused();

  /**
   * This is used for render the page and API call first the screen renders
   */
  useEffect(() => {
    allCustomers();
  }, [isFocused]);

  /**
   * This react hooks is used to set all customers
   * Which is used for map and showing data to user
   */
  var [customers, setCustomers] = useState([]);
  /**
   * End of setting orders
   */

  // Added by Yuvraj Sahu on 13-4-2023
  // Reason - to show loading when we call backend
  // This react hooks is used to set loading for response
  var [isLoading, setLoading] = useState(false);
  // End of loading

  /**
   * This function is created for getting all customer list
   */
  const allCustomers = async () => {
    setLoading(true);
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    var response = await getAllCustomerApi(tenant);
    if (response.msg) {
      setLoading(false);
      setCustomers(response.allCustomers);
    }
  };

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="handled">
        {customers.length > 0 ? (
          <>
            {customers.map((customer, id) => (
              <Pressable key={id} style={styles.customerListContainer}>
                <View style={styles.customerIcon}>
                  <Text
                    style={{
                      alignSelf: "center",
                      alignItems: "center",
                      fontSize: 30,
                    }}
                  >
                    {customer.last_customer_name ? (
                      `${customer.last_customer_name}`.charAt(0).toUpperCase()
                    ) : (
                      <AntDesign name="user" size={24} color="black" />
                    )}
                  </Text>
                </View>
                <View style={styles.customerDetail}>
                  <Text style={styles.customerName}>
                    Name :{" "}
                    {customer.last_customer_name
                      ? customer.last_customer_name
                      : "--"}
                  </Text>
                  <Text style={styles.customerLable}>
                    {/* Added and modified by yuvraj Sahu on 05-05-2023
                    Reason - to get latest email  */}
                    {/* Email : {customer.email ? customer.email : "--"} */}
                    Email : {customer.last_email ? customer.last_email : "--"}
                    {/* End of addition by Yuvraj Sahu on 05-05-2023 */}
                  </Text>
                  <Text style={styles.customerLable}>
                    Contact number : {customer.contact_number}
                  </Text>
                </View>
              </Pressable>
            ))}
          </>
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No data available
          </Text>
        )}
      </ScrollView>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  customerListContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 10,
    width: "95%",
    alignSelf: "center",
    padding: 10,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  customerName: {
    fontSize: 16,
    flexShrink: 1,
    flexWrap: "wrap",
    width: "100%",
  },
  customerLable: {
    fontSize: 14,
    marginTop: 4,
    flexShrink: 1,
    flexWrap: "wrap",
    width: "100%",
    flexShrink: 1,
    flexWrap: "wrap",
    width: "100%",
  },
  customerIcon: {
    width: "13%",
    height: 45,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: "black",
    /**
     * Added by yuvraj Sahu on 03-05-2023
     * Reason - to give background color using global
     */
    // backgroundColor: "#BAB8F7",
    backgroundColor: colors.lightTheme,
    /**
     * End of addition
     */
    alignSelf: "center",
    justifyContent: "center",
  },
  customerDetail: {
    width: "87%",
    paddingLeft: 15,
  },
});
