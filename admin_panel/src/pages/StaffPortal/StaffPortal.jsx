import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { captureAttendanceLocation } from '../../utils/attendanceLocation';
import { FiClock, FiCalendar, FiCheckCircle, FiClipboard, FiGrid, FiBookOpen, FiBox, FiCreditCard, FiLogOut } from 'react-icons/fi';
import siteConfig from '../../config/config';
import useRestaurantLoginBackground from '../Auth/user_interface/containers/useRestaurantLoginBackground';
import './StaffPortal.css';
import './StaffItemsResponsive.css';
import Header from '../../components/Header/Header';
const AdminOrders = lazy(() => import('../Order/user_interface/containers/Order'));
const AdminItems = lazy(() => import('../Item/user_interface/containers/Item'));
const AdminTables = lazy(() => import('../Tables/user_interface/containers/Tables'));
const StaffTableDashboard = lazy(() => import('./StaffTableDashboard'));


const base = '/api/v1/workforce/';
const client = axios.create({ baseURL: siteConfig.staticBaseURL, timeout: 20000 });
const readSession = () => {
  try { return JSON.parse(sessionStorage.getItem('restroStaffSession') || 'null'); }
  catch { return null; }
};
const getError = e => e?.response?.data?.error || e?.response?.data?.detail || e?.message || 'Request failed';
const isoDate = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const emptyLeave = () => ({ leave_type: 'Paid', start_date: isoDate(), end_date: isoDate(), reason: '' });

