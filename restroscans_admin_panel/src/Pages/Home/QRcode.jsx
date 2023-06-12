// Created by- Suman sahu On 25/05/2023
// reason- create QR Code page for react js admin panel

import React, { useState } from "react";
import style from "./qrcode.module.css";
import Header from "../GlobalComponent/Header";
import { QRCode } from "react-qrcode-logo";
import Adyant from "../../assets/adyant1.png";
import { HTTP_METHOD, localURL, domainURL } from "../../Api/config";

const QRcode = () => {
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

  function PrintQR(){
    var topContents = document.getElementById("restaurent_name").innerHTML;
    
    // Commented and modified by - Ashish Dewangan on 12-06-2023
    // Reason - To convert canvas's svg image to jpg format
    // var qrImage = document.getElementById("qr").toDataURL();
    var qrImage = document.getElementById("qr").toDataURL('image/jpg');
    // Commented and modified by - Ashish Dewangan on 12-06-2023
    // Reason - To convert canvas's svg image to jpg format

    var bottomContents = document.getElementById("qr_bottom_text").innerHTML;
    
    var a = window.open('', '', 'height=800, width=1200');
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
            a.document.write("<h1>"+topContents+"</h1>");    
            a.document.write("<img style='width: 330px;height:330px;margin-top:-20px; margin-bottom:-20px;' src="+qrImage+">");
            a.document.write("<div style='display:'flex';flex-direction:column;align-items:center;justify-content:center;'><div style='padding-top:17px;font-size:13px;text-align:center'>Adyant Softtech Pvt Ltd Raipur</div><div>restroscans.com , Scan to see the menu</div></div>"); 
        a.document.write('</div>');

        a.document.write('<div style="display:flex;flex-direction:column;align-items:center;width:50vw;" >');
            a.document.write("<h1>"+topContents+"</h1>");    
            a.document.write("<img style='width: 330px;height:330px;margin-top:-20px; margin-bottom:-20px;' src="+qrImage+">");
            a.document.write("<div style='display:'flex';flex-direction:column;align-items:center;justify-content:center;'><div style='padding-top:17px;font-size:13px;text-align:center'>Adyant Softtech Pvt Ltd Raipur</div><div>restroscans.com , Scan to see the menu</div></div>"); 
            a.document.write('</div>');
        a.document.write('</div>');

        a.document.write('<div style="display:flex;flex-direction:row;align-items:center;width:100vw;height:40vh;">');
            a.document.write('<div style="display:flex;flex-direction:column;align-items:center;width:50vw;" >');
            a.document.write("<h1>"+topContents+"</h1>");    
            a.document.write("<img style='width: 330px;height:330px;margin-top:-20px; margin-bottom:-20px;' src="+qrImage+">");
            a.document.write("<div style='display:'flex';flex-direction:column;align-items:center;justify-content:center;'><div style='padding-top:17px;font-size:13px;text-align:center'>Adyant Softtech Pvt Ltd Raipur</div><div>restroscans.com , Scan to see the menu</div></div>"); 
        a.document.write('</div>');

        a.document.write('<div style="display:flex;flex-direction:column;align-items:center;width:50vw;" >');
            a.document.write("<h1>"+topContents+"</h1>");    
            a.document.write("<img style='width: 330px;height:330px;margin-top:-20px; margin-bottom:-20px;' src="+qrImage+">");
            a.document.write("<div style='display:'flex';flex-direction:column;align-items:center;justify-content:center;'><div style='padding-top:17px;font-size:13px;text-align:center'>Adyant Softtech Pvt Ltd Raipur</div><div>restroscans.com , Scan to see the menu</div></div>"); 
            a.document.write('</div>');
        a.document.write('</div>');
        //  End of addition by Om Shrivastava on 02-06-23   

        a.document.write('</body></html>');

        // Commented and modified by - Ashish Dewangan on 12-06-2023
        // Reason - To print only when the document is loaded
        // a.document.close();
        // a.print();
        a.document.addEventListener('load', function() {
          a.focus();
          a.print();
          a.document.close();
          a.close();            
      }, true);
        // End of code modification by - Ashish Dewangan on 12-06-2023
        // Reason - To print only when the document is loaded

}
  // end of addition by - Suman sahu On 25/05/2023

  return (
    <Header>
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
              <h6 className={style.bottom_text}>
                Adyant Softtech Pvt Ltd Raipur{" "}
              </h6>
              <h6 className={style.bottom_text}>
                restroscans.com , Scan to see the menu
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
    </Header>
  );
};

export default QRcode;
/* end of creation code by- Suman sahu On 25/05/2023 */
