import {
  postCustomerDetails as requestCustomerDetails,
  checkTableNumberApi as requestTableNumber,
  sendOrderOtp as requestSendOrderOtp,
  verifyOrderOtp as requestVerifyOrderOtp,
} from "../api/customerApi";

export function postCustomerDetails(formdata, tenantId) {
  var fcmToken = localStorage.getItem("fcmToken");
  if (fcmToken) formdata["fcmToken"] = fcmToken;
  return requestCustomerDetails(formdata, tenantId);
}

export function checkTableNumberApi(tableNumber, tenantId) {
  return requestTableNumber(tableNumber, tenantId);
}

export function customerOrderDraft(formdata, cart, restaurantName) {
  return {
    name: formdata.name ? formdata.name : "",
    email: formdata.email ? formdata.email : "",
    contact_number: formdata.contact_number,
    table_number: formdata.table_number,
    dining_table: formdata.dining_table || null,
    cart: cart,
    tenant: restaurantName,
    order_created_by: "Customer",
  };
}

export function sendOrderOtp(contactNumber) {
  return requestSendOrderOtp(contactNumber);
}

export function verifyOrderOtp(contactNumber, idToken) {
  return requestVerifyOrderOtp(contactNumber, idToken);
}
