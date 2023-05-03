// Created by Om on 08-04-2023
// Reason - to create banner section

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  Pressable,
  Button,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";

import { useForm, Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { saveAllOffer } from "../../api/Services";
import { colors } from "../../Colours/globalColor";
import { useContext } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import Footer from "../../components/Footer/Footer";
import { AppStateContext } from "../../context/AppStateProvider";
import { Formik } from "formik";
import Checkbox from "expo-checkbox";
import { addOfferSchema } from "../../validation/ValidationSchema";
import { useIsFocused } from "@react-navigation/native";

export default function AddOfferScreen() {
  /**
   * Added by Yuvraj Sahu on 30-4-2023
   * Reason - to re render the screen
   */
  const isFocused = useIsFocused();
  /**
   * End of addition
   */

  var [isDisable, setIsDisable] = useState(false);

  const [tempPhoto, setTempPhoto] = useState(null);

  const [icon, setImage] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  var [isImgRequired, setImgRequired] = useState(false);

  var { render, setRender } = useContext(AppStateContext);

  /* This is add for show image limit validation msg */
  var [isFileSizeError, setFileSizeError] = useState(false);
  /* End of addition */

  // This method helps to pick the image functionality
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [10, 4], // Aspect changes by Om on 22-04-23 because we need to set the offer image size
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setUploadedFileName(result.assets[0].fileName);
      setTempPhoto(result.assets[0]);
      setImgRequired(false);

      // Added by Suman Sahu on 29-4-2023
      // Reason - to show validation msg image filed when user upload image above 200kb
      const fileSize = result.base64.length * (3 / 4) - 2;
      if (fileSize > 200000) {
        setFileSizeError(true);
      } else {
        setFileSizeError(false);
      }
      // End of addition 29-04-2023
    }
  };

  /**
   * Added by Yuvraj Sahu on 03-05-2023
   * Reason - to re-fresh the validation
   * msg when we come back from another screen
   */
  const formRef = useRef(null);
  /**
   * End of refreshing validation msg
   */

  /**
   * Added by Yuvraj Sahu on 30-4-2023
   * Reason - to re render the screen
   */
  useEffect(() => {
    setImage(null);
    /**
     * Added by Yuvraj Sahu on 03-05-2023
     * Reason - to re-fresh the validation
     * msg when we come back from another screen
     */
    formRef.current.setErrors({});
    formRef.current.resetForm({});
    setIsShowVideo(false);
    setFileSizeError(false);
    /**
     * End of refreshing validation msg
     */
    getTenant();
  }, [isFocused]);
  /**
   * End of modification
   */

  // Need to set the tenant name
  var [tenant, setTenant] = useState("");
  var [menuList, setMenuList] = useState([]);
  const getTenant = async () => {
    var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
    setTenant(JSON.parse(tenantInfo).tenant_name);
  };

  // Added by Yuvraj Sahu on 26-4-2023
  // Reason - to add show image hide image
  const [isShowVideo, setIsShowVideo] = useState(false);
  // End of addition

  // Post method call in this functiona
  //   Modified by Yuvraj Sahu on 26-4-2023
  //   Reason - to change method for changing form
  const handleRegister = async (formValues, { resetForm }) => {
    var formData = new FormData();
    // Modification by Om on 15-04-23
    // Reason : Fix the image validation
    // const ext = tempPhoto.uri.substring(tempPhoto.uri.lastIndexOf(".") + 1);
    // formData.append("offer_image", {
    //     uri: icon,
    //     name: icon,
    //     type: `image/${ext}`,
    // });

    if (icon != null) {
      const ext = tempPhoto.uri.substring(tempPhoto.uri.lastIndexOf(".") + 1);
      formData.append("offer_image", {
        uri: icon,
        name: icon,
        type: `image/${ext}`,
      });
    } else {
      setImgRequired(true);
    }
    // End of addition

    formData.append("offer_name", formValues.offer_name);
    formData.append("discount", formValues.discount);

    // Added by Yuvraj Sahu on 26-4-2023
    // Reason - to add more fields
    formData.append("video_link", formValues.video_link);
    formData.append("description", formValues.description);
    formData.append("show_video_Hide_Image", isShowVideo);
    // formData.append("offer_name", formValues.offer_name);
    // End of addition

    // Modification by Om on 15-04-23
    // Reason : Fix the image validation

    // Modify by- Suman sahu  On 29/04/2023
    // Reason- add condition for image field when user upload image above 200kb form not saved
    if (icon != null && isFileSizeError == false) {
      saveAllOffer(formData, tenant).then((response) => {
        if (response.msg) {
          Alert.alert(response.msg);
          // resetField("offer_name");
          // resetField("discount");
          // resetField("offer_image");
          //   setRender(!render);

          //   Added by Yuvraj Sahu on 26-4-2023
          //   reason - to reset form
          //   reset(""); // Add the Reset functionality by Om on 15-04-23
          resetForm("");
          setIsShowVideo(false);
          // end of reset form

          setImage(null);
        }
        // if (response.err) {
        //     Alert.alert("Error", response.err);
        // }
        else {
          // if (response.error) {
          //     alert(response.error)
          // End of modification
          Alert.alert("Something went wrong");
          //  End of addition
          // setIsDisable(false);
        }
      });
    }
  };

  // Set the values in this method

  //Commeted by Yuvraj Sahu on 26-4-2023
  // Reason - to change the form into formik
  // const {
  //   control,
  //   // resetField,
  //   reset, // Add the Reset functionality by Om on 15-04-23
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm({
  //   defaultValues: {
  //     offer_name: "",
  //     discount: "",
  //     offer_image: "",
  //   },
  // });
  // End of comment

  return (
    <>
      {/* Added byYuvraj Sahu on 27-4-2023
    Reason - to click at one time on button when cursor stays on input */}
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* End of addition - button click */}
        <View style={styles.container}>
          {/* Commented and Added by Yuvraj Sahu on 26-4-2023
            Reason - to remove react hook forn and use formik */}
          {/* <View style={{ marginTop: 5 }}>
            <Text style={styles.labels}>
              <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
              Banner/Offer name
            </Text>
            <Controller
              control={control}
              name="offer_name"
              rules={{
                required: {
                  value: true,
                  message: "Banner/Offer name is required",
                },
                // Added by Om on 22-04-23 For fix the banner/offer length size
                pattern: {
                  value: /^[a-z|A-Z | 0-9 | !@]{1,38}$/,
                  message:
                    "Banner/Offer name should not be more than 40 characters",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <View>
                    <TextInput
                      style={styles.input}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="Enter banner/offer name"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry={false}
                      placeholderTextColor="#A4A4A4"
                      editable={true}
                      keyboardType="default"
                    />
                  </View>

                  {errors?.offer_name && (
                    <Text style={styles.textdanger}>
                      {errors?.offer_name?.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>

          <View style={{ marginTop: 5 }}>
            <Text style={styles.labels}>Discount(%)</Text>
            <Controller
              control={control}
              name="discount"
              rules={{
                pattern: {
                  value: /^\d{0,2}$/,
                  message: "Discount is not valid",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <View>
                    <TextInput
                      style={styles.input}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="Enter discount"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry={false}
                      placeholderTextColor="#A4A4A4"
                      editable={true}
                      keyboardType="number-pad"
                    />
                  </View>
                  {errors?.discount && (
                    <Text style={styles.textdanger}>
                      {errors?.discount?.message}
                    </Text>
                  )}
                </>
              )}
            />
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
            <Text>Upload image</Text>
          </View>
          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              // borderColor: 'black',
              borderRadius: 3,
              // borderWidth: 1,
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
          {isImgRequired && (
            <Text style={{ color: "red", marginLeft: 87, marginTop: 8 }}>
              Banner/Offer image is required
            </Text>
          )}
          <View style={styles.btns}>
            <Pressable
              onPress={handleSubmit(handleRegister)}
              disabled={isDisable}
              style={{
                // backgroundColor: isDisable ? "grey" : colors.btnColor,
                backgroundColor: isDisable ? "grey" : colors.btnColor,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 3,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Save
              </Text>
            </Pressable>
          </View> */}
          {/* End of removal */}

          {/* ----------------------------- formik 23-4-2023 ------------------------------ */}
          <Formik
            /** Added by Yuvraj Sahu on 03-05-2023
             * Reason - to refresh the validation msg
             */
            innerRef={formRef}
            /** End of refreshing validation msg */
            // enableReinitialize={true}
            initialValues={{
              offer_name: "",
              discount: "",
              //   Added by Yuvraj Sahu on 26-4-2023
              //   Reason - to add more fields
              // show_video_Hide_Image: "",
              video_link: "",
              description: "",
              // End of addition
            }}
            // validateOnMount={true}
            validationSchema={addOfferSchema}
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
              // Modified by Yuvraj Sahu on 20-4-2023
              // Reason - to design screen
              // <ScrollView style={styles.container}>
              <View>
                <View>
                  <Text style={styles.labels}>
                    <Text style={{ color: "red", fontWeight: "650" }}> *</Text>
                    Offer name
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("offer_name")}
                    onBlur={handleBlur("offer_name")}
                    value={values.offer_name}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Enter Offer name"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  {errors.offer_name && touched.offer_name && (
                    <Text style={styles.textdanger}>{errors.offer_name}</Text>
                  )}
                </View>

                <View style={{ marginTop: 10 }}>
                  <Text style={styles.labels}>
                    {/* <Text style={{ color: "red", fontWeight: "650" }}> *</Text> */}
                    {"  "}Discount
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("discount")}
                    onBlur={handleBlur("discount")}
                    value={values.discount}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Enter Discount"
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  {errors.discount && touched.discount && (
                    <Text style={styles.textdanger}>{errors.discount}</Text>
                  )}
                </View>

                {/* Added by Yuvraj Sahu on 26-4-2023
                Reason - to add more fields */}

                <View>
                  <Text style={styles.labels}>{"  "} Video Link</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("video_link")}
                    onBlur={handleBlur("video_link")}
                    value={values.video_link}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Enter Video Link"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  {errors.video_link && touched.video_link && (
                    <Text style={styles.textdanger}>{errors.video_link}</Text>
                  )}
                </View>

                <View>
                  <Text style={styles.labels}>{"  "} Description</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("description")}
                    value={values.description}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Enter Description"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  {errors.description && touched.description && (
                    <Text style={styles.textdanger}>{errors.description}</Text>
                  )}
                </View>

                {/* End of addition */}

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
                  <Text>Upload image</Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    // borderColor: 'black',
                    borderRadius: 3,
                    // borderWidth: 1,
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
                {/* Added by- Suman sahu  On 26/04/2023
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
                {/* End of added code 26/04/2023 */}
                {isImgRequired && (
                  <Text style={{ color: "red", marginLeft: 87, marginTop: 8 }}>
                    Banner/Offer image is required
                  </Text>
                )}

                {/* Added by Suman Sahu on 29-04-2023
                    Reason - to show validation msg image filed when user upload image above 200kb */}
                {isFileSizeError && (
                  <Text style={{ color: "red", marginLeft: 70 }}>
                    Please upload image below 200kb
                  </Text>
                )}
                {/* End of addition  29-04-2023*/}

                {/* Added by Yuvraj Sahu on 26-4-2023
                Reason - to add more fields */}
                <View style={styles.showVideo}>
                  <Checkbox
                    value={isShowVideo}
                    onValueChange={setIsShowVideo}
                    color={isShowVideo ? "#4630EB" : undefined}
                  />
                  <Pressable onPress={() => setIsShowVideo(!isShowVideo)}>
                    <Text style={styles.showVideoLable}>
                      Show video hide image
                    </Text>
                  </Pressable>
                </View>
                {/* End of addition */}

                <View style={styles.btns}>
                  <Pressable
                    onPress={handleSubmit}
                    disabled={isDisable}
                    style={{
                      // backgroundColor: isDisable ? "grey" : colors.btnColor,
                      backgroundColor: isDisable ? "grey" : colors.btnColor,
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
                        color: "white",
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
          {/* -------------------------- End formik -------------------------------------- */}
        </View>
      </ScrollView>
      {/* Added by Om on 18-04-23 For showing the footer*/}
      <Footer />
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
  },
  mainHeader: {
    marginTop: 10,
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
    borderRadius: 10,
  },
  labels: {
    paddingHorizontal: 10,
  },
  textdanger: {
    color: "#dc3545",
    marginBottom: 10,
    paddingHorizontal: 10,
    // Added by Yuvraj Sahu on 01-05-2023
    // Reason - to design validation msg
    marginTop: -10,
    // End of addition of yuvraj - 01-05-2023
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
  // Modification by Om on 15-04-23
  // Reason : Fix the image validation
  btns: {
    // width: 190,
    // alignSelf: "center",
    // marginTop: 10,
    // marginBottom: 20,
    marginBottom: 30,
    marginHorizontal: 10,
    marginTop: 10,
    // End of modification
  },
  // Added by Yuvraj Sahu on 26-4-2023
  // Reason - to design checkbox
  showVideo: {
    display: "flex",
    flexDirection: "row",
    width: "93%",
    alignSelf: "center",
    marginTop: 5,
  },
  showVideoLable: {
    marginLeft: 10,
  },
  // End of addition
});
