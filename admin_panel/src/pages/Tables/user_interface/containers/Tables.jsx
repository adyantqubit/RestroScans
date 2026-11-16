// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { QRCode } from 'react-qrcode-logo';
// import { listRestaurantFloors, createRestaurantFloor, deleteRestaurantFloor } from '../../api/tablesApi';
// import siteConfig from '../../../../config/config';
// import { useNavigate } from 'react-router-dom';
// import { useApp } from '../../../../Context/AppContext';
// import { loadDashboard } from '../../../Home/services/homeService';
// import { tableStillSeated } from '../../../Home/services/todayOrderRules';
// import {
//   createDiningTable,
//   deleteDiningTable,
//   loadDiningTablePage,
//   loadDiningTables,
//   updateDiningTable,
// } from '../../services/tablesService';
// import { initialTableForm, useTablesState } from '../../usestate/tablesState';
// import RecordPage from '../../../../components/RecordPage/RecordPage';
// import style from '../style/tables.module.css';

// function TableFloor() {
//   const navigate = useNavigate();
//   const [tables, setTables] = useState([]);
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     loadDiningTables().then((data) => setTables(data?.tables || [])).catch(() => setTables([]));
//     loadDashboard().then((data) => {
//       const open = [
//         data?.todays_newly_placed_orders,
//         data?.todays_pending_orders,
//         data?.todays_served_orders,
//         data?.todays_paid_orders,
//       ].flat().filter(tableStillSeated);
//       setOrders(open);
//     }).catch(() => setOrders([]));
//   }, []);

//   if (!tables.length) return null;

//   function seat(name) {
//     navigate('/Dashboard', { state: { seatTable: name, seatAt: Date.now() } });
//   }

//   return (
//     <div className="table-floor">
//       {tables.filter((table) => table.is_active).map((table) => {
//         const sitting = orders.find((order) => String(order.table_number || '').trim().toLowerCase() === String(table.name || '').trim().toLowerCase());
//         return (
//           <button
//             key={table.id}
//             type="button"
//             className={sitting ? 'table-floor__card table-floor__card--busy' : 'table-floor__card'}
//             onClick={() => seat(table.name)}
//           >
//             <span className="table-floor__name">{table.name}</span>
//             <span className="table-floor__meta">
//               {sitting ? `${sitting.order_id} · ${sitting.order_status}` : `${table.seats} seats · Free`}
//             </span>
//             <span className="desk-action">{sitting ? 'Add order' : 'Seat'}</span>
//           </button>
//         );
//       })}
//     </div>
//   );
// }

// const STATUS_FILTERS = [
//   { value: 'all', label: 'All statuses' },
//   { value: 'true', label: 'Active' },
//   { value: 'false', label: 'Hidden' },
// ];

// export default function Tables({ staffMode = false }) {
//   const staffTableRequest = async (method, payload = {}) => {
//     const auth = JSON.parse(sessionStorage.getItem('restroStaffSession') || 'null');
//     if (!auth?.token || !auth?.tenant) throw new Error('Staff login required');
//     const response = await axios({
//       method, baseURL: siteConfig.staticBaseURL,
//       url: '/api/v1/workforce/staff-operations/',
//       headers: { Authorization: `Bearer ${auth.token}`, 'X-Tenant': auth.tenant },
//       ...(method === 'get' ? { params: { section: 'tables' } } : { data: { section: 'tables', ...payload } })
//     });
//     return response.data;
//   };
//   const { Message } = useApp();
//   const { form, setForm, editingId, setEditingId, error, setError } = useTablesState();
//   const [rows, setRows] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [listPerPage, setListPerPage] = useState(Number(localStorage.getItem('listPerPage')) || 10);
//   const [searchText, setSearchText] = useState('');
//   const [columnToSort, setColumnToSort] = useState('name');
//   const [columnSortingOrder, setColumnSortingOrder] = useState('ascending');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [formOpen, setFormOpen] = useState(false);
//   const [floors, setFloors] = useState([]);
//   const [selectedFloor, setSelectedFloor] = useState('');
//   const [qrRow, setQrRow] = useState(null);
//   const [floorName, setFloorName] = useState('');
//   useEffect(() => {
//     if (!staffMode) listRestaurantFloors().then(data => setFloors(data.floors || [])).catch(() => { });
//   }, [staffMode]);

//   async function loadPage() {
//     if (staffMode) {
//       const data = await staffTableRequest('get');
//       let results = data.results || [];
//       const search = searchText.trim().toLowerCase();
//       if (search) results = results.filter(row => String(row.name).toLowerCase().includes(search));
//       if (statusFilter !== 'all') results = results.filter(row => Boolean(row.is_active) === (statusFilter === 'true'));
//       results.sort((a, b) => {
//         const av = a[columnToSort], bv = b[columnToSort];
//         const diff = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av ?? '').localeCompare(String(bv ?? ''), undefined, { numeric: true });
//         return columnSortingOrder === 'ascending' ? diff : -diff;
//       });
//       setTotal(results.length);
//       setRows(results.slice((currentPage - 1) * listPerPage, currentPage * listPerPage));
//       return;
//     }
//     const data = await loadDiningTablePage({
//       currentPage,
//       listPerPage,
//       searchText,
//       columnToSort,
//       columnSortingOrder,
//       filters: statusFilter === 'all' ? undefined : { is_active: statusFilter === 'true' },
//     });
//     setRows(data.tables || []);
//     setTotal(data.count || 0);
//   }

//   useEffect(() => {
//     loadPage().catch(() => setError('Tables could not be loaded. Run the latest database migration, then refresh.'));
//   }, [currentPage, listPerPage, searchText, columnToSort, columnSortingOrder, statusFilter]);

//   function editRow(row) {
//     setEditingId(row.id);
//     setForm({ name: row.name, seats: row.seats, is_active: row.is_active });
//     setSelectedFloor(row.floor || '');
//     setError('');
//     setFormOpen(true);
//   }

//   function resetForm() {
//     setEditingId(null);
//     setForm(initialTableForm);
//     setSelectedFloor('');
//     setError('');
//   }

//   function sortBy(column) {
//     if (columnToSort === column) {
//       setColumnSortingOrder(columnSortingOrder === 'ascending' ? 'descending' : 'ascending');
//     } else {
//       setColumnToSort(column);
//       setColumnSortingOrder('ascending');
//     }
//   }

