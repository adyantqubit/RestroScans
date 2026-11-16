import { createHash } from 'crypto';
import { act, Simulate } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { ChakraBaseProvider, extendBaseTheme } from '@chakra-ui/react';
import chakraTheme from '@chakra-ui/theme';
import NewOrderReport from './NewOrderReport';
import { AppProvider } from '../../../../Context/AppContext';

// Drives the order report through what an owner does with it (filter, sort, page, open an order, export)
// and snapshots the page, the queries it sends and the rows it exports. The snapshots were recorded against
// the unsplit component, so the split must reproduce them exactly.

jest.mock('../../../../http/http_client', () => ({
  __esModule: true,
  default: {
    get: () => new Promise(() => {}),
    post: () => new Promise(() => {}),
    put: () => new Promise(() => {}),
    delete: () => new Promise(() => {}),
  },
  friendlyErrorMessage: () => 'error',
}));

const calls = [];
let mockReportResponse;

jest.mock('../../services/reportService', () => ({
  ...jest.requireActual('../../services/reportService'),
  loadOrderReport: (tenant, query) => {
    calls.push({ loadOrderReport: { tenant, query: JSON.parse(JSON.stringify(query)) } });
    return Promise.resolve(mockReportResponse);
  },
  loadOrderCount: () => Promise.resolve({ orderCount: 0 }),
  loadOrderItems: (tenant, id) => {
    calls.push({ loadOrderItems: { tenant, id } });
    return Promise.resolve({
      msg: true,
      orderItems: [
        { id: 1, item: 'Paneer Tikka', serving_size: 'Full', quantity: 2, price: 200, item_status: 'Confirm' },
        { id: 2, item: 'Masala Dosa', serving_size: 'Half', quantity: 1, price: 100, item_status: 'Cancelled' },
      ],
    });
  },
}));

jest.mock('file-saver', () => ({
  saveAs: (data, name) => calls.push({ saveAs: name }),
}));

