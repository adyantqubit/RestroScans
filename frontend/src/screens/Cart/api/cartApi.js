import httpClient from "../../../http/http_client";
import { quiet, readBody } from "../../../http/responses";

const json = { headers: { "Content-Type": "application/json" } };

export function updateOrdersApi(tenantId, cartData) {
  return httpClient.put("/update-orders/", cartData, json).then(readBody).catch(quiet);
}

export function postUpdateOrderItems(tenantId, updateOrderItems) {
  return httpClient.put("/update_order_items/", updateOrderItems, json).then(readBody).catch(quiet);
}

export function deleteOrderItems(tenantId, deleteOrderItem) {
  return httpClient.put("/delete_order_items/", deleteOrderItem, json).then(readBody).catch(quiet);
}
