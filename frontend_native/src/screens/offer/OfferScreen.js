import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  TextInput
} from "react-native";
import { getAllOfferList } from "../../api/Services";
import config from "../../config/config";
import * as SecureStore from "expo-secure-store";
import { useIsFocused } from "@react-navigation/native";
import Footer from "../../components/Footer/Footer";
import { inputs } from "../../Colours/globalColor";

export default function MenuListScreen({ navigation }) {
  const isFocused = useIsFocused();

  useEffect(() => {
    getAllOffers();
    /**
     * Added by Yuvraj Sahu on 21-05-2023
     * Reason - to clear the state
     */
    setSearch("");
    /**
     * End of addition by Yuvraj Sahu on 21-05-2023
     */
  }, [isFocused]);

  // Set the banner name and banner items name in this state
  var [bannerList, setBannerList] = useState([]);

  /**
   * Added by Yuvraj Sahu on 21-05-2023
   * Reason - to set searched objects and search keyword
   */
  var [seeMenus, setSeeMenus] = useState([]);
  var [search, setSearch] = useState("");
  /**
   * End of addition by Yuvraj Sahu on 21-05-2023
   */

  // GET all banner data in this method
  const getAllOffers = async () => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    const response = await getAllOfferList(tenant);
    if (response) {
      setBannerList(response.offerBanner);
      /**
       * Added by Yuvraj Sahu on 21-05-2023
       * Reson - to set value for search
       */
      setSeeMenus(response.offerBanner);
      /**
       * End of addition by Yuvraj Sahu on 21-05-2023
       */
    }
  };

  // After click the banner items than all details set in this function then navigate the next screen
  function onOfferClick(bannerId) {
    var filteredBannerList = bannerList.filter((dt) => dt.id == bannerId);
    navigation.navigate("OfferItemsScreen", {
      banner: filteredBannerList[0],
      bannerId: bannerId,
    });
  }

  /**
   * Added by Yuvraj Sahu on 21-05-2023
   * Reason - to search menu using name wise
   */
  const handleSearch = (searchKey) => {
    // Commeted and modified by Yuvraj Sahu on 04-06-2023
    // Reason - to trim searched word from start and end
    // var splitedWord = searchKey.trimStart().replace(".", " ").split(" ");
    var splitedWord = searchKey.trim().replace(".", " ").split(" ");
    // End of trimming word by Yuvraj Sahu on 04-06-2023
    var sapratedWord = splitedWord.reverse().join().replace(",", " ");
    setSearch(searchKey.replace(".", " "));
    if (searchKey == "") {
      setSeeMenus(bannerList);
    } else {
      var searchedMenus = bannerList.filter(
        (dt) =>
          dt.offer_name.toLowerCase().includes(searchKey.toLowerCase()) || // search by word (left-right)
          dt.offer_name.toLowerCase().includes(sapratedWord.toLowerCase()) || // search word with space and reverse
          splitedWord.includes(dt.offer_name.toLowerCase()) // search for multiple object
      );
      setSeeMenus(searchedMenus);
    }
  };
  /**
   * End of addition by Yuvraj Sahu on 21-05-2023
   */

  return (
    <View style={{ height: "100%" }}>
      {/* Added by Yuvraj Sahu on 27-4-2023
    Reason - to click at one time on button when cursor stays on input */}
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* End of addition - button click */}
        {/* Added by Yuvraj Sahu on 21-05-2023
          Reason - to give search functionality */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(e) => handleSearch(e)}
              value={search}
              placeholderTextColor="#A4A4A4"
              placeholder="Search by offer/banner name"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {/* End given search functionality by Yuvraj Sahu on 21-05-2023 */}

        <View style={styles.menuContainer}>
          {seeMenus.length > 0 ? (
            <>
              {seeMenus.map((bannerData, id) => (
                <Pressable
                  style={styles.menuPress}
                  onPress={(e) => onOfferClick(bannerData.id)}
                  key={id}
                >
                  <Image
                    source={{
                      uri: config.staticBaseURL + bannerData.offer_image,
                    }}
                    style={styles.menuIcon}
                  />
                  <Text style={styles.btnText} value={bannerData.id}>
                    {bannerData.offer_name}
                  </Text>
                </Pressable>
              ))}
            </>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                height: 600,
              }}
            >
              {/* <Image
                source={require("../../../assets/Welcome.jpg")} // Change the image by Om on 24-04-23
                style={styles.tinyLogo}
              /> */}

              <Text style={{ fontSize: 14, marginTop: 22, fontWeight: "bold" }}>
                No offer/banner are present
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      {/* Added by Om on 18-04-23 For showing the footer*/}
      <Footer />
      {/* End of addition */}
    </View>
  );
}

const styles = StyleSheet.create({
  menuPress: {
    backgroundColor: "white",
    margin: 8,
    padding: 10,
    borderRadius: 5,
    height: 130,
    width: "45%",
    alignItems: "center",
  },
  btnText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 13,
  },

  menuContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    flexWrap: "wrap",
    alignContent: "stretch",
  },

  menuIcon: {
    height: "80%",
    width: "100%",
    borderRadius: 5,
  },
  tinyLogo: {
    width: 390,
    height: 150,
  },
  /**
   * Modified by yuvraj Sahu on 21-05-2023
   * Reason - to design search field
   */
  input: {
    height: inputs.inputBoxHeight,
    margin: 12,
    borderWidth: 1,
    paddingHorizontal: 20,
    marginTop: 0,
    fontSize: 16,
    borderRadius: 25,
  },
  searchContainer: {
    marginTop: 10,
  },

});
