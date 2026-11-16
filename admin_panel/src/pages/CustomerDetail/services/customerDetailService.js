import {
  getCutomersCount,
  getCustomerList,
} from '../api/customerDetailApi';

export function loadCustomerCount() {
  return getCutomersCount();
}

export function loadCustomers(_tenant, filteringCriteria) {
  return getCustomerList(_tenant, filteringCriteria);
}
