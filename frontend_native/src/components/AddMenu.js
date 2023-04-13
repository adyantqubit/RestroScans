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

import { useForm, Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { getMenuList, saveMenuApi } from "../api/Services";
import { colors } from "../Colours/globalColor";
import { AppStateContext } from "../context/AppStateProvider";
import Checkbox from "expo-checkbox";
// import { tenantName } from "../config/config";
// import { Country, State, City } from "country-state-city";

export default function AddMenu() {
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
    },
  });

  var [isDisable, setIsDisable] = useState(false);

  const [tempPhoto, setTempPhoto] = useState(null);

  var { render, setRender } = useContext(AppStateContext);

  useEffect(() => {}, [render]);

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
      // alert(result.assets[0].fileName);
      setUploadedFileName(result.assets[0].fileName);
      setTempPhoto(result.assets[0]);
      // setTempPhoto(result.assets[0]);
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
  var [menuList, setMenuList] = useState([]);
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

  const handleRegister = async (formValues) => {
    var formData = new FormData();

    const ext = tempPhoto.uri.substring(tempPhoto.uri.lastIndexOf(".") + 1);

    formData.append("icon", {
      uri: icon,
      name: icon,
      type: `image/${ext}`,
    });

    formData.append("name", formValues.name);
    // Added by Yuvraj Sahu on 12-4-2023
    // Reason - to save active status
    formData.append("is_active", isMenuActive);
    // End of addition

    saveMenuApi(formData, tenant).then((response) => {
      if (response.msg) {
        Alert.alert("Succesfull", response.msg);
        setRender(!render);
        reset("");
        setImage(null);
        setMenuActive(false);
        // navigate('login')
        // setState("stateChanged")
      }
      if (response.err) {
        Alert.alert("Error", response.err);
      }
    });
  };

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
          <Text>Upload icon</Text>
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
          <Button title="Add menu icon" onPress={pickImage} />
          {icon && (
            <Image
              source={{ uri: icon }}
              style={{ width: 50, height: 40, borderRadius: 5 }}
            />
          )}
        </View>

        {/* Added by Yuvraj Sahu on 12-4-2023
        Reason - to select active status */}
        <View style={styles.activeStatus}>
          <Checkbox
            value={isMenuActive}
            onValueChange={setMenuActive}
            color={isMenuActive ? "#4630EB" : undefined}
          />
          <Pressable onPress={() => setMenuActive(!isMenuActive)}>
            <Text style={styles.activeLable}>Active status</Text>
          </Pressable>
        </View>
        {/* End of addition */}

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
        {menuList.map((dt, id) => (
          <View key={id}>
            <Text>{dt.name}</Text>
          </View>
        ))}
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
