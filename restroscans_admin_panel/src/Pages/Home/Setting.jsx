import React from "react";
import style from "./setting.module.css";
import Header from "../GlobalComponent/Header";

const Setting = () => {
  return (
    <Header>
      <div className={style.Container}>
        <h1 className={style.heading}>Setting</h1>
      </div>
    </Header>
  );
};

export default Setting;
