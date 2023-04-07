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
import * as SecureStore from "expo-secure-store";

import { Ionicons } from "@expo/vector-icons";
import { getMenuList, saveCategoryApi, saveMenuApi } from "../api/Services";
import { colors } from "../Colours/globalColor";
// import { tenantName } from "../config/config";
import { SelectList } from "react-native-dropdown-select-list";
// import { Country, State, City } from "country-state-city";

export default function AddCategory() {
  // Added by Yuvraj Sahu on 24-3-2023
  // Reason - to show menu list in dropdown
  const [menuSelected, setMenuSelected] = React.useState("");
  var [data, setData] = useState([]);
  React.useEffect(() => {
    const getMenus = async () => {
      var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
      const response = await getMenuList(JSON.parse(tenantInfo).tenant_name);
      if (response.menuList) {
        capitals = setData(
          response.menuList.map(function (obj) {
            obj["key"] = obj["id"]; // Assign new key
            obj["value"] = obj["name"]; // Rename key
            delete obj["id"]; // Delete old key
            delete obj["name"]; // Delete name
            delete obj["icon"]; // Delete icon
            return obj;
          })
        );
      }
    };
    getMenus();
    getTenant();
  }, []);
  // End of show menu list

  var [isDisable, setIsDisable] = useState(false);

  const [tempPhoto, setTempPhoto] = useState(null);

  const [icon, setImage] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");

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
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setUploadedFileName(result.assets[0].fileName);
      setTempPhoto(result.assets[0]);
    }
  };

  const handleRegister = async (formValues) => {
    setIsDisable(true);
    var formData = new FormData();

    const ext = tempPhoto.uri.substring(tempPhoto.uri.lastIndexOf(".") + 1);

    formData.append("icon", {
      uri: icon,
      name: icon,
      type: `image/${ext}`,
    });
    formData.append("name", formValues.name);
    formData.append("menu", menuSelected);

    var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
    saveCategoryApi(formData, JSON.parse(tenantInfo).tenant_name).then(
      (response) => {
        if (response.msg) {
          Alert.alert("Successful", response.msg);
          setIsDisable(false);
          // navigate('login')
        }
        if (response.err) {
          Alert.alert("Error", response.msg);
          setIsDisable(false);
        }
      }
    );
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
      name: "",
      menu: "",
      // icon: ""
    },
  });

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>Add category</Text>
        <SelectList
          // onSelect={() => }
          setSelected={setMenuSelected}
          data={data}
          search={false}
          boxStyles={{ borderRadius: 0 }} //override default styles
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
                  <Text style={styles.textdanger}>{errors?.name?.message}</Text>
                )}
              </>
            )}
          />
        </View>

        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Button title="Add category icon" onPress={pickImage} />
          {icon && (
            <Image source={{ uri: icon }} style={{ width: 200, height: 200 }} />
          )}
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
