// Added by Yuvraj Sahu on 16-2-2023
// Reason - to show main screen when app will start

import React from "react";
import {
  View,
  StyleSheet,
  Button,
  SafeAreaView,
} from "react-native";

export default function MainScreen({ navigation }) {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{ margin: 10, width: "80%" }}>
          <Button
            onPress={() => navigation.navigate("login")}
            title="Login"
            style={{backgroundColor:'#841584'}}
          ></Button>
        </View>

        <View style={{ margin: 10, width: "80%" }}>
          <Button
            onPress={() => navigation.navigate("registration")}
            title="Registration"
            style={{backgroundColor:'#841584'}}
          ></Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },});
