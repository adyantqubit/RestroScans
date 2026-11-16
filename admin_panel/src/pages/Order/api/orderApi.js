import httpClient from '../../../http/http_client';

function readBody(response) {
  return response ? response.data : {};
}

const json = { 'Content-Type': 'application/json' };
const form = { 'Content-Type': 'multipart/form-data' };

export function getAllMenuList() {
  return httpClient.get('/api/v1/all-menus/').then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function postOrderItemsApi(data) {
  return httpClient.post('/api/v1/add_order_items/', data, { headers: json }).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getSettingsDetails() {
  return httpClient.get('/api/v1/setting-changes/color/').then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getofferDetails(_tenant, offerId) {
  return httpClient.get(`/api/v1/offer-banner-details/${offerId}`).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getAllOfferList() {
  return httpClient.get('/api/v1/offer-details/').then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function OrderFilterQueryAPI(_tenant, queryData) {
  return httpClient.post('/api/v1/all-order-report-query/', queryData, { headers: json }).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getDashboardData() {
  return httpClient.get('/api/v1/dashboard-data/').then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getOrderCount() {
  return httpClient.get('api/v1/order-count/').then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getOrderItemCountApi() {
  return httpClient.get('/api/v1/order-item-details/').then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getOrderItemDataShowApi() {
  return httpClient.get('/api/v1/order-item-show/').then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getOrderItemsApi(_tenant, id) {
  return httpClient.get(`api/v1/order-items/${id}/`).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getOrdersApi(_tenant, filteringCriteria) {
  return httpClient.post('api/v1/order-list-v2/', filteringCriteria, { headers: json }).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getOrderDetailsApi() {
  return httpClient.get('/api/v1/order-details/').then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function saveOrderDetailsApi(_tenant, value) {
  return httpClient.post('/api/v1/order-details/', value, { headers: form }).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getOrdersItemDetailApi(_tenant, filteringCriteria) {
  return httpClient.post('api/v1/order-item-list-v2/', filteringCriteria, { headers: json }).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getOrderItemDataApi() {
  return httpClient.get('/api/v1/order-item-data/').then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function saveOrderItemDetailsApi(_tenant, value) {
  return httpClient.post('/api/v1/order-item-data/', value, { headers: form }).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function updateOrderItemStatus(_tenant, orderId, items) {
  return httpClient.put(`/api/v1/order-item-update/${orderId}/`, items, { headers: json }).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function postCustomerDetails(formdata) {
  return httpClient.post('api/v1/customer-details/', formdata, { headers: json }).then(readBody).catch((error) => ({ error: error.userMessage }));
}
