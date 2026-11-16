import { useState } from 'react';

export function useAddOrderItemFormState(options) {
  const [servingSizeData, setServingSizeData] = useState(options[0]);
  const [quantityValidation, setquantityValidation] = useState("");
  const [settings, setSettings] = useState({});
  const [allowHalfPrice, setAllowHalfPrice] = useState(false);
  const [itemNameSelected, setItemNameSelected] = useState("");
  const [itemIdSelected, setItemIdSelected] = useState(1);
  const [quantitySelected, setQuantitySelected] = useState("");
  const [price, setPrice] = useState(0);
  const [singalItemprice, setSingalItemprice] = useState(0);
  const [itemNameRequired, setItemNameRequired] = useState(false);
  const [servingSizeRequired, setservingSizeRequired] = useState(false);
  const [offerBanner, setBannerList] = useState([]);
  const [offerList, setOfferList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [itemData, setItemData] = useState([]);
  return {
    servingSizeData,
    setServingSizeData,
    quantityValidation,
    setquantityValidation,
    settings,
    setSettings,
    allowHalfPrice,
    setAllowHalfPrice,
    itemNameSelected,
    setItemNameSelected,
    itemIdSelected,
    setItemIdSelected,
    quantitySelected,
    setQuantitySelected,
    price,
    setPrice,
    singalItemprice,
    setSingalItemprice,
    itemNameRequired,
    setItemNameRequired,
    servingSizeRequired,
    setservingSizeRequired,
    offerBanner,
    setBannerList,
    offerList,
    setOfferList,
    searchValue,
    setSearchValue,
    itemData,
    setItemData,
  };
}
