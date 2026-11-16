import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { ChakraBaseProvider, extendBaseTheme } from '@chakra-ui/react';
import chakraTheme from '@chakra-ui/theme';
import App from './App';
import { AppProvider } from './Context/AppContext';
import Context from './Context/Context';

// axios ships as an ES module, which Jest does not transform; nothing here makes a request.
jest.mock('./http/http_client', () => ({
  __esModule: true,
  default: {
    get: () => new Promise(() => {}),
    post: () => new Promise(() => {}),
    put: () => new Promise(() => {}),
    delete: () => new Promise(() => {}),
  },
  friendlyErrorMessage: () => 'error',
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const theme = extendBaseTheme({ components: { Alert: chakraTheme.components.Alert } });

function renderAt(path) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(
      <Context>
        <ChakraBaseProvider theme={theme}>
          <AppProvider>
            <MemoryRouter initialEntries={[path]}>
              <App />
            </MemoryRouter>
          </AppProvider>
        </ChakraBaseProvider>
      </Context>,
    );
  });
  return { container, unmount: () => { act(() => root.unmount()); container.remove(); } };
}

beforeEach(() => {
  localStorage.clear();
  window.matchMedia = window.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {} }));
});

test('signed out, a protected address shows the login screen', () => {
  const { container, unmount } = renderAt('/Revenue');
  expect(container.textContent.toLowerCase()).toContain('login');
  unmount();
});

test('signed out, the sign-in screens render with the shared services (no circular App import)', () => {
  for (const path of ['/Login', '/Forget', '/WaiterLogin']) {
    const { container, unmount } = renderAt(path);
    expect(container.innerHTML.length).toBeGreaterThan(0);
    unmount();
  }
});
