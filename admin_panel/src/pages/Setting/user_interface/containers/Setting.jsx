import React, { useEffect } from "react";
import style from "../style/setting.module.css";
import Header from "../../../../components/Header/Header";
import { loadSettings } from "../../services/settingService";
import { useNavigate } from "react-router-dom";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import Loader from "../../../../components/Loader/Loader";
import { useApp } from "../../../../Context/AppContext";
import { useSettingState } from "../../usestate/settingState";

const Setting = () => {
  const { enableHeader } = useApp();
  var {
    settingData,
    setSettingData,
    appTheme,
    setAppTheme,
    showLoader,
    setShowLoader,
  } = useSettingState();

  const navigate = useNavigate();

  useEffect(() => {
    enableHeader()
    getSettingData();
  }, []);

  const getSettingData = async () => {
    setShowLoader(true)
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await loadSettings(tenant);
    setSettingData(response.setting);
    var selectedAppTheme = response.themeOptions.filter((option) => {
      return option.id == response.setting.app_theme;
    });
    setAppTheme(selectedAppTheme[0]);
    setShowLoader(false)
  };

  const openSettingDetails = (id) => {
    navigate("/SettingForm", { state: { id: id } });
  };

  return (
    <div className={style.container}>

        {showLoader?

        <Loader/>
        :
        <>
        <div className={`${style.pageTitleContainer}`}>
          <div className={style.pageTitle}>Settings</div>
          {settingData == null ? (
            <div
              className={`${style.primaryButton}`}
              onClick={() => openSettingDetails()}
            >
              Add Settings
            </div>
          ) : null}
        </div>
        <div className={style.settingSection}>
          <div className={style.tableContainer}>
            <div className={style.table}>
              <div className={style.tableHeadingContainer}>
                <div className={style.commonColumnTitle}> Action </div>
                <div className={style.commonColumnTitle}> App Theme </div>
                <div className={style.commonColumnTitle}> CGST </div>
                <div className={style.commonColumnTitle}> SGST </div>
                <div className={style.commonColumnTitle}>Allow Half Price</div>
                <div className={style.commonColumnTitle}>
                  Allow Loyality Points
                </div>
              </div>
              <div className={style.tableDataContainer}>
                {settingData != null ? (
                  <div className={style.tableData}>
                    <div
                      className={`${style.commonColumnData}`}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <div
                        className={` ${style.primaryButton}`}
                        onClick={() => openSettingDetails(settingData.id)}
                      >
                        View
                      </div>
                    </div>
                    <div className={style.commonColumnData}>
                      {appTheme?.background_color_label} ,
                      {appTheme?.heading_color_label}
                    </div>
                    <div className={style.commonColumnData}>
                      {settingData.cgst}
                    </div>
                    <div className={style.commonColumnData}>
                      {settingData.sgst}
                    </div>
                    <div
                      className={`${style.commonColumnData} ${style.iconContainer}`}
                    >
                      {settingData.allow_half_price == true ? (
                        <MdCheckCircle className={style.yesIcon} />
                      ) : (
                        <MdCancel className={style.noIcon} />
                      )}
                    </div>
                    <div
                      className={`${style.commonColumnData} ${style.iconContainer}`}
                    >
                      {settingData.allow_loyality_points == true ? (
                        <MdCheckCircle className={style.yesIcon} />
                      ) : (
                        <MdCancel className={style.noIcon} />
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center" }}>Please Add Settings</div>
                )}
              </div>
            </div>
          </div>
        </div>
                  </>
        }

    </div>
  );
};

export default Setting;
