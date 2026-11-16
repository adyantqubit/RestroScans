import { useState } from 'react';

export const initialHomeState = {
  loading: false,
  error: '',
};

export function useStaffOrderForm() {
  const [AddMoreItemmodalVisible, setAddMoreItemModalVisible] = useState(false);
  const [orderItemList, setOrderItemList] = useState([]);
  const [errorText, setErrorText] = useState({});
  const [settings, setSettings] = useState({});
  const [restaurant, setRestaurant] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [cgst, setCGST] = useState(0);
  const [sgst, setSGST] = useState(0);
  const [total, setTotal] = useState(0);
  const [contact, setContact] = useState('');
  const [table_number, setTableNumber] = useState('');
  const [email, setEmail] = useState('');
  const [payment, setPayment] = useState(null);
  const [name, setName] = useState('');
  return {
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
  };
}
