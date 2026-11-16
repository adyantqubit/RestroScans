import {
  getSettingsDetails,
  getDashboardData,
  saveOrderDetailsApi,
  updateAllOrderAPI,
  updateItemStatus,
  updateOrderAndPaymentStatus,
  postCustomerDetails,
} from '../api/homeApi';

export function loadSettings() {
  return getSettingsDetails();
}

export function loadDashboard() {
  return getDashboardData();
}

export function orderStatusChange(current, orderStatus, paymentStatus) {
  if (current?.order_status == "Placed" && (orderStatus == "Cooked" || orderStatus == "Served")) {
    return { allowed: false, message: "Please first change order status to confirm " };
  }
  if (current?.order_status == "Confirm" && orderStatus == "Placed") {
    return { allowed: false, message: "You cant change order status confirm to placed" };
  }
  if (current?.order_status == "Cooked" && (orderStatus == "Confirm" || orderStatus == "Placed")) {
    return { allowed: false, message: "You cant change order status cooked to " + orderStatus };
  }
  if (current?.order_status == "Served" && (orderStatus == "Confirm" || orderStatus == "Placed" || orderStatus == "Cooked")) {
    return { allowed: false, message: "You cant change order status served to " + orderStatus };
  }
  if (current?.order_status == "Cancelled" && (orderStatus == "Pending" || orderStatus == "Confirm" || orderStatus == "Placed" || orderStatus == "Cooked" || orderStatus == "Served")) {
    return { allowed: false, message: "You cant change order status cancel to " + orderStatus };
  }
  if (current?.order_status == "Placed" && paymentStatus == "Completed") {
    return { allowed: false, message: "You cant change payment status completed till order is not confirmed." };
  }
  if (current?.payment_status == "Completed" && paymentStatus == "Pending") {
    return { allowed: false, message: "You cant change payment status completed to " + paymentStatus };
  }
  if ((current?.payment_status == "Completed" || current?.payment_status == "Paid") && orderStatus == "Cancelled") {
    return { allowed: false, message: "You can't cancel order if payment is " + paymentStatus };
  }
  if (current?.order_status == "Cancelled" && paymentStatus == "Completed") {
    return { allowed: false, message: "You can't complete payment if order is " + orderStatus };
  }
  if (current?.order_status == "Cancelled") {
    return { allowed: false, message: "You Can't change status if order is cancelled" };
  }
  return { allowed: true, message: "" };
}

export function orderFormStatusChange(current, orderStatus, paymentStatus, selectedOrderStatus, selectedPaymentStatus) {
  var base = orderStatusChange(current, orderStatus, paymentStatus);
  if (!base.allowed) return { allowed: false, message: base.message, clearCancel: false };
  if (selectedOrderStatus == "Cancelled" && paymentStatus == "Completed") {
    return {
      allowed: false,
      message: "You can't complete payment if order is " + selectedOrderStatus,
      clearCancel: false,
    };
  }
  if (selectedPaymentStatus == "Completed") {
    return { allowed: false, message: "You can't perform both actions at a time", clearCancel: false };
  }
  var clearCancel = (selectedOrderStatus == "Placed" && current?.payment_status == "Pending") || current?.order_status == "Placed" || current?.order_status == "Confirm";
  return { allowed: true, message: "", clearCancel: clearCancel };
}

export function saveOrderDetails(_tenant, value) {
  return saveOrderDetailsApi(_tenant, value);
}

export function saveAllOrderStatus(_tenant, data) {
  return updateAllOrderAPI(_tenant, data);
}

export function saveItemStatus(_tenant, items, orderId) {
  return updateItemStatus(_tenant, items, orderId);
}

export function saveOrderPaymentStatus(_tenant, status, orderId) {
  return updateOrderAndPaymentStatus(_tenant, status, orderId);
}

export function createStaffOrder(formData, tenantId) {
  const payload = { ...formData, validate_table: true };
  if (payload.order_created_by !== 'Admin' && payload.order_created_by !== 'Waiter') {
    payload.order_created_by = 'Admin';
  }
  return postCustomerDetails(payload, tenantId);
}

export function slipDateTime(format) {
  return {
    date: format?.substring(0, 10),
    time: format?.substring(11, 19),
  };
}

export function activeItemTotal(items) {
  var total = 0;
  items.filter(function (row) {
    if (row.item_status != "Cancelled") total += row.price;
  });
  return total;
}

export function changeStaffLineQuantity(lines, index, sign) {
  if (sign == "+") {
    lines[index].quantity = parseInt(lines[index].quantity) + 1;
    lines[index].price = lines[index].quantity * (lines[index].price / (lines[index].quantity - 1));
    return true;
  }
  if (lines[index].quantity != 1) {
    lines[index].quantity = parseInt(lines[index].quantity) - 1;
    lines[index].price = lines[index].quantity * (lines[index].price / (lines[index].quantity + 1));
    return true;
  }
  return false;
}

export function removeStaffLine(lines, index) {
  lines.splice(index, 1);
  return lines.slice();
}

export function staffOrderTotals(items, settings) {
  var subtotal = 0;
  items.filter(function (row) {
    subtotal += parseFloat(row.price);
  });
  var cgstAmount;
  var sgstAmount;
  if (settings.cgst) cgstAmount = settings.cgst * (subtotal / 100);
  if (settings.sgst) sgstAmount = settings.sgst * (subtotal / 100);
  var total;
  if (settings.sgst && settings.cgst) total = subtotal + cgstAmount + sgstAmount;
  else if (settings.cgst) total = subtotal + cgstAmount;
  else if (settings.sgst) total = subtotal + sgstAmount;
  else total = subtotal;
  return {
    subtotal: subtotal.toFixed(2),
    cgst: cgstAmount != null ? cgstAmount.toFixed(2) : undefined,
    sgst: sgstAmount != null ? sgstAmount.toFixed(2) : undefined,
    total: total.toFixed(2),
  };
}

export function staffOrderDraft(errorText, items, contact, payment, email, name, tableNumber, restaurant, waiterData) {
  if (tableNumber.length == 0) errorText.table_number = "Please enter table number";
  if (contact.length != 0 && contact.length < 10) {
    errorText.contact_number = "Contact Number should not be less than 10 digits";
  } else if (contact.length > 10) {
    errorText.contact_number = "Contact Number should not be more than 10 digits";
  } else {
    delete errorText.contact_number;
  }
  var phone = contact;
  if (phone.length == 0) {
    if (waiterData) phone = waiterData.contact_number;
    else phone = String(restaurant.contact_number % 1e10);
    if (String(phone).length < 10) {
      errorText.contact_number = "Admin Contact Number should not be less than 10 digits";
    } else {
      delete errorText.contact_number;
    }
  }
  var formData = {
    cart: items,
    contact_number: phone,
    payment_mode: payment,
    email: email,
    name: name,
    table_number: tableNumber,
    validate_table: true,
    order_created_by: waiterData ? "Waiter" : "Admin",
  };
  if (waiterData) formData.waiter_contact_number = waiterData.contact_number;
  return { formData: formData, phone: phone };
}
