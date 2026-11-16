import {
  getAllMenuList,
  postOrderItemsApi,
  getSettingsDetails,
  getofferDetails,
  getAllOfferList,
  OrderFilterQueryAPI,
  getDashboardData,
  getOrderCount,
  getOrderItemCountApi,
  getOrderItemDataShowApi,
  getOrderItemsApi,
  getOrdersApi,
  getOrderDetailsApi,
  saveOrderDetailsApi,
  getOrdersItemDetailApi,
  getOrderItemDataApi,
  saveOrderItemDetailsApi,
  updateOrderItemStatus,
  postCustomerDetails,
} from '../api/orderApi';

export function loadMenuCatalog() {
  return getAllMenuList();
}

export function saveOrderItems(data) {
  return postOrderItemsApi(data);
}

export function loadSettings() {
  return getSettingsDetails();
}

export function loadOffer(_tenant, offerId) {
  return getofferDetails(_tenant, offerId);
}

export function loadOffers() {
  return getAllOfferList();
}

export function loadOrderReport(_tenant, queryData) {
  return OrderFilterQueryAPI(_tenant, queryData);
}

export function loadDashboard() {
  return getDashboardData();
}

export function loadOrderCount() {
  return getOrderCount();
}

export function loadOrderItemCount() {
  return getOrderItemCountApi();
}

export function loadOrderItemBoard() {
  return getOrderItemDataShowApi();
}

export function loadOrderItems(_tenant, id) {
  return getOrderItemsApi(_tenant, id);
}

export function loadOrders(_tenant, filteringCriteria) {
  return getOrdersApi(_tenant, filteringCriteria);
}

export function loadOrderDetails() {
  return getOrderDetailsApi();
}

export function saveOrderDetails(_tenant, value) {
  return saveOrderDetailsApi(_tenant, value);
}

export function loadOrderItemPage(_tenant, filteringCriteria) {
  return getOrdersItemDetailApi(_tenant, filteringCriteria);
}

export function loadOrderItemData() {
  return getOrderItemDataApi();
}

export function saveOrderItem(_tenant, value) {
  return saveOrderItemDetailsApi(_tenant, value);
}

export function saveOrderItemStatus(_tenant, orderId, items) {
  return updateOrderItemStatus(_tenant, orderId, items);
}

export function offerPercentFor(rows, itemId) {
  const match = (rows || []).find((row) => String(row.item_id) === String(itemId));
  const percent = Number(match && match.item_discount);
  if (!Number.isFinite(percent) || percent <= 0) return 0;
  return percent;
}

export function offeredUnit(catalog, percent) {
  const unit = Number(catalog);
  if (!unit) return 0;
  if (!percent) return unit;
  return unit - (unit / 100) * percent;
}

export async function loadOrderDesk() {
  const tenant = JSON.parse(localStorage.getItem('tenantInfo')).tenant_name;
  const [catalog, settings, offers] = await Promise.all([
    getAllMenuList(tenant),
    getSettingsDetails(tenant),
    getAllOfferList(),
  ]);
  const offerRows = (offers && offers.offerItemList) || [];
  const items = ((catalog && catalog.itemListbyId) || []).map((item) => {
    const percent = offerPercentFor(offerRows, item.id);
    return {
      ...item,
      offer_percent: percent,
      sale_full: offeredUnit(item.price_full, percent),
      sale_half: offeredUnit(item.price_half, percent),
    };
  });
  return {
    items,
    categories: (catalog && catalog.categoryList) || [],
    allowHalf: !!(settings && settings.setting && settings.setting.allow_half_price),
    restaurant: (settings && settings.restaurant) || {},
  };
}

export function displayDateTime(format) {
  return {
    date: format.substring(0, 10).split("-").reverse().join("/"),
    time: format.substring(11, 19),
  };
}

export function slipDateTime(format) {
  return {
    date: format.substring(0, 10),
    time: format.substring(11, 19),
  };
}

export function filterDeskItems(items, categoryId, query) {
  var text = query.trim().toLowerCase();
  return items.filter(function (item) {
    var categoryMatch = categoryId === "all" || String(item.category_id) === String(categoryId);
    var textMatch = !text || String(item.name || "").toLowerCase().includes(text);
    return categoryMatch && textMatch;
  });
}

export function addDeskLine(cart, item, size) {
  var serveSize = size === "Half" ? "Half Plate" : "Full Plate";
  var catalog = serveSize === "Half Plate" ? Number(item.price_half) : Number(item.price_full);
  var unit = serveSize === "Half Plate" ? Number(item.sale_half) : Number(item.sale_full);
  if (!unit) unit = catalog;
  if (!unit) return { error: item.name + " has no " + size.toLowerCase() + " price." };
  var next = cart.slice();
  var index = next.findIndex(function (line) {
    return line.id === item.id && line.serve_size === serveSize;
  });
  if (index >= 0) next[index] = Object.assign({}, next[index], { quantity: next[index].quantity + 1 });
  else next.push({
    id: item.id,
    name: item.name,
    serve_size: serveSize,
    quantity: 1,
    unit: unit,
    offer_percent: item.offer_percent || 0,
  });
  return { cart: next, error: "" };
}

export function changeDeskQuantity(cart, index, delta) {
  var next = cart.slice();
  var quantity = next[index].quantity + delta;
  if (quantity < 1) next.splice(index, 1);
  else next[index] = Object.assign({}, next[index], { quantity: quantity });
  return next;
}

export function deskEstimate(cart) {
  return cart.reduce(function (sum, line) {
    return sum + line.unit * line.quantity;
  }, 0);
}

export function staffDeskOrder(customer, cart, restaurant) {
  var table = customer.table.trim();
  var phone = customer.contact.trim();
  var email = customer.email.trim();
  if (!table) return { error: "Choose or type a table." };
  if (cart.length === 0) return { error: "Add at least one item." };
  if (phone && phone.length !== 10) return { error: "Phone number must be 10 digits, or leave it blank." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email, or leave it blank." };
  if (!phone) {
    var waiter = JSON.parse(localStorage.getItem("waiterData") || "null");
    phone = waiter ? String(waiter.contact_number || "") : String((restaurant.contact_number || "") % 1e10);
  }
  if (phone.length < 10) {
    return { error: "Add a 10-digit customer phone. The restaurant contact on file is too short to use as a fallback." };
  }
  return {
    error: "",
    phone: phone,
    email: email,
    name: customer.name.trim(),
    table: table,
    cart: cart.map(function (line) {
      return {
        id: line.id,
        name: line.name,
        serve_size: line.serve_size,
        quantity: line.quantity,
        price: line.unit * line.quantity,
      };
    }),
  };
}

export function submitStaffOrder(payload) {
  const tenant = JSON.parse(localStorage.getItem('tenantInfo')).tenant_name;
  const waiter = JSON.parse(localStorage.getItem('waiterData') || 'null');
  return postCustomerDetails({
    ...payload,
    validate_table: true,
    order_created_by: waiter ? 'Waiter' : 'Admin',
    waiter_contact_number: waiter ? waiter.contact_number : '',
  }, tenant);
}
