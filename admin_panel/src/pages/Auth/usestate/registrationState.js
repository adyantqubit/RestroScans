import { useState } from 'react';

export function useRegistrationState() {
  const [errors, setError] = useState([]);
  const [paswrdEye,setPswdEyeVisible]=useState(true);
  const [cnfrmPaswrdEye,setCnfrmPswdEyeVisible]=useState(true);
  const [telephoneNumber,setTelephoneNumber]=useState("");
  const [mobileNumber,setMobilePhone]=useState("");
  return {
    errors,
    setError,
    paswrdEye,
    setPswdEyeVisible,
    cnfrmPaswrdEye,
    setCnfrmPswdEyeVisible,
    telephoneNumber,
    setTelephoneNumber,
    mobileNumber,
    setMobilePhone,
  };
}
