import httpClient from '../../../http/http_client';

function readBody(response) {
  return response ? response.data : {};
}

const form = { 'Content-Type': 'multipart/form-data' };

export function savePaymentMethodApi(_tenant, value) {
  return httpClient.post('/api/v1/get-scanner/', value, { headers: form }).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getPaymentMethodApi() {
  return httpClient.get('/api/v1/get-scanner/').then(readBody).catch((error) => ({ error: error.userMessage }));
}
