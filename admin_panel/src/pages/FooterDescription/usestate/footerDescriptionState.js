import { useState } from 'react';

export const initialFooterDescriptionState = {
  loading: false,
  error: '',
};

export function useFooterDescriptionState() {
  const [inputText, setInputText] = useState("");
  const [footerDescriptionDetails, setFooterDescriptionDetails] = useState({});
  return {
    inputText,
    setInputText,
    footerDescriptionDetails,
    setFooterDescriptionDetails,
  };
}
