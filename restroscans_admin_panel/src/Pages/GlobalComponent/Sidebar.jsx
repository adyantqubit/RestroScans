// Created by- Suman sahu On 24/05/2023
// reason- create sidebar for react js admin panel

import React, { useState } from "react";
import style from "./sidebar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FaCaretRight, FaCaretLeft } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);
  const navigate = useNavigate(); 
  {/* Modified by Rohan Kansari - 26/5/23 
      Reason -To add sub menu functionality in report menu */}
  const [ReportSubVisible, setReportSubVisible] = useState(false)
  {/*End of code -Rohan Kansari 26/5/23  */}

  function closeSidebar() {
    setSidebar(false);
  }
// Added by Om Shrivastava on 02-06-23
// Reason : Need to navigate when user click the main div
  const navigateToDashboard = () => {
    navigate('/Dashboard');
  };

  const navigateToBanner = () => {
    navigate('/BannerOffer');
  };
  const navigateToOrderReport = () => {
    navigate('/OrderReport');
  };
  const navigateToOrderItemReport = () => {
    navigate('/OrderItemReport');
  };
  const navigateToCustomerReport = () => {
    navigate('/CustomerReport');
  };
  const navigateToRevenue = () => {
    navigate('/Revenue');
  };
  const navigateToBannerItems = () => {
    navigate('/BannerOfferItem');
  };
  const navigateToMenu = () => {
    navigate('/Menu');
  };
  const navigateToCategory = () => {
    navigate('/Category');
  };
  const navigateToItem = () => {
    navigate('/item');
  };
  const navigateToSetting = () => {
    navigate('/SettingForm');
  };
  const navigateToFooter = () => {
    navigate('/FooterDescription');
  };
  const navigateToCustomerDetail = () => {
    navigate('/CustomerDetail');
  };
  const navigateToOrder = () => {
    navigate('/Order');
  };
  const navigateToOrderItem = () => {
    navigate('/OrderItem');
  };
  const navigateToPayment = () => {
    navigate('/PaymentMethod');
  };
  const navigateToQR = () => {
    navigate('/QRcode');
  };
  // End of addition by Om Shrivastava on 02-06-23
  /**
   * Added by Yuvraj Sahu on 12-06-2023
   * Reason - to navigate social media page
   */
  const navigateToSocialList = () => {
    navigate("/social-media");
  };
  /**
   * End of addition by yuvraj Sahu on 12-06-2023
   */

  return (
    <div className={style.container}>
      <div className={style.sidebar_open_div}>
        <FaCaretRight
          onClick={() => {
            setSidebar(!sidebar);
          }}
          className={
            sidebar == true
              ? style.hide_sidebar_openarrow
              : style.show_sidebar_openarrow
          }
        />
      </div>
      <ul
        className={sidebar == true ? style.open_sidebar : style.close_sidebar}
      >
        <li className={style.links_div} onClick={navigateToDashboard}>
          <NavLink className={style.link} to="/Dashboard">
            {" "}
            Dashboard{" "}
          </NavLink>
        </li>
        <li className={style.links_div} onClick={navigateToBanner}>
          <NavLink className={style.link} to="/BannerOffer">
            {" "}
            Banner/Offer{" "}
          </NavLink>
        </li>
        {/* Added by ROhan Kansari - To open report page - 26/5/23*/}
        <li className={`${style.links_div} ${style.link}`} onClick={e => setReportSubVisible(!ReportSubVisible)}>
          Report
          <AiOutlinePlus color="white" />

        </li>
        
        {ReportSubVisible ?
          <ul style={{ marginTop: "-10px" }}>
            <li className={style.Sublinks_div} onClick={navigateToOrderReport}>
              <NavLink className={style.sublink} to="/OrderReport">Order Report</NavLink>
            </li>
            <li className={style.Sublinks_div} onClick={navigateToOrderItemReport}>
              <NavLink className={style.sublink} to="/OrderItemReport">Order Item Report</NavLink>
            </li>
            <li className={style.Sublinks_div} onClick={navigateToCustomerReport}>
              <NavLink className={style.sublink} to="/CustomerReport">Customer Report</NavLink>
            </li>
          </ul> : null}
        {/* End of code - Rohan Kansari - 26/5/23*/}
        {/* Added by Suman - To open revenue page - 27/5/23*/}
        <li className={style.links_div} onClick={navigateToRevenue}>
          <NavLink className={style.link} to="/Revenue">
            {" "}
            Revenue{" "}
          </NavLink>
        </li>
        {/* End of code - Suman Sahu - 27/5/23*/}
        <li className={style.links_div} onClick={navigateToBannerItems}>
          <NavLink className={style.link} to="/BannerOfferItem">
            {" "}
            Banner/Offer Items{" "}
          </NavLink>
        </li>
        <li className={style.links_div} onClick={navigateToMenu}>
          <NavLink className={style.link} to="/Menu">
            {" "}
            Menu{" "}
          </NavLink>
        </li>
        <li className={style.links_div} onClick={navigateToCategory}>
          <NavLink className={style.link} to="/Category">
            {" "}
            Category{" "}
          </NavLink>
        </li>
        <li className={style.links_div} onClick={navigateToItem}>
          <NavLink className={style.link} to="/item">
            {" "}
            Item{" "}
          </NavLink>
        </li>
        <li className={style.links_div} onClick={navigateToSetting}>
          <NavLink className={style.link} to="/SettingForm">
            {" "}
            Setting{" "}
          </NavLink>
        </li>
        <li className={style.links_div} onClick={navigateToFooter}>
          <NavLink className={style.link} to="/FooterDescription">
            {" "}
            Footer Description{" "}
          </NavLink>
        </li>
        <li className={style.links_div} onClick={navigateToCustomerDetail}>
          <NavLink className={style.link} to="/CustomerDetail">
            {" "}
            Customer Detail{" "}
          </NavLink>
        </li>
        <li className={style.links_div} onClick={navigateToOrder}>
          <NavLink className={style.link} to="/Order">
            {" "}
            Order{" "}
          </NavLink>
        </li>
        <li className={style.links_div} onClick={navigateToOrderItem}>
          <NavLink className={style.link} to="/OrderItem">
            {" "}
            Order Item{" "}
          </NavLink>
        </li>
        <li className={style.links_div} onClick={navigateToPayment}>
          <NavLink className={style.link} to="/PaymentMethod">
            {" "}
            Payment Method{" "}
          </NavLink>
        </li>
        <li className={style.links_div} onClick={navigateToQR}>
          <NavLink className={style.link} to="/QRcode">
            {" "}
            QR Code{" "}
          </NavLink>
        </li>
        {/* Added by Yuvraj Sahu on 29-05-2023
        	Reason - to add sidebar link for social media  */}
        {/* Modified by Yuvraj Sahu on 12-06-2023
        	Reason - to navigate after clicking box  */}
        <li className={style.links_div} onClick={navigateToSocialList}>
          {/* End of modification by Yuvraj Sahu on 12-06-2023 */}
          <NavLink className={style.link} to="/social-media">
            {" "}
            Social Media{" "}
          </NavLink>
        </li>
        {/* End of addition social media by yuvraj Sahu on 29-05-2023 */}
      </ul>

      <div className={style.sidebar_close_div}>
        <FaCaretLeft
          onClick={closeSidebar}
          className={
            sidebar == true
              ? style.show_sidebar_closearrow
              : style.hide_sidebar_closearrow
          }
        />
      </div>
    </div>
  );
};

export default Sidebar;
// End of creation code by- Suman sahu On 24/05/2023
