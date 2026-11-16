import {
  listDiningTables,
  pageDiningTables,
  createDiningTable as createDiningTableRequest,
  updateDiningTable as updateDiningTableRequest,
  deleteDiningTable as deleteDiningTableRequest,
} from '../api/tablesApi';

export function loadDiningTables() {
  return listDiningTables();
}

export function loadDiningTablePage(query) {
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
  return pageDiningTables(body);
}

export function createDiningTable(payload) {
  return createDiningTableRequest(payload);
}

export function updateDiningTable(id, payload) {
  return updateDiningTableRequest(id, payload);
}

export function deleteDiningTable(id) {
  return deleteDiningTableRequest(id);
}
