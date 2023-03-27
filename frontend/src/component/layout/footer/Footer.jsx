import React, { useEffect, useState } from 'react';
import './Footer.css';
import { getfooterDetails } from '../../../api/Services';

function Footer() {

  const [footerDetails, setFooterDetails] = useState([]); // Our Item set in this variable
  const [restaurantDescription, setRestaurantDescription] = useState([]); // Our Item set in this variable

  useEffect(() => {
    getDetails(tenantt)
  }, [])

  var tenantt = localStorage.getItem("tenantName")

  const getDetails = async () => {
    const response = await getfooterDetails(tenantt);
    if (response) {
      setFooterDetails(response.footer);
      setRestaurantDescription(response.descriptionList)

    }
  };

  return (
    <div>
      <div className='main_footer'
      >
        {restaurantDescription.length > 0 ? <>
        {restaurantDescription.map((showdata) => (
          <div className='main_description'>
            <marquee
              scrollDelay='200'
              style={{ color: "black", borderRadius: "15px" }}
            >
              {showdata.content}
            </marquee>

          </div>
        ))}
        </>:null}
        {/* <span className='footer_content' >
          {footerDetails.map((item) => item.content)}
        </span> */}
        {/* <br /> */}
        {/* <span style={{ fontSize: '13px' }}>Powered by Adyant</span> */}
        <div className='footer_content'>
          {/* <span > Copyright © 2023 Adyant</span> */}
          <span> <a style={{color:'black',fontSize:'13px',textDecoration:'none'}}  href="https://adyant.co.in/" >Copyright © 2023 Adyant</a>
       </span>
        </div>
       
      </div>
    </div>
  )
}
export default Footer;
