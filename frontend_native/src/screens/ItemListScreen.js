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
import config from "../config/config";
import Icon from "react-native-vector-icons/FontAwesome";
import {
	getAllMenuList,
  deleteCategoryApi,
  getMenuList,
  saveCategoryApi,
  updateCategoryApi,
  updateItemApi,
} from "../api/Services";
import * as SecureStore from "expo-secure-store";
import { colors } from "../Colours/globalColor";
import { useForm, Controller } from "react-hook-form";
import { SelectList } from "react-native-dropdown-select-list";
import * as ImagePicker from "expo-image-picker";
import Checkbox from "expo-checkbox";
import { useContext } from "react";
import { AppStateContext } from "../context/AppStateProvider";

export default function ItemListScreen({ route, navigation }) {
  /* Get the param */
  const {
    categoryID,
    categoryName,
    itemList,
    menuName,
    menuID,
    categoryList,
    menuList,
    categoryObj,
  } = route.params;

  // Added by Yuvraj Sahu on 5-4-2023
  // Reason - to disable button and set image
  var [isDisable, setIsDisable] = useState(false); // For save button disable
  const [icon, setImage] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [tempPhoto, setTempPhoto] = useState(null);
  // End of addition

  // added by Yuvraj Sahu on 7-4-2023
  // Reason - to set category object
  var [categoryObject, setCategoryObject] = useState(categoryObj);
  // End of addition

  // added by Yuvraj Sahu on 6-4-2023
  // Reason - to check checkbox
  const [isCategoryChecked, setCategoryChecked] = useState(
    categoryObj[0].is_active
  );
  // End of addition

  var {render, setRender} = useContext(AppStateContext)
  // Added by Yuvraj Sahu on 5-4-2023
  // Reason - to show category list in dropdown
  const [menuSelected, setMenuSelected] = React.useState("");
  var [data, setData] = useState([]);
  React.useEffect(() => {
    const getMenus = async () => {
      
      // var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
      // const response = await getMenuList(JSON.parse(tenantInfo).tenant_name);
      // if (response.menuList) {
      setData(
        menuList.map(function (obj) {
          obj["key"] = obj["id"]; // Assign new key
          obj["value"] = obj["name"]; // Rename key
          delete obj["id"]; // Delete old key
          delete obj["name"]; // Delete name
          delete obj["icon"]; // Delete icon
          return obj;
        })
      );
      // }
    };
    getMenus();
    // getTenant()
    getAllmenus()
  }, [render]);

  // Added by Yuvraj Sahu on 7-4-2023
  // Reason - to get all menuus for filteration
  var [itemObjects, setItemObjects] =useState([]);
  const getAllmenus = async () => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    var response = await getAllMenuList (tenant)
    if (response) {
      // setMenuObject((response.menuList).filter((dt) => dt.id == menuID )[0])
      setItemObjects((response.itemList).filter((dt) => dt.category_id == categoryID ))
      // setRender(!render)
    }
  }
    // end of getting menus

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
    updateCategoryApi(
      formData,
      JSON.parse(tenantInfo).tenant_name,
      categoryID
    ).then((response) => {
      if (response.msg) {
        Alert.alert("Successful", response.msg);
        setIsDisable(false);
        setRender(!render)
        // alert(JSON.stringify(response.categoryList))
        var categories = (response.categoryList).filter((dt)=>dt.id == categoryID)
        setCategoryObject(categories)
        
        // navigate('login')
      }
      if (response.error) {
        Alert.alert("Error", response.error);
        setIsDisable(false);
      }
    });
  };
  // End of sending data

  // Sending item id for edit item data
  function handleEditItem(itemID) {
    var itemObj = itemObjects.filter((dt) => dt.id == itemID);
    navigation.navigate("ItemEditScreen", {
      itemID: itemID,
      categoryList: categoryList,
      itemObj: itemObj,
      categoryID: categoryObj[0].id,
      categoryName: categoryObj[0].name,
    });
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

  return (
    <ScrollView>
      {/* Edit Category Form  */}
      <View style={styles.container}>
        <Text style={styles.labels}>
          <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
          Menu name
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
          // Added by Yuvraj Sahu on 6-4-2023
          // Reason - to select default value in dropdown
          defaultOption={{ key: menuID, value: menuName }}
          // End of default value selection
        />
        <View style={{ marginTop: 15 }}>
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

        {/* Added by Yuvraj Sahu on 13-4-2023
        Reason - to add lable for upload image */}
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
          <Text>Item image</Text>
        </View>
        {/* End of addition */}

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
          <Button title="Edit category icon" onPress={pickImage} />
          {icon && (
            <Image source={{ uri: icon }} style={{ width: 50, height: 40, borderRadius: 5 }} />
          )}
          {!icon && categoryObj[0].icon && (
            <Image
              source={{ uri: config.staticBaseURL + categoryObj[0].icon }}
              style={{ width: 50, height: 40, borderRadius: 5 }}
            />
          )}
        </View>
        <View style={styles.activeStatus}>
        <Checkbox
          // style={styles.checkbox}
          value={isCategoryChecked}
          onValueChange={setCategoryChecked}
          color={isCategoryChecked ? "#4630EB" : undefined}
        />
        {/*Added by Yuvraj Sahu on 13-4-2023
        Reason - to make pressable active status lable */}
        <Pressable onPress={() => setCategoryChecked(!isCategoryChecked)}>
        <Text style={styles.activeLable}>Category available</Text>
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
              Delete category
            </Text>
          </Pressable> */}
          {/* End of addition */}

        </View>
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryLable}>Items inside {categoryObject[0].name}</Text>
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
    paddingTop: 15
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
  activeStatus: {
    display: "flex",
    flexDirection: "row",
    width: "93%",
    alignSelf: "center",
    marginTop: 10
  },
  activeLable: {
    marginLeft: 10
  }
});
