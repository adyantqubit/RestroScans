import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Home from "../screens/Home";
import Category from "../screens/Category";
import List from "../screens/List";
import QrCode from "../screens/QrCode";
import Offer from "../screens/Offer";
import PreviewMenu from "../screens/PreviewMenu";

export default function DrawerNavigation() {

  const Drawer = createDrawerNavigator();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen
            name="Home"
            component={Home}
            options={{ drawerLabel: "Home" }}
          />
          <Drawer.Screen
            name="Add"
            component={Category}
            options={{ drawerLabel: "Add" }}
          />
          <Drawer.Screen
            name="Menu List"
            component={List}
            options={{ drawerLabel: "Menu List" }}
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
        </Drawer.Navigator>
      </NavigationContainer>
    </SafeAreaView>
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