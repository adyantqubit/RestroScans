/**
 * Added by - Om Shrivastava on 06-08-23
 * Reason - created form to save and update the offer details
 */
import { useContext, useEffect, useState } from "react";
import style from "./banneroffer.module.css";
import Header from "../GlobalComponent/Header";
import {
    getofferDetails,
    postOfferBannerDetails,
} from "../../Api/services";
import { Message, enableHeader } from "../../App";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../Api/config";
import { Select } from 'antd';
import { AiOutlineClose } from "react-icons/ai";
import { GlobalContext } from "../../Context/Context";
const { Option } = Select;

function BannerOfferForm(props) {

    var {
        showOfferForm,
        setShowOfferForm,
        disabled, setDisabled
      } = useContext(GlobalContext);
    const navigate = useNavigate();
    const location = useLocation();
    
    const [categoryData, setCategoryData] = useState({});
    // const [categoryId, setCategoryId] = useState(null);
    const [name, setName] = useState(null);
    // const [icon, setIcon] = useState(null);
    const [isActive, setIsActive] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [menuList, setMenuList] = useState([]);
    const [menu, setMenu] = useState(null);

    const[offerDetails, setOfferDetails] = useState({});
    const [offerId, setOfferId] = useState(null);
    const [discount, setDiscount] = useState(null);
    const [showVideo, setShowVideo] = useState(true);
    const [offerName, setOfferName] = useState(null);
    const [offerImage, setOfferImage] = useState(null);
    const [videoLink, setvideoLink] = useState(null);

    const [selectedOfferImage, setSelectedOfferImage] = useState(null);
    const [icon, setIcon] = useState(null);

    const [nameError, setNameError] = useState("")
    const [iconError, setIconError] = useState("")
    // console.log(location.state.id,'offerId')

    /**
     * Added by yuvraj sahu on 24-06-2023
     * Reason - to set menu name for dropdown
     */
    var [menuName, setMenuName] = useState(null);
    /**
     * End of addition by yuvraj Sahu on 24-06-2023
     */
    var defalutMenu = { label: null, value: null }
    var b


    const [validationErrors, setValidationErrors] = useState({
        name: "",
        menu: "",
        icon: "",
        is_active: "",
    });
console.log(props.id,'all data')
    /**
     * Added by - Yuvraj Sahu on 17-06-2023
     * Reason - method that will execute when page loads and then call api
     */
    useEffect(() => {
        // Added By Rohan Kansari - 25/6/23
        // Reason - To enable headerSiderbar
        enableHeader()
        // End of code - Rohan kansari - 25/6/23

        window.scrollTo(0, 0);
        // if (location.state.id != null) {
        //   setOfferId(location.state.id);

        // }
        if (props.id!=null){
            setOfferId(props.id)
        }
    }, []);

      useEffect(() => {
        if (offerId) {
          getOfferData();
        } 
      }, [offerId]);
    /**
     * End of code addition by - Yuvraj Sahu on 17-06-2023
     * Reason - method that will execute when page loads and then call api
     */


    const getMenus = async () => {
        // const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
        // const response = await getMenusAPI(tenant);
        // if (response.msg) {
        //   setMenuList(response.menus);
        // }
    };

    /**
     * Added by - Yuvraj Sahu on 17-06-2023
     * Reason - created api that will get category data
     */
    const getOfferData = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await getofferDetails(tenant, offerId);
    if (response.offer) {
      setOfferDetails(response.offer);
      setOfferId(response.offer.id);
      setOfferName(response.offer.offer_name);
      setDiscount(response.offer.discount);
      setIcon(response.offer.offer_image)
    //   setOfferImage(response.offer.offer_image);
      setvideoLink(response.offer.video_link);
      setShowVideo(response.offer.show_video_Hide_Image);
    }
    };
    /**
     * End of code addition by - Yuvraj Sahu on 17-06-2023
     * Reason - created api that will get category data
     */