jest.mock('xlsx', () => ({
  utils: {
    json_to_sheet: (rows) => {
      calls.push({ exportRows: JSON.parse(JSON.stringify(rows)) });
      return {};
    },
  },
  write: () => [],
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const theme = extendBaseTheme({ components: { Alert: chakraTheme.components.Alert } });

const makeOrder = (n, overrides = {}) => ({
  id: n,
  order_id: `ORD-000${n}`,
  table_number: `${n}`,
  date: `2026-01-0${n}T10:3${n}:00`,
  order_status: 'Served',
  payment_status: 'Completed',
  payment_mode: 'Cash',
  sub_total: 300,
  discount_rupees: 20,
  discount_percentage: 6.67,
  discount_reason: 'regular',
  loyality_point_price: 10,
  total: 270,
  cgst: 6.75,
  sgst: 6.75,
  final_amount: 283.5,
  customer_name: `Guest ${n}`,
  customer_email: `guest${n}@example.test,other@example.test`,
  customer_number: `99999999${n}${n}`,
  customer_id: n,
  customer_loyality_point: 5,
  last_customer_name: 'x',
  cancel_reason: '',
  cancelled_by: '',
  review: 'ok',
  rating: 4,
  apply_loyality_point: 5,
  loyality_point_status: true,
  loyality_point_calculated: false,
  payment_confirmation_date_time: '2026-01-01T11:00:00',
  send_notifications_on_order_update: true,
  send_notifications_on_payment_update: true,
  send_notifications_on_amount_update: true,
  send_notification_on_tableNum_update: true,
  ...overrides,
});

let root;
let container;

function pretty(html) {
  return html
    .replace(/class="([^"]*)"/g, (_, value) => `class="${value.replace(/\s+/g, ' ')}"`)
    .replace(/></g, '>\n<');
}

// The full markup is kept as a hash next to the readable parts, which show what changed when it does.
// `calls` lists only what happened since the previous snapshot.
let reportedCalls = 0;
function snap(label) {
  const newCalls = calls.slice(reportedCalls);
  reportedCalls = calls.length;
  const alert = document.getElementById('pot');
  const html = pretty(document.body.innerHTML);
  return {
    label,
    markup: createHash('sha1').update(html).digest('hex').slice(0, 12),
    text: document.body.textContent.slice(0, 160),
    inputs: Array.from(document.querySelectorAll('input')).map(
      (el) => `${el.id || el.name || el.className} ${el.type === 'radio' || el.type === 'checkbox' ? `checked=${el.checked}` : `value=${el.value}`}`,
    ),
    alert: alert ? alert.textContent : null,
    calls: JSON.parse(JSON.stringify(newCalls)),
  };
}

async function mount({ state, orders } = {}) {
  mockReportResponse = {
    orderList: orders || [makeOrder(1), makeOrder(2, { order_status: 'Cancelled', payment_status: 'Pending', cancel_reason: 'Guest left' }), makeOrder(3, { order_status: 'Placed', payment_status: 'Pending' })],
    orderListCount: 25,
    allReportList: orders || [makeOrder(1), makeOrder(2), makeOrder(3)],
  };
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => {
    root.render(
      <ChakraBaseProvider theme={theme}>
        <AppProvider>
          <MemoryRouter initialEntries={[{ pathname: '/NewOrderReport', state }]}>
            <NewOrderReport />
          </MemoryRouter>
        </AppProvider>
      </ChakraBaseProvider>,
    );
  });
}

const byId = (id) => document.getElementById(id);
const flush = () => act(async () => {});
const clickEl = async (el) => { await act(async () => { Simulate.click(el); }); };
const buttonByText = (text) => Array.from(document.querySelectorAll('button')).find((b) => b.textContent.trim() === text);
const headingByText = (text) =>
  Array.from(document.querySelectorAll('[class*="Column"], [class*="finalRupees"]')).find((d) => d.textContent.trim().startsWith(text));

async function choose(id, checked) {
  const el = byId(id);
  el.checked = checked;
  await act(async () => { Simulate.change(el, { target: { value: el.value, checked } }); });
}

beforeEach(() => {
  calls.length = 0;
  reportedCalls = 0;
  localStorage.clear();
  localStorage.setItem('tenantInfo', JSON.stringify({ tenant_name: 'demo' }));
  localStorage.setItem('listPerPage', '10');
  window.matchMedia = window.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {} }));
  jest.useFakeTimers();
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.body.innerHTML = '';
  jest.useRealTimers();
});

describe('first render', () => {
  test('default filters and the list', async () => {
    await mount();
    expect(snap('default')).toMatchSnapshot();
  });

  test('opened from the dashboard with a quick range', async () => {
    await mount({ state: { today: true, week: false, month: false, year: false } });
    expect(snap('from dashboard')).toMatchSnapshot();
  });

  test('no orders', async () => {
    await mount({ orders: [] });
    expect(snap('empty')).toMatchSnapshot();
  });
});

describe('filters', () => {
  test.each(['today', 'week', 'month', 'year', 'custom'])('quick select %s then Generate Report', async (name) => {
    await mount();
    const trail = [];
    await choose(name, true);
    trail.push(snap(`chose ${name}`));
    await clickEl(buttonByText('Generate Report'));
    trail.push(snap(`generate after ${name}`));
    expect(trail).toMatchSnapshot();
  });

  test('switching between quick ranges keeps only one selected', async () => {
    await mount();
    await choose('today', true);
    await choose('month', true);
    await choose('custom', true);
    await choose('year', true);
    expect(snap('year last')).toMatchSnapshot();
  });

  test('order status boxes toggle and are sent', async () => {
    await mount();
    const trail = [];
    for (const [id, checked] of [['placed', true], ['confirm', true], ['served', true], ['cancelled', true], ['placed', false], ['served', false]]) {
      await choose(id, checked);
      trail.push(snap(`${id} ${checked}`));
    }
    await clickEl(buttonByText('Generate Report'));
    trail.push(snap('generate'));
    expect(trail).toMatchSnapshot();
  });

  test('payment status boxes toggle and are sent', async () => {
    await mount();
    const trail = [];
    for (const [id, checked] of [['pending', true], ['completed', false], ['completed', true], ['pending', false]]) {
      await choose(id, checked);
      trail.push(snap(`${id} ${checked}`));
    }
    await clickEl(buttonByText('Generate Report'));
    trail.push(snap('generate'));
    expect(trail).toMatchSnapshot();
  });
});

