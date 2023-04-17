// Added by Yuvraj Sahu on 16-2-2023
// Reason - to login restaurant

import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Pressable,
  BackHandler,
  ImageBackground,
  Image,
} from "react-native";

import { Formik } from "formik";
import * as SecureStore from "expo-secure-store";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getAppSetting, restaurentAuthentication } from "../api/Services";
import { loginSchema } from "../validation/ValidationSchema";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../Colours/globalColor";
import config from "../config/config";
import { AppStateContext } from "../context/AppStateProvider";

export default function LoginScreen({ navigation }) {
  const navigator = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  var [isBtnDisable, setIsBtnDisable] = useState(false);

  //Added by Yuvraj Sahu on 12-4-2023
  // Re render the page when data save
  var { render, setRender } = useContext(AppStateContext);
  useEffect(() => {}, [render]);
  // End of addition

  // Added by Yuvraj Sahu on 25-3-2023
  // Reason - to get adyant logo and show it background
  const [appSettings, setAppSettings] = useState("");
  useEffect(() => {
    getAppDetails();
  }, []);
  const getAppDetails = async () => {
    const response = await getAppSetting();
    setAppSettings(response);
  };

  //when user click login button this method is called
  const submitLog = (values, { resetForm }) => {
    setIsBtnDisable(true);
    restaurentAuthentication(values).then(async (res) => {
      if (res.token) {
        setIsBtnDisable(false);
        // Added by Yuvraj sahu on 12-4-2023
        // Reason - to delete previous data datas from securestorage
        await SecureStore.deleteItemAsync("userData");
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("tenantInfo");
        // End of addition
        // Added by Om shrivastava on 16-4-2023
        // Reason - to delete previous data datas from securestorage
        await SecureStore.deleteItemAsync("qrCodeTenant");
        // End of addition
        await SecureStore.setItemAsync("token", JSON.stringify(res.token));
        await SecureStore.setItemAsync(
          "userData",
          JSON.stringify(res.userData[0])
        );
        await SecureStore.setItemAsync(
          "tenantInfo",
          JSON.stringify(res.tenantInfo)
        );
        // Added by Om shrivastava on 16-4-2023
        // Reason - to set the QR code in securestorage
        await SecureStore.setItemAsync(
          "qrCodeTenant",
         res.qrCodeTenant
        );
        // End of addition
        navigation.navigate("DrawerScreens");
        Alert.alert("Sccess", "Loggedin Successfully");
        setRender(!render);
        resetForm({ values: "" });
      }
      if (res.error) {
        alert("Please wait for admin approval");
        setIsBtnDisable(false);
      }
      if (res.invalid) {
        alert("Invaild email and password");
        setIsBtnDisable(false);
      }
    });
  };

  const forgotPasswordHandler = () => {
    navigation.navigate("ForgotPasswordScreen");
  };

  const navRegister = () => {
    navigation.navigate("RegistrationScreen");
  };

  useEffect(() => {
    const backAction = () => {
      if (
        navigator.getState().routes[navigator.getState().index].name ==
        "LoginScreen"
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

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validateOnMount={true}
      validationSchema={loginSchema}
      onSubmit={submitLog}
      style={{ width: "100%", height: "100%" }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        touched,
        isValid,
        errors,
      }) => (
        // <ScrollView style={{height: "100%"}}>
        <ImageBackground
          source={{ uri: config.imageUrl + appSettings.app_logo }}
          resizeMode="cover"
          blurRadius={2}
          style={{ flex: 1, height: "100%" }}
        >
          <View style={styles.container}>
            <View style={{ marginTop: 30 }}>
              <View>
                <Text style={styles.labels}>
                  <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
                  Email
                </Text>

                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("email")}
                  // onBlur={handleBlur("email")}
                  value={values.email}
                  placeholderTextColor="#A4A4A4"
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {errors.email && touched.email && (
                  <Text style={styles.textdanger}>{errors.email}</Text>
                )}
              </View>

              <View>
                <Text style={styles.labels}>
                  <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
                  Password
                </Text>

                <View style={styles.passContainer}>
                  <TextInput
                    style={styles.inputPassword}
                    onChangeText={handleChange("password")}
                    // onBlur={handleBlur("password")}
                    value={values.password}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Enter your password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={!showPassword}
                  />

                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye" : "eye-off"}
                      size={24}
                      color="black"
                      style={styles.passIcon}
                    />
                  </TouchableOpacity>
                </View>

                {errors.password && touched.password && (
                  <Text style={styles.textdanger}>{errors.password}</Text>
                )}
              </View>

              <View style={{ width: "93%" }}>
                <Pressable
                  onPress={forgotPasswordHandler}
                  style={{ alignSelf: "flex-end" }}
                >
                  <Text style={{ color: "blue" }}>Forgot Password</Text>
                </Pressable>
              </View>

              <View
                style={{
                  marginBottom: 20,
                  marginHorizontal: 10,
                  marginTop: 10,
                }}
              >
                <Pressable
                  onPress={handleSubmit}
                  disabled={isBtnDisable}
                  style={{
                    backgroundColor: !isBtnDisable
                      ? colors.btnColor
                      : "#E0E0E0",
                    // height: 40,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 3,
                    padding: "3%",
                  }}
                >
                  <Text
                    style={{
                      color: !isBtnDisable ? "white" : "#989898",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    Login
                  </Text>
                </Pressable>
              </View>

              <View
                style={{
                  borderBottomColor: "black",
                  borderBottomWidth: 1,
                  width: "93%",
                  alignSelf: "center",
                }}
              />

              <Pressable onPress={navRegister} style={styles.registerBtn}>
                <Text style={styles.registerText}>Register</Text>
              </Pressable>
            </View>
          </View>
        </ImageBackground>
        // </ScrollView>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 10,
    // backgroundColor: "#fff",
  },
  mainHeader: {
    marginTop: "10%",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    // padding: 10,
    paddingLeft: 10,
    paddingRight: 10,
    // marginTop: 10,
    fontSize: 16,
    borderRadius: 3,
    backgroundColor: "white",
  },
  passContainer: {
    flexDirection: "row",
    height: 40,
    borderWidth: 1,
    margin: 12,
    marginTop: 10,
    borderRadius: 3,
    backgroundColor: "white",
  },
  inputPassword: {
    // paddingTop: 10,
    paddingLeft: 8,
    // paddingBottom: 10,
    paddingRight: 10,
    fontSize: 15,
    borderRadius: 3,
    flex: 1,
  },
  passIcon: {
    margin: 5,
  },
  labels: {
    paddingHorizontal: 10,
  },
  textdanger: {
    color: "#dc3545",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  registerBtn: {
    width: "95%",
    alignSelf: "center",
    backgroundColor: colors.btnColor,
    padding: "3%",
    borderRadius: 3,
    marginTop: 20,
  },
  registerText: {
    alignSelf: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
