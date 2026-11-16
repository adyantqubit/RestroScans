import { useState } from 'react';

export function useMenuFormState() {
  const [menuData, setMenuData] = useState({});
  const [menuId, setMenuId] = useState(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [selectedImageName, setSelectedImageName] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [nameError, setNameError] = useState("");
  const [iconError, setIconError] = useState("");
  return {
    menuData,
    setMenuData,
    menuId,
    setMenuId,
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
    nameError,
    setNameError,
    iconError,
    setIconError,
  };
}
