import httpClient from "../../../http/http_client";
import { quiet, readBody } from "../../../http/responses";

const json = { headers: { "Content-Type": "application/json" } };

export function getBillingDataAPI(data, tenantId) {
  return httpClient.post("/get_billing_data/", data, json).then(readBody).catch(quiet);
}
