/**
 * Created by - pratap Sahu on 06-09-2023
 * Reason - To have table Reservation List details page
 */
import React, { useEffect, useState } from "react";
import style from "./ReservationList.module.css";
import Header from "../GlobalComponent/Header";
import { Pagination } from "antd";
import { getReservationListApi } from "../../Api/services";
import {
  BsSortAlphaDownAlt,
  BsSortAlphaDown,
  BsSortNumericDownAlt,
  BsSortNumericDown,
} from "react-icons/bs";

import { MdArrowDropUp} from "react-icons/md";

import { Input, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { enableHeader } from "../../App";
import Loader from "../GlobalComponent/Loader";

const ReservationList = () => {
  // //Added By Pratap Sahu on 14-09-2023
  // Reason:To give background colour in listing
  var backgroundColor = 1;
  // End of Addition By Pratap Sahu on 14-09-2023
  // Reason:To give background colour in listing
  const [backendReservationCount, setBackendReservationCount] = useState(0);
  const [reservationList, setReservationList] = useState([]);
  const [listPerPage, setListPerPage] = useState(
    localStorage.getItem("listPerPage")
  );
  const [columnToSort, setColumnToSort] = useState("id");
  const [columnSortingOrder, setColumnSortingOrder] = useState("descending");
  const [showSortingIcon, setShowSortingIcon] = useState(false);
  var [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const { Search } = Input;
  const navigate = useNavigate();

  useEffect(() => {
    enableHeader();
    // Added By pratap Sahu on 06-09-2023
    // Reason - To set global Page index Whenever its index updated
    if (localStorage.getItem("globalPageIndex")) {
      currentPage = parseInt(localStorage.getItem("globalPageIndex"));
      setCurrentPage(parseInt(localStorage.getItem("globalPageIndex")));
    }
  }, []);
  
  // Added by Pratap sahu on 29-09-2023
  // Reason : To add Loader animation when data coming from the Backend
  const [isLoader, setIsLoader] = useState(true);
  // End of code by Pratap sahu on 29-09-2023

  /**
   * Added by - pratap Sahu on 06-09-2023
   * Reason - method that will execute when sorting on column is applied or page number is changed.
   */
  useEffect(() => {
    getListOfReservation();
  }, [columnToSort, columnSortingOrder, currentPage, searchText, listPerPage]);

  /**
   * End of code addition by - pratap Sahu on 06-09-2023
   * Reason - method that will execute when sorting on column is applied or page number is changed.
   */
  /**
   * Added by - pratap Sahu on 06-09-2023
   * Reason - created api to get list of reservation
   */
  const getListOfReservation = async () => {
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
    const response = await getReservationListApi(tenant, filteringCriteria);
    // Added by Pratap sahu on 29-09-2023
    // Reason : To add Loader animation when data coming from the Backend
    setIsLoader(false);
    // End of addition by Pratap sahu on 29-09-2023
    setReservationList(response?.reservation);
    console.log(reservationList.date)
    // Added by - pratap Sahu on 06-09-2023 Reason - To recalculate page numbers
    setBackendReservationCount(response.reservationListCount);
    // End of code addition by - pratap Sahu on 06-09-2023 Reason - To recalculate page numbers
  };
  //  End of code addition by - pratap Sahu on 06-09-2023 Reason - created api to get list of category
  /**
   * Added by - pratap Sahu on 06-09-2023
   * Reason -  When user changes page number, this method will set page number which will be sent to backend.
   */
  const handlePageChange = async (pageNumber) => {
    localStorage.setItem("globalPageIndex", pageNumber);
    setCurrentPage(pageNumber);
  };
  /**
   * End of code addition by - pratap Sahu on 06-09-2023
   * Reason -  When user changes page number, this method will set page number which will be sent to backend.
   */

  /**
   * Added by - pratap Sahu on 06-09-2023
   * Reason - Method that will set sorting criteria
   */
  const sortReservationList = (columnName) => {
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
   * End of code addition by - pratap Sahu on 06-09-2023
   * Reason - Method that will set sorting criteria
   */

  /**
   * Added by - pratap Sahu on 06-09-2023
   * Reason - Method that will open edit reservation form of selected reservation List
   */
  const openReservationDetails = (id,row) => {
    // Added by - pratap Sahu on 06-09-2023 Reason - To navigate to reservation form
    navigate("/ReservationForm", { state: { id: id ,data:row} });
    //End of Addtion by -  pratap Sahu on 06-09-2023 Reason - To navigate to reservation form
  };
  
  // Added by pratap Sahu on 06-09-2023
  // Reason - To toggle dropdown visiblity on click
  function toggleDropdown() {
    if (document.getElementById("dropdown").style.display.length == 0)
      document.getElementById("dropdown").style.display = "block";
    else document.getElementById("dropdown").style.display = "";
  }

  // Added by Pratap sahu 15-09-2023
  // Reason - To validate dropdown whether list data is coming or not
  function hideDropdown() {
    // document.getElementById("dropdown").style.display = "";
    if(document.getElementById("dropdown"))
     document.getElementById("dropdown").style.display=""
  }
  // End of code -pratap Sahu on 06-09-2023
  // Added by Pratap sahu 15-09-2023
 // Reason - To validate dropdown whether list data is coming or not

  return (
    <div className={style.container}>
      <div className={`${style.pageTitleContainer}`}>
        <div className={style.pageTitle}>Table Reservation List</div>
      </div>
  {/*Added by Pratap sahu on 29-09-2023
   Reason : To add Loader animation when data coming from the Backend */}
      {isLoader == true ? <Loader/> :
      <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          padding: "4px",
        }}>
        <Search
          placeholder="Search by Name,Contact Number or Table Number"
          allowClear
          enterButton
          onSearch={(value) => {
            setCurrentPage(1);
            setSearchText(value);
          }}
          className={style.SearchBar}
        />
        <div
          className={`${style.primaryButton}`}
          // added by pratap Sahu on 07-09-2023
          // Reason - to open add new reservation form
          onClick={() => openReservationDetails()}
          // End of addition by pratap Sahu on 07-09-2023
          style={{
            marginLeft: "10px",
            // Modified & added by Pratap sahu 21-11-2023 on 
            // minWidth: "100px",
            minWidth:"137px",
            marginRight:"9px",
            // End of modification by pratap sahu on 21-11-2023
            textAlign: "center",
          }}>
          {/* Add Table Reservation */}
          Add Reservation
        </div>
      </div>
      <div className={style.listSection}>
        <div className={style.tableContainer}>
          <div className={style.table}>
            {/* -------------------------------------------------------------------------------------- */}
            <div
              className={style.tableHeadingContainer}
            // Added by  Pratap Sahu on 15-09-2023
            // Reason- To hide page size dropdown on outer click
              onClick={hideDropdown}
                onTouchStart={hideDropdown}
          // End of Addition by Pratap sahu 15-09-2023
          // Reason -To hide page size dropdown on outer click
            >
             {/* Modified By Pratap sahu on 15-09-2023 To Enhance UI  */}
             {/* <div className={`${style.commonColumn}`}> */}
             <div className={`${style.sNoColumn}`}
             >
             {/* End of Modification By Pratap sahu on 15-09-2023 To Enhance UI  */}
                S.No.{" "}
              </div>
              <div
                className={style.nameColumn}
                onClick={(e) => {
                  setShowSortingIcon(false);
                  sortReservationList("name");
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
                }}>
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
                  <BsSortAlphaDown color="grey" className={style.sortingIcon} />
                )}
              </div>
              <div
                // Added by Pratap Sahu on 07-09-2023
                // Reason - to sort data by contact_number
                className={style.contactColumn}//new
                onClick={(e) => {
                  setShowSortingIcon(false);
                  sortReservationList("contact_number");
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
                // End of addition by Pratap Sahu on 07-09-2023
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
                {/* End of addition by Pratap Sahu on 07-09-2023 */}
              </div>

              <div
              /* Modified By Pratap sahu on 15-09-2023 To Enhance UI */
                // className={style.commonColumnTitle}
                className={style.tableNum}
                /*End of Modification By Pratap sahu on 15-09-2023 To Enhance UI */
                // Added by  Pratap Sahu on 07-09-2023
                // Reason - to sort data table_number
                onClick={(e) => {
                  setShowSortingIcon(false);
                  sortReservationList("table_number");
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
                Table Number{" "}
                {columnToSort == "table_number" &&
                  columnSortingOrder == "ascending" && (
                    <BsSortAlphaDown className={style.sortingIcon} />
                  )}
                {columnToSort == "table_number" &&
                  columnSortingOrder == "descending" && (
                    <BsSortAlphaDownAlt className={style.sortingIcon} />
                  )}
                {columnToSort != "table_number" && showSortingIcon && (
                  <BsSortAlphaDown color="grey" className={style.sortingIcon} />
                )}
              </div>
              <div
                className={style.numOfPerson}
                // Added by  Pratap Sahu on 07-09-2023
                // Reason - to sort data by number_of_person
                onClick={(e) => {
                  setShowSortingIcon(false);
                  sortReservationList("number_of_person");
                }}
                onMouseEnter={(e) => {
                  if (columnToSort != "number_of_person") {
                    setShowSortingIcon(true);
                  }
                }}
                onMouseLeave={(e) => {
                  if (columnToSort != "number_of_person") {
                    setShowSortingIcon(false);
                  }
                }}
             >
                No Of Person{" "}
                {columnToSort == "number_of_person" &&
                  columnSortingOrder == "ascending" && (
                    <BsSortNumericDown className={style.sortingIcon} />
                  )}
                {columnToSort == "number_of_person" &&
                  columnSortingOrder == "descending" && (
                    <BsSortNumericDownAlt className={style.sortingIcon} />
                  )}
                {columnToSort != "number_of_person" && showSortingIcon && (
                  <BsSortNumericDown
                    color="grey"
                    className={style.sortingIcon}
                  />
                )}
                {/* End of addition by Pratap Sahu on 07-09-2023*/}
              </div>
              <div
              /* Modified By Pratap sahu on 15-09-2023 To Enhance UI */           
                // className={style.commonColumnTitle}
                className={style.dateCol}
              /* Ended by pratap sahu on 15-09-2023 To Enhance UI  */
                // Added by Pratap Sahu on 07-09-2023
                // Reason - to sort data by date
                onClick={(e) => {
                  setShowSortingIcon(false);
                  sortReservationList("date");
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
                Date{" "}
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
                {/* End of addition by Pratap Sahu on 07-09-2023 */}
              </div>
              <div
              /* Modified By Pratap sahu on 15-09-2023 To Enhance UI */       
                // className={style.commonColumnTitle}
                className={style.resStatus}
              /* Ended by pratap sahu on 15-09-2023 To Enhance UI  */
                // Added by  Pratap Sahu on 07-09-2023
                // Reason - to sort reservation Status
                onClick={(e) => {
                  setShowSortingIcon(false);
                  sortReservationList("reservation_status");
                }}
                onMouseEnter={(e) => {
                  if (columnToSort != "reservation_status") {
                    setShowSortingIcon(true);
                  }
                }}
                onMouseLeave={(e) => {
                  if (columnToSort != "reservation_status") {
                    setShowSortingIcon(false);
                  }
                }}
              >
                Status{" "}
                {columnToSort == "reservation_status" &&
                  columnSortingOrder == "ascending" && (
                    <BsSortAlphaDown className={style.sortingIcon} />
                  )}
                {columnToSort == "reservation_status" &&
                  columnSortingOrder == "descending" && (
                    <BsSortAlphaDownAlt className={style.sortingIcon} />
                  )}
                {columnToSort != "reservation_status" && showSortingIcon && (
                  <BsSortAlphaDown color="grey" className={style.sortingIcon} />
                )}
                {/* End of addition by Pratap Sahu on 07-09-2023*/}
              </div>
              {/* Modified By Pratap sahu on 15-09-2023 To Enhance UI */}
              {/* <div className={style.commonColumnTitle}> Action </div> */}
              <div className={style.action}> Action </div>
              {/* Ended by pratap sahu on 15-09-2023 To Enhance UI  */}
            </div>

            <div
              className={style.tableDataContainer}
              style={{
                backgroundColor: "#efefef",
              }}
              // Added by  Pratap Sahu on 07-09-2023
              // Reason- To hide page size dropdown on outer click
              onClick={hideDropdown}
              onTouchStart={hideDropdown}
              // End of code - Pratap Sahu on 07-09-2023
            >
              {reservationList != null && reservationList.length > 0 ? (
                reservationList.map((reservationList, index) => {
                  return (
                    <div
                      key={index}
                      className={style.tableData}
                      style={{
                        padding: "2px",
                        marginTop: "2px",
                        marginBottom:
                          reservationList.length == index + 1 ? "2px" : "0px",
                           //Added By Pratap Sahu on 14-09-2023
                          // Reason:To give background colour in listing
                          background: backgroundColor++ % 2 == 0 ? "white" : "#1677ff14",
                          //End of Addition By Pratap Sahu on 14-09-2023
                          // Reason:To give background colour in listing
                      }}>
                        <div
                        className={`${style.sNoColumn} `}>
                        {currentPage * listPerPage - listPerPage + index + 1}
                      </div>
                      {/* Modified by Pratap Sahu on 07-09-2023
                         Reason - to arrange the word */}
                      <div
                        className={`${style.nameColumn} ${style.commonColumnData}`}
                        >
                        {/* End of modification by  Pratap Sahu on 07-09-2023 */}
                        {reservationList.name}
                      </div>

                      <div className={`${style.contactColumn} ${style.commonColumnData}`}>
                        {reservationList.contact_number}
                      </div>

                      {/* <div className={style.commonColumnData}> */}
                      <div className={`${style.tableNum} ${style.commonColumnData}`}>
                        {reservationList.table_number
                          ? reservationList.table_number
                          : "-"}
                      </div>
                      <div className={`${style.numOfPerson} ${style.commonColumnData}`}>
                        {reservationList.number_of_person
                          ? reservationList.number_of_person
                          : "-"}
                      </div>
                      <div className={`${style.dateCol} ${style.commonColumnData}`}>
                        {reservationList.date.split("-").reverse().join('-')}
                      </div>
                      <div className={`${style.resStatus} ${style.commonColumnData}`}>
                        {reservationList.reservation_status}
                      </div>

                      <div
                   // Modified by pratap sahu on 23-09-2023 To give styling on action column
                        // className={`${style.commonColumnData}`}
                        className={`{style.action} ${style.commonColumnData}`}
                   // End of Modification by pratap sahu on 23-09-2023 To give styling on action column
                        style={{ display: "flex", justifyContent: "center" }}>
                        <div
                          className={` ${style.primaryButton}`}
                          onClick={() =>
                            openReservationDetails(reservationList.id,reservationList)
                          }>
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
        {reservationList && reservationList.length > 0 ? (
          // Modified by  Pratap Sahu on 07-09-2023
          // Reason -To divide container into two part for page selector
          <div className={style.paginationContent}>
            <Pagination
              defaultCurrent={1}
              /**
               * Added by - Pratap Sahu on 07-09-2023
               * Reason - To set current selected page number
               */
              current={currentPage}
              /**
               * End of code addition by -  Pratap Sahu on 07-09-2023
               * Reason - To set current selected page number
               */
              total={backendReservationCount}
              defaultPageSize={listPerPage}
              pageSize={listPerPage}
              simple
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
                {backendReservationCount > 40 ? (
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
                {backendReservationCount > 30 ? (
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
                {backendReservationCount > 20 ? (
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
        ) : // End of code - Modification - Pratap Sahu on 07/09/23
        // Reason - To separate div and add Selection box for page item size

        null}
      </div>
      </div> }
    {/*End of code by Pratap sahu on 29-09-2023
   Reason : To add Loader animation when data coming from the Backend */}
    </div>
    // </Header>
  );
};

export default ReservationList;
