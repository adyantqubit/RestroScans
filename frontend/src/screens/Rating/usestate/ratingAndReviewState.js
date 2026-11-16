import { useState } from "react";

export function useRatingAndReviewState() {
  const [skip, setSkip] = useState(false);
  const [done, setDone] = useState(false);
  var [overallRating, setOverallRating] = useState(3);
  return { skip, setSkip, done, setDone, overallRating, setOverallRating };
}
