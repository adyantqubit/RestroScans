
//

import React, { useContext, useEffect, useState } from 'react';
import style from "./popupItem.module.css";
import { AiOutlineClose } from "react-icons/ai";
import { GlobalContext } from '../../../context/Context';
import siteConfig from "../../../config/config";
import { message } from 'antd';

const PopupItem = ({ item, isDetailPopupOpen, setDetailPopupVisiblity }) => {
    const { colors, cart, setCart } = useContext(GlobalContext)
    const [messageApi, contextHolder] = message.useMessage();
    const [quantity,setQuantity]=useState(1)

    useEffect(() => {
        console.log(item)
    }, [item])

    function closePopup() {
        setDetailPopupVisiblity(!isDetailPopupOpen)
    }

    function AddToCart(size) {

        if (size == "Half Plate")
            var selected_price = item.discounted_half_price;
        else
            var selected_price = item.discounted_full_price;

        const item = {
            id: item.id,
            name: item.name,
            price: selected_price,
            quantity: quantity,
            serve_size: size,
            img: item.icon
        }

        if (cart.filter(c => c.id == item.id && c.serve_size == item.serve_size).length > 0) {
            var cartId = cart.findIndex(c => c.id == item.id)
            cart[cartId].quantity = cart[cartId].quantity +quantity
            setCart(cart)
            localStorage.setItem("cart", JSON.stringify(cart))

            messageApi.open({
                type: 'success',
                content: `Successfully ${cart[cartId].quantity} ${item.name} is added.`,
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
                content: `${item.name} is added successfully.`,
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

                {item ? <div className={style.InformationBox} style={{ backgroundColor: colors.backgroundTheme }}>
                    <div className={style.heading} style={{ color: colors.bannerColor }}>
                        Please select half or full plate
                    </div>
                    <div className={style.detailContainer}>
                        <img className={style.productImg} src={siteConfig.siteURL + item.icon} />
                        <div className={style.titleContainer} >
                            <div className={style.title} style={{ color: colors.headingColor }}>{item.name}</div>
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
                                {item.discounted_half_price}</button> : null}
                        <button className={style.fullSelectionBtn}
                            style={{ backgroundColor: colors.bannerColor, color: colors.subHeadingColor }}
                            onClick={e => AddToCart("Full Plate")}>
                            Full Price <br />
                            {item.discounted_full_price}</button>
                    </div>
                </div> : null}
            </div> : null}
        </>
    )
}

export default PopupItem