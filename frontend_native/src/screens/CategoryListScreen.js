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
} from "../api/Services";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import { colors } from "../Colours/globalColor";
import config from "../config/config";
import Icon from "react-native-vector-icons/FontAwesome";
import Checkbox from "expo-checkbox";
import { useEffect } from "react";
import { useContext } from "react";
import { AppStateContext } from "../context/AppStateProvider";

export default function CategoryListScreen({ route, navigation }) {
  /* Get the param */
  const {
    menuName,
    categoryList,
    itemList,
    menuList,
    menuID,
    menuObj,
    filteredCategories,
  } = route.params;

  const [tempPhoto, setTempPhoto] = useState(null);
  const [icon, setImage] = useState(null);
  var [isDisable, setIsDisable] = useState(false);
  const [isMenuChecked, setMenuChecked] = useState(menuObj[0].is_active);

  // Added by Yuvraj Sahu on 7-4-2023
  // Reason - to get all menu, category and item and rerender page
  var { render, setRender } = useContext(AppStateContext);

  useEffect(() => {
    getAllmenus();
  }, [render]);

  var [menuObject, setMenuObject] = useState(menuObj);
  //  var menuObject = menuObj
  var [categoryObject, setCategoryObject] = useState([]);
  var [itemObject, setItemObject] = useState([""]);
  const getAllmenus = async () => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    var response = await getAllMenuList(tenant);
    if (response) {
      // setMenuObject((response.menuList).filter((dt) => dt.id == menuID )[0])
      setCategoryObject(
        response.categoryList.filter((dt) => dt.menu_id == menuID)
      );
    }
  };

  useEffect(() => {
    // setMenuObject()
    // getAllmenus()
  }, []);
  // End of addition

  // To upload image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // alert(result.assets[0].fileName);
      // setUploadedFileName(result.assets[0].fileName);
      setTempPhoto(result.assets[0]);
      // setTempPhoto(result.assets[0]);
    }
  };
  // End upload image

  const handleRegister = async (formValues) => {
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
    updateMenuApi(formData, tenant, menuID).then((response) => {
      if (response.msg) {
        Alert.alert("Succesfull", response.msg);
        var a = response.menuList.filter((dt) => dt.id == menuID);
        setMenuObject(a);
        setRender(!render);
        // navigate('login')
        // setState("stateChanged")
      }
      // end of addition
      if (response.error) {
        Alert.alert("Error", response.error);
      }
    });
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
      // name: menuObj[0].name,
      name: menuObject[0].name,
    },
  });

  // Added by Yuvraj Sahu on 4-4-2023
  // Reason - to navigate item screan and send filtered item list
  function itemFilter(categoryID, categoryName) {
    // Modified by Yuvraj Sahu on 7-4-2023
    // Reason - to filter new data
    var categoryObj = categoryObject.filter((dt) => dt.id == categoryID);
    // End of modification
    var filteredItems = itemList.filter((e) => e.category == categoryID);
    navigation.navigate("ItemListScreen", {
      categoryID: categoryID,
      categoryName: categoryName,
      itemList: filteredItems,
      menuID: menuID,
      menuName: menuName,
      categoryObj: categoryObj,
      menuList: menuList,
      categoryList: categoryList,
    });
  }
  // End of addition

  return (
    <ScrollView>
      <View style={styles.container}>
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
                  <Text style={styles.textdanger}>{errors?.name?.message}</Text>
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
          {/* Added and modified by Yuvraj Sahu on 16-4-2023
          Reason - to replace button from icon */}
          {/* <Button title="Edit menu icon" onPress={pickImage} /> */}
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
          {/* End of aadition */}
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
          {/* Added by Yuvraj Sahu on 13-42023
          Reason - to press active status in checkbox */}
          <Pressable onPress={() => setMenuChecked(!isMenuChecked)}>
            <Text style={styles.activeLable}>Menu available</Text>
          </Pressable>
          {/*End of addition*/}
        </View>
        <View style={{ marginBottom: 30, marginHorizontal: 10, marginTop: 10 }}>
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
          Reason : Add delete for functionality */}
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
              Delete menu
            </Text>
          </Pressable> */}
          {/* End of addition */}
        </View>
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryLable}>
            Categories inside {menuObject[0].name}
          </Text>
          {categoryObject.map((categoryData, id) => (
            <Pressable
              key={id}
              style={styles.categoryListContainer}
              onPress={(e) => itemFilter(categoryData.id, categoryData.name)}
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
        </View>
      </View>
    </ScrollView>
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
