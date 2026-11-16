import React, { useEffect } from "react";
import style from "../style/footerdescription.module.css";
import Header from "../../../../components/Header/Header";
import { useApp } from "../../../../Context/AppContext";

const FooterDescription = () => {
  const { enableHeader } = useApp();
  useEffect(() => {
    enableHeader()
  }, [])
  return (
    <div className={style.Container}>
      <h1 className={style.heading}>FooterDescription</h1>
    </div>
  );
};

export default FooterDescription;
