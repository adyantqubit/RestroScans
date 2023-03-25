// Created by Yuvraj Sahu on 24-2-2023
// Reason - it is created for restaurant after restaurant login
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  Button,
  Pressable,
  StatusBar,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import RNExitApp from "react-native-exit-app";
import config, { getTenant, setTenant } from "../config/config";
import { colors, fonts } from "../Colours/globalColor";
// import { getTenantApi } from "../api/Services";
// import '../Colours/GlobalColor.css';

export default function Home({ navigation }) {
  var [userData, setUserData] = useState([]);

  useEffect(() => {
    authNavigate();
    // getTenant()
  }, []);

  const authNavigate = async () => {
    if ((await SecureStore.getItemAsync("userData")) == null) {
      navigation.push("login");
    }
    if ((await SecureStore.getItemAsync("userData")) != null) {
      setUserData(JSON.parse(await SecureStore.getItemAsync("userData")));
      // alert(tenantName)
    }
  };
  // alert('aaaaaaaaaa'+userData.restaurant_name)
  // tenantName = userData.restaurant_name


  // Added by Yuvraj Sahu on 11-3-2023
  // Reason - to get user detail from securestore

  // Modified by Yuvraj Sahu on 11-3-2023
  // Reason - to remove logout button
  var logOut = async () => {
    await SecureStore.deleteItemAsync("userData");
    await SecureStore.deleteItemAsync("token");
    // alert(await SecureStore.getItemAsync("userData"));
    if ((await SecureStore.getItemAsync("userData")) == null) {
      // navigation.navigate("login");
      navigation.push("login");
    }
  };


  return (
    <SafeAreaView>
      {/* <StatusBar backgroundColor='blue' /> */}
      {/* Added and modified by Yuvraj Sahu on 11-3-2023
      Reason - to map data and design page */}
      <View style={styles.homeContainer}>
        {/* <Text>Home screen</Text> */}
        {/* <Button title="logout" onPress={logOut} /> */}
        <View style={styles.restaurantImgContainer}>
          <Image
            source={{
              uri: config.imageUrl + userData.restaurant_logo,
              // uri: "https://cdn4.vectorstock.com/i/1000x1000/30/38/scan-for-menu-and-order-qr-code-icon-vector-41643038.jpg",
            }}
            style={styles.restaurantImg}
          />
        </View>
        <View style={styles.restaurantDetail}>
          <Text style={styles.restaurantLable}>{userData.restaurant_name}</Text>
          <Text style={styles.restaurantHeadline}>Ashoka Biryani</Text>
        </View>
        <View style={styles.previewBtn}>
          {/* <Button title="Preview Menu" onPress={logOut}/> */}
          <Pressable
            onPress={logOut}
            // style={{ backgroundColor: "blue", padding: "5%", borderRadius: 10 }}
            style={styles.pressableBtn}
          >
            <Text
              //   style={{
              //     // textShadowOffset: { width: 10, height: 10 },
              //     textTransform: 'uppercase',
              //     fontWeight: 'bold',
              //     textAlign: 'center',
              //     color: '#FFFFFF',
              //     fontSize: 18,
              // }}
              style={styles.btnText}
            >
              Logout
            </Text>
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
    // backgroundColor: "green",
    // borderBottomLeftRadius: 10,
    // borderRadius: 10,
  },
  // Added by Yuvraj Sahu on 11-3-2023
  // Reason - to design page
  homeContainer: {
    backgroundColor: colors.backgroundTheme,
    // alignSelf: 'center',
    alignItems: "center",
    // marginTop: '10%'
    margin: "auto",
    height: "100%",
    display: "flex",
    justifyContent: "space-around",
  },
  restaurantImg: {
    height: "90%",
    // top: 10,
  },
  restaurantDetail: {
    alignSelf: "center",
    alignItems: "center",
    // top: 30,
  },
  restaurantLable: {
    // fontSize: 22,
    fontSize: fonts.title1,
  },
  restaurantHeadline: {
    fontSize: 15,
    // top: 10,
  },
  previewBtn: {
    width: "80%",
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 10,
    // top: 300,
  },
  pressableBtn: {
    // backgroundColor: "#8be98c",
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
