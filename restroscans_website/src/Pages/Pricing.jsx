// Added by:- Suman sahu On 05/04/2023
// Reason:- Create Home page for RestroScans

import React, { useEffect, useState } from "react";
import "./pricing.css";
import { PricingPlansGetApi } from "../api/service";
import config from "../api/config";

function Pricing() {
  // Added by:- Suman sahu On 15/04/2023
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
  // End of added code 15/04/2023

  return (
    <>
      <div className="Pricing_main_container">
        <h2 className="pricing_main_heading">Pricing</h2>
        <div className="pricings_div">
          {
            <div className="pricings_img_div">
              <img
                className="pricings"
                alt="Price"
                src={config.staticBaseURL + pricingData.pricing_plan1}
              />
            </div>
          }
          {
            <div className="pricings_img_div">
              <img
                className="pricings"
                alt="Price"
                src={config.staticBaseURL + pricingData.pricing_plan2}
              />
            </div>
          }
          {
            <div className="pricings_img_div">
              <img
                className="pricings"
                alt="Price"
                src={config.staticBaseURL + pricingData.pricing_plan3}
              />
            </div>
          }
          {
            <div className="pricings_img_div">
              <img
                className="pricings"
                alt="Price"
                src={config.staticBaseURL + pricingData.pricing_plan4}
              />
            </div>
          }
        </div>
      </div>
    </>
  );
}

export default Pricing;
/* End of added code 05/04/2023 */
