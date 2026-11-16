import React, { useEffect } from 'react'
import style from '../style/orderCreation.module.css'
import { Modal } from '../../../../ui'
import { BiPlus, BiMinus } from 'react-icons/bi'
import { AiOutlineDelete } from 'react-icons/ai'
import AddOrderItemForm from '../../../Order/user_interface/components/AddOrderItemForm'
import { loadSettings, createStaffOrder, changeStaffLineQuantity, removeStaffLine, staffOrderTotals, staffOrderDraft } from '../../services/homeService'
import { useStaffOrderForm } from '../../usestate/homeState'
import { json } from 'react-router-dom'
import { useApp } from '../../../../Context/AppContext'
function OrderCreation({ IsOrderPopupVisible, setOrderPopupvisible, setRecall, recall, seatTable, seatAt }) {
    const { Message } = useApp();

    const {
        AddMoreItemmodalVisible, setAddMoreItemModalVisible,
        orderItemList, setOrderItemList,
        errorText, setErrorText,
        settings, setSettings,
        restaurant, setRestaurant,
        subtotal, setSubtotal,
        cgst, setCGST,
        sgst, setSGST,
        total, setTotal,
        contact, setContact,
        table_number, setTableNumber,
        email, setEmail,
        payment, setPayment,
        name, setName,
    } = useStaffOrderForm()

    useEffect(() => {
        getSettingData()
    }, [])

    useEffect(() => {
        if (seatTable) setTableNumber(seatTable)
    }, [seatTable, seatAt])

    const getSettingData = async () => {
        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
        var response = await loadSettings(tenant);
        if (response) {
            setSettings(response.setting);
            setRestaurant(response.restaurant)
        }
    };

    function increaseDecrease(sign, index) {
        if (changeStaffLineQuantity(orderItemList, index, sign))
            setOrderItemList([...orderItemList])
    }

    function removeItem(index) {
        setOrderItemList(removeStaffLine(orderItemList, index))
    }

    useEffect(() => {
        var totals = staffOrderTotals(orderItemList, settings);
        if (settings.cgst) setCGST(totals.cgst);
        if (settings.sgst) setSGST(totals.sgst);
        setSubtotal(totals.subtotal);
        setTotal(totals.total);
    }, [orderItemList])

    const SubmitOrder = async () => {
        var waiterData = JSON.parse(localStorage.getItem("waiterData"));
        var draft = staffOrderDraft(errorText, orderItemList, contact, payment, email, name, table_number, restaurant, waiterData);

        if (orderItemList.length == 0) {
            Message("Please add item !", "error")
        }

        setContact(draft.phone)
        setErrorText({ ...errorText })

        const formData = draft.formData

        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;

        if (Object.keys(errorText).length == 0 && orderItemList.length > 0)
            await createStaffOrder(formData, tenant).then(r => {
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
                        <div className={style.inputBox}>
                            <label className={style.inputLabel}>Table Number <span className={style.mandatory}>*</span></label>
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
                            </label>
                            <div>
                                <input className={style.contactInputfield} value={contact} onChange={e => {
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
                                        if(e.target.value.length>0)
                                        errorText.email = "Enter valid email example@gmail.com"
                                        else
                                        delete errorText.email

                                    setErrorText({ ...errorText })
                                    setEmail(e.target.value)
                                }} />
                                <div className={style.emailErrorText}>{errorText?.email}</div>
                            </div>
                        </div>
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
