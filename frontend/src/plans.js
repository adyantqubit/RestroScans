// Stable feature codes returned by tenant-details. Labels from older data are accepted too.

const ALIASES = {
  'menu view': 'menu',
  'menu see/scan qr code to see menu': 'menu',
  'whatsapp chat icon': 'whatsapp',
  'show social media icons': 'social',
  'admin panel': 'admin',
  order: 'order',
  'order cancel': 'order_cancel',
  report: 'report',
  'customer rating and feedback': 'rating',
  discount: 'discount',
  reservation: 'reservation',
  'payment gateway': 'payment',
  'loyality point': 'loyalty',
  'loyalty point': 'loyalty',
  'staff management': 'staff',
  expense: 'expense',
  account: 'account',
};

export function featureCode(value) {
  const text = String(value || '').trim().toLowerCase();
  return ALIASES[text] || text;
}

export function hasFeature(features, code) {
  if (!Array.isArray(features)) return false;
  return features.some((item) => featureCode(item) === code);
}
