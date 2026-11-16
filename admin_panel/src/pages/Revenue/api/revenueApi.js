import httpClient from '../../../http/http_client';

function readBody(response) {
  return response ? response.data : {};
}

export function getOrderReport() {
  return httpClient.get('/api/v1/revenue-order-report/').then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getTotalRevenueDetails() {
  return httpClient.get('/api/v1/total-revenue-details/').then(readBody).catch((error) => ({ error: error.userMessage }));
}
