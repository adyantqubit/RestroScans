import httpClient from "../../../http/http_client";
import { quiet, readBody } from "../../../http/responses";

const json = { headers: { "Content-Type": "application/json" } };

export function getfooterDetails(tenantId) {
  return httpClient.get("/footer-description/", json).then(readBody).catch(quiet);
}

export function getSocialLinks(tenantId) {
  return httpClient.get("/social-links/", json).then(readBody).catch(quiet);
}
