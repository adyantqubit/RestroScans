// Added by Yuvraj Sahu on 16-2-2023
// Reason - to navigate login and registration

import { NavigationContainer } from "@react-navigation/native";
import RestaurantRegistrationScreen from "../screens/RestaurantRegistrationScreen";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import LoginScreen from "../screens/LoginScreen";
import DrawerNavigation from "../navigation/DrawerNavigation";
import SplashScreen from "../screens/SplashScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import { colors } from "../Colours/globalColor";
import CategoryListScreen from "../screens/CategoryListScreen";
import ItemListScreen from "../screens/ItemListScreen";
import EditItemScreen from "../screens/EditItemScreen";

const AuthNavigation = () => {
  const Stack = createNativeStackNavigator();
  const Drawer = createDrawerNavigator();
  // Added by Yuvraj Sahu 18-2-2023
  //Reason - to send actions into our redux store

  // var [isTokenExist, setIsTokenExist] = useState(false);

  // useEffect(() => {
  //   checkUserauth();
  // }, []);

  // const checkUserauth = async () => {
  //   if (await SecureStore.getItemAsync("userData")) {
  //     setIsTokenExist(true);
  //   }
  //   if ((await SecureStore.getItemAsync("userData")) == null) {
  //     setIsTokenExist(false);
  //   }
  // };

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={() => ({
            headerShown: true,
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerTitleAlign: "center",
            headerMode: "screen",
            headerStyle: { backgroundColor: "#fff" },
          })}
        >
          <Stack.Screen
            name="SplashScreen"
            options={{
              title: "Welcome",
              headerBackVisible: false,
              headerShown: false,
            }}
            component={SplashScreen}
            style={{ backgroundColor: "#841584" }}
          ></Stack.Screen>

          <Stack.Screen
            name="LoginScreen"
            options={{ title: "Login", headerBackVisible: false }}
            component={LoginScreen}
            style={{ backgroundColor: colors.btnColor }}
          ></Stack.Screen>

          <Stack.Screen
            name="RegistrationScreen"
            options={{ title: "Registration" }}
            component={RestaurantRegistrationScreen}
          ></Stack.Screen>

          <Stack.Screen
            name="ForgotPasswordScreen"
            options={{ title: "Forgot Password" }}
            component={ForgotPasswordScreen}
          ></Stack.Screen>

          <Stack.Screen
            name="DrawerScreens"
            options={{ title: "Welcome", headerShown: false }}
            component={DrawerNavigation}
          ></Stack.Screen>

          {/* Added by Yuvraj Sahu on 3-4-2023
          Reason - to navigate category list screen */}
          <Stack.Screen
            name="CategoryListScreen"
            options={{ title: "Menu Detail" }}
            component={CategoryListScreen}
          ></Stack.Screen>
          {/* End of addition */}

          {/* Added by Yuvraj Sahu on 3-4-2023
          Reason - to navigate item list screen */}
          <Stack.Screen
            name="ItemListScreen"
            options={{ title: "Category Detail" }}
            component={ItemListScreen}
          ></Stack.Screen>
          {/* End of addition */}

          {/* Added by Yuvraj Sahu on 5-4-2023
          Reason - to navigate edit item screen */}
          <Stack.Screen
            name="ItemEditScreen"
            options={{ title: "Item Detail" }}
            component={EditItemScreen}
          ></Stack.Screen>
          {/* End of addition */}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default AuthNavigation;
