import React from "react";
import style from "./category.module.css";
import Header from "../GlobalComponent/Header";

const Category = () => {
  return (
    <Header>
      <div className={style.Container}>
        <h1 className={style.heading}>Category</h1>
      </div>
    </Header>
  );
};

export default Category;
