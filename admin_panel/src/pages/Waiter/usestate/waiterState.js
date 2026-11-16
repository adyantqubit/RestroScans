import { useState } from 'react';

export const initialWaiterState = {
  loading: false,
  error: '',
};

export function useWaiterState() {
  const [columnSortingOrder, setColumnSortingOrder] = useState(true);
  const [waiterList,setWaiterList]=useState([]);
  const [IsModalOpen, setModelVisiblity] = useState(false);
  const [selectedWaiter,setSelectedWaiter]=useState(null);
  return {
    columnSortingOrder,
    setColumnSortingOrder,
    waiterList,
    setWaiterList,
    IsModalOpen,
    setModelVisiblity,
    selectedWaiter,
    setSelectedWaiter,
  };
}
