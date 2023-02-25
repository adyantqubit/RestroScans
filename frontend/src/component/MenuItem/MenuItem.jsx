// import "./MenuItem.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getallMenuCategoryItem, getmenuList, PostSearchData, } from "../../api/Services";
import siteConfig from "../../config/config";
import './MenuItem.css'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Input, notification } from 'antd';
import { CloseOutlined } from '@ant-design/icons'
import Footer from "../layout/footer/Footer";
import { FlippingPages } from 'flipping-pages';
import 'flipping-pages/dist/style.css';
import { GlobalContext } from "../../context/Context";
import { useContext } from 'react';

function MenuItem() {

  var { searchedValue,
    setSearchedValue } = useContext(GlobalContext);

  const [menuList, setmenuList] = useState([]); // Our menu set in this variable
  const [categoryList, setCategoryList] = useState([]); // Our Category set in this variable
  const [itemList, setItemList] = useState([]); // Our Item set in this variable

  var [filterCategory, setfilterCategory] = useState([])

  // const [allmenuItems, setallMenuItems] = useState([]); // Our Item set in this variable


  const onMenuChange = (data) => {
    setfilterCategory(categoryList.filter((dt) => dt.menu == data))
  }

  useEffect(() => {
    getMenu(tenantt);
    // getallItems(tenantt)
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
    var myy=[]
  let categories = new Set()
  filtered.forEach(entry => { categories.add(entry.category_name) })
  categories.forEach(cat => myy.push(cat))
// console.log(categories.cat)
console.log(myy)

  const targetDiv = document.getElementById("third");
  const btn = document.getElementById("toggle");

  const checkBtn = () => {
    if (targetDiv.style.display !== "none") {
      targetDiv.style.display = "none";
      window.location.reload()
    } else {
      targetDiv.style.display = "block";
      window.location.reload()

    }
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
    setSelected(selected => Math.min(selected + 1, 2));
  };

  console.log(menuList, 'All Menu')
  console.log(categoryList, 'All categories')
  console.log(itemList, 'All items')
  console.log(filterCategory)

  const navigate = useNavigate();

  // const navigatee = ()=>{
  //   navigate('/')
  // }

  return (
    <div className='menu_maindiv'>
      <br />
      <h2 style={{ textAlign: 'center', padding: '0%', margin: '0', fontFamily: 'Noe-Display', color: 'gold', fontSize: '34px' }}>{tenantt}</h2>
      <div className='searchpage_main'>
        <div className='searchpage_input'>
          <Input.Group> Not now...
            <Search size='large' onSearch={onSearch} placeholder='Search by Menu items' />
          </Input.Group>

          {/* <Input.Group>
            <Search 
              onSearch={onSearch}
              value={searchedValue}
              onChange={(e) => { setSearchedValue(e.target.value) }}
              placeholder='Hint: Search by You want...'
            />
          </Input.Group> */}

        </div>
      </div>

      <div className={search ? 'searchpage_content' : 'again'} id="third" >
{/* <h5 style={{color:'white'}}>
{myy}
</h5> */}
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
                  <h4 style={{ textAlign: 'center', padding: '1', margin: '0', color: 'gold', fontFamily: 'Lucida Handwriting' }}>{person.menu_name}</h4>
                  <span className="allcategory_searched"
                  >
                    <img style={{ border: '1px solid black' }}
                      src={siteConfig.siteURL + person.category_img}
                      className="category_serached_img" width='2%'
                    />&nbsp;
                    <h3 className="category_name" style={{ fontSize: '15px' }}
                    >
                      {/* {myy} */}
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

      {/* <HTMLFlipBook width={365} height={500}> */}
      {/* {search value} */}
      <div className={search ? "menu_childdiv" : 'check'}>

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
            {/* <div style={{display:'flex',justifyContent:'flex-end'}}>
            <span style={{color:'white',width:'19%',padding:'0'}}>Full</span>
            <span style={{color:'white',width:'19%',padding:'0'}}>Half</span>
            </div> */}

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
      </div>
      {/* </HTMLFlipBook> */}
      {/* <div style={{border:'2px solid white'}}>
      <div className="pages">
                <FlippingPages
                    direction="right-to-left"
                    onSwipeEnd={setSelected}
                    selected={selected}
                    
                >
                    <div className="page page1">Page 1 
                    <button onClick={navigatee}>Check</button>
                    
                    </div>
                    <div className="page page2">Page 2</div>
                    <div className="page page3">Page 3</div>
                </FlippingPages>
            </div>
            <button onClick={back}>Back</button>
            <button onClick={next}>Next</button>
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
            <div>
              <div
                style={{
                  fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  //  position: 'relative' 
                }}
                className='all-menu'
                onClick={
                  e => onMenuChange(data.id)
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