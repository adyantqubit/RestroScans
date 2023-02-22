// import "./MenuItem.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getmenuList, } from "../../api/Services";
import siteConfig from "../../config/config";
import './MenuItem.css'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Input, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons'
import Footer from "../layout/footer/Footer";

function MenuItem() {

  const [menuList, setmenuList] = useState([]); // Our menu set in this variable
  const [categoryList, setCategoryList] = useState([]); // Our Category set in this variable
  const [itemList, setItemList] = useState([]); // Our Item set in this variable

  var [filterCategory, setfilterCategory] = useState([])

  const onMenuChange = (data) => {
    setfilterCategory(categoryList.filter((dt) => dt.menu == data))
  }

  useEffect(() => {
    getMenu(tenantt);
  }, []);

  var tenantt = localStorage.getItem("tenantName")

  const getMenu = async () => {
    const response = await getmenuList(tenantt);
    if (response) {
      setmenuList(response.menuList);
      setCategoryList(response.categoryList)
      setItemList(response.itemList)
      // setfilterCategory(response.categoryList[0] ? [response.categoryList[0]] : [...response.categoryList[0]])
      // setfilterCategory(response.categoryList.filter((dt,id) => dt.menu == menuList[0].id))
      setfilterCategory(response.categoryList)
    }
  };
  const [search, setNewSearch] = useState("");

  const no_data = [{ default_image: '/media/images/listing/noresult.jpg' }];

  const Search = Input.Search;

  const onSearch = (value) => setNewSearch(value)

  // Reason - To allow search by items
  const filtered = !search
    ? no_data
    : itemList.filter((person) =>
      person.name.toLowerCase().includes(search.toLowerCase())
      // person.address.toLowerCase().includes(search.toLowerCase()) ||
      // person.city_name.toLowerCase().includes(search.toLocaleLowerCase())
    );

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

  console.log(menuList, 'All Menu')
  console.log(categoryList, 'All categories')
  console.log(itemList, 'All items')
  console.log(filterCategory)

  return (
    <div className='menu_maindiv'>
      <br />
      <h2 style={{ textAlign: 'center', padding: '0%', margin: '0', fontFamily: 'Noe-Display', color: 'gold', fontSize: '34px' }}>{tenantt}</h2>
      <div className='searchpage_main'>
        <div className='searchpage_input'>
          <Input.Group>
            <Search size='large' onSearch={onSearch} placeholder='Search by Menu items' />
          </Input.Group>
        </div>
        <div className='searchpage_content' id="third">

          {search ?
            <>
              {filtered.length > 0 ?
                <span style={{ display: 'flex', padding: '2%', fontSize: '16px' }}>
                  <span style={{ color: '#ffff9f', padding: '0', width: '90%' }}>Your search result</span>
                  {/* <Button id="toggle" onClick={checkBtn}> */}
                    <CloseOutlined id="toggle" style={{color:'black',backgroundColor:'white',padding:'1%',}} onClick={checkBtn}/>
                  {/* </Button> */}
                </span>
                :
                <h2 style={{ color: '#ffff9f' }}>Result not found</h2>

              }
              {filtered.map((person) => {
                return (

                  <div className='demoPage2'
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '3% 0% 0% 0%',
                    }}
                    >
                      <div style={{ color: 'white', fontFamily: 'Palatino', color: 'white', width: '95%', marginLeft: '5%' }}>{person.name}</div>
                      <div style={{ color: 'white', fontFamily: 'Palatino', color: 'white', width: '33%' }}>₹{person.price_full}</div>
                      <div style={{ color: 'white', fontFamily: 'Palatino', color: 'white', width: '33%' }}>₹{person.price_half}</div>
                    </div>
                  </div>
                );
              })}
            </> :
            null}
        </div>
      </div>

      {/* <HTMLFlipBook width={365} height={500}> */}
      <div className="menu_childdiv">

        {filterCategory.map((data) => (
          <div className="demoPage">
            <span style={{ display: 'flex', alignItems: 'center', textAlign: 'center', justifyContent: 'center', marginTop: '2%' }}>
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
                <div style={{ color: 'white', fontFamily: 'Palatino', width: '95%', marginLeft: '5%' }}>{m.name}</div>
                <div style={{ color: 'white', fontFamily: 'Palatino', width: '33%' }}>₹{m.price_full}</div>
                <div style={{ color: 'white', fontFamily: 'Palatino', width: '33%' }}>₹{m.price_half}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* </HTMLFlipBook> */}

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
              style={{ fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
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
            <div style={{display:'flex',justifyContent:'center',marginRight:'2%'}}>
            <span style={{color:'gold',fontSize:'14px'}}> {data.name}</span>
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