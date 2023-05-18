// Added by:- Suman sahu On 14/04/2023

import React, { useEffect, useState } from "react";
import "./gallery.css";
import { GalleryDetailsGetApi, CustomerFeedbackGetApi } from "../api/service";
import config from "../api/config";
import RestroscansLogo from "../images/restroscans_logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

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

  // Added by:- Suman sahu On 18/05/2023
  // Reason:- Created for get customer Feedback details
  const [customerFeedback, setCustomerFeedback] = useState([]);
  useEffect(() => {
    getCustomerFeedback();
  }, []);

  const getCustomerFeedback = async () => {
    const response = await CustomerFeedbackGetApi();
    if (response) {
      setCustomerFeedback(response.customerFeedback);
    }
  };
  // End of added code 18/05/2023

  return (
    <>
      <div style={{ paddingBottom: "2rem" }}>
        <div className="gallary_first_section">
          <div className="top_image">
            <div className="gallery_container"></div>
            <div class="bg_text">
              <p className="gallery_text">
                
              </p>
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

        {customerFeedback != null && customerFeedback.length > 0 ? (
          <div className="customer_feedback_div">
            <h2 className="customer_feedback_heading">
              Customer Story & Feedback
            </h2>
            <div className="feedbacks_container">
              {customerFeedback.map((item) => (
                <div className="feedbacks">
                  <div className="feedback_icon_div">
                    <FontAwesomeIcon icon={faComments} />
                  </div>
                  <div>
                    <p className="feedback_date">{item.date}</p>
                    <h3 className="feedback_title">{item.title}</h3>
                    <p className="feedback_description">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default Gallery;
/* End of added code 05/04/2023 */
