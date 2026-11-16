import { useState } from 'react';

export const emptyCustomer = {
  name: '',
  contact: '',
  email: '',
  table: '',
};

export function useNewOrderDesk() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allowHalf, setAllowHalf] = useState(false);
  const [restaurant, setRestaurant] = useState({});
  const [categoryId, setCategoryId] = useState('all');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(emptyCustomer);
  const [tables, setTables] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [customTable, setCustomTable] = useState(false);

  return {
    items, setItems,
    categories, setCategories,
    allowHalf, setAllowHalf,
    restaurant, setRestaurant,
    categoryId, setCategoryId,
    query, setQuery,
    cart, setCart,
    customer, setCustomer,
    tables, setTables,
    busy, setBusy,
    error, setError,
    customTable, setCustomTable,
  };
}
