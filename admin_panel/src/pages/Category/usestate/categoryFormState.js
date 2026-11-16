import { useState } from 'react';

export function useCategoryFormState() {
  const [categoryData, setCategoryData] = useState({});
  const [categoryId, setCategoryId] = useState(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [selectedImageName, setSelectedImageName] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [menuList, setMenuList] = useState([]);
  const [menu, setMenu] = useState(null);
  const [menuName, setMenuName] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    menu: "",
    icon: "",
    is_active: "",
  });
  const [defaultValueData, setDefaultValueData] = useState(10);
  return {
    categoryData,
    setCategoryData,
    categoryId,
    setCategoryId,
    name,
    setName,
    icon,
    setIcon,
    isActive,
    setIsActive,
    selectedImageName,
    setSelectedImageName,
    selectedImage,
    setSelectedImage,
    menuList,
    setMenuList,
    menu,
    setMenu,
    menuName,
    setMenuName,
    validationErrors,
    setValidationErrors,
    defaultValueData,
    setDefaultValueData,
  };
}
