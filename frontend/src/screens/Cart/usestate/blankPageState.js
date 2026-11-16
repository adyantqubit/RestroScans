import { useState } from "react";

export function useBlankPageState() {
  var [orderItems, setOrderItem] = useState([])
  return { orderItems, setOrderItem };
}
