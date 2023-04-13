// Created by Om on 08-04-2023
// Reason - to create banner items section

import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    Pressable,
} from "react-native";

import { useForm } from "react-hook-form";
import * as SecureStore from "expo-secure-store";
import { getAllOfferList, getMenuList, saveAllOfferItems } from "../api/Services";
import { colors } from "../Colours/globalColor";
import { SelectList } from "react-native-dropdown-select-list";
import { useContext } from "react";
import { AppStateContext } from "../context/AppStateProvider";
import { useIsFocused } from "@react-navigation/native";

export default function AddBannerItems() {

    const [offerSelect, setOfferSelect] = React.useState("");
    const [menuList, setMenuList] = React.useState("");
    var { render, setRender } = useContext(AppStateContext)

    const isFocused = useIsFocused();

    var [data, setData] = useState([]);
    var [menuData, setMenuData] = useState([]);

    // Need to set the banner data in dropdown format
    useEffect(() => {
        // const getOfferName = async () => {
        //     var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
        //     const response = await getAllOfferList(JSON.parse(tenantInfo).tenant_name);
        //     if (response.offerBanner) {
        //         capitals = setData(
        //             response.offerBanner.map(function (obj) {
        //                 obj["key"] = obj["id"]; // Assign new key
        //                 obj["value"] = obj["offer_name"]; // Rename key
        //                 delete obj["id"]; // Delete old key
        //                 delete obj["offer_name"]; // Delete offer_name
        //                 delete obj["discount"]; // Delete discount
        //                 delete obj["offer_image"]; // Delete offer_image
        //                 delete obj["description"]; // Delete description
        //                 return obj;
        //             })
        //         );
        //     }
        // };
        // // In this method we set the all banner items in dropdown format
        // const getAllItems = async () => {
        //     var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
        //     const response = await getMenuList(JSON.parse(tenantInfo).tenant_name);
        //     if (response.itemList) {
        //         capitals = setMenuData(
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
        getOfferName();
        getAllItems();
        getTenant();
    }, [isFocused]);
    // End of show menu list

    const getOfferName = async () => {
        var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
        const response = await getAllOfferList(JSON.parse(tenantInfo).tenant_name);
        if (response.offerBanner) {
            capitals = setData(
                response.offerBanner.map(function (obj) {
                    obj["key"] = obj["id"]; // Assign new key
                    obj["value"] = obj["offer_name"]; // Rename key
                    delete obj["id"]; // Delete old key
                    delete obj["offer_name"]; // Delete offer_name
                    delete obj["discount"]; // Delete discount
                    delete obj["offer_image"]; // Delete offer_image
                    delete obj["description"]; // Delete description
                    return obj;
                })
            );
        }
    };
    // In this method we set the all banner items in dropdown format
    const getAllItems = async () => {
        var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
        const response = await getMenuList(JSON.parse(tenantInfo).tenant_name);
        if (response.itemList) {
            capitals = setMenuData(
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

    // Button disable, undisable set in this method
    var [isDisable, setIsDisable] = useState(false);

    // Find the tenant name in this method
    var [tenant, setTenant] = useState("");
    const getTenant = async () => {
        var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
        setTenant(JSON.parse(tenantInfo).tenant_name);
    };

    // Post the data in this method
    const handleRegister = async (formValues) => {
        setIsDisable(true);
        var formData = new FormData();

        formData.append("offer_name", offerSelect);
        formData.append("item_name", menuList);

        var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
        saveAllOfferItems(formData, JSON.parse(tenantInfo).tenant_name).then(
            (response) => {
                if (response.msg) {
                    Alert.alert("Successful", response.msg);
                    setRender(!render)
                    setIsDisable(false);
                    // navigate('login')
                }
                if (response.error) {
                    Alert.alert("Error", response.error);
                    setIsDisable(false);
                }
            }
        );
    };

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            offer_name: "",
            item_name: "",
            // icon: ""
        },
    });

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text>Add offer name</Text>
                <SelectList
                    setSelected={setOfferSelect}
                    data={data}
                    search={false}
                    boxStyles={{ borderRadius: 0 }} //override default styles
                />
                <View style={{ marginTop: 5 }}>
                    <Text style={styles.labels}>
                        <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
                        Add item name
                    </Text>
                    <SelectList
                        setSelected={setMenuList}
                        data={menuData}
                        search={false}
                        boxStyles={{ borderRadius: 0 }} //override default styles
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
