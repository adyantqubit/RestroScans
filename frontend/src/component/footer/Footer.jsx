import React, { useEffect, useState } from 'react';
import './Footer.css';
import { getfooterDetails } from '../../api/Services';

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
              className='marquee_container'
              // style={{ color: "black", borderRadius: "15px" }}
            >
              {showdata.content}
            </marquee>

          </div>
        ))}
        </>:null}
       
        <div className='footer_content'>
          <span> <a className='anchor_container'  href="https://adyant.co.in/" target='_blank'>Adyant Powered © 2023</a>
       </span>
        </div>
      </div>
    </div>
  )
}
export default Footer;
