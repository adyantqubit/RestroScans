// Created by :-  Parineeta Gedam on 26-05-2023
// Reason - to desigin and functionality of Reservation navigations

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "../Colours/globalColor";
import ReaservationForm from "../components/reservation/ReaservationForm";
import ReservationList from "../components/reservation/ReservationList";
import { CommonActions, useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";

// Modified by yuvraj Sahu on 11-06-2023
// Reason - to clear the validation
const ReservationNavigation = ({ navigation }) => {
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
        routes: [{ name: "ReservationListScreen" }],
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
        initialRouteName="ReservationListScreen"
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
          name="ReservationListScreen"
          options={{ title: "ReservationList", headerShown: false }}
          component={ReservationList}
        />
       {/* Modified by :- Parineeta Gedam on 16-06-2023 */}
        <Stack.Screen
          name="ReaservationForm"
          options={{ title: "Table Reservation Form", headerBackVisible: true }}
          component={ReaservationForm}
        />
        {/* End of modified code by :- Parineeta Gedam on 16-06-2023 */}
      </Stack.Navigator>
    </>
  );
};

export default ReservationNavigation;
