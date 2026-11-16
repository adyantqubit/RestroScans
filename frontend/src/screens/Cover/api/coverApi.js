import httpClient from "../../../http/http_client";
import { quiet, readBody } from "../../../http/responses";

const json = { headers: { "Content-Type": "application/json" } };

export function gettenantList(tenantId) {
  return httpClient.get("/tenant-details/", json).then(readBody).catch(quiet);
}
