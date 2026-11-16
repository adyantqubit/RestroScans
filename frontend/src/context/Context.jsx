import { useState } from 'react'
import { React, createContext, useContext } from 'react'
// Older profile calls lived in the shared services module and are not part of this app.
import { message } from 'antd'
import { useEffect } from 'react'
import secureLocalStorage from "react-secure-storage";
import { gettenantList } from '../screens/Cover/services/coverService';
import { postCheckPaymentStatus } from '../screens/Payment/services/paymentService';
import { useContextState } from "./usestate/contextState";
import { resolveTenantSlug } from '../utils/tenant';

export const GlobalContext = createContext()
export const color1 = "#b3ff66";
export const color2 = "#b3ff66";
export const color3 = "#b3ff66";

export default function Context(props) {
    var { tenantName, setTenantName, restaurant_name, setRestaurant_name, rupee_sign, setRupee_sign, orderItems, setOrderItem, orders, setOrders, subscribePlan, setSubscribePlan, tenantDetails, setTenantDetails, colors, setColors, searchedValue, setSearchedValue, cart, setCart } = useContextState();

    if(secureLocalStorage.getItem('order'))
    var orders = secureLocalStorage.getItem('order');

    useEffect(() => {
        if (JSON.parse(localStorage.getItem("cart"))) {
            cart = JSON.parse(localStorage.getItem("cart"))
            setCart(JSON.parse(localStorage.getItem("cart")))
        }
        else {
            setCart([])
        }

        getMenu(resolveTenantSlug());
        if(secureLocalStorage.getItem('order'))
        checkPaymentStatus()
    }, [])

    useEffect(() => {
        if (localStorage.getItem("restroName")) {
            restaurant_name = localStorage.getItem("restroName")
            setRestaurant_name(localStorage.getItem("restroName"))
        }
    }, [localStorage.getItem("restroName")])

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
            if (response.order!=null) {
                secureLocalStorage.removeItem('order')
                secureLocalStorage.removeItem('invoice_detail')

                if(secureLocalStorage.getItem('customer_details')){
                secureLocalStorage.setItem('order',response.order)
                secureLocalStorage.setItem('invoice_detail',response)
                }
        }
    }

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
                tenantDetails,
                rupee_sign,setRupee_sign,
                orderItems,
                setOrderItem,
                orders,
                setOrders,
            }}>
                {props.children}
            </GlobalContext.Provider>
        </>
    )
}
