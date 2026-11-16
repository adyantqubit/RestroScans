import httpClient from "../../../http/http_client";
import { quiet, readBody } from "../../../http/responses";

const json = { headers: { "Content-Type": "application/json" } };

export function postReservationsAPI(data, tenantId) {
  return httpClient.post("/post_reservations/", data, json).then(readBody).catch(quiet);
}
