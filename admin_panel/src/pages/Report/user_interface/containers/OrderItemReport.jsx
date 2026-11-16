import React, { useEffect } from "react";
import style from "../style/orderItem.module.css";
import Header from "../../../../components/Header/Header";
import Screen from "../../../../components/erp/Screen";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import {
  AiFillCalendar,
  AiOutlineCalendar,
  AiOutlineClose,
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";

import {
  TbSortAscendingLetters,
  TbSortDescendingLetters,
  TbSortAscendingNumbers,
  TbSortDescendingNumbers,
} from "react-icons/tb";
import { BsSortNumericDown, BsSortNumericDownAlt,  BsSortAlphaDownAlt,BsSortAlphaDown } from "react-icons/bs";
import "../style/checkbox.scss";
import { loadOrderItemReport } from "../../services/reportService";
import { useApp } from "../../../../Context/AppContext";
import { Input } from "../../../../ui";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { useLocation } from 'react-router-dom';
import { useOrderItemReportState } from "../../usestate/orderItemReportState";
import ListPagination from "../../../../components/ListPagination/ListPagination";

const OrderItemReport = () => {
  const { Message, enableHeader } = useApp();
  var {
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
  } = useOrderItemReportState();

  const { Search } = Input;

  const ExportToExcel = ({ apiData, fileName }) => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const exportToCSV = (apiData, fileName) => {
      var data = JSON.parse(apiData);
      var filteredData = data.map((e) => {
        delete Object.assign(e, { "Item Name": e["item"] })["item"];
        delete Object.assign(e, { "Serving Size": e["serving_size"] })[
          "serving_size"
        ];
        delete Object.assign(e, { "Total Order": e["item_count"] })[
          "item_count"
        ];
        delete Object.assign(e, { "Average Rating": e["average_rating"] })[
          "average_rating"
        ];
        delete Object.assign(e, { "Total Price": e["sum_price"] })["sum_price"];
        delete Object.assign(e, {
          "Cancelled Order": e["cancellation_count"],
        })["cancellation_count"];
        delete Object.assign(e, { "Completed Order": e["completion_count"] })[
          "completion_count"
        ];
        return e;
      });
      if (filteredData.length) {
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
      } else {
        Message("No Data is Found", "warning");
      }
    };
    return (
      <button
        className={style.PrintBtn}
        onClick={(e) => exportToCSV(apiData, fileName)}
      >
        Download
      </button>
    );
  };

  const state = useLocation()

  useEffect(() => {
    enableHeader();
    if (localStorage.getItem("globalPageIndex")) {
      currentPage = parseInt(localStorage.getItem("globalPageIndex"));
      setCurrentPage(parseInt(localStorage.getItem("globalPageIndex")));
    }
    if (state.state) {
      quickSelect = state.state
      setQuickSelect({ ...state.state })
    }
  }, []);

  useEffect(() => {
    enableHeader();
    postQuery();
    localStorage.setItem("globalPageIndex", currentPage);
  }, [columnToSort, columnSortingOrder, searchText, currentPage, listPerPage]);

  async function postQuery() {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const paginationDetails = {
      currentPage: isSelected?1:currentPage,
      listPerPage: listPerPage,
    };
    const filteringCriteria = {
      search: value,

      pageIndex: pageIndex,
      paginationDetails: paginationDetails,
      columnToSort: columnToSort,
      columnSortingOrder: columnSortingOrder,
      searchText: searchText?.trim(),
      quickSelect: quickSelect,
      startDate: startDate,
      endDate: endDate ? new Date(endDate.getTime() + 3600 * 1000 * 24) : null,
    };
    if (quickSelect.custom && (!startDate || !endDate)) {
      setDateValidation("Please enter both start date and end date");
      return;
    } else {
      setDateValidation(false);
      const response = await loadOrderItemReport(tenant, filteringCriteria);
      setReportOrderItem(response.item);
      setBackendOrderItemCount(response.orderItemCount);
      if(isSelected==true) {
        setCurrentPage(1)
      }
      setIsSelected(false);
    }
  }

  const sortOrderItemReportList = (columnName) => {
    if (columnToSort == columnName) {
      if (columnSortingOrder == "ascending") {
        setColumnSortingOrder("descending");
      } else {
        setColumnSortingOrder("ascending");
      }
    }
    setColumnToSort(columnName);
  };

  function totalAmountSelect(value) {
    if (value) {
      itemNameIsSort = "";
      orderCountIsSort = "";
      ratingIsSort = "";
      cancellationIsSort = "";
      totalAmountIsSort = true;
      completionIsSort="";
      setCompletionIsSort=""
      setItemNameSort("");
      setOrderCountSort("");
      setRatingSort("");
      setCancellationSort("");
      setTotalAmountSort(true);
    } else {
      itemNameIsSort = "";
      orderCountIsSort = "";
      ratingIsSort = "";
      cancellationIsSort = "";
      totalAmountIsSort = false;
      completionIsSort="";
      setCompletionIsSort=""
      setItemNameSort("");
      setOrderCountSort("");
      setRatingSort("");
      setCancellationSort("");
      setTotalAmountSort(false);
    }
    postQuery();
  }

  {
  }

  const handleChangeFromDate = (value) => {
    setEndDate(null);
    setStartDate(value);
    setDisable(false);
  };

  const handleChangeToDate = (value) => {
    setEndDate(value);
  };

  function handleCustomSelect(e) {
    setcustomDisable(true);
  }

  const handleQuickSelect = (e) => {
      setIsSelected(true);
    if (e == "today" || e == "week" || e == "month" || e == "year") {
      setDateValidation(false);
    }

    if (e == "today") {
      setcustomDisable(false);
      setStartDate("");
      setEndDate("");
      if (document.getElementById("today").checked == true) {
        setQuickSelect((select) => {
          select.today = true;
          select.week = false;
          select.month = false;
          select.year = false;
          select.custom = false;
          return { ...select };
        });
      }
    }
    if (e == "week") {
      setcustomDisable(false);
      setStartDate("");
      setEndDate("");
      if (document.getElementById("week").checked == true) {
        setQuickSelect((select) => {
          select.week = true;
          select.today = false;
          select.month = false;
          select.year = false;
          select.custom = false;
          return { ...select };
        });
      }
    }
    if (e == "month") {
      setcustomDisable(false);
      setStartDate("");
      setEndDate("");
      if (document.getElementById("month").checked == true) {
        setQuickSelect((select) => {
          select.month = true;
          select.week = false;
          select.today = false;
          select.year = false;
          select.custom = false;
          return { ...select };
        });
      }
    }
    if (e == "year") {
      setcustomDisable(false);
      setStartDate("");
      setEndDate("");
      if (document.getElementById("year").checked == true) {
        setQuickSelect((select) => {
          select.year = true;
          select.today = false;
          select.week = false;
          select.month = false;
          select.custom = false;
          return { ...select };
        });
      }
    }
    if (e == "custom") {
      setcustomDisable(true);
      if (document.getElementById("custom").checked == true) {
        setQuickSelect((select) => {
          select.custom = true;
          select.year = false;
          select.today = false;
          select.week = false;
          select.month = false;
          return { ...select };
        });
      }
    }
  };
  {
  }

  var backgroundColor = 1;

  const handlePageChange = async (pageNumber) => {
    localStorage.setItem("globalPageIndex", pageNumber);
    setCurrentPage(pageNumber);
  };

  const handleClearFilter = () => {
    startDate=""
    setStartDate("");
    endDate=""
    setEndDate("");
    setDateValidation(false);
    quickSelect={today: false,
      week: false,
      month: false,
      year: true,
      custom:false}
    setQuickSelect({...{today: false,
      week: false,
      month: false,
      year: true,
      custom:false
    }})
      handlePageChange(1);
    postQuery();
  };

  return (
    <Screen title="Item report" kicker="Reports">
    <div className={style.orderContainer}>
      <div className={style.filterContainer}>
        <div className={style.dateValidationContainer}>
          {customeDisable === true && (
            <div className={style.dateContainer}>
              <div className={style.toDate}>
                <div className={style.label} style={{ fontFamily: "ui-serif" }}>
                  Date From :
                </div>
                <div className={style.label} style={{ fontFamily: "ui-serif" }}>
                  Date To :
                </div>
              </div>
              <div className={style.fromDate}>
                <div className={style.datepicker1}>
                  <DatePicker
                    calendarClassName={style.calendar}
                    className={style.dateInput}
                    calendarIcon={<AiOutlineCalendar />}
                    clearIcon={<AiOutlineClose />}
                    onChange={handleChangeFromDate}
                    value={startDate}
                    format="dd/MM/yyyy"
                  />
                </div>
                <div className={style.datepicker1}>
                  <DatePicker
                    calendarClassName={style.calendar}
                    className={style.dateInput}
                    calendarIcon={<AiOutlineCalendar />}
                    clearIcon={<AiOutlineClose />}
                    onChange={handleChangeToDate}
                    value={endDate}
                    disabled={disable}
                    format="dd/MM/yyyy"
                    maxDate={new Date()}
                  />
                </div>
              </div>
            </div>
          )}
          <div className={style.dateValidation}>
            {dateValidation && "Please enter start and end date!"}{" "}
          </div>
        </div>

        <div className={style.quickSelectConatiner}>
          <div className={style.quickHeading}>Quick Select</div>
          <div className={style.quickOptions}>
            <div className={style.parentSelectContainer}>
              <div className={style.selectContainer}>
                <div>
                  <input
                    type="radio"
                    id="today"
                    name="quick_select"
                    value={"today"}
                    checked={quickSelect.today}
                    onChange={(e) => handleQuickSelect(e.target.value)}
                  />
                </div>
                <div className={style.label}>Today</div>
              </div>
              <div className={style.selectContainer}>
                <div>
                  <input
                    type="radio"
                    id="week"
                    name="quick_select"
                    checked={quickSelect.week}
                    value="week"
                    onChange={(e) => handleQuickSelect(e.target.value)}
                  />
                </div>
                <div className={style.label}>This Week</div>
              </div>
              <div className={style.selectContainer}>
                <div>
                  <input
                    type="radio"
                    id="custom"
                    name="quick_select"
                    value="custom"
                    checked={quickSelect.custom}
                    onChange={(e) => handleQuickSelect(e.target.value)}
                  />
                </div>
                <div className={style.label}>Custom</div>
              </div>
            </div>
            <div className={style.parentSelectContainer}>
              <div className={style.selectContainer}>
                <div>
                  <input
                    type="radio"
                    id="month"
                    name="quick_select"
                    checked={quickSelect.month}
                    value="month"
                    onChange={(e) => handleQuickSelect(e.target.value)}
                  />
                </div>
                <div className={style.label}>This Month</div>
              </div>
              <div className={style.selectContainer}>
                <div>
                  <input
                    type="radio"
                    id="year"
                    name="quick_select"
                    value="year"
                    checked={quickSelect.year}
                    defaultChecked={true}
                    onChange={(e) => handleQuickSelect(e.target.value)}
                  />
                </div>
                <div className={style.label}>This Year</div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.statusContainer}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              padding: "4px",
              width: "300px",
            }}
          >
            <Search
              placeholder="Search by item name"
              allowClear
              enterButton
              onChange={(event) => {
                setCurrentPage(1);
                setSearchText(event.target.value);
              }}
              onSearch={(value) => {
                setCurrentPage(1);
                setSearchText(value);
              }}
              className={style.SearchBar}
            />
          </div>
        </div>

        <div className={style.BtnContainer}>
          <button className={style.GenerateBtn} onClick={postQuery}>
            Generate Report
          </button>
          <button className={style.GenerateBtn} onClick={handleClearFilter}>
            Clear Filter
          </button>
          <button className={style.GenerateBtn}>
            <ExportToExcel
              apiData={JSON.stringify(reportOrderItem)}
              fileName="Order_Item_Report"
            />
          </button>
        </div>
      </div>

      <div className={style.orderListSection}>
        <div className={style.tabelContainer}>

          <div className={style.table}>
            <div className={style.tableHeading}>
              <div
                className={style.sNoColumn}
              >
                S.No
              </div>
                <div className={style.orderItemNameHeading}
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortOrderItemReportList("itemName");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "itemName") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "itemName") {
                      setShowSortingIcon(false);
                    }
                  }}>
                Item Name{" "}
                {columnToSort == "itemName" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortAlphaDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "itemName" &&
                    columnSortingOrder == "descending" && (
                      <BsSortAlphaDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "itemName" && showSortingIcon && (
                    <BsSortAlphaDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                  </div>
                <div className={style.orderCountHeading}
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortOrderItemReportList("orderCount");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "orderCount") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "orderCount") {
                      setShowSortingIcon(false);
                    }
                  }}>
                Total Order{" "}
                {columnToSort == "orderCount" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortNumericDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "orderCount" &&
                    columnSortingOrder == "descending" && (
                      <BsSortNumericDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "orderCount" && showSortingIcon && (
                    <BsSortNumericDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                  </div>
                  <div className={style.totalAmountHeading}
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortOrderItemReportList("totalAmount");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "totalAmount") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "totalAmount") {
                      setShowSortingIcon(false);
                    }
                  }}>
                Total Amount{" "}
                {columnToSort == "totalAmount" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortNumericDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "totalAmount" &&
                    columnSortingOrder == "descending" && (
                      <BsSortNumericDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "totalAmount" && showSortingIcon && (
                    <BsSortNumericDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
              </div>
                <div className={style.cancellationCountHeading}
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortOrderItemReportList("cancellation");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "cancellation") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "cancellation") {
                      setShowSortingIcon(false);
                    }
                  }}>
                Cancelled Order{" "}
                {columnToSort == "cancellation" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortNumericDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "cancellation" &&
                    columnSortingOrder == "descending" && (
                      <BsSortNumericDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "cancellation" && showSortingIcon && (
                    <BsSortNumericDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                  </div>
                <div className={style.cancellationCountHeading}
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortOrderItemReportList("completion");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "completion") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "completion") {
                      setShowSortingIcon(false);
                    }
                  }}>
                Completed Order{" "}
                {columnToSort == "completion" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortNumericDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "completion" &&
                    columnSortingOrder == "descending" && (
                      <BsSortNumericDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "completion" && showSortingIcon && (
                    <BsSortNumericDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                  </div>

                <div className={style.ratingColumnHeading}
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortOrderItemReportList("rating");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "rating") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "rating") {
                      setShowSortingIcon(false);
                    }
                  }}>
                Rating{" "}
                {columnToSort == "rating" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortNumericDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "rating" &&
                    columnSortingOrder == "descending" && (
                      <BsSortNumericDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "rating" && showSortingIcon && (
                    <BsSortNumericDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                  </div>
            </div>

            <div
              className={style.tableDataContainer}
              style={{
                backgroundColor: "#efefef",
              }}
            >
              {reportOrderItem && reportOrderItem.length > 0 ? (
                reportOrderItem.map((m, i) => {
                  return (
                    <div
                      key={i}
                      className={style.tableData}
                      style={{
                        padding: "0px",
                        marginTop: "2px",
                        marginBottom:
                          reportOrderItem.length == i + 1 ? "2px" : "0px",
                        background:
                          backgroundColor++ % 2 == 0 ? "white" : "#1677ff14",
                      }}
                    >
                      <div
                        className={`${style.sNoColumn} ${style.mediumColoumnWidth} `}
                      >
                        {currentPage * listPerPage - listPerPage + i + 1}
                      </div>
                      <div
                        className={`${style.orderItemNameHeading} ${style.mediumColoumnWidth}`}
                      >
                        {m.item}({m.serving_size})
                      </div>
                      <div
                        className={`${style.orderCountHeading} ${style.mediumColoumnWidth}`}
                      >
                        {m.item_count}
                      </div>
                      <div
                        className={`${style.totalAmountHeading} ${style.mediumColoumnWidth}`}
                      >
                        {m.sum_price}
                      </div>
                      <div
                        className={`${style.cancellationCountHeading} ${style.mediumColoumnWidth}`}
                      >
                        {m.cancellation_count}
                      </div>
                      <div
                        className={`${style.cancellationCountHeading} ${style.mediumColoumnWidth}`}>
                        {m.completion_count}
                      </div>
                      <div
                        className={`${style.ratingColumnHeading} ${style.mediumColoumnWidth}`}
                      >
                        {m.average_rating ? (m.average_rating).toFixed(1) : " - "}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: "center" }}>No records found!</div>
              )}
            </div>

          </div>

        </div>
      </div>
      <ListPagination
        styles={style}
        hasRows={Boolean(reportOrderItem&&reportOrderItem.length>0)}
        total={backendOrderItemCount}
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

export default OrderItemReport;
