// Created by Yuvraj Sahu on 24-3-2023
// Reason - to design tabs for adding menu. categpory and item

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
// import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import AddMenuScreen from "../screens/menu/AddMenuScreen";
import AddCategoryScreen from "../screens/menu/AddCategoryScreen";
import AddItemScreen from "../screens/menu/AddItemScreen";
const Tab = createMaterialTopTabNavigator();

export function AddMenuNavigation() {
  return (
    <Tab.Navigator initialRouteName="Menu">
      <Tab.Screen name="Add Menu" component={AddMenuScreen} />
      <Tab.Screen name="Add Category" component={AddCategoryScreen} />
      <Tab.Screen name="Add Item" component={AddItemScreen} />
    </Tab.Navigator>
  );
}
