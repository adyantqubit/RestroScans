import { createHash } from 'crypto';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { ChakraBaseProvider, extendBaseTheme } from '@chakra-ui/react';
import chakraTheme from '@chakra-ui/theme';
import TodayOrder from './TodayOrder';
import { AppProvider } from '../../../../Context/AppContext';

// Drives the dashboard's list of today's orders through what staff do with it (switch tabs, tick orders, update
// them in bulk, open an order) and snapshots the page and what it sends to the server. The snapshots were
// recorded against the unsplit component, so the split must reproduce them exactly.

jest.mock('../../../../http/http_client', () => ({
  __esModule: true,
  default: {
    get: () => new Promise(() => {}),
    post: () => new Promise(() => {}),
    put: () => new Promise(() => {}),
    delete: () => new Promise(() => {}),
  },
  friendlyErrorMessage: () => 'error',
  explainFailure: (body, fallback) => (body && typeof body.error === 'string' && body.error) || fallback,
}));

const calls = [];
let mockDashboard;
let mockBulkResult;

jest.mock('../../services/homeService', () => ({
  ...jest.requireActual('../../services/homeService'),
  loadDashboard: (tenant) => {
    calls.push({ loadDashboard: tenant });
    return mockDashboard === 'never' ? new Promise(() => {}) : Promise.resolve(JSON.parse(JSON.stringify(mockDashboard)));
  },
  saveAllOrderStatus: (tenant, data) => {
    calls.push({ saveAllOrderStatus: { tenant, data: JSON.parse(JSON.stringify(data)) } });
    return Promise.resolve(JSON.parse(JSON.stringify(mockBulkResult)));
  },
}));

