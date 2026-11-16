import React, { useEffect } from "react";
import style from "../style/customerReport.module.css";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { loadCustomerReport } from "../../services/reportService";
import { useApp } from "../../../../Context/AppContext";
import {
  BsSortAlphaDownAlt,
  BsSortAlphaDown,
  BsSortNumericDownAlt,
  BsSortNumericDown,
} from "react-icons/bs";
import { Input } from "../../../../ui";
import Screen from "../../../../components/erp/Screen";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { useCustomerReportState } from "../../usestate/customerReportState";
import ListPagination from "../../../../components/ListPagination/ListPagination";

const CustomerReport = () => {
  const { Message, enableHeader } = useApp();
  const ExportToExcel = ({ apiData, fileName }) => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const exportToCSV = (apiData, fileName) => {
      var data = JSON.parse(apiData);
      var filteredData = data.map((e) => {
        // delete e["last_customer_name"]
        // delete e["send_notification_on_tableNum_update"]
        delete Object.assign(e, { Name: e["last_customer_name"] })[
          "last_customer_name"
        ];
        delete Object.assign(e, { Email: e["email"] })["email"];
        delete Object.assign(e, { "Contact Number": e["contact_number"] })[
          "contact_number"
        ];
        delete Object.assign(e, { "Total Orders": e["numberOfOrders"] })[
          "numberOfOrders"
        ];
        delete Object.assign(e, { "Pending Orders": e["pendingOrders"] })[
          "pendingOrders"
        ];
        delete Object.assign(e, { "Cancelled Order": e["cancelledOrder"] })[
          "cancelledOrder"
        ];
        delete Object.assign(e, { "Completed Order": e["completedOrder"] })[
          "completedOrder"
        ];
        delete Object.assign(e, { "Total Amount": e["totalAmount"] })[
          "totalAmount"
        ];
        delete Object.assign(e, { "Loyalty Points ": e["loyality_points"] })[
          "loyality_points"
        ];

        return e;
      });
      if (filteredData.length) {
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
      } else {
        Message("No Data is Found", "warning");
      }
    };
    return (
      <button
        className={style.PrintBtn}
        onClick={(e) => exportToCSV(apiData, fileName)}>
        Download
      </button>
    );
  };

  const { Search } = Input;
  var {
    searchText,
    setSearchText,
    value,
    onChange,
    pageIndex,
    setPageIndex,
    showSortingIcon,
    setShowSortingIcon,
    columnToSort,
    setColumnToSort,
    columnSortingOrder,
    setColumnSortingOrder,
    listPerPage,
    setListPerPage,
    currentPage,
    setCurrentPage,
    backendReportCount,
    setBackendReportCount,
    customerReportDetails,
    setCustomerReportDetails,
  } = useCustomerReportState();
  var backgroundColor = 1;

  const sortCustomerReportList = (columnName) => {
    if (columnToSort == columnName) {
      if (columnSortingOrder == "ascending") {
        setColumnSortingOrder("descending");
      } else {
        setColumnSortingOrder("ascending");
      }
    }
    setColumnToSort(columnName);
  };

  useEffect(() => {
    enableHeader();
    if (localStorage.getItem("globalPageIndex")) {
      currentPage = parseInt(localStorage.getItem("globalPageIndex"));
      setCurrentPage(parseInt(localStorage.getItem("globalPageIndex")));
    }
  }, []);

  useEffect(() => {
    enableHeader();
    postOrderQuery();
    localStorage.setItem("globalPageIndex", currentPage);
  }, [columnToSort, columnSortingOrder, searchText, currentPage, listPerPage]);

  async function postOrderQuery() {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const paginationDetails = {
      currentPage: currentPage,
      listPerPage: listPerPage,
    };
    const filteringCriteria = {
      pageIndex: pageIndex,
      paginationDetails: paginationDetails,
      columnToSort: columnToSort,
      columnSortingOrder: columnSortingOrder,
      searchText: searchText?.trim(),
    };
    await loadCustomerReport(tenant, filteringCriteria).then((response) => {
      setCustomerReportDetails(response.customerList);
      setBackendReportCount(response.customerListCount);
    });
  }
  const handlePageChange = async (pageNumber) => {
    localStorage.setItem("globalPageIndex", pageNumber);
    setCurrentPage(pageNumber);
  };

  function hideDropdown() {
    if (document.getElementById("dropdown"))
      ((document.getElementById("dropdown") || { style: {} }).style.display = "")
  }

  return (
    <Screen title="Customer report" kicker="Reports">
      <div className={style.reportContainer}>
        <div className={`${style.pageTitleContainer}`}>
          <div className={style.pageTitle}>Customer Report</div>
        </div>

        <div className={style.buttonSearchContainer}>
          <div
            className={style.searchBox}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              padding: "4px",
            }}>
            <Search
              placeholder="Search by- Customer Name,Contact Number or Email"
              allowClear
              enterButton
              onChange={(event) => {
                setCurrentPage(1);
                setSearchText(event.target.value);
              }}
              onSearch={(value) => {
                setCurrentPage(1);
                setSearchText(value);
              }}
            />
          </div>
          <div className={style.BtnContainer}>
            <ExportToExcel
              apiData={JSON.stringify(customerReportDetails)}
              fileName="Excel_report"
            />
          </div>
        </div>
        <div className={style.orderListSection}>
          <div className={style.tableContainer}>
            <div className={style.table}>
              <div
                className={style.tableHeadingContainer}
                onClick={hideDropdown}
                onTouchStart={hideDropdown}

              >
                <div className={`${style.sNoColumn} ${style.smallColumnWidth}`}>
                  S.No.{" "}
                </div>
                <div className={style.nameCol}
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortCustomerReportList("last_customer_name");
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

                <div
                  className={style.numberColumn}
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortCustomerReportList("contact_number");
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
                  className={style.emailColumn}
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortCustomerReportList("email");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "email") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "email") {
                      setShowSortingIcon(false);
                    }
                  }}
                >
                  Email{" "}
                  {columnToSort == "email" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortAlphaDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "email" &&
                    columnSortingOrder == "descending" && (
                      <BsSortAlphaDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "email" && showSortingIcon && (
                    <BsSortAlphaDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                </div>

                <div className={style.NoOfOrdersColumn}
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortCustomerReportList("numberOfOrders");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "numberOfOrders") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "numberOfOrders") {
                      setShowSortingIcon(false);
                    }
                  }}
                >
                  Total Orders{" "}
                  {columnToSort == "numberOfOrders" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortNumericDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "numberOfOrders" &&
                    columnSortingOrder == "descending" && (
                      <BsSortNumericDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "numberOfOrders" && showSortingIcon && (
                    <BsSortNumericDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                </div>

                <div className={style.NoOfOrdersColumn}
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortCustomerReportList("pendingOrders");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "pendingOrders") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "pendingOrders") {
                      setShowSortingIcon(false);
                    }
                  }}
                >
                  Pending Orders{" "}
                  {columnToSort == "pendingOrders" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortNumericDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "pendingOrders" &&
                    columnSortingOrder == "descending" && (
                      <BsSortNumericDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "pendingOrders" && showSortingIcon && (
                    <BsSortNumericDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                </div>

                <div
                  className={style.cancelCol}
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortCustomerReportList("cancelledOrder");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "cancelledOrder") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "cancelledOrder") {
                      setShowSortingIcon(false);
                    }
                  }}>
                  Cancelled Order{" "}
                  {columnToSort == "cancelledOrder" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortNumericDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "cancelledOrder" &&
                    columnSortingOrder == "descending" && (
                      <BsSortNumericDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "cancelledOrder" && showSortingIcon && (
                    <BsSortNumericDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                </div>

                <div
                  className={style.compCol}
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortCustomerReportList("completedOrder");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "completedOrder") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "completedOrder") {
                      setShowSortingIcon(false);
                    }
                  }}>
                  Completed Order{" "}
                  {columnToSort == "completedOrder" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortNumericDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "completedOrder" &&
                    columnSortingOrder == "descending" && (
                      <BsSortNumericDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "completedOrder" && showSortingIcon && (
                    <BsSortNumericDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                </div>

                <div
                  className={style.totalColumn}
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortCustomerReportList("totalAmount");
                  }}
                  onMouseEnter={(e) => {
                    if (columnToSort != "totalAmount") {
                      setShowSortingIcon(true);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (columnToSort != "totalAmount") {
                      setShowSortingIcon(false);
                    }
                  }}>
                  Total Amount{" "}
                  {columnToSort == "totalAmount" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortNumericDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "totalAmount" &&
                    columnSortingOrder == "descending" && (
                      <BsSortNumericDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "totalAmount" && showSortingIcon && (
                    <BsSortNumericDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                </div>
                <div
                  className={style.pointCol}
                  onClick={(e) => {
                    setShowSortingIcon(false);
                    sortCustomerReportList("loyality_points");
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
                  Loyalty Points{" "}
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

              </div>
              <div
                className={style.tableDataContainer}
                style={{
                  backgroundColor: "#efefef",
                }}
                onClick={hideDropdown}
                onTouchStart={hideDropdown}
              >
                {customerReportDetails && customerReportDetails.length > 0 ? (
                  customerReportDetails.map((customerReportDetails, index) => {
                    return (
                      <div
                        key={index}
                        className={style.tableData}
                        style={{
                          padding: "2px",
                          marginTop: "2px",
                          marginBottom:
                            customerReportDetails.length == index + 1
                              ? "2px"
                              : "px",
                          background:
                            backgroundColor++ % 2 == 0 ? "white" : "#1677ff14",
                        }}>
                        <div
                          className={`${style.sNoColumn} ${style.smallColumnWidth}`}>
                          {currentPage * listPerPage - listPerPage + index + 1}
                        </div>
                        <div
                          className={`${style.nameCol} ${style.commonColumnData}`}>
                          {customerReportDetails.last_customer_name}
                        </div>

                        <div
                          className={`${style.numberColumn} ${style.commonColumnData}`}>
                          <span> {customerReportDetails.contact_number}</span>
                        </div>
                        <div
                          className={`${style.emailColumn} ${style.commonColumnData}`}>
                          <span> {customerReportDetails.email} </span>
                        </div>
                        <div
                          className={`${style.NoOfOrdersColumn} ${style.commonColumnData}`}
                        >
                          {customerReportDetails.numberOfOrders}
                        </div>

                        <div
                          className={`${style.NoOfOrdersColumn} ${style.commonColumnData}`}
                        >
                          {customerReportDetails.pendingOrders}
                        </div>

                        <div
                          className={`${style.cancelCol} ${style.commonColumnData}`}>
                          {customerReportDetails.cancelledOrder}
                        </div>
                        <div
                          className={`${style.compCol} ${style.commonColumnData}`}>
                          {customerReportDetails?.completedOrder}
                        </div>
                        <div
                          className={`${style.totalColumn} ${style.commonColumnData}`}>
                          {(customerReportDetails.totalAmount).toFixed(2)}
                        </div>
                        <div
                          className={`${style.pointCol} ${style.commonColumnData}`}>
                          {customerReportDetails.loyality_points}
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

        <ListPagination
          styles={style}
          hasRows={Boolean(backendReportCount && backendReportCount > 0)}
          total={backendReportCount}
          currentPage={currentPage}
          listPerPage={listPerPage}
          onPageChange={handlePageChange}
          setListPerPage={setListPerPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </Screen>
  );
};

export default CustomerReport;
