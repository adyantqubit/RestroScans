import { useState } from 'react';

export const initialTableForm = {
  name: '',
  seats: 4,
  is_active: true,
};

export function useTablesState() {
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState(initialTableForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  return {
    tables,
    setTables,
    form,
    setForm,
    editingId,
    setEditingId,
    error,
    setError,
  };
}
