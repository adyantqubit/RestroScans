import httpClient from '../../../http/http_client';
import { domainURL } from '../../../config/config';

function readBody(response) {
  return response ? response.data : {};
}

export function getAdminAppSettings() {
  return httpClient.get(`/admin_app/${domainURL}/app-settings/`).then(readBody).catch((error) => ({ error: error.userMessage }));
}
