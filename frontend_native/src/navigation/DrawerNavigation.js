import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Home from "../screens/Home";
import Category from "../screens/Category";
import List from "../screens/List";
import QrCode from "../screens/QrCode";
import Offer from "../screens/Offer";
import PreviewMenu from "../screens/PreviewMenu";
import { colors } from "../Colours/globalColor";
import Theme from "../screens/Theme";

// create custom drawer for logout ----------------------------
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Logout" onPress={() => alert("going to log out")} />
    </DrawerContentScrollView>
  );
}
// End of custom drawer ---------------------------------------

export default function DrawerNavigation() {
  const Drawer = createDrawerNavigator();

  return (
    // <SafeAreaView style={{ flex: 1 }}>
    <Drawer.Navigator
      useLegacyImplementation
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerLabel: "Home",
          headerStyle: {
            backgroundColor: colors.backgroundTheme,
          },
        }}
      />
      <Drawer.Screen
        name="Add"
        component={Category}
        options={{ drawerLabel: "Add" }}
      />
      <Drawer.Screen
        name="Menu List"
        component={List}
        options={{
          drawerLabel: "Menu List",
          headerStyle: {
            backgroundColor: colors.backgroundTheme,
          },
        }}
      />
      <Drawer.Screen
        name="Preview Preview"
        component={PreviewMenu}
        options={{ drawerLabel: "Preview Menu" }}
      />
      <Drawer.Screen
        name="Generate QR Code"
        component={QrCode}
        options={{ drawerLabel: "Generate QR Code" }}
      />
      {/* <Drawer.Screen
          name="Add Items"
          component={AddItems}
          options={{ drawerLabel: "Add New Item" }}
        /> */}
      <Drawer.Screen
        name="Offers"
        component={Offer}
        options={{ drawerLabel: "All offers" }}
      />
      <Drawer.Screen
        name="Theme"
        component={Theme}
        options={{ drawerLabel: "Theme" }}
      />
    </Drawer.Navigator>
    // </SafeAreaView>
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
