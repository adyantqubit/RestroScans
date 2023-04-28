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
import React from "react";
import { Formik } from "formik";
import { addPaymentMethodSchema } from "../../validation/ValidationSchema";
import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "../../Colours/globalColor";
import { getPaymentMethodApi, savePaymentMethodApi } from "../../api/Services";
import config from "../../config/config";

export default function PaymentMethod() {
  const isFocused = useIsFocused();

  // Added by Yuvraj Sahu on 27-4-2023
  // Reason - to set default value
  var [defaultValue, setDefaultValue] = useState({});
  // End of addition

  // Added by Yuvraj Sahu on 27-4-2023
  // Reason - to set saved value
  var [savedPaymentMethod, setSavedPaymentMethod] = useState({});
  // End of addition

  useEffect(() => {
    setImage(null);
    setDefaultValue({ name: "", contact_number: "" });
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
      }
    }
  };
  /**
   * End of getting saved payment value
   */

  var [icon, setImage] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [tempPhoto, setTempPhoto] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setUploadedFileName(result.assets[0].fileName);
      setTempPhoto(result.assets[0]);
      setImgRequired(false);
    }
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

    if (icon != null || savedPaymentMethod.scanner) {
      alert(JSON.stringify(formData));
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
    <View>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Formik
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
                {isImgRequired && (
                  <Text style={{ color: "red", marginLeft: 10 }}>
                    Scanner is required!
                  </Text>
                )}

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
                      height: 40,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 10,
                      width: 120,
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
    </View>
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
    height: 41,
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
