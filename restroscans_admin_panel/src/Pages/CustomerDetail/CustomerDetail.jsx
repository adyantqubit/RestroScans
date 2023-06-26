/**
 * Created by - Ashish Dewangan on 03-06-2023
 * Reason - To have customer details section
 */

import React, { useEffect, useState } from "react";
import style from "./customerdetail.module.css";
import Header from "../GlobalComponent/Header";
import { Pagination } from "antd";
import { getCutomersCount, getCustomerList } from "../../Api/services";
import {
  BsSortAlphaDownAlt,
  BsSortAlphaDown,
  BsSortNumericDownAlt,
  BsSortNumericDown,
} from "react-icons/bs";

import { Input, Space } from "antd";
import { MdArrowDropUp } from "react-icons/md";
import { enableHeader } from "../../App";

const CustomerDetail = () => {
  const [backendCustomersCount, setBackendCustomersCount] = useState(0);
  const [customerList, setCustomerList] = useState([]);
  // Modified by Rohan Kansari - 22/6/23 - To Get Selected List page from localstorage on Reload 
  // const [listPerPage, setListPerPage] = useState(localStorage.getItem(10));
  const [listPerPage, setListPerPage] = useState(localStorage.getItem("listPerPage"));
  // End of code - ROhan kansari - 22/6/23

  const [columnToSort, setColumnToSort] = useState("contact_number");
  const [columnSortingOrder, setColumnSortingOrder] = useState("ascending");
  const [showSortingIcon, setShowSortingIcon] = useState(false);
  var [currentPage, setCurrentPage] = useState(1);

  /**
   * Added by - Ashish Dewangan on 14-06-2023
   * Reason - To have search functionality
   */
  const [searchText, setSearchText] = useState("");
  const { Search } = Input;
  /**
   * End of code addition by - Ashish Dewangan on 14-06-2023
   * Reason - To have search functionality
   */

  /**
   * Added by - Ashish Dewangan on 03-06-2023
   * Reason - method that will execute when page loads. this method will call cutomer list api
   */
  useEffect(() => {
     // Added By Rohan Kansari - 25/6/23
        // Reason - To enable headerSiderbar
        enableHeader()
        // End of code - Rohan kansari - 25/6/23
    // Added By Rohan Kansari - 22/6/23
    // Reason - To set global Page index Whenever its index updated
    if (localStorage.getItem("globalPageIndex")){
      currentPage =parseInt(localStorage.getItem("globalPageIndex"))
      setCurrentPage(parseInt(localStorage.getItem("globalPageIndex")))
    }
    // End of code - Rohan kansari - 22/6/23

    getCountOfCutomers();
    getListOfCustomers();
  }, []);


  /**
   * End of code addition by - Ashish Dewangan on 03-06-2023
   * Reason - method that will execute when page loads. this method will call cutomer list api
   */

  /**
   * Added by - Ashish Dewangan on 03-06-2023
   * Reason - method that will execute when sorting on column is applied or page number is changed.
   *  this method will call customer list api
   */
  useEffect(() => {
    getListOfCustomers();

    /**
     * Commented and modified by - Ashish Dewangan on 14-06-2023
     * Reason - To reflect changes when seach text is changed
     */
    // }, [columnToSort, columnSortingOrder, currentPage]);  
    // Modified by ROhan KAnsari - 22/6/23 - To add listPerPage Change call 
    // }, [columnToSort, columnSortingOrder, currentPage, searchText]);
  }, [columnToSort, columnSortingOrder, currentPage, searchText, listPerPage]);

  // End of code - Modification - ROhan KAnsari - 22/6/23

  /**
   * End of code modification by - Ashish Dewangan on 14-06-2023
   * Reason - To reflect changes when seach text is changed
   */

  /**
   * End of code addition by - Ashish Dewangan on 03-06-2023
   * Reason - method that will execute when sorting on column is applied or page number is changed.
   *  this method will call customer list api
   */

  /**
   * Added by - Ashish Dewangan on 05-06-2023
   * Reason - created api to get count of customers
   */
  const getCountOfCutomers = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await getCutomersCount(tenant);
    setBackendCustomersCount(response.cutomersCount);
  };
  /**
   * Added by - Ashish Dewangan on 05-06-2023
   * Reason - created api to get count of customers
   */

  /**
   * Added by - Ashish Dewangan on 03-06-2023
   * Reason - created api to get list of customers
   */
  const getListOfCustomers = async () => {
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
       * Added by - Ashish Dewangan on 14-06-2023
       * Reason - To send search data on backend
       */
      /**
       * Commented and modified by - Ashish Dewangan on 17-06-2023
       * Reason - To trim search text before sending it to backend
       */
      // searchText: searchText,
      searchText: searchText.trim(),
      /**
       * End of code modification and modified by - Ashish Dewangan on 17-06-2023
       * Reason - To trim search text before sending it to backend
       */
      /**
       * End of code addition by - Ashish Dewangan on 14-06-2023
       * Reason - To send search data on backend
       */
    };
    const response = await getCustomerList(tenant, filteringCriteria);
    setCustomerList(response.customerList);
    /**
     * Added by - Ashish Dewangan on 14-06-2023
     * Reason - To recalculate page numbers
     */
    setBackendCustomersCount(response.customerListCount)
    /**
     * End of code addition by - Ashish Dewangan on 14-06-2023
     * Reason - To recalculate page numbers
     */
  };
  /**
   * End of code addition by - Ashish Dewangan on 03-06-2023
   * Reason - created api to get list of customers
   */

  /**
   * Added by - Ashish Dewangan on 05-06-2023
   * Reason -  When user changes page number, this method will set page number which will be sent to backend.
   */
  const handlePageChange = async (pageNumber) => {
    //Added by ROhan KAnsari - 22/6/23
    // Reason - to set currentpage to global
    localStorage.setItem("globalPageIndex", pageNumber)
    // End of code - Rohan Kansari - 22/6/23
    setCurrentPage(pageNumber);
  };
  /**
   * End of code addition by - Ashish Dewangan on 05-06-2023
   * Reason -  When user changes page number, this method will set page number which will be sent to backend.
   */

  /**
   * Added by - Ashish Dewangan on 06-06-2023
   * Reason - Method that will set sorting criteria
   */
  const sortCustomerList = (columnName) => {
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
   * End of code addition by - Ashish Dewangan on 06-06-2023
   * Reason - Method that will set sorting criteria
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

  return (
  // Modified by Rohan Kansari - 25/6/23
    // Reason - removing header from each page and making it global
    // <Header>
      <div className={style.container}>
        <div className={`${style.pageTitleContainer}`}>
          <div className={style.pageTitle}>Customer List</div>
        </div>

        <div className={style.customerListSection}>
          <div className={style.tableContainer}>
            <div className={style.table}>

              {/* Added by - Ashish Dewangan on 14-06-2023
              Reason - To have search functionality */}
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
                /**
                 * Commented and modified by - Ashish Dewangan on 17-06-2023
                 * Reason - To change placeholder of search box
                 */
                  // placeholder="input search text"
                  placeholder="Search by - Contact number, Loyality point, Customer name"
                   /**
                 * End of code modification by - Ashish Dewangan on 17-06-2023
                 * Reason - To change placeholder of search box
                 */
                  allowClear
                  enterButton
                  // onChange={(e)=>{e.target.value.length>=3 && setSearchText(e.target.value);}}
                  onSearch={(value)=>{setCurrentPage(1); setSearchText(value); }}
                  /**
                   * Commented and modified by - Ashish Dewangan on 15-06-2023
                   * Reason - To move styling of searchbox to css file
                   */
                  // style={{
                  //   width: "60%",
                  // }}
                  className={style.searchBox}
                  /**
                   * End of code modification by - Ashish Dewangan on 15-06-2023
                   * Reason - To move styling of searchbox to css file
                   */
                />
              </div>
              {/* End of code addition by - Ashish Dewangan on 14-06-2023
              Reason - To have search functionality */}

              <div className={style.tableHeadingContainer}
                // Added by Rohan Kansari - 22/6/23
                // Reason- To hide page size dropdown on outer click
                onClick={hideDropdown}
                onTouchStart={hideDropdown}
              // End of code - ROhan KAnsari - 22/6/23
              >

               {/* Commented and modified by - Ashish Dewangan on - 17-06-2023
                Reason - To sort only when we click on label */}
                {/* <div
                  className={style.commonColumnTitle}
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortCustomerList("contact_number");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "contact_number") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "contact_number") {
                      setShowSortingIcon(false);
                    }
                  }}
                >
                  Contact Number{" "}
                  {columnToSort == "contact_number" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortNumericDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "contact_number" &&
                    columnSortingOrder == "descending" && (
                      <BsSortNumericDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "contact_number" && showSortingIcon && (
                    <BsSortNumericDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                </div> */}
                <div
                  className={style.commonColumnTitle}
                 
                >
                  <span  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortCustomerList("contact_number");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "contact_number") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "contact_number") {
                      setShowSortingIcon(false);
                    }
                  }} 
                  style={{wordBreak:"break-word"}}>Contact Number{" "}</span>
                  <span  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortCustomerList("contact_number");
                  }}
                    onMouseEnter={(e) => {
                      if (columnToSort != "contact_number") {
                        setShowSortingIcon(true);
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (columnToSort != "contact_number") {
                        setShowSortingIcon(false);
                      }
                    }}>
                    {columnToSort == "contact_number" &&
                      columnSortingOrder == "ascending" && (
                        <BsSortNumericDown className={style.sortingIcon} />
                      )}
                    {columnToSort == "contact_number" &&
                      columnSortingOrder == "descending" && (
                        <BsSortNumericDownAlt className={style.sortingIcon} />
                      )}
                    {columnToSort != "contact_number" && showSortingIcon && (
                      <BsSortNumericDown
                        color="grey"
                        className={style.sortingIcon}
                      />
                    )}
                  </span>
                </div>
                {/* End of code modification by - Ashish Dewangan on - 17-06-2023
                Reason - To sort only when we click on label */}
                
                 {/* Commented and modified by - Ashish Dewangan on - 17-06-2023
                Reason - To sort only when we click on label */}
                {/* <div
                  className={style.commonColumnTitle}
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortCustomerList("loyality_points");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "loyality_points") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "loyality_points") {
                      setShowSortingIcon(false);
                    }
                  }}
                >
                  Loyality Points{" "}
                  {columnToSort == "loyality_points" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortNumericDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "loyality_points" &&
                    columnSortingOrder == "descending" && (
                      <BsSortNumericDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "loyality_points" && showSortingIcon && (
                    <BsSortNumericDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                </div> */}
                <div
                  className={style.commonColumnTitle}
                 
                >
                  <span  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortCustomerList("loyality_points");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "loyality_points") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "loyality_points") {
                      setShowSortingIcon(false);
                    }
                  }}
                  style={{wordBreak:"break-word"}}>Loyality Points{" "}</span>
                  <span  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortCustomerList("loyality_points");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "loyality_points") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "loyality_points") {
                      setShowSortingIcon(false);
                    }
                  }}>
                  {columnToSort == "loyality_points" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortNumericDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "loyality_points" &&
                    columnSortingOrder == "descending" && (
                      <BsSortNumericDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "loyality_points" && showSortingIcon && (
                    <BsSortNumericDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                  </span>
                </div>
                 {/* End of code modification by - Ashish Dewangan on - 17-06-2023
                Reason - To sort only when we click on label */}    

                 {/* Commented and modified by - Ashish Dewangan on - 17-06-2023
                Reason - To sort only when we click on label */}
                {/* <div
                  className={style.commonColumnTitle}
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortCustomerList("last_customer_name");
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
                  }}
                >
                  Name{" "}
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
                </div> */}
                <div
                  className={style.commonColumnTitle}
                 
                >
                  <span  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortCustomerList("last_customer_name");
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
                  }}
                  style={{wordBreak:"break-word"}}>Name{" "}</span>
                  <span  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortCustomerList("last_customer_name");
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
                  </span>
                </div>
                 {/* End of code modification by - Ashish Dewangan on - 17-06-2023
                Reason - To sort only when we click on label */}

                {/* Commented by - Ashish Dewangan on 07-06-2023
                Reason - Displaying email is not required */}
                {/* <div
                  className={style.commonColumnTitle}
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortCustomerList("last_email");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "last_email") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "last_email") {
                      setShowSortingIcon(false);
                    }
                  }}
                  style={{ width: "300px" }}
                >
                  Email{" "}
                  {columnToSort == "last_email" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortAlphaDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "last_email" &&
                    columnSortingOrder == "descending" && (
                      <BsSortAlphaDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "last_email" && showSortingIcon && (
                    <BsSortAlphaDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                </div> */}
                {/* End of comment by - Ashish Dewangan on 07-06-2023
                Reason - Displaying email is not required */}
              </div>
              <div
                className={style.tableDataContainer}
                style={{
                  backgroundColor: "#efefef",
                }}
                // Added by Rohan Kansari - 22/6/23
                // Reason- To hide page size dropdown on outer click
                onClick={hideDropdown}
                onTouchStart={hideDropdown}
              // End of code - ROhan KAnsari - 22/6/23
              >
                {customerList != null && customerList.length > 0 ? (
                  customerList.map((customerDetails, index) => {
                    return (
                      <div
                      key={index}
                        className={style.tableData}
                        style={{
                          padding: "2px",
                          marginTop: "2px",
                          marginBottom:
                            customerList.length == index + 1 ? "2px" : "0px",
                        }}
                      >
                        <div className={style.commonColumnData}>
                          {customerDetails.contact_number}
                        </div>
                        <div className={style.commonColumnData}>
                          {customerDetails.loyality_points}
                        </div>
                        <div className={style.commonColumnData}>
                          {customerDetails.last_customer_name}
                        </div>
                        {/* Commented by - Ashish Dewangan on 07-06-2023
                        Reason - Displaying email is not required */}
                        {/* <div
                          className={style.commonColumnData}
                        >
                          {customerDetails.last_email}
                        </div> */}
                        {/* End of comment by - Ashish Dewangan on 07-06-2023
                        Reason - Displaying email is not required */}
                      </div>
                    );
                  })
                ) : (
                  // Commented and modified by - Ashish Dewangan on 14-06-2023
                  // Reason - To change message when search record is not found
                  // <div style={{ textAlign: "center" }}>Please Add Settings</div>
                  <div style={{ textAlign: "center" }}>No records found!</div>
                  // End of code modification by - Ashish Dewangan on 14-06-2023
                  // Reason - To change message when search record is not found
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={style.paginationContainer}>
          {customerList && customerList.length > 0 ? (
            // Modified by Rohan kansari - 22/6/23 
            // Reason - To divide container into two part for page selector
            < div className={style.paginationContent}>
              <Pagination
                // Modified by Rohan Kansari- 22/6/23
                // Reason - To open Updated page
                // defaultCurrent={1}
                defaultCurrent={currentPage}
                /**
                 * Added by - Ashish Dewangan on 14-06-2023
                 * Reason - To set current selected page number
                 */
                current={currentPage}
                /**
                 * End of code addition by - Ashish Dewagnan on 14-06-2023
                 * Reason - To set current selected page number
                 */
                total={backendCustomersCount}
                defaultPageSize={listPerPage}
                // Added by Rohan Kansari- 22/6/23 - to set item per page
                pageSize={listPerPage}
                onChange={handlePageChange}
                simple
              />
              <div className={style.dropdown} onClick={toggelDropdown}>
                <button className={style.dropbtn}>{listPerPage} / Page <MdArrowDropUp style={{ margin: "5px 0" }} /></button>
                <div className={style.dropdown_content} id="dropdown">
                  {/* Modified by ROhan kansari - 26/6/23 
                      Reason - To change condition for showing list */}
                  {backendCustomersCount>40?<span href="#" onClick={e => { setListPerPage(50); setCurrentPage(1); localStorage.setItem("listPerPage", 50) }} >50 / Page</span>:null}
                  {backendCustomersCount>30?<span href="#" onClick={e => { setListPerPage(40); setCurrentPage(1); localStorage.setItem("listPerPage", 40) }} >40 / Page</span>:null}
                  {backendCustomersCount>20?<span href="#" onClick={e => { setListPerPage(30); setCurrentPage(1); localStorage.setItem("listPerPage", 30) }} >30 / Page</span>:null}
                  <span href="#" onClick={e => { setListPerPage(20); setCurrentPage(1); localStorage.setItem("listPerPage", 20) }}>20 / Page</span>
                  <span href="#" onClick={e => { setListPerPage(10); localStorage.setItem("listPerPage", 10) }}>10 / Page</span>
                {/* End of code - Rohan kansari - 26/6/23 */}
                </div>
              </div>
            </div>
            //  End of code - Modification - 22/6/23 - Rohan Kansari
          ) : null}
        </div>
      </div>
    // </Header>
  );
};

export default CustomerDetail;
