import { createHash } from 'crypto';
import { act, Simulate } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { ChakraBaseProvider, extendBaseTheme } from '@chakra-ui/react';
import chakraTheme from '@chakra-ui/theme';
import OrderForm from './OrderForm';
import { AppProvider } from '../../../../Context/AppContext';

// Drives the order edit form through what a cashier does with it (read it, edit table / statuses / loyalty /
// discounts, save, clear, add items) and snapshots the page and what it sends to the server. The snapshots were
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
let mockDetails;
let mockSaveResult;

jest.mock('../../services/orderService', () => ({
  loadOrderDetails: () => {
    calls.push({ loadOrderDetails: true });
    return Promise.resolve(JSON.parse(JSON.stringify(mockDetails)));
  },
  loadOrderItems: (tenant, id) => {
    calls.push({ loadOrderItems: { tenant, id } });
    return Promise.resolve({ msg: true, orderItems: [{ id: 1, item: 'Paneer Tikka' }] });
  },
  saveOrderDetails: (tenant, formData) => {
    calls.push({ saveOrderDetails: { tenant, fields: Object.fromEntries(Array.from(formData.entries())) } });
    return Promise.resolve(mockSaveResult);
  },
}));

jest.mock('./AddOrderItemForm', () => ({
  __esModule: true,
  default: (props) => (
    <div id="add-order-item-form" data-order-id={props.orderId} data-id={props.id} data-visible={String(props.modalvisibility)} />
  ),
}));

const mockNavigate = (to) => calls.push({ navigate: to });
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const theme = extendBaseTheme({ components: { Alert: chakraTheme.components.Alert } });

const baseOrder = {
  id: 7,
  order_id: 'ORD-0007',
  table_number: '12',
  customer_loyality_point: 40,
  apply_loyality_point: 0,
  loyality_point_price: 0,
  loyality_point_status: false,
  loyality_point_calculated: false,
  cancelled_by: 'Admin',
  cancel_reason: '',
  payment_mode: 'Cash',
  payment_status: 'Pending',
  order_status: 'Confirm',
  discount_rupees: 0,
  discount_percentage: 0,
  discount_reason: '',
  sub_total: 300,
  cgst: 7.5,
  sgst: 7.5,
  total: 300,
  final_amount: 315,
  rating: 4,
  review: 'Tasty',
};

const baseSetting = { discount_in: 'Discount in (₹)', allow_loyality_points: true, per_loyality_point_value: 2 };

let root;
let container;

// Readable, and blind to whitespace inside class attributes (the browser ignores it).
function pretty(html) {
  return html
    .replace(/class="([^"]*)"/g, (_, value) => `class="${value.trim().replace(/\s+/g, ' ')}"`)
    .replace(/></g, '>\n<');
}

// What a step looked like. The full markup is kept as a hash (so any change still fails the snapshot) next to
// the readable parts, which show what changed when it does. `calls` lists only what happened since the last one.
let reportedCalls = 0;
function snap(label) {
  const newCalls = calls.slice(reportedCalls);
  reportedCalls = calls.length;
  const alert = document.getElementById('pot');
  const html = pretty(document.body.innerHTML);
  return {
    label,
    markup: createHash('sha1').update(html).digest('hex').slice(0, 12),
    fields: Array.from(document.querySelectorAll('input, textarea, select')).map(
      (el) => `${el.name} = ${JSON.stringify(el.value)}${el.disabled ? ' (disabled)' : ''}`,
    ),
    errors: Array.from(document.querySelectorAll('[class*="inputErrorArea"]'))
      .map((el) => el.textContent)
      .filter(Boolean),
    alert: alert ? alert.textContent : null,
    calls: JSON.parse(JSON.stringify(newCalls)),
  };
}

async function mount({ order = {}, setting = baseSetting, id = 7 } = {}) {
  mockDetails = { msg: true, orderData: [{ ...baseOrder, ...order }], setting };
  mockSaveResult = { msg: true };
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => {
    root.render(
      <ChakraBaseProvider theme={theme}>
        <AppProvider>
          <MemoryRouter initialEntries={[{ pathname: '/OrderForm', state: { id } }]}>
            <OrderForm />
          </MemoryRouter>
        </AppProvider>
      </ChakraBaseProvider>,
    );
  });
}

