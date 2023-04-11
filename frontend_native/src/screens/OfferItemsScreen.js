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
import { saveMenuApi, updateAllOffer, getAllOfferItemList, deleteOfferApi } from "../api/Services";
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
export default function OfferItemsScreen({ route, navigation }) {

    const { offerName, bannerName, offerList,bannerList ,bannerItemList} = route.params;
    const [tempPhoto, setTempPhoto] = useState(null);
    const [icon, setImage] = useState(null);
    var [isDisable, setIsDisable] = useState(false);

    var { render, setRender } = useContext(AppStateContext)
// alert(JSON.stringify(bannerItemList[0].id))
    useEffect(() => {
        getAllOffers()
    }, [render])

    var [bannerObject, setBannerObject] = useState(bannerName);
    var [bannerItemObject, setBannerItemsObject] = useState([]);

    const getAllOffers = async () => {
        var tenant = JSON.parse(
            await SecureStore.getItemAsync("tenantInfo")
        ).tenant_name;
        var response = await getAllOfferItemList(tenant)
        if (response) {
            setBannerItemsObject((response.offerItemList).filter((dt) => dt.offer_name == offerName))
        }
    }

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
//         alert(bannerName[0].id)
// alert(tenant)
        updateAllOffer(formData, tenant, bannerName[0].id).then((response) => {
            if (response.msg) {
                Alert.alert("Succesfull", response.msg);
                // var a = response.offerBanner.filter((dt) => dt.id == bannerName[0].id)
                // setBannerObject(a)
                setRender(!render)
            }
            if (response.error) {
                Alert.alert("Error", response.error);
            }
        });

    };

    // Added by Om on 07-04-23
    // Reason : To delete the menu section
    const handleDelete = async () => {
      var tenant = JSON.parse(
        await SecureStore.getItemAsync("tenantInfo")
      ).tenant_name;

      deleteOfferApi(tenant, bannerList[0].id).then((response) => {
        if (response.msg) {
          Alert.alert("Succesfull", response.msg);
          setRender(!render)
          navigation.pop()
        }
        if (response.error) {
          Alert.alert("Error", response.error);
        }
      });
    };

    function showAlert1() {
      Alert.alert(
        'Alert Title',
        'My Alert Msg',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => { handleDelete() }
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
            // name: menuObj[0].name,
            offer_name: bannerObject[0].offer_name,
            discount: `${bannerObject[0].discount}`

        },
    });

    function bannerItemfilter(offerItemList) {
        var allItems = bannerItemObject.filter((dt) => dt.item_name == offerItemList);
        navigation.navigate("OfferItemsDetailScreen", {
            offerItemList: offerItemList,
            bannerName: bannerName,
            offerList: offerList,
            allItems: allItems,
            offerName: offerName,
            bannerList:bannerList,
            bannerItemList:bannerItemList
        });
        //   alert(JSON.stringify(offerList))
        //   alert(JSON.stringify(allItems))
        //   alert(JSON.stringify(bannerName))
        // alert(offerItemList)
        // alert(JSON.stringify(bannerList))

    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={{ marginTop: 5 }}>
                    <Text style={styles.labels}>
                        <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
                        Edit banner name
                    </Text>
                    <Controller
                        control={control}
                        name="offer_name"
                        rules={{
                            required: {
                                value: true,
                                message: "Banner name is required",
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
                                {errors?.offer_name && (
                                    <Text style={styles.textdanger}>{errors?.offer_name?.message}</Text>
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
                    <Text>Edit banner image</Text>
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
                    <Button title="Edit banner image" onPress={pickImage} />
                    {icon && (
                        <Image
                            source={{ uri: icon }}
                            style={{ width: 50, height: 40, borderRadius: 5 }}
                        />
                    )}
                    {!icon && bannerName[0].offer_image && (
                        <Image
                            source={{ uri: config.staticBaseURL + bannerName[0].offer_image }}
                            style={{ width: 50, height: 40, borderRadius: 5 }}
                        />
                    )}
                </View>
                <View style={{ marginTop: 5 }}>
                    <Text style={styles.labels}>
                        <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
                        Discount
                    </Text>
                    <Controller
                        control={control}
                        name="discount"
                        rules={{
                            required: {
                                value: true,
                                message: "Discount is required!",
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
          Reason : Add delete for functionality */}
                    <Pressable
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
              Delete banner
            </Text>
          </Pressable>
                    {/* End of addition */}

                </View>
                <View style={styles.categoryContainer}>
                    <Text style={styles.categoryLable}>Banner Items inside {bannerObject[0].name}</Text>
                    {bannerItemObject.length > 0 ? (
                        <>
                            {bannerItemObject.map((setData, id) => (
                                <Pressable
                                    key={id}
                                    style={styles.categoryListContainer}
                                    onPress={(e) => bannerItemfilter(setData.item_name)}
                                >
                                    <Image
                                        source={{
                                            uri: config.staticBaseURL + setData.item_image,
                                        }}
                                        style={styles.menuIcon}
                                    />
                                    <Text>{setData.item_name}</Text>
                                    <Icon name="edit" size={20} color="black" />
                                </Pressable>
                            ))}
                        </>
                    ) : (
                        <Text style={{ marginTop: 150 }}>No items are listed here</Text>
                    )}
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
        paddingTop: 10
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
        marginTop: 5
    },
    activeLable: {
        marginLeft: 10
    }
});