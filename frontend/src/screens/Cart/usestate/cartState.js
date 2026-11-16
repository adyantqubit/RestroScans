import { useState } from "react";

export function useCartState() {
  const [isDetailPopupOpen, setDetailPopupVisiblity] = useState(false)
  const [removeProductIndex, setRemoveProductIndex] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  var [isPopupOpen, setPopupVisiblity] = useState(false)
  return { isDetailPopupOpen, setDetailPopupVisiblity, removeProductIndex, setRemoveProductIndex, selectedItem, setSelectedItem, isPopupOpen, setPopupVisiblity };
}
