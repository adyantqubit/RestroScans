// Added by Om on 8-4-23
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
  updateAllOffer,
  getAllOfferItemList,
  deleteOfferApi,
  deleteOfferItemsApi,
} from "../../api/Services";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import { colors } from "../../Colours/globalColor";
import config from "../../config/config";
import Icon from "react-native-vector-icons/FontAwesome";
import { useEffect } from "react";
import { useContext } from "react";
import { AppStateContext } from "../../context/AppStateProvider";
import { useIsFocused } from "@react-navigation/native";
import Footer from "../../components/Footer/Footer";
import { MaterialIcons } from "@expo/vector-icons";
export default function OfferItemsScreen({ route, navigation }) {
  const { banner } = route.params;

  const [tempPhoto, setTempPhoto] = useState(null);
  const [icon, setImage] = useState(null);
  var [isDisable, setIsDisable] = useState(false);

  const isFocused = useIsFocused();
  var { render, setRender } = useContext(AppStateContext);

  useEffect(() => {
    getAllOfferItems();
  }, [isFocused]);

  var [bannerObject, setBannerObject] = useState(banner);
  var [bannerItemList, setBannerItemList] = useState([]);

  const getAllOfferItems = async () => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    var response = await getAllOfferItemList(tenant);
    if (response) {
      var offerItemList = response.offerItemList.filter(
        (dt) => dt.offer_name == bannerObject.offer_name
      );
      setBannerItemList(offerItemList);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [10, 4], // Aspect changes by Om on 22-04-23 because we need to set the offer image size
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setTempPhoto(result.assets[0]);
    }
  };
  // End upload image

  // Update the valuesss
  const handleRegister = async (formValues) => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    var formData = new FormData();

    if (icon != null) {
      const ext = tempPhoto.uri.substring(tempPhoto.uri.lastIndexOf(".") + 1);
      formData.append("offer_image", {
        uri: icon,
        name: icon,
        type: `image/${ext}`,
      });
    }
    formData.append("offer_name", formValues.offer_name);
    formData.append("discount", formValues.discount);

    updateAllOffer(formData, tenant, bannerObject.id).then((response) => {
      if (response.msg) {
        // Modified by Om on 14-04-23
        // Reason : Correct the spelling of success
        Alert.alert("Successfull", response.msg);
        // End of modfication
        setRender(!render);
      }
      if (response.error) {
        Alert.alert("Error", response.error);
      }
    });
  };

  // Added by Om on 07-04-23
  // Reason : To delete the menu section
  const deleteBanner = async () => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;

    deleteOfferApi(tenant, bannerObject.id).then((response) => {
      if (response.msg) {
        Alert.alert("Successfull", response.msg);
        setRender(!render);
        navigation.pop();
      }
      if (response.error) {
        Alert.alert("Error", response.error);
      }
    });
  };

  function deleteBannerPermission() {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this banner/offer?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            deleteBanner();
          },
        },
      ]
    );
  }
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
      offer_name: bannerObject.offer_name,
      discount: `${!bannerObject.discount? "0":bannerObject.discount}`, //Modified by Om for set the null value to 0
    },
  });

  function deleteBannerItemPermission(bannerItemId) {
    Alert.alert("Confirmation", "Are you sure you want to delete this item?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          deleteBannerItem(bannerItemId);
        },
      },
    ]);
  }
  const deleteBannerItem = async (bannerItemId) => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;

    deleteOfferItemsApi(tenant, bannerItemId).then((response) => {
      if (response.msg) {
        Alert.alert("Succesfull", response.msg);
        setRender(!render);
        navigation.pop();
      }
      if (response.error) {
        Alert.alert("Error", response.error);
      }
    });
  };

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <View style={{ marginTop: 5 }}>
            <Text style={styles.labels}>Banner/Offer name</Text>
            <Controller
              control={control}
              name="offer_name"
              rules={{
                required: {
                  value: true,
                  message: "Banner/Offer name is required",
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
                  {errors?.offer_name && (
                    <Text style={styles.textdanger}>
                      {errors?.offer_name?.message}
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
            <Text>Banner/Offer image</Text>
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
            {/* Modification by Om on 15-04-23
                        Reason : Fix the image validation */}
            {/* <Button title="Banner image" onPress={pickImage} /> */}
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
            {/* End of modification */}
            {icon && (
              <Image
                source={{ uri: icon }}
                style={{ width: 50, height: 40, borderRadius: 5 }}
              />
            )}
            {!icon && bannerObject.offer_image && (
              <Image
                source={{
                  uri: config.staticBaseURL + bannerObject.offer_image,
                }}
                style={{ width: 50, height: 40, borderRadius: 5 }}
              />
            )}
          </View>
          <View style={{ marginTop: 5 }}>
            <Text style={styles.labels}>Discount(%)</Text>
            <Controller
              control={control}
              name="discount"
              rules={{
                pattern: {
                    value: /^\d{0,2}$/,
                    message: "Discount is not valid",
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
                      placeholder="Enter Discount"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry={false}
                      placeholderTextColor="#A4A4A4"
                      editable={true}
                      keyboardType="number-pad"
                    />
                  </View>
                  {errors?.discount && (
                    <Text style={styles.textdanger}>
                      {errors?.discount?.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>

          <View style={styles.btns}>
            <Pressable
              onPress={handleSubmit(handleRegister)}
              disabled={isDisable}
              style={{
                backgroundColor: isDisable ? "grey" : colors.btnColor,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 7,
                width: 165,
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
            <Pressable
              onPress={deleteBannerPermission}
              disabled={isDisable}
              style={{
                backgroundColor: isDisable ? "grey" : colors.anotherButton,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 7,
                marginLeft: 20,
                width: 165,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Delete
              </Text>
            </Pressable>
            {/* End of addition */}
          </View>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLable}>
              Items inside this Banner/Offer {bannerObject.name}
            </Text>
            {bannerItemList.length > 0 ? (
              <>
                {bannerItemList.map((setData, id) => (
                  <View key={id} style={styles.categoryListContainer}>
                    <Image
                      source={{
                        uri: config.staticBaseURL + setData.item_image,
                      }}
                      style={styles.menuIcon}
                    />
                    <Text>{setData.item_name}</Text>
                    <Pressable
                      onPress={(e) => deleteBannerItemPermission(setData.id)}
                    >
                      <MaterialIcons name="delete" size={24} color="red" />
                    </Pressable>
                  </View>
                ))}
              </>
            ) : (
              // Modified by Om on 19-04-23
              <View
                style={{
                  height: 200,
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                <Text>No items are listed here</Text>
              </View>
              // End of addtion
            )}
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
  // Modification by Om on 15-04-23
  // Reason : Fix the image validation
  btns: {
    alignSelf: "center",
    marginBottom: 20,
    flexDirection: "row",
  },
  // End of modification
});
