import React, { useEffect } from "react";
import style from "../style/customerdetail.module.css";
import Header from "../../../../components/Header/Header";
import { loadCustomerCount, loadCustomers } from "../../services/customerDetailService";
import {
  BsSortAlphaDownAlt,
  BsSortAlphaDown,
  BsSortNumericDownAlt,
  BsSortNumericDown,
} from "react-icons/bs";

import { useApp } from "../../../../Context/AppContext";
import { useCustomerDetailState } from "../../usestate/customerDetailState";
import RecordPage from "../../../../components/RecordPage/RecordPage";

const CustomerDetail = () => {
  const { enableHeader } = useApp();
  var {
    backendCustomersCount,
    setBackendCustomersCount,
    customerList,
    setCustomerList,
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
  } = useCustomerDetailState();

  useEffect(() => {
    enableHeader()
    if (localStorage.getItem("globalPageIndex")) {
      currentPage = parseInt(localStorage.getItem("globalPageIndex"))
      setCurrentPage(parseInt(localStorage.getItem("globalPageIndex")))
    }

    getCountOfCutomers();
    getListOfCustomers();
  }, []);

  useEffect(() => {
    getListOfCustomers();
  }, [columnToSort, columnSortingOrder, currentPage, searchText, listPerPage]);

  const getCountOfCutomers = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await loadCustomerCount(tenant);
    setBackendCustomersCount(response.cutomersCount);
  };

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
      searchText: searchText.trim(),
    };
    const response = await loadCustomers(tenant, filteringCriteria);
    setCustomerList(response.customerList);
    setBackendCustomersCount(response.customerListCount)
  };

  const handlePageChange = async (pageNumber) => {
    localStorage.setItem("globalPageIndex", pageNumber)
    setCurrentPage(pageNumber);
  };

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

  function hideDropdown() {
    ((document.getElementById("dropdown") || { style: {} }).style.display = "")
  }

  return (
    <RecordPage
      title="Customers"
      showForm={false}
      searchPlaceholder="Search name, contact, or loyalty points"
      onSearch={(value) => { setCurrentPage(1); setSearchText(value); }}
      total={backendCustomersCount}
      currentPage={currentPage}
      listPerPage={listPerPage}
      onPageChange={handlePageChange}
      setListPerPage={setListPerPage}
      setCurrentPage={setCurrentPage}
      hasRows={Boolean(customerList && customerList.length > 0)}
    >
      <div className={style.customerListSection}>
        <div className={style.tableContainer}>
          <div className={style.table}>
            <div className={style.tableHeadingContainer}
              onClick={hideDropdown}
              onTouchStart={hideDropdown}
            >

              <div
                className={style.commonColumnTitle}

              >
                <span onClick={(e) => {
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
                  style={{ wordBreak: "break-word" }}>Contact Number{" "}</span>
                <span onClick={(e) => {
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

              <div
                className={style.commonColumnTitle}

              >
                <span onClick={(e) => {
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
                  style={{ wordBreak: "break-word" }}>Loyality Points{" "}</span>
                <span onClick={(e) => {
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

              <div
                className={style.commonColumnTitle}

              >
                <span onClick={(e) => {
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
                  style={{ wordBreak: "break-word" }}>Name{" "}</span>
                <span onClick={(e) => {
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

            </div>
            <div
              className={style.tableDataContainer}
              style={{
                backgroundColor: "#efefef",
              }}
              onClick={hideDropdown}
              onTouchStart={hideDropdown}
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

    </RecordPage>
  );
};

export default CustomerDetail;
