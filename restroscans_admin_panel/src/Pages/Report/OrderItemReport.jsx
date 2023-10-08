import React, { useEffect, useState } from "react";
import style from "./orderItem.module.css";
import Header from "../GlobalComponent/Header";
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
import { BsSortNumericDown, BsSortNumericDownAlt } from "react-icons/bs";
import "./checkbox.scss";
import { OrderItemFilterQueryAPI } from "../../Api/services";
import { Message, enableHeader } from "../../App";
import { Input, Pagination } from "antd";
import { MdArrowDropUp } from "react-icons/md";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const OrderItemReport = () => {
  const [value, onChange] = useState("");
  var [itemNameIsSort, setItemNameSort] = useState(false);
  var [orderCountIsSort, setOrderCountSort] = useState(false);
  var [ratingIsSort, setRatingSort] = useState(false);
  var [cancellationIsSort, setCancellationSort] = useState(false);

  // Added by Pratap sahu on 07-10-2023
  var [completionIsSort, setCompletionIsSort] = useState(false);
  // End of code by Pratap sahu on 07-10-2023
  
  var [reportOrderItem, setReportOrderItem] = useState(null);

  var [totalAmountIsSort, setTotalAmountSort] = useState(false);
  // added by - suman sahu on 28/08/2023
  // reason - for set custom button enable or diable
  const [disable, setDisable] = useState(true);
  const [customeDisable, setcustomDisable] = useState(false);

  var [startDate, setStartDate] = useState("");
  var [endDate, setEndDate] = useState("");  

  // end of addition by suman sahu on 28/08/2023
  // reason - for set custom button

  
  /**
   * Added by - Ashlekh on 15-09-2023
   *
   */
  var [currentPage, setCurrentPage] = useState(1);
  const [backendOrderItemCount, setBackendOrderItemCount] = useState(0);
  const [listPerPage, setListPerPage] = useState(
    localStorage.getItem("listPerPage")
  );
  const [pageIndex, setPageIndex] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [allReportData, setAllReportData] = useState([]);
  const { Search } = Input;
  // End of code addition by - Ashlekh on 15-09-2023

  // Added by - Ashlekh on 16-09-2023 Reason - For sorting
  const [showSortingIcon, setShowSortingIcon] = useState(false);
  const [columnToSort, setColumnToSort] = useState("item");
  const [columnSortingOrder, setColumnSortingOrder] = useState("descending");
  // End of code addition by - Ashlekh on 16-09-2023
  // Reason - For sorting

  const [dateValidation, setDateValidation] = useState(false);

  //Added by - Ashlekh on 19-09-2023
  //Reason - For downloading report in excel sheet
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
        // Added by Pratap sahu on 07-10-2023 To Add Completed Order detail in Excel Export
        delete Object.assign(e, { "Completed Order": e["completion_count"] })[
          "completion_count"
        ];
        // Added by Pratap sahu on 07-10-2023 To Add Completed Order detail in Excel Export
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
  //End of code addition by - Ashlekh on 19-09-2023
  //Reason - For downloading report in excel sheet
  //Last updated by - Ashlekh on 20-09-2023

  useEffect(() => {
    // Added By Rohan Kansari - 25/6/23
    // Reason - To enable headerSiderbar
    enableHeader();
    // End of code - Rohan kansari - 25/6/23
    if (localStorage.getItem("globalPageIndex")) {
      currentPage = parseInt(localStorage.getItem("globalPageIndex"));
      setCurrentPage(parseInt(localStorage.getItem("globalPageIndex")));
    }
    postQuery();
  }, []);

  useEffect(() => {
    enableHeader();
    postQuery();
    localStorage.setItem("globalPageIndex", currentPage);
  }, [columnToSort, columnSortingOrder, searchText, currentPage, listPerPage]);

  async function postQuery() {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    //Added by - Ashlekh on 16-09-2023
    //Reason - For pagination
    const paginationDetails = {
      currentPage: currentPage,
      listPerPage: listPerPage,
    };
    //End of code addition by - Ashlekh on 16-09-2023
    //Reason - For pagination
    const filteringCriteria = {
      search: value,
      itemSort: itemNameIsSort,
      orderSort: orderCountIsSort,
      ratingSort: ratingIsSort,
      cancellationSort: cancellationIsSort,
      //Added by - Pratap sahu on 07-10-2023
      completionSort: completionIsSort,
      //End of code by - Pratap sahu on 07-10-2023
      totalAmountSort: totalAmountIsSort,

      //Added by - Ashlekh on 16-09-2023
      pageIndex: pageIndex,
      paginationDetails: paginationDetails,
      columnToSort: columnToSort,
      columnSortingOrder: columnSortingOrder,
      searchText: searchText?.trim(),
      //End of code addition by - Ashlekh on 16-09-2023
      //Added by - Ashlekh on 19-09-2023
      quickSelect: quickSelect,
      startDate: startDate,
      endDate: endDate ? new Date(endDate.getTime() + 3600 * 1000 * 24) : null,
      //End of code addition by - Ashlekh on 19-09-2023
    };
    // console.log("lllll", searchText);
    //Code modification by - Ashlekh on 21-09-2023
    //Reason - For date validation
    if (quickSelect.custom && (!startDate || !endDate)) {
      setDateValidation("Please enter both start date and end date");
      return;
    } else {
      setDateValidation(false);
      const response = await OrderItemFilterQueryAPI(tenant, filteringCriteria);
      setReportOrderItem(response.item);
      setBackendOrderItemCount(response.orderItemCount);
    }
    //End of code modification by - Ashlekh on 21-09-2023
    //Reason - For date validation
  }
  //Code modification by - Ashlekh on 18-09-2023
  function cancellationSelect(value) {
    if (value) {
      itemNameIsSort = "";
      orderCountIsSort = "";
      ratingIsSort = "";
      totalAmountIsSort = "";
      cancellationIsSort = true;
      // Added by pratap sahu on 07-10-2023
      completionIsSort="";
      setCompletionIsSort=""
      // End of code by pratap sahu on 07-10-2023
      setItemNameSort("");
      setOrderCountSort("");
      setRatingSort("");
      setTotalAmountSort("");
      setCancellationSort(true);
    } else {
      itemNameIsSort = "";
      orderCountIsSort = "";
      ratingIsSort = "";
      totalAmountIsSort = "";
      cancellationIsSort = false;
      // Added by pratap sahu on 07-10-2023
      completionIsSort="";
      setCompletionIsSort=""
      // End of code by pratap sahu on 07-10-2023
      setItemNameSort("");
      setOrderCountSort("");
      setRatingSort("");
      setTotalAmountSort = "";
      setCancellationSort(false);
    }
    postQuery();
  }

  function ratingSelect(value) {
    if (value) {
      itemNameIsSort = "";
      orderCountIsSort = "";
      ratingIsSort = true;
      cancellationIsSort = "";
      totalAmountIsSort = "";
      // Added by pratap sahu on 07-10-2023
      completionIsSort="";
      setCompletionIsSort=""
      // End of code by pratap sahu on 07-10-2023
      setItemNameSort("");
      setOrderCountSort("");
      setRatingSort(true);
      setCancellationSort("");
      setTotalAmountSort("");
    } else {
      itemNameIsSort = "";
      orderCountIsSort = "";
      ratingIsSort = false;
      cancellationIsSort = "";
      totalAmountIsSort = "";
      // Added by pratap sahu on 07-10-2023
      completionIsSort="";
      setCompletionIsSort=""
      // End of code by pratap sahu on 07-10-2023
      setItemNameSort("");
      setOrderCountSort("");
      setRatingSort(false);
      setCancellationSort("");
      setTotalAmountSort = "";
    }
    postQuery();
  }

  function orderCountSelect(value) {
    if (value) {
      itemNameIsSort = "";
      orderCountIsSort = true;
      ratingIsSort = "";
      cancellationIsSort = "";
      totalAmountIsSort = "";
      // Added by pratap sahu on 07-10-2023
      completionIsSort="";
      setCompletionIsSort=""
      // End of code by pratap sahu on 07-10-2023
      setItemNameSort("");
      setOrderCountSort(true);
      setRatingSort("");
      setCancellationSort("");
      setTotalAmountSort("");
    } else {
      itemNameIsSort = "";
      orderCountIsSort = false;
      ratingIsSort = "";
      cancellationIsSort = "";
      totalAmountIsSort = "";
      // Added by pratap sahu on 07-10-2023
      completionIsSort="";
      setCompletionIsSort=""
      // End of code by pratap sahu on 07-10-2023
      setItemNameSort("");
      setOrderCountSort(false);
      setRatingSort("");
      setCancellationSort("");
      setTotalAmountSort("");
    }
    postQuery();
  }

  function itemSelect(value) {
    if (value) {
      itemNameIsSort = true;
      orderCountIsSort = "";
      ratingIsSort = "";
      cancellationIsSort = "";
      totalAmountIsSort = "";
      // Added by pratap sahu on 07-10-2023
      completionIsSort="";
      setCompletionIsSort=""
      // End of code by pratap sahu on 07-10-2023
      setItemNameSort(true);
      setOrderCountSort("");
      setRatingSort("");
      setCancellationSort("");
      setTotalAmountSort("");
    } else {
      itemNameIsSort = false;
      orderCountIsSort = "";
      ratingIsSort = "";
      cancellationIsSort = "";
      totalAmountIsSort = "";
      // Added by pratap sahu on 07-10-2023
      completionIsSort="";
      setCompletionIsSort=""
      // End of code by pratap sahu on 07-10-2023
      setItemNameSort(false);
      setOrderCountSort("");
      setRatingSort("");
      setCancellationSort("");
      setTotalAmountSort("");
    }
    postQuery();
  }
  //End of code modification by - Ashlekh on 18-09-2023

    //Added by - Pratap sahu on 07-10-2023 for sorting
  function completionSelect(value) {
    if (value) {
      itemNameIsSort = "";
      orderCountIsSort = "";
      ratingIsSort = "";
      totalAmountIsSort = "";
      cancellationIsSort = "";
      completionIsSort = true;
      setItemNameSort("");
      setOrderCountSort("");
      setRatingSort("");
      setTotalAmountSort("");
      setCancellationSort("");
      setCompletionIsSort(true);
    } else {
      itemNameIsSort = "";
      orderCountIsSort = "";
      ratingIsSort = "";
      totalAmountIsSort = "";
      cancellationIsSort = "";
      completionIsSort = false;
      setItemNameSort("");
      setOrderCountSort("");
      setRatingSort("");
      setTotalAmountSort = "";
      setCancellationSort("");
      setCompletionIsSort(false);
    }
    postQuery();
  }
    //End of code by - Pratap sahu on 07-10-2023

  //Added by - Ashlekh on 18-09-2023
  //Reason - To add sorting in total amount
  function totalAmountSelect(value) {
    if (value) {
      itemNameIsSort = "";
      orderCountIsSort = "";
      ratingIsSort = "";
      cancellationIsSort = "";
      totalAmountIsSort = true;
      // Added by pratap sahu on 07-10-2023
      completionIsSort="";
      setCompletionIsSort=""
      // End of code by pratap sahu on 07-10-2023
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
      // Added by pratap sahu on 07-10-2023
      completionIsSort="";
      setCompletionIsSort=""
      // End of code by pratap sahu on 07-10-2023
      setItemNameSort("");
      setOrderCountSort("");
      setRatingSort("");
      setCancellationSort("");
      setTotalAmountSort(false);
    }
    postQuery();
  }
  //End of code addition by - Ashlekh on 18-09-2023
  //Reason - For adding sorting in total amount

  {
    /* added by - Suman sahu on 28/08/2023 
        reason - for set custom date in custom filter button */
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

  var [quickSelect, setQuickSelect] = useState({
    today: false,
    week: false,
    month: false,
    year: true,
    // added By pratap sahu on 29-09-2023 To fetch all data on single click of cler filter button
    custom:false
    // End of code By pratap sahu on 29-09-2023 To fetch all data on single click of cler filter button
  });

  const handleQuickSelect = (e) => {
    //Code added by - Ashlekh on 21-09-2023
    //Reason - To Reset dateValidation when switching away from "custom" quick select
    if (e == "today" || e == "week" || e == "month" || e == "year") {
      setDateValidation(false);
    }
    //Code added by - Ashlekh on 21-09-2023
    //Reason - To Reset dateValidation when switching away from "custom" quick select

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
    /* end of addition by - Suman sahu on 28/08/2023 
        reason - for set custom date */
  }

  var backgroundColor = 1;

  /**
   * Added by - Ashlekh on 15-09-2023
   * Reason - When user changes page number, this method will set page number which will be sent to backend.
   */
  const handlePageChange = async (pageNumber) => {
    localStorage.setItem("globalPageIndex", pageNumber);
    setCurrentPage(pageNumber); 
  };
  /**
   * End of code addition by - Ashlekh on 15-09-2023
   * Reason - When user changes page number, this method will set page number which will be sent to backend.
   */

  /**
   * Added by - Ashlekh on 15-09-2023
   * Reason - To toggle dropdown visiblity on click
   */
  function toggelDropdown() {
    if (document.getElementById("dropdown").style.display.length == 0)
      document.getElementById("dropdown").style.display = "block";
    else document.getElementById("dropdown").style.display = "";
  }
  /**
   * End of code addition by - Ashlekh on 15-09-2023
   * Reason - To toggle dropdown visiblity on click
   */

  const handleClearFilter = () => {
    // Clear custom date range and hide validation message
    // added By pratap sahu on 29-09-2023 To fetch all data on single click of cler filter button
    startDate=""
    setStartDate("");
    endDate=""
    setEndDate("");
    // End of Addition by Pratp sahu on 28-09-2023 To fetch all data on single click of cler filter button
    setDateValidation(false);
    // added By pratap sahu on 29-09-2023
    // Reason:To remove filteration from every aspect
    quickSelect={today: false,
      week: false,
      month: false,
      year: true,
      custom:false}
    // Uncommented By pratap sahu on 29-09-2023 To fetch all data on single click of cler filter button
    setQuickSelect({...{today: false,
      week: false,
      month: false,
      year: true,
      custom:false
    }})
     // End of Uncomment by Pratp sahu on 29-09-2023 To fetch all data on single click of cler filter button
      handlePageChange(1);
    // added By pratap sahu on 28-09-2023
    // Reason:To remove filteration from every aspect
    // Update the "Clear Filter" button click state
    postQuery();
  };

  return (
    // Modified by Rohan Kansari - 25/6/23
    // Reason - removing header from each page and making it global
    // <Header>
    <div className={style.orderContainer}>
      <div className={style.filterContainer}>
        {/* added by - Suman sahu on 28/08/2023 
                    reason - add flter section on that page */}
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
                    // Added by pratap sahu on 28-09-2023
                    // Reason:to set today as Max range
                    maxDate={new Date()}
                    // End of Code by pratap sahu on 28-09-2023
                    // Reason:to set today as Max range
                  />
                </div>
              </div>
            </div>
          )}
          {/* Code added by - Ashlekh on 21-09-2023
          Reason - For date validation */}
          <div className={style.dateValidation}>
            {dateValidation && "Please enter start and end date!"}{" "}
          </div>
          {/* End of code addition by - Ashlekh on 21-09-2023
          Reason - For date validation */}
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
                   // Added by pratap sahu on 28-09-2023 Reason:To Select today only at a time
                    value={"today"}
                    checked={quickSelect.today}
                   // End of code by pratap sahu on 28-09-2023 Reason:To Select today only at a time
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
                    // Added by pratap sahu on 28-09-2023 Reason:To Select week only at a time
                    checked={quickSelect.week}
                     // End of code by pratap sahu on 28-09-2023 Reason:To Select week only at a time
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
                   // Added by pratap sahu on 28-09-2023 Reason:To Select month only at a time
                    checked={quickSelect.custom}
                   // End of code by pratap sahu on 28-09-2023 Reason:To Select month only at a time                    
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
                    // Added by pratap sahu on 28-09-2023 Reason:To Select month only at a time
                    checked={quickSelect.month}
                     // End of code by pratap sahu on 28-09-2023 Reason:To Select month only at a time
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
                    // Added by pratap sahu on 28-09-2023 Reason:To Select year only at a time
                    checked={quickSelect.year}
                     // End of code by pratap sahu on 28-09-2023 Reason:To Select year only at a time
                    defaultChecked={true}
                    onChange={(e) => handleQuickSelect(e.target.value)}
                  />
                </div>
                <div className={style.label}>This Year</div>
              </div>
            </div>
          </div>
        </div>
        {/* end of addition by - Suman sahu on 28/08/2023
                    reason - add flter section on that page */}
        {/*Filter 1  */}

        <div className={style.statusContainer}>
          {/**
           * Code commented and added by - Ashlekh on 16-09-2023
           * Reason - To add search bar
           * */}
          {/* commented by suman sahu on 28/08/2023
                        reason - for change class name */}
          {/* <div className={style.label}>Search By Item Name</div> */}
          {/* <div className={style.searchHeading}>Search By Item Name</div> */}
          {/* end of code by suman sahu on 28/08/2023 */}
          {/* <div className={style.selctedContentBox}>
                        <input className={style.searchInput} type="text" onChange={e => onChange(e.target.value)} />
                    </div> */}
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
              onSearch={(value) => {
                setCurrentPage(1);
                setSearchText(value);
              }}
              className={style.SearchBar}
            />
          </div>
          {/**
           * End of comment and code addition by - Ashlekh on 16-09-2023
           * Reason - To add search bar
           * */}
        </div>

        <div className={style.BtnContainer}>
          <button className={style.GenerateBtn} onClick={postQuery}>
            Generate Report
          </button>
          {/* Code commented and added by - Ashlekh on 19-09-2023
                     Reason - For downloading in excel sheet  */}
          {/* added by - suman sahu on 28/08/2023 */}
          <button className={style.GenerateBtn} onClick={handleClearFilter}>
            Clear Filter
          </button>
          <button className={style.GenerateBtn}>
            <ExportToExcel
              apiData={JSON.stringify(reportOrderItem)}
              fileName="Order_Item_Report"
            />
          </button>
          {/* end of addition by - suman sahu on 28/08/2023 */}
          {/* End of comment and code addition by - Ashlekh on 19-09-2023
                    Reason - For downloading in excel sheet */}
        </div>
      </div>

      {/* modified by - suman sahu on 28/08/2023 */}
      <div className={style.orderListSection}>
        <div className={style.tabelContainer}>
          {/* <div className={style.container} > */}
          {/* <div className={style.TabelContainer}> */}

          <div className={style.table}>
            <div className={style.tableHeading}>
              <div
                //Commented by - Ashlekh on 20-09-2023
                //className={style.column1}
                className={style.sNoColumn}
              >
                Sno
              </div>
              {/* Code modification by - Ashlekh on 20-09-2023
                  Reason - Sorting Icon */}
              <div
                className={style.orderItemNameHeading}
                // className={style.orderItemName}
              >
                <input
                  type="checkbox"
                  id="itemName"
                  style={{ display: "none" }}
                  name="itemName"
                  checked={itemNameIsSort}
                  onChange={(e) => itemSelect(e.target.checked)}
                />{" "}
                <label className={style.sortingLabel} htmlFor="itemName">
                  Item Name{" "}
                  {itemNameIsSort ? (
                    <TbSortAscendingLetters className={style.SortIcon} />
                  ) : (
                    <TbSortDescendingLetters className={style.SortIcon} />
                  )}
                </label>
              </div>
              <div
                //className={style.column3}
                className={style.orderCountHeading}
              >
                <input
                  type="checkbox"
                  id="orderCount"
                  style={{ display: "none" }}
                  name="orderCount"
                  checked={orderCountIsSort}
                  onChange={(e) => orderCountSelect(e.target.checked)}
                />{" "}
                <label className={style.sortingLabel} htmlFor="orderCount">
                  Total Order{" "}
                  {orderCountIsSort ? (
                    <BsSortNumericDown className={style.SortIcon} />
                  ) : (
                    <BsSortNumericDownAlt className={style.SortIcon} />
                  )}
                </label>
              </div>
              {/* commented and modified by - suman sahu on 28/08/2023 
                                        reason - for change lable name */}
              {/* Code commented and added by - Ashlekh on 18-09-2023
                                        Reason - To add sorting in total amount */}
              {/* <div className={style.column5}>Price</div> */}
              {/* <div className={style.column5}>Total Amount</div> */}
              <div className={style.totalAmountHeading}>
                <input
                  type="checkbox"
                  id="totalAmount"
                  style={{ display: "none" }}
                  name="totalAmount"
                  checked={totalAmountIsSort}
                  onChange={(e) => totalAmountSelect(e.target.checked)}
                />{" "}
                <label className={style.sortingLabel} htmlFor="totalAmount">
                  Total Amount{" "}
                  {totalAmountIsSort ? (
                    <BsSortNumericDown className={style.SortIcon} />
                  ) : (
                    <BsSortNumericDownAlt className={style.SortIcon} />
                  )}
                </label>
              </div>
              {/* End of comment and code addition by - Ashlekh on 18-09-2023
                                    Reason - To add sorting in total amount */}
              {/* end of code by suman sahu on 28/08/2023 */}
              {/* <div className={style.column5}>Discount</div> */}
              <div className={style.cancellationCountHeading}>
                <input
                  type="checkbox"
                  id="cancellation"
                  style={{ display: "none" }}
                  name="cancellation"
                  checked={cancellationIsSort}
                  onChange={(e) => cancellationSelect(e.target.checked)}
                />{" "}
                <label className={style.sortingLabel} htmlFor="cancellation">
                  Cancelled Order{" "}
                  {cancellationIsSort ? (
                    <BsSortNumericDown className={style.SortIcon} />
                  ) : (
                    <BsSortNumericDownAlt className={style.SortIcon} />
                  )}
                </label>
              </div>

              {/* Added by Pratap sahu on 07-10-2023 To show Completed Order details */}
              <div className={style.cancellationCountHeading}>
                <input
                  type="checkbox"
                  id="completion"
                  style={{ display: "none" }}
                  name="completion"
                  checked={completionIsSort}
                  onChange={(e) => completionSelect(e.target.checked)}
                />{" "}
                <label className={style.sortingLabel} htmlFor="completion">
                  Completed Order{" "}
                  {completionIsSort ? (
                    <BsSortNumericDown className={style.SortIcon} />
                  ) : (
                    <BsSortNumericDownAlt className={style.SortIcon} />
                  )}
                </label>
              </div>
            {/* End of Addition by Pratap sahu on 07-10-2023 To show Completed Order details */}

              {/* <div className={style.column7}>Last Review</div> */}
              {/* End of code modification by - Ashlekh on 20-09-2023
              Reason - For sorting icon */}
              <div
                //    className={style.column4}
                className={style.ratingColumnHeading}
              >
                <input
                  type="checkbox"
                  id="rating"
                  style={{ display: "none" }}
                  name="rating"
                  checked={ratingIsSort}
                  onChange={(e) => ratingSelect(e.target.checked)}
                />{" "}
                <label className={style.sortingLabel} htmlFor="rating">
                  Rating{" "}
                  {ratingIsSort ? (
                    <BsSortNumericDown className={style.SortIcon} />
                  ) : (
                    <BsSortNumericDownAlt className={style.SortIcon} />
                  )}
                </label>
              </div>
            </div>

            {/* commented and modified by - suman sahu on 28/08/2023 
                                    reason - change layout design */}

            {/* {reportOrderItem?.map((m, i) =>
                                        <div className={style.row} >
                                            <div className={style.columnData1}>{i + 1}</div>
                                            <div className={style.columnData2}>{m.item}({m.serving_size})</div>
                                            <div className={style.columnData3}>{m.item_count}</div>
                                            <div className={style.columnData4}>{m.average_rating ? m.average_rating : " - "}</div>
                                            <div className={style.columnData5}>{m.sum_price}</div>
                                            <div className={style.columnData5}>30</div>
                                            <div className={style.columnData6}>{m.cancellation_count}</div>
                                            <div className={style.columnData7}>
                                            <button className={style.printBtn} >Late Service! Disappointed</button>
                                        </div>
                                        </div>
                                    )} */}

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
                        // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
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
                        // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                        className={`${style.orderCountHeading} ${style.mediumColoumnWidth}`}
                      >
                        {m.item_count}
                      </div>
                      <div
                        className={`${style.totalAmountHeading} ${style.mediumColoumnWidth}`}
                      >
                  {/* Modified By Pratap sahu on 28-09-2023 Reason:To show Amount&Rating upto 2&1 decimal Values Respectively*/}
                        {m.sum_price}
                        {/* {(m.sum_price).toFixed(2)} */}
                      </div>
                      <div
                        className={`${style.cancellationCountHeading} ${style.mediumColoumnWidth}`}
                        // style={{textAlign:"center"}}
                      >
                        {m.cancellation_count}
                      </div>
                        {/* Added by pratap sahu on 07-10-2023 To display Completed order details */}
                      <div
                        className={`${style.cancellationCountHeading} ${style.mediumColoumnWidth}`}>
                        {m.completion_count}
                      </div>
                      {/* End of code by Pratap sahu on 07-10-2023 */}
                      <div
                        // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                        className={`${style.ratingColumnHeading} ${style.mediumColoumnWidth}`}
                      >
                        {/* {m.average_rating ? m.average_rating : " - "} */}
                        {m.average_rating ? (m.average_rating).toFixed(1) : " - "}
                  {/* End of code by Pratap sahu on 28-09-2023 Reason:To show Amount&Rating upto 2&1 decimal Values Respectively*/}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: "center" }}>No records found!</div>
              )}
            </div>
            {/* end of addition by - suman sahu on 28/08/2023
                                    reason - change layout design */}

            {/* <div className={style.row}>
                                    <div className={style.EmptyText}> No order created yet !</div>
                                </div> */}
          </div>

          {/* </div> */}
          {/* </div> */}
        </div>
      </div>
      {/*
       * Added by - Ashlekh on 15-09-2023
       * Reason - To add pagination
       * */}
      <div className={style.paginationContainer}>
        {reportOrderItem && reportOrderItem.length > 0 ? (
          <div className={style.paginationContent}>
            <Pagination
              defaultCurrent={currentPage}
              current={currentPage}
              simple
              total={backendOrderItemCount}
              defaultPageSize={listPerPage}
              pageSize={listPerPage}
              onChange={handlePageChange}
            />

            <div className={style.dropdown} onClick={toggelDropdown}>
              <button className={style.dropbtn}>
                {listPerPage} / Page{" "}
                <MdArrowDropUp style={{ margin: "5px 0" }} />
              </button>
              <div className={style.dropdown_content} id="dropdown">
                {backendOrderItemCount > 40 ? (
                  <span
                    href="#"
                    onClick={(e) => {
                      setListPerPage(50);
                      setCurrentPage(1);
                      localStorage.setItem("listPerPage", 50);
                    }}
                  >
                    50 / Page
                  </span>
                ) : null}
                {backendOrderItemCount > 30 ? (
                  <span
                    href="#"
                    onClick={(e) => {
                      setListPerPage(40);
                      setCurrentPage(1);
                      localStorage.setItem("listPerPage", 40);
                    }}
                  >
                    40 / Page
                  </span>
                ) : null}
                {backendOrderItemCount > 20 ? (
                  <span
                    href="#"
                    onClick={(e) => {
                      setListPerPage(30);
                      setCurrentPage(1);
                      localStorage.setItem("listPerPage", 30);
                    }}
                  >
                    30 / Page
                  </span>
                ) : null}
                <span
                  href="#"
                  onClick={(e) => {
                    setListPerPage(20);
                    setCurrentPage(1);
                    localStorage.setItem("listPerPage", 20);
                  }}
                >
                  20 / Page
                </span>
                <span
                  href="#"
                  onClick={(e) => {
                    setListPerPage(10);
                    localStorage.setItem("listPerPage", 10);
                  }}
                >
                  10 / Page
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {/*
       * End of code addition by - Ashlekh on 15-09-2023
       * Reason - To add pagination
       * */}
    </div>
    // </Header>
  );
};

export default OrderItemReport;
