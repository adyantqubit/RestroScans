/**
 * Created by - Yuvraj Sahu on 23-06-2023
 * Reason - To have item details section
 */

import React, { useEffect, useState } from "react";
import style from "./item.module.css";
import Header from "../GlobalComponent/Header";
import { Pagination } from "antd";
import {
  getItemCount,
  getItemList,
} from "../../Api/services";
import {
  BsSortAlphaDownAlt,
  BsSortAlphaDown,
} from "react-icons/bs";

import { MdArrowDropUp, MdCancel, MdCheckCircle } from "react-icons/md";
import { Input, Space } from "antd";
import config from "../../Api/config";
import { useNavigate } from "react-router-dom";
import defaultIcon from "../../../src/images/no-category.jpg"

const Item = () => {
  const [backendItemCount, setBackendItemCount] = useState(0);
  const [itemList, setItemList] = useState([]);
  // Modified by Rohan Kansari - 22/6/23 - To Get Selected List page from localstorage on Reload 
  // const [listPerPage, setListPerPage] = useState(localStorage.getItem(10));
  const [listPerPage, setListPerPage] = useState(localStorage.getItem("listPerPage"));
  // End of code - ROhan kansari - 22/6/23

  const [columnToSort, setColumnToSort] = useState("name");
  const [columnSortingOrder, setColumnSortingOrder] = useState("ascending");
  const [showSortingIcon, setShowSortingIcon] = useState(false);
  var [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const { Search } = Input;

  /**
   * Added by - Yuvraj Sahu on 23-06-2023
   * Reason - To add navigation feature on this page
   */
  const navigate = useNavigate();
  /**
   * End of code addition by - Yuvraj Sahu on 23-06-2023
   * Reason - To add navigation feature on this page
   */

  /**
   * Added by - Yuvraj Sahu on 23-06-2023
   * Reason - method that will execute when page loads. this method will call item list api
   */
  useEffect(() => {

    // Added By Yuvraj Sahu - 23-06-2023
    // Reason - To set global Page index Whenever its index updated

    if (localStorage.getItem("globalPageIndex")) {
      currentPage = parseInt(localStorage.getItem("globalPageIndex"))
      setCurrentPage(parseInt(localStorage.getItem("globalPageIndex")))
    }

    // End of code - Yuvraj Sahu - 23-06-2023
    getCountOfItem();
    getListOfItem();
  }, []);



  /**
   * End of code addition by - Yuvraj Sahu on 23-06-2023
   * Reason - method that will execute when page loads. this method will call item list api
   */

  /**
   * Added by - Yuvraj Sahu on 23-06-2023
   * Reason - method that will execute when sorting on column is applied or page number is changed.
   *  this method will call item list api
   */
  useEffect(() => {
    getListOfItem();

    // Modified by Yuvraj Sahu - 23-06-2023 - To add listPerPage Change call 
  }, [columnToSort, columnSortingOrder, currentPage, searchText, listPerPage]);

  /**
   * End of code addition by - Yuvraj Sahu on 23-06-2023
   * Reason - method that will execute when sorting on column is applied or page number is changed.
   *  this method will call item list api
   */

  /**
   * Added by - Yuvraj Sahu on 23-06-2023
   * Reason - created api to get count of item
   */
  const getCountOfItem = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await getItemCount(tenant);
    setBackendItemCount(response.itemCount);
  };
  /**
   * Added by - Yuvraj Sahu on 23-06-2023
   * Reason - created api to get count of item
   */

  /**
   * Added by - Yuvraj Sahu on 23-06-2023
   * Reason - created api to get list of item
   */
  const getListOfItem = async () => {
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
       * Modified by Yuvraj Sahu on 23-06-2023
       * Reason - to trim searching text
       */
      searchText: searchText.trim(),
      /**
       * End of addition by Yuvraj Sahu on 23-06-2023
       */
    };
    // const filteringCriteria ={
    //   columnSortingOrder: "ascending",
    //   columnToSort: "name",
    //   paginationDetails:
    //   {currentPage: 1, listPerPage: 10},
    //   searchText: ""
    //   }
    const response = await getItemList(tenant, filteringCriteria);
    setItemList(response.itemList);

    /**
     * Added by - Yuvraj Sahu on 23-06-2023
     * Reason - To recalculate page numbers
     */
    setBackendItemCount(response.itemListCount);
    /**
     * End of code addition by - Yuvraj Sahu on 23-06-2023
     * Reason - To recalculate page numbers
     */
  };
  /**
   * End of code addition by - Yuvraj Sahu on 23-06-2023
   * Reason - created api to get list of item
   */

  /**
   * Added by - Yuvraj Sahu on 23-06-2023
   * Reason -  When user changes page number, this method will set page number which will be sent to backend.
   */
  const handlePageChange = async (pageNumber) => {
    //Added by Yuvraj Sahu - 23-06-2023
    // Reason - to set currentpage to global
    localStorage.setItem("globalPageIndex", pageNumber)
    // End of code - Yuvraj Sahu - 23-06-2023
    setCurrentPage(pageNumber);
  };
  /**
   * End of code addition by - Yuvraj Sahu on 23-06-2023
   * Reason -  When user changes page number, this method will set page number which will be sent to backend.
   */

  /**
   * Added by - Yuvraj Sahu on 23-06-2023
   * Reason - Method that will set sorting criteria
   */
  const sortItemList = (columnName) => {
    if (columnToSort == columnName) {
      if (columnSortingOrder == "ascending") {
        setColumnSortingOrder("descending");
      } else {
        setColumnSortingOrder("ascending");
      }
    }
    setColumnToSort(columnName);
  };
  /**
   * End of code addition by - Yuvraj Sahu on 23-06-2023
   * Reason - Method that will set sorting criteria
   */

  /**
   * Added by - Yuvraj Sahu on 23-06-2023
   * Reason - Method that will open edit item form of selected item
   */
  const openItemDetails = (id) => {
    /**
     * Added by - Yuvraj Sahu on 23-06-2023
     * Reason - To navigate to item form
     */
    navigate("/ItemForm", { state: { id: id } });
    /**
     * End of code addition by - Yuvraj Sahu on 23-06-2023
     * Reason - To navigate to item form
     */
  };
  /**
   * Added by - Yuvraj Sahu on 23-06-2023
   * Reason - Method that will open edit item form of selected item
   */

  // Added by Yuvraj Sahu on 23-06-2023
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
  // End of code - Yuvraj Sahu on 23-06-2023

  return (
    <Header>
      <div className={style.container}>
        <div className={`${style.pageTitleContainer}`}>
          <div className={style.pageTitle}>Item List</div>
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
            placeholder="Search by name, category name, full price or half price"
            allowClear
            enterButton
            onSearch={(value) => {
              setCurrentPage(1);
              setSearchText(value);
            }}
            // style={{
            //   width: "50%",
            // }}
            className={style.SearchBar}
          />
          <div
            className={`${style.primaryButton}`}
            onClick={() => openItemDetails()}
            style={{
              marginLeft: "10px",
              minWidth: "100px",
              textAlign: "center",
            }}
          >
            Add Item
          </div>
        </div>

        <div className={style.itemListSection}>
          <div className={style.tableContainer}>
            <div className={style.table}>
              {/* ---------------------------------------------------------------------------- */}
              {/* <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "white",
                  padding: "4px",
                }}
              >
                <Search
                  placeholder="Search by name, category name, full price or half price"
                  allowClear
                  enterButton
                  onSearch={(value) => {
                    setCurrentPage(1);
                    setSearchText(value);
                  }}
                  style={{
                    width: "60%",
                  }}
                />
                <div
                  className={`${style.primaryButton}`}
                  onClick={() => openItemDetails()}
                  style={{
                    marginLeft: "10px",
                    minWidth: "100px",
                    textAlign: "center",
                  }}
                >
                  Add Item
                </div>
              </div> */}
              {/* -------------------------------------------------------------------------------------- */}
              <div className={style.tableHeadingContainer}

                // Added by Yuvraj Sahu on 23-06-2023
                // Reason- To hide page size dropdown on outer click
                onClick={hideDropdown}
                onTouchStart={hideDropdown}
              // End of code - Yuvraj Sahu on 23-06-2023
              >
                <div className={style.commonColumnTitle}>Icon </div>
                <div
                  className={style.commonColumnTitle}
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortItemList("name");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "name") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "name") {
                      setShowSortingIcon(false);
                    }
                  }}
                >
                  Name{" "}
                  {columnToSort == "name" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortAlphaDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "name" &&
                    columnSortingOrder == "descending" && (
                      <BsSortAlphaDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "name" && showSortingIcon && (
                    <BsSortAlphaDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                </div>

                <div
                  className={style.commonColumnTitle}
                  // Added by Yuvraj Sahu on 23-06-2023
                  // Reason - to sort data category name
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortItemList("category");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "category") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "category") {
                      setShowSortingIcon(false);
                    }
                  }}
                // End of addition by Yuvraj Sahu on 23-06-2023
                >
                  Category name
                  {/* Added by Yuvraj Sahu on 23-06-2023
                  Reason - to sort data with category name */}
                  {columnToSort == "category" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortAlphaDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "category" &&
                    columnSortingOrder == "descending" && (
                      <BsSortAlphaDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "category" && showSortingIcon && (
                    <BsSortAlphaDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                  {/* End of addition by Yuvraj Sahu on 23-06-2023 */}
                </div>

                <div className={style.commonColumnTitle}>
                    Full price
                </div>

                <div className={style.commonColumnTitle}>
                    Half price
                </div>

                <div
                  className={style.commonColumnTitle}
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortItemList("is_active");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "is_active") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "is_active") {
                      setShowSortingIcon(false);
                    }
                  }}
                >
                  Is Available{" "}
                  {columnToSort == "is_active" &&
                    columnSortingOrder == "ascending" && (
                      <MdCancel className={style.sortingIcon} />
                    )}
                  {columnToSort == "is_active" &&
                    columnSortingOrder == "descending" && (
                      <MdCheckCircle className={style.sortingIcon} />
                    )}
                  {columnToSort != "is_active" && showSortingIcon && (
                    <MdCancel color="grey" className={style.sortingIcon} />
                  )}
                </div>

                <div
                  className={style.commonColumnTitle}
                  // onClick={(e) => {
                  //   setShowSortingIcon(false);
                  //   sortItemList("best_seller");
                  // }}
                  // onMouseEnter={(e) => {
                  //   if (columnToSort != "best_seller") {
                  //     setShowSortingIcon(true);
                  //   }
                  // }}
                  // onMouseLeave={(e) => {
                  //   if (columnToSort != "best_seller") {
                  //     setShowSortingIcon(false);
                  //   }
                  // }}
                >
                  Best Seller{" "}
                  {/* {columnToSort == "best_seller" &&
                    columnSortingOrder == "ascending" && (
                      <MdCancel className={style.sortingIcon} />
                    )}
                  {columnToSort == "best_seller" &&
                    columnSortingOrder == "descending" && (
                      <MdCheckCircle className={style.sortingIcon} />
                    )}
                  {columnToSort != "best_seller" && showSortingIcon && (
                    <MdCancel color="grey" className={style.sortingIcon} />
                  )} */}
                </div>

                <div className={style.commonColumnTitle}> Action </div>
              </div>

              <div
                className={style.tableDataContainer}
                style={{
                  backgroundColor: "#efefef",
                }}

                // Added by Yuvraj Sahu on 23-06-2023
                // Reason- To hide page size dropdown on outer click
                onClick={hideDropdown}
                onTouchStart={hideDropdown}
              // End of code - Yuvraj Sahu on 23-06-2023
              >
                {itemList != null && itemList.length > 0 ? (
                  itemList.map((itemDetails, index) => {
                    return (
                      <div
                        key={index}
                        className={style.tableData}
                        style={{
                          padding: "2px",
                          marginTop: "2px",
                          marginBottom:
                            itemList.length == index + 1 ? "2px" : "0px",
                        }}
                      >
                        <div className={style.commonColumnData}>
                          <img
                            className={style.itemImage}
                            src={itemDetails.icon ? config.staticBaseURL + itemDetails.icon : defaultIcon}
                          />
                        </div>
                        {/* Modified by Yuvraj Sahu on 23-06-2023
                        Reason - to arrange the word */}
                        <div className={style.commonColumnData} style={{wordBreak: "break-word"}}>
                          {/* End of modification by Yuvraj Sahu on 23-06-2023 */}
                          {itemDetails.name}
                        </div>

                        <div className={style.commonColumnData}>
                          {itemDetails.category_name}
                        </div>

                        <div className={style.commonColumnData}>
                        {itemDetails.price_half ? itemDetails.price_half : "-"}
                        </div>

                        <div className={style.commonColumnData}>
                          {itemDetails.price_full ? itemDetails.price_full : "-"} 
                        </div>

                        {itemDetails.is_active == true ? (
                          <div className={style.commonColumnData}>
                            <MdCheckCircle className={style.yesIcon} />
                          </div>
                        ) : (
                          <div className={style.commonColumnData}>
                            <MdCancel className={style.noIcon} />
                          </div>
                        )}

                        {itemDetails.best_seller == true ? (
                          <div className={style.commonColumnData}>
                            <MdCheckCircle className={style.yesIcon} />
                          </div>
                        ) : (
                          <div className={style.commonColumnData}>
                            <MdCancel className={style.noIcon} />
                          </div>
                        )}

                        <div
                          className={`${style.commonColumnData}`}
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <div
                            className={` ${style.primaryButton}`}
                            onClick={() =>
                              openItemDetails(itemDetails.id)
                            }
                          >
                            View
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
          {itemList && itemList.length > 0 ? (
            // Modified by Yuvraj Sahu on 23-06-2023
            // Reason - To divide container into two part for page selector
            < div className={style.paginationContent}>
              <Pagination
                defaultCurrent={1}
                /**
                 * Added by - Yuvraj Sahu on 23-06-2023
                 * Reason - To set current selected page number
                 */
                current={currentPage}
                /**
                 * End of code addition by - Yuvraj Sahu on 23-06-2023
                 * Reason - To set current selected page number
                 */
                total={backendItemCount}
                defaultPageSize={listPerPage}
                pageSize={listPerPage}
                simple
                onChange={handlePageChange}
              />

              <div className={style.dropdown} onClick={toggelDropdown}>
                <button className={style.dropbtn}>{listPerPage} / Page <MdArrowDropUp style={{ margin: "5px 0" }} /></button>
                <div className={style.dropdown_content} id="dropdown">
                  {backendItemCount > 50 ? <span href="#" onClick={e => { setListPerPage(50); setCurrentPage(1); localStorage.setItem("listPerPage", 50) }} >50 / Page</span> : null}
                  {backendItemCount > 40 ? <span href="#" onClick={e => { setListPerPage(40); setCurrentPage(1); localStorage.setItem("listPerPage", 40) }} >40 / Page</span> : null}
                  {backendItemCount > 30 ? <span href="#" onClick={e => { setListPerPage(30); setCurrentPage(1); localStorage.setItem("listPerPage", 30) }} >30 / Page</span> : null}
                  <span href="#" onClick={e => { setListPerPage(20); setCurrentPage(1); localStorage.setItem("listPerPage", 20) }}>20 / Page</span> 
                  <span href="#" onClick={e => { setListPerPage(10); localStorage.setItem("listPerPage", 10) }}>10 / Page</span>
                </div>
              </div>
            </div>
            // End of code - Modification - Yuvraj Sahu on 23-06-2023
            // Reason - To separate div and add Selection box for page item size 

          ) : null}
        </div>
      </div>
    </Header>
  );
};

export default Item;