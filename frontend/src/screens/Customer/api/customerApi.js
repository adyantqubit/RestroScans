import httpClient from "../../../http/http_client";
import { errorBody, quiet, readBody } from "../../../http/responses";

const json = { headers: { "Content-Type": "application/json" } };

export function postCustomerDetails(formdata, tenantId) {
  return httpClient.post("/customer-details/", formdata, json).then(readBody).catch(errorBody);
}

export function checkTableNumberApi(tableNumber, tenantId) {
  return httpClient.get(`/check-table-number/${tableNumber}`, json).then(readBody).catch(quiet);
}

export function sendOrderOtp(contactNumber) {
  return httpClient.post("/otp/send/", { contact_number: contactNumber }, json).then(readBody).catch(errorBody);
}

export function verifyOrderOtp(contactNumber, idToken) {
  return httpClient.post("/otp/verify/", { contact_number: contactNumber, id_token: idToken }, json).then(readBody).catch(errorBody);
}
