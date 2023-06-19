// Created by Yuvraj Sahu on 24-3-2023
// Reason - to design tabs for adding menu. categpory and item

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
// import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import AddMenuScreen from "../screens/menu/AddMenuScreen";
import AddCategoryScreen from "../screens/menu/AddCategoryScreen";
import AddItemScreen from "../screens/menu/AddItemScreen";
// import { CommonActions } from "@react-navigation/native";

const Tab = createMaterialTopTabNavigator();

export function AddMenuNavigation({ navigation }) {
  /**
   * Added by Yuvraj Sahu on 11-06-2023
   * Reason - to render the screen
   */
  const isFocused = useIsFocused();
  /**
   * End of addition by Yuvraj Sahu on 11-06-2023
   */

  /**
   * Added by Yuvraj Sahu on 18-06-2023
   * Reason - to clear the navigation when
   * come back to same drawer screen
   */
  useEffect(() => {
    if (isFocused == true) {
      // navigation.dispatch(
      //   CommonActions.reset({
      //     index: 0,
      //     routes: [{ name: "AddMenu" }],
      //   })
      // );
      navigation.navigate("AddMenu");
    }

    // const unsubscribe = navigation.addListener('blur', () => {
    //   // Prevent default behavior
    //   // e.preventDefault();

    //   // Do something manually
    //   // ...
    //   navigation.navigate("AddMenu")
    // });
    // return unsubscribe;
  }, [isFocused]);
  
  /**
   * End of clearing navigation by Yuvraj Sahu on 11-06-2023
   */
  /**
   * End of modification by Yuvraj Sahu on 18-06-2023
   */

  return (
    <Tab.Navigator initialRouteName="AddMenu">
      {/* Modified by Yuvraj Sahu on 11-06-2023
      Reason - to change navigation */}
      <Tab.Screen
        name="AddMenu"
        options={{ title: "Add Menu" }}
        component={AddMenuScreen}
      />
      {/* End of modification by Yuvraj Sahu on 11-06-2023 */}
      <Tab.Screen name="Add Category" component={AddCategoryScreen} />
      <Tab.Screen name="Add Item" component={AddItemScreen} />
    </Tab.Navigator>
  );
}
