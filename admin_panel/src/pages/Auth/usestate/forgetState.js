import { useState } from 'react';

export function useForgetState() {
  const [errors, setError] = useState([]);
  const [email,setEmail]=useState("");
  const [paswrdEye,setPswdEyeVisible]=useState(true);
  const [cnfrmPaswrdEye,setCnfrmPswdEyeVisible]=useState(true);
  const [isSuccessfull,setSuccessfull]=useState(false);
  const [isDisableForm,setDisableForm]=useState(true);
  const [isDisableBtn,setDisablebtn]=useState(false);
  return {
    errors,
    setError,
    email,
    setEmail,
    paswrdEye,
    setPswdEyeVisible,
    cnfrmPaswrdEye,
    setCnfrmPswdEyeVisible,
    isSuccessfull,
    setSuccessfull,
    isDisableForm,
    setDisableForm,
    isDisableBtn,
    setDisablebtn,
  };
}
