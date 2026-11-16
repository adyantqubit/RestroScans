import {
  getWaiterListApi,
  getWaiterPageApi,
  waiterDashboardData,
  postWaiterListApi,
} from '../api/waiterApi';

export function loadWaiters() {
  return getWaiterListApi();
}

export function loadWaiterPage(query) {
  const body = {
    paginationDetails: {
      currentPage: query.currentPage,
      listPerPage: query.listPerPage,
    },
    columnToSort: query.columnToSort,
    columnSortingOrder: query.columnSortingOrder,
    searchText: (query.searchText || '').trim(),
  };
  if (query.filters && Object.keys(query.filters).length) {
    body.filters = query.filters;
  }
  return getWaiterPageApi(body);
}

export function loadWaiterDashboard(_tenant, waiterId) {
  return waiterDashboardData(_tenant, waiterId);
}

export function waiterFieldError(errorText, field, value) {
  if (field === "name") {
    if (value.length == 0) errorText.nameError = "Name should not be blank";
    else if (value.length < 2) errorText.nameError = "Name should not be less than 2 characters";
    else delete errorText.nameError;
  }
  if (field === "contact_number") {
    if (value.length == 0) errorText.numberError = "Number should not be blank";
    else if (value.length < 10) errorText.numberError = "Number should not be less than 10 digits";
    else if (value.length > 10) errorText.numberError = "Number should not be more than 10 digits";
    else delete errorText.numberError;
  }
  if (field == "reset_password") {
    if (value.length > 0 && value.length < 5) errorText.passError = "Password should not be less than 5 characters";
    else delete errorText.passError;
  }
  if (field == "password") {
    if (value.length == 0) errorText.passError = "Password should not be blank";
    else if (value.length < 5) errorText.passError = "Password should not be less than 5 characters";
    else delete errorText.passError;
  }
  return errorText;
}

export function saveWaiter(_tenant, data) {
  return postWaiterListApi(_tenant, data);
}
