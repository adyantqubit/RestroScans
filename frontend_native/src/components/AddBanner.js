// Created by Om on 08-04-2023
// Reason - to create banner section

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
    TouchableOpacity, Linking
} from "react-native";

import { useForm, Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { saveAllOffer } from "../api/Services";
import { colors } from "../Colours/globalColor";
import { useContext } from "react";
import Icon from "react-native-vector-icons/FontAwesome";

import { AppStateContext } from "../context/AppStateProvider";

export default function AddBanner() {
    var [isDisable, setIsDisable] = useState(false);

    const [tempPhoto, setTempPhoto] = useState(null);

    const [icon, setImage] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState("");
    var [isImgRequired, setImgRequired] = useState(false);

    var { render, setRender } = useContext(AppStateContext)

    // This method helps to pick the image functionality
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
            setImgRequired(false);
        }
    };

    useEffect(() => {
        getTenant();
    }, []);

    // Need to set the tenant name
    var [tenant, setTenant] = useState("");
    var [menuList, setMenuList] = useState([]);
    const getTenant = async () => {
        var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
        setTenant(JSON.parse(tenantInfo).tenant_name);
    };

    // Post method call in this functiona
    const handleRegister = async (formValues) => {
        var formData = new FormData();
        // Modification by Om on 15-04-23
        // Reason : Fix the image validation
        // const ext = tempPhoto.uri.substring(tempPhoto.uri.lastIndexOf(".") + 1);
        // formData.append("offer_image", {
        //     uri: icon,
        //     name: icon,
        //     type: `image/${ext}`,
        // });

        if (icon != null) {
            const ext = tempPhoto.uri.substring(tempPhoto.uri.lastIndexOf(".") + 1);
            formData.append("offer_image", {
                uri: icon,
                name: icon,
                type: `image/${ext}`,
            });
        } else {
            setImgRequired(true);
        }
        // End of addition

        formData.append("offer_name", formValues.offer_name);
        formData.append("discount", formValues.discount);

        // Modification by Om on 15-04-23
        // Reason : Fix the image validation
        if (icon != null) {
            saveAllOffer(formData, tenant).then((response) => {
                if (response.msg) {
                    Alert.alert("Succesfull", response.msg);
                    // resetField("offer_name");
                    // resetField("discount");
                    // resetField("offer_image");
                    setRender(!render)
                    reset("");          // Add the Reset functionality by Om on 15-04-23
                    setImage(null);
                }
                // if (response.err) {
                //     Alert.alert("Error", response.err);
                // }
                else {
                    // if (response.error) {
                    //     alert(response.error)
                    // End of modification
                    Alert.alert("Error", "Something went wrong");
                    //  End of addition
                    // setIsDisable(false);
                }
            });
        }
    };

    // Set the values in this method
    const {
        control,
        // resetField,
        reset,          // Add the Reset functionality by Om on 15-04-23
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            offer_name: "",
            discount: "",
            offer_image: "",
        },
    });

    return (
        <>
            <ScrollView>
                <View style={styles.container} >
                    <View style={{ marginTop: 5 }}>
                        <Text style={styles.labels}>
                            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
                            Banner/Offer name
                        </Text>
                        <Controller
                            control={control}
                            name="offer_name"
                            rules={{
                                required: {
                                    value: true,
                                    message: "Banner/Offer name is required",
                                },
                                //   pattern: {
                                //     value: /^(?!\s+$).*/,
                                //     message: "Menu offer_name cannot contain only blankspaces!",
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
                                            placeholder="Enter banner/offer name"
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

                    <View style={{ marginTop: 5 }}>
                        <Text style={styles.labels}>
                            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
                            Discount(%)
                        </Text>
                        <Controller
                            control={control}
                            name="discount"
                            rules={{
                                required: {
                                    value: true,
                                    message: "Discount is required!",
                                },
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
                                            placeholder="Enter discount"
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
                        <Text>Upload image</Text>
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
                            flexDirection: "row-reverse",
                            justifyContent: "space-around",
                        }}
                    >
                        {/* <Text style={{ color: "red", fontWeight: "650" }}>* </Text> */}
                        {/* Modification by Om on 15-04-23
         Reason : Fix the image validation */}
                        {/* <Button  title="Choose image" onPress={pickImage} /> */}
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
                        {/* End of addition */}
                        {icon && (
                            <Image
                                source={{ uri: icon }}
                                style={{ width: 50, height: 40, borderRadius: 5 }}
                            />
                        )}
                    </View>
                    {/* Modification by Om on 15-04-23
         Reason : Fix the image validation */}
                    {isImgRequired && (
                        <Text style={{ color: "red", marginLeft: 120, marginTop: 8 }}>
                            Item icon is required!
                        </Text>
                    )}
                    {/* End of addtion */}
                    {/*Commented by Om on 15-04-23
     Reason : Fix the image designing not used yet     */}
                    {/* <View style={{ marginBottom: 30, marginHorizontal: 10, marginTop: 10 }}>
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
                            Saveww
                        </Text>
                    </Pressable>
                </View> */}
                    {/* End of Commented code */}
                    <View style={styles.btns}>
                        {/* <Button title="Save"/> */}
                        <Pressable
                            onPress={handleSubmit(handleRegister)}
                            disabled={isDisable}
                            style={{
                                // backgroundColor: isDisable ? "grey" : colors.btnColor,
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
            {/* Added by Om for show the footer */}
            <View
                style={{ backgroundColor: '#003366', display: "flex", flexDirection: "row", justifyContent: 'center', flexWrap: 'wrap', }}
            >
                <TouchableOpacity onPress={() => Linking.openURL('https://adyant.co.in/')}>
                    <Text style={{ color: 'white' }}>
                        Adyant Powered © 2023
                    </Text>
                </TouchableOpacity>
            </View>
            {/* End of addition */}
        </>
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
    // Modification by Om on 15-04-23
    // Reason : Fix the image validation
    btns: {
        width: 190,
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 20
        //  marginBottom: 30, marginHorizontal: 10, marginTop: 10 
        // End of modification
    },
});

