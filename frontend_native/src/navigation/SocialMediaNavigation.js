// Created by Yuvraj Sahu on 28-4-2023
// Reason - social media navigation

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "../Colours/globalColor";
import SocialLinkScreen from "../screens/socialMedia/SocialLinkScreen";
import EditSocialMediaForm from "../screens/socialMedia/EditSocialMediaForm";
import { CommonActions, useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";

// Modified by yuvraj Sahu on 11-06-2023
// Reason - to clear the validation
const SocialMediaNavigation = ({ navigation }) => {
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
        routes: [{ name: "SocialLinkScreen" }],
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
        initialRouteName="SocialLinkScreen"
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
          name="SocialLinkScreen"
          options={{ title: "Social Link", headerShown: false }}
          component={SocialLinkScreen}
        />

        <Stack.Screen
          name="EditSocialMediaFormScreen"
          options={{ title: "Edit Social Media" }}
          component={EditSocialMediaForm}
        />
      </Stack.Navigator>
    </>
  );
};

export default SocialMediaNavigation;
