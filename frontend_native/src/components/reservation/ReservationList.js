// Created by :-  Parineeta Gedam on 26-05-2023
// Reason - to desigin and functionality of Reservation list

import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { getReservationListApi } from "../../api/Services";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import Footer from "../../components/Footer/Footer";
import { useIsFocused } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';

export default function ReservationList({ route, navigation }) {
    // Added by Parineeta Gedam on 26-05-2023
    // Reason - to re render the screen
    const isFocused = useIsFocused();
    // End of re render

    // Added by Parineeta Gedam on 26-05-2023
    // Reason - to re render the screen
    useEffect(() => {
        getAllReservationList();
    }, [isFocused]);
    // End of addition

    // Added by Parineeta Gedam on 04-06-2023
    // Reason - to set all reservation
    // This react hooks is used to set all orders
    // Which is used for map and showing data to user
    var [reservationList, setReservationList] = useState([]);

    // Added by Parineeta Gedam on 25-05-2023
    // Reason - to get reservation list
    const getAllReservationList = async () => {
        var tenant = JSON.parse(await SecureStore.getItemAsync("tenantInfo")).tenant_name;
        var response = await getReservationListApi(tenant);
        if (response.msg) {
            setReservationList(response.reservationList);
        }
    };
    // End of added code by PArineeta Gedam on 04-06-2023


    // Added by Parineeta Gedam on 04-06-2023
    // Reason - to get id and navigate
    // This method is created for navigate the reservation
    // and sreen and send the order id after navigation
    // it will be used for getting order items
    const handleReservation = async (data) => {
        navigation.navigate("ReaservationForm", {
            object: data,
        });
    };
    // End of added code by Parineeta Gedam on 04-06-2023

    return (
        <>
            <ScrollView keyboardShouldPersistTaps="handled">
                {/* <Text style={styles.reservation_heading} >Tab to click</Text> */}
                <Text style={styles.reservation_heading} >Please tap on row</Text>
                {reservationList.length > 0 ? (
                    <View style={styles.orderTableContainer}>
                        <View style={styles.orderHeadingContainer}>
                            <Text style={styles.tableColHeading1}>#</Text>
                            <Pressable
                                style={styles.tableColHeading2}
                            // onPress={handleTableOrder}
                            >
                                <Text
                                    style={{
                                        fontWeight: "bold",
                                        textAlign: "center",
                                    }}
                                >
                                    Name
                                    {/* {tableNoSort == "" && "↓↑"}
                            {tableNoSort == "ascending" && "↑"}
                            {tableNoSort == "descending" && "↓"} */}
                                </Text>
                            </Pressable>
                            <Pressable
                                style={styles.tableColHeading3}
                            // onPress={handleSetOrderId}
                            >
                                <Text
                                    style={{
                                        fontWeight: "bold",
                                        textAlign: "center",
                                    }}
                                >
                                    Table No.
                                    {/* {orderIdSort == "" && "↓↑"}
                            {orderIdSort == "ascending" && "↑"}
                            {orderIdSort == "descending" && "↓"} */}
                                </Text>
                            </Pressable>
                            <Pressable
                                style={styles.tableColHeading4}
                            // onPress={handleSetOrderStatus}
                            >
                                <Text
                                    style={{
                                        fontWeight: "bold",
                                        textAlign: "center",
                                    }}
                                >
                                    Reservation Status
                                    {/* {orderStatusSortVal == "" && "↓↑"}
                            {orderStatusSortVal == "ascending" && "↑"}
                            {orderStatusSortVal == "descending" && "↓"} */}
                                </Text>
                            </Pressable>
                            <Pressable
                                style={styles.tableColHeading5}
                            // onPress={handleSetPaymentStatus}
                            >
                                <Text
                                    style={{
                                        fontWeight: "bold",
                                        textAlign: "center",
                                    }}
                                >
                                    Date
                                    {/* {paymentStatusSortVal == "" && "↓↑"}
                            {paymentStatusSortVal == "ascending" && "↑"}
                            {paymentStatusSortVal == "descending" && "↓"} */}
                                </Text>
                            </Pressable>
                        </View>
                        {reservationList.map((data, id) => (
                            <Pressable
                                style={styles.tdContainer}
                                key={id}
                                onPress={(e) => handleReservation(data)}
                            >
                                <Text style={styles.td1}>{id + 1}</Text>
                                <Text style={styles.td3}>{data.name}</Text>
                                <Text style={styles.td2}>{data.table_number ? data.table_number : "-"}</Text>
                                <Text style={styles.td4}>{data.reservation_status}</Text>
                                <Text style={styles.td5}>{new Date(data.date)
                                    .toISOString()
                                    .split("T")[0]
                                    .split("-")
                                    .reverse()
                                    .join("/")}</Text>
                            </Pressable>
                        ))}
                    </View>

                ) : (
                    <Text style={{ textAlign: "center", marginTop: 20 }}>
                        No data available
                    </Text>
                )}
            </ScrollView>
            <View style={styles.addBtnContainer}>
                    <Pressable style={styles.addBtn} onPress={() => navigation.navigate("ReaservationForm", { object: { id: "add new data" } })}><AntDesign name="pluscircleo" size={30} color="white" /></Pressable>
                </View>
            <Footer />
        </>
    );
}

