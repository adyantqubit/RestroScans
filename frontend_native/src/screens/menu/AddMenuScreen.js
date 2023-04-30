import React, { useState, useEffect, useContext } from "react";
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
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useForm, Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import {
  getMenuList,
  saveMenuApi,
  savePaymentMethodApi,
} from "../../api/Services";
import { colors } from "../../Colours/globalColor";
import { AppStateContext } from "../../context/AppStateProvider";
import Checkbox from "expo-checkbox";
import Footer from "../../components/Footer/Footer";
import { Formik } from "formik";
import { useIsFocused } from "@react-navigation/native";
import { addMenuSchema } from "../../validation/ValidationSchema";
// import { tenantName } from "../config/config";
// import { Country, State, City } from "country-state-city";

export default function AddMenuScreen() {
  // Commeted by Yuvraj Sahu on 27-4-2023
  // Reason - to remove use form
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
  //     name: "",
  //   },
  // });

  // var [isDisable, setIsDisable] = useState(false);
  // End of comment

  const [tempPhoto, setTempPhoto] = useState(null);

  /**
   * Added by Yuvraj Sahu on 23-4-2023
   * Reason - to show and hide validation msg
   */
  /**
   * This is add for image validation msg show and hide
   */
  var [isImgRequired, setImgRequired] = useState(false);
  /**
   * End of addition
   */
  /* This is add for show image limit validation msg */
  var [isFileSizeError, setFileSizeError] = useState(false);
  /* End of addition */

  var { render, setRender } = useContext(AppStateContext);

  useEffect(() => {}, [render]);

  const [icon, setImage] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      // Modified by Yuvraj Sahu on 28-4-2023
      // Reason - to add same width and height on image
      aspect: [4, 4],
      // End of modification
      base64: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // alert(result.assets[0].fileName);
      setUploadedFileName(result.assets[0].fileName);
      setTempPhoto(result.assets[0]);
      // setTempPhoto(result.assets[0]);
      // Added by Yuvraj Sahu on 23-4-2023
      // Reason - to hide validation msg
      setImgRequired(false);
      // End of addition

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

  // Added by Yuvraj Sahu on 26-3-2023
  // Reason - to re render app
  // let [state, setState] = useState("")
  // useEffect(()=>{
  //   getAllMenuList();
  // },[state])
  // End of re render

  useEffect(() => {
    getTenant();
    // getAllMenuList()
  }, []);
  // Added by Yuvraj Sahu on 25-3-2023
  // Reason - to get tenant from localStorage
  var [tenant, setTenant] = useState("");
  // Commented by Yuvraj on 17-4-2023
  // Reason - to remove
  // var [menuList, setMenuList] = useState([]);
  // End of addition
  const getTenant = async () => {
    var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
    setTenant(JSON.parse(tenantInfo).tenant_name);
  };
  // const getAllMenuList = async () => {
  //   // const response = await getMenuList("ashoka");
  //   const response = await getMenuList("nityafood");
  //   if (response) {
  //     // setState("state")
  //     setMenuList(response.menuList);
  //     // setCategoryList(response.categoryList);
  //     // setItemList(response.itemList);
  //     // setFilterCategory(response.categoryList);
  //   }
  // };
  // End of getting tenant detail

  // Added by Yuvraj Sahu on 12-4-2023
  // Reason - to save active status
  const [isMenuActive, setMenuActive] = useState(false);
  // End of addition

  // const handleRegister = async (formValues) => {
  //   var formData = new FormData();

  //   const ext = tempPhoto.uri.substring(tempPhoto.uri.lastIndexOf(".") + 1);

  //   formData.append("icon", {
  //     uri: icon,
  //     name: icon,
  //     type: `image/${ext}`,
  //   });

  //   formData.append("name", formValues.name);
  //   // Added by Yuvraj Sahu on 12-4-2023
  //   // Reason - to save active status
  //   formData.append("is_active", isMenuActive);
  //   // End of addition

  //   saveMenuApi(formData, tenant).then((response) => {
  //     if (response.msg) {
  //       Alert.alert("Succesfull", response.msg);
  //       setRender(!render);
  //       reset("");
  //       setImage(null);
  //       setMenuActive(false);
  //       // navigate('login')
  //       // setState("stateChanged")
  //     }
  //     if (response.err) {
  //       Alert.alert("Error", response.err);
  //     }
  //   });
  // };

  // ------------------------- formik regitration ------------------------
  const isFocused = useIsFocused();
  useEffect(() => {
    setImage(null);
  }, [isFocused]);
  var [isSaveBtnDisable, setSaveBtnDisable] = useState(false);
  const handleRegister = async (values, { resetForm }) => {
    // setSaveBtnDisable(true);
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;

    var formData = new FormData();
    if (icon != null) {
      const ext = tempPhoto.uri.substring(tempPhoto.uri.lastIndexOf(".") + 1);
      formData.append("icon", {
        uri: icon,
        name: icon,
        type: `image/${ext}`,
      });
    }
    if (!icon) {
      setImgRequired(true);
    }
    formData.append("name", values.name);
    formData.append("is_active", isMenuActive);

    // Modify by- Suman sahu  On 29/04/2023
    // Reason- add condition for image field when user upload image above 200kb form not saved
    if (icon != null && isFileSizeError == false) {
      saveMenuApi(formData, tenant).then(async (res) => {
        if (res.msg) {
          setSaveBtnDisable(false);
          Alert.alert(res.msg);
          resetForm({ values: "" });
          setImage(null);
          setFileSizeError(false);
          setMenuActive(false);
        } else if (res.error) {
          setSaveBtnDisable(false);
          Alert.alert(res.error);
        } else {
          setSaveBtnDisable(false);
          Alert.alert("Something Went Wrong");
        }
      });
    }
    // End of modification 29/04/2023
  };
  // ----------------------End of formik registration--------------------

  return (
    <>
      {/* Added byYuvraj Sahu on 27-4-2023
    Reason - to click at one time on button when cursor stays on input */}
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* End of addition - button click */}
        <View style={styles.container}>
          {/* <View>
            <View style={{ marginTop: 5 }}>
              <Text style={styles.labels}>
                <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
                Menu name
              </Text>
              <Controller
                control={control}
                name="name"
                rules={{
                  required: {
                    value: true,
                    message: "Menu name is required",
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
                        placeholder="Enter menu name"
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry={false}
                        placeholderTextColor="#A4A4A4"
                        editable={true}
                        keyboardType="default"
                      />
                    </View>

                    {errors?.name && (
                      <Text style={styles.textdanger}>
                        {errors?.name?.message}
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

            <View style={styles.activeStatus}>
              <Pressable onPress={() => setMenuActive(!isMenuActive)}>
                <Text style={styles.activeLable}>Menu available</Text>
              </Pressable>
              <Checkbox
                value={isMenuActive}
                onValueChange={setMenuActive}
                color={isMenuActive ? "#4630EB" : undefined}
              />
            </View>
            <View
              style={{ marginBottom: 30, marginHorizontal: 10, marginTop: 10 }}
            >
              <Pressable
                onPress={handleSubmit(handleRegister)}
                disabled={isDisable}
                style={{
                  backgroundColor: isDisable ? "grey" : colors.btnColor,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  // Added by Yuvraj Sahu on 16-4-2023
                  // Reason - to re-design button
                  width: "40%",
                  borderRadius: 10,
                  alignSelf: "center",
                  // End of re-designing
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
          </View> */}

          {/* ----------------------------- formik 23-4-2023 ------------------------------ */}

          <Formik
            // enableReinitialize={true}
            initialValues={{
              name: "",
            }}
            // validateOnMount={true}
            validationSchema={addMenuSchema}
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
                    Menu name
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("name")}
                    // Added by- Suman sahu  On 24/04/2023
                    // Reason- show error message when focusout the input box
                    onBlur={handleBlur("name")}
                    // End of added code 24/04/2023

                    value={values.name}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Enter Menu name"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  {errors.name && touched.name && (
                    <Text style={styles.textdanger}>{errors.name}</Text>
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
                      fontSize: 12,
                    }}
                  >
                    Please upload image below 200kb
                  </Text>
                  {/* End of added code 26/04/2023 */}
                </View>
                {isImgRequired && (
                  // Modified by- Suman sahu  On 23/04/2023
                  // Reason- To show error messages in the center

                  // <Text style={{ color: "red", marginLeft: 10 }}>
                  //   Menu icon is required!
                  // </Text>

                  <Text style={{ color: "red", marginLeft: 100 }}>
                    Menu icon is required!
                  </Text>

                  // End of modified code 23/04/2023
                )}

                {/* Added by Suman Sahu on 29-04-2023
                    Reason - to show validation msg image filed when user upload image above 200kb */}
                {isFileSizeError && (
                  <Text style={{ color: "red", marginLeft: 70 }}>
                    Please upload image below 200kb
                  </Text>
                )}
                {/* End of addition  29-04-2023*/}

                <View style={styles.activeStatus}>
                  <Checkbox
                    value={isMenuActive}
                    onValueChange={setMenuActive}
                    color={isMenuActive ? "#4630EB" : undefined}
                  />
                  <Pressable onPress={() => setMenuActive(!isMenuActive)}>
                    <Text style={styles.activeLable}>Menu available</Text>
                  </Pressable>
                </View>

                <View
                  // Modified by - Suman sahu On 23/04/2023
                  // Reason - add some padding above save button

                  // style={{
                  //   marginBottom: 30,
                  //   marginHorizontal: 10,
                  //   marginTop: 10,
                  // }}

                  style={{
                    marginBottom: 30,
                    marginHorizontal: 10,
                    marginTop: 15,
                  }}

                  // End of modified code 23/04/2023
                >
                  <Pressable
                    onPress={handleSubmit}
                    disabled={isSaveBtnDisable}
                    // Modified by- Suman sahu  On 26/04/2023
                    // Reason - for redesign buttons styles
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
                    // End of modified code 24/04/2023
                  >
                    <Text
                      style={{
                        // color: !isBtnDisable ? "white" : "#989898",
                        color: isSaveBtnDisable ? "#989898" : colors.white,
                        // color: colors.white,
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
    paddingTop: 10,
  },
  mainHeader: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    height: 41,
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
    marginTop: -10,
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
  },
  activeLable: {
    marginLeft: 10,
  },
});
