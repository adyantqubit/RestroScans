import { useState } from 'react'
import { React, createContext, useContext } from 'react'
// import { getAdminDetailApi, getRecentViwedApi, userProfileView } from '../api/Services'
import { message } from 'antd'
import { useEffect } from 'react'
import secureLocalStorage from "react-secure-storage";
import { gettenantList, postCheckPaymentStatus } from '../api/Services';

export const GlobalContext = createContext()
export const color1 = "#b3ff66";
export const color2 = "#b3ff66";
export const color3 = "#b3ff66";

export default function Context(props) {

    var [tenantName, setTenantName] = useState([])
    var [restaurant_name, setRestaurant_name] = useState("")
    
    // added by rohan kansari - 17/4/23
    // reason - save subscribe plan permissions
    if(secureLocalStorage.getItem('order'))
    var orders = secureLocalStorage.getItem('order');
    var [subscribePlan,setSubscribePlan]=useState(null)
    const [tenantDetails, setTenantDetails] = useState(null); // Our data set in this variable which comes from backend

    var [colors, setColors] = useState({
        headingColor: 'black',
        backgroundTheme: 'white',
        subHeadingColor: 'black',
        bannerColor: '#9b6043',
        headingBackgroundColor: 'white',
        subheadingBackgroundColor: '#fcf4e7',
        // added by rohan- 6/4/23 - To add half price shown functionality
        allow_half_price: true
    })

    // Added by yuvraj on 22-1-2023
    // Reason - to set searched value
    var [searchedValue, setSearchedValue] = useState("")
    // End of searched value

    // Added by rohan - on 6/4/2023
    // Reason - This cart variable save list of item
    var [cart, setCart] = useState([])


    useEffect(() => {
        if (JSON.parse(localStorage.getItem("cart"))) {
            cart = JSON.parse(localStorage.getItem("cart"))
            setCart(JSON.parse(localStorage.getItem("cart")))
        }
        else {
            setCart([])
        }

        // Modified by Rohan -18/4/23
        // reason- to get new tenant detail
        getMenu(localStorage.getItem("tenantName"));
        if(secureLocalStorage.getItem('order'))
        checkPaymentStatus()
        // end of code 18/4/23 -rohan kansari

    }, [])

    // useEffect(()=>{
    //     if(subscribePlan)
    //    secureLocalStorage.setItem("plan",subscribePlan)
    // },[subscribePlan])


    // end of cart variable

    //Added by rohan - on 9/4/23
    //reason - to save restroname globally
    useEffect(() => {
        if (localStorage.getItem("restroName")) {
            restaurant_name = localStorage.getItem("restroName")
            setRestaurant_name(localStorage.getItem("restroName"))
        }

        
    }, [localStorage.getItem("restroName")])
    // end of code - 9/4/23


    // added by -rohan 18/4/23
    // to get all new detail of tenant in each reload
    const getMenu = async (tenant) => {
        const response = await gettenantList(tenant);
        if (response) {
          setTenantDetails(response.tenantDetails);
          setSubscribePlan(response.features_provided)
        }
      };

      const checkPaymentStatus = async () => {
        var tenantName = localStorage.getItem("tenantName")
        const order = {
            order_id: orders.order_id,
        }
        const response = await postCheckPaymentStatus(order, tenantName);
            if (response.order) {
                secureLocalStorage.removeItem('order')
                secureLocalStorage.removeItem('invoice_detail')
                secureLocalStorage.setItem('order',response.order)
                secureLocalStorage.setItem('invoice_detail',response)
        }
       

    }
// end of code - rohan kansari -18/4/23

    return (
        <>
            <GlobalContext.Provider value={{
                tenantName,
                setTenantName,
                searchedValue,
                setSearchedValue,
                colors, setColors,
                cart, setCart,
                restaurant_name, setRestaurant_name,
                subscribePlan,setSubscribePlan,
                tenantDetails
            }}>
                {props.children}
            </GlobalContext.Provider>
        </>
    )
}