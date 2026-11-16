import httpClient from "../../../http/http_client";
import { quiet, readBody } from "../../../http/responses";

const json = { headers: { "Content-Type": "application/json" } };

export function getmenuList(tenantId) {
  return httpClient.get("/menu-list/", json).then(readBody).catch(quiet);
}

export function getofferDetails(tenantId) {
  return httpClient.get("/offer-details/", json).then(readBody).catch(quiet);
}

export function postRatingReview(formdata, tenantId) {
  return httpClient.post("/rating-review/", formdata, json).then(readBody).catch(quiet);
}