describe('sorting', () => {
  test('every sortable heading, clicked and hovered', async () => {
    await mount();
    const trail = [];
    for (const label of ['Order ID', 'Table No', 'Date', 'Sub Total', 'Discount', 'Loyality', 'Total', 'CGST', 'SGST', 'Final Amount']) {
      const heading = () => headingByText(label);
      act(() => { Simulate.mouseEnter(heading()); });
      trail.push(snap(`hover ${label}`));
      await clickEl(heading());
      trail.push(snap(`sort ${label}`));
      await clickEl(heading());
      trail.push(snap(`sort ${label} again`));
      act(() => { Simulate.mouseLeave(heading()); });
    }
    expect(trail).toMatchSnapshot();
  });

  test('Order Status and Payment Status headings do not sort', async () => {
    await mount();
    const before = calls.length;
    await clickEl(headingByText('Order Status'));
    await clickEl(headingByText('Payment Status'));
    expect(calls.length).toBe(before);
  });
});

describe('paging', () => {
  test('changing page and page size', async () => {
    await mount();
    const trail = [];
    const next = document.querySelector('.ant-pagination-next');
    expect(next).not.toBeNull();
    await clickEl(next);
    trail.push(snap('page 2'), { storedPage: localStorage.getItem('globalPageIndex') });
    const sizeOption = (text) => Array.from(document.querySelectorAll('span')).find((s) => s.textContent === text);
    await clickEl(sizeOption('20 / Page'));
    trail.push(snap('20 per page'), { storedSize: localStorage.getItem('listPerPage') });
    await clickEl(sizeOption('30 / Page'));
    trail.push(snap('30 per page'), { storedSize: localStorage.getItem('listPerPage') });
    await clickEl(sizeOption('10 / Page'));
    trail.push(snap('back to 10'), { storedSize: localStorage.getItem('listPerPage') });
    expect(trail).toMatchSnapshot();
  });

  test('remembers the last page it was on', async () => {
    localStorage.setItem('globalPageIndex', '3');
    await mount();
    expect(snap('restored page').calls).toMatchSnapshot();
  });
});

describe('order details', () => {
  test('opening an order shows it and its items; closing hides it', async () => {
    await mount();
    const trail = [];
    const eyes = () => document.querySelectorAll('[class*="actionColumn"] svg');
    await clickEl(eyes()[0]);
    trail.push(snap('first order'));
    const close = document.querySelector('.ant-modal-close');
    if (close) await clickEl(close);
    trail.push(snap('closed'));
    await clickEl(eyes()[1]);
    trail.push(snap('cancelled order (cancel reason shown)'));
    await clickEl(eyes()[2]);
    trail.push(snap('third order'));
    expect(trail).toMatchSnapshot();
  });

  test('an order without tax hides the tax rows', async () => {
    await mount({ orders: [makeOrder(1, { cgst: 0, sgst: 0, total: 300, final_amount: 300 })] });
    await clickEl(document.querySelectorAll('[class*="actionColumn"] svg')[0]);
    expect(snap('no tax')).toMatchSnapshot();
  });
});

describe('export', () => {
  test('exports every order with readable column names', async () => {
    await mount();
    await clickEl(buttonByText('Export'));
    expect(snap('export').calls).toMatchSnapshot();
  });

  test('nothing to export says so', async () => {
    await mount({ orders: [] });
    await clickEl(buttonByText('Export'));
    expect(snap('export empty')).toMatchSnapshot();
  });
});
