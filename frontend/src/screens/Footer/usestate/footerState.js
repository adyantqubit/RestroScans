import { useState } from "react";

export function useFooterState() {
  const [footerDetails, setFooterDetails] = useState([]); // Our Item set in this variable
  const [restaurantDescription, setRestaurantDescription] = useState([]); // Our Item set in this variable
  return { footerDetails, setFooterDetails, restaurantDescription, setRestaurantDescription };
}
