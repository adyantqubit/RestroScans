// Created by- Suman sahu On 22/05/2023
// reason- create header for react js admin panel

import React, { useState } from "react";
import style from "./header.module.css";
import Sidebar from "./Sidebar";
import { NavLink, Link, useNavigate } from "react-router-dom";
import RestroscansLogo from "../../assets/restroscansLogo.png";
import { FaBell, FaHome } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdSupport } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiLogoutBoxFill } from "react-icons/ri";
import { Popconfirm, message } from "antd";

const Header = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Reason:- When click on "Support" link, open in new tab
  const linkOpen = (url) => {
    window.open(url, "_blank", "noreferrer");
  };

  const confirm = (props) => {
    localStorage.clear();
    navigate("/login");
  };
  const cancel = (e) => {};
  return (
    <>
      <nav className={style.header_container}>
        {/* 1st logo part  */}
        <div className={style.logo_div}>
          <Link to="/Dashboard" className={style.logo_link}>
            <img className={style.logo} src={RestroscansLogo} />
          </Link>
        </div>

        {/* 2nd menu part  */}
        <div className={menuOpen ? style.mobile_menu_link : style.menu_link}>
          <ul>
            <li className={style.links_div}>
              <FaHome className={style.icons} />
              <NavLink className={style.link} to="/Dashboard">
                Home
              </NavLink>
            </li>
            <li className={style.links_div}>
              <FaBell className={style.icons} id="link" />
              <NavLink className={style.link} to="/notification">
                Notification
              </NavLink>
            </li>
            <li className={style.links_div}>
              <IoMdSettings className={style.icons} />
              <NavLink className={style.link} to="/setting">
                setting
              </NavLink>
            </li>
            <li className={style.links_div}>
              <MdSupport className={style.icons} />
              <NavLink
                className={style.link}
                onClick={() =>
                  linkOpen("https://adyant.co.in/contact-us-india-1")
                }
              >
                Support
              </NavLink>
            </li>
            <li className={style.logout_link_div}>
              <RiLogoutBoxFill className={style.icons} />
              <NavLink className={style.link}>Logout</NavLink>
            </li>
          </ul>
        </div>

        {/* 3rd button section */}
        <div className={style.btn_div}>
          <ul className={style.logout_btn_div}>
            <li>
              {/* <button className={style.logout} onClick={confirm}>Logout</button> */}
              <Popconfirm
                className={style.logout_popup}
                title="Are you sure you want to logout?"
                onConfirm={confirm}
                onCancel={cancel}
                cancelText="Cancel"
                okText="Ok"
              >
                <a href="#" className={style.logout}>
                  Logout
                </a>
              </Popconfirm>
            </li>
          </ul>

          {/* hamburget menu start  */}
          <div className={style.hamburger_menu}>
            <a onClick={() => setMenuOpen(!menuOpen)}>
              <GiHamburgerMenu />
            </a>
          </div>
        </div>
      </nav>

      <div className={style.content_and_sideBar}>
        <Sidebar />
        {props.children}
      </div>
    </>
  );
};

export default Header;
// end of creation code by- Suman sahu On 22/05/2023
