// import { React, useEffect, useState, useContext } from 'react';
// import { GlobalContext } from "../../../../context/Context";
// import { useNavigate } from "react-router-dom";
// import { Button, message } from "antd";
// import { getScannerApi } from '../../services/paymentService';
// import { updatePaymentModeApi, paymentModeBody } from '../../services/paymentService';
// import secureLocalStorage from "react-secure-storage";
// import siteConfig from "../../../../config/config";
// import '../style/Scan.css';
// import { CheckCircleOutlined } from '@ant-design/icons';
// import { useScanState } from "../../usestate/scanState";

// export default function Scan(handleOk) {
//   // get colors from context
//   var { colors } = useContext(GlobalContext);

//   // get data from local stroage
//   var tenantName = localStorage.getItem("tenantName");
//   var orders = secureLocalStorage.getItem('order');

//   const navigate = useNavigate();

//   var { scanner, setScanner } = useScanState();

//   useEffect(() => {
//     getScanner();
//   }, []);

//   const getScanner = async () => {
//     const scanner = await getScannerApi(tenantName);
//     if (scanner) {
//       setScanner(scanner);
//     }
//   };

//   const submitPaymentMode = () => {
//     ordernow();
//   };

//   const ordernow = async (value) => {
//     const order = paymentModeBody(orders.order_id, "Scanner")
//     var tenantName = localStorage.getItem("tenantName");
//     const response = await updatePaymentModeApi(tenantName, order);
//     if (response.msg) {
//       message.success({
//         content: "Payment Done Successfully",
//         key: 1,
//         icon: <CheckCircleOutlined />,
//         style: {
//           marginTop: '5vh',
//           fontSize: "16px",
//           letterSpacing: "1.3px",
//           fontFamily: "Times News Roman",
//           color: colors.headingColor,
//         },
//       });
//       handleOk.handleOk()
//     }
//     else {
//       message.error({
//         content: "Please try again",
//         key: 1,
//         icon: <CheckCircleOutlined />,
//         style: {
//           marginTop: '5vh',
//           fontSize: "16px",
//           letterSpacing: "1.3px",
//           fontFamily: "Times News Roman",
//           color: colors.headingColor,
//         },
//       });
//     }
//   }

//   return (
//     <>
//       <div className='scanner_parent_container'>
//         <h1
//           className='scanner_heading'
//           style={{color: colors.headingColor }}
//         >
//           Scan and Pay
//         </h1>
//         <div className="scanner_img_container">
//           <div
//             className="scanner_childdiv"
//             style={{ textAlign: "center", justifyContent: "center" }}
//           >
//             {scanner.map((scanner) => {
//               return (
//                 <>
//                   <img
//                     src={siteConfig.siteURL + scanner.scanner}
//                     style={{
//                       width: "50vw",
//                       textAlign: "center",
//                       justifyContent: "center",
//                     }}
//                     className="scanner_img"
//                   />

//                   <div className='scan_details_1'>
//                     <span className='scan_details_value'>{scanner.name}</span>
//                   </div>
//                   <div className='scan_details_1'>
//                     <span className='scan_details_value'>{scanner.contact_number}</span>
//                   </div>
//                 </>
//               );
//             })}
//             <br></br>
//           </div>
//         </div>

//         <div className='scanner_btn_container'>
//           <Button
//             htmlType="submit"
//             type="primary"
//             className='scanner_btn_heading'
//             style={{
//               backgroundColor: colors.bannerColor,
//               color: colors.backgroundTheme,
//               border: "none",
//             }}
//             onClick={submitPaymentMode}
//           >
//             {/* Pay and Confirm Order */}
//             Confirm
//           </Button>
//         </div>
//       </div>
//     </>
//   )
// }





import React, { useContext, useEffect, useState } from "react";
import { Button, Alert, Spin, message } from "antd";
import { GlobalContext } from "../../../../context/Context";
import { getAmountQRApi, submitManualPaymentApi } from "../../services/paymentService";
import "../style/Scan.css";

export default function Scanner({ orderId, onSubmitted, handleOk }) {
  const { colors } = useContext(GlobalContext);
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    getAmountQRApi(orderId).then((data) => {
      if (active) setQr(data);
    }).catch((err) => {
      if (active) setError(err.response?.data?.message || err.userMessage || "Unable to load QR");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [orderId]);

  const confirm = async () => {
    setSubmitting(true);
    try {
      await submitManualPaymentApi({ order_id: orderId, method: "UPI", action: "claim" });
      message.success("Payment submitted. Waiting for restaurant verification.");
      if (onSubmitted) onSubmitted();
      if (handleOk) handleOk();
    } catch (err) {
      message.error(err.response?.data?.message || err.userMessage || "Unable to submit payment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="scanner_parent_container">
      <h2 className="scanner_heading" style={{ color: colors.headingColor }}>Scan and Pay</h2>
      {loading ? <Spin /> : error ? <Alert type="warning" showIcon message={error} /> : qr && (
        <div className="scanner_childdiv" style={{ textAlign: "center" }}>
          <img className="scanner_img" src={qr.qr_image} alt="Amount-specific restaurant UPI QR"
            style={{ maxWidth: 270, width: "75%", height: "auto" }} />
          <div className="scan_details_1"><strong>₹{qr.amount}</strong></div>
          <div className="scan_details_1">{qr.payee_name}</div>
          <p>Scan using your UPI app. After paying, tap below. Restaurant will verify your payment.</p>
        </div>
      )}
      <div className="scanner_btn_container">
        <Button className="scanner_btn_heading" type="primary" disabled={!qr || loading}
          loading={submitting} onClick={confirm}
          style={{ backgroundColor: colors.bannerColor, color: colors.backgroundTheme, border: "none" }}>
          I Have Paid
        </Button>
      </div>
    </div>
  );
}
