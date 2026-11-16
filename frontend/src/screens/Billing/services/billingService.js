import { getBillingDataAPI as requestBillingData } from "../api/billingApi";

export function getBillingDataAPI(data, tenantId) {
  return requestBillingData(data, tenantId);
}

export function extractBillDateTime(format) {
  var date = format?.substring(0, 10);
  var time = format?.substring(11, 19);
  return { date, time };
}

export function billSubtotal(items) {
  var total = 0;
  (items || []).filter((row) => {
    if (row.item_status != "Cancelled") {
      total += row.price;
    }
  });
  return total;
}
