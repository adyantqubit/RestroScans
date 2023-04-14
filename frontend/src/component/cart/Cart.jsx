// Created on 6/4/23
// reason - This is cart where all added item will show and manipulate


import React, { useContext, useEffect, useState } from 'react'
import style from './cart.module.css'
import img from "../../images/balnkCart.png"
import { GlobalContext } from '../../context/Context'
import { useNavigate } from 'react-router-dom'
import config from '../../config/config'
import PopupDetail from '../MenuItem/PopupDetail'
import CustomerDetailsForm from '../CustomerDetails/CustomerDetailsForm'
import secureLocalStorage from "react-secure-storage";
import { updateOrders } from '../../api/Services';
import vegIcon from '../../images/veg_icon.png'
import nonVegIcon from '../../images/nonveg_icon.png'

const Cart = () => {
  const nav = useNavigate()
  const [isDetailPopupOpen, setDetailPopupVisiblity] = useState(false)
  const [removeProductIndex, setRemoveProductIndex] = useState(null)
  const { cart, setCart, colors } = useContext(GlobalContext)
  const [selectedItem, setSelectedItem] = useState(null)


  // Created by -rohan - 9/4/23
  // reason- this function first find index of pointed item which is getting as a parameter and start decreasing 
  // quantity it will goes up to 1 quantity then one popup confirmation show where it remove the item 
  function decreaseQuantity(selectedItem) {
    var cartId = cart.findIndex(c => c.id == selectedItem.id && c.serve_size == selectedItem.serve_size)
    if (cart[cartId].quantity != 1) {
      cart[cartId].quantity = --selectedItem.quantity
      setCart([...cart])
      localStorage.setItem('cart',JSON.stringify(cart))
    }
    else {
       setRemoveProductIndex(selectedItem)
    }
  }

  {/* Added by :- Parineeta Gedam
      Date :- 11-04-2023
      Reason :- get data from localstroage.
  */}

  var orders = secureLocalStorage.getItem('order');
  var orderItem = secureLocalStorage.getItem('orderItem');
  console.log("orderItems",orderItem)
  {/* End of added code 06-04-2023 */ }

  {/* Added by :- Parineeta Gedam
      Date :- 11-04-2023
      Reason :- update the orders
  */}

  const navigations = async () => {
    const cartData = {
      cart: cart,
      orders:orders.order_id,
      orderItem : orderItem,
    };
    console.log("data",cartData)
    var tenantName = localStorage.getItem("tenantName")
    const response = await updateOrders(tenantName,cartData);
    console.log("res", response)
    navigate('/invoice')
  };

  {/* End of added code 06-04-2023 */ }

   {/* Added by :- Parineeta Gedam
      Date :- 06-04-2023
      Reason :- Open Model for customer details.
  */}

  var [isPopupOpen, setPopupVisiblity] = useState(false)

  const navigate = useNavigate();

  const showModal = () => {
    setPopupVisiblity(true);
  };

  {/* End of added code 06-04-2023 */ }

  return (
    <>
      <PopupDetail item={selectedItem} isDetailPopupOpen={isDetailPopupOpen} setDetailPopupVisiblity={setDetailPopupVisiblity} />

      <div className={style.cartContainer} style={{ color: colors.backgroundTheme }}>
        <div style={{ backgroundColor: colors.headingBackgroundColor, color: colors.headingColor }} className={style.cartTitle}>MY CART</div>
        {cart.length > 0 ? cart.map((item, i) =>
          <div className={style.card} >
            <RemoveItem removeProductIndex={removeProductIndex} currentIndex={item} setRemoveProductIndex={setRemoveProductIndex} />
            <div className={style.imgContainer}>
              <img alt="" src={config.siteURL + item.icon} className={style.img} />
              {item.item_type == "Veg" ?
                <img alt="" src={vegIcon} className={style.type_img} />
                :
                <img alt="" src={nonVegIcon} className={style.type_img} />}
            </div>

            <div className={style.infomation}>

              <div className={style.title} style={{ color: colors.subHeadingColor }}>{item.name}<div className={style.delete}></div></div>
              <div className={style.row1}>
                <div className={style.serve_size} style={{ color: colors.subHeadingColor }}> {item.serve_size}</div>
                <div className={style.price} style={{ color: colors.subHeadingColor }}>₹ {item.price}</div>
              </div>

              <div className={style.row2} style={{ color: colors.subHeadingColor }}>
                <span className={style.quantityContainer} style={{ color: colors.subHeadingColor }}>
                  <span className={style.sign} onClick={e => decreaseQuantity(item)}>
                    -
                  </span>
                  {item.quantity}
                  <span className={style.sign} onClick={e => { setDetailPopupVisiblity(true); setSelectedItem(item) }}>
                    +
                  </span>
                </span>
              </div>
            </div>
          </div>

        ) : <BlankPage />}


      </div>

      {cart.length > 0 ? <div className={style.btnContainer} style={{ background: colors.headingBackgroundColor, color: colors.subHeadingColor }}>
        <button className={style.cancleBtn} style={{ background: colors.bannerColor, color: colors.backgroundTheme }} onClick={e => nav(-1)}>Cancel</button>
           {/* Commented by :- Parineeta Gedam
            Date :- 06-04-2023
            Reason :- Open Model for customer details.
        */}
        {/* <button className={style.ProceedBtn} style={{ backgroundColor: colors.bannerColor, color: colors.subHeadingColor }}>Proceed</button> */}
        {/* End of added code 06-04-2023 */}

          {/* Added by :- Parineeta Gedam
            Date :- 06-04-2023
            Reason :- Open Model for customer details.
        */}

        <button className={style.ProceedBtn} style={{ backgroundColor: colors.bannerColor, color: colors.backgroundTheme }} onClick={e => {!orders ? showModal() : navigations()}} >Proceed</button>
        
        <CustomerDetailsForm setPopupVisiblity={setPopupVisiblity} isPopupOpen={isPopupOpen} />
        {/* End of added code 06-04-2023 */}
      </div> : null}
    </>
  )
}

