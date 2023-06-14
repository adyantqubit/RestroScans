// Created by Yuvraj Sahu on 6-4-2023
// Reason - to edit item

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
import { Ionicons } from "@expo/vector-icons";
import {
  deleteItemApi,
  getAllMenuList,
  getMenuList,
  saveCategoryApi,
  saveItemApi,
  updateItemApi,
} from "../../api/Services";
import { colors, inputs } from "../../Colours/globalColor";
import * as SecureStore from "expo-secure-store";
// import { tenantName } from "../config/config";
import { SelectList } from "react-native-dropdown-select-list";
import Checkbox from "expo-checkbox";
import config from "../../config/config";
import { AppStateContext } from "../../context/AppStateProvider";
import Footer from "../../components/Footer/Footer";
import { AntDesign } from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import { useIsFocused } from "@react-navigation/native";
import { Formik } from "formik";
import { addItemSchema } from "../../validation/ValidationSchema";

export default function EditItemScreen({ route, navigation }) {
  // Commeted and added by Yuvraj sahu on 26-4-2023
  // Reason - to set api calling value from backend and remove props value
  /* Get the param */
  // const { itemID, categoryList, itemObj, categoryID, categoryName } = route.params;
  const { itemID, categoryID } = route.params;
  // end of comment

  var { render, setRender } = useContext(AppStateContext);

   // Added by Yuvraj Sahu on 24-4-2023
  // Reason - to add best seller
  const [isBestSeller, setBestSeller] = useState(false);
  // End of addition

  // added by Yuvraj Sahu on 6-4-2023
  // Reason - to check checkbox
  // Modified by Yuvraj Sahu on 26-4-2023
  // Reason - to set the checkbox value from api calling
  const [isItemChecked, setItemChecked] = useState(false);
  // End of addition
  // End of modification

  const [categorySelected, setCategorySelected] = React.useState("");

  // Commented by Yuvraj Sahu on 27-4-2023
  // var [categories, setCategories] = useState([]);
  React.useEffect(() => {
    // getMenus();
    getTenant();
  }, []);
  // End of comment

  // Commeted by yuvraj Sahu on 26-4-2023
  // Reason - to change the dropdown
  // const getMenus = async () => {
  //   // var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
  //   // const response = await getMenuList(JSON.parse(tenantInfo).tenant_name);
  //   // if (response.categoryList) {
  //   setCategories(
  //     categoryList.map(function (obj) {
  //       obj["key"] = obj["id"]; // Assign new key
  //       obj["value"] = obj["name"]; // Rename key
  //       delete obj["id"]; // Delete old key
  //       delete obj["name"]; // Delete name
  //       delete obj["icon"]; // Delete icon
  //       delete obj["menu_name"]; // Delete menu name
  //       delete obj["menu"]; // Delete menu
  //       return obj;
  //     })
  //   );
  //   // }
  //   // Added by Yuvraj Sahu on 13-4-2023
  //   // reason - to get enu list from backend
  //   // End of addition
  // };
  // End of show menu list
  // End of comment

  // Added by Yuvraj Sahu on 24-3-2023
  // Reason - to show item type list in dropdown
  const [itemTypeSelected, setItemTypeSelected] = React.useState("");
  var [itemtypes, setItemTypes] = useState([
    { key: "Veg", value: "Veg" },
    { key: "Nonveg", value: "Nonveg" },
    { key: "Other", value: "Other" },
  ]);
  // End of addition

  // Added by Yuvraj Sahu on 25-3-2023
  // Reason - to get tenant from localStorage
  var [tenant, setTenant] = useState("");

  const getTenant = async () => {
    var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
    setTenant(JSON.parse(tenantInfo).tenant_name);
  };
  // End of getting tenant detail

  var [isDisable, setIsDisable] = useState(false);

  const [tempPhoto, setTempPhoto] = useState(null);

  const [icon, setImage] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");

  /* This is add for show image limit validation msg */
  var [isFileSizeError, setFileSizeError] = useState(false);
  /* End of addition */

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
        setUploadedFileName(result.assets[0].fileName);
        setTempPhoto(result.assets[0]);
      }
    }
    /**
     * End of modification by Yuvraj Sahu on 05-05-2023
     */
  };

  const handleRegister = (formValues) => {
    // UnCommented by Yuvraj Sahu on 20-4-2023
    // Reason - to disable btn
    setIsDisable(true);
    // End of addition
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
    if (formValues.price_half != null) {
      formData.append("price_half", formValues.price_half);
    }
    if (formValues.price_full != null) {
      formData.append("price_full", formValues.price_full);
    }
    formData.append("category", categorySelected);
    if (formValues.description != null) {
      formData.append("description", formValues.description);
    }
    formData.append("is_active", isItemChecked);
    // Added by Yuvraj Sahu on 12-4-2023
    // Reason - to save item type
    formData.append("item_type", itemTypeSelected);
    // End of addition

    // Added by Yuvraj Sahu on 14-06-2023
    // Reason - to save best seller
    formData.append("best_seller", isBestSeller);
    // End of addition by Yuvraj Sahu on 14-06-2023

    // console.log('formData------'+JSON.stringify(formData))
    if (isFileSizeError == false) {
      updateItemApi(formData, tenant, itemID).then((response) => {
        if (response.msg) {
          Alert.alert(response.msg);
          setIsDisable(false);
          setFileSizeError(false);
        }
        if (response.error) {
          Alert.alert("Error", response.error);
          setIsDisable(false);
        }
      });
    }
  };

  // Commemted by Yuvraj Sahu on 26-4-2023
  // Reason - to change the form into formik
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
  //     name: itemObj[0].name,
  //     // category: "",
  //     description: itemObj[0].description,
  //     price_full: itemObj[0].price_full,
  //     price_half: itemObj[0].price_half,
  //   },
  // });
  // End of comment

  // Added by Om on 07-04-23
  // Reason : To delete the item section

  // const handleDelete = async () => {
  //   var tenant = JSON.parse(
  //     await SecureStore.getItemAsync("tenantInfo")
  //   ).tenant_name;

  //   deleteItemApi(tenant, itemID).then((response) => {
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

  // Added by Yuvraj Sahu on 24-4-2023
  // Reason - to get active menu, category and items
  const isFocused = useIsFocused();
  var [categoryValue, setCategoryValue] = useState([]);
  useEffect(() => {
    // Added by Yuvraj Sahu on 01-05-2023
    // Reason - to refresh default value when we go back
    setSelectedItemValue({
      name: "",
      price_full: "",
      price_half: "",
      description: "",
    });
    // End of addition by Yuvraj on 01-05-2023
    getAllMenus();
  }, [isFocused]);
  var [categoryDatas, setCategoryDatas] = useState([]);
  var [itemValue, setItemValue] = useState("");

  // Added by Yuvraj Sahu on 26-4-2023
  // Reason - to set default selected
  var [selectedItemValue, setSelectedItemValue] = useState({});
  // End of selection

  const getAllMenus = async () => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    var response = await getAllMenuList(tenant);
    if (response) {
      setCategoryDatas(response.categoryList);
      var slectedCategory = response.categoryList.filter(
        (dt) => dt.id == categoryID
      );
      setCategoryValue(slectedCategory);
      var selectedItemValue = response.itemList.filter(
        (dt) => dt.id == itemID
      )[0];
      var setItemType = selectedItemValue.item_type;
      setItemValue(setItemType);

      // Added by Yuvraj Sahu on 14-06-2023
      // Reason - to set default best seller item
      var setBestSellerItem = selectedItemValue.best_seller;
      setBestSeller(setBestSellerItem);
      // End of addition by Yuvraj Sahu on 14-06-2023

      // Added by Yuvraj Sahu on 26-4-2023
      // Reason - to set filtered data
      var isActiveChecked = selectedItemValue.is_active;
      setSelectedItemValue(selectedItemValue);
      setItemChecked(isActiveChecked);
      // End of addition
    }
  };
  // End of addition

  return (
    <>
      {/* Added byYuvraj Sahu on 27-4-2023
    Reason - to click at one time on button when cursor stays on input */}
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* End of addition - button click */}
        <View style={styles.container}>
          {/* <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Category name
          </Text>
          <SelectDropdown
            defaultValue={
              categoryDatas.filter((e) => {
                return e.id == categoryID;
              })[0]
            }
            // data={categories}
            data={categoryDatas}
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
              setCategorySelected(selectedItem.id);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem.name;
            }}
            rowTextForSelection={(item, index) => {
              return item.name;
            }}
          />

          <View style={{ marginTop: 15 }}>
            <Text style={styles.labels}>
              <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
              Item name
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
                      placeholder="Enter item name"
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
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Item type
          </Text>

          <SelectDropdown
            defaultValue={
              itemtypes.filter((e) => {
                return e.value == itemValue;
              })[0]
            }
            data={itemtypes}
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
            onSelect={(selectedItemType, index) => {
              setItemTypeSelected(selectedItemType.value);
              // setItemTypeRequired(false);
            }}
            buttonTextAfterSelection={(selectedItemType, index) => {
              return selectedItemType.value;
            }}
            rowTextForSelection={(item, index) => {
              return item.value;
            }}
          />

          <View style={{ marginTop: 5 }}>
            <Text style={styles.labels}>
              <Text style={{ color: "red", fontWeight: "650" }}> </Text>
              Half price
            </Text>
            <Controller
              control={control}
              name="price_half"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <View>
                    <TextInput
                      style={styles.input}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="Enter half price"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry={false}
                      placeholderTextColor="#A4A4A4"
                      editable={true}
                      keyboardType="number-pad"
                    />
                  </View>
                  {errors?.price_half && (
                    <Text style={styles.textdanger}>
                      {errors?.price_half?.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>

          <View style={{ marginTop: 5 }}>
            <Text style={styles.labels}>
              <Text style={{ color: "red", fontWeight: "650" }}> </Text>
              Full price
            </Text>
            <Controller
              control={control}
              name="price_full"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <View>
                    <TextInput
                      style={styles.input}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="Enter full price"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry={false}
                      placeholderTextColor="#A4A4A4"
                      editable={true}
                      keyboardType="number-pad"
                    />
                  </View>
                  {errors?.price_full && (
                    <Text style={styles.textdanger}>
                      {errors?.price_full?.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>

          <View style={{ marginTop: 5 }}>
            <Text style={styles.labels}>
              <Text style={{ color: "red", fontWeight: "650" }}> </Text>
              Description
            </Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <View>
                    <TextInput
                      style={styles.input}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="Enter description"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry={false}
                      placeholderTextColor="#A4A4A4"
                      editable={true}
                      keyboardType="default"
                      // defaultValues={defaultValues}
                    />
                  </View>

                  {errors?.description && (
                    <Text style={styles.textdanger}>
                      {errors?.description?.message}
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
              <Image source={{ uri: icon }} style={{ width: 50, height: 40 }} />
            )}
            {!icon && itemObj[0].icon && (
              <Image
                source={{ uri: config.staticBaseURL + itemObj[0].icon }}
                style={{ width: 50, height: 40, borderRadius: 5 }}
              />
            )}
          </View>
          <View style={styles.activeStatus}>
            <Checkbox
              // style={styles.checkbox}
              value={isItemChecked}
              onValueChange={setItemChecked}
              color={isItemChecked ? "#4630EB" : undefined}
            />
            <Pressable onPress={() => setItemChecked(!isItemChecked)}>
              <Text style={styles.activeLable}>Item available</Text>
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

          {/* End of comment */}

          {/* ------------------------------- Formik 24-4-2023 ------------------------------  */}
          <Formik
            enableReinitialize={true}
            initialValues={selectedItemValue}
            validateOnMount={true}
            validationSchema={addItemSchema}
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
                  <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
                  Category name
                </Text>
                <SelectDropdown
                  defaultValue={
                    categoryDatas.filter((e) => {
                      return e.id == categoryID;
                    })[0]
                  }
                  // data={categories}
                  data={categoryDatas}
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
                    /**
                     * Added by yuvraj Sahu on 05-05-2023
                     * Reason - to set hright of input box
                     */
                    // height: 41,
                    height: inputs.inputBoxHeight,
                    /**
                     * End of set input box height by yuvraj Sahu on 05-05-2023
                     */
                    borderColor: "black",
                    borderWidth: 1,
                    borderRadius: 10,
                    backgroundColor: "white",
                    width: "94%",
                    alignSelf: "center",
                    marginBottom: 10,
                  }}
                  onSelect={(selectedItem, index) => {
                    setCategorySelected(selectedItem.id);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.name;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.name;
                  }}
                />
                {/* {itemRequired && (
                  <Text
                    style={{
                      color: "red",
                      paddingHorizontal: 10,
                      marginTop: -10,
                    }}
                  >
                    Category is required
                  </Text>
                )} */}

                <View style={{ marginTop: 10 }}>
                  <Text style={styles.labels}>
                    <Text style={{ color: "red", fontWeight: "650" }}> *</Text>
                    Item name
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Enter Item name"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  {errors.name && touched.name && (
                    <Text style={styles.textdanger}>{errors.name}</Text>
                  )}
                </View>

                <Text style={styles.labels}>
                  <Text style={{ color: "red" }}>*</Text>Select Item Type
                </Text>
                <SelectDropdown
                  defaultValue={
                    itemtypes.filter((e) => {
                      return e.value == itemValue;
                    })[0]
                  }
                  data={itemtypes}
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
                    /**
                     * Added by yuvraj Sahu on 05-05-2023
                     * Reason - to set hright of input box
                     */
                    // height: 41,
                    height: inputs.inputBoxHeight,
                    /**
                     * End of set input box height by yuvraj Sahu on 05-05-2023
                     */
                    borderColor: "black",
                    borderWidth: 1,
                    borderRadius: 10,
                    backgroundColor: "white",
                    width: "94%",
                    alignSelf: "center",
                    marginBottom: 10,
                  }}
                  onSelect={(selectedItemType, index) => {
                    setItemTypeSelected(selectedItemType.value);
                    // setItemTypeRequired(false);
                  }}
                  buttonTextAfterSelection={(selectedItemType, index) => {
                    return selectedItemType.value;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.value;
                  }}
                />
                {/* {itemTypeRequired && (
                  <Text
                    style={{
                      color: "red",
                      paddingHorizontal: 10,
                      marginTop: -10,
                    }}
                  >
                    Item Type is required
                  </Text>
                )} */}

                <View style={{ marginTop: 10 }}>
                  <Text style={styles.labels}>
                    {/* <Text style={{ color: "red", fontWeight: "650" }}> *</Text> */}
                    {"  "}Full Price
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("price_full")}
                    onBlur={handleBlur("price_full")}
                    value={values.price_full}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Enter Full Price"
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  {errors.price_full && touched.price_full && (
                    <Text style={styles.textdanger}>{errors.price_full}</Text>
                  )}
                </View>

                <View style={{ marginTop: 10 }}>
                  <Text style={styles.labels}>
                    {/* <Text style={{ color: "red", fontWeight: "650" }}> *</Text> */}
                    {"  "}Half Price
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("price_half")}
                    onBlur={handleBlur("price_half")}
                    value={values.price_half}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Enter Half Price"
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  {errors.price_half && touched.price_half && (
                    <Text style={styles.textdanger}>{errors.price_half}</Text>
                  )}
                </View>

                <View style={{ marginTop: 10 }}>
                  <Text style={styles.labels}>
                    {/* <Text style={{ color: "red", fontWeight: "650" }}> *</Text> */}
                    {"  "}Description
                  </Text>
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
                      style={{ width: 50, height: 40 }}
                    />
                  )}

                  {/* Commeted and modified by Yuvraj Sahu on 26-4-2023
                  Reason - to remove props value */}
                  {/* {!icon && itemObj[0].icon && (
                    <Image
                      source={{ uri: config.staticBaseURL + itemObj[0].icon }}
                      style={{ width: 50, height: 40, borderRadius: 5 }}
                    />
                  )} */}
                  {/* End of comment */}

                  {!icon && selectedItemValue.icon && (
                    <Image
                      source={{
                        uri: config.staticBaseURL + selectedItemValue.icon,
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

                <View style={styles.activeStatus}>
                  <Checkbox
                    // style={styles.checkbox}
                    value={isItemChecked}
                    onValueChange={setItemChecked}
                    color={isItemChecked ? "#4630EB" : undefined}
                  />
                  <Pressable onPress={() => setItemChecked(!isItemChecked)}>
                    <Text style={styles.activeLable}>Item available</Text>
                  </Pressable>
                </View>

                {/* Added by Yuvraj Sahu on 24-4-2023
                Reason - to add best seller  */}
                <View style={styles.activeStatus}>
                  <Checkbox
                    value={isBestSeller}
                    onValueChange={setBestSeller}
                    color={isBestSeller ? "#4630EB" : undefined}
                  />
                  <Pressable onPress={() => setBestSeller(!isBestSeller)}>
                    <Text style={styles.activeLable}>Best seller</Text>
                  </Pressable>
                </View>
                {/* End of addition */}

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

          {/* -----------------------------End of using formik ---------------------- */}
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
    marginTop: 10,
    fontSize: 16,
    marginTop: 0,
    borderRadius: 10,
  },
  labels: {
    paddingHorizontal: 10,
    /**
     * Modified by yuvraj Sahu on 05-05-2023
     * Reason - to gap lable and input box
     */
    marginBottom: 5,
    /**
     * End of addition by yuvraj Sahu on 05-05-2023
     */
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
