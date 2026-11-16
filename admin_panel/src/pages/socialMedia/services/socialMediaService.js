import {
  getSocialMediaApi,
  getSocialPageApi,
  saveSocialMediaApi,
  deteleSocialMediaApi,
  getSettingsDetails,
  postSettingsDetails,
} from '../api/socialMediaApi';

export function loadSocialLinks() {
  return getSocialMediaApi();
}

export function loadSocialPage(query) {
  return getSocialPageApi({
    paginationDetails: {
      currentPage: query.currentPage,
      listPerPage: query.listPerPage,
    },
    columnToSort: query.columnToSort,
    columnSortingOrder: query.columnSortingOrder,
    searchText: (query.searchText || '').trim(),
  });
}

export function saveSocialLink(value) {
  return saveSocialMediaApi(value);
}

export function deleteSocialLink(_tenant, id) {
  return deteleSocialMediaApi(_tenant, id);
}

export function loadSettings() {
  return getSettingsDetails();
}

export function saveSettings(values) {
  return postSettingsDetails(values);
}
