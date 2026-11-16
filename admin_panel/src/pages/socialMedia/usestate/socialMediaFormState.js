import { useState } from 'react';

export function useSocialMediaFormState() {
  const [socialMediaObj, setSocialMediaObj] = useState({});
  const [themeList, setThemeList] = useState([]);
  const [socialMediaName, setSocialMediaName] = useState("");
  const [socialMediaLink, setSocialMediaLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    social_media_name: "",
    social_media_link: "",
    social_media_icon: "",
  });
  const [img, setImg] = useState(null);
  const [errors, setError] = useState([]);
  return {
    socialMediaObj,
    setSocialMediaObj,
    themeList,
    setThemeList,
    socialMediaName,
    setSocialMediaName,
    socialMediaLink,
    setSocialMediaLink,
    imageUrl,
    setImageUrl,
    validationErrors,
    setValidationErrors,
    img,
    setImg,
    errors,
    setError,
  };
}
