// Created by :-  Parineeta Gedam on 26-05-2023
// Reason - to desigin and functionality of Reservation navigations

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "../Colours/globalColor";
import ReaservationForm from "../components/reservation/ReaservationForm";
import ReservationList from "../components/reservation/ReservationList";

const ReservationNavigation = () => {
  const Stack = createNativeStackNavigator();

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

        <Stack.Screen
          name="ReaservationForm"
          options={{ title: "ReaservationForm", headerBackVisible: true }}
          component={ReaservationForm}
        />
      </Stack.Navigator>
    </>
  );
};

export default ReservationNavigation;
