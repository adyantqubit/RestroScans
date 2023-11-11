// Created by Rohan kansari - 15/9/23 - To split dashboard model
import React, { useEffect, useState } from "react";
import style from "./ordermodel.module.css";
import { Modal, Popconfirm } from "antd";
import "../Home/components/checkboxNcoin.scss";
import { AiOutlineClose, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import { MdAddCircleOutline } from "react-icons/md";
import { Message } from "../../App";
import { TiTick } from "react-icons/ti";
import { saveOrderDetailsApi, updateItemStatus } from "../../Api/services";
import { PrintKot } from "../Home/components/PrintKot";
import PrintBill from "../Home/components/PrintBill";
import AddOrderItemForm from "../Order/AddOrderItemForm";
// Added by pratap sahu on 21-09-2023
// Reason: To Add Select DropDown Functionality in Payment Mode
import { Select } from "antd";
const { Option } = Select;
// End of Addition by pratap sahu on 21-09-2023
// Reason: To Add Select DropDown Functionality in Payment Mode

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
    const [orderItem, setOrderItem] = useState([]);
    const [orderObject, setOrderobject] = useState({});

    const [unUpdatedOrderObj, setUnupdatedOrderObj] = useState(
        JSON.stringify({})
    );
    const [unUpdatedOrderItemObj, setUnupdatedOrderItemObj] = useState(
        JSON.stringify({})
    );

    // selected editable input field
    const [inputEnable, setInputEnable] = useState("");

    const [tickedItems, setTickedItems] = useState([]);
    const [AddMoreItemmodalVisible, setAddMoreItemModalVisible] = useState(false);
    const [errorText, setErrorText] = useState({});

    const [isCancelClicked, setCancelClicked] = useState(false);

    // Added by pratap sahu on 04-11-2023 
    const [cancelReason,setCancelReason]=useState("")
    // End of code by pratap sahu on 04-11-2023 

    useEffect(() => {
        //  console.log(selectedOrder,"--------------------")
        setOrderobject({ ...selectedOrder });
        setOrderItem([...selectedOrderItems]);
        setUnupdatedOrderObj(JSON.stringify(selectedOrder));
        setUnupdatedOrderItemObj(JSON.stringify(selectedOrderItems));
        // console.log(restroDetail);
    }, [selectedOrder]);

    // Writing a function to define whenever button is blocked and enable
    // function isOrderChangable(){
    //     if(orderObject)
    // }

    async function updateCustomerDetail(field) {
        const updatedOrderData = JSON.parse(unUpdatedOrderObj);
        updatedOrderData["table_number"] = orderObject.table_number;
        updatedOrderData["customer_email"] = orderObject.customer_email;
        updatedOrderData["customer_name"] = orderObject.customer_name;
        // Added by pratap sahu on 21-09-2023
        // Reason: To Update Payment Mode
        updatedOrderData["payment_mode"] = orderObject.payment_mode;
        // End of Addition by pratap sahu on 21-09-2023
        // Reason: To Update Payment Mode
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

    async function updateOrderDetail(field) {
        // Added by pratap sahu on 04-11-2023 Reason :To remove validation of discount field
        // condition Modified by pratap sahu on 05-11-2023 Reason :to handle error from waiter side
        // if (isCancelClicked && (cancelReason=="")) {
        if(isCancelClicked && orderObject.cancel_reason==""){
            document.getElementById("cancelInput").style.borderBottom =
            "1px solid red";
            errorText["cancelReason"] = "Please enter reason and apply";
            setErrorText({ ...errorText });
            setCancelClicked(true)
        }
        // }
        
        // if (isCancelClicked) {
        // condition Modified by pratap sahu on 05-11-2023 Reason :to handle error from waiter side
        // else if (isCancelClicked && cancelReason!=""){
        else if (isCancelClicked && orderObject.cancel_reason!="") {
            // document.getElementById("cancelInput").style.borderBottom =
            // "1px solid #9c9c9c";
            // errorText["cancelReason"] = "";
            // // Added by pratap sahu on 04-11-2023 Reason :To remove validation of discount field
            // document.getElementById("discount_percentage").style.border =
            //     "1px solid #9c9c9c";
            // document.getElementById("discount_rupees").style.border =
            //     "1px solid #9c9c9c";
            // errorText["discount_price"] = "";
            // errorText["discount_percentage"]="";
            // errorText["loyality_point"] = "";
            // setCancelClicked(true)
            // setErrorText({ ...errorText });
            if(document.getElementById("cancelInput")){
                document.getElementById("cancelInput").style.border =
                "1px solid #9c9c9c";
                errorText["cancelReason"] = "";
                setErrorText({ ...errorText })
                setCancelClicked(false)
                setModelVisiblity(false)
            }else if(document.getElementById("discount_percentage") || document.getElementById("discount_rupees") || document.getElementById("cancelInput")){
                document.getElementById("discount_percentage").style.border =
                    "1px solid #9c9c9c";
                document.getElementById("discount_rupees").style.border =
                    "1px solid #9c9c9c";
                document.getElementById("cancelInput").style.border =
                    "1px solid #9c9c9c";
                errorText["cancelReason"] = "";
                errorText["discount_price"] = "";
                errorText["discount_percentage"]="";
                errorText["loyality_point"] = "";
                setErrorText({ ...errorText })
                setCancelClicked(false)
                setModelVisiblity(false)
            }   
            // End of code by pratap sahu on 04-11-2023 Reason :To remove validation of discount field
                // End of code by pratap sahu on 04-11-2023 Reason to handle error from waiter side
            //Modified by pratap sahu on 13-10-2023 To dsiplay no changes Apply Button
            //     const updatedOrderData = JSON.parse(unUpdatedOrderObj);
            //     if (localStorage.getItem("waiterData"))
            //         updatedOrderData["cancelled_by"] = "Waiter";
            //     else updatedOrderData["cancelled_by"] = "Admin";
            //     updatedOrderData["cancel_reason"] = orderObject.cancel_reason;
            //     updatedOrderData["order_status"] = "Cancelled";
            //     updatedOrderDetailAPI(updatedOrderData, field);
            // } else updatedOrderDetailAPI(orderObject, field);} 

            // if (localStorage.getItem("waiterData"))
            else if(localStorage.getItem("waiterData"))
                orderObject["cancelled_by"] = "Waiter";
            else orderObject["cancelled_by"] = "Admin";
            orderObject["cancel_reason"] = orderObject.cancel_reason;
            orderObject["order_status"] = "Cancelled";
            updatedOrderDetailAPI(orderObject, field);

        } 
        else {
            if (unUpdatedOrderObj == JSON.stringify(orderObject) ) {
                Message("No changes detected", "error")
            }else{
            updatedOrderDetailAPI(orderObject, field);
            }
        }
    //End of Modification by pratap sahu on 13-10-2023 To dsiplay no changes Apply Button
    }

    function cancelOrder(field) {
        if (
            statusValidation(
                "Cancelled",
                orderObject.payment_status,
                orderObject,
                true
            )
        ) {
            if (
                orderObject.cancel_reason.length == 0 &&
                orderObject.order_status != "Cancelled"
            ) {
                document.getElementById("cancelInput").scrollIntoView();
                document.getElementById("cancelInput").style.borderBottom =
                    "1px solid red";
                errorText["cancelReason"] = "Please enter reason and apply";
                setErrorText({ ...errorText });
                setCancelClicked(true);
            } else {
                document.getElementById("cancelInput").style.borderBottom =
                    "1px solid #9c9c9c";
                errorText["cancelReason"] = "";
                setErrorText({ ...errorText });
                const updatedOrderData = JSON.parse(unUpdatedOrderObj);
                if (localStorage.getItem("waiterData"))
                    updatedOrderData["cancelled_by"] = "Waiter";
                else updatedOrderData["cancelled_by"] = "Admin";
                updatedOrderData["order_status"] = "Cancelled";
                updatedOrderDetailAPI(updatedOrderData, field);
            }
        }
    }
// console.log(OldOrdervalue,'old order value')

    async function updatedOrderDetailAPI(order, sectionName) {
        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
        const response = await saveOrderDetailsApi(tenant, order);
        console.log("=====response=====",response)
            if(response.msg){
                Message(`${sectionName} saved successfully`, "success");
                setOrderobject(response.orderData);
                setUnupdatedOrderObj(JSON.stringify(response.orderData));
                setOrderItem(response.orderItems.sort((a, b) => b.id - a.id));
                setUnupdatedOrderItemObj(
                JSON.stringify(response.orderItems.sort((a, b) => b.id - a.id))
                );
            }else{
                Message("No changes detected", "error");

            }
        }
    //Commented And Added By pratap sahu on 21-09-2023
    // Reason:for proper validations on item added or status change
    // async function updateOrderItemStatus(items) {
    //     //  // Uses - Check wheter your old data is not equal to current changed data
    //     if (JSON.stringify(orderObject) == unUpdatedOrderItemObj) {
    //         Message("No changes detected", "error")
    //     }
    //     else {
    //         var kotItems = items.filter((o) => {
    //             if (o.kot_print_status == false && o.item_status == "Confirm") {
    //                 return o;
    //             }

    //         }
    //         )
    //         PrintKot(orderObject, kotItems, restroDetail, setting)

    //     }

    //     console.log(items, "-----------------")
    //     const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name
    //     await updateItemStatus(tenant, items, items[0].order_id).then(response => {
    //         setOrderItem([...response.order_items])
    //         setUnupdatedOrderItemObj(JSON.stringify(response.order_items))
    //         setTickedItems([])
    //         setOrderobject(response.order)
    //         setUnupdatedOrderObj(JSON.stringify(response.order))
    //         // r.order_items;
    //     })

    // }
    async function updateOrderItemStatus(items) {
        // Uses - Check whether old data is not equal to current changed data
        // Modified by Rohan kansari - 22/9/23 - To check sended item not order item
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
            await updateItemStatus(tenant, items, items[0].order_id).then(
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
    //End of Comment And Addition By pratap sahu on 21-09-2023
    // Reason:for proper validations on item added or status change

    // useEffect(() => {
    //     console.log(orderObject.table_number, selectedOrder.table_number);
    // }, [orderObject]);

    function capitalizeFLetter(string) {
        var stringArr = string.split(" ").map((e) => {
            if (e.length > 1)
                return e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
            else return e.toUpperCase();
        });

        return stringArr.join(" ");
    }

    function AddTickedOrderitem(DoIAdd, data, index) {
        if (DoIAdd) {
            setTickedItems([...tickedItems, data]);
        } else {
            setTickedItems([...tickedItems.filter((t) => t.id != data.id)]);
        }

        // console.log(tickedItems);
    }

    function statusValidation(order_status, payment_status, m, msgEnable) {
        if (
            m?.order_status == "Placed" &&
            (order_status == "Cooked" || order_status == "Served")
        ) {
            if (msgEnable)
                Message("Please first change order status to confirm ", "error");
            return false;
        } else if (m?.order_status == "Confirm" && order_status == "Placed") {
            if (msgEnable)
                Message("You cant change order status confirm to placed", "error");
            return false;
        } else if (
            m?.order_status == "Cooked" &&
            (order_status == "Confirm" || order_status == "Placed")
        ) {
            if (msgEnable)
                Message(
                    `You cant change order status cooked to ${order_status}`,
                    "error"
                );
            return false;
        } else if (
            m?.order_status == "Served" &&
            (order_status == "Confirm" ||
                order_status == "Placed" ||
                order_status == "Cooked")
        ) {
            if (msgEnable)
                Message(
                    `You cant change order status served to ${order_status}`,
                    "error"
                );
            return false;
        } else if (
            m?.order_status == "Cancelled" &&
            (order_status == "Pending" ||
                order_status == "Confirm" ||
                order_status == "Placed" ||
                order_status == "Cooked" ||
                order_status == "Served")
        ) {
            if (msgEnable)
                Message(
                    `You cant change order status cancel to ${order_status}`,
                    "error"
                );
            return false;
        } else if (m?.order_status == "Placed" && payment_status == "Completed") {
            if (msgEnable)
                Message(
                    `You cant change payment status completed till order is not confirmed.`,
                    "error"
                );
            return false;
        } else if (
            m?.payment_status == "Completed" &&
            payment_status == "Pending"
        ) {
            if (msgEnable)
                Message(
                    `You cant change payment status completed to ${payment_status}`,
                    "error"
                );
            return false;
        } else if (
            (m?.payment_status == "Completed" || m?.payment_status == "Paid") &&
            order_status == "Cancelled"
        ) {
            if (msgEnable)
                Message(
                    `You can't cancel order if payment is ${payment_status}`,
                    "error"
                );
            return false;
        } else if (
            m?.order_status == "Cancelled" &&
            payment_status == "Completed"
        ) {
            if (msgEnable)
                Message(
                    `You can't complete payment if order is ${order_status}`,
                    "error"
                );
            return false;
        } else if (m?.order_status == "Cancelled") {
            if (msgEnable)
                Message("You Can't change status if order is cancelled", "error");

            return false;
        } else return true;
    }

    function getOrderStatus() {
        if (
            JSON.parse(unUpdatedOrderObj).order_status != "Cancelled" &&
            JSON.parse(unUpdatedOrderObj).payment_status == "Pending"
        ) {
            return true;
        } else {
            return false;
        }
    }

    function getbillStatus() {
        if (
            JSON.parse(unUpdatedOrderObj).payment_status == "Completed" &&
            JSON.parse(unUpdatedOrderObj).order_status != "Cancelled"
        ) {
            return true;
        } else {
            return false;
        }
    }

    function sendPrintDatas() {
        PrintBill(
            JSON.parse(unUpdatedOrderObj),
            JSON.parse(unUpdatedOrderItemObj),
            restroDetail,
            setting
        );
    }

    function increaseAndDecrease(sign, index, orderId) {
        if (sign == "-") {
            if (orderItem[index].quantity != 1) {
                orderItem[index].quantity = --orderItem[index].quantity;
                orderItem[index].price =
                    (orderItem[index].price / (orderItem[index].quantity + 1)) *
                    orderItem[index].quantity;

                setOrderItem([...orderItem]);
            }
        } else {
            // Uses - same goes for increasing value
            orderItem[index].quantity = ++orderItem[index].quantity;
            orderItem[index].price =
                (orderItem[index].price / (orderItem[index].quantity - 1)) *
                orderItem[index].quantity;

            setOrderItem([...orderItem]);
        }
    }

    const handlemoreItemCancel = () => {
        setAddMoreItemModalVisible(false);
    };

    useEffect(() => {
    //Added by Rohan kansari - 29/9/23 - To update order in order item adding 
        if (orderItem.length != JSON.parse(unUpdatedOrderItemObj).length || JSON.stringify(orderObject) != unUpdatedOrderObj) {
            // console.log("run order item -----------------");
            setUnupdatedOrderItemObj(JSON.stringify(orderItem));
            setUnupdatedOrderObj(JSON.stringify(orderObject));
        }
       //End of addition by Rohan kansari - 29/9/23 - To update order in order item adding 
    
    }, [orderItem]);

    function inputIvalidationDiscountRupees(e) {
        var orderObj = JSON.parse(unUpdatedOrderObj)
        // console.log(orderObj)

        if (
            e.target.value.length > 0 && e.target.value < orderObject.sub_total &&
            (/^\d+$/.test(e.target.value) || e.target.value.includes("."))
        ) {
            var total_price =orderObject.sub_total -e.target.value -orderObject.loyality_point_price;
            // var total_price =orderObj.sub_total -discount_percentage -orderObject.loyality_point_price;
            var CGST = ((orderObj.cgst / (orderObj.total / 100)) * total_price) / 100;
            var SGST = ((orderObj.sgst / (orderObj.total / 100)) * total_price) / 100;
            orderObject["cgst"] = CGST;
            orderObject["sgst"] = SGST;
            orderObject["total"] = total_price;
            var discount_percentage = e.target.value / (orderObject.sub_total / 100);
            orderObject["final_amount"] = total_price + SGST + CGST;
            orderObject["discount_percentage"] = discount_percentage.toFixed(2);
            // we are using this for setting max decimal till 2 decimal point
            orderObject["discount_rupees"] =
                e.target.value.indexOf(".") >= 0
                    ? e.target.value.slice(0, e.target.value.indexOf(".") + 3)
                    : e.target.value;
            // setDiscountprice(parseFloat(e.target.value))
            errorText["discount_price"] = "";
            setErrorText({ ...errorText });
            document.getElementById("discount_rupees").style.border =
                "1px solid black";
            document.getElementById("discount_percentage").style.border =
                "1px solid black";
        } else if (e.target.value.length == 0) {
            var discount_percentage = 0.0;
            // setDiscountRupee("")
            orderObject["discount_percentage"] = 0.0;
        // Modified by pratap sahu on 21-10-2023 Reason:To set 0 when no input has given
            // orderObject["discount_rupees"] = "";
            orderObject["discount_rupees"] = 0;
        // Modified by pratap sahu on 21-10-2023 Reason:To set 0 when no input has given  
            var total_price = orderObj.total;
            var CGST = ((orderObj.cgst / (orderObj.total / 100)) * total_price) / 100;
            var SGST = ((orderObj.sgst / (orderObj.total / 100)) * total_price) / 100;
            orderObject["cgst"] = CGST;
            orderObject["sgst"] = SGST;
            orderObject["total"] = total_price;
            orderObject["final_amount"] = total_price + SGST + CGST;
            setErrorText({ ...errorText });
            // Commented by pratap sahu on 05-11-2023 Reason : to remove validations
            // errorText["discount_price"] = "Please enter discount";
            // document.getElementById("discount_rupees").style.border = "1px solid red";
            // End of by pratap sahu on 05-11-2023 Reason : to remove validations
        } else if (!/^\d+$/.test(e.target.value)) {
            errorText["discount_price"] = "Discount price should be in digit";
            setErrorText({ ...errorText });
            document.getElementById("discount_rupees").style.border = "1px solid red";
        } else if (e.target.value > orderObject.sub_total) {
            errorText["discount_price"] =
                "Discount price should not be greater than Subtotal";
            setErrorText({ ...errorText });
            document.getElementById("discount_rupees").style.border = "1px solid red";
        }

        setOrderobject({ ...orderObject });
    }

    function inputValidationDiscountPercentage(e) {
        var orderObj = JSON.parse(unUpdatedOrderObj);

        // var subtotal = JSON.parse(OldOrdervalue.current.value).order_detail.sub_total

        if (
            e.target.value.length > 0 &&
            e.target.value < 101 &&
            (/^\d+$/.test(e.target.value) || e.target.value.includes("."))
        ) {
            // console.log("discount apply");
            var discount_percentage = e.target.value * (orderObject.sub_total / 100);
            var total_price =orderObj.sub_total -discount_percentage -orderObject.loyality_point_price;
            var CGST = ((orderObj.cgst / (orderObj.total / 100)) * total_price) / 100;
            var SGST = ((orderObj.sgst / (orderObj.total / 100)) * total_price) / 100;
            orderObject["cgst"] = CGST;
            orderObject["sgst"] = SGST;
            orderObject["total"] = total_price;
            orderObject["final_amount"] = total_price + CGST + SGST;
            orderObject["discount_percentage"] = e.target.value;
            orderObject["discount_rupees"] = discount_percentage.toFixed(2);
            document.getElementById("discount_percentage").style.border =
                "1px solid black";
            document.getElementById("discount_rupees").style.border =
                "1px solid black";
            errorText["discount_price"] = "";
            setErrorText({ ...errorText });
        } else if (e.target.value.length == 0) {
            // console.log("length 0");
            var discount_percentage = 0.0;
        // Modified by pratap sahu on 21-10-2023 Reason:To set 0 when no input has given
            // orderObject["discount_percentage"] = "";
            orderObject["discount_percentage"] = 0.0;
        // Modified by pratap sahu on 21-10-2023 Reason:To set 0 when no input has given
            orderObject["discount_rupees"] = 0.0;
            // setDiscountRupee(0)
            // setDiscountprice(0.00)
            // setDiscountPercentage("")
            var total_price = orderObj.total;
            var CGST = ((orderObj.cgst / (orderObj.total / 100)) * total_price) / 100;
            var SGST = ((orderObj.sgst / (orderObj.total / 100)) * total_price) / 100;
            orderObject["cgst"] = CGST;
            orderObject["sgst"] = SGST;
            orderObject["total"] = total_price;
            orderObject["final_amount"] = total_price + CGST + SGST;
            // Commented by pratap sahu on 05-11-2023 Reason : to remove validations
            // document.getElementById("discount_percentage").style.border =
            //     "1px solid red";
            // errorText["discount_price"] = "Please enter discount";
            // End of comment by pratap sahu on 05-11-2023 Reason : to remove validations
            setErrorText({ ...errorText });
        } else if (!/^\d+$/.test(e.target.value)) {
            errorText["discount_price"] = "Discount price should be in digit";
            setErrorText({ ...errorText });
            document.getElementById("discount_percentage").style.border =
                "1px solid red";
        } else if (e.target.value > 100) {
            errorText["discount_price"] =
                "Discount price should not be greater than 100%";
            setErrorText({ ...errorText });
            document.getElementById("discount_percentage").style.border =
                "1px solid red";
        }

        setOrderobject({ ...orderObject });
    }

    function validateLoyalityPoint(e) {
        // if(e.target.value.length<applyLoyalityPoint.length){
        //     // console.log(applyLoyalityPoint[applyLoyalityPoint.length-1])
        //     setcustomerLoyalitypoint(parseInt(customerLoyalitypoint)+parseInt(applyLoyalityPoint[applyLoyalityPoint.length-1]))
        // }
        var orderObj = JSON.parse(unUpdatedOrderObj);

        var loyality_price = setting.per_loyality_point_value * e.target.value;
        var customer_earn =
            JSON.parse(unUpdatedOrderObj).customer_loyality_point -
            JSON.parse(unUpdatedOrderObj).apply_loyality_point;

            if (
                e.target.value > -1 &&
                (/^\d+$/.test(e.target.value) || e.target.value.includes(".")) &&
                e.target.value.length > 0 &&
                e.target.value < customer_earn + 1 &&
                loyality_price < orderObj.sub_total + 1
                ) {
                    orderObject["apply_loyality_point"] = e.target.value;
                    var loyalityPrice = setting.per_loyality_point_value * e.target.value;
                    orderObject["loyality_point_price"] = loyalityPrice;
            var total_price =
                orderObject.sub_total - loyalityPrice - orderObject.discount_rupees;
            var CGST = ((orderObj.cgst / (orderObj.total / 100)) * total_price) / 100;
            var SGST = ((orderObj.sgst / (orderObj.total / 100)) * total_price) / 100;
            orderObject["cgst"] = CGST;
            orderObject["sgst"] = SGST;
            orderObject["total"] = total_price;
            orderObject["final_amount"] = total_price + CGST + SGST;
            errorText["loyality_point"] = "";
            setErrorText({ ...errorText });
        } else if (e.target.value.length == 0) {
        // Modified by pratap sahu on 21-10-2023 Reason:To set 0 when no input has given
            // orderObject["apply_loyality_point"] = "";
            orderObject["apply_loyality_point"] = 0;
        // Modified by pratap sahu on 21-10-2023 Reason:To set 0 when no input has given
        // orderObject["loyality_point_price"] = "";
        orderObject["loyality_point_price"] = 0;
        // setLoyalityPointPrice(loyalityPrice)
            var total_price = orderObj.total;
            var CGST = ((orderObj.cgst / (orderObj.total / 100)) * total_price) / 100;
            var SGST = ((orderObj.sgst / (orderObj.total / 100)) * total_price) / 100;
            orderObject["cgst"] = CGST;
            orderObject["sgst"] = SGST;
            orderObject["total"] = total_price;
            orderObject["final_amount"] = total_price + CGST + SGST;
        } else if (!/^\d+$/.test(e.target.value)) {
            errorText["loyality_point"] = "Loyality point should always in digit";
            setErrorText({ ...errorText });
        } else if (e.target.value > customer_earn) {
            errorText["loyality_point"] =
            "Loyalty point should not be greater than earn point";
            setErrorText({ ...errorText });
        } else if (loyality_price >= orderObj.sub_total + 1) {
            errorText["loyality_point"] =
            "Loyality point should not be greater then sub-total";
            setErrorText({ ...errorText });
        }
        setOrderobject({ ...orderObject });
    }
    
    return (
        <Modal

            open={isOpen}
            footer={null}
            className={style.modalContainer}
            // Modified by Pratap Sahu on 03-11-2023 Reason:To remove validation when close the popup and deactivate cancel button
            // closeIcon={<AiOutlineClose onClick={(e) => setModelVisiblity(false)} />}
            closeIcon={<AiOutlineClose onClick={(e) =>{ 
                // Modified by Pratap Sahu on 04-11-2023 Reason:To remove validation for waiter JS
                                            // document.getElementById("discount_percentage").style.border =
                                            //     "1px solid #9c9c9c";
                                            // document.getElementById("discount_rupees").style.border =
                                            //     "1px solid #9c9c9c";
                                            // document.getElementById("cancelInput").style.border =
                                            //     "1px solid #9c9c9c";
                                            // errorText["cancelReason"] = "";
                                            // errorText["discount_price"] = "";
                                            // errorText["discount_percentage"]="";
                                            // errorText["loyality_point"] = "";
                                            // setErrorText({ ...errorText })
                                            // setCancelClicked(false)
                                            // setModelVisiblity(false)
                                            if(document.getElementById("cancelInput")){
                                                document.getElementById("cancelInput").style.border =
                                                "1px solid #9c9c9c";
                                                errorText["cancelReason"] = "";
                                                setErrorText({ ...errorText })
                                                setCancelClicked(false)
                                                setModelVisiblity(false)
                                            }else if(document.getElementById("discount_percentage") || document.getElementById("discount_rupees") || document.getElementById("cancelInput")){
                                                document.getElementById("discount_percentage").style.border =
                                                    "1px solid #9c9c9c";
                                                document.getElementById("discount_rupees").style.border =
                                                    "1px solid #9c9c9c";
                                                document.getElementById("cancelInput").style.border =
                                                    "1px solid #9c9c9c";
                                                errorText["cancelReason"] = "";
                                                errorText["discount_price"] = "";
                                                errorText["discount_percentage"]="";
                                                errorText["loyality_point"] = "";
                                                setErrorText({ ...errorText })
                                                setCancelClicked(false)
                                                setModelVisiblity(false)
                                            }
                                            // End of code by pratap sahu on 04-11-2023
                                            }}
                                            />}
            // End of code by pratap sahu on 03-11-2023
            onCancel={e => setModelVisiblity(false)}>
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
                <div className={style.CustomerInformationBox}>
                    <div className={style.topHeading}>
                        <div className={style.Order_idText}>{orderObject.order_id}</div>
                        <div className={style.actionBtn}>
                            <button
                                className={`${style.orderCancelBtn} ${getOrderStatus() ? null : style.disbaleBtn
                                    }`}
                                onClick={(e) => {
                                    // console.log(statusValidation("Cancelled", paymentStatus, selectedOrderData.order_detail))
                                    cancelOrder("Order cancelled");
                                }}>
                                Cancel Order
                            </button>
                            <button
                                className={`${JSON.parse(unUpdatedOrderObj)?.order_status == "Cancelled" ||
                                    JSON.parse(unUpdatedOrderObj)?.order_status == "Placed"
                                    ? style.disbaleBtn
                                    : null
                                    } ${style.KotBtn}`}
                                onClick={(e) =>
                                    PrintKot(
                                        orderObject,
                                        JSON.parse(unUpdatedOrderItemObj).filter(
                                            (e) => e.item_status == "Confirm"
                                        ),
                                        restroDetail,
                                        setting
                                    )
                                }>
                                Print Kot
                            </button>
                            <button
                                className={`${style.getbill} ${getbillStatus() ? null : style.disbaleBtn
                                    }`}
                                onClick={(e) => {
                                    sendPrintDatas();
                                }}>
                                Get Bill
                            </button>
                        </div>
                    </div>
                </div>
                {/* Model Heading and all action of model */}

                {/* Customer Informations and able to edit some fields */}
                <div className={style.flex}>
                    <div className={style.informationContainer}>
                        <div className={style.information}>
                            <div className={style.WhiteLabel}>Table :</div>
                            <div className={style.data}>
                                {inputEnable == "tableEdit" ? (
                                    <>
                                        <input
                                            className={style.EditableInput}
                                            onKeyUp={(e) => {
                                                if (e.key == "Enter" || e.keyCode == 13) {
                                                    if (orderObject.table_number.length > 0) {
                                                        updateCustomerDetail("Table Number");
                                                        setInputEnable(null);
                                                    } else {
                                                        Message("Please enter table number", "warning");
                                                    }
                                                }
                                            }}
                                            onChange={(e) => {
                                                orderObject.table_number = e.target.value;
                                                setOrderobject({ ...orderObject });
                                                // setTablenumber(e.target.value)
                                            }}
                                            value={orderObject.table_number}
                                            onBlur={(e) => {
                                                orderObject.table_number =
                                                    JSON.parse(unUpdatedOrderObj).table_number;
                                                setOrderobject({ ...orderObject });
                                                setInputEnable("");
                                            }}
                                            maxLength={6}
                                        />
                                        <TiTick
                                            className={style.inputChecked}
                                            onClick={(e) => {
                                                if (orderObject.table_number.length > 0) {
                                                    updateCustomerDetail("Table Number");
                                                    setInputEnable(null);
                                                } else {
                                                    Message("Please enter table number", "warning");
                                                }
                                            }}
                                        />
                                    </>
                                ) : (
                                    <>
                                        {orderObject.table_number}
                                        <Popconfirm
                                            // className={style.disbaleBtn}
                                            className={`${getOrderStatus() ? null : style.disbaleBtn
                                                } ${style.link}`}
                                            title="Are you sure you want to change table number?"
                                            cancelText="Cancel"
                                            okText="Ok"
                                            onConfirm={(e) => setInputEnable("tableEdit")}
                                            placement="bottomLeft">
                                            <BsPencilSquare style={{ margin: "5px 10px" }} />
                                        </Popconfirm>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className={style.information}>
                            <div className={style.WhiteLabel}>Email :</div>
                            <div className={style.data}>
                                {inputEnable == "emailEdit" ? (
                                    <>
                                        <input
                                            className={style.EditableInput}
                                            onKeyUp={(e) => {
                                                if (e.key == "Enter" || e.keyCode == 13) {
                                                    let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
                                                    if (regex.test(orderObject.customer_email)) {
                                                        updateCustomerDetail("Email");
                                                        setInputEnable("");
                                                    } else {
                                                        Message("Please enter valid email", "error");
                                                    }
                                                }
                                            }}
                                            onChange={(e) => {
                                                orderObject.customer_email = e.target.value;
                                                setOrderobject({ ...orderObject });
                                            }}
                                            value={orderObject.customer_email}
                                            onBlur={(e) => {
                                                orderObject.customer_email =
                                                    JSON.parse(unUpdatedOrderObj).customer_email;
                                                setOrderobject({ ...orderObject });
                                                setInputEnable("");
                                            }}
                                        />
                                        <TiTick
                                            className={style.inputChecked}
                                            onClick={(e) => {
                                                let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
                                                if (regex.test(orderObject.customer_email)) {
                                                    updateCustomerDetail("Email");
                                                    setInputEnable("");
                                                } else {
                                                    Message("Please enter valid email", "error");
                                                }
                                            }}
                                        />
                                    </>
                                ) : (
                                    <>
                                        {orderObject.customer_email}
                                        <BsPencilSquare
                                            // className={style.disbaleBtn}
                                            className={`${getOrderStatus() ? null : style.disbaleBtn
                                                }`}
                                            style={{ margin: "5px 10px" }}
                                            onClick={(e) => {
                                                if (inputEnable != "emailEdit") {
                                                    setInputEnable("emailEdit");
                                                } else setInputEnable("");
                                            }}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={style.informationContainer}>
                        <div className={style.information}>
                            <div className={style.WhiteLabel}>Contact :</div>
                            <div className={style.data}>{orderObject.customer_number}</div>
                        </div>

                        <div className={style.information}>
                            <div className={style.WhiteLabel}>Name :</div>
                            <div className={style.data}>
                                {inputEnable == "nameEdit" ? (
                                    <>
                                        <input
                                            className={style.EditableInput}
                                            onKeyUp={(e) => {
                                                if (e.key == "Enter" || e.keyCode == 13) {
                                                    if (!(orderObject.customer_name.length > 50)) {
                                                        updateCustomerDetail("Name");
                                                        setInputEnable("");
                                                    } else {
                                                        Message(
                                                            "Name should not be greater than 50 characters",
                                                            "error"
                                                        );
                                                    }
                                                }
                                            }}
                                            onChange={(e) => {
                                                orderObject.customer_name = capitalizeFLetter(
                                                    e.target.value
                                                );
                                                setOrderobject({ ...orderObject });
                                            }}
                                            value={orderObject.customer_name}
                                            onBlur={(e) => {
                                                orderObject.customer_name =
                                                    JSON.parse(unUpdatedOrderObj).customer_name;
                                                setOrderobject({ ...orderObject });
                                                setInputEnable("");
                                            }}
                                        />
                                        <TiTick
                                            className={style.inputChecked}
                                            onClick={(e) => {
                                                if (!(orderObject.customer_name.length > 50)) {
                                                    updateCustomerDetail("Name");
                                                    setInputEnable("");
                                                } else {
                                                    Message(
                                                        "Name should not be greater than 50 characters",
                                                        "error"
                                                    );
                                                }
                                            }}
                                        />
                                    </>
                                ) : (
                                    <>
                                        {orderObject.customer_name}
                                        <BsPencilSquare
                                            // className={style.disbaleBtn}
                                            className={`${getOrderStatus() ? null : style.disbaleBtn
                                                }`}
                                            onClick={(e) => {
                                                if (inputEnable != "nameEdit") {
                                                    setInputEnable("nameEdit");
                                                } else setInputEnable("");
                                            }}
                                            style={{ margin: "5px 10px" }}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={`${style.informationContainer}`}>
                        <div className={style.information}>
                            <div className={style.WhiteLabel}>Date & Time:</div>
                            <div className={style.data}>
                                {new Date(orderObject.date).toLocaleDateString("en-GB") +
                                    " " +
                                    new Date(orderObject.date).toTimeString().substring(0, 5)}
                            </div>
                        </div>
                        <div className={style.information}>
                            <div className={style.WhiteLabel}>Payment Mode :</div>
                            {/* Commented & Added by pratap sahu on 21-09-2023
                                Reason: To Add Select DropDown Functionality in Payment Mode */}
                            {/* <div className={style.data}>
                                {orderObject.payment_mode}
                            </div> */}
                            <Select

                                // type="option"
                                name="payment"
                                value={orderObject?.payment_mode}
                                // Added By pratap sahu on 25-09-2023
                                // Reason:To disable the field when amount is paid
                                disabled={orderObject.payment_status == "Completed"|| orderObject.order_status=="Cancelled"? true : false}
                                // End of Addition By pratap sahu on 25-09-2023
                                // Reason:To disable the field when amount is paid
                                onChange={(value) => {
                                    orderObject.payment_mode = value;
                                    setOrderobject({ ...orderObject });
                                    updateCustomerDetail("payment_mode");
                                }}
                                style={{
                                    width: 90,
                                    border: "0.5px solid black",
                                    borderRadius: "5px",
                                    // fontSize: "8px",
                                }}>
                                <Option value="Cash" className={`${style.paymentModeInputBox}`}>Cash</Option>
                                <Option value="Scanner" className={`${style.paymentModeInputBox}`}>Scanner</Option>
                            </Select>
                            {/*End of Comment & Addition by pratap sahu on 21-09-2023
                                Reason: To Add Select DropDown Functionality in Payment Mode */}
                        </div>
                    </div>

                    {/* Added by - Rohan kansari -To show waiter detail - 21/9/23 */}
                    {orderObject?.waiter_name?.length > 0 ? <div className={style.informationContainer}>
                        <div className={style.information}>
                            <div className={style.WhiteLabel}>Waiter Number :</div>
                            <div className={style.data}>{orderObject.waiter_contact_number}</div>
                        </div>

                        <div className={style.information}>
                            <div className={style.WhiteLabel}>Waiter Name :</div>
                            <div className={style.data}>{orderObject.waiter_name}</div>
                        </div>
                    </div> :
                        <div className={style.informationContainer}>
                            <div className={style.information}>
                                <div className={style.WhiteLabel}>Order created by :</div>
                                <div className={style.data}>{orderObject.order_created_by}</div>
                            </div>
                        </div>}
                    {/* End of code - Rohan kansari -To show waiter detail - 21/9/23 */}



                </div>
                {/* Customer Informations and able to edit some fields */}

                {/* All order and payment status buttons */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        columnGap: "20px",
                        margin: "10px 0",
                    }}>
                    {/* Order status arrows */}
                    <div>
                        <label className={style.InputLabel} style={{ padding: "0 10px" }}>
                            Order Status{" "}
                        </label>
                        <div className={style.OrderstatusBtnContainer}>
                            <div className={style.StatusArrowBtnContainer}>
                                <p>
                                    <button
                                        className={` ${statusValidation(
                                            "Placed",
                                            orderObject.payment_status,
                                            JSON.parse(unUpdatedOrderObj),
                                            false
                                        )
                                            ? "btn-right"
                                            : "btn-disable"
                                            } ${JSON.parse(unUpdatedOrderObj).order_status == "Placed"
                                                ? "activeStatusBtn"
                                                : null
                                            }`}
                                        onClick={(e) => {
                                            if (
                                                statusValidation(
                                                    "Placed",
                                                    orderObject.payment_status,
                                                    JSON.parse(unUpdatedOrderObj),
                                                    true
                                                )
                                            )
                                                UpdateOrderStatusDetail("Placed", "Order status");
                                        }}>
                                        <a href="#">Placed</a>
                                    </button>
                                </p>

                                <p>
                                    <button
                                        className={` ${statusValidation(
                                            "Confirm",
                                            orderObject.payment_status,
                                            JSON.parse(unUpdatedOrderObj),
                                            false
                                        )
                                            ? "btn-right"
                                            : "btn-disable"
                                            } ${JSON.parse(unUpdatedOrderObj).order_status == "Confirm"
                                                ? "activeStatusBtn"
                                                : null
                                            }`}
                                        onClick={(e) => {
                                            if (
                                                statusValidation(
                                                    "Confirm",
                                                    orderObject.payment_status,
                                                    JSON.parse(unUpdatedOrderObj),
                                                    true
                                                )
                                            ) {
                                                PrintKot(
                                                    orderObject,
                                                    JSON.parse(unUpdatedOrderItemObj).filter(
                                                        (e) =>
                                                            e.item_status != "Cancelled" &&
                                                            e.kot_print_status == false
                                                    ),
                                                    restroDetail,
                                                    setting
                                                );
                                                UpdateOrderStatusDetail("Confirm", "Order status");
                                            }
                                        }}>
                                        <a href="#">Confirm</a>
                                    </button>
                                </p>
                                {/* Cooked status comment by Om Shrivastava on 11-10-23
                               Reason : No need to show cooked status */}
                                {/* <p>
                                    <button
                                        className={` ${statusValidation(
                                            "Cooked",
                                            orderObject.payment_status,
                                            JSON.parse(unUpdatedOrderObj),
                                            false
                                        )
                                            ? "btn-right"
                                            : "btn-disable"
                                            } ${JSON.parse(unUpdatedOrderObj).order_status == "Cooked"
                                                ? "activeStatusBtn"
                                                : null
                                            }`}
                                        onClick={(e) => {
                                            if (
                                                statusValidation(
                                                    "Cooked",
                                                    orderObject.payment_status,
                                                    JSON.parse(unUpdatedOrderObj),
                                                    true
                                                )
                                            )
                                                UpdateOrderStatusDetail("Cooked", "Order status");
                                        }}>
                                        <a href="#">Cooked</a>
                                    </button>
                                </p> */}
                                {/* End of Cooked status comment by Om Shrivastava on 11-10-23
                               Reason : No need to show cooked status */}
                                <p>
                                    <button
                                        className={` ${statusValidation(
                                            "Served",
                                            orderObject.payment_status,
                                            JSON.parse(unUpdatedOrderObj),
                                            false
                                        )
                                            ? "btn-right"
                                            : "btn-disable"
                                            } ${JSON.parse(unUpdatedOrderObj).order_status == "Served"
                                                ? "activeStatusBtn"
                                                : null
                                            }`}
                                        onClick={(e) => {
                                            if (
                                                statusValidation(
                                                    "Served",
                                                    orderObject.payment_status,
                                                    JSON.parse(unUpdatedOrderObj),
                                                    true
                                                )
                                            )
                                                UpdateOrderStatusDetail("Served", "Order status");
                                        }}>
                                        <a href="#">Served</a>
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Order status arrows */}

                    {/* Payment status arrows */}
                    <div>
                        <label className={style.InputLabel} style={{ padding: "0 10px" }}>
                            Payment Status{" "}
                        </label>
                        <div className={style.OrderstatusBtnContainer}>
                            <div className={style.StatusArrowBtnContainer}>
                                <p>
                                    <button
                                        className={` ${statusValidation(
                                            orderObject.order_status,
                                            "Pending",
                                            JSON.parse(unUpdatedOrderObj),
                                            false
                                        )
                                            ? "btn-right"
                                            : "btn-disable"
                                            } ${JSON.parse(unUpdatedOrderObj).payment_status == "Pending"
                                                ? "activeStatusBtn"
                                                : null
                                            }`}
                                        onClick={(e) => {
                                            if (
                                                statusValidation(
                                                    orderObject.order_status,
                                                    "Pending",
                                                    JSON.parse(unUpdatedOrderObj),
                                                    true
                                                )
                                            )
                                                UpdatePaymentStatusDetail("Pending", "Payment status");
                                        }}>
                                        <a href="#">Pending</a>
                                    </button>
                                </p>

                                {JSON.parse(unUpdatedOrderObj).payment_status == "Paid" ? (
                                    <p>
                                        <button
                                            className={` ${statusValidation(
                                                orderObject.order_status,
                                                "Paid",
                                                JSON.parse(unUpdatedOrderObj),
                                                false
                                            )
                                                ? "btn-right"
                                                : "btn-disable"
                                                } ${JSON.parse(unUpdatedOrderObj).payment_status == "Paid"
                                                    ? "activeStatusBtn"
                                                    : null
                                                }`}
                                            onClick={(e) => {
                                                if (
                                                    statusValidation(
                                                        orderObject.order_status,
                                                        "Paid",
                                                        JSON.parse(unUpdatedOrderObj),
                                                        true
                                                    )
                                                )
                                                    UpdatePaymentStatusDetail("Paid", "Payment status");
                                            }}>
                                            <a href="#">Paid</a>
                                        </button>
                                    </p>
                                ) : null}

                                <p>
                                    <button
                                        className={` ${statusValidation(
                                            orderObject.order_status,
                                            "Completed",
                                            JSON.parse(unUpdatedOrderObj),
                                            false
                                        )
                                            ? "btn-right"
                                            : "btn-disable"
                                            } ${JSON.parse(unUpdatedOrderObj).payment_status ==
                                                "Completed"
                                                ? "activeStatusBtn"
                                                : null
                                            }`}
                                        onClick={(e) => {
                                            if (
                                                statusValidation(
                                                    orderObject.order_status,
                                                    "Completed",
                                                    JSON.parse(unUpdatedOrderObj),
                                                    true
                                                )
                                            )
                                                UpdatePaymentStatusDetail(
                                                    "Completed",
                                                    "Payment status"
                                                );
                                        }}>
                                        <a href="#">Completed</a>
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Payment status arrows */}
                </div>
                {/* All order and payment status buttons */}

                {/* scroller content are visible here */}
                <div className={style.scrollContainer}>
                    {/* Order item Listing */}
                    <div className={style.orderItemContainer}>
                        <div style={{ width: "100%", overflow: "auto" }}>
                            <div className={style.orderItemHeader}>
                                <div className={style.ItemInformation}>
                                    <div className={style.item_heading}>Item Name</div>

                                    <div className={style.QtyNPriceHeadings}>
                                        <div className={style.quantityHeading}>Quantity</div>
                                        <div className={style.priceHeading}>Price</div>
                                    </div>
                                </div>

                                <div className={style.status_list}>
                                    <div className={style.status}>Pending</div>
                                    <div className={style.status}>Confirm</div>
                                    <div className={style.status}>Cancel</div>
                                </div>
                            </div>

                            <div className={style.itemsContent}>
                                <div className={style.itemList}>
                                    {/* {console.log(orderItem, JSON.parse(unUpdatedOrderItemObj))} */}
                                    {orderItem?.map((data, index) => (
                                        <div
                                            className={`${style.itemrow} 
                                        ${JSON.parse(unUpdatedOrderItemObj)[
                                                    index
                                                ]?.item_status == "Confirm"
                                                    ? style.confirmRow
                                                    : JSON.parse(unUpdatedOrderItemObj)[
                                                        index
                                                    ]?.item_status == "Pending"
                                                        ? null
                                                        : style.cancelledRow
                                                }`}>
                                            <div className={style.ItemInformation}>
                                                <div className={style.checkboxNTitleFlex}>
                                                    <div class="checkbox-wrapper-24">
                                                        <input
                                                            type="checkbox"
                                                            id={`status0${index}`}
                                                            name="check"
                                                            checked={
                                                                tickedItems.filter((i) => i.id == data.id)
                                                                    .length > 0
                                                            }
                                                            onChange={(e) =>
                                                                AddTickedOrderitem(
                                                                    e.target.checked,
                                                                    data,
                                                                    index
                                                                )
                                                            }
                                                        />
                                                        <label for={`status0${index}`}>
                                                            <span></span>
                                                        </label>
                                                    </div>
                                                    <div className={style.title}>
                                                        {data.item} ({data.serving_size})
                                                    </div>
                                                </div>
                                                <div className={style.quantityNPriceFlex}>
                                                    <div className={style.quantity}>
                                                        <div className={style.decrease}>
                                                            <AiOutlineMinus
                                                                onClick={(e) =>
                                                                    increaseAndDecrease(
                                                                        "-",
                                                                        index,
                                                                        orderObject.order_id
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div className={style.quantityValue}>
                                                            {data.quantity}
                                                        </div>
                                                        <div className={style.increase}>
                                                            <AiOutlinePlus
                                                                onClick={(e) =>
                                                                    increaseAndDecrease(
                                                                        "+",
                                                                        index,
                                                                        orderObject.order_id
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className={style.price}>
                                                        {data.price.toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={style.checkboxContainer}>
                                                <div className={style.statusRow}>
                                                    <div className={style.checkboxContain}>
                                                        <input
                                                            type="checkbox"
                                                            className="_checkbox"
                                                            checked={data.item_status == "Pending"}
                                                            id={`status1${index}`}
                                                        />
                                                        <label
                                                            className="statuslabel"
                                                            for={`status1${index}`}
                                                            onClick={(e) => {
                                                                orderItem[index].item_status = "Pending";
                                                                setOrderItem([...orderItem]);
                                                            }}>
                                                            <div id="tick_mark"></div>
                                                        </label>
                                                    </div>
                                                    <div className={style.checkboxContain}>
                                                        <input
                                                            type="checkbox"
                                                            className="_checkbox"
                                                            checked={data.item_status == "Confirm"}
                                                            id={`status2${index}`}
                                                        />
                                                        <label
                                                            className="statuslabel"
                                                            for={`status2${index}`}
                                                            onClick={(e) => {
                                                                orderItem[index].item_status = "Confirm";
                                                                setOrderItem([...orderItem]);
                                                            }}>
                                                            <div id="tick_mark"></div>
                                                        </label>
                                                    </div>
                                                    <div className={style.checkboxContain}>
                                                        <input
                                                            type="checkbox"
                                                            className="_checkbox"
                                                            checked={data.item_status == "Cancelled"}
                                                            id={`status3${index}`}
                                                        />
                                                        <label
                                                            className="statuslabel cancelled"
                                                            for={`status3${index}`}
                                                            onClick={(e) => {
                                                                orderItem[index].item_status = "Cancelled";
                                                                setOrderItem([...orderItem]);
                                                            }}>
                                                            <div id="cross"></div>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={style.AllStatusContainer}>
                            <Popconfirm
                                className={`${getOrderStatus() ? null : style.disbaleBtn} ${style.link
                                    }`}
                                style={{ maxWidth: "150px" }}
                                title="Are you sure you want to update?"
                                onConfirm={(e) => {
                                    updateOrderItemStatus(orderItem);
                                }}
                                cancelText="Cancel"
                                okText="Ok">
                                <button className={`${style.AllUpdateButton}`}>
                                    Update Items
                                </button>
                            </Popconfirm>
                            <div className={style.StatusBtnContainer}>
                                <button
                                    class="button"
                                    id="cut"
                                    style={
                                        tickedItems.length > 0
                                            ? null
                                            : { background: "rgba(0,0,0,0.2)", pointerEvents: "none" }
                                    }>
                                    <span>Pending</span>
                                </button>
                                {/* Modified by Rohan kansari - 22/9/23 
                                    Reason - To send all order item woth updated status*/}
                                <button
                                    class="button"
                                    id="copy"
                                    style={
                                        tickedItems.length > 0
                                            ? null
                                            : { background: "rgba(0,0,0,0.2)", pointerEvents: "none" }
                                    }
                                    onClick={(e) =>
                                        updateOrderItemStatus(
                                            orderItem.map(o => {
                                                var item = tickedItems.filter(e => e.id == o.id)
                                                if (item.length > 0) {
                                                    item[0].item_status = "Confirm";
                                                    return item[0];
                                                }
                                                else
                                                    return o;
                                            })
                                        )
                                    }>
                                    <span>Confirm</span>
                                </button>
                                <button
                                    class="button"
                                    id="paste"
                                    style={
                                        tickedItems.length > 0
                                            ? null
                                            : { background: "rgba(0,0,0,0.2)", pointerEvents: "none" }
                                    }
                                    onClick={(e) =>
                                        updateOrderItemStatus(
                                            orderItem.map(o => {
                                                var item = tickedItems.filter(e => e.id == o.id)
                                                if (item.length > 0) {
                                                    item[0].item_status = "Cancelled";
                                                    return item[0];
                                                }
                                                else
                                                    return o;
                                            })
                                        )
                                    }>
                                    <span>Cancel</span>
                                </button>
                                {/* End of Modification by Rohan kansari - 22/9/23 
                                    Reason - To send all order item woth updated status*/}

                            </div>
                        </div>
                    </div>
                    {/* Order item Listing */}

                    {/* Add more item and subtotal */}
                    <div className={style.UpdateItemContainer}>
                        <button
                            className={`${style.UpdateItemBTN} ${getOrderStatus() ? null : style.disbaleBtn
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
                            <div
                                className={`${style.DiscountNCancelSection} 
                                        ${getOrderStatus()
                                        ? null
                                        : style.disbaleBtn
                                    }`}>
                                <div className={style.inputContainerFlex}>
                                {/* <div className={orderObject.payment_status=="Completed"|| orderObject.order_status=="Cancelled"?style.inputContainerFlex2:style.inputContainerFlex}> */}
                                    {!localStorage.getItem("waiterData") ? (
                                        <div className={style.inputBoxContainer}>
                                            <label className={style.InputLabel}>Discount </label>
                                            <div className={style.flexDoubleInput}>
                                                <div className={style.discountColumn}>
                                                    <div className={style.discountRow}>
                                                        <div className={style.Column}>
                                                            <label className={style.subInputLabel}>
                                                                ( In ₹ ){" "}
                                                            </label>
                                                            <input
                                                                id="discount_rupees"
                                                                type="text"
                                                                // className={`${style.inputBox} ${setting?.discount_in == "Discount in (₹)"
                                                                //     ? null
                                                                //     : style.disbaleBtn
                                                                //     }`}
                                                              // Modified by Pratap sahu on 26-09-2023 Reason:To change styling on Discount In Rs
                                                    // Modified by Pratap sahu on 03-11-2023
                                                    // className={orderObject.payment_status == "Pending"? `${style.inputBox} ${setting?.discount_in == "Discount in (₹)"? null: style.disbaleBtn}`: `${style.disbaleBtn} ${style.inputBox}`}
                                                    //   className={orderObject.payment_status=="Completed"|| orderObject.order_status=="Cancelled"?`${style.disabledBox} ${style.inputBox} ${setting?.discount_in == "Discount in (₹)"? null: `${style.disabledBox} ${style.inputBox}`}`:style.inputBox }
                                                        // Modified by Pratap sahu on 04-11-2023 to disable all fields on paid 
                                                    // className={orderObject.payment_status == "Completed"|| orderObject.order_status=="Cancelled"?
                                                    className={orderObject.payment_status == "Paid" || orderObject.payment_status == "Completed"|| orderObject.order_status=="Cancelled"?
                                                                    `${style.disabledBox} ${style.inputBox}`:
                                                                        `${style.inputBox} ${setting?.discount_in == "Discount in (₹)"? null: style.disbaleBtn}`}
                                                    // End of code by Pratap sahu on 03-11-2023
                                                              // Modified by Pratap sahu on 26-09-2023 Reason:To change styling on Discount In Rs
                                                              // commented by pratap sahu on 05-11-2023 Reason :To hide 0 from Discount section
                                                                // value={orderObject.discount_rupees}
                                                                // End of comment by pratap sahu on 05-11-2023 Reason :To hide 0 
                                                                onChange={(e) => {
                                                                    inputIvalidationDiscountRupees(e);
                                                                }}
                                                            />
                                                        </div>
                                                        <div className={style.Column}>
                                                            <label className={style.subInputLabel}>
                                                                ( In % ){" "}
                                                            </label>
                                                            <input
                                                                id="discount_percentage"
                                                                // className={`${style.inputBox} ${setting?.discount_in == "Discount in (%)"
                                                                //     ? null
                                                                //     : style.disbaleBtn
                                                                //     }`}
                                                     // Modified by Pratap sahu on 26-09-2023 Reason:To change styling on Discount In %
                                                        // Modified by Pratap sahu on 03-11-2023
                                                        // className={orderObject.payment_status == "Pending"? `${style.inputBox} ${setting?.discount_in == "Discount in (%)"? null: style.disbaleBtn}`: `${style.inputBox} ${style.disbaleBtn}`}
                                                        // className={orderObject.payment_status == "Pending"? `${style.inputBox} ${setting?.discount_in == "Discount in (%)"? null: style.disabledBox}`: `${style.inputBox} ${style.disbaleBtn}`}
                                                        // Modified by Pratap sahu on 04-11-2023 to disable all fields on paid 
                                                        // className={orderObject.payment_status == "Completed"|| orderObject.order_status=="Cancelled"?
                                                        className={orderObject.payment_status == "Paid"|| orderObject.payment_status == "Completed"|| orderObject.order_status=="Cancelled"?
                                                                    `${style.disabledBox} ${style.inputBox}`:
                                                                     `${style.inputBox} ${setting?.discount_in == "Discount in (%)"? null: style.disbaleBtn}`}
                                                                // end of Modification by Pratap sahu on 03-11-2023
                                                     // End of Code by Pratap sahu on 26-09-2023 Reason:To change styling on Discount In %
                                                     // commented by pratap sahu on 05-11-2023 Reason :To hide 0 
                                                                // value={orderObject.discount_percentage}
                                                    // End of comment by pratap sahu on 05-11-2023 Reason :To hide 0 
                                                                onChange={(e) => {
                                                                    inputValidationDiscountPercentage(e);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className={style.errorText}>
                                                        {errorText.discount_price
                                                            ? errorText.discount_price
                                                            : null}
                                                    </div>
                                                </div>
                                                {/* Shifted here from lower div by Pratap sahu on 04-11-2023 */}
                                                <div className={style.loyalityColumn}>
                                                    <label className={style.subInputLabel}>
                                                        Cancelled By{" "}
                                                    </label>
                                                    <input
                                                        id="cancelled_by"
                                                        type="text"
                                                    // modified by pratap sahu on 21-10-2023
                                                        // className={`${style.inputBox} ${style.disbaleBtn}`}
                                                        // className={orderObject.payment_status=="Completed"|| orderObject.order_status=="Cancelled"? style.disabledBox :`${style.inputBox}`}
                                                        className={orderObject.payment_status=="Completed"|| orderObject.order_status=="Cancelled" || orderObject.payment_status == "Paid"? style.disabledBox :`${style.inputBox}`}
                                                        onChange={(e) => {
                                                            orderObject.cancelled_by = e.target.value;
                                                            setOrderobject({ ...orderObject });}}    
                                                    // End of code by pratap sahu on 21-10-2023
                                                    />
                                                </div>
                                                {/* End of code shift by Pratap sahu on 04-11-2023   */}
                                            </div>
                                        </div>
                                    ) : null}

                                    {!localStorage.getItem("waiterData") ? (
                                        <div className={style.inputBoxContainer}>
                                            <div
                                                className={style.discountRow}
                                                style={{ justifyContent: "space-between" }}>
                                                {/* Added this condition by Pratap sahu on 04-11-2023 Reason:hide reward points when loyalty is not active */}
                                                {/*condition Modified by Pratap sahu on 05-11-2023 */}
                                                {/* {setting?.allow_loyality_points? ( */}
                                                {/* Modified by Pratap sahu on 11-11-2023 reason :To display loyalty fields only when selected  */}
                                                {/* {setting?.allow_loyality_points || orderObject.payment_status=="Completed"|| orderObject.order_status=="Cancelled"? ( */}
                                                    {setting.allow_loyality_points && setting.allow_loyality_points == true || orderObject.loyality_point_calculated==true? (
                                                //end of code by Pratap sahu on 11-11-2023 reason :To display loyalty fields only when selected 
                                                <div className={style.rewardbox}>
                                                        Earn Point &nbsp;
                                                        <div className={style.coinBox}>
                                                            <div className={style.cointPoints}>
                                                                {orderObject.customer_loyality_point}
                                                            </div>
                                                            <div class="spinningasset coin is-sm">
                                                                <div>
                                                                    <div></div>
                                                                    <i></i>
                                                                    <i></i>
                                                                    <i></i>
                                                                    <i></i>
                                                                    <i></i>
                                                                    <i></i>
                                                                    <i></i>
                                                                    <i></i>
                                                                    <i></i>
                                                                    <i></i>
                                                                    <i></i>
                                                                    <em></em>
                                                                    <em></em>
                                                                    <div></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    ) : null}
                                                    {/* End of condition by Pratap sahu on 04-11-2023 */}
                                                {/* Shifted here from upper div by Pratap sahu on 04-11-2023 */}
                                                {/*condition Modified by Pratap sahu on 05-11-2023 */}
                                                {/* {setting?.allow_loyality_points? ( */}
                                                {/* Modified by Pratap sahu on 11-11-2023 reason :To display loyalty fields only when selected  */}
                                                {/* {setting?.allow_loyality_points || orderObject.payment_status=="Completed"|| orderObject.order_status=="Cancelled"? ( */}
                                                    {setting.allow_loyality_points && setting.allow_loyality_points == true || orderObject.loyality_point_calculated==true? (
                                                     //   Modified by Pratap sahu on 11-11-2023 reason :To display loyalty fields only when selected 
                                                    <div className={style.loyalityColumn}>
                                                        <label className={style.subInputLabel}>
                                                            Apply Loyalty Point{" "}
                                                        </label>
                                                        <input
                                                    // modified by pratap sahu on 20-10-2023
                                                            // className={style.inputBox}
                                                            // className={orderObject.payment_status=="Completed"|| orderObject.order_status=="Cancelled"? style.disabledBox :style.inputBox}
                                                            className={orderObject.payment_status=="Completed"|| orderObject.order_status=="Cancelled"|| orderObject.payment_status == "Paid"? style.disabledBox :style.inputBox}
                                                            // End of code by pratap sahu on 20-10-2023
                                                            // Commented by pratap sahu on 05-11-2023 Reason :To hide 0 
                                                            // value={orderObject?.apply_loyality_point}
                                                            // End of comment by pratap sahu on 05-11-2023 Reason :To hide 0 
                                                            onChange={(e) => {
                                                                validateLoyalityPoint(e);
                                                            }}
                                                        />
                                                        <div className={style.errorText}>
                                                            {errorText.loyality_point
                                                                ? errorText.loyality_point
                                                                : null}
                                                        </div>
                                                    </div>
                                                ) : null}
                                                {/* End of code shift by pratap sahu on 20-10-2023 */}
                                            </div>
                                        </div>
                                    ) : null}
                                    <div className={style.inputContainerFlex}>
                                        <div className={style.inputBoxContainer}>
                                            <label className={style.InputLabel}>Cancel Reason </label>
                                            <textarea
                                            /* modified by Pratap sahu on 20-10-2023 to change colour of all input boxes*/
                                                // className={style.TextInputBox}
                                                // className={orderObject.payment_status=="Completed"|| orderObject.order_status=="Cancelled"?style.TextInputBoxDis:style.TextInputBox}
                                                className={orderObject.payment_status=="Completed"|| orderObject.order_status=="Cancelled"|| orderObject.payment_status == "Paid"?style.TextInputBoxDis:style.TextInputBox}
                                            /* modified by Pratap sahu on 20-10-2023 to change colour of all input boxes*/
                                                id="cancelInput"
                                                value={orderObject.cancel_reason}
                                                onChange={(e) => {
                                                    orderObject.cancel_reason = e.target.value;
                                                    setOrderobject({ ...orderObject });
                                                    // added by Pratap sahu on 04-11-2023 to clear validation colour and text
                                                    setCancelReason(e.target.value);
                                                    console.log("crinpt",cancelReason)
                                                    document.getElementById("cancelInput").style.border ="1px solid #9c9c9c";
                                                    errorText["cancelReason"] = "";
                                                    setErrorText({ ...errorText })
                                                    // End of code by Pratap sahu on 04-11-2023 
                                                }}
                                            />
                                            <div className={style.errorText}>
                                                {errorText.cancelReason ? errorText.cancelReason : null}
                                            </div>
                                        </div>
                                        {!localStorage.getItem("waiterData") ? (
                                            <div className={style.inputBoxContainer}>
                                                <label className={style.InputLabel}>
                                                    Discount Reason{" "}
                                                </label>
                                                <textarea
                                                /* modified by Pratap sahu on 20-10-2023 to change colour of all input boxes*/
                                                    // className={style.TextInputBox}
                                                    // className={orderObject.payment_status=="Completed"|| orderObject.order_status=="Cancelled"?style.TextInputBoxDis:style.TextInputBox}
                                                    className={orderObject.payment_status=="Completed"|| orderObject.order_status=="Cancelled"|| orderObject.payment_status == "Paid"?style.TextInputBoxDis:style.TextInputBox}
                                                /* modified by Pratap sahu on 20-10-2023 to change colour of all input boxes*/
                                                    value={orderObject.discount_reason}
                                                    onChange={(e) => {
                                                        orderObject.discount_reason = e.target.value;
                                                        setOrderobject({ ...orderObject });
                                                    }}
                                                />
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className={style.inputContainerFlex}>
                                        <div className={style.inputBoxContainer}>
                                            <label className={style.InputLabel} />
                                        </div>
                                        <div className={style.UpdateDIscountBtn}>
                                            <button
                                            /* Added by Pratap sahu on 08-10-2023 Reason:To display Apply Button as Disabled*/
                                                // className={`${style.ApplyBtn}`}
                                                // className={orderObject.payment_status=="Completed"|| orderObject.order_status=="Cancelled"?style.ApplyBtnDisabled:style.ApplyBtn}
                                                className={orderObject.payment_status=="Completed"|| orderObject.order_status=="Cancelled" || orderObject.payment_status=="Paid"?style.ApplyBtnDisabled:style.ApplyBtn}
                                            /* End of code by Pratap sahu on 08-10-2023 Reason:To display Apply Button as Disabled*/
                                                onClick={(e) => {
                                                    updateOrderDetail("Order details");
                                                }}>
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={style.pricingContent}>
                            {/* Commented & Modified by Pratap sahu on 03-11-2023 To Display redeem loyalty points only when loyalty allow*/}
                                {/* <div className={style.priceInformation}>
                                    <label className={style.InputLabel}>Loyalty Price :- </label>
                                    <label className={style.InputLabel}>
                                        ₹ {orderObject.loyality_point_price}
                                    </label>
                                    </div> */}
                                {/*condition Modified by Pratap sahu on 05-11-2023 */}
                                {/* {setting?.allow_loyality_points? ( */}
                                {/* Modified by Pratap sahu on 11-11-2023 reason :To display loyalty fields only when selected */}
                                {/* {setting?.allow_loyality_points || orderObject.payment_status=="Completed"|| orderObject.order_status=="Cancelled" ? ( */}
                                    {setting.allow_loyality_points && setting.allow_loyality_points == true || orderObject.loyality_point_calculated==true? (
                                        // End of code by Pratap sahu on 11-11-2023 reason :To display loyalty fields only when selected 
                                                    <div className={style.priceInformation}>
                                                        <label className={style.InputLabel}>Loyalty Price :- </label>
                                                        <label className={style.InputLabel}>
                                                            ₹ {orderObject.loyality_point_price}
                                                        </label>
                                                    </div>
                                                ) : null}
                            {/* End of code by Pratap sahu on 03-11-2023 To Display redeem loyalty points only when loyalty allow*/}
                                <div className={style.priceInformation}>
                                    <label className={style.InputLabel}>Discount Price :- </label>
                                    <label className={style.InputLabel}>
                                        ₹ {orderObject.discount_rupees}
                                    </label>
                                </div>
                                <div className={style.priceInformation}>
                                    <label className={style.InputLabel}></label>
                                    <label
                                        className={style.InputLabel}
                                        style={{ borderTop: "1px solid black" }}>
                                        Total :- ₹{orderObject.total?.toFixed(2)}
                                    </label>
                                </div>
                                <div className={style.priceInformation}>
                                    <label className={style.InputLabel}>
                                        CGST (
                                        {isNaN(orderObject.cgst / (orderObject.total / 100))
                                            ? 0
                                            : (orderObject.cgst / (orderObject.total / 100))?.toFixed(
                                                2
                                            )}
                                        %):-{" "}
                                    </label>
                                    <label className={style.InputLabel}>
                                        {" "}
                                        ₹ {orderObject.cgst?.toFixed(2)}
                                    </label>
                                </div>
                                <div className={style.priceInformation}>
                                    <label className={style.InputLabel}>
                                        SGST (
                                        {isNaN(orderObject.sgst / (orderObject.total / 100))
                                            ? 0
                                            : (orderObject.sgst / (orderObject.total / 100))?.toFixed(2)}
                                        %) :-{" "}
                                    </label>
                                    <label className={style.InputLabel}>
                                        ₹ {orderObject.sgst?.toFixed(2)}
                                    </label>
                                </div>
                                <div className={style.priceInformation}>
                                    <label className={style.InputLabel}></label>
                                    <label
                                        className={style.InputLabel}
                                        style={{ borderTop: "1px solid black" }}>
                                        Grand Total :- ₹ {orderObject.final_amount?.toFixed(2)}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={style.PrintNBack}>
                        <button
                            className={style.BackBtn}
                            // Modified by Pratap Sahu on 03-11-2023 Reason:To remove validation when close the popup and deactivate cancel button
                            // onClick={(e) => setModelVisiblity(false)}
                            onClick={(e) => {
                                            // ifdocument.getElementById("discount_percentage").style.border =
                                            //     "1px solid #9c9c9c";
                                            // document.getElementById("discount_rupees").style.border =
                                            //     "1px solid #9c9c9c";
                                            // document.getElementById("cancelInput").style.border =
                                            //     "1px solid #9c9c9c";
                                            // errorText["cancelReason"] = "";
                                            // errorText["discount_price"] = "";
                                            // errorText["discount_percentage"]="";
                                            // errorText["loyality_point"] = "";
                                            // setErrorText({ ...errorText })
                                            // setCancelClicked(false)
                                            // setModelVisiblity(false)
                                            // Modified by Pratap Sahu on 04-11-2023 Reason:To remove validation from WaiterJS
                                            if(document.getElementById("cancelInput")){
                                                document.getElementById("cancelInput").style.border =
                                                "1px solid #9c9c9c";
                                                errorText["cancelReason"] = "";
                                                setErrorText({ ...errorText })
                                                setCancelClicked(false)
                                                setModelVisiblity(false)
                                            }else if(document.getElementById("discount_percentage") || document.getElementById("discount_rupees") || document.getElementById("cancelInput")){
                                                document.getElementById("discount_percentage").style.border =
                                                    "1px solid #9c9c9c";
                                                document.getElementById("discount_rupees").style.border =
                                                    "1px solid #9c9c9c";
                                                document.getElementById("cancelInput").style.border =
                                                    "1px solid #9c9c9c";
                                                errorText["cancelReason"] = "";
                                                errorText["discount_price"] = "";
                                                errorText["discount_percentage"]="";
                                                errorText["loyality_point"] = "";
                                                setErrorText({ ...errorText })
                                                setCancelClicked(false)
                                                setModelVisiblity(false)
                                            }
                                            // End of code by Pratap Sahu on 04-11-2023 
                                            }
                                // End of code by Pratap Sahu on 03-11-2023 
                            }>
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
