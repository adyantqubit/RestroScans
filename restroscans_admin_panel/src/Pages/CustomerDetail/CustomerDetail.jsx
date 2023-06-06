/**
 * Created by - Ashish Dewangan on 03-06-2023
 * Reason - To have customer details section
 */

import React, { useEffect, useState } from "react";
import style from "./customerDetail.module.css";
import Header from "../GlobalComponent/Header";
import { Pagination } from "antd";
import { getCutomersCount, getCustomerList } from "../../Api/services";

const CustomerDetail = () => {
  const [backendCustomersCount, setBackendCustomersCount] = useState(0);
  const [customerList, setCustomerList] = useState([]);
  const [listPerPage, setListPerPage] = useState(10);

  const [callBackend, setCallBackend] = useState(true);

  const [columnToSort, setColumnToSort] = useState("");
  const [columnSortingOrder, setColumnSortingOrder] = useState("");
  var currentPage = 1;

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
   * Reason - Method that will execute When user changes page number.
   * When page number is changed then record of that particular page will be retrievied form backend
   */
  const handlePageChange = async (pageNumber) => {
    currentPage = pageNumber;
    getListOfCustomers();
  };
  /**
   * End of code addition by - Ashish Dewangan on 05-06-2023
   * Reason - Method that will execute When user changes page number.
   * When page number is changed then record of that particular page will be retrievied form backend
   */

  const sortCustomerList = async (columnName) => {
    setCallBackend(false);
    if (columnToSort == columnName) {
      if (columnSortingOrder == "") {
        setColumnSortingOrder("ascending");
        setCallBackend(true);
      } else {
        if (columnSortingOrder == "ascending") {
          setColumnSortingOrder("descending");
          setCallBackend(true);
        } else {
          setColumnSortingOrder("");
          setCallBackend(true);
        }
      }
    } else {
      setColumnSortingOrder("ascending");
      setCallBackend(true);
    }

    setColumnToSort(columnName);

    if (callBackend === true) {
      getListOfCustomers();
    }
  };
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
                    sortCustomerList("last_customer_name");
                  }}
                >
                  {" "}
                  Name{" "}
                </div>
                <div
                  className={style.commonColumnTitle}
                  onClick={(e) => {
                    sortCustomerList("last_email");
                  }}
                >
                  {" "}
                  Email{" "}
                </div>
                <div
                  className={style.commonColumnTitle}
                  onClick={(e) => {
                    sortCustomerList("contact_number");
                  }}
                >
                  {" "}
                  Contact Number{" "}
                </div>
                <div
                  className={style.commonColumnTitle}
                  onClick={(e) => {
                    sortCustomerList("loyality_points");
                  }}
                >
                  {" "}
                  Loyality Points
                </div>
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
                          backgroundColor: "white",
                          padding: "2px",
                          marginTop: "2px",
                          // borderRadius: "8px",
                          marginBottom:
                            customerList.length == index + 1 ? "2px" : "0px",
                          boxShadow:
                            "var(--ds-shadow-raised,0 1px 2px 0 rgba(9,30,66,.25))",
                        }}
                      >
                        <div className={style.commonColumnData}>
                          {customerDetails.last_customer_name}
                        </div>
                        <div className={style.commonColumnData}>
                          {customerDetails.last_email}
                        </div>
                        <div className={style.commonColumnData}>
                          {customerDetails.contact_number}
                        </div>
                        <div className={style.commonColumnData}>
                          {customerDetails.loyality_points}
                        </div>
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

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
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
