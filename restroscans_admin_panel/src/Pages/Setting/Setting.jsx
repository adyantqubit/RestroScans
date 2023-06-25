/**
 * Created by - Ashish Dewangan on 01-06-2023
 * Reason - To have settings section
 */

import React, { useEffect, useState } from "react";
import style from "./setting.module.css";
import Header from "../GlobalComponent/Header";
import { getSettingsDetails } from "../../Api/services";
import { useNavigate } from "react-router-dom";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import Loader from "../GlobalComponent/Loader";
import { enableHeader } from "../../App";

const Setting = () => {
  const [settingData, setSettingData] = useState(null);
  const [appTheme, setAppTheme] = useState(null);
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(true)
  /**
   * Added by - Ashish Dewangan on 01-06-2023
   * Reason - method that will execute when page loads. this method will call setting data api
   */
  useEffect(() => {
    // Added By Rohan Kansari - 25/6/23
    // Reason - To enable headerSiderbar
    enableHeader()
    // End of code - Rohan kansari - 25/6/23
    getSettingData();
  }, []);
  /**
   * End of code addition by - Ashish Dewangan on 01-06-2023
   * Reason - method that will execute when page loads. this method will call setting data api
   */

  /**
   * Added by - Ashish Dewangan on 01-06-2023
   * Reason - created api to get existing setting data
   */
  const getSettingData = async () => {
    setShowLoader(true)
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await getSettingsDetails(tenant);
    setSettingData(response.setting);
    var selectedAppTheme = response.themeOptions.filter((option) => {
      return option.id == response.setting.app_theme;
    });
    setAppTheme(selectedAppTheme[0]);
    setShowLoader(false)
  };
  /**
   * End of code addition by - Ashish Dewangan on 01-06-2023
   * Reason - created api to get existing setting data
   */

  /**
   * Added by - Ashish Dewangan on 01-06-2023
   * Reason - method to navigate to setting form when user click on view button on row
   */
  const openSettingDetails = (id) => {
    navigate("/SettingForm", { state: { id: id } });
  };
  /**
   * End of code addition by - Ashish Dewangan on 01-06-2023
   * Reason - method to navigate to setting form when user click on view button on row
   */

  return (
   // Modified by Rohan Kansari - 25/6/23
    // Reason - removing header from each page and making it global
    // <Header>
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
    // </Header>
  );
};

export default Setting;
