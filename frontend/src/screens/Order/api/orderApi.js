import httpClient from "../../../http/http_client";
import { quiet, readBody } from "../../../http/responses";

const json = { headers: { "Content-Type": "application/json" } };

export function getOrderItemsAndOrderAPI(data, tenantId) {
  return httpClient.post("/get_order_items_and_order/", data, json).then(readBody).catch(quiet);
}

export function CheckOrderConfirmAPI(order, tenantId) {
  return httpClient.post("/check-order-confirm/", order, json).then(readBody).catch(quiet);
}
