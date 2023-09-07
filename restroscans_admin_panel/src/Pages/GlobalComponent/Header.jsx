// Created by- Suman sahu On 22/05/2023
// reason- create header for react js admin panel

import React, { useEffect, useState } from "react";
import style from "./header.module.css";
import Sidebar from "./Sidebar";
import { NavLink, Link, useNavigate } from "react-router-dom";
import RestroscansLogo from "../../assets/restroscansLogo.png";
import { FaBell, FaHome } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdSupport } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import {SlOptionsVertical} from "react-icons/sl"
import { RiLogoutBoxFill } from "react-icons/ri";
import { Popconfirm, message } from "antd";
import Footer from "./Footer";
import { Message, tokenRecheck } from "../../App";
import { getAdminAppSettings } from "../../Api/services";

const Header = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  // Added by Rohan Kansari - 25/6/23
  // Reason - To manage sidebar from header
  const [sidebar, setSidebar] = useState(true);
  // Added by ROhan kansari - 7/9/23 
  // Reason - To set setting datas of admin
  const [adminSetting,setAdminSettings]=useState(null)

  const navigate = useNavigate();


  useEffect(()=>{
    getAdminSettingData()
  },[])

  // Reason:- When click on "Support" link, open in new tab
  const linkOpen = (url) => {
    window.open(url, "_blank", "noreferrer");
  };

  const confirm = (props) => {
    // Modification and addition by Om Shrivastava on 02-06-23
    // Reason : Fix the logout issue
    localStorage.removeItem("token");
    // Added by Rohan kansari - 4/9/23 - To close header menu on logout
    setMenuOpen(false);
    // End of code by Rohan kansari - 4/9/23 - To close header menu on logout
    navigate("/login");
    localStorage.clear();
    tokenRecheck();
    Message("Successfully logged out", "warning");
    // End of modification by Om Shrivastava on 02-06-23
  };
  const cancel = (e) => {};



  // Added by ROhan kansari - 25/6/23
  // Reason - getting widowsize 

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
 
    if (windowSize.innerWidth < 767){
      document.getElementById("drawer").style.display = "flex"
      setSidebar(false)
    }
    else if (windowSize.innerWidth == 767){
      document.getElementById("drawer").style.display = "none"
      setSidebar(false)
    }

    else if (windowSize.innerWidth > 767){
      document.getElementById("drawer").style.display = "none"
      setSidebar(true)
    }
  }, [windowSize])
  
  
