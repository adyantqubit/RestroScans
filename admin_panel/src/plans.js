
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

function featureCode(value) {
  const text = String(value || '').trim().toLowerCase();
  return ALIASES[text] || text;
}

export function storeFeatures(list) {
  const codes = [];
  (list || []).forEach((item) => {
    const code = featureCode(item);
    if (code && codes.indexOf(code) === -1) codes.push(code);
  });
  localStorage.setItem('planFeatures', JSON.stringify(codes));
}

export function hasFeature(code) {
  let list = null;
  try {
    list = JSON.parse(localStorage.getItem('planFeatures') || 'null');
  } catch (err) {
    list = null;
  }
  if (!Array.isArray(list)) return !localStorage.getItem('token');
  return list.indexOf(code) !== -1;
}

export function homePath() {
  if (hasFeature('admin')) return '/Dashboard';
  if (hasFeature('order')) return '/Floor';
  return '/Menu';
}
