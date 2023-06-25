import React, { useEffect } from "react";
import style from "./bannerofferitem.module.css";
import Header from "../GlobalComponent/Header";
import { enableHeader } from "../../App";

const BannerOfferItem = () => {
  useEffect(()=>{
  // Added By Rohan Kansari - 25/6/23
        // Reason - To disbale headerSiderbar
        enableHeader()
        // End of code - Rohan kansari - 25/6/23
  },[])
  return (
  // Modified by Rohan Kansari - 25/6/23
    // Reason - removing header from each page and making it global
    // <Header>
      <div className={style.Container}>
        <h1 className={style.heading}>BannerOfferItem</h1>
      </div>
    // </Header> 
  );
};

export default BannerOfferItem;
