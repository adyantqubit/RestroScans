import React, { useEffect, useState } from 'react'
import style from './orderCreation.module.css'
import { Modal } from 'antd'
import { BiPlus, BiMinus } from 'react-icons/bi'
import { AiOutlineDelete } from 'react-icons/ai'
import AddOrderItemForm from '../../Order/AddOrderItemForm'
import { getSettingsDetails, postCustomerDetails } from '../../../Api/services'
import { json } from 'react-router-dom'
import { Message } from '../../../App'
function OrderCreation({ IsOrderPopupVisible, setOrderPopupvisible, setRecall, recall }) {

    const [AddMoreItemmodalVisible, setAddMoreItemModalVisible] = useState(false)
    var [orderItemList, setOrderItemList] = useState([])
    var [errorText, setErrorText] = useState({})
    var [settings, setSettings] = useState({});
    var [restaurant, setRestaurant] = useState(null)
    var [subtotal, setSubtotal] = useState(0);
    var [cgst, setCGST] = useState(0);
    var [sgst, setSGST] = useState(0);
    var [total, setTotal] = useState(0);
    var [contact, setContact] = useState("");
    const [table_number, setTableNumber] = useState("")
    const [email, setEmail] = useState("")
    const [payment, setPayment] = useState(null)
    const [name, setName] = useState("")


    useEffect(() => {
        getSettingData()
    }, [])


    const getSettingData = async () => {
        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
        var response = await getSettingsDetails(tenant);
        if (response) {
            setSettings(response.setting);
            setRestaurant(response.restaurant)
        }
    };

    function increaseDecrease(sign, index) {
        if (sign == "+") {
            orderItemList[index].quantity = parseInt(orderItemList[index].quantity) + 1;
            orderItemList[index].price = (orderItemList[index].quantity * (orderItemList[index].price / (orderItemList[index].quantity - 1)))
            setOrderItemList([...orderItemList])

        } else {
            if (orderItemList[index].quantity != 1) {
                orderItemList[index].quantity = parseInt(orderItemList[index].quantity) - 1;
                orderItemList[index].price = (orderItemList[index].quantity * (orderItemList[index].price / (orderItemList[index].quantity + 1)))
                setOrderItemList([...orderItemList])
            }
        }
    }

    function removeItem(index) {
        orderItemList.splice(index, 1)
        setOrderItemList([...orderItemList])
    }


    useEffect(() => {

        var subtotal = 0;
        orderItemList.filter(e => {
            subtotal += parseFloat(e.price);
        })
        subtotal = subtotal
        if (settings.cgst) {
            var cgst = settings.cgst * (subtotal / 100);
            setCGST(cgst.toFixed(2));
        }


        if (settings.sgst) {
            var sgst = settings.sgst * (subtotal / 100);
            setSGST(sgst.toFixed(2));
        }


        if (settings.sgst && settings.cgst) {
            var total = subtotal + cgst + sgst;
        }
        else if (settings.cgst) {
            var total = subtotal + cgst;
        }
        else if (settings.sgst) {
            var total = subtotal + sgst;
        }
        else {
            var total = subtotal;
        }

        setSubtotal(subtotal.toFixed(2));
        setTotal(total.toFixed(2))

    }, [orderItemList])



    const SubmitOrder = async () => {

        if (table_number.length == 0)
            errorText.table_number = "Please enter table number";
         //Modified by Rohan kansari - 7/9/23
        // Reason - To validate number if entered otherwise get from backend admin table
        
        // if (contact.length == 0) {
        //     errorText.contact_number = "Please enter contact number";
        // }
        if (contact.length != 0 && contact.length < 10) {
            errorText.contact_number = "Contact Number should not be less than 10 digits";
        }
        else if (contact.length > 10) {
            errorText.contact_number = "Contact Number should not be more than 10 digits";
        }
        else {
            delete errorText.contact_number;
        }

        if (orderItemList.length == 0) {
            Message("Please add item !", "error")
        }
        
        // Addded by Rohan kansari - 22/9/23 
        // Reason - To add waiter detail
        var waiterData=JSON.parse(localStorage.getItem("waiterData"));
        if (contact.length == 0) { 
            if(waiterData)
            contact=waiterData.contact_number
            else
            contact = restaurant.contact_number % 1e10
            if (contact.length < 10) {
                errorText.contact_number = "Admin Contact Number should not be less than 10 digits";
            }
            else {
                delete errorText.contact_number;
            }
        }
        // else
        //     contact = restaurant.contact_number % 1e10
        
        setContact(contact)    
        // console.log(contact)
        setErrorText({ ...errorText })

        const formData = {
            cart: orderItemList,
            contact_number: contact,
            payment_mode: payment,
            email: email,
            name: name,
            table_number: table_number,
            validate_table: true,
            order_created_by: waiterData?"Waiter":"Admin",
           
        }

        if(waiterData)
        formData["waiter_contact_number"]=waiterData.contact_number
         //End of Modification by Rohan kansari - 7/9/23
        // Reason - To validate number if entered otherwise get from backend admin table
        // End of code by Rohan kansari - 22/9/23 
        // Reason - To add waiter detail

        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;

        if (Object.keys(errorText).length == 0 && orderItemList.length > 0)
            await postCustomerDetails(formData, tenant).then(r => {
                if (r.tabel_error) {

                    Message("This tabel is not vacant", "error");
                } else {
                    Message("Successfully order created", "success");
                    setRecall([...[""]])
                    clearData()
                    setOrderPopupvisible(false)
                }
            });

    }


    function clearData() {
        setOrderItemList([])
        setErrorText({})
        setSubtotal(0)
        setCGST(0)
        setSGST(0)
        setTotal(0)
        setContact("")
        setTableNumber("")
        setEmail("")
        setPayment(null)
        setName("")
    }


    return <Modal open={IsOrderPopupVisible} onCancel={e => { setOrderPopupvisible(false); clearData() }}
        // width="70vw" style={{ height: "80vh", top: "10vh", bottom: "10vh" }}
        okText="Create"
        className={style.modelContainer}
        onOk={SubmitOrder}
    >
        <div className={style.container}>
            <div className={style.header}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    footer={null}
                    open={AddMoreItemmodalVisible}
                    closable={false}
                    keyboard={false}
                >
                    <AddOrderItemForm modalvisibilityFn={setAddMoreItemModalVisible}
                        modalvisibility={AddMoreItemmodalVisible} setOrderItemList={setOrderItemList} orderItemList={orderItemList}
                        doICallBackend={false} />

                </Modal>
            </div>
            <div className={style.customerDetailForm}>
                <div>
                    <div className={style.formHeading}>Please fill Customer Details</div>
                    <div className={style.inputBoxContains}>
                        {/* Modified by Rohan kansari - 27/8/23
                            Reason - To change input fields according to requirements */}
                        <div className={style.inputBox}>
                            <label className={style.inputLabel}>Table Number <span className={style.mandatory}>*</span></label>
                            {/*Added by Rohna kansari - 2/9/23 - To align input field */}
                            <div>
                                <input className={style.tableInputfield} value={table_number} onChange={e => {
                                    if (e.target.value.length) {
                                        delete errorText.table_number
                                    } else {
                                        errorText.table_number = "Table Number should not be blank."
                                    }

                                    setErrorText({ ...errorText })
                                    setTableNumber(e.target.value);
                                }} />
                                <div className={style.tableErrorText}>{errorText?.table_number}</div>
                            </div>
                        </div>
                        <div className={style.inputBox}>
                            <label className={style.inputLabel}>Contact Number 
                            {/* Removed by Rohan kansari - 8/9/23 
                                Reason - Now contact number is not mandatory */}
                            {/* <span className={style.mandatory}>*</span> */}
                            </label>
                            <div>
                                <input className={style.contactInputfield} value={contact} onChange={e => {
                                
                                     //Modified by Rohan kansari - 7/9/23
                                     // Reason - To validate number if entered otherwise get from backend admin table
       
                                    // if (e.target.value.length && /^\d+$/.test(e.target.value)) {
                                    //     delete errorText.contact_number
                                    // }
                                    // else {
                                    //     errorText.contact_number = "contact number should not be blank."
                                    // }

                                    // setErrorText({ ...errorText });
                                    // if (/^\d+$/.test(e.target.value) || e.target.value.length == 0)
                                    //     setContact(e.target.value);
                                    //End of Modification by Rohan kansari - 7/9/23
                                    // Reason - To validate number if entered otherwise get from backend admin table
       
                                    if (/^\d+$/.test(e.target.value) || e.target.value.length == 0)
                                        setContact(e.target.value);

                                }
                                } />
                                <div className={style.contactErrorText}>{errorText?.contact_number}</div>
                            </div>
                        </div>
                        <div className={style.inputBox}>
                            <label className={style.inputLabel}>Name </label>
                            <input className={style.nameInputfield} value={name} onChange={e => setName(e.target.value)} />
                            {/* <div className={style.errorText}>Tabel number should not be blank</div> */}
                        </div>
                        <div className={style.inputBox}>
                            <label className={style.inputLabel}>Email </label>
                            <div>
                                <input className={style.emailInputfield} value={email} onChange={e => {
                                    var emailRegex =
                                        new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm");

                                    if (e.target.value.length && emailRegex.test(e.target.value))
                                        delete errorText.email
                                    else
                                        errorText.email = "Enter valid email example@gmail.com"

                                    setErrorText({ ...errorText })
                                    setEmail(e.target.value)
                                }} />
                                <div className={style.emailErrorText}>{errorText?.email}</div>
                            </div>
                            {/* MEnd of code by Rohan kansari - 27/8/23
                            Reason - To change input fields according to requirements */}
                        </div>
                        {/* <div className={style.inputBox}>
                            <label className={style.inputLabel}>Payment Mode </label>
                            <select defaultValue={payment} onChange={e => setPayment(e.target.value)} className={style.inputfield} >
                                <option value={null}> --- </option>
                                <option value="Cash">Cash</option>
                                <option value="Scanner">Scanner</option>
                            </select>
                            {/* <div className={style.errorText}>Payment mode should not be blank</div> 
                        </div> */}
                    </div>
                </div>
                <div className={style.listNPricingFlexBox}>
                    {/* item list */}
                    <div className={style.itemListContainer}>
                        <div className={style.listHeader}>
                            <div className={style.listHeading}>Item List</div>
                            <button className={style.addItemBtn} onClick={e => setAddMoreItemModalVisible(true)}>
                                Add Item
                            </button>
                        </div>
                        <div className={style.listRowHeading}>
                            <div className={style.sNo}><span className={style.responsiveBTNText}>S.No.</span><span className={style.mobileBtnText}>#</span></div>
                            <div className={style.itemName}>Item Name</div>
                            <div className={style.quantity}><span className={style.responsiveBTNText}>Quantity</span><span className={style.mobileBtnText}>Qty</span></div>
                            <div className={style.price}>Price</div>
                            <div className={style.action}></div>
                        </div>
                        <div className={style.listRow}>

                            {orderItemList.length > 0 ? orderItemList.map((e, i) =>
                                <div className={style.row} style={{ background: i % 2 == 0 ? "#f1f1f1c2" : "#fff" }}>
                                    <div className={style.sNoColumn}>{i + 1}</div>
                                    <div className={style.itemNameColumn}>{e.name} ({e.serve_size})</div>
                                    <div className={style.quantityColumn}>
                                        <span className={style.plus} onClick={e => increaseDecrease("-", i)}><BiMinus /></span>
                                        <span className={style.quantityAdded}>{e.quantity}</span>
                                        <span className={style.minus} onClick={e => increaseDecrease("+", i)}><BiPlus /></span>
                                    </div>
                                    <div className={style.priceColumn}>{e.price.toFixed(2)}</div>
                                    <div className={style.action}>
                                        {/* <div className={style.resposivePrice}>340000</div> */}
                                        <button className={style.removeBtn} onClick={e => removeItem(i)}><span className={style.responsiveBTNText}>Remove</span><span className={style.mobileBtnText}><AiOutlineDelete className={style.deletebtn} /></span></button>
                                    </div>
                                </div>
                            ) :
                                <div className={`${style.row} ${style.emptyRow}`}>Currently! No item added.</div>
                            }


                        </div>
                    </div>

                    {/* Subtotal section */}
                    <div className={style.priceContainer}>
                        <div className={style.blankSpace}>

                        </div>
                        <div className={style.priceContains}>
                            <div className={style.priceRow}>
                                <div className={style.priceData}>SubTotal :-</div>
                                <div className={style.priceData}>{subtotal}</div>
                            </div>
                            {settings.cgst > 0 ? <div className={style.priceRow}>
                                <div className={style.priceData}>CGST ({settings.cgst}%) :-</div>
                                <div className={style.priceData}>{cgst}</div>
                            </div> : null}
                            {settings.sgst > 0 ? <div className={style.priceRow}>
                                <div className={style.priceData}>SGST ({settings.sgst}%) :-</div>
                                <div className={style.priceData}>{sgst}</div>
                            </div> : null}
                            <div className={style.priceRow}>
                                <div className={style.priceData}>Total :-</div>
                                <div className={style.priceData}>{total}</div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    </Modal>

}

export default OrderCreation;