import React from "react";
import style from "./orderitem.module.css";
import Header from "../GlobalComponent/Header";
import { useLocation, useNavigate } from "react-router-dom";

const OrderForm = () => {
    const navigate = useNavigate();

    /**
     * Added by Yuvraj Sahu on 07-06-2023
     * Reason - to recieve id for update social media
     */
    const { state } = useLocation();
    const { id } = state; // Read values passed on state
    /**
     * End of addition by Yuvraj Sahu on 07-06-2023
     */

  return (
    <Header>
      <div className={style.Container}>
        <h1 className={style.heading}>Order Form</h1>
      </div>
    </Header>
  );
};

export default OrderForm;
