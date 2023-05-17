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
      <div>
        <div className="gallary_first_section">
          <div className="top_image">
            <div className="gallery_container"></div>
            <div class="bg_text">
              {/* <img src={RestroscansLogo} className="gallery_logo" /> */}
            </div>
          </div>
        </div>

        {galleryData != null && galleryData.length > 0 ? (
          <div className="main">
            <div className="gallery_img_div_1">
              {galleryData.map((item) => (
                <div className="gallery_image_div_2">
                  <img
                    src={config.staticBaseURL + item.gallery}
                    className="gallery_images"
                  />
                  <p className="gallery_bottom_text">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* <div className="customer_feedback_div">
          <div className="gallery_heading_div">
            <h2 className="customer_feedback_heading">Story & Customer Feedback</h2>
          </div>
        </div> */}
      </div>
    </>
  );
}

export default Gallery;
/* End of added code 05/04/2023 */
