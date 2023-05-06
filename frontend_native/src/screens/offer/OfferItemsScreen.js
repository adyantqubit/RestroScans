// Added by Om on 8-4-23
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  Pressable,
  TextInput,
  Alert,
  Image,
} from "react-native";
import React, { useState } from "react";
import {
  updateAllOffer,
  getAllOfferItemList,
  deleteOfferApi,
  deleteOfferItemsApi,
  getAllOfferList,
} from "../../api/Services";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import { colors } from "../../Colours/globalColor";
import config from "../../config/config";
import Icon from "react-native-vector-icons/FontAwesome";
import { useEffect } from "react";
import { useContext } from "react";
import { AppStateContext } from "../../context/AppStateProvider";
import { useIsFocused } from "@react-navigation/native";
import Footer from "../../components/Footer/Footer";
import { MaterialIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import Checkbox from "expo-checkbox";
import { addOfferSchema } from "../../validation/ValidationSchema";

export default function OfferItemsScreen({ route, navigation }) {
  const { banner, bannerId } = route.params;

  const [tempPhoto, setTempPhoto] = useState(null);
  const [icon, setImage] = useState(null);
  var [isDisable, setIsDisable] = useState(false);

  const isFocused = useIsFocused();
  var { render, setRender } = useContext(AppStateContext);

  useEffect(() => {
    getAllOfferItems();
  }, [isFocused]);

  var [bannerObject, setBannerObject] = useState(banner);
  var [bannerItemList, setBannerItemList] = useState([]);

  // Added by Yuvraj Sahu on 26-4-2023
  // Reason - to set offer object
  var [offerObj, setOfferObj] = useState({});
  // End of adiition

  const getAllOfferItems = async () => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    // Added and commented by Yuvraj Sahu on 26-4-2023
    // Reason - to get offers with offer items
    // var response = await getAllOfferItemList(tenant);
    var response = await getAllOfferList(tenant);
    // End of addition
    if (response) {
      var offerItemList = response.offerItemList.filter(
        (dt) => dt.offer_name == bannerObject.offer_name
      );
      setBannerItemList(offerItemList);

      // Added by Yuvraj Sahu on 26-4-2023
      // Reason - to get banner object and checkbox
      var offerObj = response.offerBanner.filter((dt) => dt.id == bannerId)[0];
      setOfferObj(offerObj);
      var showVideoChecked = offerObj.show_video_Hide_Image;
      setIsShowVideo(showVideoChecked);
      // End of addition
    }
  };

  /* This is add for show image limit validation msg */
  var [isFileSizeError, setFileSizeError] = useState(false);
  /* End of addition */

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [10, 4], // Aspect changes by Om on 22-04-23 because we need to set the offer image size
      quality: 1,
      base64: true,
    });
    /**
     * Modified by yuvraj Sahu on 05-05-2023
     * Reason - to img not upload if img size is bigger
     */
    // Added by Suman Sahu on 29-4-2023
    // Reason - to show validation msg image filed when user upload image above 200kb
    /**
     * Commeted and Modified by yuvraj Sahu on 05-05-2023
     * Reason - to give image size validation
     */
    // const fileSize = result.assets[0].base64.length * (3 / 4) - 2;
    const fileSize = (result.assets[0].base64.length + 2 * 4) / 3;
    /**
     * End of comment by Yuvraj Sahu on 05-05-2023
     */ if (fileSize > 200000) {
      setFileSizeError(true);
    } else {
      if (!result.canceled) {
        setFileSizeError(false);
        setImage(result.assets[0].uri);
        setTempPhoto(result.assets[0]);
      }
    }
    /**
     * End of modification by Yuvraj Sahu on 05-05-2023
     */
  };
  // End upload image

  // Added by Yuvraj Sahu on 26-4-2023
  // Reason - to add show image hide image
  const [isShowVideo, setIsShowVideo] = useState(false);
  // End of addition

  // Update the valuesss
  const handleRegister = async (formValues) => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    var formData = new FormData();

    if (icon != null) {
      const ext = tempPhoto.uri.substring(tempPhoto.uri.lastIndexOf(".") + 1);
      formData.append("offer_image", {
        uri: icon,
        name: icon,
        type: `image/${ext}`,
      });
    }
    formData.append("offer_name", formValues.offer_name);
    formData.append("discount", formValues.discount);
    formData.append("video_link", formValues.video_link);
    formData.append("description", formValues.description);
    formData.append("show_video_Hide_Image", isShowVideo);

    // Modify by- Suman sahu  On 29/04/2023
    // Reason- add condition for image field when user upload image above 200kb form not saved
    if (isFileSizeError == false) {
      updateAllOffer(formData, tenant, bannerObject.id).then((response) => {
        if (response.msg) {
          // Modified by Om on 14-04-23
          // Reason : Correct the spelling of success

          // Modified by- Suman sahu  On 24/04/2023
          // Reason- Remove "successfull" text on success msg

          // Alert.alert("Successfull", response.msg);
          Alert.alert(response.msg);

          // End of modified code 24/04/2023

          // End of modfication
          // setRender(!render);
        }
        if (response.error) {
          Alert.alert(response.error);
        }
      });
    }
  };

  // Added by Om on 07-04-23
  // Reason : To delete the menu section
  const deleteBanner = async () => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;

    deleteOfferApi(tenant, bannerObject.id).then((response) => {
      if (response.msg) {
        // Modified by- Suman sahu  On 24/04/2023
        // Reason- Remove "successfull" text on deleted msg

        // Alert.alert("Successfull", response.msg);
        Alert.alert(response.msg);
        // setRender(!render);
        // End of modified code 24/04/2023
        navigation.pop();
      }
      if (response.error) {
        Alert.alert(response.error);
      }
    });
  };

  function deleteBannerPermission() {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this banner/offer?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            deleteBanner();
          },
        },
      ]
    );
  }
  // End of addition
  // const {
  //   control,
  //   handleSubmit,
  //   reset,
  //   setValue,
  //   getValues,
  //   getFieldState,
  //   formState: { errors },
  // } = useForm({
  //   defaultValues: {
  //     offer_name: bannerObject.offer_name,
  //     discount: `${!bannerObject.discount ? "0" : bannerObject.discount}`, //Modified by Om for set the null value to 0
  //   },
  // });

  function deleteBannerItemPermission(bannerItemId) {
    Alert.alert("Confirmation", "Are you sure you want to delete this item?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          deleteBannerItem(bannerItemId);
        },
      },
    ]);
  }
  const deleteBannerItem = async (bannerItemId) => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;

    deleteOfferItemsApi(tenant, bannerItemId).then((response) => {
      if (response.msg) {
        // Modified by- Suman sahu  On 24/04/2023
        // Reason- Remove "successfull" text on deleted msg

        // Alert.alert("Succesfull", response.msg);
        Alert.alert(response.msg);

        // End of modified code 24/04/2023

        setRender(!render);
        navigation.pop();
      }
      if (response.error) {
        Alert.alert("Error", response.error);
      }
    });
  };

  return (
    <>
      {/* Added byYuvraj Sahu on 27-4-2023
    Reason - to click at one time on button when cursor stays on input */}
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* End of addition - button click */}
        <View style={styles.container}>
          {/* Commeted and added by Yuvraj Sahu on 26-4-2023
          Reason - to change form into formik */}

          {/* <View style={{ marginTop: 5 }}>
            <Text style={styles.labels}>Banner/Offer name</Text>
            <Controller
              control={control}
              name="offer_name"
              rules={{
                required: {
                  value: true,
                  message: "Banner/Offer name is required",
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
                      placeholder="Enter item name"
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
            <Text>Banner/Offer image</Text>
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
              flexDirection: "row",
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
            {!icon && bannerObject.offer_image && (
              <Image
                source={{
                  uri: config.staticBaseURL + bannerObject.offer_image,
                }}
                style={{ width: 50, height: 40, borderRadius: 5 }}
              />
            )}
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
                      placeholder="Enter Discount"
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

          <View style={styles.btns}>
            <Pressable
              onPress={handleSubmit(handleRegister)}
              disabled={isDisable}
              style={{
                backgroundColor: isDisable ? "grey" : colors.btnColor,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 7,
                width: 165,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Save changes
              </Text>
            </Pressable>
            <Pressable
              onPress={deleteBannerPermission}
              disabled={isDisable}
              style={{
                backgroundColor: isDisable ? "grey" : colors.anotherButton,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 7,
                marginLeft: 20,
                width: 165,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Delete
              </Text>
            </Pressable>
          </View> */}

          {/* End of comment */}

          {/* ----------------------------- formik 23-4-2023 ------------------------------ */}
          <Formik
            enableReinitialize={true}
            initialValues={{
              offer_name: offerObj.offer_name,
              // Modified by Yuvraj Sahu on 28-4-2023
              // Reason - to set not null value
              discount:
                "" + offerObj.discount != undefined && offerObj.discount,
              // End of modification
              //   Added by Yuvraj Sahu on 26-4-2023
              //   Reason - to add more fields
              // Commented by Yuvraj Sahu on 04-05-2023
              // Reason - to remove show video code for not
              // re-fresh the form value when we press the checkbox
              // show_video_Hide_Image: isShowVideo,
              // End of Comment by yuvraj Sahu on 04-05-2023
              video_link: offerObj.video_link,
              description: offerObj.description,
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
                  <Text>Banner/Offer image</Text>
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
                    flexDirection: "row",
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
                  {!icon && bannerObject.offer_image && (
                    <Image
                      source={{
                        uri: config.staticBaseURL + bannerObject.offer_image,
                      }}
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
                      fontSize: 12,
                    }}
                  >
                    Please upload image below 200kb
                  </Text>
                </View>
                {/* End of added code 26/04/2023 */}

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
                      {/* Modified by yuvraj Sahu on 05-05-2023
                      Reason - to change the video checkbox lable */}
                      Show video
                      {/* End of Modification by Yuvraj Sahu on 05-05-2023 */}
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
                      width: 140,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      Save changes
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={deleteBannerPermission}
                    disabled={isDisable}
                    // Modified by- Suman sahu  On 26/04/2023
                    // Reason - for redesign buttons styles
                    style={{
                      backgroundColor: isDisable
                        ? "grey"
                        : // : colors.anotherButton,
                          colors.btnColor, // for change color- by Suman sahu

                      height: 30,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 10,
                      marginLeft: 20,
                      width: 140,
                    }}
                    // End of modified code 26/04/2023
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      Delete
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </Formik>
          {/* -------------------------- End formik -------------------------------------- */}

          {/* ------------------------ Offer items ----------------------------- */}
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLable}>
              Items inside this Banner/Offer {bannerObject.name}
            </Text>
            {bannerItemList.length > 0 ? (
              <>
                {bannerItemList.map((setData, id) => (
                  <View key={id} style={styles.categoryListContainer}>
                    <Image
                      source={{
                        uri: config.staticBaseURL + setData.item_image,
                      }}
                      style={styles.menuIcon}
                    />
                    <Text>{setData.item_name}</Text>
                    <Pressable
                      onPress={(e) => deleteBannerItemPermission(setData.id)}
                    >
                      <MaterialIcons name="delete" size={24} color="red" />
                    </Pressable>
                  </View>
                ))}
              </>
            ) : (
              // Modified by Om on 19-04-23
              <View
                style={{
                  height: 200,
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                <Text>No items are listed here</Text>
              </View>
              // End of addtion
            )}
          </View>
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
    paddingHorizontal: 10,
    backgroundColor: "white",
    paddingTop: 10,
  },
  mainHeader: {
    marginTop: 10,
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
    height: 45,
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
  categoryContainer: {
    backgroundColor: "#ffebcc",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  menuIcon: {
    height: 50,
    width: 70,
    borderRadius: 5,
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
    // marginVertical: 10,
    shadowColor: "#171717",
    shadowOffset: { width: -3, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  categoryLable: {
    fontSize: 18,
    fontWeight: "bold",
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
  // Modification by Om on 15-04-23
  // Reason : Fix the image validation
  btns: {
    alignSelf: "center",
    marginBottom: 20,
    flexDirection: "row",
    marginTop: 10,
  },
  // End of modification

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
