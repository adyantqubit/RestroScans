import React, { useEffect, useState } from "react";
import style from "../style/qrcode.module.css";
import Header from "../../../../components/Header/Header";
import { QRCode } from "react-qrcode-logo";
import Adyant from "../../../../assets/adyant1.png";
import { baseDomain, customerSiteUrl } from "../../../../config/config";
import { useApp } from "../../../../Context/AppContext";
import {
  BsGlobe
} from "react-icons/bs";
import Screen from "../../../../components/erp/Screen";
const QRcode = () => {
  const { enableHeader } = useApp();

  useEffect(() => {
    enableHeader()
  }, [])
  var restaurant_name = (JSON.parse(localStorage.getItem("userData") || "{}") || {}).restaurant_name;

  var tenant_name = (JSON.parse(localStorage.getItem("tenantInfo") || "{}") || {}).tenant_name;

  var menuUrl = customerSiteUrl(tenant_name);

  function PrintQR() {
    var topContents = document.getElementById("restaurent_name").innerHTML;

    var qrImage = document.getElementById("qr").toDataURL('image/jpg');

    var bottomContents = document.getElementById("qr_bottom_text").innerHTML;

    var a = window.open('', '', 'height=600, width=1000');
    a.document.write('<html>');

    a.document.write('<head>');
    a.document.write('<style>');
    a.document.write('@media print{@page{margin:0;}}');
    a.document.write('</style>');
    a.document.write('</head>');

    a.document.write('<body style="display:flex;flex-direction:column;justify-content:space-around;align-items:space-around;width:100vw;" >');
    a.document.write('<div style="display:flex;flex-direction:row;align-items:center;width:100vw;height:40vh;">');
    a.document.write('<div style="display:flex;flex-direction:column;align-items:center;width:50vw;" >');
    a.document.write("<h1>" + topContents + "</h1>");
    a.document.write("<img style='width: 330px;height:330px;margin-top:-20px; margin-bottom:-20px;' src=" + qrImage + ">");
    a.document.write("<div style='display:'flex';flex-direction:column;align-items:center;justify-content:center;'><div style='padding-top:17px;font-size:13px;text-align:center'>Adyant Softtech Pvt Ltd Raipur</div><div>restroscans.com , Scan to see the menu</div></div>");
    a.document.write('</div>');

    a.document.write('<div style="display:flex;flex-direction:column;align-items:center;width:50vw;" >');
    a.document.write("<h1>" + topContents + "</h1>");
    a.document.write("<img style='width: 330px;height:330px;margin-top:-20px; margin-bottom:-20px;' src=" + qrImage + ">");
    a.document.write("<div style='display:'flex';flex-direction:column;align-items:center;justify-content:center;'><div style='padding-top:17px;font-size:13px;text-align:center'>Adyant Softtech Pvt Ltd Raipur</div><div>restroscans.com , Scan to see the menu</div></div>");
    a.document.write('</div>');
    a.document.write('</div>');

    a.document.write('<div style="display:flex;flex-direction:row;align-items:center;width:100vw;height:40vh;">');
    a.document.write('<div style="display:flex;flex-direction:column;align-items:center;width:50vw;" >');
    a.document.write("<h1>" + topContents + "</h1>");
    a.document.write("<img style='width: 330px;height:330px;margin-top:-20px; margin-bottom:-20px;' src=" + qrImage + ">");
    a.document.write("<div style='display:'flex';flex-direction:column;align-items:center;justify-content:center;'><div style='padding-top:17px;font-size:13px;text-align:center'>Adyant Softtech Pvt Ltd Raipur</div><div>restroscans.com , Scan to see the menu</div></div>");
    a.document.write('</div>');

    a.document.write('<div style="display:flex;flex-direction:column;align-items:center;width:50vw;" >');
    a.document.write("<h1>" + topContents + "</h1>");
    a.document.write("<img style='width: 330px;height:330px;margin-top:-20px; margin-bottom:-20px;' src=" + qrImage + ">");
    a.document.write("<div style='display:'flex';flex-direction:column;align-items:center;justify-content:center;'><div style='padding-top:17px;font-size:13px;text-align:center'>Adyant Softtech Pvt Ltd Raipur</div><div>restroscans.com , Scan to see the menu</div></div>");
    a.document.write('</div>');
    a.document.write('</div>');

    a.document.write('</body></html>');

    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i)) {
      a.document.addEventListener('load', function () {
        a.focus();
        a.document.close();
        a.print();
      }, true);
    } else {
      a.document.addEventListener('load', function () {
        a.focus();
        a.document.close();
        a.print();
        a.close();
      }, true);
    }
  }

  return (
    <Screen title="Print QR" kicker="Setup" layout="form">
    <div className={style.Container}>
      <div className={style.main_section}>
        <div id="qrSection">
          <h1 className={style.restaurent_name} id="restaurent_name">{restaurant_name}</h1>
          <div className={style.qr_scanner_section}>
            <QRCode
              id="qr"
              size={300}
              logoImage={Adyant}
              logoWidth={60}
              logoHeight={50}
              removeQrCodeBehindLogo={true}
              value={menuUrl}
            />
          </div>

          <div id="qr_bottom_text">
            <h6 className={style.bottom_text}>
              Adyant SoftTech Pvt Ltd, Raipur{" "}
            </h6>
            <h6 className={style.bottom_text}>
            <BsGlobe style={{display:'inline',fontSize:'15px',paddingTop:'3px'}}/> www.{baseDomain} , Table No:
            </h6>
            <h6 className={style.bottom_text}>
            Scan to see the menu
            </h6>
          </div>
        </div>

        <div>
          <button className={style.print_qr_btn} onClick={PrintQR}>
            Print QR Code
          </button>
        </div>
      </div>
    </div>
    </Screen>
  );
};

export default QRcode;
