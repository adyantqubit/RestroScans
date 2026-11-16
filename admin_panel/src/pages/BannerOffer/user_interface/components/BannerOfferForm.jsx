import { useContext, useEffect } from "react";
import { explainFailure } from "../../../../http/http_client";
import style from "../style/banneroffer.module.css";
import Header from "../../../../components/Header/Header";
import { loadOffer, saveOffer as persistOffer } from "../../services/bannerOfferService";
import { useApp } from "../../../../Context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../../../config/config";
import { AiOutlineClose } from "react-icons/ai";
import { GlobalContext } from "../../../../Context/Context";
import { useBannerOfferFormState } from "../../usestate/bannerOfferFormState";
import {
  checkIfGreaterThanMaxLength,
  checkIfSmallerThanMinLength,
  checkIsEmpty,
  checkIsNotADigit,
  checkIsNotZero,
} from "../../../../components/Validation/Validation";
function BannerOfferForm(props) {
  const { Message, enableHeader } = useApp();
  var { showOfferForm, setShowOfferForm, disabled, setDisabled } =
    useContext(GlobalContext);
  const navigate = useNavigate();
  const location = useLocation();

  var {
    categoryData,
    setCategoryData,
    name,
    setName,
    isActive,
    setIsActive,
    selectedImage,
    setSelectedImage,
    menuList,
    setMenuList,
    menu,
    setMenu,
    offerDetails,
    setOfferDetails,
    offerId,
    setOfferId,
    discount,
    setDiscount,
    showVideo,
    setShowVideo,
    offerName,
    setOfferName,
    offerImage,
    setOfferImage,
    videoLink,
    setvideoLink,
    selectedOfferImage,
    setSelectedOfferImage,
    icon,
    setIcon,
    nameError,
    setNameError,
    iconError,
    setIconError,
    offerDataCount,
    setOfferDataCount,
    showOffer,
    setShowOffer,
    validationErrors,
    setValidationErrors,
    menuName,
    setMenuName,
    defaultValueData,
    setDefaultValueData,
  } = useBannerOfferFormState();

  var defalutMenu = { label: null, value: null };
  var b;

  useEffect(() => {
    enableHeader();

    window.scrollTo(0, 0);

    if (props.id != null) {
      setOfferId(props.id);
    }
  }, []);

  useEffect(() => {
    if (offerId) {
      getOfferData();
    }
  }, [offerId]);

  const getMenus = async () => {
  };

  const getOfferData = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await loadOffer(tenant, offerId);
    if (response.offer) {
      setOfferDetails(response.offer);
      setOfferId(response.offer.id);
      setOfferName(response.offer.offer_name);
      setDiscount(response.offer.discount);
      setIcon(response.offer.offer_image);
      setvideoLink(response.offer.video_link);
      setShowVideo(response.offer.show_video_Hide_Image);
      setOfferDataCount(response.offerBannerCount);
      setShowOffer(response.offer.is_active);
    }
  };

  const validateOnBlur = (inputName, value) => {
    if (inputName == "name") {
      var flag = checkIsEmpty(value);
      if (flag) {
        setValidationErrors((previousList) => {
          previousList.name = "Please enter name";
          return { ...previousList };
        });
      } else {
        setValidationErrors((previousList) => {
          previousList.name = "";
          return { ...previousList };
        });
      }
    }

    if (inputName == "discount") {
      var flag = checkIsEmpty(value);
      if (flag) {
        setValidationErrors((previousList) => {
          previousList.discount = "Please enter discount";
          return { ...previousList };
        });
        return flag;
      } else {
        // omm

        flag = checkIfGreaterThanMaxLength(value, 2);
        if (flag) {
          setValidationErrors((previousList) => {
            previousList.discount = "Discount can't be greater than 99";
            return { ...previousList };
          });
          return flag;
        } else {
          flag = checkIsNotADigit(value);
          if (flag) {
            setValidationErrors((previousList) => {
              previousList.discount = "Discount must be digits only";
              return { ...previousList };
            });
            return flag;
          } else {
            setValidationErrors((previousList) => {
              previousList.discount = "";
              return { ...previousList };
            });
            return flag;
          }
        }
      }
    }

    if (inputName == "video_link") {
      var flag = checkIsEmpty(value);
      if (flag) {
        setValidationErrors((previousList) => {
          previousList.video_link = "Please enter video link";
          return { ...previousList };
        });
      } else {
        setValidationErrors((previousList) => {
          previousList.video_link = "";
          return { ...previousList };
        });
      }
    }
  };

  const validateOnInput = (inputName, value) => {
    if (inputName == "name") {
      if (value != null || value != undefined || value.trim() != "") {
        setNameError("");
      }
    }
  };

  const validateOnFileInput = (inputName, value) => {
    if (value != null && value != undefined) {
      if (value.size / 1024 > 40 * 1024) {
        setIconError("Image must be smaller than 40 MB before automatic compression");
      } else {
        setIconError("");
      }
    } else {
      setIconError("uuu");
    }
  };

  const handleMenuChange = (value) => {
    setMenu(value);
    const error = {
      menu: "",
    };
    setValidationErrors({ ...validationErrors, ...error });
  };

  const newArrayOfObj = menuList.map(({ name: label, id: value, ...rest }) => ({
    label,
    value,
    ...rest,
  }));

  const validateOnSubmit = () => {
    validateOnBlur("name", offerName);
    validateOnBlur("discount", discount);
  };

  const saveOffer = async () => {
    var allowDataPost = false;

    validateOnSubmit();

    if (
      offerName != "" &&
      validateOnBlur("discount", discount) == false &&
      iconError == ""
    ) {
      allowDataPost = true;
    }

    if (allowDataPost) {
      const updatedOfferData = new FormData();
      if (offerId) {
        updatedOfferData.append("id", offerId);
      }
      updatedOfferData.append("offer_name", offerName);
      updatedOfferData.append("discount", discount);
      if (offerImage != "" && offerImage != undefined) {
        updatedOfferData.append("offer_image", offerImage);
      }
      updatedOfferData.append("video_link", videoLink);
      updatedOfferData.append("show_video_Hide_Image", showVideo);
      updatedOfferData.append("is_active", showOffer);
      const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
      const response = await persistOffer(tenant, updatedOfferData);
      props.setBackendOfferBannerCount(response.offerBannerCount);

      if (response.msg) {
        Message("Offer saved successfully.", "success");
        ((document.getElementById("offer_form") || { style: {} }).style.display = "none");
        setShowOfferForm(false);
        setDisabled(false);

        var index = props.dataList.findIndex((e) => e.id == response.data.id);
        if (index == -1) {
          if (props.dataList.length >= props.listPerPage) {
            props.dataList.pop();
          }
          props.setData([response.data, ...props.dataList]);
        } else {
          props.dataList[index] = response.data;
          props.setData([...props.dataList]);
        }
      } else {
        Message(explainFailure(response, "This offer was not saved."), "error");
      }
    } else {
    }
  };

  const removeOfferFormDiv = () => {
    ((document.getElementById("offer_form") || { style: {} }).style.display = "none");
    setShowOfferForm(false);
    setDisabled(false);
    window.scroll(0, 0);
  };
  const resetOfferForm = (event) => {
    setOfferName(offerDetails.offer_name ? offerDetails.offer_name : "");
    setDiscount(offerDetails.discount ? offerDetails.discount : "");
    setIcon(offerDetails.offer_image ? offerDetails.offer_image : null);

    setvideoLink(offerDetails.video_link ? offerDetails.video_link : "");
    setShowVideo(
      offerDetails.show_video_Hide_Image == false ||
        offerDetails.show_video_Hide_Image == true
        ? offerDetails.show_video_Hide_Image
        : false
    );
    setShowOffer(
      offerDetails.is_active == true || offerDetails.is_active == false
        ? offerDetails.is_active
        : true
    );

    setSelectedOfferImage(null);
    setOfferImage(null);

    document.getElementById("icon").value = "";
    setIconError("");
    setValidationErrors("");
    const error = {
      name: "",
      discount: "",
      icon: "",
      video_link: "",
      is_active: "",
    };
    setValidationErrors({ ...validationErrors, ...error });
  };

  return (
    <div id="offer_form">
      <div className={style.offerFormContainer}>
        <div className={style.titleContainer}>
          <div className={style.pageTitle}>Offer form</div>
        </div>
        <div>
          <div style={{ float: "right" }}>
            <AiOutlineClose
              color="black"
              size={20}
              style={{
                border: "1px dotted green",
                borderRadius: "100px",
                cursor: "pointer",
                height: "22px",
                width: "22px",
              }}
              onClick={(e) => {
                removeOfferFormDiv();
              }}
            />
          </div>
          <form className={style.menuSection}>
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
                        if (e.target.value) validateOnBlur("name", e.target.value.toString());
                      }}
                      maxLength={30}
                    />
                  </div>
                  <div className={`${style.inputErrorArea}`}>
                    {validationErrors.name}
                  </div>
                </div>

                <div className={`${style.inputContainer}`}>
                  <div className={`${style.inputArea}`}>
                    <div className={`${style.inputLabel}`}>
                      <span className={style.mendatoryField}>* </span>
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
                        if (e.target.value) validateOnBlur("discount", e.target.value.toString());
                      }}
                      onKeyDown={(evt) => {
                        if (
                          (evt.which != 8 &&
                            evt.which != 9 &&
                            evt.which != 0 &&
                            evt.which < 48) ||
                          evt.which > 57
                        ) {
                          evt.preventDefault();
                        }
                      }}
                      maxLength={10}
                    />
                  </div>
                  <div className={`${style.inputErrorArea}`}>
                    {validationErrors.discount}
                  </div>
                </div>

                <div className={`${style.inputContainer}`}>
                  <div className={`${style.inputArea}`}>
                    <div className={`${style.inputLabel}`}>
                      <span className={style.optionalField}>* </span>Image
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
                      Select new image
                    </div>

                    <input
                      className={`${style.textInputBox} ${style.textInputBoxImage}`}
                      type="file"
                      name="icon"
                      id="icon"
                      accept="image/png,image/jpg,image/jpeg"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          setSelectedOfferImage(e.target.files[0].name);
                          setOfferImage(e.target.files[0]);
                          validateOnFileInput("icon", e.target.files[0]);

                          validateOnBlur("icon", e.target.value);
                        }
                      }}
                    />
                  </div>

                  <div className={`${style.inputErrorArea}`}>
                    <p>{iconError}</p>
                  </div>
                  <div
                    className={`${style.inputErrorArea2}`}
                    style={{ color: "blue", fontSize: "12px" }}
                  >
                    <p>"Image should be in landscape format"</p>
                  </div>
                </div>

                <div className={`${style.inputContainer}`}>
                  <div className={`${style.inputArea}`}>
                    <div className={`${style.inputLabel}`}>
                      <span className={style.optionalField}>*</span>
                      Video link
                    </div>
                    <textarea
                      className={`${style.textInputBox}`}
                      name="video_link"
                      value={videoLink}
                      style={{
                        width: "280px",
                        height: "100px",
                        resize: "none",
                      }}
                      onChange={(e) => {
                        setvideoLink(e.target.value);
                      }}
                      maxLength={2000}
                    />
                  </div>
                  <div className={`${style.inputErrorArea}`}>
                  </div>
                </div>
                {videoLink != "" ? (
                  <div className={`${style.inputContainer}`}>
                    <div className={`${style.inputArea}`}>
                      <div
                        className={`${style.inputLabel} ${style.inputLabel2}`}
                      >
                        <span className={style.optionalField}>*</span>Show video
                      </div>
                      <input
                        className={`${style.textInputBox}`}
                        type="checkbox"
                        name="show_video_Hide_Image"
                        style={{
                          width: "18px",
                          height: "18px",
                        }}
                        checked={showVideo}
                        onChange={(e) => {
                          setShowVideo(e.target.checked);
                        }}
                      />
                    </div>
                    <div className={`${style.inputErrorArea}`}>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div className={`${style.inputContainer}`}>
                  <div className={`${style.inputArea}`}>
                    <div
                      className={`${style.inputLabel} ${style.inputLabel2}`}
                    >
                      <span className={style.optionalField}>*</span>Active
                    </div>
                    <input
                      className={`${style.textInputBox}`}
                      type="checkbox"
                      name="is_active"
                      style={{
                        width: "18px",
                        height: "18px",
                      }}
                      checked={showOffer}
                      onChange={(e) => {
                        setShowOffer(e.target.checked);
                      }}
                    />
                  </div>
                  <div className={`${style.inputErrorArea}`}>
                  </div>
                </div>
              </div>
            </div>

            <div className={style.actionContainer}>

              <div
                className={` ${style.cancelButton}`}
                style={{
                  marginRight: "10px",
                }}
                onClick={(e) => {
                  resetOfferForm();
                  window.scrollTo(0, 0);
                }}
              >
                Clear
              </div>
              <div
                className={` ${style.proceedButton}`}
                onClick={() => {
                  saveOffer();
                  window.scrollTo(0, 0);
                }}
              >
                Save
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
export default BannerOfferForm;
