// Created by:- Suman sahu  Date:- 05/04/2023
// Reason:- Create Header for RestroScans

import React, { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import "./header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faHouse,
  faImage,
  faUser,
  faDollarSign,
  faIndianRupee,
  faIndianRupeeSign,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import RestroscansLogo from "../images/restroLogo9.png";

function Header({ isOpen, setIsOpen }) {
  // Added by:- Suman sahu  Date:- 07/04/2023
  // Reason:- When click on logo of adyant, open site of Adyant in a new tab

  const openSiteOfAdyant = (url) => {
    window.open(url, "_blank", "noreferrer");
  };
  // End of added code by-Suman sahu On 07/04/2023

  // Added by :- Suman sahu On 07/04/2023
  // Reason:- In responsive, click on any link after that header menu should be close
  function menuClose() {
    setIsOpen(false);
  }
  // End of added code by-Suman sahu 07/04/2023

  const navigate = useNavigate();

  return (
    <>
      <div className="header_main_div">
        <label htmlFor="check" className="header_menu">
          <FontAwesomeIcon
            onClick={() => {
              setIsOpen(isOpen == true ? false : true);
            }}
            icon="fa-solid fa-bars"
            className="side_bar_icon"
          />
        </label>
        <label
          className="restroscans_logo_section"
          onClick={() => navigate("/")}
        >
          <Link
            className="logo_link"
            // onClick={() => openSiteOfAdyant("https://adyant.co.in/")}
          >
            <img src={RestroscansLogo} className="header_restroscans_logo" />
            {/* <span className="header_restroscan_link">RestroScans</span> */}
          </Link>
        </label>
        <button
          className="header_btn_responsive"

          // Modified by - Suman sahu On 19/05/2023
          // Reason- hide menu drawer when click on "Get Restroscans" button in responsive
          onClick={() => {
            navigate("/restroscans");
            menuClose();
          }}
          // End of modification by- Suman sahu on 19/05/2023
        >
          Get Restroscans
        </button>

        <div className="links_div" id="link">
          <div
            className={isOpen == true ? "menu_open_second" : "menu_open_first"}
          >
            <li>
              <FontAwesomeIcon icon={faHouse} className="header_link_icons" />
              <NavLink className="header_links" to="/" onClick={menuClose}>
                Home
              </NavLink>
            </li>

            <li>
              <FontAwesomeIcon icon={faList} className="features_icon" />
              <NavLink
                className="header_links"
                to="/features"
                id="features_link"
                onClick={menuClose}
              >
                Features
              </NavLink>
            </li>

            <li>
              <FontAwesomeIcon icon={faImage} className="header_link_icons" />
              <NavLink className="header_links" to="/gallery" onClick={menuClose}>
                Gallery
              </NavLink>
            </li>

            <li>
              <FontAwesomeIcon
                icon={faIndianRupeeSign}
                // className="pricing_icon"
                className="header_link_icons"
              />
              <NavLink
                className="header_links"
                to="/pricing"
                // id="pricing_link"
                onClick={menuClose}
              >
                Pricing
              </NavLink>
            </li>

            <li>
              <FontAwesomeIcon icon={faPhone} className="header_link_icons" />
              <NavLink
                className="header_links"
                to="/contactus"
                onClick={menuClose}
              >
                Contact Us
              </NavLink>
            </li>

            <li>
              <FontAwesomeIcon icon={faUser} className="header_link_icons" />
              <NavLink className="header_links" to="/aboutus" onClick={menuClose}>
                About Us
              </NavLink>
            </li>
          </div>

          <button
            className="header_btn"
            onClick={() => navigate("/restroscans")}
          >
            Get Restroscans
          </button>
        </div>
      </div>
    </>
  );
}

export default Header;
/* End of created code by-Suman sahu On  05/04/2023 */
