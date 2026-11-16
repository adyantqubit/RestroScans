import { useState } from 'react';

export function useWaiterFormState() {
  const [errortext, setErrorText] = useState({});
  const [formData, setFormData] = useState({
        "id": null,
        "name": "",
        "contact_number": "",
        "password": "",
        "is_active": true,
    });
  return {
    errortext,
    setErrorText,
    formData,
    setFormData,
  };
}
