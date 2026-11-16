import { useState } from 'react';

export function usePaymentMethodState() {
  const [paymentData, setPaymentData] = useState({});
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [icon, setIcon] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [nameError, setNameError] = useState("");
  const [contactNumberError, setContactNumberError] = useState("");
  const [iconError, setIconError] = useState("");
  const [iconSizeError, setIconSizeError] = useState("");
  return {
    paymentData,
    setPaymentData,
    paymentMethodId,
    setPaymentMethodId,
    name,
    setName,
    contactNumber,
    setContactNumber,
    icon,
    setIcon,
    selectedImageName,
    setSelectedImageName,
    selectedImage,
    setSelectedImage,
    nameError,
    setNameError,
    contactNumberError,
    setContactNumberError,
    iconError,
    setIconError,
    iconSizeError,
    setIconSizeError,
  };
}
