/**
 * Created by - Om Shrivastava on 03-08-23
 * Reason - To have offer creation section show all offer list, and create form save the data.
*/

import React, { useEffect, useState } from "react";
import style from "./banneroffer.module.css";
import Header from "../GlobalComponent/Header";
import { enableHeader } from "../../App";
import { useNavigate } from "react-router-dom";
import { Input, Pagination } from "antd";
import { AiOutlineClose } from "react-icons/ai";
import { getOfferBannerCount, getOfferBannerList } from "../../Api/services";
import {
  BsSortAlphaDownAlt,
  BsSortAlphaDown,
  BsSortNumericDownAlt,
  BsSortNumericDown,
} from "react-icons/bs";
import config from "../../Api/config";
import { MdArrowDropUp, MdCancel, MdCheckCircle } from "react-icons/md";


const BannerOffer = () => {
  
  const removeDiv = () => {
   document.getElementById('offer_form').style.display = 'block'

};

const removeOfferFormDiv = () => {
  document.getElementById('offer_form').style.display = 'none'

};

const [backendOfferBannerCount, setBackendOfferBannerCount] = useState(0);
const [bannerOfferList, setOfferBannerList] = useState([]);
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

    getCountOfOffers();
    getListOfOfferBannerData();
}, []);


console.log(bannerOfferList)

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
    setBackendOfferBannerCount(response.offerBannerListCount)
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
        document.getElementById("dropdown").style.display = "block"
    else
        document.getElementById("dropdown").style.display = ""
}

