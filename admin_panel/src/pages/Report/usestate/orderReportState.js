import { useState } from 'react';

export function useOrderReportState() {
  const [fromDate, onChangeFrom] = useState(new Date());
  const [toDate, onChangeTo] = useState(new Date());
  const [isAmountSort, setAmountSort] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [order, setOrder] = useState(null);
  return {
    fromDate,
    onChangeFrom,
    toDate,
    onChangeTo,
    isAmountSort,
    setAmountSort,
    pageIndex,
    setPageIndex,
    order,
    setOrder,
  };
}
