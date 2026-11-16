import httpClient from '../../../http/http_client';

function readBody(response) {
  return response ? response.data : {};
}

const form = { 'Content-Type': 'multipart/form-data' };

export function deteleSocialMediaApi(_tenant, id) {
  return httpClient.delete(`/api/v1/social-links/${id}`).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getSettingsDetails() {
  return httpClient.get('/api/v1/setting-changes/color/').then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getSocialMediaApi() {
  return httpClient.get('/api/v1/social-links/').then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getSocialPageApi(query) {
  return httpClient.post('/api/v1/social-links-page/', query).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function postSettingsDetails(values) {
  return httpClient.post('/api/v1/setting-changes/color/', values).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function saveSocialMediaApi(value) {
  return httpClient.post('/api/v1/social-links/', value, { headers: form }).then(readBody).catch((error) => ({ error: error.userMessage }));
}
