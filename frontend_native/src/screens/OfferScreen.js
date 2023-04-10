import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { getAllOfferList, } from "../api/Services";
import { colors } from "../Colours/globalColor";
import config from "../config/config";
import * as SecureStore from "expo-secure-store";
import { useContext } from "react";
import { AppStateContext } from "../context/AppStateProvider";

export default function MenuListScreen({ navigation }) {
  var {render, setRender} = useContext(AppStateContext)
  useEffect(() => {
    getAllOffers();
  }, [render]);

  // Set the banner name and banner items name in this state
  var [bannerList, setBannerList] = useState([]);
  var [bannerItemList, setBannerItemList] = useState([]);

  // GET all banner data in this method
  const getAllOffers = async () => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    console.log(tenant)
    const response = await getAllOfferList(tenant);
    if (response) {
      setBannerList(response.offerBanner);
      setBannerItemList(response.offerItemList);
      // setItemList(response.itemList);
    }

  };
  console.log(bannerList)
  console.log(bannerItemList)

// After click the banner items than all details set in this function then navigate the next screen
  function onOfferClick(offerName) {
    var bannerName = bannerList.filter((dt) => dt.offer_name == offerName);
    var offerList = bannerItemList.filter((e) => e.offer_name == offerName);
    navigation.navigate("OfferItemsScreen", {
      bannerName: bannerName,
      offerList: offerList,
      offerName:offerName,
      bannerList:bannerList,
      bannerItemList:bannerItemList
  });

  }
 
  return (
    <View style={{ backgroundColor: colors.backgroundTheme, height: "100%" }}>
      <ScrollView>
        <View style={styles.menuContainer}>
          {bannerList.length > 0 ? (
            <>
              {bannerList.map((bannerData, id) => (
                <Pressable
                  style={styles.menuPress}
                  onPress={(e) => onOfferClick( bannerData.offer_name)}
                  key={id}
                >
                  <Image
                    source={{
                      uri: config.staticBaseURL + bannerData.offer_image,
                    }}
                    style={styles.menuIcon}
                  />
                  <Text style={styles.btnText} 
                  value={bannerData.id}
                  >
                    {bannerData.offer_name}
                  </Text>
                 
                </Pressable>
              ))}
            </>
          ) : (
            <Text>Currently no banners are listed</Text>
          )}
        </View>
        
      </ScrollView>
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
 
});
