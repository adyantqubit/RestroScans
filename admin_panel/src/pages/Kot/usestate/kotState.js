import { useState } from 'react';

export const initialKotState = {
  loading: false,
  error: '',
};

export function useKotState() {
  const [kotData, setKot] = useState(null);
  return {
    kotData,
    setKot,
  };
}
