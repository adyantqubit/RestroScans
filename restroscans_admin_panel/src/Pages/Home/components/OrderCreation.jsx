import React, { useEffect, useState } from 'react'
import style from './orderCreation.module.css'
import { Modal } from 'antd'
import { BiPlus, BiMinus } from 'react-icons/bi'
import { AiOutlineDelete } from 'react-icons/ai'
import AddOrderItemForm from '../../Order/AddOrderItemForm'
import { getSettingsDetails, postCustomerDetails } from '../../../Api/services'
import { json } from 'react-router-dom'
import { Message } from '../../../App'
function OrderCreation({ IsOrderPopupVisible, setOrderPopupvisible ,setRecall,recall}) {

    const [AddMoreItemmodalVisible, setAddMoreItemModalVisible] = useState(false)
    var [orderItemList, setOrderItemList] = useState([])
    var [errorText,setErrorText]=useState({})
    var [settings, setSettings] = useState({});
    var [subtotal, setSubtotal] = useState(0);
    var [cgst, setCGST] = useState(0);
    var [sgst, setSGST] = useState(0);
    var [total, setTotal] = useState(0);
    var [contact,setContact]=useState("");
    const [table_number,setTableNumber]=useState("")
    const [email,setEmail]=useState("")
    const [payment,setPayment]=useState(null)
    const [name,setName]=useState("")


    useEffect(() => {
        getSettingData()
    }, [])


    const getSettingData = async () => {
        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
        var response = await getSettingsDetails(tenant);
        if (response) {
            setSettings(response.setting);
        }
    };

    function increaseDecrease(sign, index) {
        if (sign == "+") {
            orderItemList[index].quantity = parseInt(orderItemList[index].quantity) + 1;
            orderItemList[index].price = (orderItemList[index].quantity * (orderItemList[index].price / (orderItemList[index].quantity - 1))).toFixed(2)
            setOrderItemList([...orderItemList])

        } else {
            if (orderItemList[index].quantity != 1) {
                orderItemList[index].quantity = parseInt(orderItemList[index].quantity) - 1;
                orderItemList[index].price = (orderItemList[index].quantity * (orderItemList[index].price / (orderItemList[index].quantity + 1))).toFixed(2)
                setOrderItemList([...orderItemList])
            }
        }
    }

    function removeItem(){
        
    }


    useEffect(() => {

        var subtotal = 0;
        orderItemList.filter(e => {
            subtotal += parseFloat(e.price);
        })
        subtotal=subtotal.toFixed(2)
        if (settings.cgst){
            var cgst = settings.cgst * (subtotal / 100);
            setCGST(cgst);
        }


        if (settings.sgst){
            var sgst = settings.sgst * (subtotal / 100);
            setSGST(sgst);
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

        setSubtotal(subtotal);
        setTotal(total)
        
    }, [orderItemList])



    const SubmitOrder=async ()=>{

        if(contact.length<10){
            errorText.contact_number="Contact Number should not be less than 10";
        }
        else if(contact.length>10){
            errorText.contact_number="Contact Number should not be more than 10";
        }
        else{
            delete errorText.contact_number;
        }

        if(orderItemList.length==0){
            Message("Please add item !","error")
        }

        setErrorText({...errorText})

        const formData={
            cart:orderItemList,
            contact_number:contact,
            payment_mode:payment,
            email:email,
            name:name,
            table_number:table_number,
        }


        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;

        if(Object.keys(errorText).length==0 && orderItemList.length>0);
        await postCustomerDetails(formData, tenant).then(r=>{
            Message("Succefully Created","success");
            setRecall([...[""]])
            clearData()
            setOrderPopupvisible(false)
        });

    }


    function clearData(){
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


    return <Modal open={IsOrderPopupVisible} onCancel={e => {setOrderPopupvisible(false); clearData()}}
        width="80vw" style={{ height: "80vh", top: "10vh", bottom: "10vh" }}
        okText="Create"
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
                <div className={style.formHeading}>Please fill Customer Details</div>
                <div className={style.inputBoxContains}>
                    <div className={style.inputBox}>
                        <label className={style.inputLabel}>Tabel Number *</label>
                        <input className={style.inputfield} value={table_number} onChange={e=>{
                            if(e.target.value.length){
                               delete errorText.table_number
                            }else{
                                errorText.table_number="Table Number should not be blank."
                            }

                            setErrorText({...errorText})
                            setTableNumber(e.target.value);
                            }}/>
                        <div className={style.errorText}>{errorText?.table_number}</div>
                    </div>
                    <div className={style.inputBox}>
                        <label className={style.inputLabel}>Contact Number *</label>
                        <input className={style.inputfield} value={contact} onChange={e=>{
                            if(e.target.value.length&&/^\d+$/.test(e.target.value)){
                             delete errorText.contact_number
                            }
                            else {
                             errorText.contact_number="contact number should not be blank."
                            }
                            
                            setErrorText({...errorText});
                            if(/^\d+$/.test(e.target.value)||e.target.value.length==0)
                            setContact(e.target.value);
                            
                            }}/>
                        <div className={style.errorText}>{errorText?.contact_number}</div>
                    </div>
                    <div className={style.inputBox}>
                        <label className={style.inputLabel}>Name </label>
                        <input className={style.inputfield} value={name} onChange={e=>setName(e.target.value)}/>
                        {/* <div className={style.errorText}>Tabel number should not be blank</div> */}
                    </div>
                    <div className={style.inputBox}>
                        <label className={style.inputLabel}>Email </label>
                        <input className={style.inputfield} value={email} onChange={e=>{
                            var emailRegex =
                            new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm");

                            if(e.target.value.length&&emailRegex.test(e.target.value))
                            delete errorText.email
                            else
                             errorText.email="Enter valid email example@gmail.com"

                             setErrorText({...errorText})
                            setEmail(e.target.value)
                            }}/>
                        <div className={style.errorText}>{errorText?.email}</div>
                    </div>
                    <div className={style.inputBox}>
                        <label className={style.inputLabel}>Payment Mode </label>
                        <select defaultValue={payment} onChange={e=>setPayment(e)} className={style.inputfield} >
                            <option value={null}>*------*</option>
                            <option value="cash">Cash</option>
                            <option value="scanner">Scanner</option>
                        </select>
                        {/* <div className={style.errorText}>Payment mode should not be blank</div> */}
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
                                <div className={style.row}>
                                    <div className={style.sNoColumn}>{i + 1}</div>
                                    <div className={style.itemNameColumn}>{e.name} ( {e.serve_size} )</div>
                                    <div className={style.quantityColumn}>
                                        <span className={style.plus} onClick={e => increaseDecrease("-", i)}><BiMinus /></span>
                                        <span className={style.quantityAdded}>{e.quantity}</span>
                                        <span className={style.minus} onClick={e => increaseDecrease("+", i)}><BiPlus /></span>
                                    </div>
                                    <div className={style.priceColumn}>{e.price}</div>
                                    <div className={style.action}>
                                        {/* <div className={style.resposivePrice}>340000</div> */}
                                        <button className={style.removeBtn}><span className={style.responsiveBTNText}>Remove</span><span className={style.mobileBtnText}><AiOutlineDelete className={style.deletebtn} /></span></button>
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
                                <div className={style.priceData}>SubTotal -:</div>
                                <div className={style.priceData}>{subtotal}</div>
                            </div>
                            <div className={style.priceRow}>
                                <div className={style.priceData}>CGST -:</div>
                                <div className={style.priceData}>{cgst}</div>
                            </div>
                            <div className={style.priceRow}>
                                <div className={style.priceData}>SGST -:</div>
                                <div className={style.priceData}>{sgst}</div>
                            </div>
                            <div className={style.priceRow}>
                                <div className={style.priceData}>Total -:</div>
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