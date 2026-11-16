import { explainFailure } from '../../../http/http_client';
import {
  getCategories,
  getItemCount,
  getItemDetails,
  getItemList,
  postItemDetails,
} from '../api/itemApi';
import axios from 'axios';
import config from '../../../config/config';

function staffRequest(method, data, params) {
  const session = JSON.parse(sessionStorage.getItem('restroStaffSession') || 'null');
  return axios({ method, baseURL: config.staticBaseURL, url: '/api/v1/workforce/staff-order-actions/', data, params,
    headers: { Authorization: `Bearer ${session?.token || ''}`, 'X-Tenant': session?.tenant || '' } }).then(response => response.data);
}



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

export async function loadItemPage(query, staffMode = false) {
  if (staffMode) {
    const response = await staffRequest('get', undefined, { items: 1 });
    let rows = response.items || [];
    const filters = query.filters || {};
    if (filters.is_active !== undefined) rows = rows.filter(x => x.is_active === filters.is_active);
    if (filters.best_seller !== undefined) rows = rows.filter(x => x.best_seller === filters.best_seller);
    if (query.searchText) rows = rows.filter(x => `${x.name} ${x.category_name} ${x.price_full}`.toLowerCase().includes(query.searchText.toLowerCase()));
    const sort = ({ priceFull: 'price_full', priceHalf: 'price_half', category: 'category_name' })[query.columnToSort] || query.columnToSort;
    rows.sort((a,b) => String(a[sort] ?? '').localeCompare(String(b[sort] ?? ''), undefined, { numeric: true }));
    if (query.columnSortingOrder === 'descending') rows.reverse();
    const count = rows.length;
    const start = (query.currentPage - 1) * query.listPerPage;
    return { rows: rows.slice(start, start + query.listPerPage), count };
  }
  const response = await getItemList(catalogQuery(query));
  return {
    rows: response.itemList || [],
    count: response.itemListCount || 0,
  };
}

export async function loadItemCount(staffMode = false) {
  if (staffMode) return (await staffRequest('get', undefined, { items: 1 })).items.length;
  const response = await getItemCount();
  return response.itemCount || 0;
}

export async function loadItem(itemId, staffMode = false) {
  if (staffMode) return staffRequest('get', undefined, { item_detail: itemId });
  const response = await getItemDetails(itemId);
  return {
    item: response.item || null,
    categories: response.categories || [],
  };
}

export async function loadCategoryOptions(staffMode = false) {
  if (staffMode) return (await staffRequest('get', undefined, { item_categories: 1 })).categories;
  const response = await getCategories();
  return response.msg ? response.categoryList || [] : [];
}

export async function saveItem({
  itemId,
  name,
  itemType,
  category,
  iconFile,
  isActive,
  fullPrice,
  halfPrice,
  isBestSeller,
  description,
  kitchenAvailable,
  staffMode = false,
}) {
  const body = new FormData();
  if (itemId) {
    body.append('id', itemId);
  }
  body.append('name', name);
  body.append('item_type', itemType);
  body.append('category', category);
  if (iconFile) {
    body.append('icon', iconFile);
  }
  body.append('is_active', isActive);
  if (fullPrice != null) {
    body.append('price_full', fullPrice);
  }
  if (halfPrice != null) {
    body.append('price_half', halfPrice);
  }
  body.append('best_seller', isBestSeller);
  if (kitchenAvailable !== undefined) body.append('kitchen_available', kitchenAvailable);
  if (description != null) {
    body.append('description', description);
  }
  if (staffMode) {
    body.append('action', 'item_save');
    try { await staffRequest('post', body); return { ok: true }; }
    catch (e) { return { ok: false, error: e.response?.data?.error || 'Unable to save item' }; }
  }
  const response = await postItemDetails(body);
  return { ok: Boolean(response.msg), error: explainFailure(response, "") };
}

export async function setItemActive(itemId, isActive, staffMode = false) {
  if (staffMode) { await staffRequest('post', { action: 'item_active', item_id: itemId, active: isActive }); return true; }
  const body = new FormData();
  body.append('id', itemId);
  body.append('is_active', isActive ? 'true' : 'false');
  const response = await postItemDetails(body);
  return Boolean(response.msg);
}

export async function setKitchenAvailable(itemId, available, staffMode = false) {
  if (staffMode) {
    await staffRequest('post', { action: 'availability', item_id: itemId, available });
    return true;
  }
  const body = new FormData();
  body.append('id', itemId);
  body.append('kitchen_available', available ? 'true' : 'false');
  const response = await postItemDetails(body);
  if (!response.msg) throw new Error(explainFailure(response, 'Could not update availability'));
  return true;
}
