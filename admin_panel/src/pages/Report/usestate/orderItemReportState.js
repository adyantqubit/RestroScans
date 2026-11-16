import { storedPerPage } from '../../../utils/pagination';
import { useState } from 'react';

export function useOrderItemReportState() {
  const [value, onChange] = useState("");
  const [itemNameIsSort, setItemNameSort] = useState(false);
  const [orderCountIsSort, setOrderCountSort] = useState(false);
  const [ratingIsSort, setRatingSort] = useState(false);
  const [cancellationIsSort, setCancellationSort] = useState(false);
  const [completionIsSort, setCompletionIsSort] = useState(false);
  const [reportOrderItem, setReportOrderItem] = useState(null);
  const [totalAmountIsSort, setTotalAmountSort] = useState(false);
  const [disable, setDisable] = useState(true);
  const [customeDisable, setcustomDisable] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSelected,setIsSelected]=useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [backendOrderItemCount, setBackendOrderItemCount] = useState(0);
  const [listPerPage, setListPerPage] = useState(
    storedPerPage()
  );
  const [pageIndex, setPageIndex] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [allReportData, setAllReportData] = useState([]);
  const [showSortingIcon, setShowSortingIcon] = useState(false);
  const [columnToSort, setColumnToSort] = useState("itemName");
  const [columnSortingOrder, setColumnSortingOrder] = useState("ascending");
  const [dateValidation, setDateValidation] = useState(false);
  const [quickSelect, setQuickSelect] = useState({
    today: false,
    week: false,
    month: false,
    year: true,
    custom:false
  });
  return {
    value,
    onChange,
    itemNameIsSort,
    setItemNameSort,
    orderCountIsSort,
    setOrderCountSort,
    ratingIsSort,
    setRatingSort,
    cancellationIsSort,
    setCancellationSort,
    completionIsSort,
    setCompletionIsSort,
    reportOrderItem,
    setReportOrderItem,
    totalAmountIsSort,
    setTotalAmountSort,
    disable,
    setDisable,
    customeDisable,
    setcustomDisable,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isSelected,
    setIsSelected,
    currentPage,
    setCurrentPage,
    backendOrderItemCount,
    setBackendOrderItemCount,
    listPerPage,
    setListPerPage,
    pageIndex,
    setPageIndex,
    searchText,
    setSearchText,
    allReportData,
    setAllReportData,
    showSortingIcon,
    setShowSortingIcon,
    columnToSort,
    setColumnToSort,
    columnSortingOrder,
    setColumnSortingOrder,
    dateValidation,
    setDateValidation,
    quickSelect,
    setQuickSelect,
  };
}
