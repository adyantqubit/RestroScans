import React, { useEffect, useState } from "react";
import { getSocialLinks } from "../../api/Services";
import config from "../../config/config";
import style from "./SocialLinks.module.css";

export default function SocialLinks() {
  /**
   * Added by Yuvraj Sahu on 25-05-2023
   * Reason - to get the social link
   */
  const [socialObjs, setSocialLinkObjs] = useState([]);
  /**
   * End of getting social data by Yuvraj Sahu on 25-05-2023
   */

  useEffect(() => {
    /**
     * Added by Yuvraj Sahu on 25-05-2023
     * Reason - to get the social data for give social link
     */
    getSocialData();
    /**
     * End of getting social data by Yuvraj Sahu on 25-05-2023
     */
  }, []);

  /**
   * Added by Yuvraj Sahu on 25-05-2023
   * Reason - to get ssocial links
   */
  const getSocialData = async () => {
    var tenant = localStorage.getItem("tenantName");
    const response = await getSocialLinks(tenant);
    if (response.msg) {
      setSocialLinkObjs(response.social);
    }
  };
  /**
   * End of getting social data by Yuvraj Sahu on 25-05-2023
   */

  return (
    <>
      {socialObjs.length > 0 && (
        // Modified by Yuvraj Sahu on 14-06-2023
        // Reason - to align center social media icons
        <div
          className={style.SocialLinksContaner}
          style={{
            justifyContent: socialObjs.length <= 7 ? "center" : "unset",
          }}
        >
          {/* End of addition by Yuvraj Sahu on 14-06-2023 */}
          {socialObjs.map((socialData, index) => (
            <div id={index} className={style.iconContainer}>
              <a href={socialData.social_media_link} target="_blank">
                {/* <a href="https://adyant.co.in/" target='_blank'> */}
                <img
                  src={config.staticBaseURL + socialData.social_media_icon}
                  alt="social link"
                  className={style.socialImg}
                />
              </a>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
