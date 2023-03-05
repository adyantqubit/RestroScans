// Created by Yuvraj Sahu on 24-2-2023
// Reason - it is created for restaurant after restaurant login
import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  Button,
} from "react-native";
import * as SecureStore from "expo-secure-store";

export default function Home({ navigation }) {
  var logOut = async () => {
    await SecureStore.deleteItemAsync("userData");
    await SecureStore.deleteItemAsync("token");
    // alert(JSON.stringify(SecureStore.deleteItemAsync("userData")))
    // navigation.navigate("main")
    alert(await SecureStore.getItemAsync("userData"));
    if (await SecureStore.getItemAsync("userData") == null) {
      // navigation.navigate("registration");
      navigation.push("login");
    }
  };

  return (
    <SafeAreaView>
      <Text>Home screen</Text>
      <Button title="logout" onPress={logOut} />
      <Image
        source={{
          // uri: 'https://media-cdn.tripadvisor.com/media/photo-s/19/77/44/d8/beautiful-interiors.jpg',
          uri: "https://cdn4.vectorstock.com/i/1000x1000/30/38/scan-for-menu-and-order-qr-code-icon-vector-41643038.jpg",
        }}
        // style={{ width: 100, height: 100, marginLeft: 5 }}
        style={styles.restaurantImg}
      />
    </SafeAreaView>
  );
}

// This is for designing --------------------------------------
const styles = StyleSheet.create({
  restaurantImg: {
    alignSelf: "center",
    width: "80%",
    height: "50%",
    // borderBottomLeftRadius: 10,
    borderRadius: 10,
  },
});
