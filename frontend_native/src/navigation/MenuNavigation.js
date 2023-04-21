// Created by Yuvraj Sahu on 21-4-2023
// Reason - menu, category and item navigation

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "../Colours/globalColor";
import CategoryListScreen from "../screens/menu/CategoryListScreen";
import ItemListScreen from "../screens/menu/ItemListScreen";
import EditItemScreen from "../screens/menu/EditItemScreen";
import MenuListScreen from "../screens/menu/MenuListScreen";

const MenuNavigation = () => {
  const Stack = createNativeStackNavigator();

  return (
    <>
      <Stack.Navigator
        initialRouteName="MenuListScreen"
        screenOptions={() => ({
          headerShown: true,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          //   headerTitleAlign: "center",
          //   headerMode: "screen",
          headerStyle: { backgroundColor: "#fff" },
        })}
      >
        <Stack.Screen
          name="MenuListScreen"
          options={{ title: "Menu List", headerShown: false }}
          component={MenuListScreen}
        />

        <Stack.Screen
          name="CategoryListScreen"
          options={{ title: "Menu Detail" }}
          component={CategoryListScreen}
        />

        <Stack.Screen
          name="ItemListScreen"
          options={{ title: "Category Detail" }}
          component={ItemListScreen}
        />

        <Stack.Screen
          name="ItemEditScreen"
          options={{ title: "Item Detail" }}
          component={EditItemScreen}
        />
      </Stack.Navigator>
    </>
  );
};

export default MenuNavigation;
