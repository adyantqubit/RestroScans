import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { ChakraBaseProvider, extendBaseTheme } from '@chakra-ui/react';
import chakraTheme from '@chakra-ui/theme';
import { AppProvider, useApp } from './AppContext';

jest.mock('../pages/Auth/services/authService', () => ({ validateToken: jest.fn() }));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const theme = extendBaseTheme({ components: { Alert: chakraTheme.components.Alert } });

let api;
function Probe() {
  api = useApp();
  return <div id="probe">{String(api.tokenExist)}</div>;
}

let container;
let root;

function mount() {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => {
    root.render(
      <ChakraBaseProvider theme={theme}>
        <AppProvider>
          <div id="header" />
          <div id="sidebar" />
          <div id="footer" />
          <Probe />
        </AppProvider>
      </ChakraBaseProvider>,
    );
  });
}

beforeEach(() => {
  localStorage.clear();
  jest.useFakeTimers();
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  jest.useRealTimers();
});

test('tokenExist needs both a token and tenant info, and tokenRecheck re-reads them', () => {
  mount();
  expect(container.querySelector('#probe').textContent).toBe('false');

  localStorage.setItem('token', 't');
  localStorage.setItem('tenantInfo', '{}');
  act(() => api.tokenRecheck());
  expect(container.querySelector('#probe').textContent).toBe('true');
});

test('Message shows an alert and removes it after three seconds', () => {
  mount();
  expect(document.getElementById('pot')).toBeNull();

  act(() => api.Message('Saved', 'success'));
  expect(document.getElementById('pot').textContent).toContain('Saved');

  act(() => jest.advanceTimersByTime(2900));
  expect(document.getElementById('pot')).not.toBeNull();
  act(() => jest.advanceTimersByTime(200));
  expect(document.getElementById('pot')).toBeNull();
});

test('disableHeader and enableHeader toggle the page chrome', () => {
  mount();
  act(() => api.disableHeader());
  expect(document.getElementById('header').style.display).toBe('none');
  expect(document.getElementById('sidebar').style.display).toBe('none');
  expect(document.getElementById('footer').style.display).toBe('none');

  act(() => api.enableHeader());
  expect(document.getElementById('header').style.display).toBe('grid');
  expect(document.getElementById('sidebar').style.display).toBe('block');
  expect(document.getElementById('footer').style.display).toBe('block');
});

test('the helpers keep the same identity, so effects that list them do not re-run', () => {
  mount();
  const first = { ...api };
  act(() => api.Message('x', 'info'));
  act(() => jest.advanceTimersByTime(3100));
  expect(api.Message).toBe(first.Message);
  expect(api.enableHeader).toBe(first.enableHeader);
  expect(api.tokenRecheck).toBe(first.tokenRecheck);
});

test('useApp outside the provider fails loudly', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const c = document.createElement('div');
  const r = createRoot(c);
  expect(() => act(() => r.render(<Probe />))).toThrow('useApp must be used inside <AppProvider>');
  spy.mockRestore();
});
