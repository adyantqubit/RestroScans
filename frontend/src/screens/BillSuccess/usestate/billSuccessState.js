import { useState } from "react";

export function useBillSuccessState() {
  const [order, setOrder] = useState([]);
  return { order, setOrder };
}
