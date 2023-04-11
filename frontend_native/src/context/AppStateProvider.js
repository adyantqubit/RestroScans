import React, { useEffect } from 'react';
import { useState } from 'react';
import * as SecureStore from "expo-secure-store";
import { getSettingApi } from '../api/Services';

export const AppStateContext = React.createContext();

export const AppStateProvider = ({children}) => {

  var [render ,setRender] = useState(false)

  // useEffect(()=>{
  //   getSettingData();
  // },[])

  // -------------- This function is used to getting app configuaration -------------
  var [settings, setSettings] = useState([]);
  const getSettingData = async () => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    var response = await getSettingApi(tenant)
    if (response) {
      setSettings(response)
    }
  }
  // ------------------ End getting app configuaration ----------------------------

  return (
    <AppStateContext.Provider value={{render, setRender, settings, getSettingData}}>
      {children}
    </AppStateContext.Provider>
  );
};