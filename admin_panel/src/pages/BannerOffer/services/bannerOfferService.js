import {
  getOfferBannerCount,
  getOfferBannerList,
  postOfferBannerDetails,
  getofferDetails,
  getMenuCategoryItemOfferDetails,
  getPaymentMethodApi,
  savePaymentMethodApi,
  addOfferItem,
  removeOfferItem,
} from '../api/bannerOfferApi';

export function loadOfferCount() {
  return getOfferBannerCount();
}

export function loadOfferPage(_tenant, filteringCriteria) {
  return getOfferBannerList(_tenant, filteringCriteria);
}

export function saveOffer(_tenant, values) {
  return postOfferBannerDetails(_tenant, values);
}

export function displayDateTime(format) {
  return {
    date: format.substring(0, 10).split("-").reverse().join("/"),
    time: format.substring(11, 19),
  };
}

export function offerLinePrice(items, name, discount, priceField) {
  if (!items) return;
  var finalPrice = 0;
  items.map(function (item) {
    if (item.name == name) {
      var discounted = ((item[priceField] / 100) * discount).toFixed(2);
      finalPrice = (item[priceField] - discounted).toFixed(2);
    }
  });
  return finalPrice;
}

export function loadOffer(_tenant, offerId) {
  return getofferDetails(_tenant, offerId);
}

export function loadOfferCatalog(_tenant, offerId) {
  return getMenuCategoryItemOfferDetails(_tenant, offerId);
}

export function attachOfferItem(offerId, itemId) {
  return addOfferItem({ offer_name: offerId, item_name: itemId });
}

export function detachOfferItem(id) {
  return removeOfferItem(id);
}

export function loadPaymentMethod() {
  return getPaymentMethodApi();
}

export function savePaymentMethod(_tenant, value) {
  return savePaymentMethodApi(_tenant, value);
}
