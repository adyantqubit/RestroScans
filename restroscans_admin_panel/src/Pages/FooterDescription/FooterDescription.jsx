/**
 * Created by - Pratap Sahu on 12-08-2023
 * Reason - To have Footer Description details section
 */
import { useEffect, useState } from "react";
import {
  getFooterDescriptionApi,
  saveFooterDescriptionApi,
} from "../../Api/services";
import { enableHeader } from "../../App";
import { Message } from "../../App";
import { useNavigate } from "react-router-dom";
import style from "./FooterDescription.module.css";

const FooterDescription = () => {
  const navigate = useNavigate();

  const [inputText, setInputText] = useState("");
  const [footerDescriptionDetails, setFooterDescriptionDetails] = useState({});

  /**
   * Added by - Pratap sahu on 12-08-2023
   * Reason - created to read text change on input box
   */
  const onChange = (event) => {
    const newText = event.target.value;
    setInputText(newText);
  };
  /**
   * end of Addition by - Pratap sahu on 12-08-2023
   * Reason - created to read text change on input box
   */

  useEffect(() => {
    enableHeader();
    getFooterDescription();
  }, []);

  /**
   * Added by - Pratap sahu on 12-08-2023
   * Reason - created api to get Footer Description Details
   */
  const getFooterDescription = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    console.log(tenant);
    //  await getFooterDescriptionApi(tenant).then(response=>{
    //     console.log(response)
    const response = await getFooterDescriptionApi(tenant);
    if (response.descriptionList.length > 0) {
      setFooterDescriptionDetails(response.descriptionList[0]);
      setInputText(response.descriptionList[0].content);
      // setInputText(response.id)
    }
  };

  /**
   * Added by - Pratap sahu on 12-08-2023
   * Reason - created api to save the Footer Description Details
   */
  const saveFooterDescription = async () => {
    var tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    var footerData = { content: inputText };
    if (footerDescriptionDetails) {
      footerData["id"] = footerDescriptionDetails.id;
    }
    // console.log(footerData, "lllllllllllll")
    // if (inputText != "") {
    //   allowDataPost = true;
    // }else{
    //   allowDataPost = false;
    //   setValidationErrors("")
    // }

    var response = await saveFooterDescriptionApi(tenant, footerData);
    console.log(response);
    if (response.msg) {
      Message("Footer saved successfully.", "success");
    } else {
      Message("Something went wrong", "error");
    }
    navigate("/Dashboard");
  };

  /**
   * Added by - Pratap sahu on 12-08-2023
   * Reason - to clear the newly added Footer Description Details from the field
   */
  const clearFooterDescription = () => {
    setInputText(
      footerDescriptionDetails.content != ""
        ? footerDescriptionDetails.content
        : ""
    );
    // setInputText(setInputText==inputText?inputText:"")
  };

  return (
    <div className={style.container}>
      <div className={style.titleContainer}>
        <div className={style.pageTitle}>Footer Description</div>
      </div>
      {/* Commented by Pratap sahu 
      Reason : The css classname not working properly */}
      {/* <form method="post" className={style.footerSection}>
        <div className={style.formContainer}>
          <div className={style.sectionInsideForm}>
            <div className={`${style.inputContainer}`}>
              <div>
                <div>Content:</div>
                <textarea
                  type="text"
                  name="content"
                  value={inputText}
                  placeholder="Enter Footer Description.."
                  onChange={onChange}
                  className={style.inputCotent}
                  style={{ resize: "none" }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={style.buttonContainer}>
          <div onClick={saveFooterDescription} className={style.buttonS}>
            Save
          </div>
          <div
            onClick={() => clearFooterDescription()}
            className={style.buttonC}>
            Clear
          </div>
        </div>
      </form> */}
      {/* End of Commented code by Pratap sahu 
      Reason : The css classname not working properly */}

      <form method="post" className={style.footerSection}>
        <div className={style.formContainer}>
          <div className={`${style.sectionInsideForm}`}>
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.mendatoryField}> </span>Content
                </div>

                <textarea
                  type="text"
                  name="content"
                  value={inputText}
                  onChange={onChange}
                  className={`${style.textInputBox}`}
                  style={{ resize: "none" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={style.actionContainer}>
          <div
            //Modified and commented by Pratap Sahu on 21-08-2023
            // Reason: correction on Button Name
            // className={` ${style.cancelButton}`}
            className={` ${style.clearButton}`}
            style={{
              marginRight: "10px",
            }}
            onClick={(e) => {
              clearFooterDescription();
              window.scrollTo(0, 0);
            }}>
            Clear
          </div>

          <div
            className={` ${style.proceedButton}`}
            onClick={() => {
              saveFooterDescription();
              window.scrollTo(0, 0);
            }}>
            Save
          </div>
        </div>
      </form>
    </div>
  );
};

export default FooterDescription;
/**
 * Ent of code adition by -Pratap sahu on 17-08-2023
 * Reason - To save footer description
 */
