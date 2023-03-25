// Created by Yuvraj Sahu on 24-2-2023
// Reason - it is created for restaurant after restaurant login
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  Pressable,
  BackHandler,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import RNExitApp from "react-native-exit-app";
import config, { setTenant, tenantName } from "../config/config";
import { colors, fonts } from "../Colours/globalColor";
import { useNavigation } from "@react-navigation/native";
// import '../Colours/GlobalColor.css';

export default function HomeScreen({ navigation }) {
  var [userData, setUserData] = useState([]);
  var navigator = useNavigation();
  useEffect(() => {
    authNavigate();
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (
        navigator.getState().routes[navigator.getState().index].name ==
        "HomeScreen"
      ) {
        Alert.alert("Hold on!", "Are you sure you want to Exit?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "YES",
            onPress: () => {
              BackHandler.exitApp();
            },
          },
        ]);
        return true;
      }
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const authNavigate = async () => {
    if ((await SecureStore.getItemAsync("userData")) == null) {
      navigation.navigate("LoginScreen");
    }
    if ((await SecureStore.getItemAsync("userData")) != null) {
      setUserData(JSON.parse(await SecureStore.getItemAsync("userData")));
    }
  };

  // Added by Yuvraj Sahu on 11-3-2023
  // Reason - to get user detail from securestore

  // Modified by Yuvraj Sahu on 11-3-2023
  // Reason - to remove logout button
  var logOut = async () => {
    await SecureStore.deleteItemAsync("userData");
    await SecureStore.deleteItemAsync("token");
    if ((await SecureStore.getItemAsync("userData")) == null) {
      navigation.navigate("LoginScreen");
    }
  };

  return (
    <SafeAreaView>
      {/* Added and modified by Yuvraj Sahu on 11-3-2023
      Reason - to map data and design page */}
      <View style={styles.homeContainer}>
        <View style={styles.restaurantImgContainer}>
          <Image
            source={{
              uri: config.imageUrl + userData.restaurant_logo,
            }}
            style={styles.restaurantImg}
          />
        </View>
        <View style={styles.restaurantDetail}>
          <Text style={styles.restaurantLable}>{userData.restaurant_name}</Text>
          <Text style={styles.restaurantHeadline}>Ashoka Biryani</Text>
        </View>
        <View style={styles.previewBtn}>
          <Pressable onPress={logOut} style={styles.pressableBtn}>
            <Text style={styles.btnText}>Logout</Text>
          </Pressable>
        </View>
      </View>
      {/* End of modification */}
    </SafeAreaView>
  );
}

// This is for designing --------------------------------------
const styles = StyleSheet.create({
  restaurantImgContainer: {
    alignSelf: "center",
    width: "80%",
    height: "40%",
  },
  // Added by Yuvraj Sahu on 11-3-2023
  // Reason - to design page
  homeContainer: {
    alignItems: "center",
    margin: "auto",
    height: "100%",
    display: "flex",
    justifyContent: "space-around",
  },
  restaurantImg: {
    height: "90%",
  },
  restaurantDetail: {
    alignSelf: "center",
    alignItems: "center",
  },
  restaurantLable: {
    fontSize: fonts.title1,
  },
  restaurantHeadline: {
    fontSize: 15,
  },
  previewBtn: {
    width: "80%",
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 10,
  },
  pressableBtn: {
    backgroundColor: colors.btnColor,
    padding: "5%",
    borderRadius: 10,
  },
  btnText: {
    textTransform: "uppercase",
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 18,
  },
  // End of designing
});
