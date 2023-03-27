import React, { useState, useEffect } from "react";
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

import { useForm, Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { postRestaurantDetail } from "../api/Services";
import { colors } from "../Colours/globalColor";
import { useNavigation } from "@react-navigation/native";

export default function RestaurantRegistrationScreen({
  navigation: { navigate },
}) {
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
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // alert(result.assets[0].fileName);
      setUploadedFileName(result.assets[0].fileName);
      setTempPhoto(result.assets[0]);
    }
  };

  const handleRegister = (formValues) => {
    var formData = new FormData();
    const ext = tempPhoto.uri.substring(tempPhoto.uri.lastIndexOf(".") + 1);

    formData.append("restaurant_logo", {
      uri: restaurant_logo,
      name: restaurant_logo,
      type: `image/${ext}`,
    });

    formData.append("restaurant_name", formValues.restaurant_name);
    formData.append("tag_line", formValues.tag_line);
    formData.append("owner_name", formValues.owner_name);
    formData.append("mobile_number", formValues.mobile_number);
    formData.append("telephone_number", formValues.telephone_number);
    formData.append("email", formValues.email);
    formData.append("password", formValues.password);
    formData.append("confirm_password", formValues.confirm_password);
    formData.append("address", formValues.address);

    postRestaurantDetail(formData).then((response) => {
      if (response.msg) {
        Alert.alert("Succesfull", response.msg);
        navigate("LoginScreen");
      }
      if (response.err) {
        Alert.alert("Error", response.msg);
      }
    });
  };

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      owner_name: "",
      email: "",
      mobile_number: "",
      telephone_number: "",
      restaurant_name: "",
      tag_line: "",
      address: "",
      password: "",
      confirm_password: "",
    },
  });

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
    <ScrollView>
      <View style={styles.container}>
        <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Name
          </Text>
          <Controller
            control={control}
            name="owner_name"
            rules={{
              required: {
                value: true,
                message: "Owner name is required!",
              },
              pattern: {
                value: /^(?!\s+$).*/,
                message: "Owner name cannot contain only blankspaces!",
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
                    placeholder="Enter your name"
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
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Email
          </Text>
          <Controller
            control={control}
            name="email"
            rules={{
              required: {
                value: true,
                message: "Email is required!",
              },
              pattern: {
                value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                message: "Email is invalid!",
              },
            }}
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
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Mobile Number
          </Text>
          <Controller
            control={control}
            name="mobile_number"
            rules={{
              required: {
                value: true,
                message: "Mobile number is required!",
              },
              pattern: {
                value: /^[6789]\d{9}$/,
                message: "Mobile Number is invalid!",
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
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Telephone Number
          </Text>
          <Controller
            control={control}
            name="telephone_number"
            rules={{
              required: {
                value: true,
                message: "Telephone number is required!",
              },
              pattern: {
                value: /^[6789]\d{9}$/,
                message: "Telephone number is invalid!",
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
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Password
          </Text>
          <Controller
            control={control}
            name="password"
            rules={{
              required: {
                value: true,
                message: "Password is required!",
              },
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters!",
              },
            }}
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
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Confirm Password
          </Text>

          <Controller
            control={control}
            name="confirm_password"
            rules={{
              required: {
                value: true,
                message: "Confirm password is required!",
              },
              minLength: {
                value: 8,
                message: "Confirm password must be at least 8 characters!",
              },
              validate: (value) =>
                value === getValues("password") ||
                "Password & Confirm Password does not match!",
            }}
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
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Restaurant name
          </Text>
          <Controller
            control={control}
            name="restaurant_name"
            rules={{
              required: {
                value: true,
                message: "Restaurant name is required!",
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
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Tag line
          </Text>
          <Controller
            control={control}
            name="tag_line"
            rules={{
              required: {
                value: true,
                message: "Tag is required!",
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
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Address
          </Text>
          <Controller
            control={control}
            name="address"
            rules={{
              required: {
                value: true,
                message: "Address is required!",
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
        </View>

        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Button title="Upload restaurant logo" onPress={pickImage} />
          {restaurant_logo && (
            <Image
              source={{ uri: restaurant_logo }}
              style={{ width: 200, height: 200 }}
            />
          )}
        </View>

        <View style={{ marginBottom: 30, marginHorizontal: 10, marginTop: 10 }}>
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
              Register
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
});
