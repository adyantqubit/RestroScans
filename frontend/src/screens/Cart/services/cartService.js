import {
  updateOrdersApi as requestUpdateOrders,
  postUpdateOrderItems as requestPostUpdateOrderItems,
  deleteOrderItems as requestDeleteOrderItems,
} from "../api/cartApi";

export function updateOrdersApi(tenantId, cartData) {
  var fcmToken = localStorage.getItem("fcmToken");
  if (fcmToken) cartData["fcmToken"] = fcmToken;
  return requestUpdateOrders(tenantId, cartData);
}

export function postUpdateOrderItems(tenantId, updateOrderItems) {
  return requestPostUpdateOrderItems(tenantId, updateOrderItems);
}

export function deleteOrderItems(tenantId, deleteOrderItem) {
  return requestDeleteOrderItems(tenantId, deleteOrderItem);
}

export function removeListItem(specificIndex, list) {
  var temp = [];
  for (var i = 0; i < list.length; i++) {
    if (i != specificIndex) temp.push(list[i]);
  }
  return temp;
}

export function decreaseCartLine(cart, selectedItem) {
  var cartId = cart.findIndex((row) => row.id == selectedItem.id && row.serve_size == selectedItem.serve_size);
  if (cart[cartId].quantity != 1) {
    cart[cartId].quantity = --selectedItem.quantity;
    return { cart: [...cart], askRemove: null };
  }
  return { cart: cart, askRemove: selectedItem };
}

export function cartSubtotal(cart) {
  var subtotal = 0;
  (cart || []).filter((row) => {
    subtotal += row.quantity * row.price;
  });
  return subtotal;
}

export function plateLabel(size) {
  if (size == "Half Plate") return "Half";
  return "Full";
}

export function removeCartLine(cart, line) {
  var itemIndex = cart.findIndex((row) => row.id == line.id && row.serve_size == line.serve_size);
  return removeListItem(itemIndex, cart);
}

export function orderUpdatePayload(cart, orders, orderItem) {
  return {
    cart: cart,
    orders: orders.order_id,
    orderItem: orderItem,
    order: orders,
  };
}

export function createCartLine(item, quantity, size, price, restaurantName, bestSeller) {
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
    tenant: restaurantName,
    best: bestSeller?.filter((row) => row.item == item.id).length > 0,
  };
}

export function applyPlateQuantity(cart, item, quantity, size, price, restaurantName, bestSeller) {
  var cartTemp = cart;
  var notice = null;
  if (quantity > 0) {
    var cartIndex = cartTemp.findIndex((row) => row.id == item.id && row.serve_size == size);
    if (cartIndex != -1) {
      cartTemp[cartIndex].quantity = quantity;
      notice = "Successfully quantity updated";
    } else {
      cartTemp = [...cartTemp, createCartLine(item, quantity, size, price, restaurantName, bestSeller)];
      notice = "Successfully added to your cart";
    }
  } else if (cartTemp.findIndex((row) => row.id == item.id && row.serve_size == size) != -1) {
    var cartId = cartTemp.findIndex((row) => row.id == item.id && row.serve_size == size);
    cartTemp = removeListItem(cartId, cartTemp);
    notice = "Item is succesfully removed from cart";
  }
  return { cart: cartTemp, notice: notice };
}

export function quantityInCart(cart, itemId, size) {
  var cartId = (cart || []).findIndex((row) => row.id == itemId && row.serve_size == size);
  if (cartId == -1) return null;
  return cart[cartId].quantity;
}
