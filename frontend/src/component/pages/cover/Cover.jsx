// Modification by Om
// Date : 15-02-23
// Reason : Show front page Restaurent detail

import "./Cover.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { gettenantList } from "../../../api/Services";
import siteConfig from "../../../config/config";
import { useContext } from 'react';
import { GlobalContext } from "../../../context/Context";
// import GlobalColor from './../Colors/GlobalColor'


function Cover() {
  var { tenantName, setTenantName } = useContext(GlobalContext);
  var { colors } = useContext(GlobalContext);


  var location = useLocation();
  var path = location.pathname; // This Variable help to find the path of our URL where the data comes

  var newStr = path.substring(path.indexOf('api/v1/') + 'api/v1/'.length, path.length)
  var seperatedWords = newStr.split('/')
  var tenant = seperatedWords[0]
  setTenantName(tenant)

  // Above method use for split the restaurent name

  const [tenantDetails, setTenantDetails] = useState(null); // Our data set in this variable which comes from backend

  useEffect(() => {
    getMenu(tenant);
    localStorage.setItem("tenantName", tenant)

  }, []);

  useEffect(()=>{
    if(tenantDetails!=null)
    localStorage.setItem("restroName", tenantDetails["restaurant"])

  },[tenantDetails])

  const getMenu = async () => {
    const response = await gettenantList(tenant);
    if (response) {
      setTenantDetails(response.tenantDetails);
    }
  };

  const navigate = useNavigate();
  const goToNext = () => {
    navigate("/menu-item");
  };
  console.log(tenantDetails)

  return (
    <div >
      {tenantDetails?<div
        style={{ color: 'blue', fontSize: '14px' }}
        className='front_page'

      >
        <img
          style={{ border: '1px solid black' }}
          src={siteConfig.siteURL + tenantDetails.restaurant_background_image}
          className='front_page_image'
        />
        {/* <h2
          className='front_page_lable'
          style={{ color: colors.backgroundTheme }}
        >
          {tenantDetails.restaurant}
        </h2> */}
        <div className="front_page_lable">

          {/* <h5 className="restaurant_img_div"
          > */}
          <h3 className="restro_name"
              style={{  color: colors.headingColor }}
            >
              {tenantDetails.restaurant}
            </h3>
            <img style={{ border: '1px solid black' }}
              src={siteConfig.siteURL + tenantDetails.restaurant_logo}
              className="restaurant_logo" width='2%'
            />&nbsp;
            
          {/* </h5> */}
        </div>

        <div style={{ marginLeft: 'auto', marginRight: 'auto', display: 'flex' }}>
          <button onClick
            ={goToNext} style={{ marginLeft: 'auto', marginRight: 'auto', display: 'flex', backgroundColor: colors.headingColor }} className='coverButton' >Explore menu</button >
        </div>
      </div>:null}
    </div>
  );
}
export default Cover;

// End of modification
