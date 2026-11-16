import httpClient from '../../../http/http_client';

function readBody(response) {
  return response ? response.data : {};
}

const json = { 'Content-Type': 'application/json' };

export function getRestaurantRatingReviewCount() {
  return httpClient.get('/api/v1/restaurant-rating-count/').then(readBody).catch((error) => ({ error: error.userMessage }));
}

export function getRestaurantRatingReviewList(_tenant, filteringCriteria) {
  return httpClient.post('/api/v1/restaurant-rating-list/', filteringCriteria, { headers: json }).then(readBody).catch((error) => ({ error: error.userMessage }));
}
