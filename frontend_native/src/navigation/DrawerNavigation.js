import React from "react";
import { StyleSheet, ImageBackground } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../screens/HomeScreen";
import MenuListScreen from "../screens/MenuListScreen";
import QRCodeScreen from "../screens/QRCodeScreen";
import OfferScreen from "../screens/OfferScreen";
import PreviewMenuScreen from "../screens/PreviewMenuScreen";
import { colors } from "../Colours/globalColor";
import MenuThemeScreen from "../screens/MenuThemeScreen";
import { AddScreen } from "../screens/AddScreen";
import { AddBannerItemScreen } from "../screens/AddBannerItemScreen";

// import { getTenantApi } from "../api/Services";
import * as SecureStore from "expo-secure-store";
import SettingScreen from "../screens/SettingScreen";
import OrdersScreen from "../screens/OrdersScreen";

export default function DrawerNavigation() {
  const Drawer = createDrawerNavigator();

  React.useEffect(() => {
    getTenant();
  }, []);

  var getTenant = async () => {
    var userData = await SecureStore.getItemAsync("userData");
    // JSON.parse(userData).id
    // var response = await getTenantApi(JSON.parse(userData).id)
    // console.log('tenant drawer'+JSON.stringify(response))
  };

  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          drawerLabel: "Home",
          title: "Home",
          headerStyle: {},
        }}
      />

      <Drawer.Screen
        name="MenuListScreen"
        component={MenuListScreen}
        options={{
          drawerLabel: "Menu List",
          title: "Menu List",
          headerStyle: {
            // backgroundColor: colors.backgroundTheme,
          },
        }}
      />
      <Drawer.Screen
        name="Add"
        component={AddScreen}
        options={{ drawerLabel: "Add Menu Item", title: "Add Menu Item" }}
      />
      <Drawer.Screen
        name="PreviewMenuScreen"
        component={PreviewMenuScreen}
        options={{ drawerLabel: "Preview Menu", title: "Preview Menu" }}
      />
      {/* Commented by Yuvraj Sahu on 13-4-2023
      Reason - to remove QR code from drawer */}
      {/* <Drawer.Screen
        name="QRCodeScreen"
        component={QRCodeScreen}
        options={{ drawerLabel: "Generate QR Code", title: "Generate QR Code" }}
      />
{/* Added by Om on 08-04-23
      Reason : Show added banner list */}
      <Drawer.Screen
        name="Addbanners"
        component={AddBannerItemScreen}
        options={{ drawerLabel: "Add Banner/Items", title: "Add Banner/Items" }}
      />
      {/* End of addition */}
      <Drawer.Screen
        name="OfferScreen"
        component={OfferScreen}
        options={{ drawerLabel: "Banner/Items", title: "Banner/Items" }}
      />
      
      {/* <Drawer.Screen
        name="MenuThemeScreen"
        component={MenuThemeScreen}
        options={{ drawerLabel: "Themey", title: "Themey" }}
      /> */}
      {/* Added Yuvraj Sahu on 8-4-2023
      Reason - to define routing for setting screen */}
      <Drawer.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{ drawerLabel: "Setting", title: "Setting" }}
      />
      {/* End of addition */}
      {/* Added Yuvraj Sahu on 9-4-2023
      Reason - to define routing for order screen */}
      <Drawer.Screen
        name="OrdersScreen"
        component={OrdersScreen}
        options={{ drawerLabel: "All Orders", title: "All Orders" }}
      />
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
