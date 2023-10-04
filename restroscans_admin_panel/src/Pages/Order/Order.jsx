/**
 * Created by - Om Shrivastava on 15-06-23
 * Reason - To have order details section
 */

import React, { useEffect, useState } from "react";
import style from "./order.module.css";
import Header from "../GlobalComponent/Header";
import { Pagination } from "antd";
import {
  OrderFilterQueryAPI,
  getDashboardData,
  getOrderCount,
  getOrderItemCountApi,
  getOrderItemDataShowApi,
  getOrderItemsApi,
  getOrdersApi,
} from "../../Api/services";
import {
  BsSortAlphaDownAlt,
  BsSortAlphaDown,
  BsSortNumericDownAlt,
  BsSortNumericDown,
} from "react-icons/bs";

import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdCancel,
  MdCheckCircle,
} from "react-icons/md";

import { Input, Space } from "antd";
import config from "../../Api/config";
import { useNavigate } from "react-router-dom";
import { enableHeader } from "../../App";
import PrintBill from "../Home/components/PrintBill";
import { PrintKot } from "../Home/components/PrintKot";
import DatePicker from "react-date-picker";
import {
  AiFillCalendar,
  AiFillEye,
  AiOutlineCalendar,
  AiOutlineClose,
  AiOutlineSortAscending,
} from "react-icons/ai";
import Loader from "../GlobalComponent/Loader";

