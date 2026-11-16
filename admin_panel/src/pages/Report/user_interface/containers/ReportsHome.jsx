import React, { useCallback, useEffect, useMemo, useState } from 'react';
import httpClient from '../../../../http/http_client';
import { hasFeature } from '../../../../plans';
import Screen from '../../../../components/erp/Screen';
import '../style/analytics.css';

const MODULES = [
  { id: 'orders', label: 'Orders', feature: 'order', desc: 'Order status, completed and cancelled' },
  { id: 'revenue', label: 'Revenue & Payments', feature: 'order', desc: 'Completed payments by payment mode' },
  { id: 'items', label: 'Items & Menu', feature: 'order', desc: 'Item sales and preparation status' },
  { id: 'expenses', label: 'Expenses', feature: 'expense', desc: 'Regular expenses and linked payroll outflow' },
  { id: 'payroll', label: 'Staff & Payroll', feature: 'staff', desc: 'Monthly salary and advance payments' },
  { id: 'customers', label: 'Customers', feature: 'order', desc: 'Customer order and spending activity' },
  { id: 'reservations', label: 'Reservations', feature: 'reservation', desc: 'Reservation status and bookings' },
];
const COLORS = ['#1e3a8a', '#16a085', '#f59e0b', '#7c3aed', '#e45c67', '#0284c7', '#65a30d', '#b45309'];
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const today = () => iso(new Date());
const firstDay = () => { const d = new Date(); return iso(new Date(d.getFullYear(), d.getMonth(), 1)); };
const currency = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
function Donut({ groups, total }) {
  let offset = 0;
  return <div className="ra-donut-wrap"><svg viewBox="0 0 240 240" role="img" aria-label="Report percentage distribution" className="ra-donut">
    <circle cx="120" cy="120" r="83" stroke="#e8edf5" strokeWidth="32" fill="none" />
    {groups.map((g, i) => { const size = total ? g.count / total * 100 : 0; const start = offset; offset += size; return <circle key={g.name} cx="120" cy="120" r="83" fill="none" stroke={COLORS[i % COLORS.length]} strokeWidth="32" strokeDasharray={`${size * 5.215} ${521.5 - size * 5.215}`} strokeDashoffset={-start * 5.215} transform="rotate(-90 120 120)" />; })}
    <text x="120" y="115" textAnchor="middle" fontSize="13" fill="#64748b">Records</text><text x="120" y="145" textAnchor="middle" fontSize="30" fontWeight="700" fill="#0f172a">{total}</text>
  </svg></div>;
}
export default function ReportsHome() {
  const available = useMemo(() => MODULES.filter(m => hasFeature(m.feature) || (m.feature === 'staff' && hasFeature('admin'))), []);
  const [module, setModule] = useState('all');
  const [start, setStart] = useState(firstDay());
  const [end, setEnd] = useState(today());
  const [draft, setDraft] = useState('');
  const [search, setSearch] = useState('');
  const [masterFilter, setMasterFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [details, setDetails] = useState('');
  const active = available.find(m => m.id === module);
  const load = useCallback(async () => {
    if (end < start) { setError('End date must be after start date.'); return; }
    setLoading(true); setError('');
    try {
      const response = await httpClient.get('/api/v1/reports/analytics/', { params: { module, start, end, search, page, source: module === 'all' ? masterFilter : undefined } });
      setData(response.data);
    } catch (e) { setError(e.response?.data?.error || e.userMessage || 'Unable to load report.'); setData(null); }
    finally { setLoading(false); }
  }, [module, start, end, search, page, masterFilter]);
  useEffect(() => { load(); }, [load]);
  // Live search: wait briefly while typing, then refresh chart and all report records.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(draft.trim());
      setPage(1);
      setDetails('');
    }, 300);
    return () => clearTimeout(timer);
  }, [draft]);
  const choose = (value) => { setModule(value); setMasterFilter('all'); setPage(1); setDetails(''); };
  const quick = (key) => { const d = new Date(); const a = new Date(d); if (key === 'today') { } else if (key === 'week') a.setDate(d.getDate() - 6); else if (key === 'month') a.setDate(1); else if (key === 'year') a.setMonth(0, 1); setStart(iso(a)); setEnd(iso(d)); setPage(1); setDetails(''); };
  const exportCSV = async () => {
    if (!data) return;
    // Export every filtered page, rather than only the visible 50 records.
    const headers = ['Date', 'Module', 'Name', 'Category', 'Amount', 'Reference', 'Details'];
    const all = []; let current = 1;
    try {
      while (current <= data.pages) {
        const result = await httpClient.get('/api/v1/reports/analytics/', { params: { module, start, end, search, source: module === 'all' ? masterFilter : undefined, page: current } });
        if (!result.data.rows?.length) break; all.push(...result.data.rows); current += 1;
      }
      const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
      const csv = [headers, ...all.map(r => [r.date, r.module, r.name, r.category, r.amount, r.reference, r.detail])].map(r => r.map(escape).join(',')).join('\r\n');
      const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' }));
      const a = document.createElement('a'); a.href = url; a.download = `RestroScans_${module}_${start}_${end}.csv`; a.click(); URL.revokeObjectURL(url);
    } catch (e) { setError('CSV export failed. Please retry.'); }
  };
  const groups = (data?.breakdown || []).filter(g => module !== 'all' || available.some(m => m.id === g.name));
  const visibleTotal = groups.reduce((sum, g) => sum + g.count, 0);
  return <Screen title="Reports & Analytics" kicker="Restaurant Reports"><div className="ra-page">
    <div className="ra-switch"><button className={module === 'all' ? 'ra-active' : ''} onClick={() => choose('all')}>Master Report</button><button className={module !== 'all' ? 'ra-active' : ''} onClick={() => choose(available[0]?.id || 'all')}>Module Reports</button></div>
    {module !== 'all' && <div className="ra-modules">{available.map(m => <button key={m.id} className={module === m.id ? 'ra-module ra-selected' : 'ra-module'} onClick={() => choose(m.id)}><strong>{m.label}</strong><small>{m.desc}</small></button>)}</div>}
    <section className="ra-card"><div className="ra-heading"><div><h2>{active ? `${active.label} Report` : 'Master Report'}</h2><p>{active ? active.desc : 'Search across all available restaurant modules. Percentages represent record counts, not combined money.'}</p></div><button className="ra-primary" disabled={!data || loading} onClick={exportCSV}>Export CSV</button></div>
      <div className="ra-quick">{[['today', 'Today'], ['week', 'Last 7 Days'], ['month', 'This Month'], ['year', 'This Year']].map(([k, v]) => <button key={k} onClick={() => quick(k)}>{v}</button>)}</div>
      <div className="ra-filters">{module === 'all' && <label className="ra-source">Search In<select value={masterFilter} onChange={e => { setMasterFilter(e.target.value); setPage(1); setDetails(''); }}><option value="all">All Modules</option>{available.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}</select></label>}<label>From Date<input type="date" value={start} onChange={e => { setStart(e.target.value); setPage(1); }} /></label><label>To Date<input type="date" value={end} onChange={e => { setEnd(e.target.value); setPage(1); }} /></label><label className="ra-search">Search (automatic)<input type="search" value={draft} placeholder="Start typing: AM, order ID, item, expense..." onChange={e => setDraft(e.target.value)} aria-label="Live search report records" /></label><button className="ra-clear" onClick={() => { setDraft(''); setSearch(''); setPage(1); setDetails(''); }}>Clear</button></div>
      {error && <div className="ra-error" role="alert">{error}</div>}{loading && <p>Loading report...</p>}
      {data && !loading && <><div className="ra-visual"><Donut groups={groups} total={visibleTotal} /><div className="ra-legend"><h3>Percentage Breakdown</h3>{groups.length ? groups.map((g, i) => <div className="ra-legend-row" key={g.name}><span className="ra-color" style={{ background: COLORS[i % COLORS.length] }} /><span className="ra-legend-name">{available.find(m => m.id === g.name)?.label || g.name}</span><strong>{visibleTotal ? (g.count * 100 / visibleTotal).toFixed(1) : 0}%</strong><span className="ra-count">{g.count} records</span>{module !== 'all' && <span className="ra-count">{currency(g.amount)}</span>}</div>) : <p>No records for this period.</p>}<p className="ra-note">Percentages are based on record counts. Amounts are shown separately; different module amounts are not summed together.</p></div></div>
        <div className="ra-table-title"><h3>Detailed Records ({data.total})</h3><span>Showing {data.total ? ((data.page - 1) * 5 + 1) : 0}–{Math.min(data.page * 5, data.total)} of {data.total}</span></div><div className="ra-table-scroll"><table className="ra-table"><thead><tr><th>Date</th><th>Module</th><th>Name / Reference</th><th>Category</th><th>Amount</th><th>Action</th></tr></thead><tbody>{data.rows.length ? data.rows.filter(r => module !== 'all' || available.some(m => m.id === r.module)).map((r, i) => <React.Fragment key={`${r.module}-${r.reference}-${i}`}><tr><td>{r.date}</td><td>{available.find(m => m.id === r.module)?.label || r.module}</td><td>{r.name}<small>{r.reference}</small></td><td>{r.category}</td><td>{['orders', 'revenue', 'items', 'expenses', 'payroll', 'customers'].includes(r.module) ? currency(r.amount) : '—'}</td><td><button className="ra-detail" onClick={() => setDetails(details === `${page}-${i}` ? '' : `${page}-${i}`)}>{details === `${page}-${i}` ? 'Hide' : 'Details'}</button></td></tr>{details === `${page}-${i}` && <tr><td colSpan="6" className="ra-expanded">{r.detail || 'No additional details.'}</td></tr>}</React.Fragment>) : <tr><td colSpan="6">No records found.</td></tr>}</tbody></table></div><div className="ra-pages"><span className="ra-page-caption">5 records per page</span><button disabled={page <= 1} onClick={() => { setPage(p => p - 1); setDetails(''); }}>Previous</button>{Array.from({ length: data.pages }, (_, i) => i + 1).filter(n => n === 1 || n === data.pages || Math.abs(n - page) <= 2).reduce((a, n) => { if (a.length && n - a[a.length - 1] > 1) a.push('gap-' + n); a.push(n); return a; }, []).map(n => typeof n === 'string' ? <span key={n} className="ra-page-ellipsis">…</span> : <button key={n} className={page === n ? 'ra-page-current' : ''} aria-label={`Page ${n}`} aria-current={page === n ? 'page' : undefined} onClick={() => { setPage(n); setDetails(''); }}>{n}</button>)}<button disabled={page >= data.pages} onClick={() => { setPage(p => p + 1); setDetails(''); }}>Next</button></div></>}
    </section>
  </div></Screen>;
}
