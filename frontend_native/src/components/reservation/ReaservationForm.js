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
  TouchableOpacity,
} from "react-native";
import { updateReservationApi } from "../../api/Services";
import { colors, inputs } from "../../Colours/globalColor";
import * as SecureStore from "expo-secure-store";
import Footer from "../../components/Footer/Footer";
import { Formik } from "formik";
import { addItemSchema, updateReservationSchema } from "../../validation/ValidationSchema";
import SelectDropdown from "react-native-select-dropdown";
import { AntDesign } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Ionicons } from "@expo/vector-icons";
import { Feather } from '@expo/vector-icons';

export default function ReaservationForm({ route, navigation }) {

  // Added by :- Parineeta Gedam on 15-06-2023 
  // Reason :- after submit button will be disable 
  var [reservationBtnDisable, setReservationBtnDisable] = useState(false);
  // End of added code by :- Parineeta Gedam on 15-06-2023

  const isFocused = useIsFocused();
  const formRef = useRef(null);

  // Added by Parineeta Gedam on 30-5-2023
  // Reason - to get order id in from router
  const { object } = route.params;
  // End of modification

  // Added by :- Parineeta Gedam on 07-06-2023
  const [tempDate, setTempDate] = useState(new Date());
  const [maxdate, setMaxDate] = useState(new Date());
  // convert date string to date format #mohendra sahu
  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    var date = [date.getFullYear(), mnth, day].join("-")
    formRef.current.handleChange("date")(date)
  }

  function convertTime(str) {
    var time = new Date(str).toLocaleTimeString()
    formRef.current.handleChange("time")(time)
  }
  // End of added code by PArineeta Gedam on 07-06-2023


  useEffect(() => {
    setReservationStatusSelected(object.id != "add new data" ? object.reservation_status : "Pending")
  }, [isFocused])


  // Modified by :- Parineeta Gedam on 30-05-2023
  // Reason - to change reservation status name
  var reservationStatus = [
    { key: "Pending", value: "Pending" },
    { key: "Confirm", value: "Confirm" },
  ];

  var [reservationStatusSelected, setReservationStatusSelected] = useState("Pending");
  var [reservationStatusErrorMsg, setReservationStatusErrorMsg] = useState(false);
  // End of modification by :- Parineeta Gedam on 30-05-2023

  // Added by Parineeta gedam on 30-05-2023
  // Reason - to get reservations data

  const updateReservation = async (values, { resetForm }) => {
    // Added by :- PArineeta Gedam on 15-06-2023
    // Reason :- set button disable
    setReservationBtnDisable(true);
    // End of added code by :- Parineeta Gedam on 15-06-2023 
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
          // Modified by :- Parineeta Gedam 
          // setSettingBtnDisable(false);
          setReservationBtnDisable(true);
          // End of modified code by :- Parineeta Gedam on 15-06-2023 
          resetForm({ values: "" });
          navigation.navigate("ReservationListScreen")
        } else {
          Alert.alert("Something went wrong");
          // Modified by :- Parineeta Gedam 
          // setSettingBtnDisable(false);
          setReservationBtnDisable(true);
          // End of modified code by :- Parineeta Gedam on 15-06-2023 
        }
        if (res.error) {
          Alert.alert(res.error);
          // Modified by :- Parineeta Gedam 
          // setSettingBtnDisable(false);
          setReservationBtnDisable(true);
          // End of modified code by :- Parineeta Gedam on 15-06-2023 
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
            innerRef={formRef}
            enableReinitialize={true}
            validationSchema={updateReservationSchema}
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
                    placeholder="Please enter name"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={object.id != "add new data" ? false : true}
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
                    placeholder="Please enter email"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={object.id != "add new data" ? false : true}
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
                    placeholder="Please enter contact number"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={object.id != "add new data" ? false : true}
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
                    placeholder="Please enter number of person"
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={object.id != "add new data" ? false : true}
                  />
                  {errors.number_of_person && touched.number_of_person && (
                    <Text style={styles.textdanger}>{errors.number_of_person}</Text>
                  )}
                </View>

                <View style={{ marginTop: 10 }}>
                  <Text style={styles.labels}>
                    {/* Modified by :- Parineeta Gedam on 16-06-2023 reason :- Remove mandatory from special instruction. */}
                    {/* <Text style={{ color: "red" }}>* </Text>Special Instructions */}
                    <Text style={{ color: "red" }}>  </Text>Special Instructions
                    {/* End of modified code by :- Parineeta Gedam on 16-06-2023 reason :- Remove mandatory from special instruction.  */}
                  </Text>
                  <TextInput
                    style={styles.instructionsInput}
                    onChangeText={handleChange("special_instructions")}
                    onBlur={handleBlur("special_instructions")}
                    value={values.special_instructions}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Please enter instructions"
                    // keyboardType="number-pad"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={object.id != "add new data" ? false : true}
                    multiline
                  />
                  {/* Commented by :- Parineeta Gedam on 16-06-2023 reason :- remove the mandatory */}
                  {/* {errors.special_instructions && touched.special_instructions && (
                    <Text style={styles.textdanger}>{errors.special_instructions}</Text>
                  )} */}
                  {/* End of commented code by :- by :- Parineeta Gedam on 16-06-2023 reason :- remove the mandatory */}
                </View>

                <View style={{ marginTop: 10 }}>
                  <Text style={styles.labels}>
                    <Text style={{ color: "red" }}>* </Text>Date
                  </Text>
                  <View>
                    <Pressable style={[styles.input, styles.datePickerContainer]}
                      placeholderTextColor="#A4A4A4"
                      placeholder="Please enter date"
                      autoCapitalize="none"
                      autoCorrect={false}
                      disabled={object.id != "add new data" ? false : true}
                    >
                      <Text style = {{color : (object.id)!= "add new data" ? "grey" : "black"}}>{values.date ? values.date.split("-").reverse().join("/") : "Please enter date"}</Text>
                      <TouchableOpacity
                       disabled={object.id != "add new data" ? true : false}
                        onPress={() => {
                          DateTimePickerAndroid.open({
                            value: values.date ? new Date(values.date) : new Date(),
                            onChange: (event, selectedDate) => {
                              handleChange("date", convert(selectedDate));
                            },
                            mode: "date",
                            is24Hour: true,
                            minimumDate: maxdate,
                            placeholder: "Please enter date",
                          });
                        }}
                      >
                        <Ionicons
                          name="calendar"
                          size={15}
                          color={(object.id)!= "add new data" ? "grey" : "black"}
                          style={styles.passIcon}
                        />
                      </TouchableOpacity>
                    </Pressable>
                    {errors.date && touched.date && (
                    <Text style={styles.textdanger}>{errors.date}</Text>
                  )}
                  </View>

                  {/* Commented by Parineeta Gedam on 07-06-2023 */}
                  {/* <TextInput
                    style={styles.input}
                    onChangeText={handleChange("date")}
                    onBlur={handleBlur("date")}
                    value={values.date}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Enter date"
                    autoCapitalize="none"
                    autoCorrect={false}
                  /> */}
                  {/* {errors.date && touched.date && (
                    <Text style={styles.textdanger}>{errors.date}</Text>
                  )} */}
                  {/* End of Commented by Parineeta Gedam on 07-06-2023 */}
                </View>

                {/* Commented code by Parineeta Gedam on 07-06-2023   */}
                {/* <View style={{ marginTop: 10 }}>
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
                </View> */}
                {/* Commented code by Parineeta Gedam on 07-06-2023   */}


                {/* Added by :- Parineeta Gedam on 07-06-2023 */}
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.labels}>
                    <Text style={{ color: "red" }}>* </Text>Time
                  </Text>
                  <View>
                    <Pressable style={[styles.input, styles.datePickerContainer]}
                      placeholderTextColor="#A4A4A4"
                      placeholder="Please enter time"
                      autoCapitalize="none"
                      autoCorrect={false}
                      disabled={object.id != "add new data" ? false : true}
                      >
                      <Text style = {{color : (object.id)!= "add new data" ? "grey" : "black"}}>{values.time ? values.time : "Please enter time"}</Text>
                      <TouchableOpacity
                      disabled={object.id != "add new data" ? true : false}
                        onPress={() => {
                          DateTimePickerAndroid.open({
                            value: values.time ? new Date(values.time) : new Date(),
                            onChange: (event, selectedDate) => {
                              handleChange("time", convertTime(selectedDate));
                            },
                            mode: "time",
                            is24Hour: true,
                            placeholder: "Please enter time",
                          });
                        }}
                      >
                        {/* Modified by :- PArineeta Gedam on 16-06-2023 */}
                        {/* <Feather name="clock" size={13} color="black" style={styles.passIcon} /> */}
                        <Feather name="clock" size={13} color={(object.id)!= "add new data" ? "grey" : "black"} style={styles.passIcon}  />
                        {/* End of modified code by :- Parineeta Gedam on 16-06-2023 */}
                      </TouchableOpacity>
                    </Pressable>
                    {errors.time && touched.time && (
                      <Text style={styles.textdanger}>{errors.time}</Text>
                    )}
                  </View>
                </View>
                {/* End of added code by Parineeta Gedam on 07-06-2023 */}

                <View style={{ marginTop: 10 }}>
                  <Text style={styles.labels}><Text style={{ color: "red" }}>* </Text>Table Number</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("table_number")}
                    onBlur={handleBlur("table_number")}
                    value={values.table_number}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Please enter table number"
                    // keyboardType="number-pad"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {errors.table_number && touched.table_number && (
                    <Text style={styles.textdanger}>{errors.table_number}</Text>
                  )}
                </View>

                <Text style={styles.labels}>
                  <Text style={{ color: "red" }}>* </Text>Reservation status
                </Text>
                <SelectDropdown
                  data={reservationStatus}
                  defaultValueByIndex={object.id != "add new data" ? (object.reservation_status == "Pending" ? 0 : 1) : 0}
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
                {/* {reservationStatusErrorMsg && (
                  <Text
                    style={{
                      color: "red",
                      paddingHorizontal: 10,
                    }}
                  >
                    Reservation status is required
                  </Text>
                )} */}

                <View
                  style={{
                    marginBottom: 30,
                    marginHorizontal: 10,
                    marginTop: 10,
                  }}
                >
                  <Pressable
                    onPress={handleSubmit}
                    // Added by :- Parineeta Gedam on 15-06-2023
                    // Reason :- to btn disable
                    disabled={reservationBtnDisable}
                    // End of added code by :- PArineeta Gedam on 15-06-2023
                    style={{
                      // Modified by :- Parineeta Gedam on 15-06-2023
                      // Reason :- to btn disable
                      // backgroundColor: colors.btnColor,
                      backgroundColor: reservationBtnDisable
                      ? "#E0E0E0"
                      : colors.btnColor,
                      // End of added code by :- Parineeta Gedam on 15-06-2023
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
                        // Modified by :- Parineeta Gedam on 15-06-2023
                      // Reason :- to btn disable
                      // backgroundColor: colors.btnColor,
                      // color: colors.white,
                      color: reservationBtnDisable ? "#989898" : colors.white,
                      // End of added code by :- Parineeta Gedam on 15-06-2023
                   
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

  // Parineeta
  datePickerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  // End


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
  instructionsInput: {
    // height: inputs.inputBoxHeight,
    minHeight :inputs.inputBoxHeight, 
    margin: 12,
    borderWidth: 1,
    padding: 10,
    marginTop: 0,
    fontSize: 16,
    borderRadius: 10,
  },
});

