import React, { useContext, useState } from "react";
import {
  StyleSheet,
  ImageBackground,
  Button,
  Alert,
  Pressable,
  Text,
  View,
} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../screens/HomeScreen";
import PreviewMenuScreen from "../screens/PreviewMenuScreen";
import { colors } from "../Colours/globalColor";
import Icon from "react-native-vector-icons/FontAwesome";
// import { getTenantApi } from "../api/Services";
import * as SecureStore from "expo-secure-store";
import SettingScreen from "../screens/SettingScreen";
import { useIsFocused } from "@react-navigation/native";
import { AppStateContext } from "../context/AppStateProvider";
import MenuNavigation from "./MenuNavigation";
import OfferNavigation from "./OfferNavigation";
import OrderNavigation from "./OrderNavigation";
import { AddMenuNavigation } from "./AddMenuNavigation";
import { AddOfferNavigation } from "./AddOfferNavigation";
import PaymentMethod from "../screens/personalInformation/PaymentMethod";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PrintQRScreen from "../screens/PrintQRScreen";
import CustomerListScreen from "../screens/customer/CustomerListScreen";
import { FontAwesome } from '@expo/vector-icons';
import ReservationList from "../components/reservation/ReservationList";
import ReservationNavigation from "./ReservationNavigation";
import SocialLinkScreen from "../screens/socialMedia/SocialLinkScreen";
import { Feather } from "@expo/vector-icons";
import SocialMediaNavigation from "./SocialMediaNavigation";


