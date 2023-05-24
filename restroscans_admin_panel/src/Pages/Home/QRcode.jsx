// Created by- Suman sahu On 25/05/2023
// reason- create QR Code page for react js admin panel

import React, { useState } from "react";
import style from "./qrcode.module.css";
import Header from "../GlobalComponent/Header";
import { QRCodeCanvas } from "qrcode.react";

const QRcode = () => {
  var restaurant_name = JSON.parse(
    localStorage.getItem("userData")
  ).restaurant_name;

  const [url, setUrl] = useState("");

//   const downloadQRCode = (e) => {
//     e.preventDefault();
//     setUrl("");
//   };

//   const qrCodeEncoder = (e) => {
//     setUrl(e.target.value);
//   };

  const qrcode = (
    <QRCodeCanvas
      id="qrCode"
      value={url}
      size={300}
      bgColor={"white"}
      level={"H"}
    />
  );
  return (
    <Header>
      <div className={style.Container}>
        <div className={style.main_section}>
          <h1>{restaurant_name}</h1>
          <div>{qrcode}</div>
          <h6>Adyant Softtech Pvt Ltd Raipur </h6>
          <h5>restroscans.com , Scan to see the menu</h5>
        </div>
      </div>
    </Header>
  );
};

export default QRcode;
/* end of creation code by- Suman sahu On 25/05/2023 */
