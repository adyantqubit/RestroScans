// Commented by Om Shrivastava on 26-09-23
// Reason : No Longer Required
// /**
//  * Added by - Om Shrivastava on 06-08-23
//  * Reason - created form to save and update the offer details
//  */
// import { useContext, useEffect, useState } from "react";
// import style from "./bannerofferitem.module.css";
// import Header from "../GlobalComponent/Header";
// import {
//   getofferitemDetails,
//   postOfferitemBannerDetails,
// } from "../../Api/services";
// import { Message, enableHeader } from "../../App";
// import { useLocation, useNavigate } from "react-router-dom";
// import config from "../../Api/config";
// import { Select } from "antd";
// import { AiOutlineClose } from "react-icons/ai";
// import { GlobalContext } from "../../Context/Context";
// import {
  
//   checkIsEmpty,
  
// } from "../GlobalComponent/Validation";
// const { Option } = Select;

// function BannerItemForm(props) {
//   var {
//     showOfferItemForm,
//     setShowOfferItemForm,
//     disabledItemForm,
//     setDisabledItemForm,
//   } = useContext(GlobalContext);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [offerDetails, setOfferDetails] = useState({});
//   const [offerId, setOfferId] = useState(null);
//   const [itemName, setItemName] = useState("");
//   const [offerName, setOfferName] = useState("");
 
//   // Added by Om Shrivastava on 06-09-23
//   // Reason : Set the total data count
//   const [offerDataCount, setOfferDataCount] = useState(0);
//   // End of addition by Om Shrivastava on 07-09-23
//   // Reason : Set the total data count
//   // Added by Om Shrivastava on 08-09-23
//   // Reason : Set the is active data in this usestate
//   const [showOffer, setShowOffer] = useState(true);
//   // End of addition by Om Shrivastava on 08-09-23
//   // Reason : Set the is active data in this usestate

//   const [validationErrors, setValidationErrors] = useState({
//     offer_name: "",
//     item_name: "",
    
//   });
//   // console.log(location.state.id,'offerId')

//   /**
//    * Added by Om shrivastava on 24-06-2023
//    * Reason - to set menu name for dropdown
//    */
//   var [menuName, setMenuName] = useState(null);
//   /**
//    * End of addition by Om shrivastava on 24-06-2023
//    */
//   var defalutMenu = { label: null, value: null };
//   var b;

//   // const [validationErrors, setValidationErrors] = useState({
//   //     name: "",
//   //     menu: "",
//   //     icon: "",
//   //     is_active: "",
//   // });
//   /**
//    * Added by - Om shrivastava on 17-06-2023
//    * Reason - method that will execute when page loads and then call api
//    */
//   useEffect(() => {
//     // Added By Rohan Kansari - 25/6/23
//     // Reason - To enable headerSiderbar
//     enableHeader();
//     // End of code - Rohan kansari - 25/6/23

//     window.scrollTo(0, 0);
//     // if (location.state.id != null) {
//     //   setOfferId(location.state.id);

//     // }
//     if (props.id != null) {
//       setOfferId(props.id);
//     }
//   }, []);

//   // console.log(offerDataCount,'counttt')

//   useEffect(() => {
//     if (offerId) {
//       getOfferData();
//     }
//   }, [offerId]);
//   /**
//    * End of code addition by - Om shrivastava on 17-06-2023
//    * Reason - method that will execute when page loads and then call api
//    */

//   const getMenus = async () => {
//     // const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
//     // const response = await getMenusAPI(tenant);
//     // if (response.msg) {
//     //   setMenuList(response.menus);
//     // }
//   };

//   /**
//    * Added by - Om shrivastava on 17-06-2023
//    * Reason - created api that will get category data
//    */
//   const getOfferData = async () => {
//     const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
//     const response = await getofferitemDetails(tenant, offerId);
//     if (response.offerItem) {
//       setOfferDetails(response.offerItem);
//       setOfferId(response.offerItem.id);
//       setOfferName(response.offerItem.offer_name);
//       setItemName(response.offerItem.item_name);

//       setOfferDataCount(response.offerItemBannerCount);
//     }
//   };
// console.log(itemName,'itemmmm')
//   const validateOnBlur = (inputName, value) => {
//     if (inputName == "offer_name") {
//       var flag = checkIsEmpty(value);
//       if (flag) {
//         setValidationErrors((previousList) => {
//           previousList.name = "Please enter name";
//           return { ...previousList };
//         });
//       } else {
//         setValidationErrors((previousList) => {
//           previousList.name = "";
//           return { ...previousList };
//         });
//       }
//     }
//   };