// const styles = StyleSheet.create({
//     orderListContainer: {
//         display: "flex",
//         flexDirection: "row",
//         marginTop: 5,
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: 5,
//         backgroundColor: "white",
//         borderRadius: 8,
//         paddingHorizontal: 10,
//         width: "95%",
//         alignSelf: "center",
//         padding: 10,
//         shadowOffset: {
//             width: 0,
//             height: 10,
//         },
//         shadowColor: "#000",
//         shadowOpacity: 0.25,
//         shadowRadius: 4,
//         elevation: 5,
//     },
//     customerName: {
//         fontSize: 16,
//     },
//     tableNo: {
//         fontSize: 14,
//         marginTop: 4,
//         flexShrink: 1,
//         flexWrap: "wrap",
//         width: "100%",
//     },
//     orderandPaymentStatus: {
//         fontSize: 14,
//         marginTop: 4,
//         fontWeight: "bold",
//         flexShrink: 1,
//         flexWrap: "wrap",
//         width: "100%",
//         fontWeight: "bold",
//     },
// });


const styles = StyleSheet.create({
    orderListContainer: {
        display: "flex",
        flexDirection: "row",
        marginTop: 5,
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
        backgroundColor: "white",
        borderRadius: 8,
        paddingHorizontal: 10,
        width: "95%",
        alignSelf: "center",
        padding: 10,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    customerName: {
        fontSize: 16,
    },
    tableNo: {
        fontSize: 14,
        marginTop: 4,
        flexShrink: 1,
        flexWrap: "wrap",
        width: "100%",
    },
    orderandPaymentStatus: {
        fontSize: 14,
        marginTop: 4,
        fontWeight: "bold",
        flexShrink: 1,
        flexWrap: "wrap",
        width: "100%",
        fontWeight: "bold",
    },
    /**
     * Modified by yuvraj Sahu on 22-05-2023
     * Reason - to design search field and shorting
     */
    //   input: {
    //     height: inputs.inputBoxHeight,
    //     margin: 12,
    //     borderWidth: 1,
    //     paddingHorizontal: 20,
    //     marginTop: 0,
    //     fontSize: 16,
    //     borderRadius: 25,
    //   },
    searchContainer: {
        marginTop: 10,
    },
    shorFilterContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
    },
    shortingBtn: {
        borderWidth: 1,
        height: 40,
        width: "40%",
        borderRadius: 25,
    },
    filterBtn: {
        borderWidth: 1,
        height: 30,
        width: "40%",
        borderRadius: 10,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
    filterLable: {
        fontSize: 16,
    },
    /**
     * End of addition by yuvraj Sahu on 22-05-2023
     */

    /**
     * Added by Yuvraj Sahu on 02-06-2023
     * Reason - to design table
     */
    orderTableContainer: {
        margin: 5,
        borderRadius: 5,
        backgroundColor: "white",
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderTopWidth: 1,
    },
    orderHeadingContainer: {
        minHeight: 45,
        width: "100%",
        alignSelf: "center",
        display: "flex",
        flexDirection: "row",
        borderTopEndRadius: 5,
        borderTopLeftRadius: 5,
        alignItems: "center",
        paddingHorizontal: 10,
        borderBottomWidth: 1,
    },
    tableColHeading1: {
        width: "5%",
        fontWeight: "bold",
        // borderWidth: 1
    },
    tableColHeading2: {
        width: "25%",
    },
    tableColHeading3: {
        width: "23%",
        fontWeight: "bold",
        textAlign: "center",
    },
    tableColHeading4: {
        width: "23%",
        fontWeight: "bold",
    },
    /**
     * Added by Yuvraj Sahu on 03-06-2023
     * Reason - to add order id space
     */
    tableColHeading5: {
        width: "23%",
        fontWeight: "bold",
    },
    /**
     * End of adding order id space by Yuvraj Sahu on 03-06-2023
     */
    tdContainer: {
        minHeight: 40,
        width: "100%",
        marginHorizontal: 10,
        alignSelf: "center",
        display: "flex",
        flexDirection: "row",
        padding: 5,
        borderBottomWidth: 1,
        borderColor: "grey",
    },
    td1: {
        width: "5%",
        textAlign: "center",
    },
    td2: {
        width: "25%",
        textAlign: "center",
    },
    td3: {
        width: "23%",
        textAlign: "center",
    },
    td4: {
        width: "23%",
        textAlign: "center",
    },
    /**
     * Added by Yuvraj Sahu on 03-06-2023
     * Reason - to add order id space
     */
    td5: {
        width: "23%",
        textAlign: "center",
    },
    addBtnContainer: {
        width: 50,
        height: 50,
        backgroundColor: "orange",
        color: "#FFF",
        borderRadius: 50,
        fontSize: 30,
        zIndex: 100,
        position: 'absolute',
        bottom:40,
        right:15,
        shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
    },
    addBtn: {
        marginTop:10,
        alignItems:"center",
    },
    reservation_heading:{
        marginTop:5,
        fontSize:16,
        textAlign:"center",
        fontWeight:"500",
    }
});