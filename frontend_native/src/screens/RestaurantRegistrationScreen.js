import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  Pressable,
  Button,
  Image,
  BackHandler,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useForm, Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { postRestaurantDetail } from "../api/Services";
import { colors } from "../Colours/globalColor";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { AppStateContext } from "../context/AppStateProvider";
import { Formik } from "formik";
import { registrationSchema } from "../validation/ValidationSchema";
import Footer from "../components/Footer/Footer";

export default function RestaurantRegistrationScreen({
  navigation: { navigate },
}) {
  //Added by Yuvraj Sahu on 12-4-2023
  // Re render the page when data save
  var { render, setRender } = useContext(AppStateContext);

  const navigator = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Added byYuvraj Sahu on 2-3-2023
  // Reason - to disable button untill response is come
  var [isDisable, setIsDisable] = useState(false);
  // End of button disable

  // Added by yuvraj sahu on 21-2-2023
  // Reason - for upload img
  const [tempPhoto, setTempPhoto] = useState(null);

  // Added for testing image picker
  const [restaurant_logo, setImage] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");

  /* This is add for show image limit validation msg */
  var [isLogoFileSizeError, setLogoFileSizeError] = useState(false);
  var [isBgFileSizeError, setBgFileSizeError] = useState(false);
  /* End of addition */

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // alert(result.assets[0].fileName);
      setUploadedFileName(result.assets[0].fileName);
      setTempPhoto(result.assets[0]);

      // Added by Suman Sahu on 29-4-2023
      // Reason - to show validation msg image filed when user upload image above 200kb
      const fileSize = result.base64.length * (3 / 4) - 2;
      if (fileSize > 200000) {
        setLogoFileSizeError(true);
      } else {
        setLogoFileSizeError(false);
      }
      // End of addition 29-04-2023
    }
  };

  // Added by Yuvraj Sahu on 12-4-2023
  // Reason - to add background image
  var [backImage, setBackImage] = useState(null);
  const [backgroundFileName, setBackgroundFileName] = useState("");
  const [backgroundPhoto, setBackgroundPhoto] = useState(null);
  const pickBackImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setBackImage(result.assets[0].uri);
      // alert(result.assets[0].fileName);
      setBackgroundFileName(result.assets[0].fileName);
      setBackgroundPhoto(result.assets[0]);

      // Added by Suman Sahu on 29-4-2023
      // Reason - to show validation msg image filed when user upload image above 200kb
      const fileSize = result.base64.length * (3 / 4) - 2;
      if (fileSize > 200000) {
        setBgFileSizeError(true);
      } else {
        setBgFileSizeError(false);
      }
      // End of addition 29-04-2023
    }
  };
  // End of addition

  // Commented by - Suman sahu  On 24/04/2023
  // Reason - change the form library

  // const handleRegister = (formValues) => {
  //   var formData = new FormData();

  //   if (tempPhoto != null) {
  //     const ext = tempPhoto.uri.substring(tempPhoto.uri.lastIndexOf(".") + 1);
  //     formData.append("restaurant_logo", {
  //       uri: restaurant_logo,
  //       name: restaurant_logo,
  //       type: `image/${ext}`,
  //     });
  //   }

  //   // Added by Yuvraj Sahu on 12-4-2023
  //   // Reason - to upload background image
  //   if (backgroundPhoto != null) {
  //     const ext = backgroundPhoto.uri.substring(
  //       backgroundPhoto.uri.lastIndexOf(".") + 1
  //     );
  //     formData.append("restaurant_background_img", {
  //       uri: backImage,
  //       name: backImage,
  //       type: `image/${ext}`,
  //     });
  //   }
  //   // End of addition

  //   formData.append("restaurant_name", formValues.restaurant_name);
  //   formData.append("tag_line", formValues.tag_line);
  //   formData.append("owner_name", formValues.owner_name);
  //   formData.append("mobile_number", formValues.mobile_number);
  //   formData.append("telephone_number", formValues.telephone_number);
  //   formData.append("email", formValues.email);
  //   formData.append("password", formValues.password);
  //   formData.append("confirm_password", formValues.confirm_password);
  //   formData.append("address", formValues.address);

  //   postRestaurantDetail(formData).then((response) => {
  //     if (response.msg) {
  //       Alert.alert(response.msg);
  //       navigate("LoginScreen");
  //       setRender(!render);
  //     }
  //     // Added by Yuvraj Sahu on 19-4-2023
  //     // reason - to show duplicate data error
  //     if (response.duplicate) {
  //       Alert.alert(response.duplicate);
  //     }
  //     if (response.err) {
  //       Alert.alert(response.err);
  //       // End of aadition
  //     }
  //   });
  // };

  // const {
  //   control,
  //   handleSubmit,
  //   getValues,
  //   formState: { errors },
  // } = useForm({
  //   defaultValues: {
  //     owner_name: "",
  //     email: "",
  //     mobile_number: "",
  //     telephone_number: "",
  //     restaurant_name: "",
  //     tag_line: "",
  //     address: "",
  //     password: "",
  //     confirm_password: "",
  //   },
  // });

  // End of added code 24/04/2023

  // Added by- Suman sahu  On 24/04/2023
  // ------------------------- formik regitration ------------------------
  const isFocused = useIsFocused();
  useEffect(() => {}, [isFocused]);
  // var [isSaveBtnDisable, setSaveBtnDisable] = useState(false);
  const handleRegister = async (values, { resetForm }) => {
    var formData = new FormData();
    if (restaurant_logo != null) {
      const ext = tempPhoto.uri.substring(tempPhoto.uri.lastIndexOf(".") + 1);
      formData.append("icon", {
        uri: restaurant_logo,
        name: restaurant_logo,
        type: `image/${ext}`,
      });
    }
    if (backImage != null) {
      const ext = tempPhoto.uri.substring(
        backgroundPhoto.uri.lastIndexOf(".") + 1
      );
      formData.append("icon", {
        uri: backImage,
        name: backImage,
        type: `image/${ext}`,
      });
    }
    formData.append("owner_name", values.owner_name);
    formData.append("email", values.email);
    formData.append("mobile_number", values.mobile_number);
    formData.append("telephone_number", values.telephone_number);
    formData.append("password", values.password);
    formData.append("confirm_password", values.confirm_password);
    formData.append("restaurant_name", values.restaurant_name);
    formData.append("tag_line", values.tag_line);
    formData.append("address", values.address);

    // alert("form" + JSON.stringify(formData));

    // Modify by- Suman sahu  On 29/04/2023
    // Reason- add condition for image field when user upload image above 200kb form not saved
    if (isLogoFileSizeError == false && isBgFileSizeError == false) {
      postRestaurantDetail(formData).then(async (response) => {
        if (response.msg) {
          Alert.alert(response.msg);
          navigate("LoginScreen");
          setRender(!render);
        }
        if (response.duplicate) {
          Alert.alert(response.duplicate);
        }
        if (response.err) {
          Alert.alert(response.err);
        }
      });
    }
  };
  // ----------------------End of formik registration--------------------
  // End of addition 24/04/2023

  useEffect(() => {
    const backAction = () => {
      if (
        navigator.getState().routes[navigator.getState().index].name ==
        "LoginScreen"
      ) {
        Alert.alert("Hold on!", "Are you sure you want to Exit?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "YES",
            onPress: () => {
              BackHandler.exitApp();
            },
          },
        ]);
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {/* <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Owner Name
          </Text>
          <Controller
            control={control}
            name="owner_name"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <View>
                  <TextInput
                    style={styles.input}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Enter owner name"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={false}
                    placeholderTextColor="#A4A4A4"
                    editable={true}
                    keyboardType="default"
                  />
                </View>

                {errors?.owner_name && (
                  <Text style={styles.textdanger}>
                    {errors?.owner_name?.message}
                  </Text>
                )}
              </>
            )}
          />
        </View> */}

          {/* <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Email
          </Text>
          <Controller
            control={control}
            name="email"
            // rules={{
            //   required: {
            //     value: true,
            //     message: "Email is required!",
            //   },
            //   pattern: {
            //     value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            //     message: "Email is invalid!",
            //   },
            // }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    autoCapitalize="none"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    autoCorrect={false}
                    placeholderTextColor="#A4A4A4"
                    keyboardType="email-address"
                  />
                </View>
                {errors?.email && (
                  <Text style={styles.textdanger}>
                    {errors?.email?.message}
                  </Text>
                )}
              </>
            )}
          />
        </View> */}

          {/* <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Mobile Number
          </Text>
          <Controller
            control={control}
            name="mobile_number"
            // rules={{
            //   required: {
            //     value: true,
            //     message: "Mobile number is required!",
            //   },
            //   pattern: {
            //     value: /^\d{10}$/,
            //     message: "Mobile Number must be 10 digits",
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
                    placeholder="Enter your mobile number"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={false}
                    placeholderTextColor="#A4A4A4"
                    editable={true}
                    keyboardType="number-pad"
                  />
                </View>
                {errors?.mobile_number && (
                  <Text style={styles.textdanger}>
                    {errors?.mobile_number?.message}
                  </Text>
                )}
              </>
            )}
          />
        </View> */}

          {/* <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>Telephone Number</Text>
          <Controller
            control={control}
            name="telephone_number"
            // rules={{
            //   pattern: {
            //     value: /^\d{10}$/,
            //     message: "Telephone Number must be 10 digits",
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
                    placeholder="Enter your Telephone number"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={false}
                    placeholderTextColor="#A4A4A4"
                    editable={true}
                    keyboardType="number-pad"
                  />
                </View>
                {errors?.telephone_number && (
                  <Text style={styles.textdanger}>
                    {errors?.telephone_number?.message}
                  </Text>
                )}
              </>
            )}
          />
        </View> */}

          {/* <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Password
          </Text>
          <Controller
            control={control}
            name="password"
            // rules={{
            //   required: {
            //     value: true,
            //     message: "Password is required!",
            //   },
            //   minLength: {
            //     value: 8,
            //     message: "Password must be at least 8 characters!",
            //     style: { marginTop: -10 },
            //   },
            // }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <View style={styles.passContainer}>
                  <TextInput
                    style={styles.inputPassword}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Enter your password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#A4A4A4"
                    editable={true}
                    keyboardType="default"
                  />

                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye" : "eye-off"}
                      size={24}
                      color="black"
                      style={styles.passIcon}
                    />
                  </TouchableOpacity>
                </View>
                {errors?.password && (
                  <Text style={styles.textdanger}>
                    {errors?.password?.message}
                  </Text>
                )}
              </>
            )}
          />
        </View> */}

          {/* <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Confirm Password
          </Text>

          <Controller
            control={control}
            name="confirm_password"
            // rules={{
            //   required: {
            //     value: true,
            //     message: "Confirm password is required!",
            //   },
            //   minLength: {
            //     value: 8,
            //     message: "Confirm password must be at least 8 characters!",
            //   },
            //   validate: (value) =>
            //     value === getValues("password") ||
            //     "Password and confirm password should be same!",
            // }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <View style={styles.passContainer}>
                  <TextInput
                    style={styles.inputPassword}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Enter your password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={!showConfirmPassword}
                    placeholderTextColor="#A4A4A4"
                    editable={true}
                    keyboardType="default"
                  />

                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons
                      name={showConfirmPassword ? "eye" : "eye-off"}
                      size={24}
                      color="black"
                      style={styles.passIcon}
                    />
                  </TouchableOpacity>
                </View>
                {errors?.confirm_password && (
                  <Text style={styles.textdanger}>
                    {errors?.confirm_password?.message}
                  </Text>
                )}
              </>
            )}
          />
        </View> */}

          {/* <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Restaurant name
          </Text>
          <Controller
            control={control}
            name="restaurant_name"
            // rules={{
            //   required: {
            //     value: true,
            //     message: "Restaurant name is required!",
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
                    placeholder="Enter Restaurant name"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={false}
                    placeholderTextColor="#A4A4A4"
                    editable={true}
                    keyboardType="default"
                  />
                </View>

                {errors?.restaurant_name && (
                  <Text style={styles.textdanger}>
                    {errors?.restaurant_name?.message}
                  </Text>
                )}
              </>
            )}
          />
        </View> */}

          {/* <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>Tag line</Text>
          <Controller
            control={control}
            name="tag_line"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <View>
                  <TextInput
                    style={styles.input}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Enter tag line"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={false}
                    placeholderTextColor="#A4A4A4"
                    editable={true}
                    keyboardType="default"
                  />
                </View>

                {errors?.tag_line && (
                  <Text style={styles.textdanger}>
                    {errors?.tag_line?.message}
                  </Text>
                )}
              </>
            )}
          />
        </View> */}

          {/* <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Address
          </Text>
          <Controller
            control={control}
            name="address"
            // rules={{
            //   required: {
            //     value: true,
            //     message: "Address is required!",
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
                    placeholder="Enter address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={false}
                    placeholderTextColor="#A4A4A4"
                    editable={true}
                    keyboardType="default"
                  />
                </View>

                {errors?.address && (
                  <Text style={styles.textdanger}>
                    {errors?.address?.message}
                  </Text>
                )}
              </>
            )}
          />
        </View> */}

          {/* <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "93%",
            alignSelf: "center",
            marginTop: 5,
            marginBottom: 5,
          }}
        >
          <Text style={{ color: "red", fontWeight: "650" }}> </Text>
          <Text>Upload logo</Text>
        </View>

        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 3,
            width: "93%",
            alignSelf: "center",
            flexDirection: "row-reverse",
            justifyContent: "space-around",
          }}
        >
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
          {restaurant_logo && (
            <Image
              source={{ uri: restaurant_logo }}
              style={{ width: 50, height: 40, borderRadius: 5 }}
            />
          )}
        </View> */}

          {/* <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "93%",
            alignSelf: "center",
            marginTop: 5,
            marginBottom: 5,
          }}
        >
          <Text style={{ color: "red", fontWeight: "650" }}> </Text>
          <Text>Upload background image</Text>
        </View>

        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 3,
            width: "93%",
            alignSelf: "center",
            flexDirection: "row-reverse",
            justifyContent: "space-around",
          }}
        >
          <Pressable
            onPress={pickBackImage}
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
          {backImage && (
            <Image
              source={{ uri: backImage }}
              style={{ width: 50, height: 40, borderRadius: 5 }}
            />
          )}
        </View> */}

          {/* <View style={{ marginBottom: 30, marginHorizontal: 10, marginTop: 10 }}>
          <Pressable
            onPress={handleSubmit(handleRegister)}
            disabled={isDisable}
            style={{
              backgroundColor: isDisable ? "grey" : colors.btnColor,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              width: 150,
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Register
            </Text>
          </Pressable>
        </View> */}

          <Formik
            validateOnMount={true}
            initialValues={{
              owner_name: "",
              email: "",
              mobile_number: "",
              telephone_number: "",
              password: "",
              confirm_password: "",
              restaurant_name: "",
              address: "",
              restaurant_logo: "",
              restaurant_background_img: "",
            }}
            validationSchema={registrationSchema}
            onSubmit={handleRegister}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              touched,
              errors,
            }) => (
              <View style={styles.container}>
                <View>
                  <View>
                    <Text style={styles.labels}>
                      <Text style={{ color: "red", fontWeight: "650" }}>
                        *{" "}
                      </Text>
                      Owner Name
                    </Text>

                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("owner_name")}
                      onBlur={handleBlur("owner_name")}
                      value={values.owner_name}
                      placeholderTextColor="#A4A4A4"
                      placeholder="Enter owner name"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    {errors.owner_name && touched.owner_name && (
                      <Text style={styles.textdanger}>{errors.owner_name}</Text>
                    )}
                  </View>

                  <View>
                    <Text style={styles.labels}>
                      <Text style={{ color: "red", fontWeight: "650" }}>
                        *{" "}
                      </Text>
                      Email
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

                  <View>
                    <Text style={styles.labels}>
                      <Text style={{ color: "red", fontWeight: "650" }}>
                        *{" "}
                      </Text>
                      Mobile Number
                    </Text>

                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("mobile_number")}
                      onBlur={handleBlur("mobile_number")}
                      value={values.mobile_number}
                      placeholderTextColor="#A4A4A4"
                      keyboardType="number-pad"
                      placeholder="Enter mobile number"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                  {errors.mobile_number && touched.mobile_number && (
                    <Text style={styles.textdanger}>
                      {errors.mobile_number}
                    </Text>
                  )}

                  <View>
                    <Text style={styles.labels}>
                      <Text style={{ color: "red", fontWeight: "650" }}> </Text>
                      Telephone Number
                    </Text>

                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("telephone_number")}
                      // onBlur={handleBlur("telephone_number")}
                      value={values.telephone_number}
                      placeholderTextColor="#A4A4A4"
                      keyboardType="number-pad"
                      placeholder="Enter telephone number"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />

                    {/* {errors.telephone_number && touched.telephone_number && (
                    <Text style={styles.textdanger}>
                      {errors.telephone_number}
                    </Text>
                  )} */}
                  </View>

                  <View>
                    <Text style={styles.labels}>
                      <Text style={{ color: "red", fontWeight: "650" }}>
                        *{" "}
                      </Text>
                      Password
                    </Text>

                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      placeholderTextColor="#A4A4A4"
                      placeholder="Enter password"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />

                    {errors.password && touched.password && (
                      <Text style={styles.textdanger}>{errors.password}</Text>
                    )}
                  </View>

                  <View>
                    <Text style={styles.labels}>
                      <Text style={{ color: "red", fontWeight: "650" }}>
                        *{" "}
                      </Text>
                      Confirm Password
                    </Text>

                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("confirm_password")}
                      onBlur={handleBlur("confirm_password")}
                      value={values.confirm_password}
                      placeholderTextColor="#A4A4A4"
                      placeholder="Enter confirm password"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />

                    {errors.confirm_password && touched.confirm_password && (
                      <Text style={styles.textdanger}>
                        {errors.confirm_password}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text style={styles.labels}>
                      <Text style={{ color: "red", fontWeight: "650" }}>
                        *{" "}
                      </Text>
                      Restaurant name
                    </Text>

                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("restaurant_name")}
                      onBlur={handleBlur("restaurant_name")}
                      value={values.restaurant_name}
                      placeholderTextColor="#A4A4A4"
                      placeholder="Enter restaurant name"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />

                    {errors.restaurant_name && touched.restaurant_name && (
                      <Text style={styles.textdanger}>
                        {errors.restaurant_name}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text style={styles.labels}>
                      <Text style={{ color: "red", fontWeight: "650" }}> </Text>
                      Tag line
                    </Text>

                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("tag_line")}
                      // onBlur={handleBlur("tag_line")}
                      value={values.tag_line}
                      placeholderTextColor="#A4A4A4"
                      placeholder="Enter tag line"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />

                    {/* {errors.tag_line && touched.tag_line && (
                    <Text style={styles.textdanger}>{errors.tag_line}</Text>
                  )} */}
                  </View>

                  <View>
                    <Text style={styles.labels}>
                      <Text style={{ color: "red", fontWeight: "650" }}>
                        *{" "}
                      </Text>
                      Address
                    </Text>

                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("address")}
                      onBlur={handleBlur("address")}
                      value={values.address}
                      placeholderTextColor="#A4A4A4"
                      placeholder="Enter address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />

                    {errors.address && touched.address && (
                      <Text style={styles.textdanger}>{errors.address}</Text>
                    )}
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
                    <Text style={{ color: "red", fontWeight: "650" }}> </Text>
                    <Text>Upload logo</Text>
                  </View>

                  <View
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 3,
                      width: "93%",
                      alignSelf: "center",
                      flexDirection: "row-reverse",
                      justifyContent: "space-around",
                    }}
                  >
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
                    {restaurant_logo && (
                      <Image
                        source={{ uri: restaurant_logo }}
                        style={{ width: 50, height: 40, borderRadius: 5 }}
                      />
                    )}
                  </View>
                  {/* Added by- Suman sahu  On 26/04/2023
                    Reason- add label in upload image field */}
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      alignSelf: "center",
                      justifyContent: "center",
                      marginTop: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#7d7c7a",
                      }}
                    >
                      Please upload image below 200kb
                    </Text>
                  </View>
                  {/* End of added code 26/04/2023 */}

                  {/* Added by Suman Sahu on 29-04-2023
                    Reason - to show validation msg image filed when user upload image above 200kb */}
                  {isLogoFileSizeError && (
                    <Text style={{ color: "red", marginLeft: 70 }}>
                      Please upload image below 200kb
                    </Text>
                  )}
                  {/* End of addition  29-04-2023*/}

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
                    <Text style={{ color: "red", fontWeight: "650" }}> </Text>
                    <Text>Upload background image</Text>
                  </View>

                  <View
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 3,
                      width: "93%",
                      alignSelf: "center",
                      flexDirection: "row-reverse",
                      justifyContent: "space-around",
                    }}
                  >
                    <Pressable
                      onPress={pickBackImage}
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
                    {backImage && (
                      <Image
                        source={{ uri: backImage }}
                        style={{ width: 50, height: 40, borderRadius: 5 }}
                      />
                    )}
                  </View>

                  {/* Added by Suman Sahu on 29-04-2023
                    Reason - to show validation msg image filed when user upload image above 200kb */}
                  {isBgFileSizeError && (
                    <Text style={{ color: "red", marginLeft: 70 }}>
                      Please upload image below 200kb
                    </Text>
                  )}
                  {/* End of addition  29-04-2023*/}

                  {/* Added by- Suman sahu  On 26/04/2023
                    Reason- add label in upload image field */}
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      alignSelf: "center",
                      justifyContent: "center",
                      marginTop: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#7d7c7a",
                      }}
                    >
                      Please upload image below 200kb
                    </Text>
                  </View>
                  {/* End of added code 26/04/2023 */}

                  <View
                    style={{
                      marginBottom: 30,
                      marginHorizontal: 10,
                      marginTop: 10,
                    }}
                  >
                    <Pressable
                      onPress={handleSubmit}
                      disabled={isDisable}
                      // Modified by- Suman sahu  On 26/04/2023
                      // Reason - for redesign buttons styles
                      style={{
                        backgroundColor: isDisable ? "grey" : colors.btnColor,
                        // backgroundColor: colors.btnColor,
                        height: 30,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                        width: 140,
                        alignSelf: "center",
                      }}
                      // End of modified code 26/04/2023
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 16,
                          fontWeight: "bold",
                        }}
                      >
                        Register
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
      {/* Added by Om on 26-04-23 For showing the footer*/}
      <>
        <Footer />
      </>
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
    paddingTop: 5,
  },
  mainHeader: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    height: 42,
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
    // Added by - Suman sahu  On 24/04/2023
    // Reason- for adjust error msg top margin
    marginTop: -10,
    // End of added code
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
    borderRadius: 10,
  },
  inputPassword: {
    paddingTop: 10,
    paddingLeft: 8,
    paddingBottom: 10,
    paddingRight: 10,
    fontSize: 15,
    borderRadius: 10,
    flex: 1,
    height: 41,
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
