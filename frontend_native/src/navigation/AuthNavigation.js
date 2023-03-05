// Added by Yuvraj Sahu on 16-2-2023
// Reason - to navigate login and registration

import { NavigationContainer } from "@react-navigation/native";
import RegistrationRegistrationScreen from "../screens/RestaurantRegistrationScreen";

import React, { createContext, useState, useEffect } from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MainScreen from "../screens/MainScreen";
import LoginScreen from "../screens/LoginScreen";
import { useSelector, useDispatch } from "react-redux";
import DrawerNavigation from "../navigation/DrawerNavigation";
import Home from "../screens/Home";
import ForgetPasswordScreen from "../screens/ForgetPasswordScreen";
import StackNavigation from "./StackNavigation";
import * as SecureStore from "expo-secure-store";

import Category from "../screens/Category";
import List from "../screens/List";
import QrCode from "../screens/QrCode";
import Offer from "../screens/Offer";
import PreviewMenu from "../screens/PreviewMenu";
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const AuthNavigation = () => {
  const { userToken, isLoading } = useSelector((state) => state.authUser);

  // Added by Yuvraj Sahu 18-2-2023
  //Reason - to send actions into our redux store
  const dispatch = useDispatch();

  var [isTokenExist, setIsTokenExist] = useState(false);

  useEffect(() => {
    checkUserauth();
  }, []);

  const checkUserauth = async () => {
    if (await SecureStore.getItemAsync("userData")) {
      setIsTokenExist(true);
    }
    if ((await SecureStore.getItemAsync("userData")) == null) {
      setIsTokenExist(false);
    }
    // alert("ss" + isTokenExist);
  };

  

  return (
    <>
      {/* <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen
            name="Home"
            component={Home}
            options={{ drawerLabel: "Home" }}
          />
          {SecureStore.getItemAsync("userData") && (
            <Drawer.Screen
              name="main"
              component={MainScreen}
              options={{ drawerLabel: "Main" }}
            />
          )}
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
        </Drawer.Navigator>
      </NavigationContainer> */}

      {isTokenExist ? <DrawerNavigation /> : <StackNavigation />}
    </>
  );
};

export default AuthNavigation;
