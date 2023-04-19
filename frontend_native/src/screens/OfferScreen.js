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
import { useIsFocused } from "@react-navigation/native";
import Footer from '../../src/components/Footer/Footer'

export default function MenuListScreen({ navigation }) {
  var {render, setRender} = useContext(AppStateContext)
  const isFocused = useIsFocused()

  // useEffect(() => {
  //   getAllOffers();
  // }, [render]);

  useEffect(() => {
    getAllOffers();
  }, [isFocused]);

  // Set the banner name and banner items name in this state
  var [bannerList, setBannerList] = useState([]);
  var [bannerItemList, setBannerItemList] = useState([]);

  // GET all banner data in this method
  const getAllOffers = async () => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    // console.log(tenant)
    const response = await getAllOfferList(tenant);
    if (response) {
      setBannerList(response.offerBanner);
      setBannerItemList(response.offerItemList);
      // setItemList(response.itemList);
    }

  };
  // console.log(bannerList)
  // console.log(bannerItemList)

// After click the banner items than all details set in this function then navigate the next screen
  function onOfferClick(offerName,bannerId) {
    var bannerName = bannerList.filter((dt) => dt.offer_name == offerName);
    var offerList = bannerItemList.filter((e) => e.offer_name == offerName);
    navigation.navigate("OfferItemsScreen", {
      bannerName: bannerName,
      offerList: offerList,
      offerName:offerName,
      bannerList:bannerList,
      bannerItemList:bannerItemList,
      bannerId:bannerId
  });
  // alert(JSON.stringify(bannerId))
  // alert(JSON.stringify(bannerItemList))
  // alert(JSON.stringify(offerName))
  // alert(JSON.stringify(offerList))

  }
 
  return (
    <View style={{  height: "100%" }}>
      <ScrollView>
        <View style={styles.menuContainer}>
          {bannerList.length > 0 ? (
            <>
              {bannerList.map((bannerData, id) => (
                <Pressable
                  style={styles.menuPress}
                  onPress={(e) => onOfferClick( bannerData.offer_name,bannerData.id)}
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
            <View style={{flex:1,justifyContent: "center",alignItems: "center",height:600}}>
              <Image source={require('../../assets/No_offer.jpg')}  style={styles.tinyLogo}/>

            <Text style={{fontSize:14,marginTop:22,fontWeight:'bold'}}>Currently no banner/offer are listed</Text>
       </View>
          )}
        </View>
        
      </ScrollView>
      {/* Added by Om on 18-04-23 For showing the footer*/}
      <Footer/>
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
});
