// Created by Yuvraj Sahu on 24-2-2023
// Reason - it is created for restaurant after restaurant login
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
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
import { SvgCssUri } from 'react-native-svg';
import * as Print from 'expo-print'
import Icon from "react-native-vector-icons/AntDesign";


export default function HomeScreen({ navigation }) {
  const isFocused = useIsFocused();
  var [userData, setUserData] = useState([]);
  var navigator = useNavigation();

  /**
   * Commented by - Ashish Dewangan on 19-04-2023
   * Reason - No longer needed
   */
  // const [todaysOrders, setTodaysOrders] = useState([]);
  /**
   * End of comment
   */

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

  /**
   * Added by -Ashish Dewangan on 19-04-2023
   * Reason - To show todays orders
   */
  const [todaysNewlyPlacedOrders, setTodaysNewlyPlacedOrders] = useState([]);
  const [todaysPendingOrders, setTodaysPendingOrders] = useState([]);
  const [todaysCompletedOrders, setTodaysCompletedOrders] = useState([]);
  /**
   * End of code addition by Ashish on 19-04-2025
   */

  var [scanner, setScanner] = useState(""); // Added by Om on 16-04-23 for show the QR code scanner;

  var { render, setRender, getSettingData } = useContext(AppStateContext);

  useEffect(() => {
    authNavigate();
    getSettingData();
    getQRCode()  // Added by Om on 16-04-23 for show set the method in useeffect
  }, [isFocused]);

  /**
   * Added by - Ashish Dewangan on 09-04-2023
   * Reason - to initialize dashboard with backend data
   */
  useEffect(() => {
    initializeDashboard();
  }, [isFocused]);

  // Added by Om on 16-04-23
  // Reason : For set the QR code data in scanner variable
  const getQRCode = async () => {
    var qrCode = await SecureStore.getItemAsync("qrCodeTenant");
    setScanner(qrCode);
  };
  // End of addition

  const initializeDashboard = async () => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    const response = await getDashboardData(tenant);
    if (response) {
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

       /**
       * Added by - Ashish Dewangan on 19-04-2023
       * Reason - To show todays new orders
       */
      setTodaysNewlyPlacedOrders(response.todays_newly_placed_orders);
      setTodaysPendingOrders(response.todays_pending_orders);
      setTodaysCompletedOrders(response.todays_completed_orders);
      /**
       * End of code addition by Ashish Dewangan on 19-04-2023
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

  function goToOrderDetails(id,orderId) {
    // alert(orderId);
    navigation.navigate('OrderNavigation',{ screen: 'OrderItemsScreen',initial:false,params: {id:id, orderID: orderId} })
    // navigation.navigate("OrderItemsScreen", {id:id, orderID: orderId });
  }
  // Added by Om on 18-04-23
  // Reason : Add the print functionality

  // const generatePdf = async () => {
  //   const options = {
  //     html: '<h1>Om</h1>',
  //     fileName: 'html_to_pdf',
  //     directory: 'Documents'
  //   }
  //   const file = await reactNativeHTMLToPdf.convert(options);
  //   console.log(file)
  // };
// Modfication by Om on 20-04-23
// Reason : Fix the Print functionality, need to add 4 QR images
  const html = `
<html >
 
  <body style="text-align: center;margin:0px;padding:0px;">
  <div style="display:flex;flex-wrap:wrap;">
  <div style="width:50vw; height:50vh;">
  <div style="font-size: 30px; font-family: Helvetica Neue; font-weight: bold; text-transform:uppercase">
  ${userData.restaurant_name}
</div>
    <img
      src=http://192.168.41.45:8000/media/ashoka.moreshop.co.in/images/qrcode/qr.svg 
      //  src=${scanner}
      style="width: 330px;height:330px; margin-top:-20px; margin-bottom:-20px;" />
      <div>
      <h1 style="font-size: 14px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
      Adyant Softtech Pvt. Ltd., Raipur
    </h1>
    <h1 style="font-size: 14px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
  <img src = '${'http://192.168.41.45:19000/assets/globe.png'}' width='14px' height='14px'/>
   restroscans.com
</h1>
    <h1 style="font-size: 24px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
    <b>  Scan menu</b>
  </h1>
  
  <h1 style="font-size: 14px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
  Table no :
</h1>
</div>
</div>


<div style="width:50vw; height:50vh;">
  <div style="font-size: 30px; font-family: Helvetica Neue; font-weight: bold;text-transform:uppercase"">
  ${userData.restaurant_name}
</div>
    <img
      src=http://192.168.41.45:8000/media/ashoka.moreshop.co.in/images/qrcode/qr.svg 
      //  src=${scanner}
      style="width: 330px;height:330px;margin-top:-20px; margin-bottom:-20px;" />
      <div>
      <h1 style="font-size: 14px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
      Adyant Softtech Pvt. Ltd., Raipur
    </h1>
    <h1 style="font-size: 14px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
  <img src = '${'http://192.168.41.45:19000/assets/globe.png'}' width='14px' height='14px'/>
   restroscans.com
</h1>
    <h1 style="font-size: 24px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
    <b>  Scan menu</b>
  </h1>
  
  <h1 style="font-size: 14px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
  Table no :
</h1>
</div>
</div>

<div style="width:50vw; height:50vh;">
  <div style="font-size: 30px; font-family: Helvetica Neue; font-weight: bold;text-transform:uppercase"">
  ${userData.restaurant_name}
</div>
    <img
      src=http://192.168.41.45:8000/media/ashoka.moreshop.co.in/images/qrcode/qr.svg 
      //  src=${scanner}
      style="width: 330px;height:330px; margin-top:-20px; margin-bottom:-20px;" />
      <div>
      <h1 style="font-size: 14px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
      Adyant Softtech Pvt. Ltd., Raipur
    </h1>
    <h1 style="font-size: 14px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
  <img src = '${'http://192.168.41.45:19000/assets/globe.png'}' width='14px' height='14px'/>
   restroscans.com
</h1>
    <h1 style="font-size: 24px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
    <b>  Scan menu</b>
  </h1>
  
  <h1 style="font-size: 14px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
  Table no :
</h1>
</div>
</div>

<div style="width:50vw; height:50vh;">
  <div style="font-size: 30px; font-family: Helvetica Neue; font-weight: bold;text-transform:uppercase"">
  ${userData.restaurant_name}
</div>
    <img
      src=http://192.168.41.45:8000/media/ashoka.moreshop.co.in/images/qrcode/qr.svg 
      //  src=${scanner}
      style="width: 330px;height:330px; margin-top:-20px; margin-bottom:-20px;" />
      <div>
      <h1 style="font-size: 14px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
      Adyant Softtech Pvt. Ltd., Raipur
    </h1>
    <h1 style="font-size: 14px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
  <img src = '${'http://192.168.41.45:19000/assets/globe.png'}' width='14px' height='14px'/>
   restroscans.com
</h1>
    <h1 style="font-size: 24px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
  <b>  Scan menu</b>
  </h1>
  
  <h1 style="font-size: 14px; font-family: Helvetica Neue; font-weight: normal;padding : 0px;margin:0px">
  Table no :
</h1>
</div>
</div>

</div>
  </body>
</html>
`;
// End of modification
  const printDoc = async () => {
    await Print.printAsync({
      html,
    });
  };

  // End of addition 

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

        {/* Uncommentded by Om on 19-04-23
            Reason: show the Restaurant name */}
        <View style={styles.restaurantDetail}>
          <Text style={styles.restaurantLable}>{userData.restaurant_name}</Text>
          {/* <Text style={styles.restaurantHeadline}>{userData.tag_line}</Text> */}
        </View>
        {/* End of Uncommentded code */}

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
        {/* Added by Om on 16-04-23
        Reason : For show the QR code image in native site */}
        <View style={{
          alignItems: "center",
          justifyContent: "center",
          alignSelf: 'center',
          // borderColor:'red',
          // borderWidth:1,
          // paddingTop: 12,
          paddingBottom: 10,
          width: "100%",
          // height:'30%'
        }}>

          <SvgCssUri
            width="180"
            height="180"
            viewBox="0 0 450 470"
            uri="http://192.168.41.45:8000/media/ashoka.moreshop.co.in/images/qrcode/qr.svg"
          // uri={scanner}

          />
          <View style={{
            marginTop: -10, alignItems: "center",
            justifyContent: "center",
            alignSelf: 'center',
          }}>
            <Text style={{ fontSize: 10, }}>Adyant Softtech Pvt. Ltd., Raipur</Text>
            <Text style={{ fontSize: 10, }}>
              <Icon name="earth" size={12} color="black" />
              &nbsp;restroscans.com </Text>
            <Text style={{ fontSize: 12,fontWeight:'bold' }}>Scan menu </Text>
            <Text style={{ fontSize: 10, }}>
              Table no: </Text>
          </View>

        </View>
        <View></View>
        <View style={styles.btns}
        >
          <Pressable
            onPress={printDoc}
            style={{
              backgroundColor: colors.btnColor,
              height: 20,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 7,
              width: 60
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 10,
                fontWeight: "bold",
              }}
            >
              Print
            </Text>
          </Pressable>

        </View>
        {/* End of addition */}

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


        {/* Added by - Ashish Dewangan on 19-04-2023
            Reason - To show today's new  orders on dashboard(home screen) */}
        {todaysNewlyPlacedOrders ? (
          <View style={styles.todaysOrderContainer}>
            <Text style={styles.todaysOrderContainerTitle}>Newly Placed Orders</Text>
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
            {todaysNewlyPlacedOrders.map((order, index) => {
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
                    onPress={(e) => goToOrderDetails(order.id,order.order_id)}
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
        {/* End of code addition for show today's new orders on dashboard(home screen) on 19-04-2023*/}


        {/* Added by - Ashish Dewangan on 11-04-2023
            Reason - To show today's pending orders on dashboard(home screen) */}
        {todaysPendingOrders ? (
          <View style={styles.todaysOrderContainer}>
            <Text style={styles.todaysOrderContainerTitle}>Pending Orders</Text>
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
            {todaysPendingOrders.map((order, index) => {
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
                    onPress={(e) => goToOrderDetails(order.id,order.order_id)}
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

        {/* Added by - Ashish Dewangan on 11-04-2023
            Reason - To show today's Completed orders on dashboard(home screen) */}
        {todaysCompletedOrders ? (
          <View style={styles.todaysOrderContainer}>
            <Text style={styles.todaysOrderContainerTitle}>Completed Orders</Text>
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
            {todaysCompletedOrders.map((order, index) => {
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
                    onPress={(e) => goToOrderDetails(order.id,order.order_id)}
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
    fontWeight: 'bold',
    textTransform:'uppercase'
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
  // Added by Om on 16-04-23
  // Reason : Fix the button
  btns: {
    alignSelf: "center",
    fontSize: 3,
    flexDirection: 'row',
    // paddingTop:40
  },
  // End of modification
  /**
   * End of code addition for styling of dashboard on 15-04-2023
   */
  // End of designing
});
