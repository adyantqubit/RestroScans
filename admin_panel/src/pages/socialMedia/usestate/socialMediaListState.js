import { useState } from 'react';

export function useSocialMediaListState() {
  const [allSocialMedia, setAllSocialMedia] = useState([]);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState({isOpen : false, id : null});
  return {
    allSocialMedia,
    setAllSocialMedia,
    isConfirmationModalOpen,
    setIsConfirmationModalOpen,
  };
}
