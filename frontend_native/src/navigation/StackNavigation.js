// Added by Yuvraj Sahu on 16-2-2023
// Reason - to navigate login and registration

import { NavigationContainer } from "@react-navigation/native";
import RegistrationRegistrationScreen from "../screens/RestaurantRegistrationScreen";

import React, { createContext, useState, useEffect } from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainScreen from "../screens/MainScreen";
import LoginScreen from "../screens/LoginScreen";
import { useSelector, useDispatch } from "react-redux";
import DrawerNavigation from "../navigation/DrawerNavigation";
import Home from "../screens/Home";
import ForgetPasswordScreen from "../screens/ForgetPasswordScreen";
import AuthNavigation from "./AuthNavigation";

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  const { userToken, isLoading } = useSelector((state) => state.authUser);

  // Added by Yuvraj Sahu 18-2-2023
  //Reason - to send actions into our redux store
  const dispatch = useDispatch();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="main"
        screenOptions={() => ({
          headerShown: true,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitleAlign: "center",
          headerMode: "screen",
          // headerTintColor: "white",
          headerStyle: { backgroundColor: "#fff" },
        })}
      >
        <Stack.Screen
          name="main"
          component={MainScreen}
          options={{
            title: "Welcome To My App",
            headerShown: false,
          }}
        ></Stack.Screen>

        <Stack.Screen
          name="authNavigation"
          component={AuthNavigation}
          options={{
            title: "My app",
            headerShown: false,
          }}
        ></Stack.Screen>

        <Stack.Screen
          name="login"
          options={{ title: "Login" }}
          component={LoginScreen}
          style={{ backgroundColor: "#841584" }}
        ></Stack.Screen>

        <Stack.Screen
          name="registration"
          options={{ title: "Registration" }}
          component={RegistrationRegistrationScreen}
        ></Stack.Screen>

        {/* Added by Yuvraj Sahu on 19-2-2023
            Reason - to navigate drawer after login
                     it will be changed after upload server
             */}
        <Stack.Screen
          name="home"
          options={{ title: "Welcome" }}
          component={Home}
        ></Stack.Screen>

        {/* <Stack.Screen
          name="drawer"
          options={{ title: "Welcome" }}
          component={DrawerNavigation}
        ></Stack.Screen> */}
        {/* End of navigating drawer  */}

        <Stack.Screen
          name="forgotPassword"
          options={{ title: "Forgot Password" }}
          component={ForgetPasswordScreen}
        ></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
