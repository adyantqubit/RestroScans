// created by:- Suman sahu  Date:- 22/05/2023
// Reason:- Create Footer for RestroScans admin panel

import React from "react";
import { Link, NavLink } from "react-router-dom";
import style from "./footer.module.css";
import Facebook from "../../assets/facebookIcon.webp";
import Google from "../../assets/googleIcon.png";
import Twitter from "../../assets/twitterIcon.png";
import Instagram from "../../assets/instagramIcon.png";
import YouTube from "../../assets/youtubeIcon.png";

const Footer = () => {
  // Reason:- add link for "powered by adyant"
  const opeenSiteOfAdyant = (url) => {
    window.open(url, "_blank", "noreferrer");
  };

  // Reason:- When click on footer social icons, open in new tab
  const footerIconsOpenNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
  };

  return (
  // Modified by Rohan Kansari - 25/6/23
    // Reason - defining id to access and hide
    <div id="footer">
      <div className={style.footer_container}>
        <div className={style.footer_main_section}>
          <div className={style.footer_icons_section}>
            <Link
              onClick={() =>
                footerIconsOpenNewTab(
                  "https://www.facebook.com/people/Adyant/100083538721741/"
                )
              }
            >
              <img src={Facebook} className={style.facebook} />
            </Link>

            <Link
              onClick={() => footerIconsOpenNewTab("https://adyant.co.in/")}
            >
              <img src={Google} className={style.google} />
            </Link>

            <Link
              onClick={() =>
                footerIconsOpenNewTab("https://twitter.com/adyant_softtech")
              }
            >
              <img src={Twitter} className={style.twitter} />
            </Link>

            <Link
              onClick={() =>
                footerIconsOpenNewTab(
                  "https://www.instagram.com/adyantsofttech/"
                )
              }
            >
              <img src={Instagram} className={style.instagram} />
            </Link>

            <Link
              onClick={() =>
                footerIconsOpenNewTab(
                  "https://www.youtube.com/@adyantsofttechprivateltd8396/videos"
                )
              }
            >
              <img src={YouTube} className={style.youtube} />
            </Link>
          </div>

          <h6 className={style.footer_left_text}>
            Copyright © 2023 restroscans
          </h6>
          <h6
            className={style.adyant_footer_link}
            onClick={() => opeenSiteOfAdyant("https://adyant.co.in/")}
          >
            <h6 className={style.footer_right_text}>Powered by Adyant</h6>
          </h6>
        </div>
      </div>
    </div>
  );
};

export default Footer;

// End of added code 22/05/2023
