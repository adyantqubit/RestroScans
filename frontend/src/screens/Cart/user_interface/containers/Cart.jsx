import React, { useContext, useEffect, useState } from 'react'
import style from '../style/cart.module.css'
import { GlobalContext } from '../../../../context/Context'
import { useNavigate } from 'react-router-dom'
import config from '../../../../config/config'
import PopupDetail from '../../../Menu/user_interface/components/PopupDetail'
import CustomerDetailsForm from '../../../Customer/user_interface/components/CustomerDetailsForm'
import secureLocalStorage from "react-secure-storage";
import { updateOrdersApi, decreaseCartLine, cartSubtotal, plateLabel, removeCartLine, orderUpdatePayload } from '../../services/cartService';
import vegIcon from '../../../../images/veg_icon.png'
import nonVegIcon from '../../../../images/nonveg_icon.png'
import {BiArrowBack} from 'react-icons/bi'
import { TenantValidate } from '../../../../components/Validators/ConfirmTenant'
import empty_cart_img from "../../../../images/empty_cart_img.png"
import blankCart from "../../../../images/blankCart.png"

import { useCartState } from "../../usestate/cartState";
import { useBlankPageState } from "../../usestate/blankPageState";

const Cart = () => {
  TenantValidate()
  const nav = useNavigate()
  var { isDetailPopupOpen, setDetailPopupVisiblity, removeProductIndex, setRemoveProductIndex, selectedItem, setSelectedItem, isPopupOpen, setPopupVisiblity } = useCartState();
    const { cart, setCart, colors,rupee_sign } = useContext(GlobalContext)

  function decreaseQuantity(selectedItem) {
    var next = decreaseCartLine(cart, selectedItem)
    if (next.askRemove) {
      setRemoveProductIndex(next.askRemove)
      return
    }
    setCart(next.cart)
    localStorage.setItem('cart', JSON.stringify(cart))
  }

  {}

  var orders = secureLocalStorage.getItem('order');
  var orderItem = secureLocalStorage.getItem('orderItem');

  { }

  {}

  const navigations = async () => {
    const cartData = orderUpdatePayload(cart, orders, orderItem);
    var tenantName = localStorage.getItem("tenantName")
    const response = await updateOrdersApi(tenantName, cartData);
    if (response) {
        if(secureLocalStorage.getItem("order") && secureLocalStorage.getItem("orderItem")){
          secureLocalStorage.removeItem('order');
          secureLocalStorage.removeItem('orderItem');
          secureLocalStorage.setItem("order", response.order)
          secureLocalStorage.setItem("orderItem", response.orderItemSerializer)

          localStorage.removeItem('cart');
          setCart([]);
        }
        else{
          secureLocalStorage.setItem("order", response.order)
          secureLocalStorage.setItem("orderItem", response.orderItemSerializer)
        }
    }
    navigate('/order')
  };

  { }

   {}

  const navigate = useNavigate();

  const showModal = () => {
    setPopupVisiblity(true);
  };

  { }

  function itemsSubtotal(){
    return cartSubtotal(cart)
  }

  function TrimPlate(size){
    return plateLabel(size)
  }

  return (
    <>
      <PopupDetail item={selectedItem} isDetailPopupOpen={isDetailPopupOpen} setDetailPopupVisiblity={setDetailPopupVisiblity} />

      <div className={style.cartContainer} style={{ color: colors.backgroundTheme }}>
        <div style={{ color: colors.headingColor }} className={style.cartTitle}>
        <BiArrowBack onClick={e=>nav("/menu-item")}/>
        <div className={style.title_length}>MY CART ({cart.length})</div></div>

        {cart.length > 0 ? cart.toReversed().map((item, i) =>
          <div className={style.card} >
            <RemoveItem removeProductIndex={removeProductIndex} currentIndex={item} setRemoveProductIndex={setRemoveProductIndex} />

            <div className={style.imgContainer}>
            {item.best?<div className={style.ribbon}>Best Seller</div>:null}
              <img alt="" src={config.siteURL + item.icon} className={style.img} />
              {item.item_type == "Veg" ?
                <img alt="" src={vegIcon} className={style.type_img} />
                :
                item.item_type == "Other"?null:
                <img alt="" src={nonVegIcon} className={style.type_img} />}
            </div>
            <div className={style.infomation}>

              <div className={style.title} style={{ color: colors.subHeadingColor }}>{item.name}<div className={style.delete}></div></div>
              <div className={style.row1}>
                <div className={style.serve_size} style={{ color: colors.subHeadingColor }}> {TrimPlate(item.serve_size)}</div>

                <span className={style.quantityContainer} style={{ color: colors.subHeadingColor }}>
                  <div className={style.sign} onClick={e => decreaseQuantity(item)}>

                  </div>
                  <div className={style.quantityText}>{item.quantity}</div>
                  <div className={style.signPlus} onClick={e => { setDetailPopupVisiblity(true); setSelectedItem(item) }}>
                    +
                  </div>
                </span>
              </div>

              <div className={style.row2} style={{ color: colors.subHeadingColor }}>
              <div className={style.price} style={{ color: colors.subHeadingColor,justifyContent:"flex-start" }}>{rupee_sign}  {item.price}</div>

              <div className={style.price} style={{ color: colors.subHeadingColor }}>{rupee_sign}  {(item.price*item.quantity).toFixed(2)}</div>

              </div>
            </div>
          </div>
        ) : <BlankPage />}

      </div>

      {cart.length > 0 ? <div className={style.btnContainer} style={{background:colors.backgroundTheme, color: colors.subHeadingColor }}>
        <div className={style.subTotal}><div className={style.label}>Sub total :</div><div className={style.text}>{rupee_sign}  {itemsSubtotal().toFixed(2)}</div></div>

        <div className={style.flex}>
          <button className={style.cancleBtn} style={{ background: colors.bannerColor, color: colors.backgroundTheme }} onClick={e => nav(-1)}>Back</button>

          <button className={style.ProceedBtn} style={{ background: colors.bannerColor, color: colors.backgroundTheme }} onClick={e => { !orders ? showModal() : navigations() }} >Proceed</button>
        </div>
        <CustomerDetailsForm setPopupVisiblity={setPopupVisiblity} isPopupOpen={isPopupOpen} />
      </div> : null}
    </>
  )
}

