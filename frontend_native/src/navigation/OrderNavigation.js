// Created by Yuvraj Sahu on 21-4-2023
// Reason - order navigation

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "../Colours/globalColor";
import OrderItemsScreen from "../screens/order/OrderItemsScreen";
import OrderListScreen from "../screens/order/OrderListScreen";

const OrderNavigation = () => {
  const Stack = createNativeStackNavigator();

  return (
    <>
      <Stack.Navigator
        initialRouteName="OrdersScreen"
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
          name="OrdersScreen"
          options={{ title: "All Orders", headerShown: false }}
          component={OrderListScreen}
        />

        <Stack.Screen
          name="OrderItemsScreen"
          options={{ title: "Order details", headerBackVisible: true }}
          component={OrderItemsScreen}
        />
      </Stack.Navigator>
    </>
  );
};

export default OrderNavigation;
