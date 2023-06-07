/**
 * Created by - Ashish Dewangan on 03-06-2023
 * Reason - To have customer details section
 */

import React, { useEffect, useState } from "react";
import style from "./customerDetail.module.css";
import Header from "../GlobalComponent/Header";
import { Pagination } from "antd";
import { getCutomersCount, getCustomerList } from "../../Api/services";
import {
  BsSortAlphaDownAlt,
  BsSortAlphaDown,
  BsSortNumericDownAlt,
  BsSortNumericDown,
} from "react-icons/bs";

const CustomerDetail = () => {
  const [backendCustomersCount, setBackendCustomersCount] = useState(0);
  const [customerList, setCustomerList] = useState([]);
  const [listPerPage, setListPerPage] = useState(10);

  const [columnToSort, setColumnToSort] = useState("contact_number");
  const [columnSortingOrder, setColumnSortingOrder] = useState("ascending");
  const [showSortingIcon, setShowSortingIcon] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Added by - Ashish Dewangan on 03-06-2023
   * Reason - method that will execute when page loads. this method will call cutomer list api
   */
  useEffect(() => {
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
  }, [columnToSort, columnSortingOrder, currentPage]);
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
    };
    const response = await getCustomerList(tenant, filteringCriteria);
    setCustomerList(response.customerList);
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

  return (
    <Header>
      <div className={style.container}>
        <div className={`${style.pageTitleContainer}`}>
          <div className={style.pageTitle}>Customer List</div>
        </div>
        <div className={style.customerListSection}>
          <div className={style.tableContainer}>
            <div className={style.table}>
              <div className={style.tableHeadingContainer}>
                <div
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
                </div>
                <div
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
                </div>
                <div
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
                </div>
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
              >
                {customerList != null && customerList.length > 0 ? (
                  customerList.map((customerDetails, index) => {
                    return (
                      <div
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
                  <div style={{ textAlign: "center" }}>Please Add Settings</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={style.paginationContainer}>
          {customerList && customerList.length > 0 ? (
            <Pagination
              defaultCurrent={1}
              total={backendCustomersCount}
              defaultPageSize={listPerPage}
              onChange={handlePageChange}
            />
          ) : null}
        </div>
      </div>
    </Header>
  );
};

export default CustomerDetail;