export default Cart

function RemoveItem({ removeProductIndex, currentIndex, setRemoveProductIndex }) {
  const { cart, setCart,rupee_sign } = useContext(GlobalContext)

  function removeFromCart() {
    var nextCart = removeCartLine(cart, removeProductIndex)
    setCart(nextCart)
    setRemoveProductIndex(null)
    localStorage.setItem("cart", JSON.stringify(nextCart))
  }

  if (removeProductIndex && removeProductIndex.id == currentIndex.id && removeProductIndex.serve_size == currentIndex.serve_size)
    return (
      <div className={style.removeContainer}>
        <div className={style.warningText} >Are you sure want to remove this item?</div>
        <div className={style.deleteBtnContainer}>
          <button className={style.btn} onClick={removeFromCart}>Yes</button>
          <button className={style.btn} onClick={e => setRemoveProductIndex(null)}>No</button>
        </div>
      </div>
    )
}

function BlankPage() {
  {}

  var orders = secureLocalStorage.getItem('order');
  var { orderItems, setOrderItem } = useBlankPageState();

  useEffect(() => {
    setOrderItem(secureLocalStorage.getItem('orderItem'));
  }, [])

  const goToOrderDetails = () => {
   nav('/order')
  };

  { }

  const nav = useNavigate()
  const { colors } = useContext(GlobalContext)
  return (
    <div className={style.blankContainer}>

      <div className={style.blankPageContainer}>
        <div className={style.blankImgContainer}>
          <img alt="" src={blankCart} className={style.blankImg} />
          {/* End of modified  */}
        </div>
        <div className={style.blankText} style={{ color: colors.subHeadingColor }}>
        Please add delicious dishes from menu
        </div>
        <div className={style.blankBtnContainer} >
          <button className={style.blankBtn} style={{ color: colors.backgroundTheme, background: colors.bannerColor }} onClick={e => nav("/menu-item")}>Browse Menu</button>
        </div>
      </div>

      {orderItems && orderItems.filter(dt=>dt.item_status == "Pending" || dt.item_status == "Confirm").length > 0 ?
      <>
      { orders ?
      <>
        <div className={style.blankText} style={{ color: colors.subHeadingColor,marginTop:"25px" }}>
        Please tap to see your current order
        </div>
      <div className={style.orderDetailsContainer} onClick={e => goToOrderDetails() }>
      <div className={style.cartTableHeadingContainer}>
        <div className={style.cartDataContainer}>
          <div className={style.orderIdHeadingContainer}>
            <span className={style.cartHeading} style={{ color: colors.subHeadingColor }}>Order Id</span>
          </div>
          <div className={style.tableNoHeadingContainer}>
            <span className={style.cartHeading} style={{ color: colors.subHeadingColor }}>Table Number</span>
          </div>
          <div className={style.totalHeadingContainer}>
            <span className={style.cartHeading} style={{ color: colors.subHeadingColor }}>Total</span>
          </div>
        </div>
      </div>
      <hr class={style.horizontalLine}></hr>
      <div className={style.cartTableHeadingContainer}>
        <div className={style.cartDataContainer}>
          <div className={style.orderIdHeadingContainer}>
            <span className={style.cartHeading} style={{ color: colors.subHeadingColor }}>{orders.order_id}</span>
          </div>
          <div className={style.tableNoHeadingContainer}>
            <span className={style.cartHeading} style={{ color: colors.subHeadingColor }}>{orders.table_number}</span>
          </div>
          <div className={style.totalHeadingContainer}>

            <span className={style.cartHeading} style={{ color: colors.subHeadingColor }}>{orders.final_amount.toFixed(2)}</span>
          </div>
        </div>
      </div>
      </div>
      </>
      : null }
      </>
      :null }
    </div>
  )
}
