import { useContext } from "react"
import secureLocalStorage from "react-secure-storage"
import { GlobalContext } from "../../context/Context"

export function TenantValidate() {
    const {restaurant_name,setCart}=useContext(GlobalContext)

    if (secureLocalStorage.getItem("customer_details") && restaurant_name.length>0){
        if (secureLocalStorage.getItem("customer_details")?.tenant != restaurant_name || secureLocalStorage.getItem("order")?.payment_status=="Completed" ) {
            localStorage.setItem("cart", JSON.stringify([]))
            setCart([])
            secureLocalStorage.removeItem("invoice_detail")
            secureLocalStorage.removeItem("customer_details")
            secureLocalStorage.removeItem("order")
            secureLocalStorage.removeItem("orderItem")
        }
    }

    if(JSON.parse(localStorage.getItem("cart")))
    if (JSON.parse(localStorage.getItem("cart"))?.length>0 && restaurant_name?.length>0){
        if (JSON.parse(localStorage.getItem("cart"))[0]?.tenant != restaurant_name) {
            localStorage.setItem("cart", JSON.stringify([]))
            setCart([])
            secureLocalStorage.removeItem("invoice_detail")
            secureLocalStorage.removeItem("customer_details")
            secureLocalStorage.removeItem("order")
            secureLocalStorage.removeItem("orderItem")
        }
    }
}
