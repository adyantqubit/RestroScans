/**
 * Added by - Ashish Dewangan on 02-06-2023
 * Reason - created form to get user input for his setting details
 */
import { useEffect, useState } from "react";
import style from "./settingForm.module.css";
import Header from "../GlobalComponent/Header";
import { getSettingsDetails, postSettingsDetails } from "../../Api/services";
import { Message, enableHeader } from "../../App";
import { useNavigate } from "react-router-dom";

function SettingForm() {
  const navigate = useNavigate();
  const [settingData, setSettingData] = useState({});
  const [settingId, setSettingId] = useState(null);
  const [themeList, setThemeList] = useState([]);
  const [appTheme, setAppTheme] = useState(null);
  const [cgst, setCgst] = useState(null);
  const [sgst, setSgst] = useState(null);
  const [gstin, setGstin] = useState(null);
  const [fssaiNumber, setFssaiNumber] = useState(null);
  const [allowHalfPrice, setAllowHalfPrice] = useState(false);
  const [allowLoyalityPoints, setAllowLoyalityPoints] = useState(false);
  const [perLoyalityPointValue, setPerLoyalityPointValue] = useState(null);
  const [amountForSingleLoyalityPoint, setAmountForSingleLoyalityPoint] =
    useState(null);
  const [whatsappNumber, setWhatsappNumber] = useState(null);

  /**
   * Added by - Ashlekh on 09-09-2023
   * Reason - To have discount
   */
  const [discount, setDiscount] = useState(null);
  /**
   * End of code addition by - Ashlekh on 09-09-2023
   * Reason - To have discount
   */

  const [validationErrors, setValidationErrors] = useState({
    app_theme: "",
    cgst: "",
    sgst: "",
    gstin: "",
    fssaino: "",
    allow_half_price: "",
    allow_loyality_points: "",
    // Commented by Om Shrivastava on 23-07-23
    // Reason : Add validation for single loyality point
    // per_loyality_point_value: "",
    // End of Commented code by Om Shrivastava on 23-07-23
    // Reason : Add validation for single loyality point 
    amount_for_single_loyality_point: "",
    whatsapp_number: "",
  });

  // Added by Om Shrivastava on 23-07-23
  // Reason : Add validation for single loyality point
  const [singleLoyalityPointValidation, setSingleLoyalityPointValidation] = useState("")
  // End of addition by Om Shrivastava on 23-07-23
  // Reason : Add validation for single loyality point 

  /**
   * Added by - Ashish Dewangan on 02-06-2023
   * Reason - method that will execute when page loads and then call api
   */
  useEffect(() => {
    // Added By Rohan Kansari - 25/6/23
    // Reason - To enable headerSiderbar
    enableHeader()
    // End of code - Rohan kansari - 25/6/23
    getSettingData();
  }, []);
  /**
   * End of code addition by - Ashish Dewangan on 02-06-2023
   * Reason - method that will execute when page loads and then call api
   */

  /**
   * Added by - Ashish Dewangan on 02-06-2023
   * Reason - created api that will get setting data
   */
  const getSettingData = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await getSettingsDetails(tenant);
    if (response.setting) {
      setSettingData(response.setting);
      setSettingId(response.setting.id);
      setCgst(response.setting.cgst);
      setSgst(response.setting.sgst);
      setGstin(response.setting.gstin);
      setFssaiNumber(response.setting.fssaino);
      setAllowHalfPrice(response.setting.allow_half_price);
      setAllowLoyalityPoints(response.setting.allow_loyality_points);
      setPerLoyalityPointValue(response.setting.per_loyality_point_value);
      setAmountForSingleLoyalityPoint(
        response.setting.amount_for_single_loyality_point
      );
      /**
       * Added by - Ashlekh on 10-09-2023
       * Reason - To add discount
       */
      setDiscount(response.setting.discount_in);
      /**
       * End of code addition by - Ashlekh on 10-09-2023
       * Reason - To add discount
       */
      setWhatsappNumber(response.setting.whatsapp_number);
      setAppTheme(response.setting.app_theme);
    }
    setThemeList(response.themeOptions);
  };
  /**
   * End of code addition by - Ashish Dewangan on 02-06-2023
   * Reason - created api that will get setting data
   */

  /**
   * Added by - Ashish Dewangan on 04-06-2023
   * Reason -  method to validate inputs when input is focused out
   */
  const validateOnBlur = (inputName, value) => {
    if (inputName == "cgst") {
      if (value.toString().length > 0) {
        if (!isNaN(value)) {
          if (value <= 0 || value >= 100) {
            const error = {
              cgst: "CGST value must be greater than 0 and less than 100",
            };
            setValidationErrors({ ...validationErrors, ...error });
          } else {
            const error = {
              cgst: "",
            };
            setValidationErrors({ ...validationErrors, ...error });
          }
        } else {
          const error = {
            cgst: "CGST must be a number",
          };
          setValidationErrors({ ...validationErrors, ...error });
        }
      } else {
        const error = {
          cgst: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }

    if (inputName == "sgst") {
      if (value.toString().length > 0) {
        if (!isNaN(value)) {
          if (value <= 0 || value >= 100) {
            const error = {
              sgst: "SGST value must be greater than 0 and less than 100",
            };
            setValidationErrors({ ...validationErrors, ...error });
          } else {
            const error = {
              sgst: "",
            };
            setValidationErrors({ ...validationErrors, ...error });
          }
        } else {
          const error = {
            sgst: "SGST must be a number",
          };
          setValidationErrors({ ...validationErrors, ...error });
        }
      } else {
        const error = {
          sgst: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }

    if (inputName == "gstin") {
      if (value.toString().length > 0) {
        if (value.toString().length != 15) {
          const error = {
            gstin: "GSTIN must be 15 characters long",
          };
          setValidationErrors({ ...validationErrors, ...error });
        } else {
          const error = {
            gstin: "",
          };
          setValidationErrors({ ...validationErrors, ...error });
        }
      } else {
        const error = {
          gstin: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }

    if (inputName == "fssaino") {
      if (value.toString().length > 0) {
        if (value.toString().length != 14) {
          const error = {
            fssaino: "FSSAI number must be 14 characters long",
          };
          setValidationErrors({ ...validationErrors, ...error });
        } else {
          const error = {
            fssaino: "",
          };
          setValidationErrors({ ...validationErrors, ...error });
        }
      } else {
        const error = {
          fssaino: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }

    if (inputName == "per_loyality_point_value") {
      if (value.toString().length > 0) {
        if (!isNaN(value)) {
          if (value <= 0) {
            // Modification and addition by Om Shrivasstava on 23-07-23
            // Reason : Set the validation for per loyality point
            // const error = {
            //   per_loyality_point_value:
            //     "Value for this field must be greater than 0",
            // };
            // setValidationErrors({ ...validationErrors, ...error });
            setSingleLoyalityPointValidation("Value for this field must be greater than 0. ");
            // End of  Modification and addition by Om Shrivasstava on 23-07-23
            // Reason : Set the validation for per loyality point
          } else {
            // Modification and addition by Om Shrivasstava on 23-07-23
            // Reason : Set the validation for per loyality point
            // const error = {
            //   per_loyality_point_value: "",
            // };
            // setValidationErrors({ ...validationErrors, ...error });
            setSingleLoyalityPointValidation("");
            // End of  Modification and addition by Om Shrivasstava on 23-07-23
            // Reason : Set the validation for per loyality point
          }
        } else {
          // Modification and addition by Om Shrivasstava on 23-07-23
          // Reason : Set the validation for per loyality point
          // const error = {
          //   per_loyality_point_value: "Value for this field must be a number",
          // };
          // setValidationErrors({ ...validationErrors, ...error });
          setSingleLoyalityPointValidation("Value for this field must be a number");
          // End of  Modification and addition by Om Shrivasstava on 23-07-23
          // Reason : Set the validation for per loyality point
        }
      } else {
        // Modification and addition by Om Shrivasstava on 23-07-23
        // Reason : Set the validation for per loyality point
        // const error = {
        //   per_loyality_point_value: "",
        // };
        // setValidationErrors({ ...validationErrors, ...error });
        setSingleLoyalityPointValidation("");
        // End of  Modification and addition by Om Shrivasstava on 23-07-23
        // Reason : Set the validation for per loyality point
      }
    }

    if (inputName == "amount_for_single_loyality_point") {
      if (value.toString().length > 0) {
        if (!isNaN(value)) {
          if (value <= 0) {
            const error = {
              amount_for_single_loyality_point:
                "Value for this field must be greater than 0",
            };
            setValidationErrors({ ...validationErrors, ...error });
          } else {
            const error = {
              amount_for_single_loyality_point: "",
            };
            setValidationErrors({ ...validationErrors, ...error });
          }
        } else {
          const error = {
            amount_for_single_loyality_point:
              "Value for this field must be a number",
          };
          setValidationErrors({ ...validationErrors, ...error });
        }
      } else {
        const error = {
          amount_for_single_loyality_point: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }

    if (inputName == "whatsapp_number") {
      if (value.toString().length > 0) {
        if (!isNaN(value)) {
          if (value.toString().length != 10) {
            const error = {
              whatsapp_number: "Whatsapp number must be 10 digits long",
            };
            setValidationErrors({ ...validationErrors, ...error });
          } else {
            const error = {
              whatsapp_number: "",
            };
            setValidationErrors({ ...validationErrors, ...error });
          }
        } else {
          const error = {
            whatsapp_number: "Whatsapp number must be digits only",
          };
          setValidationErrors({ ...validationErrors, ...error });
        }
      } else {
        const error = {
          whatsapp_number: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }
  };
  /**
   * End of code addition by - Ashish Dewangan on 04-06-2023
   * Reason -  method to validate inputs when input is focused out
   */

  /**
   * Added by - Ashish Dewangan on 02-06-2023
   * Reason - method to validate inputs when user is entering some data
   */
  const validateOnInput = (inputName, value) => {
    if (inputName == "cgst") {
      if (value.toString().length > 0) {
        if (isNaN(value)) {
          const error = {
            cgst: "CGST must be a number",
          };
          setValidationErrors({ ...validationErrors, ...error });
        } else {
          const error = {
            cgst: "",
          };
          setValidationErrors({ ...validationErrors, ...error });
        }
      } else {
        const error = {
          cgst: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }

    if (inputName == "sgst") {
      if (value.toString().length > 0) {
        if (isNaN(value)) {
          const error = {
            sgst: "SGST must be a number",
          };
          setValidationErrors({ ...validationErrors, ...error });
        } else {
          const error = {
            sgst: "",
          };
          setValidationErrors({ ...validationErrors, ...error });
        }
      } else {
        const error = {
          sgst: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }

    if (inputName == "per_loyality_point_value") {
      if (value.toString().length > 0) {
        if (isNaN(value)) {
          {/* // Added by Om Shrivastava on 23-07-23
          // Reason : Add validation for single loyality point */}
          // const error = {
          //   per_loyality_point_value: "Value for this field must be a number",
          // };
          // setValidationErrors({ ...validationErrors, ...error });
          setSingleLoyalityPointValidation("Value for this field must be a number")
           // End of addition by Om Shrivastava on 23-07-23
          // Reason : Add validation for single loyality point 
        } else {
          {/* // Added by Om Shrivastava on 23-07-23
          // Reason : Add validation for single loyality point */}
          // const error = {
          //   per_loyality_point_value: "",
          // };
          // setValidationErrors({ ...validationErrors, ...error });
          setSingleLoyalityPointValidation("")
          // End of addition by Om Shrivastava on 23-07-23
          // Reason : Add validation for single loyality point 
        }
      } else {
        {/* // Added by Om Shrivastava on 23-07-23
        // Reason : Add validation for single loyality point */}
        // const error = {
        //   per_loyality_point_value: "",
        // };
        // setValidationErrors({ ...validationErrors, ...error });
        setSingleLoyalityPointValidation("")
        // End of addition by Om Shrivastava on 23-07-23
        // Reason : Add validation for single loyality point 
      }
    }

    if (inputName == "amount_for_single_loyality_point") {
      if (value.toString().length > 0) {
        if (isNaN(value)) {
          const error = {
            amount_for_single_loyality_point:
              "Value for this field must be a number",
          };
          setValidationErrors({ ...validationErrors, ...error });
        } else {
          const error = {
            amount_for_single_loyality_point: "",
          };
          setValidationErrors({ ...validationErrors, ...error });
        }
      } else {
        const error = {
          amount_for_single_loyality_point: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }

    if (inputName == "whatsapp_number") {
      if (value.toString().length > 0) {
        if (isNaN(value)) {
          const error = {
            whatsapp_number: "Whatsapp number must be digits only",
          };
          setValidationErrors({ ...validationErrors, ...error });
        } else {
          const error = {
            whatsapp_number: "",
          };
          setValidationErrors({ ...validationErrors, ...error });
        }
      } else {
        const error = {
          whatsapp_number: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }
  };
  /**
   * End of code addition by - Ashish Dewangan on 02-06-2023
   * Reason -  method to validate inputs when user is entering some data
   */

  /**
   * Added by - Ashish Dewangan on 02-06-2023
   * Reason - created api to save settings. After saving the setting it will redirect to setting page.
   */
  const saveSettings = async () => {
    var allowDataPost = false;
    if (
      validationErrors.cgst != "" ||
      validationErrors.sgst != "" ||
      validationErrors.gstin != "" ||
      validationErrors.fssaino != "" ||
      validationErrors.allow_half_price != "" ||
      // Commented by Om Shrivastava on 23-07-23 
      // Reason : Set the validation for loyality fields
      // validationErrors.allow_loyality_points != "" ||

      // validationErrors.per_loyality_point_value != "" ||
      // singleLoyalityPointValidation!= "" ||

      // validationErrors.amount_for_single_loyality_point != "" ||
      // End of Commented by Om Shrivastava on 23-07-23 
      // Reason : Set the validation for loyality fields
      validationErrors.app_theme != "" ||
      validationErrors.whatsapp_number != ""

    ) {
      allowDataPost = false;
    } else {
      /**
       * if(check if error are present in mendatory fields){
       * //error
       *  allowDataPost=false;
       * }
       * else{
       *  //no error
       *  allowDataPost=true; 
       * }
       */

      // Added by Om Shrivastava on 23-07-23
      // Reason : Add validation for single loyality point
      if (allowLoyalityPoints == true) {
        if (perLoyalityPointValue <= 0) {
          setSingleLoyalityPointValidation('Please enter single loyality point')
          allowDataPost = false
        }
        else{ 
            if (amountForSingleLoyalityPoint <= 0) {
              const error = {
                amount_for_single_loyality_point:
                  "Please enter calculation amount",
              };
              setValidationErrors({ ...validationErrors, ...error });
              allowDataPost = false
            }
            else {
              const error = {
                amount_for_single_loyality_point: "",
              };
              setValidationErrors({ ...validationErrors, ...error });

              setSingleLoyalityPointValidation("")
              allowDataPost = true
            }
        }
      }
      else {
        const error = {
          amount_for_single_loyality_point: "",
        };
        setValidationErrors({ ...validationErrors, ...error });

        setSingleLoyalityPointValidation("")
        allowDataPost = true
      }
    }
    // End of addition by Om Shrivastava on 23-07-23
    // Reason : Add validation for single loyality point

    if (allowDataPost) {
      const updatedSettingsData = {
        id: settingId,
        cgst: cgst,
        sgst: sgst,
        gstin: gstin,
        fssaino: fssaiNumber,
        allow_half_price: allowHalfPrice,
        allow_loyality_points: allowLoyalityPoints,
        per_loyality_point_value: perLoyalityPointValue,
        amount_for_single_loyality_point: amountForSingleLoyalityPoint,
        app_theme: appTheme,
        whatsapp_number: whatsappNumber
          ? whatsappNumber.toString().length == 10
            ? "+91" + whatsappNumber
            : whatsappNumber
          /**
           * Modified by - Ashish Dewangan on 05-06-2023
           * Reason - To save empty string rather than null
           */
          // : null,
          : "",
        /**
         * End of code Modification by - Ashish Dewangan on 05-06-2023
         * Reason - To save empty string rather than null
         */
        /**
         * Added by - Ashlekh on 10-09-2023
         * Reason - To add discount
         */
        discount_in: discount,
        /**End of code addition by - Ashlekh on 10-09-2023
         * Reason - To add discount
         */
      };
      const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
      const response = await postSettingsDetails(updatedSettingsData, tenant);
      if (response.msg) {
        Message("Settings saved successfully.", "success");
        /**
         * Added by - Ashish Dewangan on 05-06-2023
         * Reason - To rerender the page based on response
         */
        if (response.setting) {
          setSettingData(response.setting);
          setSettingId(response.setting.id);
          setCgst(response.setting.cgst);
          setSgst(response.setting.sgst);
          setGstin(response.setting.gstin);
          setFssaiNumber(response.setting.fssaino);
          setAllowHalfPrice(response.setting.allow_half_price);
          setAllowLoyalityPoints(response.setting.allow_loyality_points);
          setPerLoyalityPointValue(response.setting.per_loyality_point_value);
          setAmountForSingleLoyalityPoint(
            response.setting.amount_for_single_loyality_point
          );
          setWhatsappNumber(response.setting.whatsapp_number);
          setAppTheme(response.setting.app_theme);
        }
        setThemeList(response.themeOptions);
        /**
         * End of code addition by - Ashish Dewangan on 05-06-2023
         * Reason - To rerender the page based on response
         */

      } else {
        Message("Something went wrong", "error");
      }
      /**
       * Commented by - Ashish Dewangan on 05-06-2023
       * Reason - No need to redirect to dashboard
       */
      //  navigate('/Dashboard')
      /**
       * End of comment by  - Ashish Dewangan on 05-06-2023
       * Reason - No need to redirect to dashboard
       */
    } else {

      // Message("Please provide valid input", "info");

    }
  };
  
  /**
   * End of code addition by - Ashish Dewangan on 02-06-2023
   * Reason - created api to save settings. After saving the setting it will redirect to setting page.
   */

  /**
   * Added by - Ashish Dewangan on 04-06-2023
   * Reason - Method to reset settings form
   */
  const resetSettingsForm = (event) => {
    setCgst(settingData.cgst ? settingData.cgst : "");
    setSgst(settingData.sgst ? settingData.sgst : "");
    setGstin(settingData.gstin ? settingData.gstin : "");
    setFssaiNumber(settingData.fssaino ? settingData.fssaino : "");
    setAllowHalfPrice(
      settingData.allow_half_price ? settingData.allow_half_price : ""
    );
    setAllowLoyalityPoints(
      settingData.allow_loyality_points ? settingData.allow_loyality_points : ""
    );
    setPerLoyalityPointValue(
      settingData.per_loyality_point_value
        ? settingData.per_loyality_point_value
        : ""
    );
    setAmountForSingleLoyalityPoint(
      settingData.amount_for_single_loyality_point
        ? settingData.amount_for_single_loyality_point
        : ""
    );
    setWhatsappNumber(
      settingData.whatsapp_number ? settingData.whatsapp_number : ""
    );
    setAppTheme(settingData.app_theme ? settingData.app_theme : "");

    const error = {
      cgst: "",
      sgst: "",
      gstin: "",
      fssaino: "",
      allow_half_price: "",
      allow_loyality_points: "",
      per_loyality_point_value: "",
      amount_for_single_loyality_point: "",
      whatsapp_number: "",
    };
    setValidationErrors({ ...validationErrors, ...error });

    setSingleLoyalityPointValidation("")

  };
  /**
   * End of code addition by - Ashish Dewangan on 04-06-2023.
   * Reason - To reset settings form
   */

  return (
    // Modified by Rohan Kansari - 25/6/23
    // Reason - removing header from each page and making it global
    // <Header>
    <div className={style.container}>
      <div className={style.titleContainer}>
        {/* <div className={style.backButton}><BiArrowBack style={{width:"30px",height:"30px"}}/></div> */}
        <div className={style.pageTitle}>Settings</div>
      </div>
      <form className={style.settingSection}>
        <div className={style.formContainer}>
          <div className={`${style.sectionInsideForm}`}>
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>App Theme</div>
                <select
                  className={`${style.textInputBox}`}
                  name="app_theme"
                  style={{ width: "200px" }}
                  onChange={(e) => {
                    setAppTheme(e.target.value);
                    validateOnInput("app_theme", e.target.value);
                  }}
                >
                  {themeList.map((data, index) => {
                    return (
                      <option
                        key={index}
                        name={data.id}
                        selected={data.id == appTheme}
                        value={data.id}
                      >
                        {data?.background_color_label} ,{" "}
                        {data.heading_color_label}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationErrors.app_theme}
              </div>
            </div>

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>WhatsApp Number</div>
                <input
                  className={`${style.textInputBox}`}
                  type="text"
                  name="whatsapp_number"
                  value={whatsappNumber}
                  style={{ width: "200px" }}
                  onFocus={(e) => {
                    if (whatsappNumber.length == 13)
                      setWhatsappNumber(whatsappNumber.substring(3, 13))
                  }}
                  onChange={(e) => {
                    setWhatsappNumber(e.target.value);
                    validateOnInput("whatsapp_number", e.target.value);
                  }}
                  onBlur={(e) => {
                    validateOnBlur("whatsapp_number", e.target.value);
                  }}
                  maxLength={10}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationErrors.whatsapp_number}
              </div>
            </div>
          </div>

          <div className={`${style.sectionInsideForm}`}>
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  Allow Loyality Points
                </div>
                <input
                  className={`${style.textInputBox}`}
                  type="checkbox"
                  name="allow_loyality_points"
                  style={{ width: "18px", height: "18px" }}
                  checked={allowLoyalityPoints}
                  onChange={(e) => {
                    setAllowLoyalityPoints(e.target.checked);
                    validateOnInput("allow_loyality_points", e.target.value);
                  }}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationErrors.allow_loyality_points}
              </div>
            </div>

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  Value Of Single Loyality Point (Rs.)
                </div>
                <input
                  className={`${style.textInputBox}`}
                  type="text"
                  name="per_loyality_point_value"
                  style={{ width: "100px" }}
                  value={perLoyalityPointValue}
                  onChange={(e) => {
                    setPerLoyalityPointValue(e.target.value);
                    validateOnInput(
                      "per_loyality_point_value",
                      e.target.value
                    );
                  }}
                  onBlur={(e) => {
                    validateOnBlur(
                      "per_loyality_point_value",
                      e.target.value
                    );
                  }}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {/* // Added by Om Shrivastava on 23-07-23
                // Reason : Add validation for single loyality point */}
                {/* {validationErrors.per_loyality_point_value} */}
                {singleLoyalityPointValidation}
                {/* End of Added by Om Shrivastava on 23-07-23
                // Reason : Add validation for single loyality point */}
              </div>
            </div>

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  Loyality Point Calculation Amount (Rs.)
                </div>
                <input
                  className={`${style.textInputBox}`}
                  type="text"
                  name="amount_for_single_loyality_point"
                  style={{ width: "100px" }}
                  value={amountForSingleLoyalityPoint}
                  onChange={(e) => {
                    setAmountForSingleLoyalityPoint(e.target.value);
                    validateOnInput(
                      "amount_for_single_loyality_point",
                      e.target.value
                    );
                  }}
                  onBlur={(e) => {
                    validateOnBlur(
                      "amount_for_single_loyality_point",
                      e.target.value
                    );
                  }}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationErrors.amount_for_single_loyality_point}
              </div>
            </div>
          </div>

          <div className={`${style.sectionInsideForm}`}>
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>Allow Half Price</div>
                <input
                  className={`${style.textInputBox}`}
                  type="checkbox"
                  name="allow_half_price"
                  style={{ width: "18px", height: "18px" }}
                  checked={allowHalfPrice}
                  onChange={(e) => {
                    setAllowHalfPrice(e.target.checked);
                    validateOnInput("allow_half_price", e.target.value);
                  }}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationErrors.allow_half_price}
              </div>
            </div>
          </div>

          <div className={`${style.sectionInsideForm}`}>
            {/*
             * Added by - Ashlekh on 09-09-2023
             * Reason - To add discount
             * */}
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>Discount </div>
                <select
                  className={`${style.textInputBox}`}
                  value={discount}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setDiscount(e.target.value);
                  }}
                >
                  <option value="Discount in (₹)">Discount in (₹)</option>
                  <option
                    value="Discount in (%)"
                    onChange={(e) => {
                      setDiscount(e.target.value);
                    }}
                  >
                    Discount in (%)
                  </option>
                </select>
              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationErrors.discount_in}
              </div>
            </div>
            {/*
             * End of code addition by - Ashlekh on 09-09-2023
             * Reason - To add discount
             * */}
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>CGST (%)</div>
                <input
                  className={`${style.textInputBox}`}
                  type="text"
                  name="cgst"
                  style={{ width: "100px" }}
                  value={cgst}
                  onChange={(e) => {
                    setCgst(e.target.value);
                    validateOnInput("cgst", e.target.value);
                  }}
                  onBlur={(e) => {
                    validateOnBlur("cgst", e.target.value);
                  }}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationErrors.cgst}
              </div>
            </div>

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>SGST (%)</div>
                <input
                  className={`${style.textInputBox}`}
                  type="text"
                  name="sgst"
                  style={{ width: "100px" }}
                  value={sgst}
                  onChange={(e) => {
                    setSgst(e.target.value);
                    validateOnInput("sgst", e.target.value);
                  }}
                  onBlur={(e) => {
                    validateOnBlur("sgst", e.target.value);
                  }}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationErrors.sgst}
              </div>
            </div>

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>GSTIN</div>
                <input
                  className={`${style.textInputBox}`}
                  type="text"
                  name="gstin"
                  style={{ width: "200px" }}
                  value={gstin}
                  maxLength={15}
                  onChange={(e) => {
                    setGstin(e.target.value);
                    validateOnInput("gstin", e.target.value);
                  }}
                  onBlur={(e) => {
                    validateOnBlur("gstin", e.target.value);
                  }}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationErrors.gstin}
              </div>
            </div>

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>FSSAI Number</div>
                <input
                  className={`${style.textInputBox}`}
                  type="text"
                  name="fssaino"
                  style={{ width: "200px" }}
                  value={fssaiNumber}
                  maxLength={14}
                  onChange={(e) => {
                    setFssaiNumber(e.target.value);
                    validateOnInput("fssaino", e.target.value);
                  }}
                  onBlur={(e) => {
                    validateOnBlur("fssaino", e.target.value);
                  }}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationErrors.fssaino}
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
            onClick={(e) => {
              resetSettingsForm();
              window.scrollTo(0, 0);
            }}
          >
            Clear
          </div>

          <div
            className={` ${style.proceedButton}`}
            onClick={() => { saveSettings(); window.scrollTo(0, 0); }}

          >
            Save
          </div>
        </div>
      </form>
    </div>
    // </Header>
  );
}
export default SettingForm;
