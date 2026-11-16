import React, { useEffect } from "react";
import style from "../style/setting.module.css";
import Header from "../../../../components/Header/Header";

const Setting = () => {
  useEffect(() => {
    enableHeader()
  }, [])
  return (
    <div className={style.Container}>
      <h1 className={style.heading}>Setting</h1>
    </div>
  );
};

export default Setting;
