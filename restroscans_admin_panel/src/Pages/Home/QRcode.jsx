// Created by- Suman sahu On 25/05/2023
// reason- create QR Code page for react js admin panel

import React, { useEffect, useState } from "react";
import style from "./qrcode.module.css";
import Header from "../GlobalComponent/Header";
import { QRCode } from "react-qrcode-logo";
import Adyant from "../../assets/adyant1.png";
import { HTTP_METHOD, localURL, domainURL } from "../../Api/config";
import { enableHeader } from "../../App";

const QRcode = () => {


  useEffect(() => {
    // Added By Rohan Kansari - 25/6/23
    // Reason - To enable headerSiderbar
    enableHeader()
    // End of code - Rohan kansari - 25/6/23
  }, [])
  // added by - Suman sahu On 24/05/2023
  // reason- get restaurent name from local storage
  var restaurant_name = JSON.parse(
    localStorage.getItem("userData")
  ).restaurant_name;
  // end of addition by - Suman sahu On 24/05/2023

  // added by - Suman sahu On 25/05/2023
  // reason- get tenant name from local storage
  var tenant_name = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
  // end of addition by - Suman sahu On 25/05/2023

  // added by - Suman sahu On 25/05/2023
  // reason- create path for generate QR Code

  var remotePath =
    HTTP_METHOD + tenant_name + "." + domainURL + "/" + tenant_name + "/home";

  var localPath = HTTP_METHOD + localURL + "/" + tenant_name + "/home";

  // end of addition by - Suman sahu On 25/05/2023

  // added by - Suman sahu On 25/05/2023
  // reason- when click on "Print QR Code" button this function will be call and print QR Code

  function PrintQR() {
    var topContents = document.getElementById("restaurent_name").innerHTML;

    // Commented and modified by - Ashish Dewangan on 12-06-2023
    // Reason - To convert canvas's svg image to jpg format
    // var qrImage = document.getElementById("qr").toDataURL();
    var qrImage = document.getElementById("qr").toDataURL('image/jpg');
    // Commented and modified by - Ashish Dewangan on 12-06-2023
    // Reason - To convert canvas's svg image to jpg format

    var bottomContents = document.getElementById("qr_bottom_text").innerHTML;

    /**
     * Commented and modified by - Ashish Dewangan on 16-06-2023
     * Reason - To hide background content from print window
     */
    // var a = window.open('', '', 'height=800, width=1200');
    var a = window.open('', '', 'height=600, width=1000');
    /**
    * End of code modification by - Ashish Dewangan on 16-06-2023
    * Reason - To hide background content from print window
    */
    a.document.write('<html>');

    // Added by - Ashish Dewangan on 12-06-2023
    // Reason - Added style to document, so that extra unnecessary content on header and footer will not be printed
    a.document.write('<head>');
    a.document.write('<style>');
    a.document.write('@media print{@page{margin:0;}}');
    a.document.write('</style>');
    a.document.write('</head>');
    // End of code addition by - Ashish Dewangan on 12-06-2023
    // Reason - Added style to document, so that extra unnecessary content on header and footer will not be printed

    // Some modification and changes by Om Shrivastava on 02-6-23
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
    //  End of addition by Om Shrivastava on 02-06-23   

    a.document.write('</body></html>');

    // Commented and modified by - Ashish Dewangan on 12-06-2023
    // Reason - To print only when the document is loaded
    // a.document.close();
    // a.print();
    /**
     * Commented and modified by - Ashish Dewangan on 18-06-2023
     * Reason - Fix issue that caused print page not showing up on mobile browser
     */
    //   a.document.addEventListener('load', function() {
    //     a.focus();
    //     a.print();
    //     a.document.close();
    //     a.close();            
    // }, true);
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
      /**
       * End of code modification by - Ashish Dewangan on 18-06-2023
       * Reason - Fix issue that caused print page not showing up on mobile browser
       */

    }
    // End of code modification by - Ashish Dewangan on 12-06-2023
    // Reason - To print only when the document is loaded

  }
  // end of addition by - Suman sahu On 25/05/2023

  return (
   // Modified by Rohan Kansari - 25/6/23
    // Reason - removing header from each page and making it global
    // <Header>
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
              value={localPath}
            />
          </div>

          <div id="qr_bottom_text">
          {/* Modified & Added by Pratap sahu on 07-10-2023 for better enhancement */}
            <h6 className={style.bottom_text}>
              {/* Adyant Softtech Pvt Ltd Raipur{" "} */}
              Adyant SoftTech Pvt Ltd, Raipur{" "}
            </h6>
            <h6 className={style.bottom_text}>
            {/* restroscans.com , Scan to see the menu */}
            www.restroscans.com , Table No:
            </h6>
            <h6 className={style.bottom_text}>
            Scan to see the menu
            </h6>
            {/* End of code by Pratap sahu on 07-10-2023 for better enhancement */}
          </div>
        </div>

        <div>
          <button className={style.print_qr_btn} onClick={PrintQR}>
            Print QR Code
          </button>
        </div>
      </div>
    </div>
    // </Header>
  );
};

export default QRcode;
/* end of creation code by- Suman sahu On 25/05/2023 */
