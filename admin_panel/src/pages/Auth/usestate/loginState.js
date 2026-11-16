import { useState } from 'react';

export function useLoginState() {
  const [errors, setError] = useState([]);
  const [paswrdEye, setPswdEyeVisible] = useState(true);
  const [isSuccessfull, setSuccessfull] = useState(false);
  return {
    errors,
    setError,
    paswrdEye,
    setPswdEyeVisible,
    isSuccessfull,
    setSuccessfull,
  };
}
