import "../style/Cover.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { gettenantList } from '../../services/coverService';
import siteConfig from "../../../../config/config";
import { useContext } from 'react';
import { GlobalContext } from "../../../../context/Context";
import GlobalColor from '../../../Theme/user_interface/containers/GlobalColor'
import Loader from "../../../../components/Loader/Loader";
import { TenantValidate } from "../../../../components/Validators/ConfirmTenant";
import SocialLinks from "../../../Footer/user_interface/components/SocialLinks";
import { useCoverState } from "../../usestate/coverState";
import { resolveTenantSlug } from '../../../../utils/tenant';

function Cover() {
  var { tenantName, tenantDetails,setTenantName,restaurant_name, setRestaurant_name,subscribePlan,setSubscribePlan } = useContext(GlobalContext);
  var { colors } = useContext(GlobalContext);

  TenantValidate()

  var location = useLocation();
  var path = location.pathname;

  useEffect(() => {
    var tenant = resolveTenantSlug()
    if (tenant) {
      localStorage.setItem("tenantName", tenant)
      setTenantName(tenant)
    }
  }, [path])

  var { isLoader, setIsLoader } = useCoverState();

  useEffect(() => {
    if (tenantDetails != null) {
      localStorage.setItem("restroName", tenantDetails["restaurant"])
      setRestaurant_name(tenantDetails["restaurant"])
      setIsLoader(false)
    }
  }, [tenantDetails])

  const navigate = useNavigate();
  const goToNext = () => {
    document.getElementById('header').style.display="flex"
    document.getElementById('footer').style.display="flex"
    navigate("/menu-item");
  };

  return (
    <>
      {isLoader == true ? <Loader /> :
        <div style={{backgroundImage: tenantDetails ? `url(${siteConfig.siteURL + tenantDetails.restaurant_background_image})` : undefined,backgroundRepeat:"no-repeat",backgroundSize:"cover"}}>
          <div><GlobalColor /></div>
          {tenantDetails ? <div
            className='front_page'
            onLoad={e => {
              document.getElementById('header').style.display="none"
              document.getElementById('footer').style.display="none"
            }}
          >
            <div className="front_page_lable">
              <h3 className="restro_name"
                style={{ color: 'white', textShadow: "0px 0px 7px black" }}
              >
                {tenantDetails.restaurant}
              </h3>
              <img
                src={siteConfig.siteURL + tenantDetails.restaurant_logo}
                className="restaurant_logo" width='2%' onClick={goToNext}
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
          <SocialLinks />
          </div> : null}
        </div>
      }
    </>
  );
}
export default Cover;
