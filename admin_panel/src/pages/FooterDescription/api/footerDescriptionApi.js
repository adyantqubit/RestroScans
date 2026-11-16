import httpClient from '../../../http/http_client';

function readBody(response) {
  return response ? response.data : {};
}

export function getFooterDescriptionApi() {
  return httpClient.get('/api/v1/footer-description/').then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function saveFooterDescriptionApi(_tenant, value) {
  return httpClient.post('/api/v1/footer-description/', value).then(readBody).catch((error) => ({ error: error.userMessage }));
}