export default Cart



// Created on 8/4/23 - Rohan 
// reason-This function show one remove item confirmation
function RemoveItem({ removeProductIndex, currentIndex, setRemoveProductIndex }) {

  const { cart, setCart } = useContext(GlobalContext)

  function removeFromCart() {
    var itemIndex = cart.findIndex(c => c.id == removeProductIndex.id && c.serve_size == removeProductIndex.serve_size)
    setCart(elementRemover(itemIndex, cart))
    setRemoveProductIndex(null)
    localStorage.setItem("cart", JSON.stringify(elementRemover(itemIndex, cart)))
  }

  function elementRemover(specificIndex, list) {
    var temp = [];
    for (var i = 0; i < list.length; i++) {
      if (i != specificIndex)
        temp.push(list[i])
    }

    return temp
  }

  if (removeProductIndex && removeProductIndex.id == currentIndex.id && removeProductIndex.serve_size == currentIndex.serve_size)
    return (
      <div className={style.removeContainer}>
        <div className={style.warningText} >Are you sure want to remove this item?</div>
        <div className={style.deleteBtnContainer}>
          <button className={style.btn} onClick={removeFromCart}>sure!</button>
          <button className={style.btn} onClick={e => setRemoveProductIndex(null)}>Cancel</button>
        </div>
      </div>
    )
}


// Created on 8/4/23 - Rohan 
// reason-This function return blank page ui 
function BlankPage() {
  const nav = useNavigate()
  const { colors } = useContext(GlobalContext)
  return <div className={style.blankPageContainer}>
    <div className={style.blankImgContainer}>
      <img alt="" src={img} className={style.blankImg} />
    </div>
    <div className={style.blankText} style={{ color: colors.subHeadingColor }}>
      No item is added currently !
    </div>
    <div className={style.blankBtnContainer} >
      <button className={style.blankBtn} style={{ color: colors.subHeadingColor, background: colors.bannerColor }} onClick={e => nav(-1)}>Browse Menu</button>
    </div>
  </div>
}