//   async function save(event) {
//     event.preventDefault();
//     const name = form.name.trim();
//     if (!name) {
//       setError('Enter a table name, for example T1 or Garden 2.');
//       return;
//     }
//     const payload = {
//       name,
//       seats: Number(form.seats) || 4,
//       is_active: form.is_active,
//       ...(!staffMode ? { floor: selectedFloor || null } : {}),
//     };
//     try {
//       if (editingId) {
//         if (staffMode) await staffTableRequest('post', { action: 'update_table', table_id: editingId, ...payload });
//         else await updateDiningTable(editingId, payload);
//         Message('Table updated', 'success');
//       } else {
//         if (staffMode) await staffTableRequest('post', { action: 'create_table', ...payload });
//         else await createDiningTable(payload);
//         Message('Table added', 'success');
//       }
//       resetForm();
//       setFormOpen(false);
//       await loadPage();
//     } catch (err) {
//       setError(err.userMessage || 'Could not save this table.');
//     }
//   }

//   async function remove(row) {
//     if (!window.confirm(`Remove ${row.name}? Past orders that used this table stay as they are.`)) {
//       return;
//     }
//     if (staffMode) await staffTableRequest('post', { action: 'delete_table', table_id: row.id });
//     else await deleteDiningTable(row.id);
//     if (editingId === row.id) resetForm();
//     await loadPage();
//   }

//   return (
//     <RecordPage
//       title="Tables"
//       formOpen={formOpen}
//       formTitle={editingId ? 'Edit table' : 'New table'}
//       onToggleForm={() => setFormOpen((open) => !open)}
//       onCreate={() => {
//         resetForm();
//         setFormOpen(true);
//       }}
//       createLabel="New table"
//       form={formOpen ? (
//         <form className={style.card} onSubmit={save}>
//           <div className={style.field}>
//             <label className="req" htmlFor="table-name">Table name</label>
//             <input
//               id="table-name"
//               value={form.name}
//               onChange={(event) => setForm({ ...form, name: event.target.value })}
//               placeholder="T1"
//             />
//           </div>
//           {!staffMode && <div className={style.field}>
//             <label htmlFor="table-floor">Floor / Location</label>
//             <select id="table-floor" value={selectedFloor} onChange={e => setSelectedFloor(e.target.value)}>
//               <option value="">Direct (No floor)</option>
//               {floors.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
//             </select>
//           </div>}
//           <div className={style.field}>
//             <label className="opt" htmlFor="table-seats">Seats</label>
//             <input
//               id="table-seats"
//               type="number"
//               min="1"
//               value={form.seats}
//               onChange={(event) => setForm({ ...form, seats: event.target.value })}
//             />
//           </div>
//           <label className={style.check}>
//             <input
//               type="checkbox"
//               checked={form.is_active}
//               onChange={(event) => setForm({ ...form, is_active: event.target.checked })}
//             />
//             Available for new orders
//           </label>
//           {error ? <div className={style.error}>{error}</div> : null}
//           <div className={style.actions}>
//             <button className={style.primary} type="submit">{editingId ? 'Save table' : 'Add table'}</button>
//             <button className={style.ghost} type="button" onClick={() => { resetForm(); setFormOpen(false); }}>Cancel</button>
//           </div>
//         </form>
//       ) : null}
//       searchPlaceholder="Search table name"
//       onSearch={(value) => {
//         setCurrentPage(1);
//         setSearchText(value);
//       }}
//       filterValue={statusFilter}
//       filterOptions={STATUS_FILTERS}
//       onFilter={(value) => {
//         setCurrentPage(1);
//         setStatusFilter(value);
//       }}
//       total={total}
//       currentPage={currentPage}
//       listPerPage={listPerPage}
//       onPageChange={setCurrentPage}
//       setListPerPage={setListPerPage}
//       setCurrentPage={setCurrentPage}
//       hasRows={rows.length > 0}
//     >
//       {!staffMode && <div style={{ padding: 16, marginBottom: 12, border: '1px solid #ddd', borderRadius: 10 }}>
//         <strong>Restaurant Floors</strong>
//         <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
//           <input placeholder="New floor name" value={floorName} onChange={e => setFloorName(e.target.value)} />
//           <button type="button" onClick={async () => { if (!floorName.trim()) return; try { await createRestaurantFloor(floorName.trim()); setFloorName(''); const d = await listRestaurantFloors(); setFloors(d.floors || []); } catch (e) { Message(e.response?.data?.message || 'Could not create floor', 'error'); } }}>Add Floor</button>
//           {floors.map(f => <span key={f.id} style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }}>{f.name} ({f.table_count}) <button type="button" onClick={async () => { if (!window.confirm(`Delete ${f.name}?`)) return; try { await deleteRestaurantFloor(f.id); const d = await listRestaurantFloors(); setFloors(d.floors || []); } catch (e) { Message(e.response?.data?.message || 'Floor contains tables', 'error'); } }}>×</button></span>)}
//         </div>
//       </div>}
//       {!staffMode && qrRow && <div style={{ padding: 20, border: '1px solid #ddd', marginBottom: 15, textAlign: 'center' }}>
//         <h3>{qrRow.location_label}</h3>
//         <div id="table-qr-print"><QRCode value={`${process.env.REACT_APP_CUSTOMER_MENU_URL || 'http://localhost:3000/menu-item'}?table=${qrRow.id}`} size={220} id="table-qr-canvas" /></div>
//         <p>Scan to open the restaurant menu</p>
//         <button type="button" onClick={() => { const canvas = document.querySelector('#table-qr-canvas'); if (!canvas) return; const a = document.createElement('a'); a.download = `table-${qrRow.id}.png`; a.href = canvas.toDataURL('image/png'); a.click(); }}>Download QR</button>{' '}
//         <button type="button" onClick={() => { const canvas = document.querySelector('#table-qr-canvas'); if (!canvas) return; const win = window.open('', '_blank'); if (!win) return; win.document.write(`<html><body style="text-align:center;font-family:sans-serif"><h2>${qrRow.location_label.replace(/[<>&]/g, '')}</h2><img src="${canvas.toDataURL('image/png')}"/><p>Scan for menu</p></body></html>`); win.document.close(); win.focus(); win.print(); }}>Print QR</button>{' '}
//         <button type="button" onClick={() => setQrRow(null)}>Close</button>
//       </div>}
//       {!staffMode && <TableFloor />}
//       <table className={style.table}>
//         <thead>
//           <tr>
//             <th onClick={() => sortBy('name')}>Name</th>
//             <th>Location</th>
//             <th onClick={() => sortBy('seats')}>Seats</th>
//             <th onClick={() => sortBy('is_active')}>Status</th>
//             <th />
//           </tr>
//         </thead>
//         <tbody>
//           {rows.length === 0 ? (
//             <tr>
//               <td colSpan="5">No tables yet. Add the floor tables your staff should pick from.</td>
//             </tr>
//           ) : rows.map((row) => (
//             <tr key={row.id}>
//               <td>{row.name}</td>
//               <td>{row.floor_name || 'Direct'}</td>
//               <td>{row.seats}</td>
//               <td>
//                 <span className={row.is_active ? style.badge : style.badgeOff}>
//                   {row.is_active ? 'Active' : 'Hidden'}
//                 </span>
//               </td>
//               <td>
//                 <div className={style.rowActions}>
//                   {!staffMode && <button className={style.ghost} type="button" onClick={() => setQrRow(row)}>QR / Print</button>}
//                   <button className={style.ghost} type="button" onClick={() => editRow(row)}>Edit</button>
//                   <button className={style.danger} type="button" onClick={() => remove(row)}>Remove</button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </RecordPage>
//   );
// }





















// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { QRCode } from 'react-qrcode-logo';
// import { listRestaurantFloors, createRestaurantFloor, deleteRestaurantFloor } from '../../api/tablesApi';
// import siteConfig from '../../../../config/config';
// import { useNavigate } from 'react-router-dom';
// import { useApp } from '../../../../Context/AppContext';
// import { loadDashboard } from '../../../Home/services/homeService';
// import { tableStillSeated } from '../../../Home/services/todayOrderRules';
// import {
//   createDiningTable,
//   deleteDiningTable,
//   loadDiningTablePage,
//   loadDiningTables,
//   updateDiningTable,
// } from '../../services/tablesService';
// import { initialTableForm, useTablesState } from '../../usestate/tablesState';
// import RecordPage from '../../../../components/RecordPage/RecordPage';
// import style from '../style/tables.module.css';

// function TableFloor() {
//   const navigate = useNavigate();
//   const [tables, setTables] = useState([]);
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     loadDiningTables().then((data) => setTables(data?.tables || [])).catch(() => setTables([]));
//     loadDashboard().then((data) => {
//       const open = [
//         data?.todays_newly_placed_orders,
//         data?.todays_pending_orders,
//         data?.todays_served_orders,
//         data?.todays_paid_orders,
//       ].flat().filter(tableStillSeated);
//       setOrders(open);
//     }).catch(() => setOrders([]));
//   }, []);

//   if (!tables.length) return null;

//   function seat(name) {
//     navigate('/Dashboard', { state: { seatTable: name, seatAt: Date.now() } });
//   }

//   return (
//     <div className="table-floor">
//       {tables.filter((table) => table.is_active).map((table) => {
//         const sitting = orders.find((order) => String(order.table_number || '').trim().toLowerCase() === String(table.name || '').trim().toLowerCase());
//         return (
//           <button
//             key={table.id}
//             type="button"
//             className={sitting ? 'table-floor__card table-floor__card--busy' : 'table-floor__card'}
//             onClick={() => seat(table.name)}
//           >
//             <span className="table-floor__name">{table.name}</span>
//             <span className="table-floor__meta">
//               {sitting ? `${sitting.order_id} · ${sitting.order_status}` : `${table.seats} seats · Free`}
//             </span>
//             <span className="desk-action">{sitting ? 'Add order' : 'Seat'}</span>
//           </button>
//         );
//       })}
//     </div>
//   );
// }

// const STATUS_FILTERS = [
//   { value: 'all', label: 'All statuses' },
//   { value: 'true', label: 'Active' },
//   { value: 'false', label: 'Hidden' },
// ];

// export default function Tables({ staffMode = false }) {
//   const staffTableRequest = async (method, payload = {}) => {
//     const auth = JSON.parse(sessionStorage.getItem('restroStaffSession') || 'null');
//     if (!auth?.token || !auth?.tenant) throw new Error('Staff login required');
//     const response = await axios({
//       method, baseURL: siteConfig.staticBaseURL,
//       url: '/api/v1/workforce/staff-operations/',
//       headers: { Authorization: `Bearer ${auth.token}`, 'X-Tenant': auth.tenant },
//       ...(method === 'get' ? { params: { section: 'tables' } } : { data: { section: 'tables', ...payload } })
//     });
//     return response.data;
//   };
//   const { Message } = useApp();
//   const { form, setForm, editingId, setEditingId, error, setError } = useTablesState();
//   const [rows, setRows] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [listPerPage, setListPerPage] = useState(Number(localStorage.getItem('listPerPage')) || 10);
//   const [searchText, setSearchText] = useState('');
//   const [columnToSort, setColumnToSort] = useState('name');
//   const [columnSortingOrder, setColumnSortingOrder] = useState('ascending');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [formOpen, setFormOpen] = useState(false);
//   const [floors, setFloors] = useState([]);
//   const [selectedFloor, setSelectedFloor] = useState('');
//   const [qrRow, setQrRow] = useState(null);
//   const [floorName, setFloorName] = useState('');
//   useEffect(() => {
//     if (!staffMode) listRestaurantFloors().then(data => setFloors(data.floors || [])).catch(() => { });
//   }, [staffMode]);

//   async function loadPage() {
//     if (staffMode) {
//       const data = await staffTableRequest('get');
//       let results = data.results || [];
//       const search = searchText.trim().toLowerCase();
//       if (search) results = results.filter(row => String(row.name).toLowerCase().includes(search));
//       if (statusFilter !== 'all') results = results.filter(row => Boolean(row.is_active) === (statusFilter === 'true'));
//       results.sort((a, b) => {
//         const av = a[columnToSort], bv = b[columnToSort];
//         const diff = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av ?? '').localeCompare(String(bv ?? ''), undefined, { numeric: true });
//         return columnSortingOrder === 'ascending' ? diff : -diff;
//       });
//       setTotal(results.length);
//       setRows(results.slice((currentPage - 1) * listPerPage, currentPage * listPerPage));
//       return;
//     }
//     const data = await loadDiningTablePage({
//       currentPage,
//       listPerPage,
//       searchText,
//       columnToSort,
//       columnSortingOrder,
//       filters: statusFilter === 'all' ? undefined : { is_active: statusFilter === 'true' },
//     });
//     setRows(data.tables || []);
//     setTotal(data.count || 0);
//   }

