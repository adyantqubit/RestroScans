/**
 * Created by Yuvraj Sahu on 27-4-2023
 * Reason - to save payment methods
 */

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Alert,
} from "react-native";
import React, { useRef } from "react";
import { Formik } from "formik";
import { addPaymentMethodSchema } from "../../validation/ValidationSchema";
import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors, inputs } from "../../Colours/globalColor";
import { getPaymentMethodApi, savePaymentMethodApi } from "../../api/Services";
import config from "../../config/config";
import Footer from "../../components/Footer/Footer";

export default function PaymentMethod() {
  const isFocused = useIsFocused();

  // Added by Yuvraj Sahu on 27-4-2023
  // Reason - to set default value
  /**
   * Modified by Yuvraj Sahu on 03-05-2023
   * Reason - to set default value in object form
   */
  var [defaultValue, setDefaultValue] = useState({
    name: "",
    contact_number: "",
  });
  /**
   * End of set default value
   */
  // End of addition

  // Added by Yuvraj Sahu on 27-4-2023
  // Reason - to set saved value
  var [savedPaymentMethod, setSavedPaymentMethod] = useState({});
  // End of addition

  /**
   * Added by Yuvraj Sahu on 03-05-2023
   * Reason - to re-fresh the validation
   * msg when we come back from another screen
   */
  const formRef = useRef(null);
  /**
   * End of refreshing validation msg
   */

  useEffect(() => {
    setImage(null);
    getPaymentData();
  }, [isFocused]);

  /**
   * This is add for image validation msg show and hide
   */
  var [isImgRequired, setImgRequired] = useState(false);
  /**
   * End of addition
   */

  /**
   * This is add diable btn
   */
  var [isSaveBtnDisable, setSaveBtnDisable] = useState(false);
  /**
   * End of button disable
   */

  /**
   * Added by Yuvraj Sahu on 27-4-2023
   * Reason - to get saved value for payment method
   */
  const getPaymentData = async () => {
    /**
     * Added by Yuvraj Sahu on 03-05-2023
     * Reason - to set default value in form
     */
    var val = { name: "", contact_number: "" };
    setDefaultValue(val);
    setFileSizeError(false);
    /**
     * End of set default value
     */
    if (await SecureStore.getItemAsync("tenantInfo")) {
      var tenant = JSON.parse(
        await SecureStore.getItemAsync("tenantInfo")
      ).tenant_name;
      var response = await getPaymentMethodApi(tenant);
      if (response.length > 0) {
        setSavedPaymentMethod(response[0]);
        setDefaultValue({
          name: response[0].name != undefined ? response[0].name : "",
          contact_number:
            response[0].contact_number != undefined
              ? response[0].contact_number
              : "",
        });
      } else {
        /**
         * Added by Yuvraj Sahu on 03-05-2023
         * Reason - to re-fresh the validation
         * msg when we come back from another screen
         */
        formRef.current.setErrors({});
        formRef.current.setValues(val);
        // defaultValue = val
        /**
         * End of refreshing validation msg
         */
      }
    }
  };
  /**
   * End of getting saved payment value
   */

  var [icon, setImage] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [tempPhoto, setTempPhoto] = useState(null);

  /* This is add for show image limit validation msg */
  var [isFileSizeError, setFileSizeError] = useState(false);
  /* End of addition */

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      base64: true,
    });
    /**
     * Modified by yuvraj Sahu on 05-05-2023
     * Reason - to img not upload if img size is bigger
     */
    // Added by Suman Sahu on 30-4-2023
    // Reason - to show validation msg image filed when user upload image above 200kb
    /**
     * Commeted and Modified by yuvraj Sahu on 05-05-2023
     * Reason - to give image size validation
     */
    // const fileSize = result.assets[0].base64.length * (3 / 4) - 2;
    const fileSize = (result.assets[0].base64.length + 2 * 4) / 3;
    /**
     * End of comment by Yuvraj Sahu on 05-05-2023
     */

    if (fileSize > 200000) {
      setFileSizeError(true);
    } else {
      if (!result.canceled) {
        setFileSizeError(false);
        setImage(result.assets[0].uri);
        setUploadedFileName(result.assets[0].fileName);
        setTempPhoto(result.assets[0]);
        setImgRequired(false);
      }
    }
    /**
     * End of modification by Yuvraj Sahu on 05-05-2023
     */
  };

  const handleRegister = async (values, { resetForm }) => {
    if (icon != null || savedPaymentMethod) {
      //   setSaveBtnDisable(true);
    }
    if (!icon && !savedPaymentMethod.scanner) {
      setImgRequired(true);
    }
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;

    var formData = new FormData();

    if (savedPaymentMethod.id != undefined) {
      formData.append("id", savedPaymentMethod.id);
    }
    formData.append("name", values.name);
    formData.append("contact_number", values.contact_number);
    if (icon != null) {
      const ext = tempPhoto.uri.substring(tempPhoto.uri.lastIndexOf(".") + 1);
      formData.append("scanner", {
        uri: icon,
        name: icon,
        type: `image/${ext}`,
      });
    }

    // Modify by- Suman sahu  On 29/04/2023
    // Reason- add condition for image field when user upload image above 200kb form not saved
    if (
      (icon != null || savedPaymentMethod.scanner) &&
      isFileSizeError == false
    ) {
      savePaymentMethodApi(formData, tenant).then(async (res) => {
        if (res.msg) {
          setSaveBtnDisable(false);
          Alert.alert(res.msg);
          //   resetForm({ values: "" });
          //   setImage(null);
        } else if (res.error) {
          setSaveBtnDisable(false);
          Alert.alert(res.error);
        } else {
          setSaveBtnDisable(false);
          Alert.alert("Something went wrong");
        }
      });
    }
  };

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Formik
            /** Added by Yuvraj Sahu on 03-05-2023
             * Reason - to refresh the validation msg
             */
            innerRef={formRef}
            /** End of refreshing validation msg */
            enableReinitialize={true}
            initialValues={defaultValue}
            // initialValues={{
            //   name: "",
            //   contact_number: "",
            // }}
            // validateOnMount={true}
            validationSchema={addPaymentMethodSchema}
            onSubmit={handleRegister}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              touched,
              errors,
            }) => (
              <View>
                <View>
                  <Text style={styles.labels}> Name</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Enter Name"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  {errors.name && touched.name && (
                    <Text style={styles.textdanger}>{errors.name}</Text>
                  )}
                </View>

                <View>
                  <Text style={styles.labels}> Contact Number</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("contact_number")}
                    onBlur={handleBlur("contact_number")}
                    value={"" + values.contact_number}
                    placeholderTextColor="#A4A4A4"
                    keyboardType="number-pad"
                    placeholder="Enter Contact Number"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  {errors.contact_number && touched.contact_number && (
                    <Text style={styles.textdanger}>
                      {errors.contact_number}
                    </Text>
                  )}
                </View>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "93%",
                    alignSelf: "center",
                    marginTop: 5,
                    marginBottom: 5,
                  }}
                >
                  <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
                  <Text>Scanner</Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 3,
                    width: "93%",
                    alignSelf: "center",
                    flexDirection: "row-reverse",
                    justifyContent: "space-around",
                  }}
                >
                  <Pressable
                    onPress={pickImage}
                    style={{
                      backgroundColor: "#d5d5d5",
                      width: 50,
                      padding: 5,
                      borderRadius: 5,
                      height: 40,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name="upload" size={20} color="black" />
                  </Pressable>
                  {icon && (
                    <Image
                      source={{ uri: icon }}
                      style={{ width: 50, height: 40, borderRadius: 5 }}
                    />
                  )}
                  {!icon && savedPaymentMethod.scanner != undefined && (
                    <Image
                      source={{
                        uri: config.staticBaseURL + savedPaymentMethod.scanner,
                      }}
                      style={{ width: 50, height: 40, borderRadius: 5 }}
                    />
                  )}
                </View>

                {/* Added by- Suman sahu  On 28/04/2023
              Reason- add label in upload image field */}
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    alignSelf: "center",
                    justifyContent: "center",
                    marginTop: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#7d7c7a",
                    }}
                  >
                    Please upload image below 200kb
                  </Text>
                </View>
                {/* End of added code 28/04/2023 */}

                {isImgRequired && (
                  <Text style={{ color: "red", marginLeft: 10 }}>
                    Scanner is required!
                  </Text>
                )}

                {/* Added by Suman Sahu on 30-04-2023
                    Reason - to show validation msg image filed when user upload image above 200kb */}
                {isFileSizeError && (
                  <Text style={{ color: "red", marginLeft: 70 }}>
                    Please upload image below 200kb
                  </Text>
                )}
                {/* End of addition  30-04-2023*/}

                <View
                  style={{
                    marginBottom: 30,
                    marginHorizontal: 10,
                    marginTop: 10,
                  }}
                >
                  <Pressable
                    onPress={handleSubmit}
                    disabled={isSaveBtnDisable}
                    style={{
                      backgroundColor: isSaveBtnDisable
                        ? "#E0E0E0"
                        : colors.btnColor,
                      height: 30,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 10,
                      width: "35%",
                      alignSelf: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: isSaveBtnDisable ? "#989898" : colors.white,
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      Save
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
      {/* Added by Yuvraj Sahu on 05-05-23 For showing the footer*/}
      {/* <> */}
      <Footer />
      {/* </> */}
      {/* End of addition */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    paddingTop: 10,
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
    marginTop: 5,
    fontSize: 16,
    borderRadius: 10,
  },
  labels: {
    paddingHorizontal: 10,
  },
  textdanger: {
    color: "#dc3545",
    marginBottom: 10,
    paddingHorizontal: 10,
    marginTop: -10,
  },
  picker: {
    top: -9,
    fontSize: 14,
    padding: 5,
    borderWidth: 0,
  },
  datePickerStyle: {
    width: 230,
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
  activeStatus: {
    display: "flex",
    flexDirection: "row",
    width: "93%",
    alignSelf: "center",
    marginTop: 5,
  },
  activeLable: {
    marginLeft: 10,
  },
});
