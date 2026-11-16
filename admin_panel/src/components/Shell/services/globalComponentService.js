import { getAdminAppSettings } from '../api/globalComponentApi';

export function loadAdminSettings() {
  return getAdminAppSettings();
}
