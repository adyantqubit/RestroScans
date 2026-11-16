import { postReservationsAPI as requestReservations } from "../api/reservationApi";

export function postReservationsAPI(data, tenantId) {
  return requestReservations(data, tenantId);
}
