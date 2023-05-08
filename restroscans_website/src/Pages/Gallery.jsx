// Added by:- Suman sahu On 14/04/2023

import React, { useEffect, useState } from "react";
import "./gallery.css";
import { GalleryDetailsGetApi, OurTopRestaurentGetApi } from "../api/service";
import config from "../api/config";
import RestroscansLogo from "../images/restroscans_logo.png";

function Gallery() {
  // Added by:- Suman sahu On 08/04/2023
  // Reason:- Created for get Pricing plans details
  const [galleryData, setGalleryData] = useState([]);
  useEffect(() => {
    getGalleryDetails();
  }, []);

  const getGalleryDetails = async () => {
    const response = await GalleryDetailsGetApi();
    if (response) {
      setGalleryData(response.galleryData);
    }
  };
  // End of added code 08/04/2023

  return (
    <>
      <div className="gallary_first_section">
        <div className="top_image">
          <div className="gallery_container"></div>
          <div class="bg_text">
            {/* <img src={RestroscansLogo} className="gallery_logo" /> */}
          </div>
        </div>
      </div>

      {galleryData != null && galleryData.length > 0 ? (
        <div className="gallery_img_div">
          {galleryData.map((item) => (
            <div>
              <img
                src={config.staticBaseURL + item.gallery}
                className="gallery_images"
              />
              <p className="restaurent_title">{item.title}</p>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}

export default Gallery;
/* End of added code 05/04/2023 */
