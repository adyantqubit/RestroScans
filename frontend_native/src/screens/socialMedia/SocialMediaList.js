// Created by Yuvraj Sahu on 28-05-2023
// Reason - to show all social media and delete the social media

import { View, Text, Alert, Image, Pressable, StyleSheet } from "react-native";
import React from "react";
import * as SecureStore from "expo-secure-store";
import { deteleSocialMediaApi, getSocialMediaApi } from "../../api/Services";
import { useState } from "react";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import config from "../../config/config";

export default function SocialMediaList({ navigation }) {
  const isFocused = useIsFocused();

  var [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    getSocialLinks();
  }, [isFocused]);

  const getSocialLinks = async () => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    var response = await getSocialMediaApi(tenant);
    if (response.msg) {
      setSocialLinks(response.social);
    }
  };

  const deleteSocialLink = async (socialLinkID) => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;

    deteleSocialMediaApi(tenant, socialLinkID).then((response) => {
      if (response.msg) {
        Alert.alert(response.msg);
        // navigation.pop();
        setSocialLinks(response.socialData);
      }
      if (response.error) {
        Alert.alert("Error", response.error);
      }
    });
  };

  function deletePermission(socialLinkID) {
    Alert.alert("Confirmation", "Are you sure you want to delete this social media?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          deleteSocialLink(socialLinkID);
        },
      },
    ]);
  }

  const handleNavigation = async (socialID, socialObject) => {
    // navigation.navigate("EditSocialMediaFormScreen", {
    //     socialID: socialID,
    //     SocialMediaObj: socialObject,
    // });
    navigation.navigate("EditSocialMediaFormScreen");
  };

  return (
    <View>
      {/* <Text>SocialMediaList</Text>
      <Text style={styles.categoryLable}>Saved all social media</Text> */}
      <View style={styles.categoryContainer}>
        {socialLinks.length > 0 ? (
          <>
            {socialLinks.map((socialLink, id) => (
              <Pressable
                key={id}
                style={styles.categoryListContainer}
                onPress={(e) => handleNavigation(socialLink.id, socialLink)}
              >
                <Image
                  source={{
                    uri: config.staticBaseURL + socialLink.social_media_icon,
                  }}
                  style={styles.menuIcon}
                />
                <Text>{socialLink.social_media_name}</Text>
                <Pressable onPress={(e) => deletePermission(socialLink.id)}>
                  <MaterialIcons name="delete" size={24} color="red" />
                </Pressable>
              </Pressable>
            ))}
          </>
        ) : (
          <View
            style={{
              height: 200,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <Text>No items are listed here</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    backgroundColor: "#ffebcc",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
  },

  categoryLable: {
    fontSize: 18,
    fontWeight: "bold",
  },

  categoryListContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: "100%",
    shadowColor: "#171717",
    shadowOffset: { width: -3, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  menuIcon: {
    height: 30,
    width: 30,
    borderRadius: 5,
  },
});