// console.log(offerDetails, offerId,offerName,discount, offerImage, videoLink, showVideo)
// console.log(offerImage,selectedOfferImage,icon)
    /**
     * Added by - Yuvraj Sahu on 17-06-2023
     * Reason -  method to validate inputs when input is focused out
     */
    /**
     * Added by Yuvraj Sahu on 18-06-2023
     * Reason - to validate input when we go back input 
     */
    const validateOnBlur = (inputName, value) => {
        if (inputName == "name") {
            if (name != null || value) {
                const error = {
                    name: "",
                };
                setValidationErrors({ ...validationErrors, ...error });
            } else {
                const error = {
                    name: "Please enter category name",
                };
                setValidationErrors({ ...validationErrors, ...error });
            }
        }

        if (inputName == "menu") {
            if (value) {
                const error = {
                    menu: "",
                };
                setValidationErrors({ ...validationErrors, ...error });
            } else {
                const error = {
                    menu: "Please select menu name",
                };
                setValidationErrors({ ...validationErrors, ...error });
            }
        }
    };
    /**
     * End of addition by Yuvraj Sahu on 18-06-2023
     */
    /**
     * End of code addition by - Yuvraj Sahu on 17-06-2023
     * Reason -  method to validate inputs when input is focused out
     */

    /**
     * Added by - Yuvraj Sahu on 17-06-2023
     * Reason - method to validate inputs when user is entering some data
     */
    const validateOnInput = (inputName, value) => {
        if (inputName == "name") {
            if (value != null || value != undefined || value.trim() != "") {
              setNameError("")
            }
          }
    };
    /**
     * End of code addition by - Yuvraj Sahu on 17-06-2023
     * Reason -  method to validate input when user is entering some data
     */

    /**
     * Added by - Yuvraj Sahu on 17-06-2023
     * Reason - method to validate image when user is entering some data
     */
    const validateOnFileInput = (inputName, value) => {
        // if (inputName == "icon") {
        //     if (value != null && value != undefined) {
        //         if (value.size / 1024 > 200) {
        //             const error = {
        //                 icon: "File size must be below 200 KB",
        //             };
        //             setValidationErrors({ ...validationErrors, ...error });
        //         } else {
        //             const error = {
        //                 icon: "",
        //             };
        //             setValidationErrors({ ...validationErrors, ...error });
        //         }
        //     } else {
        //         const error = {
        //             icon: "",
        //         };
        //         setValidationErrors({ ...validationErrors, ...error });
        //     }
        // }
        if (value != null && value != undefined) {
            if (value.size / 1024 > 200) {
              setIconError("File size must be below 200 KB")
            } else {
              setIconError("")
            }
          } else {
            setIconError("uuu")
          }
          
    };
    /**
     * End of code addition by - Yuvraj Sahu on 17-06-2023
     * Reason -  method to validate images when user is entering some data
     */
    console.log(offerId,showOfferForm)
    /**
     * Added by - Yuvraj Sahu on 17-06-2023
     * Reason - created api to save category. After saving the category it will redirect to category list page.
     */

    /**
     * Added by - Yuvraj Sahu on 17-06-2023
     * Reason - Method to reset category form
     */
    const resetCategoryForm = (event) => {
        setName(categoryData.name ? categoryData.name : "");
        setIcon(categoryData.icon ? categoryData.icon : "");
       
        setIsActive(categoryData.is_active == true || categoryData.is_active == false ? categoryData.is_active : true);
        
        setSelectedImage(null);
       
        setMenu(categoryData.menu ? categoryData.menu : null);
        
        document.getElementById("icon").value = "";

        const error = {
            name: "",

            menu: "",

            icon: "",
            is_active: "",
        };
        setValidationErrors({ ...validationErrors, ...error });

        setIconError("")
   setNameError("")
    };
    /**
     * End of code addition by - Yuvraj Sahu on 17-06-2023
     * Reason - To reset category form
     */

    /**
     * Added by Yuvraj Sahu on 24-06-2023 
     * Reason - to set dropdown value
     */
    const handleMenuChange = (value) => {
        setMenu(value)
        // setValidationErrors({menu: ""})
        const error = {
            menu: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
    };

    const newArrayOfObj = menuList.map(({
        name: label,
        id: value,
        ...rest
    }) => ({
        label,
        value,
        ...rest
    }));
    /**
     * End of addition by yuvraj Sahu on 24-06-2023
     */
console.log(iconError)
    // Added by Om Shrivastava on 06-08-23
    // Reason : sava the data 
    const saveOffer = async () => {

        // console.log("new added,",props.dataList[0])
        // props.setData([props.dataList[0],...props.dataList]);

        var allowDataPost = false;
        if (offerName == null || offerName == undefined || offerName.trim() == "") {
            setNameError("Please enter menu name")
          } else {
            setNameError("")
          }
      
          if (offerId == null || offerId == undefined) {
            if (offerImage == null || offerImage == undefined) {
              setIconError("Please select image")
            } else {
              setIconError("")
            }
          } else {
            setIconError("")
          }
      
          if (offerName == null || offerName == undefined || offerName.trim() == "" ||
            ((offerId == null || offerId == undefined) && (offerImage == null || offerImage == undefined))) {
            allowDataPost = false
          } else {
            if (nameError != "" || iconError != "") {
              allowDataPost = false;
              console.log('if part')
            }else{
              allowDataPost = true;
              console.log('else part')
            }
          }
        if (allowDataPost) {
        const updatedOfferData = new FormData();
        if (offerId) {
            updatedOfferData.append("id", offerId);
        }
        updatedOfferData.append("offer_name", offerName);
        updatedOfferData.append("discount", discount);
        if (offerImage != null || offerImage != undefined) {
            updatedOfferData.append("offer_image", offerImage);
        }
        updatedOfferData.append("video_link", videoLink);
        updatedOfferData.append("show_video_Hide_Image", showVideo);

        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
        const response = await postOfferBannerDetails(tenant, updatedOfferData);
        // alert(props.setBannerOffer(updatedOfferData))

        if (response.msg) {
            Message("Offer saved successfully.", "success");
            // props.setData(response.allOfferData)
            // navigate(-1);
            // location.state.setData(response.allOffer)
            // props.setData(response.allOffer)
           var index= props.dataList.findIndex(e=>e.id==response.data.id)
           console.log(index,props.dataList,response.data)
           if(index==-1){
             props.setData([response.data,...props.dataList]);
           }
           else{
            props.dataList[index]=response.data
            props.setData([...props.dataList])
           }
            
        } else {
            Message("Something went wrong", "error");
        }
        } else {
          // Message("Please provide values for all mendatory fields", "info");
        }

        // props.setBannerOffer([...props.id,props.id[0]])

        /**
         * End of code addition by - Yuvraj Sahu on 17-06-2023
         * Reason - created api to save category. After saving the category it will redirect to category list page.
         */
    };

    var [defaultValueData, setDefaultValueData] = useState(10)

    const removeOfferFormDiv = () => {
        document.getElementById('offer_form').style.display = 'none'
        setShowOfferForm(false)
        setDisabled(false)
      };

    return (
        <div className={style.offerFormDiv} 

            id="offer_form">

            {/* Added by Om Shrivastava on 04-08-23
            Reason : Show the offer form data */}
            <div className={style.offerFormContainer}>
                <div className={style.titleContainer}>
                    <div className={style.pageTitle}>Offer form</div>
                </div>
                <div>
                    <div style={{ float: 'right' }}>
                        <AiOutlineClose color="black" size={20} style={{ border: "1px dotted green", borderRadius: '100px', cursor: 'pointer', height: '22px', width: '22px' }}
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
                                            <span className={style.mendatoryField}>* </span>Name
                                        </div>
                                        <input
                                            className={`${style.textInputBox}`}
                                            type="text"
                                            name="name"
                                            value={offerName}
                                            style={{ width: "200px" }}
                                            onChange={(e) => {
                                              setOfferName(e.target.value.toString());
                                            //   validateOnInput("name", e.target.value.toString());
                                            }}
                                            maxLength={30}
                                        />
                                    </div>
                                    <div className={`${style.inputErrorArea}`}>
                                        {nameError}
                                    </div>
                                </div>

                                <div className={`${style.inputContainer}`}>
                                    <div className={`${style.inputArea}`}>
                                        <div className={`${style.inputLabel}`}>
                                            <span className={style.optionalField}>*</span>
                                            {/* Contact number */}
                                            Discount(%)
                                        </div>
                                        <input
                                            className={`${style.textInputBox}`}
                                            type="number"
                                            name="discount"
                                            value={discount}
                                            style={{ width: "200px" }}
                                            onChange={(e) => {
                                              setDiscount(e.target.value);
                                            //   validateOnInput("contact_number", e.target.value);
                                            }}
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
                                            <span className={style.mendatoryField}>* </span>Image
                                        </div>
                                        <div className={style.menuImageContainer}>
                                        {selectedOfferImage ? (
                      selectedOfferImage
                    ) : icon ? (
                      <img
                        src={config.staticBaseURL + icon}
                        className={style.menuImage}
                        width={"200px"}
                        height={"200px"}
                      />
                    ) : null}
                                        </div>
                                    </div>
                                </div>

                                <div className={`${style.inputContainer}`}>
                                    <div className={`${style.inputArea}`}>
                                        <div className={`${style.inputLabel}`}>
                                        <span className={style.optionalField}>*</span>

                                           Select new
                                            image
                                        </div>

                                        <input
                                            className={`${style.textInputBox} ${style.textInputBoxImage}`}
                                            type="file"
                                            name="icon"
                                            id="icon"
                                            accept="image/png,image/jpg,image/jpeg"
                                            // style={{ width: "280px" }}
                                            onChange={(e) => {

                                        //   if (e.target.files[0]) {
                                        //     validateOnFileInput("icon", e.target.files[0]);
                                        // if (e.target.files[0]) {
                                        //     setSelectedOfferImage(e.target.files[0].name);
                                        //     setOfferImage(e.target.files[0]);
                                        //     validateOnFileInput("icon", e.target.files[0]);
                                        //   } else {
                                        //     setSelectedOfferImage(null);
                                        //     setOfferImage(null);
                                        //   }
                                            if (e.target.files[0]) {
                                                setSelectedOfferImage(e.target.files[0].name);
                                                setOfferImage(e.target.files[0]);
                                              validateOnFileInput("icon", e.target.files[0]);
                                            }
                                        }}
                                        />
                                    </div>

                                    <div className={`${style.inputErrorArea}`}>
                                        <p>
                                        {iconError}
                                    </p>
                                    <p>
                                            {/* {iconSizeError} */}
                                        </p></div>
                                </div>

                                <div className={`${style.inputContainer}`}>
                                    <div className={`${style.inputArea}`}>
                                        <div className={`${style.inputLabel}`}>
                                        <span className={style.optionalField}>*</span>
                                            Video link
                                        </div>
                                        <textarea
                                            className={`${style.textInputBox}`}
                                            // type="number"
                                            name="video_link"
                                            value={videoLink}
                                            style={{ width: "200px",height:'100px',resize:'none' }}
                                            onChange={(e) => {
                                              setvideoLink(e.target.value);
                                            //   validateOnInput("contact_number", e.target.value);
                                            }}
                                            maxLength={2000}
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
                                            <span className={style.optionalField}>*</span>Show video
                                        </div>
                                        <input
                                            className={`${style.textInputBox}`}
                                            type="checkbox"
                                            name="show_video_Hide_Image"
                                            style={{
                                                width: "18px",
                                                height: "18px"
                                            }}
                                        checked={showVideo}
                                        onChange={(e) => {
                                          setShowVideo(e.target.checked);
                                        //   validateOnInput("is_available", e.target.value);
                                        }}
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
                            onClick={() => {
                              saveOffer();
                            //   window.scrollTo(0, 0);
                            }}
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
    );
}
export default BannerOfferForm;
