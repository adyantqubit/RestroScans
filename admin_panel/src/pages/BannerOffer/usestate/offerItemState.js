import { useState } from 'react';

export function useOfferItemState() {
  const [selected, setSelected] = useState([]);
  const [offerItemId, setOfferId] = useState(null);
  const [offerData, setOfferData] = useState(null);
  const [offerName, setOfferName] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [menuData, setMenuData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [name, setName] = useState(null);
  const [menuSelected, setMenuSelected] = useState([]);
  const [categorySelected, setcategorySelected] = useState([]);
  const [itemSelected, setitemSelected] = useState([]);
  return {
    selected,
    setSelected,
    offerItemId,
    setOfferId,
    offerData,
    setOfferData,
    offerName,
    setOfferName,
    discount,
    setDiscount,
    menuData,
    setMenuData,
    categoryData,
    setCategoryData,
    itemData,
    setItemData,
    name,
    setName,
    menuSelected,
    setMenuSelected,
    categorySelected,
    setcategorySelected,
    itemSelected,
    setitemSelected,
  };
}
