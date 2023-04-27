// Added by:- Suman sahu  Date:- 07/04/2023
// Reason:- Create Footer for RestroScans

import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faGoogle,
  faTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import Adyant from "../images/adyant.png";

const Footer = () => {
  // Added by:- Suman sahu  Date:- 07/04/2023
  // Reason:- add link for "powered by adyant"
  const opeenSiteOfAdyant = (url) => {
    window.open(url, "_blank", "noreferrer");
  };
  // End of added code 07/04/2023

  // Added by:- Suman sahu On 11/04/2023
  // Reason:- When click on footer social icons, open in new tab
  const footerIconsOpenNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
  };
  // End of added code 11/04/2023

  return (
    <>
      <div className="footer_main_div">
        <div className="footer_section_1">
          <div>
            <Link
              onClick={() =>
                footerIconsOpenNewTab(
                  "https://www.facebook.com/people/Adyant/100083538721741/"
                )
              }
            >
              <FontAwesomeIcon className="footer_icon" icon={faFacebook} />
            </Link>

            <Link
              onClick={() => footerIconsOpenNewTab("https://adyant.co.in/")}
            >
              <FontAwesomeIcon className="footer_icon" icon={faGoogle} />
            </Link>

            <Link
              onClick={() =>
                footerIconsOpenNewTab("https://twitter.com/adyant_softtech")
              }
            >
              <FontAwesomeIcon className="footer_icon" icon={faTwitter} />
            </Link>

            <Link
              onClick={() =>
                footerIconsOpenNewTab(
                  "https://www.instagram.com/adyantsofttech/"
                )
              }
            >
              <FontAwesomeIcon className="footer_icon" icon={faInstagram} />
            </Link>

            <Link
              onClick={() =>
                footerIconsOpenNewTab(
                  "https://www.youtube.com/@adyantsofttechprivateltd8396/videos"
                )
              }
            >
              <FontAwesomeIcon className="footer_icon" icon={faYoutube} />
            </Link>
          </div>
          <div>
            <p className="adyant_address_heading">Adyant SoftTech Pvt. Ltd.</p>
            <p className="adyant_address_label">
              C-179 ,Street no 9 Near Shahid Bhagat Singh Park, Shailendra Nagar
              Raipur, Chhattisgarh, India
            </p>
          </div>
        </div>
        <div className="footer_section_2">
          <h5 className="footer_heading">Copyright © 2023 restroscans</h5>
          <Link
            className="adyant_footer_link"
            onClick={() => opeenSiteOfAdyant("https://adyant.co.in/")}
          >
            <h6 className="adyant">
              Powered by <img src={Adyant} className="footer_adyant_logo" />
            </h6>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Footer;

// End of added code 07/04/2023
