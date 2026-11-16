import httpClient from '../../../http/http_client';

function readBody(response) {
  return response ? response.data : {};
}

const json = { 'Content-Type': 'application/json' };
const form = { 'Content-Type': 'multipart/form-data' };

export function saveOrderDetailsApi(_tenant, value) {
  return httpClient.post('/api/v1/order-details/', value, { headers: form }).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function updateItemStatus(_tenant, items, orderId) {
  return httpClient.put(`/api/v1/order-item-status/${orderId}/`, items, { headers: json }).then(readBody).catch((error) => ({ error: error.userMessage }));
}
