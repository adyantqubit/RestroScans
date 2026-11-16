import React from "react";
import style from "./footer.module.css";

const Footer = () => {
  return (
    <div id="footer">
      <div className={style.footer_container}>
        <div className={style.footer_main_section}>
          <span className={style.footer_left_text}>RestroScans</span>
          <button
            type="button"
            className={style.footer_right_text}
            onClick={() => window.open("https://adyant.co.in/", "_blank", "noreferrer")}
          >
            Powered by Adyant
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
