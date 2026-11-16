import API from '../../../http/http_client';

export function listDiningTables() {
  return API.get('/api/v1/dining-tables/').then((response) => response.data);
}

export function pageDiningTables(query) {
  return API.post('/api/v1/dining-tables-page/', query).then((response) => response.data);
}

export function createDiningTable(payload) {
  return API.post('/api/v1/dining-tables/', payload).then((response) => response.data);
}

export function updateDiningTable(id, payload) {
  return API.put(`/api/v1/dining-tables/${id}/`, payload).then((response) => response.data);
}

export function deleteDiningTable(id) {
  return API.delete(`/api/v1/dining-tables/${id}/`).then((response) => response.data);
}

export function listRestaurantFloors() { return API.get('/api/v1/restaurant-floors/').then(r => r.data); }
export function createRestaurantFloor(name) { return API.post('/api/v1/restaurant-floors/', { name }).then(r => r.data); }
export function updateRestaurantFloor(id, payload) { return API.put(`/api/v1/restaurant-floors/${id}/`, payload).then(r => r.data); }
export function deleteRestaurantFloor(id) { return API.delete(`/api/v1/restaurant-floors/${id}/`).then(r => r.data); }
