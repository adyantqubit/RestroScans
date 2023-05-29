/**
 * Created by Yuvraj Sahu on 28-05-2023
 * Reason - to update social media
 */

import { View, Text, Pressable, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import { addSocialMedia } from "../../validation/ValidationSchema";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { saveSocialMediaApi, updateSocialMediaApi } from "../../api/Services";
import { TextInput } from "react-native";
import { colors, inputs } from "../../Colours/globalColor";
import Icon from "react-native-vector-icons/FontAwesome";
import { StyleSheet } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Image } from "react-native";
import SocialMediaList from "./SocialMediaList";
import config from "../../config/config";

export default function EditSocialMediaForm({ route, navigation }) {
  // const formRef = useRef(null);
  const { socialID, SocialMediaObj } = route.params;

  var [isFileSizeError, setFileSizeError] = useState(false);
  const [icon, setImage] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  var [isImgRequired, setImgRequired] = useState(false);
  var [isFileSizeError, setFileSizeError] = useState(false);
  var [isSaveBtnDisable, setSaveBtnDisable] = useState(false);
  const [tempPhoto, setTempPhoto] = useState(null);

  const isFocused = useIsFocused();

  useEffect(() => {
    // formRef.current.resetForm({});
    setImgRequired(false);
    setImage(null);
    setFileSizeError(false);
    // formRef.current.setErrors({});
  }, [isFocused]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      base64: true,
      quality: 1,
    });
    const fileSize = (result.assets[0].base64.length + 2 * 4) / 3;
    if (fileSize > 200000) {
      setFileSizeError(true);
    } else {
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setUploadedFileName(result.assets[0].fileName);
        setTempPhoto(result.assets[0]);
        setImgRequired(false);
        setFileSizeError(false);
      }
    }
  };

  const handleRegister = async (values, { resetForm }) => {
    // setSaveBtnDisable(true);

    if (!icon) {
      setImgRequired(true);
    }
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;

    var formData = new FormData();
    if (icon != null) {
      const ext = tempPhoto.uri.substring(tempPhoto.uri.lastIndexOf(".") + 1);
      formData.append("social_media_icon", {
        uri: icon,
        name: icon,
        type: `image/${ext}`,
      });
    }
    formData.append("social_media_name", values.social_media_name);
    formData.append("social_media_link", values.social_media_link);

    if (isFileSizeError == false) {
      // if (categoryName != "") {
      setSaveBtnDisable(true);
      updateSocialMediaApi(formData, tenant, socialID).then(async (res) => {
        if (res.message) {
          setSaveBtnDisable(false);
          Alert.alert(res.message);
          // resetForm({ values: "" });
          // setImage(null);
          // setFileSizeError(false);
          // setSocialLinkObjs(res.SocialLinkObjs)
          // setRenderMsg(res.msg)
        } else if (res.error) {
          setSaveBtnDisable(false);
        } else {
          setSaveBtnDisable(false);
          Alert.alert("Something went wrong");
        }
      });
    }
  };

  return (
    <View>
      <Formik
        // innerRef={formRef}
        initialValues={{
          social_media_name: SocialMediaObj.social_media_name,
          social_media_link: SocialMediaObj.social_media_link,
        }}
        validationSchema={addSocialMedia}
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
            <View style={{ marginTop: 10 }}>
              <Text style={styles.labels}> Social media name</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("social_media_name")}
                onBlur={handleBlur("social_media_name")}
                value={values.social_media_name}
                placeholderTextColor="#A4A4A4"
                placeholder="Enter Social media name"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.social_media_name && touched.social_media_name && (
                <Text style={styles.textdanger}>
                  {errors.social_media_name}
                </Text>
              )}
            </View>

            <View style={{ marginTop: 10 }}>
              <Text style={styles.labels}>
                <Text style={{ color: "red", fontWeight: "650" }}> * </Text>
                Social media link
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("social_media_link")}
                onBlur={handleBlur("social_media_link")}
                value={values.social_media_link}
                placeholderTextColor="#A4A4A4"
                placeholder="https://example.com"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.social_media_link && touched.social_media_link && (
                <Text style={styles.textdanger}>
                  {errors.social_media_link}
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
              <Text>Upload icon</Text>
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
              {!icon && SocialMediaObj.social_media_icon && (
                <Image
                  source={{
                    uri:
                      config.staticBaseURL + SocialMediaObj.social_media_icon,
                  }}
                  style={{ width: 50, height: 40, borderRadius: 5 }}
                />
              )}
            </View>

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
                  fontSize: 12,
                }}
              >
                Please upload image below 200kb
              </Text>
            </View>

            {/* {isImgRequired && (
              <Text style={{ color: "red", marginLeft: 100 }}>
                Item icon is required!
              </Text>
            )} */}

            {isFileSizeError && (
              <Text style={{ color: "red", marginLeft: 70 }}>
                Please upload image below 200kb
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
                onPress={(e) => {
                  handleSubmit();
                }}
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
                  Update
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flex: 1,
    height: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  mainHeader: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    height: inputs.inputBoxHeight,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    marginTop: 0,
    fontSize: 16,
    borderRadius: 10,
  },
  labels: {
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  textdanger: {
    color: "#dc3545",
    marginBottom: 10,
    paddingHorizontal: 10,
    marginTop: -10,
    marginLeft: 5,
  },
  dropdownText: {
    fontSize: 14,
  },
  pickerContainer: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 3,
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
  imagePickerContainer: {
    margin: 15,
    marginTop: 20,
  },
  imagePicker: {
    margin: 5,
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#5260ff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePickerContainer: {
    margin: 15,
    marginTop: 20,
  },
  activeStatus: {
    display: "flex",
    flexDirection: "row",
    width: "93%",
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 5,
  },
  activeLable: {
    marginLeft: 10,
  },
});
