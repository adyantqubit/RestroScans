// import "./MenuItem.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getmenuList, getofferDetails } from "../../api/Services";
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

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import { Navigation } from "swiper";
import { Pagination, Navigation, Mousewheel, Keyboard } from "swiper";

function MenuItem() {

  var { searchedValue,
    setSearchedValue } = useContext(GlobalContext);

  const [menuList, setmenuList] = useState([]); // Our menu set in this variable
  const [categoryList, setCategoryList] = useState([]); // Our Category set in this variable
  const [itemList, setItemList] = useState([]); // Our Item set in this variable

  var [filterCategory, setfilterCategory] = useState([])
  var [offerShow, setOfferShow] = useState([])

  const [offerBanner, setOfferBanner] = useState([]); // Our Item set in this variable
  const [offerList, setOfferList] = useState([]); // Our Item set in this variable

  const onMenuChange = (data) => {
    setfilterCategory(categoryList.filter((dt) => dt.menu == data))
  }

  const onOfferShow = (item) => {
    setOfferShow(offerList.filter((show) => show.offer_name == item))
  }

  useEffect(() => {
    getMenu(tenantt);
    getOffer(tenantt);
  }, []);

  var tenantt = localStorage.getItem("tenantName")

  const getMenu = async () => {
    const response = await getmenuList(tenantt);
    if (response) {
      setmenuList(response.menuList);
      setCategoryList(response.categoryList)
      setItemList(response.itemList)
      setfilterCategory(response.categoryList)

    }
  };

  // For Show the all offers in banner

  const getOffer = async () => {
    const response = await getofferDetails(tenantt);
    if (response) {
      setOfferBanner(response.offerBanner);
      setOfferList(response.offerItemList)
      // setOfferShow(response.offerItemList)

    }
  };

  // For searching alll menuItemCategory

  // const getallItems = async () => {
  //   const response = await getallMenuCategoryItem(tenantt);
  //   if (response) {
  //     setallMenuItems(response);
  //   }
  // };

  const [search, setNewSearch] = useState("");

  const no_data = [{ default_image: '/media/images/listing/noresult.jpg' }];

  const Search = Input.Search;

  const onSearch = (value) => setNewSearch(value)

  // const [searching, setSearching] = useState([])

  // const [tenttt, setTennant] = useState({tenannt:localStorage.getItem('tenantName'), query:searchedValue })


  // const [newSearch, setNewSearch] = useState();
  // const onSearch = async (itemsToSearch) => {
  //   console.log(itemsToSearch)
  //   const itemToSearch = itemsToSearch.replace(/^\s+|\s+$/gm, '') 
  //   setSearchedValue(itemToSearch)
  //   if (itemToSearch.length == 0) {
  //     notification.info({
  //       description:
  //         'Please, enter product or category name to search !',
  //       duration: 1,
  //       key: 1,
  //     });
  //   }
  //   else {
  //     setNewSearch(itemsToSearch);
  //     console.log(tenttt)
  //     await PostSearchData(tenttt).then(r => {
  //     console.log('yuvi', r.search)
  //     setSearching(r.search)
  //     })
  //   }
  // }



  // Reason - To allow search by items
  const filtered = !search
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
  console.log(myy)

  var offer_name = []
  let offernme = new Set()
  offerShow.forEach(entry => { offernme.add(entry.offer_name) })
  offernme.forEach(cat => offer_name.push(cat))
  console.log(offer_name, 'ofeerename')

  var offer_discount = []
  let offers = new Set()
  offerShow.forEach(entry => { offers.add(entry.item_discount) })
  offers.forEach(cat => offer_discount.push(cat))
  console.log(offer_discount, 'ofeerename')

  const targetDiv = document.getElementById("third");
  const btn = document.getElementById("toggle");

  const checkBtn = () => {
    if (targetDiv.style.display !== "none") {
      targetDiv.style.display = "none";
      // setNewSearch("")
      window.location.reload()
    } else {
      targetDiv.style.display = "block";
      // setNewSearch("")

      window.location.reload()

    }
  };

  const divOfferRemove = () => {
    setOfferShow([])
  };

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
    setSelected(selected => Math.min(selected + 1, filterCategory.length - 1));
  };

  console.log(menuList, 'All Menu')
  console.log(categoryList, 'All categories')

  console.log(filterCategory)
  console.log(offerBanner, 'all offer images')
  console.log(offerList, 'all offer details')
  console.log(offerShow, 'set offer data')
  console.log(itemList, 'All items')
  console.log(filtered, 'searching data')
  console.log(search, 'searching data')

  // useEffect(()=>{
  //   const menu_list=[]
  // if  (filtered.length>0){
  //   filtered.map(f=>
  //     {
  //       if(menu_list.includes(f.menu_item))
  //     })
  // } 
  // },[filtered])


  const navigate = useNavigate();

  const navigatee = () => {
    navigate('/')
  }

  return (
    <div className='menu_maindiv'>
      <h2 style={{ textAlign: 'center', padding: '1%', margin: '0', fontFamily: 'Noe-Display', color: 'gold', fontSize: '34px' }}>{tenantt}</h2>
      <div>
        <Swiper
          cssMode={true}
          navigation={true}
          pagination={{
            clickable: true,
          }}
          mousewheel={true}
          keyboard={true}
          modules={[Navigation, Pagination, Mousewheel, Keyboard]}
        >
          {offerBanner.map((item, id) => (
            <SwiperSlide>
              <div
                style={{ color: 'blue', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', position: 'relative' }}
                className='offer_div'
                onClick={
                  e => onOfferShow(item.offer_name)
                }
              >
                <img
                  src={siteConfig.siteURL + item.offer_image}
                  className='offer_banner'
                />
                <h2
                  className='offer_content'
                >
                  {item.offer_name}
                </h2>
              </div>
            </SwiperSlide>
          ))}

        </Swiper>
      </div>

      <div className={offerShow.length > 0 ? 'searchpage_notshow' : 'searchpage_main'} >
        <div className='searchpage_input'>
          <Input.Group>
            <Search size='large' onSearch={onSearch} placeholder='Search by Menu items' />
          </Input.Group>
        </div>
      </div>

      <div className={search ? 'searchpage_content' : 'again'} id="third" >
        {search ?
          <>
            {filtered.length > 0 ?
              <span style={{ display: 'flex', padding: '2%', fontSize: '16px' }}>
                <span style={{ color: '#ffff9f', padding: '0', width: '90%' }}>Your search result</span>
                <CloseOutlined id="toggle" style={{ color: 'black', backgroundColor: 'white', padding: '1%', }} onClick={checkBtn} />
              </span>
              :
              <span style={{ display: 'flex', padding: '2%', fontSize: '16px' }}>
                <span style={{ color: '#ffff9f', padding: '0', width: '90%' }}>Result not found</span>
                <CloseOutlined id="toggle" style={{ color: 'black', backgroundColor: 'white', padding: '1%', }} onClick={checkBtn} />
              </span>
            }
            {filtered.map((person) => {
              return (
                <div className='after_search_div'
                >
                  <h4 style={{ textAlign: 'center', padding: '1', margin: '0', color: 'gold', fontFamily: 'Lucida Handwriting' }}>
                    {person.menu_name}
                  </h4>
                  <span className="allcategory_searched"
                  >
                    <img style={{ border: '1px solid black' }}
                      src={siteConfig.siteURL + person.category_img}
                      className="category_serached_img" width='2%'
                    />&nbsp;
                    <h3 className="category_name" style={{ fontSize: '15px' }}
                    >
                      {person.category_name}
                    </h3>
                  </span>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '3% 0% 0% 0%',
                  }}
                  >
                    <div className="after_search_content"
                    >{person.name}</div>
                    <div className="after_search_price"
                    >{person.price_full ? '₹' + person.price_full : '---'}</div>
                    <div className="after_search_price"
                    >{person.price_half ? '₹' + person.price_half : '---'}</div>
                  </div>
                </div>
              );
            })}
          </> :
          null}
      </div>

      <div className={offerShow.length < 1 ? 'offer_notshow' : 'offer_maindiv'}  >
        <div style={{ display: 'flex', justifyContent: 'right', padding: '1% 2% 0% 0%' }}>
          <CloseOutlined
            onClick={divOfferRemove}
            style={{ color: 'black', backgroundColor: 'white', padding: '1%', justifyContent: 'right' }}
          />
        </div>

        <span className="allcategory_container"
        >
          <span className="category_name"> {offer_name}</span> &nbsp;
          <h3 className="category_name"
          >{offer_discount}%
          </h3>
        </span>
        {offerShow.length > 0 ?
          <>
            {offerShow.map((showdata, id) => (
              <div>
                <div style={{
                  display: 'flex',
                  padding: '5% 0% 0% 0%',
                }}
                >
                  <div className="allitems_name">{showdata.item_name}</div>
                  <div className="allitems_price" >{showdata.item_fullprice ? '₹' + showdata.item_fullprice : '---'}</div>
                  <div className="allitems_price" >{showdata.item_fullprice ? '₹' + showdata.item_fullprice : '---'}</div>
                </div>
              </div>
            ))}
          </>
          : <div style={{ backgroundColor: 'aqua', color: 'white' }}>
            <h4>No longer available items for this offer</h4>
          </div>}
      </div>

      <div className={search || offerShow.length > 0 ? "menu_childdiv" : 'check'}>
        <FlippingPages
          direction="right-to-left"
          onSwipeEnd={setSelected}
          selected={selected}
          shadowBackground='	#909090'
        >
          {filterCategory.map((data) => (
            <div className="allcategory_menu_div">
              <span className="allcategory_container"
              >
                <img style={{ border: '1px solid black' }}
                  src={siteConfig.siteURL + data.icon}
                  className="category_img"
                />&nbsp;
                <h3 className="category_name"
                >{data.name}
                </h3>
              </span>

              {itemList.filter(i => i.category === data.id).map(m =>
                <div style={{
                  display: 'flex',
                  padding: '5% 0% 0% 0%',
                }}
                >
                  <div className="allitems_name">{m.name}</div>
                  <div className="allitems_price" >{m.price_full ? '₹' + m.price_full : '---'}</div>
                  <div className="allitems_price" >{m.price_half ? '₹' + m.price_half : '---'}</div>
                </div>
              )}
            </div>
          ))}
        </FlippingPages>
      </div>
      <div className={search || offerShow.length > 0 ? 'prev_next_hide_button' : 'prev_next_button'}
      // style={{ display: 'flex', justifyContent: 'space-between', padding: '0% 2% 0% 2%' }}
      >
        <div >
          <button className="button-85" onClick={back}><LeftOutlined /><span> Previous </span></button>
        </div>
        <div >
          <button className="button-85" onClick={next}><span>Next </span> <RightOutlined /></button></div>
      </div>
      <br />
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
            <div>
              <div
                style={{
                  fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}
                className='all-menu'
                onClick={
                  e => { onMenuChange(data.id); setSelected(0) }
                }
              >
                <img
                  src={siteConfig.siteURL + data.icon}
                  className='menu_image'
                />
                <br />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginRight: '2%' }}>
                <span style={{ color: 'gold', fontSize: '14px' }}> {data.name}</span>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
      <Footer />
    </div>

  );
}
export default MenuItem;

// End of modification