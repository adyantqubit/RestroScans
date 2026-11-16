import { storedPerPage } from '../../../utils/pagination';
import { useState } from 'react';

export const initialCustomerDetailState = {
  loading: false,
  error: '',
};

export function useCustomerDetailState() {
  const [backendCustomersCount, setBackendCustomersCount] = useState(0);
  const [customerList, setCustomerList] = useState([]);
  const [listPerPage, setListPerPage] = useState(storedPerPage());
  const [columnToSort, setColumnToSort] = useState("contact_number");
  const [columnSortingOrder, setColumnSortingOrder] = useState("ascending");
  const [showSortingIcon, setShowSortingIcon] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  return {
    backendCustomersCount,
    setBackendCustomersCount,
    customerList,
    setCustomerList,
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