//   useEffect(() => {
//     loadPage().catch(() => setError('Tables could not be loaded. Run the latest database migration, then refresh.'));
//   }, [currentPage, listPerPage, searchText, columnToSort, columnSortingOrder, statusFilter]);

//   function editRow(row) {
//     setEditingId(row.id);
//     setForm({ name: row.name, seats: row.seats, is_active: row.is_active });
//     setSelectedFloor(row.floor || '');
//     setError('');
//     setFormOpen(true);
//   }

//   function resetForm() {
//     setEditingId(null);
//     setForm(initialTableForm);
//     setSelectedFloor('');
//     setError('');
//   }

//   function sortBy(column) {
//     if (columnToSort === column) {
//       setColumnSortingOrder(columnSortingOrder === 'ascending' ? 'descending' : 'ascending');
//     } else {
//       setColumnToSort(column);
//       setColumnSortingOrder('ascending');
//     }
//   }

//   async function save(event) {
//     event.preventDefault();
//     const name = form.name.trim();
//     if (!name) {
//       setError('Enter a table name, for example T1 or Garden 2.');
//       return;
//     }
//     const payload = {
//       name,
//       seats: Number(form.seats) || 4,
//       is_active: form.is_active,
//       ...(!staffMode ? { floor: selectedFloor || null } : {}),
//     };
//     try {
//       if (editingId) {
//         if (staffMode) await staffTableRequest('post', { action: 'update_table', table_id: editingId, ...payload });
//         else await updateDiningTable(editingId, payload);
//         Message('Table updated', 'success');
//       } else {
//         if (staffMode) await staffTableRequest('post', { action: 'create_table', ...payload });
//         else await createDiningTable(payload);
//         Message('Table added', 'success');
//       }
//       resetForm();
//       setFormOpen(false);
//       await loadPage();
//     } catch (err) {
//       setError(err.userMessage || 'Could not save this table.');
//     }
//   }

//   async function remove(row) {
//     if (!window.confirm(`Remove ${row.name}? Past orders that used this table stay as they are.`)) {
//       return;
//     }
//     if (staffMode) await staffTableRequest('post', { action: 'delete_table', table_id: row.id });
//     else await deleteDiningTable(row.id);
//     if (editingId === row.id) resetForm();
//     await loadPage();
//   }

//   return (
//     <RecordPage
//       title="Floors & Tables"
//       formOpen={formOpen}
//       formTitle={editingId ? 'Edit table' : 'New table'}
//       onToggleForm={() => setFormOpen((open) => !open)}
//       onCreate={() => {
//         resetForm();
//         setFormOpen(true);
//       }}
//       createLabel="New table"
//       form={formOpen ? (
//         <form className={style.card} onSubmit={save}>
//           <div className={style.field}>
//             <label className="req" htmlFor="table-name">Table name</label>
//             <input
//               id="table-name"
//               value={form.name}
//               onChange={(event) => setForm({ ...form, name: event.target.value })}
//               placeholder="T1"
//             />
//           </div>
//           {!staffMode && <div className={style.field}>
//             <label htmlFor="table-floor">Floor / Location</label>
//             <select id="table-floor" value={selectedFloor} onChange={e => setSelectedFloor(e.target.value)}>
//               <option value="">Direct (No floor)</option>
//               {floors.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
//             </select>
//           </div>}
//           <div className={style.field}>
//             <label className="opt" htmlFor="table-seats">Seats</label>
//             <input
//               id="table-seats"
//               type="number"
//               min="1"
//               value={form.seats}
//               onChange={(event) => setForm({ ...form, seats: event.target.value })}
//             />
//           </div>
//           <label className={style.check}>
//             <input
//               type="checkbox"
//               checked={form.is_active}
//               onChange={(event) => setForm({ ...form, is_active: event.target.checked })}
//             />
//             Available for new orders
//           </label>
//           {error ? <div className={style.error}>{error}</div> : null}
//           <div className={style.actions}>
//             <button className={style.primary} type="submit">{editingId ? 'Save table' : 'Add table'}</button>
//             <button className={style.ghost} type="button" onClick={() => { resetForm(); setFormOpen(false); }}>Cancel</button>
//           </div>
//         </form>
//       ) : null}
//       searchPlaceholder="Search table name"
//       onSearch={(value) => {
//         setCurrentPage(1);
//         setSearchText(value);
//       }}
//       filterValue={statusFilter}
//       filterOptions={STATUS_FILTERS}
//       onFilter={(value) => {
//         setCurrentPage(1);
//         setStatusFilter(value);
//       }}
//       total={total}
//       currentPage={currentPage}
//       listPerPage={listPerPage}
//       onPageChange={setCurrentPage}
//       setListPerPage={setListPerPage}
//       setCurrentPage={setCurrentPage}
//       hasRows={rows.length > 0}
//     >
//       {!staffMode && <div style={{ padding: 16, marginBottom: 12, border: '1px solid #ddd', borderRadius: 10 }}>
//         <strong>Restaurant Floors</strong>
//         <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
//           <input placeholder="New floor name" value={floorName} onChange={e => setFloorName(e.target.value)} />
//           <button type="button" onClick={async () => { if (!floorName.trim()) return; try { await createRestaurantFloor(floorName.trim()); setFloorName(''); const d = await listRestaurantFloors(); setFloors(d.floors || []); } catch (e) { Message(e.response?.data?.message || 'Could not create floor', 'error'); } }}>Add Floor</button>
//           {floors.map(f => <span key={f.id} style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }}>{f.name} ({f.table_count}) <button type="button" onClick={async () => { if (!window.confirm(`Delete ${f.name}?`)) return; try { await deleteRestaurantFloor(f.id); const d = await listRestaurantFloors(); setFloors(d.floors || []); } catch (e) { Message(e.response?.data?.message || 'Floor contains tables', 'error'); } }}>×</button></span>)}
//         </div>
//       </div>}
//       {!staffMode && qrRow && <div style={{ padding: 20, border: '1px solid #ddd', marginBottom: 15, textAlign: 'center' }}>
//         <h3>{qrRow.location_label}</h3>
//         <div id="table-qr-print"><QRCode value={`${process.env.REACT_APP_CUSTOMER_MENU_URL || 'http://localhost:3000/menu-item'}?table=${qrRow.id}`} size={220} id="table-qr-canvas" /></div>
//         <p>Scan to open the restaurant menu</p>
//         <button type="button" onClick={() => { const canvas = document.querySelector('#table-qr-canvas'); if (!canvas) return; const a = document.createElement('a'); a.download = `table-${qrRow.id}.png`; a.href = canvas.toDataURL('image/png'); a.click(); }}>Download QR</button>{' '}
//         <button type="button" onClick={() => { const canvas = document.querySelector('#table-qr-canvas'); if (!canvas) return; const win = window.open('', '_blank'); if (!win) return; win.document.write(`<html><body style="text-align:center;font-family:sans-serif"><h2>${qrRow.location_label.replace(/[<>&]/g, '')}</h2><img src="${canvas.toDataURL('image/png')}"/><p>Scan for menu</p></body></html>`); win.document.close(); win.focus(); win.print(); }}>Print QR</button>{' '}
//         <button type="button" onClick={() => setQrRow(null)}>Close</button>
//       </div>}
//       {!staffMode && <TableFloor />}
//       <table className={style.table}>
//         <thead>
//           <tr>
//             <th onClick={() => sortBy('name')}>Name</th>
//             <th>Location</th>
//             <th onClick={() => sortBy('seats')}>Seats</th>
//             <th onClick={() => sortBy('is_active')}>Status</th>
//             <th />
//           </tr>
//         </thead>
//         <tbody>
//           {rows.length === 0 ? (
//             <tr>
//               <td colSpan="5">No tables yet. Add the floor tables your staff should pick from.</td>
//             </tr>
//           ) : rows.map((row) => (
//             <tr key={row.id}>
//               <td>{row.name}</td>
//               <td>{row.floor_name || 'Direct'}</td>
//               <td>{row.seats}</td>
//               <td>
//                 <span className={row.is_active ? style.badge : style.badgeOff}>
//                   {row.is_active ? 'Active' : 'Hidden'}
//                 </span>
//               </td>
//               <td>
//                 <div className={style.rowActions}>
//                   {!staffMode && <button className={style.ghost} type="button" onClick={() => setQrRow(row)}>QR / Print</button>}
//                   <button className={style.ghost} type="button" onClick={() => editRow(row)}>Edit</button>
//                   <button className={style.danger} type="button" onClick={() => remove(row)}>Remove</button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </RecordPage>
//   );
// }





















