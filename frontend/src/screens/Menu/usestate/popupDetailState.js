import { useState } from "react";

export function usePopupDetailState() {
  var [quantityhalf, setQuantityHalf] = useState(0)
  var [quantityFull, setQuantityFull] = useState(0)
  var [sizeSelected, setSizeSlelected] = useState(null)
  return { quantityhalf, setQuantityHalf, quantityFull, setQuantityFull, sizeSelected, setSizeSlelected };
}
