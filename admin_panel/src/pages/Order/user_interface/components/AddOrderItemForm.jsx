import React, { useEffect, useRef } from 'react'
import axios from 'axios';
import config from '../../../../config/config';
import Header from '../../../../components/Header/Header';
import {
    loadMenuCatalog, saveOrderItems, loadSettings, loadOffer, loadOffers
} from "../../services/orderService";
import style from "../style/orderform.module.css";
import { useApp } from '../../../../Context/AppContext';
import { Select } from '../../../../ui';
import { useAddOrderItemFormState } from "../../usestate/addOrderItemFormState";
const { Option } = Select;
export default function AddOrderItemForm(orderId) {
    const isStaff = Boolean(orderId.staffMode);
    const staffRequest = async (method, url, payload, params) => {
        const auth = JSON.parse(sessionStorage.getItem('restroStaffSession') || 'null');
        if (!auth?.token || !auth?.tenant) throw new Error('Staff session expired. Please log in again.');
        const response = await axios({
            method, url, baseURL: config.staticBaseURL,
            headers: { Authorization: `Bearer ${auth.token}`, 'X-Tenant': auth.tenant },
            ...(payload ? { data: payload } : {}), ...(params ? { params } : {})
        });
        return response.data;
    };
    const currentTenant = () => {
        if (isStaff) return JSON.parse(sessionStorage.getItem('restroStaffSession') || 'null')?.tenant || '';
        return JSON.parse(localStorage.getItem('tenantInfo') || '{}').tenant_name || '';
    };
    const { Message } = useApp();

    useEffect(() => {
        getSettingData()
    }, [orderId.modalvisibility])

    const options = ["Half", "Full"];

    var {
        servingSizeData,
        setServingSizeData,
        quantityValidation,
        setquantityValidation,
        settings,
        setSettings,
        allowHalfPrice,
        setAllowHalfPrice,
        itemNameSelected,
        setItemNameSelected,
        itemIdSelected,
        setItemIdSelected,
        quantitySelected,
        setQuantitySelected,
        price,
        setPrice,
        singalItemprice,
        setSingalItemprice,
        itemNameRequired,
        setItemNameRequired,
        servingSizeRequired,
        setservingSizeRequired,
        offerBanner,
        setBannerList,
        offerList,
        setOfferList,
        searchValue,
        setSearchValue,
        itemData,
        setItemData,
    } = useAddOrderItemFormState(options);

    const getSettingData = async () => {
        const tenant = currentTenant();
        var response = isStaff
            ? await staffRequest('get', '/api/v1/setting-changes/color/')
            : await loadSettings(tenant);
        if (response) {
            setSettings(response.setting);
            setAllowHalfPrice(response.setting.allow_half_price);
            if (response.setting.allow_half_price == false) {
                const rm = options.slice(1);
                setServingSizeData(rm.toString())
            }
        }
    };

    const formRef = useRef(null);

    useEffect(() => {
        resetForm()
        setItemNameRequired(false);
        setservingSizeRequired(false);
        getAllMenus();

        getAllOffers();
    }, [orderId.modalvisibility, orderId.orderItemList]);

    const getAllMenus = async () => {
        const tenant = currentTenant();
        const response = isStaff
            ? await staffRequest('get', '/api/v1/all-menus/')
            : await loadMenuCatalog(tenant);
        if (response) {
            setItemData(response.itemListbyId);
            if (response.itemListbyId?.length) {
                setItemIdSelected(response.itemListbyId[0].id)
                setItemNameSelected(response.itemListbyId[0].name)
            }
        }
    };

    const calc = (dt) => {
        if (dt.target.value.length > 0 && dt.target.value > 0) {
            setQuantitySelected(dt.target.value)
            handleCalculations(dt.target.value)
        }
        else {
            setQuantitySelected("")
            setSingalItemprice(0)
            setPrice(0)
        }
    }

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
                        setquantityValidation("Please enter quantity. ");
                    } else {
                        setquantityValidation("");
                    }
                } else {
                    setquantityValidation("Please enter quantity. ");
                }
            } else {
                setquantityValidation("Please enter quantity.");
            }
        }

        { }
    }
    const validateOnBlur = (inputName, value) => {
        { }

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
    }
    const getAllOffers = async () => {
        var tenantName = currentTenant();

        const response = isStaff
            ? await staffRequest('get', '/api/v1/offer-details/')
            : await loadOffers(tenantName);
        if (response) {
            setBannerList(response.offerBanner);
            setOfferList(response.offerItemList)
        }
    };
    const submitOrderItems = async () => {
        var allowDataPost = false;
        var IsDataPosted = true;

        if (isNaN(quantitySelected)) {
            setquantityValidation("Please enter quantity. ");
            allowDataPost = false
        } else {
            if (quantitySelected <= 0) {
                setquantityValidation("Please enter quantity. ");

                allowDataPost = false
            } else {
                setquantityValidation("");
                allowDataPost = true
            }
        }

        if (typeof orderId.doICallBackend != "undefined" && orderId.doICallBackend == false) {
            IsDataPosted = false
        }
        else {
            IsDataPosted = true
        }

        if (allowDataPost && IsDataPosted) {
            const tenant = currentTenant();

            var data = {
                order_id: orderId.id,
                order_order_id: orderId.orderId,
                item: itemNameSelected,
                item_id: itemIdSelected,
                serving_size: servingSizeData,
                quantity: quantitySelected,
                item_status: "Pending",
            }
            let response;
            try {
                response = isStaff
                    ? await staffRequest('post', '/api/v1/workforce/staff-operations/', {
                        section: 'orders', action: 'add_item', ...data
                    })
                    : await saveOrderItems(data, tenant);
            } catch (error) {
                Message(error?.response?.data?.error || error.message || 'Unable to add item.', 'error');
                return;
            }
            if (response?.msg) {
                orderId.setOrderItems(response.orderItems);
                orderId.setOrderDetail(response.order);

                if (typeof orderId.setOrderStatus != "undefined")
                    orderId.setOrderStatus(response.order.order_status)
                if (typeof orderId.getOrderDetail != "undefined")
                    orderId.getOrderDetail(response.order)
                Message("Item added successfully.", "success");
                resetForm()
                orderId.modalvisibilityFn(false)
            }

            if (!response?.msg) {
                Message(response?.error || 'Unable to add item.', 'error');
            }
        }
        else {
            if (typeof orderId.setOrderItemList != "undefined" && allowDataPost) {
                if (servingSizeData == "Half")
                    servingSizeData = "Half Plate"
                else
                    servingSizeData = "Full Plate"
                const data = {
                    name: itemNameSelected,
                    id: itemIdSelected,
                    serve_size: servingSizeData,
                    quantity: parseInt(quantitySelected),
                    price: parseFloat(price)
                }
                orderId.modalvisibilityFn(false)
                if (orderId.orderItemList.findIndex(e => e.id == data.id && e.serve_size == data.serve_size) != -1) {
                    orderId.orderItemList[orderId.orderItemList.findIndex(e => e.id == data.id && e.serve_size == data.serve_size)].quantity += parseInt(quantitySelected)
                    orderId.orderItemList[orderId.orderItemList.findIndex(e => e.id == data.id && e.serve_size == data.serve_size)].price += parseFloat(price)
                    orderId.setOrderItemList([...orderId.orderItemList])
                } else
                    orderId.setOrderItemList([...orderId.orderItemList, data])
            }
        }
    }
    const CustomNoOptionsMessage = ({ inputValue }) => (
        <div style={{ padding: 10 }}>
            No results found for "{inputValue}"
        </div>
    );

    return (
        <>

            <h3 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bolder', paddingTop: '2%' }}> Add more item</h3>
            <form id='addMoreItemForm' defaultValue={{ order_id: orderId.orderId, quantity: "" }} className={style.settingSection} style={{ width: '120px', border: 'none', padding: 'unset' }}>
                <div className={style.formContainer} style={{
                    display: 'flex',
                    flexWrap: 'wrap'
                }}>
                    <div className={`${style.sectionInsideForm}`}>
                        {typeof orderId.doICallBackend != "undefined" && orderId.doICallBackend == false
                            ?
                            null :
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
                                </div>
                            </div>}

                        <div className={`${style.inputContainer}`}>
                            <div className={`${style.inputArea}`}>
                                <div className={`${style.inputLabel}`}>Item name</div>
                                <Select
                                    className={`${style.textInputBox}`}
                                    name="name"
                                    id="itemDropDown"
                                    value={itemIdSelected}
                                    notFoundContent={<div style={{ height: '3vh', textAlign: 'center' }}>No Records Found</div>}
                                    showSearch
                                    onSearch={e => { setSearchValue(e.trimStart().replace(/\s+/g, ' ')) }}
                                    searchValue={searchValue}
                                    optionFilterProp="children"

                                    style={{ width: "200px" }}
                                    onChange={e => {
                                        var itemName = itemData.filter((item) => item.id == e)[0]
                                        setItemNameSelected(itemName.name.trim())

                                        itemIdSelected = e;
                                        setItemIdSelected(e);
                                        setItemNameRequired(false);
                                        (document.getElementById("appliedQuantity").value = " ");
                                        setSingalItemprice(0);
                                        setPrice(0);
                                        handleMenuChange(e)
                                        setQuantitySelected("");
                                    }}
                                >
                                    {itemData.map((data, index) => {
                                        return (
                                            <Option
                                                key={index}
                                                name={data.id}
                                                value={data.id}
                                            >
                                                {data.name}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                            <div className={`${style.inputErrorArea}`}>
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
                                        setQuantitySelected("");
                                        setPrice(0);
                                    }}

                                    onSelect={(selectedServingSize, index) => {
                                        setQuantitySelected("");
                                        setSingalItemprice(0);
                                        setPrice(0);
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
                            </div>
                        </div>

                        <div className={`${style.inputContainer}`}>
                            <div className={`${style.inputArea}`}>
                                <div className={`${style.inputLabel}`}>
                                    <span style={{ color: 'red' }}>* </span>
                                    Quantity </div>
                                <input
                                    className={`${style.textInputBox}`}
                                    type="text"
                                    name="quantity"
                                    id='appliedQuantity'
                                    value={quantitySelected}
                                    style={{ width: "200px" }}

                                    onChange={(e) => {
                                        calc(e)
                                        validateOnInput("quantity", e.target.value);
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
                                    className={`${style.textInputBox} ${style.disabledInputBox}`}
                                    type="text"
                                    name="price"
                                    id='singlePrice'

                                    value={singalItemprice}
                                    disabled
                                    onChange={(e) => {
                                    }}
                                    maxLength={255}
                                />
                            </div>
                            <div className={`${style.inputErrorArea}`}>
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
                                    disabled

                                    onChange={(e) => {
                                    }}
                                    maxLength={255}
                                />
                            </div>
                            <div className={`${style.inputErrorArea}`}>
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
