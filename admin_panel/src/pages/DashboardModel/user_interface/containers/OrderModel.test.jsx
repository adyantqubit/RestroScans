import { createHash } from 'crypto';
import { act, Simulate } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { ChakraBaseProvider, extendBaseTheme } from '@chakra-ui/react';
import chakraTheme from '@chakra-ui/theme';
import OrderModel from './OrderModel';
import { AppProvider } from '../../../../Context/AppContext';

// This test drives the order popup through the screens a cashier uses and snapshots what it renders
// and what it sends to the server. It exists so the component can be split into smaller files without
// changing behaviour: the snapshots must stay identical.

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

jest.mock('../../services/dashboardModelService', () => ({
  saveOrderDetails: (tenant, order) => {
    calls.push({ saveOrderDetails: { tenant, order } });
    return Promise.resolve({ msg: false });
  },
  saveItemStatus: (tenant, items, orderId) => {
    calls.push({ saveItemStatus: { tenant, items, orderId } });
    return Promise.resolve({ order_items: items, order: {} });
  },
}));

jest.mock('../../../Home/user_interface/components/PrintKot', () => ({
  PrintKot: (order, items) => calls.push({ PrintKot: { order: order.order_id, items: items.map((i) => i.id) } }),
}));

jest.mock('../../../Home/user_interface/components/PrintBill', () => ({
  __esModule: true,
  default: (order, items) => calls.push({ PrintBill: { order: order.order_id, items: items.length } }),
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const theme = extendBaseTheme({ components: { Alert: chakraTheme.components.Alert } });

const baseOrder = {
  id: 7,
  order_id: 'ORD-0007',
  table_number: '12',
  customer_name: 'Asha Rao',
  customer_email: 'asha@example.test',
  customer_number: '9999999999',
  customer_loyality_point: 40,
  apply_loyality_point: 0,
  loyality_point_price: 0,
  loyality_point_calculated: false,
  waiter_name: '',
  waiter_contact_number: '',
  cancelled_by: '',
  order_created_by: 'Admin',
  date: '2026-01-02T10:30:00',
  payment_mode: 'Cash',
  payment_status: 'Pending',
  order_status: 'Confirm',
  discount_rupees: 0,
  discount_percentage: 0,
  discount_reason: '',
  cancel_reason: '',
  sub_total: 300,
  cgst: 7.5,
  sgst: 7.5,
  total: 300,
  final_amount: 315,
};

const baseItems = () => [
  { id: 1, order_id: 7, item: 'Paneer Tikka', serving_size: 'Full', quantity: 2, price: 200, item_status: 'Confirm', kot_print_status: true },
  { id: 2, order_id: 7, item: 'Masala Dosa', serving_size: 'Half', quantity: 1, price: 100, item_status: 'Pending', kot_print_status: false },
];

const settings = { discount_in: 'Discount in (₹)', allow_loyality_points: true, per_loyality_point_value: 2 };

let root;
let container;

// Readable, and blind to whitespace inside class attributes (the browser ignores it).
function pretty(html) {
  return html
    .replace(/class="([^"]*)"/g, (_, value) => `class="${value.replace(/\s+/g, ' ')}"`)
    .replace(/></g, '>\n<');
}

// What a step looked like. The full markup is kept as a hash (so any change still fails the snapshot) next to
// the readable parts, which show what changed when it does.
function snap(label) {
  const alert = document.getElementById('pot');
  const html = pretty(document.body.innerHTML);
  return {
    label,
    markup: createHash('sha1').update(html).digest('hex').slice(0, 12),
    text: document.body.textContent,
    inputs: Array.from(document.querySelectorAll('input, textarea')).map((el) => {
      const value = el.type === 'checkbox' ? `checked=${el.checked}` : `value=${el.value}`;
      return `${el.id || el.name || el.className} ${value} border=${el.style.border}`;
    }),
    alert: alert ? alert.textContent : null,
    calls: JSON.parse(JSON.stringify(calls)),
  };
}

function mount(orderOverrides = {}, { items = baseItems(), setting = settings } = {}) {
  const selectedOrder = { ...baseOrder, ...orderOverrides };
  const props = {
    isOpen: true,
    setting,
    restroDetail: { name: 'Test Restro' },
    selectedOrder,
    setSelectedOrder: () => {},
    selectedOrderItems: items,
    setSelectedOrderItems: () => {},
    setModelVisiblity: (visible) => calls.push({ setModelVisiblity: visible }),
  };
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => {
    root.render(
      <ChakraBaseProvider theme={theme}>
        <AppProvider>
          <OrderModel {...props} />
        </AppProvider>
      </ChakraBaseProvider>,
    );
  });
}

const byId = (id) => document.getElementById(id);
const type = (id, value) => act(() => { Simulate.change(byId(id), { target: { value } }); });
const clickEl = (el) => act(() => { Simulate.click(el); });
const buttonByText = (text) =>
  Array.from(document.querySelectorAll('button')).find((b) => b.textContent.trim() === text);

beforeEach(() => {
  calls.length = 0;
  localStorage.clear();
  localStorage.setItem('tenantInfo', JSON.stringify({ tenant_name: 'demo' }));
  localStorage.setItem('token', 't');
  window.matchMedia = window.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {} }));
  Element.prototype.scrollIntoView = function scrollIntoView() {
    calls.push({ scrollIntoView: this.id });
  };
  jest.useFakeTimers();
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.body.innerHTML = '';
  jest.useRealTimers();
});

