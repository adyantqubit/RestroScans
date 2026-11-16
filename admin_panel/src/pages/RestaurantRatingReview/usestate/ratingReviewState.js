import { storedPerPage } from '../../../utils/pagination';
import { useState } from 'react';

export function useRatingReviewState() {
  const [backenRatingReviewCount, setBackendRatingReviewCount] = useState(0);
  const [ratingReviewList, setRatingReviewList] = useState([]);
  const [listPerPage, setListPerPage] = useState(storedPerPage());
  const [columnToSort, setColumnToSort] = useState("contact_number");
  const [columnSortingOrder, setColumnSortingOrder] = useState("ascending");
  const [showSortingIcon, setShowSortingIcon] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  return {
    backenRatingReviewCount,
    setBackendRatingReviewCount,
    ratingReviewList,
    setRatingReviewList,
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
