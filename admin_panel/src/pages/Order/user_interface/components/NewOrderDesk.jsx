import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import siteConfig from '../../../../config/config';
import { explainFailure } from '../../../../http/http_client';
import { useApp } from '../../../../Context/AppContext';
import { loadDiningTables } from '../../../Tables/services/tablesService';
import { loadOrderDesk, submitStaffOrder, filterDeskItems, addDeskLine, changeDeskQuantity, deskEstimate, staffDeskOrder, offerPercentFor, offeredUnit } from '../../services/orderService';
import { emptyCustomer, useNewOrderDesk } from '../../usestate/newOrderDeskState';
import style from '../style/newOrder.module.css';

function tableLocation(table) {
  const floor = String(table.floor_name || 'Ground Floor').trim();
  return `${floor} · ${table.name}`;
}

function money(value) {
  return Number(value || 0).toFixed(2);
}

export default function NewOrderDesk({ onBack, staffSession = null, selectedTable = null, adminMode = false }) {
  const staffRequest = async (method, path, data) => {
    const response = await axios({
      method, baseURL: siteConfig.staticBaseURL, url: `/api/v1/${path}`,
      headers: { Authorization: `Bearer ${staffSession.token}`, 'X-Tenant': staffSession.tenant }, data
    });
    return response.data;
  };
  const { Message } = useApp();
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const desk = useNewOrderDesk();
  const { customTable, setCustomTable } = desk;

  useEffect(() => {
    (staffSession ? Promise.all([
      staffRequest('get', 'all-menus/'),
      staffRequest('get', 'setting-changes/color/'),
      staffRequest('get', 'offer-details/')
    ]).then(([catalog, settings, offers]) => ({
      items: (catalog.itemListbyId || []).map(item => {
        const percent = offerPercentFor(offers?.offerItemList || [], item.id);
        return { ...item, offer_percent: percent, sale_full: offeredUnit(item.price_full, percent), sale_half: offeredUnit(item.price_half, percent) };
      }),
      categories: catalog.categoryList || [],
      allowHalf: Boolean(settings?.setting?.allow_half_price),
      restaurant: settings?.restaurant || {}
    })) : loadOrderDesk()).then((data) => {
      desk.setItems(data.items.filter((item) => item.is_active !== false));
      desk.setCategories((data.categories || []).filter((category) => category.is_active));
      desk.setAllowHalf(data.allowHalf);
      desk.setRestaurant(data.restaurant);
    }).catch(() => desk.setError('Menu could not be loaded.'));

    if (selectedTable) {
      desk.setTables([selectedTable]);
      desk.setCustomer(current => ({ ...current, table: selectedTable.name }));
    } else if (!staffSession) {
      loadDiningTables().then(data => desk.setTables((data.tables || []).filter(table => table.is_active))).catch(() => desk.setTables([]));
    }
  }, []);

  const visibleItems = useMemo(() => {
    return filterDeskItems(desk.items, desk.categoryId, desk.query);
  }, [desk.items, desk.categoryId, desk.query]);

  function addItem(item, size) {
    if (item.kitchen_available === false) { desk.setError(`${item.name} is currently unavailable.`); return; }
    const result = addDeskLine(desk.cart, item, size);
    if (result.error) {
      desk.setError(result.error);
      return;
    }
    desk.setError('');
    desk.setCart(result.cart);
  }

  function changeQty(index, delta) {
    desk.setCart(changeDeskQuantity(desk.cart, index, delta));
  }

  const estimate = deskEstimate(desk.cart);

  async function placeOrder() {
    const draft = staffDeskOrder(desk.customer, desk.cart,
      staffSession ? { contact_number: staffSession.phone || desk.restaurant?.contact_number || '0000000000' } : desk.restaurant);
    if (draft.error) {
      desk.setError(draft.error);
      return;
    }
    desk.setBusy(true);
    desk.setError('');
    try {
      const response = await (staffSession ? staffRequest('post', 'workforce/staff-tables/', {
        action: 'order', table_id: selectedTable.id, cart: draft.cart,
        contact_number: desk.customer.contact || '', name: draft.name, email: draft.email
      }) : submitStaffOrder({
        cart: draft.cart,
        contact_number: draft.phone,
        email: draft.email,
        name: draft.name,
        table_number: draft.table,
        payment_mode: 'Cash',
      }));
      if (response && response.tabel_error) {
        desk.setError('This table already has an open order.');
        return;
      }
      if (!response || response.msg !== 'Saved Successfully') {
        desk.setError(explainFailure(response, 'The order was not created. Check the table, phone, and items, then try again.'));
        return;
      }
      Message('Order created', 'success');
      desk.setCart([]);
      desk.setCustomer(emptyCustomer);
      onBack();
    } catch (err) {
      desk.setError(err.userMessage || 'The order was not created.');
    } finally {
      desk.setBusy(false);
    }
  }

  return (
    <div className={`${style.desk} ${staffSession ? style.waiterDesk : ''} ${mobileCartOpen ? style.mobileCartOpen : ''}`}>
      <section className={style.menuPane}>
        <div className={style.toolbar}>
          <div>
            <h1 className={style.heading}>{staffSession ? `${adminMode ? 'Admin Order' : 'Take Order'} · ${selectedTable?.floor_name || 'Table'} · ${selectedTable?.name || ''}` : 'New order'}</h1>
            <p className={style.hint}>{staffSession ? 'Select menu items and add them to the customer order.' : 'Pick items, then enter the table and customer on the ticket.'}</p>
          </div>
          {!staffSession && <button className={style.back} type="button" onClick={onBack}>Back to orders</button>}
        </div>
        <input
          className={style.search}
          value={desk.query}
          placeholder="Search items"
          onChange={(event) => desk.setQuery(event.target.value)}
        />
        <div className={style.chips}>
          <button
            type="button"
            className={desk.categoryId === 'all' ? style.chipOn : style.chip}
            onClick={() => desk.setCategoryId('all')}
          >
            All
          </button>
          {desk.categories.map((category) => (
            <button
              type="button"
              key={category.id}
              className={String(desk.categoryId) === String(category.id) ? style.chipOn : style.chip}
              onClick={() => desk.setCategoryId(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div className={style.grid} aria-label="Menu items">
          {visibleItems.map((item) => (
            <div className={style.card} key={item.id}>
              <div className={style.itemName}>{item.name}</div>{item.kitchen_available === false && <strong style={{ color: '#b91c1c', fontSize: 12 }}>Unavailable</strong>}
              <div className={style.meta}>{item.category_name} · {item.item_type}{item.offer_percent ? ` · ${item.offer_percent}% offer` : ''}</div>
              <div className={style.price}>₹{money(item.offer_percent ? item.sale_full : item.price_full)}</div>
              <div className={style.sizes}>
                <button type="button" disabled={item.kitchen_available === false} onClick={() => addItem(item, 'Full')}>{desk.allowHalf ? 'Add Full' : '+ Add'}</button>
                {desk.allowHalf ? <button type="button" disabled={item.kitchen_available === false} onClick={() => addItem(item, 'Half')}>Add Half</button> : null}
              </div>
            </div>
          ))}
        </div>
      </section>
      {staffSession && <button type="button" className={style.mobileCartButton} onClick={() => setMobileCartOpen(true)}>
        <span>🛒 {desk.cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0)} items · View Order</span><strong>₹{money(estimate)} →</strong>
      </button>}
      <aside className={style.ticket}>
        <div className={style.ticketHeader}><h2 className={style.heading}>Your Order {desk.cart.length ? `(${desk.cart.length})` : ''}</h2>{staffSession && <button type="button" className={style.mobileCartClose} onClick={() => setMobileCartOpen(false)}>← Menu</button>}</div>
        <div className={style.lines}>
          {desk.cart.length === 0 ? <div className={style.empty}>No items yet.</div> : desk.cart.map((line, index) => (
            <div className={style.line} key={`${line.id}-${line.serve_size}`}>
              <div>
                <div className={style.lineName}>{line.name}</div>
                <div className={style.lineMeta}>{line.serve_size} · ₹{money(line.unit * line.quantity)}{line.offer_percent ? ` · ${line.offer_percent}% offer` : ''}</div>
                <button className={style.remove} type="button" onClick={() => changeQty(index, -line.quantity)}>Remove</button>
              </div>
              <div className={style.stepper}>
                <button type="button" onClick={() => changeQty(index, -1)}>-</button>
                <span>{line.quantity}</span>
                <button type="button" onClick={() => changeQty(index, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
        <div className={style.field}>
          <label className="req" htmlFor="order-table">Table</label>
          {desk.tables.length > 0 ? (
            <select
              id="order-table"
              disabled={Boolean(staffSession && selectedTable)}
              value={customTable ? '__custom' : desk.customer.table}
              onChange={(event) => {
                const value = event.target.value;
                if (value === '__custom') {
                  setCustomTable(true);
                  desk.setCustomer({ ...desk.customer, table: '' });
                  return;
                }
                setCustomTable(false);
                desk.setCustomer({ ...desk.customer, table: value });
              }}
            >
              <option value="">Select a table</option>
              {desk.tables.map((table) => (
                <option key={table.id} value={staffSession ? table.name : tableLocation(table)}>{tableLocation(table)} · {table.seats} seats</option>
              ))}
              {!staffSession && <option value="__custom">Other table</option>}
            </select>
          ) : null}
          {desk.tables.length === 0 || customTable ? (
            <input
              id={desk.tables.length ? 'order-table-custom' : 'order-table'}
              value={desk.customer.table}
              placeholder={desk.tables.length ? 'Type a table name' : 'Table number'}
              onChange={(event) => desk.setCustomer({ ...desk.customer, table: event.target.value })}
            />
          ) : null}
        </div>
        {staffSession ? (
          <details className={style.customerDetails}>
            <summary>Customer details <span>(optional)</span></summary>
            <div className={style.field}>
              <label className="opt" htmlFor="order-name">Customer name</label>
              <input id="order-name" value={desk.customer.name} onChange={(event) => desk.setCustomer({ ...desk.customer, name: event.target.value })} />
            </div>
            <div className={style.field}>
              <label className="opt" htmlFor="order-phone">Phone</label>
              <input
                id="order-phone"
                inputMode="numeric"
                value={desk.customer.contact}
                placeholder="Optional"
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === '' || /^\d+$/.test(value)) {
                    desk.setCustomer({ ...desk.customer, contact: value });
                  }
                }}
              />
            </div>
            <div className={style.field}>
              <label className="opt" htmlFor="order-email">Email</label>
              <input id="order-email" value={desk.customer.email} onChange={(event) => desk.setCustomer({ ...desk.customer, email: event.target.value })} />
            </div>
          </details>
        ) : (
          <>
            <div className={style.field}>
              <label className="opt" htmlFor="order-name">Customer name</label>
              <input id="order-name" value={desk.customer.name} onChange={(event) => desk.setCustomer({ ...desk.customer, name: event.target.value })} />
            </div>
            <div className={style.field}>
              <label className="opt" htmlFor="order-phone">Phone</label>
              <input
                id="order-phone"
                inputMode="numeric"
                value={desk.customer.contact}
                placeholder="Optional"
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === '' || /^\d+$/.test(value)) {
                    desk.setCustomer({ ...desk.customer, contact: value });
                  }
                }}
              />
            </div>
            <div className={style.field}>
              <label className="opt" htmlFor="order-email">Email</label>
              <input id="order-email" value={desk.customer.email} onChange={(event) => desk.setCustomer({ ...desk.customer, email: event.target.value })} />
            </div>
          </>
        )}
        <div className={style.totals}>
          <span>Item total</span>
          <span>₹{money(estimate)}</span>
        </div>
        <div className={style.lineMeta}>Offer prices are included. Tax, bill discount, and loyalty are applied on the saved order.</div>
        {desk.error ? <div className={style.error}>{desk.error}</div> : null}
        <button className={style.place} type="button" disabled={desk.busy} onClick={placeOrder}>
          {desk.busy ? 'Saving…' : 'Place order'}
        </button>
      </aside>
    </div>
  );
}
