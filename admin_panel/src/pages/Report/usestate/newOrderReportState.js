import { storedPerPage } from '../../../utils/pagination';
import { useState } from 'react';

export function useNewOrderReportState() {
  const [quickSelect, setQuickSelect] = useState({
    today: false,
    week: true,
    month: false,
    year: false,
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSelected,setIsSelected]=useState(false);
  const [isAmountSort, setAmountSort] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [order, setOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState({
    placed: false,
    confirm: false,
    cooked: false,
    served: false,
    cancelled: false,
  });
  const [paymentStatus, setPaymentStatus] = useState({
    pending: false,
    completed: true,
  });
  const [isOrderNoSort, setOrderNoSort] = useState(false);
  const [showSortingIcon, setShowSortingIcon] = useState(false);
  const [columnToSort, setColumnToSort] = useState("order_id");
  const [columnSortingOrder, setColumnSortingOrder] = useState("descending");
  const [listPerPage, setListPerPage] = useState(
    storedPerPage()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [backendOrderCount, setOrderCount] = useState(0);
  const [allReportData, setAllReportData] = useState([]);
  const [disable, setDisable] = useState(true);
  const [customeDisable, setcustomDisable] = useState(false);
  const [orderByOrderId, setOrderByOrderId] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  return {
    quickSelect,
    setQuickSelect,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isSelected,
    setIsSelected,
    isAmountSort,
    setAmountSort,
    pageIndex,
    setPageIndex,
    order,
    setOrder,
    orderStatus,
    setOrderStatus,
    paymentStatus,
    setPaymentStatus,
    isOrderNoSort,
    setOrderNoSort,
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
    backendOrderCount,
    setOrderCount,
    allReportData,
    setAllReportData,
    disable,
    setDisable,
    customeDisable,
    setcustomDisable,
    orderByOrderId,
    setOrderByOrderId,
    isModalOpen,
    setIsModalOpen,
    orderItems,
    setOrderItems,
  };
}
