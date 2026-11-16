
import {
  getmenuList as requestMenuList,
  getofferDetails as requestOfferDetails,
  postRatingReview as requestRatingReview,
} from "../api/menuApi";

export function getmenuList(tenantId) {
  return requestMenuList(tenantId);
}

export function getofferDetails(tenantId) {
  return requestOfferDetails(tenantId);
}

export function postRatingReview(formdata, tenantId) {
  return requestRatingReview(formdata, tenantId);
}

export async function loadMenuScreen(tenantId) {
  const response = await requestMenuList(tenantId);
  if (!response) {
    return null;
  }
  return {
    menuList: response.menuList,
    categoryList: response.categoryList,
    itemList: response.itemList,
    showItemRatings: Boolean(response.show_item_ratings_to_customers),
    topProducts: response.top_product,
  };
}

export async function loadOfferScreen(tenantId) {
  const response = await requestOfferDetails(tenantId);
  if (!response) {
    return null;
  }
  return {
    offerBanner: response.offerBanner,
    offerItemList: response.offerItemList,
  };
}

export function menusForSelection(menuList, menuId) {
  return (menuList || []).filter((row) => row.id == menuId);
}

export function uniqueField(rows, field) {
  var values = [];
  var seen = new Set();
  (rows || []).forEach((entry) => {
    seen.add(entry[field]);
  });
  seen.forEach((value) => values.push(value));
  return values;
}

function offerPrice(offerList, itemName, priceField) {
  if (!offerList) {
    return;
  }
  var finalPrice = 0;
  offerList.map((item) => {
    if (item.item_name == itemName) {
      var discounted = ((item[priceField] / 100) * item.item_discount).toFixed(2);
      finalPrice = (item[priceField] - discounted).toFixed(2);
    }
  });
  return finalPrice;
}

export function offerFullPrice(offerList, itemName) {
  return offerPrice(offerList, itemName, "item_fullprice");
}

export function offerHalfPrice(offerList, itemName) {
  return offerPrice(offerList, itemName, "item_halfprice");
}

export function ratingPayload(value, review) {
  return {
    rating: value == "" ? 0.0 : value,
    review: review,
  };
}