import { useEffect, useState } from 'react';
import axios from 'axios';
import { QRCode } from 'react-qrcode-logo';
import { listRestaurantFloors, createRestaurantFloor, deleteRestaurantFloor } from '../../api/tablesApi';
import siteConfig from '../../../../config/config';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../../Context/AppContext';
import { loadDashboard } from '../../../Home/services/homeService';
import { tableStillSeated } from '../../../Home/services/todayOrderRules';
import {
  createDiningTable,
  deleteDiningTable,
  loadDiningTablePage,
  loadDiningTables,
  updateDiningTable,
} from '../../services/tablesService';
import { initialTableForm, useTablesState } from '../../usestate/tablesState';
import RecordPage from '../../../../components/RecordPage/RecordPage';
import style from '../style/tables.module.css';

function getTableNumber(name) {
  const match = /^(?:T|Table\s*)?([1-9]\d*)$/i.exec(String(name || '').trim());
  return match ? Number(match[1]) : null;
}

function getFloorNumber(name) {
  const label = String(name || '').trim().toLowerCase().replace(/[-_]/g, ' ').replace(/\s+/g, ' ');
  if (!label || /^(ground|ground floor|gf|g floor)$/.test(label)) return 0;
  const names = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10 };
  const match = /^(?:(\d+)(?:st|nd|rd|th)?|([a-z]+))\s*(?:floor)?$|^floor\s*(\d+)$/.exec(label);
  if (!match) return null;
  const value = match[1] || match[3] ? Number(match[1] || match[3]) : names[match[2]];
  return Number.isInteger(value) && value > 0 ? value : null;
}

function getCustomerMenuOrigin() {
  const tenant = window.location.hostname.split('.')[0];
  const template = process.env.REACT_APP_CUSTOMER_MENU_URL || process.env.REACT_APP_CUSTOMER_SITE_URL_TEMPLATE;
  if (template) {
    try { return new URL(template.replace(/\{tenant\}/gi, tenant)).origin; } catch (error) { /* use fallback */ }
  }
  return `${window.location.protocol}//${window.location.hostname}:3000`;
}

function TableFloor() {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    loadDiningTables().then(data => setTables(data?.tables || [])).catch(() => setTables([]));
    loadDashboard().then(data => setOrders([
      data?.todays_newly_placed_orders, data?.todays_pending_orders,
      data?.todays_served_orders, data?.todays_paid_orders,
    ].flat().filter(tableStillSeated))).catch(() => setOrders([]));
  }, []);
  if (!tables.length) return null;
  return (
    <div className="table-floor">
      {tables.filter(table => table.is_active).map(table => {
        const sitting = orders.find(order =>
          String(order.table_number || '').trim().toLowerCase() === String(table.location_label || table.name || '').trim().toLowerCase()
        );
        return (
          <button key={table.id} type="button"
            className={sitting ? 'table-floor__card table-floor__card--busy' : 'table-floor__card'}
            onClick={() => navigate('/Dashboard', { state: { seatTable: table.location_label || table.name, seatAt: Date.now() } })}>
            <span className="table-floor__name">{table.floor_name ? `${table.floor_name} · ` : 'Ground Floor · '}{table.name}</span>
            <span className="table-floor__meta">{sitting ? `${sitting.order_id} · ${sitting.order_status}` : `${table.seats} seats · Free`}</span>
            <span className="desk-action">{sitting ? 'Add order' : 'Seat'}</span>
          </button>
        );
      })}
    </div>
  );
}

