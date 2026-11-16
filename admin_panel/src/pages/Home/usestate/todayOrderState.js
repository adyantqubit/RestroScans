import { useState } from 'react';

export function useTodayOrderState() {
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");
  const [selectedOrderStatus, setSelectedOrderStatus] = useState("");
  const [todaysPendingOrder, setPendingOrders] = useState(null);
  const [todaysCompletedOrder, setCompletedOrders] = useState(null);
  const [newlyPlaced, setNewlyPlacedOrders] = useState(null);
  const [todaysServedOrder, setServedOrder] = useState(null);
  const [todaysPaidOrder, setPaidOrder] = useState(null);
  const [todaysCancelledOrder, setCancelledOrder] = useState(null);
  const [orderItemList, setOrderItem] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [checkedItems, setCheckedItem] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [restroDetail, setRestroDetail] = useState(null);
  const [settings, setSettings] = useState({});
  const [selectedOrderObject, setSelectedOrderObject] = useState({});
  const [selectedOrderItemsObject, setSelectedOrderItemsObject] = useState([]);
  const [IsModalOpen, setModelVisiblity] = useState(false);
  return {
    selectedPaymentStatus,
    setSelectedPaymentStatus,
    selectedOrderStatus,
    setSelectedOrderStatus,
    todaysPendingOrder,
    setPendingOrders,
    todaysCompletedOrder,
    setCompletedOrders,
    newlyPlaced,
    setNewlyPlacedOrders,
    todaysServedOrder,
    setServedOrder,
    todaysPaidOrder,
    setPaidOrder,
    todaysCancelledOrder,
    setCancelledOrder,
    orderItemList,
    setOrderItem,
    selectedOrder,
    setSelectedOrder,
    checkedItems,
    setCheckedItem,
    isLoading,
    setLoading,
    restroDetail,
    setRestroDetail,
    settings,
    setSettings,
    selectedOrderObject,
    setSelectedOrderObject,
    selectedOrderItemsObject,
    setSelectedOrderItemsObject,
    IsModalOpen,
    setModelVisiblity,
  };
}
