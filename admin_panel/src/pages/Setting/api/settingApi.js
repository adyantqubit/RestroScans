import httpClient from '../../../http/http_client';

function readBody(response) {
  return response ? response.data : {};
}

export function getSettingsDetails() {
  return httpClient.get('/api/v1/app-theme/').then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function postSettingsDetails(values) {
  return httpClient.post('/api/v1/app-theme/', values).then(readBody).catch((error) => ({ error: error.userMessage }));
}


// Restaurant UPI configuration, using existing authenticated httpClient.
export function getRestaurantUPISettings() {
  return httpClient.get('/api/v1/manual-payment/upi-settings/').then(readBody);
}

export function putRestaurantUPISettings(values) {
  return httpClient.put('/api/v1/manual-payment/upi-settings/', values).then(readBody);
}
