import httpClient from '../../../http/http_client';

function readBody(response) {
  return response ? response.data : {};
}

const json = { 'Content-Type': 'application/json' };
const form = { 'Content-Type': 'multipart/form-data' };

export function getOfferBannerCount() {
  return httpClient.get('/api/v1/offer-banner-count/').then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getOfferBannerList(_tenant, filteringCriteria) {
  return httpClient.post('/api/v1/offer-banner-list/', filteringCriteria, { headers: json }).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function postOfferBannerDetails(_tenant, values) {
  return httpClient.post('/api/v1/offer-banner-save/', values, { headers: form }).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getofferDetails(_tenant, offerId) {
  return httpClient.get(`/api/v1/offer-banner-details/${offerId}`).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getMenuCategoryItemOfferDetails(_tenant, offerId) {
  return httpClient.get(`/api/v1/menu-category-item-offer/${offerId}`).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function addOfferItem(payload) {
  return httpClient.post('/api/v1/offer-items-details/', payload, { headers: json }).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function removeOfferItem(id) {
  return httpClient.delete(`/api/v1/offer-items-details/${id}/`).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function savePaymentMethodApi(_tenant, value) {
  return httpClient.post('/api/v1/get-scanner/', value, { headers: form }).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getPaymentMethodApi() {
  return httpClient.get('/api/v1/get-scanner/').then(readBody).catch((error) => ({ error: error.userMessage }));
}
