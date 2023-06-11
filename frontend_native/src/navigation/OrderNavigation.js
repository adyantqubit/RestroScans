// Created by Yuvraj Sahu on 21-4-2023
// Reason - order navigation

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "../Colours/globalColor";
import OrderItemsScreen from "../screens/order/OrderItemsScreen";
import OrderListScreen from "../screens/order/OrderListScreen";
import { CommonActions, useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";

// Modified by yuvraj Sahu on 11-06-2023
// Reason - to clear the validation
const OrderNavigation = ({ navigation }) => {
  // End of addition by yuvraj Sahu on 11-06-2023

  const Stack = createNativeStackNavigator();

  /**
   * Added by Yuvraj Sahu on 11-06-2023
   * Reason - to render the screen
   */
  const isFocused = useIsFocused();
  /**
   * End of addition by Yuvraj Sahu on 11-06-2023
   */

  /**
   * Added by Yuvraj Sahu on 11-06-2023
   * Reason - to clear the navigation when
   * come back to same drawer screen
   */
  useEffect(() => {
    // if (isFocused == false) {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "OrdersScreen" }],
      })
    );
    // }
  }, [isFocused]);
  /**
   * End of clearing navigation by Yuvraj Sahu on 11-06-2023
   */

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
