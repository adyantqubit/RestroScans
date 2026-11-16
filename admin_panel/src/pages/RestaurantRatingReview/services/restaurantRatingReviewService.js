import {
  getRestaurantRatingReviewCount,
  getRestaurantRatingReviewList,
} from '../api/restaurantRatingReviewApi';

export function loadRatingCount() {
  return getRestaurantRatingReviewCount();
}

export function loadRatings(_tenant, filteringCriteria) {
  return getRestaurantRatingReviewList(_tenant, filteringCriteria);
}