//   const validateOnSubmit = () => {
//     validateOnBlur("offer_name", offerName);
//     validateOnBlur("item_name", itemName);
//   };

//   const saveOffer = async () => {
//     var allowDataPost = false;

//     validateOnSubmit();

//     if (offerName != "" && validateOnBlur("item_name", itemName) == false) {
//       allowDataPost = true;
//     }

//     if (allowDataPost) {
//       const updatedOfferData = new FormData();
//       if (offerId) {
//         updatedOfferData.append("id", offerId);
//       }
//       updatedOfferData.append("offer_name", offerName);
//       updatedOfferData.append("item_name", itemName);

//       const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
//       const response = await postOfferitemBannerDetails(
//         tenant,
//         updatedOfferData
//       );
//       // alert(props.setBannerOffer(updatedOfferData))
//       // Added by Om Shrivastava on 06-09-23
//       // Reason : Get the total data number in form page
//       props.setBackendOfferBannerCount(response.offerItemBannerCount);
//       // End of addition by Om Shrivastava on 06-09-23
//       // Reason : Get the total data number in form page
//       // setOfferDataCount(response.offerBannerCount);

//       if (response.msg) {
//         Message("Offer saved successfully.", "success");
//         // Added by Om Shrivastava on 26-08-23
//         // Reason : Set the div position in save button
//         document.getElementById("offer_form").style.display = "none";
//         setShowOfferItemForm(false);
//         setDisabledItemForm(false);

//         var index = props.dataList.findIndex((e) => e.id == response.data.id);
//         console.log(index, props.dataList, response.data);
//         if (index == -1) {
//           // Added by Om Shrivastava on 06-09-23
//           // Reason : Get the total data number in form page
//           if (props.dataList.length >= props.listPerPage) {
//             props.dataList.pop();
//           }
//           // End of addition by Om Shrivastava on 06-09-23
//           // Reason : Get the total data number in form page
//           props.setData([response.data, ...props.dataList]);
//         } else {
//           props.dataList[index] = response.data;
//           props.setData([...props.dataList]);
//         }
//       } else {
//         Message("Something went wrong", "error");
//       }
//     } else {
//       // Message("Please provide values for all mendatory fields", "info");
//     }
//   };

//   const removeOfferFormDiv = () => {
//     document.getElementById("offer_form").style.display = "none";
//     setShowOfferItemForm(false);
//     setDisabledItemForm(false);
//     window.scroll(0, 0);
//   };

//   // Addition by Om Shrivastava on 04-09-23
//   // Reason : Reset the clear form of offer
//   const resetOfferForm = (event) => {
//     setOfferName(offerDetails.offer_name ? offerDetails.offer_name : "");
//     setItemName(offerDetails.item_name ? offerDetails.item_name : "");

//     setValidationErrors("");
//     const error = {
//         offer_name: "",
//       itemName: "",
//     };
//     setValidationErrors({ ...validationErrors, ...error });
//   };
//   // End of addition by Om Shrivastava on 04-09-23
//   // Reason : Reset the clear form of offer

//   return (
//     <div id="offer_form">
//       {/* Added by Om Shrivastava on 04-08-23
//             Reason : Show the offer form data */}
//       <div className={style.offerFormContainer}>
//         <div className={style.titleContainer}>
//           <div className={style.pageTitle}>Offer Item form</div>
//         </div>
//         <div>
//           <div style={{ float: "right" }}>
//             <AiOutlineClose
//               color="black"
//               size={20}
//               style={{
//                 border: "1px dotted green",
//                 borderRadius: "100px",
//                 cursor: "pointer",
//                 height: "22px",
//                 width: "22px",
//               }}
//               onClick={(e) => {
//                 removeOfferFormDiv();
//               }}
//             />
//           </div>
//           <form className={style.menuSection}>
//             <div className={style.formContainer}>
//               <div className={`${style.sectionInsideForm}`}>
//                 <div className={`${style.inputContainer}`}>
//                   <div className={`${style.inputArea}`}>
//                     <div className={`${style.inputLabel}`}>
//                       <span className={style.mendatoryField}>* </span>Offer name
//                     </div>
//                     <input
//                       className={`${style.textInputBox}`}
//                       type="text"
//                       name="offer_name"
//                       value={offerName}
//                       style={{ width: "200px" }}
//                       onChange={(e) => {
//                         setOfferName(e.target.value.toString());
//                         // validateOnBlur("name", e.target.value.toString())
//                       }}
//                       maxLength={30}
//                     />
//                   </div>
//                   <div className={`${style.inputErrorArea}`}>
//                     {validationErrors.name}
//                   </div>
//                 </div>

