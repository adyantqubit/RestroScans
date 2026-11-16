import React, { useContext, useEffect, useState } from "react";
import { getSocialLinks } from '../../services/footerService';
import config from "../../../../config/config";
import style from "../style/SocialLinks.module.css";
import { useSocialLinksState } from "../../usestate/socialLinksState";
import { GlobalContext } from "../../../../context/Context";
import { hasFeature } from "../../../../plans";

export default function SocialLinks() {
  var { subscribePlan } = useContext(GlobalContext);
  var { socialObjs, setSocialLinkObjs } = useSocialLinksState();
  const socialEnabled = hasFeature(subscribePlan, "social");

  useEffect(() => {
    if (socialEnabled) getSocialData();
  }, [socialEnabled]);

  const getSocialData = async () => {
    var tenant = localStorage.getItem("tenantName");
    const response = await getSocialLinks(tenant);
    if (response.msg) {
      setSocialLinkObjs(response.social);
    }
  };

  return (
    <>
      {socialEnabled && socialObjs.length > 0 && (
        <div
          className={style.SocialLinksContaner}
          style={{
            justifyContent: socialObjs.length <= 7 ? "center" : "unset",
          }}
        >
          {socialObjs.map((socialData, index) => (
            <div id={index} className={style.iconContainer}>
              <a href={socialData.social_media_link} target="_blank">
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
