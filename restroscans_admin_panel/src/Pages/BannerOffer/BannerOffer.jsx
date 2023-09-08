/**
 * Created by - Om Shrivastava on 03-08-23
 * Reason - To have offer creation section show all offer list, and create form save the data.
*/

import React, { useEffect, useState, useContext } from "react";
import style from "./banneroffer.module.css";
import Header from "../GlobalComponent/Header";
import { enableHeader } from "../../App";
import { useNavigate } from "react-router-dom";
import { Input, Pagination } from "antd";
import { AiOutlineClose } from "react-icons/ai";
import {
  getOfferBannerCount,
  getOfferBannerList,
  postOfferBannerDetails,
} from "../../Api/services";
import {
  BsSortAlphaDownAlt,
  BsSortAlphaDown,
  BsSortNumericDownAlt,
  BsSortNumericDown,
} from "react-icons/bs";
import config from "../../Api/config";
import { MdArrowDropUp, MdCancel, MdCheckCircle } from "react-icons/md";
import BannerOfferForm from "./BannerOfferForm";
import { GlobalContext } from "../../Context/Context";
import defaultIcon from "../../../src/images/no-offer.jpg";

const BannerOffer = () => {
  //   const removeDiv = () => {
  //    document.getElementById('offer_form').style.display = 'block'

  // };
  var { showOfferForm, setShowOfferForm, disabled, setDisabled } =
    useContext(GlobalContext);

  const removeOfferFormDiv = () => {
    document.getElementById("offer_form").style.display = "none";
  };
  const navigate = useNavigate();

  const [backendOfferBannerCount, setBackendOfferBannerCount] = useState(0);
  const [bannerOfferList, setOfferBannerList] = useState([]);
  // Modified by Om Shrivastava - 26-07-23 - To Get Selected List page from localstorage on Reload
  // const [listPerPage, setListPerPage] = useState(localStorage.getItem(10));
  const [listPerPage, setListPerPage] = useState(
    localStorage.getItem("listPerPage")
  );
  // End of code - Om Shrivastava - 26-07-23

  const [columnToSort, setColumnToSort] = useState("contact_number");
  const [columnSortingOrder, setColumnSortingOrder] = useState("ascending");
  const [showSortingIcon, setShowSortingIcon] = useState(false);
  var [currentPage, setCurrentPage] = useState(1);

  const [id, setId] = useState(null);
  const [dataCount, setDataCount] = useState(null);

  useEffect(() => {
    console.log(bannerOfferList);
  }, [bannerOfferList]);
  // const[showOfferForm,setShowOfferForm] =useState(false)

  // Added by Om Shrivastava on 07-09-23
  // Reason : Set the window width for mobile view
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // End of addition by Om Shrivastava on 07-09-23
  // Reason : Set the window width for mobile view

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
    enableHeader();
    // End of code - Om Shrivastava - 26-07-23
    // Added By Om Shrivastava - 26-07-23
    // Reason - To set global Page index Whenever its index updated
    if (localStorage.getItem("globalPageIndex")) {
      currentPage = parseInt(localStorage.getItem("globalPageIndex"));
      setCurrentPage(parseInt(localStorage.getItem("globalPageIndex")));
    }
    // End of code - Om Shrivastava - 26-07-23

    getCountOfOffers();
    getListOfOfferBannerData();
  }, []);

  console.log(id);

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
    getListOfOfferBannerData();
    // scrollBehaviour();
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
  const getCountOfOffers = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await getOfferBannerCount(tenant);
    setBackendOfferBannerCount(response.offerBannerCount);
  };
  /**
   * Added by - Om Shrivastava on 26-07-23
   * Reason - created api to get count of customers
   */

  /**
   * Added by - Om Shrivastava on 26-07-23
   * Reason - created api to get list of customers
   */
  const getListOfOfferBannerData = async () => {
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
    const response = await getOfferBannerList(tenant, filteringCriteria);
    setOfferBannerList(response.offerBannerList);
    /**
     * Added by - Om Shrivastava on 26-07-23
     * Reason - To recalculate page numbers
     */
    setBackendOfferBannerCount(response.offerBannerListCount);
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
    localStorage.setItem("globalPageIndex", pageNumber);
    // End of code - Om Shrivastava - 26-07-23
    setCurrentPage(pageNumber);
  };
  /**
   * End of code addition by - Om Shrivastava on 26-07-23
   * Reason -  When user changes page number, this method will set page number which will be sent to backend.
   */
  console.log(showOfferForm);
  /**
   * Added by - Om Shrivastava on 26-07-23
   * Reason - Method that will set sorting criteria
   */
  const sortOfferBannerList = (columnName) => {
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
      document.getElementById("dropdown").style.display = "block";
    else document.getElementById("dropdown").style.display = "";
  }

  function hideDropdown() {
    /**
     * Added and modified by Om Shrivastava on 04-09-2023
     * Reason - to remove error when we click no record found
     */
    // document.getElementById("dropdown").style.display = ""
    if (bannerOfferList && bannerOfferList.length > 0) {
      document.getElementById("dropdown").style.display = "";
    }
    /**
     * End of amodification by Om Shrivastava on 04-09-2023
     */
  }
  // End of code - Om Shrivastava - 26-07-23

  const openCategoryDetails = (id) => {
    setShowOfferForm(true);
    setDisabled(true);
    // navigate("/BannerOffer", { state: { id: id?id:null } });
    setId(id);

    // setBackendOfferBannerCount()
  };

  function scrollBehaviour() {
    console.log("hhhhhhhhhh");
    // document.getElementById("offerListDiv").scroll(250,110)
    // window.scrollTo(0,500);
    // window.scrollTo({top: 2060, left: 0, behavior: 'smooth' });
    document.getElementById("container").scrollTo(0, 200);
    // objDiv.scrollBy(0,objDiv.scrollHeight)
    // document.getElementById("offerListDiv").scrollBy(0, 500);
    // if (element) {
    //   element.scrollIntoView(true)
    //   // element.scroll(2000,0)
    //   // window.scrollTo({
    //   //   top: document.documentElement.scrollHeight,
    //   //   behavior: 'smooth', // Optional: Add smooth scrolling animation
    //   // });
    // }
  }

  // console.log(listPerPage,'kiffff')
  // console.log(backendOfferBannerCount,'ggggg')

  return (
    // Modified by Om Shrivastava - 25/6/23
    // Reason - removing header from each page and making it global
    // <Header>
    <div id="container" className={style.Container}>
      <div className={style.ContainerDiv}>
        <div
          className={
            showOfferForm == true
              ? `${style.offerFormListDiv}`
              : `${style.offerFormListFullDiv}`
          }
        >
          <div
            className={style.OfferListcontainer}
            // style={{ border: '1px dotted black' }}
          >
            <div className={`${style.pageTitleContainer}`}>
              <div className={style.pageTitle}>Offer List</div>
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
                placeholder="Search by Offer name and discount"
                allowClear
                enterButton
                onSearch={(value) => {
                  setCurrentPage(1);
                  setSearchText(value);
                }}
                style={{
                  width: "60%",
                }}
                className={style.SearchBar}
              />
              {/* Modification and addition by Om Shrivastava on 07-09-23
              Reason : Need to scroll the div */}
              {/* <button */}

              {windowWidth  < 1250 ? (
                  <>
                <a
                  href="#C4"
                  disabled={disabled}
                  className={
                    disabled == false
                      ? `${style.primaryButton}`
                      : `${style.primaryDisabledButton}`
                  }
                  // onClick={() => openAddItemForm()}
                  style={{
                    marginLeft: "10px",
                    // minWidth: "100px",
                    textAlign: "center",
                  }}
                  onClick={(e) => {
                    // removeDiv();
                    // scrollBehaviour();

                    openCategoryDetails();
                  }}
                >
                  Add offer
                  {/* </button> */}
                </a>
                </>
              ) : (
                <>
                <button
                  disabled={disabled}
                  className={
                    disabled == false
                      ? `${style.primaryButton}`
                      : `${style.primaryDisabledButton}`
                  }
                  style={{
                    marginLeft: "10px",
                    // minWidth: "100px",
                    textAlign: "center",
                  }}
                  onClick={(e) => {
                    openCategoryDetails();
                  }}
                >
                  Add offer
                </button>
                </>
              )}
              {/* Modification and addition by Om Shrivastava on 07-09-23
              Reason : Need to scroll the div */}
              {/* <a href="#C4">Jump to Chapter 4</a> */}
            </div>

            <div
              className={style.itemListSection}
              // style={{ border: "1px solid red" }}
            >
              <div className={style.tableContainer}>
                <div className={style.table}>
                  <div
                    className={style.tableHeadingContainer}
                    onClick={hideDropdown}
                    onTouchStart={hideDropdown}
                  >
                    <div
                      className={`${style.commonColumnTitle} ${style.mediumColoumnWidth} ${style.responsiveWidth} `}
                    >
                      <input
                        className={style.checkbox}
                        // className={style.checkbox}
                        id="ParentCheckbox"
                        type="checkbox"
                        // onChange={e => checkAndUncheckAll(e.target.checked)}
                      />
                      SNo.{" "}
                    </div>

                    <div
                      className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                    >
                      Icon{" "}
                    </div>
                    <div
                      className={style.commonColumnTitle}
                      onClick={(e) => {
                        setShowSortingIcon(false);
                        sortOfferBannerList("offer_name");
                      }}
                      onMouseEnter={(e) => {
                        if (columnToSort != "offer_name") {
                          setShowSortingIcon(true);
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (columnToSort != "offer_name") {
                          setShowSortingIcon(false);
                        }
                      }}
                    >
                      Offer Name{" "}
                      {columnToSort == "offer_name" &&
                        columnSortingOrder == "ascending" && (
                          <BsSortAlphaDown className={style.sortingIcon} />
                        )}
                      {columnToSort == "offer_name" &&
                        columnSortingOrder == "descending" && (
                          <BsSortAlphaDownAlt className={style.sortingIcon} />
                        )}
                      {columnToSort != "offer_name" && showSortingIcon && (
                        <BsSortAlphaDown
                          color="grey"
                          className={style.sortingIcon}
                        />
                      )}
                    </div>

                    <div
                      // className={style.commonColumnTitle}
                      className={`${style.commonColumnTitle} ${style.mediumColoumnWidth} ${style.responsiveWidth} ${style.responsiveDiscountWidth}`}
                      onClick={(e) => {
                        setShowSortingIcon(false);
                        sortOfferBannerList("discount");
                      }}
                      onMouseEnter={(e) => {
                        if (columnToSort != "discount") {
                          setShowSortingIcon(true);
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (columnToSort != "discount") {
                          setShowSortingIcon(false);
                        }
                      }}
                    >
                      Discount(%)
                      {columnToSort == "discount" &&
                        columnSortingOrder == "ascending" && (
                          <BsSortNumericDown className={style.sortingIcon} />
                        )}
                      {columnToSort == "discount" &&
                        columnSortingOrder == "descending" && (
                          <BsSortNumericDownAlt className={style.sortingIcon} />
                        )}
                      {columnToSort != "discount" && showSortingIcon && (
                        <BsSortNumericDown
                          color="grey"
                          className={style.sortingIcon}
                        />
                      )}
                    </div>

                    <div
                      className={`${style.commonColumnTitle} ${style.commonColumnTitle2}`}
                      style={{
                        wordBreak: "break-word",
                        // width:'12%',minWidth:'12%'
                      }}
                    >
                      Video link
                    </div>

                    <div
                      className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                    >
                      Show video
                    </div>

                    <div
                      className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                    >
                      {" "}
                      Action{" "}
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
                    {bannerOfferList != null && bannerOfferList.length > 0 ? (
                      bannerOfferList.map((bannerOfferDetails, index) => {
                        return (
                          <div
                            // key={index}
                            className={style.tableData}
                            style={{
                              padding: "2px",
                              marginTop: "2px",
                              marginBottom:
                                bannerOfferList.length == index + 1
                                  ? "2px"
                                  : "0px",
                            }}
                          >
                            <div
                              // className={style.commonColumnData}
                              className={`${style.commonColumnData} ${style.mediumColoumnWidth} ${style.responsiveWidth}`}
                              style={{
                                wordBreak: "break-word",
                                // border:'1px solid green',
                                // width:'7%',minWidth:'8%'
                              }}
                            >
                              {/* {bannerOfferDetails.name} */}
                              <input
                                className={style.checkbox}
                                // className={style.checkbox}
                                id="ParentCheckbox"
                                type="checkbox"
                                // onChange={e => checkAndUncheckAll(e.target.checked)}
                              />
                              {currentPage * listPerPage -
                                listPerPage +
                                index +
                                1}
                            </div>

                            <div
                              // className={style.commonColumnData}
                              className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                            >
                              <img
                                className={style.itemImage}
                                // src="https://pbs.twimg.com/media/EMds5mPUYAIwukb.jpg"

                                src={
                                  bannerOfferDetails.offer_image
                                    ? config.staticBaseURL +
                                      bannerOfferDetails.offer_image
                                    : // Added by Om Shrivastava on 26-06-23
                                      // Reason : Set the default image
                                      // "---"
                                      defaultIcon
                                  // End of addition by Om Shrivastava on 26-06-23
                                  // Reason : Set the default image
                                }
                              />
                            </div>

                            <div
                              className={style.commonColumnData}
                              style={{ wordBreak: "break-word" }}
                            >
                              {bannerOfferDetails.offer_name}
                            </div>

                            <div
                              className={`${style.commonColumnData} ${style.mediumColoumnWidth} ${style.responsiveWidth} ${style.responsiveDiscountWidth}`}
                            >
                              {bannerOfferDetails.discount}
                              {/* 5 */}
                            </div>

                            <div
                              className={`${style.commonColumnData} ${style.commonColumnTitle2}`}
                              style={{
                                wordBreak: "break-word",
                                // width:'12%',minWidth:'12%'
                              }}
                            >
                              {bannerOfferDetails.video_link
                                ? bannerOfferDetails.video_link
                                : "-"}
                              {/* https://www.youtube.com/embed/0usc_HTnUBQ */}
                            </div>

                            <div
                              // className={style.commonColumnData}
                              className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                              style={{
                                wordBreak: "break-word",
                                // border:'1px solid green',
                                // width:'7%',minWidth:'8%'
                              }}
                            >
                              {bannerOfferDetails.show_video_Hide_Image ==
                              true ? (
                                <div className={style.commonColumnData}>
                                  <MdCheckCircle className={style.yesIcon} />
                                </div>
                              ) : (
                                <div className={style.commonColumnData}>
                                  <MdCancel className={style.noIcon} />
                                </div>
                              )}
                            </div>

                            {/* {bannerOfferDetails.best_seller == true ? (
                            <div className={style.commonColumnData}>
                              <MdCheckCircle className={style.yesIcon} />
                            </div>
                          ) : (
                            <div className={style.commonColumnData}>
                              <MdCancel className={style.noIcon} />
                            </div>
                          )} */}

                            <div
                              // className={`${style.commonColumnData}`}
                              className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                // width:'7%',minWidth:'8%'
                              }}
                            >
                             {/* Modification and addition by Om Shrivastava on 07-09-23
                              Reason : Need to scroll the div */} 
                              {windowWidth  < 1250 ? (
                  <>
                              <a
                                href="#C4"
                                disabled={disabled}
                                className={
                                  disabled == false
                                    ? `${style.primaryButton}`
                                    : `${style.primaryDisabledButton}`
                                }
                                onClick={(e) => {
                                  openCategoryDetails(bannerOfferDetails.id);

                                  // removeDiv();
                                  // BannerOfferForm(bannerOfferDetails.id)
                                }}

                                // onClick={() => openbannerOfferDetails(bannerOfferDetails.id)}
                              >
                                Edit 
                              </a>
                              </> 
                               ) : (
                                <>
                                <button
                                disabled={disabled}
                                className={
                                  disabled == false
                                    ? `${style.primaryButton}`
                                    : `${style.primaryDisabledButton}`
                                }
                                onClick={(e) => {
                                  openCategoryDetails(bannerOfferDetails.id);

                                  // removeDiv();
                                  // BannerOfferForm(bannerOfferDetails.id)
                                }}

                                // onClick={() => openbannerOfferDetails(bannerOfferDetails.id)}
                              >
                                Edit
                              </button>
                                </>)}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div style={{ textAlign: "center" }}>
                        No records found!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={style.paginationContainer}>
              {bannerOfferList && bannerOfferList.length > 0 ? (
                <div className={style.paginationContent}>
                  <Pagination
                    defaultCurrent={1}
                    current={currentPage}
                    total={backendOfferBannerCount}
                    defaultPageSize={listPerPage}
                    pageSize={listPerPage}
                    simple
                    onChange={handlePageChange}
                  />

                  <div className={style.dropdown} onClick={toggelDropdown}>
                    <button className={style.dropbtn}>
                      {listPerPage} / Page{" "}
                      <MdArrowDropUp style={{ margin: "5px 0" }} />
                    </button>
                    <div className={style.dropdown_content} id="dropdown">
                      {backendOfferBannerCount > 40 ? (
                        <span
                          href="#"
                          onClick={(e) => {
                            setListPerPage(50);
                            setCurrentPage(1);
                            localStorage.setItem("listPerPage", 50);
                          }}
                        >
                          50 / Page
                        </span>
                      ) : null}
                      {backendOfferBannerCount > 30 ? (
                        <span
                          href="#"
                          onClick={(e) => {
                            setListPerPage(40);
                            setCurrentPage(1);
                            localStorage.setItem("listPerPage", 40);
                          }}
                        >
                          40 / Page
                        </span>
                      ) : null}
                      {backendOfferBannerCount > 20 ? (
                        <span
                          href="#"
                          onClick={(e) => {
                            setListPerPage(30);
                            setCurrentPage(1);
                            localStorage.setItem("listPerPage", 30);
                          }}
                        >
                          30 / Page
                        </span>
                      ) : null}
                      <span
                        href="#"
                        onClick={(e) => {
                          setListPerPage(20);
                          setCurrentPage(1);
                          localStorage.setItem("listPerPage", 20);
                        }}
                      >
                        20 / Page
                      </span>
                      <span
                        href="#"
                        onClick={(e) => {
                          setListPerPage(10);
                          localStorage.setItem("listPerPage", 10);
                        }}
                      >
                        10 / Page
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {showOfferForm == true ? (
          <div className={style.offerFormDiv} id="C4">
            <BannerOfferForm
              id={id}
              setData={setOfferBannerList}
              dataList={bannerOfferList}
              // Added by Om Shrivastava on 06-09-23
              // Reason : Send the total data number in form page
              setBackendOfferBannerCount={setBackendOfferBannerCount}
              listPerPage={listPerPage}
              // End of addition by Om Shrivastava on 06-09-23
              // Reason : Send the total data number in form page
              // id={bannerOfferList} setData={setOfferBannerList}
            />
          </div>
        ) : (
          <></>
        )}

        {/* <h1 className={style.heading}>BannerOffer</h1> */}
      </div>
    </div>
    // </Header>
  );
};

export default BannerOffer;
