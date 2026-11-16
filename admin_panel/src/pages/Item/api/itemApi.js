import httpClient from '../../../http/http_client';

function readBody(response) {
  return response ? response.data : {};
}

export function getItemCount() {
  return httpClient.get('api/v1/item-count/').then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getItemList(filteringCriteria) {
  return httpClient.post('api/v1/item-list-v2/', filteringCriteria).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getItemDetails(itemId) {
  return httpClient.get(`/api/v1/item-details/${itemId}`).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function postItemDetails(values) {
  return httpClient.post('/api/v1/item-details/', values, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getCategories() {
  return httpClient.get('/api/v1/get-categories/').then(readBody).catch((error) => ({ error: error.userMessage }));
}
