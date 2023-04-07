// Created by Yuvraj Sahu on 6-4-2023
// Reason - to edit item

import React, { useState, useEffect } from "react";
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
import { useForm, Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { getMenuList, saveCategoryApi, saveItemApi, updateItemApi } from "../api/Services";
import { colors } from "../Colours/globalColor";
import * as SecureStore from "expo-secure-store";
// import { tenantName } from "../config/config";
import { SelectList } from "react-native-dropdown-select-list";
import Checkbox from "expo-checkbox";
import config from "../config/config";

export default function EditItemScreen({ route, navigation }) {
  /* Get the param */
  const { itemID, categoryList, itemObj, categoryID, categoryName } =
    route.params;

  // added by Yuvraj Sahu on 6-4-2023
  // Reason - to check checkbox
  const [isItemChecked, setItemChecked] = useState(itemObj[0].is_active);
  // End of addition

  const [categorySelected, setCategorySelected] = React.useState("");
  var [categories, setCategories] = useState([]);
  React.useEffect(() => {
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
    };
    getMenus();
    getTenant();
  }, []);
  // End of show menu list

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
    // setIsDisable(true);
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
    formData.append("price_half", formValues.price_half);
    formData.append("price_full", formValues.price_full);
    formData.append("category", categorySelected);
    formData.append("description", formValues.description);

    // console.log('formData------'+JSON.stringify(formData))
    updateItemApi(formData, tenant, itemID).then((response) => {
      if (response.msg) {
        Alert.alert("Successful", response.msg);
        setIsDisable(false);
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

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>Edit item</Text>
        <SelectList
          // onSelect={setCategorySelected}
          setSelected={setCategorySelected}
          data={categories}
          search={false}
          boxStyles={{ borderRadius: 0 }} //override default styles
          defaultOption={{ key: categoryID, value: categoryName }}
        />
        <View style={{ marginTop: 5 }}>
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
                  <Text style={styles.textdanger}>{errors?.name?.message}</Text>
                )}
              </>
            )}
          />
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Half price
          </Text>
          <Controller
            control={control}
            name="price_half"
            rules={{
              required: {
                value: true,
                message: "Half price is required!",
              },
              // pattern: {
              //   value: /^[6789]\d{9}$/,
              //   message: "Mobile Number is invalid!",
              // },
            }}
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
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Full price
          </Text>
          <Controller
            control={control}
            name="price_full"
            rules={{
              required: {
                value: true,
                message: "Full price is required!",
              },
              // pattern: {
              //   value: /^[6789]\d{9}$/,
              //   message: "Mobile Number is invalid!",
              // },
            }}
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
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Description
          </Text>
          <Controller
            control={control}
            name="description"
            rules={{
              required: {
                value: true,
                message: "Description is required!",
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
          <Button title="Add item icon" onPress={pickImage} />
          {icon && (
            <Image source={{ uri: icon }} style={{ width: 200, height: 200 }} />
          )}
          {!icon && itemObj[0].icon && (
            <Image
              source={{ uri: config.staticBaseURL + itemObj[0].icon }}
              style={{ width: 50, height: 40, borderRadius: 5 }}
            />
          )}
        </View>
        <Checkbox
          // style={styles.checkbox}
          value={isItemChecked}
          onValueChange={setItemChecked}
          color={isItemChecked ? "#4630EB" : undefined}
        />
        <Text>Active</Text>
        <View style={{ marginBottom: 30, marginHorizontal: 10, marginTop: 10 }}>
          <Pressable
            onPress={handleSubmit(handleRegister)}
            disabled={isDisable}
            style={{
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
        </View>
      </View>
    </ScrollView>
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
    borderRadius: 3,
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
});
