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
import { MenuAddScreen } from "../screens/MenuAddScreen";
// import { getTenantApi } from "../api/Services";
import * as SecureStore from "expo-secure-store";

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
            backgroundColor: colors.backgroundTheme,
          },
        }}
      />
      <Drawer.Screen
        name="Add"
        component={MenuAddScreen}
        options={{ drawerLabel: "Add Menu Item", title: "Add Menu Item" }}
      />
      <Drawer.Screen
        name="PreviewMenuScreen"
        component={PreviewMenuScreen}
        options={{ drawerLabel: "Preview Menu", title: "Preview Menu" }}
      />
      <Drawer.Screen
        name="QRCodeScreen"
        component={QRCodeScreen}
        options={{ drawerLabel: "Generate QR Code", title: "Generate QR Code" }}
      />

      <Drawer.Screen
        name="OfferScreen"
        component={OfferScreen}
        options={{ drawerLabel: "Offers", title: "Offers" }}
      />
      <Drawer.Screen
        name="MenuThemeScreen"
        component={MenuThemeScreen}
        options={{ drawerLabel: "Theme", title: "Theme" }}
      />
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
