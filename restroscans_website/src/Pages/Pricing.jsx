// Added by:- Suman sahu On 05/04/2023
// Reason:- Create Home page for RestroScans

import React, { useEffect, useState } from "react";
import "./pricing.css";
import { PricingPlansGetApi, PricingPlansDetailGetApi } from "../api/service";
import config from "../api/config";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination, Mousewheel, Keyboard } from "swiper";
import { Modal } from "antd";

function Pricing() {
  // Added by:- Suman sahu On 15/04/2023
  // Reason:- Created for get Pricing Image
  const [pricingData, setPricingData] = useState(null);

  useEffect(() => {
    getPricingPlans();
  }, []);

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
    if (!Data) {
      getPricingDetails();
    } else {
      var contentArr = [];
      for (var i = 0; i < Data.length; i++) {
        contentArr.push(Data[i].content.split(","));
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

  // Added by - Suman sahu On 21/05/2023
  // reason - open model when click on pricing images
  var [flteredPricingData, setFilteredPricingData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (e) => {
    setIsModalOpen(true);
    var filterData = pricingData.filter((dt)=>dt.id == e)
    setFilteredPricingData(filterData)
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // End of commented code by - Suman sahu On 21/05/2023

  return (
    <>
      <div className="Pricing_main_container">
        {/* {
          <div>
            <img
              className="pricings"
              alt="Price"
              src={config.staticBaseURL + pricingData?.pricing_plan1}
            />
           
          </div>
        } */}
        {pricingData != null && pricingData.length > 0 ? (
          <div className="pricing_section_1">
            <h2 className="pricing_main_heading">Pricing</h2>
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
              modules={[Autoplay, Navigation, Pagination, Mousewheel, Keyboard]}
              className="slider_div_pricing"
            >
              {pricingData.map((item) => (
                <SwiperSlide>
                  <img
                    src={config.staticBaseURL + item.pricing_plan1}
                    className="images_pricing"
                    onClick={(e) => {
                      showModal(item.id);
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : null}

        {Data != null && Data.length > 0 ? (
          <div>
            <div className="pricing_main_heading">Feature Details</div>
            {Data.map((item) => {
              return (
                <div className="pricing_plans">
                  <div class="pricing_container">
                    <div className="left_pricing_container">
                      <img
                        className="pricing_items_logo"
                        src={config.staticBaseURL + item?.pricing_logo}
                      />
                      <div className="items_title">{item.pricing_title}</div>
                    </div>
                    <div className="right_pricing_container">
                      {item.content.split(",").map((d) => {
                        return <div className="items_description">{d}</div>;
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      {flteredPricingData != null && flteredPricingData.length > 0 ? (
        <Modal
          title="Basic Modal"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          {flteredPricingData.map((item) => (
            <img
              src={config.staticBaseURL + item.pricing_plan1}
              className="modal_pricing_images"
            />
          ))}
        </Modal>
      ) : null}
    </>
  );
}

export default Pricing;
/* End of added code 05/04/2023 */
