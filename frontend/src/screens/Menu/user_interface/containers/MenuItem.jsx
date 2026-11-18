import { Link, useNavigate } from "react-router-dom";
import { rememberQrTableFromUrl } from "../../../Customer/services/tableQrService";
import { useEffect, useRef, useState } from "react";
import { loadMenuScreen, loadOfferScreen, menusForSelection, uniqueField, offerFullPrice, offerHalfPrice, ratingPayload, postRatingReview } from '../../services/menuService';
import { loadThemeSetting } from '../../../Theme/services/themeService';
import siteConfig from "../../../../config/config";
import '../style/MenuItem.css'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Input, Button, Modal, notification, Drawer, Form, message, Rate, } from 'antd';
import { CloseOutlined, LeftOutlined, RightOutlined, CheckCircleOutlined, FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons'
import Footer from "../../../Footer/user_interface/containers/Footer";
import { FlippingPages } from 'flipping-pages';
import 'flipping-pages/dist/style.css';
import { GlobalContext } from "../../../../context/Context";
import { hasFeature } from "../../../../plans";
import { useContext } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import ReactPlayer from 'react-player'
import noOfferItem from "../../../../images/offer_default.jpg"
import nodataImg from '../../../../images/not_offer.png'
import noOfferImg from "../../../../images/offer_default.jpg"
import nodataOffer from '../../../../images/offer 41.jpg'
import crossKnifeImg from '../../../../images/cross_sign.jpg'
import landscapeMode from '../../../../images/landscape.png'
import { MdRoomService, MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { GoSearch } from "react-icons/go";
import { IoLogoYoutube } from "react-icons/io";
import offer_comming_soon_img from '../../../../images/offer_comming_soon_img.jpg';
import ReactReadMoreReadLess from "react-read-more-read-less";
import welcome_banner from '../../../../images/welcome_banner.jpg';
import Draggable from 'react-draggable';
import { FloatingWhatsApp } from "react-floating-whatsapp";
import welcome_banner2 from '../../../../images/default.jpg';

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import GlobalColor from '../../../Theme/user_interface/containers/GlobalColor'
import { Pagination, Navigation, Mousewheel, Keyboard, Autoplay } from "swiper";
import Loader from "../../../../components/Loader/Loader";
import PopupDetail from "../components/PopupDetail";
import { GrFormAdd } from "react-icons/gr";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { TenantValidate } from "../../../../components/Validators/ConfirmTenant";
import secureLocalStorage from "react-secure-storage";
import ReservationForm from "../../../Reservation/user_interface/components/ReservationForm";
import { useMenuItemState } from "../../usestate/menuItemState";

function MenuItem() {
  rememberQrTableFromUrl();
  const [form] = Form.useForm();
  const [showItemRatings, setShowItemRatings] = useState(false);

  TenantValidate()
  var { searchedValue,
    setSearchedValue, colors, cart, subscribePlan, rupee_sign, tenantDetails } = useContext(GlobalContext);

  const videoRef = useRef(null);

  var { menuList, setmenuList, categoryList, setCategoryList, itemList, setItemList, filterCategory, setfilterCategory, offerShow, setOfferShow, filter, setFiltered, isLoader, setIsLoader, offerBanner, setOfferBanner, offerList, setOfferList, restaurantName, setRestaurantName, bestProducts, setBestProduct, search, setNewSearch, isModalOpen, setIsModalOpen, selected, setSelected, clickedDetail, setClickedDetail, isDetailPopupOpen, setDetailPopupVisiblity, open, setOpen, searchVisible, setSearchVisiblity, menuListVisible, setmenuListVisiblity, videoVisible, setVideoVisiblity, whatsApp, setwhatsAppDetail, playVideo, setVideo, vidRef, setVidRef, isModalOpenn, setIsModalOpenn, isRatingModal, setIsRatingModal, value, setValue } = useMenuItemState();

  const onMenuChange = (id, data) => {
    setfilterCategory(menusForSelection(menuList, data))

    setOfferShow([])

    document.getElementById('hide_search').style.display = 'block'

    if (menuListVisible)
      document.getElementById(String(id))?.classList.add("category_animated_div");

    for (var i = 0; i < menuList.length; i++) {
      if (i != id && menuListVisible)
        document.getElementById(String(i))?.classList.remove("category_animated_div");
    }

    setNewSearch('')

    document.getElementById('menu_maindiv').scrollTo(0, 0)
  }

  const onOfferShow = (item) => {
    setOfferShow(offerList.filter((show) => show.offer_name == item))
    document.getElementById('hide_search').style.display = 'none';

    setNewSearch("")

    if (offerList.filter((show) => show.offer_name == item).length < 1) {
      showModal()
    }
    else {
      document.getElementById('offer_divv').style.display = 'none'
      document.getElementById('flip_div_idd').style.height = '45% '
    }
  }

  useEffect(() => {
    getMenu(tenantt);
    getOffer(tenantt);
    setVidRef(document.querySelector(".react-player"));
  }, []);

  useEffect(() => {
    if (!tenantt) return undefined;
    let mounted = true;
    const syncAvailability = async () => {
      try {
        const catalog = await loadMenuScreen(tenantt);
        if (mounted && catalog?.itemList) setItemList(catalog.itemList);
      } catch (_) { /* Keep the current menu if temporarily offline. */ }
    };
    const timer = window.setInterval(syncAvailability, 12000);
    const onFocus = () => syncAvailability();
    window.addEventListener('focus', onFocus);
    return () => { mounted = false; window.clearInterval(timer); window.removeEventListener('focus', onFocus); };
  }, [tenantt]);

  var tenantt = localStorage.getItem("tenantName")
  // Empty until the restaurant name is saved; opening this page straight after a redirect otherwise reads null.
  var restaurant_name = localStorage.getItem("restroName") || ""

  const getMenu = async () => {
    const catalog = await loadMenuScreen(tenantt);
    if (catalog) {
      setIsLoader(false)
      setmenuList(catalog.menuList);
      setCategoryList(catalog.categoryList)
      setItemList(catalog.itemList)
      setShowItemRatings(catalog.showItemRatings)
      setfilterCategory(catalog.menuList)
      setBestProduct(catalog.topProducts)
    }
  };

  const getOffer = async () => {
    const offers = await loadOfferScreen(tenantt);
    if (offers) {
      setIsLoader(false)
      setOfferBanner(offers.offerBanner);
      setOfferList(offers.offerItemList)
    }
  };

  const no_data = [];

  const Search = Input.Search;

  const onSearch = (value) => {
    setNewSearch(value)
    if (search.length < 1) {
      notification.info({
        description:
          'No Result Found..',
        duration: 2,
        key: 1,
      });
    }
  }

  var offer_name = uniqueField(offerShow, "offer_name")
  var offer_discount = uniqueField(offerShow, "item_discount")

  const divOfferRemove = () => {
    setOfferShow([])
    document.getElementById('hide_search').style.display = 'block'
  };

  const removeSerchResult = () => {
    // filtered
    setNewSearch("")
    setFiltered(itemList)
  }
  // ---------Offer section show offer----------
  const removeOffersectionDiv = () => {
    (document.getElementById('offer_divv').style.display = 'none')
      (document.getElementById('flip_div_idd').style.height = '41% ')
  }
  const removeNoSerachResult = () => {
    (document.getElementById('search_divv').style.display = 'none')
  }
  const showModal = () => {
    setIsModalOpen(true);
    document.getElementById('hide_search').style.display = 'block';
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    var filtered = !search
      ? no_data
      : itemList.filter((person) =>
        person.name.toLowerCase().includes(search.toLowerCase()) ||
        person.category_name.toLowerCase().includes(search.toLowerCase()) ||
        person.menu_name.toLowerCase().includes(search.toLowerCase())
      );

    var myy = []
    let categories = new Set()
    filtered.forEach(entry => { categories.add(entry.menu_name) })
    categories.forEach(cat => myy.push(cat))

    var temp = [];

    filtered.filter(r => {
      if (temp.includes(r.menu_name)) {
      }
      else {
        temp.push(r.menu_name)
      }
    })

    var temp2 = []

    temp.filter((s, i) => {
      var data = {}
      data[s] = []
      temp2.push(data)

      filtered.filter(n => {
        if (n.menu_name == s) {
          temp2[i][`${s}`].push(n)
        }
      })
    })

    var temp3 = []

    temp2.filter((s, i) => {
      //got key of each element
      var obj = Object.keys(s)

      // filter list of each element and save unique category name
      var categoryName = []
      temp2[i][obj].filter(s => {
        if (categoryName.includes(s.category_name)) {
        }
        else {
          categoryName.push(s.category_name)
        }
      })

      //filter with unique category name and save inside menu item with unique category name item list
      var data = {}
      var gh = data[obj] = {}
      categoryName.filter(m => {
        gh[m] = []
        filtered.map(h => {
          if (h.category_name == m) {
            data[obj][m].push(h)
          }
        })
      })

      temp3.push(data)
    })

    setFiltered(temp3)

    if (filtered.length == 0 && search.length > 0) {
    }

    try {
      if (search.length > 0) {
        document.getElementById(String(selected))?.classList.remove("category_animated_div");
      }
      else {
        document.getElementById(String(selected))?.classList.add("category_animated_div");
        for (var i = 0; i < menuList.length; i++) {
          if (i != selected)
            document.getElementById(String(i))?.classList.remove("category_animated_div");
        }
      }
    }
    catch (e) {
    }
  }, [search])

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4,
      slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 4,
      slidesToSlide: 3 // optional, default to 1.
    }
  };

  const back = () => {
    selected = selected - 1;
    if (selected < 0) {
      setSelected(menuList.length - 1)
      document.getElementById(String(menuList.length - 1))?.classList.add("category_animated_div");

      for (var i = 0; i < menuList.length; i++) {
        if (i != menuList.length - 1)
          document.getElementById(String(i))?.classList.remove("category_animated_div");
      }
    }
    else {
      setSelected(selected)

      document.getElementById(String(selected))?.classList.add("category_animated_div");

      for (var i = 0; i < menuList.length; i++) {
        if (i != selected)
          document.getElementById(String(i))?.classList.remove("category_animated_div");
      }
    }
    setOfferShow([])

    setNewSearch('')
  };

  const next = () => {
    selected = selected + 1;

    if (menuList.length - 1 < selected) {
      setSelected(0)
      document.getElementById("0")?.classList.add("category_animated_div");

      for (var i = 0; i < menuList.length; i++) {
        if (i != 0)
          document.getElementById(String(i))?.classList.remove("category_animated_div");
      }
    }
    else {
      setSelected(selected)
      document.getElementById(String(selected))?.classList.add("category_animated_div");

      for (var i = 0; i < menuList.length; i++) {
        if (i != selected)
          document.getElementById(String(i))?.classList.remove("category_animated_div");
      }
    }

    setOfferShow([])

    setNewSearch('')
  };

  const navigate = useNavigate();

  const navigatee = () => {
    navigate('/')
  }

  var nav = useNavigate()
  function callPopupModel(detail, fullPrice, halfPrice) {
    detail["discounted_half_price"] = halfPrice;
    detail["discounted_full_price"] = fullPrice;
    clickedDetail = detail;

    setClickedDetail(clickedDetail);
    setDetailPopupVisiblity(!isDetailPopupOpen)
  }

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const ref = useRef()
  function toggleDescription(style) {
    if (style.display == "unset")
      style.display = ""
    else
      style.display = "unset"
  }

  useEffect(() => {
    if (!searchVisible)
      setNewSearch("")
  }, [searchVisible])

  function applyAnimation() {
    if (search.length === 0) {
      document.getElementById(String(selected))?.classList.add("category_animated_div");
    }
    for (let i = 0; i < menuList.length; i++) {
      if (i !== selected) {
        document.getElementById(String(i))?.classList.remove("category_animated_div");
      }
    }
  }

  useEffect(() => {
    if (menuListVisible)
      try {
        applyAnimation()
      }
      catch {
      }
  }, [menuListVisible])

  var interval = useRef({ render: null });
  useEffect(() => {
    if (!isLoader)
      if (menuListVisible) {
        if (interval.current.render) window.clearTimeout(interval.current.render);
        document.getElementsByClassName("menu_maindiv")[0] && (document.getElementsByClassName("menu_maindiv")[0].style.maxHeight = "73vh")
        if (document.getElementById("category_container")) document.getElementById("category_container").className = "category_container"
        interval.current.render = setTimeout(() => {
          setmenuListVisiblity(false)
        }, 20000)
      }
      else {
        document.getElementsByClassName("menu_maindiv")[0] && (document.getElementsByClassName("menu_maindiv")[0].style.maxHeight = "88vh")
        if (document.getElementById("category_container")) document.getElementById("category_container").className += " newHieght"
        window.clearTimeout(interval.current.render)
      }
  }, [menuListVisible])

  useEffect(() => {
    WhatsAppDetails();
  }, []);

  const WhatsAppDetails = async () => {
    const setting = await loadThemeSetting(tenantt);
    if (setting) {
      setwhatsAppDetail(setting);
    }
  };

  function setVideoPlayingToggle(id) {
    var key = `video${id}`
    setVideo({ [key]: !playVideo[`video${id}`] })
  }

  { }

  const showModall = () => {
    setIsModalOpenn(true);
  };
  const handleOkk = () => {
    setIsModalOpenn(false);
  };
  const handleCancell = () => {
    setIsModalOpenn(false);
  };

  { }

  { }
  const handleRatingOk = () => {
    setIsRatingModal(false);
  };
  const handleRatingCancel = () => {
    setIsRatingModal(false);
    form.resetFields()
  };

  const showRatingModal = () => {
    setIsRatingModal(true);
  };
  const customIcons = {
    1: <FrownOutlined />,
    2: <FrownOutlined />,
    3: <MehOutlined />,
    4: <SmileOutlined />,
    5: <SmileOutlined />,
  };
  const { TextArea } = Input;
  const onChange = (e) => {
    setValue(e.target.value);
  };

  const handleFormSubmit = async (formdata) => {
    const saveRatingData = ratingPayload(value, formdata.review);
    var tenantName = localStorage.getItem("tenantName")
    const response = await postRatingReview(saveRatingData, tenantName);
    if (response.msg) {
      message.success({
        content: "Thankyou for your feedback",
        key: 1,
        icon: <CheckCircleOutlined />,
        style: {
          marginTop: '5vh',
          fontSize: "16px",
          letterSpacing: "1.3px",
          fontFamily: "Times News Roman",
          color: colors.headingColor,
        },
      });
    }
    handleRatingCancel()
    form.resetFields()
  };

  return (
    <>
      {isLoader == true ? <Loader /> :
        <>
          {videoVisible ? <div className="video_container">
            <div classname="header"><AiOutlineClose color="white" size={30} style={{ margin: "10px " }} onClick={e => setVideoVisiblity(false)} /></div>
            <iframe style={{ display: "block", border: "none", height: "50vh", width: "100%", float: "left", marginLeft: "0px" }} src="https://www.youtube.com/embed/dm2RHGYRtas" border='0' width='620' height='465' marginheight='0' marginwidth='0' frameborder='0' title="YouTube video player" allow="autoplay; encrypted-media" id="Overlayvideo" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>
          </div> : null}

          <div className='menu_maindiv'
            id="menu_maindiv"
            style={{ backgroundColor: colors.backgroundTheme }}
            onLoad={e => {
              if (document.getElementsByClassName("front_page").length == 0)
                applyAnimation()
              if (document.getElementsByClassName("heading_container")[0]) {
                document.getElementsByClassName("heading_container")[0].style.display = "flex";
              }
            }}
          >

            <div className="Hotel_container" id="header" style={{ background: colors.backgroundTheme }} >

              <div className='menu_container'>
                <Button onClick={showDrawer} style={{ backgroundColor: colors.bannerColor, width: "99%", color: colors.subheadingBackgroundColor }}>
                  Menu
                </Button>
                <Drawer
                  placement="top" onClose={onClose} open={open} headerStyle={{ background: colors.bannerColor }} bodyStyle={{ marginBottom: "50px" }} >
                  {menuList.map((showMenu, id) => (
                    <div className="drawer_menu_parent_container"
                      onClick={e => {
                        onMenuChange(id, showMenu.id);
                        setSelected(id);
                        onClose();
                      }
                      }
                    >
                      <div className="menu_img_container" >
                        <img src={siteConfig.siteURL + showMenu.icon}
                          className="drawer_menu_img"
                        />
                      </div>

                      <span className="drawer_menu_name_container">
                        <h6 style={{
                          color: colors.bannerColor, paddingTop: '2%',
                        }}
                          className="drawer_menu_name"
                        >{showMenu.name}
                        </h6>
                      </span>
                      <br></br>
                      <br></br>
                      <br></br>

                    </div>
                  ))}
                </Drawer>
              </div>

              <h2 style={{ color: colors.headingColor }}
                className={restaurant_name.length > 14 ? 'hotel_name' : 'restaurant_fontsize'}>
                {restaurant_name.toUpperCase()}
              </h2>

              {hasFeature(subscribePlan, "order") ?
                <div className="icon_container">
                  <Link to="/cart">
                    <span className="selected_amount">{cart.length}</span>
                    <MdRoomService style={{ fontSize: "30px", color: colors.bannerColor }} />
                  </Link>
                </div> : null}
            </div>

            {offerBanner.length > 0 ?
              <div >
                <Swiper
                  style={{
                    "--swiper-pagination-color": colors.subHeadingColor,
                    "--swiper-pagination-bullet-inactive-color": colors.subHeadingColor,
                    "--swiper-pagination-bullet-inactive-opacity": "0.6 ",
                    "--swiper-pagination-bullet-size": "10px",
                    "--swiper-pagination-bullet-horizontal-gap": "5px",
                    "--swiper-button-prev-color": "aqua !important",
                    "--swiper-navigation-size": "17px",
                    "--swiper-theme-color": " #000",
                  }}
                  navigation={true}
                  pagination={{
                    clickable: true,
                  }}

                  keyboard={true}
                  modules={[Navigation, Pagination, Autoplay]}
                  className="mySwiper"

                  onSlideChange={e => { var key = Object.keys(playVideo); setVideo({ [key[0]]: false }) }}

                  onNavigationPrev={e => { var key = Object.keys(playVideo); setVideo({ [key[0]]: false }) }}
                  onNavigationNext={e => { var key = Object.keys(playVideo); setVideo({ [key[0]]: false }) }}

                >
                  {offerBanner.filter(e => e.is_active).length > 0 ?
                    offerBanner.map((item, id) => (
                      <>
                        {item.is_active != false ?
                          <SwiperSlide>
                            <div
                              className='offer_div'
                              onClick={
                                e => { if (!item.show_video_Hide_Image) onOfferShow(item.offer_name) }
                              }
                            >

                              {
                                !item.show_video_Hide_Image ?
                                  <>
                                    <img
                                      src={item.offer_image ? siteConfig.siteURL + item.offer_image : (welcome_banner2.src || welcome_banner2)}

                                      className='offer_banner'
                                    />
                                    <h2 className='offer_content'>
                                      {item.offer_name}
                                    </h2>
                                  </> :
                                  <div className="container">
                                    <div className="iframeContainer" onClick={e => { setVideoPlayingToggle(id) }}>{!playVideo[`video${id}`] ? <><div className="centerBtn" /> <IoLogoYoutube className="pauseBtn" /></> : null}</div>
                                    <ReactPlayer ref={vidRef} className="react-player" height="24vh" width="80vw" url={`${item.video_link}?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`} playing={playVideo[`video${id}`]} />
                                  </div>
                              }

                            </div>

                          </SwiperSlide>
                          :
                          null}
                      </>
                    ))

                    :
                    <SwiperSlide>
                      <div className="welcome_banner_wrap">
                        <img
                          className="welcome_banner_img"
                          src={welcome_banner.src || welcome_banner}
                          alt="Welcome"
                        />
                      </div>
                    </SwiperSlide>
                  }
                </Swiper>
              </div>
              :
              <div className="welcome_banner_wrap">
                <img
                  className="welcome_banner_img"
                  src={welcome_banner.src || welcome_banner}
                  alt="Welcome"
                />
              </div>
            }

            <div
              className={offerShow.length > 0 ? 'searchpage_notshow' : 'searchpage_main'}
              style={{ background: "transparent" }}
            >

              {searchVisible == false && hasFeature(subscribePlan, "reservation") &&
                <button className="reservation_btn" style={{ background: colors.bannerColor, color: colors.backgroundTheme }} onClick={showModall}>
                  Reservation
                </button>
              }
              {isModalOpenn &&
                <ReservationForm isModalOpenn={isModalOpenn} handleCancell={handleCancell} />}

              {searchVisible == false && hasFeature(subscribePlan, "rating") &&
                <button className="rate_us_btn" style={{ background: colors.bannerColor, color: colors.backgroundTheme }} onClick={showRatingModal}>
                  Rate Us
                </button>
              }

              <div
                id="hide_search" style={{ display: 'block' }}
                className={whatsApp && whatsApp.whatsapp_number && whatsApp.whatsapp_number != undefined && whatsApp.whatsapp_number != null && whatsApp.whatsapp_number.length ? 'searchpage_input' : 'whatsappDataNoneSearchMainDiv'}
              >
                <GoSearch className="searchIcon" style={{ backgroundColor: colors.bannerColor, color: colors.backgroundTheme }} onClick={e => setSearchVisiblity(!searchVisible)} />
                {searchVisible ?
                  <>
                    <input
                      className="inputBoxSearch"
                      type="text" id="search_box"
                      onChange={e => setNewSearch(e.target.value.trimStart().replace(". ", " ").replace("  ", ""))}
                      placeholder='Type here to search' value={search} />
                    <AiOutlineClose className="closeIcon" onClick={e => setSearchVisiblity(!searchVisible)} />
                  </>
                  : null}
              </div>

              {hasFeature(subscribePlan, "whatsapp") && whatsApp && whatsApp.whatsapp_number && whatsApp.whatsapp_number != undefined && whatsApp.whatsapp_number != null && whatsApp.whatsapp_number.length > 0 ?
                <div style={{ display: "flex", marginLeft: "auto", zIndex: '99' }}>
                  <FloatingWhatsApp

                    style={{ right: 5, display: "flex", marginLeft: "auto" }}

                    chatboxStyle={{ bottom: '180px' }}
                    buttonStyle={{ width: 25, height: 25, position: "initial" }}
                    phoneNumber={whatsApp.whatsapp_number}
                    accountName={restaurant_name.toUpperCase()}
                    avatar={tenantDetails.restaurant_logo && siteConfig.siteURL + tenantDetails.restaurant_logo}
                  />
                </div>
                : null}

            </div>

            {filter.length == 0 && search.length > 2 ?
              <div >
                <div id="search_divv" className="nosearchData_div">
                  <img
                    src={nodataImg}
                    className='nodata_image' />
                </div>
                <h5 className="nosearch_content" style={{ color: colors.subHeadingColor, }}>
                  No search result found</h5>
              </div>
              : null}

            <div id="offer_divv" className="when_offer_is_null" style={{ display: 'none' }}>
              <span style={{ display: 'flex', padding: '1%', fontSize: '16px' }}>
                <span style={{ color: '#ffff9f', padding: '0', width: '89%', fontSize: '15px' }}>
                </span>
                <img onClick={removeOffersectionDiv} src={crossKnifeImg} style={{ height: '3.5vh', borderRadius: '100%' }} alt="jhk" />
              </span>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img
                  src={nodataOffer}
                  className='nodata_image' />

              </div>
              <h5 style={{ color: colors.subHeadingColor, textAlign: 'center', fontSize: '18px' }}>
                Currently no items are available</h5>
            </div>

            <div
              className={filter.length > 0 ? 'searchpage_content' : 'again'}
              id="third" >
              {search ?
                <>
                  {filter.length > 0 ?
                    <span style={{ display: 'flex', padding: '1%', fontSize: '16px' }}>
                      <span style={{ color: '#ffff9f', padding: '0', width: '89%', fontSize: '15px' }}>
                      </span>

                    </span>
                    :
                    <span style={{ display: 'flex', padding: '2%', fontSize: '16px' }}>
                      <span style={{ color: '#ffff9f', padding: '0', width: '90%' }}>Result not found</span>
                      <img onClick={removeSerchResult} src={crossKnifeImg} style={{ height: '3.5vh', borderRadius: '100%' }} alt="jhk" />

                    </span>
                  }
                  {filter.map((data, i) => {
                    var obj = Object.keys(data)
                    var categoriesObj = Object.keys(filter[i][obj])
                    return (<>
                      <div className='after_search_div'
                      >
                        <h3 className="main_menu_name"
                          style={{
                            color: colors.headingColor, textAlign: 'center',
                            // backgroundColor: colors.headingBackgroundColor
                          }}
                        >
                          {obj}
                        </h3>

                      </div>

                      {
                        <>{categoriesObj.map((c, j) =>
                          <div className='after_search_div'
                          >
                            <span className="allcategory_searched"
                            >
                              <h3 className="category_name"
                                style={{
                                  color: colors.headingColor,
                                  backgroundColor: colors.subheadingBackgroundColor,
                                  borderRadius: '6px',
                                  padding: '1px 8px',
                                  fontSize: '16px'
                                }}
                              >
                                {c}
                              </h3>
                            </span>
                            <div style={{
                              display: 'flex',
                              padding: '5% 0% 0% 0%',
                              justifyContent: "flex-end",
                              gap: colors.allow_half_price ? "0px" : "22%",
                              color: 'lightblue'
                            }}
                            >
                              <div className="allitems_heading_name" style={{ color: colors.bannerColor, textAlign: 'center' }}>
                                Item name
                              </div>
                              <div className="allitems_heading_price" style={{ color: colors.bannerColor }} >Full price</div>
                              {colors.allow_half_price ? <div className="allitems_heading_price" style={{ color: colors.bannerColor }}>Half price</div> : null}
                            </div>
                            {filter[i][`${obj}`][c].map(person => {
                              var fullprice = person.price_full;
                              var halfprice = person.price_half;
                              if (offerList.filter((data) => parseInt(data.item_id) === person.id).length > 0) {
                                fullprice = offerFullPrice(offerList, person.name);
                                halfprice = offerHalfPrice(offerList, person.name);
                              }

                              return <div className="cardItem" style={{ background: colors.card_color, padding: "6px 0" }}>
                                <div className="showimg_div" >
                                  {bestProducts?.filter(b => b.item == person.id).length > 0 ? <div className="ribbon">Best Seller</div> : <div className="null_ribbon"></div>}
                                  <img src={siteConfig.siteURL + person.icon}
                                    className="menu_img"
                                  />

                                </div>

                                {(offerList.filter((data) => parseInt(data.item_id) === person.id
                                  && data.item_discount != undefined && data.item_discount != null)).length > 0 ?
                                  <>

                                    <div className="price_item_description_div">
                                      <div className="price_description_container" >
                                        <h4 style={{ color: colors.subHeadingColor }}
                                          className="allitems_name"
                                        >{person.name}</h4>
                                        {showItemRatings && person.average_rating != null ? <div className="restro-item-rating"><span aria-hidden="true">★</span> {Number(person.average_rating).toFixed(1)}</div> : null}
                                        <h4 style={{ color: colors.subHeadingColor }}
                                          className="allitems_price"
                                        >
                                          {person.price_full > 0 ? <strike>{rupee_sign}  {person.price_full}</strike> : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}
                                        </h4>

                                        {colors.allow_half_price ? <h4 style={{ color: colors.subHeadingColor }}
                                          className="allitems_price"
                                        >
                                          {person.price_half > 0 ? <strike>{rupee_sign}  {person.price_half}</strike> : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}

                                        </h4> : null}
                                      </div>

                                      <div className="price_description_container" >
                                        <h4 style={{ color: 'red', padding: '0', }}
                                          className="allitems_name">Offered price</h4>
                                        <h4 style={{ color: colors.subHeadingColor, padding: '0', margin: '0' }}
                                          className="allitems_price"
                                        >
                                          {offerFullPrice(offerList, person.name) > 0 ? <>{rupee_sign} {offerFullPrice(offerList, person.name)}</> : <>&nbsp;&nbsp;&nbsp;&nbsp;---</>}

                                        </h4>

                                        {colors.allow_half_price ?
                                          <h4 style={{ color: colors.subHeadingColor, padding: '0', margin: '0' }}
                                            className="allitems_price"
                                          >
                                            {offerHalfPrice(offerList, person.name) > 0 ? <> {rupee_sign} {offerHalfPrice(offerList, person.name)}</> : <>&nbsp;&nbsp;&nbsp;&nbsp;---</>}

                                          </h4> : null}
                                      </div>

                                      <div className="description_div" style={{ display: 'flex', paddingTop: '2%' }}
                                      >

                                        {person.item_type == 'Veg' ? (
                                          <>
                                            <span className="rs-diet-icon rs-diet-veg" role="img" aria-label="Vegetarian"><span /></span>
                                          </>
                                        ) : null}
                                        {person.item_type == 'Nonveg' ? (
                                          <>
                                            <span className="rs-diet-icon rs-diet-nonveg" role="img" aria-label="Non vegetarian"><span /></span>
                                          </>
                                        ) : null}
                                        {person.item_type == 'Other' ? (
                                          <>
                                          </>
                                        ) : null}

                                        <div onClick={e => toggleDescription(e.currentTarget.style)} className="description_content" style={{ alignItems: 'center', color: colors.subHeadingColor, padding: "0 5px" }}>

                                          {hasFeature(subscribePlan, "order") ? <button className="add_product" style={{
                                            color: colors.bannerColor,
                                            backgroundColor: "transparent",
                                            border: `1px solid ${colors.bannerColor}`,
                                            borderRadius: '6px',
                                          }} disabled={!person.kitchen_available} onClick={e => { if (person.kitchen_available) callPopupModel(person, fullprice, halfprice) }}>
                                            <AiOutlinePlus className="plus_icon"
                                              style={{
                                                color: colors.bannerColor
                                              }} />{person.kitchen_available ? 'Add' : 'Unavailable'}</button> : null}
                                          <ReactReadMoreReadLess
                                            charLimit={55}
                                            readMoreText={"more"}
                                            readLessText={"less"}
                                          >
                                            {person.description && person.description.length > 0 ? person.description : "  "}
                                          </ReactReadMoreReadLess>
                                        </div>
                                      </div>

                                    </div>

                                  </>
                                  :
                                  <>
                                    <div className="price_item_description_div">
                                      <div className="price_description_container" >
                                        <h4 style={{ color: colors.subHeadingColor }}
                                          className="allitems_name"
                                        >{person.name}</h4>
                                        {showItemRatings && person.average_rating != null ? <div className="restro-item-rating"><span aria-hidden="true">★</span> {Number(person.average_rating).toFixed(1)}</div> : null}
                                        <h4 style={{ color: colors.subHeadingColor }}
                                          className="allitems_price"
                                        >{person.price_full ? rupee_sign + person.price_full : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}</h4>

                                        {colors.allow_half_price ?
                                          <h4 style={{ color: colors.subHeadingColor }}
                                            className="allitems_price"
                                          >{person.price_half ? rupee_sign + person.price_half : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}</h4> : null}

                                      </div>
                                      <div className="description_div" style={{ display: 'flex' }}>

                                        {person.item_type == 'Veg' ? (
                                          <>
                                            <span className="rs-diet-icon rs-diet-veg" role="img" aria-label="Vegetarian"><span /></span>
                                          </>
                                        ) : null}
                                        {person.item_type == 'Nonveg' ? (
                                          <>
                                            <span className="rs-diet-icon rs-diet-nonveg" role="img" aria-label="Non vegetarian"><span /></span>
                                          </>
                                        ) : null}
                                        {person.item_type == 'Other' ? (
                                          <>
                                          </>
                                        ) : null}

                                        &nbsp; <span className="description_content" onClick={e => toggleDescription(e.currentTarget.style)} style={{ alignItems: 'center', color: colors.subHeadingColor }}>

                                          {hasFeature(subscribePlan, "order") ? <button className="add_product" style={{
                                            color: colors.bannerColor,
                                            backgroundColor: "transparent",
                                            border: `1px solid ${colors.bannerColor}`,
                                            borderRadius: '6px',
                                          }} disabled={!person.kitchen_available} onClick={e => { if (person.kitchen_available) callPopupModel(person, fullprice, halfprice) }}>
                                            <AiOutlinePlus className="plus_icon"
                                              style={{
                                                color: colors.bannerColor
                                              }} />{person.kitchen_available ? 'Add' : 'Unavailable'}</button> : null}
                                          <ReactReadMoreReadLess
                                            charLimit={55}
                                            readMoreText={"more"}
                                            readLessText={"less"}
                                          >
                                            {person.description && person.description.length > 0 ? person.description : "  "}
                                          </ReactReadMoreReadLess>
                                        </span>
                                      </div>

                                    </div>

                                  </>
                                }

                              </div>
                            })}
                          </div>
                        )
                        }
                        </>
                      }
                    </>
                    )
                  })
                  }
                </> :
                null}
            </div>

            <div
              className={offerShow.length < 1 ? 'offer_notshow' : 'offer_maindiv'}
            >
              <span style={{
                display: 'flex', padding: '1%', fontSize: '16px', position: "relative"
                // ,top:"30px"
              }}>
                <span style={{ color: '#ffff9f', padding: '0', width: '95%' }}>
                  {/* Result not found */}
                </span>

              </span>
              <span className="allcategory_container" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{
                  color: colors.headingColor, backgroundColor: colors.subheadingBackgroundColor,
                  borderRadius: '6px',
                  padding: '1px 8px',
                }} className="category_name"> {offer_name} {offer_discount}%</span>
                <img onClick={divOfferRemove} src={crossKnifeImg} style={{ height: '3.5vh', borderRadius: '100%', marginRight: "2%" }} alt="jhk" />

              </span>
              <div style={{
                display: 'flex',
                padding: '5% 0% 0% 0%',
                color: 'lightblue',
                gap: colors.allow_half_price ? "0px" : "22%",
                justifyContent: 'flex-end',
              }}
              >
                <div className="allitems_heading_name" style={{ color: colors.bannerColor, textAlign: 'center' }}>
                  Item name
                </div>
                <div className="allitems_heading_price" style={{ color: colors.bannerColor }}>Full price</div>
                {colors.allow_half_price ? <div className="allitems_heading_price" style={{ color: colors.bannerColor }}>Half price</div> : null}
              </div>
              {offerShow.length > 0 ?
                <>
                  {offerShow.map((showdata, id) => (
                    <div className="cardItem" style={{ background: colors.card_color, padding: "6px 0" }} >
                      <div className="showimg_div" >
                        {bestProducts?.filter(b => b.item == showdata.item_id).length > 0 ? <div className="ribbon">Best Seller</div> : <div className="null_ribbon"></div>}
                        <img src={siteConfig.siteURL + showdata.item_image}
                          className="menu_img"
                        />
                      </div>

                      <div className="price_item_description_div">
                        <div className="price_description_container" >
                          <h4 style={{ color: colors.subHeadingColor }}
                            className="allitems_name"
                          >{showdata.item_name}</h4>
                          {showItemRatings && itemList.find((entry) => entry.id === Number(showdata.item_id))?.average_rating != null ? <div className="restro-item-rating"><span aria-hidden="true">★</span> {Number(itemList.find((entry) => entry.id === Number(showdata.item_id)).average_rating).toFixed(1)}</div> : null}
                          <h4 style={{ color: colors.subHeadingColor }}
                            className="allitems_price"
                          >
                            {showdata.item_fullprice > 0 ? <strike>{rupee_sign} {showdata.item_fullprice}</strike> : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}

                          </h4>

                          {colors.allow_half_price ? <h4 style={{ color: colors.subHeadingColor }}
                            className="allitems_price"
                          >
                            {showdata.item_halfprice > 0 ? <strike>{rupee_sign} {showdata.item_halfprice}</strike> : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}

                          </h4> : null}
                        </div>

                        <div className="price_description_container" >
                          <h4 style={{ color: 'red', }}
                            className="allitems_name">Offered price</h4>
                          <h4 style={{ color: colors.subHeadingColor, padding: '0', margin: '0' }}
                            className="allitems_price"
                          >
                            {offerFullPrice(offerList, showdata.item_name) > 0 ? <>{rupee_sign}{offerFullPrice(offerList, showdata.item_name)}</> : <>&nbsp;&nbsp;&nbsp;&nbsp;---</>}

                          </h4>

                          {colors.allow_half_price ? <h4 style={{ color: colors.subHeadingColor, padding: '0', margin: '0' }}
                            className="allitems_price"
                          >
                            {offerHalfPrice(offerList, showdata.item_name) > 0 ? <> {rupee_sign} {offerHalfPrice(offerList, showdata.item_name)}</> : <>&nbsp;&nbsp;&nbsp;&nbsp;---</>}

                          </h4> : null}
                        </div>

                        <div className="description_div" style={{ display: 'flex', paddingTop: '2%' }}
                        >

                          {showdata.item_type == 'Veg' ? (
                            <>
                              <span className="rs-diet-icon rs-diet-veg" role="img" aria-label="Vegetarian"><span /></span>
                            </>
                          ) : null}
                          {showdata.item_type == 'Nonveg' ? (
                            <>
                              <span className="rs-diet-icon rs-diet-nonveg" role="img" aria-label="Non vegetarian"><span /></span>
                            </>
                          ) : null}
                          {showdata.item_type == 'Other' ? (
                            <>
                            </>
                          ) : null}

                          &nbsp; <span className="description_content" onClick={e => toggleDescription(e.currentTarget.style)} style={{ alignItems: 'center', color: colors.subHeadingColor }}>

                            {hasFeature(subscribePlan, "order") ? <button className="add_product" style={{
                              color: colors.bannerColor,
                              backgroundColor: "transparent",
                              border: `1px solid ${colors.bannerColor}`,
                              borderRadius: '6px',
                            }} disabled={itemList.find(i => i.id === Number(showdata.item_id))?.kitchen_available === false} onClick={e => { if (itemList.find(i => i.id === Number(showdata.item_id))?.kitchen_available !== false) callPopupModel(showdata, offerFullPrice(offerList, showdata.item_name), offerHalfPrice(offerList, showdata.item_name)) }}>
                              <AiOutlinePlus className="plus_icon"
                                style={{
                                  color: colors.bannerColor
                                }} />{itemList.find(i => i.id === Number(showdata.item_id))?.kitchen_available !== false ? 'Add' : 'Unavailable'}</button> : null}
                            <ReactReadMoreReadLess
                              charLimit={55}
                              readMoreText={"more"}
                              readLessText={"less"}
                            >
                              {showdata.item_description && showdata.item_description.length > 0 ? showdata.item_description : " "}
                            </ReactReadMoreReadLess>
                          </span>
                        </div>
                      </div>

                    </div>
                  ))}
                </>
                : null
              }
            </div>

            <PopupDetail item={clickedDetail} bestSeller={bestProducts} setDetailPopupVisiblity={setDetailPopupVisiblity} isDetailPopupOpen={isDetailPopupOpen} />
            <div id="flip_div_idd"
              className={search.length != 0 || offerShow.length > 0 ? "menu_childdiv" : 'check'}
            >
              <FlippingPages
                direction="right-to-left"
                onSwipeEnd={setSelected}
                selected={selected}
                disableSwipe
                children={2}
                shadowBackground='transparent'
              >
                {menuList.map((showMenu) => (
                  <div className="overflowHide">
                    <span style={{ textAlign: 'center' }}
                    >

                      <h5 style={{
                        color: colors.headingColor, paddingTop: '2%',
                        // backgroundColor: colors.headingBackgroundColor
                      }}
                        className="main_menu_name"
                      >{showMenu.name}
                      </h5>
                    </span>
                    {categoryList.length > 0 ? <>
                      {categoryList.filter(set => set.menu === showMenu.id).map(data =>
                        <div className="allcategory_menu_div">
                          <span className="allcategory_container"
                          >
                            <h3 style={{
                              color: colors.headingColor, backgroundColor: colors.subheadingBackgroundColor, borderRadius: '6px',
                              padding: '1px 8px',
                              fontSize: '16px'
                            }}
                              className="category_name"
                            >{data.name}
                            </h3>
                          </span>
                          <div style={{
                            display: 'flex',
                            padding: '5% 0% 0% 0%',
                            color: 'lightblue',
                            gap: colors.allow_half_price ? "0px" : "22%",
                            justifyContent: "flex-end",
                          }}
                          >
                            <div className="allitems_heading_name" style={{ color: colors.bannerColor, textAlign: 'center', paddingLeft: colors.allow_half_price ? "4%" : "1%" }}>
                              Item name
                            </div>
                            <div className="allitems_heading_price" style={{ color: colors.bannerColor, }} >Full price</div>

                            {colors.allow_half_price ? <div className="allitems_heading_price" style={{ color: colors.bannerColor }}>Half price</div> : null}
                          </div>

                          {itemList.length > 0 ? <>
                            {itemList.filter(i => i.category === data.id).map(m => {
                              var fullprice = m.price_full;
                              var halfprice = m.price_half;
                              if ((offerList.filter((data) => parseInt(data.item_id) === m.id)).length > 0) {
                                fullprice = offerFullPrice(offerList, m.name);
                                halfprice = offerHalfPrice(offerList, m.name);
                              }
                              return <div className="cardItem" style={{ background: colors.card_color, padding: "6px 0" }}>
                                <div className="showimg_div" >
                                  {bestProducts?.filter(b => b.item == m.id).length > 0 ? <div className="ribbon">Best Seller</div> : <div className="null_ribbon"></div>}
                                  <img src={siteConfig.siteURL + m.icon}
                                    className="menu_img"
                                  />

                                </div>

                                {(offerList.filter((data) => parseInt(data.item_id) === m.id
                                  && data.item_discount != undefined && data.item_discount != null)).length > 0 ?
                                  <>
                                    <div className="price_item_description_div">
                                      <div className="price_description_container" >
                                        <h4 style={{ color: colors.subHeadingColor }}
                                          className="allitems_name"
                                        >{m.name}</h4>
                                        {showItemRatings && m.average_rating != null ? <div className="restro-item-rating"><span aria-hidden="true">★</span> {Number(m.average_rating).toFixed(1)}</div> : null}
                                        <h4 style={{ color: colors.subHeadingColor }}
                                          className="allitems_price"
                                        >
                                          {m.price_full > 0 ? <strike>{rupee_sign} {m.price_full}</strike> : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}

                                        </h4>

                                        {colors.allow_half_price ? <h4 style={{ color: colors.subHeadingColor }}
                                          className="allitems_price"
                                        >
                                          {m.price_half > 0 ? <strike>{rupee_sign} {m.price_half}</strike> : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}

                                        </h4> : null}
                                      </div>

                                      <div className="price_description_container" >
                                        <h4 style={{ color: 'red', padding: '0' }}
                                          className="allitems_name">Offered price</h4>
                                        <h4 style={{ color: colors.subHeadingColor, padding: '0', margin: '0' }}
                                          className="allitems_price"
                                        >
                                          {offerFullPrice(offerList, m.name) > 0 ? <> {rupee_sign} {offerFullPrice(offerList, m.name)}</> : <>&nbsp;&nbsp;&nbsp;&nbsp;---</>}

                                        </h4>
                                        {colors.allow_half_price ? <h4 style={{ color: colors.subHeadingColor, padding: '0', margin: '0' }}
                                          className="allitems_price"
                                        >
                                          {offerHalfPrice(offerList, m.name) > 0 ? <> {rupee_sign} {offerHalfPrice(offerList, m.name)}</> : <>&nbsp;&nbsp;&nbsp;&nbsp;---</>}

                                        </h4> : null}
                                      </div>

                                      <div className="description_div" style={{ display: 'flex', paddingTop: '2%' }}
                                      >

                                        {m.item_type == 'Veg' ? (
                                          <>
                                            <span className="rs-diet-icon rs-diet-veg" role="img" aria-label="Vegetarian"><span /></span>
                                          </>
                                        ) : null}
                                        {m.item_type == 'Nonveg' ? (
                                          <>
                                            <span className="rs-diet-icon rs-diet-nonveg" role="img" aria-label="Non vegetarian"><span /></span>
                                          </>
                                        ) : null}
                                        {m.item_type == 'Other' ? (
                                          <>
                                          </>
                                        ) : null}

                                        &nbsp; <span ref={ref} className="description_content" onClick={e => toggleDescription(e.currentTarget.style)} style={{ alignItems: 'center', color: colors.subHeadingColor }}>
                                          {hasFeature(subscribePlan, "order") ? <button className="add_product" style={{
                                            color: colors.bannerColor,
                                            backgroundColor: "transparent",
                                            border: `1px solid ${colors.bannerColor}`,
                                            borderRadius: '6px',
                                          }} disabled={!m.kitchen_available} onClick={e => { if (m.kitchen_available) callPopupModel(m, fullprice, halfprice) }}>
                                            <AiOutlinePlus className="plus_icon"
                                              style={{
                                                color: colors.bannerColor
                                              }} />{m.kitchen_available ? 'Add' : 'Unavailable'}</button> : null}
                                          <ReactReadMoreReadLess
                                            charLimit={55}
                                            readMoreText={"more"}
                                            readLessText={"less"}
                                          >
                                            {m.description && m.description.length > 0 ? m.description : " "}
                                          </ReactReadMoreReadLess>
                                        </span>
                                      </div>

                                    </div>

                                  </>
                                  :
                                  <>
                                    <div className="price_item_description_div">
                                      <div className="price_description_container" >
                                        <h4 style={{ color: colors.subHeadingColor }}
                                          className="allitems_name"
                                        >{m.name}</h4>
                                        {showItemRatings && m.average_rating != null ? <div className="restro-item-rating"><span aria-hidden="true">★</span> {Number(m.average_rating).toFixed(1)}</div> : null}
                                        <h4 style={{ color: colors.subHeadingColor }}
                                          className="allitems_price"
                                        >{m.price_full ? rupee_sign + m.price_full : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}</h4>

                                        {colors.allow_half_price ? <h4 style={{ color: colors.subHeadingColor }}
                                          className="allitems_price"
                                        >{m.price_half ? rupee_sign + m.price_half : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}</h4> : null}

                                      </div>
                                      <div className="description_div" style={{ display: 'flex', }}>

                                        {m.item_type == 'Veg' ? (
                                          <>
                                            <span className="rs-diet-icon rs-diet-veg" role="img" aria-label="Vegetarian"><span /></span>
                                          </>
                                        ) : null}
                                        {m.item_type == 'Nonveg' ? (
                                          <>
                                            <span className="rs-diet-icon rs-diet-nonveg" role="img" aria-label="Non vegetarian"><span /></span>
                                          </>
                                        ) : null}
                                        {m.item_type == 'Other' ? (
                                          <>
                                          </>
                                        ) : null}

                                        &nbsp; <span ref={ref} className="description_content" onClick={e => toggleDescription(e.currentTarget.style)} style={{ alignItems: 'center', color: colors.subHeadingColor }}>
                                          {hasFeature(subscribePlan, "order") ? <button className="add_product" style={{
                                            color: colors.bannerColor,
                                            backgroundColor: "transparent",
                                            border: `1px solid ${colors.bannerColor}`,
                                            borderRadius: '6px',
                                          }} disabled={!m.kitchen_available} onClick={e => { if (m.kitchen_available) callPopupModel(m, fullprice, halfprice) }}>
                                            <AiOutlinePlus className="plus_icon"
                                              style={{
                                                color: colors.bannerColor
                                              }}
                                            />{m.kitchen_available ? 'Add' : 'Unavailable'}</button> : null}
                                          <ReactReadMoreReadLess
                                            charLimit={55}
                                            readMoreText={"more"}
                                            readLessText={"less"}
                                          >
                                            {m.description && m.description.length > 0 ? m.description : " "}
                                          </ReactReadMoreReadLess>
                                        </span>
                                      </div>
                                    </div>

                                  </>
                                }
                              </div>
                            })}
                          </> : null
                          }
                        </div>
                      )}
                    </> :
                      null}
                  </div>
                ))}
              </FlippingPages>
            </div>

            <br />

            <div className="main_footer_container" style={{ backgroundColor: colors.subheadingBackgroundColor }}>
              <div className="drawerBtn" onClick={e => {
                setmenuListVisiblity(!menuListVisible);
              }} style={{ backgroundColor: colors.bannerColor }}>
                {menuListVisible ?
                  <MdOutlineKeyboardArrowDown color="white" className="arrow_toggle" style={{ color: colors.backgroundTheme }} /> :
                  <MdOutlineKeyboardArrowUp color="white" className="arrow_toggle" style={{ color: colors.backgroundTheme }} />}
              </div>
              <div className="category_container" id="category_container"
                onTouchMove={e => { if (interval.current.render) window.clearTimeout(interval.current.render); console.log("clear------------------- ") }}
                onTouchEnd={e => {
                  console.log("--------- ", interval.current.render)
                  if (interval.current.render) window.clearTimeout(interval.current.render);

                  interval.current.render = setTimeout(() => {
                    setmenuListVisiblity(false)
                  }, 20000)
                }}>
                {menuList.map((data, id) => (
                  <div id={id} className='all-menu'
                    onClick={
                      e => {
                        if (searchVisible)
                          document.getElementById('search_box').value = "";
                        onMenuChange(id, data.id);
                        setSelected(id);
                      }
                    }
                  >
                    <img className="category_img"
                      style={{
                      }}
                      src={siteConfig.siteURL + data.icon}
                    />
                    <div className="footer_category_name" style={{ color: colors.headingColor }}>{data.name}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          <>
            <Modal style={{ padding: '0% !important' }} open={isModalOpen} footer={null} onOk={handleOk} onCancel={handleCancel}>
              <div
              >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <img
                    src={noOfferImg}
                    style={{ height: "30vh", width: '85vw' }}
                  />

                </div>
                <h5 style={{ color: colors.subHeadingColor, textAlign: 'center', fontSize: '18px', padding: '0', margin: '0' }}>
                  Currently no items are available</h5>
              </div>
            </Modal>
          </>

          <div className="inlandscapemode" id="landscape" style={{ color: colors.subHeadingColor }}>
            <img src={landscapeMode} style={{ height: '80vh' }} alt="" className="landscapimg" />
          </div>

          <>
            <Modal style={{ padding: '0% !important' }} footer={null} open={isRatingModal} onOk={handleRatingOk} onCancel={handleRatingCancel}>
              <div className='rating_review_heading' style={{ marginTop: '2%' }}></div>

              <Form
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 40 }}
                onFinish={handleFormSubmit}
                form={form}
                scrollToFirstError
                name="comment"
              >
                <div
                >
                  <Form.Item
                    name='rating'
                    label='Rating'
                    style={{
                      marginBottom: '10px'
                    }}
                  >
                    <div
                    >
                      <Rate defaultValue={3}
                        onChange={(e) => setValue(e)}

                      />
                    </div>
                  </Form.Item>
                </div>

                <Form.Item
                  name='review'
                  label='Review'
                  rules={[
                    {
                      required: false,
                      message: 'Please enter your review',
                    },
                  ]}
                  style={{
                    marginBottom: '10px'
                  }}
                >
                  <TextArea maxLength={255} />
                </Form.Item>

                <Form.Item>
                  <div className='rating_review_maindiv'>
                    <Button
                      className="skip_btn"
                      onClick={handleRatingCancel}
                      style={{ background: colors.bannerColor, color: colors.backgroundTheme }}
                    >
                      Skip
                    </Button>

                    <Button htmlType='submit'
                      className="done-btn"
                      style={{ background: colors.bannerColor, color: colors.backgroundTheme, }}
                    >
                      Sent
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </Modal>
          </>

        </>
      }
    </>
  );
}
export default MenuItem;
