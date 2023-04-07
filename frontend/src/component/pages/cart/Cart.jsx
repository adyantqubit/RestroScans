import React, { useContext, useEffect, useState } from 'react'
import style from './cart.module.css'
import img from "../../../images/desert.jpg"
import { GlobalContext } from '../../../context/Context'
import { useNavigate } from 'react-router-dom'
import config from '../../../config/config'
import { IoMdRemove } from "react-icons/io"
const Cart = () => {
  const nav = useNavigate()
  const [removeProductIndex, setRemoveProductIndex] = useState(null)
  const { cart, setCart, colors } = useContext(GlobalContext)

  return (
    <>
      <div className={style.cartContainer} style={{ color: colors.backgroundTheme }}>
        <div style={{backgroundColor:colors.headingBackgroundColor,color:colors.headingColor}} className={style.cartTitle}>MY CART</div>
        {cart.map((item, i) =>
          <div className={style.card} >
            <RemoveItem removeProductIndex={removeProductIndex} currentIndex={i} setRemoveProductIndex={setRemoveProductIndex} />
              <img alt="" src={config.siteURL + item.img} className={style.img} />
           
            <div className={style.infomation}>

              <div className={style.title} style={{ color: colors.subHeadingColor }}>{item.name}<div className={style.delete}></div></div>
              <div>
                <div className={style.row1}>
                  <div className={style.serve_size} style={{ color: colors.subHeadingColor }}> {item.serve_size}</div>
                  <span className={style.quantityContainer} style={{ color: colors.subHeadingColor }}>
                    <span className={style.sign}>
                      -
                    </span>
                    {item.quantity}
                    <span className={style.sign}>
                      +
                    </span>
                  </span>
                </div>

                <div className={style.row2} style={{ color: colors.subHeadingColor }}>
                <div className={style.price} style={{ color: colors.subHeadingColor }}> {item.price}</div>
                </div>
              </div>
            </div>
          </div>

        )}


      </div>
      <div className={style.btnContainer} style={{ background: colors.headingBackgroundColor, color: colors.subHeadingColor }}>
        <button className={style.cancleBtn} style={{ background: colors.bannerColor, color: colors.subHeadingColor }} onClick={e => nav(-1)}>Cancel</button>
        <button className={style.ProceedBtn} style={{ backgroundColor: colors.bannerColor, color: colors.subHeadingColor }}>Proceed</button>
      </div>
    </>
  )
}

export default Cart


function RemoveItem({ removeProductIndex, currentIndex, setRemoveProductIndex }) {

  const { cart, setCart } = useContext(GlobalContext)

  function removeFromCart() {
    setCart(cart.filter((c, i) => c.id != cart[currentIndex]['id']))
    setRemoveProductIndex(null)
  }

  if (removeProductIndex == currentIndex)
    return (
      <div className={style.removeContainer}>
        <div className={style.warningText}>Are you sure want to remove this item?</div>
        <div className={style.deleteBtnContainer}>
          <button className={style.btn} onClick={removeFromCart}>sure!</button>
          <button className={style.btn} onClick={e => setRemoveProductIndex(null)}>Cancel</button>
        </div>
      </div>
    )
}