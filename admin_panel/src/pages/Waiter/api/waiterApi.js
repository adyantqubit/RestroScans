import httpClient from '../../../http/http_client';

function readBody(response) {
  return response ? response.data : {};
}

const json = { 'Content-Type': 'application/json' };

export function getWaiterListApi() {
  return httpClient.get('/api/v1/waiter-list/').then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getWaiterPageApi(query) {
  return httpClient.post('/api/v1/waiter-page/', query, { headers: json }).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function waiterDashboardData(_tenant, waiterId) {
  return httpClient.get(`/api/v1/waiter-dashboard/${waiterId}/`).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function postWaiterListApi(_tenant, data) {
  return httpClient.post('/api/v1/waiter-list/', data, { headers: json }).then(readBody).catch((error) => ({ error: error.userMessage }));
}
