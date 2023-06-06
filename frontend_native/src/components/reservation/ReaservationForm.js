// Created by :-  Parineeta Gedam on 26-05-2023
// Reason - to desigin and functionality of Reservation form

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { updateReservationApi } from "../../api/Services";
import { colors, inputs } from "../../Colours/globalColor";
import * as SecureStore from "expo-secure-store";
import Footer from "../../components/Footer/Footer";
import { Formik } from "formik";
import { addItemSchema } from "../../validation/ValidationSchema";
import SelectDropdown from "react-native-select-dropdown";
import { AntDesign } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

export default function ReaservationForm({ route, navigation }) {

  const isFocused = useIsFocused();
  const formRef = useRef(null);

  // Added by Yuvraj Sahu on 27-4-2023
  // Reason - to set default value for setting
  // var [defaultValue, setDefaultValue] = useState({});
  // End of addition

  /**
   * Added by Yuvraj Sahu on 03-05-2023
   * Reason - to re-fresh the validation
   * msg when we come back from another screen
   */
  const settingDropdownRef = useRef({});
  /**
   * End of refreshing validation msg
   */


  // Added by Parineeta Gedam on 30-5-2023
  // Reason - to get order id in from router
  const { object } = route.params;
  // End of modification

  // alert(object.name)


  useEffect(() => {
    // setDefaultValue({dt});
    setReservationStatusSelected(object.id != "add new data" ? object.reservation_status : "")
  }, [isFocused])


  // Modified by :- Parineeta Gedam on 30-05-2023
  // Reason - to change reservation status name
  var reservationStatus = [
    { key: "Pending", value: "Pending" },
    { key: "Confirm", value: "Confirm" },
  ];

  var [reservationStatusSelected, setReservationStatusSelected] = useState("");
  var [reservationStatusErrorMsg, setReservationStatusErrorMsg] = useState(false);


  // End of modification

  // Added by Parineeta gedam on 30-05-2023
  // Reason - to get reservations data

  const updateReservation = async (values, { resetForm }) => {
    object.id != "add new data" && (values["id"] = object.id);
    values["reservation_status"] = reservationStatusSelected;
    var tenant = JSON.parse(await SecureStore.getItemAsync("tenantInfo")).tenant_name;
    if (reservationStatusSelected == "") {
      setReservationStatusErrorMsg(true)
    }
    else {
      updateReservationApi(values, tenant).then(async (res) => {
        if (res.msg) {
          Alert.alert(res.msg);
          // setSettingBtnDisable(false);
          resetForm({ values: "" });
          navigation.navigate("ReservationListScreen")

        } else {
          Alert.alert("Something went wrong");
          // setSettingBtnDisable(false);
        }
        if (res.error) {
          Alert.alert(res.error);
          // setSettingBtnDisable(false);
        }
      });
    }
  };


  // End of added code by Parineeta Gedam on 30-05-2023

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Formik
            initialValues={object.id != "add new data" ? object : { name: "", email: "", contact_number: "", number_of_person: "", special_instructions: "", date: "", time: "", table_number: "", reservation_status: "" }}
            // innerRef={formRef}
            enableReinitialize={true}
            // initialValues={defaultValue}
            // validationSchema={settingSchema}
            onSubmit={updateReservation}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              touched,
              errors,
            }) => (
              <View>
                <View>
                  <Text style={styles.labels}>
                    <Text style={{ color: "red" }}>* </Text>Name
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Enter name"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {errors.name && touched.name && (
                    <Text style={styles.textdanger}>{errors.name}</Text>
                  )}
                </View>

                <View>
                  <Text style={styles.labels}>
                    <Text style={{ color: "red" }}>* </Text>Email
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Enter email"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {errors.email && touched.email && (
                    <Text style={styles.textdanger}>{errors.email}</Text>
                  )}
                </View>

                <View style={{ marginTop: 10 }}>
                  <Text style={styles.labels}>
                    <Text style={{ color: "red" }}>* </Text>Contact number
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("contact_number")}
                    onBlur={handleBlur("contact_number")}
                    value={values.contact_number}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Enter contact number"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {errors.contact_number && touched.contact_number && (
                    <Text style={styles.textdanger}>{errors.contact_number}</Text>
                  )}
                </View>

                <View style={{ marginTop: 10 }}>
                  <Text style={styles.labels}>
                    <Text style={{ color: "red" }}>* </Text>Number of person
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("number_of_person")}
                    onBlur={handleBlur("number_of_person")}
                    value={values.number_of_person}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Enter number of person"
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {errors.number_of_person && touched.number_of_person && (
                    <Text style={styles.textdanger}>{errors.number_of_person}</Text>
                  )}
                </View>

                <View style={{ marginTop: 10 }}>
                  <Text style={styles.labels}>
                    <Text style={{ color: "red" }}>* </Text>Special Instructions
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("special_instructions")}
                    onBlur={handleBlur("special_instructions")}
                    value={values.special_instructions}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Enter Total hour"
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {errors.special_instructions && touched.special_instructions && (
                    <Text style={styles.textdanger}>{errors.special_instructions}</Text>
                  )}
                </View>

                <View style={{ marginTop: 10 }}>
                  <Text style={styles.labels}>
                    <Text style={{ color: "red" }}>* </Text>Date
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("date")}
                    onBlur={handleBlur("date")}
                    value={values.date}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Enter date"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {/* <RNDateTimePicker maximumDate={new Date(2030, 10, 20)} /> */}
                  {errors.date && touched.date && (
                    <Text style={styles.textdanger}>{errors.date}</Text>
                  )}
                </View>

                <View style={{ marginTop: 10 }}>
                  <Text style={styles.labels}>
                    <Text style={{ color: "red" }}>* </Text>Time
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("time")}
                    onBlur={handleBlur("time")}
                    value={values.time}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Enter time"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {errors.time && touched.time && (
                    <Text style={styles.textdanger}>{errors.time}</Text>
                  )}
                </View>

                <View style={{ marginTop: 10 }}>
                  <Text style={styles.labels}><Text style={{ color: "red" }}>* </Text>Table Number</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("table_number")}
                    onBlur={handleBlur("table_number")}
                    value={values.table_number}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Enter table number"
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {errors.price_half && touched.price_half && (
                    <Text style={styles.textdanger}>{errors.price_half}</Text>
                  )}
                </View>

                <Text style={styles.labels}>
                  <Text style={{ color: "red" }}>* </Text>Reservation status
                </Text>
                <SelectDropdown
                  data={reservationStatus}
                  // defaultButtonText={object.id!="add new data" ? reservationStatusSelected : ""}
                  defaultValueByIndex={object.id!="add new data" ? (object.reservation_status == "Pending" ? 0 : 1) : 0}
                  // ref={categoryDropdownRef}
                  dropdownOverlayColor="rgba(0,0,0,0)"
                  buttonTextStyle={{ fontSize: 16 }}
                  rowTextStyle={{ fontSize: 16 }}
                  rowStyle={{ height: 41 }}
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
                    height: inputs.inputBoxHeight,
                    borderColor: "black",
                    borderWidth: 1,
                    borderRadius: 10,
                    backgroundColor: "white",
                    width: "94%",
                    alignSelf: "center",
                    marginBottom: 10,
                  }}
                  onSelect={(selectedStatus, index) => {
                    setReservationStatusSelected(selectedStatus.value)
                    setReservationStatusErrorMsg(false)
                    // setItemRequired(false);
                  }}
                  buttonTextAfterSelection={(selectedStatus, index) => {
                    return selectedStatus.value;
                  }}
                  rowTextForSelection={(status, index) => {
                    return status.value;
                  }}
                />
                {reservationStatusErrorMsg && (
                  <Text
                    style={{
                      color: "red",
                      paddingHorizontal: 10,
                    }}
                  >
                    Reservation status is required
                  </Text>
                )}

                <View
                  style={{
                    marginBottom: 30,
                    marginHorizontal: 10,
                    marginTop: 10,
                  }}
                >
                  <Pressable
                    onPress={handleSubmit}
                    style={{
                      backgroundColor: colors.btnColor,
                      height: 30,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 10,
                      width: "35%",
                      alignSelf: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      Submit
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </Formik>
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
    paddingTop: 10,
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
    /**
     * Modified by yuvraj Sahu on 05-05-2023
     * Reason - to increase height due to scroll issue
     */
    // height: 41,
    height: inputs.inputBoxHeight,
    /**
     * End of modification by Yuvraj Sahu on 05-05-2023
     */
    margin: 12,
    borderWidth: 1,
    padding: 10,
    marginTop: 0,
    fontSize: 16,
    borderRadius: 10,
  },
  labels: {
    paddingHorizontal: 10,
    /**
     * Modified by yuvraj Sahu on 05-05-2023
     * Reason - to gap lable and input box
     */
    marginBottom: 5,
    /**
     * End of addition by yuvraj Sahu on 05-05-2023
     */
  },
  textdanger: {
    color: "#dc3545",
    marginBottom: 10,
    paddingHorizontal: 10,
    marginTop: -10,
    marginLeft: 5,
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
  activeStatus: {
    display: "flex",
    flexDirection: "row",
    width: "93%",
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 5,
  },
  activeLable: {
    marginLeft: 10,
  },
});

