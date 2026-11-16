import httpClient from "../../../http/http_client";
import { quiet, readBody } from "../../../http/responses";

const json = { headers: { "Content-Type": "application/json" } };

export function getThemeChanges(tenantId) {
  return httpClient.get("/setting-changes/color/", json).then(readBody).catch(quiet);
}