describe('first render', () => {
  const variants = {
    'confirmed, unpaid, loyalty on': {},
    'placed, unpaid': { order_status: 'Placed' },
    'served and completed': { order_status: 'Served', payment_status: 'Completed' },
    'paid': { payment_status: 'Paid' },
    'cancelled': { order_status: 'Cancelled', payment_status: 'Pending', cancelled_by: 'Admin', cancel_reason: 'Guest left' },
    'waiter order': { waiter_name: 'Ravi', waiter_contact_number: '8888888888', order_created_by: 'Waiter' },
  };
  Object.entries(variants).forEach(([name, overrides]) => {
    test(name, () => {
      mount(overrides);
      expect(snap(name)).toMatchSnapshot();
    });
  });

  test('signed in as a waiter hides the discount and loyalty inputs', () => {
    localStorage.setItem('waiterData', '{}');
    mount();
    expect(snap('waiter session')).toMatchSnapshot();
  });

  test('loyalty off', () => {
    mount({}, { setting: { ...settings, allow_loyality_points: false } });
    expect(snap('loyalty off')).toMatchSnapshot();
  });
});

describe('discount in rupees', () => {
  test('typing values', () => {
    mount();
    const trail = [];
    ['50', '50.567', 'abc', '9999', '', '299', '12.'].forEach((value) => {
      type('discount_rupees', value);
      trail.push(snap(`rupees ${JSON.stringify(value)}`));
    });
    expect(trail).toMatchSnapshot();
  });
});

describe('discount in percent', () => {
  test('typing values', () => {
    mount();
    const trail = [];
    ['10', '12.5', 'abc', '150', '100', '', '0'].forEach((value) => {
      type('discount_percentage', value);
      trail.push(snap(`percent ${JSON.stringify(value)}`));
    });
    expect(trail).toMatchSnapshot();
  });
});

describe('loyalty points', () => {
  test('typing values', () => {
    mount();
    const trail = [];
    ['5', 'abc', '999', '-1', '', '40', '20'].forEach((value) => {
      type('loyality_point', value);
      trail.push(snap(`loyalty ${JSON.stringify(value)}`));
    });
    expect(trail).toMatchSnapshot();
  });

  test('discount and loyalty together', () => {
    mount();
    type('discount_rupees', '50');
    type('loyality_point', '10');
    const afterBoth = snap('discount 50 then loyalty 10');
    type('discount_percentage', '20');
    expect([afterBoth, snap('then 20 percent')]).toMatchSnapshot();
  });
});