function hideDropdown() {
    document.getElementById("dropdown").style.display = ""
}
// End of code - Om Shrivastava - 26-07-23


  return (
    // Modified by Om Shrivastava - 25/6/23
    // Reason - removing header from each page and making it global
    // <Header>
    <div className={style.Container} >
      <div className={style.ContainerDiv}>
        <div
          className={style.offerFormListDiv}
        >
          <div className={style.OfferListcontainer}
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
                  width: "50%",
                }}
                className={style.SearchBar}
              />
              <div
                className={`${style.primaryButton}`}

                // onClick={() => openAddItemForm()}
                style={{
                  marginLeft: "10px",
                  // minWidth: "100px",
                  textAlign: "center",
                }}
                onClick={(e) => {
                    removeDiv();
                  }}
              >
                Add offer
              </div>
            </div>

            <div className={style.itemListSection}>
              <div className={style.tableContainer}>
                <div className={style.table}>

                  <div
                    className={style.tableHeadingContainer}

                  onClick={hideDropdown}
                  onTouchStart={hideDropdown}
                  >
                    <div className={`${style.commonColumnTitle} ${style.mediumColoumnWidth} ${style.responsiveWidth} `}
                    >
                      <input
                        className={style.checkbox}
                        // className={style.checkbox}
                        id="ParentCheckbox" type="checkbox"
                        // onChange={e => checkAndUncheckAll(e.target.checked)} 
                      />
                      SNo. </div>

                    <div
                      className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}
                    >Icon </div>
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

                    // onClick={(e) => {
                    //   setShowSortingIcon(false);
                    //   sortItemList("priceFull");
                    // }}
                    // onMouseEnter={(e) => {
                    //   if (columnToSort != "priceFull") {
                    //     setShowSortingIcon(true);
                    //   }
                    // }}
                    // onMouseLeave={(e) => {
                    //   if (columnToSort != "priceFull") {
                    //     setShowSortingIcon(false);
                    //   }
                    // }}
                    >
                      Video link

                      {/* {columnToSort == "priceFull" &&
                      columnSortingOrder == "ascending" && (
                        <BsSortNumericDown className={style.sortingIcon} />
                      )}
                    {columnToSort == "priceFull" &&
                      columnSortingOrder == "descending" && (
                        <BsSortNumericDownAlt className={style.sortingIcon} />
                      )}
                    {columnToSort != "priceFull" && showSortingIcon && (
                      <BsSortNumericDown
                        color="grey"
                        className={style.sortingIcon}
                      />
                    )} */}
                    </div>

                    <div
                      className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}

                    // onClick={(e) => {
                    //   setShowSortingIcon(false);
                    //   sortItemList("priceHalf");
                    // }}
                    // onMouseEnter={(e) => {
                    //   if (columnToSort != "priceHalf") {
                    //     setShowSortingIcon(true);
                    //   }
                    // }}
                    // onMouseLeave={(e) => {
                    //   if (columnToSort != "priceHalf") {
                    //     setShowSortingIcon(false);
                    //   }
                    // }}
                    >
                      Show video

                      {/* {columnToSort == "priceHalf" &&
                      columnSortingOrder == "ascending" && (
                        <BsSortNumericDown className={style.sortingIcon} />
                      )}
                    {columnToSort == "priceHalf" &&
                      columnSortingOrder == "descending" && (
                        <BsSortNumericDownAlt className={style.sortingIcon} />
                      )}
                    {columnToSort != "priceHalf" && showSortingIcon && (
                      <BsSortNumericDown
                        color="grey"
                        className={style.sortingIcon}
                      />
                    )} */}
                    </div>



                    <div className={`${style.commonColumnTitle} ${style.mediumColoumnWidth}`}> Action </div>
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
                        bannerOfferList.length == index + 1 ? "2px" : "0px",
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
                          id="ParentCheckbox" type="checkbox"
                        // onChange={e => checkAndUncheckAll(e.target.checked)} 
                        />
                          {(currentPage*listPerPage-listPerPage)+index+1}

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

                            ? config.staticBaseURL + bannerOfferDetails.offer_image

                            : "---"
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
                         {bannerOfferDetails.show_video_Hide_Image == true ? (
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
                          display: "flex", justifyContent: "center",
                          // width:'7%',minWidth:'8%'
                        }}
                      >
                        <div
                          className={` ${style.primaryButton}`}
                          onClick={(e) => {
                            removeDiv();
                          }}
                        // onClick={() => openbannerOfferDetails(bannerOfferDetails.id)}
                        >
                          Edit
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
            ) : 
              null}
          </div>
          </div>
        </div>
        <div className={style.offerFormDiv} 
        
        id="offer_form">
          {/* mango */}
          {/* Added by Om Shrivastava on 04-08-23
          Reason : Show the offer form data */}
          <div className={style.offerFormContainer}>
            <div className={style.titleContainer}>
              <div className={style.pageTitle}>Offer form</div>
            </div>
            <div>
            <div  style={{float:'right'}}>
              <AiOutlineClose color="black" size={20}  style={{ border:"1px dotted green",borderRadius:'100px',cursor:'pointer',height:'22px',width:'22px' }} 
              onClick={(e) => {
                removeOfferFormDiv();
              }}
              />
              </div>
            <form className={style.menuSection} >
              
              <div className={style.formContainer}>
                <div className={`${style.sectionInsideForm}`}>
                  <div className={`${style.inputContainer}`}>
                    <div className={`${style.inputArea}`}>
                      <div className={`${style.inputLabel}`}>
                        <span className={style.mendatoryField}></span>Name
                      </div>
                      <input
                        className={`${style.textInputBox}`}
                        type="text"
                        name="name"
                        // value={name}
                        style={{ width: "200px" }}
                        // onChange={(e) => {
                        //   setName(e.target.value.toString());
                        //   validateOnInput("name", e.target.value.toString());
                        // }}
                        maxLength={30}
                      />
                    </div>
                    <div className={`${style.inputErrorArea}`}>
                      {/* {nameError} */}
                    </div>
                  </div>

                  <div className={`${style.inputContainer}`}>
                    <div className={`${style.inputArea}`}>
                      <div className={`${style.inputLabel}`}>
                        <span className={style.mendatoryField}></span>
                        {/* Contact number */}
                        Discount(%)
                      </div>
                      <input
                        className={`${style.textInputBox}`}
                        type="number"
                        name="contact_number"
                        ng-pattern="/^[0-9]{10}$/"
                        // value={contactNumber}
                        style={{ width: "200px" }}
                        // onChange={(e) => {
                        //   setContactNumber(e.target.value);
                        //   validateOnInput("contact_number", e.target.value);
                        // }}
                        maxLength={10}
                      />
                    </div>
                    <div className={`${style.inputErrorArea}`}>
                      {/* {contactNumberError} */}
                    </div>
                  </div>

                  <div className={`${style.inputContainer}`}>
                    <div className={`${style.inputArea}`}>
                      <div className={`${style.inputLabel}`}>
                        <span className={style.mendatoryField}></span>
                        {/* Contact number */}
                        {/* Discount(%) */}
                        Video link
                      </div>
                      <input
                        className={`${style.textInputBox}`}
                        type="number"
                        name="contact_number"
                        ng-pattern="/^[0-9]{10}$/"
                        // value={contactNumber}
                        style={{ width: "200px" }}
                        // onChange={(e) => {
                        //   setContactNumber(e.target.value);
                        //   validateOnInput("contact_number", e.target.value);
                        // }}
                        maxLength={10}
                      />
                    </div>
                    <div className={`${style.inputErrorArea}`}>
                      {/* {contactNumberError} */}
                    </div>
                  </div>

                  <div className={`${style.inputContainer}`}>
                    <div className={`${style.inputArea}`}>
                      <div className={`${style.inputLabel}`}>
                        <span className={style.mendatoryField}> </span>Image
                      </div>
                      <div className={style.menuImageContainer}>
                        {/* {selectedImageName ? (
                    selectedImageName
                  ) : icon ? ( */}
                        <img
                          // src={config.staticBaseURL + icon}
                          className={style.menuImage}
                          width={"100px"}
                          height={"100px"}
                        />
                        {/* ) : null}  */}
                      </div>
                    </div>
                  </div>

                  <div className={`${style.inputContainer}`}>
                    <div className={`${style.inputArea}`}>
                      <div className={`${style.inputLabel}`}>
                        <span className={style.optionalField}> </span>Select new
                        image
                      </div>

                      <input
                        className={`${style.textInputBox}`}
                        type="file"
                        name="icon"
                        id="icon"
                        accept="image/png,image/jpg,image/jpeg"
                        style={{ width: "300px" }}
                      // onChange={(e) => {
                      //   if (e.target.files[0]) {
                      //     validateOnFileInput("icon", e.target.files[0]);
                      //   } else {
                      //     setSelectedImageName(null);
                      //     setSelectedImage(null);
                      //   }
                      // }}
                      />
                    </div>

                    <div className={`${style.inputErrorArea}`}><p>
                      {/* {iconError} */}
                    </p><p>
                        {/* {iconSizeError} */}
                      </p></div>
                  </div>

                  <div className={`${style.inputContainer}`}>
                    <div className={`${style.inputArea}`}>
                      <div className={`${style.inputLabel}`}>
                        <span className={style.mendatoryField}></span>
                        {/* Contact number */}
                        {/* Discount(%) */}
                        Video link
                      </div>
                      <input
                        className={`${style.textInputBox}`}
                        type="number"
                        name="contact_number"
                        ng-pattern="/^[0-9]{10}$/"
                        // value={contactNumber}
                        style={{ width: "200px" }}
                        // onChange={(e) => {
                        //   setContactNumber(e.target.value);
                        //   validateOnInput("contact_number", e.target.value);
                        // }}
                        maxLength={10}
                      />
                    </div>
                    <div className={`${style.inputErrorArea}`}>
                      {/* {contactNumberError} */}
                    </div>
                  </div>

                  <div className={`${style.inputContainer}`} >
                    <div className={`${style.inputArea}`}>
                      <div className={`${style.inputLabel} ${style.inputLabel2}`} 
                      // style={{ width: '155px' }}
                      >
                        <span className={style.optionalField}></span>Show video
                      </div>
                      <input
                        className={`${style.textInputBox}`}
                        type="checkbox"
                        name="is_available"
                        style={{ 
                          width: "18px",
                           height: "18px"
                         }}
                      // checked={isActive}
                      // onChange={(e) => {
                      //   setIsActive(e.target.checked);
                      //   validateOnInput("is_available", e.target.value);
                      // }}
                      />
                    </div>
                    <div className={`${style.inputErrorArea}`}>
                      {/* {validationErrors.is_active} */}
                    </div>
                  </div>
                </div>
              </div>

              <div className={style.actionContainer}>
                {/* <div
                  className={` ${style.backButton}`}
                  style={{
                    marginRight: "10px",
                  }}
                  onClick={(e) => {
                    navigate("/dashboard");
                  }}
                >
                  Back
                </div> */}

                <div
                  className={` ${style.proceedButton}`}
                // onClick={() => {
                //   postPaymentData();
                //   window.scrollTo(0, 0);
                // }}
                >
                  Save
                </div>
                <div
                  className={` ${style.cancelButton}`}
                  style={{
                    marginRight: "10px",
                  }}
                // onClick={(e) => {
                //   resetPaymentForm();
                //   window.scrollTo(0, 0);
                // }}
                >
                  Clear
                </div>
              </div>
            </form>
          </div>

            {/* Added by Om Shrivastava on 04-08-23
          Reason : Show the offer form data */}
          </div>
        </div>
        {/* <h1 className={style.heading}>BannerOffer</h1> */}
      </div>
    </div>
    // </Header>
  );
};

export default BannerOffer;
