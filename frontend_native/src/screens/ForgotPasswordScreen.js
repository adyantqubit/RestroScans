// Created by Yuvraj Sahu on 20-2-2023
// Reason - to reste password

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Pressable,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Formik } from "formik";
import Ionicons from "@expo/vector-icons/Ionicons";
import { sendOtpApi, updatePasswordApi } from "../api/Services";
import {
  emailSchema,
  forgetPasswordSchema,
} from "../validation/ValidationSchema";
import { useNavigation } from "@react-navigation/native";
import { colors, inputs } from "../Colours/globalColor";
import Footer from "../components/Footer/Footer";

var email = null;

// function ResetPassword({ navigation: navigate }) {
//   const navigation = useNavigation();

//   var [isBtnDisable, setISBtnDisable] = useState(false);

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const alertHandler = (msg) => {
//     Alert.alert("Login", `${msg}`, [{ text: "OK", onPress: () => null }]);
//   };

//   const submitLog = (values, { resetForm }) => {
//     values["email"] = email;
//     setISBtnDisable(true);
//     updatePasswordApi(values).then(async (res) => {
//       if (res.msg) {
//         Alert.alert("Password Changed Successfully.");
//         setISBtnDisable(false);
//         navigation.navigate("LoginScreen");
//         resetForm({ values: "" });
//       } else {
//         Alert.alert("Something went wrong");
//         setISBtnDisable(false);
//       }
//       if (res.error) {
//         Alert.alert(res.error);
//         setISBtnDisable(false);
//       }
//     });
//   };

//   return (
//     <>
//       <Formik
//         initialValues={{
//           otp: "",
//           password: "",
//           confirm_password: "",
//         }}
//         validateOnMount={true}
//         validationSchema={forgetPasswordSchema}
//         onSubmit={submitLog}
//       >
//         {({
//           handleChange,
//           handleBlur,
//           handleSubmit,
//           values,
//           touched,
//           errors,
//         }) => (
//           // Commented by Yuvraj Sahu on 19-4-2023
//           // Reason - to remove extra spaces in otp form
//           // And also ui changes
//           // <ScrollView style={styles.container}>
//           <View style={styles.container}>
//             <View>
//               <View>
//                 <Text style={styles.labels}>
//                   <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
//                   OTP
//                 </Text>

//                 <TextInput
//                   style={styles.input}
//                   onChangeText={handleChange("otp")}
//                   onBlur={handleBlur("otp")}
//                   value={values.otp}
//                   placeholderTextColor="#A4A4A4"
//                   placeholder="Enter OTP"
//                   keyboardType="number-pad"
//                   autoCapitalize="none"
//                   autoCorrect={false}
//                   backgroundColor={!email ? "#e0e0d1" : "white"}
//                   editable={!email ? false : true}
//                 />
//                 {errors.otp && touched.otp && (
//                   <Text style={styles.textdanger}>{errors.otp}</Text>
//                 )}
//               </View>

//               <View>
//                 <Text style={styles.labels}>
//                   <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
//                   Password
//                 </Text>
//                 <View style={styles.passContainer}>
//                   <TextInput
//                     style={styles.inputPassword}
//                     onChangeText={handleChange("password")}
//                     onBlur={handleBlur("password")}
//                     value={values.password}
//                     placeholderTextColor="#A4A4A4"
//                     placeholder="Enter your password"
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                     secureTextEntry={!showPassword}
//                     backgroundColor={!email ? "#e0e0d1" : "white"}
//                     editable={!email ? false : true}
//                   />

//                   <TouchableOpacity
//                     onPress={() => setShowPassword(!showPassword)}
//                     style={{
//                       backgroundColor: (email = null ? "#e0e0d1" : "white"),
//                     }}
//                   >
//                     <Ionicons
//                       name={showPassword ? "eye" : "eye-off"}
//                       size={24}
//                       color="black"
//                       style={styles.passIcon}
//                     />
//                   </TouchableOpacity>
//                 </View>

//                 {errors.password && touched.password && (
//                   <Text style={styles.textdanger}>{errors.password}</Text>
//                 )}
//               </View>

//               <View>
//                 <Text style={styles.labels}>
//                   <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
//                   Confirm Password
//                 </Text>

//                 <View style={styles.passContainer}>
//                   <TextInput
//                     style={styles.inputPassword}
//                     onChangeText={handleChange("confirm_password")}
//                     onBlur={handleBlur("confirm_password")}
//                     value={values.confirm_password}
//                     placeholderTextColor="#A4A4A4"
//                     placeholder="Enter your password"
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                     secureTextEntry={!showConfirmPassword}
//                     backgroundColor={!email ? "#e0e0d1" : "white"}
//                     editable={!email ? false : true}
//                   />

//                   <TouchableOpacity
//                     onPress={() => setShowConfirmPassword(!showConfirmPassword)}
//                     style={{ backgroundColor: !email && "#e0e0d1" }}
//                   >
//                     <Ionicons
//                       name={showConfirmPassword ? "eye" : "eye-off"}
//                       size={24}
//                       color="black"
//                       style={styles.passIcon}
//                     />
//                   </TouchableOpacity>
//                 </View>

//                 {errors.confirm_password && touched.confirm_password && (
//                   <Text style={styles.textdanger}>
//                     {errors.confirm_password}
//                   </Text>
//                 )}
//               </View>

//               <View
//                 style={{
//                   marginBottom: 30,
//                   marginHorizontal: 10,
//                   marginTop: 10,
//                 }}
//               >
//                 <Pressable
//                   onPress={handleSubmit}
//                   // disabled={isBtnDisable}
//                   style={{
//                     backgroundColor: !isBtnDisable
//                       ? colors.btnColor
//                       : "#E0E0E0",
//                     height: 40,
//                     alignItems: "center",
//                     justifyContent: "center",
//                     borderRadius: 3,
//                   }}
//                 >
//                   <Text
//                     style={{
//                       color: !isBtnDisable ? "white" : "#989898",
//                       fontSize: 16,
//                       fontWeight: "bold",
//                     }}
//                   >
//                     Reset Password
//                   </Text>
//                 </Pressable>
//               </View>
//             </View>
//           </View>
//           // </ScrollView>
//         )}
//       </Formik>
//     </>
//   );
// }

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  var [isOTPBtnDisable, setOTPIsBtnDisable] = useState(false);

  // Added by Yuvraj Sahu on 19-4-2023
  // Reason - to input disable
  var [isInputDisable, setInputDisable] = useState(false);
  // End of input disable

  const alertHandler = (msg) => {
    Alert.alert("Login", `${msg}`, [{ text: "OK", onPress: () => null }]);
  };

  //when user click send otp for forget password
  const submitLog = (values, { resetForm }) => {
    setOTPIsBtnDisable(true);
    sendOtpApi(values)
      .then(async (res) => {
        if (res.mail) {
          email = res.mail;
          Alert.alert("OTP is sent successfully.Please check your Email");
          setOTPIsBtnDisable(false);
          resetForm({ values: "" });
          setInputDisable(!isInputDisable);
        }
        if (res.error) {
          Alert.alert(res.error);
          setOTPIsBtnDisable(false);
        }
      })
      .catch((err) => {
        alertHandler("Something went wrong! Please try again later.");
      });
  };

  // -------------------------------------------------------

  var [isBtnDisable, setISBtnDisable] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // const alertHandler = (msg) => {
  //   Alert.alert("Login", `${msg}`, [{ text: "OK", onPress: () => null }]);
  // };

  const handleReset = (values, { resetForm }) => {
    values["email"] = email;
    setISBtnDisable(true);
    updatePasswordApi(values).then(async (res) => {
      if (res.msg) {
        // Modified by- Suman sahu  On 24/04/2023
        // Reason- for change that successful message

        // Alert.alert("Password Changed successfully. You can login");
        Alert.alert("Password Changed Successfully.");

        // End of modified code 24/04/2023

        setISBtnDisable(false);
        navigation.navigate("LoginScreen");
        resetForm({ values: "" });
      } else {
        Alert.alert("Something went wrong");
        setISBtnDisable(false);
      }
      if (res.error) {
        Alert.alert(res.error);
        setISBtnDisable(false);
      }
    });
  };

  var [isResendOTP, setResendOTP] = useState(false);
  const handleResendOTP = async () => {
    setResendOTP(true);
    // if(isResendOTP) {
    //   return (
    //        <View>
    //            <ActivityIndicator/>
    //        </View>
    //   )
    //  }
    var response = await sendOtpApi({ email: email });
    if (response.mail) {
      setResendOTP(false);
      // alert("Successfully sent OTP")
    }
  };

  return (
    <>
      {/* Style apply by Om on 26-04-23 for main container*/}
      <View style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <Modal
            // animationType="slide"
            transparent={true}
            // backdropColor="transparent"
            visible={isResendOTP}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!isResendOTP);
            }}
          >
            <View
              //  style={styles.centeredView}
              style={{
                backgroundColor: isResendOTP ? "rgba(0, 0, 0, 0.5)" : "white",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={styles.modalView}>
                <ActivityIndicator size={50} color="white" />
                <Text style={styles.modalText}>Please wait for get OTP</Text>
              </View>
            </View>
          </Modal>

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
              errors,
            }) => (
              // <ScrollView style={styles.container}>
              <View style={styles.container}>
                <View style={{ marginTop: 30 }}>
                  <View>
                    <Text style={styles.labels}>
                      <Text style={{ color: "red", fontWeight: "650" }}>
                        *{" "}
                      </Text>
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
                      // Modified by Yuvraj Sahu on 20-4-2023
                      // Reason - to color change when btn disable
                      backgroundColor={isInputDisable ? "#E0E0E0" : "white"}
                      // End of addition
                      editable={isInputDisable ? false : true}
                    />
                    {errors.email && touched.email && !isInputDisable && (
                      <Text style={styles.textdanger}>{errors.email}</Text>
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
                      // disabled={isOTPBtnDisable}
                      // Modified by Yuvraj Sahu on 20-4-2023
                      // Reason - to disable
                      disabled={
                        isInputDisable ? isInputDisable : isOTPBtnDisable
                      }
                      style={{
                        backgroundColor:
                          !isOTPBtnDisable && !isInputDisable
                            ? colors.btnColor
                            : "#E0E0E0",
                        height: 30,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                        width: 150,
                        alignSelf: "center",
                        // End of btn disable
                      }}
                    >
                      <Text
                        style={{
                          // Modified by Yuvraj Sahu on 20-4-2023
                          // Reason - to change color when btn disable
                          color:
                            !isOTPBtnDisable && !isInputDisable
                              ? "white"
                              : "#989898",
                          fontSize: 16,
                          fontWeight: "bold",
                          // End of disable
                        }}
                      >
                        Send OTP
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={handleResendOTP}
                      disabled={!isInputDisable}
                      style={{ marginTop: 20 }}
                    >
                      <Text
                        style={{
                          color: "blue",
                          display: "flex",
                          alignSelf: "flex-end",
                        }}
                      >
                        Resend OTP
                      </Text>
                      {/* {isResendOTP && <Text style={{display: "flex", alignSelf: "flex-end"}}>Please wait</Text>} */}
                    </Pressable>
                  </View>
                </View>
              </View>
              // </ScrollView>
            )}
          </Formik>

          <Formik
            initialValues={{
              otp: "",
              password: "",
              confirm_password: "",
            }}
            validateOnMount={true}
            validationSchema={forgetPasswordSchema}
            onSubmit={handleReset}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              touched,
              errors,
            }) => (
              // Modified by Yuvraj Sahu on 20-4-2023
              // Reason - to design screen
              // <ScrollView style={styles.container}>
              <View style={styles.container}>
                <View>
                  <View>
                    <Text style={styles.labels}>
                      <Text style={{ color: "red", fontWeight: "650" }}>
                        *{" "}
                      </Text>
                      OTP
                    </Text>

                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("otp")}
                      // Added by- Suman sahu  On 24/04/2023
                      // Reason- show error message when focusout that input box
                      onBlur={handleBlur("otp")}
                      // End of added code 24/04/2023

                      value={values.otp}
                      placeholderTextColor="#A4A4A4"
                      placeholder="Enter OTP"
                      keyboardType="number-pad"
                      autoCapitalize="none"
                      autoCorrect={false}
                      backgroundColor={!isInputDisable ? "#E0E0E0" : "white"}
                      editable={!isInputDisable ? false : true}
                    />
                    {/* Modified by- Suman sahu  On 24/04/2023
                      Reason- unable this code for show error message that input field */}
                    {errors.otp && touched.otp && (
                      <Text style={styles.textdanger}>{errors.otp}</Text>
                    )}
                    {/* End of modified code 24/04/2023 */}
                  </View>

                  <View>
                    <Text style={styles.labels}>
                      <Text style={{ color: "red", fontWeight: "650" }}>
                        *{" "}
                      </Text>
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
                        backgroundColor={!isInputDisable ? "#E0E0E0" : "white"}
                        editable={!isInputDisable ? false : true}
                      />

                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={{
                          backgroundColor: !isInputDisable
                            ? "#E0E0E0"
                            : "white",
                          borderTopRightRadius: 10,
                          borderBottomRightRadius: 10,
                        }}
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
                      <Text style={{ color: "red", fontWeight: "650" }}>
                        *{" "}
                      </Text>
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
                        backgroundColor={!isInputDisable ? "#E0E0E0" : "white"}
                        editable={!isInputDisable ? false : true}
                      />

                      <TouchableOpacity
                        onPress={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        style={{
                          backgroundColor: !isInputDisable
                            ? "#E0E0E0"
                            : "white",
                          borderTopRightRadius: 10,
                          borderBottomRightRadius: 10,
                        }}
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
                      disabled={!isInputDisable && !isBtnDisable}
                      style={{
                        backgroundColor:
                          isInputDisable && !isBtnDisable
                            ? colors.btnColor
                            : "#E0E0E0",
                        height: 30,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                        width: 150,
                        alignSelf: "center",
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
              // </ScrollView>
            )}
          </Formik>
        </ScrollView>
      </View>
      {/* <View 
    // style={{paddingTop:172}}
    > */}
      <Footer />
      {/* </View> */}
    </>
  );
}

