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

    return (
        <>
            <GlobalContext.Provider value={{
                tenantName,
                setTenantName
            }}>
                {props.children}
            </GlobalContext.Provider>
        </>
    )
}