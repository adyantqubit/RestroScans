import httpClient from '../../../http/http_client';

function readBody(response) {
  return response ? response.data : {};
}

const json = { 'Content-Type': 'application/json' };

export function getCutomersCount() {
  return httpClient.get('/api/v1/customers-count/').then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getCustomerList(_tenant, filteringCriteria) {
  return httpClient.post('/api/v1/customer-list/', filteringCriteria, { headers: json }).then(readBody).catch((error) => ({ error: error.userMessage }));
}