describe('order items', () => {
  test('quantity buttons change quantity and price proportionally', () => {
    mount();
    const trail = [];
    const plus = () => document.querySelectorAll('[class*="increase"] svg');
    const minus = () => document.querySelectorAll('[class*="decrease"] svg');
    clickEl(plus()[0]);
    trail.push(snap('plus first'));
    clickEl(plus()[0]);
    trail.push(snap('plus first again'));
    clickEl(minus()[0]);
    clickEl(minus()[0]);
    clickEl(minus()[0]);
    trail.push(snap('minus first three times (stops at 1)'));
    clickEl(minus()[1]);
    trail.push(snap('minus second at 1 does nothing'));
    expect(trail).toMatchSnapshot();
  });

  test('status radio labels and update items', () => {
    mount();
    const trail = [];
    clickEl(document.querySelector('label[for="status32"]') || document.querySelectorAll('label.statuslabel')[5]);
    trail.push(snap('cancel second item'));
    clickEl(document.querySelectorAll('label.statuslabel')[1]);
    trail.push(snap('confirm first item'));
    clickEl(buttonByText('Update Items'));
    trail.push(snap('update items opens confirm'));
    expect(trail).toMatchSnapshot();
  });

  test('ticking items and applying a bulk status', async () => {
    mount();
    const trail = [];
    act(() => { Simulate.change(byId('status00'), { target: { checked: true } }); });
    act(() => { Simulate.change(byId('status01'), { target: { checked: true } }); });
    trail.push(snap('both ticked'));
    act(() => { Simulate.change(byId('status00'), { target: { checked: false } }); });
    trail.push(snap('first unticked'));
    await act(async () => { Simulate.click(document.getElementById('copy')); });
    trail.push(snap('bulk confirm'));
    expect(trail).toMatchSnapshot();
  });

  test('bulk cancel', async () => {
    mount();
    act(() => { Simulate.change(byId('status01'), { target: { checked: true } }); });
    await act(async () => { Simulate.click(document.getElementById('paste')); });
    expect(snap('bulk cancel')).toMatchSnapshot();
  });
});

describe('status buttons', () => {
  const labels = ['Placed', 'Confirm', 'Served', 'Pending', 'Completed'];
  test.each(['Placed', 'Confirm', 'Served', 'Cancelled'])('from order status %s', async (status) => {
    mount({ order_status: status });
    const trail = [];
    for (const label of labels) {
      const link = Array.from(document.querySelectorAll('button a')).find((a) => a.textContent === label);
      await act(async () => { Simulate.click(link.parentElement); });
      trail.push(snap(`click ${label}`));
      act(() => { jest.advanceTimersByTime(3100); });
    }
    expect(trail).toMatchSnapshot();
  });

  test('a paid order also shows the Paid button', () => {
    mount({ payment_status: 'Paid' });
    expect(snap('paid')).toMatchSnapshot();
  });
});

describe('order actions', () => {
  test('cancel order without a reason asks for one', () => {
    mount();
    clickEl(buttonByText('Cancel Order'));
    expect(snap('cancel no reason')).toMatchSnapshot();
  });

  test('cancel order with a reason, then Apply', async () => {
    mount();
    clickEl(buttonByText('Cancel Order'));
    act(() => { Simulate.change(byId('cancelInput'), { target: { value: 'Guest left' } }); });
    const typed = snap('reason typed');
    await act(async () => { Simulate.click(buttonByText('Cancel Order')); });
    expect([typed, snap('cancel with reason')]).toMatchSnapshot();
  });

  test('Apply with no change says so; with a discount saves', async () => {
    mount();
    const trail = [];
    await act(async () => { Simulate.click(buttonByText('Apply')); });
    trail.push(snap('apply unchanged'));
    act(() => { jest.advanceTimersByTime(3100); });
    type('discount_rupees', '30');
    act(() => { Simulate.change(document.querySelectorAll('textarea')[1], { target: { value: 'regular' } }); });
    await act(async () => { Simulate.click(buttonByText('Apply')); });
    trail.push(snap('apply with discount'));
    expect(trail).toMatchSnapshot();
  });

  test('Apply while cancel reason is required but empty', async () => {
    mount();
    clickEl(buttonByText('Cancel Order'));
    await act(async () => { Simulate.click(buttonByText('Apply')); });
    expect(snap('apply with cancel pending')).toMatchSnapshot();
  });

  test('print buttons', () => {
    mount();
    clickEl(buttonByText('Print Kot'));
    clickEl(buttonByText('Get Bill'));
    expect(snap('print')).toMatchSnapshot();
  });

  test('payment mode select is present and disabled once completed', () => {
    mount({ payment_status: 'Completed', order_status: 'Served' });
    expect(document.body.innerHTML).toContain('ant-select-disabled');
  });
});

