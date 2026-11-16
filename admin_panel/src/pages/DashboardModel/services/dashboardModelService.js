import {
  saveOrderDetailsApi,
  updateItemStatus,
} from '../api/dashboardModelApi';

export function saveOrderDetails(_tenant, value) {
  return saveOrderDetailsApi(_tenant, value);
}

export function saveItemStatus(_tenant, items, orderId) {
  return updateItemStatus(_tenant, items, orderId);
}
