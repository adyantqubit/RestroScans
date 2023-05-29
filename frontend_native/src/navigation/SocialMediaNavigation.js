// Created by Yuvraj Sahu on 28-4-2023
// Reason - social media navigation

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "../Colours/globalColor";
import SocialLinkScreen from "../screens/socialMedia/SocialLinkScreen";
import EditSocialMediaForm from "../screens/socialMedia/EditSocialMediaForm";

const SocialMediaNavigation = () => {
  const Stack = createNativeStackNavigator();

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
