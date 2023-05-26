import React from "react";
import style from "./item.module.css";
import Header from "../GlobalComponent/Header";

const Item = () => {
  return (
    <Header>
      <div className={style.Container}>
        <h1 className={style.heading}>Item</h1>
      </div>
    </Header>
  );
};

export default Item;
