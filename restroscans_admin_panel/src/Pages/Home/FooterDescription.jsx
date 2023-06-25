import React, { useEffect } from "react";
import style from "./footerdescription.module.css";
import Header from "../GlobalComponent/Header";
import { enableHeader } from "../../App";

const FooterDescription = () => {
  useEffect(() => {
    // Added By Rohan Kansari - 25/6/23
    // Reason - To enable headerSiderbar
    enableHeader()
    // End of code - Rohan kansari - 25/6/23
  }, [])
  return (
   // Modified by Rohan Kansari - 25/6/23
    // Reason - removing header from each page and making it global
    // <Header>
    <div className={style.Container}>
      <h1 className={style.heading}>FooterDescription</h1>
    </div>
    // </Header>
  );
};

export default FooterDescription;
