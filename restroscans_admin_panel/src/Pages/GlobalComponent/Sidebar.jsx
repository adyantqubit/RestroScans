// Created by- Suman sahu On 24/05/2023
// reason- create sidebar for react js admin panel

import React, { useState } from "react";
import style from "./sidebar.module.css";
import { NavLink } from "react-router-dom";
import { FaCaretRight, FaCaretLeft } from "react-icons/fa";

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);

  function closeSidebar() {
    setSidebar(false);
  }
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
        <li className={style.links_div}>
          <NavLink className={style.link} to="/Dashboard">
            {" "}
            Dashboard{" "}
          </NavLink>
        </li>
        <li className={style.links_div}>
          <NavLink className={style.link} to="/BannerOffer">
            {" "}
            Banner/Offer{" "}
          </NavLink>
        </li>
        {/* Added by ROhan Kansari - To open report page - 26/5/23*/}
        <li className={style.links_div}>
          <NavLink className={style.link} to="/Report">
            {" "}
            Report{" "}
          </NavLink>
        </li>
        {/* End of code - Rohan Kansari - 26/5/23*/}
        {/* Added by Suman - To open revenue page - 27/5/23*/}
        <li className={style.links_div}>
          <NavLink className={style.link} to="/Revenue">
            {" "}
            Revenue{" "}
          </NavLink>
        </li>
        {/* End of code - Suman Sahu - 27/5/23*/}
        <li className={style.links_div}>
          <NavLink className={style.link} to="/BannerOfferItem">
            {" "}
            Banner/Offer Items{" "}
          </NavLink>
        </li>
        <li className={style.links_div}>
          <NavLink className={style.link} to="/Menu">
            {" "}
            Menu{" "}
          </NavLink>
        </li>
        <li className={style.links_div}>
          <NavLink className={style.link} to="/Category">
            {" "}
            Category{" "}
          </NavLink>
        </li>
        <li className={style.links_div}>
          <NavLink className={style.link} to="/item">
            {" "}
            Item{" "}
          </NavLink>
        </li>
        <li className={style.links_div}>
          <NavLink className={style.link} to="/Setting">
            {" "}
            Setting{" "}
          </NavLink>
        </li>
        <li className={style.links_div}>
          <NavLink className={style.link} to="/FooterDescription">
            {" "}
            Footer Description{" "}
          </NavLink>
        </li>
        <li className={style.links_div}>
          <NavLink className={style.link} to="/CustomerDetail">
            {" "}
            Customer Detail{" "}
          </NavLink>
        </li>
        <li className={style.links_div}>
          <NavLink className={style.link} to="/Order">
            {" "}
            Order{" "}
          </NavLink>
        </li>
        <li className={style.links_div}>
          <NavLink className={style.link} to="/OrderItem">
            {" "}
            Order Item{" "}
          </NavLink>
        </li>
        <li className={style.links_div}>
          <NavLink className={style.link} to="/PaymentMethod">
            {" "}
            Payment Method{" "}
          </NavLink>
        </li>
        <li className={style.links_div}>
          <NavLink className={style.link} to="/QRcode">
            {" "}
            QR Code{" "}
          </NavLink>
        </li>
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
