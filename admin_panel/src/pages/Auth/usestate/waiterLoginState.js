import { useState } from 'react';

export function useWaiterLoginState() {
  const [errorText, setError] = useState([]);
  const [paswrdEye, setPswdEyeVisible] = useState(true);
  const [formData, setFormData] = useState({
        "contact_number": "",
        "password": "",
        "tenant": "",
    }
    );
  return {
    errorText,
    setError,
    paswrdEye,
    setPswdEyeVisible,
    formData,
    setFormData,
  };
}
