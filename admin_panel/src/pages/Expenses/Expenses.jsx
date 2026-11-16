import React, { useCallback, useEffect, useState } from 'react';
import httpClient, { friendlyErrorMessage } from '../../http/http_client';
import './Expenses.css';

const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const currentTime = () => new Date().toTimeString().slice(0, 5);
const emptyForm = () => ({ category_id: '', expense_nature: 'Direct', party_name: '', invoice_number: '', invoice_file: null, remove_invoice: false, name: '', quantity: '', amount: '', expense_date: today(), expense_time: currentTime(), paid_by: '', payment_type: 'Cash', remark: '' });
const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const errorText = (error) => friendlyErrorMessage(error);
const displayDate = (value) => {
  if (!value) return '';
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : String(value);
};
const parseDate = (value) => {
  const match = String(value).trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const day = Number(match[1]), month = Number(match[2]), year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return `${match[3]}-${match[2]}-${match[1]}`;
};
function ExpenseDateInput({ value, onChange, required = false }) {
  const [draft, setDraft] = useState(displayDate(value));
  useEffect(() => { setDraft(displayDate(value)); }, [value]);
  const update = (text) => {
    setDraft(text);
    if (!text.trim()) onChange('');
    else { const iso = parseDate(text); if (iso) onChange(iso); }
  };
  const commit = () => { if (draft && !parseDate(draft)) setDraft(displayDate(value)); };
  return (
    <span className="rs-expenses-date-field">
      <input type="text" inputMode="numeric" placeholder="DD/MM/YYYY" title="Enter date as DD/MM/YYYY" pattern="(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}" required={required} value={draft} onChange={e => update(e.target.value)} onBlur={commit} />
      <span className="rs-expenses-calendar-control" title="Choose date">
        <span aria-hidden="true">▦</span>
        <input type="date" aria-label="Choose date" value={value || ''} onChange={e => { onChange(e.target.value); setDraft(displayDate(e.target.value)); }} />
      </span>
    </span>
  );
}


