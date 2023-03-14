// Added by Yuvraj Sahu on 16-2-2023
// Reason - to login restaurant

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Pressable,
  Button,
} from "react-native";

// import { userLogin } from "../api/ServiceApi";
import { Formik } from "formik";
import * as SecureStore from "expo-secure-store";
import Ionicons from "@expo/vector-icons/Ionicons";
import { restaurentAuthentication } from "../api/Services";
import {
  loginSchema,
  passwordSchema,
  emailSchema,
} from "../validation/ValidationSchema";
import { useDispatch } from "react-redux";
import { authLogin } from "../redux/slice/AuthSlice";
import { useNavigation } from "@react-navigation/native";
import AuthNavigation from "../navigation/AuthNavigation";
import { colors } from "../Colours/globalColor";

export default function LoginScreen({ navigation }) {
  const navigate = useNavigation();

  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  var [isBtnDisable, setIsBtnDisable] = useState(false);

  const alertHandler = (msg) => {
    Alert.alert("Login", `${msg}`, [{ text: "OK", onPress: () => null }]);
  };

  //when user click login button this method is called
  const submitLog = (values, { resetForm }) => {
    // console.log("values: " + JSON.stringify(values));
    setIsBtnDisable(true);
    restaurentAuthentication(values)
      .then(async (res) => {
        // alert("tok" + JSON.stringify(res.userData[0]));
        if (
          // res.data.success &&
          res.token
        ) {
          // alert("success");
          setIsBtnDisable(false);
          // navigate("main");
          await SecureStore.setItemAsync("token", JSON.stringify(res.token));
          await SecureStore.setItemAsync(
            "userData",
            JSON.stringify(res.userData[0])
          );
          // await SecureStore.deleteItemAsync("userData");
          // navigate("main");
          // await SecureStore.setItemAsync(
          //   "userData",
          // JSON.stringify(res.userData[0])
          // );
          if ((await SecureStore.getItemAsync("userData")) != null) {
            alert(await SecureStore.getItemAsync("userData"));
            navigation.navigate("drawer");
            // authLogin()
            // function authLogin () {
            //     return <AuthNavigation />
            // }
            // return <AuthNavigation />
          }
          // alert("success");
          // await SecureStore.setItemAsync(
          //   "userData",
          //   JSON.stringify(res.userData[0])
          // );
          // dispatch(
          //   authLogin({
          //     token: res.token,
          //     userData: res.userData[0],
          //   })
          // );
          resetForm({ values: "" });
          // alertHandler("login successful");
        }
        if (res.error) {
          alert("Please wait for admin approval");
          setIsBtnDisable(false);
        }
        if (res.invalid) {
          // alertHandler("Something went wrong! Please try again later.");
          alert("Invaild email and password");
          setIsBtnDisable(false);
        }
      })
      .catch((err) => {
        alertHandler("Something went wrong! Please try again later.");
      });
  };

  const forgotPasswordHandler = () => {
    navigation.navigate("forgotPassword");
  };

  const navRegister = () => {
    navigation.navigate("registration");
    // Alert.alert('pressed')
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validateOnMount={true}
      validationSchema={loginSchema}
      onSubmit={submitLog}
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
        <ScrollView style={styles.container}>
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
                  onBlur={handleBlur("email")}
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
                    onBlur={handleBlur("password")}
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

              <View
              // style={{
              //   marginBottom: 30,
              //   marginHorizontal: 10,
              //   marginTop: 10,
              // }}
              >
                <Pressable
                  onPress={forgotPasswordHandler}
                  // disabled={isBtnDisable}
                  // style={{
                  //   backgroundColor: !isBtnDisable ? "#6823cf" : "#E0E0E0",
                  //   height: 40,
                  //   alignItems: "center",
                  //   justifyContent: "center",
                  //   borderRadius: 3,
                  // }}
                >
                  <Text
                  // style={{
                  //   color: !isBtnDisable ? "white" : "#989898",
                  //   fontSize: 16,
                  //   fontWeight: "bold",
                  // }}
                  >
                    Forgot Password
                  </Text>
                </Pressable>
              </View>

              <View
                style={{
                  marginBottom: 30,
                  marginHorizontal: 10,
                  marginTop: 10,
                }}
              >
                <Pressable
                  onPress={handleSubmit}
                  disabled={isBtnDisable}
                  style={{
                    backgroundColor: !isBtnDisable ? colors.btnColor : "#E0E0E0",
                    height: 40,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 3,
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
              {/* Added for registration  */}
              {/* <View> */}
                <Pressable onPress={navRegister} style={styles.registerBtn}>
                  {/* <Button title="registration" onPress={navRegister} /> */}
                  <Text style={styles.registerText}>Register</Text>
                </Pressable>
              {/* </View> */}
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
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
    padding: 10,
    marginTop: 10,
    fontSize: 16,
    borderRadius: 3,
  },
  passContainer: {
    flexDirection: "row",
    height: 40,
    borderWidth: 1,
    margin: 12,
    marginTop: 10,
    borderRadius: 3,
  },
  inputPassword: {
    paddingTop: 10,
    paddingLeft: 8,
    paddingBottom: 10,
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
    width: '95%',
    alignSelf: 'center',
    backgroundColor: colors.btnColor,
    padding: '3%',
    borderRadius: 3
  },
  registerText: {
    alignSelf: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});
