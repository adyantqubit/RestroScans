import { updateRatingAndReviewApi as requestUpdateRating } from "../api/ratingApi";

export function updateRatingAndReviewApi(tenantId, invoiceData) {
  return requestUpdateRating(tenantId, invoiceData);
}

export function uniqueRatedItems(rows) {
  return rows.filter(function (row, index, self) {
    return index === self.findIndex(function (item) {
      return item.item === row.item;
    });
  });
}

export function ratingPostBody(orderItems, overallReview, overallRating, orderId, fieldValue) {
  var orderData = [];
  for (var i = 0; i < orderItems.length; i++) {
    if (orderItems[i] != "Cancelled") {
      orderData.push({
        id: orderItems[i].id,
        rating: fieldValue("order" + orderItems[i].id + "rating"),
        review: fieldValue("order" + orderItems[i].id + "review"),
      });
    }
  }
  return {
    ItemRateReview: orderData,
    overallReview: overallReview,
    overallRating: overallRating,
    order_id: orderId,
  };
}