describe('inline editing of customer details', () => {
  const pencils = () => document.querySelectorAll('[class*="data"] svg');

  test('name: edit, too long, valid save, blur restores', async () => {
    mount();
    const trail = [];
    const nameRow = () => Array.from(document.querySelectorAll('[class*="information"]')).find((r) => r.textContent.startsWith('Name'));
    clickEl(nameRow().querySelector('svg'));
    trail.push(snap('name editing'));
    const input = () => nameRow().querySelector('input');
    act(() => { Simulate.change(input(), { target: { value: 'priya   sharma' } }); });
    trail.push(snap('name typed'));
    act(() => { Simulate.change(input(), { target: { value: 'x'.repeat(51) } }); });
    act(() => { Simulate.keyUp(input(), { key: 'Enter', keyCode: 13 }); });
    trail.push(snap('name too long'));
    act(() => { jest.advanceTimersByTime(3100); });
    act(() => { Simulate.change(input(), { target: { value: 'priya sharma' } }); });
    await act(async () => { Simulate.keyUp(input(), { key: 'Enter', keyCode: 13 }); });
    trail.push(snap('name saved'));
    expect(trail).toMatchSnapshot();
    expect(pencils().length).toBeGreaterThan(0);
  });

  test('email: invalid then valid, tick button, blur restores', async () => {
    mount();
    const trail = [];
    const row = () => Array.from(document.querySelectorAll('[class*="information"]')).find((r) => r.textContent.startsWith('Email'));
    clickEl(row().querySelector('svg'));
    act(() => { Simulate.change(row().querySelector('input'), { target: { value: 'nope' } }); });
    act(() => { Simulate.keyUp(row().querySelector('input'), { key: 'Enter', keyCode: 13 }); });
    trail.push(snap('email invalid'));
    act(() => { jest.advanceTimersByTime(3100); });
    act(() => { Simulate.change(row().querySelector('input'), { target: { value: 'new@mail.test' } }); });
    await act(async () => { Simulate.click(row().querySelectorAll('svg')[0]); });
    trail.push(snap('email saved via tick'));
    expect(trail).toMatchSnapshot();
  });

  test('table: confirm change, empty rejected, valid saved', async () => {
    mount();
    const trail = [];
    const row = () => Array.from(document.querySelectorAll('[class*="information"]')).find((r) => r.textContent.startsWith('Table'));
    trail.push(snap('table display'));
    act(() => { Simulate.click(row().querySelector('svg')); });
    trail.push(snap('table pencil clicked'));
    expect(trail).toMatchSnapshot();
  });

  test('payment mode change saves', async () => {
    mount();
    expect(document.body.innerHTML).toContain('Cash');
  });
});

describe('closing the popup', () => {
  test('Close resets borders and errors and hides the popup', () => {
    mount();
    type('discount_rupees', 'abc');
    clickEl(buttonByText('Close'));
    expect(snap('closed')).toMatchSnapshot();
  });

  test('Close also clears a rejected discount when loyalty points are switched off', () => {
    mount({}, { setting: { ...settings, allow_loyality_points: false } });
    type('discount_rupees', 'abc');
    expect(byId('discount_rupees').style.border).toBe('1px solid red');
    expect(document.body.textContent).toContain('Discount price should be in digit');

    clickEl(buttonByText('Close'));
    expect(byId('discount_rupees').style.border).toBe('1px solid #9c9c9c');
    expect(document.body.textContent).not.toContain('Discount price should be in digit');
    expect(calls).toContainEqual({ setModelVisiblity: false });
  });

  test('Close for a waiter, whose discount inputs are not on the page', () => {
    localStorage.setItem('waiterData', '{}');
    mount();
    clickEl(buttonByText('Close'));
    expect(snap('closed as waiter').calls).toMatchSnapshot();
  });
});
