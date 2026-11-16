import { useEffect } from "react";
import { explainFailure } from "../../../../http/http_client";
import { homePath } from "../../../../plans";
import {
  loadFooterDescription,
  saveFooterDescription as persistFooterDescription,
} from "../../services/footerDescriptionService";
import { useApp } from "../../../../Context/AppContext";
import { useNavigate } from "react-router-dom";
import style from "../style/FooterDescription.module.css";
import { useFooterDescriptionState } from "../../usestate/footerDescriptionState";
import Screen from "../../../../components/erp/Screen";

const FooterDescription = () => {
  const { Message, enableHeader } = useApp();
  const navigate = useNavigate();

  var {
    inputText,
    setInputText,
    footerDescriptionDetails,
    setFooterDescriptionDetails,
  } = useFooterDescriptionState();

  const onChange = (event) => {
    const newText = event.target.value;
    setInputText(newText);
  };

  useEffect(() => {
    enableHeader();
    getFooterDescription();
  }, []);

  const getFooterDescription = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await loadFooterDescription(tenant);
    if (response.descriptionList && response.descriptionList.length > 0) {
      setFooterDescriptionDetails(response.descriptionList[0]);
      setInputText(response.descriptionList[0].content);
    }
  };

  const saveFooterDescription = async () => {
    var tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    var footerData = { content: inputText };
    if (footerDescriptionDetails) {
      footerData["id"] = footerDescriptionDetails.id;
    }

    var response = await persistFooterDescription(tenant, footerData);
    if (response.msg) {
      Message("Footer saved successfully.", "success");
    } else {
      Message(explainFailure(response, "The footer was not saved."), "error");
    }
    navigate(homePath());
  };

  const clearFooterDescription = () => {
    setInputText(
      footerDescriptionDetails.content != null
        ? footerDescriptionDetails.content
        : ""
    );
  };

  return (
    <Screen title="Footer" kicker="Setup" layout="form">
    <div className={style.container}>
      <div className={style.titleContainer}>
        <div className={style.pageTitle}>Footer Description</div>
      </div>

      <form method="post" className={style.footerSection}>
        <div className={style.formContainer}>
          <div className={`${style.sectionInsideForm}`}>
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.mendatoryField}> </span>Content
                </div>
                <div className={`${style.outer}`}>
                <textarea
                  type="text"
                  name="content"
                  value={inputText}
                  onChange={onChange}
                  maxLength={500}
                  className={`${style.textInputBox}`}
                  style={{ resize: "none" }}
                />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.actionContainer}>
          <div
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
    </Screen>
  );
};

export default FooterDescription;