// Added by ROhan kansari - 7/9/23 
  // Reason - To set setting datas of admin
 async function getAdminSettingData(){
  await getAdminAppSettings().then(r=>{setAdminSettings(r); console.log(r)})
 }

  

  // End of code - Rohan kansari - 25/6/23
  return (
    <>
      <nav className={style.header_container} id="header">

        {/* Added by Rohan kansari - 25/6/23
            Reason - To add hamburger for tabel menus */}
        <div className={style.hamburger_menu} id="drawer">
            <GiHamburgerMenu style={{fontSize:"30px",margin:"auto auto"}} onClick={e=>setSidebar(!sidebar)}/>
        </div>
        {/* ENd of code - Rohan kansari - 25/6/23 */}
        {/* 1st logo part  */}
        <div className={style.logo_div}>
          <Link to="/Dashboard" className={style.logo_link}>
            <img className={style.logo} src={RestroscansLogo} />
          </Link>
        </div>

        {/* 2nd menu part  */}
        <div className={menuOpen ? style.mobile_menu_link : style.menu_link}>
          <ul>
            <li className={style.links_div}>
            {/* * Modified by ROhan kansari - 3/7/23  */}
              <NavLink className={style.link} onClick={e=>{
                // Modified by Rohan kansari - 5/7/23
                  // Reason - To change mobile view menu list in below 767px width
                  // setMenuOpen(!menuOpen);
                  // setSidebar(false)
                  if (windowSize.innerWidth < 767){
                    setMenuOpen(!menuOpen);
                    setSidebar(false)}
                    // End of code - Rohan kansari - 5/7/23
              }} to="/Dashboard">
                <FaHome className={style.icons} />
                Home
              </NavLink>
            </li>
            <li className={style.links_div}>
              {/* * Modified by ROhan kansari - 3/7/23  */}
              <NavLink className={style.link} onClick={e=>{
                // Modified by Rohan kansari - 5/7/23
                  // Reason - To change mobile view menu list in below 767px width
                  // setMenuOpen(!menuOpen);
                  // setSidebar(false)
                  if (windowSize.innerWidth < 767){
                    setMenuOpen(!menuOpen);
                    setSidebar(false)}
                    // End of code - Rohan kansari - 5/7/23
              }} to="/notification">
                <FaBell className={style.icons} id="link" />
                Notification
              </NavLink>
            </li>
            <li className={style.links_div}>
              {/*  Modified by ROhan kansari - 3/7/23  */}
              <NavLink className={style.link} onClick={e=>{
                // Modified by Rohan kansari - 5/7/23
                  // Reason - To change mobile view menu list in below 767px width
                  // setMenuOpen(!menuOpen);
                  // setSidebar(false)
                  if (windowSize.innerWidth < 767){
                    setMenuOpen(!menuOpen);
                    setSidebar(false)}
                    // End of code - Rohan kansari - 5/7/23
                }} to="/SettingForm">
                <IoMdSettings className={style.icons} />
                Setting
              </NavLink>
            </li>
            <li className={style.links_div}>
              <NavLink
                className={style.link}
                onClick={() =>{
                // Added by ROhan kansari - 7/9/23 
                // Reason - To redirect to adyant support link getting from backend
                  linkOpen(`${adminSetting?.adyant_support_link}`);

                  // Modified by Rohan kansari - 5/7/23
                  // Reason - To change mobile view menu list in below 767px width
                  // setMenuOpen(!menuOpen);
                  // setSidebar(false)
                  if (windowSize.innerWidth < 767){
                  setMenuOpen(!menuOpen);
                  setSidebar(false)}
                  // End of code - Rohan kansari - 5/7/23
                }}
              >
                <MdSupport className={style.icons} />
                Support
              </NavLink>
            </li>
            <li className={style.logout_link_div}>
              {/* <NavLink className={style.link}>Logout</NavLink> */}
              <Popconfirm
                className={style.link}
                title="Are you sure you want to logout?"
                onConfirm={confirm}
                onCancel={cancel}
                cancelText="Cancel"
                okText="Ok"
              >
                <RiLogoutBoxFill className={style.icons} />
                Logout
              </Popconfirm>
            </li>
          </ul>
        </div>

        {/* 3rd button section */}
        {/* Modified by ROhan kansari - 30/6/23
            Reason -   */}
        <div className={style.btn_div} >
          <ul className={style.logout_btn_div}>
            <li>
              {/* <button className={style.logout} onClick={confirm}>Logout</button> */}
              <Popconfirm
                className={style.logout_popup}
                title="Are you sure you want to logout?"
                onConfirm={confirm}
                onCancel={cancel}
                cancelText="Cancel"
                okText="Ok"
              >
                <div className={style.logout} >
                  Logout
                </div>
              </Popconfirm>
            </li>
          </ul>

          {/* hamburget menu start  */}
          <div className={style.hamburger_menu}>
            {/* Modified by ROha kansari - 25/6/23 
                Reason - To change header menus mobile view icons*/}
              <SlOptionsVertical style={{fontSize:"22px",color:"blue",margin:"auto auto"}} onClick={() => setMenuOpen(!menuOpen)}/>
          {/* End of code - Rohan kansari - Rohan kansari*/}
          </div>
        </div>
      </nav>
      
      {/* Modified by Rohan kansari - 30/6/23
          Reason - To close menu on outside of header click*/}
          {/* * Modified by ROhan kansari - 3/7/23  */}
      <div className={style.content_and_sideBar} onClick={e=>{setMenuOpen(false);}}>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar}/>
        {/* Added by ROhan kansari - 25/6/24
            Reason - adding div because facing issue on managing all content page so now we manage from one place  */}
        <div className={style.content}>
        {props.children}
        </div>
        {/* End of code - Rohan kansari - 25/6/23*/}
      </div>
      <Footer />
    </>
  );
};

export default Header;
// end of creation code by- Suman sahu On 22/05/2023