const STATUS_FILTERS = [
  { value: 'all', label: 'All statuses' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Hidden' },
];

export default function Tables({ staffMode = false }) {
  const staffTableRequest = async (method, payload = {}) => {
    const auth = JSON.parse(sessionStorage.getItem('restroStaffSession') || 'null');
    if (!auth?.token || !auth?.tenant) throw new Error('Staff login required');
    const response = await axios({
      method, baseURL: siteConfig.staticBaseURL,
      url: '/api/v1/workforce/staff-operations/',
      headers: { Authorization: `Bearer ${auth.token}`, 'X-Tenant': auth.tenant },
      ...(method === 'get' ? { params: { section: 'tables' } } : { data: { section: 'tables', ...payload } })
    });
    return response.data;
  };
  const { Message } = useApp();
  const { form, setForm, editingId, setEditingId, error, setError } = useTablesState();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(Number(localStorage.getItem('listPerPage')) || 10);
  const [searchText, setSearchText] = useState('');
  const [columnToSort, setColumnToSort] = useState('name');
  const [columnSortingOrder, setColumnSortingOrder] = useState('ascending');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);
  const [floors, setFloors] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState('');
  const [qrRow, setQrRow] = useState(null);
  const [floorName, setFloorName] = useState('');
  const [saving, setSaving] = useState(false);
  const [floorBusy, setFloorBusy] = useState(false);
  const [allTables, setAllTables] = useState([]);
  const [tableName, setTableName] = useState('');
  const [tableSeats, setTableSeats] = useState(4);
  const [editingTable, setEditingTable] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [managerError, setManagerError] = useState('');

  const refreshFloors = async () => {
    const data = await listRestaurantFloors();
    setFloors(data.floors || []);
  };

  const refreshAllTables = async () => {
    const data = await loadDiningTables();
    setAllTables(data?.tables || []);
  };

  function qrMenuUrl(row) {
    if (!row) return '';
    const number = getTableNumber(row.name);
    if (!number) return '';
    const floor = floors.find(item => String(item.id) === String(row.floor));
    const floorNumber = getFloorNumber(floor?.name || row.floor_name || '');
    if (floorNumber === null) return '';
    const origin = getCustomerMenuOrigin();
    return `${origin}/menu-item?floor=${floorNumber}&tables=${number}`;
  }

  function qrCardCanvas(row) {
    const qrCanvas = document.querySelector('#table-qr-canvas');
    if (!qrCanvas || !row) return null;
    const canvas = document.createElement('canvas');
    const width = 560;
    const height = 680;
    canvas.width = width * 2;
    canvas.height = height * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.scale(2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#dbe3ee';
    ctx.lineWidth = 2;
    ctx.strokeRect(16, 16, width - 32, height - 32);
    const floor = row.floor_name || 'Ground Floor';
    const number = getTableNumber(row.name);
    const table = number ? `Table ${number}` : String(row.name || 'Table');
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.font = 'bold 34px Arial, sans-serif';
    ctx.fillText(floor, width / 2, 105, width - 70);
    ctx.font = 'bold 44px Arial, sans-serif';
    ctx.fillText(table, width / 2, 169, width - 70);
    ctx.drawImage(qrCanvas, 105, 205, 350, 350);
    ctx.fillStyle = '#475569';
    ctx.font = '20px Arial, sans-serif';
    ctx.fillText('Scan to view menu', width / 2, 602);
    return canvas;
  }

  function downloadQrCard(row) {
    const canvas = qrCardCanvas(row);
    if (!canvas) return;
    const floor = (row.floor_name || 'Ground Floor').replace(/[^a-z0-9]+/gi, '-');
    const table = String(row.name || 'table').replace(/[^a-z0-9]+/gi, '-');
    const link = document.createElement('a');
    link.download = `${floor}-${table}-QR.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function printQrCard(row) {
    const canvas = qrCardCanvas(row);
    if (!canvas) return;
    const imageUrl = canvas.toDataURL('image/png');
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<html><head><title>Table QR</title><style>@page{margin:10mm}body{margin:0;display:flex;justify-content:center;align-items:flex-start}img{display:block;width:140mm;max-width:100%;height:auto}@media print{img{break-inside:avoid}}</style></head><body><img alt="Table QR card" src="${imageUrl}" onload="window.focus();window.print()" /></body></html>`);
    win.document.close();
  }

  async function createFloor(event) {
    event.preventDefault();
    const name = floorName.trim();
    if (!name) return;
    if (getFloorNumber(name) === null) {
      setManagerError('Use Ground Floor, First Floor, Second Floor, Floor 3, etc.');
      return;
    }
    if (floors.some(f => getFloorNumber(f.name) === getFloorNumber(name))) {
      setManagerError('This floor number already exists. Select the existing floor.');
      return;
    }
    setFloorBusy(true);
    setManagerError('');
    try {
      await createRestaurantFloor(name);
      await refreshFloors();
      setFloorName('');
      Message('Floor added', 'success');
    } catch (error) {
      setManagerError(error.response?.data?.message || 'Could not create floor');
    } finally { setFloorBusy(false); }
  }

  async function saveQuickTable(event) {
    event.preventDefault();
    const number = getTableNumber(tableName);
    if (!number) { setManagerError('Enter a numeric table name such as T1 or Table 2.'); return; }
    const name = `T${number}`;
    const floorId = selectedLocation || null;
    if (allTables.some(row => String(row.floor || '') === String(floorId || '') && getTableNumber(row.name) === number && row.id !== editingTable?.id)) {
      setManagerError(`${name} already exists on this floor.`);
      return;
    }
    setSaving(true);
    setManagerError('');
    try {
      const payload = { name, seats: Number(tableSeats) || 4, is_active: editingTable ? editingTable.is_active : true, floor: floorId };
      if (editingTable) await updateDiningTable(editingTable.id, payload);
      else await createDiningTable(payload);
      Message(editingTable ? 'Table updated' : 'Table added', 'success');
      setTableName('');
      setTableSeats(4);
      setEditingTable(null);
      await Promise.all([loadPage(), refreshFloors(), refreshAllTables()]);
    } catch (error) {
      setManagerError(error.userMessage || error.response?.data?.message || 'Could not save table.');
    } finally { setSaving(false); }
  }

  function startEditTable(row) {
    setEditingTable(row);
    setSelectedLocation(row.floor ? String(row.floor) : '');
    setTableName(row.name);
    setTableSeats(row.seats);
    setManagerError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEditTable() {
    setEditingTable(null);
    setTableName('');
    setTableSeats(4);
    setManagerError('');
  }

  useEffect(() => {
    if (!staffMode) listRestaurantFloors().then(data => setFloors(data.floors || [])).catch(() => { });
    if (!staffMode) refreshAllTables().catch(() => { });
  }, [staffMode]);

  async function loadPage() {
    if (staffMode) {
      const data = await staffTableRequest('get');
      let results = data.results || [];
      const search = searchText.trim().toLowerCase();
      if (search) results = results.filter(row => String(row.name).toLowerCase().includes(search));
      if (statusFilter !== 'all') results = results.filter(row => Boolean(row.is_active) === (statusFilter === 'true'));
      results.sort((a, b) => {
        const av = a[columnToSort], bv = b[columnToSort];
        const diff = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av ?? '').localeCompare(String(bv ?? ''), undefined, { numeric: true });
        return columnSortingOrder === 'ascending' ? diff : -diff;
      });
      setTotal(results.length);
      setRows(results.slice((currentPage - 1) * listPerPage, currentPage * listPerPage));
      return;
    }
    const data = await loadDiningTablePage({
      currentPage,
      listPerPage,
      searchText,
      columnToSort,
      columnSortingOrder,
      filters: statusFilter === 'all' ? undefined : { is_active: statusFilter === 'true' },
    });
    setRows(data.tables || []);
    setTotal(data.count || 0);
  }

  useEffect(() => {
    loadPage().catch(() => setError('Tables could not be loaded. Run the latest database migration, then refresh.'));
  }, [currentPage, listPerPage, searchText, columnToSort, columnSortingOrder, statusFilter]);

  function editRow(row) {
    setEditingId(row.id);
    setForm({ name: row.name, seats: row.seats, is_active: row.is_active });
    setSelectedFloor(row.floor || '');
    setError('');
    setFormOpen(true);
  }

  function resetForm() {
    setEditingId(null);
    setForm(initialTableForm);
    setSelectedFloor('');
    setError('');
  }

  function sortBy(column) {
    if (columnToSort === column) {
      setColumnSortingOrder(columnSortingOrder === 'ascending' ? 'descending' : 'ascending');
    } else {
      setColumnToSort(column);
      setColumnSortingOrder('ascending');
    }
  }

  async function save(event) {
    event.preventDefault();
    const name = form.name.trim();
    if (!name) {
      setError('Enter a table name, for example T1 or Garden 2.');
      return;
    }
    const payload = {
      name,
      seats: Number(form.seats) || 4,
      is_active: form.is_active,
      ...(!staffMode ? { floor: selectedFloor || null } : {}),
    };
    try {
      if (editingId) {
        if (staffMode) await staffTableRequest('post', { action: 'update_table', table_id: editingId, ...payload });
        else await updateDiningTable(editingId, payload);
        Message('Table updated', 'success');
      } else {
        if (staffMode) await staffTableRequest('post', { action: 'create_table', ...payload });
        else await createDiningTable(payload);
        Message('Table added', 'success');
      }
      resetForm();
      setFormOpen(false);
      await loadPage();
    } catch (err) {
      setError(err.userMessage || 'Could not save this table.');
    }
  }

  async function remove(row) {
    if (!window.confirm(`Remove ${row.name}? Past orders that used this table stay as they are.`)) {
      return;
    }
    if (staffMode) await staffTableRequest('post', { action: 'delete_table', table_id: row.id });
    else await deleteDiningTable(row.id);
    if (editingId === row.id) resetForm();
    await loadPage();
    if (!staffMode) await Promise.all([refreshFloors(), refreshAllTables()]);
  }

  return (
    <RecordPage
      title="Floors & Tables"
      showForm={staffMode}
      formOpen={staffMode && formOpen}
      formTitle="Edit table"
      onCreate={staffMode ? () => { resetForm(); setFormOpen(true); } : undefined}
      onToggleForm={() => setFormOpen(open => !open)}
      form={staffMode && formOpen ? (
        <form className={style.card} onSubmit={save}>
          <div className={style.field}><label htmlFor="staff-table-name">Table name</label><input id="staff-table-name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
          <div className={style.field}><label htmlFor="staff-table-seats">Seats</label><input id="staff-table-seats" type="number" min="1" value={form.seats} onChange={e => setForm({ ...form, seats: e.target.value })} /></div>
          <label className={style.check}><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} /> Available for new orders</label>
          {error && <div className={style.error}>{error}</div>}
          <div className={style.actions}><button type="submit" className={style.primary}>Save table</button><button type="button" className={style.ghost} onClick={() => setFormOpen(false)}>Cancel</button></div>
        </form>
      ) : null}
      searchPlaceholder="Search table name"
      onSearch={(value) => {
        setCurrentPage(1);
        setSearchText(value);
      }}
      filterValue={statusFilter}
      filterOptions={STATUS_FILTERS}
      onFilter={(value) => {
        setCurrentPage(1);
        setStatusFilter(value);
      }}
      total={total}
      currentPage={currentPage}
      listPerPage={listPerPage}
      onPageChange={setCurrentPage}
      setListPerPage={setListPerPage}
      setCurrentPage={setCurrentPage}
      hasRows={rows.length > 0}
    >
      {!staffMode && (
        <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className={style.primary} onClick={() => setManagerOpen(open => !open)} aria-expanded={managerOpen}>
            {managerOpen ? 'Hide Floor & Table Manager' : '+ Manage Floors & Tables'}
          </button>
        </div>
      )}
      {!staffMode && managerOpen && (
        <div style={{ padding: 20, marginBottom: 18, border: '1px solid #d9e2ef', borderRadius: 14, background: '#f8fbff' }}>
          <h3 style={{ margin: '0 0 5px' }}>Floor & Table Management</h3>
          <p style={{ margin: '0 0 18px', color: '#64748b' }}>Create or select a floor, then add tables directly to it.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            <section style={{ padding: 18, border: '1px solid #dce4ef', borderRadius: 12, background: '#fff' }}>
              <h4 style={{ marginTop: 0 }}>1. Floors</h4>
              <form onSubmit={createFloor} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <input value={floorName} onChange={e => setFloorName(e.target.value)} placeholder="e.g. Third Floor" style={{ flex: '1 1 160px', minWidth: 0, padding: 10, border: '1px solid #cbd5e1', borderRadius: 8 }} />
                <button type="submit" disabled={floorBusy} className={style.primary}>{floorBusy ? 'Adding...' : '+ Add Floor'}</button>
              </form>
              <p style={{ fontSize: 12, color: '#64748b' }}>Ground Floor is always available without creating a separate floor.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[{ id: '', name: 'Ground Floor' }, ...floors].map(floor => {
                  const active = String(selectedLocation) === String(floor.id);
                  const count = allTables.filter(row => String(row.floor || '') === String(floor.id)).length;
                  return (
                    <div key={String(floor.id) || 'ground'} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button type="button" onClick={() => { setSelectedLocation(String(floor.id)); cancelEditTable(); }}
                        style={{ flex: 1, textAlign: 'left', padding: '11px 12px', borderRadius: 9, border: active ? '2px solid #1e40af' : '1px solid #dce4ef', background: active ? '#eff6ff' : '#fff', color: '#0f172a', cursor: 'pointer', fontWeight: active ? 700 : 500 }}>
                        {floor.name} <span style={{ float: 'right', color: '#64748b' }}>{count} tables {active ? '✓' : ''}</span>
                      </button>
                      {floor.id !== '' && <button type="button" title={`Delete ${floor.name}`} disabled={floorBusy}
                        onClick={async () => {
                          if (!window.confirm(`Delete ${floor.name}? It must have no tables.`)) return;
                          setFloorBusy(true);
                          try {
                            await deleteRestaurantFloor(floor.id);
                            if (String(selectedLocation) === String(floor.id)) setSelectedLocation('');
                            await refreshFloors();
                            Message('Floor deleted', 'success');
                          } catch (error) { setManagerError(error.response?.data?.message || 'Remove tables before deleting this floor.'); }
                          finally { setFloorBusy(false); }
                        }} style={{ border: '1px solid #fecaca', borderRadius: 8, padding: 10, color: '#b91c1c', background: '#fff', cursor: 'pointer' }}>×</button>}
                    </div>
                  );
                })}
              </div>
            </section>
            <section style={{ padding: 18, border: '1px solid #dce4ef', borderRadius: 12, background: '#fff' }}>
              <h4 style={{ marginTop: 0 }}>2. {editingTable ? 'Edit Table' : 'Add Table'}</h4>
              <p style={{ color: '#475569', fontSize: 14 }}>Selected floor: <strong>{floors.find(f => String(f.id) === String(selectedLocation))?.name || 'Ground Floor'}</strong></p>
              <form onSubmit={saveQuickTable} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label>Table number
                  <input value={tableName} onChange={e => setTableName(e.target.value)} placeholder="T1 or Table 1" required style={{ display: 'block', width: '100%', boxSizing: 'border-box', marginTop: 5, padding: 11, border: '1px solid #cbd5e1', borderRadius: 8 }} />
                </label>
                <label>Seats
                  <input type="number" min="1" value={tableSeats} onChange={e => setTableSeats(e.target.value)} style={{ display: 'block', width: '100%', boxSizing: 'border-box', marginTop: 5, padding: 11, border: '1px solid #cbd5e1', borderRadius: 8 }} />
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="submit" disabled={saving} className={style.primary}>{saving ? 'Saving...' : editingTable ? 'Save Changes' : '+ Save Table'}</button>
                  {editingTable && <button type="button" className={style.ghost} onClick={cancelEditTable}>Cancel</button>}
                </div>
              </form>
              <div style={{ marginTop: 16, fontSize: 13, color: '#475569' }}>
                <strong>Tables on this floor:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {allTables.filter(row => String(row.floor || '') === String(selectedLocation)).length === 0 ? 'No tables yet' :
                    allTables.filter(row => String(row.floor || '') === String(selectedLocation)).map(row => (
                      <button key={row.id} type="button" onClick={() => startEditTable(row)}
                        style={{ padding: '7px 11px', border: '1px solid #bfdbfe', borderRadius: 8, background: '#eff6ff', cursor: 'pointer' }}>{row.name}</button>
                    ))}
                </div>
              </div>
            </section>
          </div>
          {managerError && <p role="alert" style={{ color: '#b42318', marginBottom: 0 }}>{managerError}</p>}
        </div>
      )}
      {!staffMode && qrRow && <div style={{ padding: 20, border: '1px solid #ddd', marginBottom: 15, textAlign: 'center' }}>
        <h3 style={{ marginBottom: 4 }}>{qrRow.floor_name || 'Ground Floor'}</h3>
        <h4 style={{ marginTop: 0 }}>Table {getTableNumber(qrRow.name) || qrRow.name}</h4>
        {qrMenuUrl(qrRow) ? (
          <div id="table-qr-print" style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <QRCode value={qrMenuUrl(qrRow)} size={220} id="table-qr-canvas" />
          </div>
        ) : (
          <p style={{ color: '#b42318' }}>Use a numeric table label (T1, Table 1) and a recognized floor name (Ground Floor, First Floor, Second Floor).</p>
        )}
        <p>Scan to open the restaurant menu</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" className={style.primary} disabled={!qrMenuUrl(qrRow)} onClick={() => downloadQrCard(qrRow)}>Download QR with Label</button>
          <button type="button" className={style.ghost} disabled={!qrMenuUrl(qrRow)} onClick={() => printQrCard(qrRow)}>Print QR with Label</button>
          <button type="button" className={style.ghost} onClick={() => setQrRow(null)}>Close</button>
        </div>
      </div>}
      {!staffMode && <TableFloor />}
      <table className={style.table}>
        <thead>
          <tr>
            <th onClick={() => sortBy('name')}>Name</th>
            <th>Location</th>
            <th onClick={() => sortBy('seats')}>Seats</th>
            <th onClick={() => sortBy('is_active')}>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan="5">No tables yet. Add the floor tables your staff should pick from.</td>
            </tr>
          ) : rows.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.floor_name || 'Ground Floor'}</td>
              <td>{row.seats}</td>
              <td>
                <span className={row.is_active ? style.badge : style.badgeOff}>
                  {row.is_active ? 'Active' : 'Hidden'}
                </span>
              </td>
              <td>
                <div className={style.rowActions}>
                  {!staffMode && <button className={style.ghost} type="button" onClick={() => setQrRow(row)}>QR / Print</button>}
                  <button className={style.ghost} type="button" onClick={() => staffMode ? editRow(row) : startEditTable(row)}>Edit</button>
                  <button className={style.danger} type="button" onClick={() => remove(row)}>Remove</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </RecordPage>
  );
}
