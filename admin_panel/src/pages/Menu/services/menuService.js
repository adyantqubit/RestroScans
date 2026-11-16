import { explainFailure } from '../../../http/http_client';
import {
  getMenuCount,
  getMenuDetails,
  getMenuList,
  postMenuDetails,
} from '../api/menuApi';

export function catalogQuery({ currentPage, listPerPage, columnToSort, columnSortingOrder, searchText, filters }) {
  const query = {
    paginationDetails: {
      currentPage,
      listPerPage,
    },
    columnToSort,
    columnSortingOrder,
    searchText: (searchText || '').trim(),
  };
  if (filters && Object.keys(filters).length) {
    query.filters = filters;
  }
  return query;
}

export function toggleSort(columnToSort, columnSortingOrder, columnName) {
  if (columnToSort === columnName) {
    return {
      columnToSort,
      columnSortingOrder: columnSortingOrder === 'ascending' ? 'descending' : 'ascending',
    };
  }
  return { columnToSort: columnName, columnSortingOrder };
}

export function storedPage() {
  const value = localStorage.getItem('globalPageIndex');
  return value ? parseInt(value, 10) : null;
}

export function rememberPage(pageNumber) {
  localStorage.setItem('globalPageIndex', pageNumber);
}

export function rememberPageSize(size) {
  localStorage.setItem('listPerPage', size);
}

export async function loadMenuPage(query) {
  const response = await getMenuList(catalogQuery(query));
  return {
    rows: response.menuList || [],
    count: response.menuListCount || 0,
  };
}

export async function loadMenuCount() {
  const response = await getMenuCount();
  return response.menuCount || 0;
}

export async function loadMenu(menuId) {
  const response = await getMenuDetails(menuId);
  return response.menu || null;
}

export async function saveMenu({ menuId, name, iconFile, isActive }) {
  const body = new FormData();
  if (menuId) {
    body.append('id', menuId);
  }
  body.append('name', name.trim());
  if (iconFile) {
    body.append('icon', iconFile);
  }
  body.append('is_active', isActive);
  const response = await postMenuDetails(body);
  return { ok: Boolean(response.msg), error: explainFailure(response, "") };
}

export async function setMenuActive(menuId, isActive) {
  const body = new FormData();
  body.append('id', menuId);
  body.append('is_active', isActive ? 'true' : 'false');
  const response = await postMenuDetails(body);
  return Boolean(response.msg);
}
