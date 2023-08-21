/**
 * Created by - Pratap Sahu on 18-08-2023
 * Reason - To have Footer Description details section on Native Site
 */
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import {
  getFooterDescriptionApi,
  saveFooterDescriptionApi,
} from "../api/Services";
import * as SecureStore from "expo-secure-store";
import { useIsFocused } from "@react-navigation/native";
import { Formik } from "formik";
import { colors } from "../Colours/globalColor";

export default function FooterDescriptionScreen() {
  
  const isFocused = useIsFocused();

  //    This is added for input on Content-text-field
  var [inputText, setInputText] = useState({ content: "" });
  var [footerDescriptionDetails, setFooterDescriptionDetails] = useState({});

  // Added by Pratap sahu  Date:20-08-2023
  // Reason: To rendering the saved Footer description Details on Input Field.
  var formRef = useRef(null);

  useEffect(() => {

    formRef.current.setErrors({});
    formRef.current.resetForm({});

    getFooterDescription();
    // setFooterDescriptionDetails({content:""});
  }, [isFocused]);

  /**
   * Added by - Pratap sahu on 19-08-2023
   * Reason - created api to get Footer Description Details
   */
  const getFooterDescription = async () => {
    if (await SecureStore.getItemAsync("tenantInfo")) {
      var tenant = JSON.parse(
        await SecureStore.getItemAsync("tenantInfo")
      ).tenant_name;
      var response = await getFooterDescriptionApi(tenant);
      if (response.descriptionList.length > 0) {
        setFooterDescriptionDetails(response.descriptionList[0]);
        setInputText({
          content:
            response.descriptionList[0].content != undefined
              ? response.descriptionList[0].content
              : "",
        });
      } else {
        setInputText({
          content: "",
        });
      }
    }
  };

  /**
   * Added by - Pratap sahu on 19-08-2023
   * Reason - created api to save the Footer Description Details
   */
  const saveFooterDescription = async (values) => {
    const tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    var footerData = { content: values.content };

    if (footerDescriptionDetails.id != undefined) {
      footerData["id"] = footerDescriptionDetails.id;
    }
    var response = await saveFooterDescriptionApi(tenant, footerData);
    console.log(response);
    if (response) {
      // Message("Footer saved successfully.", "success");
      Alert.alert("Footer saved successfully");
    } else {
      // Message("Something went wrong", "error");
      Alert.alert("Something went wrong");
    }
  };



  return (
    <>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Formik
            innerRef={formRef}
            enableReinitialize={true}
            initialValues={inputText}
            onSubmit={saveFooterDescription}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              touched,
              errors,
            }) => (
              <View>
                  <Text style={styles.labels}>Content</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("content")}
                    onBlur={handleBlur("content")}
                    value={values.content}
                    placeholderTextColor="#A4A4A4"
                    placeholder="Enter Footer Description.."
                    autoCapitalize={true}
                    autoCorrect={false}
                    multiline={true}

                  />
                  {errors.content && touched.content && (
                    <Text style={styles.textdanger}></Text>
                  )}

                <View
                  style={{
                    marginBottom: 30,
                    marginHorizontal: 10,
                    marginTop: 10,
                    borderRadius: 3,
                    width: "93%",
                  }}>
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
                    }}>
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: 16,
                        fontWeight: "bold",
                      }}>
                      Save
                    </Text>
                  </Pressable>
                </View>

              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
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
    marginBottom:10,
  },
  labels: {
    paddingHorizontal: 10,
    marginBottom:5,
    fontSize:15,
  },
  input: {
    borderRadius: 12,
    width: "100%",
    borderWidth: 1,
    // minHeight: 60,
    alignSelf: "flex-end",
    backgroundColor: "white",
    paddingHorizontal: 5,
    paddingVertical: 5, 
    alignContent:"flex-end"
  },

  textdanger: {
    color: "#dc3545",
    marginBottom: 10,
    paddingHorizontal: 10,
    marginTop: -10,
  },
});
