import { useState } from 'react';

export function useWaiterDashboardState() {
  const [placedOrders, setPlacedOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedorders, setCompletedOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const [IsModalOpen, setModelVisiblity] = useState(false);
  const [setting, setSettings] = useState(null);
  const [restroDetail, setRestroDetail] = useState(null);
  const [IsOrderPopupVisible, setOrderPopupvisible] = useState(false);
  const [recall, setRecall] = useState([]);
  return {
    placedOrders,
    setPlacedOrders,
    pendingOrders,
    setPendingOrders,
    completedorders,
    setCompletedOrders,
    orderItems,
    setOrderItems,
    selectedOrder,
    setSelectedOrder,
    selectedOrderItems,
    setSelectedOrderItems,
    IsModalOpen,
    setModelVisiblity,
    setting,
    setSettings,
    restroDetail,
    setRestroDetail,
    IsOrderPopupVisible,
    setOrderPopupvisible,
    recall,
    setRecall,
  };
}
