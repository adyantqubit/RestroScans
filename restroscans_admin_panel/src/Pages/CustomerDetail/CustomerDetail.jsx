import React from "react";
import style from "./customerdetail.module.css";
import Header from "../GlobalComponent/Header";

const CustomerDetail = () => {
  return (
    <Header>
      <div className={style.Container}>
        <h1 className={style.heading}>CustomerDetail</h1>
      </div>
    </Header>
  );
};

export default CustomerDetail;
