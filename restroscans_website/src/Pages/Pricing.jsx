// Added by:- Suman sahu On 05/04/2023
// Reason:- Create Home page for RestroScans

import React, { useEffect, useState } from "react";
import "./pricing.css";
import { PricingPlansGetApi } from "../api/service";
import config from "../api/config";

function Pricing() {
  // Added by:- Suman sahu On 15/04/2023
  // Reason:- Created for get Pricing plans details
  const [pricingData, setPricingData] = useState(null);
  const [content,setContent]=useState([])
  useEffect(() => {
    if(!pricingData)
    getPricingPlans();
    else{
     var contentArr =pricingData.content.split(",")
     setContent(contentArr)
    }
  }, [pricingData]);

  const getPricingPlans = async () => {
    const response = await PricingPlansGetApi();
    if (response) {
      setPricingData(response.pricingData);
    }
  };
  // console.log(pricingData);
  // End of added code 15/04/2023
  

  return (
    <>
      <div className="Pricing_main_container">
        <h2 className="pricing_main_heading">Pricing</h2>

          {
            <div>
              <div className="pricing_contents_div">
                <div className="content_left_div">
                  <img src={config.staticBaseURL + pricingData?.item_logo1} className="items_logo"/>
                  <p className="items_title">{pricingData?.item_title}</p>
                </div>
                <div className="content_right_div">
                  {content.map(c=>
                    <div dangerouslySetInnerHTML={{ __html: c }} className="items_description" />

                    )}
                </div>
              </div>

              <img
                className="pricings"
                alt="Price"
                src={config.staticBaseURL + pricingData?.pricing_plan1}
              />
            </div>
          }
          {/* {
            <div className="pricings_img_div">
              <img
                className="pricings"
                alt="Price11"
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
          } */}
      </div>
    </>
  );
}

export default Pricing;
/* End of added code 05/04/2023 */
