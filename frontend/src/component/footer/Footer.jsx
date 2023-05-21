import React, { useContext, useEffect, useState } from 'react';
import './Footer.css';
import { getfooterDetails } from '../../api/Services';
import { GlobalContext } from '../../context/Context';

function Footer() {
  var {colors}=useContext(GlobalContext)
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
      id="footer"
      >
        {/* Commented by rohan - 15/4/23
            Reason - commenting all To remove two columns and shown in into only one line */}
        {/* <div className={style.}></div> */}

        {/* {restaurantDescription.length > 0 ? <>
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
        </> : null}

        <div className='footer_content'>
          <span> <a className='anchor_container' href="https://adyant.co.in/" target='_blank'>Adyant Powered © 2023</a>
          </span>
        </div> */}
        {/* end of code */}

         {/* Commented by rohan - 15/4/23
            Reason - To remove two columns and shown in into only one line */}

          {/*   Added  by ROhankansari - 29/4/23 
                Reason- To adding footer color and styling  */}
        <div className='powered_text' style={{background:colors.bannerColor}}>
          <a className='anchor_container' style={{color:colors.backgroundTheme}} href="https://adyant.co.in/" target='_blank'>Adyant Powered © 2023</a>
        </div>
        {restaurantDescription.length > 0 ? 
        restaurantDescription.map((showdata) => (<marquee
          scrollDelay='100'
          className='marquee_container'
          style={{ backgroundColor: colors.backgroundTheme }}
        >
          {showdata.content}
        </marquee>)):null}
      {/* end of code- ROhankanari - 29/4/23 */}
      </div>
    </div>
  )
}
export default Footer;
