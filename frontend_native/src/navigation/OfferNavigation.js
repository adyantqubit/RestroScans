// Created by Yuvraj Sahu on 21-4-2023
// Reason - to define routes for offer, offerItems and offer item detail

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { colors } from "../Colours/globalColor";
import OfferItemsScreen from "../screens/offer/OfferItemsScreen";

import OfferScreen from "../screens/offer/OfferScreen";
import { CommonActions, useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";

// Modified by yuvraj Sahu on 11-06-2023
// Reason - to clear the validation
const OfferNavigation = ({ navigation }) => {
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
        routes: [{ name: "OfferScreen" }],
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
        initialRouteName="OfferScreen"
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
          name="OfferScreen"
          options={{ title: "Banner/Offer", headerShown: false }}
          component={OfferScreen}
        />

        <Stack.Screen
          name="OfferItemsScreen"
          options={{ title: "Banner/Offer details", headerShown: true }}
          component={OfferItemsScreen}
        />
      </Stack.Navigator>
    </>
  );
};

export default OfferNavigation;
