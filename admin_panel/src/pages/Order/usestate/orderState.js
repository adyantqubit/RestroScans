import { storedPerPage } from '../../../utils/pagination';
import { useState } from 'react';

export const initialOrderState = {
  loading: false,
  error: '',
};

export function useOrderState() {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [allDateFilter, setAllDateFilter] = useState(false);
  const [allowFilter, setAllowFilter] = useState(false);
  const [dateValidation, setDateValidation] = useState(false);
  const [backendOrderCount, setOrderCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [listPerPage, setListPerPage] = useState(
    storedPerPage()
  );
  const [columnToSort, setColumnToSort] = useState("order_id");
  const [columnSortingOrder, setColumnSortingOrder] = useState("descending");
  const [showSortingIcon, setShowSortingIcon] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [restroDetail, setRestroDetail] = useState(null);
  const [gstFssai, setGstFsaai] = useState(null);
  const [orderItems, setOrderItems] = useState(null);
  const [openActionPopupModal, setOpenActionPopupModal] = useState({});
  const [isLoader, setIsLoader] = useState(true);
  const [showDesk, setShowDesk] = useState(false);
  return {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    allDateFilter,
    setAllDateFilter,
    allowFilter,
    setAllowFilter,
    dateValidation,
    setDateValidation,
    backendOrderCount,
    setOrderCount,
    orders,
    setOrders,
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
    restroDetail,
    setRestroDetail,
    gstFssai,
    setGstFsaai,
    orderItems,
    setOrderItems,
    openActionPopupModal,
    setOpenActionPopupModal,
    isLoader,
    setIsLoader,
    showDesk,
    setShowDesk,
  };
}
