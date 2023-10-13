// Added by Om Shrivastava on 27-09-23
// Reason : Create offer banner item page
import { MultiSelect } from "react-multi-select-component";
import { useEffect, useState } from "react";
import style from "./offeritem.module.css";
import Header from "../GlobalComponent/Header";
import { enableHeader } from "../../App";
import { Popconfirm, message } from "antd";
import {
  getMenuCategoryItemOfferDetails,
  savePaymentMethodApi,
  getPaymentMethodApi,
} from "../../Api/services";
import { Message } from "../../App";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../Api/config";
import { MdDelete } from "react-icons/md";

const OfferItem = () => {
  const [selected, setSelected] = useState([]);

  // Addition by Om Shrivastava on 05-10-23
  // Reason : Create the usestate for set the offer name, offer id, item name
  const navigate = useNavigate();
  const location = useLocation();
  const [offerItemId, setOfferId] = useState(null);
  const [offerData, setOfferData] = useState(null);
  const [offerName, setOfferName] = useState(null);

  const [discount, setDiscount] = useState(null);

  const [menuData, setMenuData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [itemData, setItemData] = useState([]);

  const [name, setName] = useState(null);

  const [menuSelected, setMenuSelected] = useState([]);
  const [categorySelected, setcategorySelected] = useState([]);
  const [itemSelected, setitemSelected] = useState([]);

  // End of addition by Om Shrivastava on 05-10-23
  // Reason : Create the usestate for set the offer name, offer id, item name

  // Addition by Om Shrivastava on 05-10-23
  // Reason : Add useeffect for function calling when user enter enter the page
  useEffect(() => {
    enableHeader();
    window.scrollTo(0, 0);
    if (location?.state?.id != null) {
      setOfferId(location.state.id);
    }
  }, []);

  useEffect(() => {
    if (offerItemId) {
      getOfferData();
    }
    removeObjectWithId();
  }, [offerItemId]);
  // End of addition by Om Shrivastava on 05-10-23
  // Reason : Add useeffect for function calling when user enter enter the page

  console.log(offerItemId, "offer id");
  console.log(offerData, "offer data");
  console.log(offerName, "offer name");
  console.log(menuData, "menu data");
  console.log(categoryData, "category data");
  console.log(itemData, "item data");

  // Addition by Om Shrivastava on 05-10-23
  // Reason : Create function for the API calling
  const getOfferData = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await getMenuCategoryItemOfferDetails(tenant, offerItemId);
    if (response.msg) {
      setOfferData(response.offerItemList);
      setOfferId(response.offerItemList.id);
      setOfferName(response.offerItemList[0]?.offer_name);
      // addition by Om Shrivastava on 09-10-23
      // Reason : Set the discount in the usestate
      setDiscount(response.offerItemList[0]?.item_discount);
      // End of addition by Om Shrivastava on 09-10-23
      // Reason : Set the discount in the usestate
      setMenuData(response?.menuList);
      setCategoryData(response?.categoryList);
      setItemData(response?.itemList);
      //   setItemName(response?.item_name)
    }
  };
  // End of addition by Om Shrivastava on 05-10-23
  // Reason : Create function for the API calling
console.log(discount,'dissss')
  //   const validateOnInput = (inputName, value) => {
  //     if (inputName == "name") {
  //       if (value != null || value != undefined || value.trim() != "") {
  //         setNameError("");
  //       }
  //     }
  //     if (inputName == "contact_number") {
  //       if (value.length < 10)
  //         setContactNumberError(
  //           "Contact number should not be less than 10 digits"
  //         );
  //       if (value.length > 10)
  //         setContactNumberError(
  //           "Contact number should not be greater than 10 digits"
  //         );

  //       if (value.length == 10 || value.length == 0) setContactNumberError("");
  //     }
  //   };

  //   const postPaymentData = async () => {
  //     var allowDataPost = false;
  //     if (icon == null || icon == undefined) {
  //       if (selectedImage == null || selectedImage == undefined) {
  //         if (iconSizeError != "") {
  //           setIconSizeError("File size must be below 200 KB");
  //         } else {
  //           setIconError("Please select image");
  //         }
  //         allowDataPost = false;
  //       } else {
  //         setIconError("");
  //         if (contactNumberError == "" && iconSizeError == "") {
  //           allowDataPost = true;
  //         } else {
  //           allowDataPost = false;
  //         }
  //       }
  //     } else {
  //       // Modified by Rohan kansari - 21/8/23
  //       // Reason - To validate all field in one place
  //       if (iconSizeError != "" || contactNumberError != "") {
  //         allowDataPost = false;
  //       } else {
  //         allowDataPost = true;
  //       }

  //     }

  //     if (allowDataPost) {
  //       const updatedMenuData = new FormData();
  //       if (paymentMethodId) {
  //         updatedMenuData.append("id", paymentMethodId);
  //       }

  //       updatedMenuData.append("name", name ? name : " ");

  //       updatedMenuData.append(
  //         "contact_number",
  //         contactNumber ? contactNumber : ""
  //       );
  //       // End of comment & Addition By pratap sahu on 15-09-2023
  //       // Reason: to save empty name

  //       if (selectedImage != null || selectedImage != undefined) {
  //         updatedMenuData.append("scanner", selectedImage);
  //       }
  //       const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
  //       const response = await savePaymentMethodApi(tenant, updatedMenuData);
  //       if (response.msg) {
  //         Message("Payment Updated.", "success");
  //         navigate("/dashboard");
  //       } else {
  //         Message("Something went wrong", "error");
  //       }
  //     }

  //   };
  console.log(menuSelected, "menu iddddd");
  console.log(categorySelected, "category iddddd");
  console.log(itemSelected, "item selected ");

  // Addition by Om Shrivastava on 06-10-23
  // Reason : Set the category name related to its menu name
  function categoryGet() {
    var temp = categoryData.filter((data) => {
      // parseInt(data.menu_id) === menuSelected
      if (menuSelected.filter((e) => e.id == parseInt(data.menu_id)).length)
        return data;
    });

    return temp;
  }
  // End of addition by by Om Shrivastava on 06-10-23
  // Reason : Set the category name related to its menu name

  // Addition by Om Shrivastava on 06-10-23
  // Reason : Set the item name related to its category name
  function itemGet() {
    var temp = itemData.filter((data) => {
      // parseInt(data.menu_id) === menuSelected
      if (
        categorySelected.filter((e) => e.id == parseInt(data.category_id))
          .length
      )
        return data;
    });

    return temp;
  }
  // End of addition by by Om Shrivastava on 06-10-23
  // Reason : Set the item name related to its category name

  function removeObjectWithId(itemSelected, id) {
    const objWithIdIndex = itemSelected?.findIndex((obj) => obj.id === id);

    if (objWithIdIndex > -1) {
      itemSelected.splice(objWithIdIndex, 1);
    }

    return itemSelected;
  }
  // Added by Om shrivastava on 08-10-23
  // Reason : Need to remove the item from the added item list
  // Function to remove an element by ID
  const removeItemById = (idToRemove) => {
    const updatedItems = itemSelected.filter((item) => item.id !== idToRemove);
    setitemSelected(updatedItems);
  };
  // End of addition by Om shrivastava on 08-10-23
  // Reason : Need to remove the item from the added item list

  // Added by Om shrivastava on 08-10-23
  // Reason : Need to remove the item from the added item list
  // Function to show cancel the item delete procedure
  const cancel = (e) => {};
  // End of addition by Om shrivastava on 08-10-23
  // Reason : Need to remove the item from the added item list

  // Addition by Om shrivastava on 09-10-23
  // Reason : Need to show the full price of the selected offer
  function totalFullPrice(data) {
    if (itemSelected) {
      var discounted_amount = 0;
      var final_price = 0
      itemSelected.map((item) => {
        if (item.name == data.name) {
          discounted_amount = ((item.price_full / 100) * discount).toFixed(2)
          final_price = (item.price_full - discounted_amount).toFixed(2)
        }
      });
      return final_price
    }
  }
  // End of addition by Om shrivastava on 09-10-23
  // Reason : Need to show the full price of the selected offer 

  // Addition by Om shrivastava on 09-10-23
  // Reason : Need to show the half price of the selected offer 
  function totalHalfPrice(data) {
    if (itemSelected) {
      var discounted_half_amount = 0;
      var final_half_price = 0
      itemSelected.map((item) => {
        if (item.name == data.name) {
          discounted_half_amount = ((item.price_half / 100) * discount).toFixed(2)
          final_half_price = (item.price_half - discounted_half_amount).toFixed(2)
        }
      });
      return final_half_price
    }
  }
 // End of addition by Om shrivastava on 09-10-23
  // Reason : Need to show the half price of the selected offer 
  return (
    <div className={style.Container}>
      <div className={style.titleContainer}>
        <div className={style.pageTitle}>Offer-Banner Item</div>
      </div>
      <form className={style.menuSection}>
        <div className={style.formContainer}>
          <div className={`${style.sectionInsideForm}`}>
            <div
              className={`${style.inputContainer}`}
              style={{ fontWeight: "bold", fontSize: "16px" }}
            >
              {/* Modification and addition by Om Shrivastava on 05-10-23
                Reason : Redesign the offer name, I remove the old structure */}
              {offerName}
              {/* End of modifciation and addition by Om Shrivastava on 05-10-23
                Reason : Redesign the offer name, I remove the old structure  */}
            </div>

            <div className={`${style.menuCatItemContainer}`}>
              <div className={`${style.menuCatItemdropdown}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>
                    <span className={style.mendatoryField}></span>Menu
                  </div>
                  {/* Addition by Om Shrivastava on 06-10-23
                 Reason : Set the menu list in dropdown */}
                  <MultiSelect
                    options={menuData}
                    value={menuSelected}
                    onChange={setMenuSelected}
                    labelledBy="Select the menu"
                  />
                  {/* End of addition by Om Shrivastava on 06-10-23
                 Reason : Set the menu list in dropdown  */}
                </div>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>
                    <span className={style.mendatoryField}></span>Category
                  </div>
                  {/* Addition by Om Shrivastava on 06-10-23
                 Reason : Set the category list in dropdown */}
                  <MultiSelect
                    options={categoryGet()}
                    value={categorySelected}
                    onChange={setcategorySelected}
                    labelledBy="Select the menu"
                  />
                  {/* End of addition by Om Shrivastava on 06-10-23
                 Reason : Set the category list in dropdown */}
                </div>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>
                    <span className={style.mendatoryField}></span>Item
                  </div>

                  {/* Addition by Om Shrivastava on 06-10-23
                 Reason : Set the item list in dropdown */}
                  {/* <pre>{JSON.stringify(selected)}</pre> */}
                  <MultiSelect
                    options={itemGet}
                    value={itemSelected}
                    onChange={setitemSelected}
                    labelledBy="Select the menu"
                    shouldToggleOnHover={true}
                    // disabled={true}
                  />
                  {/* End of addition by Om Shrivastava on 06-10-23
                 Reason : Set the item list in dropdown */}
                </div>
              </div>
              {/* Commented by Om Shrivastava on 07-10-23
            Reason : Not required yet */}
              {/* <div className={` ${style.addButton}`}>Add</div> */}
              {/* End of commented by Om Shrivastava on 07-10-23
            Reason : Not required yet*/}
            </div>
          </div>
        </div>

        <div style={{ paddingTop: "3%" }}>
          <div className={style.titleContainer}>
            <div className={style.pageTitle}>Added item list</div>
          </div>

          <div className={style.itemListSection}>
            <div className={style.tableContainer}>
              <div className={style.table}>
                <div className={style.tableHeadingContainer}>
                  {/* Modification and addition by Om Shrivastava on Shrivastava on 07-10-23
                Reason : Change the position of the edit button and rename this button */}
                  {/* <div className={style.sNoColumn}>Edit </div> */}
                  {/* End of modification and addition by Om Shrivastava on Shrivastava on 07-10-23
                Reason : Change the position of the edit button and rename this button */}
                  <div className={style.actionColumn}>S.No</div>
                  <div className={style.OrderIdColumn}>Menu</div>

                  <div className={style.orderStatusColumn}>Category</div>

                  <div className={style.orderStatusColumn}>Item</div>
                  <div className={style.paymentStatusColumn}> Price full</div>

                  <div className={style.subtotalColumn}>Price half</div>
                  {/* Addition by Om Shrivastava on 07-10-23
                  Reason : Remove the item name */}
                  <div className={style.sNoColumn}>Remove </div>
                  {/* End of addition by Om Shrivastava on 07-10-23
                  Reason : Remove the item name  */}

                  {/* <div
                    className={style.cgstColumn}
                  
                  >
                    Price
                   
                  </div> */}

                  {/* <div
                    className={style.dateColumn}
                  >
                    Date{" "}
                  </div>

                  <div
                    className={style.totalColumn}
                  >
                    {" "}
                    Time{" "}
                  </div> */}
                </div>

                <div
                  className={style.tableDataContainer}
                  style={{
                    backgroundColor: "#efefef",
                  }}
                >
                  {/* Addition by Om Shrivastava on 07-10-23
                  Reason : Remove the item name */}
                  {itemSelected && itemSelected.length > 0 ? (
                    itemSelected.map((itemDetail, index) => {
                      return (
                        <div
                          key={index}
                          className={style.tableData}
                          style={{
                            padding: "2px",
                            marginTop: "2px",
                            // marginBottom:
                            //   orderItems.length == index + 1 ? "2px" : "0px",
                            // background:
                            //   backgroundColor++ % 2 == 0
                            //     ? "white"
                            //     : "#1677ff14",
                          }}
                        >
                          {/* Modification and addition by Om Shrivastava on Shrivastava on 07-10-23
                Reason : Change the position of the edit button and rename this button */}
                          {/* <div
                      className={`${style.sNoColumn} ${style.commonColumnData} `}
                    >

                      <FiEdit
                        // onClick={(e) => {
                        //   openCategoryDetails(
                        //     bannerOfferDetails.id
                        //   );
                        // }}
                        // disabled={disabled}
                        style={{
                          //   border: "1px solid black",
                          marginLeft: "12px",
                          width: "14px",
                          height: "14px",
                        }}
                      />
                    </div> */}
                          {/* End of modification and addition by Om Shrivastava on Shrivastava on 07-10-23
                Reason : Change the position of the edit button and rename this button */}
                          <div
                            className={`${style.actionColumn} ${style.commonColumnData} `}
                          >
                            {index + 1}
                          </div>

                          <div
                            className={`${style.OrderIdColumn} ${style.commonColumnData} `}
                            style={{ wordBreak: "break-word" }}
                          >
                            {/* Maincourse */}
                            {itemDetail.menu_name}
                          </div>

                          <div
                            className={`${style.orderStatusColumn} ${style.commonColumnData} `}
                            style={{ wordBreak: "break-word" }}
                          >
                            {/* Chienese */}
                            {itemDetail.category_name}
                          </div>

                          <div
                            className={`${style.orderStatusColumn} ${style.commonColumnData} `}
                            style={{ wordBreak: "break-word" }}
                          >
                            {/* Paneer corn soup */}
                            {itemDetail.name}
                          </div>

                          <div
                            className={`${style.paymentStatusColumn} ${style.commonColumnData} `}
                            style={{ wordBreak: "break-word" }}
                          >
                            <h4> <strike>₹{itemDetail.price_full}</strike></h4>
                            {/* // Addition by Om shrivastava on 09-10-23
                            // Reason : Need to show the full price of the selected offer */}
                            {/* <h4> 380.00</h4> */}
                            {/* ₹{itemDetail.price_full} */}

                            {totalFullPrice(itemDetail) > 0 ? 
                        <>₹{totalFullPrice(itemDetail)}</>
                         : <>&nbsp;&nbsp;&nbsp;&nbsp;---</>}
                            {/* // End of addition by Om shrivastava on 09-10-23
                            // Reason : Need to show the full price of the selected offer */}
                          </div>
                          <div
                            className={`${style.subtotalColumn} ${style.commonColumnData} `}
                          >
                            <h4> <strike>₹{itemDetail.price_half}</strike></h4>
                            {/* // Addition by Om shrivastava on 09-10-23
                            // Reason : Need to show the half price of the selected offer */}
                            {/* <h4> 230.00</h4> */}
                            {/* {itemDetail.price_half} */}
                            {totalHalfPrice(itemDetail) > 0 ? 
                        <>₹{totalHalfPrice(itemDetail)}</>
                         : <>&nbsp;&nbsp;&nbsp;&nbsp;---</>}
                            {/* // End of addition by Om shrivastava on 09-10-23
                            // Reason : Need to show the half price of the selected offer */}
                          </div>
                          {/* Addition by Om Shrivastava on 07-10-23
                    Reason : Add the remove button for remove the some item */}
                          <div
                            className={`${style.sNoColumn} ${style.commonColumnData} `}
                          >
                            {/* Modification and addition by Om Shrivastava on 08-10-23
                            Reason : Add confirmation message when user remove the item*/}
                            <Popconfirm
                              className={style.logout_popup}
                              title="Are you sure you want to remove item?"
                              onConfirm={() => removeItemById(itemDetail.id)}
                              onCancel={cancel}
                              cancelText="Cancel"
                              okText="Ok"
                            >
                               <MdDelete
                              style={{
                                marginLeft: "12px",
                                width: "14px",
                                height: "14px",
                                cursor:'pointer',
                                color:'red'
                              }}
                            />
                            </Popconfirm>

                            {/* <MdDelete
                              // onClick={(e) => {
                              //   // openCategoryDetails(
                              //   //   bannerOfferDetails.id
                              //   // );
                              //  alert(removeObjectWithId(itemDetail, itemDetail.id))

                              // }}
                              onClick={() => removeItemById(itemDetail.id)}
                              // disabled={disabled}
                              style={{
                                //   border: "1px solid black",
                                marginLeft: "12px",
                                width: "14px",
                                height: "14px",
                              }}
                            /> */}
                            {/* End of Modifciation and addition by Om Shrivastava on 08-10-23
                            Reason : Add confirmation message when user remove the item */}
                          </div>
                          {/* End of addition by Om Shrivastava on 07-10-23
                    Reason : Add the remove button for remove the some item */}
                          {/* <div
                            className={`${style.cgstColumn} ${style.commonColumnData} `}
                          >
                            6575.00
                          </div> */}

                          {/* <div
                            className={`${style.dateColumn} ${style.commonColumnData} `}
                          >
                            29/09/23
                          </div>

                          <div
                          
                            className={`${style.totalColumn} ${style.commonColumnData} `}
                          >
                            12.00.00
                          </div> */}
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ textAlign: "center" }}>No records found!</div>
                  )}
                  {/* End of Addition by Om Shrivastava on 07-10-23
                  Reason : Remove the item name */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.actionContainer}>
          <div
            className={` ${style.backButton}`}
            style={{
              marginRight: "10px",
            }}
            onClick={(e) => {
              navigate(-1);
            }}
          >
            Back
          </div>

          {/* <div
            className={` ${style.cancelButton}`}
            style={{
              marginRight: "10px",
            }}
            onClick={(e) => {
              resetPaymentForm();
              window.scrollTo(0, 0);
            }}
          >
            Clear
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
        </div>
      </form>
    </div>
  );
};

export default OfferItem;
// End of addition by Om Shrivastava on 27-09-23
// Reason : Create offer banner item page
