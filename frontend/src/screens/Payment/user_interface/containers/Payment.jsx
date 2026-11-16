// import React, { useContext, useEffect, useRef, useState } from "react";
// import { Radio, Space, Modal, message, Alert, Spin } from "antd";
// import { GlobalContext } from "../../../../context/Context";
// import "../style/Payment.css";
// import {
//   getManualPaymentApi,
//   submitManualPaymentApi,
// } from "../../services/paymentService";
// import { useNavigate } from "react-router-dom";
// import Scanner from "../components/Scan";
// import cashPayment from "../../../../images/cashPayment.png";
// import scan from "../../../../images/scan.png";
// import { usePaymentState } from "../../usestate/paymentState";
// import { hasFeature } from "../../../../plans";

// const isVerified = (data) =>
//   data?.verification_state === "verified" &&
//   (data?.payment_status === "Completed" || data?.payment_status === "Paid");

// export default function Payment() {
//   const { colors, orders, subscribePlan } = useContext(GlobalContext);
//   const canChoosePayment = hasFeature(subscribePlan, "payment");
//   const navigate = useNavigate();
//   const { value, setValue, isModalOpen, setIsModalOpen } = usePaymentState();
//   const [details, setDetails] = useState(null);
//   const [redeemPoints, setRedeemPoints] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [waitingSeconds, setWaitingSeconds] = useState(0);
//   const orderId = orders?.order_id;
//   const redirected = useRef(false);
//   const requestBusy = useRef(false);
//   const paid = isVerified(details);
//   const awaiting = details?.verification_state === "awaiting_verification";
//   const rejected = details?.verification_state === "rejected";

//   // A visible elapsed-time counter, not a payment deadline. Verification
//   // continues until the restaurant confirms or rejects the claim.
//   useEffect(() => {
//     if (!awaiting) {
//       setWaitingSeconds(0);
//       return undefined;
//     }
//     const startedAt = Date.now();
//     const tick = () => setWaitingSeconds(Math.floor((Date.now() - startedAt) / 1000));
//     tick();
//     const timer = window.setInterval(tick, 1000);
//     return () => window.clearInterval(timer);
//   }, [awaiting, orderId]);

//   const waitingTime = `${String(Math.floor(waitingSeconds / 60)).padStart(2, "0")}:${String(waitingSeconds % 60).padStart(2, "0")}`;

//   useEffect(() => {
//     redirected.current = false;
//     setDetails(null);
//     setRedeemPoints(0);
//     setError("");
//     if (!orderId) return undefined;

//     let active = true;
//     let timer;

//     const poll = async () => {
//       if (!active || requestBusy.current || redirected.current) return;
//       requestBusy.current = true;
//       try {
//         const latest = await getManualPaymentApi(orderId);
//         if (!active) return;
//         setDetails(latest);
//         setError("");
//         if (latest?.method) setValue(latest.method);
//         if (isVerified(latest)) {
//           redirected.current = true;
//           clearInterval(timer);
//           setIsModalOpen(false);
//           message.success("Payment verified. Opening your invoice.");
//           navigate("/billing", { replace: true });
//         }
//       } catch (err) {
//         if (active) {
//           setError(err.response?.data?.message || err.response?.data?.error || err.userMessage || "Could not check payment status");
//         }
//       } finally {
//         requestBusy.current = false;
//         if (active) setLoading(false);
//       }
//     };

//     setLoading(true);
//     poll();
//     // Existing customer verification API is polled only while this page is mounted.
//     // No new API, websocket or global timer is introduced.
//     timer = setInterval(poll, 4000);
//     return () => {
//       active = false;
//       clearInterval(timer);
//     };
//   }, [orderId, navigate, setValue, setIsModalOpen]);

