
// Guided by Ashish sir on 11-04-23
import React, { useState, useEffect, useRef } from "react";
import { View, Text,TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import * as SecureStore from "expo-secure-store";
import { useContext } from "react";
import { AppStateContext } from "../context/AppStateProvider";
import { useIsFocused } from "@react-navigation/native";

  export default function PreviewMenuScreen({ navigation, route }) {
    var { render, setRender } = useContext(AppStateContext)
     /**
       * Added by - Ashish Dewangan on 15-04-2023
       * Reason - to reload webview when visiting preview menu screen
       */
    let WebViewRef;
    /**
       * End of code addition of reloading webview on 15-04-2023
       */
    const isFocused = useIsFocused();


    useEffect(() => {
      getTenant();
      /**
       * Added by - Ashish Dewangan on 15-04-2023
       * Reason - to reload webview when visiting preview menu screen
       */
      WebViewRef.reload();
      /**
       * End of code addition of reloading webview on 15-04-2023
       */
    }, [render, isFocused]);


  var [tenant, setTenant] = useState("");
  const getTenant = async () => {
      var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
      setTenant(JSON.parse(tenantInfo).tenant_name);
  };

  
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex:1 }} >
          {/** Modified by Ashish Dewangan on 15-04-2023
           * Reason - To reload webview when we visit preview screen
           */}
           {/* <WebView  source={{ uri: `192.168.1.21:3000/${tenant}/home` }} /> */}
          <WebView ref={WEBVIEW_REF => (WebViewRef = WEBVIEW_REF)}  source={{ uri: `192.168.1.16:3000/${tenant}/home` }} />
          {/* End of code modification of webview reload on 15-04-2023 */}
        </View>
        </View>
    );
  }