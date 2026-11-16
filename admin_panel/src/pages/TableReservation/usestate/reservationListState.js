import { storedPerPage } from '../../../utils/pagination';
import { useState } from 'react';

export function useReservationListState() {
  const [backendReservationCount, setBackendReservationCount] = useState(0);
  const [reservationList, setReservationList] = useState([]);
  const [listPerPage, setListPerPage] = useState(
    storedPerPage()
  );
  const [columnToSort, setColumnToSort] = useState("id");
  const [columnSortingOrder, setColumnSortingOrder] = useState("descending");
  const [showSortingIcon, setShowSortingIcon] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [isLoader, setIsLoader] = useState(true);
  return {
    backendReservationCount,
    setBackendReservationCount,
    reservationList,
    setReservationList,
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
    isLoader,
    setIsLoader,
  };
}
