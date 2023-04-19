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
import { SelectList } from "react-native-dropdown-select-list";
import { useIsFocused } from "@react-navigation/native";
import Footer from '../../src/components/Footer/Footer'

export default function SettingScreen({ navigation }) {
  var { render, setRender, settings, getSettingData } =
    useContext(AppStateContext);

  // Added by Yuvraj Sahu on 13-4-2023
  // Reason - to re render page
  const isFocused = useIsFocused();
  // End of addition

  // Added by Yuvraj Sahu on 11-4-2023
  // Reason - to reRender page
  {
    /* This function is used to re-render the page  */
  }
  React.useEffect(() => {
    getSettingData();
  }, [render, isFocused]);
  // End of addition

  // Added by Yuvraj Sahu on 11-4-2023
  // Reason - to set themes in dropdown
  const [theme, setTheme] = React.useState("");
  var [themeOption, setThemeOption] = useState([]);
  React.useEffect(() => {
    getMenus();
  }, []);

  const getMenus = async () => {
    // var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
    // const response = await getMenuList(JSON.parse(tenantInfo).tenant_name);
    // if (response.categoryList) {
    setThemeOption(
      settings.themeOptions.map(function (obj) {
        obj["key"] = obj["id"]; // Assign new key
        obj[
          "value"
        ] = `${obj["background_color"]}, ${obj["heading_color"]}, ${obj["subheading_color"]}`; // Rename key
        delete obj["id"];
        delete obj["background_color"];
        delete obj["heading_color"];
        delete obj["subheading_color"];
        delete obj["banner_heading_color"];
        delete obj["heading_bgcolor"];
        delete obj["subheading_bgcolor"];
        return obj;
      })
    );
    // }
  };

  const [allowHalfPrice, setAllowHalfPrice] = useState(
    settings.setting.allow_half_price
  );

  var [isDisable, setIsDisable] = useState(false);

  const handleRegister = async (formValues) => {
    // setIsDisable(true);
    var formData = new FormData();
    settings.setting.id != undefined
      ? formData.append("id", settings.setting.id)
      : null;
    // Commented by Yuvraj Sahu on 12-4-2023
    // Reason - to remove fields
    // formData.append("background_color", formValues.background_color);
    // formData.append("heading_color", formValues.heading_color);
    // formData.append("subheading_color", formValues.subheading_color);
    // formData.append("banner_heading_color", formValues.banner_heading_color);
    // formData.append("heading_bgcolor", formValues.heading_bgcolor);
    // formData.append("subheading_bgcolor", formValues.subheading_bgcolor);
    // End of comment
    /* Removed by Yuvraj Sahu on 16-4-2023
      Reason - to remove tax and add cgst and sgst
    */
    // formData.append("tax", formValues.tax);
    /* End of addition */
    formData.append("allow_half_price", allowHalfPrice);
    formData.append("app_theme", theme);
    /**
     * Added by Yuvraj Sahu on 16-4-2023
     * Reason - to add new filsd in setting
     */
    formData.append("cgst", formValues.cgst);
    formData.append("sgst", formValues.sgst);
    formData.append("gstin", formValues.gstin);
    formData.append("fssaino", formValues.fssaino);
    /**
     * End of addition
     */

    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    saveSettingApi(formData, tenant).then((response) => {
      if (response.msg) {
        Alert.alert("Successful", response.msg);
        setIsDisable(false);
        setRender(!render);
        // navigation.navigate("HomeScreen");
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
      // Added by ?Yuvraj Sahu on 12-4-2023
      // Reason - to remove feilds
      // background_color:
      //   settings.setting.background_color != undefined
      //     ? settings.setting.background_color
      //     : "",
      // heading_color:
      //   settings.setting.heading_color != undefined
      //     ? settings.setting.heading_color
      //     : "",
      // subheading_color:
      //   settings.setting.subheading_color != undefined
      //     ? settings.setting.subheading_color
      //     : "",
      // banner_heading_color:
      //   settings.setting.banner_heading_color != undefined
      //     ? settings.setting.banner_heading_color
      //     : "",
      // heading_bgcolor:
      //   settings.setting.heading_bgcolor != undefined
      //     ? settings.setting.heading_bgcolor
      //     : "",
      // subheading_bgcolor:
      //   settings.setting.subheading_bgcolor != undefined
      //     ? settings.setting.subheading_bgcolor
      //     : "",
      // End of comment

      /*
      commented and added by Yuvraj Sahu on 16-42023
      Reason - to change tax to cgst and sgst
       */
      // tax: settings.setting.tax != undefined ? `${settings.setting.tax}` : "",
      cgst:
        settings.setting.cgst != undefined ? `${settings.setting.cgst}` : "",
      sgst:
        settings.setting.sgst != undefined ? `${settings.setting.sgst}` : "",
      /*
      End of comment and addition
      */

      /*
     Added by Yuvraj Sahu on 16-4-2023
     Reason - to add new field
     */
      gstin:
        settings.setting.cgst != undefined ? `${settings.setting.gstin}` : "",
      fssaino:
        settings.setting.cgst != undefined ? `${settings.setting.fssaino}` : "",
      /*
       * End of addition
       */

      allow_half_price:
        settings.setting.allow_half_price != undefined
          ? settings.setting.allow_half_price
          : "",
    },
  });

  return (
    <>
    <ScrollView>
      <View style={styles.container}>
        {/* Commented by Yuvraj Sahu on 12-4-2023
      Reason - to remove feilds */}
        {/* <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            Background Color
          </Text>
          <Controller
            control={control}
            name="background_color"
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
            Heading Color
          </Text>
          <Controller
            control={control}
            name="heading_color"
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
            Subheading color
          </Text>
          <Controller
            control={control}
            name="subheading_color"
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
            Banner heading color
          </Text>
          <Controller
            control={control}
            name="banner_heading_color"
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
            Heading background color
          </Text>
          <Controller
            control={control}
            name="heading_bgcolor"
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
            Sub heading background color
          </Text>
          <Controller
            control={control}
            name="subheading_bgcolor"
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
        </View> */}
        {/*End of Comment */}
        <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>Select theme option</Text>
        </View>
        <SelectList
          setSelected={setTheme}
          data={themeOption}
          search={false}
          // Added by Yuvraj Sahu on 13-4-2023
          // Reason - to design dropdown
          dropdownStyles={{
            width: "93%",
            alignSelf: "center",
            marginTop: 1,
          }}
          // End of design
          boxStyles={{
            borderRadius: 5,
            alignSelf: "center",
            width: "93%",
            borderColor: "black",
            marginTop: 10,
          }} //override default styles
          defaultOption={{
            key: settings.setting.id,
            value: `${settings.setting.background_color}, ${settings.setting.heading_color}, ${settings.setting.subheading_color}`,
          }}
        />

        {/* Commented and added by Yuvraj Sahu on 16-4-2023
        Reason - to replace tax with cgst and sgst */}
        {/* <View style={{ marginTop: 10 }}>
          <Text style={styles.labels}>
            Tax
          </Text>
          <Controller
            control={control}
            name="tax"
            rules={{
              pattern: {
                value: /^(0?[1-9]|[1-9][0-9])$/,
                message: "Enter valid number !",
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
        </View> */}
        <View style={{ marginTop: 10 }}>
          <Text style={styles.labels}>CGST</Text>
          <Controller
            control={control}
            name="cgst"
            rules={{
              pattern: {
                // value: /^(0?[1-9]|[1-9][0-9])$/,
                value: /^[1-9]\d*(\.\d+)?$/,
                message: "Enter valid number !",
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
                    placeholder="Enter central tax"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={false}
                    placeholderTextColor="#A4A4A4"
                    editable={true}
                    keyboardType="default"
                  />
                </View>

                {errors?.cgst && (
                  <Text style={styles.textdanger}>{errors?.cgst?.message}</Text>
                )}
              </>
            )}
          />
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={styles.labels}>SGST</Text>
          <Controller
            control={control}
            name="sgst"
            rules={{
              pattern: {
                // value: /^(0?[1-9]|[1-9][0-9])$/,
                value: /^[1-9]\d*(\.\d+)?$/,
                message: "Enter valid number!",
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
                    placeholder="Enter state tax"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={false}
                    placeholderTextColor="#A4A4A4"
                    editable={true}
                    keyboardType="default"
                  />
                </View>

                {errors?.sgst && (
                  <Text style={styles.textdanger}>{errors?.sgst?.message}</Text>
                )}
              </>
            )}
          />
        </View>
        {/* End of comment and addition */}

        {/* Added by Yuvraj Sahu on 16-4-2023
        Reason - to add gstin no and fssaino */}
        <View style={{ marginTop: 10 }}>
          <Text style={styles.labels}>GSTIN</Text>
          <Controller
            control={control}
            name="gstin"
            rules={{
              pattern: {
                // value: /^(0?[1-9]|[1-9][0-9])$/,
                value: /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/,
                message: "Enter valid gst number!",
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
                    placeholder="Enter gstin"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={false}
                    placeholderTextColor="#A4A4A4"
                    editable={true}
                    keyboardType="default"
                  />
                </View>

                {errors?.gstin && (
                  <Text style={styles.textdanger}>
                    {errors?.gstin?.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={styles.labels}>FSSAI NO</Text>
          <Controller
            control={control}
            name="fssaino"
            // rules={{
            //   pattern: {
            //     value: /^(0?[1-9]|[1-9][0-9])$/,
            //     message: "Enter valid number!",
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
                    placeholder="Enter fssai number"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={false}
                    placeholderTextColor="#A4A4A4"
                    editable={true}
                    keyboardType="default"
                  />
                </View>

                {errors?.fssaino && (
                  <Text style={styles.textdanger}>
                    {errors?.fssaino?.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>
        {/* End of addition */}

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
    {/* Added by Om on 18-04-23 For showing the footer*/}
    <Footer/>
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
