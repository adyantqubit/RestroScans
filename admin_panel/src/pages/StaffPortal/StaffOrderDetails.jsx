import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import siteConfig from '../../config/config';
import './StaffOrderDetails.css';

export default function StaffOrderDetails({ session, orderId, onBack, canManageKitchen = false, canEditOrders = true }) {
  const [details, setDetails] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [search, setSearch] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [payment, setPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentQr, setPaymentQr] = useState(null);
  const [availabilitySearch, setAvailabilitySearch] = useState('');
  const request = useCallback(async (method, data, params) => (await axios({ method, baseURL: siteConfig.staticBaseURL, url: '/api/v1/workforce/staff-order-actions/', data, params, headers: { Authorization: `Bearer ${session.token}`, 'X-Tenant': session.tenant } })).data, [session]);
  const load = useCallback(async () => { const response = await request('get', null, { order_id: orderId }); setDetails(response); }, [request, orderId]);
  useEffect(() => { load().catch(e => setError(e.response?.data?.error || 'Unable to load order')); request('get', null, { catalog: 1 }).then(r => setCatalog(r.items || [])).catch(() => { }); }, [load, request]);
  async function change(action, payload) {
    setBusy(true); setError('');
    try { setDetails(await request('post', { action, order_id: orderId, ...payload })); }
    catch (e) { setError(e.response?.data?.error || 'Unable to update order'); }
    finally { setBusy(false); }
  }
  async function availability(item, available) {
    setBusy(true); setError('');
    try { await request('post', { action: 'availability', item_id: item.id, available }); setCatalog(rows => rows.map(x => x.id === item.id ? { ...x, kitchen_available: available } : x)); window.dispatchEvent(new Event('restro-availability-updated')); }
    catch (e) { setError(e.response?.data?.error || 'Kitchen permission required'); }
    finally { setBusy(false); }
  }
  const paymentRequest = useCallback(async (method, endpoint, data) => (
    await axios({
      method,
      baseURL: siteConfig.staticBaseURL,
      url: `/api/v1/${endpoint}/`,
      params: method === 'get' ? { order_id: details?.order?.order_id } : undefined,
      data: method === 'post' ? { order_id: details?.order?.order_id, ...data } : undefined,
      headers: { Authorization: `Bearer ${session.token}`, 'X-Tenant': session.tenant }
    })
  ).data, [session, details?.order?.order_id]);
  const refreshPayment = useCallback(async () => {
    if (!details?.order?.order_id) return;
    try {
      const result = await paymentRequest('get', 'customer-manual-payment');
      setPayment(result);
      if (result.method) setPaymentMethod(result.method);
      if (result.verification_state === 'verified') setPaymentQr(null);
      setPaymentError('');
    } catch (e) {
      setPaymentError(e.response?.data?.message || e.response?.data?.error || 'Unable to load payment');
    }
  }, [details?.order?.order_id, paymentRequest]);
  useEffect(() => {
    if (!details?.order?.order_id) return undefined;
    refreshPayment();
    const timer = window.setInterval(refreshPayment, 5000);
    return () => window.clearInterval(timer);
  }, [details?.order?.order_id, refreshPayment]);
  async function submitPayment() {
    if (paymentBusy || !payment || payment.verification_state === 'awaiting_verification') return;
    setPaymentBusy(true);
    setPaymentError('');
    try {
      await paymentRequest('post', 'customer-manual-payment', { method: paymentMethod, action: 'select' });
      if (paymentMethod === 'UPI') {
        const qr = await paymentRequest('get', 'customer-amount-qr');
        setPaymentQr(qr);
      } else {
        setPaymentQr(null);
      }
      await refreshPayment();
    } catch (e) {
      setPaymentError(e.response?.data?.message || e.response?.data?.error || 'Unable to start payment');
    } finally {
      setPaymentBusy(false);
    }
  }
  async function claimPayment() {
    if (paymentBusy || !window.confirm('Confirm the customer has handed over cash or completed the UPI transfer? This submits a claim for restaurant verification.')) return;
    setPaymentBusy(true);
    setPaymentError('');
    try {
      await paymentRequest('post', 'customer-manual-payment', { method: paymentMethod, action: 'claim' });
      await refreshPayment();
    } catch (e) {
      setPaymentError(e.response?.data?.message || e.response?.data?.error || 'Unable to submit payment claim');
    } finally {
      setPaymentBusy(false);
    }
  }
  const order = details?.order;
  const lines = details?.items || [];
  const money = n => `₹${Number(n || 0).toFixed(2)}`;
  return <section className="sodRoot">
    <button className="sodBack" onClick={onBack}>← Back to Tables</button>
    <div className="sodHead"><div><h2>Order {order?.order_id || ''}</h2><p>{order?.table_number || 'Table'} · {order?.date ? new Date(order.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : ''}</p></div><span>{order?.order_status || 'Loading'}</span></div>
    {error && <div className="sodError" role="alert">{error}</div>}
    <h3>Ordered Items</h3>
    {canManageKitchen && <p className="sodKitchenHint">Kitchen: tap Unavailable beside an ordered item when stock runs out. The item will be blocked in customer and waiter menus.</p>}
    {!lines.length && <p>Loading order items...</p>}
    {lines.map(line => <div className={`sodLine ${line.item_status === 'Cancelled' ? 'sodCancelled' : ''}`} key={line.id}>
      <div><strong>{line.item}</strong><small>{line.serving_size} · {line.item_status} · {money(line.price)}</small></div>
      {canManageKitchen && (() => { const item = catalog.find(x => x.id === line.item_id || x.name === line.item); return item ? <button type="button" className={`sodStockToggle ${!item.kitchen_available ? 'isUnavailable' : ''}`} disabled={busy} onClick={() => availability(item, !item.kitchen_available)}>{item.kitchen_available ? 'Mark Unavailable' : 'Mark Available'}</button> : null; })()}
      {canEditOrders && line.item_status === 'Pending' ? <div className="sodControls"><button disabled={busy || line.quantity <= 1} onClick={() => change('quantity', { line_id: line.id, quantity: line.quantity - 1 })}>−</button><b>{line.quantity}</b><button disabled={busy} onClick={() => change('quantity', { line_id: line.id, quantity: line.quantity + 1 })}>+</button><button className="sodRemove" disabled={busy} onClick={() => window.confirm('Remove this pending item?') && change('remove', { line_id: line.id })}>Remove</button></div> : <span>Qty {line.quantity}</span>}
    </div>)}
    <div className="sodTotal"><strong>Item subtotal</strong><strong>{money(order?.sub_total)}</strong></div>
    {canEditOrders && <button className="sodPrimary" onClick={() => setAdding(v => !v)}>{adding ? 'Close Menu' : '+ Add More Items'}</button>}
    {canManageKitchen && <section className="sodStockPanel"><h3>Kitchen Item Availability</h3><p>Search any restaurant menu item to mark it unavailable or available again.</p><input aria-label="Search menu item availability" placeholder="Search item (e.g. Paneer Tikka)" value={availabilitySearch} onChange={e => setAvailabilitySearch(e.target.value)} /><div className="sodStockList">{catalog.filter(x => x.name.toLowerCase().includes(availabilitySearch.toLowerCase())).map(item => <div className="sodStockRow" key={item.id}><span>{item.name}<small>{item.kitchen_available ? 'Available' : 'Unavailable'}</small></span><button type="button" disabled={busy} className={!item.kitchen_available ? 'isUnavailable' : ''} onClick={() => availability(item, !item.kitchen_available)}>{item.kitchen_available ? 'Mark Unavailable' : 'Mark Available'}</button></div>)}</div></section>}
    {adding && canEditOrders && <div className="sodCatalog"><h3>Restaurant Menu</h3><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search menu items" />
      <div className="sodCatalogGrid">{catalog.filter(i => i.name.toLowerCase().includes(search.toLowerCase())).map(item => <div className="sodCatalogCard" key={item.id}><strong>{item.name}</strong><small>{item.category__name}</small><span>{money(item.price_full)}</span>{!item.kitchen_available ? <span className="sodUnavailable">Unavailable</span> : <div className="sodCatalogActions"><button disabled={busy} onClick={() => change('add', { item_id: item.id, size: 'Full', quantity: 1 })}>+ Full</button>{item.price_half != null && Number(item.price_half) > 0 && <button disabled={busy} onClick={() => change('add', { item_id: item.id, size: 'Half', quantity: 1 })}>+ Half</button>}</div>}
        {canManageKitchen && <button className="sodKitchen" disabled={busy} onClick={() => availability(item, !item.kitchen_available)}>{item.kitchen_available ? 'Mark Unavailable (Kitchen)' : 'Mark Available (Kitchen)'}</button>}</div>)}</div>
    </div>}
    <div className="sodPayment">
      <h3>Collect Payment</h3>
      {paymentError && <div className="sodError" role="alert">{paymentError}</div>}
      {!payment && !paymentError && <p>Loading payment details...</p>}
      {payment && <>
        <div className="sodInvoice" aria-label="Invoice Details">
          <h3>Invoice Details</h3>
          <div className="sodInvoiceMeta"><span>Order ID</span><strong>{order?.order_id}</strong></div>
          <div className="sodInvoiceMeta"><span>Table</span><strong>{order?.table_number || '—'}</strong></div>
          <div className="sodInvoiceMeta"><span>Date &amp; Time</span><strong>{order?.date ? new Date(order.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}</strong></div>
          <div className="sodInvoiceTableWrap"><table className="sodInvoiceTable"><thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead><tbody>
            {lines.filter(line => line.item_status !== 'Cancelled').map(line => <tr key={line.id}><td>{line.item} ({line.serving_size})</td><td>{line.quantity}</td><td>{money(line.price)}</td></tr>)}
          </tbody></table></div>
          <div className="sodInvoiceBreakdown">
            <div><span>Sub-Total</span><span>{money(payment.subtotal)}</span></div>
            {Number(order?.discount_rupees || 0) > 0 && <div><span>Discount</span><span>− {money(order.discount_rupees)}</span></div>}
            {Number(payment.loyalty_discount || 0) > 0 && <div><span>Loyalty Discount {payment.loyalty_used ? `(${payment.loyalty_used} points)` : ''}</span><span>− {money(payment.loyalty_discount)}</span></div>}
            <div><span>Taxable Amount</span><span>{money(payment.taxable_amount)}</span></div>
            <div><span>CGST ({Number(payment.cgst_rate || 0)}%)</span><span>{money(payment.cgst)}</span></div>
            <div><span>SGST ({Number(payment.sgst_rate || 0)}%)</span><span>{money(payment.sgst)}</span></div>
            <div className="sodInvoiceGrand"><strong>Final Amount to Pay</strong><strong>{money(payment.amount)}</strong></div>
          </div>
        </div>
        {payment.verification_state === 'verified' || ['Paid', 'Completed'].includes(payment.payment_status) ? (
          <div className="sodPaid" role="status">Payment verified and completed.</div>
        ) : payment.verification_state === 'awaiting_verification' ? (
          <div className="sodPending" role="status">Payment claim submitted ({payment.method}). Waiting for restaurant verification. This order is not paid yet.</div>
        ) : payment.order_status !== 'Served' ? (
          <p>Payment can be collected once the order is marked Served.</p>
        ) : <>
          <div className="sodPaymentMethods" role="group" aria-label="Payment method">
            <button type="button" className={paymentMethod === 'Cash' ? 'selected' : ''} onClick={() => { setPaymentMethod('Cash'); setPaymentQr(null); }}>Cash</button>
            <button type="button" className={paymentMethod === 'UPI' ? 'selected' : ''} disabled={!payment.upi_available} onClick={() => { setPaymentMethod('UPI'); setPaymentQr(null); }}>UPI</button>
          </div>
          {!payment.upi_available && <small>UPI is not configured for this restaurant.</small>}
          {payment.verification_state === 'rejected' && <div className="sodError">Previous payment claim was rejected. Please retry.</div>}
          {paymentMethod === 'UPI' && paymentQr && <div className="sodQr">
            <img src={paymentQr.qr_image} alt={`UPI QR for order ${paymentQr.order_id}`} />
            <strong>{paymentQr.payee_name}</strong>
            <span>{money(paymentQr.amount)}</span>
          </div>}
          {paymentMethod === 'Cash' ? (
            <button type="button" className="sodPrimary" disabled={paymentBusy} onClick={claimPayment}>Cash Received · Submit for Verification</button>
          ) : !paymentQr ? (
            <button type="button" className="sodPrimary" disabled={paymentBusy || !payment.upi_available} onClick={submitPayment}>Generate UPI QR</button>
          ) : (
            <button type="button" className="sodPrimary" disabled={paymentBusy} onClick={claimPayment}>Customer Paid · Submit for Verification</button>
          )}
        </>}
        <button type="button" className="sodRefreshPayment" disabled={paymentBusy} onClick={refreshPayment}>Refresh Payment Status</button>
      </>}
    </div>
  </section>;
}
