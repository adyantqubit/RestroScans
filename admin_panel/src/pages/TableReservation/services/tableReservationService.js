import {
  getReservationListApi,
  updateReservationApi,
} from '../api/tableReservationApi';

export function loadReservations(_tenant, filteringCriteria) {
  return getReservationListApi(_tenant, filteringCriteria);
}

export function saveReservation(_tenant, value) {
  return updateReservationApi(_tenant, value);
}
