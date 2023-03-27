// import "./MenuItem.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getmenuList, getofferDetails, gettenantList } from "../../api/Services";
import siteConfig from "../../config/config";
import './MenuItem.css'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Input, notification } from 'antd';
import { CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import Footer from "../layout/footer/Footer";
import { FlippingPages } from 'flipping-pages';
import 'flipping-pages/dist/style.css';
import { GlobalContext } from "../../context/Context";
import { useContext } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import nodataImg from '../../images/not_offer.png'
import nodataOffer from '../../images/nodata.png'
import crossKnifeImg from '../../images/cross_sign.jpg'

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import GlobalColor from './../Colors/GlobalColor'
// import { Navigation } from "swiper";
import { Pagination, Navigation, Mousewheel, Keyboard, Autoplay } from "swiper";
import Loader from "../Loader/Loader";

function MenuItem() {


  var { searchedValue,
    setSearchedValue, colors } = useContext(GlobalContext);

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

  const onMenuChange = (data) => {
    setfilterCategory(menuList.filter((dt) => dt.id == data))

  }

  const onOfferShow = (item) => {
    setOfferShow(offerList.filter((show) => show.offer_name == item))

    setNewSearch("")

    if (offerList.filter((show) => show.offer_name == item).length < 1) {
      (document.getElementById('offer_divv').style.display = 'block')
        (document.getElementById('flip_div_idd').style.height = '0% ')

      // document.getElementById('offer_divv')
      // {
      // display:'block'}
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
    // getRestroName(tenantt)
  }, []);

  var tenantt = localStorage.getItem("tenantName")
  var restaurant_name = localStorage.getItem("restroName")


  const getMenu = async () => {
    const response = await getmenuList(tenantt);
    if (response) {
      setIsLoader(false)
      setmenuList(response.menuList);
      setCategoryList(response.categoryList)
      setItemList(response.itemList)
      setfilterCategory(response.menuList)

    }
  };

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

  }
  const removeNoSerachResult = () => {
    (document.getElementById('search_divv').style.display = 'none')

  }

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

  const [selected, setSelected] = useState(0);

  const back = () => {
    setSelected(selected => Math.max(selected - 1, 0));
  };

  const next = () => {
    setSelected(selected => Math.min(selected + 1, menuList.length - 1));
  };

  // console.log(menuList, 'All Menu')
  // console.log(categoryList, 'All categories')
  // console.log(itemList, 'All items')
  // console.log(filterCategory, 'filtercategory')
  // console.log(offerBanner, 'all offer images')
  console.log(offerList, 'all offer details')
  console.log(offerShow, 'set offer data')
  // console.log(filter, 'searching data')
  // console.log(res)

  // console.log(search, 'set in input field')


  const navigate = useNavigate();

  const navigatee = () => {
    navigate('/')
  }



  return (
    <>
      {isLoader == true ? <Loader /> :

        <div className='menu_maindiv'
          style={{ backgroundColor: colors.backgroundTheme }}
        >

          <h2 style={{ color: colors.headingColor }}
            // className="restaurant_name"

            className={restaurant_name.length > 9 ? 'restaurant_name' : 'restaurant_fontsize'}>

            {restaurant_name.toUpperCase()}

          </h2>

          <div><GlobalColor /></div>
          {/* {isLoader == true ? <Loader /> : */}

          {offerBanner.length > 0 ?
            <div style={{ border: '2px solid white' }}>

              <Swiper
                // cssMode={true}
                navigation={true}
                pagination={{
                  clickable: true,
                }}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                // mousewheel={true}
                keyboard={true}
                modules={[Navigation, Pagination, Autoplay]}
                // , Mousewheel, Keyboard]}
                className="mySwiper"
              >

                {offerBanner.map((item, id) => (
                  <SwiperSlide>
                    <div
                      style={{ color: 'blue', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', position: 'relative', padding: "1% " }}
                      className='offer_div'
                      onClick={
                        e => onOfferShow(item.offer_name)
                      }
                    >
                      <img
                        src={siteConfig.siteURL + item.offer_image}
                        // style={{ border: '2px solid white' }}
                        className='offer_banner'
                      />
                      <h2
                        className='offer_content'
                        style={{ color: colors.bannerColor }}
                      >
                        {item.offer_name}
                      </h2>
                    </div>
                  </SwiperSlide>
                ))}

              </Swiper>
            </div>
            :
            <h5 style={{ color: 'white' }}>nopee</h5>
          }
          {/* } */}
          {/* <br /> */}
          <div id="hide_search" className={offerShow.length > 0 ? 'searchpage_notshow' : 'searchpage_main'} >
            <div className='searchpage_input'>
              <Input.Group>
                <Search size='large'
                  value={search}
                  onChange={e => { setNewSearch(e.target.value); }}
                  //  onSearch={onSearch}
                  placeholder='Search by Menu, Categories & Items name' />
              </Input.Group>
            </div>
          </div>

          {filter.length == 0 && search.length > 0 ?
            <>
              <div id="search_divv" style={{ height: '35%', display: 'flex', justifyContent: 'center' }}>
                <img
                  src={nodataImg}
                  className='nodata_image' />
                {/* <span style={{ display: 'flex', padding: '1%', fontSize: '16px' }}>
            <span style={{ color: '#ffff9f', padding: '0', width: '89%', fontSize: '15px' }}>
            </span>
            <CloseOutlined  style={{ color: 'black', backgroundColor: 'white', padding: '2%', borderRadius: '100%' }}
            onClick=
            {removeNoSerachResult}
          />
          </span> */}


              </div>
              <h5 style={{ color: colors.subHeadingColor, textAlign: 'center', fontSize: '20px', margin: '0', padding: '0' }}>
                No search result found</h5>
            </>
            : null}

          <div id="offer_divv" className="when_offer_is_null" style={{ display: 'none', height: '41%' }}>
            <span style={{ display: 'flex', padding: '1%', fontSize: '16px' }}>
              <span style={{ color: '#ffff9f', padding: '0', width: '89%', fontSize: '15px' }}>
              </span>
              {/* <CloseOutlined id="toggle" style={{ color: 'black', backgroundColor: 'white', padding: '2%', borderRadius: '100%' }}
                onClick=
                {removeOffersectionDiv}
              /> */}
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
                    <img onClick={removeSerchResult} src={crossKnifeImg} style={{ height: '3.5vh', borderRadius: '100%' }} alt="jhk" />

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
                          backgroundColor: colors.headingBackgroundColor
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
                                backgroundColor: colors.subheadingBackgroundColor
                              }}
                            >
                              {c}
                            </h3>
                          </span>
                          <div style={{
                            display: 'flex',
                            padding: '5% 0% 0% 0%',
                            color: 'lightblue'
                          }}
                          >
                            <div className="allitems_heading_name" style={{ color: colors.bannerColor, textAlign: 'center', marginLeft: '8%' }}>
                              Item name
                            </div>
                            <div className="allitems_heading_price" style={{ color: colors.bannerColor }} >Full price</div>
                            <div className="allitems_heading_price" style={{ color: colors.bannerColor }}>Half price</div>
                          </div>
                          {filter[i][`${obj}`][c].map(person =>
                            <div style={{ display: 'flex' }}>
                              <div className="showimg_div" >

                                <img src={siteConfig.siteURL + person.icon}
                                  className="menu_img"
                                />
                              </div>
                              {/* <div className="price_item_description_div"> */}
                              {/* <div className="price_description_container" > */}
                              {/* <h4 style={{ color: colors.subHeadingColor }}
                                    className="allitems_name"
                                  >{person.name}</h4> */}
                              {(offerList.filter((data) => data.item_name === person.name)).length > 0 ?
                                <>
                                  <div className="price_item_description_div">
                                    <div className="price_description_container" >
                                      <h4 style={{ color: colors.subHeadingColor }}
                                        className="allitems_name"
                                      >{person.name}</h4>
                                      <h4 style={{ color: colors.subHeadingColor }}
                                        className="allitems_price"
                                      >
                                        <strike>  {person.price_full ? '₹' + person.price_full : '---'}</strike>
                                      </h4>
                                      <h4 style={{ color: colors.subHeadingColor }}
                                        className="allitems_price"
                                      >
                                        <strike>  {person.price_half ? '₹' + person.price_half : '---'}</strike>
                                      </h4>
                                    </div>

                                    <div className="price_description_container" >
                                      <h4 style={{ color:'green',padding:'0',margin:'0 0 0 8px' }}
                                        className="allitems_name">Offered price</h4>
                                      <h4 style={{ color: colors.subHeadingColor ,padding:'0',margin:'0'}}
                                        className="allitems_price"
                                      >
                                        ₹{searchSectionFullPrice(person)}
                                      </h4>
                                      <h4 style={{ color: colors.subHeadingColor,padding:'0',margin:'0' }}
                                        className="allitems_price"
                                      >
                                      &nbsp;&nbsp;&nbsp; ₹{searchSectionHalfPrice(person)}
                                      </h4>
                                    </div>

                                    <div className="description_div" >
                                      <h3 className="description_content" style={{ color: colors.bannerColor,padding:'4px 0 0 0' }}>{person.description}</h3>
                                    </div>
                                    <br />
                                    <br />
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
                                      >{person.price_full ? '₹' + person.price_full : '---'}</h4>

                                      <h4 style={{ color: colors.subHeadingColor }}
                                        className="allitems_price"
                                      >{person.price_half ? '₹' + person.price_half : '---'}</h4>
                                    </div>
                                    <div className="description_div" >
                                      <h3 className="description_content" style={{ color: colors.bannerColor }}>{person.description}</h3>
                                    </div>
                                    <br />
                                    <br />
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

                          )}
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
            <span style={{ display: 'flex', padding: '2%', fontSize: '16px' }}>
              <span style={{ color: '#ffff9f', padding: '0', width: '90%' }}>
                {/* Result not found */}
              </span>
              {/* <CloseOutlined id="toggle" style={{ color: 'black', backgroundColor: 'white', padding: '1%', }}
                      onClick=
                      {removeSerchResult}
                    /> */}
              <img onClick={divOfferRemove} src={crossKnifeImg} style={{ height: '3.5vh', borderRadius: '100%' }} alt="jhk" />

            </span>

            <span className="allcategory_container"
            >
              <span style={{ color: colors.headingColor }} className="category_name"> {offer_name}</span> &nbsp;
              <h3 style={{ color: colors.headingColor }} className="category_name"
              >{offer_discount}%
              </h3>
            </span>
            <div style={{
              display: 'flex',
              padding: '5% 0% 0% 0%',
              color: 'lightblue'

            }}
            >
              <div className="allitems_heading_name" style={{ color: colors.bannerColor, textAlign: 'center', marginLeft: '8%' }}>
                Item name
              </div>
              <div className="allitems_heading_price" style={{ color: colors.bannerColor }}>Full price</div>
              <div className="allitems_heading_price" style={{ color: colors.bannerColor }}>Half price</div>
            </div>
            {offerShow.length > 0 ?
              <>
                {offerShow.map((showdata, id) => (
                  <div style={{ display: 'flex' }}>
                    <div className="showimg_div" >

                      <img src={siteConfig.siteURL + showdata.item_image}
                        className="menu_img"
                      />
                    </div>
                    <div className="price_item_description_div">
                                    <div className="price_description_container" >
                                      <h4 style={{ color: colors.subHeadingColor }}
                                        className="allitems_name"
                                      >{showdata.item_name}</h4>
                                      <h4 style={{ color: colors.subHeadingColor }}
                                        className="allitems_price"
                                      >
                                        <strike>  {showdata.item_fullprice ? '₹' + showdata.item_fullprice : '---'}</strike>
                                      </h4>
                                      <h4 style={{ color: colors.subHeadingColor }}
                                        className="allitems_price"
                                      >
                                        <strike>  {showdata.item_halfprice ? '₹' + showdata.item_halfprice : '---'}</strike>
                                      </h4>
                                    </div>

                                    <div className="price_description_container" >
                                      <h4 style={{color:'green',padding:'0',margin:'0 0 0 8px' }}
                                        className="allitems_name">Offered price</h4>
                                      <h4 style={{ color: colors.subHeadingColor ,padding:'0',margin:'0'}}
                                        className="allitems_price"
                                      >
                                           ₹{totalFullPrice(showdata)}
                                      </h4>
                                      <h4 style={{ color: colors.subHeadingColor,padding:'0',margin:'0' }}
                                        className="allitems_price"
                                      >
                                      &nbsp;&nbsp;&nbsp;  ₹{totalHalfPrice(showdata)}
                                      </h4>
                                    </div>

                                    <div className="description_div" >
                                      <h3 className="description_content" style={{ color: colors.bannerColor,padding:'4px 0 0 0' }}>{showdata.item_description}</h3>
                                    </div>
                                    <br />
                                    <br />
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
                        <h4 style={{ color: "green",  }}
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


          <div id="flip_div_idd" style={{}}
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
                <div>
                  <span style={{ textAlign: 'center' }}
                  >

                    <h5 style={{
                      color: colors.headingColor, paddingTop: '2%',
                      backgroundColor: colors.headingBackgroundColor
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
                          style={{}}
                        >
                          {/* <img style={{ border: '1px solid black' }}
                      src={siteConfig.siteURL + data.icon}
                      className="category_img"
                    />&nbsp; */}
                          <h3 style={{ color: colors.headingColor, backgroundColor: colors.subheadingBackgroundColor }}
                            className="category_name"
                          >{data.name}
                          </h3>
                        </span>
                        <div style={{
                          display: 'flex',
                          padding: '5% 0% 0% 0%',
                          color: 'lightblue'
                        }}
                        >
                          <div className="allitems_heading_name" style={{ color: colors.bannerColor, textAlign: 'center', marginLeft: '8%' }}>
                            Item name
                          </div>
                          <div className="allitems_heading_price" style={{ color: colors.bannerColor, }} >Full price</div>
                          <div className="allitems_heading_price" style={{ color: colors.bannerColor }}>Half price</div>
                        </div>
                        {itemList.length > 0 ? <>
                          {itemList.filter(i => i.category === data.id).map(m =>
                            // <div style={{ border: '2px solid green', height: '100%', display: 'flex' }}>

                            <div style={{ display: 'flex' }}>
                              <div className="showimg_div" >

                                <img src={siteConfig.siteURL + m.icon}
                                  className="menu_img"
                                />
                              </div>
                              {(offerList.filter((data) => data.item_name === m.name)).length > 0 ?
                                <>
                                  <div className="price_item_description_div">
                                    <div className="price_description_container" >
                                      <h4 style={{ color: colors.subHeadingColor }}
                                        className="allitems_name"
                                      >{m.name}</h4>
                                      <h4 style={{ color: colors.subHeadingColor }}
                                        className="allitems_price"
                                      >
                                        <strike>  {m.price_full ? '₹' + m.price_full : '---'}</strike>
                                      </h4>
                                      <h4 style={{ color: colors.subHeadingColor }}
                                        className="allitems_price"
                                      >
                                        <strike>  {m.price_half ? '₹' + m.price_half : '---'}</strike>
                                      </h4>
                                    </div>

                                    <div className="price_description_container" >
                                      <h4 style={{color:'green',padding:'0',margin:'0 0 0 8px' }}
                                        className="allitems_name">Offered price</h4>
                                      <h4 style={{ color: colors.subHeadingColor ,padding:'0',margin:'0'}}
                                        className="allitems_price"
                                      >
                                        ₹{mainSectionFullPrice(m)}
                                      </h4>
                                      <h4 style={{ color: colors.subHeadingColor,padding:'0',margin:'0' }}
                                        className="allitems_price"
                                      >
                                      &nbsp;&nbsp;&nbsp; ₹{mainSectionHalfPrice(m)}
                                      </h4>
                                    </div>

                                    <div className="description_div" >
                                      <h3 className="description_content" style={{ color: colors.bannerColor,padding:'4px 0 0 0' }}>{m.description}</h3>
                                    </div>
                                    <br />
                                    <br />
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
                                      >{m.price_full ? '₹' + m.price_full : '---'}</h4>

                                      <h4 style={{ color: colors.subHeadingColor }}
                                        className="allitems_price"
                                      >{m.price_half ? '₹' + m.price_half : '---'}</h4>
                                    </div>
                                    <div className="description_div" >
                                      <h3 className="description_content" style={{ color: colors.bannerColor }}>{m.description}</h3>
                                    </div>
                                    <br />
                                    <br />
                                  </div>

                                </>
                              }

                              
                              {/* <div className="price_item_description_div">
                                <div className="price_description_container" >
                                  <h4 style={{ color: colors.subHeadingColor }}
                                    className="allitems_name"
                                  >{m.name}</h4>
                                  <h4 style={{ color: colors.subHeadingColor }}
                                    className="allitems_price"
                                  >{m.price_full ? '₹' + m.price_full : '---'}</h4>
                                  <h4 style={{ color: colors.subHeadingColor }}
                                    className="allitems_price"
                                  >{m.price_half ? '₹' + m.price_half : '---'}</h4>
                                </div>

                                <div className="description_div" >
                                  <h3 className="description_content" style={{ color: colors.bannerColor }}>{m.description}</h3>
                                </div>
                                <br />
                                <br />
                              </div> */}
                            </div>

                          )}
                        </> : null
                          // <h5 style={{ backgroundColor: 'red' }}>Nopeeee
                          // nope
                          // </h5>
                        }
                      </div>

                    )}
                  </> :
                    <h5 style={{ backgroundColor: 'red' }}>Nopeeee
                    </h5>}
                </div>
              ))}
            </FlippingPages>
          </div>

          <br />
          {/* <div id="parent_div_button" className={search || offerShow.length > 0 ? 'prev_next_hide_button' : 'prev_next_button'}
      >
        <div >
          <button style={{ backgroundColor: colors.headingColor }} className="button-32" onClick={back}><LeftOutlined /><span> Previous </span></button>
        </div>
        <div >
          <button style={{ backgroundColor: colors.headingColor }} className="button-32" onClick={next}><span>Next </span> <RightOutlined /></button></div>
      </div> */}
          <div className="div_caraousel">
            <Carousel
              swipeable={false}
              draggable={false}
              responsive={responsive}
              infinite={true}
              autoPlaySpeed={1000}
              keyBoardControl={true}
              customTransition="all .5"
              transitionDuration={500}
              containerClass="carousel-container"
              itemClass="carousel-item-padding-40-px"
              arrows={true}

            >
              {menuList.map((data, id) => (
                <div id={id}>
                  <div
                    style={{
                      fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}
                    className='all-menu'
                    onClick={
                      e => {
                        onMenuChange(data.id);
                        setSelected(id);
                      }
                    }
                  >
                    <img
                      src={siteConfig.siteURL + data.icon}
                      className='menu_image'
                    />
                    <br />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginRight: '2%' }}>
                    <span style={{ color: colors.headingColor }}
                      className="menu_name"
                    > {data.name}</span>
                  </div>
                </div>
              ))}
            </Carousel>

          </div>
          {/* <Footer /> */}
        </div>
      }
    </>
  );

}
export default MenuItem;

// End of modification