export default function Expenses() {
  const [payrollRows, setPayrollRows] = useState([]);
  const [payrollTotal, setPayrollTotal] = useState('0');
  const [formOpen, setFormOpen] = useState(false);
  const [entryKind, setEntryKind] = useState('regular');
  const [registerType, setRegisterType] = useState('all');
  const [detailId, setDetailId] = useState(null);
  const [payrollKind, setPayrollKind] = useState('advance');
  const [payrollEmployee, setPayrollEmployee] = useState('');
  const [payrollMonth, setPayrollMonth] = useState(today().slice(0, 7));
  const [payrollAmount, setPayrollAmount] = useState('');
  const [payrollDate, setPayrollDate] = useState(today());
  const [payrollMode, setPayrollMode] = useState('Cash');
  const [payrollRemark, setPayrollRemark] = useState('');
  const [payrollList, setPayrollList] = useState([]);
  const [payrollSaving, setPayrollSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [staff, setStaff] = useState([]);
  const [existingInvoiceUrl, setExistingInvoiceUrl] = useState('');
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [filters, setFilters] = useState({ start_date: today(), end_date: today(), category_id: '', expense_nature: '', payment_type: '', search: '' });
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState('0');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadOptions = useCallback(async () => {
    try {
      const [cats, employees] = await Promise.all([
        httpClient.get('/api/v1/expenses/categories/'),
        httpClient.get('/api/v1/expenses/staff/')
      ]);
      setCategories(cats.data.results || []);
      setStaff(employees.data.results || []);
    } catch (err) { setError(errorText(err)); }
  }, []);

  const loadRows = useCallback(async () => {
    setLoading(true);
    try {
      const all = [];
      for (let current = 1; current <= 100; current += 1) {
        const response = await httpClient.get('/api/v1/expenses/', { params: { ...filters, page: current, page_size: 100 } });
        all.push(...(response.data.results || []));
        if (all.length >= Number(response.data.count || 0)) break;
      }
      setRows(all);
      setCount(all.length);
      setTotal(all.reduce((sum, row) => sum + Number(row.amount || 0), 0).toFixed(2));
      setError('');
    } catch (err) { setError(errorText(err)); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { loadOptions(); }, [loadOptions]);
  useEffect(() => { loadRows(); }, [loadRows]);
  const loadPayrollSync = useCallback(async () => {
    try {
      const [linked, payroll] = await Promise.all([
        httpClient.get('/api/v1/expenses/payroll-sync/', { params: { start_date: filters.start_date, end_date: filters.end_date } }),
        httpClient.get('/api/v1/workforce/payroll/', { params: { month: payrollMonth } })
      ]);
      setPayrollRows(linked.data.results || []);
      setPayrollTotal(linked.data.total_amount || '0');
      setPayrollList(payroll.data.results || []);
    } catch (err) { setError(errorText(err)); }
  }, [filters.start_date, filters.end_date, payrollMonth]);
  useEffect(() => { loadPayrollSync(); }, [loadPayrollSync]);
  const savePayrollFromExpenses = async (event) => {
    event.preventDefault();
    if (!payrollEmployee || !(Number(payrollAmount) > 0)) { setError('Select employee and enter a positive amount.'); return; }
    const selected = payrollList.find(p => String(p.employee_id) === String(payrollEmployee));
    if (payrollKind === 'salary' && !selected) { setError('Generate this employee’s monthly payroll in Staff & Payroll before paying salary.'); return; }
    if (!window.confirm(`Record ${payrollKind === 'salary' ? 'salary payment' : 'advance'} of ${money(payrollAmount)} for ${staff.find(e => String(e.id) === String(payrollEmployee))?.name || 'employee'}?`)) return;
    setPayrollSaving(true); setError(''); setMessage('');
    try {
      const payload = payrollKind === 'salary'
        ? { action: 'pay_salary', payroll_id: selected.id, amount: payrollAmount, payment_date: payrollDate, payment_mode: payrollMode, remark: payrollRemark }
        : { action: 'advance', employee_id: payrollEmployee, amount: payrollAmount, date: payrollDate, remark: payrollRemark };
      await httpClient.post('/api/v1/workforce/payroll/', payload);
      setMessage('Payment recorded in Staff & Payroll and automatically shown in Expenses.');
      setPayrollAmount(''); setPayrollRemark(''); setFormOpen(false);
      await loadPayrollSync();
    } catch (err) { setError(errorText(err)); }
    finally { setPayrollSaving(false); }
  };
  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const updateFilter = (key, value) => { setPage(1); setFilters(prev => ({ ...prev, [key]: value })); };
  const resetForm = () => { setEditing(null); setForm(emptyForm()); setExistingInvoiceUrl(''); };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true); setError(''); setMessage('');
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'sub_type_id' || key === 'invoice_date') return;
        if (key === 'invoice_file') {
          if (value) data.append(key, value);
        } else {
          data.append(key, value == null ? '' : String(value));
        }
      });
      if (editing) await httpClient.patch(`/api/v1/expenses/${editing}/`, data);
      else await httpClient.post('/api/v1/expenses/', data);
      setMessage(editing ? 'Expense updated successfully.' : 'Expense added successfully.');
      resetForm(); setFormOpen(false); setPage(1); await loadRows();
    } catch (err) { setError(errorText(err)); }
    finally { setSaving(false); }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const response = await httpClient.post('/api/v1/expenses/categories/', { name: newCategory.trim() });
      setNewCategory(''); await loadOptions(); updateForm('category_id', String(response.data.id));
      setMessage('Expense type created.'); setError('');
    } catch (err) { setError(errorText(err)); }
  };


  const edit = (row) => {
    setEditing(row.id);
    setForm({
      category_id: String(row.category_id), expense_nature: row.expense_nature || 'Direct',
      party_name: row.party_name || '', invoice_number: row.invoice_number || '', invoice_file: null, remove_invoice: false, name: row.name, quantity: row.quantity || '', amount: row.amount,
      expense_date: row.expense_date, expense_time: row.expense_time, paid_by: row.paid_by,
      payment_type: row.payment_type, remark: row.remark || ''
    });
    setExistingInvoiceUrl(row.invoice_url || '');
    setEntryKind('regular'); setFormOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete expense "${row.name}"?`)) return;
    try {
      await httpClient.delete(`/api/v1/expenses/${row.id}/`);
      setMessage('Expense deleted.');
      if (rows.length === 1 && page > 1) setPage(page - 1);
      else await loadRows();
    } catch (err) { setError(errorText(err)); }
  };

  const exportCSV = async () => {
    try {
      const all = [];
      let current = 1;
      while (true) {
        const response = await httpClient.get('/api/v1/expenses/', { params: { ...filters, page: current, page_size: 100 } });
        all.push(...(response.data.results || []));
        if (all.length >= response.data.count || current >= 1000) break;
        current += 1;
      }
      const columns = ['expense_date', 'expense_time', 'category', 'expense_nature', 'name', 'party_name', 'invoice_number', 'invoice_url', 'quantity', 'amount', 'paid_by', 'payment_type', 'created_by', 'remark'];
      const escapeCSV = value => `"${String(value == null ? '' : value).replace(/"/g, '""')}"`;
      const csv = [columns.join(','), ...all.map(row => columns.map(key => escapeCSV(key === 'expense_date' ? displayDate(row[key]) : row[key])).join(','))].join('\r\n');
      const blob = new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'expense-report.csv'; a.click();
      URL.revokeObjectURL(url);
    } catch (err) { setError(errorText(err)); }
  };

  const combined = [
    ...rows.map(row => ({ ...row, kind: 'regular', key: `expense-${row.id}`, sortDate: `${row.expense_date}T${row.expense_time || '00:00'}` })),
    ...payrollRows.map(row => ({ ...row, payrollKind: row.kind, kind: 'salary', key: `payroll-${row.id}`, sortDate: `${row.date}T00:00` }))
  ].filter(row => registerType === 'all' || row.kind === registerType)
    .filter(row => row.kind !== 'salary' || (
      (!filters.search || [row.employee, row.kind, row.remark, row.mode].join(' ').toLowerCase().includes(filters.search.toLowerCase())) &&
      (!filters.payment_type || row.mode === filters.payment_type || (filters.payment_type === 'Bank' && row.mode === 'Bank Transfer')) &&
      (!filters.expense_nature || filters.expense_nature === 'Indirect') &&
      (!filters.category_id)
    )).sort((a, b) => b.sortDate.localeCompare(a.sortDate));
  const pageSize = 10;
  const pages = Math.max(1, Math.ceil(combined.length / pageSize));
  const visible = combined.slice((Math.min(page, pages) - 1) * pageSize, Math.min(page, pages) * pageSize);
  const combinedTotal = combined.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  return (
    <div className="rs-expenses">
      <div className="rs-expenses-head"><div><span>RESTAURANT FINANCES</span><h1>Expense Management</h1><p>Regular expenses and employee payments, managed together.</p></div><div className="rs-expenses-stat"><small>Filtered Cash Outflow</small><strong>{money(combinedTotal)}</strong><span>{combined.length} entries</span></div></div>
      {error && <div className="rs-expenses-error" role="alert">{error}</div>}
      {message && <div className="rs-expenses-success">{message}</div>}
      <section className="rs-expenses-card">
        <div className="rs-expenses-table-head"><div><h2>{editing ? 'Edit Expense' : 'Add New Expense'}</h2><p>One form for regular expenses, salary payments and advances.</p></div><button type="button" onClick={() => { if (formOpen) { setFormOpen(false); resetForm(); } else setFormOpen(true); }}>{formOpen ? 'Close Form' : '+ Add Expense / Salary'}</button></div>
        {formOpen && <>
          {!editing && <div className="rs-expenses-entry-kind"><label><input type="radio" checked={entryKind === 'regular'} onChange={() => setEntryKind('regular')} /> Regular Expense</label><label><input type="radio" checked={entryKind === 'salary'} onChange={() => setEntryKind('salary')} /> Salary / Advance</label></div>}
          {entryKind === 'regular' && <>
            <form onSubmit={save}>
              <div className="rs-expenses-grid">
                <label>Expense Category/Sub Type *<select required value={form.category_id} onChange={e => setForm(prev => ({ ...prev, category_id: e.target.value }))}><option value="">Select Expense Type</option>{categories.filter(c => c.is_active).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
                <fieldset className="rs-expenses-nature"><legend>Expense Type *</legend><div className="rs-expenses-nature-options"><label><input type="radio" name="expense_nature" value="Direct" checked={form.expense_nature === 'Direct'} onChange={() => updateForm('expense_nature', 'Direct')} /> Direct Expense</label><label><input type="radio" name="expense_nature" value="Indirect" checked={form.expense_nature === 'Indirect'} onChange={() => updateForm('expense_nature', 'Indirect')} /> Indirect Expense</label></div></fieldset>
                <label>Date *<ExpenseDateInput required value={form.expense_date} onChange={value => updateForm('expense_date', value)} /></label>
                <label>Expense Description *<input required maxLength="180" placeholder="e.g. Purchased 10 KG paneer" value={form.name} onChange={e => updateForm('name', e.target.value)} /></label>
                <label>Time *<input required type="time" value={form.expense_time} onChange={e => updateForm('expense_time', e.target.value)} /></label>
                <label>Quantity<input type="number" min="0.01" step="0.01" placeholder="Optional" value={form.quantity} onChange={e => updateForm('quantity', e.target.value)} /></label>
                <label>Party / Supplier Name<input maxLength="180" placeholder="Supplier or party name" value={form.party_name} onChange={e => updateForm('party_name', e.target.value)} /></label>
                <label>Amount (₹) *<input required type="number" min="0.01" step="0.01" value={form.amount} onChange={e => updateForm('amount', e.target.value)} /></label>
                <label>Paid By *<input required list="rs-expenses-staff" maxLength="120" placeholder="Select or enter name" value={form.paid_by} onChange={e => updateForm('paid_by', e.target.value)} /><datalist id="rs-expenses-staff"><option value="Admin" />{staff.map(s => <option key={s.id} value={s.name} />)}</datalist></label>
                <label>Payment Type *<select required value={form.payment_type} onChange={e => updateForm('payment_type', e.target.value)}>{['Cash', 'UPI', 'Bank', 'Card', 'Other'].map(p => <option key={p} value={p}>{p === 'Bank' ? 'Bank Transfer' : p}</option>)}</select></label>
                <label>Invoice Number<input maxLength="100" placeholder="Invoice / bill number" value={form.invoice_number} onChange={e => updateForm('invoice_number', e.target.value)} /></label>
                <label className="rs-expenses-wide">Invoice PDF / Image<input type="file" accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg" onChange={e => updateForm('invoice_file', e.target.files?.[0] || null)} />{existingInvoiceUrl && <span><a href={existingInvoiceUrl} target="_blank" rel="noreferrer">View current invoice</a> <label><input type="checkbox" checked={form.remove_invoice} onChange={e => updateForm('remove_invoice', e.target.checked)} /> Remove current invoice</label></span>}</label>
                <label className="rs-expenses-wide">Remark / Description<textarea rows="2" maxLength="3000" placeholder="Optional details" value={form.remark} onChange={e => updateForm('remark', e.target.value)} /></label>
              </div>
              <div className="rs-expenses-actions"><button type="submit" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Expense' : 'Add Expense'}</button>{editing && <button type="button" className="rs-expenses-secondary" onClick={resetForm}>Cancel Edit</button>}</div>
            </form>
            <div className="rs-expenses-type-management">
              <div className="rs-expenses-add-type">
                <input placeholder="New expense type (e.g. Grocery)" value={newCategory} onChange={e => setNewCategory(e.target.value)} maxLength="100" />
                <button type="button" onClick={addCategory}>+ Add Expense Type</button>
              </div>
            </div>

          </>}
          {entryKind === 'salary' && <form className="rs-expenses-payroll-form" onSubmit={savePayrollFromExpenses}>
            <div className="rs-expenses-grid">
              <label>Employee *<select required value={payrollEmployee} onChange={e => setPayrollEmployee(e.target.value)}><option value="">Select Employee</option>{staff.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select></label>
              <label>Payment For *<select value={payrollKind} onChange={e => setPayrollKind(e.target.value)}><option value="advance">Salary Advance</option><option value="salary">Monthly Salary</option></select></label>
              {payrollKind === 'salary' && <label>Salary Month *<input type="month" required value={payrollMonth} onChange={e => setPayrollMonth(e.target.value)} /></label>}
              <label>Payment Date *<ExpenseDateInput required value={payrollDate} onChange={setPayrollDate} /></label>
              <label>Amount (₹) *<input required type="number" min="0.01" step="0.01" value={payrollAmount} onChange={e => setPayrollAmount(e.target.value)} /></label>
              {payrollKind === 'salary' && <label>Payment Mode<select value={payrollMode} onChange={e => setPayrollMode(e.target.value)}>{['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Other'].map(x => <option key={x}>{x}</option>)}</select></label>}
              <label className="rs-expenses-wide">Remark (Optional)<input maxLength="500" value={payrollRemark} onChange={e => setPayrollRemark(e.target.value)} /></label>
            </div>
            {payrollKind === 'salary' && <p className="rs-expenses-payroll-note">{(() => { const p = payrollList.find(x => String(x.employee_id) === String(payrollEmployee)); return p ? `Generated salary balance: ${money(p.remaining_amount)} · Gross: ${money(p.gross_salary)}` : 'Generate salary for this employee and month in Staff & Payroll first.'; })()}</p>}
            <div className="rs-expenses-actions"><button disabled={payrollSaving} type="submit">{payrollSaving ? 'Saving...' : 'Save & Sync Payment'}</button></div>
          </form>}

        </>}
      </section>
      <section className="rs-expenses-card">
        <div className="rs-expenses-table-head"><div><h2>All Expense & Salary Payments</h2><p>One register. Salary and advance payments sync automatically with Staff & Payroll.</p></div><button type="button" onClick={exportCSV}>Export Regular Expenses CSV</button></div>
        <div className="rs-expenses-register-tabs"><button type="button" className={registerType === 'all' ? 'active' : ''} onClick={() => { setRegisterType('all'); setPage(1) }}>All Payments</button><button type="button" className={registerType === 'regular' ? 'active' : ''} onClick={() => { setRegisterType('regular'); setPage(1) }}>Regular Expenses</button><button type="button" className={registerType === 'salary' ? 'active' : ''} onClick={() => { setRegisterType('salary'); setPage(1) }}>Salary & Advance</button></div>
        <div className="rs-expenses-filters"><label>From<ExpenseDateInput value={filters.start_date} onChange={value => updateFilter('start_date', value)} /></label><label>To<ExpenseDateInput value={filters.end_date} onChange={value => updateFilter('end_date', value)} /></label><label>Expense Type<select value={filters.category_id} onChange={e => updateFilter('category_id', e.target.value)}><option value="">All Types</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label>Classification<select value={filters.expense_nature} onChange={e => updateFilter('expense_nature', e.target.value)}><option value="">All Classifications</option><option value="Direct">Direct Expense</option><option value="Indirect">Indirect Expense</option></select></label><label>Payment<select value={filters.payment_type} onChange={e => updateFilter('payment_type', e.target.value)}><option value="">All Payments</option>{['Cash', 'UPI', 'Bank', 'Card', 'Other'].map(p => <option key={p}>{p}</option>)}</select></label><label>Search<input placeholder="Description / Employee / Remark" value={filters.search} onChange={e => updateFilter('search', e.target.value)} /></label><button type="button" className="rs-expenses-secondary" onClick={() => { setFilters({ start_date: '', end_date: '', category_id: '', expense_nature: '', payment_type: '', search: '' }); setPage(1) }}>Clear Filter</button></div>
        <div className="rs-expenses-scroll"><table><thead><tr><th>Date</th><th>Category</th><th>Description / Employee</th><th>Classification</th><th>Paid By / Source</th><th>Payment</th><th>Amount</th><th>Actions</th></tr></thead><tbody>
          {visible.map(row => <React.Fragment key={row.key}><tr><td>{displayDate(row.kind === 'salary' ? row.date : row.expense_date)}{row.kind === 'regular' && <small>{row.expense_time}</small>}</td><td>{row.kind === 'salary' ? 'Salary & Wages' : row.category}</td><td><strong>{row.kind === 'salary' ? `${row.employee} · ${row.payrollKind}` : row.name}</strong>{row.kind === 'salary' && <small>{row.month || ''} · {row.payrollKind}</small>}{row.kind === 'regular' && row.remark && <small>{row.remark}</small>}</td><td>{row.kind === 'salary' ? 'Indirect Expense' : `${row.expense_nature || 'Direct'} Expense`}</td><td>{row.kind === 'salary' ? 'Staff & Payroll' : row.paid_by}</td><td>{row.kind === 'salary' ? row.mode : row.payment_type}</td><td className="rs-expenses-amount">{money(row.amount)}</td><td>{row.kind === 'salary' ? <button type="button" className="rs-expenses-edit" onClick={() => setDetailId(detailId === row.key ? null : row.key)}>{detailId === row.key ? 'Hide' : 'Details'}</button> : <><button type="button" className="rs-expenses-edit" onClick={() => edit(row)}>Edit</button><button type="button" className="rs-expenses-delete" onClick={() => remove(row)}>Delete</button><button type="button" className="rs-expenses-edit" onClick={() => setDetailId(detailId === row.key ? null : row.key)}>Details</button></>}</td></tr>{detailId === row.key && <tr><td colSpan="8"><div className="rs-expenses-payroll-detail"><strong>{row.kind === 'salary' ? `${row.employee} · ${row.payrollKind}` : row.name}</strong><span>Date: {displayDate(row.kind === 'salary' ? row.date : row.expense_date)}</span><span>Amount: {money(row.amount)}</span><span>Payment: {row.kind === 'salary' ? row.mode : row.payment_type}</span><span>{row.kind === 'salary' ? `Salary Month: ${row.month || '—'}` : `Invoice: ${row.invoice_number || '—'}`}</span><span>Remark: {row.remark || '—'}</span>{row.kind === 'regular' && row.invoice_url && <a href={row.invoice_url} target="_blank" rel="noreferrer">View Invoice</a>}<span>Source: {row.kind === 'salary' ? 'Staff & Payroll (linked)' : 'Expense Management'}</span></div></td></tr>}</React.Fragment>)}
          {!loading && !visible.length && <tr><td colSpan="8" className="rs-expenses-empty">No entries found for these filters.</td></tr>}{loading && <tr><td colSpan="8" className="rs-expenses-empty">Loading...</td></tr>}
        </tbody></table></div>
        <div className="rs-expenses-pagination"><span>Showing {combined.length ? (Math.min(page, pages) - 1) * pageSize + 1 : 0}–{Math.min(Math.min(page, pages) * pageSize, combined.length)} of {combined.length}</span><div><button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button><span>Page {Math.min(page, pages)} / {pages}</span><button disabled={page >= pages} onClick={() => setPage(p => p + 1)}>Next</button></div></div>
        <p className="rs-expenses-payroll-note">Payroll payments appear here automatically. Salary advances are cash outflow, not an additional salary expense. Regular expense CSV export is unchanged.</p>
      </section>
    </div>
  );
}
