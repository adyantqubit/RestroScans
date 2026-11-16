import { storedPerPage } from '../../../utils/pagination';
import { useState } from 'react';

export function useCategoryState() {
  const [count, setCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [listPerPage, setListPerPage] = useState(storedPerPage());
  const [columnToSort, setColumnToSort] = useState('name');
  const [columnSortingOrder, setColumnSortingOrder] = useState('ascending');
  const [showSortingIcon, setShowSortingIcon] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');

  return {
    count,
    setCount,
    rows,
    setRows,
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