//   const refresh = async () => {
//     if (!orderId || requestBusy.current || redirected.current) return;
//     requestBusy.current = true;
//     setLoading(true);
//     try {
//       const latest = await getManualPaymentApi(orderId);
//       setDetails(latest);
//       setError("");
//       if (latest?.method) setValue(latest.method);
//       if (isVerified(latest)) {
//         redirected.current = true;
//         setIsModalOpen(false);
//         message.success("Payment verified. Opening your invoice.");
//         navigate("/billing", { replace: true });
//       } else {
//         message.info(latest?.verification_state === "rejected"
//           ? "Payment verification was rejected. Please contact the restaurant or retry."
//           : latest?.verification_state === "awaiting_verification"
//             ? "Payment verification is pending. Please wait for the restaurant."
//             : "Payment has not yet been verified.");
//       }
//     } catch (err) {
//       message.error(err.response?.data?.message || err.response?.data?.error || err.userMessage || "Unable to check payment status");
//     } finally {
//       requestBusy.current = false;
//       setLoading(false);
//     }
//   };

//   const cashClaim = async () => {
//     if (!orderId || submitting || awaiting || paid) return;
//     setSubmitting(true);
//     try {
//       const result = await submitManualPaymentApi({ order_id: orderId, method: "Cash", action: "claim", loyalty_points: redeemPoints });
//       setDetails((previous) => ({ ...previous, ...result, verification_state: "awaiting_verification" }));
//       message.success("Cash claim submitted. Waiting for restaurant verification.");
//     } catch (err) {
//       message.error(err.response?.data?.message || err.response?.data?.error || err.userMessage || "Unable to submit cash payment");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <div className="payment_heading_container">
//         <h1 className="payment_heading" style={{ color: colors.headingColor }}>
//           {canChoosePayment ? "Choose Payment Method" : "Pay at the counter"}
//         </h1>
//       </div>
//       {loading && <div style={{ textAlign: "center", margin: 12 }}><Spin /></div>}
//       {error && <Alert type="warning" showIcon message={error} style={{ margin: 12 }} />}
//       {details && (
//         <div style={{ textAlign: "center", margin: 14 }}>
//           <strong>Amount to Pay: ₹{details.amount}</strong>
//           <div style={{ marginTop: 8 }}>
//             {paid ? (
//               <Alert type="success" showIcon message="Payment Confirmed" description="Opening your invoice..." />
//             ) : awaiting ? (
//               <div role="status" aria-live="polite" style={{ border: "1px solid #b6d9ff", background: "#eef7ff", borderRadius: 12, padding: "20px 12px", textAlign: "center" }}>
//                 <Spin size="large" />
//                 <div style={{ marginTop: 12, fontWeight: 700, fontSize: 16 }}>Waiting for restaurant confirmation</div>
//                 <div style={{ fontVariantNumeric: "tabular-nums", fontWeight: 700, fontSize: 24, margin: "8px 0" }}>{waitingTime}</div>
//                 <div style={{ fontSize: 13, lineHeight: 1.6 }}>Your payment claim has been submitted. The restaurant must verify the actual payment before your invoice opens automatically.</div>
//                 <div style={{ fontSize: 12, marginTop: 8, opacity: 0.8 }}>Checking payment status automatically every 4 seconds. Please keep this page open.</div>
//               </div>
//             ) : rejected ? (
//               <Alert type="warning" showIcon message="Payment Verification Rejected" description="Please contact the restaurant or submit payment again." />
//             ) : (
//               <Alert type="info" showIcon message="Payment Not Yet Verified" description="Choose a payment method to continue." />
//             )}
//           </div>
//         </div>
//       )}
//       {details?.loyalty_enabled && !paid && !awaiting && (
//         <div style={{ margin: "12px auto", padding: 14, maxWidth: 460, border: "1px solid #e9d39a", borderRadius: 12, background: "#fffaf0" }}>
//           <strong>🪙 Gold · {details.loyalty_points} available points</strong>
//           <div style={{ marginTop: 8 }}>Use points for a discount (1 point = ₹{details.loyalty_value})</div>
//           <input aria-label="Redeem loyalty points" type="number" min="0" max={details.loyalty_points}
//             value={redeemPoints} onChange={(e) => setRedeemPoints(Math.max(0, Math.min(Number(details.loyalty_points) || 0, Math.floor(Number(e.target.value) || 0))))}
//             style={{ padding: 8, width: 100, marginTop: 8 }} />
//           <div style={{ marginTop: 8 }}>Estimated discount: ₹{(redeemPoints * Number(details.loyalty_value || 0)).toFixed(2)}</div>
//           <small>Final amount is confirmed by the restaurant before payment.</small>
//         </div>
//       )}
//       {canChoosePayment && details && !paid && !awaiting && (
//         <div className="payment_parent_container">
//           <Radio.Group onChange={(event) => setValue(event.target.value)} value={value}>
//             <Space direction="vertical">
//               <div className="payment_child_container">
//                 <Radio id="Cash" value="Cash">
//                   <div className="payment_mode_container">
//                     <div className="payment_mode_img_container">
//                       <img src={cashPayment} alt="Cash" style={{ width: "100%", height: "100%" }} />
//                     </div>
//                     <span className="payment_mode_heading">Cash</span>
//                   </div>
//                 </Radio>
//               </div>
//               <div className="payment_child_container">
//                 <Radio id="Scanner" value="UPI" disabled={!details.upi_available}>
//                   <div className="payment_mode_container">
//                     <div className="payment_mode_img_container">
//                       <img src={scan} alt="UPI QR" style={{ width: "100%", height: "100%" }} />
//                     </div>
//                     <span className="payment_mode_heading">UPI QR</span>
//                   </div>
//                 </Radio>
//               </div>
//             </Space>
//           </Radio.Group>
//         </div>
//       )}
//       <div className="payment_btn_container">
//         {canChoosePayment && details && !paid && !awaiting && (
//           <button
//             className="payment_btn_pay"
//             disabled={submitting || loading || !orderId || details.order_status !== "Served" || (value === "UPI" && !details.upi_available)}
//             style={{ background: colors.bannerColor, color: colors.backgroundTheme }}
//             onClick={() => {
//               if (value === "Cash") cashClaim();
//               else if (value === "UPI") {
//                 setSubmitting(true);
//                 submitManualPaymentApi({ order_id: orderId, method: "UPI", action: "select", loyalty_points: redeemPoints })
//                   .then((result) => { setDetails((previous) => ({ ...previous, ...result })); setIsModalOpen(true); })
//                   .catch((err) => message.error(err.response?.data?.message || err.response?.data?.error || "Could not apply loyalty points"))
//                   .finally(() => setSubmitting(false));
//               }
//               else message.warning("Please select a payment method.");
//             }}
//           >
//             {submitting ? "Submitting..." : value === "Cash" ? "I Have Given Cash" : "Scan and Pay"}
//           </button>
//         )}
//         {!awaiting && <button
//           className="payment_btn_get_bill"
//           disabled={loading || !details}
//           style={{ background: paid ? colors.bannerColor : "grey", color: colors.backgroundTheme }}
//           onClick={refresh}
//         >
//           {paid ? "Open Invoice" : "Check Payment Status"}
//         </button>}
//       </div>
//       <Modal footer={null} visible={isModalOpen} onCancel={() => setIsModalOpen(false)}>
//         {orderId && (
//           <Scanner
//             orderId={orderId}
//             handleOk={() => setIsModalOpen(false)}
//             onSubmitted={() => {
//               setIsModalOpen(false);
//               setDetails((previous) => previous ? { ...previous, verification_state: "awaiting_verification" } : previous);
//             }}
//           />
//         )}
//       </Modal>
//     </>
//   );
// }

