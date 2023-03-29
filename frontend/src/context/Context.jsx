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
        // headingColor: 'aqua',
        // backgroundTheme: 'aqua',
        // subHeadingColor: 'aqua',
        // bannerColor: 'aqua',
        // headingBackgroundColor: 'aqua',
        // subheadingBackgroundColor: 'aqua',

    })

    // Added by yuvraj on 22-1-2023
    // Reason - to set searched value
    var [searchedValue, setSearchedValue] = useState("")
    // End of searched value

    return (
        <>
            <GlobalContext.Provider value={{
                tenantName,
                setTenantName,
                searchedValue,
                setSearchedValue,
                colors,setColors
            }}>
                {props.children}
            </GlobalContext.Provider>
        </>
    )
}