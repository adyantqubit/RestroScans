import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Button,
  Pressable,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import config from "../config/config";
import Icon from "react-native-vector-icons/FontAwesome";
import { getMenuList, saveCategoryApi } from "../api/Services";
import * as SecureStore from "expo-secure-store";
import { colors } from "../Colours/globalColor";
import { useForm, Controller } from "react-hook-form";
import { SelectList } from "react-native-dropdown-select-list";
import * as ImagePicker from "expo-image-picker";

export default function ItemListScreen({ route, navigation }) {

  /* Get the param */
  const { categoryID, categoryName, itemList } = route.params;
  
  // Added by Yuvraj Sahu on 5-4-2023
  // Reason - to disable button and set image
  var [isDisable, setIsDisable] = useState(false); // For save button disable
  const [icon, setImage] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [tempPhoto, setTempPhoto] = useState(null);
  // End of addition

  // Added by Yuvraj Sahu on 5-4-2023
  // Reason - to show category list in dropdown
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
    // getTenant()
  }, []);

  //   For upload image
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
  // End of upload image

  // For make data and send it to backend
  const handleRegister = async (formValues) => {
    // setIsDisable(true)
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
  // End of sending data

  // Sending item id for edit item data
  function handleEditItem(itemID) {
    navigation.navigate("ItemEditScreen", { itemID: itemID });
  }
  // End of sending item id

  //   For set values using useForm
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
      name: categoryName,
      menu: "",
      // icon: ""
    },
  });
  //   End of set values

  return (
    <ScrollView>
      {/* Edit Category Form  */}
      <View style={styles.container}>
        <Text>Edit category</Text>
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
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryLable}>{categoryName}</Text>
        {itemList.map((dt, id) => (
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Form style
  container: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  labels: {
    paddingHorizontal: 10,
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
  textdanger: {
    color: "#dc3545",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  // End form style
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
    // shadowColor: "#171717",
    // shadowOffset: { width: -3, height: 4 },
    // shadowOpacity: 0.3,
    // shadowRadius: 3,
  },
  categoryLable: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
