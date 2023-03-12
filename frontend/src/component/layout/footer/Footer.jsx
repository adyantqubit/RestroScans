import React, { useEffect,useState } from 'react';
import './Footer.css';
import { Alert } from "antd";
import { getfooterDetails } from '../../../api/Services';

 function Footer() {

  const [footerDetails, setFooterDetails] = useState([]); // Our Item set in this variable
  const [restaurantDescription, setRestaurantDescription] = useState([]); // Our Item set in this variable

  useEffect (()=>{
    getDetails(tenantt)
  },[])

  var tenantt = localStorage.getItem("tenantName")

  const getDetails = async () => {
    const response = await getfooterDetails(tenantt);
    if (response) {
      setFooterDetails(response.footer);
      setRestaurantDescription(response.descriptionList)

    }
  };
  console.log(footerDetails,restaurantDescription)

  return (
    <div>
    <div className='main_footer' 
    >
      <div className='main_description'>
              <marquee
                scrollDelay='200'
                style={{ color: "black", borderRadius: "15px" }}
              >
                {restaurantDescription.map((item) => item.content)}
                {/* Na tikka na Makhani, Dil bole biryani! */}
              </marquee>
            {/* }
          /> */}
      </div>

        <span className='footer_content' >
        {footerDetails.map((item) => item.content)}
          {/* Copyright © 2022 Restro scan */}
          </span>
        <br />
        <span >Powered By Adyant</span>
      </div>
    </div>
  )
}
export default Footer;
