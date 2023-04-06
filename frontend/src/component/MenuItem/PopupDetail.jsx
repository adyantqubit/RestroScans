//

import React, { useContext, useEffect } from 'react'
import style from "./popupDetail.module.css"
import { AiOutlineClose } from "react-icons/ai"
import { GlobalContext } from '../../context/Context'
import img from "../../images/desert.jpg"
import siteConfig from "../../config/config";

const PopupDetail = ({ detail }) => {
    const { colors, cart, setCart } = useContext(GlobalContext)
    useEffect(() => {
        console.log(detail)
        if (JSON.parse(localStorage.getItem("cart")))
            setCart(JSON.parse(localStorage.getItem("cart")))
        else
            setCart([])
    }, [detail])

    function closePopup() {
        document.getElementById("detailModel").style.display = "none"
    }

    function AddToCart(size) {
        if (size == "Half Plate")
            var selected_price = detail.discounted_half_price;
        else
            var selected_price = detail.discounted_full_price;
        const item = {
            id: detail.id,
            name: detail.name,
            price: selected_price,
            quantity: 1,
            serve_size: size,
            img: detail.icon
        }

        if (cart.filter(c => c.id == item.id && c.serve_size == item.serve_size).length > 0) {

        }
        else {
            setCart([...cart, item])
            localStorage.setItem("cart", JSON.stringify([...cart, item]))
        }
        document.getElementById("detailModel").style.display = "none"
    }

    return (
        <div className={style.popupContainer} id="detailModel">
            <div className={style.closeContainer}>
                <AiOutlineClose size={30} style={{ color: "#fff", margin: "auto 0" }} onClick={closePopup} />
            </div>

            {detail ? <div className={style.InformationBox} style={{ backgroundColor: colors.backgroundTheme }}>
                <div className={style.heading} style={{ color: colors.bannerColor }}>
                    Please select half or full plate
                </div>
                <div className={style.detailContainer}>
                    <img className={style.productImg} src={siteConfig.siteURL + detail.icon} />
                    <div className={style.title} style={{ color: colors.headingColor }}>Sweet product for dessert</div>
                </div>

                <div className={style.buttonContainer}>
                    <button className={style.halfSelectionBtn}
                        style={{ backgroundColor: colors.bannerColor, color: colors.subHeadingColor }}
                        onClick={e => AddToCart("Half Plate")}>
                        Half Price<br />
                        {detail.discounted_half_price}</button>
                    <button className={style.fullSelectionBtn}
                        style={{ backgroundColor: colors.bannerColor, color: colors.subHeadingColor }}
                        onClick={e => AddToCart("Full Plate")}>
                        Full Price <br />
                        {detail.discounted_full_price}</button>
                </div>
            </div> : null}
        </div>
    )
}

export default PopupDetail