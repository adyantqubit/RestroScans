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

  var [filter, setFiltered] = useState([])

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

  const [search, setNewSearch] = useState("");

  const no_data = [];

  const Search = Input.Search;

  const onSearch = (value) => setNewSearch(value)

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
      if (temp.includes(r.menu_name.toLowerCase())) {

      }
      else {
        temp.push(r.menu_name.toLowerCase())
      }
    })

    var temp2 = []

    temp.filter((s, i) => {
      var data = {}
      data[s] = []
      temp2.push(data)

      filtered.filter(n => {
        if (n.menu_name.toLowerCase() == s) {
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

        if (categoryName.includes(s.category_name.toLowerCase())) {

        }
        else {
          categoryName.push(s.category_name.toLowerCase())
        }

      })


      //filter with unique category name and save inside menu item with unique category name item list
      var data = {}

      var gh = data[obj] = {}
      categoryName.filter(m => {

        gh[m] = []
        // console.log(m)
        filtered.map(h => {
          if (h.category_name.toLowerCase() == m) {
            data[obj][m].push(h)
          }
        })
      })

      temp3.push(data)
    })

    // console.log(temp3)

    setFiltered(temp3)
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
    setSelected(selected => Math.min(selected + 1, filterCategory.length - 1));
  };

  // console.log(menuList, 'All Menu')
  // console.log(categoryList, 'All categories')

  // console.log(filterCategory)
  // console.log(offerBanner, 'all offer images')
  // console.log(offerList, 'all offer details')
  // console.log(offerShow, 'set offer data')
  // console.log(itemList, 'All items')
  // console.log(filter, 'searching data')
  // console.log(search, 'searching data')

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

      <div className={filter.length > 0 ? 'searchpage_content' : 'again'} id="third" >
        {search ?
          <>
            {filter.length > 0 ?
              <span style={{ display: 'flex', padding: '2%', fontSize: '16px' }}>
                <span style={{ color: '#ffff9f', padding: '0', width: '90%' }}>Your search result</span>
                <CloseOutlined id="toggle" style={{ color: 'black', backgroundColor: 'white', padding: '1%', }}
                  onClick=
                  {removeSerchResult}
                // {checkBtn}
                />
              </span>
              :
              <span style={{ display: 'flex', padding: '2%', fontSize: '16px' }}>
                <span style={{ color: '#ffff9f', padding: '0', width: '90%' }}>Result not found</span>
                <CloseOutlined id="toggle" style={{ color: 'black', backgroundColor: 'white', padding: '1%', }}
                  onClick=
                  {removeSerchResult}
                // {checkBtn} 
                />
              </span>
            }
            {filter.map((data, i) => {
              var obj = Object.keys(data)
              var categoriesObj = Object.keys(filter[i][obj])
              return (<>
                <div className='after_search_div'
                >
                  <h4 style={{ textAlign: 'center', padding: '1', margin: '0', color: 'gold', fontFamily: 'Lucida Handwriting' }}>
                    {obj}
                  </h4>

                </div>

                {
                  <>{categoriesObj.map((c, j) =>
                    <div className='after_search_div'
                    >
                      <span className="allcategory_searched"
                      >
                        <img style={{ border: '1px solid black' }}
                          src={siteConfig.siteURL + filter[i][obj][c][0].category_img}
                          className="category_serached_img" width='2%'
                        />&nbsp;
                        <h3 className="category_name" style={{ fontSize: '15px' }}
                        >
                          {c}
                        </h3>
                      </span>
                      {filter[i][`${obj}`][c].map(person =>
                      <div className='after_search_div'
                      >

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

      <div className={search.length != 0 || offerShow.length > 0 ? "menu_childdiv" : 'check'}>
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