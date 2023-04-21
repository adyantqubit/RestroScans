import React, { useEffect } from "react";
import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { getMenuList, getSettingApi } from "../api/Services";

export const AppStateContext = React.createContext();

export const AppStateProvider = ({ children }) => {
  var [render, setRender] = useState(false);
  // Added by Om on 15-04-23
  // Reason : Get the item listing data
  var [offerItemId, setOfferItemId] = useState([]);

  // useEffect(()=>{
  //   getSettingData();
  // },[])

  useEffect(() => {
    getItemId();
  }, []);
  // End of addition
  // -------------- This function is used to getting app configuaration -------------
  var [settings, setSettings] = useState([]);
  const getSettingData = async () => {
    // if (await SecureStore.getItemAsync("tenantInfo")) {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    var response = await getSettingApi(tenant);
    if (response) {
      setSettings(response);
    }
  // }
  };
  // ------------------ End getting app configuaration ----------------------------

  // Added by Om on 14-04-23
  // Reason : To get offer Item id in banner listing page for updating
  // const getOfferItem = async () => {
  //   var tenantInfo = await SecureStore.getItemAsync("tenantInfo");
  //   const response = await getMenuList(JSON.parse(tenantInfo).tenant_name);
  const getItemId = async () => {
  	// Added by Yuvraj Sahu on 20-4-2023
  	// Reason - if user loged then call function otherwise not to be call
    if (await SecureStore.getItemAsync("tenantInfo")) {
      var tenant = JSON.parse(
        await SecureStore.getItemAsync("tenantInfo")
      ).tenant_name;
      var response = await getMenuList(tenant);
      if (response.itemList) {
        setOfferItemId(response);
      }
    }
    // End of addition
  };

  // End of addition

  return (
    // Added by Om on 14-04-23
    // Reason : For get the item id
    <AppStateContext.Provider
      value={{
        render,
        setRender,
        settings,
        getSettingData,
        offerItemId,
        setOfferItemId,
      }}
    >
      {/* End of addition */}
      {children}
    </AppStateContext.Provider>
  );
};
