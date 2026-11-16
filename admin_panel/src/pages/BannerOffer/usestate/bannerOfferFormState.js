import { useState } from 'react';

export function useBannerOfferFormState() {
  const [categoryData, setCategoryData] = useState({});
  const [name, setName] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [menuList, setMenuList] = useState([]);
  const [menu, setMenu] = useState(null);
  const [offerDetails, setOfferDetails] = useState({});
  const [offerId, setOfferId] = useState(null);
  const [discount, setDiscount] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [offerName, setOfferName] = useState("");
  const [offerImage, setOfferImage] = useState("");
  const [videoLink, setvideoLink] = useState("");
  const [selectedOfferImage, setSelectedOfferImage] = useState(null);
  const [icon, setIcon] = useState(null);
  const [nameError, setNameError] = useState("");
  const [iconError, setIconError] = useState("");
  const [offerDataCount, setOfferDataCount] = useState(0);
  const [showOffer, setShowOffer] = useState(true);
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    discount: "",
    icon: "",
    video_link: "",
    is_active: "",
  });
  const [menuName, setMenuName] = useState(null);
  const [defaultValueData, setDefaultValueData] = useState(10);
  return {
    categoryData,
    setCategoryData,
    name,
    setName,
    isActive,
    setIsActive,
    selectedImage,
    setSelectedImage,
    menuList,
    setMenuList,
    menu,
    setMenu,
    offerDetails,
    setOfferDetails,
    offerId,
    setOfferId,
    discount,
    setDiscount,
    showVideo,
    setShowVideo,
    offerName,
    setOfferName,
    offerImage,
    setOfferImage,
    videoLink,
    setvideoLink,
    selectedOfferImage,
    setSelectedOfferImage,
    icon,
    setIcon,
    nameError,
    setNameError,
    iconError,
    setIconError,
    offerDataCount,
    setOfferDataCount,
    showOffer,
    setShowOffer,
    validationErrors,
    setValidationErrors,
    menuName,
    setMenuName,
    defaultValueData,
    setDefaultValueData,
  };
}
