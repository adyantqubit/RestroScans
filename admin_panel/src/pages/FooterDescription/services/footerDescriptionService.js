import {
  getFooterDescriptionApi,
  saveFooterDescriptionApi,
} from '../api/footerDescriptionApi';

export function loadFooterDescription() {
  return getFooterDescriptionApi();
}

export function saveFooterDescription(_tenant, value) {
  return saveFooterDescriptionApi(_tenant, value);
}
