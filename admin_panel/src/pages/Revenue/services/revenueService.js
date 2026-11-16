import {
  getOrderReport,
  getTotalRevenueDetails,
} from '../api/revenueApi';

export function loadOrderReport() {
  return getOrderReport();
}

export function loadRevenueTotals() {
  return getTotalRevenueDetails();
}
