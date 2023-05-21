// Added by:- Suman sahu On 05/04/2023
// Reason:- Create Home page for RestroScans

import React from "react";
import "./features.css";
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

function Features() {
  return (
    <>
      <div className="main_container_Features">
        <div className="main_section_features">
          <h2 className="heading_features"> Features</h2>
          <div className="container_features">
            <div className="lists_div_feature">
              <div className="first_div_feature_label">
                <div className="features_div">
                  <img src={InAppOrdering} className="logo_features" />
                  <label className="label_feature">In-app ordering</label>
                </div>

                <div className="features_div">
                  <img src={Table} className="logo_features" />
                  <label className="label_feature"> Table reservation</label>
                </div>

                <div className="features_div">
                  <img src={Onlinemenu} className="logo_features" />
                  <label className="label_feature">Online menu</label>
                </div>

                <div className="features_div">
                  <img src={Shopping} className="logo_features" />
                  <label className="label_feature">Shopping cart</label>
                </div>

                <div className="features_div">
                  <img src={Payment} className="logo_features" />
                  <label className="label_feature">
                    Multiple payment modes
                  </label>
                </div>

                <div className="features_div">
                  <img src={Notification} className="logo_features" />
                  <label className="label_feature">Push notification</label>
                </div>
              </div>

              <div className="second_div_feature_label">
                <div className="features_div">
                  <img src={Loyalty} className="logo_features" />
                  <label className="label_feature">Loyalty program</label>
                </div>

                <div className="features_div">
                  <img src={ReferralSchemes} className="logo_features" />
                  <label className="label_feature">Referral schemes</label>
                </div>

                <div className="features_div">
                  <img src={OrderTracking} className="logo_features" />
                  <label className="label_feature">
                    Real-time order tracking
                  </label>
                </div>

                <div className="features_div">
                  <img src={CustomerReviews} className="logo_features" />
                  <label className="label_feature">Customer reviews</label>
                </div>

                <div className="features_div">
                  <img src={SocialMedia} className="logo_features" />
                  <label className="label_feature">Social media sharing</label>
                </div>

                <div className="features_div">
                  <img src={ChatbotSupport} className="logo_features" />
                  <label className="label_feature">Chatbot support</label>
                </div>
              </div>
            </div>
            <div className="img_div_features">
              <img src={GIF} className="gif_features" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Features;
/* End of added code 05/04/2023 */
