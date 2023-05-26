import React from "react";
import style from "./footerdescription.module.css";
import Header from "../GlobalComponent/Header";

const FooterDescription = () => {
  return (
    <Header>
      <div className={style.Container}>
        <h1 className={style.heading}>FooterDescription</h1>
      </div>
    </Header>
  );
};

export default FooterDescription;
