import httpClient from "../../../http/http_client";
import { quiet, readBody } from "../../../http/responses";

const json = { headers: { "Content-Type": "application/json" } };

export function postFCMToken(data, tenantId) {
  return httpClient.post("/store-fcm-token/", data, json).then(readBody).catch(quiet);
}
