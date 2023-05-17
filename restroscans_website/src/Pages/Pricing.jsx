// Added by:- Suman sahu On 05/04/2023
// Reason:- Create Home page for RestroScans

import React, { useEffect, useState } from "react";
import "./pricing.css";
import { PricingPlansGetApi, PricingPlansDetailGetApi } from "../api/service";
import config from "../api/config";

function Pricing() {
  // Added by:- Suman sahu On 15/04/2023
  // Reason:- Created for get Pricing Image
  const [pricingData, setPricingData] = useState(null);
  const [content, setContent] = useState([]);
  useEffect(() => {
    if (!pricingData) getPricingPlans();
    else {
      var contentArr = pricingData.content.split(",");
      setContent(contentArr);
    }
  }, [pricingData]);

  const getPricingPlans = async () => {
    const response = await PricingPlansGetApi();
    if (response) {
      setPricingData(response.pricingData);
    }
  };
  // console.log(pricingData);
  // End of added code by- Suman sahu On 15/04/2023

  
  // Added by:- Suman sahu On 17/05/2023
  // Reason:- Created for get Pricing plans details
  const [Data, setData] = useState(null);
  const [cont, setCont] = useState([]);
  useEffect(() => {
    console.log("++++++++++++++++++++",Data)
    if (!Data){ getPricingDetails();}
    else {
      var contentArr =[]
      for (var i=0;i<Data.length;i++){
        contentArr.push( Data[i].content.split(","));
      }
      setCont(contentArr);
    }
  }, [Data]);

  const getPricingDetails = async () => {
    const response = await PricingPlansDetailGetApi();
    if (response) {
      setData(response.pricingPlansData);
    }
  };
  // End of added code by- Suman sahu On 15/04/2023

  return (
    <>
      <div className="Pricing_main_container">
        <h2 className="pricing_main_heading">Pricing</h2>
        {
          <div>
            <img
              className="pricings"
              alt="Price"
              src={config.staticBaseURL + pricingData?.pricing_plan1}
            />
           
          </div>
        }
        {Data?
          <div style={{paddingTop:"2rem"}} >
            <div className="pricing_main_heading">Feature Details</div>
            {Data.map((item)=>{
              return( 
                
              <div class="pricing_container">
                <div className="left_pricing_container">
                  <img  className="pricing_items_logo" src={config.staticBaseURL + item?.pricing_logo}/>
                  <div className="items_title">{item.pricing_title}</div>
                </div>
                <div className="right_pricing_container"  >
                {
                  item.content.split(",").map((d)=>{
                    return <div className="items_description">{d}</div>
                  })
                }
                </div>
              </div>
              )
            })}
          </div>
        :null}

       
        
               
      </div>
    </>
  );
}

export default Pricing;
/* End of added code 05/04/2023 */
