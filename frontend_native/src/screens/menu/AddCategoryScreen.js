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
import { Ionicons } from "@expo/vector-icons";
import { getMenuList, saveCategoryApi, saveMenuApi } from "../../api/Services";
import { colors } from "../../Colours/globalColor";
// import { tenantName } from "../config/config";
import { SelectList } from "react-native-dropdown-select-list";
import { AppStateContext } from "../../context/AppStateProvider";
import { useIsFocused } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import Footer from "../../components/Footer/Footer";
import {
  addCategorySchema,
  addMenuSchema,
} from "../../validation/ValidationSchema";
import { Formik } from "formik";
import SelectDropdown from "react-native-select-dropdown";
import { AntDesign } from "@expo/vector-icons";

// import { Country, State, City } from "country-state-city";

export default function AddCategoryScreen() {
  // Added by Yuvraj Sahu on 24-3-2023
  // Reason - to show menu list in dropdown
  const isFocused = useIsFocused();
  const [menuSelected, setMenuSelected] = React.useState("");
  var [data, setData] = useState([]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    getFieldState,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      menu: "",
      // icon: ""
    },
  });

  var { render, setRender } = useContext(AppStateContext);

  // Added by Yuvraj Sahu on 14-4-2023
  // Reason - to re render the screen
  useEffect(() => {}, [render]);
  // end of addition

  useEffect(() => {
    getMenus();
    getTenant();
  }, [isFocused]);
  // End of show menu list
  const getMenus = async () => {
    var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
    const response = await getMenuList(JSON.parse(tenantInfo).tenant_name);
    if (response.menuList) {
      setData(
        // Commented and modified by Yuvraj Sahu on 23-4-2023
        // Reason - to set menu in dropdown
        // response.menuList.map(function (obj) {
        //   obj["key"] = obj["id"]; // Assign new key
        //   obj["value"] = obj["name"]; // Rename key
        //   delete obj["id"]; // Delete old key
        //   delete obj["name"]; // Delete name
        //   delete obj["icon"]; // Delete icon
        //   return obj;
        // })
        response.menuList
        // End of modification
      );
    }
  };
  var [isDisable, setIsDisable] = useState(false);

  const [tempPhoto, setTempPhoto] = useState(null);

  const [icon, setImage] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");

  // Added by Yuvraj Sahu on 12-4-2023
  // Reason - to save active status
  const [isCategoryActive, setCatgeoryActive] = useState(false);
  // End of addition

  // Added by Yuvraj Sahu on 25-3-2023
  // Reason - to get tenant from localStorage
  var [tenant, setTenant] = useState("");

  const getTenant = async () => {
    var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
    setTenant(JSON.parse(tenantInfo).tenant_name);
  };
  // End of getting tenant detail

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      // Modified by Yuvraj Sahu on 28-4-2023
      // Reason - to add same width and height on image
      aspect: [4, 4],
      // End of modification
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setUploadedFileName(result.assets[0].fileName);
      setTempPhoto(result.assets[0]);
    }
  };

  // Commented by Yuvraj Sahu on 24-4-2023
  // Reason - to change api calling for chnage form to formik
  // const handleRegister = async (formValues) => {
  //   setIsDisable(true);
  //   var formData = new FormData();
  //   if (icon != null) {
  //     const ext = tempPhoto.uri.substring(tempPhoto.uri.lastIndexOf(".") + 1);
  //     formData.append("icon", {
  //       uri: icon,
  //       name: icon,
  //       type: `image/${ext}`,
  //     });
  //   }
  //   formData.append("name", formValues.name);
  //   formData.append("menu", menuSelected);
  //   // Added by Yuvraj Sahu on 12-4-2023
  //   // Reason - to save active status
  //   formData.append("is_active", isCategoryActive);
  //   // End of addition
  //   var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
  //   saveCategoryApi(formData, JSON.parse(tenantInfo).tenant_name).then(
  //     (response) => {
  //       if (response.msg) {
  //         Alert.alert(response.msg);
  //         setIsDisable(false);
  //         setRender(!render);
  //         reset("");
  //         setImage(null);
  //         setMenuSelected("");
  //         setCatgeoryActive(false);
  //         // navigate('login')
  //       }
  //       if (response.err) {
  //         Alert.alert(response.msg);
  //         setIsDisable(false);
  //       }
  //     }
  //   );
  // };
  // End of comment

  // Added by Yuvraj Sahu on 24-4-2023
  // Reason - to change form to formik
  // ------------------------- formik regitration ------------------------
  // useEffect(() => {}, [isFocused]);
  var [isSaveBtnDisable, setSaveBtnDisable] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  var [categoryRequired, setCategoryRequired] = useState(false);

  const handleRegister = async (values, { resetForm }) => {
    setSaveBtnDisable(true);
    if (categoryName == "") {
      setCategoryRequired(true);
    }
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
    formData.append("name", values.name);
    formData.append("menu", categoryName);
    formData.append("is_active", isCategoryActive);

    // if (icon != null) {
    if (categoryName != "") {
      saveCategoryApi(formData, tenant).then(async (res) => {
        if (res.msg) {
          setSaveBtnDisable(false);
          Alert.alert(res.msg);
          resetForm({ values: "" });
          setImage(null);
          setCatgeoryActive(false);
          setCategoryName("");
        } else if (res.error) {
          setSaveBtnDisable(false);
          // Alert.alert(res.error);
        } else {
          setSaveBtnDisable(false);
          Alert.alert("Something went wrong");
        }
      });
    }
    // }
  };
  // ----------------------End of formik registration--------------------
  // Enf of changeing form

  return (
    <>
      {/* Added byYuvraj Sahu on 27-4-2023
    Reason - to click at one time on button when cursor stays on input */}
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* End of addition - button click */}
        <View style={styles.container}>
          {/* Commented by Yuvraj Sahu on 24-4-2023
        Reason - to change form (formik) */}
          {/* <View style={styles.container}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Select menu name
          </Text>
          <SelectList
            // onSelect={() => }
            setSelected={setMenuSelected}
            data={data}
            search={false}
            dropdownStyles={{
              width: "93%",
              alignSelf: "center",
              marginTop: 1,
            }}
            boxStyles={{
              borderRadius: 0,
              width: "93%",
              alignSelf: "center",
              borderRadius: 5,
              borderColor: "black",
              marginTop: 10,
            }} //override default styles
            // defaultOption={data[0]}
          />
          <View style={{ marginTop: 5 }}>
            <Text style={styles.labels}>
              <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
              Category name
            </Text>
            <Controller
              control={control}
              name="name"
              rules={{
                required: {
                  value: true,
                  message: "Category name is required",
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
                      placeholder="Enter category name"
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
            <Text style={{ marginLeft: 10 }}>Upload icon</Text>
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
            <Checkbox
              value={isCategoryActive}
              onValueChange={setCatgeoryActive}
              color={isCategoryActive ? "#4630EB" : undefined}
            />
            <Pressable onPress={() => setCatgeoryActive(!isCategoryActive)}>
              <Text style={styles.activeLable}>Category available</Text>
            </Pressable>
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
            validationSchema={addCategorySchema}
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
                <Text style={styles.labels}>
                  <Text style={{ color: "red" }}>*</Text>Select Menu
                </Text>
                <SelectDropdown
                  data={data}
                  dropdownOverlayColor="rgba(0,0,0,0)"
                  buttonTextStyle={{ fontSize: 16 }}
                  rowTextStyle={{ fontSize: 16 }}
                  rowStyle={{ height: 41 }}
                  selectedRowStyle={{ backgroundColor: "#d2d2d2" }}
                  dropdownStyle={{
                    borderRadius: 10,
                    backgroundColor: "white",
                    borderWidth: 1,
                  }}
                  renderDropdownIcon={() => {
                    return <AntDesign name="down" size={14} color="black" />;
                  }}
                  buttonStyle={{
                    height: 41,
                    borderColor: "black",
                    borderWidth: 1,
                    borderRadius: 10,
                    backgroundColor: "white",
                    width: "94%",
                    alignSelf: "center",
                    marginBottom: 10,
                  }}
                  onSelect={(selectedItem, index) => {
                    setCategoryName(selectedItem.id);
                    setCategoryRequired(false);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.name;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.name;
                  }}
                />
                {categoryRequired && (
                  <Text
                    style={{
                      color: "red",
                      paddingHorizontal: 10,
                      marginTop: -10,
                    }}
                  >
                    Menu is required
                  </Text>
                )}

                <View style={{ marginTop: 10 }}>
                  <Text style={styles.labels}>
                    <Text style={{ color: "red", fontWeight: "650" }}> *</Text>
                    Category name
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Enter Category name"
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
                </View>
                {/* End of added code 26/04/2023 */}
                <View style={styles.activeStatus}>
                  <Checkbox
                    value={isCategoryActive}
                    onValueChange={setCatgeoryActive}
                    color={isCategoryActive ? "#4630EB" : undefined}
                  />
                  <Pressable
                    onPress={() => setCatgeoryActive(!isCategoryActive)}
                  >
                    <Text style={styles.activeLable}>Category available</Text>
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
                    onPress={(e) => {
                      handleSubmit();
                    }}
                    disabled={isSaveBtnDisable}
                    // Modified by- Suman sahu  On 26/04/2023
                    // Reason - for redesign buttons styles
                    style={{
                      backgroundColor: isSaveBtnDisable
                        ? "#E0E0E0"
                        : colors.btnColor,
                      height: 35,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 10,
                      width: "35%",
                      alignSelf: "center",
                    }}
                    // End of modified code
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
        {/* -------------------------- End formik -------------------------------------- */}
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
    paddingTop: 10,
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
