import { useState } from 'react';

export const initialBillingState = {
  loading: false,
  error: '',
};

export function useBillingState() {
  const [billingData, setBillingData] = useState(null);
  return {
    billingData,
    setBillingData,
  };
}
