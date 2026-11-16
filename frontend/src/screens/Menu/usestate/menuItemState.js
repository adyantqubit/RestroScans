import { useState } from "react";

export function useMenuItemState() {
  const [menuList, setmenuList] = useState([]); // Our menu set in this variable
  const [categoryList, setCategoryList] = useState([]); // Our Category set in this variable
  const [itemList, setItemList] = useState([]); // Our Item set in this variable
  var [filterCategory, setfilterCategory] = useState([])
  var [offerShow, setOfferShow] = useState([])
  var [filter, setFiltered] = useState([])
  const [isLoader, setIsLoader] = useState(true)
  const [offerBanner, setOfferBanner] = useState([]); // Our Item set in this variable
  const [offerList, setOfferList] = useState([]); // Our Item set in this variable
  var [restaurantName, setRestaurantName] = useState([]);
  const [bestProducts, setBestProduct] = useState(null)
  const [search, setNewSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  var [selected, setSelected] = useState(0);
  var [clickedDetail, setClickedDetail] = useState(null)
  var [isDetailPopupOpen, setDetailPopupVisiblity] = useState(false)
  const [open, setOpen] = useState(false);
  const [searchVisible, setSearchVisiblity] = useState(false)
  const [menuListVisible, setmenuListVisiblity] = useState(true)
  const [videoVisible,setVideoVisiblity]=useState(false)
  const [whatsApp, setwhatsAppDetail] = useState([]);
  const [playVideo, setVideo] = useState({})
  const [vidRef, setVidRef] = useState(null);
  const [isModalOpenn, setIsModalOpenn] = useState(false);
  const [isRatingModal, setIsRatingModal] = useState(false);
  var [value, setValue] = useState(3);
  return { menuList, setmenuList, categoryList, setCategoryList, itemList, setItemList, filterCategory, setfilterCategory, offerShow, setOfferShow, filter, setFiltered, isLoader, setIsLoader, offerBanner, setOfferBanner, offerList, setOfferList, restaurantName, setRestaurantName, bestProducts, setBestProduct, search, setNewSearch, isModalOpen, setIsModalOpen, selected, setSelected, clickedDetail, setClickedDetail, isDetailPopupOpen, setDetailPopupVisiblity, open, setOpen, searchVisible, setSearchVisiblity, menuListVisible, setmenuListVisiblity, videoVisible, setVideoVisiblity, whatsApp, setwhatsAppDetail, playVideo, setVideo, vidRef, setVidRef, isModalOpenn, setIsModalOpenn, isRatingModal, setIsRatingModal, value, setValue };
}