const Order = () => {
  /**
   * Added by Yuvraj Sahu on 04-08-2023
   * Reason - to set the date for filter the order list
   */
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  /**
   * End of addition by Yuvraj Sahu on 04-08-2023
   */

  /**
   * Added by Yuvraj Sahu on 19-08-2023
   * Reason - to allow date filter
   */
  const [allDateFilter, setAllDateFilter] = useState(false);
  /**
   * End of addition by Yuvraj Sahu on 19-08-2023
   */

  /**
   * Added by yuvraj Sahu on 07-08-2023
   * Reason - to set the allow filter permission
   */
  const [allowFilter, setAllowFilter] = useState(false);
  /**
   * End of addition by Yuvraj Sahu on 07-08-2023
   */

  /**
   * Added by Yuvraj Sahu on 07-08-2023
   * Reason - to show validation message of filter date
   */
  const [dateValidation, setDateValidation] = useState(false);
  /**
   * End of addition by Yuvraj Sahu on 07-08-2023
   */

  const navigate = useNavigate();

  const [backendOrderCount, setOrderCount] = useState(0);

  var [orders, setOrders] = useState([]);

  // Modified by Rohan Kansari - 22/6/23 - To Get Selected List page from localstorage on Reload
  // const [listPerPage, setListPerPage] = useState(localStorage.getItem(10));
  const [listPerPage, setListPerPage] = useState(
    localStorage.getItem("listPerPage")
  );
  // End of code - ROhan kansari - 22/6/23

  const [columnToSort, setColumnToSort] = useState("order_id");

  // const [columnSortingOrder, setColumnSortingOrder] = useState("ascending");
  const [columnSortingOrder, setColumnSortingOrder] = useState("descending");

  const [showSortingIcon, setShowSortingIcon] = useState(false);

  var [currentPage, setCurrentPage] = useState(1);

  const [searchText, setSearchText] = useState("");
  // Added by Om shrivastava on 01-07-23 Reason : Set the restaurant details
  const [restroDetail, setRestroDetail] = useState(null);
  const [gstFssai, setGstFsaai] = useState(null);
  // End of addition by Om Shrivastava on 01-07-23 Reason : Set the restaurant details

  var [orderItems, setOrderItems] = useState(null);

  var [openActionPopupModal, setOpenActionPopupModal] = useState({});

  const { Search } = Input;

  // Added by Om on 11-09-23
  // Reason : Add Loader whenever the data enter from backend site
  const [isLoader, setIsLoader] = useState(true);
  // End of addition by Om Shrivastava on 11-09-23

  // Added By Rohan Kansari - 22/6/23
  // Reason - To set global Page index Whenever its index updated
  useEffect(() => {
    // Added By Rohan Kansari - 25/6/23
    // Reason - To enable headerSiderbar
    enableHeader();
    // End of code - Rohan kansari - 25/6/23

    if (localStorage.getItem("globalPageIndex")) {
      currentPage = parseInt(localStorage.getItem("globalPageIndex"));
      setCurrentPage(parseInt(localStorage.getItem("globalPageIndex")));
    }
  }, []);
  // End of code - Rohan kansari - 22/6/23

  /**
   * Added by - Om Shrivastava on 15-06-23
   * Reason - method that will execute when page loads. this method will call order list api
   */
  useEffect(() => {
    getCountofOrder();
    // getAllOrder();
    allOrders();

    getOrderItems();
  }, []);

  /**
   * End of code addition by - Om Shrivastava on 15-06-23
   * Reason - method that will execute when page loads. this method will call order list api
   */

  /**
   * Added by - Om Shrivastava on 15-06-23
   * Reason - method that will execute when sorting on column is applied or page number is changed.
   *  this method will call order list api
   */

  useEffect(() => {
    allOrders();
    //Added by ROhan KAnsari - 22/6/23
    // Reason - to set currentpage to global
    localStorage.setItem("globalPageIndex", currentPage);

    // End of code - Rohan Kansari - 22/6/23
    // Commeted and modified by yuvraj Sahu on 07-08-2023
    // Reason - to refresh the api component for api calling
    // }, [columnToSort, columnSortingOrder, currentPage, searchText, listPerPage]);
    setDateValidation(false);
  }, [
    columnToSort,
    columnSortingOrder,
    currentPage,
    searchText,
    listPerPage,
    allowFilter,
  ]);
  // End of modificaion by Yuvraj Sahu on 07-08-2023
  /**
   

   
   * End of code addition by - Om Shrivastava on 15-06-23
   * Reason - method that will execute when sorting on column is applied or page number is changed.
   *  this method will call order list api
   */

  /**
   * Added by - Om Shrivastava on 15-06-23
   * Reason - created api to get count of order
   */

  const getCountofOrder = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await getOrderCount(tenant);
    setOrderCount(response.orderCount);
    // Added by Om Shrivastava on 04-09-23
    // Reason : Set the order item details
    setGstFsaai(response.setting);
    setRestroDetail(response.tenant);
    // console.log(response.order_item)
    setOrderItems(response.order_item);
    // End of addition by Om Shrivastava on 04-09-23
    // Reason : Set the order item details
  };

  /**
   * Added by - Om Shrivastava on 15-06-23
   * Reason - created api to get count of order
   */

  /**
   * Added by - Om Shrivastava on 15-06-23
   * Reason - created api to get list of order
   */

  const allOrders = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const paginationDetails = {
      currentPage: currentPage,
      listPerPage: listPerPage,
    };
    const filteringCriteria = {
      paginationDetails: paginationDetails,
      columnToSort: columnToSort,
      columnSortingOrder: columnSortingOrder,
      /**
       * Commented and modified by - Om Shrivastava on 18-06-23
       * Reason - To trim search text before sending it to backend
       */
      // searchText: searchText,
      searchText: searchText.trim(),
      /**
       * End of code modification and modified by - Om Shrivastava on 18-06-23
       * Reason - To trim search text before sending it to backend
       */
      /**
       * Added by Yuvraj Sahu on 07-08-2023
       * Reason - to filter the order using date wise
       */
      // startDate: fromDate,
      // endDate: toDate
      /**
       * End of addition by Yuvraj Sahu on 07-08-2023
       */
    };

    /**
     * Adde and modified by Yuvraj Sahu on 19-08-2023
     * Reason - to filter allow when we click filter button
     */
    // if (fromDate != null && toDate != null) {
    if (allDateFilter) {
      /**
       * End of modification by Yuvraj Allow date filter apply
       */
      let copyToDate = new Date(toDate);
      copyToDate.setDate(copyToDate.getDate() + 1);

      filteringCriteria["startDate"] = fromDate;
      filteringCriteria["endDate"] = copyToDate;
    }

    var response = await getOrdersApi(tenant, filteringCriteria);
    // Added by Om on 11-09-23
    // Reason : Add Loader whenever the data enter from backend site
    setIsLoader(false);
    // End of addition by Om Shrivastava on 11-09-23
    setOrders(response.orderList);
    // console.log(orders)

    /**
     * Added by - Om Shrivastava on 15-06-23
     * Reason - To recalculate page numbers
     */

    setOrderCount(response.orderListCount);

    /**
     * End of code addition by - Om Shrivastava on 15-06-23
     * Reason - To recalculate page numbers
     */
  };
  /**
   * End of code addition by - Om Shrivastava on 15-06-23
   * Reason - created api to get list of order
   */
  const getOrderItems = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    // const response = await getOrderItemDataShowApi(tenant);
    // setOrderItems(response.orderItemData);
    // Added by Om shrivastava on 01-07-23 Reason : Set the restaurant details
    // Commented by Om Shrivastava on 04-09-23
    // Reason : Currently not use this API
    // const response = await getDashboardData(
    //   JSON.parse(localStorage.getItem("tenantInfo")).tenant_name
    // );
    // if (response) {
    //   setGstFsaai(response.setting);
    //   setRestroDetail(response.tenant);
    //   console.log(response.order_item)
    //   setOrderItems(response.order_item);
    // }
    // End of commented by Om Shrivastava on 04-09-23
    // Reason : Currently not use this API
    // End of addition by Om Shrivastava on 01-07-23 Reason : Set the restaurant details
  };
  // console.log(restroDetail,"orderitem data=====>>>>>")
  /**
   * Added by - Om Shrivastava on 15-06-23
   * Reason -  When user changes page number, this method will set page number which will be sent to backend.
   */
  const handlePageChange = async (pageNumber) => {
    /**
     * Added by Yuvraj Sahu on 11-8-2023
     * Reason - to remove date filter
     */
    /**
     * modified by Yuvraj Sahu on 16-08-2023
     * Reason - to change the filter the
     */
    /**
     * Modified by Yuvraj Sahu on 19-08-2023
     * Reason - to render when click date filter
     */
    // if (pageNumber != 1 && fromDate == null && toDate == null){
    if (allDateFilter == false) {
      /**
       * End of modification by Yuvraj Sahu on 19-08-2023
       */
      setFromDate(null);
      setToDate(null);
    }
    /**
     * End of modification by
     * Yuvraj Sahu on 16-08-2023
     */
    /**
     * End of addition by Yuvraj Sahu on 11-08-2023
     */

    //Added by ROhan KAnsari - 22/6/23
    // Reason - to set currentpage to global
    localStorage.setItem("globalPageIndex", pageNumber);
    // End of code - Rohan Kansari - 22/6/23

    setCurrentPage(pageNumber);
  };
  /**
   * End of code addition by - Om Shrivastava on 15-06-23
   * Reason -  When user changes page number, this method will set page number which will be sent to backend.
   */
  const openMenuDetails = (id) => {
    alert(id);
  };
  /**
   * Added by - Om Shrivastava on 15-06-23
   * Reason - Method that will set sorting criteria
   */

  const sortOrderId = (columnName) => {
    if (columnToSort == columnName) {
      if (columnSortingOrder == "descending") {
        setColumnSortingOrder("ascending");
      } else {
        setColumnSortingOrder("descending");
      }
    }
    setColumnToSort(columnName);
  };

  /**
   * End of code addition by - Om Shrivastava on 15-06-23
   * Reason - Method that will set sorting criteria
   */
  var backgroundColor = 1;

  /**
   * Added by - Om Shrivastava on 15-06-23
   * Reason - Method that will open edit order form of selected order
   */
  const openOrderDetails = (id) => {
    alert(id);
  };

  function ExtractDateTime(format) {
    var d = new Date(format);
    var date = format.substring(0, 10).split("-").reverse().join("/");
    var time = format.substring(11, 19);
    return { date, time };
  }
  /**
   * Added by - Om Shrivastava on 15-06-23
   * Reason - Method that will open edit order form of selected order
   */

  // Added by Rohan kansari - 22/6/23
  // Reason - To toggle dropdown visiblity on click
  function toggelDropdown() {
    if (document.getElementById("dropdown").style.display.length == 0)
      document.getElementById("dropdown").style.display = "block";
    else document.getElementById("dropdown").style.display = "";
  }

  function hideDropdown() {
    /**
     * Added and modified by yuvraj Sahu on 19-08-2023
     * Reason - to remove error when we click no record found
     */
    if (orders && orders.length > 0) {
      document.getElementById("dropdown").style.display = "";
    }
    /**
     * End of amodification by Yuvraj Sahu on 19-08-2023
     */
  }
  // End of code - Rohan Kansari - 22/6/23

  // Added by Om shrivastava on 01-07-23
  // Reason : Need to show the print kot and print bill
  var kotData = {};

  function printKot() {
    var filterKotItems = orderItems.filter((o) => {
      return (
        o.order_id == openActionPopupModal.order_id &&
        o.item_status != "Cancelled"
      );
    });
    var state = {
      order: openActionPopupModal,
      restro_detail: restroDetail,
      orderItem: filterKotItems,
    };

    kotData = state;

    // console.log(kotData)

    function ExtractDateTime(format) {
      var date = format.substring(0, 10);
      var time = format.substring(11, 19);
      return { date, time };
    }

    var a = window.open("", "", "height=800, width=1200");

    a.document.write(
      `<html>
        <head>
        <style>
        
        .container{
            width: 100%;
            height: auto;
            position: relative;
        }


        .kotContainer {
            font-family:monospace;
            letter-spacing: 0.6px;
            width: 300px;   
            height:auto;
            margin:auto auto;
            border-radius: 5px;
            padding: 2px 0;
            overflow-x: hidden;
            padding-bottom: 50px;
            padding-top: 60px;
            border: 1px solid black
        }
        .billingContainer {
            font-family:monospace;
            letter-spacing: 0.6px;
            width: 320px;
            height: auto;
            margin: 0 auto;
            border-radius: 5px;
            padding: 2px 0;
            padding-bottom: 150px;
            border: 1px solid black;
        }
        .inLineContainer {
            min-width: 100%;
            min-height: 10px;
            margin: 4px 5px;
            display: flex;
            justify-content: space-between;
        }
        .Hotellabel{
            min-width: 100%;
            font-size: 17px;
            font-weight: 900;
            padding: 0 3%;
            text-align: center;
        }
        .centerLabel{
            min-width: 100%;
            font-size: 12px;
            font-weight: 700;
            text-align: center;
        }
        .column1{
            min-width:50%;
            display: flex;
        }
        
        .label {
            min-width: 45%;
            font-size: 12px;
            font-weight: 700;
            text-align: start;
            white-space: nowrap;
            display: flex;
            }

        .label1{
            min-width: 32%;
            font-size: 12px;
            font-weight: 700;
            text-align: start;
            white-space: nowrap;
            display: flex;
        }
        
        .text {
            min-width: 50%;
            word-break: break-all;
            font-size: 12px;
            font-weight: 600;
            text-align: left;
        }

        .tableHeader {
            height: 30px;
            width: 95%;
            margin: auto;
            border-top: 1px solid black;
            margin-top: 20px;
            border-bottom: 1px solid black;
            display: flex;
            gap: 8px;
        }
        .serialNo {
            font-size: 12px;
            width: 15%;
            padding: 2% 0%;
            font-weight: 700;
        }
        .titleHeading {
            font-size: 12px;
            width: 67%;
            padding: 2% 0%;
            padding-right: 8%;
            font-weight: 700;
            text-align: start;
        }
        
        .qtyHeading {
            font-size: 12px;
            width: 17%;
            padding: 2% 0% 0% 0%;
            font-weight: 700;
        }
        
        .tableContents {
            min-height: 30px;
            width: 95%;
            margin:0 auto;
            margin: 1px 0;
            display: flex;
            gap: 4px;
        }
        .quantityText {
            font-size: 10px;
            width: 10%;
            padding: 2% 0% 0% 5%;
            font-weight: 600;
        }
        .titleText {
            font-size: 10px;
            width: 70%;
            font-weight: 600;
            padding: 2% 0% 0% 8%;
            text-align:left
        }
        .rateText {
            font-size: 12px;
            width: 15%;
            font-weight: 600;
            text-align: end;
            white-space: nowrap;
            padding: 2% 0% 0% 5%;
            text-align:left
        }
        .totalText {
            font-size: 12px;
            width: 30%;
            padding: 2% 2%;
            font-weight: 700;
            text-align: center;
            white-space: nowrap;
        }
        #line{
            background-color: black;
            height: .5px;
            width: 95%;
            margin: 0 auto;
            border: .5px solid #9c9c9c;
        }

        .btnContainer{
            width: 280px;
            min-height: 40px;
            position: fixed;
            top: 8px;
            left: 0;
            right: 0;
            margin: 0 auto;
            background-color:#fff ;
            display: flex;
            justify-content: space-around;
        }

        .btn{
            width: 45%;
            height: 100%;
            background-color: #185ee0;
            border-radius: 5px;
            color: #e6eef9;
            margin: auto 0;
        }

        .btn:hover{
            background-color: #e6eef9;
            color: #185ee0;
            border: 1px solid #185ee0;
        }
        @media print{
            .btn{
                display: none;
            }

            .kotContainer{
            padding-top: 0;
            }

            .btnContainer{
            display: none;
            }
            @page{margin:0;}
        }
        </style>
        </head>
        <body>
        <div class="container" style={{ paddingBottom: "50px", background: "grey" }} >
            <div class="kotContainer" style={{ background: "white", border: "2px solid black" }}>
                <div class="inLineContainer" >
                    <div class="Hotellabel" style={{ textAlign: "center" }}>
                    ${kotData.restro_detail.name.toUpperCase()}
                    </div>
                </div>
                <hr />
                <div class="inLineContainer">
                    <div class="column1"><div class="label1"><div style={{ width: "90%" }}>Date</div><div>:</div>  </div><div class="text">${new Date(
                      kotData.order.date
                    ).toLocaleDateString("en-GB")}</div></div>
                    <div class="column1"><div class="label"><div style={{ width: "90%" }}>Time</div><div>:</div> </div><div class="text"> ${
                      ExtractDateTime(kotData.order.date).time
                    }</div></div>
                </div>
                <div class="inLineContainer">
                    <div class="column1"><div class="label1"><div style={{ width: "90%" }}>Order id</div><div>:</div>  </div><div class="text"> ${
                      kotData.order.order_id
                    }</div></div>
                    <div class="column1"><div class="label"><div style={{ width: "90%" }}>Table</div><div>:</div>  </div><div class="text">${
                      !kotData.order.table_number
                        ? "N/A"
                        : kotData.order.table_number
                    }</div></div>

                </div>
                <div class="tableHeader">
                    <div class="serialNo"> SNo   </div>
                    <div class="titleHeading">Item Name</div>
                    <div class="qtyHeading">   Qty   </div>
                </div>` +
        kotData.orderItem
          .map(
            (item, i) =>
              `<div class="tableContents">
                        <div class="quantityText">${i + 1}</div>
                        <div class="titleText">${item.item} (${
                item.serving_size
              })</div>
                        <div class="rateText">${item.quantity}</div>
                    </div>`
          )
          .join("") +
        `</div>
               
        </div>
        </body>
        </html>`
    );
    a.document.close();

    if (filterKotItems.length > 0) a.print();
    a.close();
  }

  /**
   * Added by Yuvraj Sahu on 04-08-2023
   * Reason - to filter the order by date
   */
  const handleFilterData = async () => {
    if (fromDate == null || toDate == null) {
      setDateValidation(true);
    } else {
      /**
       * Added by Yuvraj Sahu on 19-08-2023
       * Reason - to filter date allow
       */
      setAllDateFilter(true);
      /**
       * End of addition by yuvraj Sahu on 19-08-2023
       */
      setDateValidation(false);
      /**
       * Added by yuvraj sahu on 16-08-2023
       * Reason - to set the first page when filter apply
       */
      if (currentPage != 1) {
        /**
         * Added and modified by yuvraj Sahu on 20-08-2023
         * Reason - to set first page when apply filter
         */
        localStorage.setItem("globalPageIndex", 1);
        setCurrentPage(1);
        /**
         * End of addition by yuvraj Sahu on 20-08-2023
         */
      } else {
        setAllowFilter(!allowFilter);
      }
      /**
       * End of addition by yuvraj Sahu on 16-08-2023
       */
    }
    // const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    // const queryData = {
    //   dateTo: toDate,
    //   dateFrom: fromDate,
    //   // amountSort: isAmountSort,
    //   amountSort: true,
    //   pageIndex: 1
    // }
    // console.log(queryData)
    // await OrderFilterQueryAPI(tenant, queryData).then(r => {
    //   // setOrder(r)
    //   setOrders(r)
    //   console.log(r)
    // })
  };

  const handleClearFilter = () => {
    setFromDate(null);
    setToDate(null);

    document.getElementById("fromDate").value = "";
    document.getElementById("toDate").value = "";
    /**
     * Added by Yuvraj Sahu on 20-08-2023
     * Reason - to all the date filteration
     */
    setAllDateFilter(false);
    handlePageChange(1);
    /**
     * End addition by Yuvraj Sahu on 20-08-2023
     */
    setAllowFilter(!allowFilter);
  };
  /**
   * End of addition by Yuvraj Sahu on 04-08-2023
   */

  return (
    // Modified by Rohan Kansari - 25/6/23
    // Reason - removing header from each page and making it global
    // <Header>
    <div className={style.container}>
      <div className={`${style.pageTitleContainer}`}>
        <div className={style.pageTitle}>Order</div>
      </div>
      {/* // Addition by Om Shrivastava on 11-09-23
    // Reason : Apply the loader in order list page */}
      {isLoader == true ? <Loader/> :  
    <div >
      {/* End of addition by Om Shrivastava on 11-09-23
    // Reason : Apply the loader in order list page */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          padding: "4px",
        }}
      >
        <Search
          placeholder="Search by Order id, Table no, Order status and Payment status"
          allowClear
          enterButton
          onSearch={(value) => {
            setCurrentPage(1);
            setSearchText(value);
          }}
          style={{
            width: "45%",
          }}
        />
      </div>

      {/* Added by Yuvraj Sahu on 04-08-2023
              Reason - to design filter variable */}
      {/* Modified by Yuvraj Sahu on 07-08-2023
              Reason - to design and validation apply in date */}
      <div className={style.dateFilterContainer}>
        <div className={style.filterButtonContainer}>
          <div className={style.dateContainer}>
            <div className={style.datepicker1}>
              {/* <DatePicker
                        calendarClassName={style.calendar}
                        className={style.dateInput}
                        calendarIcon={<AiOutlineCalendar />}
                        clearIcon={<AiOutlineClose />}
                        onChange={setFromDate}
                        // Added by yuvraj Sahu on 07-08-2023
                        // Reason - to validate the date 
                        value={fromDate}
                   
                        format="dd/MM/yyyy"
                        maxDate={new Date()}
                        // end of addition by yuvraj Sahu on 07-08-2023
                      /> */}
              <input
                type="date"
                // min={fromDate == null ? null : fromDate.toISOString().split("T")[0]}
                // min={new Date().toISOString().split("T")[0]}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  setFromDate(new Date(e.target.value));
                  setDateValidation(false);
                }}
                style={{
                  border: "1px solid",
                  padding: "2px",
                  borderRadius: "5px",
                }}
                // defaultValue="dd-mm-yyyy"
                id="fromDate"
                className={style.calendar}
              />
            </div>
            <div className={style.datepicker1}>
              <input
                type="date"
                // min={fromDate == null ? null : fromDate.toISOString().split("T")[0]}
                min={
                  fromDate != null
                    ? fromDate.getFullYear() +
                      "-" +
                      ("0" + (fromDate.getMonth() + 1)).slice(-2) +
                      "-" +
                      ("0" + fromDate.getDate()).slice(-2)
                    : null
                }
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  setToDate(new Date(e.target.value));
                  setDateValidation(false);
                }}
                style={{
                  border: "1px solid",
                  padding: "2px",
                  borderRadius: "5px",
                }}
                // defaultValue="dd-mm-yyyy"
                id="toDate"
                disabled={fromDate != null ? false : true}
                className={style.calendar}
              />
              {/* <DatePicker
                        calendarClassName={style.calendar}
                        className={style.dateInput}
                        calendarIcon={<AiOutlineCalendar />}
                        clearIcon={<AiOutlineClose />}
                        
                        // onChange={setToDate}
                        onChange={(value)=> {setToDate(value); setDateValidation(false);}}
                        // Added by yuvraj Sahu on 07-08-2023
                        // Reason - to validate the date 
                        value={toDate}
                        maxDate={new Date()}
                        minDate={fromDate}
                        disabled={fromDate != null ? false : true}
                        format="dd/MM/yyyy"
                        // end of addition by yuvraj Sahu on 07-08-2023
                        /> */}
            </div>
          </div>
          <div className={style.dateValidation}>
            {dateValidation && "Please enter start and end date!"}{" "}
          </div>
        </div>
        <div className={style.filterButtonContainer}>
          <button
            onClick={handleFilterData}
            className={style.filterButtonSpace}
          >
            Filter
          </button>
          <button
            onClick={handleClearFilter}
            className={style.filterButtonSpace}
          >
            Clear filter
          </button>
        </div>
        {/* End of additin by Yuvraj Sahu on 07-08-2023 */}
      </div>
      {/* End of addition by Yuvraj Sahu on 04-08-2023 */}

      <div className={style.orderListSection}>
        <div className={style.tableContainer}> 
          <div className={style.table}>
            <div
              className={style.tableHeadingContainer}
              // Added by Rohan Kansari - 22/6/23
              // Reason- To hide page size dropdown on outer click
              // Commented by Om Shrivastava on 15-09-23
              // Reason : No need to use this method here
              // onClick={hideDropdown}
              // onTouchStart={hideDropdown}
              // Commented by Om Shrivastava on 15-09-23
              // Reason : No need to use this method here
              // End of code - ROhan KAnsari - 22/6/23
            >
              {/* Modified by Rohan kansari - 25/8/23 
                                Reason - To change column width according to columns needs*/}
              <div
                // className={`${style.commonColumnTitle} ${style.smallColumnWidth} ${style.sNoColumn}`}
                className={style.sNoColumn}
              >
                S.No{" "}
              </div>
              <div
                // className={`${style.commonColumnTitle} ${style.smallColumnWidth}`}
                className={style.actionColumn}
              >
                Action
              </div>
              <div
                // className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                className={style.OrderIdColumn}
                onClick={(e) => {
                  setShowSortingIcon(false);
                  sortOrderId("order_id");
                }}
                onMouseEnter={(e) => {
                  if (columnToSort != "order_id") {
                    // Modification and addition by Om Shrivastava on 15-09-23
                    // Reason : Need to fix the blinking issue
                    // setShowSortingIcon(true);
                    setShowSortingIcon("order_id");
                    // End of modification and addition by Om Shrivastava on 15-09-23
                    // Reason : Need to fix the blinking issue

                  }
                }}
                onMouseLeave={(e) => {
                  if (columnToSort != "order_id") {
                    // setShowSortingIcon(false);
                    setShowSortingIcon("");

                  }
                }}
              >
                Order ID{" "}
                {columnToSort == "order_id" &&
                  columnSortingOrder == "ascending" && (
                    <BsSortNumericDown className={style.sortingIcon} />
                  )}
                {columnToSort == "order_id" &&
                  columnSortingOrder == "descending" && (
                    <BsSortNumericDownAlt className={style.sortingIcon} />
                  )}
                  {/* // Modification and addition by Om Shrivastava on 15-09-23
                    // Reason : Need to fix the blinking issue */}
                {/* {columnToSort != "order_id" && showSortingIcon && ( */}
                {columnToSort != "order_id" && showSortingIcon=="order_id" && (
                // End of modification and addition by Om Shrivastava on 15-09-23
                    // Reason : Need to fix the blinking issue
                  <BsSortNumericDown
                    color="grey"
                    className={style.sortingIcon}
                  />
                )}
              </div>
              {/* End of modifciation by Om Shrivastava on 21-06-23 */}
              <div
                // className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                className={style.tableNoColumn}
                onClick={(e) => {
                  setShowSortingIcon(false);
                  sortOrderId("table_number");
                }}
                onMouseEnter={(e) => {
                  if (columnToSort != "table_number") {
                    {/* // Modification and addition by Om Shrivastava on 15-09-23
                    // Reason : Need to fix the blinking issue */}
                    // setShowSortingIcon(true);
                    setShowSortingIcon("table_number");
                    {/* // End of modification and addition by Om Shrivastava on 15-09-23
                    // Reason : Need to fix the blinking issue */}
                  }
                }}
                onMouseLeave={(e) => {
                  if (columnToSort != "table_number") {
                    {/* // Modification and addition by Om Shrivastava on 15-09-23
                    // Reason : Need to fix the blinking issue */}
                    // setShowSortingIcon(false);
                    setShowSortingIcon("");
                    {/* // End of modification and addition by Om Shrivastava on 15-09-23
                    // Reason : Need to fix the blinking issue */}

                  }
                }}
              >
                Table No{" "}
                {columnToSort == "table_number" &&
                  columnSortingOrder == "ascending" && (
                    <BsSortNumericDown className={style.sortingIcon} />
                  )}
                {columnToSort == "table_number" &&
                  columnSortingOrder == "descending" && (
                    <BsSortNumericDownAlt className={style.sortingIcon} />
                  )}
                  {/* // Modification and addition by Om Shrivastava on 15-09-23
                    // Reason : Need to fix the blinking issue */}
                {/* {columnToSort != "table_number" && showSortingIcon && ( */}
                {columnToSort != "table_number" && showSortingIcon=="table_number" && (
                  // {/* // End of modification and addition by Om Shrivastava on 15-09-23
                  //   // Reason : Need to fix the blinking issue */}

                  <BsSortNumericDown
                    color="grey"
                    className={style.sortingIcon}
                  />
                )}
              </div>

              <div
                // className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                className={style.orderStatusColumn}
                onClick={(e) => {
                  setShowSortingIcon(false);
                  sortOrderId("order_status");
                }}
                onMouseEnter={(e) => {
                  if (columnToSort != "order_status") {
                    {/* // Modification and addition by Om Shrivastava on 15-09-23
                    // Reason : Need to fix the blinking issue */}
                    // setShowSortingIcon(true);
                    setShowSortingIcon("order_status");
                    {/* //End of Modification and addition by Om Shrivastava on 15-09-23
                    // Reason : Need to fix the blinking issue */}

                  }
                }}
                onMouseLeave={(e) => {
                  if (columnToSort != "order_status") {
                    {/* // Modification and addition by Om Shrivastava on 15-09-23
                    // Reason : Need to fix the blinking issue */}
                    // setShowSortingIcon(false);
                    setShowSortingIcon("");
                    {/* // End of modification and addition by Om Shrivastava on 15-09-23
                    // Reason : Need to fix the blinking issue */}

                  }
                }}
              >
                {" "}
                Order Status
                {columnToSort == "order_status" &&
                  columnSortingOrder == "ascending" && (
                    <BsSortAlphaDown className={style.sortingIcon} />
                  )}
                {columnToSort == "order_status" &&
                  columnSortingOrder == "descending" && (
                    <BsSortAlphaDownAlt className={style.sortingIcon} />
                  )}
                {/* {columnToSort != "order_status" && showSortingIcon && ( */}
                {columnToSort != "order_status" && showSortingIcon== "order_status"&& (

                  <BsSortAlphaDown color="grey" className={style.sortingIcon} />
                )}
              </div>

              <div
                // className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                className={style.paymentStatusColumn}
                // Added by Om Shrivatava on 16-06-23
                // Reason : Apply sorting through the payment status
                // onClick={(e) => {
                //   setShowSortingIcon(false);
                //   sortOrderId("payment_status");
                // }}
                // onMouseEnter={(e) => {
                //   if (columnToSort != "payment_status") {
                //     setShowSortingIcon(true);
                //   }
                // }}
                // onMouseLeave={(e) => {
                //   if (columnToSort != "payment_status") {
                //     setShowSortingIcon(false);
                //   }
                // }}
                onClick={(e) => {
                  setShowSortingIcon(false);
                  sortOrderId("payment_status");
                }}
                onMouseEnter={(e) => {
                  if (columnToSort != "payment_status") {
                    {/* // Modification and addition by Om Shrivastava on 15-09-23
                    // Reason : Need to fix the blinking issue */}
                    // setShowSortingIcon(true);
                    setShowSortingIcon("payment_status");
                    {/* // End of modification and addition by Om Shrivastava on 15-09-23
                    // Reason : Need to fix the blinking issue */}

                  }
                }}
                onMouseLeave={(e) => {
                  if (columnToSort != "payment_status") {
                    {/* // Modification and addition by Om Shrivastava on 15-09-23
                    // Reason : Need to fix the blinking issue */}
                    // setShowSortingIcon(false);
                    setShowSortingIcon("");
                    {/* // End of modification and addition by Om Shrivastava on 15-09-23
                    // Reason : Need to fix the blinking issue */}

                  }
                }}
                // End of addition by Om Shrivastava on 16-06-23
              >
                Payment Status
                {/* // Added by Om Shrivatava on 16-06-23
                  // Reason : Apply sorting through the payment status */}
                {/* {columnToSort == "payment_status" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortAlphaDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "payment_status" &&
                    columnSortingOrder == "descending" && (
                      <BsSortAlphaDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "payment_status" && showSortingIcon && (
                    <BsSortAlphaDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )} */}
                {columnToSort == "payment_status" &&
                  columnSortingOrder == "ascending" && (
                    <BsSortAlphaDown className={style.sortingIcon} />
                  )}
                {columnToSort == "payment_status" &&
                  columnSortingOrder == "descending" && (
                    <BsSortAlphaDownAlt className={style.sortingIcon} />
                  )}
                  {/* // Modification and addition by Om Shrivastava on 15-09-23
                    // Reason : Need to fix the blinking issue */}
                {/* {columnToSort != "payment_status" && showSortingIcon && ( */}
                {columnToSort != "payment_status" && showSortingIcon== "payment_status" && (
// {/* // End of modification and addition by Om Shrivastava on 15-09-23
//                     // Reason : Need to fix the blinking issue */}
                  <BsSortAlphaDown color="grey" className={style.sortingIcon} />
                )}
                {/* // End of addition by Om Shrivastava on 16-06-23 */}
              </div>

              {/* <div
                className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
              >
                Discount
              </div>
              <div
                className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
              >
                Loyality
              </div> */}
              <div className={style.subtotalColumn}>Sub-Total</div>
              <div
                // className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                className={style.cgstColumn}
              >
                CGST
              </div>
              <div
                // className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                className={style.sgstColumn}
              >
                SGST
              </div>
              <div
                // className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                className={style.finalRupees}
              >
                Final Amount
              </div>
              <div
                // className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                className={style.dateColumn}
                onClick={(e) => {
                  setShowSortingIcon(false);
                  sortOrderId("date");
                }}
                onMouseEnter={(e) => {
                  if (columnToSort != "date") {
                    {/* // Modification and addition by Om Shrivastava on 15-09-23
                    // Reason : Need to fix the blinking issue */}
                    // setShowSortingIcon(true);
                    setShowSortingIcon("date");
                    {/* // End of modification and addition by Om Shrivastava on 15-09-23
                    // Reason : Need to fix the blinking issue */}

                  }
                }}
                onMouseLeave={(e) => {
                  if (columnToSort != "date") {
                    {/* // Modification and addition by Om Shrivastava on 15-09-23
                    // Reason : Need to fix the blinking issue */}
                    // setShowSortingIcon(false);
                    setShowSortingIcon("");
                    // End of modification and addition by Om Shrivastava on 15-09-23
                    // Reason : Need to fix the blinking issue */}

                  }
                }}
              >
                Date
                {columnToSort == "date" &&
                  columnSortingOrder == "ascending" && (
                    <BsSortNumericDown className={style.sortingIcon} />
                  )}
                {columnToSort == "date" &&
                  columnSortingOrder == "descending" && (
                    <BsSortNumericDownAlt className={style.sortingIcon} />
                  )}
                  {/* // Modification and addition by Om Shrivastava on 15-09-23
                    // Reason : Need to fix the blinking issue */}
                {/* {columnToSort != "date" && showSortingIcon && ( */}
                {columnToSort != "date" && showSortingIcon== "date" && (
              // {/* // End of modification and addition by Om Shrivastava on 15-09-23
              // // Reason : Need to fix the blinking issue */}
                  <BsSortNumericDown
                    color="grey"
                    className={style.sortingIcon}
                  />
                )}
              </div>
              <div
                // className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                className={style.totalColumn}
              >
                Time
              </div>
              <div
                // className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                className={style.discountColumn}
              >
                Get Bill
              </div>
              <div
                // className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                className={style.loayltyColumn}
              >
                Get KOT
              </div>
            </div>
            {/* End of addition by Om shrivastava on 01-07-23 */}
            <div
              className={style.tableDataContainer}
              style={{
                backgroundColor: "#efefef",
              }}
              // Added by Rohan Kansari - 22/6/23
              // Reason- To hide page size dropdown on outer click
              // onClick={hideDropdown}
              // onTouchStart={hideDropdown}
              // End of code - ROhan KAnsari - 22/6/23
            >
              {orders && orders.length > 0 ? (
                orders.map((orderDetail, index) => {
                  return (
                    <div
                      key={index}
                      className={style.tableData}
                      style={{
                        padding: "2px",
                        marginTop: "2px",
                        marginBottom:
                          orders.length == index + 1 ? "2px" : "0px",
                        // Added by :- Parineeta Gedam on 06-08-2023 reason :- Add color in rows.
                        background:
                          backgroundColor++ % 2 == 0 ? "white" : "#1677ff14",
                        // End of Added by :- Parineeta Gedam on 06-08-2023 reason :- Add color in rows.
                      }}
                    >
                      <div
                        // className={`${style.commonColumnData} ${style.smallColumnWidth}`}
                        // className={style.sNoColumn}
                        className={`${style.sNoColumn} ${style.commonColumnData} `}
                      >
                        {/* Added by Rohan kansari - 23/6/23 
                              Reason - Serial no. impact from list perpage so i set serial no. according to list per page */}
                        {currentPage * listPerPage - listPerPage + index + 1}
                        {/* End of code- Rohan Kansari - 23/6/23 */}
                      </div>
                      <div
                        // className={`${style.commonColumnData} ${style.smallColumnWidth} ${style.eyeIcon}`}
                        className={`${style.actionColumn} ${style.commonColumnData} `}

                        // onClick={(e) => {
                        //   showModal(orderDetail);
                        // }}
                      >
                        <AiFillEye
                          style={{ fontSize: 15, color: "rgb(24, 94, 224)" }}
                          onClick={() => {
                            navigate(`/update-order/${orderDetail.id}`, {
                              state: { id: orderDetail.id },
                            });
                          }}
                        />
                      </div>

                      <div
                        // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                        className={`${style.OrderIdColumn} ${style.commonColumnData} `}

                        // Modification and added by Om Shrivastava on 27-06-23
                        // Reason : Need to remove onclick by div than added in span tag

                        // onClick={() => {
                        //   navigate(`/update-order/${orderDetail.id}`, {
                        //     state: { id: orderDetail.id },
                        //    });
                        // }}
                      >
                        {/* <span
                        // onClick={() => {
                        //     navigate(`/update-order/${orderDetail.id}`, {
                        //         state: { id: orderDetail.id },
                        //     });
                        // }}
                        > */}
                          {" "}
                          {orderDetail.order_id}
                        {/* </span> */}
                      </div>
                      {/* End of addition by Om Shrivastava on 27-06-23 Reason : Need to remove onclick by div than added in span tag*/}

                      {/* End of Modification by Om Shrivastava on 21-06-23 */}
                      {/* Modofication by Om Shrivastava on 21-06-23 because need to change the sequence of table number and order id  */}
                      <div
                        // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                        className={`${style.tableNoColumn} ${style.commonColumnData} `}

                        // Added by Om Shrivastava on 21-06-23
                        // Reason : Need to navigate when user click the table no
                        // onClick={() => {
                        //     navigate(`/update-order/${orderDetail.id}`, {
                        //         state: { id: orderDetail.id },
                        //     });
                        // }}
                        // End of addition by Om Shrivastava on 21-06-23
                      >
                        {/* <span
                        // onClick={() => {
                        //     navigate(`/update-order/${orderDetail.id}`, {
                        //         state: { id: orderDetail.id },
                        //     });
                        // }}
                        > */}
                          {" "}
                          {orderDetail.table_number}{" "}
                        {/* </span> */}
                        {/* End of addition by Om Shrivastava on 27-06-23 Reason : Need to remove onclick by div than added in span tag*/}
                      </div>

                      <div
                        // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                        className={`${style.orderStatusColumn} ${style.commonColumnData} `}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {orderDetail.order_status}
                        {/* <div
                                                    className={` ${style.primaryButton}`}
                                                    onClick={() => openOrderDetails(orderDetail.id)}
                                                >
                                                    View
                                                </div> */}
                      </div>
                      <div
                        // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                        className={`${style.paymentStatusColumn} ${style.commonColumnData} `}
                      >
                        {orderDetail.payment_status}
                      </div>

                      {/* <div
                        className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                      >
                        {(orderDetail.discount_rupees).toFixed(2)}
                      </div>
                      <div
                        className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                      >
                        {orderDetail.loyality_point_price}
                      </div>
                       */}
                      <div
                        // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                        className={`${style.subtotalColumn} ${style.commonColumnData} `}
                      >
                      {/* Modified by pratap sahu on 28-09-2023 Reason:to display upto 2decimals */}
                        {/* {orderDetail.sub_total} */}
                        {(orderDetail.sub_total).toFixed(2)}
                      </div>
                      <div
                        // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                        className={`${style.cgstColumn} ${style.commonColumnData} `}
                      >
                        {/* {orderDetail.cgst} */}
                        {(orderDetail.cgst).toFixed(2)}
                      </div>
                      <div
                        // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                        className={`${style.sgstColumn} ${style.commonColumnData} `}
                      >
                        {/* {orderDetail.sgst} */}
                        {(orderDetail.sgst).toFixed(2)}
                      </div>
                      <div
                        // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                        className={`${style.finalRupees} ${style.commonColumnData} `}
                      >
                         {/* {orderDetail.final_amount} */}
                        {(orderDetail.final_amount).toFixed(2)}
                        {/*End of Code by pratap sahu on 28-09-2023 Reason:to display upto 2decimals */}
                      </div>
                      <div
                        // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                        className={`${style.dateColumn} ${style.commonColumnData} `}
                      >
                        {ExtractDateTime(orderDetail.date).date}
                      </div>
                      <div
                        // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                        className={`${style.totalColumn} ${style.commonColumnData} `}
                      >
                        {ExtractDateTime(orderDetail.date).time}
                      </div>
                      {/* <div
                        className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                      >
                        {orderDetail.sub_total}
                      </div> */}
                      <div
                        //  className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                        className={`${style.discountColumn} ${style.commonColumnData} `}
                      >
                        {orderDetail.payment_status == "Completed" &&
                        orderDetail.order_status != "Cancelled" ? (
                          <div
                            style={{
                              backgroundColor: "green",
                              color: "white",
                              padding: "3px 8px",
                              borderRadius: "50px",
                              cursor: "pointer",
                              fontSize: "10px",
                            }}
                            onClick={(e) => {
                              openActionPopupModal = orderDetail;
                              setOpenActionPopupModal(orderDetail);
                              // console.log(openActionPopupModal,orderItems.filter((o) => { return o.order_id == openActionPopupModal.order_id }));
                              PrintBill(
                                openActionPopupModal,
                                orderItems?.filter((o) => {
                                  return (
                                    o.order_id == openActionPopupModal.order_id
                                  );
                                }),
                                restroDetail,
                                gstFssai
                              );
                            }}
                            // navigate("/Billing", { state: { "gstFssai": gstFssai, "restro_detail": restroDetail, "order": openActionPopupModal, "orderItem": orderItems.filter((o) => { return o.order_id == openActionPopupModal.order_id }) } })
                          >
                            {" "}
                            Get Bill
                          </div>
                        ) : (
                          "---"
                        )}
                      </div>
                      {/* <div
                        className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                      >
                        {orderDetail.total}
                      </div> */}
                      <div
                        // className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                        className={`${style.loayltyColumn} ${style.commonColumnData} `}
                      >
                        {orderDetail.order_status != "Placed" &&
                        orderDetail.order_status != "Cancelled" ? (
                          <div
                            style={{
                              backgroundColor: "green",
                              color: "white",
                              padding: "3px 8px",
                              borderRadius: "50px",
                              cursor: "pointer",
                              fontSize: "10px",
                            }}
                            // Modified by Rohan kansari- 4/8/23
                            // Reason - To remove cancelled item from kot
                            // onClick={e =>{openActionPopupModal=orderDetail; setOpenActionPopupModal(orderDetail); navigate("/kot", { state: { "gstFssai": gstFssai, "restro_detail": restroDetail, "order":openActionPopupModal, "orderItem": orderItems.filter((o) => { return o.order_id == openActionPopupModal.order_id }) } })} }
                            onClick={(e) =>
                              PrintKot(
                                orderDetail,
                                orderItems?.filter(
                                  (o) =>
                                    o.item_status != "cancelled" &&
                                    o.order_id == orderDetail.order_id
                                ),
                                restroDetail,
                                gstFssai
                              )
                            }
                            // onClick={e => {openActionPopupModal=orderDetail; setOpenActionPopupModal(orderDetail); printKot() }}
                          >
                            {" "}
                            Print KOT
                          </div>
                        ) : (
                          "---"
                        )}

                        {/* End of code - Rohan kansari - 4/8/23 - To remove cancelled item from kot  */}
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

      <div className={style.paginationContainer}>
        {orders && orders.length > 0 ? (
          // Modified by Rohan kansari - 22/6/23
          // Reason - To divide container into two part for page selector
          <div className={style.paginationContent}>
            <Pagination
              // Modified by Rohan Kansari- 22/6/23
              defaultCurrent={currentPage}
              current={currentPage}
              simple
              total={backendOrderCount}
              defaultPageSize={listPerPage}
              // To set page per item
              pageSize={listPerPage}
              onChange={handlePageChange}
            />

            <div className={style.dropdown} onClick={toggelDropdown}>
              <button className={style.dropbtn}>
                {listPerPage} / Page{" "}
                <MdArrowDropUp style={{ margin: "5px 0" }} />
              </button>
              <div className={style.dropdown_content} id="dropdown">
                {/* Modified by ROhan kansari - 26/6/23 
                      Reason - To change condition for showing list */}
                {backendOrderCount > 40 ? (
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
                {backendOrderCount > 30 ? (
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
                {backendOrderCount > 20 ? (
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
                {/* End of code - Rohan kansari - 26/6/23 */}
              </div>
            </div>
          </div>
        ) : // End of code - Modification - 22/6/23 - Rohan Kansari
        // Reason - To separate div and add Selection box for page item size
        null}
      </div>
      {/* // Addition by Om Shrivastava on 11-09-23
    // Reason : Apply the loader in order list page */}
    </div>
    }
{/* // End of addition by Om Shrivastava on 11-09-23
    // Reason : Apply the loader in order list page */}
    </div>

    // </Header>
  );
};

export default Order;
