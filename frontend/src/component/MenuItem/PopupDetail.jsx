//created on 8/4/23 - Rohan
// reason this is a popup container where you will get option to select half and full plate

import React, { useContext, useEffect, useState } from 'react'
import style from "./popupDetail.module.css"
import { AiOutlineClose } from "react-icons/ai"
import { GlobalContext } from '../../context/Context'
import { message } from 'antd';
import config from '../../config/config'
import vegIcon from '../../images/veg_icon.png'
import nonVegIcon from '../../images/nonveg_icon.png'
import {
    RadiusUprightOutlined,
  } from '@ant-design/icons';

  import { Button, Divider, notification, Space } from 'antd';
// created by rohan - 9/4/23
// reason - to remove one specific index element from list
function elementRemover(specificIndex, list) {
    var temp = [];
    for (var i = 0; i < list.length; i++) {
        // this will ignore specific index and push other elements
        if (i != specificIndex)
            temp.push(list[i])
    }

    return temp
}


const PopupDetail = ({ item, isDetailPopupOpen, setDetailPopupVisiblity,bestSeller }) => {
    const { colors, cart, setCart,restaurant_name,rupee_sign } = useContext(GlobalContext)
    // const [messageApi, contextHolder] = message.useMessage();
    var [quantityhalf, setQuantityHalf] = useState(0)
    var [quantityFull, setQuantityFull] = useState(0)
    var [sizeSelected, setSizeSlelected] = useState(null)

    if (typeof item?.item_name != "undefined"){
        // Added by Rohan Kansari - 23/4/23
        // reason- Beacuse Offer item id is saved in item_id so we have to save manually 
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


    // created by -Rohan - 9/4/23
    // reason - this will add ,delete and increase quantity of an item this item will hit on submit button 
    function AddItemToCart() {
        var cartTemp = cart

        var historyCart=JSON.parse(localStorage.getItem("cart"))

        if (quantityFull > 0) {
            // For full price is increase by one or already present in item with any quantity
            // then it find the index of selected item in cart
            var cartIndex = cart.findIndex(c => c.id == item.id && c.serve_size == "Full Plate")
            if (cartIndex != -1) {
                // if found then set current increases or deacrease amount to cart item and pass a message
                cartTemp[cartIndex].quantity = quantityFull
                setCart([...cartTemp])
                notify("Successfully quantity updated")
            } else {
                // if selected item is not found then it means it is new item with quantity so we have to push 
                // item with entered quantity
                cartTemp = [...cartTemp, cartDataCreate(quantityFull, "Full Plate", item.discounted_full_price)]
                setCart([...cartTemp])
                // Chnages by - ROhan kansari - 29/4/23
                notify("Successfully added to your cart")

            }
        }
        else {
            // if quantity of full plate is set to zero means they want to remove this item 
            if (cart.findIndex(c => c.id == item.id && c.serve_size == "Full Plate") != -1) {
                // first find the index of selected item
                var cartId = cart.findIndex(c => c.id == item.id && c.serve_size == "Full Plate")
                if (cartId != -1) {
                    // if found index then remove item 
                    setCart(elementRemover(cartId, cartTemp))
                    cartTemp = elementRemover(cartId, cartTemp)
                    notify("Item is succesfully removed from cart")
                }
            }
        }

        if (quantityhalf > 0) {
            // For half price is increase by one or already present in item with any quantity
            // then it find the index of selected item in cart
            var cartId = cartTemp.findIndex(c => c.id == item.id && c.serve_size == "Half Plate")
            if (cartId != -1) {
                // if found then set current increases or deacrease amount to cart item and pass a message
                cartTemp[cartId].quantity = quantityhalf
                setCart(cartTemp)
                notify("Successfully quantity updated")
            } else {
                // if selected item is not found then it means it is new item with quantity so we have to push 
                // item with entered quantity
                //Added by rohan - 16/4/23
                //reason- i am bymistake written full price in half price section
                cartTemp = [...cartTemp, cartDataCreate(quantityhalf, "Half Plate", item.discounted_half_price)]
                setCart(cartTemp)
                notify("Successfully added to your cart")
            }
        }
        else {
            // if quantity of half plate is set to zero means they want to remove this item 
            if (cartTemp.findIndex(c => c.id == item.id && c.serve_size == "Half Plate") != -1) {
                // first find the index of selected item
                var cartId = cartTemp.findIndex(c => c.id == item.id && c.serve_size == "Half Plate")
                if (cartId != -1) {
                    // if found index then remove item 
                    setCart(elementRemover(cartId, cartTemp))
                    cartTemp = elementRemover(cartId, cartTemp)
                    notify("Item is succesfully removed from cart")
                }
            }
        }

        // after all updation updated cart value is set to localstorage and close the popup container

        // Added by Rohan kansari-6/5/23
        // Reason - show validation message if any changes is not their
        if(JSON.stringify(historyCart) == JSON.stringify(cartTemp)){
            notify("Please add quantity","error")
        }else{
            localStorage.setItem("cart", JSON.stringify(cartTemp))
            setDetailPopupVisiblity(!isDetailPopupOpen)
        }
        // End of addition - Rohan kansari-6/5/23 
        
    }

    // created by rohan - 9/4/23
    // reason - function to create new data for cart
    function cartDataCreate(quantity, size, price) {

        return {
            
            id: item.id,
            name: item.name,
            price: price,
            quantity: quantity,
            serve_size: size,
            icon: item.icon,
            discounted_full_price: item.discounted_full_price,
            discounted_half_price: item.discounted_half_price,
            item_type: item.item_type,
            tenant:restaurant_name,
            // Added by Rohan kansari - 4/5/23 - to best seller showing option 
            best: bestSeller?.filter(b=>b.item==item.id).length>0

        }
    }




    // created by rohan - 9/4/23
    // reason - this will return current quantity of opened item only we have to pass the size the it fetch 
    function CurrentAddedQuantity(size) {
        var cartId = cart.findIndex(c => c.id == item.id && c.serve_size == size)
        if (cartId != -1) {
            return cart[cartId].quantity;
        }
        else {
            if (size == "Full Plate") {
                setQuantityFull(0)
                return 0;
            }
            else {
                setQuantityHalf(0)
                return 0;
            }
        }
    }




    //created by rohan- 9/4/23
    // reason- quantity will decrease of specific size and ask confirmation befored decreasing to zero 
    function decreamentQuantiy(size) {

        if (size == "Full Plate") {
            // for full plate first check if quantity is not 0 and 1 then deacrese contantly
            if (quantityFull != 1 && quantityFull != 0) {
                setQuantityFull(--quantityFull)
            } else {
                // if equal to 1 then find index of selected item
                if (cart.findIndex(c => c.id == item.id && c.serve_size == "Full Plate") != -1)
                    // if it is already in cart and want to turn into zero then one 
                    // popup confirmation will show for selected size
                    setSizeSlelected("Full Plate")
                else
                    // else is it is not in cart then simply turn it to zeeero without asking confirmation 
                    if (quantityFull != 0) {
                        setQuantityFull(--quantityFull)
                    }
            }
        }
        else {
            // for half plate first check if quantity is not 0 and 1 then deacrese contantly
            if (quantityhalf != 1 && quantityhalf != 0) {
                // if equal to 1 then find index of selected item
                setQuantityHalf(--quantityhalf)
            } else {
                if (cart.findIndex(c => c.id == item.id && c.serve_size == "Half Plate") != -1)
                    // if it is already in cart and want to turn into zero then one 
                    // popup confirmation will show for selected size
                    setSizeSlelected("Half Plate")
                else
                    // else is it is not in cart then simply turn it to zeeero without asking confirmation 
                    if (quantityhalf != 0)
                        setQuantityHalf(--quantityhalf)
            }
        }

    }

    const [api, contextHolder] =notification.useNotification()

 

    function notify(msg,error) {

        //  Added by Rohan kansari - 6/5/23
        // Reason - to show error messge if no updation is shown
            if(error=="error"){
                api.warning({
              
                    message: `${msg} `,
                  //   description: <Context.Consumer>{({ name }) => `Hello, ${name}!`}</Context.Consumer>,
                  RadiusUprightOutlined,
                  duration:3,
                  style:{
                      top:"25px",
                      background:colors.subheadingBackgroundColor,
                      color:colors.subHeadingColor
                  },
      
                  // Added by Rohan kansari - 23/4/23
                  //Reason - To fixed notification show only one time 
                    key: 1,
                  // end of code
                  })
            }
            else
            // ENd of code - Rohan kansari - 6/5/23
            api.success({
              
              message: `${msg} `,
            //   description: <Context.Consumer>{({ name }) => `Hello, ${name}!`}</Context.Consumer>,
            RadiusUprightOutlined,
            duration:3,
            style:{
                top:"25px",
                background:colors.subheadingBackgroundColor,
                color:colors.subHeadingColor
            },

            // Added by Rohan kansari - 23/4/23
            //Reason - To fixed notification show only one time 
              key: 1,
            // end of code
            
            })
        // messageApi.open({
        //     type: 'success',
        //     content: `${msg}`,
        //     className: 'custom-class',
        //     style: {
        //         marginTop: '4.5vh',
        //         fontSize: "16px",
        //         letterSpacing: "1.3px",
        //         fontFamily: "Times News Roman",
        //         color: colors.subHeadingColor,
                
        //     },
            
        //     key: 1,
        //     duration:3000
        // });

    //   var el= document.getElementsByClassName("ant-message-notice-content")[0]
    //   console.log(el)
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
                            {/* <img alt="" src={config.siteURL + item.icon} className={style.img} /> */}
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
                                        {/* // Modified and commented by Om Shrivastava on 08-05-23
                                        // Reason : Create the rupee sign globally for using the config file. */}
                                        {/* <div className={style.price} style={{ color: colors.subHeadingColor }}>₹ {item.discounted_full_price}</div> */}
                                        <div className={style.price} style={{ color: colors.subHeadingColor }}>{rupee_sign} {item.discounted_full_price}</div>
                                        {/* End of addition by Om Shrivastava on 08-05-23 */}
                                        
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
                                        {/* // Modified and commented by Om Shrivastava on 08-05-23
                                        // Reason : Create the rupee sign globally for using the config file. */}
                                        {/* <div className={style.price} style={{ color: colors.subHeadingColor }}>₹ {item.discounted_half_price}</div> */}
                                        <div className={style.price} style={{ color: colors.subHeadingColor }}>{rupee_sign} {item.discounted_half_price}</div>
                                        {/* End of addition by Om Shrivastava on 08-05-23 */}
                                    
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
                            // <div className={style.halfWarning} onClick={e => {

                            // }}>For this half plate is not available!</div>
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

    // created by rohan - 9/4/23
    // reason- to remove item from cart and turn quantity to zero in popup container
    function removeFromCart() {
        // if requested the find index of item
        var itemIndex = cart.findIndex(c => c.id == item.id && c.serve_size == size)
        setCart(elementRemover(itemIndex, cart))
        // set updated value to localstorage
        localStorage.setItem("cart", JSON.stringify(elementRemover(itemIndex, cart)))
        setSizeSlelected(null)

        // set quantity of selected size
        if (size == "Full Plate") {
            setQuantityFull(0)
        }
        else {
            console.log("run half remove")
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