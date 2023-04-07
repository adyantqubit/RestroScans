import React, { useContext, useEffect } from 'react'
import style from './cart.module.css'
import img from "../../../images/desert.jpg"
import { GlobalContext } from '../../../context/Context'
import { useNavigate } from 'react-router-dom'
import config from '../../../config/config'

const Cart = () => {
  const nav=useNavigate()
  const { cart, setCart ,colors} = useContext(GlobalContext)

  return (
    <>
      <div className={style.cartContainer} style={{color:colors.backgroundTheme}}>

        {cart.map(item =>
          <div className={style.card}>
            <img alt="" src={config.siteURL+ item.img} className={style.img} />
            <div className={style.infomation}>
              <div className={style.title} style={{color:colors.subHeadingColor}}>{item.name}</div>
              <div className={style.price} style={{color:colors.subHeadingColor}}><span className={style.label} style={{color:colors.subHeadingColor}}>Price-</span> {item.price}</div>
              <div className={style.quantity} style={{color:colors.subHeadingColor}}><span className={style.label} style={{color:colors.subHeadingColor}}>Quantity- </span> {item.quantity}</div>
              <div className={style.serve_size} style={{color:colors.subHeadingColor}}><span className={style.label} style={{color:colors.subHeadingColor}}>Serve size- </span> {item.serve_size}</div>
              <button>Remove</button>
            </div>

          </div>
        )}


      </div>
      <div className={style.btnContainer} style={{background:colors.headingBackgroundColor}}>
        <button className={style.cancleBtn} style={{background:colors.bannerColor}} onClick={e=>nav(-1)}>Cancel</button>
        <button className={style.ProceedBtn} style={{backgroundColor:colors.bannerColor}}>Proceed</button>
      </div>
    </>
  )
}

export default Cart