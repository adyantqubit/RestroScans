import { useState } from "react";

export function useContextState() {
  var [tenantName, setTenantName] = useState([])
  var [restaurant_name, setRestaurant_name] = useState("")
  var [rupee_sign,setRupee_sign]=useState('₹')
  var [orderItems, setOrderItem] = useState([])
  var [orders, setOrders] = useState([])
  var [subscribePlan,setSubscribePlan]=useState(null)
  const [tenantDetails, setTenantDetails] = useState(null); // Our data set in this variable which comes from backend
  var [colors, setColors] = useState({
          headingColor: 'black',
          backgroundTheme: 'white',
          subHeadingColor: 'black',
          bannerColor: '#9b6043',
          headingBackgroundColor: 'white',
          subheadingBackgroundColor: '#fcf4e7',
          allow_half_price: true,
          card_color:"#f7f7f7"
      })
  var [searchedValue, setSearchedValue] = useState("")
  var [cart, setCart] = useState([])
  return { tenantName, setTenantName, restaurant_name, setRestaurant_name, rupee_sign, setRupee_sign, orderItems, setOrderItem, orders, setOrders, subscribePlan, setSubscribePlan, tenantDetails, setTenantDetails, colors, setColors, searchedValue, setSearchedValue, cart, setCart };
}
