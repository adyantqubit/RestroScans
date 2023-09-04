// import "./MenuItem.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getBestProducts, getmenuList, getofferDetails, gettenantList, getThemeChanges,postRatingReview } from "../../api/Services";
import siteConfig from "../../config/config";
import './MenuItem.css'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Input, Button, Modal, notification,Drawer, Form, message, Rate, } from 'antd';
import { CloseOutlined, LeftOutlined, RightOutlined, CheckCircleOutlined, FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons'
import Footer from "../footer/Footer";
import { FlippingPages } from 'flipping-pages';
import 'flipping-pages/dist/style.css';
import { GlobalContext } from "../../context/Context";
import { useContext } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import ReactPlayer from 'react-player'
import noOfferItem from "../../images/offer_default.jpg"
import nodataImg from '../../images/not_offer.png'
import noOfferImg from "../../images/offer_default.jpg"
import nodataOffer from '../../images/offer 41.jpg'
import crossKnifeImg from '../../images/cross_sign.jpg'
import vegIcon from '../../images/veg_icon.png'
import nonVegIcon from '../../images/nonveg_icon.png'
import landscapeMode from '../../images/landscape.png'
import { MdRoomService, MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { GoSearch } from "react-icons/go";
import {IoLogoYoutube} from "react-icons/io";
import offer_comming_soon_img from '../../images/offer_comming_soon_img.jpg';
import ReactReadMoreReadLess from "react-read-more-read-less";
import welcome_banner from '../../images/welcome_banner.jpg';
import Draggable from 'react-draggable';
import { FloatingWhatsApp } from "react-floating-whatsapp";


// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import GlobalColor from '../Colors/GlobalColor'
// import { Navigation } from "swiper";
import { Pagination, Navigation, Mousewheel, Keyboard, Autoplay } from "swiper";
import Loader from "../Loader/Loader";
import PopupDetail from "./PopupDetail";
import { GrFormAdd } from "react-icons/gr";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { TenantValidate } from "../Validators/ConfirmTenant";
import secureLocalStorage from "react-secure-storage";
import ReservationForm from "../Reservation/ReservationForm";

function MenuItem() {

  const [form] = Form.useForm();

  // added by rohan - 17/4/23
  // reason- To validate user is in same tenant of not
  TenantValidate()
  // end of code - rohan kansari -17/4/23
  var { searchedValue,
    setSearchedValue, colors, cart, subscribePlan,rupee_sign,tenantDetails } = useContext(GlobalContext);

    // Added by Rohankansari - 8/5/23
    const videoRef = useRef(null);

  const [menuList, setmenuList] = useState([]); // Our menu set in this variable
  const [categoryList, setCategoryList] = useState([]); // Our Category set in this variable
  const [itemList, setItemList] = useState([]); // Our Item set in this variable

  var [filterCategory, setfilterCategory] = useState([])
  var [offerShow, setOfferShow] = useState([])

  var [filter, setFiltered] = useState([])
  // Added by Om on 25-03-23
  // Reason : Add Loader whenever the data enter from backend site
  const [isLoader, setIsLoader] = useState(true)
  // End of addition

  const [offerBanner, setOfferBanner] = useState([]); // Our Item set in this variable
  const [offerList, setOfferList] = useState([]); // Our Item set in this variable
  var [restaurantName, setRestaurantName] = useState([]);

  const onMenuChange = (id, data) => {
    // document.getElementById(id).style.backgroundColor='aqua';
    setfilterCategory(menuList.filter((dt) => dt.id == data))

    setOfferShow([])

    // Modified by :- Parineeta Gedam Date :- 05-04-2023
    // Uncommented by Om Shrivastava on 17-05-23
    // Reason : When user click the menu than search box is enable
    document.getElementById('hide_search').style.display = 'block'
    // End of uncommented by Om Shrivastava on 17-05-23
    // commented by ROhan kansari- 27/4/23
    // document.getElementById('hide_search').style.display = 'flex'
    // End of added code 05-04-2023


    // Added by Rohan - 26/4/23
    // Reason - only add this animation when menulist is visible
    if (menuListVisible)
      document.getElementById(id).classList.add("category_animated_div");
    // End of code - 26/4/23 - Rohan

    for (var i = 0; i < menuList.length; i++) {
      // Added by Rohan - 26/4/23
      // Reason - only add this animation when menulist is visible
      if (i != id && menuListVisible)
        document.getElementById(i).classList.remove("category_animated_div");
      // End of code - 26/4/23 - Rohan

    }

    setNewSearch('')
   
      // Added by Rohan Kansari - 4/5/23
      // Reason - To jump into top in each menu change
      document.getElementById('menu_maindiv').scrollTo(0,0)


  }

  // added by Rohan - 9/4/23
  // Reason - To show again header in all pages
  // document.getElementsByClassName("heading_container")[0].style.display="flex"
  // end of code

  const onOfferShow = (item) => {
    setOfferShow(offerList.filter((show) => show.offer_name == item))
    // Uncommented by Om Shrivastava on 17-05-23
    // Reason : When user click the menu than search box is enable
    document.getElementById('hide_search').style.display = 'none';
    // End of uncommented by Om Shrivastava on 17-05-23

    setNewSearch("")

    if (offerList.filter((show) => show.offer_name == item).length < 1) {
      // (document.getElementById('offer_divv').style.display = 'block')
      //   (document.getElementById('flip_div_idd').style.height = '0% ')

      // Modified by :- Parineeta Gedam Date :- 05-04-2023
      // document.getElementById('hide_search').style.display = 'block'
      // document.getElementById('hide_search').style.display = 'flex'
      // End of added code 05-04-2023

      // function openModal() {
      //   showModal()
      // }
      showModal()
      // notification.info({
      //   description:
      //     'No longer available items for this offer..',
      //   duration: 2,
      //   key: 1,
      // });
    }
    else {
      document.getElementById('offer_divv').style.display = 'none'
      document.getElementById('flip_div_idd').style.height = '45% '

    }
  }

  useEffect(() => {
    getMenu(tenantt);
    getOffer(tenantt);
    // Added by Rohan kansari- 8/5/23 - To save video targeting node
    setVidRef(document.querySelector(".react-player"));
    // getRestroName(tenantt)
  }, []);

  var tenantt = localStorage.getItem("tenantName")
  var restaurant_name = localStorage.getItem("restroName")

  // Added by rohan - 13/4/23
  // reason save all top 10 best products
  const [bestProducts, setBestProduct] = useState(null)


  const getMenu = async () => {
    const response = await getmenuList(tenantt);
    if (response) {
      setIsLoader(false)
      setmenuList(response.menuList);
      setCategoryList(response.categoryList)
      setItemList(response.itemList)
      setfilterCategory(response.menuList)
      // this line is new added by -rohan
      setBestProduct(response.top_product)
    }
  };

  // end of code - 13/4/23

  // const getRestroName = async () => {
  //   const response = await gettenantList(tenantt);
  //   if (response) {
  //     setRestaurantName(response.restaurantName);
  //   }
  // };
  // For Show the all offers in banner

  const getOffer = async () => {
    const response = await getofferDetails(tenantt);
    if (response) {
      setIsLoader(false)
      setOfferBanner(response.offerBanner);
      setOfferList(response.offerItemList)
      // setOfferShow(response.offerItemList)
    }
  };

  const [search, setNewSearch] = useState("");

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

  var offer_name = []
  let offernme = new Set()
  offerShow.forEach(entry => { offernme.add(entry.offer_name) })
  offernme.forEach(cat => offer_name.push(cat))

  var offer_discount = []
  let offers = new Set()
  offerShow.forEach(entry => { offers.add(entry.item_discount) })
  offers.forEach(cat => offer_discount.push(cat))

  const divOfferRemove = () => {
    setOfferShow([])
    // Modified by :- Parineeta Gedam Date :- 05-04-2023
    // Uncommented by Om Shrivastava on 17-05-23
    // Reason : When user click the menu than search box is enable
    document.getElementById('hide_search').style.display = 'block'
    // End of uncommented by Om Shrivastava on 17-05-23

    // document.getElementById('hide_search').style.display = 'flex'
    // End of added code 05-04-2023
  };

  const removeSerchResult = () => {
    // filtered
    setNewSearch("")
    setFiltered(itemList)

  }
  // ---------Offer section show offer----------
  function totalFullPrice(data) {
    if (offerList) {
      var discounted_amount = 0;
      var final_price = 0
      offerList.map((item) => {
        if (item.item_name == data.item_name) {
          discounted_amount = ((item.item_fullprice / 100) * item.item_discount).toFixed(2)
          final_price = (item.item_fullprice - discounted_amount).toFixed(2)
        }
      });
      return final_price
    }
  }

  function totalHalfPrice(data) {
    if (offerList) {
      var discounted_half_amount = 0;
      var final_half_price = 0
      offerList.map((item) => {
        if (item.item_name == data.item_name) {
          discounted_half_amount = ((item.item_halfprice / 100) * item.item_discount).toFixed(2)
          final_half_price = (item.item_halfprice - discounted_half_amount).toFixed(2)
        }
      });
      return final_half_price
    }
  }
  // ----------XXXX--------------------

  // ---------Search section show offer----------
  function searchSectionFullPrice(setData) {
    if (offerList) {
      var amount = 0;
      var price = 0
      offerList.map((item) => {
        if (item.item_name == setData.name) {
          amount = ((item.item_fullprice / 100) * item.item_discount).toFixed(2)
          price = (item.item_fullprice - amount).toFixed(2)
        }
      });
      return price
    }
  }


  function searchSectionHalfPrice(setData) {
    if (offerList) {
      var search_amount = 0;
      var search_price = 0
      offerList.map((item) => {
        if (item.item_name == setData.name) {
          search_amount = ((item.item_halfprice / 100) * item.item_discount).toFixed(2)
          search_price = (item.item_halfprice - search_amount).toFixed(2)
        }
      });
      return search_price
    }
  }
  // ----------XXXX--------------------

  // ---------Main page section show offer----------
  function mainSectionFullPrice(mainData) {
    if (offerList) {
      var main_amount = 0;
      var main_price = 0
      offerList.map((item) => {
        if (item.item_name == mainData.name) {
          main_amount = ((item.item_fullprice / 100) * item.item_discount).toFixed(2)
          main_price = (item.item_fullprice - main_amount).toFixed(2)
        }
      });
      return main_price
    }
  }
  function mainSectionHalfPrice(setData) {
    if (offerList) {
      var main_half_amount = 0;
      var main_half_price = 0
      offerList.map((item) => {
        if (item.item_name == setData.name) {
          main_half_amount = ((item.item_halfprice / 100) * item.item_discount).toFixed(2)
          main_half_price = (item.item_halfprice - main_half_amount).toFixed(2)
        }
      });
      return main_half_price
    }
  }
  // ----------XXXX--------------------

  const removeOffersectionDiv = () => {
    (document.getElementById('offer_divv').style.display = 'none')
      (document.getElementById('flip_div_idd').style.height = '41% ')
    // Modified by :- Parineeta Gedam Date :- 05-04-2023
    // document.getElementById('hide_search').style.display = 'block'
    // document.getElementById('hide_search').style.display = 'flex'
    // End of added code 05-04-2023 

  }
  const removeNoSerachResult = () => {
    (document.getElementById('search_divv').style.display = 'none')

  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
    // Added by Om Shrivastava on 17-05-23
    document.getElementById('hide_search').style.display = 'block';
    // End of addition by 17-05-023
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
      // notification.info({
      //   description:
      //     'Search result is not found',
      //   duration: 2,
      //   key: 1,
      // });
    }

    
    // Added by ROhankansari - 4/5/23
    // Reason - To Stop animation on search div 
    try{
    if(search.length>0){
    document.getElementById(selected).classList.remove("category_animated_div");
    }
    else{
      document.getElementById(selected).classList.add("category_animated_div");
      for (var i = 0; i < menuList.length; i++) {
        if (i != selected)
          document.getElementById(i).classList.remove("category_animated_div");
      }
    }
  }
  catch (e){

  }

    // End of code - 4/5/23 - Rohan kansari 


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

  var [selected, setSelected] = useState(0);

  const back = () => {

    selected = selected - 1;
    // console.log(selected)
    if (selected < 0) {
      setSelected(menuList.length - 1)
      document.getElementById(menuList.length - 1).classList.add("category_animated_div");

      for (var i = 0; i < menuList.length; i++) {
        if (i != menuList.length - 1)
          document.getElementById(i).classList.remove("category_animated_div");
      }
    }
    else {
      setSelected(selected)

      document.getElementById(selected).classList.add("category_animated_div");

      for (var i = 0; i < menuList.length; i++) {
        if (i != selected)
          document.getElementById(i).classList.remove("category_animated_div");
      }
    }
    setOfferShow([])
    // Modified by :- Parineeta Gedam Date :- 05-04-2023
    // document.getElementById('hide_search').style.display = 'block'
    // document.getElementById('hide_search').style.display = 'flex'
    // End of added code 05-04-2023

    setNewSearch('')
  };

  const next = () => {

    selected = selected + 1;
    // console.log(selected)

    if (menuList.length - 1 < selected) {
      setSelected(0)
      document.getElementById(0).classList.add("category_animated_div");

      for (var i = 0; i < menuList.length; i++) {
        if (i != 0)
          document.getElementById(i).classList.remove("category_animated_div");
      }
    }
    else {
      setSelected(selected)
      document.getElementById(selected).classList.add("category_animated_div");

      for (var i = 0; i < menuList.length; i++) {
        if (i != selected)
          document.getElementById(i).classList.remove("category_animated_div");
      }
    }
    // setSelected(selected => Math.min(selected + 1, menuList.length - 1));



    setOfferShow([])
    // Modified by :- Parineeta Gedam Date :- 05-04-2023
    // document.getElementById('hide_search').style.display = 'block'
    // document.getElementById('hide_search').style.display = 'flex'
    // End of added code 05-04-2023


    setNewSearch('')
  };

  // console.log(menuList, 'All Menu')
  // console.log(categoryList, 'All categories')
  // console.log(itemList, 'All items')
  // console.log(filterCategory, 'filtercategory')
  // console.log(offerBanner, 'all offer images')
  // console.log(offerList, 'all offer details')
  // console.log(offerShow, 'set offer data')
  // console.log(filter, 'searching data')
  // console.log(res)
  // console.log(search, 'set in input field')


  const navigate = useNavigate();

  const navigatee = () => {
    navigate('/')
  }

  // Added by Rohan on - 5/4/23 
  // Reason - This will push selected item detail into popup model
  var nav = useNavigate()
  var [clickedDetail, setClickedDetail] = useState(null)
  var [isDetailPopupOpen, setDetailPopupVisiblity] = useState(false)
  function callPopupModel(detail, fullPrice, halfPrice) {
    detail["discounted_half_price"] = halfPrice;
    detail["discounted_full_price"] = fullPrice;
    clickedDetail = detail;

    setClickedDetail(clickedDetail);
    setDetailPopupVisiblity(!isDetailPopupOpen)
  }
  // end of code of 5/4/23 Rohan


  // Added by :- Parineeta Gedam
  // Date :- 03-04-2023
  // Reason :- for drawer

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  // End of added code 03-04-2023


  const [searchVisible, setSearchVisiblity] = useState(false)
  const ref = useRef()
  // Added by rohan -16/4/23
  // reason- To hide and unhide description
  function toggleDescription(style) {
    if (style.display == "unset")
      style.display = ""
    else
      style.display = "unset"
  }

  // added by rohan kansari -19/4/23
  // reason to clear search if search is not visible
  useEffect(() => {
    if (!searchVisible)
      setNewSearch("")

    console.log("search change")
  }, [searchVisible])

  const [menuListVisible, setmenuListVisiblity] = useState(true)

  // Added by Rohan kansari -27/4/23
  // Reason - To apply animation when menu list is visible
  function applyAnimation() {
    // Added by ROhankansari - 4/5/23
    // Reason - stop animation in search div
    if(search.length==0)
    document.getElementById(selected).classList.add("category_animated_div");

    for (var i = 0; i < menuList.length; i++) {
      if (i != selected)
        document.getElementById(i).classList.remove("category_animated_div");
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

  // End of code Rohan kansari - 27/4/23


  // Added by Rohan Kansari - 28/4/23
  // Reason- To showw video in popup container with full size

  const [videoVisible,setVideoVisiblity]=useState(false)

  // End of code - 28/4/23 Rohan Kansari


  // Added by ROhanakansari - 30/4/23
  // Reason- TO stop youtube video on prev and next button click of slider
  // Removed by Rohan Kansari - 8//5/23 
  // Reason - Becuase no longer in use , video functionality is changed
  // var stopAllYouTubeVideos = () => {
    // var iframes = document.getElementsByClassName('iframe');
    // for (var i=0;i<iframes.length;i++){
    //   var temp=iframes[i].src
    //   iframes[i].src=temp
    // }  
  // }

  // End of code- ROhankansari 

  // Added by Rohan kansari- 3/5/23
  // Reaon - to hide menu drawer in 6 second if its open
  // Modified by Rohankansari - 8/5/23
  // Reason - To save id of timeout in ref and clear it on new thread generation
  var interval=useRef({render:null});
  useEffect(() => {
    // When data is not coming than show the loader added by Om Shrivastava on 19-05-23
    if(!isLoader)
    // End of addition by Om Shrivastava on 19-05-23
    if (menuListVisible ) {
      if(interval.current.render)window.clearTimeout(interval.current.render);
      document.getElementsByClassName("menu_maindiv")[0].style.maxHeight = "73vh"
      document.getElementById("category_container").className = "category_container"
      interval.current.render = setTimeout(() => {
        setmenuListVisiblity(false)
        console.log("-------------------hit timeout")
      }, 20000)
    }
    else {
      document.getElementsByClassName("menu_maindiv")[0].style.maxHeight = "88vh"
      document.getElementById("category_container").className += " newHieght"
      window.clearTimeout(interval.current.render)
    }

    
  }, [menuListVisible])
   // end of code by Rohan kansari - 8/5/23
  // End of code- 3/5/23
  
  // Added by - Suman sahu  On 05/05/2023
  // Reason - get whatsapp number on whatsapp chatbot field

  const [whatsApp, setwhatsAppDetail] = useState([]);

  useEffect(() => {
    WhatsAppDetails();
  }, []);

  const WhatsAppDetails = async () => {
    const response = await getThemeChanges(tenantt);
    if (response) {
      setwhatsAppDetail(response.setting);
    }
  };
  // End of addition 05/05/2023


  // Added by Rohan Kansari- 8/5/23
  // Reason - To handle video in banner
  const [playVideo, setVideo] = useState({})
  const [vidRef, setVidRef] = useState(null);
  function setVideoPlayingToggle(id){

    var key=`video${id}`
    setVideo({ [key]:!playVideo[`video${id}`]})
  }
  // End of code - 8/5/23


 {/* Added by :- Parineeta Gedam
      Date :- 01-06-2023
      Reason :- Open Model for customer details.
  */}

  const [isModalOpenn, setIsModalOpenn] = useState(false);
  const showModall = () => {
    setIsModalOpenn(true);
  };
  const handleOkk = () => {
    setIsModalOpenn(false);
  };
  const handleCancell = () => {
    setIsModalOpenn(false);
  };

  {/* End of added code 01-06-2023 */ }

  {/* Added by Om Shrivastava on 14-06-23
 Reason: When user apply rating than show rating and review */}
 const [isRatingModal, setIsRatingModal] = useState(false);
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
 var [value, setValue] = useState(3);
 const onChange = (e) => {
   console.log('radio checked', e.target.value);
   setValue(e.target.value);
 };
 // End of addition by Om Shrivastava on 01-06-23

 // Added by Om Shrivastava on 01-06-23
 // Reason : When display the rating and review

 const handleFormSubmit = async (formdata) => {
   const saveRatingData = {
     rating: value == "" ? 0.0:value,
     review: formdata.review,
   };
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
 // End of addition by Om Shrivastava on 14-06-23

  return (
    <>
    {/* Added by Om Shrivastava on 19-05-23
    Reason : To show the loader  when the data is not coming*/}
      {isLoader == true ? <Loader /> :
      <>
          {/* Added By Rohan Kansari- 28/4/23
            Reason - initialize popup page for video her*/}
          {videoVisible?<div className="video_container">
             <div classname="header"><AiOutlineClose color="white" size={30} style={{ margin: "10px " }} onClick={e=>setVideoVisiblity(false)}/></div>
             <iframe style ={{display: "block" ,border: "none",height:"50vh" , width: "100%",float:"left" ,marginLeft:"0px"}} src="https://www.youtube.com/embed/dm2RHGYRtas"  border='0' width='620' height='465'  marginheight='0' marginwidth='0' frameborder='0'  title="YouTube video player" allow="autoplay; encrypted-media" id="Overlayvideo" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>
            </div>:null}
        {/*End of code - 28/4/23 - Rohan Kansari  */}
      {/* {isLoader == true ? <Loader /> : */}

      <div className='menu_maindiv'
      id="menu_maindiv"
        style={{ backgroundColor: colors.backgroundTheme }}
        onLoad={e => {
          //added by rohan -9/4/23 to show header unhide header
          if (document.getElementsByClassName("front_page").length == 0)
            // Added  by rohan kansari -27/4/23
            // Reason - To apply animation of selected menu 
            applyAnimation()
          // End of code- Rohan kansari - 27/4/23
          document.getElementsByClassName("heading_container")[0].style.display = "flex"
          // end of code
        }}
      >


        {/* Adding By Rohan kansari - 27/4/23
            Reason- To add new design header where menu, name and cart icon show together */}

        <div className="Hotel_container" id="header" style={{ background: colors.backgroundTheme }} >

          <div className='menu_container'>
            <Button onClick={showDrawer} style={{ backgroundColor: colors.bannerColor, width: "99%", color: colors.subheadingBackgroundColor }}>
              Menu
            </Button>
            <Drawer 
            // Commented by Rohankansari - 29/4/23
            // Reason - requirment is to remove name
            // title="Menu" 
            // Modified By RohanKansari-4/5/23 
            // Reason - To animate drawer from top
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
                      // backgroundColor: colors.headingBackgroundColor,
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

          {/* <Draggable cancel=".click">
            {searchVisible ?
              <div className="searchContainer " >
                <input className="searchInput click" type="text"/>
                <div className="click search__cross" >
                  <AiOutlineClose color="white" size={30} style={{ margin: "10px " }} onClick={e => { console.log("search hit"); setSearchVisiblity(false) }} />
                </div>
              </div>
              :
              <div className="searchContainer" onClick={e => { console.log("search hit"); setSearchVisiblity(true) }}>
                <div className="search__toggler" />
              </div>
            }
          </Draggable> */}


          <h2 style={{ color: colors.headingColor }}
            // className="restaurant_name"
            className={restaurant_name.length > 14 ? 'hotel_name' : 'restaurant_fontsize'}>
            {restaurant_name.toUpperCase()}
          </h2>


          {subscribePlan?.includes("order") ?
            <div className="icon_container">
              <Link to="/cart">
                <span className="selected_amount">{cart.length}</span>
                <MdRoomService style={{ fontSize: "30px", color: colors.bannerColor }} />
              </Link>
            </div> : null}
        </div>
        {/* end of heading - Rohan kansari - 27/4/23 */}

        {/*End of code - Rohan Kansari - 27/4/23  */}
        {/* Removing header from here and adding it to app.js file for globallization */}

        {/* Added by :- Parineeta Gedam 21-04-2023
        Reason :- remove global color from here and adding it to app.js file for globalization
     */}
        {/* <div><GlobalColor /></div> */}
        {/* End of added code 21-04-2023 */}

        {/* {isLoader == true ? <Loader /> : */}
        
        

        {offerBanner.length > 0 ?
          <div >
            <Swiper
              style={{
                "--swiper-pagination-color": colors.subHeadingColor,
                "--swiper-pagination-bullet-inactive-color": colors.subHeadingColor,
                "--swiper-pagination-bullet-inactive-opacity": "0.6 ",
                "--swiper-pagination-bullet-size": "8px",
                "--swiper-pagination-bullet-horizontal-gap": "5px",
                "--swiper-button-prev-color": "aqua !important"
              }}
              // cssMode={true}
              navigation={true}
              pagination={{
                clickable: true,
              }}

              // autoplay={{
              //   delay: 2500,
              //   disableOnInteraction: false,
              // }}
              // mousewheel={true}
              keyboard={true}
              modules={[Navigation, Pagination, Autoplay]}
              // , Mousewheel, Keyboard]}
              className="mySwiper"

              // Added by Rohan Kansari- 8/5/23
              // Reason - To handle video in banner

              // Added by Om Shrivastava on 15-05-23
              // Reason : When user change the slide than video is stop automatically
              onSlideChange={e => { var key= Object.keys(playVideo); setVideo({[key[0]]:false})}}
              // End of addition by Om Shrivastava on 15-05-23
              
              onNavigationPrev={e => {var key= Object.keys(playVideo); setVideo({[key[0]]:false}) }}
              onNavigationNext={e => { var key= Object.keys(playVideo); setVideo({[key[0]]:false})}}
              // End of code - Rohan kansari- 8/5/23

            >

              {offerBanner.map((item, id) => (
                <SwiperSlide>
                  <div
                    className='offer_div'
                    onClick={
                      // Added by ROhankansari -28/4/23
                      // Reason - To not show offer page while video playing
                      e => {if(!item.show_video_Hide_Image) onOfferShow(item.offer_name)}
                      // End of code - 28/4/23 Rohan kansari
                    }
                  >

                    {/*                      
                    <img
                      src={siteConfig.siteURL + item.offer_image}
                      className='offer_banner'
                    />
                    <h2
                      className='offer_content'
                      style={{ color: colors.bannerColor }}
                    >
                      {item.offer_name}
                    </h2> */}

                    {/* Modified by rohan kansari - 23/4/23
                        Reason - To Show video if video section is selected from backend */}

                    {
                      !item.show_video_Hide_Image ?
                        <>
                          <img
                            // Modified and addition by Om shirvastava on 04-09-23
                            // Reason : When offer image is not there then show the welcome bydefault image
                            // src={siteConfig.siteURL + item.offer_image}
                            src={item.offer_image?  siteConfig.siteURL + item.offer_image:welcome_banner}
                            // End of modification and addition by Om shirvastava on 04-09-23
                            // Reason : When offer image is not there then show the welcome bydefault image

                            className='offer_banner'
                          />
                          <h2
                            className='offer_content'
                            style={{ color: colors.bannerColor }}
                          >
                            {item.offer_name}
                          </h2>
                        </> :
                        // <video width="100%"  id="player1" preload="none" >
                        //   <source type="video/youtube" src="http://www.youtube.com/watch?v=nOEw9iiopwI" />
                        // </video>
                        <div className="container">
                          {/* Added by Rohan kansari - 28/4/23
                              Reason - To add on full screen column upon video */}
                          {/* <BsBoxArrowUpLeft style={{position:"absolute",zIndex:"9999",color:"white",right:"20px",bottom:"25%",fontSize:"25px"}} onClick={e=>{
                            var iframe= document.getElementById("iframe")
                            if (iframe.requestFullscreen) {
                              iframe.requestFullscreen();
                            } else if (iframe.webkitRequestFullscreen) {
                              iframe.webkitRequestFullscreen();
                            } else if (iframe.mozRequestFullScreen) {
                              iframe.mozRequestFullScreen();
                            } else if (iframe.msRequestFullscreen) {
                              iframe.msRequestFullscreen();
                            
                            }

                          }}/> */}
                          {/* End of code - ROhan kansari - 28/4/23 */}
                          {/* // Added by Rohan Kansari- 8/5/23
                            // Reason - To handle video in banner */}
                            {/* Modified by - Rohan kansari - 10/5/23
                                Reason - to show play pause button  */}
                          <div className="iframeContainer" onClick={e => { setVideoPlayingToggle(id)}}>{!playVideo[`video${id}`]?<><div className="centerBtn"/> <IoLogoYoutube className="pauseBtn"/></>:null}</div>
                          <ReactPlayer ref={vidRef}  className="react-player" height="24vh" width="80vw" url={`${item.video_link}?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`} playing={playVideo[`video${id}`]} /> 
                          {/* End of code - Rohan kansari - 8/5/23 */}
                          {/* <iframe  src="https://www.youtube.com/embed/j55IlDRHQ8w?mute=1&autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>                          </div> */}
                        </div>
                    }

                    {/* End of code - 23/4/23 - Rohan kansari */}

                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          :
          <div style={{ height: '15vh', }}>
            {/* <h3 color="red">yupp</h3> */}
            {/* modified by :- Parineeta Gedam on 19-04-2023 */}
            <img style={{ width: '100%', height: '15vh', border: '1px solid black' }}
              // src={nodataOffer}
              // src={offer_comming_soon_img}
              src={welcome_banner}
              alt="bydefault_img" />
            {/* End of modified code on 19-04-2023 */}
          </div>
        }

        {/* Commented by Rohan kansari - 27/4/23
    Reason- To shift this feature in top header  */}

      {/* Id commented by Om Shrivastava on 17-05-23 because it's not use  */}
        <div
        //  id="hide_search"
          className={offerShow.length > 0 ? 'searchpage_notshow' : 'searchpage_main'}
          style={{ background: "transparent"}}
        >

        {/* Added by :- Parineeta Gedam on 01-06-2023
              reason :- add reservations button
          */}
          {searchVisible == false &&
            <button className="reservation_btn" style={{ background: colors.bannerColor, color: colors.backgroundTheme }} onClick={showModall}>
              Reservation
            </button>
          }
          {isModalOpenn &&
            <ReservationForm isModalOpenn={isModalOpenn} handleCancell={handleCancell} />}
          {/* End of added code by :- Parineeta Gedam on 01-06-2023 */}

          {/* Added by Om Shrivastava on 14-06-23
                Reason : Show the rating and review for the all over user */}
          {searchVisible == false &&
            // Modification and addition by Om Shrivastava on 27-06-23
            // Reason : Need to change the color of rate us button
            <button className="rate_us_btn" style={{ background: colors.bannerColor, color: colors.backgroundTheme }} onClick={showRatingModal}>
            {/* End of commented code by Om Shrivastava on 27-06-23 */}
              Rate Us
            </button>
          }

          {/* <FontAwesomeIcon icon={faStar}  onClick={showRatingModal}/> */}
          {/* End of addition by Om Shrivastava on 14-06-23 */}
        {/* Added by :- Parineeta Gedam
              Date :- 03-04-2023
              Reason :- for drawer
          */}
        {/* <div className='menu_container'>
            <Button onClick={showDrawer} style={{ backgroundColor: colors.bannerColor, width: "99%", color: colors.subheadingBackgroundColor }}>
              Menu
            </Button>
            <Drawer title="Menu" placement="bottom" onClose={onClose} open={open} headerStyle={{ background: colors.bannerColor }} bodyStyle={{ marginBottom: "50px" }} >
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
                      // backgroundColor: colors.headingBackgroundColor,
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
          </div> */}

        {/* End of added code 03-0-2023 */}

        {/* Id and style use by Om Shrivastava on 17-05-23 */}
        <div 
        // Modification and addition by Om Shrivastava on 18-05-23
        // Reason : When whatsapp detail is not show than use another class name
        // className='searchpage_input'
         id="hide_search" style={{display:'block'}}
        className={whatsApp && whatsApp.whatsapp_number && whatsApp.whatsapp_number !=undefined && whatsApp.whatsapp_number !=null && whatsApp.whatsapp_number.length ? 'searchpage_input' : 'whatsappDataNoneSearchMainDiv'}
        // End of addition by Om Shrivastava on 18-05-23
        >
        {/* <Input.Group >
              <Search size='large' 
                // value={search}
                onChange={e => { setNewSearch(e.target.value.trimStart());} }
                placeholder='Search by Menu, Categories & Items name' />
            </Input.Group> */}
        {/* Added by rohan-16/4/23
                Reason- designing new search ui */}
        <GoSearch className="searchIcon" style={{ backgroundColor: colors.bannerColor, color: colors.backgroundTheme }} onClick={e => setSearchVisiblity(!searchVisible)} />
            {searchVisible ?
              <>
                <input 
                className="inputBoxSearch" 
                type="text" id="search_box"
                // Modified by Rohan kansari-7/5/23 - To remove . on double space on mobile
                onChange={e=>setNewSearch(e.target.value.trimStart().replace(". "," ").replace("  ",""))}
                placeholder='Type here to search' value ={search}/>
                <AiOutlineClose className="closeIcon" onClick={e => setSearchVisiblity(!searchVisible)} />
              </>
              : null}
        {/*End of Code */}   
        </div>

        {/* Added by- Suman sahu On 05/05/2023 
            reason - add whatsapp chatbot*/}
        {/* Added by Om Shrivastava on 18-05-23
        Resason : When whatsapp number is not shown there than this div is not show   */}
        {whatsApp && whatsApp.whatsapp_number && whatsApp.whatsapp_number !=undefined && whatsApp.whatsapp_number !=null && whatsApp.whatsapp_number.length > 0 ?
      //  Added by Rohan kansari - 30/6/23
      // Reason - To set whatsapp icon in the end
       <div style={{display:"flex",marginLeft:"auto"}}>
          <FloatingWhatsApp
          // commented and modified by - Suman sahu on 16/06/2023
          // reason - fix padding issue (Because of addition of reservation button, whatsapp icon is pushed to right corner and haft image is cut.)
          
          // style={{right: -3}}
          style={{right: 5,display:"flex",marginLeft:"auto"}}
          // end of modification by - Suman sahu on 16/06/2023
          
          // Added by Om Shrivastava on 19-05-23
          chatboxStyle={{bottom:'180px'}}
          // End of additon by Om Shrivastava on 19-05-23
          buttonStyle={{width: 25, height: 25, position: "initial"}}
          phoneNumber={whatsApp.whatsapp_number}
          // Modification and added by Om Shrivastava on 19-05-23
          // accountName={restaurant_name}
          accountName={restaurant_name.toUpperCase()}
          // End of modification and additon by Om Shrivastava on 19-05-23
          // Modification and addition by Om Shrivastava on 04-08-23
          // Reason : Set the data set for avatar
          // avatar={siteConfig.siteURL + tenantDetails.restaurant_logo}
          avatar={tenantDetails.restaurant_logo && siteConfig.siteURL + tenantDetails.restaurant_logo}
          // Modification and addition by Om Shrivastava on 04-08-23
          // Reason : Set the data set for avatar
          />
        </div>
        :null}
        {/* End of addiition by Om Shrivastava on 18-05-23 */}

        {/* End of addition 05/05/2023 */}

        {/* Added by Rohan- 9/4/23  Reason- cart page */}
        {/*added by rohan -18/4/23- to add functionality of subscription */}
        {/* {subscribePlan?.includes("order") ?
            <div className="icon_container">
              <Link to="/cart">
                <span className="selected_amount">{cart.length}</span>
                <MdRoomService style={{ fontSize: "30px", color: colors.bannerColor }} />
              </Link>
            </div> : null} */}
        {/* end of code  */}
        </div>

        {/* End of commenting - 27/4/23 - Rohan Kansari */}

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
          //  className='searchpage_content' 
          className={filter.length > 0 ? 'searchpage_content' : 'again'}
          id="third" >
          {search ?
            <>
              {filter.length > 0 ?
                <span style={{ display: 'flex', padding: '1%', fontSize: '16px' }}>
                  <span style={{ color: '#ffff9f', padding: '0', width: '89%', fontSize: '15px' }}>
                  </span>
                  {/* <CloseOutlined id="toggle" style={{ color: 'black', backgroundColor: 'white', padding: '2%', borderRadius: '100%' }}
                      onClick=
                      {removeSerchResult}
                    /> */}
                  {/* <img onClick={removeSerchResult} src={crossKnifeImg} style={{ height: '3.5vh', borderRadius: '100%' }} alt="jhk" /> */}

                </span>
                :
                <span style={{ display: 'flex', padding: '2%', fontSize: '16px' }}>
                  <span style={{ color: '#ffff9f', padding: '0', width: '90%' }}>Result not found</span>
                  {/* <CloseOutlined id="toggle" style={{ color: 'black', backgroundColor: 'white', padding: '1%', }}
                      onClick=
                      {removeSerchResult}
                    /> */}
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
                          {/* <img style={{ border: '1px solid black' }}
                          src={siteConfig.siteURL + filter[i][obj][c][0].category_img}
                          className="category_serached_img" width='2%'
                        />&nbsp; */}
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
                          {/* added by rohan- 6/4/23 reason- to add functionality of half price shown */}
                          {colors.allow_half_price ? <div className="allitems_heading_price" style={{ color: colors.bannerColor }}>Half price</div> : null}
                        </div>
                        {filter[i][`${obj}`][c].map(person => {

                          // Added by rohan- on 5/4/23
                          // Reason - To get dicounted amount to push in detail popup model
                          var fullprice = person.price_full;
                          var halfprice = person.price_half;
                          if (offerList.filter((data) => parseInt(data.id) === person.id).length > 0) {
                            fullprice = searchSectionFullPrice(person);
                            halfprice = searchSectionHalfPrice(person);
                          }
                          // end of code - Rohan 

                          // Added by ROhan kansari - 28/4/23
                          // Reason- To style card
                          return <div className="cardItem"  style={{background:colors.card_color,padding:"6px 0"}}>
                            {/* end of code - ROhan kansari - 28/4/23 */}
                            <div className="showimg_div" >
                               {/* added by rohan- 8/5/23 - for best seller shown */}
                            {bestProducts?.filter(b => b.item == person.id).length > 0 ? <div className="ribbon">Best Seller</div> : <div className="null_ribbon"></div>}
                            {/* end of addition rohan- 8/5/23 */}
                              <img src={siteConfig.siteURL + person.icon}
                                className="menu_img"
                              />
                              
                            </div>
                            {/* added by rohan- 13/4/23 - for best seller shown */}
                            {/* {bestProducts?.filter(b => b.item == person.id).length > 0 ? <div className="ribbon">Best Seller</div> : <div className="null_ribbon"></div>} */}
                            {/* end of addition - 13/4/23 */}

                            {/* <div className="price_item_description_div"> */}
                            {/* <div className="price_description_container" > */}
                            {/* <h4 style={{ color: colors.subHeadingColor }}
                                    className="allitems_name"
                                  >{person.name}</h4> */}

                            {/* Modification and addition by Om Shrivastava on 24-05-23
                            Reason : When offer is null than Show price can not be strike through */}
                            {/* {(offerList.filter((data) => parseInt(data.item_id) === person.id)).length > 0  */}
                              {(offerList.filter((data) => parseInt(data.item_id) === person.id 
                                && data.item_discount != undefined && data.item_discount !=null )).length > 0 ?
                            // End of addition and modifiacation by Om Shrivastava on 24-05-23
                              <>

                                <div className="price_item_description_div">
                                  <div className="price_description_container" >
                                    <h4 style={{ color: colors.subHeadingColor }}
                                      className="allitems_name"
                                    >{person.name}</h4>
                                    <h4 style={{ color: colors.subHeadingColor }}
                                      className="allitems_price"
                                    >
                                      {/* Modified and commented by Om Shrivastava on 08-05-23
                                      Reason : Create the rupee sign globally for using the config file. */}
                                      {/* {person.price_full ? <strike> ₹ {person.price_full}</strike> : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>} */}
                                      {/* Modified by Rohan kansari - 12/5/23 - To check if zero is there then show dash not stike over through */}
                                      {/* {person.price_full ? <strike>{rupee_sign}  {person.price_full}</strike> : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>} */}
                                      {person.price_full>0 ? <strike>{rupee_sign}  {person.price_full}</strike> : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}
                                      {/* End of addition by Om Shrivastava on 08-05-23 */}
                                    </h4>
                                    {/* added by rohan- 6/4/23 reason- to add functionality of half price shown */}

                                    {colors.allow_half_price ? <h4 style={{ color: colors.subHeadingColor }}
                                      className="allitems_price"
                                    >
                                      {/* Modified and commented by Om Shrivastava on 08-05-23
                                      Reason : Create the rupee sign globally for using the config file. */}
                                      {/* {person.price_half ? <strike> ₹ {person.price_half}</strike> : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>} */}
                                      {/* Modified by Rohan kansari - 12/5/23 - To check if zero is there then show dash not stike over through */}
                                      {/* {person.price_half ? <strike>{rupee_sign}  {person.price_half}</strike> : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>} */}
                                      {person.price_half>0 ? <strike>{rupee_sign}  {person.price_half}</strike> : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}
                                      {/* End of addition by Om Shrivastava on 08-05-23 */}
                                    
                                    </h4> : null}
                                  </div>

                                  <div className="price_description_container" >
                                    <h4 style={{ color: 'red', padding: '0', }}
                                      className="allitems_name">Offered price</h4>
                                    <h4 style={{ color: colors.subHeadingColor, padding: '0', margin: '0' }}
                                      className="allitems_price"
                                    >
                                      {/* Modified and commented by Om Shrivastava on 08-05-23
                                      Reason : Create the rupee sign globally for using the config file. */}
                                      {/* {searchSectionFullPrice(person) > 0 ? <>₹ {searchSectionFullPrice(person)}</> : <>&nbsp;&nbsp;&nbsp;&nbsp;---</>} */}
                                      {searchSectionFullPrice(person) > 0 ? <>{rupee_sign} {searchSectionFullPrice(person)}</> : <>&nbsp;&nbsp;&nbsp;&nbsp;---</>}
                                      {/* End of addition by Om Shrivastava on 08-05-23 */}
                                    
                                    </h4>
                                    {/* added by rohan- 6/4/23 reason- to add functionality of half price shown */}

                                    {colors.allow_half_price ?
                                      <h4 style={{ color: colors.subHeadingColor, padding: '0', margin: '0' }}
                                        className="allitems_price"
                                      >
                                        {/* Modified and commented by Om Shrivastava on 08-05-23
                                      Reason : Create the rupee sign globally for using the config file. */}
                                        {/* {searchSectionHalfPrice(person) > 0 ? <> ₹ {searchSectionHalfPrice(person)}</> : <>&nbsp;&nbsp;&nbsp;&nbsp;---</>} */}
                                        {searchSectionHalfPrice(person) > 0 ? <> {rupee_sign} {searchSectionHalfPrice(person)}</> : <>&nbsp;&nbsp;&nbsp;&nbsp;---</>}
                                      {/* End of addition by Om Shrivastava on 08-05-23 */}
                                      
                                      </h4> : null}
                                  </div>

                                  <div className="description_div" style={{ display: 'flex', paddingTop: '2%' }}
                                  //  style={{ margin: '3% 0 0 3%' }}
                                  >
                                    {/* Commented by :- Parineeta Gedam
                                        Date :- 10-04-2023
                                        Reason :- show veg, non-veg, others icons.
                                    */}
                                    {/* {person.item_type == 'Veg' ? <>
                                      <img src={vegIcon} style={{ width: '5%', height: '2%' }} alt="kk" className=""></img>

                                    </> :
                                      <img src={nonVegIcon} style={{ width: '5%', height: '2%' }} alt="kk" ></img>
                                    } */}
                                    {/* End of commented code 10-04-2023 */}

                                    {/* Added by :- Parineeta Gedam
                                        Date :- 10-04-2023
                                        Reason :- show veg, non-veg, others.
                                    */}
                                    {person.item_type == 'Veg' ? (
                                      <>
                                        <img src={vegIcon} style={{ width: '15px', height: '15px', marginTop: '2px' }} alt="kk" className=""></img>
                                      </>
                                    ) : null}
                                    {person.item_type == 'Nonveg' ? (
                                      <>
                                        <img src={nonVegIcon} style={{ width: '15px', height: '15px', marginTop: '2px' }} alt="kk" className=""></img>
                                      </>
                                    ) : null}
                                    {person.item_type == 'Other' ? (
                                      <>
                                        {/* <img src={nonVegIcon} style={{ width: '5%', height: '2%' }} alt="kk" className=""></img> */}
                                      </>
                                    ) : null}
                                    {/* End of added code 10-04-2023 */}

                                    <div onClick={e => toggleDescription(e.currentTarget.style)} className="description_content" style={{ alignItems: 'center', color: colors.subHeadingColor, padding: "0 5px" }}>

                                      {subscribePlan?.includes("order") ? <button className="add_product" style={{
                                        color: colors.bannerColor,
                                        backgroundColor: "transparent",
                                        border: `1px solid ${colors.bannerColor}`,
                                        borderRadius: '6px',
                                      }} onClick={e => { callPopupModel(person, fullprice, halfprice) }}>
                                        <AiOutlinePlus className="plus_icon"
                                          style={{
                                            color: colors.bannerColor
                                          }} />Add</button> : null}
                                      {/* Added by Om Shrivastava on 17-05-23
                                      Reason : Add show more show less functionality in search section */}
                                      {/* {person.description} */}
                                      <ReactReadMoreReadLess
                                        charLimit={55}
                                        readMoreText={"more"}
                                        readLessText={"less"}
                                      >
                                        {person.description && person.description.length > 0 ? person.description : "  "}
                                      </ReactReadMoreReadLess>
                                      {/* End of addition by Om Shrivastava on 17-05-23 */}
                                    </div>
                                  </div>

                                  {/* added by rohan -9/4/23
                                      reason- add button to add item to list */}
                                  {/* <div>
                                    <button className="add_product" style={{
                                      color: colors.headingColor,
                                      backgroundColor: colors.headingBackgroundColor,
                                      borderRadius: '6px',
                                    }} onClick={e => { callPopupModel(person, fullprice, halfprice) }}> <GrFormAdd
                                      />Add</button>
                                  </div> */}
                                  {/* end of 9/4/23 */}
                                </div>

                                {/* <span>

                                    ₹{searchSectionFullPrice(person)}

                                  </span>
                                  <span>

                                    ₹{searchSectionHalfPrice(person)}

                                  </span> */}
                              </>
                              :
                              <>
                                <div className="price_item_description_div">
                                  <div className="price_description_container" >
                                    <h4 style={{ color: colors.subHeadingColor }}
                                      className="allitems_name"
                                    >{person.name}</h4>
                                    <h4 style={{ color: colors.subHeadingColor }}
                                      className="allitems_price"
                                      // Modified and commented by Om Shrivastava on 08-05-23
                                      // Reason : Create the rupee sign globally for using the config file.
                                    // >{person.price_full ? '₹' + person.price_full : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}</h4>
                                    // Modification and addition by Om Shrivastava on 12-05-23
                                    // Reason : Show the 'object object' than I need to remove this bug
                                    // >{person.price_full ? {rupee_sign} + person.price_full : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}</h4>
                                    >{person.price_full ? rupee_sign + person.price_full : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}</h4>
                                      {/* End of modifiacation and addition by Om Shrivastava on 12-05-23 */}
                                      {/* End of addition by Om Shrivastava on 08-05-23 */}
                                   
                                    {/* added by rohan- 6/4/23 reason- to add functionality of half price shown */}

                                    {colors.allow_half_price ?
                                      <h4 style={{ color: colors.subHeadingColor }}
                                        className="allitems_price"
                                        // Modified and commented by Om Shrivastava on 08-05-23
                                        // Reason : Create the rupee sign globally for using the config file.
                                      // >{person.price_half ? '₹' + person.price_half : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}</h4> : null}
                                      // >{person.price_half ? {rupee_sign} + person.price_half : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}</h4> : null}
                                      // Modification and addition by Om Shrivastava on 12-05-23
                                      // Reason : Show the 'object object' than I need to remove this bug
                                      >{person.price_half ? rupee_sign + person.price_half : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}</h4> : null}
                                      {/* End of modifiacation and addition by Om Shrivastava on 12-05-23 */}
                                      {/* End of addition by Om Shrivastava on 08-05-23 */}
                                  
                                  </div>
                                  <div className="description_div" style={{ display: 'flex' }}>

                                    {/* {person.item_type == 'Veg' ? <>
                                      <img src={vegIcon} style={{ width: '5%', height: '2%' }} alt="kk"></img>

                                    </> :
                                      <img src={nonVegIcon} style={{ width: '5%', height: '2%' }} alt="kk"></img>
                                    } */}

                                    {/* Commented by :- Parineeta Gedam
                                        Date :- 10-04-2023
                                        Reason :- show veg, non-veg, others.
                                    */}
                                    {/* {person.item_type == 'Veg' ? <>
                                      <img src={vegIcon} style={{ width: '5%', height: '2%' }} alt="kk" className=""></img>

                                    </> :
                                      <img src={nonVegIcon} style={{ width: '5%', height: '2%' }} alt="kk" ></img>
                                    } */}
                                    {/* End of commented code 10-04-2023 */}

                                    {/* Added by :- Parineeta Gedam
                                        Date :- 10-04-2023
                                        Reason :- show veg, non-veg, others.
                                    */}
                                    {person.item_type == 'Veg' ? (
                                      <>
                                        <img src={vegIcon} style={{ width: '15px', height: '15px', marginTop: '2px' }} alt="kk" className=""></img>
                                      </>
                                    ) : null}
                                    {person.item_type == 'Nonveg' ? (
                                      <>
                                        <img src={nonVegIcon} style={{ width: '15px', height: '15px', marginTop: '2px' }} alt="kk" className=""></img>
                                      </>
                                    ) : null}
                                    {person.item_type == 'Other' ? (
                                      <>
                                        {/* <img src={nonVegIcon} style={{ width: '5%', height: '2%' }} alt="kk" className=""></img> */}
                                      </>
                                    ) : null}
                                    {/* &nbsp; <span className="description_content" style={{ alignItems: 'center', color: colors.subHeadingColor }}>{person.description}</span> */}

                                    {/* Modified by rohan- 16/4/23
                                        Reason - Removing old description design and adding button and description together */}
                                    &nbsp; <span className="description_content" onClick={e => toggleDescription(e.currentTarget.style)} style={{ alignItems: 'center', color: colors.subHeadingColor }}>
                                      {/*added by rohan -18/4/23- to add functionality of subscription */}

                                      {subscribePlan?.includes("order") ? <button className="add_product" style={{
                                        color: colors.bannerColor,
                                        backgroundColor: "transparent",
                                        border: `1px solid ${colors.bannerColor}`,
                                        borderRadius: '6px',
                                      }} onClick={e => { callPopupModel(person, fullprice, halfprice) }}>
                                        <AiOutlinePlus className="plus_icon"
                                          style={{
                                            color: colors.bannerColor
                                          }} />Add</button> : null}
                                      <ReactReadMoreReadLess
                                        charLimit={55}
                                        readMoreText={"more"}
                                        readLessText={"less"}
                                      >
                                        {person.description && person.description.length > 0 ? person.description : "  "}
                                      </ReactReadMoreReadLess>
                                    </span>
                                    {/* End of code - 16/4/23*/}
                                  </div>
                                  {/* added by rohan -9/4/23
                                      reason- add button to add item to list */}
                                  {/* <div className="add_buttonContainer">
                                    <button className="add_product" style={{
                                      color: colors.headingColor,
                                      backgroundColor: colors.headingBackgroundColor,
                                      borderRadius: '6px',
                                    }} onClick={e => { callPopupModel(person, fullprice, halfprice) }}> <GrFormAdd
                                      />Add</button>
                                  </div> */}
                                  {/* end of 9/4/23 */}

                                </div>

                              </>
                            }


                            {/* </div> */}

                            {/* <div className="description_div" >
                                  <h3 className="description_content" style={{ color: colors.bannerColor }}>{person.description}</h3>
                                </div> */}
                            {/* <br />
                                <br /> */}
                            {/* </div> */}
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
          // className='offer_maindiv'
          className={offerShow.length < 1 ? 'offer_notshow' : 'offer_maindiv'}
        >
          {/* Modified by ROhankansari - 4/5/23
              Reason - To solve overlap issue with search icon */}
              {/* Css changes by Om Shrivastava on 17-05-23 */}
          <span style={{ display: 'flex', padding: '1%', fontSize: '16px',position:"relative"
          // ,top:"30px"
           }}>
            <span style={{ color: '#ffff9f', padding: '0', width: '95%' }}>
              {/* Result not found */}
            </span>
            {/* <CloseOutlined id="toggle" style={{ color: 'black', backgroundColor: 'white', padding: '1%', }}
                      onClick=
                      {removeSerchResult}
                    /> */}
                    {/* Image commened by Om on 17-05-23 because its not show inside div */}
            {/* <img onClick={divOfferRemove} src={crossKnifeImg} style={{ height: '3.5vh', borderRadius: '100%' }} alt="jhk" /> */}

          </span>
          {/* Styling added by Om on 17-05-23 */}
          <span className="allcategory_container" style={{ display:'flex',justifyContent:'space-between'}}>
            <span style={{
              color: colors.headingColor, backgroundColor: colors.subheadingBackgroundColor,
              borderRadius: '6px',
              padding: '1px 8px',

            }} className="category_name"> {offer_name} {offer_discount}%</span>
            {/* <span style={{ color: colors.headingColor, backgroundColor: colors.subheadingBackgroundColor,
                              borderRadius: '6px',
                              padding: '1px 8px', }} className="category_name"
            >{offer_discount}%
            </span> */}
            {/* Image added by Om on 17-05-23 */}
            <img onClick={divOfferRemove} src={crossKnifeImg} style={{ height: '3.5vh', borderRadius: '100%',marginRight:"2%" }} alt="jhk" />

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
            {/* added by rohan- 6/4/23 reason- to add functionality of half price shown */}
            {colors.allow_half_price ? <div className="allitems_heading_price" style={{ color: colors.bannerColor }}>Half price</div> : null}
          </div>
          {offerShow.length > 0 ?
            <>
              {offerShow.map((showdata, id) => (
                // Added by ROhan kansari - 28/4/23
                // Reason- To style card
                <div className="cardItem" style={{background:colors.card_color,padding:"6px 0"}} >
                  {/* end of code - ROhan kansari - 28/4/23 */}
                  <div className="showimg_div" >
                    {/* added by rohan- 8/5/23 - for best seller shown */}
                  {/* Modified by Rohan Kansari - 13/5/23 to solve offer page best seller */}
                  {bestProducts?.filter(b => b.item == showdata.item_id).length > 0 ? <div className="ribbon">Best Seller</div> : <div className="null_ribbon"></div>}
                  {/* end of addition rohan- 8/5/23 */}
                    <img src={siteConfig.siteURL + showdata.item_image}
                      className="menu_img"
                    />
                  </div>
                  {/* added by rohan- 13/4/23 - for best seller shown */}

                  {/* {bestProducts?.filter(b => b.item == showdata.id).length > 0 ? <div className="ribbon">Best Seller</div> : <div className="null_ribbon"></div>} */}
                  {/* end of addition - 13/4/23 */}
                  <div className="price_item_description_div">
                    <div className="price_description_container" >
                      <h4 style={{ color: colors.subHeadingColor }}
                        className="allitems_name"
                      >{showdata.item_name}</h4>
                      <h4 style={{ color: colors.subHeadingColor }}
                        className="allitems_price"
                      >
                        {/* // Modified and commented by Om Shrivastava on 08-05-23
                        // Reason : Create the rupee sign globally for using the config file. */}
                        {/* {showdata.item_fullprice ? <strike> ₹ {showdata.item_fullprice}</strike> : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>} */}
                        {/* Modified by Rohan kansari - 12/5/23 - To check if zero is there then show dash not stike over through */}
                        {/* {showdata.item_fullprice ? <strike>{rupee_sign} {showdata.item_fullprice}</strike> : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>} */}
                        {showdata.item_fullprice>0 ? <strike>{rupee_sign} {showdata.item_fullprice}</strike> : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}
                        {/* End of addition by Om Shrivastava on 08-05-23 */}
                      
                      </h4>
                      {/* added by rohan- 6/4/23 reason- to add functionality of half price shown */}

                      {colors.allow_half_price ? <h4 style={{ color: colors.subHeadingColor }}
                        className="allitems_price"
                      >
                        {/* // Modified and commented by Om Shrivastava on 08-05-23
                         // Reason : Create the rupee sign globally for using the config file. */}
                        {/* {showdata.item_halfprice ? <strike> ₹ {showdata.item_halfprice}</strike> : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>} */}
                        {/* Modified by Rohan kansari - 12/5/23 - To check if zero is there then show dash not stike over through */}
                        {/* {showdata.item_halfprice ? <strike>{rupee_sign} {showdata.item_halfprice}</strike> : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>} */}
                        {showdata.item_halfprice>0 ? <strike>{rupee_sign} {showdata.item_halfprice}</strike> : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}
                        {/* End of addition by Om Shrivastava on 08-05-23 */}
                      
                      </h4> : null}
                    </div>

                    <div className="price_description_container" >
                      <h4 style={{ color: 'red', }}
                        className="allitems_name">Offered price</h4>
                      <h4 style={{ color: colors.subHeadingColor, padding: '0', margin: '0' }}
                        className="allitems_price"
                      >
                        {/* // Modified and commented by Om Shrivastava on 08-05-23
                        // Reason : Create the rupee sign globally for using the config file. */}
                        {/* {totalFullPrice(showdata) > 0 ? <>₹ {totalFullPrice(showdata)}</> : <>&nbsp;&nbsp;&nbsp;&nbsp;---</>} */}
                        {totalFullPrice(showdata) > 0 ? <>{rupee_sign}{totalFullPrice(showdata)}</> : <>&nbsp;&nbsp;&nbsp;&nbsp;---</>}
                        {/* End of addition by Om Shrivastava on 08-05-23 */}
                      
                      </h4>
                      {/* added by rohan- 6/4/23 reason- to add functionality of half price shown */}

                      {colors.allow_half_price ? <h4 style={{ color: colors.subHeadingColor, padding: '0', margin: '0' }}
                        className="allitems_price"
                      >
                        {/* // Modified and commented by Om Shrivastava on 08-05-23
                        // Reason : Create the rupee sign globally for using the config file. */}
                        {/* {totalHalfPrice(showdata) > 0 ? <> ₹ {totalHalfPrice(showdata)}</> : <>&nbsp;&nbsp;&nbsp;&nbsp;---</>} */}
                        {totalHalfPrice(showdata) > 0 ? <> {rupee_sign} {totalHalfPrice(showdata)}</> : <>&nbsp;&nbsp;&nbsp;&nbsp;---</>}
                        {/* End of addition by Om Shrivastava on 08-05-23 */}
                      
                      </h4> : null}
                    </div>

                    <div className="description_div" style={{ display: 'flex', paddingTop: '2%' }}
                    //  style={{ margin: '3% 0 0 3%' }}
                    >
                      {/* <h3 className="description_content" style={{ color: colors.bannerColor,padding:'4px 0 0 0' }}>{showdata.item_description}</h3> */}

                      {/* Commented by :- Parineeta Gedam
                                        Date :- 10-04-2023
                                        Reason :- show veg, non-veg, others icons.
                                    */}
                      {/* {showdata.item_type == 'Veg' ? <>
                        <img src={vegIcon} style={{ width: '5%', height: '2%' }} alt="kk"></img>

                      </> :
                        <img src={nonVegIcon} style={{ width: '5%', height: '2%' }} alt="kk"></img>
                      } */}
                      {/* End of commented code 10-04-2023 */}

                      {/* Added by :- Parineeta Gedam
                                        Date :- 10-04-2023
                                        Reason :- show veg, non-veg, others.
                                    */}
                      {showdata.item_type == 'Veg' ? (
                        <>
                          <img src={vegIcon} style={{ width: '15px', height: '15px', marginTop: '2px' }} alt="kk" className=""></img>
                        </>
                      ) : null}
                      {showdata.item_type == 'Nonveg' ? (
                        <>
                          <img src={nonVegIcon} style={{ width: '15px', height: '15px', marginTop: '2px' }} alt="kk" className=""></img>
                        </>
                      ) : null}
                      {showdata.item_type == 'Other' ? (
                        <>
                          {/* <img src={nonVegIcon} style={{ width: '5%', height: '2%' }} alt="kk" className=""></img> */}
                        </>
                      ) : null}
                      {/* &nbsp; <span className="description_content" style={{ alignItems: 'center', color: colors.subHeadingColor }}>{showdata.item_description}</span> */}

                      {/* Modified by rohan- 16/4/23
                            Reason - Removing old description design and adding button and description together */}
                      &nbsp; <span className="description_content" onClick={e => toggleDescription(e.currentTarget.style)} style={{ alignItems: 'center', color: colors.subHeadingColor }}>
                        {/*added by rohan -18/4/23- to add functionality of subscription */}

                        {subscribePlan?.includes("order") ? <button className="add_product" style={{
                          color: colors.bannerColor,
                          backgroundColor: "transparent",
                          border: `1px solid ${colors.bannerColor}`,
                          borderRadius: '6px',
                        }} onClick={e => { callPopupModel(showdata, totalFullPrice(showdata), totalHalfPrice(showdata)) }}>
                          <AiOutlinePlus className="plus_icon"
                            style={{
                              color: colors.bannerColor
                            }} />Add</button> : null}
                        <ReactReadMoreReadLess
                          charLimit={55}
                          readMoreText={"more"}
                          readLessText={"less"}
                        >
                          {showdata.item_description && showdata.item_description.length > 0 ? showdata.item_description : " "}
                        </ReactReadMoreReadLess>
                      </span>
                      {/* End of code - 16/4/23*/}
                    </div>
                    {/* added by rohan -9/4/23
                                      reason- add button to add item to list */}
                    {/* <div className="add_buttonContainer">
                      <button className="add_product" style={{
                        color: colors.headingColor,
                        backgroundColor: colors.headingBackgroundColor,
                        borderRadius: '6px',
                      }} onClick={e => { callPopupModel(showdata, totalFullPrice(showdata), totalHalfPrice(showdata)) }}> <GrFormAdd
                        />Add</button>
                    </div> */}
                    {/* end of 9/4/23 */}
                  </div>

                  {/* <div className="price_item_description_div">
                      <div className="price_description_container" >
                        <h4 style={{ color: colors.subHeadingColor }}
                          className="allitems_name"
                        >{showdata.item_name}</h4>
                        <h4 style={{ color: colors.subHeadingColor }}
                          className="allitems_price"
                        >
                          <strike>{showdata.item_fullprice
                            ? '₹' + showdata.item_fullprice
                            : '---'} </strike></h4>

                        <h4 style={{ color: colors.subHeadingColor }}
                          className="allitems_price"
                        >
                          <strike>{showdata.item_halfprice ? '₹' + showdata.item_halfprice : '---'}</strike></h4>

                      </div>

                      <div className="price_description_container" >
                        <h4 style={{ color: "red",  }}
                          className="allitems_name"
                        >
                          Offered price

                        </h4>
                        <h4 style={{ color: colors.subHeadingColor, margin: '0', }}
                          className="allitems_price"
                        >
                          ₹{totalFullPrice(showdata)}
                        </h4>

                        <h4 style={{ color: colors.subHeadingColor, margin: '0' }}
                          className="allitems_price"
                        >
                          ₹{totalHalfPrice(showdata)}
                        </h4>

                      </div>
                      <div className="description_div" >
                        <h3 className="description_content" style={{ color: colors.bannerColor }}>{showdata.item_description}</h3>
                      </div>
                      <br />
                      <br />
                    </div> */}

                </div>
              ))}
            </>
            : null
            // <h3 style={{height:'40vh',backgroundColor:'aqua',color:'black'}}> stBNope</h3>
          }
        </div>


        {/* Added by rohan on - 5/4/2023
            Reason- This will show one popup model to select option like full price and half price product. */}
            {/* Added on 4/5/23 - Rohankansari 
                Reason - To Show best seller product also */}
        <PopupDetail item={clickedDetail} bestSeller={bestProducts} setDetailPopupVisiblity={setDetailPopupVisiblity} isDetailPopupOpen={isDetailPopupOpen} />
        {/* end of code- Rohan */}
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
                    // {categoryList.map((data) => (
                    <div className="allcategory_menu_div">
                      <span className="allcategory_container"
                      >
                        {/* <img style={{ border: '1px solid black' }}
                      src={siteConfig.siteURL + data.icon}
                      className="category_img"
                    />&nbsp; */}
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
                        {/* added by rohan- 6/4/23 reason- to add functionality of half price shown */}

                        {colors.allow_half_price ? <div className="allitems_heading_price" style={{ color: colors.bannerColor }}>Half price</div> : null}
                      </div>



                      {itemList.length > 0 ? <>
                        {itemList.filter(i => i.category === data.id).map(m => {
                          // <div style={{ border: '2px solid red', height: '100%', display: 'flex' }}>
                          // Added by rohan- on 5/4/23
                          // Reason - To get dicounted amount to push in detail popup model
                          var fullprice = m.price_full;
                          var halfprice = m.price_half;
                          if ((offerList.filter((data) => parseInt(data.item_id) === m.id)).length > 0) {
                            fullprice = mainSectionFullPrice(m);
                            halfprice = mainSectionHalfPrice(m);
                          }
                          // end of code
                          // Added by ROhan kansari - 28/4/23
                          // Reason- To style card
                          return <div className="cardItem" style={{background:colors.card_color,padding:"6px 0"}}>
                            {/* end of code - ROhan kansari - 28/4/23 */}
                            <div className="showimg_div" >
                            {/* added by rohan- 8/5/23 - for best seller shown */}
                            {bestProducts?.filter(b => b.item == m.id).length > 0 ? <div className="ribbon">Best Seller</div> : <div className="null_ribbon"></div>}
                            {/* end of addition rohan- 8/5/23 */} 
                              <img src={siteConfig.siteURL + m.icon}
                                className="menu_img"
                              />


                            </div>
                          {/* added by rohan- 13/4/23 - for best seller shown */}
                            {/* {bestProducts?.filter(b => b.item == m.id).length > 0 ? <div className="ribbon">Best Seller</div> : <div className="null_ribbon"></div>} */}
                            {/* end of addition - 13/4/23 */} 

                            {/* Modification and addition by Om Shrivastava on 24-05-23
                            Reason : When offer is null than Show price can not be strike through */}
                            {/* {(offerList.filter((data) => parseInt(data.item_id) === m.id  */}
                            {(offerList.filter((data) => parseInt(data.item_id) === m.id 
                            && data.item_discount != undefined && data.item_discount !=null )).length > 0 ?
                            // End of addition and modifiacation by Om Shrivastava on 24-05-23
                              <>
                                <div className="price_item_description_div">
                                  <div className="price_description_container" >
                                    <h4 style={{ color: colors.subHeadingColor }}
                                      className="allitems_name"
                                    >{m.name}</h4>
                                    <h4 style={{ color: colors.subHeadingColor }}
                                      className="allitems_price"
                                    >
                                      {/* // Modified and commented by Om Shrivastava on 08-05-23
                                      // Reason : Create the rupee sign globally for using the config file. */}
                                      {/* {m.price_full ? <strike>₹ {m.price_full}</strike> : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>} */}
                                      {/* Modified by Rohan kansari - 12/5/23 - To check if zero is there then show dash not stike over through */}
                                      {/* {m.price_full ? <strike>{rupee_sign} {m.price_full}</strike> : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>} */}
                                      {m.price_full>0 ? <strike>{rupee_sign} {m.price_full}</strike> : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}
                                      {/* End of addition by Om Shrivastava on 08-05-23 */}
                                    
                                    </h4>
                                    {/* added by rohan- 6/4/23 reason- to add functionality of half price shown */}

                                    {colors.allow_half_price ? <h4 style={{ color: colors.subHeadingColor }}
                                      className="allitems_price"
                                    >
                                      {/* // Modified and commented by Om Shrivastava on 08-05-23
                                      // Reason : Create the rupee sign globally for using the config file. */}
                                      {/* {m.price_half ? <strike>₹ {m.price_half}</strike> : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>} */}
                                      {/* Modified by Rohan kansari - 12/5/23 - To check if zero is there then show dash not stike over through */}
                                      {/* {m.price_half ? <strike>{rupee_sign} {m.price_half}</strike> : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>} */}
                                      {m.price_half>0 ? <strike>{rupee_sign} {m.price_half}</strike> : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}
                                      {/* End of addition by Om Shrivastava on 08-05-23 */}
                                    
                                    </h4> : null}
                                  </div>

                                  <div className="price_description_container" >
                                    <h4 style={{ color: 'red', padding: '0' }}
                                      className="allitems_name">Offered price</h4>
                                    <h4 style={{ color: colors.subHeadingColor, padding: '0', margin: '0' }}
                                      className="allitems_price"
                                    >
                                      {/* // Modified and commented by Om Shrivastava on 08-05-23
                                      // Reason : Create the rupee sign globally for using the config file. */}
                                      {/* {mainSectionFullPrice(m) > 0 ? <> ₹ {mainSectionFullPrice(m)}</> : <>&nbsp;&nbsp;&nbsp;&nbsp;---</>} */}
                                      {mainSectionFullPrice(m) > 0 ? <> {rupee_sign} {mainSectionFullPrice(m)}</> : <>&nbsp;&nbsp;&nbsp;&nbsp;---</>}
                                      {/* End of addition by Om Shrivastava on 08-05-23 */}
                                    
                                    </h4>
                                    {colors.allow_half_price ? <h4 style={{ color: colors.subHeadingColor, padding: '0', margin: '0' }}
                                      className="allitems_price"
                                    >
                                      {/* // Modified and commented by Om Shrivastava on 08-05-23
                                      // Reason : Create the rupee sign globally for using the config file. */}
                                      {/* {mainSectionHalfPrice(m) > 0 ? <> ₹ {mainSectionHalfPrice(m)}</> : <>&nbsp;&nbsp;&nbsp;&nbsp;---</>} */}
                                      {mainSectionHalfPrice(m) > 0 ? <> {rupee_sign} {mainSectionHalfPrice(m)}</> : <>&nbsp;&nbsp;&nbsp;&nbsp;---</>}
                                    
                                    </h4> : null}
                                  </div>

                                  <div className="description_div" style={{ display: 'flex', paddingTop: '2%' }}
                                  // style={{ margin: '3% 0 0 3%' }}
                                  >
                                    {/* <h3 className="description_content" style={{ color: colors.bannerColor,padding:'4px 0 0 0' }}>{m.description}</h3> */}

                                    {/* Commented by :- Parineeta Gedam
                                        Date :- 10-04-2023
                                        Reason :- show veg, non-veg, others.
                                    */}
                                    {/* {m.item_type == 'Veg' ? <>
                                      <img src={vegIcon} style={{ width: '5%', height: '2%' }} alt="kk"></img>

                                    </> :
                                      <img src={nonVegIcon} style={{ width: '5%', height: '2%' }} alt="kk"></img>
                                    } */}
                                    {/* End of commented code 10-04-2023 */}

                                    {/* Added by :- Parineeta Gedam
                                        Date :- 10-04-2023
                                        Reason :- show veg, non-veg, others icons.
                                    */}
                                    {m.item_type == 'Veg' ? (
                                      <>
                                        <img src={vegIcon} style={{ width: '15px', height: '15px', marginTop: '2px' }} alt="kk" className=""></img>
                                      </>
                                    ) : null}
                                    {m.item_type == 'Nonveg' ? (
                                      <>
                                        <img src={nonVegIcon} style={{ width: '15px', height: '15px', marginTop: '2px' }} alt="kk" className=""></img>
                                      </>
                                    ) : null}
                                    {m.item_type == 'Other' ? (
                                      <>
                                        {/* <img src={nonVegIcon} style={{ width: '5%', height: '2%' }} alt="kk" className=""></img> */}
                                      </>
                                    ) : null}
                                    {/* &nbsp; <span className="description_content" style={{ alignItems: 'center', color: colors.subHeadingColor }}>{m.description}</span> */}

                                    {/* Modified by rohan- 16/4/23
                                    Reason - Removing old description design and adding button and description together */}
                                    &nbsp; <span ref={ref} className="description_content" onClick={e => toggleDescription(e.currentTarget.style)} style={{ alignItems: 'center', color: colors.subHeadingColor }}>
                                      {/*added by rohan -18/4/23- to add functionality of subscription */}
                                      {subscribePlan?.includes("order") ? <button className="add_product" style={{
                                        color: colors.bannerColor,
                                        backgroundColor: "transparent",
                                        border: `1px solid ${colors.bannerColor}`,
                                        borderRadius: '6px',
                                      }} onClick={e => { callPopupModel(m, fullprice, halfprice) }}>
                                        <AiOutlinePlus className="plus_icon"
                                          style={{
                                            color: colors.bannerColor
                                          }} />Add</button> : null}
                                      <ReactReadMoreReadLess
                                        charLimit={55}
                                        readMoreText={"more"}
                                        readLessText={"less"}
                                      >
                                        {m.description && m.description.length > 0 ? m.description : " "}
                                      </ReactReadMoreReadLess>
                                    </span>
                                    {/* End of code - 16/4/23*/}
                                  </div>
                                  {/* added by rohan -9/4/23
                                      reason- add button to add item to list */}
                                  {/* <div className="add_buttonContainer">
                                    <button className="add_product" style={{
                                      color: colors.headingColor,
                                      backgroundColor: colors.headingBackgroundColor,
                                      borderRadius: '6px',
                                    }} onClick={e => { callPopupModel(data, fullprice, halfprice) }}> <GrFormAdd
                                      />Add</button>
                                  </div> */}
                                  {/* end of 9/4/23 */}


                                </div>

                              </>
                              :
                              <>
                                <div className="price_item_description_div">
                                  <div className="price_description_container" >
                                    <h4 style={{ color: colors.subHeadingColor }}
                                      className="allitems_name"
                                    >{m.name}</h4>
                                    <h4 style={{ color: colors.subHeadingColor }}
                                      className="allitems_price"
                                      // Modified and commented by Om Shrivastava on 08-05-23
                                      // Reason : Create the rupee sign globally for using the config file.
                                    // >{m.price_full ? '₹' + m.price_full : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}</h4>
                                    >{m.price_full ?  rupee_sign + m.price_full : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}</h4>
                                      {/* End of addition by Om Shrivastava on 08-05-23 */}
                                    
                                    {/* added by rohan- 6/4/23 reason- to add functionality of half price shown */}

                                    {colors.allow_half_price ? <h4 style={{ color: colors.subHeadingColor }}
                                      className="allitems_price"
                                      // Modified and commented by Om Shrivastava on 08-05-23
                                      // Reason : Create the rupee sign globally for using the config file.
                                    // >{m.price_half ? '₹' + m.price_half : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}</h4> : null}
                                    >{m.price_half ?  rupee_sign+ m.price_half : <>&nbsp;&nbsp;&nbsp;<span> --- </span></>}</h4> : null}
                                      {/* End of addition by Om Shrivastava on 08-05-23 */}
                                  
                                  </div>
                                  <div className="description_div" style={{ display: 'flex', }}>
                                    {/* <h3 className="description_content" style={{ color: colors.bannerColor }}>{m.description}</h3> */}

                                    {/* Commented by :- Parineeta Gedam
                                        Date :- 10-04-2023
                                        Reason :- show veg, non-veg, others icons.
                                    */}
                                    {/* {m.item_type == 'Veg' ? <>
                                      <img src={vegIcon} style={{ width: '5%', height: '2%' }} alt="kk"></img>

                                    </> :
                                      <img src={nonVegIcon} style={{ width: '5%', height: '2%' }} alt="kk"></img>
                                    } */}
                                    {/* End of commented code 10-04-2023 */}

                                    {/* Added by :- Parineeta Gedam
                                        Date :- 10-04-2023
                                        Reason :- show veg, non-veg, others.
                                    */}
                                    {m.item_type == 'Veg' ? (
                                      <>
                                        <img src={vegIcon} style={{ width: '15px', height: '15px', marginTop: '2px' }} alt="kk" className=""></img>
                                      </>
                                    ) : null}
                                    {m.item_type == 'Nonveg' ? (
                                      <>
                                        <img src={nonVegIcon} style={{ width: '15px', height: '15px', marginTop: '2px' }} alt="kk" className=""></img>
                                      </>
                                    ) : null}
                                    {m.item_type == 'Other' ? (
                                      <>
                                        {/* <img src={nonVegIcon} style={{ width: '5%', height: '2%' }} alt="kk" className=""></img> */}
                                      </>
                                    ) : null}

                                    {/* &nbsp; <div className="description_content" style={{ alignItems: 'center', color: colors.subHeadingColor }}>{m.description}</div> */}

                                    {/* Modified by rohan- 16/4/23
                                    Reason - Removing old description design and adding button and description together */}
                                    &nbsp; <span ref={ref} className="description_content" onClick={e => toggleDescription(e.currentTarget.style)} style={{ alignItems: 'center', color: colors.subHeadingColor }}>
                                      {/*added by rohan -18/4/23- to add functionality of subscription */}
                                      {subscribePlan?.includes("order") ? <button className="add_product" style={{
                                        color: colors.bannerColor,
                                        backgroundColor: "transparent",
                                        border: `1px solid ${colors.bannerColor}`,
                                        borderRadius: '6px',
                                      }} onClick={e => { callPopupModel(m, fullprice, halfprice) }}>
                                        <AiOutlinePlus className="plus_icon"
                                          style={{
                                            color: colors.bannerColor
                                          }}
                                        />Add</button> : null}
                                      <ReactReadMoreReadLess
                                        charLimit={55}
                                        readMoreText={"more"}
                                        readLessText={"less"}
                                      >
                                        {m.description && m.description.length > 0 ? m.description : " "}
                                      </ReactReadMoreReadLess>
                                    </span>
                                    {/* End of code - 16/4/23*/}
                                  </div>
                                  {/* added by rohan -9/4/23
                                      reason- add button to add item to list */}
                                  {/* <div className="add_buttonContainer">
                                    <button className="add_product" style={{
                                      color: colors.headingColor,
                                      backgroundColor: colors.headingBackgroundColor,
                                      borderRadius: '6px',
                                    }} onClick={e => { callPopupModel(data, fullprice, halfprice) }}> <GrFormAdd
                                      />Add</button>
                                  </div> */}
                                  {/* end of 9/4/23 */}
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

        {/* Added By Rohan - 26/4/23
            Reason - To toggle menu card container */}
        {/*Commented on - 3/5/23 - ROhan Kansari / to commente hidding method and hidding through height
          {menuListVisible ? */}
        <div className="main_footer_container" style={{ backgroundColor: colors.subheadingBackgroundColor }}>
          <div className="drawerBtn" onClick={e => {
            setmenuListVisiblity(!menuListVisible);
          }} style={{ backgroundColor: colors.bannerColor }}>
            {menuListVisible ?
              <MdOutlineKeyboardArrowDown color="white" className="arrow_toggle" style={{ color: colors.backgroundTheme }} /> :
              <MdOutlineKeyboardArrowUp color="white" className="arrow_toggle" style={{ color: colors.backgroundTheme }} />}
          </div>
          {/* <div className="footer_btn_container" >
              <button style={{ backgroundColor: colors.bannerColor }} className="button-32" onClick={back}><LeftOutlined style={{ color: 'white' }} /><span> </span></button>
            </div> */}
            {/* Added by Rohna kansari-7/5/23 
                Reason- To keep list open on touch */}
          {/*Modified by Rohan kansari - 8/5/23 
             Reason - To clear and genrate new timeout for menu drawer closing  */}
          <div className="category_container" id="category_container"
            onTouchMove={e => {      if(interval.current.render)window.clearTimeout(interval.current.render);              console.log("clear------------------- ")}}
            onTouchEnd={e => { console.log("--------- ",interval.current.render )
            if(interval.current.render)window.clearTimeout(interval.current.render);

            interval.current.render = setTimeout(() => {
              setmenuListVisiblity(false)
            },20000)} }>
              {/* Ne dof code -rohankansari - 7/5/23 */}
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
                      // border: '2px solid yellow',
                    }}
                    src={siteConfig.siteURL + data.icon}
                  />
                  <div className="footer_category_name" style={{ color: colors.headingColor }}>{data.name}</div>
                </div>
              ))}
            </div>
            {/* <div lassName="footer_btn_container" style={{
              //  border: '2px solid green'
            }}>
              <button style={{
                backgroundColor: colors.bannerColor
              }} className="button-32" onClick={next}><span> </span> <RightOutlined style={{ color: 'white' }} /></button>

            </div> */}

          </div>
          {/* : */}
          {/* <div className="blank_menu_Container" style={{ background: colors.subheadingBackgroundColor }}>
            <div className="drawerBtn" onClick={e => { setmenuListVisiblity(!menuListVisible); document.getElementsByClassName("menu_maindiv")[0].style.maxHeight = "75vh"; }} style={{ backgroundColor: colors.bannerColor }}><MdOutlineKeyboardArrowUp color="white" className="arrow_toggle" style={{ color: colors.backgroundTheme }} /></div>
          </div>} */}
        {/* End of code - 26/4/23 - Rohan */}
        {/* <Footer /> */}
      </div>

      {/* Added by Om on 31-03-23
      Reason : When offer is empty then show this modal */}
      <>
        <Modal style={{ padding: '0% !important' }} open={isModalOpen} footer={null} onOk={handleOk} onCancel={handleCancel}>
          <div
          >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src={noOfferImg}
                style={{ height: "30vh", width: '85vw' }}
              // className='nodata_image'
              />

            </div>
            <h5 style={{ color: colors.subHeadingColor, textAlign: 'center', fontSize: '18px', padding: '0', margin: '0' }}>
              Currently no items are available</h5>
          </div>
        </Modal>
      </>
      {/* End of addition */}

      <div className="inlandscapemode" id="landscape" style={{ color: colors.subHeadingColor }}>
        <img src={landscapeMode} style={{ height: '80vh' }} alt="" className="landscapimg" />
      </div>

      {/* } */}
      {/* Added by Om Shrivastava on 14-06-23
 Reason: When user apply rating than show rating and review */}
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
            // style={{border:'2px solid black'}}
            >
              <Form.Item
                name='rating'
                label='Rating'
                // value={1}
                // defaultValue={1}
                // rules={[
                //     {
                //         defaultValue:1,
                //         required: true,
                //         message: 'Enter Your rate',
                //     },
                // ]}
                style={{
                  marginBottom: '10px'
                }}
              >
                <div
                // style={{border:"2px solid green"}}
                >
                  {/* Modification and addition by Om Shrivastava on 24-07-23 
                  Reason : Set the rating value */}
                  <Rate defaultValue={3} 
                  // onChange={setValue} 
                  onChange={(e)=>setValue(e)} 
                  // onChange={(e) => setOverallRating(e)}
                  
                  />
                  {/* End of Modification and addition by Om Shrivastava on 24-07-23 
                  Reason : Set the rating value */}
                  {/* <Rate allowHalf character={({ index }) => customIcons[index + 1]} defaultValue={1} onChange={setValue} /> */}
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
                  // type="primary"
                  // htmlType="submit"
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
      {/* End of addition by Om Shrivastava on 01-06-23 */}
      
</>
}
{/* End of addition by Om Shrivastava on 19-05-23 */}
    </>
  );

}
export default MenuItem;

// End of modification