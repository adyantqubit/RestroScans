
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
} from "react-native";

import { useForm, Controller } from "react-hook-form";
// import { Picker } from "@react-native-picker/picker";
import * as SecureStore from "expo-secure-store";
import CustomInput from "../components/inputs/CustomInput";
import { userProfileUpdate } from "../api/ServiceApi";
import { Ionicons } from "@expo/vector-icons";
// import { Country, State, City } from "country-state-city";

// import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { getProfileImageByUser } from "../api/ServiceApi";
import * as siteConfig from "../config/Config";

export default function ProfileScreen() {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState({});
  const [tempDate, setTempDate] = useState(new Date());
  const [image, setImage] = useState(null);
  const [tempPhoto, setTempPhoto] = useState(null);
  const [maxdate, setMaxDate] = useState(new Date());

  //Country state city..state
  //create at mohendra sahu on 08-02-2023..
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const genderData = [
    { lable: "Male", value: "male" },
    { lable: "Female", value: "female" },
    { lable: "Other", value: "other" },
  ];

  //this hook is used to get userData from secure store local storage and set setUserId state  #mohendra sahu
  useEffect(() => {
    SecureStore.getItemAsync("userData")
      .then((res) => {
        const data = JSON.parse(res);
        setUserId(data.id);
        setUserData(data);
        //  console.log(`get profile data: ${JSON.stringify(data)}`);
      })
      .catch((err) => {
        setUserData({});
      });
  }, []);

  const showStates = () => {
    setStates([]);
    setCities([]);
    // setStates(State.getStatesOfCountry(getValues("country")));
    // console.log('stat', states);
  };

  const showCities = () => {
    setCities([]);
    // setCities(City.getCitiesOfState(getValues("country"), getValues("state")));
    // console.log('cit', cities);
  };

  //this method is used to get user profile data through api from backend server  #mohendra sahu
  const getUserData = (id) => {
    try {
      if (id != null) {
        getProfileImageByUser(id)
          .then((res) => {
            // console.log(`get profile data: ${JSON.stringify(res)}`);

            //if response is not null then set user profile data in userData state hook and then display those data  #mohendra sahu
            if (res) {
              // console.log('res.data.userObj[0].image_url: ', res.data.userObj[0].image_url);
              const image_url = res.data?.userObj[0]?.image_url;
              if (image_url) {
                const url = siteConfig.default.imageStartUrl;
                let imgUrl = url + image_url;
                setImage(imgUrl);
              } else {
                setImage(null);
              }

              setTempPhoto(null);
              SecureStore.setItemAsync(
                "userData",
                JSON.stringify(res.data?.userObj[0])
              );

              setUserData(res.data?.userObj[0]);
              // console.log(`res.data.userObj[0]: ${JSON.stringify(res.data?.userObj[0])}`);

              //added by mohendra sahu 09-02-2023
              //show default user city , state, coutry name
              setCountries([]);
              setStates([]);
              setCities([]);
              // setCountries(Country.getAllCountries());
              // setStates(
              //   State.getStatesOfCountry(res.data?.userObj[0]?.country)
              // );
              // setCities(
              //   City.getCitiesOfState(
              //     res.data?.userObj[0]?.country,
              //     res.data?.userObj[0]?.state
              //   )
              // );
              // console.log('coutyr', Country.getAllCountries())
            }
          })
          .catch((err) => null);
      }
    } catch {
      (err1) => {
        // console.log(`err1: ${err1}`);
      };
    }
  };

  // when userId state is changed the this hook will render and call getUserData Method #mohendra sahu
  useEffect(() => {
    getUserData(userId);
  }, [userId]);

  // create form using react-hook-form #mohendra sahu
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      gender: userData.gender,
      dateOfBirth: new Date(),
      email: userData.email,
      contactNumber: userData.contactNumber,
      country: userData.country,
      state: userData.state,
      city: userData.city,
    },
  });

  // when userData state is changed then reset useform state data.. #mohendra sahu
  useEffect(() => {
    delete userData?.password;
    reset(userData);
  }, [userData]);

  // this method is used to call userProfileUpdate api #mohendra sahu
  const onSubmit = (formValues) => {
    //create form data object because send image data #mohendra sahu
    const formData = new FormData();

    //if user select image for edit or upload image then if block execute then append image details in formdata  #mohendra sahu
    if (tempPhoto !== null) {
      const ext = tempPhoto.uri.substring(tempPhoto.uri.lastIndexOf(".") + 1);
      const fileName = tempPhoto.uri.replace(/^.*[\\\/]/, "");

      formData.append("image_url", {
        uri: tempPhoto.uri,
        name: fileName,
        type: `image/${ext}`,
      });
    }

    formData.append("firstName", formValues.firstName);
    formData.append("lastName", formValues.lastName);
    formData.append("gender", formValues.gender);
    formData.append("dateOfBirth", formValues.dateOfBirth);
    formData.append("email", formValues.email);
    formData.append("contactNumber", formValues.contactNumber);
    formData.append("country", formValues.country);
    formData.append("state", formValues.state);
    formData.append("city", formValues.city);

    // console.log(`form values ${JSON.stringify(formValues)}`);
    // console.log(`form data ${JSON.stringify(formData)}`);

    // call userProfileUpdate service api for update user details #mohendra sahu
    userProfileUpdate(formData, userId)
      .then((res) => {
        getUserData(userId);
        // console.log(`res json.str ${JSON.stringify(res)}`);

        Alert.alert("User Profile", `${res?.data?.msg}`, [
          { text: "OK", onPress: () => null },
        ]);
        // getUserData(userData.id);
      })
      .catch((err) => null);
  };

  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  // this method is called when user click upload / edit profile image button  #mohendra sahu
  const pickImage = async () => {
    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setTempPhoto(result.assets[0]);
      }
    } catch {
      (pick_err) => {
        // console.log(pick_err);
      };
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View >
        {image && (
          <View
            style={{
              height: 200,
              // borderWidth: 1,
              // backgroundColor: '#9d9fa6',

              marginVertical: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                // marginVertical: 5,
                height: 150,
                width: 200,
                // borderWidth: 1,
                // borderRadius: "50%",
                // borderColor: "red",
                // margin: 10,
              }}
            >
              <Image
                source={{ uri: image }}
                style={{
                  // margin: 20,
                  height: 150,
                  width: 200,
                  borderRadius: 5,
                }}
                resizeMode="contain"
              />
            </View>
          </View>
        )}

        <View style={styles.imagePickerContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            <Ionicons name="image" size={24} color="#5260ff" />
            <Text
              style={{
                fontSize: 16,
                marginLeft: 10,
                fontWeight: "500",
                color: "#5260ff",
              }}
            >
              {image ? "Edit Profile Picture" : "Upload Profile Picture"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            First Name
          </Text>
          <CustomInput
            label="Enter First Name"
            control={control}
            secureTextEntry={false}
            placeholder="Enter your first name"
            name="firstName"
            editable={true}
            keyboardType="default"
            rules={{
              required: {
                value: true,
                message: "First Name is required!",
              },
              pattern: {
                value: /^(?!\s+$).*/,
                message: "First Name cannot contain only blankspaces!",
              },
            }}
          />
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Last Name
          </Text>
          <CustomInput
            label="Enter Last Name"
            control={control}
            secureTextEntry={false}
            placeholder="Enter your last name"
            name="lastName"
            editable={true}
            keyboardType="default"
            rules={{
              required: {
                value: true,
                message: "Last Name is required!",
              },
              pattern: {
                value: /^(?!\s+$).*/,
                message: "Last Name cannot contain only blankspaces!",
              },
            }}
          />
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Gender
          </Text>
          <Controller
            control={control}
            name="gender"
            rules={{
              required: {
                value: true,
                message: "Gender is required!",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={value}
                    name="gender"
                    onBlur={onBlur}
                    onValueChange={onChange}
                    value
                    style={styles.picker}
                    mode="dropdown" // Android only
                  >
                    {genderData.map((item) => (
                      <Picker.Item
                        styel={styles.dropdownText}
                        key={item.value}
                        label={item.lable}
                        value={item.value}
                        // placeholderTextColor="#A4A4A4"
                      />
                    ))}
                  </Picker>
                </View>
                {errors.gender && (
                  <Text style={styles.textdanger}>{errors.gender}</Text>
                )}
              </>
            )}
          />
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Date of Birth
          </Text>
          <Controller
            control={control}
            name="dateOfBirth"
            rules={{
              required: {
                value: true,
                message: "Date of Birth is required!",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <View style={styles.passContainer}>
                  <Text style={styles.inputPassword}>
                    {convert(getValues("dateOfBirth"))}
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      DateTimePickerAndroid.open({
                        value: tempDate,
                        onChange: (event, selectedDate) => {
                          setValue("dateOfBirth", convert(selectedDate));
                        },
                        mode: "date",
                        is24Hour: true,
                        maximumDate: maxdate,
                      });
                    }}
                  >
                    <Ionicons
                      name="calendar"
                      size={24}
                      color="black"
                      style={styles.passIcon}
                    />
                  </TouchableOpacity>
                </View>
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
            render={({ field: { value } }) => (
              <>
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder={value}
                    autoCapitalize="none"
                    // secureTextEntry={secureTextEntry}
                    placeholderTextColor="#A4A4A4"
                    editable={false}
                  />
                </View>
              </>
            )}
          />
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Contact Number
          </Text>
          <CustomInput
            label="Enter Contact Number"
            control={control}
            secureTextEntry={false}
            placeholder="Enter your cantact number"
            name="contactNumber"
            editable={true}
            keyboardType="number-pad"
            rules={{
              required: {
                value: true,
                message: "Contact Number is required!",
              },
              pattern: {
                value: /^[6789]\d{9}$/,
                message: "Please enter valid contact number!",
              },
            }}
          />
        </View>

        {/* <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            Country
          </Text>
          <Controller
            control={control}
            name="country"
            rules={{
              required: {
                value: true,
                message: "Country is required!",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={value}
                    name="country"
                    onBlur={onBlur}
                    onValueChange={(val) => {
                      setValue("country", val);
                      showStates();
                    }}
                    value
                    style={styles.picker}
                    mode="dropdown" // Android only
                  >
                    {countries.map((country) => (
                      <Picker.Item
                        styel={styles.dropdownText}
                        key={country.isoCode}
                        label={country.name}
                        value={country.isoCode}
                      />
                    ))}
                  </Picker>
                </View>
                {errors.country && (
                  <Text style={styles.textdanger}>{errors.country}</Text>
                )}
              </>
            )}
          />
        </View> */}

        {/* <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            State
          </Text>
          <Controller
            control={control}
            name="state"
            rules={{
              required: {
                value: true,
                message: "State is required!",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={value}
                    name="state"
                    onBlur={(e) => {
                      e.persist();
                      showStates();
                      onBlur(e);
                    }}
                    onValueChange={(val) => {
                      setValue("state", val);
                      showCities();
                    }}
                    value
                    style={styles.picker}
                    mode="dropdown" // Android only
                  >
                    {states.map((state) => (
                      <Picker.Item
                        styel={styles.dropdownText}
                        key={state.isoCode}
                        label={state.name}
                        value={state.isoCode}
                        // placeholderTextColor="#A4A4A4"
                      />
                    ))}
                  </Picker>
                </View>
                {errors.state && (
                  <Text style={styles.textdanger}>{errors.state}</Text>
                )}
              </>
            )}
          />
        </View> */}

        {/* <View style={{ marginTop: 5 }}>
          <Text style={styles.labels}>
            <Text style={{ color: "red", fontWeight: "650" }}>* </Text>
            City
          </Text>
          <Controller
            control={control}
            name="city"
            rules={{
              required: {
                value: true,
                message: "City is required!",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={value}
                    name="city"
                    value
                    onBlur={(e) => {
                      e.persist();
                      showCities();
                      onBlur(e);
                    }}
                    onValueChange={onChange}
                    style={styles.picker}
                    mode="dropdown" // Android only
                  >
                    {cities.map((city) => (
                      <Picker.Item
                        styel={styles.dropdownText}
                        key={city.name}
                        label={city.name}
                        value={city.name}
                      />
                    ))}
                  </Picker>
                </View>
                {errors.city && (
                  <Text style={styles.textdanger}>{errors.city}</Text>
                )}
              </>
            )}
          />
        </View> */}

        <View style={{ marginBottom: 30, marginHorizontal: 10, marginTop: 10 }}>
          <Pressable
            onPress={handleSubmit(onSubmit)}
            // disabled={!isValid}
            style={{
              backgroundColor: "#6823cf",
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
    // alignItems: "center",
    // justifyContent: "center",
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
    // alignSelf: "center",
    // alignItems: "center",
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
    // marginVertical: 20,
    // width: "100%",
    // marginLeft: 10,
    // marginRight: 5,
    padding: 5,

    // color: "#A4A4A4",

    borderWidth: 0,
    // justifyContent: "center",
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
    // height: 40,
    // margin: 12,
    // borderWidth: 1,
    paddingTop: 10,
    paddingLeft: 8,
    paddingBottom: 10,
    paddingRight: 10,
    fontSize: 15,
    borderRadius: 3,
    // borderWidth: 1,
    flex: 1,
  },
  passIcon: {
    margin: 5,
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  imagePickerContainer: {
    // borderWidth: 1,
    // flexDirection: 'row',
    // borderColor:'blue',
    margin: 15,
    // width: 200,
    marginTop: 20,
  },
  imagePicker: {
    margin: 5,
    alignItems: "center",
    // backgroundColor: "#5260ff",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#5260ff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
