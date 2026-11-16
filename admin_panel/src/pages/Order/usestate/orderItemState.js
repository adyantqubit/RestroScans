import { storedPerPage } from '../../../utils/pagination';
import { useState } from 'react';

export function useOrderItemState() {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [dateValidation, setDateValidation] = useState(false);
  const [allowFilter, setAllowFilter] = useState(false);
  const [allDateFilter, setAllDateFilter] = useState(false);
  const [backendOrderItemCount, setOrderItemCount] = useState(0);
  const [orderItems, setOrderItems] = useState([]);
  const [listPerPage, setListPerPage] = useState(storedPerPage());
  const [columnToSort, setColumnToSort] = useState("order_id");
  const [columnSortingOrder, setColumnSortingOrder] = useState("descending");
  const [showSortingIcon, setShowSortingIcon] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  return {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    dateValidation,
    setDateValidation,
    allowFilter,
    setAllowFilter,
    allDateFilter,
    setAllDateFilter,
    backendOrderItemCount,
    setOrderItemCount,
    orderItems,
    setOrderItems,
    listPerPage,
    setListPerPage,
    columnToSort,
    setColumnToSort,
    columnSortingOrder,
    setColumnSortingOrder,
    showSortingIcon,
    setShowSortingIcon,
    currentPage,
    setCurrentPage,
    searchText,
    setSearchText,
  };
}
