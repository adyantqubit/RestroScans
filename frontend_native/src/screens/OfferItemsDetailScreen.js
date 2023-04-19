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
import React, { useState,useEffect } from "react";
import config from "../config/config";
import Icon from "react-native-vector-icons/FontAwesome";
import {
    getAllOfferItemList,
    deleteOfferItemsApi,
    getMenuList,
    saveCategoryApi,
    updateAllOfferItems,
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
import { useIsFocused } from "@react-navigation/native";
import Footer from '../../src/components/Footer/Footer'


export default function OfferItemsDetailScreen({ route, navigation }) {
    /* Get the param */
    const {
        bannerList,
        offerName,
        allItems,
        offerItemList,
        bannerItemList,
        bannerItemId,
        bannerId,
        itemsId
    } = route.params;

    var [isDisable, setIsDisable] = useState(false); // For save button disable

    const isFocused = useIsFocused();
    const [icon, setImage] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState("");
    const [tempPhoto, setTempPhoto] = useState(null);
    // End of addition

    var [allitemsObject, setAllItemsObject] = useState(allItems);

    var { render, setRender } = useContext(AppStateContext)

    var { offerItemId, setOfferItemId} = useContext(AppStateContext)

    const [menuSelected, setMenuSelected] = React.useState("");
    const [itemSelected, setItemSelected] = React.useState("");
    var [data, setData] = useState([]);
    var [itemNamedata, setItemNameData] = useState([]);

    // alert(offerName)
    // alert( bannerId)


    useEffect(() => {
        // const getMenus = async () => {
        //     setData(
        //         bannerList.map(function (obj) {
        //             obj["key"] = obj["id"]; // Assign new key
        //             obj["value"] = obj["offer_name"]; // Rename key
        //             delete obj["id"]; // Delete old key
        //             delete obj["offer_name"]; // Delete name
        //             delete obj["discount"]; // Delete icon
        //             delete obj["offer_image"]; // Delete icon

        //             return obj;
        //         })
        //     );
        // };
        // const getOfferItem = async () => {
        //     var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
        //     const response = await getMenuList(JSON.parse(tenantInfo).tenant_name);
        //     if (response.itemList) {
        //         capitals = setItemNameData(
        //             response.itemList.map(function (obj) {
        //                 obj["key"] = obj["id"]; // Assign new key
        //                 obj["value"] = obj["name"]; // Rename key
        //                 delete obj["id"]; // Delete old key
        //                 delete obj["name"]; // Delete name
        //                 delete obj["icon"]; // Delete icon
        //                 delete obj["category_name"]; // Delete category_name
        //                 delete obj["category_img"]; // Delete category_img
        //                 delete obj["menu_name"]; // Delete menu_name
        //                 delete obj["menu_img"]; // Delete menu_img
        //                 delete obj["item_type"]; // Delete item_type
        //                 delete obj["price_full"]; // Delete price_full
        //                 delete obj["price_half"]; // Delete price_half
        //                 delete obj["description"]; // Delete description
        //                 return obj;
        //             })
        //         );
        //     }
        // };
        getMenus();
        getOfferItem();
        getAllmenus()
    }, [isFocused]);

    const getMenus = async () => {
        setData(
            bannerList.map(function (obj) {
                obj["key"] = obj["id"]; // Assign new key
                obj["value"] = obj["offer_name"]; // Rename key
                delete obj["id"]; // Delete old key
                delete obj["offer_name"]; // Delete name
                delete obj["discount"]; // Delete icon
                // delete obj["offer_image"]; 

                return obj;
            })
        );
    };
    const getOfferItem = async () => {
        var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
        const response = await getMenuList(JSON.parse(tenantInfo).tenant_name);
        if (response.itemList) {
            capitals = setItemNameData(
                response.itemList.map(function (obj) {
                    obj["key"] = obj["id"]; // Assign new key
                    obj["value"] = obj["name"]; // Rename key
                    delete obj["id"]; // Delete old key
                    delete obj["name"]; // Delete name
                    delete obj["icon"]; // Delete icon
                    delete obj["category_name"]; // Delete category_name
                    delete obj["category_img"]; // Delete category_img
                    delete obj["menu_name"]; // Delete menu_name
                    delete obj["menu_img"]; // Delete menu_img
                    delete obj["item_type"]; // Delete item_type
                    delete obj["price_full"]; // Delete price_full
                    delete obj["price_half"]; // Delete price_half
                    delete obj["description"]; // Delete description
                    return obj;
                })
            );
        }
    };

    var [itemObjects, setItemObjects] = useState([]);
    const getAllmenus = async () => {
        var tenant = JSON.parse(
            await SecureStore.getItemAsync("tenantInfo")
        ).tenant_name;
        var response = await getAllOfferItemList(tenant)
        if (response) {
            // setItemObjects((response.offerItemList).filter((dt) => dt.offer_name == offerName))
            setItemObjects((response.offerItemList).filter((dt) => dt.item_id == offerItemId))

        }
    }



// alert(JSON.stringify( offerItemId))
// alert(itemObjects)

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

    // For make data and send it to backend
    const handleRegister = async (formValues) => {
        var formData = new FormData();

        //   if (icon != null) {
        //     const ext = tempPhoto.uri.substring(tempPhoto.uri.lastIndexOf(".") + 1);
        //     formData.append("icon", {
        //       uri: icon,
        //       name: icon,
        //       type: `image/${ext}`,
        //     });
        //   }
        formData.append("offer_name", menuSelected);
        formData.append("item_name", itemSelected);

        var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
        updateAllOfferItems(
            formData,
            JSON.parse(tenantInfo).tenant_name,
            // bannerItemList[0].id,
            bannerItemId,
        ).then((response) => {
            if (response.msg) {
                Alert.alert("Successful", response.msg);
                //   setIsDisable(false);
                setRender(!render)
                //   var categories = (response.categoryList).filter((dt)=>dt.id == categoryID)
                //   setAllItemsObject(categories)

            }
            // if (response.error) {
            //     Alert.alert("Error", response.error);
            //     //   setIsDisable(false);
            // }
            else{
                // if (response.error) {
                //     alert(response.error)
                    Alert.alert("Error", "This banner or item name already exist");
                  //  End of addition
                    // setIsDisable(false);
                }
        });
    };


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
            offer_name: "",
            item_name: "",
        },
    });
    //   End of set values

    // Added by Om on 07-04-23
    // Reason : To delete the category section

    const handleDelete = async () => {
      var tenant = JSON.parse(
        await SecureStore.getItemAsync("tenantInfo")
      ).tenant_name;

      deleteOfferItemsApi(tenant, bannerItemId).then((response) => {
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
        'Confirmation',
        'Are you sure to want delete this item',
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

    return (
        <>
        <ScrollView>
            {/* Edit Category Form  */}
            <View style={styles.container}>
                <Text style={styles.labels}>
                    {/* <Text style={{ color: "red", fontWeight: "650" }}>* </Text> */}
                    Banner/Offer name
                </Text>
                <SelectList
                    setSelected={setMenuSelected}
                    data={data}
                    search={false}
                    boxStyles={{
                        borderRadius: 0,
                        width: "93%",
                        alignSelf: "center",
                        borderRadius: 5,
                        borderColor: "black",
                        marginTop: 10,
                    }}
                    // defaultOption={{ key: 1, value: "hghjk" }}
                    // defaultOption={{ key: offerName, value: offerName }}
                    defaultOption={{ key: bannerId, value: offerName }}
                    
                />
                <View style={{ marginTop: 15 }}>
                    <Text style={styles.labels}>
                        {/* <Text style={{ color: "red", fontWeight: "650" }}>* </Text> */}
                        Item name
                    </Text>
                    
                    <SelectList
                        setSelected={setItemSelected}
                        data={itemNamedata}
                        search={false}
                        boxStyles={{
                            borderRadius: 0,
                            width: "93%",
                            alignSelf: "center",
                            borderRadius: 5,
                            borderColor: "black",
                            marginTop: 10,
                        }}
                        defaultOption={{ key: itemsId, value: offerItemList }}
                    />
                </View>

                <View style={styles.btns}
                //  style={{ marginBottom: 30, marginHorizontal: 10, marginTop: 10 }}
                 >
                    <Pressable
                        onPress={handleSubmit(handleRegister)}
                        disabled={isDisable}
                        style={{
                            backgroundColor: isDisable ? "grey" : colors.btnColor,
                            height: 40,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 7,
                            width:165
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
                    <Pressable
              onPress={showAlert1}
              disabled={isDisable}
              style={{
                backgroundColor: isDisable ? "grey" : colors.anotherButton,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 7,
                marginLeft:20,
                width:165
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
            </View>
        </ScrollView>
       {/* Added by Om on 18-04-23 For showing the footer*/}
       <Footer/>
       {/* End of addition */}
    </>
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
    },
    // Modification by Om on 15-04-23
    // Reason : Fix the image validation
    btns: {
        alignSelf: "center",
        marginBottom: 20,
        flexDirection:'row',
        marginTop:20
    },
    // End of modification
});
