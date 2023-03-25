/**
 * Created by - Ashish Dewangan on 24-03-2023
 * Reason - To show splash/welcome screen when app starts
 */

import { View, Text, Image,ImageBackground,Linking  } from "react-native";
import React, { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { getAppSetting } from "../api/Services";
import config from "../config/config";

export default function SplashScreen({ navigation }) {
  const [appSettings, setAppSettings] = useState("");


  useEffect(() => {
    checkUserauth();
    getAppDetails();
  }, []);

  /**
   * Getting logo of adyant from backend and show it on splash screen.
   */
  const getAppDetails = async () => {
    const response = await getAppSetting();
    setAppSettings(response);
  };

  function wait(timeout) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }

  /**
   * This method will check user data exist on secure storage. If exist then show home screen else show login screen
   * It will also wait for 5000 miliseconds, so that we can show splash screen for atleast 5 seconds before moving to next scrren
   */
  const checkUserauth = async () => {
    await wait(5000);
    if (await SecureStore.getItemAsync("userData")) {
      navigation.navigate("DrawerScreens");
    } else {
      navigation.navigate("LoginScreen");
    }
  };

  return (
    <View style={{flex:1}}>
      <ImageBackground
        source={{ uri: config.imageUrl + appSettings.app_logo }} resizeMode="cover" blurRadius={2}
        style={{flex:1,justifyContent:"center",alignItems:"center"}}
      >
        {/* <View  style={{justifyContent:"center",alignItems:"center",padding:10,borderRadius:5}}> */}
          <Text style={{fontSize:30,fontWeight:"bold"}}>{appSettings.title}</Text>
        
          <Image source={{ uri: config.imageUrl + appSettings.adyant_logo }}
          style={{width:300,height:300, 
            
          }}
          ></Image>
        
          <Text  onPress={() => Linking.openURL(appSettings.adyant_webite_link)} style={{fontWeight:"bold",position:"absolute",bottom:10}}>{appSettings.bottom_text}</Text>
        {/* </View> */}
      </ImageBackground>
    </View>
  );
}
