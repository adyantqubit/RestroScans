import React, { useContext, useEffect } from 'react'
import style from './cart.module.css'
import img from "../../../images/desert.jpg"
import { GlobalContext } from '../../../context/Context'
import { useNavigate } from 'react-router-dom'
import config from '../../../config/config'

const Cart = () => {
  const nav=useNavigate()
  const { cart, setCart } = useContext(GlobalContext)

  return (
    <>
      <div className={style.cartContainer}>

        {cart.map(item =>
          <div className={style.card}>
            <img alt="" src={config.siteURL+ item.img} className={style.img} />
            <div className={style.information}>
              <div className={style.title}>{item.name}</div>
              <div className={style.price}>price- {item.price}</div>
              <div>quantity- {item.quantity}</div>
              <div>serve size- {item.serve_size}</div>
            </div>
          </div>
        )}


      </div>
      <div className={style.btnContainer}>
        <button className={style.cancleBtn} onClick={e=>nav(-1)}>Cancel</button>
        <button className={style.ProceedBtn}>Proceed</button>
      </div>
    </>
  )
}

export default Cart