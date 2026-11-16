import { useState } from "react";

export function useBillingState() {
  const [billingData, setBillingData] = useState(null)
  const [isLoading, setLoading] = useState(false)
  return { billingData, setBillingData, isLoading, setLoading };
}
