import {
  getCustomerReportApi,
  OrderFilterQueryAPI,
  getOrdersItemDetailApi,
  getOrderItemsApi,
  getOrderCount,
  OrderItemFilterQueryAPI,
} from '../api/reportApi';

export function loadCustomerReport(_tenant, filteringCriteria) {
  return getCustomerReportApi(_tenant, filteringCriteria);
}

export function loadOrderReport(_tenant, queryData) {
  return OrderFilterQueryAPI(_tenant, queryData);
}

export function displayDateTime(format) {
  return {
    date: format.substring(0, 10).split("-").reverse().join("/"),
    time: format.substring(11, 19),
  };
}

export function monthDateRange(now) {
  var date = now || new Date();
  return {
    from: new Date(date.getFullYear(), date.getMonth(), 1),
    to: new Date(date.getFullYear(), date.getMonth() + 1, 0),
  };
}

export function weekDateRange(now) {
  var curr = new Date(now || new Date());
  var first = curr.getDate() - curr.getDay();
  var last = first - 6;
  var firstday = new Date(curr.setDate(first));
  var lastday = new Date(curr.setDate(last));
  return { from: lastday, to: firstday };
}

export function yearDateRange(now) {
  var curr = new Date(now || new Date());
  var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
  var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() - 365));
  return { from: lastday, to: firstday };
}

export function todayDateRange(now) {
  var curr = new Date(now || new Date());
  var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
  var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
  return { from: lastday, to: firstday };
}

export function loadOrderItemPage(_tenant, filteringCriteria) {
  return getOrdersItemDetailApi(_tenant, filteringCriteria);
}

export function loadOrderItems(_tenant, id) {
  return getOrderItemsApi(_tenant, id);
}

export function loadOrderCount() {
  return getOrderCount();
}

export function loadOrderItemReport(_tenant, queryData) {
  return OrderItemFilterQueryAPI(_tenant, queryData);
}
