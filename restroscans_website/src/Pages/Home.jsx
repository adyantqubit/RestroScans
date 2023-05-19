// Added by:- Suman sahu On 05/04/2023
// Reason:- Create Home page for RestroScans

import React, { useEffect, useState } from "react";
import "./home.css";
// import Scanner from "../images/homeScannerImage.jpg";
import Table from "../images/table.png";
import Onlinemenu from "../images/onlinemenu.png";
import InAppOrdering from "../images/inappOrdering.png";
import Shopping from "../images/shopping.jpg";
import Payment from "../images/paymentMode.png";
import Notification from "../images/notification.png";
import OrderTracking from "../images/orderTracking.png";
import CustomerReviews from "../images/customerReviews.png";
import SocialMedia from "../images/socialmedia.png";
import Loyalty from "../images/loyalty.png";
import ReferralSchemes from "../images/referralSchemes.png";
import ChatbotSupport from "../images/chatbot.png";
import GIF from "../images/restroScan.gif";
import {
  PricingPlansGetApi,
  GalleryDetailsGetApi,
  OurTopRestaurentGetApi,
} from "../api/service";
import config from "../api/config";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination, Mousewheel, Keyboard } from "swiper";
import { useNavigate } from "react-router-dom";

function Home() {
  // Added by:- Suman sahu On 15/04/2023
  // Reason:- created for nevigate one page to another page
  const navigate = useNavigate();
  // End of added code 15/04/2023

  // Added by:- Suman sahu On 08/04/2023
  // Reason:- Created for get Pricing plans details
  const [pricingData, setPricingData] = useState([]);
  useEffect(() => {
    getPricingPlans();
  }, []);

  const getPricingPlans = async () => {
    const response = await PricingPlansGetApi();
    if (response) {
      setPricingData(response.pricingData);
    }
  };
  // End of added code 08/04/2023

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

  // Added by:- Suman sahu On 19/04/2023
  // Reason:- Created for get Top Restuarent details which is connected with us
  const [restaurentsData, setRestaurentsData] = useState([]);
  useEffect(() => {
    getRestaurentDetails();
  }, []);

  const getRestaurentDetails = async () => {
    const response = await OurTopRestaurentGetApi();
    if (response) {
      setRestaurentsData(response.restaurentsData);
    }
  };
  // End of added code 19/04/2023

  return (
    <>
      <div className="home_main_div">
        <div className="home_description_section">
          {/* <div className="description_left_img_div">
            <img src={Scanner} className="scanner_img" alt="scanner" />
          </div> */}
          <div className="description_content_div">
            <h2 className="description_heading">Restroscans</h2>
            <p className="restro_description">
              Restaurant management software is a comprehensive digital solution
              designed to streamline and optimize various operational aspects of
              running a restaurant. It combines multiple tools and features into
              a unified platform, providing restaurant owners and managers with
              efficient control over their establishment's day-to-day
              operations. Here's a description of restaurant management
              software: Overall, restaurant management software empowers owners
              and managers to streamline operations, enhance customer
              experiences, and make informed decisions. By automating repetitive
              tasks, optimizing resource allocation, and providing valuable
              insights, it contributes to improved efficiency, reduced costs,
              and increased profitability in the highly competitive restaurant
              industry.
            </p>
            <div className="description_btn_div">
              <button
                className="book_demo_btn"
                onClick={() => navigate("/restroscans")}
              >
                Book Demo
              </button>
            </div>
          </div>
        </div>

        <div className="home_benefits_section">
          <h2 className="benefits_heading">Benefits</h2>
          <div className="benefits_card_div">
            <div className="upper_div">
              <div className="benefits_card">
                <h3>Accessibility</h3>
                <p className="card_description">
                  By using the online edition, patrons can easily acquire the
                  menu.
                </p>
              </div>

              <div className="benefits_card">
                <h3>Convenience</h3>
                <p className="card_description">
                  Customers can easily search for specific dishes or items and
                  view detailed descriptions along with prices.
                </p>
              </div>

              <div className="benefits_card">
                <h3>Improved Accuracy</h3>
                <p className="card_description">
                  By employing an online menu, a restaurant can guarantee that
                  its menu is consistently current and precise, without being
                  concerned about any delays.
                </p>
              </div>
            </div>
            <div className="lower_div">
              <div className="benefits_card">
                <h3>Economical</h3>
                <p className="card_description">
                  An online menu can be a cost-efficient option compared to
                  printed menus, which can be costly to create and maintain.
                </p>
              </div>

              <div className="benefits_card">
                <h3>Enhanced customer experience</h3>
                <p className="card_description">
                  Restaurants can enhance overall customer satisfaction by
                  providing an easy-to-use and informative menu, which can
                  result in increased customer loyalty and repeat business.
                </p>
              </div>

              <div className="benefits_card">
                <h3>Environmental advantages</h3>
                <p className="card_description">
                  By decreasing the need for printed menus, it can reduce paper
                  waste and contribute positively to the environment.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="home_features_section">
          <h2 className="features_heading"> Features</h2>
          <div className="features_container">
            <div className="feature_lists_div">
              <div className="feature_label_first_div">
                <div className="features">
                  <img src={InAppOrdering} className="features_logo" />
                  <label className="feature_label">In-app ordering</label>
                </div>

                <div className="features">
                  <img src={Table} className="features_logo" />
                  <label className="feature_label"> Table reservation</label>
                </div>

                <div className="features">
                  <img src={Onlinemenu} className="features_logo" />
                  <label className="feature_label">Online menu</label>
                </div>

                <div className="features">
                  <img src={Shopping} className="features_logo" />
                  <label className="feature_label">Shopping cart</label>
                </div>

                <div className="features">
                  <img src={Payment} className="features_logo" />
                  <label className="feature_label">
                    Multiple payment modes
                  </label>
                </div>

                <div className="features">
                  <img src={Notification} className="features_logo" />
                  <label className="feature_label">Push notification</label>
                </div>
              </div>

              <div className="feature_label_second_div">
                <div className="features">
                  <img src={Loyalty} className="features_logo" />
                  <label className="feature_label">Loyalty program</label>
                </div>

                <div className="features">
                  <img src={ReferralSchemes} className="features_logo" />
                  <label className="feature_label">Referral schemes</label>
                </div>

                <div className="features">
                  <img src={OrderTracking} className="features_logo" />
                  <label className="feature_label">
                    Real-time order tracking
                  </label>
                </div>

                <div className="features">
                  <img src={CustomerReviews} className="features_logo" />
                  <label className="feature_label">Customer reviews</label>
                </div>

                <div className="features">
                  <img src={SocialMedia} className="features_logo" />
                  <label className="feature_label">Social media sharing</label>
                </div>

                <div className="features">
                  <img src={ChatbotSupport} className="features_logo" />
                  <label className="feature_label">Chatbot support</label>
                </div>
              </div>
            </div>
            <div className="features_img_div">
              <img src={GIF} className="features_gif" />
            </div>
          </div>
        </div>

        <div className="pricing_gallery_clients">
          {/* <div className="home_pricing_section">
            <h2 className="pricing_heading">Pricing</h2>
            {
              <img
                className="pricing_images"
                alt="Price"
                src={config.staticBaseURL + pricingData.pricing_plan1}
              />
            }
          </div> */}

          {pricingData != null && pricingData.length > 0 ? (
            <div className="pricing_gallery_clients">
              <div className="home_pricing_section">
                <h2 className="pricing_heading">Pricing</h2>
                <Swiper
                  cssMode={true}
                  navigation={true}
                  slidesPerView={1}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  pagination={{ clickable: true }}
                  mousewheel={true}
                  keyboard={true}
                  centeredSlides={true}
                  modules={[
                    Autoplay,
                    Navigation,
                    Pagination,
                    Mousewheel,
                    Keyboard,
                  ]}
                  className="pricing_slider_div"
                >
                  {pricingData.map((item) => (
                    <SwiperSlide>
                      <img
                        src={config.staticBaseURL + item.pricing_plan1}
                        className="pricing_images"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          ) : null}

          {galleryData != null && galleryData.length > 0 ? (
            <div className="home_gallery_section_1">
              <div className="home_gallery_section">
                <h2 className="gallery_heading">Gallery</h2>
                <Swiper
                  cssMode={true}
                  navigation={true}
                  slidesPerView={3}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  pagination={{ clickable: true }}
                  mousewheel={true}
                  keyboard={true}
                  modules={[
                    Autoplay,
                    Navigation,
                    Pagination,
                    Mousewheel,
                    Keyboard,
                  ]}
                  className="gallery_slider_div"
                >
                  {galleryData.map((item) => (
                    <SwiperSlide>
                      <img
                        src={config.staticBaseURL + item.gallery}
                        className="galary_slider_images"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          ) : null}

          {restaurentsData != null && restaurentsData.length > 0 ? (
            <div className="home_restaurent_section">
              <h2 className="restaurent_heading">
                Restaurant's connected with us
              </h2>
              <div className="restaurents_container">
                {restaurentsData.map((item) => (
                  <div className="restaurents">
                    <img
                      className="restaurent_logo"
                      src={config.staticBaseURL + item.restaurant_logo}
                    />
                    <p className="restaurent_title">{item.restaurant_name}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default Home;
/* End of added code 05/04/2023 */
