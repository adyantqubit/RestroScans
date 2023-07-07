// Added by :-  Parineeta Gedam on 24-05-2023
// Reason - to desigin and functionality of add order item

import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, Button, Pressable, Alert, Modal, TextInput } from "react-native";
import { colors, inputs } from "../../Colours/globalColor";
import { getAllMenuList, postOrderItemsApi, getAllOfferList,getSettingApi } from "../../api/Services";
import { Formik } from "formik";
import SelectDropdown from "react-native-select-dropdown";
import { AntDesign } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { addOrderItemSchema } from "../../validation/ValidationSchema";
import { useIsFocused } from "@react-navigation/native";


export default function AddOrderItemForm(orderId) {

    // Added by :- Parineeta Gedam on 23-06-2023 
    // Reason :- after submit button will be disable 
    var [submitBtnDisable, setSubmitBtnDisable] = useState(false);
    // End of added code by :- Parineeta Gedam on 23-06-2023


    // Added by :- Parineeta Gedam on 09-06-2023
    // reason :- get setting data\

    useEffect(() => {
        getSettingData()
    }, [])

    // Added by :-  Parineeta Gedam on 11-05-2023
    // Reason - to change get settings data 

    // Added by :- Parineeta Gedam on 11-06-2023
    // Reason :- to set and show half and full  
    var [servingSizeData, setServingSizeData] = useState([
        { key: "Half", value: "Half" },
        { key: "Full", value: "Full" }
    ])
    // End of added code by :- Parineeta Gedam on 11-06-2023
    
    var [settings, setSettings] = useState({});
    var [allowHalfPrice, setAllowHalfPrice] = useState(false);
    const getSettingData = async () => {
        if (await SecureStore.getItemAsync("tenantInfo")) {
          var tenant = JSON.parse(
            await SecureStore.getItemAsync("tenantInfo")
          ).tenant_name;
          var response = await getSettingApi(tenant);
          if (response) {
            setSettings(response.setting);
            // Added by :- Parineeta Gedam on 11-06-2023
            // reason :- when admin not select half then show serving size only "Full"
            setAllowHalfPrice(response.setting.allow_half_price);
            if (response.setting.allow_half_price == false) {
                var rm = servingSizeData.slice(1);
                setServingSizeData(rm)
            }
            // End of Added by :- Parineeta Gedam on 11-06-2023 reason :- when admin not select half then show serving size only "Full"
          }
        }
      };
    // End of added code by :- Parineeta Gedam 09-06-2023

    const formRef = useRef(null);

    // Added  by :- Parineeta Gedam on 24-05-2023
    // Reason - This is used for set item name selcted data
    const [itemNameSelected, setItemNameSelected] = useState("");
    // End of added code by :- Parineeta Gedam on 24-05-2023

    // Added  by :- Parineeta Gedam on 24-05-2023
    // Reason - This is used for set item id selcted data
    const [itemIdSelected, setItemIdSelected] = useState(0);
    // End of added code by :- Parineeta Gedam on 24-05-2023

    // Modified by :- Parineeta Gedam on 07-07-2023 reason :- bydefault select full
    // Added  by :- Parineeta Gedam on 24-05-2023
    // Reason - This is used for set serving size selcted data
    // const [servingSizeSelected, setServingSizeSelected] = useState("");
    const [servingSizeSelected, setServingSizeSelected] = useState("Full");
    // End of added code by :- Parineeta Gedam on 24-05-2023
    // End of modified code by :- Parineeta Gedam on 07-07-2023 reason :- bydefault select full

    // Added  by :- Parineeta Gedam on 24-05-2023
    // Reason - This is used for set quantity
    const [quantitySelected, setQuantitySelected] = useState(0);
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
        // Modified by :- Parineeta gedam 
        getAllMenus();
    }, [isFocused]);
    // End of added code by :- Parineeta Gedam on 27-05-2023

    // Commented by :- Parineeta Gedam on 11-06-2023
    // Added by :-  Parineeta Gedam on 24-05-2023
    // Reason - to get item list
    // useEffect(() => {
    //     getAllMenus();
    // }, []);

    var [itemList, setItemList] = useState([]);

    const getAllMenus = async () => {
        var tenant = JSON.parse(
            await SecureStore.getItemAsync("tenantInfo")
        ).tenant_name;
        const response = await getAllMenuList(tenant);
        if (response) {
           
            // Commented by :- Parineeta Gedam on 07-07-2023 reason :- Inactive item should not shown, when admin add new items.
            // setItemList(response.itemList);
            // End of commented code by Parineeta Gedam on 07-07-2023 reason :- Inactive item should not shown, when admin add new items.

            // Added by :- Parineeta Gedam on 07-07-2023 reason :- Inactive item should not shown, when admin add new items.
            var activeItemList = response.itemList.filter((item) => item.is_active == true)
            setItemList(activeItemList);
            // End of added code by :- Parineeta Gedam on 07-07-2023 reason :- Inactive item should not shown, when admin add new items

        }
    };
    // End of added code by :- Parineeta Gedam on 24-05-2023

    //  Added by :-  Parineeta Gedam on 24-05-2023
    // Reason - to get offer list
    useEffect(() => {
        getAllOffers();
    }, []);

    // Modified by :- Parineeta Gedam on 02-07-2023 reason :- set offer item list
    // Set the banner name and banner items name in this state
    // var [bannerList, setBannerList] = useState([]);
    var [offerList, setOfferList] = useState([]);
    // GET all offer data in this method
    const getAllOffers = async () => {
        var tenant = JSON.parse(
            await SecureStore.getItemAsync("tenantInfo")
        ).tenant_name;
        const response = await getAllOfferList(tenant);
        if (response) {
            // Added by :- Parineeta Gedam on 02-07-2023
            // Reason :- set offer list item.
            // setBannerList(response.offerBanner);
            setOfferList(response.offerItemList);
            // End of added code by :- Parineeta Gedam on 02-07-2023 Reason :- set offer list item.
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

    // Commented by :- Parineeta Gedam on 01-07-2023
    // Reason :- Add more item -  Price is displayed wrong for offered item. 
    // const handleCalculations = (qty) => {
    //     var itemName = itemList.filter((item) => item.id == itemIdSelected)[0]
    //     if (servingSizeSelected == "Half") {
    //         setSingalItemprice(itemName.price_half)
    //         var price = (itemName.price_half * qty)
    //         setPrice(price.toFixed(2))
    //     }
    //     if (servingSizeSelected == "Full") {
    //         setSingalItemprice(itemName.price_full)
    //         var price = (itemName.price_full * qty)
    //         setPrice(price.toFixed(2))
    //     }
    // }
    // End of added code by :- Parineeta Gedam on 24-05-2023
    // End of Commented by :- Parineeta Gedam on 01-07-2023 Reason :- Add more item -  Price is displayed wrong for offered item.


    // Added by :- Parineeta Gedam on 01-07-2023 
    // reason :- calculations for offered item.
    const handleCalculations = (qty) => {
        if (offerList.filter((item) => item.item_id == itemIdSelected).length) {
            var amount = 0;
            var discounted_price=0;
            var itemName = offerList.filter((item) => item.item_id == itemIdSelected)[0]
            if(servingSizeSelected == "Full"){
                amount = ((itemName.item_fullprice / 100) * itemName.item_discount).toFixed(2)
                discounted_price = (itemName.item_fullprice - amount).toFixed(2)
                setSingalItemprice(discounted_price)
                var price = (discounted_price * qty)
                setPrice(price.toFixed(2))
            }else{
                amount = ((itemName.item_halfprice / 100) * itemName.item_discount).toFixed(2)
                discounted_price = (itemName.item_halfprice - amount).toFixed(2)
                setSingalItemprice(discounted_price)
                var price = (discounted_price * qty)
                setPrice(price.toFixed(2))
            }
        }
        else{
            var itemName = itemList.filter((item) => item.id == itemIdSelected)[0]
            if (servingSizeSelected == "Half") {
                setSingalItemprice(itemName.price_half)
                var price = (itemName.price_half * qty)
                setPrice(price.toFixed(2))
            }
            if (servingSizeSelected == "Full") {
                setSingalItemprice(itemName.price_full)
                var price = (itemName.price_full * qty)
                setPrice(price.toFixed(2))
            }
        }   
    }
    // End of added code by :- Parineeta Gedam on 01-07-2023 reason :- calculations for offered item.
  
    // Modified by :- PArineeta Gedam on 25-06-2023 reason :- modified for validations message
    //  Added by :-  Parineeta Gedam on 24-05-2023
    // Reason - submit order items 
    const submitOrderItems = async () => {

        // Added by :- Parineeta Gedam on 23-06-2023
        // Reason :- set button disable
        setSubmitBtnDisable(true);
        // End of added code by :- Parineeta Gedam on 23-06-2023 

        // Added by :-  Parineeta Gedam on 26-05-2023
        // Reason :- for show the validations message
        if (itemIdSelected == 0) {
            setItemNameRequired(true);
        }
        if (itemIdSelected > 0) {
            setItemNameRequired(false);
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

        if (servingSizeRequired == false && servingSizeSelected != "" && itemNameRequired == false && itemIdSelected > 0 && quantitySelected > 0  ) {
            var response = await postOrderItemsApi(data, tenant);
            if (response.msg) {
                orderId.setOrderItems(response.orderItems);
                orderId.setOrderDetail(response.order);
                orderId.setOrderStatus(response.order.order_status)

                // Modified by :- Parineeta Gedam on 29-06-2023 reason :- update discount
                orderId.setDiscountRupees("" + response.order.discount_rupees)
                orderId.setDiscountPercentage("" + response.order.discount_percentage)
                // End of modified code by :- Parineeta Gedam on 29-06-2023 reason :- update discount
                Alert.alert("Item added successfully");
                orderId.modalvisibilityFn(false)

                // Added by :- Parineeta Gedam on 23-06-2023 
                setSubmitBtnDisable(false);
                // End of added code by :- Parineeta Gedam on 23-06-2023 
            }
        }
        else{
            setSubmitBtnDisable(false);   
        }
    }
    // End of added code by :- Parineeta Gedam on 24-05-2023
    // End of Modified by :- PArineeta Gedam on 25-06-2023 reason :- modified for validations message
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
                                                values.quantity = ""
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
                                    {/* Added and modified by :- PArineeta Gedam on 07-07-2023 reason :- Serving section should not be in dropdown, If only full size is available. */}
                                    {allowHalfPrice ? 
                                    
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
                                                values.quantity = ""
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
                                            // disabledIndexs={[0]}
                                            // renderCustomizedRowChild={(d, i)=>{
                                            //     return d
                                            // }}
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
                                    :
                                    <View style={styles.formContainer}>
                                    <Text style={styles.labels}>
                                        <Text style={{ color: "red", fontWeight: "650" }}>
                                            *{" "}
                                        </Text>
                                        Serving size
                                    </Text>
                                    <View style={styles.servingSizeInput}>
                                    <Text style={styles.servingSizeLabel}>Full</Text>
                                    </View>
                                    </View>
                                    }
                                    {/* End of Added and modified by :- Parineeta Gedam on 07-07-2023 reason :- Serving section should not be in dropdown, If only full size is available.   */}

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

                                            // Modified by :- PArineeta Gedam on 26-06-2023 reason :- 
                                            editable = {servingSizeSelected == null || servingSizeSelected == "" || itemIdSelected == null || itemIdSelected == "" ? false : true}
                                            // End of Modified by :- PArineeta Gedam on 26-06-2023
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
                                            {/* Item Price */}
                                            Price
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
                                            {/* Price */}
                                            Total Price
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
                                            // Added by :- Parineeta Gedam on 23-06-2023
                                            // Reason :- to btn disable
                                            disabled={submitBtnDisable}
                                            // End of added code by :- PArineeta Gedam on 23-06-2023

                                            // Modified by :- Parineeta Gedam on 27-06-2023 reason :- Error thrown, when Admin not entered item name and entered quantity then click on "Submit" button.
                                            onPress={ ()=>{
                                                handleSubmit();
                                                itemIdSelected == 0 ? setItemNameRequired(true) : setItemNameRequired(false)
                                                servingSizeSelected == null || servingSizeSelected == "" ? setservingSizeRequired(true) : setservingSizeRequired(false)
                                            }
                                            }
                                            // End of Modified code by :- Parineeta Gedam on 27-06-2023 reason :- Error thrown, when Admin not entered item name and entered quantity then click on "Submit" button.
 
                                            style={{
                                                // Modified by :- Parineeta Gedam on 23-06-2023
                                                // Reason :- to btn disable
                                                // backgroundColor: colors.btnColor,
                                                backgroundColor: submitBtnDisable
                                                ? "#E0E0E0"
                                                : colors.btnColor,
                                                // End of added code by :- Parineeta Gedam on 23-06-2023
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
                                                     // Added by :- Parineeta Gedam on 23-06-2023
                                                        // Reason :- to btn disable
                                                        // backgroundColor: colors.btnColor,
                                                        // color: colors.white,
                                                        color: submitBtnDisable ? "#989898" : colors.white,
                                                        // End of added code by :- Parineeta Gedam on 23-06-2023
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
    // Added by :- Parineeta Gedam on 07-07-2023 reason :- Serving section should not be in dropdown, If only full size is available. 
    servingSizeInput: {
        height: 35,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "white",
        width: 250,
        marginTop: 5,
        alignItems :"center",
        alignContent:"center"
    },
    servingSizeLabel:{
        fontSize:17,
        marginTop: 5,
        textAlign:"center",
        alignSelf:"center",
        margin :"auto"
    }

    // End of added code by :- Parineeta Gedam on 07-07-2023 reason : Serving section should not be in dropdown, If only full size is available.
});
