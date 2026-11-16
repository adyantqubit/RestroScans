
import { explainFailure } from '../../../http/http_client';
import {
  getSettingsDetails,
  postSettingsDetails,
} from '../api/settingApi';

export function loadSettings() {
  return getSettingsDetails();
}

export function saveSettings(values) {
  return postSettingsDetails(values);
}

const SETTING_FIELDS = [
  'app_theme',
  'allow_half_price',
  'show_item_ratings_to_customers',
  'cgst',
  'sgst',
  'gstin',
  'fssaino',
  'whatsapp_number',
  'allow_loyality_points',
  'per_loyality_point_value',
  'amount_for_single_loyality_point',
  'discount_in',
];

function numberOr(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function phoneDigits(value) {
  return String(value || '').replace(/\D/g, '').slice(-10);
}

export async function saveSettingFields(patch) {
  const current = await loadSettings();
  const setting = current.setting || {};
  const body = {};
  if (setting.id) body.id = setting.id;
  SETTING_FIELDS.forEach((key) => {
    if (setting[key] !== undefined && setting[key] !== null) body[key] = setting[key];
  });
  Object.assign(body, patch);
  body.cgst = numberOr(body.cgst, 0);
  body.sgst = numberOr(body.sgst, 0);
  body.per_loyality_point_value = numberOr(body.per_loyality_point_value, 0);
  body.amount_for_single_loyality_point = numberOr(body.amount_for_single_loyality_point, 0);
  body.allow_half_price = Boolean(body.allow_half_price);
  body.allow_loyality_points = Boolean(body.allow_loyality_points);
  const response = await saveSettings(body);
  return {
    ok: Boolean(response && response.msg),
    error: explainFailure(response, ""),
    setting: (response && response.setting) || setting,
    themes: (response && response.themeOptions) || current.themeOptions || [],
  };
}

export { getRestaurantUPISettings, putRestaurantUPISettings } from '../api/settingApi';
