// Created by Om on 08-04-2023
// Reason - to design tabs for banner and category

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AddOfferScreen from "../screens/offer/AddOfferScreen";
import AddOfferItemScreen from "../screens/offer/AddOfferItemScreen";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
const Tab = createMaterialTopTabNavigator();

export function AddOfferNavigation({ navigation }) {
  /**
   * Added by Yuvraj Sahu on 18-06-2023
   * Reason - to render the screen
   */
  const isFocused = useIsFocused();
  /**
   * End of addition by Yuvraj Sahu on 18-06-2023
   */

  /**
   * Added by Yuvraj Sahu on 18-06-2023
   * Reason - to clear the navigation when
   * come back to same drawer screen
   */
  useEffect(() => {
    if (isFocused == true) {
      navigation.navigate("Banner/Offer");
    }
  }, [isFocused]);
  /**
   * End of addition by Yuvraj Sahu on 18-06-2023
   */

  return (
    <Tab.Navigator>
      <Tab.Screen name="Banner/Offer" component={AddOfferScreen} />
      <Tab.Screen name="Banner/Offer-items" component={AddOfferItemScreen} />
    </Tab.Navigator>
  );
}
