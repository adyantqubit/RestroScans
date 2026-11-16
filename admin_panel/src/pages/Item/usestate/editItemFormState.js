import { useState } from 'react';

export function useEditItemFormState() {
  const [itemData, setItemData] = useState({});
  const [itemId, setItemId] = useState(null);
  const [name, setName] = useState("");
  const [fullPrice, setFullPrice] = useState("");
  const [halfPrice, setHalfPrice] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [selectedImageName, setSelectedImageName] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState(null);
  const [itemType, setItemType] = useState("Other");
  const [menuName, setMenuName] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    category: "",
    icon: "",
    is_active: "",
    best_seller: "",
    description: "",
    price_full: "",
    price_half: "",
    item_type: "",
  });
  const [defaultValueData, setDefaultValueData] = useState(10);
  return {
    itemData,
    setItemData,
    itemId,
    setItemId,
    name,
    setName,
    fullPrice,
    setFullPrice,
    halfPrice,
    setHalfPrice,
    description,
    setDescription,
    icon,
    setIcon,
    isActive,
    setIsActive,
    isBestSeller,
    setIsBestSeller,
    selectedImageName,
    setSelectedImageName,
    selectedImage,
    setSelectedImage,
    categoryList,
    setCategoryList,
    category,
    setCategory,
    itemType,
    setItemType,
    menuName,
    setMenuName,
    validationErrors,
    setValidationErrors,
    defaultValueData,
    setDefaultValueData,
  };
}
