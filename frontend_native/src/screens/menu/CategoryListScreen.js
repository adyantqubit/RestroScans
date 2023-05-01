// Created by Yuvraj Sahu on 3-4-2023
// Reason - to Show categories of menu and edit menu

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
  saveMenuApi,
  updateMenuApi,
  getAllMenuList,
  deleteMenuApi,
} from "../../api/Services";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import { colors } from "../../Colours/globalColor";
import config from "../../config/config";
import Icon from "react-native-vector-icons/FontAwesome";
import Checkbox from "expo-checkbox";
import { useEffect } from "react";
import { useContext } from "react";
import { AppStateContext } from "../../context/AppStateProvider";
import Footer from "../../components/Footer/Footer";
import { Formik } from "formik";
import { addMenuSchema } from "../../validation/ValidationSchema";
import { useIsFocused } from "@react-navigation/native";

export default function CategoryListScreen({ route, navigation }) {
  // Commeted and modified by Yuvraj Sahu on 26-4-2023
  // Reason - to remove other detail apart form id
  /* Get the param */
  // const {
  //   menuName,
  //   categoryList,
  //   itemList,
  //   menuList,
  //   menuID,
  //   menuObj,
  //   filteredCategories,
  // } = route.params;
  const { menuID } = route.params;
  // End of comment

  const [tempPhoto, setTempPhoto] = useState(null);
  const [icon, setImage] = useState(null);
  var [isDisable, setIsDisable] = useState(false);

  // Modified and removed by Yuvraj Sahu on 26-4-2023
  // Reason - to set active field in checkbox
  const [isMenuChecked, setMenuChecked] = useState(false);
  // End of set active

  // Added by Yuvraj Sahu on 7-4-2023
  // Reason - to get all menu, category and item and rerender page
  var { render, setRender } = useContext(AppStateContext);

  var [menuObject, setMenuObject] = useState({});
  //  var menuObject = menuObj
  var [categoryObject, setCategoryObject] = useState([]);
  var [itemObject, setItemObject] = useState([""]);

  // Added by Yuvraj Sahu on 26-4-2023
  // Reason - to set selcted menu
  var [selectedMenu, setSelectedMenu] = useState({});

  const getAllmenus = async () => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    var response = await getAllMenuList(tenant);
    if (response) {
      // setMenuObject((response.menuList).filter((dt) => dt.id == menuID )[0])

      //Added and modified by Yuvraj Sahu on 26-4-2023
      // Reason - to set data for mapping and get newest value from backend
      var selectedMenu = response.menuList.filter((dt) => dt.id == menuID)[0];
      var filteredCategory = response.categoryList.filter(
        (dt) => dt.menu_id == menuID
      );
      var menuChecked = selectedMenu.is_active;
      setMenuChecked(menuChecked);
      setCategoryObject(filteredCategory);
      setSelectedMenu(selectedMenu);
      setMenuObject(selectedMenu);
      // End of modification
    }
  };

  useEffect(() => {
    // setMenuObject()
    // getAllmenus()
  }, []);
  // End of addition

  // Added and modification by Yuvraj Sahu on 26-4-2023
  // Reason - to re render the page
  var [isFileSizeError, setFileSizeError] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {
    // Added by Yuvraj Sahu on 30-42023
    // Reason - to replace entered value into saved value
    setSelectedMenu({ name: "" });
    setImage(null);
    // End of addition
    getAllmenus();
  }, [isFocused]);
  // end of modification

  // To upload image
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
      // setUploadedFileName(result.assets[0].fileName);
      setTempPhoto(result.assets[0]);
      // setTempPhoto(result.assets[0]);

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
  // End upload image

  const handleRegister = async (formValues) => {
    // Added by Yuvraj Sahu on 20-4-2023
    // Reason - to disable btn
    setIsDisable(true);
    // End of addition
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
    formData.append("name", formValues.name);
    // Added by Yuvraj Sahu on 7-4-2023
    // Reason - to add active status and reRender page
    formData.append("is_active", isMenuChecked);

    // Modify by- Suman sahu  On 29/04/2023
    // Reason- add condition for image field when user upload image above 200kb form not saved
    if (isFileSizeError == false) {
      updateMenuApi(formData, tenant, menuID).then((response) => {
        if (response.msg) {
          Alert.alert(response.msg);
          var a = response.menuList.filter((dt) => dt.id == menuID)[0];
          setMenuObject(a);
          // Commented by Yuvraj Sahu on 27-4-2023
          // setRender(!render);
          // End of comment
          // Added by Yuvraj Sahu on 20-4-2023
          // Reason - to disable false btn
          setIsDisable(false);
          // End of addition
          // navigate('login')
          // setState("stateChanged")
          setFileSizeError(false);
        }
        // end of addition
        if (response.error) {
          Alert.alert("Error", response.error);
          // Added by Yuvraj Sahu on 20-4-2023
          // Reason - to disable false btn
          setIsDisable(false);
          // End of addition
        }
      });
    }
    // End of modification 20/04/2023
  };

  // Added by Om on 07-04-23
  // Reason : To delete the menu section
  // const handleDelete = async () => {
  //   var tenant = JSON.parse(
  //     await SecureStore.getItemAsync("tenantInfo")
  //   ).tenant_name;

  //   deleteMenuApi(tenant, menuID).then((response) => {
  //     if (response.msg) {
  //       Alert.alert("Succesfull", response.msg);
  //       setRender(!render)
  //       navigation.pop()
  //     }
  //     if (response.error) {
  //       Alert.alert("Error", response.error);
  //     }
  //   });
  // };

  // function showAlert1() {
  //   Alert.alert(
  //     'Alert Title',
  //     'My Alert Msg',
  //     [
  //       {
  //         text: 'Cancel',
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'OK',
  //         onPress: () => { handleDelete() }
  //       },
  //     ]
  //   );
  // }
  // End of addition

  // Commeted by yuvraj Sahu on 26-4-2023
  // Reason - to change the form
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
  //     // name: menuObj[0].name,
  //     name: menuObject[0].name,
  //   },
  // });
  // End of comment

  // Added by Yuvraj Sahu on 4-4-2023
  // Reason - to navigate item screan and send filtered item list
  function itemFilter(categoryID, categoryName) {
    // Modified by Yuvraj Sahu on 7-4-2023
    // Reason - to filter new data
    // Commeted by Yuvraj Sahu on 26-4-2023
    // Reason - to no need to pass using params
    // var categoryObj = categoryObject.filter((dt) => dt.id == categoryID);
    // End of modification
    // var filteredItems = itemList.filter((e) => e.category == categoryID);

    // Commented and modified by Yuvraj Sahu on 26-4-2023
    // Reason - to send only id using params
    // navigation.navigate("ItemListScreen", {
    //   categoryID: categoryID,
    //   categoryName: categoryName,
    //   itemList: filteredItems,
    //   menuID: menuID,
    //   menuName: menuName,
    //   categoryObj: categoryObj,
    //   menuList: menuList,
    //   categoryList: categoryList,
    // });
    navigation.navigate("ItemListScreen", {
      categoryID: categoryID,
      menuID: menuID,
    });
  }
  // End of addition

  return (
    <>
      {/* Added byYuvraj Sahu on 27-4-2023
    Reason - to click at one time on button when cursor stays on input */}
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* End of addition - button click */}
        <View style={styles.container}>
          {/* Added and commented by Yuvraj Sahu on 26-4-2023
        Reason - to change the form into formik */}
          {/* <View style={{ marginTop: 5 }}>
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
            <Text>Edit icon</Text>
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
              // Modified by Yuvraj 17-4-2023
              // reason - to design upload
              flexDirection: "row-reverse",
              // End of designing
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
            {!icon && menuObj[0].icon && (
              <Image
                source={{ uri: config.staticBaseURL + menuObj[0].icon }}
                style={{ width: 50, height: 40, borderRadius: 5 }}
              />
            )}
          </View>
          <View style={styles.activeStatus}>
            <Checkbox
              // style={styles.checkbox}
              value={isMenuChecked}
              onValueChange={setMenuChecked}
              color={isMenuChecked ? "#4630EB" : undefined}
            />
            <Pressable onPress={() => setMenuChecked(!isMenuChecked)}>
              <Text style={styles.activeLable}>Menu available</Text>
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
                Save changes
              </Text>
            </Pressable>
          </View> */}

          {/* ----------------------------- formik 23-4-2023 ------------------------------ */}

          <Formik
            enableReinitialize={true}
            initialValues={{
              name: selectedMenu.name,
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
                    onBlur={handleBlur("name")}
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
                    alignItems: "center",
                    justifyContent: "center",
                    // borderColor: 'black',
                    borderRadius: 3,
                    // borderWidth: 1,
                    width: "93%",
                    alignSelf: "center",
                    // Modified by Yuvraj 17-4-2023
                    // reason - to design upload
                    flexDirection: "row-reverse",
                    // End of designing
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
                  {!icon && selectedMenu.icon && (
                    <Image
                      source={{ uri: config.staticBaseURL + selectedMenu.icon }}
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

                <View style={styles.activeStatus}>
                  <Checkbox
                    // style={styles.checkbox}
                    value={isMenuChecked}
                    onValueChange={setMenuChecked}
                    color={isMenuChecked ? "#4630EB" : undefined}
                  />
                  <Pressable onPress={() => setMenuChecked(!isMenuChecked)}>
                    <Text style={styles.activeLable}>Menu available</Text>
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
                    onPress={handleSubmit}
                    disabled={isDisable}
                    style={{
                      backgroundColor: isDisable ? "grey" : colors.btnColor,
                      height: 30,
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
                      Save changes
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </Formik>

          {/* -------------------------- End formik -------------------------------------- */}

          {/* ---------------------- Category lists ------------------------------ */}
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLable}>
              Categories inside {menuObject.name}
            </Text>
            {/* Added by Yuvraj Sahu on 28-4-2023
            Reason - to show no category availbale if data not present  */}
            {categoryObject.length > 0 ? (
              <>
                {categoryObject.map((categoryData, id) => (
                  <Pressable
                    key={id}
                    style={styles.categoryListContainer}
                    onPress={(e) =>
                      itemFilter(categoryData.id, categoryData.name)
                    }
                  >
                    <Image
                      source={{
                        uri: config.staticBaseURL + categoryData.icon,
                      }}
                      style={styles.menuIcon}
                    />
                    <Text>{categoryData.name}</Text>
                    <Icon name="edit" size={20} color="black" />
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
                <Text>No category Available</Text>
              </View>
            )}
            {/* End of addition */}
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
});
