import httpClient from "../../../http/http_client";
import { quiet, readBody } from "../../../http/responses";

const json = { headers: { "Content-Type": "application/json" } };

export function updateRatingAndReviewApi(tenantId, invoiceData) {
  return httpClient.put("/update-rating-review/", invoiceData, json).then(readBody).catch(quiet);
}
