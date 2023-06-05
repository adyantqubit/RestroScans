/**
 * Added by yuvraj Sahu on 28-05-2023
 * Reason - to show all social links and save new social media
 */

import { View, Text, Pressable, Alert, ScrollView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import { addSocialMedia } from "../../validation/ValidationSchema";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import {
  deteleSocialMediaApi,
  getSocialMediaApi,
  saveSocialMediaApi,
} from "../../api/Services";
import { TextInput } from "react-native";
import { colors, inputs } from "../../Colours/globalColor";
import Icon from "react-native-vector-icons/FontAwesome";
import { StyleSheet } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Image } from "react-native";
import SocialMediaList from "./SocialMediaList";
import config from "../../config/config";
import { MaterialIcons } from "@expo/vector-icons";

export default function SocialLinkScreen({ navigation }) {
  const formRef = useRef(null);

  var [isFileSizeError, setFileSizeError] = useState(false);
  const [icon, setImage] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  var [isImgRequired, setImgRequired] = useState(false);
  var [isFileSizeError, setFileSizeError] = useState(false);
  var [isSaveBtnDisable, setSaveBtnDisable] = useState(false);
  const [tempPhoto, setTempPhoto] = useState(null);
  /**
   * Added by Yuvraj Sahu on 28-05-2023
   * Reason - to set all latest added social links after new saved social media data
   */
  var [socialLinkObjs, setSocialLinkObjs] = useState([]);
  /**
   * End of addition by Yuvraj Sahu on 28-05-2023
   */
  /**
   * Added by Yuvraj Sahu on 28-05-2023
   * Reason - to set all latest added social links after new saved social media data
   */
  var [socialLinkObjs, setRenderMsg] = useState("");
  /**
   * End of addition by Yuvraj Sahu on 28-05-2023
   */

  const isFocused = useIsFocused();

  useEffect(() => {
    formRef.current.resetForm({});
    setImgRequired(false);
    setImage(null);
    setFileSizeError(false);
    formRef.current.setErrors({});
    setSaveBtnDisable(false);

    getSocialLinks();
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

    if (icon != null && isFileSizeError == false) {
      setSaveBtnDisable(true);
      // if (categoryName != "") {
      saveSocialMediaApi(formData, tenant).then(async (res) => {
        if (res.msg) {
          setSaveBtnDisable(false);
          Alert.alert(res.msg);
          resetForm({ values: "" });
          setImage(null);
          setFileSizeError(false);
          // setSocialLinkObjs(res.SocialLinkObjs)
          setSocialLinks(res.SocialLinkObjs);
          setRenderMsg(res.msg);
        } else if (res.error) {
          setSaveBtnDisable(false);
        } else {
          setSaveBtnDisable(false);
          Alert.alert("Something went wrong");
        }
      });
    }
  };

  // --------------- nesting navigation method and logics ------------------
  var [socialLinks, setSocialLinks] = useState([]);

  const getSocialLinks = async () => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    var response = await getSocialMediaApi(tenant);
    if (response.msg) {
      setSocialLinks(response.social);
    }
  };

  const deleteSocialLink = async (socialLinkID) => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    deteleSocialMediaApi(tenant, socialLinkID).then((response) => {
      if (response.msg) {
        // Alert.alert(response.msg);
        // navigation.pop();
        setSocialLinks(response.socialData);
      }
      if (response.error) {
        Alert.alert("Error", response.error);
      }
    });
  };

  function deletePermission(socialLinkID) {
    Alert.alert("Confirmation", "Are you sure you want to delete this item?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          deleteSocialLink(socialLinkID);
        },
      },
    ]);
  }

  const handleNavigation = async (socialID, socialObject) => {
    navigation.navigate("EditSocialMediaFormScreen", {
      socialID: socialID,
      SocialMediaObj: socialObject,
    });
    // navigation.navigate("EditSocialMediaFormScreen");
  };

  return (
    <View>
      <ScrollView keyboardShouldPersistTaps="handled">
      <Formik
        innerRef={formRef}
        initialValues={{
          social_media_name: "",
          social_media_link: "",
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

            {isImgRequired && (
              <Text style={{ color: "red", marginLeft: 100 }}>
                Social media icon is required!
              </Text>
            )}

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
                  Save
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </Formik>

      {/* Added by Yuvraj Sahu on 28-05-2023
      Reason - to get all social media */}
      <View>
        {/* <SocialMediaList socialLinks={socialLinkObjs} savedMsg={socialLinkObjs}/> */}
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryLable}>Saved Social media</Text>
          {socialLinks.length > 0 ? (
            <>
              {socialLinks.map((socialLink, id) => (
                <Pressable
                  key={id}
                  style={styles.categoryListContainer}
                  onPress={(e) => handleNavigation(socialLink.id, socialLink)}
                >
                  <Image
                    source={{
                      uri: config.staticBaseURL + socialLink.social_media_icon,
                    }}
                    style={styles.menuIcon}
                  />
                  <Text>{socialLink.social_media_name}</Text>
                  <Pressable onPress={(e) => deletePermission(socialLink.id)}>
                    <MaterialIcons name="delete" size={24} color="red" />
                  </Pressable>
                </Pressable>
              ))}
            </>
          ) : (
            <View
              style={{
                height: 200,
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <Text>No social media saved here</Text>
            </View>
          )}
        </View>
      </View>
      </ScrollView>
      {/* End getting all social media by Yuvraj Sahu on 28-05-2023 */}
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

  // -----------------------------
  categoryContainer: {
    backgroundColor: "#ffebcc",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    minHeight: 250,
    marginHorizontal: 10,
  },

  categoryLable: {
    fontSize: 18,
    fontWeight: "bold",
  },

  categoryListContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: "100%",
    shadowColor: "#171717",
    shadowOffset: { width: -3, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  menuIcon: {
    height: 30,
    width: 30,
    borderRadius: 5,
  },
  // =============================
});
