import React from "react";
import style from "./banneroffer.module.css";
import Header from "../GlobalComponent/Header";

const BannerOffer = () => {
  return (
    <Header>
      <div className={style.Container}>
        <h1 className={style.heading}>BannerOffer</h1>
      </div>
    </Header>
  );
};

export default BannerOffer;
