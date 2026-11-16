import httpClient from '../../../http/http_client';

function readBody(response) {
  return response ? response.data : {};
}

export function getCategoryCount() {
  return httpClient.get('api/v1/category-count/').then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getCategoryList(filteringCriteria) {
  return httpClient.post('api/v1/category-list-v2/', filteringCriteria).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getCategoryDetails(categoryId) {
  return httpClient.get(`/api/v1/category-details/${categoryId}`).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function postCategoryDetails(values) {
  return httpClient.post('/api/v1/category-details/', values, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getMenus() {
  return httpClient.get('/api/v1/get-menus/').then(readBody).catch((error) => ({ error: error.userMessage }));
}
