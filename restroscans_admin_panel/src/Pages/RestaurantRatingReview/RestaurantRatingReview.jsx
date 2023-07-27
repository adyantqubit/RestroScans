/**
 * Created by - Om shrivastava on 24-07-2023
 * Reason - To have Restaurant rating and review details
 */

import React, { useEffect, useState } from "react";
import style from "./restaurantratingreview.module.css";
import Header from "../GlobalComponent/Header";
import { Pagination } from "antd";
import { getRestaurantRatingReviewCount, getRestaurantRatingReviewList } from "../../Api/services";
import {
    BsSortAlphaDownAlt,
    BsSortAlphaDown,
    BsSortNumericDownAlt,
    BsSortNumericDown,
} from "react-icons/bs";

import { Input, Space } from "antd";
import { MdArrowDropUp } from "react-icons/md";
import { enableHeader } from "../../App";
import ReactReadMoreReadLess from "react-read-more-read-less";
import {
    StarFilled,
  } from '@ant-design/icons';
const RatingReview = () => {
    const [backenRatingReviewCount, setBackendRatingReviewCount] = useState(0);
    const [ratingReviewList, setRatingReviewList] = useState([]);
    // Modified by Om Shrivastava - 26-07-23 - To Get Selected List page from localstorage on Reload 
    // const [listPerPage, setListPerPage] = useState(localStorage.getItem(10));
    const [listPerPage, setListPerPage] = useState(localStorage.getItem("listPerPage"));
    // End of code - Om Shrivastava - 26-07-23

    const [columnToSort, setColumnToSort] = useState("contact_number");
    const [columnSortingOrder, setColumnSortingOrder] = useState("ascending");
    const [showSortingIcon, setShowSortingIcon] = useState(false);
    var [currentPage, setCurrentPage] = useState(1);

    /**
     * Added by - Om Shrivastava on 26-07-23
     * Reason - To have search functionality
     */
    const [searchText, setSearchText] = useState("");
    const { Search } = Input;
    /**
     * End of code addition by - Om Shrivastava on 26-07-23
     * Reason - To have search functionality
     */

    /**
     * Added by - Om Shrivastava on 26-07-23
     * Reason - method that will execute when page loads. this method will call cutomer list api
     */
    useEffect(() => {
        // Added By Om Shrivastava - 26-07-23
        // Reason - To enable headerSiderbar
        enableHeader()
        // End of code - Om Shrivastava - 26-07-23
        // Added By Om Shrivastava - 26-07-23
        // Reason - To set global Page index Whenever its index updated
        if (localStorage.getItem("globalPageIndex")) {
            currentPage = parseInt(localStorage.getItem("globalPageIndex"))
            setCurrentPage(parseInt(localStorage.getItem("globalPageIndex")))
        }
        // End of code - Om Shrivastava - 26-07-23

        getCountOfCutomers();
        getListOfRatingReview();
    }, []);


    /**
     * End of code addition by - Om Shrivastava on 26-07-23
     * Reason - method that will execute when page loads. this method will call cutomer list api
     */

    /**
     * Added by - Om Shrivastava on 26-07-23
     * Reason - method that will execute when sorting on column is applied or page number is changed.
     *  this method will call customer list api
     */
    useEffect(() => {
        getListOfRatingReview();

        /**
         * Commented and modified by - Om Shrivastava on 26-07-23
         * Reason - To reflect changes when seach text is changed
         */
        // }, [columnToSort, columnSortingOrder, currentPage]);  
        // Modified by Om Shrivastava - 26-07-23 - To add listPerPage Change call 
        // }, [columnToSort, columnSortingOrder, currentPage, searchText]);
    }, [columnToSort, columnSortingOrder, currentPage, searchText, listPerPage]);

    // End of code - Modification - Om Shrivastava - 26-07-23

    /**
     * End of code modification by - Om Shrivastava on 26-07-23
     * Reason - To reflect changes when seach text is changed
     */

    /**
     * End of code addition by - Om Shrivastava on 26-07-23
     * Reason - method that will execute when sorting on column is applied or page number is changed.
     *  this method will call customer list api
     */

    /**
     * Added by - Om Shrivastava on 26-07-23
     * Reason - created api to get count of customers
     */
    const getCountOfCutomers = async () => {
        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
        const response = await getRestaurantRatingReviewCount(tenant);
        setBackendRatingReviewCount(response.ratingCount);
    };
    /**
     * Added by - Om Shrivastava on 26-07-23
     * Reason - created api to get count of customers
     */

    /**
     * Added by - Om Shrivastava on 26-07-23
     * Reason - created api to get list of customers
     */
    const getListOfRatingReview = async () => {
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
             * Added by - Om Shrivastava on 26-07-23
             * Reason - To send search data on backend
             */
            /**
             * Commented and modified by - Om Shrivastava on 26-07-23
             * Reason - To trim search text before sending it to backend
             */
            // searchText: searchText,
            searchText: searchText.trim(),
            /**
             * End of code modification and modified by - Om Shrivastava on 26-07-23
             * Reason - To trim search text before sending it to backend
             */
            /**
             * End of code addition by - Om Shrivastava on 26-07-23
             * Reason - To send search data on backend
             */
        };
        const response = await getRestaurantRatingReviewList(tenant, filteringCriteria);
        setRatingReviewList(response.ratingReviewList);
        /**
         * Added by - Om Shrivastava on 26-07-23
         * Reason - To recalculate page numbers
         */
        setBackendRatingReviewCount(response.ratingReviewListCount)
        /**
         * End of code addition by - Om Shrivastava on 26-07-23
         * Reason - To recalculate page numbers
         */
    };
    /**
     * End of code addition by - Om Shrivastava on 26-07-23
     * Reason - created api to get list of customers
     */

    /**
     * Added by - Om Shrivastava on 26-07-23
     * Reason -  When user changes page number, this method will set page number which will be sent to backend.
     */
    const handlePageChange = async (pageNumber) => {
        //Added by Om Shrivastava - 26-07-23
        // Reason - to set currentpage to global
        localStorage.setItem("globalPageIndex", pageNumber)
        // End of code - Om Shrivastava - 26-07-23
        setCurrentPage(pageNumber);
    };
    /**
     * End of code addition by - Om Shrivastava on 26-07-23
     * Reason -  When user changes page number, this method will set page number which will be sent to backend.
     */

    /**
     * Added by - Om Shrivastava on 26-07-23
     * Reason - Method that will set sorting criteria
     */
    const sortratingReviewList = (columnName) => {
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
     * End of code addition by - Om Shrivastava on 26-07-23
     * Reason - Method that will set sorting criteria
     */

    // Added by Om Shrivastava - 26-07-23
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
    // End of code - Om Shrivastava - 26-07-23

    return (
        // Modified by Om Shrivastava - 26-07-23
        // Reason - removing header from each page and making it global
        // <Header>
        <div className={style.container} >
            <div className={`${style.pageTitleContainer}`}>
                <div className={style.pageTitle}>Rating & Review</div>
            </div>

            <div className={style.ratingListSection}>
                <div className={style.tableContainer}>
                    <div className={style.table}>

                        {/* Added by - Om Shrivastava on 26-07-23
              Reason - To have search functionality */}
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
                  placeholder="Search by - Contact number, Loyality point, Customer name"
                  allowClear
                  enterButton
                  onSearch={(value)=>{setCurrentPage(1); setSearchText(value); }}
                  className={style.searchBox}
                />
              </div> */}
                        {/* End of code addition by - Om Shrivastava on 26-07-23
              Reason - To have search functionality */}

                        <div className={style.tableHeadingContainer}
                            // Added by Om Shrivastava - 26-07-23
                            // Reason- To hide page size dropdown on outer click
                            onClick={hideDropdown}
                            onTouchStart={hideDropdown}
                        // End of code - Om Shrivastava - 26-07-23
                        >

                            <div
                                className={`${style.commonColumnTitle} ${style.commonColumnTitle2}`}
                            >
                                SNo.
                            </div>
                            {/* End of code modification by - Om Shrivastava on - 26-07-23
                Reason - To sort only when we click on label */}

                            <div
                                className={`${style.commonColumnTitle} ${style.commonColumnTitle2}`}
                            >
                                <span onClick={(e) => {
                                    setShowSortingIcon(false);
                                    sortratingReviewList("rating");
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
                                    }}
                                    style={{ wordBreak: "break-word" }}>Rating{" "}</span>
                                <span onClick={(e) => {
                                    setShowSortingIcon(false);
                                    sortratingReviewList("rating");
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
                                </span>
                            </div>
                            {/* End of code modification by - Om Shrivastava on - 26-07-23
                Reason - To sort only when we click on label */}

                            <div
                                // className={style.commonColumnTitle}
                                className={`${style.commonColumnTitle} ${style.commonColumnTitle3}`}

                            >
                                <span
                                    //   onClick={(e) => {
                                    //     setShowSortingIcon(false);
                                    //     sortratingReviewList("last_customer_name");
                                    //   }}
                                    //   onMouseEnter={(e) => {
                                    //     if (columnToSort != "last_customer_name") {
                                    //       setShowSortingIcon(true);
                                    //     }
                                    //   }}
                                    //   onMouseLeave={(e) => {
                                    //     if (columnToSort != "last_customer_name") {
                                    //       setShowSortingIcon(false);
                                    //     }
                                    //   }}
                                     className={style.reviewContainer}
                                    style={{ wordBreak: "break-word",textAlign:'left' }}>Review{" "}</span>
                                {/* <span  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortratingReviewList("last_customer_name");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "last_customer_name") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "last_customer_name") {
                      setShowSortingIcon(false);
                    }
                  }}>
                  {columnToSort == "last_customer_name" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortAlphaDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "last_customer_name" &&
                    columnSortingOrder == "descending" && (
                      <BsSortAlphaDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "last_customer_name" && showSortingIcon && (
                    <BsSortAlphaDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                  </span> */}
                            </div>
                            {/* End of code modification by - Om Shrivastava on - 26-07-23
                Reason - To sort only when we click on label */}

                        </div>
                        <div
                            className={style.tableDataContainer}
                            style={{
                                backgroundColor: "#efefef",
                            }}
                            // Added by Om Shrivastava - 26-07-23
                            // Reason- To hide page size dropdown on outer click
                            onClick={hideDropdown}
                            onTouchStart={hideDropdown}
                        // End of code - Om Shrivastava - 26-07-23
                        >
                            {ratingReviewList != null && ratingReviewList.length > 0 ? (
                                ratingReviewList.map((RatingReviews, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={style.tableData}
                                            style={{
                                                padding: "2px",
                                                marginTop: "2px",
                                                marginBottom:
                                                    ratingReviewList.length == index + 1 ? "2px" : "0px",
                                            }}
                                        >
                                            <div
                                                className={`${style.commonColumnData} ${style.commonColumnData2}`}
                                            >
                                                {/* {RatingReviews.contact_number} */}
                                                {(currentPage * listPerPage - listPerPage) + index + 1}
                                            </div>
                                            <div className={`${style.commonColumnData} ${style.commonColumnData2}`}
                                            >
                                                {RatingReviews.rating != null || RatingReviews.rating != undefined ?
                                                    <>
                                                      <span style={{fontWeight:'bold'}}>
                                                      {RatingReviews.rating} 
                                                        </span> <StarFilled style={{color:'#ffd800'}}/> 
                                                    </> : '-'}
                                            </div>
                                            <div className={style.commonColumnData} style={{ textJustify: 'inter-word',textAlign:'left'}}>
                                                {RatingReviews.review != null || RatingReviews.review != undefined ?
                                                    <>
                                                    
                                                        <ReactReadMoreReadLess
                                                            charLimit={55}
                                                            readMoreText={"more"}
                                                            readLessText={"less"}
                                                        >
                                                            {RatingReviews.review}
                                                        </ReactReadMoreReadLess>
                                                    </> : '---'}
                                                {/* {RatingReviews.review} */}
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
                {ratingReviewList && ratingReviewList.length > 0 ? (
                    // Modified by Om Shrivastava - 26-07-23 
                    // Reason - To divide container into two part for page selector
                    < div className={style.paginationContent}>
                        <Pagination
                            // Modified by Om Shrivastava- 26-07-23
                            // Reason - To open Updated page
                            // defaultCurrent={1}
                            defaultCurrent={currentPage}
                            current={currentPage}
                            total={backenRatingReviewCount}
                            defaultPageSize={listPerPage}
                            // Added by Om Shrivastava- 26-07-23 - to set item per page
                            pageSize={listPerPage}
                            onChange={handlePageChange}
                            simple
                        />
                        <div className={style.dropdown} onClick={toggelDropdown}>
                            <button className={style.dropbtn}>{listPerPage} / Page <MdArrowDropUp style={{ margin: "5px 0" }} /></button>
                            <div className={style.dropdown_content} id="dropdown">
                                {/* Modified by Om Shrivastava - 26-07-23 
                      Reason - To change condition for showing list */}
                                {backenRatingReviewCount > 40 ? <span href="#" onClick={e => { setListPerPage(50); setCurrentPage(1); localStorage.setItem("listPerPage", 50) }} >50 / Page</span> : null}
                                {backenRatingReviewCount > 30 ? <span href="#" onClick={e => { setListPerPage(40); setCurrentPage(1); localStorage.setItem("listPerPage", 40) }} >40 / Page</span> : null}
                                {backenRatingReviewCount > 20 ? <span href="#" onClick={e => { setListPerPage(30); setCurrentPage(1); localStorage.setItem("listPerPage", 30) }} >30 / Page</span> : null}
                                <span href="#" onClick={e => { setListPerPage(20); setCurrentPage(1); localStorage.setItem("listPerPage", 20) }}>20 / Page</span>
                                <span href="#" onClick={e => { setListPerPage(10); localStorage.setItem("listPerPage", 10) }}>10 / Page</span>
                                {/* End of code - Om Shrivastava - 26-07-23 */}
                            </div>
                        </div>
                    </div>
                    //  End of code - Modification - 26-07-23 - Om Shrivastava
                ) : null}
            </div>
        </div>
        // </Header>
    );
};

export default RatingReview;
