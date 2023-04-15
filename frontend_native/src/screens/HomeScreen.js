// Created by Yuvraj Sahu on 24-2-2023
// Reason - it is created for restaurant after restaurant login
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  Pressable,
  BackHandler,
  Alert,
  ScrollView,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import RNExitApp from "react-native-exit-app";
import config, { setTenant, tenantName } from "../config/config";
import { colors, fonts } from "../Colours/globalColor";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { AppStateContext } from "../context/AppStateProvider";
import { LinearGradient } from "expo-linear-gradient";
// import '../Colours/GlobalColor.css';

import { getDashboardData, getDashboardDetails } from "../api/Services";

export default function HomeScreen({ navigation }) {
  const isFocused = useIsFocused();
  var [userData, setUserData] = useState([]);
  var navigator = useNavigation();
  const [todaysOrders, setTodaysOrders] = useState([]);
  /**
   * Commented and modified by - Ashish Dewangan on 15-04-2023
   * Reason - Created variables to store backend data
   */
  // const [revenueDetails, setRevenueDetails] = useState([]);
  const [revenueDetails, setRevenueDetails] = useState({});
  const [todaysSummary, setTodaysSummary] = useState({});
  const [thisWeeksSummary, setThisWeeksSummary] = useState({});
  const [thisMonthsSummary, setThisMonthsSummary] = useState({});
  const [thisYearsSummary, setThisYearsSummary] = useState({});
  /**
   * End of code modification
   */
  var { render, setRender } = useContext(AppStateContext);

  var { render, setRender, getSettingData } = useContext(AppStateContext);

  useEffect(() => {
    authNavigate();
    getSettingData();
  }, [isFocused]);

  /**
   * Added by - Ashish Dewangan on 09-04-2023
   * Reason - to initialize dashboard with backend data
   */
  useEffect(() => {
    initializeDashboard();
  }, [isFocused]);

  const initializeDashboard = async () => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    const response = await getDashboardData(tenant);
    if (response) {
      setTodaysOrders(response.todays_orders);
      setRevenueDetails(response.revenue_details);
      /**
       * Added by - Ashish Dewangan on 15-04-2023
       * Reason - To store revenue details from backend to frontend variables
       */
      setTodaysSummary(response.revenue_details.todays_summary);
      setThisWeeksSummary(response.revenue_details.this_weeks_summary);
      setThisMonthsSummary(response.revenue_details.this_months_summary);
      setThisYearsSummary(response.revenue_details.this_years_summary);
      /**
       * End of code addition
       */
    }
  };

  /**
   * End of code addition
   */

  /**
   * Added by - Ashish Dewangan
   * Reason - To promt the user with alert about exiting the app when back pressing on home screen
   */
  useEffect(() => {
    const backAction = () => {
      if (
        navigator.getState().routes[navigator.getState().index].name ==
        "HomeScreen"
      ) {
        Alert.alert("Hold on!", "Are you sure you want to Exit?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "YES",
            onPress: () => {
              BackHandler.exitApp();
            },
          },
        ]);
        return true;
      }
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  /**
   * End of code addition by Ashish for back press
   */

  var authNavigate = async () => {
    if ((await SecureStore.getItemAsync("userData")) == null) {
      navigation.navigate("LoginScreen");
    }
    if ((await SecureStore.getItemAsync("userData")) != null) {
      setUserData(JSON.parse(await SecureStore.getItemAsync("userData")));
    }
    // alert(JSON.parse(await SecureStore.getItemAsync("tenantInfo")).tenant_name)
  };

  // Added by Yuvraj Sahu on 11-3-2023
  // Reason - to get user detail from securestore

  // Modified by Yuvraj Sahu on 11-3-2023
  // Reason - to remove logout button
  var logOut = async () => {
    await SecureStore.deleteItemAsync("userData");
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("tenantInfo");
    if (
      (await SecureStore.getItemAsync("userData")) == null &&
      (await SecureStore.getItemAsync("token")) == null &&
      (await SecureStore.getItemAsync("tenantInfo")) == null
    ) {
      navigation.navigate("LoginScreen");
    }
  };

  function goToOrderDetails(orderId) {
    // alert(orderId);
    navigation.navigate("OrderItemsScreen", { orderID: orderId });
  }

  return (
    <SafeAreaView>
      {/* Commented adn modified by - Ashish Dewangan on 12-04-2023
      Reason - To hide restaurant name and logo */}

      {/* Added and modified by Yuvraj Sahu on 11-3-2023
      Reason - to map data and design page */}
      <ScrollView style={styles.homeContainer}>
        {/* 
          <View style={styles.homeContainer} >
            <View style={styles.restaurantImgContainer}>
              <Image
                source={{
                  uri: config.imageUrl + userData.restaurant_logo,
                }}
                style={styles.restaurantImg}
              />
            </View> */}
        {/* <View style={styles.restaurantDetail}>
            <Text style={styles.restaurantLable}>{userData.restaurant_name}</Text>
            <Text style={styles.restaurantHeadline}>{userData.tag_line}</Text>
          </View> */}
        {/* End of code comment and modification by Ashish on 12-04-2023 */}

        {/* Commented and modified by - Ashish Dewangan on 12-04-2023
            Reason - To show revenue and count of orders in card form */}

        {/* Added by - Ashish Dewangan on 12-04-2023
            Reason - To show revenue and count of orders */}

        {/* {revenueDetails ? (
          <View
            style={{
              flex: 1,
              width: "100%",
              backgroundColor: "white",
              marginTop: 10,
              elevation: 5,
              shadowColor: "#171717",
              width: "97%",
              alignSelf: "center",
              borderWidth: 1,
              borderRadius: 5,
              padding: 2,
            }}
          >
            {revenueDetails.map((revenue, index) => {
              return (
                <View key={index} style={{ flex: 1, justifyContent: "center" }}>
                  {revenue.map((data, i) => {
                    return (
                      <View
                        key={i}
                        style={{ width: "100%", flexDirection: "row" }}
                      >
                        <View style={{ width: "60%" }}>
                          <Text>{data.title}</Text>
                        </View>
                        <View style={{ width: "40%" }}>
                          <Text> : {data.value}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        ) : null} */}

        {/* 
          End of code addition for show revenue and count of orders on 12-04-2023
        */}

        {revenueDetails ? (
          <View style={styles.revenueContainer}>
            <LinearGradient
              colors={["#4099ff", "#73b4ff"]}
              style={styles.revenueCard}
            >
              <Text style={styles.revenueCardTitle}>Today</Text>
              <Text style={styles.revenueCardHeading}>Order Count</Text>
              <Text style={styles.revenueCardData}>
                {todaysSummary.order_count}
              </Text>
              <Text style={styles.revenueCardHeading}>Revenue</Text>
              <Text style={styles.revenueCardData}>
                {todaysSummary.total_revenue}
              </Text>
            </LinearGradient>

            <LinearGradient
              colors={["#2ed8b6", "#59e0c5"]}
              style={styles.revenueCard}
            >
              <Text style={styles.revenueCardTitle}>This Week</Text>
              <Text style={styles.revenueCardHeading}>Order Count</Text>
              <Text style={styles.revenueCardData}>
                {thisWeeksSummary.order_count}
              </Text>
              <Text style={styles.revenueCardHeading}>Revenue</Text>
              <Text style={styles.revenueCardData}>
                {thisWeeksSummary.total_revenue}
              </Text>
            </LinearGradient>
            <LinearGradient
              colors={["#FFB64D", "#ffcb80"]}
              style={styles.revenueCard}
            >
              <Text style={styles.revenueCardTitle}>This Month</Text>
              <Text style={styles.revenueCardHeading}>Order Count</Text>
              <Text style={styles.revenueCardData}>
                {thisMonthsSummary.order_count}
              </Text>
              <Text style={styles.revenueCardHeading}>Revenue</Text>
              <Text style={styles.revenueCardData}>
                {thisMonthsSummary.total_revenue}
              </Text>
            </LinearGradient>
            <LinearGradient
              colors={["#FF5370", "#ff869a"]}
              style={styles.revenueCard}
            >
              <Text style={styles.revenueCardTitle}>This Year</Text>
              <Text style={styles.revenueCardHeading}>Order Count</Text>
              <Text style={styles.revenueCardData}>
                {thisYearsSummary.order_count}
              </Text>
              <Text style={styles.revenueCardHeading}>Revenue</Text>
              <Text style={styles.revenueCardData}>
                {thisYearsSummary.total_revenue}
              </Text>
            </LinearGradient>
          </View>
        ) : null}
        {/* End of code modification for showing revenue in card form on 15-04-2023 */}

        {/* Added by - Ashish Dewangan on 11-04-2023
            Reason - To show today's orders on dashboard(home screen) */}
        {todaysOrders ? (
          <View style={styles.todaysOrderContainer}>
            <Text style={styles.todaysOrderContainerTitle}>Today's Orders</Text>
            <View style={styles.todaysOrderHeadingContainer}>
              <Text style={{ width: "25%", fontWeight: "bold" }}>Order ID</Text>
              <Text style={{ width: "13%", fontWeight: "bold" }}>
                Table No.
              </Text>
              <Text style={{ width: "22%", fontWeight: "bold" }}>
                Order Status
              </Text>
              <Text style={{ width: "25%", fontWeight: "bold" }}>
                Payment Status
              </Text>
              <Text style={{ width: "15%", fontWeight: "bold" }}></Text>
            </View>
            {todaysOrders.map((order, index) => {
              return (
                <View key={index} style={styles.todaysOrderDataContainer}>
                  <Text style={{ width: "25%" }}>{order.order_id}</Text>
                  <Text style={{ width: "13%" }}>{order.table_number}</Text>
                  <Text style={{ width: "22%" }}>{order.order_status}</Text>
                  <Text style={{ width: "25%" }}>{order.payment_status}</Text>
                  <Pressable
                    key={index}
                    style={{
                      width: "15%",
                      backgroundColor: colors.btnColor,
                      borderRadius: 10,
                      padding: 1,
                    }}
                    onPress={(e) => goToOrderDetails(order.id)}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "#FFFFFF",
                      }}
                    >
                      View
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        ) : null}
        {/* End of code addition for show today's orders on dashboard(home screen) on 11-04-2023*/}

        {/* Commented by - Ashish Dewangan on 11-03-2023
            Reason - to Hide logout button from home screen */}
        {/* <View style={styles.previewBtn}>
          <Pressable onPress={logOut} style={styles.pressableBtn}>
            <Text style={styles.btnText}>Logout</Text>
          </Pressable>
        </View>
         </View>
        */}
        {/* End of comment for Hide logout button from home screen on 11-03-2023 */}
      </ScrollView>
      {/* End of modification */}
      {/* End of code comment and modification by Ashish*/}
    </SafeAreaView>
  );
}

// This is for designing --------------------------------------
const styles = StyleSheet.create({
  restaurantImgContainer: {
    alignSelf: "center",
    width: "80%",
    height: "40%",
  },
  // Added by Yuvraj Sahu on 11-3-2023
  // Reason - to design page
  homeContainer: {
    backgroundColor: "#edebeb",
    margin: "auto",
    height: "100%",
    display: "flex",
  },
  restaurantImg: {
    height: "90%",
  },
  restaurantDetail: {
    alignSelf: "center",
    alignItems: "center",
  },
  restaurantLable: {
    fontSize: fonts.title1,
  },
  restaurantHeadline: {
    fontSize: 15,
  },
  previewBtn: {
    width: "80%",
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 10,
  },
  pressableBtn: {
    backgroundColor: colors.btnColor,
    padding: "5%",
    borderRadius: 10,
  },
  btnText: {
    textTransform: "uppercase",
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 18,
  },

  /**
   * Added by - Ashish Dewanagn on 15-04-2023
   * Reason - To have styling of dashboard
   */
  revenueContainer: {
    flex: 1,
    width: "100%",
    marginTop: 10,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  revenueCard: {
    width: "23%",
    elevation: 5,
    shadowColor: "#171717",
    borderRadius: 5,
    alignSelf: "center",
    padding: 2,
    paddingTop: 10,
    paddingBottom: 10,
  },
  revenueCardTitle: {
    color: "white",
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "white",
  },
  revenueCardHeading: {
    color: "white",
    fontWeight: "900",
    textAlign: "center",
  },
  revenueCardData: {
    color: "white",
    fontWeight: "900",
    textAlign: "center",
    fontSize: 16,
  },
  todaysOrderContainer: {
    flex: 1,
    width: "97%",
    alignSelf: "center",
    marginTop: 10,
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "#171717",
    borderWidth: 1,
    borderRadius: 5,
  },
  todaysOrderContainerTitle: {
    alignSelf: "center",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    fontWeight: "bold",
    marginBottom: 10,
  },
  todaysOrderHeadingContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 2,
  },
  todaysOrderDataContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 3,
    borderTopColor: "black",
    borderTopWidth: 1,
  },
  /**
   * End of code addition for styling of dashboard on 15-04-2023
   */
  // End of designing
});