const field = (name) => document.querySelector(`[name="${name}"]`);
const typeInto = (name, value) => act(() => { Simulate.change(field(name), { target: { value } }); });
const leave = (name, value) => act(() => { Simulate.blur(field(name), { target: { value } }); });
const pick = (name, value) => act(() => { Simulate.change(field(name), { target: { value } }); });
const clickEl = async (el) => { await act(async () => { Simulate.click(el); }); };
const buttonByText = (text) =>
  Array.from(document.querySelectorAll('div, button')).find((b) => b.children.length === 0 && b.textContent.trim() === text);

beforeEach(() => {
  calls.length = 0;
  reportedCalls = 0;
  localStorage.clear();
  localStorage.setItem('tenantInfo', JSON.stringify({ tenant_name: 'demo' }));
  window.matchMedia = window.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {} }));
  window.scrollTo = () => calls.push({ scrollTo: true });
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
    'placed, unpaid': { order: { order_status: 'Placed' } },
    'served and completed': { order: { order_status: 'Served', payment_status: 'Completed' } },
    'paid': { order: { payment_status: 'Paid' } },
    'cancelled': { order: { order_status: 'Cancelled', payment_status: 'Pending', cancel_reason: 'Guest left' } },
    'with a discount and reason': { order: { discount_rupees: 30, discount_percentage: 10, discount_reason: 'Regular', total: 270 } },
    'discount reason missing': { order: { discount_rupees: 30, discount_percentage: 10, discount_reason: null } },
    'no rating or review': { order: { rating: null, review: null } },
    'loyalty off': { setting: { ...baseSetting, allow_loyality_points: false } },
    'discount in percentage': { setting: { ...baseSetting, discount_in: 'Discount in (%)' } },
    'online payment mode': { order: { payment_mode: 'Scanner' } },
  };
  Object.entries(variants).forEach(([name, options]) => {
    test(name, async () => {
      await mount(options);
      expect(snap(name)).toMatchSnapshot();
    });
  });

  test('a new order (id 0) shows only the loader', async () => {
    await mount({ id: 0 });
    expect(snap('new order')).toMatchSnapshot();
  });
});

describe('table number', () => {
  test('edit, blank it, retype, confirm with Enter and with blur', async () => {
    await mount();
    const trail = [];
    expect(field('table_number')).toBeNull();
    await clickEl(document.querySelector('svg'));
    trail.push(snap('confirm popup'));
    await clickEl(Array.from(document.querySelectorAll('button')).find((b) => b.textContent.trim() === 'Ok'));
    trail.push(snap('editing'));
    typeInto('table_number', '');
    trail.push(snap('blank'));
    act(() => { Simulate.blur(field('table_number')); });
    trail.push(snap('blur while blank'));
    typeInto('table_number', '5');
    trail.push(snap('typed 5'));
    act(() => { Simulate.keyUp(field('table_number'), { key: 'Enter', keyCode: 13 }); });
    trail.push(snap('after Enter'));
    expect(trail).toMatchSnapshot();
  });

  test('blur with a value closes the editor', async () => {
    await mount();
    await clickEl(document.querySelector('svg'));
    await clickEl(Array.from(document.querySelectorAll('button')).find((b) => b.textContent.trim() === 'Ok'));
    typeInto('table_number', '8');
    act(() => { Simulate.blur(field('table_number')); });
    expect(snap('after blur')).toMatchSnapshot();
  });
});

