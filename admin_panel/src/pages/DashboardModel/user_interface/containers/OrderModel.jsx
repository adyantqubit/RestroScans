import React, { useEffect } from "react";
import style from "../style/ordermodel.module.css";
import { Modal } from "../../../../ui";
import "../../../Home/user_interface/style/checkboxNcoin.scss";
import { AiOutlineClose } from "react-icons/ai";
import { MdAddCircleOutline } from "react-icons/md";
import { useApp } from "../../../../Context/AppContext";
import { saveOrderDetails, saveItemStatus } from "../../services/dashboardModelService";
import {
    applyDiscountPercentage,
    applyDiscountRupees,
    applyLoyaltyPoints,
    canPrintBill,
    changeQuantity,
    isEditable,
} from "../../services/orderCalculations";
import { orderStatusChange } from "../../../Home/services/homeService";
import { PrintKot } from "../../../Home/user_interface/components/PrintKot";
import PrintBill from "../../../Home/user_interface/components/PrintBill";
import AddOrderItemForm from "../../../Order/user_interface/components/AddOrderItemForm";
import { useOrderModelState } from "../../usestate/orderModelState";
import OrderActionBar from "../components/OrderActionBar";
import CustomerDetails from "../components/CustomerDetails";
import StatusSteps from "../components/StatusSteps";
import OrderItemsList from "../components/OrderItemsList";
import DiscountAndCancelForm from "../components/DiscountAndCancelForm";
import PriceSummary from "../components/PriceSummary";

