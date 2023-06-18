/**
 * Added by - Yuvraj Sahu on 02-06-2023
 * Reason - created form to save and update social media
 */
import { useEffect, useState } from "react";
import style from "./socialMediaForm.module.css";
import Header from "../GlobalComponent/Header";
import {
  deteleSocialMediaApi,
  getSettingsDetails,
  getSocialMediaApi,
  postSettingsDetails,
  saveSocialMediaApi,
} from "../../Api/services";
import { Message } from "../../App";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, message, Popconfirm } from "antd";
import { FileUploader } from "react-drag-drop-files";
import config from "../../Api/config";
const fileTypes = ["JPG", "PNG", "SVG", "GIF"];

function SocialMediaForm(props) {
  const navigate = useNavigate();

  /**
   * Added by Yuvraj Sahu on 07-06-2023
   * Reason - to recieve id for update social media
   */
  const { state } = useLocation();
  const { id } = state; // Read values passed on state
  /**
   * End of addition by Yuvraj Sahu on 07-06-2023
   */

  // const [settingData, setSettingData] = useState({});
  /**
  * Modified by Yuvraj Sahu on 12-06-2023
  * Reason - to set empty object
  */
  const [socialMediaObj, setSocialMediaObj] = useState({});
  /**
  *End of addition by Yuvraj Sahu on 12-06-2023
  */
  const [themeList, setThemeList] = useState([]);
  // const [appTheme, setAppTheme] = useState(null);
  const [socialMediaName, setSocialMediaName] = useState(null);
  const [socialMediaLink, setSocialMediaLink] = useState(null);

  /**
   * Added by Yuvraj Sahu on 10-06-2023
   * Reason - to set image url
   */
  const [imageUrl, setImageUrl] = useState("");
  /**
   * End of addition by Yuvraj Sahu on 10-06-2023
   */

  const [validationErrors, setValidationErrors] = useState({
    // app_theme: "",
    social_media_name: "",
    social_media_link: "",
    /**
    * Added by Yuvraj Sahu on 12-06-2023
    * Reason - to show error message for icon
    */
    social_media_icon: "",
    /**
    * End of addition by Yuvraj Sahu on 12-06-2023
    */
  });

  /**
   * Added by - Yuvraj Sahu on 07-06-2023
   * Reason - method that will execute when page loads and then call api
   */
  useEffect(() => {
    getSocialMediaData();
  }, []);
  /**
   * End of code addition by - Yuvraj Sahu on 02-06-2023
   * Reason - method that will execute when page loads and then call api
   */

  /**
   * Added by - Yuvraj Sahu on 02-06-2023
   * Reason - created api that will get social media data
   */
  const getSocialMediaData = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await getSocialMediaApi(tenant);
    if (response.msg) {
      // setSettingData(response.setting);
      if (id != 0) {
        var filterSocialMediaObj = response.social.filter(
          (dt) => dt.id == id
        )[0];
        setSocialMediaObj(filterSocialMediaObj);
        setSocialMediaName(filterSocialMediaObj.social_media_name);
        setSocialMediaLink(filterSocialMediaObj.social_media_link);
        setImageUrl(filterSocialMediaObj.social_media_icon);
      }
    }
    // setThemeList(response.themeOptions);
  };
  /**
   * End of code addition by - Yuvraj Sahu on 02-06-2023
   * Reason - created api that will get setting data
   */

  /**
   * Added by - Yuvraj Sahu on 07-06-2023
   * Reason -  method to validate inputs when input is focused out
   */
  const validateOnBlur = (inputName, value) => {
    if (inputName == "social_media_name") {
      if (value.toString().length > 0) {
        if (value.toString().length >= 255) {
          const error = {
            social_media_name: "Social media name must be 255 characters long",
          };
          setValidationErrors({ ...validationErrors, ...error });
        } else {
          const error = {
            social_media_name: "",
          };
          setValidationErrors({ ...validationErrors, ...error });
        }
      }
      // else {
      //   const error = {
      //     social_media_name: "Social name is required!",
      //   };
      //   setValidationErrors({ ...validationErrors, ...error });
      // }
    }

    if (inputName == "social_media_link") {
      if (value.toString().length > 0) {
        const error = {
          social_media_name: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      } else {
        const error = {
        /**
        * Added by Yuvraj Sahu on 12-06-2023
        * Reason - to remove error message in social media name
        */
          social_media_link: "Social media link is required!",
          /**
          * End of addition by Yuvraj Sahu on 12-06-2023
          */
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }
  };

  /**
   * End of code addition by - Yuvraj Sahu on 07-06-2023
   * Reason - method to validate inputs when input is focused out
   */

  /**
   * Added by - Yuvraj Sahu on 07-06-2023
   * Reason - method to validate inputs when user is entering some data
   */
  const validateOnInput = (inputName, value) => {
    if (inputName == "social_media_name") {
      if (value.toString().length > 255) {
        const error = {
          social_media_name: "Social media name must be 255 characters long",
        };
        setValidationErrors({ ...validationErrors, ...error });
      } else {
      }
    }

    if (inputName == "social_media_link") {
      if (value.toString().length > 0) {
        const error = {
          social_media_link: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      } else {
        const error = {
          social_media_link: "Social media link is required!",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }
    /**
        * Added by Yuvraj Sahu on 12-06-2023
        * Reason - to remove error message in social media icon
        */
    if (inputName == "social_media_link" && value == "social_media_icon") {
      if (img != null && socialMediaLink != null) {
        const error = {
          social_media_icon: "",
          social_media_link: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      } else {
        const error = {
          social_media_icon: "Social media icon is required!",
          social_media_link: "Social media link is required!",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }

    /**
     * Added by Yuvraj Sahu on 16-06-2023
     * Reason - to validate icon
     */
    if (inputName == "social_media_icon") {
      if (img != null) {
        const error = {
          social_media_icon: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      } else {
        const error = {
          social_media_icon: "Social media icon is required!",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }
    /**
     * End of addition by Yuvraj Sahu on 16-06-2023
     */
    /**
    * End of code addition by - Yuvraj Sahu on 12-06-2023
    */
  };
  /**
   * End of code addition by - Yuvraj Sahu on 07-06-2023
   * Reason -  method to validate inputs when user is entering some data
   */

  /**
   * Added by - Yuvraj Sahu on 07-06-2023
   * Reason - created api to save social media. After saving the social media it will redirect to social media page.
   */
  const [img, setImg] = useState(null);
  /**
  * Modified by Yuvraj Sahu on 12-06-2023
  *Reason - to change name aof api
  */
  const saveSocialMedia = async () => {
  /**
  * End of modification by Yuvraj Sahu on 12-06-2023
  */
    var allowDataPost = false;
    var socialMediaNameValue =
      document.getElementsByName("social_media_name")[0].value;

    var socialMediaLinkValue =
      document.getElementsByName("social_media_link")[0].value;

    validateOnInput("social_media_name", socialMediaNameValue);
    /**
    * Added by Yuvraj Sahu on 12-06-2023
    * Reason - to show error message for social media validation
    */
    if (!socialMediaLinkValue && img == null) {
      validateOnInput("social_media_link", "social_media_icon");
    }
    else {
    if (img == null && imageUrl == ""){
      validateOnInput("social_media_icon", img);
    }
    else {
      validateOnInput("social_media_link", socialMediaLinkValue);
    }
  }
    /**
    * End of addition by Yuvraj Sahu on 12-06-2023
    */

    if (id != 0) {
      if (socialMediaLinkValue == "") {
        allowDataPost = false;
      } else {
        allowDataPost = true;
      }
    } else {
      if (socialMediaLinkValue == "" || img == null) {
        allowDataPost = false;
      } else {
        allowDataPost = true;
      }
    }
    if (allowDataPost) {
      // const updatedSettingsData = {
      //   social_media_name: socialMediaName,
      //   social_media_link: socialMediaLink,
      // };

      const formData = new FormData();
      if (id != 0) {
        formData.append("id", id);
      }
      formData.append("social_media_name", socialMediaName);
      formData.append("social_media_link", socialMediaLink);

      /**
       * Added by Yuvraj Sahu on 10-06-2023
       * Reason - to upload updated image
       */
      if (img != null) {
        formData.append("social_media_icon", img);
      }
      /**
       * End of amodification by yuvraj Sahu on 10-06-2023
       */

      const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
      const response = await saveSocialMediaApi(formData, tenant);
      if (response.msg) {
        Message("Social link saved successfully.", "success");
      } else {
        Message("Something went wrong", "error");
      }
      navigate("/Dashboard");
    } else {
    /**
    * Commeted by Yuvraj Sahu on 12-06-2023
    * Reason - to remove message
    */
      // Message("Please provide valid input", "info");
     /**
     *End of comment
     */
    }
  };

  /**
   * End of code addition by - Yuvraj Sahu on 07-06-2023
   * Reason - created api to save social media. After saving the social media it will redirect to social media page.
   */

  /**
   * Added by - Yuvraj Sahu on 07-06-2023
   * Reason - Method to reset social media form
   */
   /**
     * Uncommeted and added and modified by Yuvraj Sahu on 12-06-2023
     * Reason - to reset the form
     */
  const resetSocialMediaForm = (event) => {
    setSocialMediaName(
      socialMediaObj.social_media_name ? socialMediaObj.social_media_name : ""
    );
    setSocialMediaLink(
      socialMediaObj.social_media_link ? socialMediaObj.social_media_link : ""
    );
    setImg(null);
    /**
     * end of comment by yuvraj Sahu on 12-06-2023
     */
    const error = {
      social_media_name: "",
      social_media_link: "",
    };
    setValidationErrors({ ...validationErrors, ...error });
  };
  /**
   * End of code addition by - Yuvraj Sahu on 07-06-2023.
   * Reason - To reset social media form
   */

  var [errors, setError] = useState([]);

  function validateLogo(text) {
    /**
     * Added and modified by Yuvraj Sahu on 18-06-2023
     * Reason - to add validation when upload big size image
     */
    /** Added by Yuvraj Sahu on 12-06-2023
    * Reason - to show error message
    */
    /**
    * End of addition by Yiuvraj Sahu on 12-06-2023
    */
    // if (imageUrl == "") {
    //   errors = errors.filter((e) => Object.keys(e) != "social_media_icon");
    //   setError(errors);
    // }
    errors = errors.filter(e => Object.keys(e) != "logo")
    if (text.size > 1024 * 200){
      // setError([
      //   ...errors,
      //   { social_media_icon: "Image should be less than 200KB" },
      // ]);
      const error = {
        social_media_icon: "Image should be less than 200KB",
      };
      setValidationErrors({ ...validationErrors, ...error });
    }
    else {
      setImg(text);
      const error = {
        social_media_icon: "",
      };
      setValidationErrors({ ...validationErrors, ...error });
    }
    /**
     * End of addition by Yuvraj Sahu on 18-06-2023
     */
  }

  // --------------- delete confirm ------------------
  /**
   * Commeted by Yuvraj Sahu on 17-06-2023
   * Reason - to remove delete functionality
   */
  /**
   * Added by Yuvraj Sahu on 10-06-2023
   * Reason - to delete the social media data
   */
  // const confirm = async (e) => {
  //   var tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
  //   var response = await deteleSocialMediaApi(tenant, e);
  //   if (response.msg) {
  //     /**
  //      * Commeted by Yuvraj Sahu on 10-06-2023
  //      * Reason - to remove success message
  //      */
  //     // message.success(response.msg);
  //     Message("Social media deleted successfully.", "success");
  //     /**
  //      * End of addition by Yuvraj Sahu on 10-06-2023
  //      */
  //     navigate("/social-media");
  //     // setAllSocialMedia(response.socialData)
  //   } else {
  //     Message("Something went wrong", "error");
  //   }
  // };
  // const cancel = (e) => {
  //   /**
  //    * Commeted by Yuvraj Sahu on 10-06-2023
  //    * Reason - to remove success message
  //    */
  //   // message.error("not delete");
  //   /**
  //    * End of addition by Yuvraj Sahu on 10-06-2023
  //    */
  // };
  /**
   * End of addition by Yuvraj Sahu on 17-06-2023
   */
  /**
   * End of delete social media data by Yuvraj Sahu on 10-06-2023
   */
  // --------------- End delete confirm --------------

  return (
    <Header>
      <div className={style.container}>
        <div className={style.titleContainer}>
          {/* <div className={style.backButton}><BiArrowBack style={{width:"30px",height:"30px"}}/></div> */}
          <div className={style.pageTitle}>Social Media</div>
        </div>
        <form className={style.settingSection}>
          <div className={style.formContainer}>
            <div className={`${style.sectionInsideForm}`}>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>&nbsp;&nbsp;Social media name</div>
                  <input
                    className={`${style.textInputBox}`}
                    type="text"
                    // name="gstin"
                    name="social_media_name"
                    style={{ width: "200px" }}
                    // value={gstin}
                    value={socialMediaName}
                    // Commeted by Yuvraj Sahu on 11-06-2023
                    // Reason - to set max length of social media name
                    maxLength={255}
                    // End of addition by Yuvraj Sahu on 11-06-2023
                    onChange={(e) => {
                      setSocialMediaName(e.target.value);
                      validateOnInput("social_media_name", e.target.value);
                    }}
                    onBlur={(e) => {
                      validateOnBlur("social_media_name", e.target.value);
                    }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {validationErrors.social_media_name}
                </div>
              </div>

              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>
                  <span style={{color: "red"}}>*</span> Social media link
                  </div>
                  <input
                    className={`${style.textInputBox}`}
                    type="text"
                    // name="gstin"
                    name="social_media_link"
                    style={{ width: "200px" }}
                    // value={gstin}
                    value={socialMediaLink}
                    onChange={(e) => {
                      setSocialMediaLink(e.target.value);
                      validateOnInput("social_media_link", e.target.value);
                    }}
                    onBlur={(e) => {
                      validateOnBlur("social_media_link", e.target.value);
                    }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {validationErrors.social_media_link}
                </div>
              </div>

              <div className={style.fullInputContainer}>
                <label htmlFor="Name" className={`${style.inputLabel}`}>
                  <span style={{color: "red"}}>*</span> Social media icon
                </label>
                {id != 0 && (
                  <div className={style.defaultImageContainer}>
                    Current : &nbsp;
                    <a
                      href={config.staticBaseURL + imageUrl}
                      target="_blank"
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "150px",
                      }}
                    >
                      {/* <img
                        src={config.staticBaseURL + imageUrl}
                        className={style.socialIcon}
                      /> */}
                      {"  " + imageUrl.split("/")[4]}
                    </a>
                  </div>
                )}
                <FileUploader
                  name="social_media_icon"
                  types={fileTypes}
                  id="social_media_icon"
                  style={{ width: "100%", position: "unset" }}
                  handleChange={validateLogo}
                  classes={style.DYXVr}
                />
                {/* Commeted and added by Yuvraj Sahu on 12-06-2023
                   Reason - to show image validation message */}
                {/* {errors.filter((e) => Object.keys(e)[0] == "social_media_icon")
                  .length > 0 ? (
                  <span className={style.errorText}>
                    {
                      errors.filter(
                        (e) => Object.keys(e)[0] == "social_media_icon"
                      )[0].social_media_icon
                    }
                  </span>
                ) : null} */}
                <div className={`${style.inputImageErrorArea}`}>
                  {validationErrors.social_media_icon}
                  {/* {errors.social_media_icon} */}
                </div>
                {/* End of addition by Yuvraj Sahu on 12-06-2023 */}
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
                navigate("/Dashboard");
              }}
            >
              Back
            </div>

            <div
              className={` ${style.cancelButton}`}
              style={{
                marginRight: "10px",
              }}
              // Modification by Yuvraj Sahu on 12-06-2023
              // Reason - to change the lable and rename
              onClick={(e) => {
                resetSocialMediaForm();
              }}
            >
              Clear
            </div>

            <div
              className={` ${style.proceedButton}`}
              onClick={() => saveSocialMedia()}
              // End of addition by yuvraj Sahu on 12-06-2023
            >
              Save
            </div>
            {/* Added by Yuvraj Sahu on 10-06-2023
            Reason - to delete the social media */}
            {/* Commeted by Yuvraj Sahu on 17-06-2023
            Reason - to remove delete button */}
            {/* {id != 0 && (
              <Popconfirm
                title="Are you sure you want to delete"
                // description="Are you sure you want to delete"
                onConfirm={() => confirm(id)}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <div className={`${style.deleteButton}`}>Delete</div>
              </Popconfirm>
            )} */}
                {/* End of addition by Yuvraj Sahu on 17-06-2023 */}
            {/* End of addition by Yuvraj Sahu on 10-06-2023 */}
          </div>
        </form>
      </div>
    </Header>
  );
}
export default SocialMediaForm;
