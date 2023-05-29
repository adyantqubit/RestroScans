// Modification by Om
// Date : 15-02-23
// Reason : Show front page Restaurent detail

import "./Cover.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { gettenantList } from "../../api/Services";
import siteConfig from "../../config/config";
import { useContext } from 'react';
import { GlobalContext } from "../../context/Context";
import GlobalColor from '../Colors/GlobalColor'
import Loader from "../Loader/Loader";
import { TenantValidate } from "../Validators/ConfirmTenant";
import SocialLinks from "../social_links/SocialLinks";

function Cover() {
  var { tenantName, tenantDetails,setTenantName,restaurant_name, setRestaurant_name,subscribePlan,setSubscribePlan } = useContext(GlobalContext);
  var { colors } = useContext(GlobalContext);

// added by rohan - 17/4/23
  // reason- To validate user is in same tenant of not
  TenantValidate()
  // end of code - rohan kansari -17/4/23
  
  

  

  var location = useLocation();
  var path = location.pathname; // This Variable help to find the path of our URL where the data comes


  // var newStr = path.substring(path.indexOf('api/v1/') + 'api/v1/'.length, path.length)
  // alert(path)
  var seperatedWords = path.split('/')
  // alert(seperatedWords)
  var tenant = seperatedWords[1]
  if(seperatedWords[seperatedWords.length-1]=="home"){
  localStorage.setItem("tenantName", tenant)
  // alert(tenant)
  setTenantName(tenant)
  }

  // Above method use for split the restaurent name

  //const [tenantDetails, setTenantDetails] = useState(null); // Our data set in this variable which comes from backend
  const [isLoader, setIsLoader] = useState(true)
//removed by rohan kansari- 18/4/23 - To provide tenant detail in all page throungh context

  useEffect(() => {
    if (tenantDetails != null) {
      localStorage.setItem("restroName", tenantDetails["restaurant"])
      setRestaurant_name(tenantDetails["restaurant"])
      //added by rohan-18/4/23
      setIsLoader(false)
    }
  }, [tenantDetails])

  
  //Remove this api calling and moved it to context 
  //removed by rohan -18/4/23

  const navigate = useNavigate();
  const goToNext = () => {
    document.getElementById('header').style.display="flex"
    document.getElementById('footer').style.display="flex"
    navigate("/menu-item");
  };



  return (
    <>
      {isLoader == true ? <Loader /> :
      // Added by Rohan  kansari- 3/5/23 
      // Reason - To apply bg-image in div  
        <div style={{backgroundImage:`url(${siteConfig.siteURL + tenantDetails.restaurant_background_image})`,backgroundRepeat:"no-repeat",backgroundSize:"cover"}}>
          <div><GlobalColor /></div>
          {tenantDetails ? <div
            className='front_page'
            onLoad={e => {
              document.getElementById('header').style.display="none"
              document.getElementById('footer').style.display="none"
              // added by rohan - 9/4/23
              // reason- To hide header from cover page
              // document.getElementsByClassName("heading_container")[0].style.display = "none"
              // end of code
            }}
          >
            {/* Commented by - Rohan kansari- 3/5/23
                Reason - give ackground image in div not in different node  */}
            {/* <img
              src={siteConfig.siteURL + tenantDetails.restaurant_background_image}
              className='front_page_image'
            /> */}
            <div className="front_page_lable">
              <h3 className="restro_name"
                style={{ color: 'white', textShadow: "0px 0px 7px black" }}
              >
                {tenantDetails.restaurant}
              </h3>
              <img
              // Modified by ROhankansari - 13/5/23
              // Reason -To jump into enu page on logo click also
                src={siteConfig.siteURL + tenantDetails.restaurant_logo}
                className="restaurant_logo" width='2%' onClick={goToNext}
              //ENd of code - Rohan kansari - 13/5/23 
              />&nbsp;
            </div>
            <div className="front_child_div">
              <button onClick
                ={goToNext} style={{ backgroundColor: 'white' }} className='coverButton' >Explore Menu</button >
              <span
                className='address_content'
                style={{ color: 'white', textShadow: "0px 0px 7px black" }}
              > <b>
                  {tenantDetails.restaurant_address
                  }</b>
              </span>
            </div>
            {/* Added by Yuvraj Sahu on 25-05-2023
               Reason - to give social median link */}
          <SocialLinks />
          {/* End of addition by 
              Yuvraj Sahu on 25-05-2023 */}
          </div> : null}
        </div>
      }
    </>
  );
}
export default Cover;

// End of modification
