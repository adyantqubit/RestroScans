import { storedPerPage } from '../../../utils/pagination';
import { useState } from 'react';

export const initialBannerOfferState = {
  loading: false,
  error: '',
};

export function useBannerOfferState() {
  const [backendOfferBannerCount, setBackendOfferBannerCount] = useState(0);
  const [bannerOfferList, setOfferBannerList] = useState([]);
  const [listPerPage, setListPerPage] = useState(
    storedPerPage()
  );
  const [columnToSort, setColumnToSort] = useState("contact_number");
  const [columnSortingOrder, setColumnSortingOrder] = useState("ascending");
  const [showSortingIcon, setShowSortingIcon] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [id, setId] = useState(null);
  const [dataCount, setDataCount] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [searchText, setSearchText] = useState("");
  return {
    backendOfferBannerCount,
    setBackendOfferBannerCount,
    bannerOfferList,
    setOfferBannerList,
    listPerPage,
    setListPerPage,
    columnToSort,
    setColumnToSort,
    columnSortingOrder,
    setColumnSortingOrder,
    showSortingIcon,
    setShowSortingIcon,
    currentPage,
    setCurrentPage,
    id,
    setId,
    dataCount,
    setDataCount,
    windowWidth,
    setWindowWidth,
    searchText,
    setSearchText,
  };
}
