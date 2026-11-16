import httpClient from '../../../http/http_client';

function readBody(response) {
  return response ? response.data : {};
}

const json = { 'Content-Type': 'application/json' };
const form = { 'Content-Type': 'multipart/form-data' };

export function getSettingsDetails() {
  return httpClient.get('/api/v1/setting-changes/color/').then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function postCustomerDetails(formdata) {
  return httpClient.post('api/v1/customer-details/', formdata, { headers: json }).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getDashboardData() {
  return httpClient.get('/api/v1/dashboard-data/').then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function saveOrderDetailsApi(_tenant, value) {
  return httpClient.post('/api/v1/order-details/', value, { headers: form }).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function updateAllOrderAPI(_tenant, data) {
  return httpClient.post('/api/v1/all-order-status-update/', data, { headers: json }).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function updateItemStatus(_tenant, items, orderId) {
  return httpClient.put(`/api/v1/order-item-status/${orderId}/`, items, { headers: json }).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function updateOrderAndPaymentStatus(_tenant, status, orderId) {
  return httpClient.put(`/api/v1/order-payment-status/${orderId}/`, status, { headers: json }).then(readBody).catch((error) => ({ error: error.userMessage }));
}
