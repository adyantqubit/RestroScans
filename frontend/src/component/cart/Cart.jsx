// Created on 6/4/23
// reason - This is cart where all added item will show and manipulate


import React, { useContext, useEffect, useState } from 'react'
import style from './cart.module.css'
// import img from "../../images/balnkCart.png"
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
import blankCart from "../../images/blankCart.png"
const Cart = () => {

  // added by rohan - 17/4/23
  // reason- To validate user is in same tenant of not
  TenantValidate()
  // end of code - rohan kansari -17/4/23
  const nav = useNavigate()
  const [isDetailPopupOpen, setDetailPopupVisiblity] = useState(false)
  const [removeProductIndex, setRemoveProductIndex] = useState(null)
  const { cart, setCart, colors,rupee_sign } = useContext(GlobalContext)
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
      order: orders,
    };
    var tenantName = localStorage.getItem("tenantName")
    const response = await updateOrdersApi(tenantName, cartData);
    if (response) {
       // Modified by :- Parineeta Gedam on 17-05-2023
        if(secureLocalStorage.getItem("order") && secureLocalStorage.getItem("orderItem")){
          secureLocalStorage.removeItem('order');
          secureLocalStorage.removeItem('orderItem');
          secureLocalStorage.setItem("order", response.order)
          secureLocalStorage.setItem("orderItem", response.orderItemSerializer)
          // End of modifications code by :- Parineeta Gedam on 17-05-2023
          
          // Added by rohan-22/4/23
          // reason - To remove cart item on response
          localStorage.removeItem('cart'); 
          setCart([]);
          // end of code - rohan - 22//4/23
        }
        else{
          secureLocalStorage.setItem("order", response.order)
          secureLocalStorage.setItem("orderItem", response.orderItemSerializer)
        }
    }
    // Modified by :- Parineeta Gedam on 17-05-2023
    // Reason :- Change the component name
    // navigate('/invoice')
    navigate('/order')
    // End of modifications code by :- Parineeta Gedam on 17-05-2023
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
        <BiArrowBack onClick={e=>nav("/menu-item")}/>
        {/* Modified by :- Parineeta Gedam on 21-04-2023 */}
        <div className={style.title_length}>MY CART ({cart.length})</div></div>
        {/* End of modified code on 21-04-2023 */}
        {cart.length > 0 ? cart.map((item, i) =>
          <div className={style.card} >
            <RemoveItem removeProductIndex={removeProductIndex} currentIndex={item} setRemoveProductIndex={setRemoveProductIndex} />
            
            <div className={style.imgContainer}>
              {/*Moved by Rohan kansari - 10/5/23  */}
            {item.best?<div className={style.ribbon}>Best Seller</div>:null}
            {/* ENd of code - Rohan kansari - 10/5/23*/}
              <img alt="" src={config.siteURL + item.icon} className={style.img} />
              {item.item_type == "Veg" ?
                <img alt="" src={vegIcon} className={style.type_img} />
                :
                item.item_type == "Other"?null:
                <img alt="" src={nonVegIcon} className={style.type_img} />}
            </div>
            {/* Added on 4/5/23 - Rohan Kansari - To show best seller option also */}
            {/* {item.best?<div className={style.ribbon}>Best Seller</div>:null} */}
            <div className={style.infomation}>
              
              <div className={style.title} style={{ color: colors.subHeadingColor }}>{item.name}<div className={style.delete}></div></div>
              <div className={style.row1}>
                <div className={style.serve_size} style={{ color: colors.subHeadingColor }}> {TrimPlate(item.serve_size)}</div>
                {/* added by rohan-13/4/23 - to get each item subtotal */}
                {/* Added by rohan - 22/4/23 - reason to swipe amount showing in top in place of subtotal */}

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
              {/* added by rohan-13/4/23 - to get all items subtotal */}
              {/* // Modified and commented by Om Shrivastava on 08-05-23
              // Reason : Create the rupee sign globally for using the config file. */}
              {/* <div className={style.price} style={{ color: colors.subHeadingColor,justifyContent:"flex-start" }}>₹ {item.price}</div> */}
              <div className={style.price} style={{ color: colors.subHeadingColor,justifyContent:"flex-start" }}>{rupee_sign}  {item.price}</div>
              {/* End of addition by Om Shrivastava on 08-05-23 */}
              
              {/* Added by rohan - 22/4/23 - reason to swipe subtotal amount showing in bottom in place of quantity */}
              {/* // Modified and commented by Om Shrivastava on 08-05-23
              // Reason : Create the rupee sign globally for using the config file. */}
              {/* <div className={style.price} style={{ color: colors.subHeadingColor }}>₹ {item.price*item.quantity}</div> */}
              <div className={style.price} style={{ color: colors.subHeadingColor }}>{rupee_sign}  {(item.price*item.quantity).toFixed(2)}</div>
              {/* End of addition by Om Shrivastava on 08-05-23 */}

              </div>
            </div>
          </div>

        ) : <BlankPage />}


      </div>

      {cart.length > 0 ? <div className={style.btnContainer} style={{background:colors.backgroundTheme, color: colors.subHeadingColor }}>
        {/* added by rohan-13/4/23 
            reason- to show subtotal also */}
        {/* // Modified and commented by Om Shrivastava on 08-05-23
        // Reason : Create the rupee sign globally for using the config file. */}
        {/* <div className={style.subTotal}><div className={style.label}>Sub total :</div><div className={style.text}>₹ {itemsSubtotal()}</div></div> */}
        <div className={style.subTotal}><div className={style.label}>Sub total :</div><div className={style.text}>{rupee_sign}  {itemsSubtotal().toFixed(2)}</div></div>
        {/* End of addition by Om Shrivastava on 08-05-23 */}
        
        <div className={style.flex}>
          <button className={style.cancleBtn} style={{ background: colors.bannerColor, color: colors.backgroundTheme }} onClick={e => nav(-1)}>Back</button>
          {/* Removed garbage code by -rohan-13/4/23 */}
          {/* Added by :- Parineeta Gedam
            Date :- 06-04-2023
            Reason :- Open Model for customer details.
        */}

          <button className={style.ProceedBtn} style={{ background: colors.bannerColor, color: colors.backgroundTheme }} onClick={e => { !orders ? showModal() : navigations() }} >Proceed</button>
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

  const { cart, setCart,rupee_sign } = useContext(GlobalContext)

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
  var [orderItems, setOrderItem] = useState([])

  // Modified by :- Parineeta Gedam on 21-05-2023

  useEffect(() => {

    // window.onpopstate = () => { if(allow_pop){localStorage.removeItem('cart'); setCart([]);}}
    setOrderItem(secureLocalStorage.getItem('orderItem'));
    // setOrders(secureLocalStorage.getItem('order'))

  }, [])
 
  // End of added code by Parineeta Gedam on 21-05-2023
  console.log("item", orderItems)
  const goToOrderDetails = () => {
  //  nav('/invoice')
   nav('/order')

  };

  {/* End of added code 06-04-2023 */ }

  const nav = useNavigate()
  const { colors } = useContext(GlobalContext)
  return (
    <div className={style.blankContainer}>

      {/* Added by :- Parineeta Gedam
        Date :- 16-04-2023
        reason :- show the orders data if customer wants to navigate to invoice page.
    */}

      

      {/* End of added code 16-04-2023 */}
      <div className={style.blankPageContainer}>
        <div className={style.blankImgContainer}>
          {/* Modified by :- Parineeta Gedam on :- 21-04-2023
              Reason :- change the img
          */}
          {/* <img alt="" src={img} className={style.blankImg} /> */}
          <img alt="" src={blankCart} className={style.blankImg} />
          {/* End of modified  */}
        </div>
        <div className={style.blankText} style={{ color: colors.subHeadingColor }}>
        Please add delicious dishes from menu
        </div>
        <div className={style.blankBtnContainer} >
        {/* Added by Rohan - 30/4/23
            Reason - To change backbutton functionality */}
          <button className={style.blankBtn} style={{ color: colors.backgroundTheme, background: colors.bannerColor }} onClick={e => nav("/menu-item")}>Browse Menu</button>
        </div>
      </div>

        {/* Modified by :- Parineeta Gedam on 21-05-2023 */}
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
      </>
      :null }
      {/* End of modifications code by Parineeta Gedam on 21-05-2023  */}
    </div>
  )
}