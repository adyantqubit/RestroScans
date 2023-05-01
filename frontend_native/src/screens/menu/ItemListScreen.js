import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Button,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import config from "../../config/config";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  getAllMenuList,
  deleteCategoryApi,
  getMenuList,
  saveCategoryApi,
  updateCategoryApi,
  updateItemApi,
} from "../../api/Services";
import * as SecureStore from "expo-secure-store";
import { colors } from "../../Colours/globalColor";
import { useForm, Controller } from "react-hook-form";
import { SelectList } from "react-native-dropdown-select-list";
import * as ImagePicker from "expo-image-picker";
import Checkbox from "expo-checkbox";
import { useContext } from "react";
import { AppStateContext } from "../../context/AppStateProvider";
import Footer from "../../components/Footer/Footer";
import SelectDropdown from "react-native-select-dropdown";
import { AntDesign } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { Formik } from "formik";
import { addCategorySchema } from "../../validation/ValidationSchema";

export default function ItemListScreen({ route, navigation }) {
  const isFocused = useIsFocused();

  // Commented and modified by Yuvraj Sahu on 26-4-2023
  // Reason - to get id using params not other detail
  /* Get the param */
  // const {
  //   categoryID,
  //   categoryName,
  //   itemList,
  //   menuName,
  //   menuID,
  //   categoryList,
  //   menuList,
  //   categoryObj,
  // } = route.params;
  const { categoryID, menuID } = route.params;
  // End of modification

  // Added by Yuvraj Sahu on 5-4-2023
  // Reason - to disable button and set image
  var [isDisable, setIsDisable] = useState(false); // For save button disable
  const [icon, setImage] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [tempPhoto, setTempPhoto] = useState(null);
  // End of addition

  // added by Yuvraj Sahu on 7-4-2023
  // Reason - to set category object
  // commeted by yuvraj Sahu on 26-4-2023
  // var [categoryObject, setCategoryObject] = useState(categoryObj);
  // End of addition
  // End of comment

  // added by Yuvraj Sahu on 6-4-2023
  // Reason - to check checkbox
  // Modified by Yuvraj Sahu on 26-4-2023
  // Reason - to set backend value
  // const [isCategoryChecked, setCategoryChecked] = useState(categoryObj[0].is_active);
  const [isCategoryChecked, setCategoryChecked] = useState(false);
  // End of modification
  // End of addition

  var { render, setRender } = useContext(AppStateContext);
  // Added by Yuvraj Sahu on 5-4-2023
  // Reason - to show category list in dropdown
  const [menuSelected, setMenuSelected] = React.useState("");

  // Commeted by Yuvraj Sahu on 30-4-2023
  // Reason - remove code (no using this time)
  // var [data, setData] = useState([]);
  // const getMenus = async () => {
  // var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
  // const response = await getMenuList(JSON.parse(tenantInfo).tenant_name);
  // if (response.menuList) {
  // setData(
  //   menuList.map(function (obj) {
  //     obj["key"] = obj["id"]; // Assign new key
  //     obj["value"] = obj["name"]; // Rename key
  //     delete obj["id"]; // Delete old key
  //     delete obj["name"]; // Delete name
  //     delete obj["icon"]; // Delete icon
  //     return obj;
  //   })
  // );
  // setData(menuList);
  // }
  // };
  // Added by Yuvraj Sahu on 7-4-2023
  // Reason - to get all menuus for filteration
  var [itemObjects, setItemObjects] = useState([]);
  // Added by Yuvraj Sahu on 24-4-2023
  // Reason - to set menu in dropdown
  var [menuDatas, setMenuDatas] = useState([]);
  // End of sett category

  // Added by Yuvraj Sahu on 24-4-2023
  // Reason - to set menu in dropdown
  var [menuValue, setMenuValue] = useState([]);
  // End of sett category

  // Added by Yuvraj Sahu on 26-4-2023
  // Reason - to set category in text input
  var [categoryValue, setCategoryValue] = useState({});
  // End of set category

  const getAllmenus = async () => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    var response = await getAllMenuList(tenant);
    if (response) {
      // setMenuObject((response.menuList).filter((dt) => dt.id == menuID )[0])
      var itemList = response.itemList.filter(
        (dt) => dt.category_id == categoryID
      );
      setItemObjects(itemList);
      var menuList = response.menuList.filter((e) => e.is_active == true);
      setMenuDatas(menuList);
      var selectedMenu = response.menuList.filter((e) => e.id == menuID)[0];
      setMenuValue(selectedMenu);
      // Added by Yuvraj Sahu on 26-4-2023
      // Reason - to set default value
      var categoryValue = response.categoryList.filter(
        (e) => e.id == categoryID
      )[0];
      setCategoryValue(categoryValue);
      var categoryActive = categoryValue.is_active;
      setCategoryChecked(categoryActive);
      // End of set default value
    }
  };
  // end of getting menus

  /* This is add for show image limit validation msg */
  var [isFileSizeError, setFileSizeError] = useState(false);
  /* End of addition */

  //   For upload image
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
      setUploadedFileName(result.assets[0].fileName);
      setTempPhoto(result.assets[0]);

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
  // End of upload image

  // Commented by Yuvraj Sahu on 26-4-2023
  // Reason - to change form into formik
  // For make data and send it to backend
  const handleRegister = async (formValues) => {
    // Uncommented by Yuvraj Sahu on 20-4-2023
    // Reason - to disable btn
    setIsDisable(true);
    // End of uncomment
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
    formData.append("menu", menuSelected);
    formData.append("is_active", isCategoryChecked);
    // setRender(!render)

    var tenantInfo = await SecureStore.getItemAsync("tenantInfo");

    // Modify by- Suman sahu  On 29/04/2023
    // Reason- add condition for image field when user upload image above 200kb form not saved
    if (isFileSizeError == false) {
      updateCategoryApi(
        formData,
        JSON.parse(tenantInfo).tenant_name,
        categoryID
      ).then((response) => {
        if (response.msg) {
          Alert.alert(response.msg);
          setIsDisable(false);
          setRender(!render);
          // alert(JSON.stringify(response.categoryList))
          var categories = response.categoryList.filter(
            (dt) => dt.id == categoryID
          )[0];
          setCategoryValue(categories);

          // navigate('login')
        }
        if (response.error) {
          Alert.alert("Error", response.error);
          setIsDisable(false);
        }
      });
    }
  };
  // End of comment
  // End of sending data

  // Sending item id for edit item data
  // Commeted by yuvraj Sahu on 26-4-2023
  // Reason - to not pass props value
  function handleEditItem(itemID) {
    // var itemObj = itemObjects.filter((dt) => dt.id == itemID);
    navigation.navigate("ItemEditScreen", {
      itemID: itemID,
      // categoryList: categoryList,
      categoryID: categoryValue.id,
      // itemObj: itemObj,
      // categoryName: categoryValue.name,
      // End of comment
    });
  }
  // End of sending item id

  //   For set values using useForm
  // Commented by Yuvraj Sahu on 26-4-2023
  // Reason - to remove headt hook form
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
  //     name: categoryName,
  //     menu: "",
  //     // icon: ""
  //   },
  // });
  // end of removal
  //   End of set values

  // Added by Om on 07-04-23
  // Reason : To delete the category section

  // const handleDelete = async () => {
  //   var tenant = JSON.parse(
  //     await SecureStore.getItemAsync("tenantInfo")
  //   ).tenant_name;

  //   deleteCategoryApi(tenant, categoryID).then((response) => {
  //     if (response.msg) {
  //       Alert.alert("Succesfull", response.msg);
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

  // Added by Yuvraj Sahu on 26-4-2023
  // Reason - to change form into formik and calling API
  /**
   * This function is created for form submission of category editing
   */
  // Commeted by Yuvraj Sahu on 26-4-2023
  // const handleRegister1 = async (values, { resetForm }) => {
  //   // setSaveBtnDisable(true);
  //   // if (categoryName == "") {
  //   //   setCategoryRequired(true);
  //   // }
  //   var tenant = JSON.parse(
  //     await SecureStore.getItemAsync("tenantInfo")
  //   ).tenant_name;

  //   var formData = new FormData();
  //   if (icon != null) {
  //     const ext = tempPhoto.uri.substring(tempPhoto.uri.lastIndexOf(".") + 1);
  //     formData.append("icon", {
  //       uri: icon,
  //       name: icon,
  //       type: `image/${ext}`,
  //     });
  //   }
  //   formData.append("name", values.name);
  //   formData.append("menu", menuSelected);
  //   formData.append("is_active", isCategoryChecked);

  //   // if (icon != null) {
  //   // if (categoryName != "") {
  //   updateCategoryApi(formData, tenant).then(async (res) => {
  //     if (response.msg) {
  //       Alert.alert(response.msg);
  //       setIsDisable(false);
  //       // setRender(!render);
  //       // alert(JSON.stringify(response.categoryList))
  //       var categories = response.categoryList.filter((dt) => dt.id == categoryID)[0];
  //       alert(JSON.stringify(categories))
  //       setCategoryValue(categories);

  //       // navigate('login')
  //     }
  //     if (response.error) {
  //       Alert.alert("Error", response.error);
  //       setIsDisable(false);
  //     } else {
  //       setSaveBtnDisable(false);
  //       Alert.alert("Something went wrong");
  //     }
  //   });
  //   // }
  //   // }
  // };
  // End of comment
  // End of addition

  // Added by Yuvraj Sahu on 30-4-2023
  // Reason - to replace entered value with
  // saved value when come back in this screen
  React.useEffect(() => {
    // getMenus();
    // getTenant()
    setCategoryValue({ name: "" });
    setImage(null);
    getAllmenus();
  }, [isFocused]);

  return (
    <>
      {/* Added byYuvraj Sahu on 27-4-2023
    Reason - to click at one time on button when cursor stays on input */}
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* End of addition - button click */}
        {/* Edit Category Form  */}

        {/* Added by Yuvraj Sahu on 26-4-2023
          Reason - to change form into formik  */}
        {/* ----------------------------- formik 23-4-2023 ------------------------------ */}
        <View style={styles.container}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              name: categoryValue.name,
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
              <View>
                <Text style={styles.labels}>
                  <Text style={{ color: "red" }}>*</Text>Select Menu
                </Text>
                <SelectDropdown
                  defaultValue={
                    menuDatas.filter((e) => {
                      return e.id == menuValue.id;
                    })[0]
                  }
                  data={menuDatas}
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
                    setMenuSelected(selectedItem.id);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.name;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.name;
                  }}
                />
                {/* {categoryRequired && (
                <Text
                  style={{
                    color: "red",
                    paddingHorizontal: 10,
                    marginTop: -10,
                  }}
                >
                  Menu is required
                </Text>
              )} */}

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
                  {/* Added and commented by Yuvraj Sahu on 16-4-2023
            Reason - to replace button lable and add icon */}
                  {/* <Button title="Edit category icon" onPress={pickImage} /> */}
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
                  {/* End of addition */}
                  {icon && (
                    <Image
                      source={{ uri: icon }}
                      style={{ width: 50, height: 40, borderRadius: 5 }}
                    />
                  )}
                  {/* Modified by Yuvraj Sahu on 26-4-2023
                  Reason - to set newest vale of category */}
                  {!icon && categoryValue.icon && (
                    <Image
                      source={{
                        uri: config.staticBaseURL + categoryValue.icon,
                      }}
                      style={{ width: 50, height: 40, borderRadius: 5 }}
                    />
                  )}
                  {/* End of modification */}
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
                    value={isCategoryChecked}
                    onValueChange={setCategoryChecked}
                    color={isCategoryChecked ? "#4630EB" : undefined}
                  />
                  {/*Added by Yuvraj Sahu on 13-4-2023
            Reason - to make pressable active status lable */}
                  <Pressable
                    onPress={() => setCategoryChecked(!isCategoryChecked)}
                  >
                    <Text style={styles.activeLable}>Category available</Text>
                  </Pressable>
                  {/*End of addition*/}
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
                        color: isDisable ? "#989898" : colors.white,
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
          {/* ------------------------------- List of items ------------------------------------ */}
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLable}>
              Items inside {categoryValue.name}
            </Text>
            {/* Added by Yuvraj Sahu on 28-4-2023
            Reason - to show no item available if no data present */}
            {itemObjects.length > 0 ? (
              <>
                {itemObjects.map((dt, id) => (
                  <Pressable
                    key={id}
                    style={styles.categoryListContainer}
                    onPress={(e) => handleEditItem(dt.id)}
                  >
                    <Image
                      source={{
                        uri: config.staticBaseURL + dt.icon,
                      }}
                      style={styles.menuIcon}
                    />
                    <Text>{dt.name}</Text>
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
                <Text>No item Available</Text>
              </View>
            )}
          </View>
          {/* End of addition */}
        </View>
      </ScrollView>
      {/* Added by Om on 18-04-23 For showing the footer*/}
      <Footer />
      {/* End of addition */}
    </>
  );
}

const styles = StyleSheet.create({
  // Form style
  container: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    paddingTop: 15,
  },
  labels: {
    paddingHorizontal: 10,
  },
  input: {
    height: 41,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    marginTop: 0,
    fontSize: 16,
    borderRadius: 10,
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
  // End form style
  categoryContainer: {
    backgroundColor: "#ffebcc",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 10,
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
    // shadowColor: "#171717",
    // shadowOffset: { width: -3, height: 4 },
    // shadowOpacity: 0.3,
    // shadowRadius: 3,
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
    marginTop: 10,
  },
  activeLable: {
    marginLeft: 10,
  },
});
