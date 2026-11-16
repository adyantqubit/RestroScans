
import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiArrowUpRight,
  FiCalendar,
  FiCreditCard,
  FiDollarSign,
  FiRefreshCw,
  FiShoppingBag,
  FiUsers
} from 'react-icons/fi';
import httpClient from '../../http/http_client';
import './OwnerDashboard.css';

const StaffTableDashboard = lazy(() => import('../StaffPortal/StaffTableDashboard'));

const currency = (value) => '₹' + Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const num = (value) => Number(value || 0).toLocaleString('en-IN');
const dateTime = (value) => value ? new Date(value).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: 'numeric', minute: '2-digit' }) : '—';
const time = (value) => value ? String(value).slice(0, 5) : '—';

function Stat({ title, value, note, icon: Icon, link, tone = 'blue' }) {
  const content = <div className={'od-stat od-' + tone}><div className="od-stat-top"><span>{title}</span><Icon /></div><strong>{value}</strong><small>{note}</small></div>;
  return link ? <Link className="od-stat-link" to={link}>{content}</Link> : <div className="od-stat-link">{content}</div>;
}

function Panel({ title, link, children }) {
  return <section className="od-panel"><div className="od-panel-head"><h3>{title}</h3>{link && <Link to={link}>View all <FiArrowUpRight /></Link>}</div>{children}</section>;
}

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [showFloorOperations, setShowFloorOperations] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await httpClient.get('/api/v1/owner-dashboard/');
      setData(res.data);
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.detail || 'Could not load dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const refresh = () => load();
    window.addEventListener('order-live', refresh);
    return () => window.removeEventListener('order-live', refresh);
  }, [load]);

  const sales = data?.sales;
  const staff = data?.staff;
  const reservations = data?.reservations;
  const expenses = data?.expenses;
  const feature = (code) => Array.isArray(data?.features) && data.features.includes(code);
  const max = Math.max(1, ...(sales?.trend || []).map((x) => Number(x.amount || 0)));

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date((data?.date || new Date().toISOString().slice(0, 10)) + 'T12:00:00');
    d.setDate(d.getDate() - 6 + i);
    const key = [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
    return {
      date: key,
      label: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      amount: sales?.trend?.find((x) => x.date === key)?.amount || 0
    };
  });

  return <div className="od-page">
    <div className="od-heading">
      <div>
        <span className="od-eyebrow">RESTAURANT CONTROL CENTER</span>
        <h1>Owner Dashboard</h1>
        <p>Everything happening at your restaurant, at a glance.</p>
      </div>
      <button className="od-refresh" onClick={load} disabled={loading}>
        <FiRefreshCw /> {loading ? 'Refreshing...' : 'Refresh'}
      </button>
    </div>

    {error && <div className="od-error">{error} <button onClick={load}>Retry</button></div>}
    {!data && loading && <div className="od-loading">Loading restaurant overview...</div>}

    {data && <>
      <div className="od-date">
        Today · {new Date(data.date + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </div>

      <div className="od-stats">
        {sales && <>
          <Stat
            title="Today's Revenue"
            value={currency(sales.revenue)}
            note="Paid orders only"
            icon={FiDollarSign}
            tone="green"
            link="/Revenue"
          />
          <Stat
            title="Total Orders"
            value={num(sales.total_orders)}
            note={num(sales.paid_orders) + ' paid today'}
            icon={FiShoppingBag}
            link="/Order"
          />
        </>}

        {feature('staff') && <>
          <Stat
            title="Staff Present"
            value={num(staff?.present)}
            note={num(staff?.total) + ' active employees'}
            icon={FiUsers}
            tone="teal"
            link="/Workforce"
          />
          <Stat
            title="Leave Requests"
            value={num(staff?.pending_leaves)}
            note={num(staff?.on_approved_leave) + ' on approved leave today'}
            icon={FiCalendar}
            tone="purple"
            link="/Workforce"
          />
        </>}

        {reservations && <Stat
          title="Reservations"
          value={num(reservations.today)}
          note={num(reservations.pending) + ' pending today'}
          icon={FiCalendar}
          link="/ReservationList"
        />}

        {expenses && <Stat
          title="Today's Expenses"
          value={currency(expenses.today)}
          note={num(expenses.entries) + ' entries'}
          icon={FiCreditCard}
          tone="orange"
          link="/Expenses"
        />}
      </div>

      {sales && <div className="od-columns">
        <Panel title="Sales · Last 7 Days" link={feature('report') ? '/Revenue' : null}>
          <div className="od-chart">
            {days.map((d) => <div className="od-bar-group" key={d.date} title={d.date + ': ' + currency(d.amount)}>
              <span className="od-bar-value">{d.amount ? currency(d.amount) : '—'}</span>
              <div className="od-bar-track">
                <div
                  className="od-bar"
                  style={{ height: Math.max(d.amount ? 6 : 0, Number(d.amount) / max * 100) + '%' }}
                />
              </div>
              <small>{d.label}</small>
            </div>)}
          </div>
        </Panel>

        <Panel title="Payment & Service Snapshot · Today">
          <div className="od-facts">
            <div><span>Cash collected</span><strong>{currency(sales.cash)}</strong></div>
            <div><span>Non-cash collected</span><strong>{currency(sales.non_cash)}</strong></div>
            <div><span>Cancelled orders</span><strong>{num(sales.cancelled_orders)}</strong></div>
            <div><span>Active tables configured</span><strong>{num(sales.tables)}</strong></div>
            {expenses && <>
              <div><span>Expenses today</span><strong>{currency(expenses.today)}</strong></div>
              <div><span>Sales minus expenses*</span><strong>{currency(expenses.after_expenses)}</strong></div>
            </>}
          </div>
          {expenses && <p className="od-note">*Not accounting profit; excludes salaries, taxes and other costs.</p>}
        </Panel>
      </div>}

      <div className="od-columns">
        {sales && <Panel title="Latest Orders" link="/Order">
          <div className="od-table-scroll">
            <table className="od-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Table</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {sales.recent_orders?.length ? sales.recent_orders.map((o, i) => <tr key={i}>
                  <td><strong>{o.order_id}</strong><small>{dateTime(o.date)}</small></td>
                  <td>{o.table_number || '—'}</td>
                  <td><span className="od-pill">{o.order_status}</span></td>
                  <td>{o.payment_status}</td>
                  <td>{currency(o.final_amount)}</td>
                </tr>) : <tr><td colSpan="5" className="od-empty">No orders today</td></tr>}
              </tbody>
            </table>
          </div>
        </Panel>}

        {feature('staff') && <Panel title="Today's Staff Activity" link="/Workforce">
          <div className="od-facts od-staff-summary">
            <div><span>Not checked in</span><strong>{num(staff?.not_checked_in)}</strong></div>
            <div><span>Approved leave today</span><strong>{num(staff?.on_approved_leave)}</strong></div>
          </div>
          <div className="od-table-scroll">
            <table className="od-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Check in</th>
                  <th>Check out</th>
                </tr>
              </thead>
              <tbody>
                {staff?.recent_activity?.length ? staff.recent_activity.map((a, i) => <tr key={i}>
                  <td>{a.employee__name}</td>
                  <td>{time(a.check_in)}</td>
                  <td>{time(a.check_out)}</td>
                </tr>) : <tr><td colSpan="3" className="od-empty">No check-ins recorded today</td></tr>}
              </tbody>
            </table>
          </div>
        </Panel>}
      </div>

      <section className="od-panel" style={{ marginTop: 20 }}>
        <button type="button" aria-expanded={showFloorOperations} aria-controls="owner-floor-operations"
          onClick={() => setShowFloorOperations(value => !value)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, width: '100%', padding: '10px 4px', border: 0, background: 'transparent', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>
          <span><strong style={{ display: 'block', fontSize: 19 }}>Floor &amp; Table Operations</strong>
            <small style={{ display: 'block', marginTop: 5, color: '#718096' }}>Select a floor and table to place or manage orders</small></span>
          <strong>{showFloorOperations ? '▲ Collapse' : '▼ Expand'}</strong>
        </button>
        {showFloorOperations && <div id="owner-floor-operations" style={{ marginTop: 16 }}>
          <Suspense fallback={<p>Loading floor and table operations...</p>}>
            <StaffTableDashboard adminMode onOrders={(orderId) => navigate('/Order', { state: { focusedOrderId: orderId } })} />
          </Suspense>
        </div>}
      </section>

      {!sales && <Panel title="Your Restaurant Overview">
        <p className="od-note">
          Order and sales analytics are available with the Delightful plan and above.
          Your Staff & Payroll overview is available above.
        </p>
      </Panel>}
    </>}
  </div>;
}