export default function DrawerNavigation({ navigation }) {
  // Navigation added by Om on 18-04-23 , This helps to navigate the after logout screen is change
  const Drawer = createDrawerNavigator();
  const isFocused = useIsFocused(); // isFocused helped to rerender the page, added by Om on 18-04-23
  var [userData, setUserData] = useState([]);

  var { render, setRender, getSettingData } = useContext(AppStateContext);

  React.useEffect(() => {
  	// Modified by yuvraj Sahu on 11-06-2023
  	// Reason - to remove warning from bottom
    // getTenant();
    authNavigate();
    // getSettingData();
    // End of modification by Yuvraj Sahu on 11-06-2023
  }, [isFocused]); // Added by Om on 18-04-23 For helped the rerender issue

  var getTenant = async () => {
    var userData = await SecureStore.getItemAsync("userData");
    // JSON.parse(userData).id
    // var response = await getTenantApi(JSON.parse(userData).id)
    // console.log('tenant drawer'+JSON.stringify(response))
  };

  // Added by Om on 18-04-23
  // Reason : Completer the logout funcitonality
  var authNavigate = async () => {
    if ((await SecureStore.getItemAsync("userData")) == null) {
      navigation.navigate("LoginScreen");
    }
    if ((await SecureStore.getItemAsync("userData")) != null) {
      setUserData(JSON.parse(await SecureStore.getItemAsync("userData")));
    }
  };

  function showAlert1() {
    Alert.alert("Confirmation", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => {
          logOut();
        },
      },
    ]);
  }

  var logOut = async () => {
    await SecureStore.deleteItemAsync("userData");
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("tenantInfo");
    await SecureStore.deleteItemAsync("qrCodeTenant");

    if (
      (await SecureStore.getItemAsync("userData")) == null &&
      (await SecureStore.getItemAsync("token")) == null &&
      (await SecureStore.getItemAsync("tenantInfo")) == null &&
      (await SecureStore.getItemAsync("qrCodeTenant")) == null
    ) {
      navigation.navigate("LoginScreen");
    }
  };
  // End of addition

  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          drawerLabel: "Home",
          title: "Home",
          headerStyle: {},
          // Added by Om on 18-04-23
          // Reason : Completer the logout funcitonality
          // Modified by Om on 19-04-23 For change the logout style
          headerRight: () => (
            <View style={{ marginRight: 10, borderRadius: 12 }}>
              <Text
                onPress={showAlert1}
                style={{
                  //  Modified by - Suman sahu  On 23/04/2023
                  // Reason - remove underline on logout icon

                  // textDecorationLine: "underline",

                  // End of commented code

                  fontSize: 15,
                  fontWeight: "bold",
                  color: "blue",
                }}
                // title="Logout"
                // color="#c39212"
                // bor
              >
                {/* Modified by - Suman sahu  On 23/04/2023
                    Reason - change logout text to icon */}

                {/* Logout */}
                <MaterialCommunityIcons name="logout" size={24} color="black" />

                {/* End of modified code 23/04/2023 */}
              </Text>
            </View>
          ),
          // End of addition

          // Added by Yuvraj Sahu on 16-4-2023
          // Reason - to add icon in drawer
          drawerIcon: (config) => <Icon name="home" size={20} color="black" />,
          // end of addition
        }}
      />

      <Drawer.Screen
        // Modified by Yuvraj Sahu on 21-4-2023
        // Reason - to fix navigation
        // name="MenuListScreen"
        // component={MenuListScreen}
        name="Menus"
        component={MenuNavigation}
        // End of modification
        options={{
          drawerLabel: "Menu List",
          title: "Menu List",

          headerStyle: {
            // backgroundColor: colors.backgroundTheme,
          },
          // Added by Yuvraj Sahu on 16-4-2023
          // Reason - to add icon in drawer
          drawerIcon: (config) => <Icon name="list" size={20} color="black" />,
          // end of addition
        }}
      />
      <Drawer.Screen
        name="Add"
        component={AddMenuNavigation}
        options={{
          drawerLabel: "Add Menu Item",
          title: "Add Menu Item",
          // Added by Yuvraj Sahu on 16-4-2023
          // Reason - to add icon in drawer
          drawerIcon: (config) => (
            <Icon name="upload" size={20} color="black" />
          ),
          // end of addition
        }}
      />
      <Drawer.Screen
        name="PreviewMenuScreen"
        component={PreviewMenuScreen}
        options={{
          drawerLabel: "Preview Menu",
          title: "Preview Menu",
          // Added by Yuvraj Sahu on 16-4-2023
          // Reason - to add icon in drawer
          drawerIcon: (config) => <Icon name="book" size={20} color="black" />,
          // end of addition
        }}
      />

      {/* Added by Om on 08-04-23
      Reason : Show added banner list */}
      <Drawer.Screen
        name="Addbanners"
        component={AddOfferNavigation}
        options={{
          drawerLabel: "Add Banner/Offer",
          title: "Add Banner/Offer",
          // Added by Yuvraj Sahu on 16-4-2023
          // Reason - to add icon in drawer
          drawerIcon: (config) => (
            <Icon name="ticket" size={20} color="black" />
          ),
          // end of addition
        }}
      />
      {/* End of addition */}
      <Drawer.Screen
        // Modified by Yuvraj Sahu on 21-4-2023
        // Reason - to fix navigation
        // name="OfferScreen"
        // component={OfferScreen}
        name="Offer"
        component={OfferNavigation}
        // End of modification
        options={{
          drawerLabel: "Banner/Offer",
          title: "Banner/Offer",
          // Added by Yuvraj Sahu on 16-4-2023
          // Reason - to add icon in drawer
          drawerIcon: (config) => <Icon name="tags" size={20} color="black" />,
          // end of addition
        }}
      />

      {/* Added Yuvraj Sahu on 8-4-2023
      Reason - to define routing for setting screen */}
      <Drawer.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{
          drawerLabel: "Setting",
          title: "Setting",
          // Added by Yuvraj Sahu on 16-4-2023
          // Reason - to add icon in drawer
          drawerIcon: (config) => <Icon name="gear" size={20} color="black" />,
          // end of addition
        }}
      />
      {/* End of addition */}
      {/* Added Yuvraj Sahu on 9-4-2023
      Reason - to define routing for order screen */}
      {/* Commented by Yuvraj Sahu on 21-4-2023
      Reason - to update navigation of order */}
      {/* <Drawer.Screen
        name="OrdersScreen"
        component={OrdersScreen}
        options={{
          drawerLabel: "All Orders",
          title: "All Orders",
          // Added by Yuvraj Sahu on 16-4-2023
          // Reason - to add icon in drawer
          drawerIcon: (config) => (
            <Icon name="clipboard" size={20} color="black" />
          ),
          // end of addition
        }}
      /> */}
      {/* End of comment */}
      {/* Added by Yuvraj Sahu on 21-4-2023
      REason - to update order navigation */}
      <Drawer.Screen
        name="OrderNavigation"
        component={OrderNavigation}
        options={{
          drawerLabel: "All Orders",
          title: "All Orders",
          // Added by Yuvraj Sahu on 16-4-2023
          // Reason - to add icon in drawer
          drawerIcon: (config) => (
            <Icon name="clipboard" size={20} color="black" />
          ),
          // end of addition
        }}
      />
      {/* End of navigation */}
      {/* End of addition */}

       {/* Modified by :- Parineeta Gedam on 16-06-2023 */}
       {/* Added by Parineeta Gedam on 26-05-2023
        Reason - to define route for navigation on reservations */}
      <Drawer.Screen
        name="ReservationNavigation"
        component={ReservationNavigation}
        options={{
          drawerLabel: "Table Reservation",
          title: "Table Reservation",
          drawerIcon: (config) => (
            <FontAwesome5 name="comments-dollar" size={20} color="black" />
          ),
        }}
      />
      {/* End of added code by Parineeta Gedam on 26-05-2023 */}
      {/* End of modified code by :- Parineeta Gedam on 16-06-2023 */}


      {/* Added by Yuvraj Sahu on 01-05-2023
      Reason - to show customer list navigation */}
      <Drawer.Screen
        name="CustomerListScreen"
        component={CustomerListScreen}
        options={{
          drawerLabel: "All Customers",
          title: "All Customers",
          drawerIcon: (config) => (
            <FontAwesome name="users" size={20} color="black" />
          ),
        }}
      />
      {/* End of addition by Yuvraj Sahu on 01-05-2023 */}

      {/* Added by Om on 26-04-23
      Reason : Add new tab for QR code */}
      <Drawer.Screen
        name="PrintQRScreen"
        component={PrintQRScreen}
        options={{
          drawerLabel: "Print QR",
          title: "Print QR",
          // Added by Yuvraj Sahu on 16-4-2023
          // Reason - to add icon in drawer
          drawerIcon: (config) => (
            <MaterialIcons name="local-print-shop" size={24} color="black" />
          ),
          // end of addition
        }}
      />
      {/* End of addition */}

      {/* Added by Yuvraj Sahu on 27-4-2023
        Reason - to define route for navigation on payment method */}
      <Drawer.Screen
        name="PaymentMethod"
        component={PaymentMethod}
        options={{
          drawerLabel: "Payment Method",
          title: "Payment Method",
          drawerIcon: (config) => (
            <Icon name="upload" size={20} color="black" />
          ),
        }}
      />
      {/* End of adding payment method */}

      {/* Added by Yuvraj Sahu on 27-05-2023
        Reason - to define route for navigation on social media link */}
      <Drawer.Screen
        name="SocialMediaNavigation"
        component={SocialMediaNavigation}
        options={{
          drawerLabel: "Social Media Screen",
          title: "Social Link Screen",
          drawerIcon: (config) => (
            <Feather name="external-link" size={20} color="black" />
          ),
        }}
      />
      {/* End of adding social media link */}

      {/* End of addition */}
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