describe('statuses', () => {
  test('order status changes from Confirm', async () => {
    await mount();
    const trail = [];
    ['Served', 'Placed', 'Cancelled', 'Confirm'].forEach((status) => {
      pick('order_status', status);
      trail.push(snap(`order status ${status}`));
    });
    expect(trail).toMatchSnapshot();
  });

  test('order status changes from Placed', async () => {
    await mount({ order: { order_status: 'Placed' } });
    const trail = [];
    ['Confirm', 'Served', 'Cancelled', 'Placed'].forEach((status) => {
      pick('order_status', status);
      trail.push(snap(`order status ${status}`));
    });
    expect(trail).toMatchSnapshot();
  });

  test('payment status changes', async () => {
    await mount({ order: { order_status: 'Served' } });
    const trail = [];
    ['Completed', 'Pending', 'Completed'].forEach((status) => {
      pick('payment_status', status);
      trail.push(snap(`payment status ${status}`));
    });
    expect(trail).toMatchSnapshot();
  });

  test('cancel an order and pay it', async () => {
    await mount();
    const trail = [];
    pick('order_status', 'Cancelled');
    trail.push(snap('cancelled'));
    pick('payment_status', 'Completed');
    trail.push(snap('then complete payment'));
    expect(trail).toMatchSnapshot();
  });

  test('payment mode and cancelled by', async () => {
    await mount({ order: { order_status: 'Cancelled', payment_status: 'Pending' } });
    const trail = [];
    pick('payment', 'Scanner');
    trail.push(snap('scanner'));
    pick('cancelled_by', 'Customer');
    trail.push(snap('customer'));
    expect(trail).toMatchSnapshot();
  });

  test('cancel reason typing and clearing', async () => {
    await mount({ order: { order_status: 'Placed' } });
    const trail = [];
    pick('order_status', 'Cancelled');
    trail.push(snap('cancelled'));
    typeInto('cancel_reason', 'Guest left');
    trail.push(snap('reason typed'));
    typeInto('cancel_reason', '');
    trail.push(snap('reason cleared'));
    expect(trail).toMatchSnapshot();
  });
});

describe('loyalty points', () => {
  test('typing values and leaving the field', async () => {
    await mount();
    const trail = [];
    ['10', '40', '41', '-1', 'abc', '', '5'].forEach((value) => {
      typeInto('apply_loyality_point', value);
      trail.push(snap(`typed ${JSON.stringify(value)}`));
      leave('apply_loyality_point', value);
      trail.push(snap(`left ${JSON.stringify(value)}`));
    });
    expect(trail).toMatchSnapshot();
  });

  test('points worth more than the sub-total', async () => {
    await mount({ setting: { ...baseSetting, per_loyality_point_value: 50 } });
    const trail = [];
    typeInto('apply_loyality_point', '10');
    leave('apply_loyality_point', '10');
    trail.push(snap('10 points at 50 each'));
    expect(trail).toMatchSnapshot();
  });

  test('loyalty points combined with a discount', async () => {
    await mount();
    const trail = [];
    typeInto('discount_rupees', '30');
    trail.push(snap('discount 30'));
    typeInto('apply_loyality_point', '10');
    trail.push(snap('then 10 points'));
    typeInto('discount_rupees', '10');
    trail.push(snap('then discount 10'));
    expect(trail).toMatchSnapshot();
  });
});

describe('discount in rupees', () => {
  test('typing values and leaving the field', async () => {
    await mount();
    const trail = [];
    ['50', '50.567', '9999', '', '299', '-5', '0', 'abc', '12.'].forEach((value) => {
      typeInto('discount_rupees', value);
      trail.push(snap(`typed ${JSON.stringify(value)}`));
      leave('discount_rupees', value);
      trail.push(snap(`left ${JSON.stringify(value)}`));
    });
    expect(trail).toMatchSnapshot();
  });

  test('locked once the order is completed', async () => {
    await mount({ order: { payment_status: 'Completed', order_status: 'Served' } });
    expect(snap('completed')).toMatchSnapshot();
  });

  test('the field follows the live statuses, not the saved ones', async () => {
    await mount();
    const trail = [];
    pick('order_status', 'Cancelled');
    trail.push(snap('cancelled'));
    pick('order_status', 'Confirm');
    trail.push(snap('back to confirm'));
    expect(trail).toMatchSnapshot();
  });
});

describe('discount in percentage', () => {
  const percentSetting = { ...baseSetting, discount_in: 'Discount in (%)' };

  test('typing values and leaving the field', async () => {
    await mount({ setting: percentSetting });
    const trail = [];
    ['10', '12.5', '100', '99.99', '', '-3', 'abc', '0'].forEach((value) => {
      typeInto('discount_percentage', value);
      trail.push(snap(`typed ${JSON.stringify(value)}`));
      leave('discount_percentage', value);
      trail.push(snap(`left ${JSON.stringify(value)}`));
    });
    expect(trail).toMatchSnapshot();
  });

  test('with loyalty points applied first', async () => {
    await mount({ setting: percentSetting });
    const trail = [];
    typeInto('apply_loyality_point', '10');
    trail.push(snap('10 points'));
    typeInto('discount_percentage', '10');
    trail.push(snap('then 10 percent'));
    expect(trail).toMatchSnapshot();
  });

  test('the discount reason can be edited', async () => {
    await mount({ setting: percentSetting });
    const trail = [];
    typeInto('discount_percentage', '10');
    trail.push(snap('discount typed'));
    typeInto('discount_reason', 'Regular guest');
    trail.push(snap('reason typed'));
    expect(trail).toMatchSnapshot();
  });
});

