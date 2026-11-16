import { useState } from "react";

export function useOtppopupState() {
  const [OTP, setOTP] = useState("");
  const [isLoading, setLoading] = useState(false)
  return { OTP, setOTP, isLoading, setLoading };
}
