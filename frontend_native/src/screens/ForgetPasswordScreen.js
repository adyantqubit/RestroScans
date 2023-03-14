// Created by Yuvraj Sahu on 20-2-2023
// Reason - to reste password

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";

// import { userLogin } from "../api/ServiceApi";
import { Formik } from "formik";
import * as SecureStore from "expo-secure-store";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  restaurentAuthentication,
  sendOtpApi,
  updatePasswordApi,
} from "../api/Services";
import {
  emailSchema,
  forgetPasswordSchema,
  loginSchema,
} from "../validation/ValidationSchema";
import { useDispatch } from "react-redux";
import { authLogin } from "../redux/slice/AuthSlice";
import { useNavigation } from "@react-navigation/native";

var email = null;

function ResetPassword({navigation : navigate}) {
  const navigation = useNavigation();

  const dispatch = useDispatch();
  var [isBtnDisable, setISBtnDisable] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const alertHandler = (msg) => {
    Alert.alert("Login", `${msg}`, [{ text: "OK", onPress: () => null }]);
  };

  //when user click send otp for forget password
  const submitLog = (values, { resetForm }) => {
    values["email"] = email;
    // alert("change password" + JSON.stringify(values));
    setISBtnDisable(true);
    updatePasswordApi(values)
      .then(async (res) => {
        if (res.msg) {
          Alert.alert("Success", "Password Changed successfully. You can login");
          setISBtnDisable(false);
          navigate("login");
          resetForm({ values: "" });
          // alertHandler("OTP is sent succssfully. Please check your email");
        } else {
          // alertHandler("Something went wrong! Please try again later.");
          Alert.alert("Error", "Something went wrong");
          setISBtnDisable(false);
        }
        if (res.error){
          Alert.alert("Error", res.error)
          setISBtnDisable(false);
        }
      })
      // .catch((err) => {
      //   alertHandler("Something went wrong! Please try again later.");
      // });
  };

  return (
    <>
      <Formik
        initialValues={{
          // email: `${email}`,
          // email : "",
          otp: "",
          password: "",
          confirm_password: "",
        }}
        validateOnMount={true}
        validationSchema={forgetPasswordSchema}
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
              <View>
                {/* <View>
                  <Text style={styles.labels}>
                    <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
                    Email
                  </Text>

                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    // value={values.email}
                    value={email}
                    defaultValue={email}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    // disabled = {true}
                  />
                  {errors.email && touched.email && (
                    <Text style={styles.textdanger}>{errors.email}</Text>
                  )}
                </View> */}

                <View>
                  <Text style={styles.labels}>
                    <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
                    OTP
                  </Text>

                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("otp")}
                    onBlur={handleBlur("otp")}
                    value={values.otp}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Enter OTP"
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={true}
                  />
                  {errors.otp && touched.otp && (
                    <Text style={styles.textdanger}>{errors.otp}</Text>
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

                <View>
                  <Text style={styles.labels}>
                    <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
                    Confirm Password
                  </Text>

                  <View style={styles.passContainer}>
                    <TextInput
                      style={styles.inputPassword}
                      onChangeText={handleChange("confirm_password")}
                      onBlur={handleBlur("confirm_password")}
                      value={values.confirm_password}
                      placeholderTextColor="#A4A4A4"
                      placeholder="Enter your password"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry={!showConfirmPassword}
                    />

                    <TouchableOpacity
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <Ionicons
                        name={showConfirmPassword ? "eye" : "eye-off"}
                        size={24}
                        color="black"
                        style={styles.passIcon}
                      />
                    </TouchableOpacity>
                  </View>

                  {errors.confirm_password && touched.confirm_password && (
                    <Text style={styles.textdanger}>
                      {errors.confirm_password}
                    </Text>
                  )}
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
                    // disabled={isBtnDisable}
                    style={{
                      backgroundColor: !isBtnDisable ? "#6823cf" : "#E0E0E0",
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
                      Reset Password
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </Formik>
    </>
  );
}

export default function ForgetPasswordScreen() {
  const navigation = useNavigation();

  const dispatch = useDispatch();
  var [isBtnDisable, setISBtnDisable] = useState(false);

  const alertHandler = (msg) => {
    Alert.alert("Login", `${msg}`, [{ text: "OK", onPress: () => null }]);
  };

  // const [showPassword, setShowPassword] = useState(false);

  //when user click send otp for forget password
  const submitLog = (values, { resetForm }) => {
    alert("otp submmition");
    setISBtnDisable(true);
    sendOtpApi(values)
      .then(async (res) => {
        if (res.mail) {
          email = res.mail;
          // alert(email)
          alert("OTP is sent succssfully. Please check your email");
          setISBtnDisable(false);
          // navigate("home");
          resetForm({ values: "" });
          // alertHandler("OTP is sent succssfully. Please check your email");
        }
        //  else {
        //   alertHandler("Something went wrong! Please try again later.");
        //   alert("OTP Not Sent");
        //   setISBtnDisable(false);
        // }
        if (res.error) {
          alert(res.error);
          setISBtnDisable(false);
        }
      })
      .catch((err) => {
        alertHandler("Something went wrong! Please try again later.");
      });
  };

  return (
    <>
      <Formik
        initialValues={{ email: "" }}
        validateOnMount={true}
        validationSchema={emailSchema}
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

                {/* <View>
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
              </View> */}

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
                      backgroundColor: !isBtnDisable ? "#6823cf" : "#E0E0E0",
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
                      Send OTP
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </Formik>
      <ResetPassword />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // height: "100%",
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
});
