import { useEffect } from "react";
import { explainFailure } from "../../../../http/http_client";
import { homePath } from "../../../../plans";
import style from "../style/socialMediaForm.module.css";
import Header from "../../../../components/Header/Header";
import {
  deleteSocialLink,
  loadSettings,
  loadSocialLinks,
  saveSettings,
  saveSocialLink,
} from "../../services/socialMediaService";
import { useApp } from "../../../../Context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FileUploader } from "react-drag-drop-files";
import config from "../../../../config/config";
import { useSocialMediaFormState } from "../../usestate/socialMediaFormState";
const fileTypes = ["JPG", "PNG", "SVG", "GIF"];

function SocialMediaForm(props) {
  const { Message, enableHeader } = useApp();
  const navigate = useNavigate();

  const { state } = useLocation();
  const embedded = Boolean(props.embedded);
  const id = embedded ? (props.recordId || 0) : ((state || { id: 0 }).id);
  const finish = () => {
    if (embedded && props.onSaved) props.onSaved();
    else navigate(homePath());
  };
  const back = () => {
    if (embedded && props.onClose) props.onClose();
    else navigate(homePath());
  };

  var {
    socialMediaObj,
    setSocialMediaObj,
    themeList,
    setThemeList,
    socialMediaName,
    setSocialMediaName,
    socialMediaLink,
    setSocialMediaLink,
    imageUrl,
    setImageUrl,
    validationErrors,
    setValidationErrors,
    img,
    setImg,
    errors,
    setError,
  } = useSocialMediaFormState();

  useEffect(() => {
    if (!embedded) enableHeader();
    if (embedded && props.record) {
      const row = props.record;
      setSocialMediaObj(row);
      setSocialMediaName(row.social_media_name || "");
      setSocialMediaLink(row.social_media_link || "");
      setImageUrl(row.social_media_icon || "");
      return;
    }
    if (!embedded) getSocialMediaData();
  }, [id, embedded]);

  const getSocialMediaData = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await loadSocialLinks(tenant);
    if (response.msg) {
      if (id != 0) {
        var filterSocialMediaObj = response.social.filter(
          (dt) => dt.id == id
        )[0];
        setSocialMediaObj(filterSocialMediaObj);
        setSocialMediaName(filterSocialMediaObj.social_media_name || "");
        setSocialMediaLink(filterSocialMediaObj.social_media_link || "");
        setImageUrl(filterSocialMediaObj.social_media_icon || "");
      }
    }
  };

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
    }

    if (inputName == "social_media_link") {
      if (value.toString().length > 0) {
        const error = {
          social_media_name: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      } else {
        const error = {
          social_media_link: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }
  };

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
          social_media_link: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }
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
  };

  const saveSocialMedia = async () => {
    var allowDataPost = false;
    var socialMediaNameValue =
      document.getElementsByName("social_media_name")[0].value;

    var socialMediaLinkValue =
      document.getElementsByName("social_media_link")[0].value;

    validateOnInput("social_media_name", socialMediaNameValue);

    if (socialMediaLinkValue == "") {
      setValidationErrors({ ...validationErrors, social_media_link: "Social media link is required!" });
    }

    if (id != 0) {
      if (socialMediaLinkValue == "" || validationErrors.social_media_icon != "") {
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
    }

    if (allowDataPost) {
      const formData = new FormData();
      if (id != 0) {
        formData.append("id", id);
      }
      formData.append("social_media_name", socialMediaName);
      formData.append("social_media_link", socialMediaLink);

      if (img != null) {
        formData.append("social_media_icon", img);
      }

      const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
      const response = await saveSocialLink(formData, tenant);
      if (response.msg) {
        Message("Social link saved successfully.", "success");
      } else {
        Message(explainFailure(response, "The social link was not saved."), "error");
      }
      finish();
    } else {
    }
  };

  const resetSocialMediaForm = (event) => {
    setSocialMediaName(
      socialMediaObj.social_media_name ? socialMediaObj.social_media_name : ""
    );
    setSocialMediaLink(
      socialMediaObj.social_media_link ? socialMediaObj.social_media_link : ""
    );
    setImg(null);
    const error = {
      social_media_name: "",
      social_media_link: "",
    };
    setValidationErrors({ ...validationErrors, ...error });
  };

  function validateLogo(text) {
    errors = errors.filter(e => Object.keys(e) != "logo")
    if (text.size > 1024 * 200){
      const error = {
        social_media_icon: "Image should be less than 200KB",
      };
      setValidationErrors({ ...validationErrors, ...error });
    }
    else {
      if (text.name.toString().length > 65) {
        const error = {
          social_media_icon: "Image name should be short",
        };
        setValidationErrors({ ...validationErrors, ...error });
      } else {
        setImg(text);
        const error = {
          social_media_icon: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }
  }

  return (
      <div className={style.container}>
        <div className={style.titleContainer}>
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
                    name="social_media_name"
                    style={{ width: "200px" }}
                    value={socialMediaName}
                    maxLength={255}
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
                    name="social_media_link"
                    style={{ width: "200px" }}
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
                      {"  " + ((imageUrl || "").split("/")[4] || "")}
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
                <div className={`${style.inputImageErrorArea}`}>
                  {validationErrors.social_media_icon}
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
                back();
              }}
            >
              Back
            </div>

            <div
              className={` ${style.cancelButton}`}
              style={{
                marginRight: "10px",
              }}
              onClick={(e) => {
                resetSocialMediaForm();
              }}
            >
              Clear
            </div>

            <div
              className={` ${style.proceedButton}`}
              onClick={() => saveSocialMedia()}
            >
              Save
            </div>
          </div>
        </form>
      </div>
  );
}
export default SocialMediaForm;
