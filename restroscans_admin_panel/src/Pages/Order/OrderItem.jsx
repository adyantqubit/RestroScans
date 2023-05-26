import React from "react";
import style from "./orderitem.module.css";
import Header from "../GlobalComponent/Header";

const OrderItem = () => {
  return (
    <Header>
      <div className={style.Container}>
        <h1 className={style.heading}>OrderItem</h1>
      </div>
    </Header>
  );
};

export default OrderItem;
