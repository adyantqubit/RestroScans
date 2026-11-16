import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import siteConfig from '../../config/config';
import NewOrderDesk from '../Order/user_interface/components/NewOrderDesk';
import './StaffTableDashboard.css';

export default function StaffTableDashboard({ session, onOrders, canManageKitchen = false, canEditOrders = true, adminMode = false }) {
  const adminSession = adminMode ? {
    token: localStorage.getItem('token'),
    tenant: localStorage.getItem('tenantName') || (() => {
      try { return JSON.parse(localStorage.getItem('tenantInfo') || '{}').tenant_name || ''; }
      catch (_) { return ''; }
    })(),
  } : null;
  const authSession = adminMode ? adminSession : session;
  const [data, setData] = useState({ floors: [], tables: [] });
  const [selected, setSelected] = useState(null);
  const [ordering, setOrdering] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const call = useCallback(async (method, payload) => {
    const response = await axios({
      method, baseURL: siteConfig.staticBaseURL, url: '/api/v1/workforce/staff-tables/',
      headers: { Authorization: `Bearer ${authSession?.token}`, 'X-Tenant': authSession?.tenant }, data: payload
    });
    return response.data;
  }, [authSession?.token, authSession?.tenant]);
  const reload = useCallback(() => call('get').then(setData).catch(e => setError(e.response?.data?.error || 'Unable to load tables')), [call]);
  useEffect(() => { reload(); const interval = setInterval(reload, 10000); return () => clearInterval(interval) }, [reload]);
  const floorGroups = useMemo(() => {
    const tables = Array.isArray(data.tables) ? data.tables : [];
    const configured = Array.isArray(data.floors) ? data.floors : [];
    const groups = new Map();
    const normalizeName = (name) => {
      const label = String(name || '').trim();
      return !label || /^(direct(?:\s*\/\s*ground)?|ground(?:\s*floor)?)$/i.test(label) ? 'Ground Floor' : label;
    };
    const byId = new Map(configured.map(f => [String(f.id), normalizeName(f.name)]));
    for (const table of tables) {
      const id = table.floor_id == null ? 'ground' : String(table.floor_id);
      const name = id === 'ground' ? 'Ground Floor' : byId.get(id) || normalizeName(table.floor_name);
      if (!groups.has(id)) groups.set(id, { id, name, tables: [] });
      groups.get(id).tables.push(table);
    }
    const rank = name => {
      if (/^ground floor$/i.test(name)) return 0;
      const names = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
      const lower = name.toLowerCase();
      const word = names.findIndex(n => lower.startsWith(n + ' floor'));
      if (word !== -1) return word + 1;
      const numeric = lower.match(/^(\d+)(?:st|nd|rd|th)?\s*floor/);
      return numeric ? Number(numeric[1]) : 1000;
    };
    for (const group of groups.values()) {
      group.tables.sort((a, b) => {
        const aHasOrder = Boolean(a.order);
        const bHasOrder = Boolean(b.order);
        if (aHasOrder !== bHasOrder) return aHasOrder ? -1 : 1;
        if (!aHasOrder) return 0;
        const aTime = Date.parse(a.order?.date || '') || Number.MAX_SAFE_INTEGER;
        const bTime = Date.parse(b.order?.date || '') || Number.MAX_SAFE_INTEGER;
        return aTime - bTime || String(a.order?.order_id || '').localeCompare(String(b.order?.order_id || ''));
      });
    }
    return [...groups.values()].sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name));
  }, [data.floors, data.tables]);
  const count = s => data.tables.filter(t => t.status === s).length;
  async function setStatus(status) {
    setBusy(true); setError('');
    try { await call('post', { action: 'status', table_id: selected.id, status }); setSelected(null); await reload() }
    catch (e) { setError(e.response?.data?.error || 'Unable to update table') }
    finally { setBusy(false) }
  }
  if (ordering && selected) return <section className="stdOrder"><button className="stdBack" onClick={() => setOrdering(false)}>← Back to tables</button><NewOrderDesk staffSession={authSession} adminMode={adminMode} selectedTable={selected} onBack={() => { setOrdering(false); setSelected(null); reload(); if (onOrders) onOrders() }} /></section>;
  return <div className="stdRoot">
    <div className="stdHeading"><div><span>RESTAURANT OPERATIONS</span><h1>{adminMode ? 'Floor & Table Operations' : 'Staff Dashboard'}</h1><p>Select a floor and table to manage seating or take an order.</p></div><button onClick={reload}>Refresh</button></div>
    {error && <p className="stdError">{error}</p>}
    <div className="stdStats"><div><strong>{data.tables.length}</strong><span>Total Tables</span></div><div><strong>{count('available')}</strong><span className="stdStatLabel"><i className="stdDot stdDotGreen" />Available</span></div><div><strong>{count('occupied')}</strong><span className="stdStatLabel"><i className="stdDot stdDotYellow" />Occupied</span></div><div><strong>{count('unavailable')}</strong><span className="stdStatLabel"><i className="stdDot stdDotRed" />Unavailable</span></div></div>
    {data.unavailable_items?.length > 0 && <div className="stdAvailabilityAlert" role="status">Kitchen alert · Unavailable now: {data.unavailable_items.map(x => x.name).join(', ')}</div>}
    <div className="stdFloorGroups">{floorGroups.map(group => <section className="stdFloorSection" key={group.id} aria-label={`${group.name} tables`}>
      <div className="stdFloorHeading"><h2>{group.name}</h2><span>{group.tables.length} {group.tables.length === 1 ? 'Table' : 'Tables'}</span></div>
      <div className="stdGrid">{group.tables.map(t => <button key={t.id} type="button" className={`stdTable ${t.status} ${selected?.id === t.id ? 'selected' : ''}`} onClick={() => setSelected(t)} aria-label={`${group.name}, ${t.name}, ${t.status}`}><span className="stdTableIcon" aria-hidden="true">▣</span><strong>{t.name}</strong><span className="stdTableStatus">{t.status === 'available' ? 'Available' : t.status === 'occupied' ? 'Occupied' : 'Unavailable'}</span>{t.order && <><small className="stdTableOrder">Order: {t.order.order_id}</small><small className="stdTableDate">{t.order.date ? new Date(t.order.date).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) : 'Date unavailable'}</small></>}</button>)}</div>
    </section>)}</div>
    {!floorGroups.length && <p>No tables available. Add them from Admin → Floors & Tables.</p>}
    {selected && <section className="stdActions"><div><h2>{selected.floor_name} · {selected.name}</h2><p>Current status: {selected.status}{selected.order ? ` · ${selected.order.order_id}` : ''}</p></div><div className="stdActionButtons">{canEditOrders && selected.status !== 'unavailable' && !selected.order && <button onClick={() => setOrdering(true)}>+ Take Order</button>}{selected.order && <button onClick={() => onOrders?.(selected.order.id)}>View Orders</button>}{canEditOrders && selected.status === 'available' && <button disabled={busy} onClick={() => setStatus('occupied')}>Mark Occupied</button>}{canEditOrders && selected.status === 'occupied' && !selected.order && <button disabled={busy} onClick={() => setStatus('available')}>Mark Available</button>}{canEditOrders && !selected.order && <button disabled={busy} onClick={() => setStatus(selected.status === 'unavailable' ? 'available' : 'unavailable')}>{selected.status === 'unavailable' ? 'Enable Table' : 'Mark Unavailable'}</button>}<button className="stdLight" onClick={() => setSelected(null)}>Close</button></div></section>}
  </div>;
}
