import httpClient from "../../../http/http_client";
import { quiet, readBody } from "../../../http/responses";

const json = { headers: { "Content-Type": "application/json" } };

export function updatePaymentModeApi(tenantId, order) {
  return httpClient.put("/update-payment-mode/", order, json).then(readBody).catch(quiet);
}

export function getScannerApi(tenantId) {
  return httpClient.get("/get-scanner/", json).then(readBody).catch(quiet);
}

export function postCheckPaymentStatus(order, tenantId) {
  return httpClient.post("/check-payment-status/", order, json).then(readBody).catch(quiet);
}

export function getPaymentModeApi(tenantName, id) {
  return httpClient.get(`/get-payment-mode/${id}`, json).then(readBody).catch(quiet);
}


// Phase 2: extend the existing shared payment API; same httpClient/tenant headers.
export function getManualPaymentApi(orderId) {
  return httpClient.get("/customer-manual-payment/", { params: { order_id: orderId } }).then(readBody);
}
export function submitManualPaymentApi(payload) {
  return httpClient.post("/customer-manual-payment/", payload, json).then(readBody);
}
export function getAmountQRApi(orderId) {
  return httpClient.get("/customer-amount-qr/", { params: { order_id: orderId } }).then(readBody);
}
