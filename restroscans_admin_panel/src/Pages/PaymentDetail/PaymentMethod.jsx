import React from "react";
import style from "./paymentmethod.module.css";
import Header from "../GlobalComponent/Header";

const PaymentMethod = () => {
  return (
    <Header>
      <div className={style.Container}>
        <h1 className={style.heading}>PaymentMethod</h1>
      </div>
    </Header>
  );
};

export default PaymentMethod;
