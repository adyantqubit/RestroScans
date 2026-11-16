import httpClient from '../../../http/http_client';
import { domainURL } from '../../../config/config';

function readBody(response) {
  return response ? response.data : {};
}

function readErrorBody(err) {
  return err?.response?.data || {};
}

const json = { 'Content-Type': 'application/json' };
const form = { 'Content-Type': 'multipart/form-data' };

export function postRestaurantDetail(value) {
  return httpClient.post(`/admin_app/${domainURL}/registration-request/`, value, { headers: form }).then(readBody).catch(readErrorBody);
}

export function restaurentAuthentication(value) {
  return httpClient.post(`/admin_app/${domainURL}/login/`, value, { headers: json }).then(readBody).catch(readErrorBody);
}

export function sendOtpApi(value) {
  return httpClient.post(`/admin_app/${domainURL}/save-otp/`, value, { headers: json }).then(readBody).catch(readErrorBody);
}

export function updatePasswordApi(value) {
  return httpClient.post(`/admin_app/${domainURL}/update-password/`, value, { headers: json }).then(readBody).catch(readErrorBody);
}

export function waiterAuthentication(tenant, value) {
  const headers = tenant ? { ...json, 'X-Tenant': String(tenant).trim().toLowerCase() } : json;
  return httpClient.post('/api/v1/waiter-login/', value, { headers }).then(readBody).catch(readErrorBody);
}

export function tokenValidationAPI(value) {
  return httpClient.post(`/admin_app/${domainURL}/validate-token/`, value, { headers: json })
    .then((response) => (response?.data?.access_token ? response.data : false))
    .catch(() => false);
}
