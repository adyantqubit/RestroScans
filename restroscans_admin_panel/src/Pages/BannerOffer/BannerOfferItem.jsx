import React from "react";
import style from "./bannerofferitem.module.css";
import Header from "../GlobalComponent/Header";

const BannerOfferItem = () => {
  return (
    <Header>
      <div className={style.Container}>
        <h1 className={style.heading}>BannerOfferItem</h1>
      </div>
    </Header>
  );
};

export default BannerOfferItem;
