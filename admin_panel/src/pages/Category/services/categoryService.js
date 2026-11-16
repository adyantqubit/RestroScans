import { explainFailure } from '../../../http/http_client';
import {
  getCategoryCount,
  getCategoryDetails,
  getCategoryList,
  getMenus,
  postCategoryDetails,
} from '../api/categoryApi';

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

export async function loadCategoryPage(query) {
  const response = await getCategoryList(catalogQuery(query));
  return {
    rows: response.categoryList || [],
    count: response.categoryListCount || 0,
  };
}

export async function loadCategoryCount() {
  const response = await getCategoryCount();
  return response.categoryCount || 0;
}

export async function loadCategory(categoryId) {
  const response = await getCategoryDetails(categoryId);
  return {
    category: response.category || null,
    menus: response.menus || [],
  };
}

export async function loadMenuOptions() {
  const response = await getMenus();
  return response.msg ? response.menus || [] : [];
}

export async function saveCategory({ categoryId, name, menu, iconFile, isActive }) {
  const body = new FormData();
  if (categoryId) {
    body.append('id', categoryId);
  }
  body.append('name', name);
  body.append('menu', menu);
  if (iconFile) {
    body.append('icon', iconFile);
  }
  body.append('is_active', isActive);
  const response = await postCategoryDetails(body);
  return { ok: Boolean(response.msg), error: explainFailure(response, "") };
}

export async function setCategoryActive(categoryId, isActive) {
  const body = new FormData();
  body.append('id', categoryId);
  body.append('is_active', isActive ? 'true' : 'false');
  const response = await postCategoryDetails(body);
  return Boolean(response.msg);
}
