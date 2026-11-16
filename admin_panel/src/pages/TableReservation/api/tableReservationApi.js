import httpClient from '../../../http/http_client';

function readBody(response) {
  return response ? response.data : {};
}

const json = { 'Content-Type': 'application/json' };

export function updateReservationApi(_tenant, value) {
  return httpClient.post('/api/v1/update-reservation/', value, { headers: json }).then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getReservationListApi(_tenant, filteringCriteria) {
  return httpClient.post('/api/v1/get_reservations_list/', filteringCriteria, { headers: json }).then(readBody).catch((error) => ({ error: error.userMessage }));
}
