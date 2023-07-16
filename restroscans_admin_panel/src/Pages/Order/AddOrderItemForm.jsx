// Added by :-  Om shrivastava on 24-06-2023
// Reason - to desigin and functionality of add order item

import React, { useEffect, useRef, useState } from 'react'
import Header from '../GlobalComponent/Header';
import {
    getAllMenuList, postOrderItemsApi, getSettingsDetails, getofferDetails, getAllOfferList
} from "../../Api/services";
import style from "./orderform.module.css";
import { Message } from '../../App';
import { Select } from 'antd';
const { Option } = Select;
export default function AddOrderItemForm(orderId) {

    // Added by :- Om shrivastava on 04-06-2023
    // reason :- get setting data\

    useEffect(() => {
        getSettingData()
    }, [])

    // Added by :- Om shrivastava on 14-06-2023
    // Reason :- to set and show half and full  

    // var [servingSizeData, setServingSizeData] = useState([
    //     { key: "Half", value: "Half" },
    //     { key: "Full", value: "Full" }
    // ])

    // End of added code by :- Om shrivastava on 14-06-2023

    const options = ["Half", "Full"];

    var [servingSizeData, setServingSizeData] = useState(options[0])

    const [quantityValidation, setquantityValidation] = useState("")

    var [settings, setSettings] = useState({});
    var [allowHalfPrice, setAllowHalfPrice] = useState(false);
    const getSettingData = async () => {
        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
        var response = await getSettingsDetails(tenant);
        if (response) {

            setSettings(response.setting);
            // Added by :- Om shrivastava on 14-06-2023
            // reason :- when admin not select half then show serving size only "Full"
            // Modification by Om Shrivastava on 02-07-23 REason : Save only full price
            setAllowHalfPrice(response.setting.allow_half_price);
            if (response.setting.allow_half_price == false) {
                const rm = options.slice(1);
                setServingSizeData(rm.toString())
                // End of addition and modification by Om Shrivastava on 02-07-23
            }
            // End of Added by :- Om shrivastava on 14-06-2023 reason :- when admin not select half then show serving size only "Full"
        }
    };

    const formRef = useRef(null);

    // Added  by :- Om shrivastava on 24-06-2023
    // Reason - This is used for set item name selcted data
    const [itemNameSelected, setItemNameSelected] = useState("");
    // End of added code by :- Om shrivastava on 24-06-2023

    // Added  by :- Om shrivastava on 24-06-2023
    // Reason - This is used for set item id selcted data
    var [itemIdSelected, setItemIdSelected] = useState(1);
    // End of added code by :- Om shrivastava on 24-06-2023

    // Added  by :- Om shrivastava on 24-06-2023
    // Reason - This is used for set quantity
    const [quantitySelected, setQuantitySelected] = useState("");
    // End of added code by :- Om shrivastava on 24-06-2023

    // Added  by :- Om shrivastava on 24-06-2023
    // Reason - This is used for set price
    const [price, setPrice] = useState(0);
    // End of added code by :- Om shrivastava on 24-06-2023

    // Added  by :- Om shrivastava on 24-06-2023
    // Reason - This is used for set singal price
    const [singalItemprice, setSingalItemprice] = useState(0);
    // End of added code by :- Om shrivastava on 24-06-2023

    // Added  by :- Om shrivastava on 24-06-2023
    // Reason - This is used for set item name error msg
    var [itemNameRequired, setItemNameRequired] = useState(false);
    // End of added code by :- Om shrivastava on 24-06-2023

    // Added  by :- Om shrivastava on 24-06-2023
    // Reason - This is used for set serving size error msg
    var [servingSizeRequired, setservingSizeRequired] = useState(false);
    // End of added code by :- Om shrivastava on 24-06-2023
    // Added by Om Shrivastava on 02-07-23 Reason : Set the offerlist data in usestate
    const [offerBanner, setBannerList] = useState([]); // Our Item set in this variable
    var [offerList, setOfferList] = useState([]);
    // End of addition by Om Shrivastava on 02-07-23
    // Added by :- Om shrivastava on 24-06-2023
    // const isFocused = useIsFocused();
    useEffect(() => {
        setItemNameRequired(false);
        setservingSizeRequired(false);
        getAllMenus();

        getAllOffers()

    }, []);
    // End of added code by :- Om shrivastava on 24-06-2023


    var [itemData, setItemData] = useState([]);

    const getAllMenus = async () => {
        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
        const response = await getAllMenuList(tenant);
        if (response) {
            // setItemData(response.itemList);
            setItemData(response.itemListbyId);
            // Added by Om shrivastava on 06-07-23
            // Reason : Set the item name and item id in first name
            setItemIdSelected(response.itemListbyId[0].id)
            setItemNameSelected(response.itemListbyId[0].name)
            // End of addition by Om Shrivastava on 06-07-23
        }

    };

    // const disableHalf = (dt) => {
    //     setItemIdSelected(dt.target.value)
    //     handleMenuChange(dt.target.value)
    // }


    //  Added by :-  Om shrivastava on 24-06-2023
    // Reason - calculations for when user add order items 

    const calc = (dt) => {
        // formRef.current.handleChange("quantity")(dt.target.value)
        // Modification and addition by Om Shrivastava on 16-07-23
        // Reason : Add condition for quantity
        if(dt.target.value.length>0 && dt.target.value>0){
        setQuantitySelected(dt.target.value)
        handleCalculations(dt.target.value)
        }
        else{
        setQuantitySelected("")
        setSingalItemprice(0)
        setPrice(0)

        }
        // End of Modification and addition by Om Shrivastava on 16-07-23
        // Reason : Add condition for quantity
        
    }
    // Modification and addition by Om Shrivastava on 02-07-23
    // Reason : When offer data shown than price is correct shown
    // const handleCalculations = (qty) => {
    //     var itemName = itemData.filter((item) => item.id == itemIdSelected)[0]
    //     if (servingSizeData == "Half") {
    //         setSingalItemprice(itemName.price_half)
    //         var price = (itemName.price_half * qty)
    //         setPrice(price.toFixed(2))
    //     }
    //     if (servingSizeData == "Full") {
    //         setSingalItemprice(itemName.price_full)
    //         var price = (itemName.price_full * qty)
    //         setPrice(price.toFixed(2))
    //     }
    // }


    const handleCalculations = (qty) => {
        if (offerList.filter((item) => item.item_id == itemIdSelected).length) {
            var amount = 0;
            var discounted_price = 0;
            var itemName = offerList.filter((item) => item.item_id == itemIdSelected)[0]
            if (servingSizeData == "Full") {
                amount = ((itemName.item_fullprice / 100) * itemName.item_discount).toFixed(2)
                discounted_price = (itemName.item_fullprice - amount).toFixed(2)
                setSingalItemprice(discounted_price)
                var price = (discounted_price * qty)
                setPrice(price.toFixed(2))
            } else {
                amount = ((itemName.item_halfprice / 100) * itemName.item_discount).toFixed(2)
                discounted_price = (itemName.item_halfprice - amount).toFixed(2)
                setSingalItemprice(discounted_price)
                var price = (discounted_price * qty)
                setPrice(price.toFixed(2))
            }
        }
        else {
            var itemName = itemData.filter((item) => item.id == itemIdSelected)[0]
            if (servingSizeData == "Half") {
                setSingalItemprice(itemName.price_half)
                var price = (itemName.price_half * qty)
                setPrice(price.toFixed(2))
            }
            if (servingSizeData == "Full") {
                setSingalItemprice(itemName.price_full)
                var price = (itemName.price_full * qty)
                setPrice(price.toFixed(2))
            }
        }
    }
    // Added by Om shrivastava on 06-07-23
    // Reason : Set the item name and item id in first name
    const handleMenuChange = () => {
        if (offerList.filter((item) => item.item_id == itemIdSelected).length) {
            var itemName = offerList.filter((item) => item.item_id == itemIdSelected)[0]
            if (itemName && itemName.item_halfprice == null || itemName.item_halfprice == undefined || itemName.price_half == "0.00") {
                const rm = options.slice(1);
                setServingSizeData(rm.toString())
                document.getElementById("servingSize").disabled = true;
            } else {
                document.getElementById("servingSize").disabled = false;

            }
        }
        else {
            var itemName = itemData.filter((item) => item.id == itemIdSelected)[0]
            if (itemName && itemName.price_half == null || itemName.price_half == undefined || itemName.price_half == "0.00") {
                const rm = options.slice(1);
                setServingSizeData(rm.toString())
                document.getElementById("servingSize").disabled = true;

            }
            else {
                document.getElementById("servingSize").disabled = false;

            }
        }
    };
    // End of addition and modification by Om Shrivastava on 06-07-23 Reason : Set the item name and item id in first name
    // End of addition and modification by Om Shrivastava on 02-07-23 Reason : When offer data shown than price is correct shown


    // End of added code by :- Om shrivastava on 24-06-2023
    const resetForm = (event) => {
        document.getElementById("appliedQuantity").value = " "
        setQuantitySelected("")
        setPrice(0)
        setSingalItemprice(0)
        setquantityValidation('')
    };

    const validateOnInput = (inputName, value) => {
        if (inputName == "quantity") {
            if (value.toString().length > 0) {
                if (!isNaN(value)) {
                    if (value < 1) {
                        // Modification and addition by Om shrivastava on 16-07-23
                        // Reason : set the condition for validation in the field of quantity 
                        // setquantityValidation("Quantity must be greater than 0 ");
                        setquantityValidation("Please enter quantity. ");
                        // End of Modification and addition by Om shrivastava on 16-07-23
                        // Reason : set the condition for validation in the field of quantity
                    } else {
                        setquantityValidation("");
                    }
                } else {
                    // Modification and addition by Om shrivastava on 16-07-23
                    // Reason : set the condition for validation in the field of quantity 
                    // setquantityValidation("Quantity must be a number. ");
                    setquantityValidation("Please enter quantity. ");
                    // End of Modification and addition by Om shrivastava on 16-07-23

                }
            } else {
                setquantityValidation("Please enter quantity.");
            }
        }

        // if (inputName == "quantity") {
        //     if (value.toString().length > 0) {
        //         if (!isNaN(value)) {
        //             if (value < 1) {
        //                 setquantityValidation("Quantity must be greater or equal to 1");
        //             } else {
        //                 setquantityValidation("");
        //             }
        //         }
        //         else {
        //             setquantityValidation("Quantity must be a number.");
        //         }
        //     }
        //     else {
        //         setquantityValidation("Please enter quantity.");
        //     }
        // }
        {/* Modification and addition by Om Shrivastava on 28-06-23
        Reason : apply the validation for quantity */}
        // if (inputName == "quantity") {
        //     if (quantitySelected && quantitySelected!="" && quantitySelected!=0 ) {
        //     setquantityValidation("");
        //     } 
        //     else {
        //     setquantityValidation("Please enter1 quantity");
        //     }
        //   }
        //   End of addition and modification by Om Shrivastava on 28-06-23 Reason : apply the validation for quantity 

    }
    // console.log(quantitySelected, 'Selected quantity')
    const validateOnBlur = (inputName, value) => {
        {/* Modification and addition by Om Shrivastava on 28-06-23
        Reason : apply the validation for quantity */}
        // Modification and addition by Om Shrivastava on 07-07-23 
        // Reason : Set the validation for quantity
        // if (inputName == "quantity") {
        //     if (quantitySelected && quantitySelected != "" && quantitySelected != 0) {
        //         setquantityValidation("");
        //     }
        //     else {
        //         setquantityValidation("Please enter quantity");
        //     }
        // }

        if (inputName == "quantity") {
            if (value.toString().length > 0) {
                if (!isNaN(value)) {
                    if (value < 0 && value != 0) {
                        setquantityValidation("Quantity must be greater than 0 ");
                    } else {
                        setquantityValidation("ttt");
                    }
                } else {
                    setquantityValidation("Quantity must be a number. ");
                }
            } else {
                setquantityValidation("Please enter quantity.");
            }
        }
        // End of addition and modification by Om Shrivastava on 07-07-23 Reason : Set the validation for quantity

        //   End of addition and modification by Om Shrivastava on 28-06-23 Reason : apply the validation for quantity 

    }
    // Added by Om Shrivastava on 02-07-23 Reason : Show the offerlist data 
    const getAllOffers = async () => {
        var tenantName = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;

        const response = await getAllOfferList(tenantName);
        if (response) {
            setBannerList(response.offerBanner);
            setOfferList(response.offerItemList)

        }
    };
    // End of addition by Om Shrivastava on 02-07-23
    //  Added by :-  Om shrivastava on 24-06-2023
    // Reason - submit order items 
    // console.log(quantityValidation, "Setvalidation")
    const submitOrderItems = async () => {

        var allowDataPost = false;
        // Modification and addition by Om Shrivastava on 07-07-23
        // Reason : Set the validation for Quantity
        // Modification and addition by Om Shrivastava on 09-07-23
        // Reason : Set the validation for quantity

            if (isNaN(quantitySelected)) {
                // Modification and addition by Om shrivastava on 16-07-23
                // Reason : set the condition for validation in the field of quantity
                // setquantityValidation("Quantity must be a number. ");
                setquantityValidation("Please enter quantity. ");
                // End of Modification and addition by Om shrivastava on 16-07-23

                allowDataPost=false
               
            } else {
                if (quantitySelected <=0) {
                    // Modification and addition by Om shrivastava on 16-07-23
                    // Reason : set the condition for validation in the field of quantity
                    // setquantityValidation("Quantity must be greater than 0 ");
                    setquantityValidation("Please enter quantity. ");
                    // End of Modification and addition by Om shrivastava on 16-07-23

                    allowDataPost=false
                    
                } else {
                    setquantityValidation("");
                    allowDataPost=true
                   
                }

            }
            // End of addition by Om Shrivastava on 09-07-23
        
        // if (quantitySelected != "" && quantitySelected != 0 && quantityValidation == "") {
        //     allowDataPost = true;
        // }
        // else {

        //     setquantityValidation("Please enter quantity submit time");
        //     allowDataPost = false
        // }

        // End of addition and modification by Om Shrivastava on 07-07-23 Reason : Set the valdation for quantity

        if (allowDataPost) {

            const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;

            var data = {
                order_id: orderId.id,
                order_order_id: orderId.orderId,
                item: itemNameSelected,
                item_id: itemIdSelected,
                // serving_size: servingSizeSelected,
                serving_size: servingSizeData,
                quantity: quantitySelected,
                item_status: "Pending",
            }
            var response = await postOrderItemsApi(data, tenant);
            if (response.msg) {
                orderId.setOrderItems(response.orderItems);
                orderId.setOrderDetail(response.order);
                orderId.setOrderStatus(response.order.order_status)
                orderId.getOrderDetail()
                Message("Item added successfully.", "success");
                resetForm()
                orderId.modalvisibilityFn(false)
            }

            orderId.setOrderItems(response.orderItems);
        }
        else {
            // Message("Please provide value for this field", "info");
        }
    }

    return (
        // <Header>
        <>

            <h3 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bolder', paddingTop: '2%' }}> Add more item</h3>
            <form id='addMoreItemForm' defaultValue={{ order_id: orderId.orderId, quantity: "" }} className={style.settingSection} style={{ width: '120px', border: 'none', padding: 'unset' }}>
                <div className={style.formContainer} style={{
                    display: 'flex',
                    flexWrap: 'wrap'
                }}>
                    <div className={`${style.sectionInsideForm}`}>
                        <div className={`${style.inputContainer}`}>
                            <div className={`${style.inputArea}`}>
                                <div className={`${style.inputLabel}`}>Order Id</div>
                                <input
                                    className={`${style.textInputBox} ${style.disabledInputBox}`}
                                    type="text"
                                    name="order_id"
                                    value={orderId.orderId}
                                    disabled
                                    maxLength={10}
                                />
                            </div>
                            <div className={`${style.inputErrorArea}`}>
                                {/* {validationErrors.whatsapp_number} */}
                            </div>
                        </div>

                        <div className={`${style.inputContainer}`}>
                            <div className={`${style.inputArea}`}>
                                <div className={`${style.inputLabel}`}>Item name</div>
                                <Select
                                    className={`${style.textInputBox}`}
                                    name="name"
                                    id="itemDropDown"
                                    value={itemIdSelected}
                                    // Added by Om Shrivastava on 10-07-23
                                    // Reason : Apply the search functionality
                                    showSearch
                                    optionFilterProp="children"
                                    // End of Added by Om Shrivastava on 10-07-23 Reason : Apply the search functionality
                                    // value={itemData[0]?.id}
                                    // value={itemNameSelected}

                                    style={{ width: "200px" }}
                                    // onSelect={handleMenuChange}
                                    // onClick={handleMenuChange}
                                    onChange={e => {
                                        // alert(e.target.value)
                                        var itemName = itemData.filter((item) => item.id == e)[0]
                                        // setItemNameSelected(itemName.name)
                                        // Added by Om Shrivastava on 10-07-23
                                        // Reason : Apply the search functionality
                                        // setItemNameSelected(itemName.name)
                                        setItemNameSelected(itemName.name.trim())
                                        // End of Added by Om Shrivastava on 10-07-23 Reason : Apply the search functionality

                                        itemIdSelected = e;
                                        setItemIdSelected(e);
                                        setItemNameRequired(false);
                                        (document.getElementById("appliedQuantity").value = " ");
                                        setSingalItemprice(0);
                                        setPrice(0);
                                        // calc(e)
                                        handleMenuChange(e)
                                        // Added by Om Shrivastava on 16-07-23
                                        // Reason : When user select the item name than quantity is set to empty
                                        setQuantitySelected("");
                                        // End of addition by Om Shrivastava on 16-07-23
                                        // Reason : When user select the item name than quantity is set to empty
                                        // setItemNameSelected(e.target.value)
                                    }}
                                    // optionFilterProp="children"
                                    // filterOption={(input, option) =>
                                    //     (itemData?.name  ?? '').toLowerCase().includes(input.toLowerCase())
                                    //   }
                                >
                                    {/* <option disabled selected value>
                      Select an item
                    </option> */}
                                    {itemData.map((data, index) => {
                                        return (
                                            <Option
                                                key={index}
                                                name={data.id}
                                                //   selected={data.id == menu}
                                                value={data.id}
                                            >
                                                {data.name}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                            <div className={`${style.inputErrorArea}`}>
                                {/* {validationErrors.order_status} */}
                            </div>
                        </div>

                        <div className={`${style.inputContainer}`}>
                            <div className={`${style.inputArea}`}>
                                <div className={`${style.inputLabel}`}>Serving size</div>
                                <select
                                    id='servingSize'
                                    className={`${style.textInputBox}`}
                                    disabled={allowHalfPrice == false ? true : false}

                                    value={servingSizeData}
                                    onChange={(e) => {
                                        setServingSizeData(e.target.value);
                                        (document.getElementById("appliedQuantity").value = " ");
                                        setSingalItemprice(0);
                                        // Added by Om Shrivastava on 16-07-23
                                        // Reason : When user select the item name than quantity is set to empty
                                        setQuantitySelected("");
                                        // End of addition by Om Shrivastava on 16-07-23
                                        // Reason : When user select the item name than quantity is set to empty
                                        setPrice(0);
                                    }}

                                    onSelect={(selectedServingSize, index) => {
                                        // setServingSizeSelected(selectedServingSize.value);
                                        setQuantitySelected("");
                                        setSingalItemprice(0);
                                        setPrice(0);
                                        // setservingSizeRequired(false);
                                    }}
                                >
                                    {options.map((value) => (
                                        <option value={value} key={value}>
                                            {value}
                                        </option>
                                    ))}

                                </select>
                            </div>
                            <div className={`${style.inputErrorArea}`}>
                                {/* {validationErrors.payment_status} */}
                            </div>
                        </div>

                        <div className={`${style.inputContainer}`}>
                            <div className={`${style.inputArea}`}>
                                <div className={`${style.inputLabel}`}>
                                    {/* Modification and addition by Om Shrivastava on 28-06-23
                                    Reason : Show the mandatory field of quantity */}
                                    <span style={{ color: 'red' }}>* </span>
                                    Quantity </div>
                                {/* End of Mofication and addition by Om Shrivastava on 28-06-23 Reason : Show the mandatory field of quantity  */}
                                <input
                                    className={`${style.textInputBox}`}
                                    type="text"
                                    name="quantity"
                                    id='appliedQuantity'
                                    value={quantitySelected}
                                    // disabled={itemNameSelected == "" ? true : false}
                                    style={{ width: "200px" }}

                                    onChange={(e) => {
                                        //   setApplyLoyalityPoint(e.target.value);                                        
                                        calc(e)
                                        validateOnInput("quantity", e.target.value);
                                    }}
                                // onBlur={(e) => {
                                //     validateOnBlur(
                                //         "quantity",
                                //         e.target.value
                                //     );
                                // }}
                                />
                            </div>
                            <div className={`${style.inputErrorArea}`}>
                                {quantityValidation}
                            </div>
                        </div>

                        <div className={`${style.inputContainer}`}>
                            <div className={`${style.inputArea}`}>
                                <div className={`${style.inputLabel}`}>Price</div>
                                <input
                                    className={`${style.textInputBox} ${style.disabledInputBox}`}
                                    type="text"
                                    name="price"
                                    id='singlePrice'

                                    value={singalItemprice}
                                    //   style={{ width: "200px", height: "100px", resize: 'none' }}
                                    disabled
                                    onChange={(e) => {
                                        // setCancelReason(e.target.value);
                                        // validateOnInput("cancel_reason", e.target.value);
                                    }}
                                    maxLength={255}
                                />
                            </div>
                            <div className={`${style.inputErrorArea}`}>
                                {/* {validationForOrderCancel} */}
                            </div>
                        </div>
                        <div className={`${style.inputContainer}`}>
                            <div className={`${style.inputArea}`}>
                                <div className={`${style.inputLabel}`}>Total Price</div>
                                <input
                                    className={`${style.textInputBox} ${style.disabledInputBox}`}
                                    type="text"
                                    name="cancel_reason"
                                    id='multipliedPrice'

                                    value={price}
                                    //   style={{ width: "200px", height: "100px", resize: 'none' }}
                                    disabled

                                    onChange={(e) => {
                                        // setCancelReason(e.target.value);
                                        // validateOnInput("cancel_reason", e.target.value);
                                    }}
                                    maxLength={255}
                                />
                            </div>
                            <div className={`${style.inputErrorArea}`}>
                                {/* {validationForOrderCancel} */}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={style.actionContainer}>
                    <div
                        className={` ${style.backButton} ${style.reverseButton}`}
                        style={{
                            marginRight: "10px",
                        }}
                        onClick={(e) => {
                            //   navigate(-1);
                            orderId.modalvisibilityFn(false)
                            resetForm()
                        }}
                    >
                        Back
                    </div>

                    <div
                        className={` ${style.proceedButton} ${style.savedButton} `}
                        onClick={() => {
                            submitOrderItems();
                            window.scrollTo(0, 0);
                        }}
                    >
                        Save
                    </div>
                </div>
            </form>
        </>
    )
}


