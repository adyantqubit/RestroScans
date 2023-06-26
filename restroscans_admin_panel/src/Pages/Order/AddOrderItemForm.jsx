// Added by :-  Om shrivastava on 24-06-2023
// Reason - to desigin and functionality of add order item

import React, { useEffect, useRef, useState } from 'react'
import Header from '../GlobalComponent/Header';
import {
    getAllMenuList, postOrderItemsApi, getSettingsDetails
} from "../../Api/services";
import style from "./orderform.module.css";
import { Message } from '../../App';

export default function AddOrderItemForm(orderId) {

    // Added by :- Om shrivastava on 04-06-2023
    // reason :- get setting data\

    useEffect(() => {
        getSettingData()
    }, [])

    // Added by :- Om shrivastava on 14-06-2023
    // Reason :- to set and show half and full  

    var [servingSizeData, setServingSizeData] = useState([
        { key: "Half", value: "Half" },
        { key: "Full", value: "Full" }
    ])

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
            setAllowHalfPrice(response.setting.allow_half_price);
            if (response.setting.allow_half_price == false) {
                var rm = options.slice(1);
                setServingSizeData(rm)
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
    const [itemIdSelected, setItemIdSelected] = useState(1);
    // End of added code by :- Om shrivastava on 24-06-2023

    // Added  by :- Om shrivastava on 24-06-2023
    // Reason - This is used for set quantity
    const [quantitySelected, setQuantitySelected] = useState(0);
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

    // Added by :- Om shrivastava on 24-06-2023
    // const isFocused = useIsFocused();
    useEffect(() => {
        setItemNameRequired(false);
        setservingSizeRequired(false);
        getAllMenus();
    }, []);
    // End of added code by :- Om shrivastava on 24-06-2023


    var [itemData, setItemData] = useState([]);

    const getAllMenus = async () => {
        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
        const response = await getAllMenuList(tenant);
        if (response) {
            // setItemData(response.itemList);
            setItemData(response.itemListbyId);

        }
    };

    //  Added by :-  Om shrivastava on 24-06-2023
    // Reason - calculations for when user add order items 

    const calc = (dt) => {
        // formRef.current.handleChange("quantity")(dt.target.value)
        setQuantitySelected(dt.target.value)
        handleCalculations(dt.target.value)
    }
    // console.log(servingSizeData)
    // console.log(itemIdSelected)
    const handleCalculations = (qty) => {
        var itemName = itemData.filter((item) => item.id == itemIdSelected)[0]
        // console.log(itemName, '888888')
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
    // console.log(singalItemprice)
    // console.log(price)
    // console.log(orderId.orderId)
    // console.log(orderId.id)

    // End of added code by :- Om shrivastava on 24-06-2023
    const resetForm = (event) => {
        document.getElementById("appliedQuantity").value = " "
        setPrice(0)
        setSingalItemprice(0)
    };

    const validateOnInput = (inputName, value) => {
        if (inputName == "quantity") {
            if (value.toString().length > 0) {
                if (!isNaN(value)) {
                    if (value < 1) {
                        setquantityValidation("Quantity must be greater or equal to 1");
                    } else {
                        setquantityValidation("");
                    }
                }
                else {
                    setquantityValidation("Quantity must be a number.");
                }
            }
            else {
                setquantityValidation("Please enter quantity.");
            }
        }

    }
    const validateOnBlur = (inputName, value) => {

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
    }

    //  Added by :-  Om shrivastava on 24-06-2023
    // Reason - submit order items 
    const submitOrderItems = async () => {

        var allowDataPost = false;

        if (quantityValidation == "") {
            allowDataPost = true;
        }
        else {
            allowDataPost = false
        }

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
            // console.log(data, '88888')
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

    // console.log(servingSizeData,itemData)
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
                                    className={`${style.textInputBox}`}
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
                                <select
                                    className={`${style.textInputBox}`}
                                    name="name"
                                    id="itemDropDown"

                                    style={{ width: "200px" }}

                                    onChange={e => {
                                        // alert(e.target.value)
                                        var itemName = itemData.filter((item) => item.id == e.target.value)[0]
                                        setItemNameSelected(itemName.name)
                                        setItemIdSelected(e.target.value);
                                        setItemNameRequired(false);
                                        (document.getElementById("appliedQuantity").value = " ");
                                        setSingalItemprice(0);
                                        setPrice(0);
                                        // setItemNameSelected(e.target.value)
                                    }}
                                >
                                    {/* <option disabled selected value>
                      Select an item
                    </option> */}
                                    {itemData.map((data, index) => {
                                        return (
                                            <option
                                                key={index}
                                                name={data.id}
                                                //   selected={data.id == menu}
                                                value={data.id}
                                            >
                                                {data.name}
                                            </option>
                                        );
                                    })}
                                </select>
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
                                        setPrice(0);
                                    }}

                                    onSelect={(selectedServingSize, index) => {
                                        // setServingSizeSelected(selectedServingSize.value);
                                        setQuantitySelected(0);
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
                                <div className={`${style.inputLabel}`}>Quantity </div>

                                <input
                                    className={`${style.textInputBox}`}
                                    type="text"
                                    name="quantity"
                                    id='appliedQuantity'

                                    style={{ width: "200px" }}

                                    onChange={(e) => {
                                        //   setApplyLoyalityPoint(e.target.value);
                                        calc(e)
                                        validateOnInput("quantity", e.target.value);
                                    }}
                                    onBlur={(e) => {
                                        validateOnBlur(
                                            "quantity",
                                            e.target.value
                                        );
                                    }}
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
                                    className={`${style.textInputBox}`}
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
                                    className={`${style.textInputBox}`}
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
                        className={` ${style.backButton}`}
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
                        className={` ${style.proceedButton}`}
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


