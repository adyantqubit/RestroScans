import httpClient from '../../../http/http_client';

function readBody(response) {
  return response ? response.data : {};
}

const json = { 'Content-Type': 'application/json' };

export function getCustomerReportApi(_tenant, filteringCriteria) {
  return httpClient.post('/api/v1/get-customer-report/', filteringCriteria, { headers: json }).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function OrderFilterQueryAPI(_tenant, queryData) {
  return httpClient.post('/api/v1/all-order-report-query/', queryData, { headers: json }).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getOrdersItemDetailApi(_tenant, filteringCriteria) {
  return httpClient.post('api/v1/order-item-list-v2/', filteringCriteria, { headers: json }).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getOrderItemsApi(_tenant, id) {
  return httpClient.get(`api/v1/order-items/${id}/`).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getOrderCount() {
  return httpClient.get('api/v1/order-count/').then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function OrderItemFilterQueryAPI(_tenant, queryData) {
  return httpClient.post('/api/v1/all-order-item-report-query/', queryData, { headers: json }).then(readBody).catch((error) => ({ error: error.userMessage }));
}
