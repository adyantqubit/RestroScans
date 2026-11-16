import { useState } from 'react';

export const initialSettingState = {
  loading: false,
  error: '',
};

export function useSettingState() {
  const [settingData, setSettingData] = useState(null);
  const [appTheme, setAppTheme] = useState(null);
  const [showLoader, setShowLoader] = useState(true);
  return {
    settingData,
    setSettingData,
    appTheme,
    setAppTheme,
    showLoader,
    setShowLoader,
  };
}
