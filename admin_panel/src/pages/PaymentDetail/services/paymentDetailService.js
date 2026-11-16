import {
  getPaymentMethodApi,
  savePaymentMethodApi,
} from '../api/paymentDetailApi';

export function loadPaymentMethod() {
  return getPaymentMethodApi();
}

export function savePaymentMethod(_tenant, value) {
  return savePaymentMethodApi(_tenant, value);
}
