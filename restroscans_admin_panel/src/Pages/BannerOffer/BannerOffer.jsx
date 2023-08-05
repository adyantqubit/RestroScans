/**
 * Created by - Om Shrivastava on 03-08-23
 * Reason - To have offer creation section show all offer list, and create form save the data.
*/

import React, { useEffect } from "react";
import style from "./banneroffer.module.css";
import Header from "../GlobalComponent/Header";
import { enableHeader } from "../../App";
import { useNavigate } from "react-router-dom";
import { Input } from "antd";
import {  MdCheckCircle } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";


const BannerOffer = () => {
  const navigate = useNavigate();
  const { Search } = Input;

  useEffect(() => {
    // Added By Om Shrivastava - 25/6/23
    // Reason - To enable headerSiderbar
    enableHeader()
    // End of code - Om Shrivastava - 25/6/23
  }, [])

  const removeDiv = () => {
   document.getElementById('offer_form').style.display = 'block'

};

const removeOfferFormDiv = () => {
  document.getElementById('offer_form').style.display = 'none'

};

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
            style={{ border: '1px dotted black' }}
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
                // onSearch={(value) => {
                //   setCurrentPage(1);
                //   setSearchText(value);
                // }}
                // style={{
                //   width: "50%",
                // }}
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

                  // onClick={hideDropdown}
                  // onTouchStart={hideDropdown}
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
                    // onClick={(e) => {
                    //   setShowSortingIcon(false);
                    //   sortItemList("name");
                    // }}
                    // onMouseEnter={(e) => {
                    //   if (columnToSort != "name") {
                    //     setShowSortingIcon(true);
                    //   }
                    // }}
                    // onMouseLeave={(e) => {
                    //   if (columnToSort != "name") {
                    //     setShowSortingIcon(false);
                    //   }
                    // }}
                    >
                      Offer Name{" "}
                      {/* {columnToSort == "name" &&
                      columnSortingOrder == "ascending" && (
                        <BsSortAlphaDown className={style.sortingIcon} />
                      )}
                    {columnToSort == "name" &&
                      columnSortingOrder == "descending" && (
                        <BsSortAlphaDownAlt className={style.sortingIcon} />
                      )}
                    {columnToSort != "name" && showSortingIcon && (
                      <BsSortAlphaDown
                        color="grey"
                        className={style.sortingIcon}
                      />
                    )} */}
                    </div>

                    <div
                      // className={style.commonColumnTitle}
                      className={`${style.commonColumnTitle} ${style.mediumColoumnWidth} ${style.responsiveWidth}`}

                    // onClick={(e) => {
                    //   setShowSortingIcon(false);
                    //   sortItemList("category");
                    // }}
                    // onMouseEnter={(e) => {
                    //   if (columnToSort != "category") {
                    //     setShowSortingIcon(true);
                    //   }
                    // }}
                    // onMouseLeave={(e) => {
                    //   if (columnToSort != "category") {
                    //     setShowSortingIcon(false);
                    //   }
                    // }}
                    >
                      Discount(%)
                      {/*                    
                    {columnToSort == "category" &&
                      columnSortingOrder == "ascending" && (
                        <BsSortAlphaDown className={style.sortingIcon} />
                      )}
                    {columnToSort == "category" &&
                      columnSortingOrder == "descending" && (
                        <BsSortAlphaDownAlt className={style.sortingIcon} />
                      )}
                    {columnToSort != "category" && showSortingIcon && (
                      <BsSortAlphaDown
                        color="grey"
                        className={style.sortingIcon}
                      />
                    )} */}
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

                  // onClick={hideDropdown}
                  // onTouchStart={hideDropdown}
                  >
                    {/* {itemList != null && itemList.length > 0 ? (
                    itemList.map((itemDetails, index) => { */}
                    {/* return ( */}
                    <div
                      // key={index}
                      className={style.tableData}
                      style={{
                        padding: "2px",
                        marginTop: "2px",
                        // marginBottom:
                        //   itemList.length == index + 1 ? "2px" : "0px",
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
                        {/* {itemDetails.name} */}
                        <input
                          className={style.checkbox}
                          // className={style.checkbox}
                          id="ParentCheckbox" type="checkbox"
                        // onChange={e => checkAndUncheckAll(e.target.checked)} 
                        />1
                      </div>

                      <div
                        // className={style.commonColumnData}
                        className={`${style.commonColumnData} ${style.mediumColoumnWidth}`}

                      >
                        <img
                          className={style.itemImage}
                          src="https://pbs.twimg.com/media/EMds5mPUYAIwukb.jpg"

                        // src={
                        //   itemDetails.icon
                        //     ? config.staticBaseURL + itemDetails.icon
                        //     : defaultIcon
                        // }
                        />
                      </div>

                      <div
                        className={style.commonColumnData}
                        style={{ wordBreak: "break-word" }}
                      >
                        {/* {itemDetails.name} */}
                        Holi offer
                      </div>

                      <div
                        className={`${style.commonColumnData} ${style.mediumColoumnWidth} ${style.responsiveWidth}`}
                      >
                        {/* {itemDetails.category_name} */}
                        5
                      </div>

                      <div
                        className={`${style.commonColumnData} ${style.commonColumnTitle2}`}

                        style={{
                          wordBreak: "break-word",
                          // width:'12%',minWidth:'12%'
                        }}
                      >
                        {/* {itemDetails.price_full
                              ? itemDetails.price_full
                              : "-"} */}
                        https://www.youtube.com/embed/0usc_HTnUBQ
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
                        {/* {itemDetails.price_half
                              ? itemDetails.price_half
                              : "-"} */}
                        <MdCheckCircle className={style.yesIcon} />

                      </div>

                      {/* {itemDetails.is_active == true ? (
                            <div className={style.commonColumnData}>
                              <MdCheckCircle className={style.yesIcon} />
                            </div>
                          ) : (
                            <div className={style.commonColumnData}>
                              <MdCancel className={style.noIcon} />
                            </div>
                          )} */}

                      {/* {itemDetails.best_seller == true ? (
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
                        // onClick={() => openItemDetails(itemDetails.id)}
                        >
                          Edit
                        </div>
                      </div>
                    </div>
                    {/* ); */}
                    {/* })
                  ) : (
                    <div style={{ textAlign: "center" }}>No records found!</div>
                  )} */}
                  </div>
                </div>
              </div>
            </div>

            {/* <div className={style.paginationContainer}>
            {itemList && itemList.length > 0 ? (
             
              <div className={style.paginationContent}>
                <Pagination
                  defaultCurrent={1}
                  
                  current={currentPage}
                  
                  total={backendItemCount}
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
                    
                    {backendItemCount > 40 ? (
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
                    {backendItemCount > 30 ? (
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
                    {backendItemCount > 20 ? (
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
          </div> */}
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
