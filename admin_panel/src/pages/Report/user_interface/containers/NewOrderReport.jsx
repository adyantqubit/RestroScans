import React, { useEffect } from "react";
import style from "../style/NewOrderReport.module.css";
import {
  loadOrderReport,
  loadOrderItems,
  loadOrderCount,
} from "../../services/reportService";
import { nextSort, selectQuickRange, setStatusFlag } from "../../services/reportFilters";
import { useApp } from "../../../../Context/AppContext";
import { useLocation } from "react-router-dom";
import { useNewOrderReportState } from "../../usestate/newOrderReportState";
import ListPagination from "../../../../components/ListPagination/ListPagination";
import ReportFilters from "../components/ReportFilters";
import ReportTable from "../components/ReportTable";
import OrderDetailsModal from "../components/OrderDetailsModal";
import { ExportToExcel } from "../components/ExportToExcel";
import Screen from "../../../../components/erp/Screen";

const tenantName = () => JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;

const NewOrderReport = () => {
  const { enableHeader } = useApp();

  var {
    quickSelect,
    setQuickSelect,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isSelected,
    setIsSelected,
    isAmountSort,
    pageIndex,
    order,
    setOrder,
    orderStatus,
    setOrderStatus,
    paymentStatus,
    setPaymentStatus,
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
  } = useNewOrderReportState();

  const state = useLocation();
  useEffect(() => {
    enableHeader();
    if (localStorage.getItem("globalPageIndex")) {
      currentPage = parseInt(localStorage.getItem("globalPageIndex"));
      setCurrentPage(parseInt(localStorage.getItem("globalPageIndex")));
    }

    if (state.state) {
      quickSelect = state.state;
      setQuickSelect({ ...state.state });

      paymentStatus = {
        pending: false,
        completed: true,
      };
      setPaymentStatus({
        pending: false,
        completed: true,
      });
    }
  }, []);

  useEffect(() => {
    enableHeader();
    postOrderQuery();
    localStorage.setItem("globalPageIndex", currentPage);
  }, [columnToSort, columnSortingOrder, currentPage, listPerPage]);

  async function postOrderQuery() {
    const paginationDetails = {
      currentPage: isSelected ? 1 : currentPage,
      listPerPage: listPerPage,
    };
    const queryData = {
      amountSort: isAmountSort,
      pageIndex: pageIndex,
      quickSelect: quickSelect,
      startDate: startDate,
      endDate: endDate ? new Date(endDate.getTime() + 3600 * 1000 * 24) : null,
      paginationDetails: paginationDetails,
      columnToSort: columnToSort,
      columnSortingOrder: columnSortingOrder,
      paymentStatus: paymentStatus,
      orderStatus: orderStatus,
    };
    await loadOrderReport(tenantName(), queryData).then((r) => {
      setOrder(r.orderList);
      setOrderCount(r.orderListCount);
      setAllReportData(r.allReportList);
      if (isSelected == true) {
        setCurrentPage(1);
      }
      setIsSelected(false);
    });
  }

  const handleChangeFromDate = (value) => {
    setEndDate("");
    setStartDate(value);
    setDisable(false);
  };

  const handleChangeToDate = (value) => {
    setEndDate(value);
  };

  // Picking a quick range clears any custom dates; "custom" opens the date pickers instead.
  const handleQuickSelect = (event) => {
    const range = event.target.value;
    setIsSelected(true);
    if (range === "custom") {
      setcustomDisable(true);
    } else {
      setcustomDisable(false);
      setStartDate("");
      setEndDate("");
    }
    if (event.target.checked) {
      setQuickSelect((previous) => selectQuickRange(previous, range));
    }
  };

  const handleOrderStatus = (event) => {
    setIsSelected(true);
    const { value, checked } = event.target;
    setOrderStatus((previous) => setStatusFlag(previous, value, checked));
  };

  const handlePaymentStatus = (event) => {
    setIsSelected(true);
    const { value, checked } = event.target;
    setPaymentStatus((previous) => setStatusFlag(previous, value, checked));
  };

  const allOrderItems = async (id) => {
    var response = await loadOrderItems(tenantName(), id);
    if (response.msg) {
      setOrderItems(response.orderItems);
    }
  };

  const showModal = (data) => {
    setOrderByOrderId({ order_detail: data });
    setIsModalOpen(true);
    allOrderItems(data.id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const sortOrders = (columnName) => {
    const next = nextSort({ column: columnToSort, order: columnSortingOrder }, columnName);
    setColumnSortingOrder(next.order);
    setColumnToSort(next.column);
  };

  const handlePageChange = (pageNumber) => {
    localStorage.setItem("globalPageIndex", pageNumber);
    setCurrentPage(pageNumber);
  };

  return (
    <Screen title="Order report" kicker="Reports">
    <div className={style.orderContainer}>
      <ReportFilters
        quickSelect={quickSelect}
        paymentStatus={paymentStatus}
        showCustomDates={customeDisable === true}
        startDate={startDate}
        endDate={endDate}
        disableToDate={disable}
        onFromDate={handleChangeFromDate}
        onToDate={handleChangeToDate}
        onQuickSelect={handleQuickSelect}
        onOrderStatus={handleOrderStatus}
        onPaymentStatus={handlePaymentStatus}
      />

      <div className={style.buttonSelectConatiner}>
        <div className={style.BtnContainer}>
          <button className={style.GenerateBtn} onClick={postOrderQuery}>
            Generate Report
          </button>
        </div>
        <div className={style.BtnContainer}>
          <ExportToExcel apiData={allReportData} fileName="MyFile" />
        </div>
      </div>

      <ReportTable
        orders={order}
        currentPage={currentPage}
        listPerPage={listPerPage}
        columnToSort={columnToSort}
        columnSortingOrder={columnSortingOrder}
        showSortingIcon={showSortingIcon}
        setShowSortingIcon={setShowSortingIcon}
        onSort={sortOrders}
        onView={showModal}
      />

      <OrderDetailsModal
        isOpen={isModalOpen}
        order={orderByOrderId}
        items={orderItems}
        onOk={closeModal}
        onCancel={closeModal}
      />

      <ListPagination
        styles={style}
        hasRows={Boolean(order && order.length > 0)}
        total={backendOrderCount}
        currentPage={currentPage}
        listPerPage={listPerPage}
        onPageChange={handlePageChange}
        setListPerPage={setListPerPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
    </Screen>
  );
};

export default NewOrderReport;
