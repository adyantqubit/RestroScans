import { useContext } from "react"
import secureLocalStorage from "react-secure-storage"
import { GlobalContext } from "../../context/Context"


export function TenantValidate() {
    const {restaurant_name,setCart}=useContext(GlobalContext)

    console.log('------------------------------',secureLocalStorage.getItem("customer_details"),restaurant_name)

    // This will run check id any billing detail is present and another tenant is scanned by same use then it will clear all history of
    if (secureLocalStorage.getItem("customer_details") && restaurant_name.length>0){
        console.log('conditionSatisfied-----------customer',secureLocalStorage.getItem("customer_details").tenant ,restaurant_name)
        if (secureLocalStorage.getItem("customer_details").tenant != restaurant_name || secureLocalStorage.getItem("order").payment_status=="Completed" ) {
            console.log("deleted all customer--------------**************************************")
            localStorage.setItem("cart", JSON.stringify([]))
            setCart([])
            secureLocalStorage.removeItem("invoice_detail")
            secureLocalStorage.removeItem("customer_details")
            secureLocalStorage.removeItem("order")
            secureLocalStorage.removeItem("orderItem")

        }

    }

    // console.log("run second validation--------------",localStorage.getItem("cart"))
    if(JSON.parse(localStorage.getItem("cart")))
    if (JSON.parse(localStorage.getItem("cart")).length>0 && restaurant_name?.length>0){
        console.log('conditionSatisfied',JSON.parse(localStorage.getItem("cart"))[0],restaurant_name)
        if (JSON.parse(localStorage.getItem("cart"))[0]?.tenant != restaurant_name) {
            // console.log("-------------deleted all***************************************")
            localStorage.setItem("cart", JSON.stringify([]))
            setCart([])
            secureLocalStorage.removeItem("invoice_detail")
            secureLocalStorage.removeItem("customer_details")
            secureLocalStorage.removeItem("order")
            secureLocalStorage.removeItem("orderItem")

        }

    }


}