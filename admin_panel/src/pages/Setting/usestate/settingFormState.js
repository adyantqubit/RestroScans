import { useState } from 'react';

export function useSettingFormState() {
  const [settingData, setSettingData] = useState({});
  const [settingId, setSettingId] = useState(null);
  const [themeList, setThemeList] = useState([]);
  const [appTheme, setAppTheme] = useState(null);
  const [cgst, setCgst] = useState("");
  const [sgst, setSgst] = useState("");
  const [gstin, setGstin] = useState("");
  const [fssaiNumber, setFssaiNumber] = useState("");
  const [allowHalfPrice, setAllowHalfPrice] = useState(false);
  const [allowLoyalityPoints, setAllowLoyalityPoints] = useState(false);
  const [perLoyalityPointValue, setPerLoyalityPointValue] = useState("");
  const [amountForSingleLoyalityPoint, setAmountForSingleLoyalityPoint] =
    useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [discount, setDiscount] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    app_theme: "",
    cgst: "",
    sgst: "",
    gstin: "",
    fssaino: "",
    allow_half_price: "",
    allow_loyality_points: "",
    amount_for_single_loyality_point: "",
    whatsapp_number: "",
  });
  const [singleLoyalityPointValidation, setSingleLoyalityPointValidation] = useState("");
  return {
    settingData,
    setSettingData,
    settingId,
    setSettingId,
    themeList,
    setThemeList,
    appTheme,
    setAppTheme,
    cgst,
    setCgst,
    sgst,
    setSgst,
    gstin,
    setGstin,
    fssaiNumber,
    setFssaiNumber,
    allowHalfPrice,
    setAllowHalfPrice,
    allowLoyalityPoints,
    setAllowLoyalityPoints,
    perLoyalityPointValue,
    setPerLoyalityPointValue,
    amountForSingleLoyalityPoint,
    setAmountForSingleLoyalityPoint,
    whatsappNumber,
    setWhatsappNumber,
    discount,
    setDiscount,
    validationErrors,
    setValidationErrors,
    singleLoyalityPointValidation,
    setSingleLoyalityPointValidation,
  };
}
