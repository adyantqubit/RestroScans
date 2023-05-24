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
          <NavLink className={style.link} to="/Dashboard"> Dashboard </NavLink>
        </li>
        <li className={style.links_div}>
          <NavLink className={style.link}> Banner/Offer </NavLink>
        </li>
        <li className={style.links_div}>
          <NavLink className={style.link}> Banner/Offer Items </NavLink>
        </li>
        <li className={style.links_div}>
          <NavLink className={style.link}> Menu </NavLink>
        </li>
        <li className={style.links_div}>
          <NavLink className={style.link}> Category </NavLink>
        </li>
        <li className={style.links_div}>
          <NavLink className={style.link}> Item </NavLink>
        </li>
        <li className={style.links_div}>
          <NavLink className={style.link}> Setting </NavLink>
        </li>
        <li className={style.links_div}>
          <NavLink className={style.link}> Footer Description </NavLink>
        </li>
        <li className={style.links_div}>
          <NavLink className={style.link}> Customer Detail </NavLink>
        </li>
        <li className={style.links_div}>
          <NavLink className={style.link}> Order </NavLink>
        </li>
        <li className={style.links_div}>
          <NavLink className={style.link}> Order Item </NavLink>
        </li>
        <li className={style.links_div}>
          <NavLink className={style.link}> Payment Method </NavLink>
        </li>
        <li className={style.links_div}>
          <NavLink className={style.link} to="/QRcode"> QR Code </NavLink>
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
