import React, { useContext, useEffect, useState } from 'react'
import { applyPlateQuantity, quantityInCart, removeCartLine } from '../../../Cart/services/cartService'
import style from "../style/popupDetail.module.css"
import { AiOutlineClose } from "react-icons/ai"
import { GlobalContext } from '../../../../context/Context'
import { message } from 'antd';
import config from '../../../../config/config'
import vegIcon from '../../../../images/veg_icon.png'
import nonVegIcon from '../../../../images/nonveg_icon.png'
import {
    RadiusUprightOutlined,
  } from '@ant-design/icons';
import { usePopupDetailState } from "../../usestate/popupDetailState";

  import { Button, Divider, notification, Space } from 'antd';
const PopupDetail = ({ item, isDetailPopupOpen, setDetailPopupVisiblity,bestSeller }) => {
    const { colors, cart, setCart,restaurant_name,rupee_sign } = useContext(GlobalContext)
    var { quantityhalf, setQuantityHalf, quantityFull, setQuantityFull, sizeSelected, setSizeSlelected } = usePopupDetailState();

    if (typeof item?.item_name != "undefined"){
        item['id']=item.item_id
        item['name']=item.item_name
        item['icon']=item.item_image
    }

    useEffect(() => {
        // whenever diffrent item is selected it reset the current quantity of item from cart
        if (item) {
            setQuantityFull(CurrentAddedQuantity("Full Plate"))
            setQuantityHalf(CurrentAddedQuantity("Half Plate"))
        }
    }, [item,isDetailPopupOpen])

    function closePopup() {
        setDetailPopupVisiblity(!isDetailPopupOpen)
    }

    function AddItemToCart() {
        var cartTemp = cart

        var historyCart=JSON.parse(localStorage.getItem("cart"))

        var fullPlate = applyPlateQuantity(cartTemp, item, quantityFull, "Full Plate", item.discounted_full_price, restaurant_name, bestSeller)
        cartTemp = fullPlate.cart
        if (fullPlate.notice) {
            setCart(fullPlate.cart)
            notify(fullPlate.notice)
        }

        var halfPlate = applyPlateQuantity(cartTemp, item, quantityhalf, "Half Plate", item.discounted_half_price, restaurant_name, bestSeller)
        cartTemp = halfPlate.cart
        if (halfPlate.notice) {
            setCart(halfPlate.cart)
            notify(halfPlate.notice)
        }

        if(JSON.stringify(historyCart) == JSON.stringify(cartTemp)){
            notify("Please add quantity","error")
        }else{
            localStorage.setItem("cart", JSON.stringify(cartTemp))
            setDetailPopupVisiblity(!isDetailPopupOpen)
        }
    }

    function CurrentAddedQuantity(size) {
        var quantity = quantityInCart(cart, item.id, size)
        if (quantity != null) {
            return quantity
        }
        if (size == "Full Plate") {
            setQuantityFull(0)
            return 0
        }
        setQuantityHalf(0)
        return 0
    }

    function decreamentQuantiy(size) {
        if (size == "Full Plate") {
            if (quantityFull != 1 && quantityFull != 0) {
                setQuantityFull(--quantityFull)
            } else {
                if (cart.findIndex(c => c.id == item.id && c.serve_size == "Full Plate") != -1)
                    setSizeSlelected("Full Plate")
                else
                    if (quantityFull != 0) {
                        setQuantityFull(--quantityFull)
                    }
            }
        }
        else {
            if (quantityhalf != 1 && quantityhalf != 0) {
                setQuantityHalf(--quantityhalf)
            } else {
                if (cart.findIndex(c => c.id == item.id && c.serve_size == "Half Plate") != -1)
                    setSizeSlelected("Half Plate")
                else
                    if (quantityhalf != 0)
                        setQuantityHalf(--quantityhalf)
            }
        }
    }

    const [api, contextHolder] =notification.useNotification()

    function notify(msg,error) {
            if(error=="error"){
                api.warning({
                    message: `${msg} `,
                  RadiusUprightOutlined,
                  duration:3,
                  style:{
                      top:"25px",
                      background:colors.subheadingBackgroundColor,
                      color:colors.subHeadingColor
                  },

                    key: 1,
                  })
            }
            else
            api.success({
              message: `${msg} `,
            RadiusUprightOutlined,
            duration:3,
            style:{
                top:"25px",
                background:colors.subheadingBackgroundColor,
                color:colors.subHeadingColor
            },

              key: 1,
            })
    }

    return (
        <>
            {contextHolder}
            {isDetailPopupOpen && (item.discounted_full_price>0 || (colors.allow_half_price && item.discounted_half_price>0))?
            <div className={`${style.popupContainer} ${isDetailPopupOpen ? style.fade : null}`} id="detailModel">
                <div className={style.closeContainer}>
                    <AiOutlineClose size={30} style={{ color: "#fff", margin: "auto 0" }} onClick={closePopup} />
                </div>

                {item ? <div className={style.InformationBox} style={{ backgroundColor: colors.backgroundTheme }}>
                    <div className={style.heading} style={{ color: colors.bannerColor }}>
                        Please select quantity
                    </div>
                    <div className={style.detailContainer}>
                    {item.discounted_full_price>0?<div className={style.card} >
                            <RemoveItem item={item} size={sizeSelected} currentSize="Full Plate" setSizeSlelected={setSizeSlelected} setQuantityFull={setQuantityFull} />
                            {bestSeller?.filter(b=>b.item==item.id).length>0?<div className={style.ribbon}>Best Seller</div>:null}

                            <div className={style.imgContainer}>
                                <img alt="" src={config.siteURL + item.icon} className={style.img} />
                                {item.item_type == "Veg" ?
                                    <img alt="" src={vegIcon} className={style.type_img} />
                                    :
                                    item.item_type == "Other"?null:
                                    <img alt="" src={nonVegIcon} className={style.type_img} />}
                            </div>
                            <div className={style.infomation}>

                                <div className={style.title} style={{ color: colors.subHeadingColor }}>{item.name}<div className={style.delete}></div></div>
                                <div>
                                    <div className={style.row1}>
                                        <div className={style.serve_size} style={{ color: colors.subHeadingColor }}>Full </div>
                                        <div className={style.price} style={{ color: colors.subHeadingColor }}>{rupee_sign} {item.discounted_full_price}</div>

                                    </div>

                                    <div className={style.row2} style={{ color: colors.subHeadingColor }}>
                                        <span className={style.quantityContainer} style={{ color: colors.subHeadingColor }}>
                                            <span className={style.sign} onClick={e => { decreamentQuantiy("Full Plate") }}>

                                            </span>
                                            <div className={style.quantityText}>{quantityFull}</div>
                                            <span className={style.signPlus} onClick={e => { setQuantityFull(++quantityFull) }}>
                                                +
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>:null}
                        {item.discounted_half_price>0 && colors.allow_half_price ? <div className={style.card} >
                            <RemoveItem item={item} size={sizeSelected} currentSize="Half Plate" setSizeSlelected={setSizeSlelected} setQuantityHalf={setQuantityHalf} />
                            {bestSeller?.filter(b=>b.item==item.id).length>0?<div className={style.ribbon}>Best Seller</div>:null}
                            <div className={style.imgContainer}>
                                <img alt="" src={config.siteURL + item.icon} className={style.img} />
                                {item.item_type == "Veg" ?
                                    <img alt="" src={vegIcon} className={style.type_img} />
                                    :
                                    item.item_type == "Other"?null:
                                    <img alt="" src={nonVegIcon} className={style.type_img} />}
                            </div>
                            <div className={style.infomation}>

                                <div className={style.title} style={{ color: colors.subHeadingColor }}>{item.name}<div className={style.delete}></div></div>
                                <div>
                                    <div className={style.row1}>
                                        <div className={style.serve_size} style={{ color: colors.subHeadingColor }}>Half </div>
                                        <div className={style.price} style={{ color: colors.subHeadingColor }}>{rupee_sign} {item.discounted_half_price}</div>

                                    </div>

                                    <div className={style.row2} style={{ color: colors.subHeadingColor }}>
                                        <span className={style.quantityContainer} style={{ color: colors.subHeadingColor }}>
                                            <span className={style.sign} onClick={e => { decreamentQuantiy("Half Plate") }}>

                                            </span>
                                            <div className={style.quantityText}>{quantityhalf}</div>
                                            <span className={style.signPlus} onClick={e => { setQuantityHalf(++quantityhalf) }}>
                                                +
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div> :

                            null
                        }
                    </div>

                    <div className={style.buttonContainer}>
                        <button className={style.fullSelectionBtn}
                            style={{ backgroundColor: colors.bannerColor, color: colors.backgroundTheme }}
                            onClick={AddItemToCart}
                        >
                            Add
                        </button>
                    </div>
                </div> : null}
            </div> : setDetailPopupVisiblity(false)}
        </>
    )
}

export default PopupDetail

function RemoveItem({ item, size, currentSize, setSizeSlelected, setQuantityFull, setQuantityHalf }) {
    const { cart, setCart } = useContext(GlobalContext)

    function removeFromCart() {
        var nextCart = removeCartLine(cart, { id: item.id, serve_size: size })
        setCart(nextCart)
        localStorage.setItem("cart", JSON.stringify(nextCart))
        setSizeSlelected(null)

        // set quantity of selected size
        if (size == "Full Plate") {
            setQuantityFull(0)
        }
        else {
            setQuantityHalf(0)
        }
    }

    if (currentSize == size)
        return (
            <div className={style.removeContainer}>
                <div className={style.warningText} >Are you sure want to remove this item?</div>
                <div className={style.deleteBtnContainer}>
                    <button className={style.btn} onClick={removeFromCart}>Yes</button>
                    <button className={style.btn} onClick={e => { setSizeSlelected(null) }}>No</button>
                </div>
            </div>
        )
}
