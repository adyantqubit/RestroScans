//

import React, { useContext, useEffect, useState } from 'react'
import style from "./popupDetail.module.css"
import { AiOutlineClose } from "react-icons/ai"
import { GlobalContext } from '../../context/Context'
import img from "../../images/desert.jpg"
import siteConfig from "../../config/config";
import { message } from 'antd';

const PopupDetail = ({ detail, isDetailPopupOpen, setDetailPopupVisiblity }) => {
    const { colors, cart, setCart } = useContext(GlobalContext)
    const [messageApi, contextHolder] = message.useMessage();
    const [quantity,setQuantity]=useState(1)

    useEffect(() => {
        console.log(detail)
    }, [detail])

    function closePopup() {
        setDetailPopupVisiblity(!isDetailPopupOpen)
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
            quantity: quantity,
            serve_size: size,
            img: detail.icon
        }

        if (cart.filter(c => c.id == item.id && c.serve_size == item.serve_size).length > 0) {
            var cartId = cart.findIndex(c => c.id == item.id)
            cart[cartId].quantity = cart[cartId].quantity +quantity
            setCart(cart)
            localStorage.setItem("cart", JSON.stringify(cart))

            messageApi.open({
                type: 'success',
                content: `Successfully ${cart[cartId].quantity} ${detail.name} is added.`,
                className: 'custom-class',
                style: {
                    marginTop: '5vh',
                    fontSize: "16px",
                    letterSpacing: "1.3px",
                    fontFamily: "Times News Roman",
                    color: colors.headingColor,
                },
                key: 1
            });
            console.log("cart added ---------------------if")
        }
        else {
            setCart([...cart, item])
            localStorage.setItem("cart", JSON.stringify([...cart, item]))

            messageApi.open({
                type: 'success',
                content: `${detail.name} is added successfully.`,
                className: 'custom-class',
                style: {
                    marginTop: '5vh',
                    fontSize: "16px",
                    letterSpacing: "1.3px",
                    fontFamily: "Times News Roman",
                    color: colors.headingColor,
                },
            });

        }
        setDetailPopupVisiblity(!isDetailPopupOpen)
    }


    return (
        <>
            {contextHolder}
            {isDetailPopupOpen ? <div className={`${style.popupContainer} ${isDetailPopupOpen ? style.fade : null}`} id="detailModel">
                <div className={style.closeContainer}>
                    <AiOutlineClose size={30} style={{ color: "#fff", margin: "auto 0" }} onClick={closePopup} />
                </div>

                {detail ? <div className={style.InformationBox} style={{ backgroundColor: colors.backgroundTheme }}>
                    <div className={style.heading} style={{ color: colors.bannerColor }}>
                        Please select half or full plate
                    </div>
                    <div className={style.detailContainer}>
                        <img className={style.productImg} src={siteConfig.siteURL + detail.icon} />
                        <div className={style.titleContainer} >
                            <div className={style.title} style={{ color: colors.headingColor }}>{detail.name}</div>
                            <span className={style.quantityContainer} style={{ color: colors.subHeadingColor }}>
                                <span className={style.sign} onClick={e=>{if(quantity!=1)setQuantity(quantity-1)}}>
                                    -
                                </span>
                                {quantity}
                                <span className={style.sign} onClick={e=>setQuantity(quantity+1)}>
                                    +
                                </span>
                            </span>
                        </div>
                    </div>

                    <div className={style.buttonContainer}>
                        {colors.allow_half_price ?
                            <button className={style.halfSelectionBtn}
                                style={{ backgroundColor: colors.bannerColor, color: colors.subHeadingColor }}
                                onClick={e => AddToCart("Half Plate")}>
                                Half Price<br />
                                {detail.discounted_half_price}</button> : null}
                        <button className={style.fullSelectionBtn}
                            style={{ backgroundColor: colors.bannerColor, color: colors.subHeadingColor }}
                            onClick={e => AddToCart("Full Plate")}>
                            Full Price <br />
                            {detail.discounted_full_price}</button>
                    </div>
                </div> : null}
            </div> : null}
        </>
    )
}

export default PopupDetail