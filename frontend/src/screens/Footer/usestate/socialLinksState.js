import { useState } from "react";

export function useSocialLinksState() {
  const [socialObjs, setSocialLinkObjs] = useState([]);
  return { socialObjs, setSocialLinkObjs };
}
