// Added by :-  Parineeta Gedam on 24-05-2023
// Reason - to desigin and functionality of add order item

import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, Button, Pressable, Alert, Modal, TextInput } from "react-native";
import { colors, inputs } from "../../Colours/globalColor";
import { getAllMenuList, postOrderItemsApi, getAllOfferList } from "../../api/Services";
import { Formik } from "formik";
import SelectDropdown from "react-native-select-dropdown";
import { AntDesign } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { addOrderItemSchema } from "../../validation/ValidationSchema";
import { useIsFocused } from "@react-navigation/native";


export default function AddOrderItemForm(orderId) {

    const formRef = useRef(null);

    // Added by :-  Parineeta Gedam on 24-05-2023
    // Reason - to change Serving size
    var servingSizeData = [
        { key: "Half", value: "Half" },
        { key: "Full", value: "Full" },
    ];
    // End of added code by :- Parineeta Gedam on 24-05-2023

    // Added  by :- Parineeta Gedam on 24-05-2023
    // Reason - This is used for set item name selcted data
    const [itemNameSelected, setItemNameSelected] = useState("");
    // End of added code by :- Parineeta Gedam on 24-05-2023

    // Added  by :- Parineeta Gedam on 24-05-2023
    // Reason - This is used for set item id selcted data
    const [itemIdSelected, setItemIdSelected] = useState();
    // End of added code by :- Parineeta Gedam on 24-05-2023

    // Added  by :- Parineeta Gedam on 24-05-2023
    // Reason - This is used for set serving size selcted data
    const [servingSizeSelected, setServingSizeSelected] = useState("");
    // End of added code by :- Parineeta Gedam on 24-05-2023

    // Added  by :- Parineeta Gedam on 24-05-2023
    // Reason - This is used for set quantity
    const [quantitySelected, setQuantitySelected] = useState("");
    // End of added code by :- Parineeta Gedam on 24-05-2023

    // Added  by :- Parineeta Gedam on 24-05-2023
    // Reason - This is used for set price
    const [price, setPrice] = useState(0);
    // End of added code by :- Parineeta Gedam on 24-05-2023

    // Added  by :- Parineeta Gedam on 24-05-2023
    // Reason - This is used for set singal price
    const [singalItemprice, setSingalItemprice] = useState(0);
    // End of added code by :- Parineeta Gedam on 24-05-2023

    // Added  by :- Parineeta Gedam on 24-05-2023
    // Reason - This is used for set item name error msg
    var [itemNameRequired, setItemNameRequired] = useState(false);
    // End of added code by :- Parineeta Gedam on 24-05-2023

    // Added  by :- Parineeta Gedam on 24-05-2023
    // Reason - This is used for set serving size error msg
    var [servingSizeRequired, setservingSizeRequired] = useState(false);
    // End of added code by :- Parineeta Gedam on 24-05-2023

    // Added by :- Parineeta Gedam on 27-05-2023
    const isFocused = useIsFocused();
    useEffect(() => {
        // itemNameDropdownRef.current.reset();
        setItemNameRequired(false);
        setservingSizeRequired(false);
    }, [isFocused]);
    // End of added code by :- Parineeta Gedam on 27-05-2023

    // Added by :-  Parineeta Gedam on 24-05-2023
    // Reason - to get item list
    useEffect(() => {
        getAllMenus();
    }, []);

    var [itemList, setItemList] = useState([]);

    const getAllMenus = async () => {
        var tenant = JSON.parse(
            await SecureStore.getItemAsync("tenantInfo")
        ).tenant_name;
        const response = await getAllMenuList(tenant);
        if (response) {
            setItemList(response.itemList);
        }
    };
    // End of added code by :- Parineeta Gedam on 24-05-2023

    //  Added by :-  Parineeta Gedam on 24-05-2023
    // Reason - to get offer list
    useEffect(() => {
        getAllOffers();
    }, []);

    // Set the banner name and banner items name in this state
    var [bannerList, setBannerList] = useState([]);

    // GET all banner data in this method
    const getAllOffers = async () => {
        var tenant = JSON.parse(
            await SecureStore.getItemAsync("tenantInfo")
        ).tenant_name;
        const response = await getAllOfferList(tenant);
        if (response) {
            setBannerList(response.offerBanner);
        }
    };
    // End of added code by :- Parineeta Gedam on 24-05-2023

    //  Added by :-  Parineeta Gedam on 24-05-2023
    // Reason - calculations for when user add order items 

    const calc = (dt) => {
        formRef.current.handleChange("quantity")(dt)
        setQuantitySelected(dt)
        handleCalculations(dt)
    }
    const handleCalculations = (qty) => {
        var itemName = itemList.filter((item) => item.id == itemIdSelected)[0]
        if (servingSizeSelected == "Half") {
            setSingalItemprice(itemName.price_half)
            var price = (itemName.price_half * qty)
            setPrice(price)
        }
        if (servingSizeSelected == "Full") {
            setSingalItemprice(itemName.price_full)
            var price = (itemName.price_full * qty)
            setPrice(price)
        }
    }
    // End of added code by :- Parineeta Gedam on 24-05-2023

    //  Added by :-  Parineeta Gedam on 24-05-2023
    // Reason - submit order items 
    const submitOrderItems = async () => {
        // Added by :-  Parineeta Gedam on 26-05-2023
        // Reason :- for show the validations message
        if (itemIdSelected == null) {
            setItemNameRequired(true);
        }
        if (servingSizeSelected == "") {
            setservingSizeRequired(true);
        }
        // End of Added by :-  Parineeta Gedam on 26-05-2023
        var tenant = JSON.parse(await SecureStore.getItemAsync("tenantInfo")).tenant_name;
        var data = {
            order_id: orderId.id,
            order_order_id: orderId.orderId,
            item: itemNameSelected,
            item_id: itemIdSelected,
            serving_size: servingSizeSelected,
            quantity: quantitySelected,
            item_status: "Pending",
        }
        if (servingSizeRequired == false && itemNameRequired == false) {
            var response = await postOrderItemsApi(data, tenant);
            if (response.msg) {
                orderId.setOrderItems(response.orderItems);
                orderId.setOrderDetail(response.order);
                alert("Success")
                orderId.modalvisibilityFn(false)
            }
        }
    }
    // End of added code by :- Parineeta Gedam on 24-05-2023

    return (
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalText}>Please Add More Item</Text>
                <View>
                    <Formik
                        initialValues={{ order_id: orderId.orderId, quantity: "" }}
                        validateOnMount={true}
                        validationSchema={addOrderItemSchema}
                        onSubmit={submitOrderItems}
                        innerRef={formRef}
                    >
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            values,
                            touched,
                            errors,
                        }) => (
                            // <ScrollView style={styles.container}>
                            <View style={styles.container}>
                                <View style={{ marginTop: 30 }}>
                                    <View style={styles.formContainer}>
                                        <Text style={styles.labels}>
                                            <Text style={{ color: "red", fontWeight: "650" }}>
                                                {" "}
                                            </Text>
                                            Order Id
                                        </Text>
                                        <TextInput
                                            style={styles.textInput}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            numeric
                                            keyboardType={'numeric'}
                                            value={values.order_id}
                                            editable={false}
                                        />
                                    </View>
                                    <View style={styles.formContainer}>
                                        <Text style={styles.labels}>
                                            <Text style={{ color: "red", fontWeight: "650" }}>
                                                *{" "}
                                            </Text>
                                            Item Name
                                        </Text>
                                        <SelectDropdown
                                            data={itemList}
                                            dropdownOverlayColor="rgba(0,0,0,0)"
                                            buttonTextStyle={{ fontSize: 16 }}
                                            rowTextStyle={{ fontSize: 16 }}
                                            rowStyle={{ height: 30 }}
                                            selectedRowStyle={{ backgroundColor: "#d2d2d2" }}
                                            dropdownStyle={{
                                                borderRadius: 10,
                                                backgroundColor: "white",
                                                borderWidth: 1,
                                            }}
                                            renderDropdownIcon={() => {
                                                return <AntDesign name="down" size={14} color="black" />;
                                            }}
                                            buttonStyle={{
                                                height: 35,
                                                borderColor: "black",
                                                borderWidth: 1,
                                                borderRadius: 10,
                                                backgroundColor: "white",
                                                width: 250,
                                                // alignSelf: "center",
                                                marginTop: 5,
                                            }}
                                            onSelect={(selectedItemId, index) => {
                                                setItemIdSelected(selectedItemId.id);
                                                setQuantitySelected(0);
                                                setSingalItemprice(0);
                                                setPrice(0);
                                                setItemNameRequired(false);
                                                setItemNameSelected(selectedItemId.name)

                                                // setOrderStatusChange(selectedOrderStatus.value)
                                            }}
                                            buttonTextAfterSelection={(selectedItemName, index) => {
                                                // return selectedServingSize.value;
                                                // setItemNameSelected(selectedItemName.name)
                                                return selectedItemName.name;
                                            }}
                                            rowTextForSelection={(itemName, index) => {
                                                return itemName.name;
                                            }}
                                        />
                                        {itemNameRequired && (
                                            <Text
                                                style={{
                                                    color: "red",
                                                    paddingHorizontal: 10,
                                                }}
                                            >
                                                Item Name is required
                                            </Text>
                                        )}
                                    </View>
                                    <View style={styles.formContainer}>
                                        <Text style={styles.labels}>
                                            <Text style={{ color: "red", fontWeight: "650" }}>
                                                *{" "}
                                            </Text>
                                            Serving size
                                        </Text>
                                        <SelectDropdown
                                            data={servingSizeData}
                                            dropdownOverlayColor="rgba(0,0,0,0)"
                                            buttonTextStyle={{ fontSize: 16 }}
                                            rowTextStyle={{ fontSize: 16 }}
                                            rowStyle={{ height: 30 }}
                                            selectedRowStyle={{ backgroundColor: "#d2d2d2" }}
                                            dropdownStyle={{
                                                borderRadius: 10,
                                                backgroundColor: "white",
                                                borderWidth: 1,
                                            }}
                                            renderDropdownIcon={() => {
                                                return <AntDesign name="down" size={14} color="black" />;
                                            }}
                                            buttonStyle={{
                                                height: 35,
                                                borderColor: "black",
                                                borderWidth: 1,
                                                borderRadius: 10,
                                                backgroundColor: "white",
                                                width: 250,
                                                // alignSelf: "center",
                                                marginTop: 5,
                                            }}
                                            onSelect={(selectedServingSize, index) => {
                                                setServingSizeSelected(selectedServingSize.value);
                                                setQuantitySelected(0);
                                                setSingalItemprice(0);
                                                setPrice(0);
                                                setservingSizeRequired(false);
                                                // setOrderStatusChange(selectedOrderStatus.value)
                                            }}
                                            buttonTextAfterSelection={(selectedServingSize, index) => {
                                                // return selectedServingSize.value;
                                                return selectedServingSize.value;
                                            }}
                                            rowTextForSelection={(servingSize, index) => {
                                                return servingSize.value;
                                            }}
                                        />
                                        {servingSizeRequired && (
                                            <Text
                                                style={{
                                                    color: "red",
                                                    paddingHorizontal: 10,
                                                }}
                                            >
                                                Serving size is required
                                            </Text>
                                        )}
                                    </View>
                                    <View style={styles.formContainer}>
                                        <Text style={styles.labels}>
                                            <Text style={{ color: "red", fontWeight: "650" }}>
                                                *{" "}
                                            </Text>
                                            Quantity
                                        </Text>
                                        <TextInput
                                            style={styles.textInput}
                                            onChangeText={e => calc(e)}
                                            onBlur={handleBlur("quantity")}
                                            value={values.quantity}
                                            // value={quantitySelected}
                                            placeholderTextColor="#A4A4A4"
                                            placeholder="Enter quantity"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            keyboardType="number-pad"
                                        // onChange={() => {setQuantitySelected(values.quantity); handleCalculations(values.quantity)}}
                                        />
                                        {errors.quantity && touched.quantity && (
                                            <Text style={styles.textdanger}>{errors.quantity}</Text>
                                        )}
                                    </View>
                                    <View style={styles.formContainer}>
                                        <Text style={styles.labels}>
                                            <Text style={{ color: "red", fontWeight: "650" }}>
                                                {" "}
                                            </Text>
                                            Item Price
                                        </Text>
                                        <TextInput
                                            style={styles.textInput}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            numeric
                                            keyboardType={'numeric'}
                                            editable={false}
                                            value={"" + singalItemprice}
                                        />
                                    </View>
                                    <View style={styles.formContainer}>
                                        <Text style={styles.labels}>
                                            <Text style={{ color: "red", fontWeight: "650" }}>
                                                {" "}
                                            </Text>
                                            Price
                                        </Text>
                                        <TextInput
                                            style={styles.textInput}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            numeric
                                            keyboardType={'numeric'}
                                            editable={false}
                                            // value={""+values.price}
                                            value={"" + price}
                                        />
                                    </View>
                                    <View
                                        style={{
                                            marginBottom: 30,
                                            marginHorizontal: 10,
                                            marginTop: 30,
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-evenly",
                                        }}
                                    >
                                        <Pressable
                                            onPress={() => orderId.modalvisibilityFn(false)}
                                            style={{
                                                backgroundColor: colors.btnColor,
                                                height: 30,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius: 10,
                                                width: 100,
                                                alignSelf: "center",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: "bold",
                                                    color: "white",
                                                }}
                                            >
                                                Cancel
                                            </Text>
                                        </Pressable>
                                        <Pressable
                                            onPress={handleSubmit}
                                            style={{
                                                backgroundColor: colors.btnColor,
                                                height: 30,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius: 10,
                                                width: 100,
                                                alignSelf: "center",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: "bold",
                                                    color: "white",
                                                }}
                                            >
                                                Submit
                                            </Text>
                                        </Pressable>

                                    </View>
                                </View>
                            </View>
                            // </ScrollView>
                        )}
                    </Formik>
                </View>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 85,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        // opacity:1.0,

    },
    modalView: {
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: 350,
        opacity: 1,

    },
    modalText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: "700",
    },
    formContainer: {
        marginTop: 10,
        paddingRight: 10,
        paddingLeft: 10,
    },
    textInput: {
        backgroundColor: "white",
        borderRadius: 5,
        borderWidth: 1,
        paddingHorizontal: 5,
        height: 35,
        width: 250,
        paddingLeft: 5,
        paddingRight: 5,
        marginTop: 10,
    },
    labels: {
        width: 100,
    },
    textdanger: {
        color: "#dc3545",
        paddingHorizontal: 10,
    },
});