jest.mock('../../../DashboardModel/user_interface/containers/OrderModel', () => ({
  __esModule: true,
  default: (props) => (
    <div
      id="order-model"
      data-open={String(props.isOpen)}
      data-order={props.selectedOrder && props.selectedOrder.order_id}
      data-items={(props.selectedOrderItems || []).map((item) => item.id).join(',')}
      data-restro={props.restroDetail && props.restroDetail.name}
      data-setting={JSON.stringify(props.setting)}
    />
  ),
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const theme = extendBaseTheme({ components: { Alert: chakraTheme.components.Alert } });

const order = (id, order_status, payment_status, extra = {}) => ({
  id,
  order_id: `ORD-00${id}`,
  table_number: `${id}`,
  order_status,
  payment_status,
  date: `2026-01-02T1${id}:30:00`,
  final_amount: 100 + id,
  ...extra,
});

const dashboard = () => ({
  todays_newly_placed_orders: [order(1, 'Placed', 'Pending'), order(2, 'Placed', 'Pending')],
  todays_pending_orders: [order(3, 'Confirm', 'Pending'), order(4, 'Confirm', 'Pending')],
  todays_served_orders: [order(5, 'Served', 'Pending'), order(6, 'Served', 'Pending')],
  todays_paid_orders: [order(7, 'Served', 'Paid')],
  todays_completed_orders: [order(8, 'Served', 'Completed')],
  todays_cancelled_orders: [order(9, 'Cancelled', 'Pending')],
  setting: { discount_in: 'Discount in (%)' },
  tenant: { name: 'Test Restro' },
  order_item: [
    { id: 11, order_id: 'ORD-001' },
    { id: 12, order_id: 'ORD-001' },
    { id: 13, order_id: 'ORD-003' },
  ],
});

let root;
let container;

// Readable, and blind to whitespace inside class attributes and to attribute order (the browser ignores both).
function pretty(html) {
  return html
    .replace(/class="([^"]*)"/g, (_, value) => `class="${value.trim().replace(/\s+/g, ' ')}"`)
    .replace(/<([a-z0-9]+)((?:\s+[\w:-]+(?:="[^"]*")?)+)\s*>/gi, (_, tag, attrs) => `<${tag} ${(attrs.match(/[\w:-]+(?:="[^"]*")?/g) || []).sort().join(' ')}>`)
    .replace(/></g, '>\n<');
}

// What a step looked like. The full markup is kept as a hash (so any change still fails the snapshot) next to
// the readable parts, which show what changed when it does. `calls` lists only what happened since the last one.
let reportedCalls = 0;
function snap(label) {
  const newCalls = calls.slice(reportedCalls);
  reportedCalls = calls.length;
  const alert = document.getElementById('pot');
  const bulk = document.getElementById('allupdate');
  const model = document.getElementById('order-model');
  return {
    label,
    markup: createHash('sha1').update(pretty(document.body.innerHTML)).digest('hex').slice(0, 12),
    tab: localStorage.getItem('selectedTab'),
    rows: Array.from(document.querySelectorAll('[class*="columnData8"]')).map((el) => el.textContent),
    tabs: Array.from(document.querySelectorAll('input[name="group"]')).map((el) => `${el.id}=${el.checked}`),
    ticked: Array.from(document.querySelectorAll('input[type="checkbox"]')).map((el) => (el.checked ? 'x' : el.disabled ? '-' : '.')).join(''),
    bulk: bulk && {
      display: bulk.style.display,
      pointerEvents: bulk.style.pointerEvents,
      buttons: Array.from(bulk.querySelectorAll('button')).map((b) => `${b.textContent}:${b.disabled ? 'off' : 'on'}:${b.style.opacity}`),
    },
    model: model && { ...model.dataset },
    alert: alert ? alert.textContent : null,
    calls: JSON.parse(JSON.stringify(newCalls)),
  };
}

async function mount({ data = dashboard(), props = {}, tab, tenant = true } = {}) {
  mockDashboard = data;
  mockBulkResult = { success: true };
  if (tab) localStorage.setItem('selectedTab', tab);
  if (!tenant) localStorage.removeItem('tenantInfo');
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  await render(props);
}

async function render(props = {}) {
  await act(async () => {
    root.render(
      <ChakraBaseProvider theme={theme}>
        <AppProvider>
          <TodayOrder {...props} />
        </AppProvider>
      </ChakraBaseProvider>,
    );
  });
}

const click = (el) => act(async () => { el.click(); });
const tabLabel = (id) => document.querySelector(`label[for="${id}"]`);
const rowBoxes = () => Array.from(document.querySelectorAll('input[type="checkbox"]#checkbox'));
const parentBox = () => document.getElementById('ParentCheckbox');
const tick = (el, checked) => act(async () => { el.click(); if (checked !== undefined) expect(el.checked).toBe(checked); });
const bulkButton = (text) => Array.from(document.querySelectorAll('#allupdate button')).find((b) => b.textContent === text);

beforeEach(() => {
  calls.length = 0;
  reportedCalls = 0;
  localStorage.clear();
  localStorage.setItem('tenantInfo', JSON.stringify({ tenant_name: 'demo' }));
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
  ['Newly_placed', 'Pending', 'Served', 'Paid', 'Completed', 'Cancelled'].forEach((tab) => {
    test(`on the ${tab} tab`, async () => {
      await mount({ tab });
      expect(snap(tab)).toMatchSnapshot();
    });
  });

  test('first visit starts on the placed tab', async () => {
    await mount();
    expect(snap('first visit')).toMatchSnapshot();
  });

  test('while loading', async () => {
    await mount({ data: 'never' });
    expect(snap('loading')).toMatchSnapshot();
  });

  test('no orders', async () => {
    const empty = dashboard();
    Object.keys(empty).filter((key) => key.startsWith('todays_')).forEach((key) => { empty[key] = []; });
    await mount({ data: empty });
    expect(snap('empty')).toMatchSnapshot();
  });

  test('not signed in to a restaurant does not load anything', async () => {
    await mount({ tenant: false });
    expect(snap('no tenant')).toMatchSnapshot();
  });
});

describe('tabs', () => {
  test('switching through every tab', async () => {
    await mount();
    const trail = [];
    for (const id of ['pending_order', 'served_order', 'paid_order', 'completed', 'cancelled', 'newly_placed']) {
      await click(tabLabel(id));
      trail.push(snap(`tab ${id}`));
    }
    expect(trail).toMatchSnapshot();
  });

  test('switching tabs clears ticked orders', async () => {
    await mount();
    const trail = [];
    await tick(rowBoxes()[0], true);
    trail.push(snap('ticked one'));
    await click(tabLabel('pending_order'));
    trail.push(snap('after switching'));
    expect(trail).toMatchSnapshot();
  });

  test('reloading keeps the tab the user was on', async () => {
    await mount();
    const trail = [];
    await click(tabLabel('served_order'));
    mockDashboard = { ...dashboard(), todays_served_orders: [order(21, 'Served', 'Pending')] };
    await render({ recall: true });
    trail.push(snap('after recall'));
    expect(trail).toMatchSnapshot();
  });
});

describe('ticking orders', () => {
  test('ticking one, two, then untick', async () => {
    await mount();
    const trail = [];
    await tick(rowBoxes()[0], true);
    trail.push(snap('first'));
    await tick(rowBoxes()[1], true);
    trail.push(snap('both'));
    await tick(rowBoxes()[0], false);
    trail.push(snap('first off'));
    expect(trail).toMatchSnapshot();
  });

  test('the parent box ticks and unticks everything', async () => {
    await mount();
    const trail = [];
    await tick(parentBox(), true);
    trail.push(snap('all'));
    await tick(parentBox(), false);
    trail.push(snap('none'));
    expect(trail).toMatchSnapshot();
  });

  test('the parent box on an empty tab warns', async () => {
    const data = dashboard();
    data.todays_newly_placed_orders = [];
    await mount({ data });
    await tick(parentBox());
    expect(snap('nothing to tick')).toMatchSnapshot();
  });

  test('cancelled orders cannot be ticked', async () => {
    await mount({ tab: 'Cancelled' });
    expect(snap('cancelled tab')).toMatchSnapshot();
  });
});

describe('bulk updates', () => {
  const successResult = () => ({
    success: true,
    ...Object.fromEntries(
      Object.entries(dashboard()).filter(([key]) => key.startsWith('todays_')),
    ),
    order_items: [{ id: 99, order_id: 'ORD-001' }],
  });

  test('which buttons are on for each tab with something ticked', async () => {
    await mount();
    const trail = [];
    for (const id of ['newly_placed', 'pending_order', 'served_order', 'paid_order']) {
      await click(tabLabel(id));
      await tick(parentBox(), true);
      trail.push(snap(`ticked all on ${id}`));
    }
    expect(trail).toMatchSnapshot();
  });

  test('confirm the placed orders', async () => {
    await mount();
    mockBulkResult = {
      ...successResult(),
      todays_newly_placed_orders: [],
      todays_pending_orders: [order(1, 'Confirm', 'Pending'), order(2, 'Confirm', 'Pending'), order(3, 'Confirm', 'Pending')],
    };
    await tick(parentBox(), true);
    await click(bulkButton('Confirm'));
    expect(snap('confirmed')).toMatchSnapshot();
  });

  test('serve the confirmed orders and show the result on the served tab', async () => {
    await mount();
    await click(tabLabel('pending_order'));
    await tick(parentBox(), true);
    mockBulkResult = successResult();
    await click(tabLabel('served_order'));
    await tick(parentBox(), true);
    await click(bulkButton('Served'));
    expect(snap('served')).toMatchSnapshot();
  });

  test('complete and set pending payment for served orders', async () => {
    await mount();
    const trail = [];
    mockBulkResult = successResult();
    await click(tabLabel('served_order'));
    await tick(rowBoxes()[0], true);
    await click(bulkButton('Completed'));
    trail.push(snap('completed'));
    await tick(rowBoxes()[0], true);
    await click(bulkButton('Pending'));
    trail.push(snap('pending'));
    expect(trail).toMatchSnapshot();
  });

  test('cancel orders', async () => {
    await mount();
    await tick(rowBoxes()[1], true);
    await click(bulkButton('Order cancel'));
    expect(snap('cancelled')).toMatchSnapshot();
  });

  test('the server says no', async () => {
    await mount();
    mockBulkResult = successResult();
    await tick(rowBoxes()[1], true);
    await click(bulkButton('Order cancel'));
    mockBulkResult = { success: false };
    await tick(rowBoxes()[0], true);
    await click(bulkButton('Order cancel'));
    expect(snap('refused')).toMatchSnapshot();
  });

  test('Placed is never available', async () => {
    await mount();
    await tick(parentBox(), true);
    const placed = bulkButton('Placed');
    expect([placed.disabled, placed.style.opacity]).toMatchSnapshot();
  });
});

describe('opening an order', () => {
  test('More opens the order with its items', async () => {
    await mount();
    const trail = [];
    await click(Array.from(document.querySelectorAll('button')).filter((b) => b.textContent === 'More')[0]);
    trail.push(snap('first order'));
    await click(tabLabel('pending_order'));
    await click(Array.from(document.querySelectorAll('button')).filter((b) => b.textContent === 'More')[0]);
    trail.push(snap('an order from another tab'));
    expect(trail).toMatchSnapshot();
  });
});
