// Created by- Suman sahu On 24/05/2023
// reason- create sidebar for react js admin panel

import React, { useContext, useEffect, useState } from "react";
import style from "./sidebar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FaCaretRight, FaCaretLeft } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { FaCaretDown } from "react-icons/fa"
// import component 👇
import Drawer from 'react-modern-drawer'

//import styles 👇
import 'react-modern-drawer/dist/index.css'
import { GlobalContext } from "../../Context/Context";

const Sidebar = ({sidebar, setSidebar}) => {
  const navigate = useNavigate();

  var { showOfferForm, setShowOfferForm, disabled, setDisabled } =
    useContext(GlobalContext);

  {/* Modified by Rohan Kansari - 26/5/23 
      Reason -To add sub menu functionality in report menu */}
  const [ReportSubVisible, setReportSubVisible] = useState(false)
  {/*End of code -Rohan Kansari 26/5/23  */ }

  const [overlayEnable,setOverlayEnable]=useState(false)

  function closeSidebar() {
    setSidebar(false);
  }
  // Added by Om Shrivastava on 02-06-23
  // Reason : Need to navigate when user click the main div
  const navigateToDashboard = () => {
    // Added by Rohan Kansari - 23/6/23
    // Reason - Save default value in localstorage of page index and list per page
    localStorage.setItem("globalPageIndex", 1);
    localStorage.setItem("listPerPage", 10)
    // ENd of code - ROhan Kansari - 23/6/23

    // Added by ROhan kansari - 30/6/23
    localStorage.setItem("selectedTab","Newly_placed")
    // End of code - Rohan kansari - 30/6/23
    
    // Added by Rohan Kansari - 25/6/23
    // Reason - close drawer when you are mobile view
    if (windowSize.innerWidth < 800)
       setSidebar(false)
    // ENd of code - ROhan Kansari - 26/6/23
    
    navigate('/Dashboard');
  };

  // Added by Rohan kansari - 15/9/23 
  // Reason - To naviagte waiter dashboard
  function navigateToWaiterDashbaord() {
    if (windowSize.innerWidth < 800)
      setSidebar(false)
    navigate("/WaiterDashboard")
  }
  // End of code - Rohan Kansari 15/9/23 - To naviagte waiter dashboard

  const navigateToBanner = () => {
    // Added by Rohan Kansari - 23/6/23
    // Reason - Save default value in localstorage of page index and list per page
    localStorage.setItem("globalPageIndex", 1);
    localStorage.setItem("listPerPage", 10)
    // ENd of code - ROhan Kansari - 23/6/23

    // Added by Rohan Kansari - 25/6/23
    // Reason - close drawer when you are mobile view
    if (windowSize.innerWidth < 800)
       setSidebar(false)
    // ENd of code - ROhan Kansari - 26/6/23
    // Added by Om Shrivastava on 11-09-23
    // Reason : When user click the offer page then form should be automatic closed.
    setShowOfferForm(false);
    setDisabled(false);
    // End of addition by Om Shrivastava on 11-09-23
    // Reason : When user click the offer page then form should be automatic closed.
    navigate('/BannerOffer');
  };
  const navigateToOrderReport = () => {
    // Added by Rohan Kansari - 23/6/23
    // Reason - Save default value in localstorage of page index and list per page
    localStorage.setItem("globalPageIndex", 1);
    localStorage.setItem("listPerPage", 10)
    // ENd of code - ROhan Kansari - 23/6/23
    // Added by Rohan Kansari - 25/6/23
    // Reason - close drawer when you are mobile view
    if (windowSize.innerWidth < 800)
       setSidebar(false)
    // ENd of code - ROhan Kansari - 26/6/23

    // Commented and modified by :- Parineeta Gedam on :- 02-08-2023 
    // reason :- create a new component for order report
    // navigate('/OrderReport');
    navigate('/NewOrderReport');
    // Commented and modified by :- Parineeta Gedam on :- 02-08-2023 
    // reason :- create a new component for order report
    

  };
  const navigateToOrderItemReport = () => {
    // Added by Rohan Kansari - 23/6/23
    // Reason - Save default value in localstorage of page index and list per page
    localStorage.setItem("globalPageIndex", 1);
    localStorage.setItem("listPerPage", 10);
    // ENd of code - ROhan Kansari - 23/6/23
    // Added by Rohan Kansari - 25/6/23
    // Reason - close drawer when you are mobile view
    if (windowSize.innerWidth < 800)
       setSidebar(false)
    // ENd of code - ROhan Kansari - 26/6/23
    navigate('/OrderItemReport');
  };
  const navigateToCustomerReport = () => {
    // Added by Rohan Kansari - 23/6/23
    // Reason - Save default value in localstorage of page index and list per page
    localStorage.setItem("globalPageIndex", 1);
    localStorage.setItem("listPerPage", 10);
    // ENd of code - ROhan Kansari - 23/6/23
    // Added by Rohan Kansari - 25/6/23
    // Reason - close drawer when you are mobile view
    if (windowSize.innerWidth < 800)
       setSidebar(false)
    // ENd of code - ROhan Kansari - 26/6/23
    navigate('/CustomerReport');
  };
  const navigateToRevenue = () => {
    // Added by Rohan Kansari - 25/6/23
    // Reason - close drawer when you are mobile view
    if (windowSize.innerWidth < 800)
       setSidebar(false)
    // ENd of code - ROhan Kansari - 26/6/23
    
    // Added by Rohan Kansari - 2/9/23
    // Reason - To save page data in page opening
    localStorage.setItem("globalPageIndex", 1);
    localStorage.setItem("listPerPage", 10);
    // End of code addition by Rohan Kansari - 2/9/23
    // Reason - To save page data in page opening
    
    navigate('/Revenue');
  };
  const navigateToBannerItems = () => {
    // Added by Rohan Kansari - 23/6/23
    // Reason - Save default value in localstorage of page index and list per page
    localStorage.setItem("globalPageIndex", 1);
    localStorage.setItem("listPerPage", 10)
    // ENd of code - ROhan Kansari - 23/6/23
    // Added by Rohan Kansari - 25/6/23
    // Reason - close drawer when you are mobile view
    if (windowSize.innerWidth < 800)
       setSidebar(false)
    // ENd of code - ROhan Kansari - 26/6/23
    navigate('/BannerOfferItem');
  };
  const navigateToMenu = () => {
    // Added by Rohan Kansari - 23/6/23
    // Reason - Save default value in localstorage of page index and list per page
    localStorage.setItem("globalPageIndex", 1);
    localStorage.setItem("listPerPage", 10)
    // ENd of code - ROhan Kansari - 23/6/23
    // Added by Rohan Kansari - 25/6/23
    // Reason - close drawer when you are mobile view
    if (windowSize.innerWidth < 800)
       setSidebar(false)
    // ENd of code - ROhan Kansari - 26/6/23
    navigate('/Menu');
  };
  const navigateToCategory = () => {
    // Added by Rohan Kansari - 23/6/23
    // Reason - Save default value in localstorage of page index and list per page
    localStorage.setItem("globalPageIndex", 1);
    localStorage.setItem("listPerPage", 10)
    // ENd of code - ROhan Kansari - 23/6/23
    // Added by Rohan Kansari - 25/6/23
    // Reason - close drawer when you are mobile view
    if (windowSize.innerWidth < 800)
       setSidebar(false)
    // ENd of code - ROhan Kansari - 26/6/23
    navigate('/Category');
  };
  const navigateToItem = () => {
    // Added by Rohan Kansari - 23/6/23
    // Reason - Save default value in localstorage of page index and list per page
    localStorage.setItem("globalPageIndex", 1);
    localStorage.setItem("listPerPage", 10)
    // ENd of code - ROhan Kansari - 23/6/23
    // Added by Rohan Kansari - 25/6/23
    // Reason - close drawer when you are mobile view
    if (windowSize.innerWidth < 800)
       setSidebar(false)
    // ENd of code - ROhan Kansari - 26/6/23
    navigate('/item');
  };
  const navigateToSetting = () => {
    // Added by Rohan Kansari - 25/6/23
    // Reason - close drawer when you are mobile view
    if (windowSize.innerWidth < 800)
       setSidebar(false)
    // ENd of code - ROhan Kansari - 26/6/23
    navigate('/SettingForm');
  };
  const navigateToFooter = () => {
    // Added by Rohan Kansari - 25/6/23
    // Reason - close drawer when you are mobile view
    if (windowSize.innerWidth < 800)
       setSidebar(false)
    // ENd of code - ROhan Kansari - 26/6/23
    navigate('/FooterDescription');
  };
  const navigateToCustomerDetail = () => {
    // Added by Rohan Kansari - 23/6/23
    // Reason - Save default value in localstorage of page index and list per page
    localStorage.setItem("globalPageIndex", 1);
    localStorage.setItem("listPerPage", 10)
    // ENd of code - ROhan Kansari - 23/6/23
    // Added by Rohan Kansari - 25/6/23
    // Reason - close drawer when you are mobile view
    if (windowSize.innerWidth < 800)
       setSidebar(false)
    // ENd of code - ROhan Kansari - 26/6/23
    navigate('/CustomerDetail');
  };
  const navigateToOrder = () => {
    // Added by Rohan Kansari - 23/6/23
    // Reason - Save default value in localstorage of page index and list per page
    localStorage.setItem("globalPageIndex", 1);
    localStorage.setItem("listPerPage", 10)
    // ENd of code - ROhan Kansari - 23/6/23
    // Added by Rohan Kansari - 25/6/23
    // Reason - close drawer when you are mobile view
    if (windowSize.innerWidth < 800)
       setSidebar(false)
    // ENd of code - ROhan Kansari - 26/6/23
    navigate('/Order');
  };
  const navigateToOrderItem = () => {
    // Added by Rohan Kansari - 23/6/23
    // Reason - Save default value in localstorage of page index and list per page
    localStorage.setItem("globalPageIndex", 1);
    localStorage.setItem("listPerPage", 10)
    // ENd of code - ROhan Kansari - 23/6/23
    // Added by Rohan Kansari - 25/6/23
    // Reason - close drawer when you are mobile view
    if (windowSize.innerWidth < 800)
       setSidebar(false)
    // ENd of code - ROhan Kansari - 26/6/23
    navigate('/OrderItem');
  };
  const navigateToPayment = () => {
    // Added by Rohan Kansari - 23/6/23
    // Reason - Save default value in localstorage of page index and list per page
    localStorage.setItem("globalPageIndex", 1);
    localStorage.setItem("listPerPage", 10)
    // ENd of code - ROhan Kansari - 23/6/23
    // Added by Rohan Kansari - 25/6/23
    // Reason - close drawer when you are mobile view
    if (windowSize.innerWidth < 800)
       setSidebar(false)
    // ENd of code - ROhan Kansari - 26/6/23
    navigate('/PaymentMethod');
  };
  const navigateToQR = () => {
    // Added by Rohan Kansari - 25/6/23
    // Reason - close drawer when you are mobile view
    if (windowSize.innerWidth < 800)
       setSidebar(false)
    // ENd of code - ROhan Kansari - 26/6/23
    navigate('/QRcode');
  };
  // End of addition by Om Shrivastava on 02-06-23
  /**
   * Added by Yuvraj Sahu on 12-06-2023
   * Reason - to navigate social media page
   */
  const navigateToSocialList = () => {
    // Added by Rohan Kansari - 25/6/23
    // Reason - close drawer when you are mobile view
    if (windowSize.innerWidth < 800)
       setSidebar(false)
    // ENd of code - ROhan Kansari - 26/6/23
    navigate("/social-media");
  };
  /**
   * End of addition by yuvraj Sahu on 12-06-2023
   */
/**
   * Added by Om Shrivastava on 24-07-2023
   * Reason - to navigate restaurant rating review
   */

  const navigateToRatingReviewList = () => {
  // Added by Om Shrivastava on 26-07-23
  // Reason : Set the list per page data
  localStorage.setItem("globalPageIndex", 1);
  localStorage.setItem("listPerPage", 10)
  // End of addition by Om Shrivastava on 26-07-23
  // Reason : Set the list per page data
  if (windowSize.innerWidth < 800)
     setSidebar(false)
  navigate("/RatingReview");
};
/**
 * End of addition by Om Shrivastava on 24-07-2023
 * Reason - to navigate restaurant rating review
 */

/**
   * Added by Pratap Sahu on 21-08-2-23
   * Reason - to navigate ReservationList
   */
const navigateToReservationList = () => {
  // Added by Om Shrivastava on 26-07-23
  // Reason : Set the list per page data
  localStorage.setItem("globalPageIndex", 1);
  localStorage.setItem("listPerPage", 10)
  // End of addition by Pratap Sahu on 21-08-2-23
  // Reason : Set the list per page data
  if (windowSize.innerWidth < 800)
     setSidebar(false)
  navigate("/ReservationList");
};
/**
 * End of addition by Pratap Sahu on 21-08-2-23
 * Reason - to navigate ReservationList
 */


  // Added by ROhan kansari - 25/6/23
  // Reason - getting widowsize 
  
  const navigateToWaiter = () => {
    
    if (windowSize.innerWidth < 800)
      setSidebar(false) 
    navigate('/Waiter');
  };

  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };


  }, [window.innerWidth]);

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  useEffect(() => {
   
    if (windowSize.innerWidth < 767)
       setOverlayEnable(true)
    else if (windowSize.innerWidth > 767)
      setOverlayEnable(false)
  }, [windowSize])

  // End of code - Rohan kansari - 25/6/23

  return (
    // Modified by Rohan kansari - 25/6/23
    // Reason - To implementing drawer
    <div className={style.container} id="sidebar">

      <Drawer
        open={sidebar}
        onClose={e => setSidebar(!sidebar)}
        direction='left'
        className={style.drawer}
        enableOverlay={overlayEnable}
      // style={{width:"20%"}}
      >
        {/*         
         <div className={style.sidebar_open_div}>
        <FaCaretRight
          onClick={() => {
            setSidebar(!sidebar);
          }}
          className={
            sidebar == true
              ? style.hide_sidebar_openarrow
              : style.show_sidebar_openarrow
          }
        />
      </div> */}
        <ul
        // Added by Rohan kansari - 13/9/23 - To hide sidebar for waiter 
         id={localStorage.getItem("waiterData") ? style.hideSidebar : null}
          className={sidebar == true ? style.open_sidebar : style.close_sidebar}
        >
          {/* Added by Rohan kansari - 7/9/23
            Reason - To change it place */}
          <li className={style.links_div} onClick={navigateToRevenue}>
            <NavLink
              // commented and modified by - Suman sahu on - 17/06/2023
              // reason- for design active link
              // className={style.link}
              className={({ isActive }) => (isActive ? style.active : style.link)}
              // end of modification by - Suman sahu on - 17/06/2023
              to="/Revenue"
            >
              {" "}
              Revenue{" "}
            </NavLink>
          </li>

          <li className={style.links_div} onClick={navigateToDashboard}>
            <NavLink
              // commented and modified by - Suman sahu on - 17/06/2023
              // reason- for design active link
              // className={style.link}
              className={({ isActive }) => (isActive ? style.active : style.link)}
              // end of modification by - Suman sahu on - 17/06/2023
              to="/Dashboard"
            // Added by Rohan kansari - 22/6/23
            // Reason - To set page index by default 1 on side bar page link
            // Removed By ROhan kansari - 23/6/23 
            // Reason - place changed and calling it on li function
            // onClick={e=>{localStorage.setItem("globalPageIndex",1); localStorage.setItem("listPerPage",10)}}
            // End of code - Rohan kansari - 22/6/23
            >
              {" "}
              Dashboard{" "}
            </NavLink>
          </li>
          <li className={style.links_div} onClick={navigateToBanner}>
            <NavLink
              // commented and modified by - Suman sahu on - 17/06/2023
              // reason- for design active link
              // className={style.link}
              className={({ isActive }) => (isActive ? style.active : style.link)}
              // end of modification by - Suman sahu on - 17/06/2023
              to="/BannerOffer"
            // Added by Rohan kansari - 22/6/23
            // Reason - To set page index by default 1 on side bar page link
            // Removed By ROhan kansari - 23/6/23 
            // Reason - place changed and calling it on li function
            // onClick={e=>{localStorage.setItem("globalPageIndex",1); localStorage.setItem("listPerPage",10)}}
            // End of code - Rohan kansari - 22/6/23
            >
              {" "}
              Banner/Offer{" "}
            </NavLink>
          </li>
          {/* Added by ROhan Kansari - To open report page - 26/5/23*/}
          <li
            className={`${style.links_div} ${style.link}`}
            onClick={(e) => setReportSubVisible(!ReportSubVisible)}
          >
            Report
            {/* commented and modified by - Suman sahu on 15/06/2023 
              reason - for change icon*/}
            {/* <AiOutlinePlus color="white" /> */}
            <FaCaretDown className={style.dropdown_icon} />
            {/* end of modification by suman sahu on 15/06/2023 */}
          </li>

          {ReportSubVisible ? (
            <ul style={{ marginTop: "-10px" }}>
              {/* Modified by ROhan kansari - 26/8/23 - 
                Reason - this men is not selected o=in on click so need to change on click position */}
              <li className={style.Sublinks_div} onClick={navigateToOrderReport}>
                <NavLink
                  // commented and modified by - Suman sahu on - 17/06/2023
                  // reason- for design active link
                  // className={style.sublink}
                  className={({ isActive }) =>
                    isActive ? style.active : style.sublink
                  }

                  // end of modification by - Suman sahu on - 17/06/2023
                  // Modified by Rohan kansari - 27/8/23 - To correct link mnaming
                  // to="/OrderReport"
                  to="/NewOrderReport"
                // Added by Rohan kansari - 22/6/23
                // Reason - To set page index by default 1 on side bar page link
                // Removed By ROhan kansari - 23/6/23 
                // Reason - place changed and calling it on li function
                // onClick={e=>{localStorage.setItem("globalPageIndex",1); localStorage.setItem("listPerPage",10)}}
                // End of code - Rohan kansari - 22/6/23
                >
                  Order Report
                </NavLink>
              </li>
              <li
                className={style.Sublinks_div}
                onClick={navigateToOrderItemReport}
              >
                <NavLink
                  // commented and modified by - Suman sahu on - 17/06/2023
                  // reason- for design active link
                  // className={style.sublink}
                  className={({ isActive }) =>
                    isActive ? style.active : style.sublink
                  }
                  // end of modification by - Suman sahu on - 17/06/2023
                  to="/OrderItemReport"
                // Added by Rohan kansari - 22/6/23
                // Reason - To set page index by default 1 on side bar page link
                // Removed By ROhan kansari - 23/6/23 
                // Reason - place changed and calling it on li function
                // onClick={e=>{localStorage.setItem("globalPageIndex",1); localStorage.setItem("listPerPage",10)}}
                // End of code - Rohan kansari - 22/6/23
                >
                  Order Item Report
                </NavLink>
              </li>
              <li
                className={style.Sublinks_div}
                onClick={navigateToCustomerReport}
              >
                <NavLink
                  // commented and modified by - Suman sahu on - 17/06/2023
                  // reason- for design active link
                  // className={style.sublink}
                  className={({ isActive }) =>
                    isActive ? style.active : style.sublink
                  }
                  // end of modification by - Suman sahu on - 17/06/2023
                  to="/CustomerReport"
                // Added by Rohan kansari - 22/6/23
                // Reason - To set page index by default 1 on side bar page link
                // Removed By ROhan kansari - 23/6/23 
                // Reason - place changed and calling it on li function
                // onClick={e=>{localStorage.setItem("globalPageIndex",1); localStorage.setItem("listPerPage",10)}}
                // End of code - Rohan kansari - 22/6/23
                >
                  Customer Report
                </NavLink>
              </li>
            </ul>
          ) : null}
          {/* End of code - Rohan Kansari - 26/5/23*/}
          {/* Added by Suman - To open revenue page - 27/5/23*/}
          {/* Commented by Rohan kansari - 7/9/23 - Revenue Place changed */}
          {/* <li className={style.links_div} onClick={navigateToRevenue}>
          <NavLink
            // commented and modified by - Suman sahu on - 17/06/2023
            // reason- for design active link
            // className={style.link}
            className={({ isActive }) => (isActive ? style.active : style.link)}
            // end of modification by - Suman sahu on - 17/06/2023
            to="/Revenue"
          >
            {" "}
            Revenue{" "}
          </NavLink>
        </li> */}
          {/* End of code - Suman Sahu - 27/5/23*/}
          <li className={style.links_div} onClick={navigateToBannerItems}>
            <NavLink
              // commented and modified by - Suman sahu on - 17/06/2023
              // reason- for design active link
              // className={style.link}
              className={({ isActive }) => (isActive ? style.active : style.link)}
              // end of modification by - Suman sahu on - 17/06/2023
              to="/BannerOfferItem"
            // Added by Rohan kansari - 22/6/23
            // Reason - To set page index by default 1 on side bar page link
            // Removed By ROhan kansari - 23/6/23 
            // Reason - place changed and calling it on li function
            // onClick={e=>{localStorage.setItem("globalPageIndex",1); localStorage.setItem("listPerPage",10)}}
            // End of code - Rohan kansari - 22/6/23
            >
              {" "}
              Banner/Offer Items{" "}
            </NavLink>
          </li>
          <li className={style.links_div} onClick={navigateToMenu}>
            <NavLink
              // commented and modified by - Suman sahu on - 17/06/2023
              // reason- for design active link
              // className={style.link}
              className={({ isActive }) => (isActive ? style.active : style.link)}
              // end of modification by - Suman sahu on - 17/06/2023
              to="/Menu"
            // Added by Rohan kansari - 22/6/23
            // Reason - To set page index by default 1 on side bar page link
            // Removed By ROhan kansari - 23/6/23 
            // Reason - place changed and calling it on li function
            // onClick={e=>{localStorage.setItem("globalPageIndex",1); localStorage.setItem("listPerPage",10)}}
            // End of code - Rohan kansari - 22/6/23
            >
              {" "}
              Menu{" "}
            </NavLink>
          </li>
          <li className={style.links_div} onClick={navigateToCategory}>
            <NavLink
              // commented and modified by - Suman sahu on - 17/06/2023
              // reason- for design active link
              // className={style.link}
              className={({ isActive }) => (isActive ? style.active : style.link)}
              // end of modification by - Suman sahu on - 17/06/2023
              to="/Category"
            // Added by Rohan kansari - 22/6/23
            // Reason - To set page index by default 1 on side bar page link
            // Removed By ROhan kansari - 23/6/23 
            // Reason - place changed and calling it on li function
            // onClick={e=>{localStorage.setItem("globalPageIndex",1); localStorage.setItem("listPerPage",10)}}
            // End of code - Rohan kansari - 22/6/23
            >
              {" "}
              Category{" "}
            </NavLink>
          </li>
          <li className={style.links_div} onClick={navigateToItem}>
            <NavLink
              // commented and modified by - Suman sahu on - 17/06/2023
              // reason- for design active link
              // className={style.link}
              className={({ isActive }) => (isActive ? style.active : style.link)}
              // end of modification by - Suman sahu on - 17/06/2023
              to="/item"
            // Added by Rohan kansari - 22/6/23
            // Reason - To set page index by default 1 on side bar page link
            // Removed By ROhan kansari - 23/6/23 
            // Reason - place changed and calling it on li function
            // onClick={e=>{localStorage.setItem("globalPageIndex",1); localStorage.setItem("listPerPage",10)}}
            // End of code - Rohan kansari - 22/6/23
            >
              {" "}
              Item{" "}
            </NavLink>
          </li>
          <li className={style.links_div} onClick={navigateToSetting}>
            <NavLink
              // commented and modified by - Suman sahu on - 17/06/2023
              // reason- for design active link
              // className={style.link}
              className={({ isActive }) => (isActive ? style.active : style.link)}
              // end of modification by - Suman sahu on - 17/06/2023
              to="/SettingForm"
            >
              {" "}
              Setting{" "}
            </NavLink>
          </li>

          {/* Modified By Rohan kansari - 8/9/23 - change footer description page */}

          {/* Added by - Rohan kansari - 8/9/23 - To link waiter page */}
          <li className={style.links_div} onClick={navigateToWaiter}>
            <NavLink
              className={({ isActive }) => (isActive ? style.active : style.link)}
              to="/Waiter"
            >
              {" "}
              Waiter Details
              {" "}
            </NavLink>
          </li>
          {/* End of code addition - Rohan kansari - 8/9/23 - To link waiter page */}

        {/* Commented by Pratap Sahu on 11-09-2023
        Reason:No Longer Needed as already Details are Available in Customer Report */}
          {/* <li className={style.links_div} onClick={navigateToCustomerDetail}>
            <NavLink
              // commented and modified by - Suman sahu on - 17/06/2023
              // reason- for design active link
              // className={style.link}
              className={({ isActive }) => (isActive ? style.active : style.link)}
              // end of modification by - Suman sahu on - 17/06/2023
              to="/CustomerDetail"
            // Added by Rohan kansari - 22/6/23
            // Reason - To set page index by default 1 on side bar page link
            // Removed By ROhan kansari - 23/6/23 
            // Reason - place changed and calling it on li function
            // onClick={e=>{localStorage.setItem("globalPageIndex",1); localStorage.setItem("listPerPage",10)}}
            // End of code - Rohan kansari - 22/6/23
            >
              {" "}
              Customer Detail{" "}
            </NavLink>
          </li> */}
        {/* End of Comment by Pratap Sahu on 11-09-2023
        Reason:No Longer Needed as already Details are Available in Customer Report*/}

          <li className={style.links_div} onClick={navigateToOrder}>
            <NavLink
              // commented and modified by - Suman sahu on - 17/06/2023
              // reason- for design active link
              // className={style.link}
              className={({ isActive }) => (isActive ? style.active : style.link)}
              // end of modification by - Suman sahu on - 17/06/2023
              to="/Order"
            // Added by Rohan kansari - 22/6/23
            // Reason - To set page index by default 1 on side bar page link
            // Removed By ROhan kansari - 23/6/23 
            // Reason - place changed and calling it on li function
            // onClick={e=>{localStorage.setItem("globalPageIndex",1); localStorage.setItem("listPerPage",10)}}
            // End of code - Rohan kansari - 22/6/23
            >
              {" "}
              Order{" "}
            </NavLink>
          </li>
          <li className={style.links_div} onClick={navigateToOrderItem}>
            <NavLink
              // commented and modified by - Suman sahu on - 17/06/2023
              // reason- for design active link
              // className={style.link}
              className={({ isActive }) => (isActive ? style.active : style.link)}
              // end of modification by - Suman sahu on - 17/06/2023
              to="/OrderItem"
            // Added by Rohan kansari - 22/6/23
            // Reason - To set page index by default 1 on side bar page link
            // Removed By ROhan kansari - 23/6/23 
            // Reason - place changed and calling it on li function
            // onClick={e=>{localStorage.setItem("globalPageIndex",1); localStorage.setItem("listPerPage",10)}}
            // End of code - Rohan kansari - 22/6/23
            >
              {" "}
              Order Item{" "}
            </NavLink>
          </li>
          <li className={style.links_div} onClick={navigateToPayment}>
            <NavLink
              // commented and modified by - Suman sahu on - 17/06/2023
              // reason- for design active link
              // className={style.link}
              className={({ isActive }) => (isActive ? style.active : style.link)}
              // end of modification by - Suman sahu on - 17/06/2023
              to="/PaymentMethod"
            >
              {" "}
              Payment Method{" "}
            </NavLink>
          </li>
          <li className={style.links_div} onClick={navigateToQR}>
            <NavLink
              // commented and modified by - Suman sahu on - 17/06/2023
              // reason- for design active link
              // className={style.link}
              className={({ isActive }) => (isActive ? style.active : style.link)}
              // end of modification by - Suman sahu on - 17/06/2023
              to="/QRcode"
            >
              {" "}
              QR Code{" "}
            </NavLink>
          </li>
          {/* Added by Yuvraj Sahu on 29-05-2023
        	Reason - to add sidebar link for social media  */}
          {/* Modified by Yuvraj Sahu on 12-06-2023
        	Reason - to navigate after clicking box  */}
          <li className={style.links_div} onClick={navigateToSocialList}>
            {/* End of modification by Yuvraj Sahu on 12-06-2023 */}
            <NavLink
              // commented and modified by - Suman sahu on - 17/06/2023
              // reason- for design active link
              // className={style.link}
              className={({ isActive }) => (isActive ? style.active : style.link)}
              // end of modification by - Suman sahu on - 17/06/2023
              to="/social-media"
            >
              {" "}
              Social Media{" "}
            </NavLink>
          </li>
          {/* End of addition social media by yuvraj Sahu on 29-05-2023 */}

          {/* Added by Om Shrivastava on 24-07-23 
        REason : Show the restaurant rating and review */}
          <li className={style.links_div} onClick={navigateToRatingReviewList}>
            <NavLink
              className={({ isActive }) => (isActive ? style.active : style.link)}
              // Modified by ROhan kansari 27/8/23 - To correct link naming 
              //  to="/social-media"
              to="/RatingReview"
            >
              {" "}
              Rating & Review{" "}
            </NavLink>
          </li>
          {/* End of  Added by Om Shrivastava on 24-07-23 
        REason : Show the restaurant rating and review */}

          {/* Added by Rohan kansari - 8/9/23 
          Reason - change footer description place */}
          <li className={style.links_div} onClick={navigateToFooter}>
            <NavLink
              // commented and modified by - Suman sahu on - 17/06/2023
              // reason- for design active link
              // className={style.link}
              className={({ isActive }) => (isActive ? style.active : style.link)}
              // end of modification by - Suman sahu on - 17/06/2023
              to="/FooterDescription"
            >
              {" "}
              Footer Description{" "}
            </NavLink>
          </li>
          {/* End of addition by Rohan kansari - 8/9/23 
          Reason - change footer description place */}
          
               {/* Added by Pratap Sahu on 21-08-2-23
        REason : to Display the Table Reservation option in side bar */}
        <li className={style.links_div} onClick={navigateToReservationList}>
            <NavLink
              className={({ isActive }) =>
                isActive ? style.active : style.link
              }
              to="/ReservationList">
              {" "}
              Table Reservation{" "}
            </NavLink>
          </li>
          {/* End of  Added by Pratap Sahu on 21-08-2-23
        REason :to Display the Table Reservation option in side bar*/}

        </ul>


        {/* Added by Rohan kansari - 13/9/23 - To show all wanted list according to waiter needs */}
        <ul id={localStorage.getItem("waiterData") ? null : style.hideSidebar}
          className={sidebar == true ? style.open_sidebar : style.close_sidebar}
        >
          <li className={style.links_div} onClick={navigateToWaiterDashbaord}>
            <NavLink

              className={({ isActive }) => (isActive ? style.active : style.link)}

              to="/WaiterDashboard"
            >
              {" "}
              Dashboard{" "}
            </NavLink>
          </li>
        </ul>
        {/* End of code addition by Rohan kansari - 13/9/23 - To show all wanted list according to waiter needs */}

        <div className={style.sidebar_close_div}>
          <FaCaretLeft
            // added by - suman sahu on 16/06/2023
            style={{ height: "6vh" }}
            // end of addition by - suman sahu on 16/06/2023
            onClick={closeSidebar}
            className={
              sidebar == true
                ? style.show_sidebar_closearrow
                : style.hide_sidebar_closearrow
            }
          />
        </div>


      </Drawer>
    </div>
  );
};

export default Sidebar;
// End of creation code by- Suman sahu On 24/05/2023
