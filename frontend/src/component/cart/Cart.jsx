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
import { updateOrderItemsApi, updateOrdersApi } from '../../api/Services';
import vegIcon from '../../images/veg_icon.png'
import nonVegIcon from '../../images/nonveg_icon.png'
import {BiArrowBack} from 'react-icons/bi'
import { TenantValidate } from '../Validators/ConfirmTenant'
import empty_cart_img from "../../images/empty_cart_img.png"

const Cart = () => {

  // added by rohan - 17/4/23
  // reason- To validate user is in same tenant of not
  TenantValidate()
  // end of code - rohan kansari -17/4/23
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
    var tenantName = localStorage.getItem("tenantName")
    const response = await updateOrdersApi(tenantName, cartData);
    if (response) {

      // Modified by :- Parineeta
      secureLocalStorage.removeItem('order');
      secureLocalStorage.removeItem('orderItem');
      // end of code
      
      secureLocalStorage.setItem("order", response.order)
      secureLocalStorage.setItem("orderItem", response.orderItemSerializer)
      // Added by rohan-22/4/23
      // reason - To remove cart item on response
      localStorage.removeItem('cart'); 
      setCart([]);
      // end of code - rohan - 22//4/23
    }
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

  // added by rohan- 13/4/23
  // reason - to get final subtotal of cart item
  function itemsSubtotal(){
    var subtotal=0;
    cart.filter(c=>{
      subtotal+=c.quantity*c.price
    })
    return subtotal
  }
  // end of code

  //Added by rohan - 21/4/23
  // reason - to remove plate from label 

  function TrimPlate(size){
   if (size=="Half Plate")
    return "Half";
   else
     return "Full"; 
  }

  return (
    <>
      <PopupDetail item={selectedItem} isDetailPopupOpen={isDetailPopupOpen} setDetailPopupVisiblity={setDetailPopupVisiblity} />

      <div className={style.cartContainer} style={{ color: colors.backgroundTheme }}>
        <div style={{ color: colors.headingColor }} className={style.cartTitle}>
        {/*Added by rohan kansari -18/4/23 - add back button*/}
        <BiArrowBack onClick={e=>nav(-1)}/>
        {/* Modified by :- Parineeta Gedam on 21-04-2023 */}
        <div className={style.title_length}>MY CART ({cart.length})</div></div>
        {/* End of modified code on 21-04-2023 */}
        {cart.length > 0 ? cart.map((item, i) =>
          <div className={style.card} >
            <RemoveItem removeProductIndex={removeProductIndex} currentIndex={item} setRemoveProductIndex={setRemoveProductIndex} />
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
              <div className={style.row1}>
                <div className={style.serve_size} style={{ color: colors.subHeadingColor }}> {TrimPlate(item.serve_size)}</div>
                {/* added by rohan-13/4/23 - to get each item subtotal */}
                {/* Added by rohan - 22/4/23 - reason to swipe amount showing in top in place of subtotal */}

                <span className={style.quantityContainer} style={{ color: colors.subHeadingColor }}>
                  <div className={style.sign} onClick={e => decreaseQuantity(item)}>
                    -
                  </div>
                  <div className={style.quantityText}>{item.quantity}</div>
                  <div className={style.signPlus} onClick={e => { setDetailPopupVisiblity(true); setSelectedItem(item) }}>
                    +
                  </div>
                </span>
              </div>

              <div className={style.row2} style={{ color: colors.subHeadingColor }}>
              {/* added by rohan-13/4/23 - to get all items subtotal */}
              <div className={style.price} style={{ color: colors.subHeadingColor,justifyContent:"flex-start" }}>₹ {item.price}</div>
              {/* Added by rohan - 22/4/23 - reason to swipe subtotal amount showing in bottom in place of quantity */}
              <div className={style.price} style={{ color: colors.subHeadingColor }}>₹ {item.price*item.quantity}</div>

              </div>
            </div>
          </div>

        ) : <BlankPage />}


      </div>

      {cart.length > 0 ? <div className={style.btnContainer} style={{background:colors.backgroundTheme, color: colors.subHeadingColor }}>
        {/* added by rohan-13/4/23 
            reason- to show subtotal also */}
        <div className={style.subTotal}><div className={style.label}>Sub total :</div><div className={style.text}>₹ {itemsSubtotal()}</div></div>
        <div className={style.flex}>
          <button className={style.cancleBtn} style={{ background: colors.bannerColor, color: colors.subHeadingColor }} onClick={e => nav(-1)}>Cancel</button>
          {/* Removed garbage code by -rohan-13/4/23 */}
          {/* Added by :- Parineeta Gedam
            Date :- 06-04-2023
            Reason :- Open Model for customer details.
        */}

          <button className={style.ProceedBtn} style={{ background: colors.bannerColor, color: colors.subHeadingColor }} onClick={e => { !orders ? showModal() : navigations() }} >Proceed</button>
        </div>
        {/* end of code -rohan -13/4/23 */}
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
          <button className={style.btn} onClick={removeFromCart}>Yes</button>
          <button className={style.btn} onClick={e => setRemoveProductIndex(null)}>No</button>
        </div>
      </div>
    )
}


// Created on 8/4/23 - Rohan 
// reason-This function return blank page ui 
function BlankPage() {

  {/* Added by :- Parineeta Gedam
      Date :- 11-04-2023
      Reason :- get data from localstroage.
  */}

  var orders = secureLocalStorage.getItem('order');

  const goToOrderDetails = () => {
   nav('/invoice')
  };

  {/* End of added code 06-04-2023 */ }

  const nav = useNavigate()
  const { colors } = useContext(GlobalContext)
  return (
    <>

      {/* Added by :- Parineeta Gedam
        Date :- 16-04-2023
        reason :- show the orders data if customer wants to navigate to invoice page.
    */}

      { orders ? 
      <>
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
              {/* Modified by :- Parineeta Gedam on 19-04-2023 */}
              {/* <span className={style.cartHeading} style={{ color: colors.subHeadingColor }}>{orders.total}</span> */}
            <span className={style.cartHeading} style={{ color: colors.subHeadingColor }}>{orders.total.toFixed(2)}</span>
              {/* End of modified code on 19-04-2023 */}
          </div> 
        </div>
      </div>
      </div>
      </>
      : null }

      {/* End of added code 16-04-2023 */}
      <div className={style.blankPageContainer}>
        <div className={style.blankImgContainer}>
          {/* Modified by :- Parineeta Gedam on :- 21-04-2023
              Reason :- change the img
          */}
          {/* <img alt="" src={img} className={style.blankImg} /> */}
          <img alt="" src={empty_cart_img} className={style.blankImg} />
          {/* End of modified  */}
        </div>
        <div className={style.blankText} style={{ color: colors.subHeadingColor }}>
          No item is added currently !
        </div>
        <div className={style.blankBtnContainer} >
          <button className={style.blankBtn} style={{ color: colors.backgroundTheme, background: colors.bannerColor }} onClick={e => nav(-1)}>Browse Menu</button>
        </div>
      </div>
    </>
  )
}