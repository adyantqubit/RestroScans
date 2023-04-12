import API from "./API";

// -------------------------- FOR SHOW THE TENANT DETAILS -------------------------

export const gettenantList = async (tenantId) => {
  const response = await API.get(`/${tenantId}/tenant-details/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};

// -------------------------- FOR SHOW THE MENU LIST -------------------------

export const getmenuList = async (tenantId) => {
  const response = await API.get(`/${tenantId}/menu-list/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};

// -------------------------- FOR SHOW THE OFFER LIST -------------------------

export const getofferDetails = async (tenantId) => {
  const response = await API.get(`/${tenantId}/offer-details/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};

// -------------------------- FOR SHOW THE FOOTER AND DESCRIPTION -------------------------

export const getfooterDetails = async (tenantId) => {
  const response = await API.get(`/${tenantId}/footer-description/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};

// -------------------------- FOR SHOW THE FOOTER AND DESCRIPTION -------------------------

export const getThemeChanges = async (tenantId) => {
  const response = await API.get(`/${tenantId}/setting-changes/color/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  console.log(response)
  return response ? response.data : {};
};

// Added by :- Parineeta Gedam
// Date :- 06-04-2023
// Reason :- Post API for customer details and orders.
export const postCustomerDetails = async(formdata,tenantId) => {
  const response = await API.post(`/${tenantId}/customer-details/`,formdata,
  {headers : {'Content-Type':'application/json'}}).catch(
      err => console.log(err))
  return response ? response.data: {}
}
// End of added code 006-04-2023

// Added by :- Parineeta Gedam
// Date :- 09-04-2023
// Reason :- update the order items when user again add the items in cart
export const updateOrders = async(tenantId,cartData) => {
  const response = await API.put(`/${tenantId}/update-orders/`,cartData,
  {headers : {'Content-Type':'application/json'}}).catch(
      err => console.log(err))
  return response ? response.data: {}
}
// End of added code 09-04-2023

// Added by :- Parineeta Gedam
// Date :- 09-04-2023
// Reason :- update the order items like rating and review
export const updateOrderItemsApi = async(tenantId,orderId) => {
  const response = await API.put(`/${tenantId}/get-order-items/`,{"id":orderId},
  {headers : {'Content-Type':'application/json'}}).catch(
      err => console.log(err))
  return response ? response.data: {}
}
// End of added code 09-04-2023


// Added by :- Parineeta Gedam
// Date :- 09-04-2023
// Reason :- update the payment mode
export const updatePaymentModeApi = async(tenantId,order) => {
  const response = await API.put(`/${tenantId}/update-payment-mode/`,order,
  {headers : {'Content-Type':'application/json'}}).catch(
      err => console.log(err))
  return response ? response.data: {}
}
// End of added code 09-04-2023

// Added by :- Parineeta Gedam
// Date :- 09-04-2023
// Reason :- update the rating and review
export const updateRatingAndReviewApi = async(tenantId,invoiceData) => {
  const response = await API.put(`/${tenantId}/update-rating-review/`,invoiceData,
  {headers : {'Content-Type':'application/json'}}).catch(
      err => console.log(err))
  return response ? response.data: {}
}
// End of added code 09-04-2023


// Added by :- Parineeta Gedam
// Date :- 09-04-2023
// Reason :- get scanner
export const getScannerApi = async(tenantId) => {
  const response = await API.get(`/${tenantId}/get-scanner/`,
  {headers : {'Content-Type':'application/json'}}).catch(
      err => console.log(err))
  return response ? response.data: {}
}
// End of added code 09-04-2023