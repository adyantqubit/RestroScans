import React, { useEffect, useState } from "react";
import style from "../style/orderitem.module.css";
import Header from "../../../../components/Header/Header";
import { Pagination, Input } from "../../../../ui";
import { loadOrderItemCount, loadOrderItemPage, displayDateTime } from "../../services/orderService";
import {
  BsSortAlphaDownAlt,
  BsSortAlphaDown,
  BsSortNumericDownAlt,
  BsSortNumericDown,
} from "react-icons/bs";

import { MdArrowDropDown, MdArrowDropUp, MdCancel, MdCheckCircle } from "react-icons/md";

import config from "../../../../config/config";
import Screen from "../../../../components/erp/Screen";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../../Context/AppContext";
import DatePicker from 'react-date-picker';
import { AiFillCalendar, AiFillEye, AiOutlineCalendar, AiOutlineClose, AiOutlineSortAscending } from 'react-icons/ai';
import { useOrderItemState } from "../../usestate/orderItemState";

const OrderItem = () => {
  const { enableHeader } = useApp();

  const navigate = useNavigate();

  var {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    dateValidation,
    setDateValidation,
    allowFilter,
    setAllowFilter,
    allDateFilter,
    setAllDateFilter,
    backendOrderItemCount,
    setOrderItemCount,
    orderItems,
    setOrderItems,
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
  } = useOrderItemState();

  const { Search } = Input;
  const [itemStatusFilter, setItemStatusFilter] = useState("all");

  useEffect(() => {
    enableHeader()

    if (localStorage.getItem("globalPageIndex")) {
      currentPage = parseInt(localStorage.getItem("globalPageIndex"))
      setCurrentPage(parseInt(localStorage.getItem("globalPageIndex")))
    }
  }, [])

  useEffect(() => {
    getCountofOrderItem();
    allOrderItems();
  }, []);

  useEffect(() => {
    allOrderItems();
    localStorage.setItem("globalPageIndex", currentPage)

    setDateValidation(false)
  }, [columnToSort, columnSortingOrder, currentPage, searchText, listPerPage, allowFilter, itemStatusFilter]);

  const getCountofOrderItem = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await loadOrderItemCount(tenant);
    setOrderItemCount(response.orderItemCount);
  };

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
      searchText: searchText.trim(),
      ...(itemStatusFilter === "all" ? {} : { filters: { item_status: itemStatusFilter } }),
    };

    if (allDateFilter) {
      let copyToDate = new Date(toDate)
      copyToDate.setDate(copyToDate.getDate() + 1)

      filteringCriteria["startDate"] = fromDate;
      filteringCriteria["endDate"] = copyToDate
    }

    var response = await loadOrderItemPage(tenant, filteringCriteria);
    setOrderItems(response.orderItemList);

    setOrderItemCount(response.orderItemListCount)
  };

  const handlePageChange = async (pageNumber) => {
    if (allDateFilter == false) {
      setFromDate(null)
      setToDate(null)
    }

    localStorage.setItem("globalPageIndex", pageNumber)

    setCurrentPage(pageNumber);
  };
  const openMenuDetails = (id) => {
    alert(id)
  }
  var backgroundColor = 1;

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

  const openOrderDetails = (id) => {
    alert(id)
  }

  function ExtractDateTime(format) {
    return displayDateTime(format)
  }

  function toggelDropdown() {
    if (((document.getElementById("dropdown")?.style.display || "").length) == 0)
      ((document.getElementById("dropdown") || { style: {} }).style.display = "block")
    else
      ((document.getElementById("dropdown") || { style: {} }).style.display = "")
  }

  function hideDropdown() {
    if (orderItems && orderItems.length > 0) {
      ((document.getElementById("dropdown") || { style: {} }).style.display = "")
    }
  }

  const handleFilterData = async () => {
    if (fromDate == null || toDate == null) {
      setDateValidation(true)
    } else {
      setAllDateFilter(true)
      setDateValidation(false)
      if (currentPage != 1) {
        localStorage.setItem("globalPageIndex", 1)
        setCurrentPage(1);
      } else {
        setAllowFilter(!allowFilter)
      }
    }
  }

  const handleClearFilter = () => {
    setFromDate(null)
    setToDate(null)

    document.getElementById("fromDate").value = ""
    document.getElementById("toDate").value = ""

    setAllDateFilter(false)
    handlePageChange(1)
    setAllowFilter(!allowFilter)
  }

  return (
    <Screen title="Order items" kicker="Floor">
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
            onChange={(event) => { setCurrentPage(1); setSearchText(event.target.value); }}
            onSearch={(value) => { setCurrentPage(1); setSearchText(value); }}
            className={`${style.searchContainer}`}
          />
          <select
            value={itemStatusFilter}
            onChange={(event) => { setCurrentPage(1); setItemStatusFilter(event.target.value); }}
            style={{ marginLeft: 8, height: 32 }}
          >
            <option value="all">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirm">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

        </div>

        <div className={style.dateFilterContainer}>
          <div className={style.dateValidationContainer}>
            <div className={style.dateContainer}>
              <div className={style.datepicker1}>

                <input
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => { setFromDate(new Date(e.target.value)); setDateValidation(false); }}
                  style={{ border: "1px solid", padding: "2px", borderRadius: "5px" }}
                  id="fromDate"
                  className={style.calendar}
                />
              </div>
              <div className={style.datepicker1}>
                <input
                  type="date"
                  min={fromDate != null ? fromDate.getFullYear() + "-" +
                    ("0" + (fromDate.getMonth() + 1)).slice(-2) + "-" +
                    ("0" + (fromDate.getDate())).slice(-2) : null}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={e => { setToDate(new Date(e.target.value)); setDateValidation(false); }}
                  style={{ border: "1px solid", padding: "2px", borderRadius: "5px" }}
                  id="toDate"
                  disabled={fromDate != null ? false : true}
                  className={style.calendar}
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

        <div className={style.itemListSection}>
          <div className={style.tableContainer}>
            <div className={style.table}>

              <div
                className={style.tableHeadingContainer}

                onClick={hideDropdown}
                onTouchStart={hideDropdown}

              >
                <div className={style.sNoColumn}>S.No</div>
                <div
                  className={style.actionColumn}
                >
                  Action
                </div>
                <div
                  className={style.OrderIdColumn}

                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortOrderId("order_id");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "order_id") {
                      setShowSortingIcon("order_id");
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "order_id") {
                      setShowSortingIcon("");
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
                  {columnToSort != "order_id" && showSortingIcon == "order_id" && (
                    <BsSortNumericDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                </div>

                <div
                  className={style.orderStatusColumn}

                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortOrderId("item");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "item") {
                      setShowSortingIcon("item");
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "item") {
                      setShowSortingIcon("");
                    }
                  }}

                >
                  Item name
                  {columnToSort == "item" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortAlphaDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "item" &&
                    columnSortingOrder == "descending" && (
                      <BsSortAlphaDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "item" && showSortingIcon == "item" && (
                    <BsSortAlphaDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}

                </div>

                <div
                  className={style.orderStatusColumn}

                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortOrderId("item_status");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "item_status") {
                      setShowSortingIcon("item_status");
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "item_status") {
                      setShowSortingIcon("");
                    }
                  }}
                >
                  Item status
                  {columnToSort == "item_status" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortAlphaDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "item_status" &&
                    columnSortingOrder == "descending" && (
                      <BsSortAlphaDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "item_status" && showSortingIcon == "item_status" && (
                    <BsSortAlphaDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                </div>
                <div
                  className={style.paymentStatusColumn}

                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortOrderId("serving_size");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "serving_size") {
                      setShowSortingIcon("serving_size");
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "serving_size") {
                      setShowSortingIcon("");
                    }
                  }}
                > Serving size
                  {columnToSort == "serving_size" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortAlphaDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "serving_size" &&
                    columnSortingOrder == "descending" && (
                      <BsSortAlphaDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "serving_size" && showSortingIcon == "serving_size" && (
                    <BsSortAlphaDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                </div>

                <div
                  className={style.subtotalColumn}

                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortOrderId("quantity");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "quantity") {
                      setShowSortingIcon("quantity");
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "quantity") {
                      setShowSortingIcon("");
                    }
                  }}
                >
                  Quantity
                  {columnToSort == "quantity" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortNumericDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "quantity" &&
                    columnSortingOrder == "descending" && (
                      <BsSortNumericDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "quantity" && showSortingIcon == "quantity" && (
                    <BsSortNumericDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                </div>

                <div
                  className={style.cgstColumn}

                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortOrderId("price");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "price") {
                      setShowSortingIcon("price");
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "price") {
                      setShowSortingIcon("");
                    }
                  }}
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
                  {columnToSort != "price" && showSortingIcon == "price" && (
                    <BsSortNumericDown color="grey" className={style.sortingIcon} />
                  )}
                </div>

                <div
                  className={style.dateColumn}

                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortOrderId("date");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "date") {
                      setShowSortingIcon("date");
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "date") {
                      setShowSortingIcon("");
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
                  {columnToSort != "date" && showSortingIcon == "date" && (
                    <BsSortNumericDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                </div>

                <div
                  className={style.totalColumn}

                > Time </div>
              </div>

              <div
                className={style.tableDataContainer}
                style={{
                  backgroundColor: "#efefef",
                }}
                onClick={hideDropdown}
                onTouchStart={hideDropdown}
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
                          background:
                            backgroundColor++ % 2 == 0 ? "white" : "#1677ff14",
                        }}
                      >
                        <div
                          className={`${style.sNoColumn} ${style.commonColumnData} `}

                        >

                          {(currentPage * listPerPage - listPerPage) + index + 1}
                        </div>

                        <div
                          className={`${style.actionColumn} ${style.commonColumnData} `}

                        >
                          <AiFillEye style={{ fontSize: 15, color: "rgb(24, 94, 224)" }}
                            onClick={() => {
                              navigate(`/update-order-item/${orderDetail.id}`, {
                                state: { id: orderDetail.id },
                              });
                            }}
                          />

                        </div>

                        <div
                          className={`${style.OrderIdColumn} ${style.commonColumnData} `}

                          style={{ wordBreak: "break-word" }}

                        >
                          {orderDetail.order_id}
                        </div>
                        <div
                          className={`${style.orderStatusColumn} ${style.commonColumnData} `}
                          style={{ wordBreak: 'break-word' }}
                        >
                          {orderDetail.item}
                        </div>

                        <div
                          className={`${style.orderStatusColumn} ${style.commonColumnData} `}

                        >
                          {orderDetail.item_status}

                        </div>

                        <div
                          className={`${style.paymentStatusColumn} ${style.commonColumnData} `}

                        >
                          {orderDetail.serving_size}

                        </div>
                        <div
                          className={`${style.subtotalColumn} ${style.commonColumnData} `}

                        >
                          {orderDetail.quantity}

                        </div>

                        {/* {itemDetails.is_active == true ? ( */}
                        <div
                          className={`${style.cgstColumn} ${style.commonColumnData} `}

                        >
                          {orderDetail.price.toFixed(2)}

                        </div>

                        {/* {itemDetails.best_seller == true ? ( */}
                        <div
                          className={`${style.dateColumn} ${style.commonColumnData} `}

                        >
                          {ExtractDateTime(orderDetail.date).date}

                        </div>

                        <div
                          className={`${style.totalColumn} ${style.commonColumnData} `}

                        >

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
          {orderItems && orderItems.length > 0 ? (
            < div className={style.paginationContent}>
              <Pagination
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
          ) : null}

        </div>
      </div>
    </Screen>
  );
};

export default OrderItem;
