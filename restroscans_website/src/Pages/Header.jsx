// Added by:- Suman sahu  Date:- 05/04/2023
// Reason:- Create Header for RestroScans

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";
import Adyant from "../images/adyant.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Header({ isOpen, setIsOpen }) {
  // Added by:- Suman sahu  Date:- 07/04/2023
  // Reason:- When click on logo of adyant, open site of Adyant in a new tab

  const openSiteOfAdyant = (url) => {
    window.open(url, "_blank", "noreferrer");
  };
  // End of added code

  // Added by :- Suman sahu On 07/04/2023
  // Reason:- In responsive, click on any link after that header menu should be close
  function menuClose() {
    setIsOpen(false);
  }
  // End of added code 07/04/2023

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
        <label className="restro_scans_logo">
          <Link
            className="logo_link"
            onClick={() => openSiteOfAdyant("https://adyant.co.in/")}
          >
            <img src={Adyant} className="header_adyant_logo" />
          </Link>
          <span className="header_restroscan_link">restroscans.com</span>
        </label>
        <button
          className="header_btn_responsive"
          onClick={() => navigate("/restroscans")}
        >
          Get Restroscans
        </button>

        <div className="links_div">
          <div
            className={isOpen == true ? "menu_open_second" : "menu_open_first"}
          >
            <li>
              <Link className="header_links" to="/" onClick={menuClose}>
                Home
              </Link>
            </li>

            <li>
              <Link
                className="header_links"
                to="/features"
                id="features_link"
                onClick={menuClose}
              >
                Features
              </Link>
            </li>

            <li>
              <Link
                className="header_links"
                to="/pricing"
                id="pricing_link"
                onClick={menuClose}
              >
                Pricing
              </Link>
            </li>

            <li>
              <Link className="header_links" to="/gallery" onClick={menuClose}>
                Gallery
              </Link>
            </li>

            <li>
              <Link
                className="header_links"
                to="/contactus"
                onClick={menuClose}
              >
                Contact us
              </Link>
            </li>

            <li>
              <Link className="header_links" to="/aboutus" onClick={menuClose}>
                About us
              </Link>
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
/* End of added code 05/04/2023 */