const OrderModel = ({
    isOpen,
    setting,
    restroDetail,
    selectedOrder,
    setSelectedOrder,
    selectedOrderItems,
    setSelectedOrderItems,
    setModelVisiblity,
}) => {
    const { Message } = useApp();
    var {
        orderItem,
        setOrderItem,
        orderObject,
        setOrderobject,
        unUpdatedOrderObj,
        setUnupdatedOrderObj,
        unUpdatedOrderItemObj,
        setUnupdatedOrderItemObj,
        inputEnable,
        setInputEnable,
        tickedItems,
        setTickedItems,
        AddMoreItemmodalVisible,
        setAddMoreItemModalVisible,
        errorText,
        setErrorText,
        isCancelClicked,
        setCancelClicked,
        cancelReason,
        setCancelReason,
    } = useOrderModelState();

    const editable = isEditable(JSON.parse(unUpdatedOrderObj));
    const billable = canPrintBill(JSON.parse(unUpdatedOrderObj));

    useEffect(() => {
        setOrderobject({ ...selectedOrder });
        setOrderItem([...selectedOrderItems]);
        setUnupdatedOrderObj(JSON.stringify(selectedOrder));
        setUnupdatedOrderItemObj(JSON.stringify(selectedOrderItems));
    }, [selectedOrder]);

    async function updateCustomerDetail(field) {
        const updatedOrderData = JSON.parse(unUpdatedOrderObj);
        updatedOrderData["table_number"] = orderObject.table_number;
        updatedOrderData["customer_email"] = orderObject.customer_email;
        updatedOrderData["customer_name"] = orderObject.customer_name;
        updatedOrderData["payment_mode"] = orderObject.payment_mode;
        updatedOrderDetailAPI(updatedOrderData, field);
    }

    async function UpdateOrderStatusDetail(status, field) {
        const updatedOrderData = JSON.parse(unUpdatedOrderObj);
        updatedOrderData["order_status"] = status;
        updatedOrderDetailAPI(updatedOrderData, field);
    }

    async function UpdatePaymentStatusDetail(status, field) {
        const updatedOrderData = JSON.parse(unUpdatedOrderObj);
        updatedOrderData["payment_status"] = status;
        updatedOrderDetailAPI(updatedOrderData, field);
    }

    // Saving: a cancellation needs its reason first; otherwise save whatever changed.
    async function updateOrderDetail(field) {
        if (isCancelClicked && orderObject.cancel_reason == "") {
            requireCancelReason();
        } else if (isCancelClicked) {
            closePopup();
            updatedOrderDetailAPI(cancelledOrder(), field);
        } else if (unUpdatedOrderObj == JSON.stringify(orderObject)) {
            Message("No changes detected", "error");
        } else {
            updatedOrderDetailAPI(orderObject, field);
        }
    }

    // The saved order, marked cancelled by whoever is signed in.
    function cancelledOrder() {
        const order = JSON.parse(unUpdatedOrderObj);
        order["cancelled_by"] = localStorage.getItem("waiterData") ? "Waiter" : "Admin";
        order["order_status"] = "Cancelled";
        order["cancel_reason"] = cancelReason;
        return order;
    }

    function requireCancelReason() {
        ((document.getElementById("cancelInput") || { style: {} }).style.borderBottom = "1px solid red");
        errorText["cancelReason"] = "Please enter reason and apply";
        setErrorText({ ...errorText });
        setCancelClicked(true);
    }

    function cancelOrder(field) {
        if (!statusValidation("Cancelled", orderObject.payment_status, orderObject, true)) return;
        if (orderObject.cancel_reason.length == 0 && orderObject.order_status != "Cancelled") {
            document.getElementById("cancelInput").scrollIntoView();
            requireCancelReason();
        } else {
            ((document.getElementById("cancelInput") || { style: {} }).style.borderBottom = "1px solid #9c9c9c");
            errorText["cancelReason"] = "";
            setErrorText({ ...errorText });
            updatedOrderDetailAPI(cancelledOrder(), field);
        }
    }

    async function updatedOrderDetailAPI(order, sectionName) {
        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
        const response = await saveOrderDetails(tenant, order);
        if (response.msg) {
            Message(`${sectionName} saved successfully`, "success");
            setOrderobject(response.orderData);
            setUnupdatedOrderObj(JSON.stringify(response.orderData));
            setOrderItem(response.orderItems.sort((a, b) => b.id - a.id));
            setUnupdatedOrderItemObj(
                JSON.stringify(response.orderItems.sort((a, b) => b.id - a.id))
            );
        } else {
            Message("No changes detected", "error");
        }
    }

    async function updateOrderItemStatus(items) {
        if (JSON.stringify(items) == unUpdatedOrderItemObj) {
            Message("No Changes Detected", "error");
        } else {
            var kotItems = items.filter((o) => {
                if (o.kot_print_status == false && o.item_status == "Confirm") {
                    return o;
                }
            });
            PrintKot(orderObject, kotItems, restroDetail, setting);
            const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
            await saveItemStatus(tenant, items, items[0].order_id).then(
                (response) => {
                    setOrderItem([...response.order_items]);
                    setUnupdatedOrderItemObj(JSON.stringify(response.order_items));
                    setTickedItems([]);
                    setOrderobject({ ...response.order });
                    setUnupdatedOrderObj(JSON.stringify(response.order));
                    Message("Order Item Updated Successfully", "success");
                }
            );
        }
    }

    function AddTickedOrderitem(DoIAdd, data, index) {
        if (DoIAdd) {
            setTickedItems([...tickedItems, data]);
        } else {
            setTickedItems([...tickedItems.filter((t) => t.id != data.id)]);
        }
    }

    function statusValidation(order_status, payment_status, m, msgEnable) {
        var result = orderStatusChange(m, order_status, payment_status);
        if (!result.allowed && msgEnable)
            Message(result.message, "error");
        return result.allowed;
    }

    function sendPrintDatas() {
        PrintBill(
            JSON.parse(unUpdatedOrderObj),
            JSON.parse(unUpdatedOrderItemObj),
            restroDetail,
            setting
        );
    }

    function increaseAndDecrease(sign, index) {
        const changed = changeQuantity(orderItem[index], sign);
        if (changed) {
            Object.assign(orderItem[index], changed);
            setOrderItem([...orderItem]);
        }
    }

    const handlemoreItemCancel = () => {
        setAddMoreItemModalVisible(false);
    };

    useEffect(() => {
        if (orderItem.length != JSON.parse(unUpdatedOrderItemObj).length || JSON.stringify(orderObject) != unUpdatedOrderObj) {
            setUnupdatedOrderItemObj(JSON.stringify(orderItem));
            setUnupdatedOrderObj(JSON.stringify(orderObject));
        }
    }, [orderItem]);

    function inputIvalidationDiscountRupees(e) {
        applyCalculation(applyDiscountRupees(orderObject, JSON.parse(unUpdatedOrderObj), e.target.value));
    }

    function inputValidationDiscountPercentage(e) {
        applyCalculation(applyDiscountPercentage(orderObject, JSON.parse(unUpdatedOrderObj), e.target.value));
    }

    // Writes a calculation result (see orderCalculations.js) onto the order, the error texts and the inputs.
    function applyCalculation({ fields, errors, borders }) {
        Object.assign(orderObject, fields);
        Object.assign(errorText, errors);
        setErrorText({ ...errorText });
        borders.forEach(([id, border]) => {
            ((document.getElementById(id) || { style: {} }).style.border = border);
        });
        setOrderobject({ ...orderObject });
    }

    function validateLoyalityPoint(e) {
        applyCalculation(
            applyLoyaltyPoints(orderObject, JSON.parse(unUpdatedOrderObj), e.target.value, setting.per_loyality_point_value)
        );
    }

    // Both the X, the backdrop/Esc and the Close button leave the same way: clear the red borders and
    // messages the inputs may be showing, then hide the popup.
    function closePopup() {
        ["discount_percentage", "discount_rupees", "cancelInput", "loyality_point"].forEach((id) => {
            const input = document.getElementById(id);
            if (input) input.style.border = "1px solid #9c9c9c";
        });
        Object.assign(errorText, {
            cancelReason: "",
            discount_price: "",
            discount_percentage: "",
            loyality_point: "",
        });
        setErrorText({ ...errorText });
        setCancelClicked(false);
        setModelVisiblity(false);
    }

    return (
        <Modal

            open={isOpen}
            footer={null}
            className={style.modalContainer}
            closeIcon={<AiOutlineClose onClick={closePopup} />}
            onCancel={closePopup}>
            <Modal
                animationType="slide"
                transparent={true}
                footer={null}
                open={AddMoreItemmodalVisible}
                closable={false}
                keyboard={false}>
                <AddOrderItemForm
                    orderId={orderObject.order_id}
                    id={orderObject.id}
                    modalvisibilityFn={setAddMoreItemModalVisible}
                    modalvisibility={AddMoreItemmodalVisible}
                    onCancel={handlemoreItemCancel}
                    setOrderItems={setOrderItem}
                    setOrderDetail={setOrderobject}
                />
            </Modal>
            <div className={style.popupContainer}>
                {/* Model Heading and all action of model */}
                <OrderActionBar billable={billable} cancelOrder={cancelOrder} editable={editable} orderObject={orderObject} restroDetail={restroDetail} sendPrintDatas={sendPrintDatas} setting={setting} unUpdatedOrderItemObj={unUpdatedOrderItemObj} unUpdatedOrderObj={unUpdatedOrderObj} />
                {/* Model Heading and all action of model */}

                {/* Customer Informations and able to edit some fields */}
                <CustomerDetails editable={editable} inputEnable={inputEnable} orderObject={orderObject} setInputEnable={setInputEnable} setOrderobject={setOrderobject} unUpdatedOrderObj={unUpdatedOrderObj} updateCustomerDetail={updateCustomerDetail} />
                {/* Customer Informations and able to edit some fields */}

                {/* All order and payment status buttons */}
                <StatusSteps UpdateOrderStatusDetail={UpdateOrderStatusDetail} UpdatePaymentStatusDetail={UpdatePaymentStatusDetail} orderObject={orderObject} restroDetail={restroDetail} setting={setting} statusValidation={statusValidation} unUpdatedOrderItemObj={unUpdatedOrderItemObj} unUpdatedOrderObj={unUpdatedOrderObj} />
                {/* All order and payment status buttons */}

                {/* scroller content are visible here */}
                <div className={style.scrollContainer}>
                    {/* Order item Listing */}
                    <OrderItemsList AddTickedOrderitem={AddTickedOrderitem} editable={editable} increaseAndDecrease={increaseAndDecrease} orderItem={orderItem} orderObject={orderObject} setOrderItem={setOrderItem} tickedItems={tickedItems} unUpdatedOrderItemObj={unUpdatedOrderItemObj} updateOrderItemStatus={updateOrderItemStatus} />
                    {/* Order item Listing */}

                    {/* Add more item and subtotal */}
                    <div className={style.UpdateItemContainer}>
                        <button
                            className={`${style.UpdateItemBTN} ${editable ? null : style.disbaleBtn
                                }`}
                            onClick={(e) => setAddMoreItemModalVisible(true)}>
                            Add More items <MdAddCircleOutline style={{ fontSize: "18px" }} />
                        </button>
                        <div className={style.WhiteLabel}>
                            Subtotal : ₹{orderObject.sub_total}{" "}
                        </div>
                    </div>

                    {/* Add more item and subtotal */}

                    {/* Form and total amounts */}

                    <div className={style.TotalContainer}>
                        <div className={style.PricingContainer}>
                            <DiscountAndCancelForm editable={editable} errorText={errorText} inputIvalidationDiscountRupees={inputIvalidationDiscountRupees} inputValidationDiscountPercentage={inputValidationDiscountPercentage} orderObject={orderObject} setCancelReason={setCancelReason} setErrorText={setErrorText} setOrderobject={setOrderobject} setting={setting} updateOrderDetail={updateOrderDetail} validateLoyalityPoint={validateLoyalityPoint} />

                            <PriceSummary orderObject={orderObject} setting={setting} />
                        </div>
                    </div>
                    <div className={style.PrintNBack}>
                        <button
                            className={style.BackBtn}
                            onClick={closePopup}>
                            Close
                        </button>
                    </div>
                </div>
                {/* scroller content are visible here */}
            </div>
        </Modal>
    );
};

export default OrderModel;