export default function StaffPortal() {
  const [session, setSession] = useState(readSession);
  const [login, setLogin] = useState({ tenant: window.location.hostname.split('.')[0] || 'starter', contact_number: '', password: '' });
  const loginBackgroundUrl = useRestaurantLoginBackground(login.tenant);
  const [profile, setProfile] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [leave, setLeave] = useState(emptyLeave);
  const [tab, setTab] = useState('Dashboard');
  const [focusedOrderId, setFocusedOrderId] = useState(null);
  const [operations, setOperations] = useState([]);
  const [mobileNav, setMobileNav] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);
  const [kitchenAlerts, setKitchenAlerts] = useState([]);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const request = useCallback((method, path, data) => {
    const auth = readSession();
    if (!auth) return Promise.reject(new Error('Please log in'));
    return client({ method, url: base + path, data, headers: { Authorization: `Bearer ${auth.token}`, 'X-Tenant': auth.tenant } });
  }, []);
  const reload = useCallback(async () => {
    const [p, l] = await Promise.all([request('get', 'staff-profile/'), request('get', 'leaves/')]);
    setProfile(p.data);
    setLeaves(l.data.results || []);
  }, [request]);
  useEffect(() => {
    if (!session) return;
    reload().catch(e => setError(getError(e)));
  }, [session, reload]);
  useEffect(() => {
    if (!session || !profile || ['Dashboard', 'Attendance', 'My Leaves', 'Approvals', 'orders', 'items'].includes(tab)) return;
    if (!profile.employee?.permissions?.includes(tab === 'history' ? 'order_history' : tab)) { setOperations([]); return; }
    setOperations([]);
    request('get', `staff-operations/?section=${encodeURIComponent(tab)}`).then(r => setOperations(r.data.results || [])).catch(e => setError(getError(e)));
  }, [tab, profile, request, session]);
  useEffect(() => {
    if (!session) return undefined;
    let active = true;
    const check = async () => {
      try {
        const result = await client.get('/api/v1/workforce/staff-tables/', { headers: { Authorization: `Bearer ${session.token}`, 'X-Tenant': session.tenant } });
        if (active) setKitchenAlerts(result.data.unavailable_items || []);
      } catch (_) { /* Retain last known availability during connection errors. */ }
    };
    check();
    const timer = window.setInterval(check, 10000);
    window.addEventListener('restro-availability-updated', check);
    return () => { active = false; window.clearInterval(timer); window.removeEventListener('restro-availability-updated', check); };
  }, [session]);
  const doAction = async (fn, msg) => {
    setBusy(true); setError(''); setSuccess('');
    try { await fn(); setSuccess(msg); await reload(); }
    catch (e) { setError(getError(e)); }
    finally { setBusy(false); }
  };
  const operate = async (row, action, section = tab, itemId = null) => {
    if (!window.confirm(`Proceed with ${action.replace(/_/g, ' ')} for order ${row.order_id}?`)) return;
    setBusy(true); setError(''); setSuccess('');
    try {
      await request('post', 'staff-operations/', { section, action, order_id: row.id, ...(itemId ? { item_id: itemId } : {}) });
      const response = await request('get', `staff-operations/?section=${encodeURIComponent(tab)}`);
      setOperations(response.data.results || []);
      setSuccess('Order updated successfully');
    } catch (e) { setError(getError(e)); }
    finally { setBusy(false); }
  };
  const submitLogin = async e => {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const tenant = login.tenant.trim().toLowerCase();
      const response = await client.post('/api/v1/waiter-login/', { tenant, contact_number: login.contact_number.trim(), password: login.password }, { headers: { 'X-Tenant': tenant } });
      if (!response.data?.token) throw new Error(response.data?.error || 'Invalid mobile number or password');
      const next = { token: response.data.token, tenant };
      sessionStorage.setItem('restroStaffSession', JSON.stringify(next));
      setSession(next); setLogin(v => ({ ...v, password: '' }));
      window.history.replaceState(null, '', '/admin/StaffPortal');
    } catch (e) { setError(getError(e)); }
    finally { setBusy(false); }
  };
  const logout = () => { sessionStorage.removeItem('restroStaffSession'); setSession(null); setProfile(null); setError(''); window.history.replaceState(null, '', '/admin/StaffLogin'); };
  if (!session) return <main className="spRoot spLogin" style={loginBackgroundUrl ? { backgroundImage: `linear-gradient(105deg, rgba(7,23,35,.65), rgba(9,48,54,.35)), url(${JSON.stringify(loginBackgroundUrl)})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" } : undefined}><form className="spPanel spLoginCard" onSubmit={submitLogin}>
    <span className="spEyebrow">RESTROSCANS · STAFF ACCESS</span><h1>Staff Login</h1><p>Employee, Supervisor & Assistant Manager</p>
    {error && <div className="spError">{error}</div>}
    <label>Restaurant Tenant<input required value={login.tenant} onChange={e => setLogin({ ...login, tenant: e.target.value })} /></label>
    <label>Mobile Number<input required inputMode="numeric" value={login.contact_number} onChange={e => setLogin({ ...login, contact_number: e.target.value })} /></label>
    <label>Password<input required type="password" value={login.password} onChange={e => setLogin({ ...login, password: e.target.value })} /></label>
    <button disabled={busy}>{busy ? 'Signing in...' : 'Login to Staff Dashboard'}</button>
    <a href="/admin/Login">Restaurant Admin Login</a>
  </form></main>;
  const employee = profile?.employee;
  const allowed = employee?.permissions || [];
  // Extra operational permissions remain effective in Orders, but never create sidebar entries.
  const menu = [['Dashboard', 'Dashboard'], ['Attendance', 'Attendance'], ['My Leaves', 'My Leaves'], ['orders', 'Orders'], ...(allowed.includes('items') ? [['items', 'Items']] : [])];
  const canApprove = Boolean(employee?.can_approve);
  const attendance = profile?.attendance || {};
  const navGroups = [
    { title: 'MY WORK', items: menu.filter(([key]) => ['Dashboard', 'Attendance', 'My Leaves'].includes(key)) },
    { title: 'OPERATIONS', items: menu.filter(([key]) => ['orders', 'items'].includes(key)) },
    { title: 'STAFF', items: menu.filter(([key]) => key === 'Approvals') }
  ].filter(group => group.items.length);
  const staffItems = menu.map(([key, label]) => ({ key, label }));
  const restaurantName = profile?.restaurant_name || (session?.tenant ? `${session.tenant.charAt(0).toUpperCase()}${session.tenant.slice(1)} Restaurant` : 'Restaurant');
  return <Header staffMode staffRestaurant={restaurantName} staffEmployee={employee} staffItems={staffItems} staffTab={tab}
    onStaffNavigate={(next) => { setTab(next); setError(''); }} onStaffLogout={logout}>
    <div className={['Dashboard', 'Attendance', 'My Leaves', 'Approvals'].includes(tab) ? 'spRoot spSharedContent' : 'spSharedContent'}>
      {kitchenAlerts.filter(x => !dismissedAlerts.includes(x.id)).length > 0 && <div className="spKitchenAlert" role="alert"><strong>Kitchen Stock Alert</strong><span>Unavailable: {kitchenAlerts.filter(x => !dismissedAlerts.includes(x.id)).map(x => x.name).join(', ')}. Please inform customers.</span><button type="button" onClick={() => setDismissedAlerts(kitchenAlerts.map(x => x.id))}>Dismiss</button></div>}
      {error && <div className="spError">{error}</div>}{success && <div className="spSuccess">{success}</div>}
      {!['Dashboard', 'Attendance', 'My Leaves', 'Approvals'].includes(tab) && !(tab === 'orders' ? (allowed.includes('orders') || allowed.includes('kitchen')) : allowed.includes(tab === 'history' ? 'order_history' : tab)) && <section className="spPanel"><h2>Feature unavailable in this plan</h2><p>This permission was assigned by the admin, but the restaurant subscription does not include this feature. Upgrade the plan to enable access.</p></section>}
      {!['Dashboard', 'Attendance', 'My Leaves', 'Approvals'].includes(tab) && (tab === 'orders' ? (allowed.includes('orders') || allowed.includes('kitchen')) : allowed.includes(tab === 'history' ? 'order_history' : tab)) && (
        <div className="spAdminReuse">
          <Suspense fallback={<section className="spPanel">Loading restaurant page...</section>}>
            {tab === 'orders' && <AdminOrders staffMode="orders" focusOrderId={focusedOrderId} onFocusConsumed={() => setFocusedOrderId(null)} />}
            {tab === 'tables' && <AdminTables staffMode />}
            {tab === 'items' && <AdminItems staffMode />}
            {tab === 'kitchen' && <AdminOrders staffMode="kitchen" />}
            {tab === 'billing' && <AdminOrders staffMode="billing" />}
            {tab === 'history' && <AdminOrders staffMode="history" />}
          </Suspense>
        </div>
      )}
      {tab === 'Dashboard' && <Suspense fallback={<section className="spPanel">Loading tables...</section>}><StaffTableDashboard session={session} canManageKitchen={allowed.includes('kitchen') || allowed.includes('orders')} canEditOrders={allowed.includes('orders') || allowed.includes('kitchen')} onOrders={(orderId) => { setFocusedOrderId(orderId || null); setTab('orders'); }} /></Suspense>}
      {tab === 'Attendance' && <section className="spPanel"><h2>Today's Attendance</h2><p>{profile?.today || isoDate()} · Time is recorded by the server</p><div className="spStats"><div><small>Check In</small><strong>{attendance.check_in || 'Not marked'}</strong></div><div><small>Check Out</small><strong>{attendance.check_out || 'Not marked'}</strong></div></div><div className="spActions"><button disabled={busy || !employee || Boolean(attendance.check_in)} onClick={() => doAction(async () => request('post', 'staff-profile/', { action: 'in', ...(await captureAttendanceLocation()) }), 'Checked in successfully')}>Check In</button><button disabled={busy || !employee || !attendance.check_in || Boolean(attendance.check_out)} onClick={() => doAction(async () => request('post', 'staff-profile/', { action: 'out', ...(await captureAttendanceLocation()) }), 'Checked out successfully')}>Check Out</button></div><p className="spHint">Your attendance is recorded automatically using the server time and appears in the main admin attendance list.</p></section>}
      {tab === 'My Leaves' && <section className="spPanel"><h2>Apply for Leave</h2><form onSubmit={e => { e.preventDefault(); doAction(async () => { await request('post', 'leaves/', { ...leave, employee_id: employee.id }); setLeave(emptyLeave()); }, 'Leave request submitted'); }}><div className="spGrid"><label>Leave Type<select value={leave.leave_type} onChange={e => setLeave({ ...leave, leave_type: e.target.value })}><option>Paid</option><option>Casual</option><option>Sick</option><option>Medical</option><option>Unpaid</option></select></label><label>Start Date<input type="date" required value={leave.start_date} onChange={e => setLeave({ ...leave, start_date: e.target.value })} /></label><label>End Date<input type="date" required value={leave.end_date} onChange={e => setLeave({ ...leave, end_date: e.target.value })} /></label><label>Reason<input required value={leave.reason} onChange={e => setLeave({ ...leave, reason: e.target.value })} /></label></div><button disabled={busy || !employee}>Submit Leave Request</button></form><h2>My Leave Requests</h2><div className="spScroll"><table><thead><tr><th>Employee</th><th>Dates</th><th>Type</th><th>Reason</th><th>Status</th></tr></thead><tbody>{leaves.filter(x => x.employee_id === employee?.id).map(x => <tr key={x.id}><td>{x.employee}</td><td>{x.start_date} – {x.end_date}</td><td>{x.leave_type}</td><td>{x.reason}</td><td>{x.status}</td></tr>)}</tbody></table></div></section>}
      {tab === 'Approvals' && canApprove && <><section className="spPanel"><h2>Pending Leave Approvals</h2><div className="spScroll"><table><thead><tr><th>Employee</th><th>Dates</th><th>Type</th><th>Reason</th><th>Decision</th></tr></thead><tbody>{leaves.filter(x => x.status === 'Pending' && x.employee_id !== employee.id).map(x => <tr key={x.id}><td>{x.employee}</td><td>{x.start_date} – {x.end_date}</td><td>{x.leave_type}</td><td>{x.reason}</td><td><div className="spActions"><button disabled={busy} onClick={() => doAction(() => request('post', `leaves/${x.id}/decision/`, { status: 'Approved' }), 'Leave approved')}>Approve</button><button className="spDanger" disabled={busy} onClick={() => doAction(() => request('post', `leaves/${x.id}/decision/`, { status: 'Rejected' }), 'Leave rejected')}>Reject</button></div></td></tr>)}</tbody></table></div></section></>}
    </div>
  </Header>;
}