import React, { useContext, useEffect, useRef, useState } from "react";
import { Radio, Space, Modal, message, Alert, Spin } from "antd";
import { GlobalContext } from "../../../../context/Context";
import "../style/Payment.css";
import {
  getManualPaymentApi,
  submitManualPaymentApi,
} from "../../services/paymentService";
import { useNavigate } from "react-router-dom";
import Scanner from "../components/Scan";
import cashPayment from "../../../../images/cashPayment.png";
import scan from "../../../../images/scan.png";
import { usePaymentState } from "../../usestate/paymentState";
import { hasFeature } from "../../../../plans";

const isVerified = (data) =>
  data?.verification_state === "verified" &&
  (data?.payment_status === "Completed" || data?.payment_status === "Paid");

export default function Payment() {
  const { colors, orders, subscribePlan } = useContext(GlobalContext);
  const canChoosePayment = hasFeature(subscribePlan, "payment");
  const navigate = useNavigate();
  const { value, setValue, isModalOpen, setIsModalOpen } = usePaymentState();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [waitingSeconds, setWaitingSeconds] = useState(0);
  const orderId = orders?.order_id;
  const redirected = useRef(false);
  const requestBusy = useRef(false);
  const paid = isVerified(details);
  const awaiting = details?.verification_state === "awaiting_verification";
  const rejected = details?.verification_state === "rejected";

  // A visible elapsed-time counter, not a payment deadline. Verification
  // continues until the restaurant confirms or rejects the claim.
  useEffect(() => {
    if (!awaiting) {
      setWaitingSeconds(0);
      return undefined;
    }
    const startedAt = Date.now();
    const tick = () => setWaitingSeconds(Math.floor((Date.now() - startedAt) / 1000));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [awaiting, orderId]);

  const waitingTime = `${String(Math.floor(waitingSeconds / 60)).padStart(2, "0")}:${String(waitingSeconds % 60).padStart(2, "0")}`;

  useEffect(() => {
    redirected.current = false;
    setDetails(null);
    setError("");
    if (!orderId) return undefined;

    let active = true;
    let timer;

    const poll = async () => {
      if (!active || requestBusy.current || redirected.current) return;
      requestBusy.current = true;
      try {
        const latest = await getManualPaymentApi(orderId);
        if (!active) return;
        setDetails(latest);
        setError("");
        if (latest?.method) setValue(latest.method);
        if (isVerified(latest)) {
          redirected.current = true;
          clearInterval(timer);
          setIsModalOpen(false);
          message.success("Payment verified. Opening your invoice.");
          navigate("/billing", { replace: true });
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || err.response?.data?.error || err.userMessage || "Could not check payment status");
        }
      } finally {
        requestBusy.current = false;
        if (active) setLoading(false);
      }
    };

    setLoading(true);
    poll();
    // Existing customer verification API is polled only while this page is mounted.
    // No new API, websocket or global timer is introduced.
    timer = setInterval(poll, 4000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [orderId, navigate, setValue, setIsModalOpen]);

  const refresh = async () => {
    if (!orderId || requestBusy.current || redirected.current) return;
    requestBusy.current = true;
    setLoading(true);
    try {
      const latest = await getManualPaymentApi(orderId);
      setDetails(latest);
      setError("");
      if (latest?.method) setValue(latest.method);
      if (isVerified(latest)) {
        redirected.current = true;
        setIsModalOpen(false);
        message.success("Payment verified. Opening your invoice.");
        navigate("/billing", { replace: true });
      } else {
        message.info(latest?.verification_state === "rejected"
          ? "Payment verification was rejected. Please contact the restaurant or retry."
          : latest?.verification_state === "awaiting_verification"
            ? "Payment verification is pending. Please wait for the restaurant."
            : "Payment has not yet been verified.");
      }
    } catch (err) {
      message.error(err.response?.data?.message || err.response?.data?.error || err.userMessage || "Unable to check payment status");
    } finally {
      requestBusy.current = false;
      setLoading(false);
    }
  };

  const cashClaim = async () => {
    if (!orderId || submitting || awaiting || paid) return;
    setSubmitting(true);
    try {
      const result = await submitManualPaymentApi({ order_id: orderId, method: "Cash", action: "claim" });
      setDetails((previous) => ({ ...previous, ...result, verification_state: "awaiting_verification" }));
      message.success("Cash claim submitted. Waiting for restaurant verification.");
    } catch (err) {
      message.error(err.response?.data?.message || err.response?.data?.error || err.userMessage || "Unable to submit cash payment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="payment_heading_container">
        <h1 className="payment_heading" style={{ color: colors.headingColor }}>
          {canChoosePayment ? "Choose Payment Method" : "Pay at the counter"}
        </h1>
      </div>
      {loading && <div style={{ textAlign: "center", margin: 12 }}><Spin /></div>}
      {error && <Alert type="warning" showIcon message={error} style={{ margin: 12 }} />}
      {details && (
        <div style={{ textAlign: "center", margin: 14 }}>
          <strong>Amount to Pay: ₹{details.amount}</strong>
          <div style={{ marginTop: 8 }}>
            {paid ? (
              <Alert type="success" showIcon message="Payment Confirmed" description="Opening your invoice..." />
            ) : awaiting ? (
              <div role="status" aria-live="polite" style={{ border: "1px solid #b6d9ff", background: "#eef7ff", borderRadius: 12, padding: "20px 12px", textAlign: "center" }}>
                <Spin size="large" />
                <div style={{ marginTop: 12, fontWeight: 700, fontSize: 16 }}>Waiting for restaurant confirmation</div>
                <div style={{ fontVariantNumeric: "tabular-nums", fontWeight: 700, fontSize: 24, margin: "8px 0" }}>{waitingTime}</div>
                <div style={{ fontSize: 13, lineHeight: 1.6 }}>Your payment claim has been submitted. The restaurant must verify the actual payment before your invoice opens automatically.</div>
                <div style={{ fontSize: 12, marginTop: 8, opacity: 0.8 }}>Checking payment status automatically every 4 seconds. Please keep this page open.</div>
              </div>
            ) : rejected ? (
              <Alert type="warning" showIcon message="Payment Verification Rejected" description="Please contact the restaurant or submit payment again." />
            ) : (
              <Alert type="info" showIcon message="Payment Not Yet Verified" description="Choose a payment method to continue." />
            )}
          </div>
        </div>
      )}
      {canChoosePayment && details && !paid && !awaiting && (
        <div className="payment_parent_container">
          <Radio.Group onChange={(event) => setValue(event.target.value)} value={value}>
            <Space direction="vertical">
              <div className="payment_child_container">
                <Radio id="Cash" value="Cash">
                  <div className="payment_mode_container">
                    <div className="payment_mode_img_container">
                      <img src={cashPayment} alt="Cash" style={{ width: "100%", height: "100%" }} />
                    </div>
                    <span className="payment_mode_heading">Cash</span>
                  </div>
                </Radio>
              </div>
              <div className="payment_child_container">
                <Radio id="Scanner" value="UPI" disabled={!details.upi_available}>
                  <div className="payment_mode_container">
                    <div className="payment_mode_img_container">
                      <img src={scan} alt="UPI QR" style={{ width: "100%", height: "100%" }} />
                    </div>
                    <span className="payment_mode_heading">UPI QR</span>
                  </div>
                </Radio>
              </div>
            </Space>
          </Radio.Group>
        </div>
      )}
      <div className="payment_btn_container">
        {canChoosePayment && details && !paid && !awaiting && (
          <button
            className="payment_btn_pay"
            disabled={submitting || loading || !orderId || details.order_status !== "Served" || (value === "UPI" && !details.upi_available)}
            style={{ background: colors.bannerColor, color: colors.backgroundTheme }}
            onClick={() => {
              if (value === "Cash") cashClaim();
              else if (value === "UPI") {
                setSubmitting(true);
                submitManualPaymentApi({ order_id: orderId, method: "UPI", action: "select" })
                  .then((result) => { setDetails((previous) => ({ ...previous, ...result })); setIsModalOpen(true); })
                  .catch((err) => message.error(err.response?.data?.message || err.response?.data?.error || "Could not apply loyalty points"))
                  .finally(() => setSubmitting(false));
              }
              else message.warning("Please select a payment method.");
            }}
          >
            {submitting ? "Submitting..." : value === "Cash" ? "I Have Given Cash" : "Scan and Pay"}
          </button>
        )}
        {!awaiting && <button
          className="payment_btn_get_bill"
          disabled={loading || !details}
          style={{ background: paid ? colors.bannerColor : "grey", color: colors.backgroundTheme }}
          onClick={refresh}
        >
          {paid ? "Open Invoice" : "Check Payment Status"}
        </button>}
      </div>
      <Modal footer={null} visible={isModalOpen} onCancel={() => setIsModalOpen(false)}>
        {orderId && (
          <Scanner
            orderId={orderId}
            handleOk={() => setIsModalOpen(false)}
            onSubmitted={() => {
              setIsModalOpen(false);
              setDetails((previous) => previous ? { ...previous, verification_state: "awaiting_verification" } : previous);
            }}
          />
        )}
      </Modal>
    </>
  );
}
