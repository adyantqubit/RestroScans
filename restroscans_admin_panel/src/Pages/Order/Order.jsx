import React from "react";
import style from "./order.module.css";
import Header from "../GlobalComponent/Header";

const Order = () => {
  return (
    <Header>
      <div className={style.Container}>
        <h1 className={style.heading}>Order</h1>
      </div>
    </Header>
  );
};

export default Order;
