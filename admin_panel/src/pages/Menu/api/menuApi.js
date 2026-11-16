import httpClient from '../../../http/http_client';

function readBody(response) {
  return response ? response.data : {};
}

export function getMenuCount() {
  return httpClient.get('api/v1/menu-count/').then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getMenuList(filteringCriteria) {
  return httpClient.post('api/v1/menu-list-v2/', filteringCriteria).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getMenuDetails(menuId) {
  return httpClient.get(`/api/v1/menu-details/${menuId}`).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function postMenuDetails(values) {
  return httpClient.post('/api/v1/menu-details/', values, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(readBody).catch((error) => ({ error: error.userMessage }));
}
