// Created by Yuvraj Sahu on 8-4-2023
// Reason - to setting app features

import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { saveSettingApi } from "../api/Services";
import { colors } from "../Colours/globalColor";
import * as SecureStore from "expo-secure-store";
import { AppStateContext } from "../context/AppStateProvider";
import Checkbox from "expo-checkbox";

export default function SettingScreen() {
  var { render, setRender, settings } = useContext(AppStateContext);

  const [allowHalfPrice, setAllowHalfPrice] = useState(
    settings.setting.allow_half_price
  );

  var [isDisable, setIsDisable] = useState(false);

  const handleRegister = async (formValues) => {
    setIsDisable(true);
    var formData = new FormData();
    settings.setting.id != undefined
      ? formData.append("id", settings.setting.id)
      : null;
    formData.append("background_color", formValues.background_color);
    formData.append("heading_color", formValues.heading_color);
    formData.append("subheading_color", formValues.subheading_color);
    formData.append("banner_heading_color", formValues.banner_heading_color);
    formData.append("heading_bgcolor", formValues.heading_bgcolor);
    formData.append("subheading_bgcolor", formValues.subheading_bgcolor);
    formData.append("tax", formValues.tax);
    formData.append("allow_half_price", allowHalfPrice);

    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    saveSettingApi(formData, tenant).then((response) => {
      if (response.msg) {
        Alert.alert("Successful", response.msg);
        setIsDisable(false);
      }
      if (response.error) {
        Alert.alert("Error", response.error);
        setIsDisable(false);
      }
    });
  };

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
      background_color:
        settings.setting.background_color != undefined
          ? settings.setting.background_color
          : "",
      heading_color:
        settings.setting.heading_color != undefined
          ? settings.setting.heading_color
          : "",
      subheading_color:
        settings.setting.subheading_color != undefined
          ? settings.setting.subheading_color
          : "",
      banner_heading_color:
        settings.setting.banner_heading_color != undefined
          ? settings.setting.banner_heading_color
          : "",
      heading_bgcolor:
        settings.setting.heading_bgcolor != undefined
          ? settings.setting.heading_bgcolor
          : "",
      subheading_bgcolor:
        settings.setting.subheading_bgcolor != undefined
          ? settings.setting.subheading_bgcolor
          : "",
      tax: settings.setting.tax != undefined ? `${settings.setting.tax}` : "",
      allow_half_price:
        settings.setting.allow_half_price != undefined
          ? settings.setting.allow_half_price
          : "",
    },
  });

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            {/* <Text style={{ color: "red", fontWeight: "650" }}>* </Text> */}
            Background Color
          </Text>
          <Controller
            control={control}
            name="background_color"
            // rules={{
            //   required: {
            //     value: true,
            //     message: "Background Color name is required",
            //   },
            // }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <View>
                  <TextInput
                    style={styles.input}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Enter background color"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={false}
                    placeholderTextColor="#A4A4A4"
                    editable={true}
                    keyboardType="default"
                  />
                </View>

                {errors?.background_color && (
                  <Text style={styles.textdanger}>
                    {errors?.background_color?.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            {/* <Text style={{ color: "red", fontWeight: "650" }}>* </Text> */}
            Heading Color
          </Text>
          <Controller
            control={control}
            name="heading_color"
            // rules={{
            //   required: {
            //     value: true,
            //     message: "Heading color is required",
            //   },
            // }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <View>
                  <TextInput
                    style={styles.input}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Enter heading color"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={false}
                    placeholderTextColor="#A4A4A4"
                    editable={true}
                  />
                </View>
                {errors?.heading_color && (
                  <Text style={styles.textdanger}>
                    {errors?.heading_color?.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            {/* <Text style={{ color: "red", fontWeight: "650" }}>* </Text> */}
            Subheading color
          </Text>
          <Controller
            control={control}
            name="subheading_color"
            // rules={{
            //   required: {
            //     value: true,
            //     message: "Subheading Color name is required",
            //   },
            // }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <View>
                  <TextInput
                    style={styles.input}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Enter subheading color"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={false}
                    placeholderTextColor="#A4A4A4"
                    editable={true}
                    keyboardType="default"
                  />
                </View>

                {errors?.subheading_color && (
                  <Text style={styles.textdanger}>
                    {errors?.subheading_color?.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            {/* <Text style={{ color: "red", fontWeight: "650" }}>* </Text> */}
            Banner heading color
          </Text>
          <Controller
            control={control}
            name="banner_heading_color"
            // rules={{
            //   required: {
            //     value: true,
            //     message: "Banner heading color is required",
            //   },
            // }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <View>
                  <TextInput
                    style={styles.input}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Enter banner heading color"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={false}
                    placeholderTextColor="#A4A4A4"
                    editable={true}
                    keyboardType="default"
                  />
                </View>

                {errors?.banner_heading_color && (
                  <Text style={styles.textdanger}>
                    {errors?.banner_heading_color?.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            {/* <Text style={{ color: "red", fontWeight: "650" }}>* </Text> */}
            Heading background color
          </Text>
          <Controller
            control={control}
            name="heading_bgcolor"
            // rules={{
            //   required: {
            //     value: true,
            //     message: "Heading background color is required",
            //   },
            // }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <View>
                  <TextInput
                    style={styles.input}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Enter heading background color"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={false}
                    placeholderTextColor="#A4A4A4"
                    editable={true}
                    keyboardType="default"
                  />
                </View>

                {errors?.heading_bgcolor && (
                  <Text style={styles.textdanger}>
                    {errors?.heading_bgcolor?.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            {/* <Text style={{ color: "red", fontWeight: "650" }}>* </Text> */}
            Sub heading background color
          </Text>
          <Controller
            control={control}
            name="subheading_bgcolor"
            // rules={{
            //   required: {
            //     value: true,
            //     message: "Sub heading background color is required",
            //   },
            // }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <View>
                  <TextInput
                    style={styles.input}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Enter sub heading background color"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={false}
                    placeholderTextColor="#A4A4A4"
                    editable={true}
                    keyboardType="default"
                  />
                </View>

                {errors?.subheading_bgcolor && (
                  <Text style={styles.textdanger}>
                    {errors?.subheading_bgcolor?.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            {/* <Text style={{ color: "red", fontWeight: "650" }}>* </Text> */}
            Tax
          </Text>
          <Controller
            control={control}
            name="tax"
            // rules={{
            //   required: {
            //     value: true,
            //     message: "Tax is required",
            //   },
            // }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <View>
                  <TextInput
                    style={styles.input}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Enter tax"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={false}
                    placeholderTextColor="#A4A4A4"
                    editable={true}
                    keyboardType="default"
                  />
                </View>

                {errors?.tax && (
                  <Text style={styles.textdanger}>{errors?.tax?.message}</Text>
                )}
              </>
            )}
          />
        </View>

        <View style={styles.activeStatus}>
          <Checkbox
            // style={styles.checkbox}
            value={allowHalfPrice}
            onValueChange={setAllowHalfPrice}
            color={allowHalfPrice ? "#4630EB" : undefined}
          />
          <Text style={styles.activeLable}>Allow half price</Text>
        </View>

        <View style={{ marginBottom: 30, marginHorizontal: 10, marginTop: 20 }}>
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
});
