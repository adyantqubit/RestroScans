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
import { colors } from "../../Colours/globalColor";
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

export default function EditItemScreen({ route, navigation }) {
  /* Get the param */
  const { itemID, categoryList, itemObj, categoryID, categoryName } =
    route.params;

  var { render, setRender } = useContext(AppStateContext);

  // added by Yuvraj Sahu on 6-4-2023
  // Reason - to check checkbox
  const [isItemChecked, setItemChecked] = useState(itemObj[0].is_active);
  // End of addition

  const [categorySelected, setCategorySelected] = React.useState("");
  var [categories, setCategories] = useState([]);
  React.useEffect(() => {
    getMenus();
    getTenant();
  }, []);

  const getMenus = async () => {
    // var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
    // const response = await getMenuList(JSON.parse(tenantInfo).tenant_name);
    // if (response.categoryList) {
    setCategories(
      categoryList.map(function (obj) {
        obj["key"] = obj["id"]; // Assign new key
        obj["value"] = obj["name"]; // Rename key
        delete obj["id"]; // Delete old key
        delete obj["name"]; // Delete name
        delete obj["icon"]; // Delete icon
        delete obj["menu_name"]; // Delete menu name
        delete obj["menu"]; // Delete menu
        return obj;
      })
    );
    // }
    // Added by Yuvraj Sahu on 13-4-2023
    // reason - to get enu list from backend
    // End of addition
  };
  // End of show menu list

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
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setUploadedFileName(result.assets[0].fileName);
      setTempPhoto(result.assets[0]);
    }
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

    // console.log('formData------'+JSON.stringify(formData))
    updateItemApi(formData, tenant, itemID).then((response) => {
      if (response.msg) {
        Alert.alert(response.msg);
        setIsDisable(false);
        setRender(!render);
        // navigate('login')
      }
      if (response.error) {
        Alert.alert("Error", response.error);
        setIsDisable(false);
      }
    });
  };

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
      name: itemObj[0].name,
      // category: "",
      description: itemObj[0].description,
      price_full: itemObj[0].price_full,
      price_half: itemObj[0].price_half,
    },
  });
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
  var [categoryValue, setCategoryValue] = useState([])
  useEffect(() => {
    getAllMenus();
  }, [isFocused]);
  var [categoryDatas, setCategoryDatas] = useState([]);
  var [itemValue, setItemValue] = useState("");

  const getAllMenus = async () => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    var response = await getAllMenuList(tenant);
    if (response) {
      setCategoryDatas(response.categoryList);
      var slectedCategory = response.categoryList.filter((dt)=>dt.id==categoryID)
      setCategoryValue(slectedCategory)
      // alert(itemID)
      // alert("aaaaaaa"+JSON.stringify(response.itemList))
      var slectedItem = response.itemList.filter((dt)=>dt.id==itemID)[0].item_type
      setItemValue(slectedItem)
      // alert("itemValue"+JSON.stringify(itemValue[0].item_type))
      // alert("menuValue"+JSON.stringify(menuValue))
    }
  };
  // End of addition

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Category name
          </Text>
          {/* Commented and added by Yuvraj Sahu on 24-4-2023
          Reason - to change dropdown */}
          {/* <SelectList
            // onSelect={setCategorySelected}
            setSelected={setCategorySelected}
            data={categories}
            search={false}
            dropdownStyles={{
              width: "93%",
              alignSelf: "center",
              marginTop: 1,
            }}
            boxStyles={{
              borderRadius: 5,
              alignSelf: "center",
              width: "93%",
              borderColor: "black",
              marginTop: 10,
            }} //override default styles
            defaultOption={{ key: categoryID, value: categoryName }}
          /> */}

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
          {/* End of addition */}

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
                //   pattern: {
                //     value: /^(?!\s+$).*/,
                //     message: "Menu name cannot contain only blankspaces!",
                //   },
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

          {/* Added by Yuvraj Sahu on 12-4-2023
        Reason - to add item type */}
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Item type
          </Text>

          {/* Added and modified by Yuvraj Sahu on 24-4-2023
        Reason - to change dropdown  */}
          {/* <SelectList
          // onSelect={setCategorySelected}
          setSelected={setItemTypeSelected}
          data={itemtypes}
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
          defaultOption={{
            key: itemObj[0].item_type,
            value: itemObj[0].item_type,
          }}
        /> */}

          <SelectDropdown
            // defaultValue={(e) => {
            //   return itemObj[0].item_type;
            // }}
            defaultValue={
              itemtypes.filter((e)=>{
              return (e.value==itemValue)
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

          {/* End of modification */}

          <View style={{ marginTop: 5 }}>
            <Text style={styles.labels}>
              <Text style={{ color: "red", fontWeight: "650" }}> </Text>
              Half price
            </Text>
            <Controller
              control={control}
              name="price_half"
              // rules={{
              //   required: {
              //     value: true,
              //     message: "Half price is required!",
              //   },
              // }}
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
              // rules={{
              //   required: {
              //     value: true,
              //     message: "Full price is required!",
              //   },
              // }}
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
              // rules={{
              //   required: {
              //     value: true,
              //     message: "Description is required!",
              //   },
              // }}
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
            {/* Added and commented by Yuvraj Sahu on 16-4-2023
          Reason - to replace button lable and add icon */}
            {/* <Button title="Edit item icon" onPress={pickImage} /> */}
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
                style={{ width: 50, height: 40 }}
              />
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
            {/*Added by Yuvraj Sahu on 13-4-2023
          Reason - to make pressable to active status*/}
            <Pressable onPress={() => setItemChecked(!isItemChecked)}>
              <Text style={styles.activeLable}>Item available</Text>
            </Pressable>
            {/*End of addition*/}
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

            {/* Added by Om on 07-04-23
          Reason : Add delete functionality */}
            {/* <Pressable
            onPress={showAlert1}
            disabled={isDisable}
            style={{
              backgroundColor: isDisable ? "grey" : colors.anotherButton,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 3,
              marginTop: 10
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Delete item
            </Text>
          </Pressable> */}
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
    marginTop:0,
    borderRadius: 10,
  },
  labels: {
    paddingHorizontal: 10,
  },
  textdanger: {
    color: "#dc3545",
    marginBottom: 10,
    paddingHorizontal: 10,
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