//                 <div className={`${style.inputContainer}`}>
//                   <div className={`${style.inputArea}`} style={{border:'1px solid red'}}>
//                     <div className={`${style.inputLabel}`} style={{border:'1px solid green'}}>
//                       <span className={style.mendatoryField}>* </span>
//                       {/* Contact number */}
//                       Item name
//                     </div>
//                     {/* <input
//                       className={`${style.textInputBox}`}
//                       type="text"
//                       name="item_name"
//                       value={itemName}
//                       style={{ width: "200px" }}
//                       onChange={(e) => {
//                         setItemName(e.target.value);
//                         validateOnBlur("item_name", e.target.value.toString());
//                       }}
//                       onKeyDown={(evt) => {
//                         if (
//                           (evt.which != 8 &&
//                             evt.which != 9 &&
//                             evt.which != 0 &&
//                             evt.which < 48) ||
//                           evt.which > 57
//                         ) {
//                           evt.preventDefault();
//                         }
//                       }}
//                       maxLength={10}
//                     /> */}
//                     <div className={`${style.itemContainer}`} 
//                     style={{border:'2px solid aqua',display:'flex',justifyContent:'center'}}>
                          
//                         <div style={{fontSize:'14px',fontWeight:"bold"}}>Menu
//                           <div>
//                             Menu 1
//                           </div>
//                           <div>
//                             Menu 1
//                           </div><div>
//                             Menu 1
//                           </div><div>
//                             Menu 1
//                           </div><div>
//                             Menu 1
//                           </div>
//                         </div>


//                         <div style={{fontSize:'14px',fontWeight:"bold"}}>Category

//                         <div>
//                             Category 1
//                           </div>
//                           <div>
//                             Category 1
//                           </div><div>
//                             Category 1
//                           </div><div>
//                             Category 1
//                           </div><div>
//                             Category 1
//                           </div>
//                         </div>
//                         <div style={{fontSize:'14px',fontWeight:"bold"}}>Item
//                         <div>
//                             Category 1
//                           </div>
//                           <div>
//                             Ommm
//                           </div><div>
//                             Ommm
//                           </div><div>
//                             Ommm
//                           </div><div>
//                             Ommm
//                           </div>
//                         </div>


//                     </div>
//                   </div>
//                   <div className={`${style.inputErrorArea}`}>
//                     {validationErrors.item_name}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className={style.actionContainer}>
//               {/* // Modification and addition by Om Shrivastava on 11-09-23
//               // Reason : Need to change the position of div */}
//               {/* // Modification and addition by Om Shrivastava on 04-09-23
//               // Reason : Reset the clear form of offer */}
//               <div
//                 className={` ${style.cancelButton}`}
//                 style={{
//                   marginRight: "10px",
//                 }}
//                 // onClick={(e) => {
//                 //   removeOfferFormDiv();
//                 // }}
//                 onClick={(e) => {
//                   resetOfferForm();
//                   window.scrollTo(0, 0);
//                 }}
//               >
//                 Clear
//               </div>
//               <div
//                 className={` ${style.proceedButton}`}
//                 onClick={() => {
//                   saveOffer();
//                   // Added by Om Shrivastava on 26-08-23
//                   // Reason : Set the div position in save button
//                   window.scrollTo(0, 0);
//                   // End of Addition by Om Shrivastava on 26-08-23
//                   // Reason : Set the div position in save button
//                 }}
//               >
//                 Save
//               </div>
//               {/* //End of modification and addition by Om Shrivastava on11-09-23
//               // Reason : Need to change the position of div */}
//               {/* //End of modification and addition by Om Shrivastava on 04-09-23
//               // Reason : Reset the clear form of offer */}
//             </div>
//           </form>
//         </div>

//         {/* Added by Om Shrivastava on 04-08-23
// Reason : Show the offer form data */}
//       </div>
//     </div>
//   );
// }
// export default BannerItemForm;
// End of commented by Om Shrivastava on 26-09-23
// Reason : No Longer Required
