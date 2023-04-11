
// Guided by Ashish sir on 11-04-23
import React, { useState, useEffect } from "react";
import { View, Text,TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import * as SecureStore from "expo-secure-store";


  export default function PreviewMenuScreen({ navigation, route }) {

    useEffect(() => {
      getTenant();
  }, []);


  var [tenant, setTenant] = useState("");
  const getTenant = async () => {
      var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
      setTenant(JSON.parse(tenantInfo).tenant_name);
  };

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex:1 }} >
        {/* <WebView  source={{ uri: "https://diyacafe.restroscans.com/diyacafe/home" }} /> */}
          {/* <WebView  source={{ uri: `https://${tenant}.restroscans.com/${tenant}/home` }} /> */}
          <WebView  source={{ uri: `192.168.215.45:3000/${tenant}/home` }} />

        </View>
        </View>
  
      
    );
  }