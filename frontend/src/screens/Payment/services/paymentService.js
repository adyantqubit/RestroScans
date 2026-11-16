import {
  updatePaymentModeApi as requestUpdatePaymentMode,
  getScannerApi as requestScanner,
  postCheckPaymentStatus as requestCheckPaymentStatus,
  getPaymentModeApi as requestPaymentMode,
} from "../api/paymentApi";

export function updatePaymentModeApi(tenantId, order) {
  return requestUpdatePaymentMode(tenantId, order);
}

export function getScannerApi(tenantId) {
  return requestScanner(tenantId);
}

export function postCheckPaymentStatus(order, tenantId) {
  return requestCheckPaymentStatus(order, tenantId);
}

export function getPaymentModeApi(tenantName, id) {
  return requestPaymentMode(tenantName, id);
}

export function paymentModeBody(orderId, paymentMode) {
  return { order_id: orderId, payment_mode: paymentMode };
}

export function paymentStatusBody(orderId) {
  return { order_id: orderId };
}


// Phase 2: preserve existing API/service layering.
export { getManualPaymentApi, submitManualPaymentApi, getAmountQRApi } from "../api/paymentApi";
