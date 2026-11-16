import { useState } from 'react';

export function useContextState() {
  const [showOfferForm,setShowOfferForm] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showOfferItemForm,setShowOfferItemForm] = useState(false);
  const [disabledItemForm, setDisabledItemForm] = useState(false);
  return {
    showOfferForm,
    setShowOfferForm,
    disabled,
    setDisabled,
    showOfferItemForm,
    setShowOfferItemForm,
    disabledItemForm,
    setDisabledItemForm,
  };
}
