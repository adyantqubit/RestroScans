// Created by Yuvraj Sahu on 8-4-2023
// Reason - to setting app features
import SelectDropdown from "react-native-select-dropdown";
import { AntDesign } from "@expo/vector-icons";
import React, { useState, useEffect, useContext, useRef } from "react";
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
import { getSettingApi, saveSettingApi } from "../api/Services";
import { colors } from "../Colours/globalColor";
import * as SecureStore from "expo-secure-store";
import { AppStateContext } from "../context/AppStateProvider";
import Checkbox from "expo-checkbox";
import { SelectList } from "react-native-dropdown-select-list";
import { useIsFocused } from "@react-navigation/native";
import Footer from "../../src/components/Footer/Footer";
import { Formik } from "formik";
import { settingSchema } from "../validation/ValidationSchema";

export default function SettingScreen({ navigation }) {
  // var { render, setRender, settings,setSettings, getSettingData } =
  //   useContext(AppStateContext);

  const isFocused = useIsFocused();
  var [settings, setSettings] = useState({});
  const [theme, setTheme] = useState("");
  const [themeOption, setThemeOption] = useState([]);
  var [themeList, setThemeList] = useState([]);
  var [allowHalfPrice, setAllowHalfPrice] = useState(false);

  // Added by Yuvraj Sahu on 27-4-2023
  // Reason - to set default value for setting
  var [defaultValue, setDefaultValue] = useState({});
  // End of addition

  useEffect(() => {
    getSettingData();
    // Added by Yuvraj Sahu on 27-4-2023
    // Reason - to clear default value for setting
    setDefaultValue({ cgst: "", sgst: "", gstin: "", fssaino: "" });
    // End of addition
  }, [isFocused]);

  // Added by Yuvraj Sahu on 13-4-2023
  // Reason - to re render page

  // End of addition

  // Added by Yuvraj Sahu on 11-4-2023
  // Reason - to reRender page
  {
    /* This function is used to re-render the page  */
  }

  const getSettingData = async () => {
    if (await SecureStore.getItemAsync("tenantInfo")) {
      var tenant = JSON.parse(
        await SecureStore.getItemAsync("tenantInfo")
      ).tenant_name;
      var response = await getSettingApi(tenant);
      if (response) {
        setSettings(response.setting);
        setThemeOption(response.themeOptions);
        setAllowHalfPrice(settings.allow_half_price);

        // Added by Yuvraj Sahu on 27-4-2023
        // Reason - to set default value from setting
        setDefaultValue({
          cgst: response.setting.cgst != undefined ? response.setting.cgst : "",
          sgst: response.setting.sgst != undefined ? response.setting.sgst : "",
          gstin:
            response.setting.gstin != undefined ? response.setting.gstin : "",
          fssaino:
            response.setting.fssaino != undefined
              ? response.setting.fssaino
              : "",
        });
        // End of addition
      }
      getMenus1();
      // getMenus();
    }
  };

  // End of addition

  // Added by Yuvraj Sahu on 11-4-2023
  // Reason - to set themes in dropdown

  // useEffect(() => {
  //   getMenus();
  // }, []);

  const getMenus1 = async () => {
    // var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
    // const response = await getMenuList(JSON.parse(tenantInfo).tenant_name);
    // if (response.categoryList) {
    var themes = themeOption.map((e) => {
      return { key: e.id, value: e.background_color + ", " + e.heading_color };
    });

    setThemeList(themes);
  };

  // Commeted by Yuvraj Sahu on 27-4-2023
  // Reason - not using
  // const getMenus = async () => {
  //   // var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
  //   // const response = await getMenuList(JSON.parse(tenantInfo).tenant_name);
  //   // if (response.categoryList) {
  //   var themes = themeOption.map(function (obj) {
  //     obj["key"] = obj["id"]; // Assign new key
  //     obj[
  //       "value"
  //     ] = `${obj["background_color"]}, ${obj["heading_color"]}, ${obj["subheading_color"]}`; // Rename key
  //     delete obj["id"];
  //     delete obj["background_color"];
  //     delete obj["heading_color"];
  //     delete obj["subheading_color"];
  //     delete obj["banner_heading_color"];
  //     delete obj["heading_bgcolor"];
  //     delete obj["subheading_bgcolor"];
  //     return obj;
  //   });
  //   setThemeOption(themes);
  //   // }
  // };
  // End of comment

  // Commented by Yuvraj Sahu on 27-4-2023
  // Reason - to remove state ( not using ) in the time of form changing
  // var [isDisable, setIsDisable] = useState(false);
  // End of comment

  // Commented by Yuvraj Sahu on 27-4-2023
  // Reason - to replace form and API calling
  // const handleRegister = async (formValues) => {
  //   // Added by Yuvraj Sahu on 20-4-2023
  //   // Reason - to disable btn
  //   // setIsDisable(true);
  //   // End of addition
  //   var formData = new FormData();
  //   settings.id != undefined ? formData.append("id", settings.id) : null;
  //   // Commented by Yuvraj Sahu on 12-4-2023
  //   // Reason - to remove fields
  //   // formData.append("background_color", formValues.background_color);
  //   // formData.append("heading_color", formValues.heading_color);
  //   // formData.append("subheading_color", formValues.subheading_color);
  //   // formData.append("banner_heading_color", formValues.banner_heading_color);
  //   // formData.append("heading_bgcolor", formValues.heading_bgcolor);
  //   // formData.append("subheading_bgcolor", formValues.subheading_bgcolor);
  //   // End of comment
  //   /* Removed by Yuvraj Sahu on 16-4-2023
  //     Reason - to remove tax and add cgst and sgst
  //   */
  //   // formData.append("tax", formValues.tax);
  //   /* End of addition */

  //   formData.append("allow_half_price", allowHalfPrice);
  //   formData.append("app_theme", theme);
  //   /**
  //    * Added by Yuvraj Sahu on 16-4-2023
  //    * Reason - to add new filsd in setting
  //    */
  //   formData.append("cgst", formValues.cgst);
  //   formData.append("sgst", formValues.sgst);
  //   formData.append("gstin", formValues.gstin);
  //   formData.append("fssaino", formValues.fssaino);
  //   /**
  //    * End of addition
  //    */
  //   // alert(JSON.stringify(formData));
  //   // var tenant = JSON.parse(
  //   //   await SecureStore.getItemAsync("tenantInfo")
  //   // ).tenant_name;
  //   // saveSettingApi(formData, tenant).then((response) => {
  //   //   if (response.msg) {
  //   //     Alert.alert(response.msg);
  //   //     setIsDisable(false);
  //   //     setRender(!render);
  //   //     navigation.navigate("HomeScreen");
  //   //   }
  //   //   if (response.error) {
  //   //     Alert.alert("Error", response.error);
  //   //     setIsDisable(false);
  //   //   }
  //   // });
  // };
  // End of comment

  // ------------------------- formik regitration ------------------------
  var [settingBtnDisable, setSettingBtnDisable] = useState(false);

  const updateSetting = async (values, { resetForm }) => {
    setSettingBtnDisable(true);
    settings != undefined && (values["id"] = settings.id);
    values["allow_half_price"] = allowHalfPrice;
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    values["app_theme"] =
      theme != ""
        ? theme
        : settings.app_theme != undefined
        ? settings.app_theme
        : "";
    saveSettingApi(values, tenant).then(async (res) => {
      if (res.msg) {
        Alert.alert(res.msg);
        setSettingBtnDisable(false);
        // resetForm({ values: "" });
      } else {
        Alert.alert("Something went wrong");
        setSettingBtnDisable(false);
      }
      if (res.error) {
        Alert.alert(res.error);
        setSettingBtnDisable(false);
      }
    });
  };

  // ----------------------End of formik registration--------------------

  /**
   * Commented by Yuvraj Sahu on 27-4-2023
   * Reason - to remove useForm
   */
  // const {
  //   control,
  //   handleSubmit,
  //   reset,
  //   setValue,
  //   getValues,
  //   getFieldState,
  //   formState: { errors },
  // } = useForm({
  //   defaultValues: {
  //     // Added by ?Yuvraj Sahu on 12-4-2023
  //     // Reason - to remove feilds
  //     // background_color:
  //     //   settings.setting.background_color != undefined
  //     //     ? settings.setting.background_color
  //     //     : "",
  //     // heading_color:
  //     //   settings.setting.heading_color != undefined
  //     //     ? settings.setting.heading_color
  //     //     : "",
  //     // subheading_color:
  //     //   settings.setting.subheading_color != undefined
  //     //     ? settings.setting.subheading_color
  //     //     : "",
  //     // banner_heading_color:
  //     //   settings.setting.banner_heading_color != undefined
  //     //     ? settings.setting.banner_heading_color
  //     //     : "",
  //     // heading_bgcolor:
  //     //   settings.setting.heading_bgcolor != undefined
  //     //     ? settings.setting.heading_bgcolor
  //     //     : "",
  //     // subheading_bgcolor:
  //     //   settings.setting.subheading_bgcolor != undefined
  //     //     ? settings.setting.subheading_bgcolor
  //     //     : "",
  //     // End of comment

  //     /*
  //     commented and added by Yuvraj Sahu on 16-42023
  //     Reason - to change tax to cgst and sgst
  //      */
  //     // tax: settings.setting.tax != undefined ? `${settings.setting.tax}` : "",
  //     cgst: settings.cgst,
  //     sgst: settings.sgst
  //       ? settings.sgst != undefined
  //         ? "" + settings.sgst
  //         : ""
  //       : "",
  //     /*
  //     End of comment and addition
  //     */

  //     /*
  //    Added by Yuvraj Sahu on 16-4-2023
  //    Reason - to add new field
  //    */
  //     gstin: settings.gstin
  //       ? settings.gstin != undefined
  //         ? "" + settings.gstin
  //         : ""
  //       : "",
  //     fssaino: settings.fssaino
  //       ? settings.fssaino != undefined
  //         ? "" + settings.fssaino
  //         : ""
  //       : "",
  //     /*
  //      * End of addition
  //      */

  //     allow_half_price: settings.allow_half_price,
  //   },
  // });
  /**
   * End of removal useForm
   */

  // function updateSetting(e,inputBox){
  //   // alert(e+",,,,,"+inputBox)
  //   var oldSetting=settings;
  //   oldSetting.cgst=e;
  //   alert(JSON.stringify(oldSetting))
  //   setSettings(oldSetting)
  // }
  // alert("settings.gstin" + JSON.stringify(settings.gstin));

  return (
    <>
      {/* Added byYuvraj Sahu on 27-4-2023
    Reason - to click at one time on button when cursor stays on input */}
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* End of addition - button click */}
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
          {/* <SelectDropdown
            defaultValue={
              themeOption.filter((e) => {
                return e.id == settings.app_theme;
              })[0]
            }
            data={themeOption}
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
              height: 41,
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor: "white",
              width: "94%",
              alignSelf: "center",
            }}
            onSelect={(selectedItem, index) => {
              setTheme(selectedItem.id);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return (
                selectedItem.background_color +
                ", " +
                selectedItem.heading_color
              );
            }}
            rowTextForSelection={(item, index) => {
              return item.background_color + ", " + item.heading_color;
            }}
          /> */}

          {/* <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>Select theme option</Text>
        </View>
        <SelectList
          setSelected={setTheme}
          data={themeList}
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
            borderRadius: 10,
            alignSelf: "center",
            width: "93%",
            borderColor: "black",
            marginTop: 10,
          }} //override default styles
          defaultOption={{
            key: settings.id,
            value: `${settings.background_color}, ${settings.heading_color}, ${settings.subheading_color}`,
          }}
        /> */}

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
          {/* <View style={{ marginTop: 10 }}>
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
                    placeholder="Enter central GST"
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
                    placeholder="Enter state GST"
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
        </View> */}
          {/* End of comment and addition */}

          {/* Added by Yuvraj Sahu on 16-4-2023
        Reason - to add gstin no and fssaino */}
          {/* <View style={{ marginTop: 10 }}>
          <Text style={styles.labels}>GSTIN</Text>
          <Controller
            control={control}
            name="gstin"
            rules={{
              pattern: {
                // value: /^(0?[1-9]|[1-9][0-9])$/,
                value: /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/,
                message: "Enter valid GST number!",
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
                    placeholder="Enter GSTIN"
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
                    placeholder="Enter FSSAI number"
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
        </View> */}

          {/* <View style={styles.activeStatus}>
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
              // Added by Yuvraj Sahu on 20-4-2023
              // Reason - to design btn
              borderRadius: 10,
              width: 150,
              alignSelf: "center"
              // End of designing
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
        </View> */}

          {/* ------------------------------- formik ---------------------------- */}

          <Formik
            enableReinitialize={true}
            // modified by Yuvraj Sahu on 27-4-2023
            // Reason - to set default value from usestate
            initialValues={defaultValue}
            // validateOnMount={true}
            // End of modification
            validationSchema={settingSchema}
            onSubmit={updateSetting}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              touched,
              errors,
            }) => (
              // Modified by Yuvraj Sahu on 20-4-2023
              // Reason - to design screen
              // <ScrollView style={styles.container}>
              <View style={styles.container}>
                <View>
                  <Text style={styles.labels}> Select Theme</Text>
                  <SelectDropdown
                    defaultValue={
                      themeOption.filter((e) => {
                        return e.id == settings.app_theme;
                      })[0]
                    }
                    data={themeOption}
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
                      height: 41,
                      borderColor: "black",
                      borderWidth: 1,
                      borderRadius: 10,
                      backgroundColor: "white",
                      width: "94%",
                      alignSelf: "center",
                      marginBottom: 10,
                    }}
                    onSelect={(selectedItem, index) => {
                      setTheme(selectedItem.id);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return (
                        selectedItem.background_color +
                        ", " +
                        selectedItem.heading_color
                      );
                    }}
                    rowTextForSelection={(item, index) => {
                      return item.background_color + ", " + item.heading_color;
                    }}
                  />

                  <View>
                    <Text style={styles.labels}>
                      <Text style={{ color: "red", fontWeight: "650" }}> </Text>
                      CGST
                    </Text>

                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("cgst")}
                      onBlur={handleBlur("cgst")}
                      value={"" + values.cgst}
                      placeholderTextColor="#A4A4A4"
                      placeholder="Enter CGST"
                      keyboardType="number-pad"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    {errors.cgst && touched.cgst && (
                      <Text style={styles.textdanger}>{errors.cgst}</Text>
                    )}
                  </View>

                  <View>
                    <Text style={styles.labels}>
                      <Text style={{ color: "red", fontWeight: "650" }}> </Text>
                      SGST
                    </Text>
                    {/* <View style={styles.passContainer}> */}
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("sgst")}
                      onBlur={handleBlur("sgst")}
                      value={"" + values.sgst}
                      placeholderTextColor="#A4A4A4"
                      keyboardType="number-pad"
                      placeholder="Enter SGST"
                      autoCapitalize="none"
                      autoCorrect={false}
                      // secureTextEntry={!showPassword}
                      // backgroundColor={!isInputDisable ? "#E0E0E0" : "white"}
                      // editable={!isInputDisable ? false : true}
                    />
                    {/* </View> */}

                    {errors.sgst && touched.sgst && (
                      <Text style={styles.textdanger}>{errors.sgst}</Text>
                    )}
                  </View>

                  <View>
                    <Text style={styles.labels}>
                      <Text style={{ color: "red", fontWeight: "650" }}> </Text>
                      GSTIN
                    </Text>

                    {/* <View style={styles.passContainer}> */}
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("gstin")}
                      onBlur={handleBlur("gstin")}
                      value={values.gstin}
                      placeholderTextColor="#A4A4A4"
                      placeholder="Enter GSTIN"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                  {errors.gstin && touched.gstin && (
                    <Text style={styles.textdanger}>{errors.gstin}</Text>
                  )}
                  {/* </View> */}

                  {/* <View>
                    <Text style={styles.labels}>
                      <Text style={{ color: "red", fontWeight: "650" }}>
                        *{" "}
                      </Text>
                      FSSAI NO.
                    </Text>

                    <View style={styles.passContainer}>
                      <TextInput
                        style={styles.fssaino}
                        onChangeText={handleChange("fssaino")}
                        onBlur={handleBlur("fssaino")}
                        // value={values.fssaino}
                        placeholderTextColor="#A4A4A4"
                        placeholder="Enter FSSAI"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>

                    {errors.fssaino && touched.fssaino && (
                      <Text style={styles.textdanger}>{errors.fssaino}</Text>
                    )}
                  </View> */}

                  <View>
                    <Text style={styles.labels}>
                      <Text style={{ color: "red", fontWeight: "650" }}> </Text>
                      FSSAI NO.
                    </Text>

                    {/* <View style={styles.passContainer}> */}
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("fssaino")}
                      onBlur={handleBlur("fssaino")}
                      value={values.fssaino}
                      placeholderTextColor="#A4A4A4"
                      placeholder="Enter FSSAI NO."
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    {/* </View> */}

                    {errors.fssaino && touched.fssaino && (
                      <Text style={styles.textdanger}>{errors.fssaino}</Text>
                    )}
                  </View>

                  <View style={styles.activeStatus}>
                    <Checkbox
                      // style={styles.checkbox}
                      value={allowHalfPrice}
                      onValueChange={setAllowHalfPrice}
                      color={allowHalfPrice ? "#4630EB" : undefined}
                    />
                    {/* <Text style={styles.activeLable}>Allow half price</Text> */}
                    <Pressable
                      onPress={() => setAllowHalfPrice(!allowHalfPrice)}
                    >
                      <Text style={styles.activeLable}>Allow half price</Text>
                    </Pressable>
                  </View>

                  <View
                    style={{
                      marginBottom: 30,
                      marginHorizontal: 10,
                      marginTop: 10,
                    }}
                  >
                    <Pressable
                      onPress={handleSubmit}
                      disabled={settingBtnDisable}
                      // disabled={!isInputDisable && !isBtnDisable}

                      // Modified by- Suman sahu  On 26/04/2023
                      // Reason - for fix buttons styles
                      style={{
                        // backgroundColor:
                        //   isInputDisable && !isBtnDisable
                        //     ? colors.btnColor
                        //     : "#E0E0E0",
                        backgroundColor: settingBtnDisable
                          ? "#E0E0E0"
                          : colors.btnColor,
                        height: 30,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                        width: 150,
                        alignSelf: "center",
                      }}
                      // End of modified code 24/04/2023
                    >
                      <Text
                        style={{
                          // color: !isBtnDisable ? "white" : "#989898",
                          color: settingBtnDisable ? "#989898" : colors.white,
                          color: colors.white,
                          fontSize: 16,
                          fontWeight: "bold",
                        }}
                      >
                        Update Setting
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          </Formik>

          {/* ------------------------------- End formik ---------------------------- */}
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
    flex: 1,
    height: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    paddingTop: 10,
  },
  mainHeader: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    height: 41,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    marginTop: 2,
    fontSize: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  labels: {
    paddingHorizontal: 10,
  },
  textdanger: {
    color: "#dc3545",
    marginTop: -10,
    marginBottom: 10,
    paddingHorizontal: 15,
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
