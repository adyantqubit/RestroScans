// Commented by pratap sahu on 25-08-2023
// Reason:to create Customer Report page from scratch
// import React, { useEffect } from 'react'
// import style from "./customerReport.module.css"
// import Header from '../GlobalComponent/Header'
// import { enableHeader } from '../../App'

// const CustomerReport = () => {
//   useEffect(() => {
//     // Added By Rohan Kansari - 25/6/23
//     // Reason - To enable headerSiderbar
//     enableHeader()
//     // End of code - Rohan kansari - 25/6/23
//   }, [])
//   return (
//    // Modified by Rohan Kansari - 25/6/23
//     // Reason - removing header from each page and making it global
//     // <Header>
//     <div className={style.customerContainer}>
//       <div className={style.filterContainer}>

//       </div>

//       <div className={style.tabelContainer}>

//       </div>
//     </div>
//     // </Header>
//   )
// }
// export default CustomerReport

// End of Comment by pratap sahu on 25-08-2023 Reason:to create Customer Report page from scratch

// Created By Pratap sahu on 25-08-2023
// Reason:To have Customer Report Section
import React, { useEffect, useState } from "react";
import style from "./customerReport.module.css";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { getCustomerReportApi } from "../../Api/services";
import { Message, enableHeader } from "../../App";
import {
  BsSortAlphaDownAlt,
  BsSortAlphaDown,
  BsSortNumericDownAlt,
  BsSortNumericDown,
} from "react-icons/bs";
import { Input, Pagination } from "antd";
import { MdArrowDropUp } from "react-icons/md";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const CustomerReport = () => {
  // Added by Pratap Sahu on 06/09/23 - To download report in excel sheet
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
        delete Object.assign(e, { "Total Amount": e["totalAmount"] })[
          "totalAmount"
        ];
        delete Object.assign(e, { "Loyalty Points ": e["loyality_points"] })[
          "loyality_points"
        ];
        delete Object.assign(e, { "Completed Order": e["completedOrder"] })[
          "completedOrder"
        ];
        delete Object.assign(e, { "Cancelled Order": e["cancelledOrder"] })[
          "cancelledOrder"
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
        Print Report
      </button>
    );
    // End Of Addition by- Pratap Sahu on 06/09/23 - To download report in excel sheet
  };

  const { Search } = Input;
  const [searchText, setSearchText] = useState("");
  var backgroundColor = 1;
  const [value, onChange] = useState("");

  // Added by :- Pratap sahu on 23-08-2023  Reason :- used for sorting
  const [pageIndex, setPageIndex] = useState(1);
  const [showSortingIcon, setShowSortingIcon] = useState(false);
  const [columnToSort, setColumnToSort] = useState("last_customer_name");
  const [columnSortingOrder, setColumnSortingOrder] = useState("descending");
  // End of Added code by :- Pratap sahu on 23-08-2023
  // Reason :-  used for shorting

  // Added by :- Pratap sahu on 23-08-2023
  // Reason :- used for pagination
  const [listPerPage, setListPerPage] = useState(
    localStorage.getItem("listPerPage")
  );
  var [currentPage, setCurrentPage] = useState(1);
  const [backendReportCount, setBackendReportCount] = useState(0);
  const [customerReportDetails, setCustomerReportDetails] = useState(null);
  // End of Added code by :- Pratap sahu on 23-08-2023
  // Reason :-  used for pagination

  // Added by - Pratap sahu on 28-08-2023  Reason - Method that will set sorting criteria
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
  //  End of code addition by -Pratap sahu on 28-08-2023 Reason - Method that will set sorting criteria

  // Added By Pratap sahu on 23-08-2023
  // Reason - To set global Page index Whenever its index updated
  useEffect(() => {
    enableHeader();
    if (localStorage.getItem("globalPageIndex")) {
      currentPage = parseInt(localStorage.getItem("globalPageIndex"));
      setCurrentPage(parseInt(localStorage.getItem("globalPageIndex")));
    }
  }, []);

  // Added by :- Pratap sahu   on 23-08-2023 reason :- update the useEffect calling for sorting filter
  useEffect(() => {
    enableHeader();
    postOrderQuery();
    localStorage.setItem("globalPageIndex", currentPage);
  }, [columnToSort, columnSortingOrder, searchText, currentPage, listPerPage]);
  // End of Added Code by :- Pratap sahu   on 23-08-2023 reason :- update the useEffect calling for sorting and filter

  // Added by :-Pratap sahu on 28-08-2023
  // reason :- making a data for sorting and paginations
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
    await getCustomerReportApi(tenant, filteringCriteria).then((response) => {
      setCustomerReportDetails(response.customerList);
      setBackendReportCount(response.customerListCount);
    });

  }
  //End of Addition by :-Pratap sahu on 28-08-2023
  // reason :- making a data for sorting and paginations
  /**
   * Added by -  Pratap Sahu on 25-08-2023
   * Reason -  When user changes page number, this method will set page number which will be sent to backend.
   */
  const handlePageChange = async (pageNumber) => {
    localStorage.setItem("globalPageIndex", pageNumber);
    setCurrentPage(pageNumber);
  };
  /**
   * End of code addition by - Pratap Sahu on 25-08-2023
   * Reason -  When user changes page number, this method will set page number which will be sent to backend.
   */

  // Added by  Pratap Sahu on 25-08-2023
  // Reason - To toggle dropdown visiblity on click
  function toggleDropdown() {
    if (document.getElementById("dropdown").style.display.length == 0)
      document.getElementById("dropdown").style.display = "block";
    else document.getElementById("dropdown").style.display = "";
  }
  // Added by Pratap sahu on 26-08-2023
  // Reason- To hide page size dropdown on outer click
  // function hideDropdown(e) {
  //   e.target.style.display = "none";
  // }
  // if (backendReportCount && backendReportCount.length > 0) {
  //   e.style.display = "";
  // }
  // End of Added code by Pratap Sahu on 26-08-2023 Reason- To hide page size dropdown on outer click

  return (
    <div className={style.reportContainer}>
      <div className={`${style.pageTitleContainer}`}>
        <div className={style.pageTitle}>Customer Report</div>
      </div>

      <div className={style.buttonSearchContainer}>
        {/*  addition by - Pratap sahu on 26-08-2023
              Reason - To have search functionality */}
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
            // onChange={(e)=>{e.target.value.length>=3 && setSearchText(e.target.value);}}
            onSearch={(value) => {
              setCurrentPage(1);
              setSearchText(value);
            }}
          />
        </div>
        {/* end of addition by - Pratap sahu on 26-08-2023
              Reason - To have search Input box */}
        <div className={style.BtnContainer}>
          <ExportToExcel
            apiData={JSON.stringify(customerReportDetails)}
            fileName="Excel_report"
          />
          {/* <button className={style.PrintBtn}>Print Report</button> */}
        </div>
      </div>
      <div className={style.orderListSection}>
        <div className={style.tableContainer}>
          <div className={style.table}>
            <div
              className={style.tableHeadingContainer}
              // onClick={(e)=>{hideDropdown(e)}}
              // onTouchStart={(e)=>{hideDropdown(e)}}
            >
              <div className={`${style.sNoColumn} ${style.smallColumnWidth}`}>
                S.No.{" "}
              </div>
              <div className={style.nameCol}>
                <span
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
                  style={{ wordBreak: "break-word" }}>
                  Name{" "}
                </span>
                <span
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
              <div className={style.numberColumn}>
                <span
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
                  style={{ wordBreak: "break-word" }}>
                  Contact Number{" "}
                </span>
                <span
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
              {/* End of code modification by -  Pratap Sahu on 25-08-2023
                Reason - To sort only when we click on label */}
              <div className={style.emailcolumn}>
                <span
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
                  style={{ wordBreak: "break-word" }}>
                  Email{" "}
                </span>
                <span
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
                  }}>
                  {columnToSort == "email" &&
                    columnSortingOrder == "ascending" && (
                      <BsSortNumericDown className={style.sortingIcon} />
                    )}
                  {columnToSort == "email" &&
                    columnSortingOrder == "descending" && (
                      <BsSortNumericDownAlt className={style.sortingIcon} />
                    )}
                  {columnToSort != "email" && showSortingIcon && (
                    <BsSortNumericDown
                      color="grey"
                      className={style.sortingIcon}
                    />
                  )}
                </span>
              </div>
              {/* End of code modification by -  Pratap Sahu on 25-08-2023
                Reason - To sort only when we click on label */}
              <div className={style.NoOfOrdersColumn}>
                <span
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
                  style={{ wordBreak: "break-word" }}>
                  Total Orders{" "}
                </span>
                <span
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
                  }}>
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
                </span>
              </div>
              <div className={style.totalColumn}>
                <span
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
                  }}
                  style={{ wordBreak: "break-word" }}>
                  Total Amount{" "}
                </span>
                <span
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
                </span>
              </div>
              <div className={style.cancelCol}>
                <span
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
                  }}
                  style={{ wordBreak: "break-word" }}>
                  Cancelled Order{" "}
                </span>
                <span
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
                </span>
              </div>
              <div className={style.complCol}>
                <span
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
                  }}
                  style={{ wordBreak: "break-word" }}>
                  Completed Order{" "}
                </span>
                <span
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
                </span>
              </div>
              <div className={style.pointCol}>
                <span
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
                  }}
                  style={{ wordBreak: "break-word" }}>
                  Loyalty Points{" "}
                </span>
                <span
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
              {/* End of Table heading for sorting by - Pratap sahu on 25-08-2023
                Reason - To sort only when we click on label */}

              {/* Added by - Pratap sahu on 25-08-2023
                Reason - To Map the data on table */}
            </div>
            <div
              className={style.tableDataContainer}
              style={{
                backgroundColor: "#efefef",
              }}>
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
                            : "0px",
                        background:
                          backgroundColor++ % 2 == 0 ? "white" : "#1677ff14",
                      }}>
                      <div
                        className={`${style.sNoColumn} ${style.smallColumnWidth}`}>
                        {currentPage * listPerPage - listPerPage + index + 1}
                      </div>
                      <div
                        className={`${style.nameCol} ${style.mediumColoumnWidth}`}>
                        {customerReportDetails.last_customer_name}
                      </div>

                      <div
                        className={`${style.numberColumn} ${style.mediumColoumnWidth}`}>
                        <span> {customerReportDetails.contact_number}</span>
                      </div>
                      <div
                        className={`${style.emailcolumn} ${style.mediumColoumnWidth}`}>
                        <span> {customerReportDetails.email} </span>
                      </div>
                      <div
                        className={`${style.NoOfOrdersColumn} ${style.mediumColoumnWidth}`}
                        style={{ display: "flex", justifyContent: "center" }}>
                        {customerReportDetails.numberOfOrders}
                      </div>
                      <div
                        className={`${style.totalColumn} ${style.mediumColoumnWidth}`}>
                        {customerReportDetails.totalAmount}
                      </div>
                      <div
                        className={`${style.cancelCol} ${style.mediumColoumnWidth}`}>
                        {customerReportDetails.cancelledOrder}
                      </div>
                      <div
                        className={`${style.complCol} ${style.mediumColoumnWidth}`}>
                        {customerReportDetails?.completedOrder}
                      </div>
                      <div
                        className={`${style.pointCol} ${style.mediumColoumnWidth}`}>
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
          {/* Added by - Pratap sahu on 25-08-2023
                Reason - To Map the data on table */}
        </div>
      </div>

      {/* Added by :- Pratap sahu on 25-08-2023 reason :- to Add paginations */}
      <div className={style.paginationContainer}>
        {backendReportCount && backendReportCount > 0 ? (
          <div className={style.paginationContent}>
            <Pagination
              defaultCurrent={1}
              current={currentPage}
              simple
              total={backendReportCount}
              defaultPageSize={listPerPage}
              pageSize={listPerPage}
              onChange={handlePageChange}
            />
            <div className={style.dropdown} onClick={toggleDropdown}>
              <button className={style.dropbtn}>
                {listPerPage} / Page{" "}
                <MdArrowDropUp style={{ margin: "5px 0" }} />
              </button>
              <div className={style.dropdown_content} id="dropdown">
                {/* Modified by  Pratap Sahu on 07-09-2023
                       Reason - To change condition for showing list */}
                {backendReportCount > 40 ? (
                  <span
                    href="#"
                    onClick={(e) => {
                      setListPerPage(50);
                      setCurrentPage(1);
                      localStorage.setItem("listPerPage", 50);
                    }}>
                    50 / Page
                  </span>
                ) : null}
                {backendReportCount > 30 ? (
                  
                  <span
                    href="#"
                    onClick={(e) => {
                      setListPerPage(40);
                      setCurrentPage(1);
                      localStorage.setItem("listPerPage", 40);
                    }}>
                    40 / Page
                  </span>
                ) : null}
                {backendReportCount > 20 ? (
                  <span
                    href="#"
                    onClick={(e) => {
                      setListPerPage(30);
                      setCurrentPage(1);
                      localStorage.setItem("listPerPage", 30);
                    }}>
                    30 / Page
                  </span>
                ) : null}
                <span
                  href="#"
                  onClick={(e) => {
                    setListPerPage(20);
                    setCurrentPage(1);
                    localStorage.setItem("listPerPage", 20);
                  }}>
                  20 / Page
                </span>
                <span
                  href="#"
                  onClick={(e) => {
                    setListPerPage(10);
                    localStorage.setItem("listPerPage", 10);
                  }}>
                  10 / Page
                </span>
                {/* End of code - Pratap Sahu on 07/09/23 */}
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {/* End of Added code by :- Pratap sahu on 25-08-2023 reason :- Add paginations */}
    </div>
  );
};

export default CustomerReport;
// End of Creation By Pratap sahu on 25-08-2023
// Reason:To have Customer Report Section
