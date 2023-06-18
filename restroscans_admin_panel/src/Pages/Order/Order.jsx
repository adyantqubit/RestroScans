/**
 * Created by - Om Shrivastava on 15-06-23
 * Reason - To have order details section
 */

import React, { useEffect, useState } from "react";
import style from "./order.module.css";
import Header from "../GlobalComponent/Header";
import { Pagination } from "antd";
import { getOrderCount, getOrdersApi } from "../../Api/services";
import {
  BsSortAlphaDownAlt,
  BsSortAlphaDown,
  BsSortNumericDownAlt,
  BsSortNumericDown,
} from "react-icons/bs";

import { MdCancel, MdCheckCircle } from "react-icons/md";

import { Input, Space } from "antd";
import config from "../../Api/config";
import { useNavigate } from "react-router-dom";

const Order = () => {

  const navigate = useNavigate();

  const [backendOrderCount, setOrderCount] = useState(0);

  var [orders, setOrders] = useState([]);

  const [listPerPage, setListPerPage] = useState(10);

  const [columnToSort, setColumnToSort] = useState("order_id");

  // const [columnSortingOrder, setColumnSortingOrder] = useState("ascending");
  const [columnSortingOrder, setColumnSortingOrder] = useState("descending");

  const [showSortingIcon, setShowSortingIcon] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const { Search } = Input;
  /**
   * Added by - Om Shrivastava on 15-06-23
   * Reason - method that will execute when page loads. this method will call order list api
   */
  useEffect(() => {
    getCountofOrder();
    // getAllOrder();
    allOrders();
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
  }, [columnToSort, columnSortingOrder, currentPage, searchText]);
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
    };
    var response = await getOrdersApi(tenant, filteringCriteria);
    setOrders(response.orderList);
    // console.log(orders)

    /**
     * Added by - Om Shrivastava on 15-06-23
     * Reason - To recalculate page numbers
     */

    setOrderCount(response.orderListCount)

    /**
     * End of code addition by - Om Shrivastava on 15-06-23
     * Reason - To recalculate page numbers
     */
  };
  /**
   * End of code addition by - Om Shrivastava on 15-06-23
   * Reason - created api to get list of order
   */

  /**
   * Added by - Om Shrivastava on 15-06-23
   * Reason -  When user changes page number, this method will set page number which will be sent to backend.
   */
  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  /**
   * End of code addition by - Om Shrivastava on 15-06-23
   * Reason -  When user changes page number, this method will set page number which will be sent to backend.
   */
  const openMenuDetails=(id)=>{
    alert(id)
  }
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

  /**
   * Added by - Om Shrivastava on 15-06-23
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
   * Added by - Om Shrivastava on 15-06-23
   * Reason - Method that will open edit order form of selected order
   */
  return (
    <Header>
      <div className={style.container}>
        <div className={`${style.pageTitleContainer}`}>
          <div className={style.pageTitle}>Order</div>
        </div>
        
        <div className={style.orderListSection} >
          <div className={style.tableContainer}>
            <div className={style.table}>
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
            onSearch={(value)=>{setCurrentPage(1); setSearchText(value);}}


            style={{
              width: "40%",
            }}
          />
        </div>
              <div className={style.tableHeadingContainer}>

                <div
                  className={`${style.commonColumnTitle} ${style.smallColumnWidth}`}
                >
                  SNo{" "}
                </div>

                <div
                  className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                 
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
                  Order ID{" "}
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
                  className={`${style.commonColumnTitle} ${style.smallColumnWidth}`}

                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortOrderId("table_number");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "table_number") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "table_number") {
                      setShowSortingIcon(false);
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
                  {columnToSort != "table_number" && showSortingIcon && (
                    <BsSortNumericDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                </div>

                <div
                  className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortOrderId("order_status");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "order_status") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "order_status") {
                      setShowSortingIcon(false);
                    }
                  }}

                > Order Status 
                {columnToSort == "order_status" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortAlphaDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "order_status" &&
                    columnSortingOrder == "descending" && (
                      <BsSortAlphaDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "order_status" && showSortingIcon && (
                    <BsSortAlphaDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                
                </div>

                <div
                  className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                  // Added by Om Shrivatava on 16-06-23
                  // Reason : Apply sorting through the payment status
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortOrderId("payment_status");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "payment_status") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "payment_status") {
                      setShowSortingIcon(false);
                    }
                  }}
                  // End of addition by Om Shrivastava on 16-06-23
                >
                  Payment status
                  {/* // Added by Om Shrivatava on 16-06-23
                  // Reason : Apply sorting through the payment status */}
                  {columnToSort == "payment_status" &&
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
                  )}
                  {/* // End of addition by Om Shrivastava on 16-06-23 */}

                </div><div
                  className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}

                >
                  Final amount
                </div><div
                  className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                  // Added by Om Shrivatava on 16-06-23
                  // Reason : Apply sorting through the payment mode
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortOrderId("payment_mode");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "payment_mode") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "payment_mode") {
                      setShowSortingIcon(false);
                    }
                  }}
                  // End of addition by Om Shrivastava on 16-06-23
                >
                  Payment mode
                  {/* // Added by Om Shrivatava on 16-06-23
                  // Reason : Apply sorting through the payment status */}
                  {columnToSort == "payment_mode" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortAlphaDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "payment_mode" &&
                    columnSortingOrder == "descending" && (
                      <BsSortAlphaDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "payment_mode" && showSortingIcon && (
                    <BsSortAlphaDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                  {/* // End of addition by Om Shrivastava on 16-06-23 */}
                </div>
                <div
                  className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
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
                  Date
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
                <div
                  className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}

                >
                  Time
                </div>
              </div>

              <div
                className={style.tableDataContainer}
                style={{
                  backgroundColor: "#efefef",
                }}
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
                        }}
                      >
                        <div
                          className={`${style.commonColumnData} ${style.smallColumnWidth}`}
                        >

                          {index + 1}.
                        </div>
                        <div
                          className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                          style={{color:'#185ee0',cursor:'pointer'}}
                          onClick={() => {
                            navigate(`/update-order/${orderDetail.id}`, {
                              state: { id: orderDetail.id },
                             });
                          }}
                        >
                          {orderDetail.order_id}
                        </div>

                        {/* {orderDetail.is_active == true ? ( */}
                        <div className={`${style.commonColumnData} ${style.smallColumnWidth}`}
                        >
                          {/* <MdCheckCircle className={style.yesIcon} /> */}
                          {orderDetail.table_number}

                        </div>
                        {/* ) : ( */}
                        {/* <div className={style.commonColumnData}>
                        <MdCancel className={style.noIcon} />
                        </div> */}
                        {/* )} */}


                        <div
                          className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
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
                        <div className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}>
                          {orderDetail.payment_status}
                        </div><div className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}>
                          {orderDetail.final_amount}
                        </div><div className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                                                onClick={() => openMenuDetails(orderDetail.id)}

                        >
                          {orderDetail.payment_mode != null || orderDetail.payment_mode != undefined ?
                            <>
                              {orderDetail.payment_mode}
                            </> : '-'}
                        </div>
                        <div className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}>
                          {ExtractDateTime(orderDetail.date).date}
                        </div>
                        <div className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}>
                          {ExtractDateTime(orderDetail.date).time}
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
            <Pagination
              defaultCurrent={1}

              current={currentPage}

              total={backendOrderCount}
              defaultPageSize={listPerPage}
              onChange={handlePageChange}
            />
          ) : null}
        </div>

      </div>

    </Header>
  );
};

export default Order;
