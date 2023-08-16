/**
 * Created by - Om Shrivastava on 30-06-23
 * Reason - To have order item details section
 */

import React, { useEffect, useState } from "react";
import style from "./orderitem.module.css";
import Header from "../GlobalComponent/Header";
import { Pagination } from "antd";
import { getOrderItemCountApi, getOrdersItemDetailApi } from "../../Api/services";
import {
  BsSortAlphaDownAlt,
  BsSortAlphaDown,
  BsSortNumericDownAlt,
  BsSortNumericDown,
} from "react-icons/bs";

import { MdArrowDropDown, MdArrowDropUp, MdCancel, MdCheckCircle } from "react-icons/md";

import { Input, Space } from "antd";
import config from "../../Api/config";
import { useNavigate } from "react-router-dom";
import { enableHeader } from "../../App";
import DatePicker from 'react-date-picker';
import { AiFillCalendar, AiOutlineCalendar, AiOutlineClose, AiOutlineSortAscending } from 'react-icons/ai';



const OrderItem = () => {

  const navigate = useNavigate();

  /**
   * Added by Yuvraj Sahu on 07-08-2023
   * Reason - to set the date for filter the order list
   */
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  /**
   * End of addition by Yuvraj Sahu on 07-08-2023
   */

  /**
   * Added by Yuvraj Sahu on 07-08-2023
   * Reason - to show validation message of filter date
   */
  const [dateValidation, setDateValidation] = useState(false)
  /**
   * End of addition by Yuvraj Sahu on 07-08-2023
   */

   /**
   * Added by yuvraj Sahu on 07-08-2023
   * Reason - to set the allow filter permission
   */
   const [allowFilter, setAllowFilter] = useState(false)
   /**
    * End of addition by Yuvraj Sahu on 07-08-2023
    */


  const [backendOrderItemCount, setOrderItemCount] = useState(0);

  var [orderItems, setOrderItems] = useState([]);

  // Modified by Rohan Kansari - 22/6/23 - To Get Selected List page from localstorage on Reload 
  // const [listPerPage, setListPerPage] = useState(localStorage.getItem(10));
  const [listPerPage, setListPerPage] = useState(localStorage.getItem("listPerPage"));
  // End of code - ROhan kansari - 22/6/23

  // # Commented and modified by :- Parineeta gedam on 28-07-2023 
  // # reason :- When we run the 3rd flow of "Add more item" functionality then same items is not display in admin JS.  
           
  // const [columnToSort, setColumnToSort] = useState("order_id");
  const [columnToSort, setColumnToSort] = useState("");

  // # End of Commented and modified by :- Parineeta gedam on 28-07-2023 
  // # reason :- When we run the 3rd flow of "Add more item" functionality then same items is not display in admin JS

  // const [columnSortingOrder, setColumnSortingOrder] = useState("ascending");
  const [columnSortingOrder, setColumnSortingOrder] = useState("descending");

  const [showSortingIcon, setShowSortingIcon] = useState(false);

  var [currentPage, setCurrentPage] = useState(1);

  const [searchText, setSearchText] = useState("");

  const { Search } = Input;

  // Added By Rohan Kansari - 22/6/23
  // Reason - To set global Page index Whenever its index updated
  useEffect(() => {
    // Added By Rohan Kansari - 25/6/23
    // Reason - To enable headerSiderbar
    enableHeader()
    // End of code - Rohan kansari - 25/6/23

    if (localStorage.getItem("globalPageIndex")) {
      currentPage =parseInt(localStorage.getItem("globalPageIndex"))
      setCurrentPage(parseInt(localStorage.getItem("globalPageIndex")))
    }

  }, [])
  // End of code - Rohan kansari - 22/6/23


  /**
   * Added by - Om Shrivastava on 30-06-23
   * Reason - method that will execute when page loads. this method will call order list api
   */
  useEffect(() => {
    getCountofOrderItem();
    allOrderItems();
  }, []);

  /**
   * End of code addition by - Om Shrivastava on 30-06-23
   * Reason - method that will execute when page loads. this method will call order list api
   */

  /**
   * Added by - Om Shrivastava on 30-06-23
   * Reason - method that will execute when sorting on column is applied or page number is changed.
   *  this method will call order list api
   */

  useEffect(() => {
    allOrderItems();
     //Added by ROhan KAnsari - 22/6/23
    // Reason - to set currentpage to global
    localStorage.setItem("globalPageIndex", currentPage)
    
    // End of code - Rohan Kansari - 22/6/23

    // Commeted and modified by yuvraj Sahu on 07-08-2023
    // Reason - to refresh the api component for api calling
  // }, [columnToSort, columnSortingOrder, currentPage, searchText, listPerPage]);
    setDateValidation(false)
  }, [columnToSort, columnSortingOrder, currentPage, searchText, listPerPage, allowFilter]);
   // End of modificaion by Yuvraj Sahu on 07-08-2023

  /**
   

   
   * End of code addition by - Om Shrivastava on 30-06-23
   * Reason - method that will execute when sorting on column is applied or page number is changed.
   *  this method will call order list api
   */

  /**
   * Added by - Om Shrivastava on 30-06-23
   * Reason - created api to get count of order
   */

  const getCountofOrderItem = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await getOrderItemCountApi(tenant);
    setOrderItemCount(response.orderItemCount);
  };

  /**
   * Added by - Om Shrivastava on 30-06-23
   * Reason - created api to get count of order
   */

  /**
   * Added by - Om Shrivastava on 30-06-23
   * Reason - created api to get list of order
   */

  const allOrderItems = async () => {

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
       * Commented and modified by - Om Shrivastava on 30-06-23
       * Reason - To trim search text before sending it to backend
       */
      // searchText: searchText,
      searchText: searchText.trim(),
      /**
       * End of code modification and modified by - Om Shrivastava on 30-06-23
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

    if (fromDate != null && toDate != null) {
      filteringCriteria["startDate"] = fromDate;
      filteringCriteria["endDate"] = toDate
    }

    var response = await getOrdersItemDetailApi(tenant, filteringCriteria);
    setOrderItems(response.orderItemList);

    /**
     * Added by - Om Shrivastava on 30-06-23
     * Reason - To recalculate page numbers
     */

    setOrderItemCount(response.orderItemListCount)

    /**
     * End of code addition by - Om Shrivastava on 30-06-23
     * Reason - To recalculate page numbers
     */
  };
  /**
   * End of code addition by - Om Shrivastava on 30-06-23
   * Reason - created api to get list of order
   */

  /**
   * Added by - Om Shrivastava on 30-06-23
   * Reason -  When user changes page number, this method will set page number which will be sent to backend.
   */
  const handlePageChange = async (pageNumber) => {

    /**
     * Added by Yuvraj Sahu on 16-08-2023
     * Reason - to change the remove the filter
     */
    if (pageNumber != 1){
      setFromDate(null)
      setToDate(null)
    }
    /**
     * End of modification by 
     * Yuvraj Sahu on 16-08-2023
     */

    //Added by ROhan KAnsari - 22/6/23
    // Reason - to set currentpage to global
    localStorage.setItem("globalPageIndex", pageNumber)
    // End of code - Rohan Kansari - 22/6/23

    setCurrentPage(pageNumber);
  };
  /**
   * End of code addition by - Om Shrivastava on 30-06-23
   * Reason -  When user changes page number, this method will set page number which will be sent to backend.
   */
  const openMenuDetails = (id) => {
    alert(id)
  }
  /**
   * Added by - Om Shrivastava on 30-06-23
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
   * End of code addition by - Om Shrivastava on 30-06-23
   * Reason - Method that will set sorting criteria
   */

  /**
   * Added by - Om Shrivastava on 30-06-23
   * Reason - Method that will open edit order form of selected order
   */
  const openOrderDetails = (id) => {
    alert(id)
  }

  function ExtractDateTime(format) {
    var d = new Date(format);
    var date = format.substring(0, 10).split('-').reverse().join('/')
    var time = format.substring(11, 19)
    return { date, time }
  }
  /**
   * Added by - Om Shrivastava on 30-06-23
   * Reason - Method that will open edit order form of selected order
   */

  // Added by Rohan kansari - 22/6/23
  // Reason - To toggle dropdown visiblity on click
  function toggelDropdown() {
    if (document.getElementById("dropdown").style.display.length == 0)
      document.getElementById("dropdown").style.display = "block"
    else
      document.getElementById("dropdown").style.display = ""
  }

  function hideDropdown() {
    document.getElementById("dropdown").style.display = ""
  }
  // End of code - Rohan Kansari - 22/6/23


  /**
   * Added by Yuvraj Sahu on 04-08-2023
   * Reason - to filter the order by date
   */
  const handleFilterData = async() => {
    if (fromDate == null || toDate == null){
      setDateValidation(true)
    } else {
      setDateValidation(false)
      /**
       * Added by yuvraj Sahu on 16-08-2023
       * Reason - to change the page number when filter apply
       */
      if (currentPage != 1){
        handlePageChange(1)
      } else {
        setAllowFilter(!allowFilter)
      }
      /**
       * End of addition by yuvraj Sahu on 16-08-2023
       */
    }
  }

  const handleClearFilter = () => {
    setFromDate(null)
    setToDate(null)
    setAllowFilter(!allowFilter)
  }
  /**
   * End of addition by Yuvraj Sahu on 07-08-2023
   */


  return (
    <div className={style.container}>
      <div className={`${style.pageTitleContainer}`}>
        <div className={style.pageTitle}>Order Item</div>
      </div>

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
                  placeholder="Search by Order id, Item name, Item status, Serving size, Quantity and Date"
                  allowClear
                  enterButton
                  onSearch={(value) => { setCurrentPage(1); setSearchText(value); }}
                  // Added and commeted by Yuvraj Sahu on 09-07-2023
                  // Reason - to set width of search box
                  // style={{
                  //   width: "45%",
                  // }}
                  className={`${style.searchContainer}`}
                  // End of addition by Yuvraj Sahu on 09-07-2023
                />
          
        </div>

        {/* Added by Yuvraj Sahu on 07-08-2023
          Reason - to design filter variable */}
          <div className={style.dateFilterContainer}>
            <div className={style.dateValidationContainer}>
              <div className={style.dateContainer}>
                <div className={style.datepicker1}>
                  <DatePicker
                    calendarClassName={style.calendar}
                    className={style.dateInput}
                    calendarIcon={<AiOutlineCalendar />}
                    clearIcon={<AiOutlineClose />}
                    onChange={setFromDate}
                    value={fromDate}
                    format="dd/MM/yyyy"
                    maxDate={new Date()}
                  />
                  </div>
                <div className={style.datepicker1}>
                  <DatePicker
                    calendarClassName={style.calendar}
                    className={style.dateInput}
                    calendarIcon={<AiOutlineCalendar />}
                    clearIcon={<AiOutlineClose />}
                    onChange={(value)=> {setToDate(value); setDateValidation(false);}}
                    // onFocus={()=>setDateValidation(false)}
                    value={toDate}
                    format="dd/MM/yyyy"
                    maxDate={new Date()}
                    minDate={fromDate}
                    disabled={fromDate != null ? false : true}
                  />
                </div>
              </div>
              <div className={style.dateValidation}>{dateValidation && "Please enter start and end date!"} </div>
            </div>
            <div className={style.filterButtonContainer}>
              <button onClick={handleFilterData} className={style.filterButtonSpace}>Filter</button>
              <button onClick={handleClearFilter} className={style.filterButtonSpace}>Clear filter</button>
            </div>
          </div>
        {/* End of addition by Yuvraj Sahu on 07-08-2023 */}

        <div className={style.itemListSection}>
          <div className={style.tableContainer}>
            <div className={style.table}>
              
              <div
                className={style.tableHeadingContainer}
                // Added by Om Shrivastava on 30-06-23
                // Reason- To hide page size dropdown on outer click

                onClick={hideDropdown}
                onTouchStart={hideDropdown}

                // End of code - Om Shrivastava on 30-06-23
              >
                <div className={style.commonColumnTitle}>S.No</div>
                <div
                  className={style.commonColumnTitle}
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortOrderId("order_id");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "order_id") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "order_id") {
                      setShowSortingIcon(false);
                    }
                  }}
                >
                 Order Id 
                  {columnToSort == "order_id" &&
                      columnSortingOrder == "ascending" && (
                        <BsSortNumericDown className={style.sortingIcon} />
                      )}
                     {columnToSort == "order_id" &&
                      columnSortingOrder == "descending" && (
                        <BsSortNumericDownAlt className={style.sortingIcon} />
                      )}
                    {columnToSort != "order_id" && showSortingIcon && (
                      <BsSortNumericDown
                        color="grey"
                        className={style.sortingIcon}
                      />
                    )}
                </div>

                <div
                  // Added and commeted by Yuvraj Sahu on 09-07-2023
                  // Reason - to set the width of item name collumn
                  // className={style.commonColumnTitle}
                  className={`${style.commonColumnTitle} ${style.itemNameCollumn}`}
                  // End of addition by Yuvraj Sahu on 09-07-2023
                  // Added by Om Shrivastava on 30-06-23
                  // Reason - to sort data item name
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortOrderId("item");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "item") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "item") {
                      setShowSortingIcon(false);
                    }
                  }}
                  // End of addition by Om Shrivastava on 30-06-23
                >
                  Item name
                  {/* Added by Om Shrivastava on 30-06-23
                  Reason - to sort data with item name */}
                  {columnToSort == "item" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortAlphaDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "item" &&
                    columnSortingOrder == "descending" && (
                      <BsSortAlphaDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "item" && showSortingIcon && (
                    <BsSortAlphaDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                  {/* End of addition by Om Shrivastava on 30-06-23 */}
                </div>

                <div
                  // Added by Om shrivastava on 30-06-23
                  // Reason - to sort data by Full price
                  className={style.commonColumnTitle}
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortOrderId("item_status");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "item_status") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "item_status") {
                      setShowSortingIcon(false);
                    }
                  }}
                  // End of addition by Om shrivastava on 30-06-23
                >
                  Item status
                  {/* Added by Om shrivastava on 30-06-23
                  Reason - to sort data with full price */}
                  {columnToSort == "item_status" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortAlphaDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "item_status" &&
                    columnSortingOrder == "descending" && (
                      <BsSortAlphaDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "item_status" && showSortingIcon && (
                    <BsSortAlphaDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                  {/* End of addition by Om shrivastava on 30-06-23 */}
                </div>
                <div className={style.commonColumnTitle}
                // Added by Om shrivastava on 30-06-23
                  // Reason - to sort data by Half price
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortOrderId("serving_size");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "serving_size") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "serving_size") {
                      setShowSortingIcon(false);
                    }
                  }}
                  // End of addition by Om shrivastava on 30-06-23
                > Serving size 
                 {/* Added by Om shrivastava on 30-06-23
                  Reason - to sort data with half price */}
                  {columnToSort == "serving_size" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortAlphaDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "serving_size" &&
                    columnSortingOrder == "descending" && (
                      <BsSortAlphaDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "serving_size" && showSortingIcon && (
                    <BsSortAlphaDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                  {/* End of addition by Om shrivastava on 30-06-23 */}
                </div>

                <div
                  className={style.commonColumnTitle}
                  // Added by Om shrivastava on 30-06-23
                  // Reason - to sort data by Half price
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortOrderId("quantity");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "quantity") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "quantity") {
                      setShowSortingIcon(false);
                    }
                  }}
                  // End of addition by Om shrivastava on 30-06-23
                >
                  Quantity
                  {/* Added by Om shrivastava on 30-06-23
                  Reason - to sort data with half price */}
                  {columnToSort == "quantity" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortNumericDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "quantity" &&
                    columnSortingOrder == "descending" && (
                      <BsSortNumericDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "quantity" && showSortingIcon && (
                    <BsSortNumericDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                  {/* End of addition by Om shrivastava on 30-06-23 */}
                </div>

                <div
                  className={style.commonColumnTitle}
                  // Added by Om shrivastava on 30-06-23
                  // Reason - to sort data by active status
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortOrderId("price");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "price") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "price") {
                      setShowSortingIcon(false);
                    }
                  }}
                  // End of addition by Om shrivastava on 30-06-23
                >
                Price
                  {columnToSort == "price" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortNumericDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "price" &&
                    columnSortingOrder == "descending" && (
                      <BsSortNumericDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "price" && showSortingIcon && (
                    <BsSortNumericDown color="grey" className={style.sortingIcon} />
                  )}
                </div>

                <div
                  className={style.commonColumnTitle}
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortOrderId("date");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "date") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "date") {
                      setShowSortingIcon(false);
                    }
                  }}
                >
                  Date{" "}
                  {columnToSort == "date" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortNumericDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "date" &&
                    columnSortingOrder == "descending" && (
                      <BsSortNumericDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "date" && showSortingIcon && (
                    <BsSortNumericDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                </div>

                <div className={style.commonColumnTitle}> Time </div>
              </div>

              <div
                className={style.tableDataContainer}
                style={{
                  backgroundColor: "#efefef",
                }}
                // Added by Om Shrivastava on 30-06-23
                // Reason- To hide page size dropdown on outer click
                onClick={hideDropdown}
                onTouchStart={hideDropdown}
                // End of code - Om Shrivastava on 30-06-23
              >
                {orderItems && orderItems.length > 0 ? (
                  orderItems.map((orderDetail, index) => {
                    return (
                      <div
                        key={index}
                        className={style.tableData}
                        style={{
                          padding: "2px",
                          marginTop: "2px",
                          marginBottom:
                            orderItems.length == index + 1 ? "2px" : "0px",
                        }}
                      >
                        <div className={style.commonColumnData}>
                          
                        {(currentPage*listPerPage-listPerPage)+index+1}
                        </div>
                        {/* Modified by Om Shrivastava on 30-06-23
                        Reason - to arrange the word */}
                        <div
                          className={style.commonColumnData}
                          style={{ wordBreak: "break-word"}}
                          
                        >
                          {/* End of modification by Om Shrivastava on 30-06-23 */}
                        <span style={{cursor:'pointer',color:'blue'}} onClick={() => {
                            navigate(`/update-order-item/${orderDetail.id}`, {
                              state: { id: orderDetail.id },
                             });
                            }}> {orderDetail.order_id}</span> 
                        </div>
                        {/* Added and commeted by Yuvraj Sahu on 09-07-2023
                        Reason - to set the witdh of item name collumn */}
                        {/* <div className={style.commonColumnData}> */}
                        <div className={`${style.commonColumnData} ${style.itemNameCollumn}`}>
                        {/* End of addition by yuvraj Sahu on 09-07-2023 */}
                        <span style={{cursor:'pointer',color:'blue'}} onClick={() => {
                            navigate(`/update-order-item/${orderDetail.id}`, {
                              state: { id: orderDetail.id },
                             });
                            }}>  {orderDetail.item}</span>
                        </div>

                        <div className={style.commonColumnData}>
                        {orderDetail.item_status}

                        </div>

                        
                        <div className={style.commonColumnData}>
                        {orderDetail.serving_size}

                        </div>
                        <div className={style.commonColumnData}>
                        {orderDetail.quantity}

                        </div>

                        

                        {/* {itemDetails.is_active == true ? ( */}
                          <div className={style.commonColumnData}>
                          {orderDetail.price.toFixed(2)}

                          </div>
                     

                        {/* {itemDetails.best_seller == true ? ( */}
                          <div className={style.commonColumnData}>
                          {ExtractDateTime(orderDetail.date).date}


                          </div>
                     

                        <div
                          className={`${style.commonColumnData}`}
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <div
                            className={`${style.commonColumnData}`}
                          >
                                {ExtractDateTime(orderDetail.date).time}

                          </div>
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
          {orderItems && orderItems.length > 0 ? (

            // Modified by Rohan kansari - 22/6/23 
            // Reason - To divide container into two part for page selector
            < div className={style.paginationContent}>
              <Pagination
                // Modified by Rohan Kansari- 22/6/23
                defaultCurrent={currentPage}
                current={currentPage}
                simple
                total={backendOrderItemCount}
                defaultPageSize={listPerPage}
                // To set page per item 
                pageSize={listPerPage}
                onChange={handlePageChange}
              />

              <div className={style.dropdown} onClick={toggelDropdown}>
                <button className={style.dropbtn}>{listPerPage} / Page <MdArrowDropUp style={{ margin: "5px 0" }} /></button>
                <div className={style.dropdown_content} id="dropdown">
                  {backendOrderItemCount > 50 ? <span href="#" onClick={e => { setListPerPage(50); setCurrentPage(1); localStorage.setItem("listPerPage", 50) }} >50 / Page</span> : null}
                  {backendOrderItemCount > 40 ? <span href="#" onClick={e => { setListPerPage(40); setCurrentPage(1); localStorage.setItem("listPerPage", 40) }} >40 / Page</span> : null}
                  {backendOrderItemCount > 30 ? <span href="#" onClick={e => { setListPerPage(30); setCurrentPage(1); localStorage.setItem("listPerPage", 30) }} >30 / Page</span> : null}
                  <span href="#" onClick={e => { setListPerPage(20); setCurrentPage(1); localStorage.setItem("listPerPage", 20) }}>20 / Page</span>
                  <span href="#" onClick={e => { setListPerPage(10); localStorage.setItem("listPerPage", 10) }}>10 / Page</span>
                </div>
              </div>
            </div>
            // End of code - Modification - 22/6/23 - Rohan Kansari
            // Reason - To separate div and add Selection box for page item size 
          ) : null}

        </div>
      </div>
    // </Header>

  );
};

export default OrderItem;