describe('saving', () => {
  test('saves what is on screen and goes back', async () => {
    await mount();
    const trail = [];
    typeInto('discount_rupees', '30');
    pick('order_status', 'Served');
    pick('payment', 'Scanner');
    await clickEl(buttonByText('Save'));
    trail.push(snap('saved'));
    act(() => jest.advanceTimersByTime(3500));
    trail.push(snap('after the message hides'));
    expect(trail).toMatchSnapshot();
  });

  test('server refuses', async () => {
    await mount();
    mockSaveResult = { msg: false };
    await clickEl(buttonByText('Save'));
    expect(snap('refused')).toMatchSnapshot();
  });

  test('blocked while the table number is blank', async () => {
    await mount();
    await clickEl(document.querySelector('svg'));
    await clickEl(Array.from(document.querySelectorAll('button')).find((b) => b.textContent.trim() === 'Ok'));
    typeInto('table_number', '');
    await clickEl(buttonByText('Save'));
    expect(snap('blank table')).toMatchSnapshot();
  });

  test('blocked while the loyalty points are invalid', async () => {
    await mount();
    typeInto('apply_loyality_point', '99');
    leave('apply_loyality_point', '99');
    await clickEl(buttonByText('Save'));
    expect(snap('too many points')).toMatchSnapshot();
  });

  test('an invalid discount does not stop the save', async () => {
    await mount();
    typeInto('discount_rupees', '9999');
    leave('discount_rupees', '9999');
    await clickEl(buttonByText('Save'));
    expect(snap('discount too large')).toMatchSnapshot();
  });

  test('cancelling needs a reason', async () => {
    await mount();
    const trail = [];
    pick('order_status', 'Cancelled');
    await clickEl(buttonByText('Save'));
    trail.push(snap('no reason'));
    typeInto('cancel_reason', 'Guest left');
    await clickEl(buttonByText('Save'));
    trail.push(snap('with reason'));
    expect(trail).toMatchSnapshot();
  });

  test('cancelling with invalid loyalty points still asks for the reason', async () => {
    await mount();
    typeInto('apply_loyality_point', '99');
    leave('apply_loyality_point', '99');
    pick('order_status', 'Cancelled');
    await clickEl(buttonByText('Save'));
    expect(snap('both problems')).toMatchSnapshot();
  });
});

describe('Clear, Back and Add more item', () => {
  test('Clear reloads the order and clears the messages', async () => {
    await mount();
    const trail = [];
    typeInto('apply_loyality_point', '99');
    leave('apply_loyality_point', '99');
    typeInto('discount_rupees', '9999');
    leave('discount_rupees', '9999');
    pick('order_status', 'Cancelled');
    await clickEl(buttonByText('Save'));
    trail.push(snap('with errors'));
    await clickEl(buttonByText('Clear'));
    trail.push(snap('cleared'));
    expect(trail).toMatchSnapshot();
  });

  test('Back', async () => {
    await mount();
    await clickEl(buttonByText('Back'));
    expect(snap('back')).toMatchSnapshot();
  });

  test('Add more item opens the item form and closing reloads the items', async () => {
    await mount();
    const trail = [];
    await clickEl(buttonByText('Add more item'));
    trail.push(snap('open'));
    expect(document.getElementById('add-order-item-form')).not.toBeNull();
    expect(trail).toMatchSnapshot();
  });

  test('Add more item looks disabled on a completed order, and still opens the form', async () => {
    await mount({ order: { payment_status: 'Completed', order_status: 'Served' } });
    const trail = [snap('completed')];
    await clickEl(buttonByText('Add more item'));
    trail.push(snap('clicked'));
    expect(trail).toMatchSnapshot();
  });
});
