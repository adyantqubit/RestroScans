// import "./MenuItem.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getmenuList, getMenuList } from "../../api/Services";
import siteConfig from "../../config/config";
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { GlobalContext } from "../../context/Context";
import './MenuItem.css'
import HTMLFlipBook from 'react-pageflip';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Input, Card, Modal } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import Footer from "../layout/footer/Footer";

function MenuItem() {

  const [menuList, setmenuList] = useState([]); // Our menu set in this variable
  const [categoryList, setCategoryList] = useState([]); // Our Category set in this variable
  const [itemList, setItemList] = useState([]); // Our Item set in this variable

  var [filterCategory, setfilterCategory] = useState([])
  var [categoryLable, setCategoryLable] = useState([])

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
  // const [property, setProperty] = useState([]);
    const [search, setNewSearch] = useState("");

    const no_data = [{ default_image: '/media/images/listing/noresult.jpg' }];

    const Search = Input.Search;

    const onSearch = (value) => setNewSearch(value)

    // modified by Ashish on 28-10-2022
    // Reason - To allow search by city also
    const filtered = !search
        ? no_data
        : itemList.filter((person) =>
            person.name.toLowerCase().includes(search.toLowerCase()) 
            // person.address.toLowerCase().includes(search.toLowerCase()) ||
            // person.property_id.toLowerCase().includes(search.toLowerCase()) ||
            // person.city_name.toLowerCase().includes(search.toLocaleLowerCase())
        );
       
    // End of code modification

    // const getpropertydetails = async () => {
    //     const item = await allPropertyCardApi();
    //     if (item) {
    //         setProperty(item)
    //     }
    // }
    const navigate = useNavigate();



  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
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
          <h2 style={{textAlign:'center',padding:'0%',margin:'0',fontFamily:'Noe-Display',color:'white'}}>{tenantt}</h2>
{/* <br></br> */}
      <div className='searchpage_main'>
        {/* <Card className='searchpage_card' hoverable> */}
          <div className='searchpage_input'>
            <Input.Group>
              <Search size='large' onSearch={onSearch} placeholder='Search by MenuItems' />
            </Input.Group>
          </div>
          <div className='searchpage_content'>
            
            {search ?
              <>
                {filtered.length > 0 ? <h4 style={{color:'#ffff9f',padding:'0'}}>Your search result</h4> : <h2 style={{ color: '#ffff9f' }}>Result not found</h2>}
                {filtered.map((person) => {
                  return (
                    
                      <div className='demoPage2' 
                      >
                      <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '1% 0% 0% 0%',
                //  width:'95%'
              }}
              >
                <div style={{ color: 'white', fontFamily: 'Palatino', color:'white' }}>{person.name}</div>
                <div style={{ color: 'white', fontFamily: 'Palatino', color:'white' }}>{person.price_full}</div>
                <div style={{ color: 'white', fontFamily: 'Palatino', color:'white' }}>{person.price_half}</div>
              </div>
              </div>

                  );
                })}
              </> :
              null}
            {/* end of modification */}
          </div>
        {/* </Card> */}
      </div>
      {/* <br></br> */}


      {/* <HTMLFlipBook width={365} height={500}> */}
      <div className="menu_childdiv">

        {filterCategory.map((data) => (
          <div className="demoPage">
            <span style={{ display: 'flex', alignItems: 'center', textAlign: 'center', justifyContent: 'center',marginTop:'2%' }}>
              <img style={{ border: '1px solid black' }}
                src={siteConfig.siteURL + data.icon}
                className="category_img"
              />&nbsp;
              <h3 style={{ fontFamily: 'Brush Script MT', fontSize: '35px', padding: '1', margin: '0', color: 'white' }}>{data.name}
              
              </h3>
            </span>

            {itemList.filter(i => i.category === data.id).map(m =>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '5% 0% 0% 0%',
                //  width:'95%'
              }}
              >
                <div style={{ color: 'white', fontFamily: 'Palatino' }}>{m.name}</div>
                <div style={{ color: 'white', fontFamily: 'Palatino' }}>{m.price_full}</div>
                <div style={{ color: 'white', fontFamily: 'Palatino' }}>{m.price_half}</div>
                

              </div>
            )}
          </div>
        ))}
      </div>
      {/* </HTMLFlipBook> */}
<div>
      {/* <br /> */}
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
          <div
            style={{ fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', position: 'relative' }}
            className='all-menu'
            onClick={
              e => onMenuChange(data.id)
            }
          >
            <img
              src={siteConfig.siteURL + data.icon}
              className='menu_image'
            />
            <h2
              className='menu_lable'
            >
              {data.name}
            </h2>
          </div>

        ))}
      </Carousel>
</div>
      {/* <Footer/> */}
{/* <br></br> */}



    </div>
    

  );
}
export default MenuItem;

// End of modification