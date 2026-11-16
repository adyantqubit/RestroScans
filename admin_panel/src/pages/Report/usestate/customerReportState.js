import { storedPerPage } from '../../../utils/pagination';
import { useState } from 'react';

export function useCustomerReportState() {
  const [searchText, setSearchText] = useState("");
  const [value, onChange] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [showSortingIcon, setShowSortingIcon] = useState(false);
  const [columnToSort, setColumnToSort] = useState("last_customer_name");
  const [columnSortingOrder, setColumnSortingOrder] = useState("ascending");
  const [listPerPage, setListPerPage] = useState(
    storedPerPage()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [backendReportCount, setBackendReportCount] = useState(0);
  const [customerReportDetails, setCustomerReportDetails] = useState(null);
  return {
    searchText,
    setSearchText,
    value,
    onChange,
    pageIndex,
    setPageIndex,
    showSortingIcon,
    setShowSortingIcon,
    columnToSort,
    setColumnToSort,
    columnSortingOrder,
    setColumnSortingOrder,
    listPerPage,
    setListPerPage,
    currentPage,
    setCurrentPage,
    backendReportCount,
    setBackendReportCount,
    customerReportDetails,
    setCustomerReportDetails,
  };
}
