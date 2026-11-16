import httpClient from '../../../http/http_client';
import { readBody } from '../../../http/responses';

const qrStorageKey = () => `restroscans:qr-location:${window.location.hostname}`;

function parseLocation(pathname, search = '') {
  // New QR URLs: /menu-item?floor=0&tables=1 (ground floor), or floor=1,2,...
  if (pathname.replace(/\/+$/, '') === '/menu-item') {
    const params = new URLSearchParams(search);
    const floorText = params.get('floor');
    const tableText = params.get('tables');
    if (floorText !== null || tableText !== null) {
      if (!/^(0|[1-9]\d*)$/.test(floorText || '') || !/^[1-9]\d*$/.test(tableText || '')) return null;
      const floor = Number(floorText);
      const table = Number(tableText);
      if (!Number.isSafeInteger(floor) || !Number.isSafeInteger(table)) return null;
      return { floor: floor === 0 ? null : floor, table };
    }
  }
  // Preserve support for previously printed path-based QR codes.
  const path = pathname.replace(/\/+$/, '');
  let match = /^\/menu-item\/table\/([1-9]\d*)$/.exec(path);
  if (match) return { floor: null, table: Number(match[1]) };
  match = /^\/menu-item\/floor\/([1-9]\d*)\/table\/([1-9]\d*)$/.exec(path);
  return match ? { floor: Number(match[1]), table: Number(match[2]) } : null;
}

export function rememberQrTableFromUrl() {
  if (typeof window === 'undefined') return null;
  const location = parseLocation(window.location.pathname, window.location.search);
  if (location) {
    sessionStorage.setItem(qrStorageKey(), JSON.stringify(location));
    return location.table;
  }
  return qrTableId();
}

function storedLocation() {
  if (typeof window === 'undefined') return null;
  const current = parseLocation(window.location.pathname, window.location.search);
  if (current) return current;
  try {
    const saved = JSON.parse(sessionStorage.getItem(qrStorageKey()) || 'null');
    if (saved && Number.isInteger(saved.table) && saved.table > 0 &&
      (saved.floor === null || (Number.isInteger(saved.floor) && saved.floor > 0))) return saved;
  } catch (_) { /* Invalid old storage is ignored. */ }
  return null;
}

export function qrTableId() {
  return storedLocation()?.table || null;
}

export function clearQrTable() {
  if (typeof window !== 'undefined') sessionStorage.removeItem(qrStorageKey());
}

export async function resolveQrTable() {
  const location = storedLocation();
  if (!location) return null;
  const path = location.floor === null
    ? `/public-table/table/${location.table}/`
    : `/public-table/floor/${location.floor}/table/${location.table}/`;
  const response = await httpClient.get(path).then(readBody);
  if (!response?.table) throw new Error('This table QR code is invalid or inactive.');
  return response.table;
}
