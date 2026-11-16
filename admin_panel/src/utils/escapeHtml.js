const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/**
 * Make text safe to place inside HTML that is built as a string.
 *
 * The print windows (bill, KOT, QR sheet) are written with `document.write` into a popup that shares this
 * app's origin, so a customer name like `<img onerror=...>` would otherwise run with access to the staff
 * token. Escape every text field; numbers and dates built by the code itself do not need it.
 */
export function escapeHtml(value) {
  return String(value === null || value === undefined ? '' : value).replace(/[&<>"']/g, (ch) => ENTITIES[ch]);
}
