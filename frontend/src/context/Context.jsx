import { useState } from 'react'
import { React, createContext, useContext } from 'react'
// import { getAdminDetailApi, getRecentViwedApi, userProfileView } from '../api/Services'
import { message } from 'antd'
import { useEffect } from 'react'

export const GlobalContext = createContext()
export const color1 = "#b3ff66";
export const color2 = "#b3ff66";
export const color3 = "#b3ff66";

export default function Context(props) {
    
    var [tenantName, setTenantName]=useState([])
    var [colors,setColors] = useState({
        headingColor: 'black',
        backgroundTheme: 'white',
        subHeadingColor: 'black',
        bannerColor: '#9b6043',
        headingBackgroundColor: '#f2f2f2',
        subheadingBackgroundColor: '#fcf4e7',
        // added by rohan- 6/4/23 - To add half price shown functionality
        allow_half_price:true
    })

    // Added by yuvraj on 22-1-2023
    // Reason - to set searched value
    var [searchedValue, setSearchedValue] = useState("")
    // End of searched value

    // Added by rohan - on 6/4/2023
    // Reason - This cart variable save list of item
    var [cart,setCart]=useState([])

    useEffect(()=>{
    if(JSON.parse(localStorage.getItem("cart"))){
        setCart(JSON.parse(localStorage.getItem("cart")))
    }
    else{
        setCart([])
    }
    },[])
    // end of cart variable

    return (
        <>
            <GlobalContext.Provider value={{
                tenantName,
                setTenantName,
                searchedValue,
                setSearchedValue,
                colors,setColors,
                cart,setCart
            }}>
                {props.children}
            </GlobalContext.Provider>
        </>
    )
}