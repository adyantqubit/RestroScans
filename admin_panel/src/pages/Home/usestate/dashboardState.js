import { useState } from 'react';

export function useDashboardState() {
  const [IsOrderPopupVisible, setOrderPopupvisible] = useState(false);
  const [recall, setRecall] = useState([]);
  return {
    IsOrderPopupVisible,
    setOrderPopupvisible,
    recall,
    setRecall,
  };
}