const styles = StyleSheet.create({
  // Modification by Om on 26-04-23 for fix the footer length
  container: {
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    flex: 1,
    // End of the code
  },
  mainHeader: {
    marginTop: "10%",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    /**
     * Modified by yuvraj Sahu on 05-05-2023
     * Reason - to increase height due to scroll issue
     */
    // height: 41,
    height: inputs.inputBoxHeight,
    /**
     * End of modification by Yuvraj Sahu on 05-05-2023
     */
    margin: 12,
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    fontSize: 16,
    borderRadius: 10,
  },
  passContainer: {
    flexDirection: "row",
    /**
     * Modified by yuvraj Sahu on 05-05-2023
     * Reason - to increase height due to scroll issue
     */
    // height: 44,
    height: inputs.inputBoxHeight - 1,
    /**
     * End of modification by Yuvraj Sahu on 05-05-2023
     */
    borderWidth: 1,
    margin: 12,
    marginTop: 10,
    borderRadius: 10,
  },
  inputPassword: {
    height: 41,
    paddingTop: 10,
    paddingLeft: 8,
    paddingBottom: 10,
    paddingRight: 10,
    fontSize: 15,
    // borderRadius: 3,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
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
    marginTop: -10,
    marginLeft: 5,
    paddingHorizontal: 10,
  },

  // centeredView: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginTop: 22,
  // },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    backgroundColor: colors.btnColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    // marginBottom: 15,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
});
