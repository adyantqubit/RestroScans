import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert, AlertIcon } from '@chakra-ui/react';
import { validateToken } from '../pages/Auth/services/authService';
import style from '../app.module.css';

// App-wide services every screen needs: the toast message, the signed-in flag, the token refresh and
// showing/hiding the page chrome (header, sidebar, footer). These used to be module-level variables
// that App reassigned on every render and the pages imported back from App (a circular import).

const AppContext = createContext(null);

const MESSAGE_MS = 3000;
const TOKEN_REFRESH_MS = 72000;

function hasSession() {
  return Boolean(localStorage.getItem('token') && localStorage.getItem('tenantInfo'));
}

function setChromeDisplay(display) {
  const header = document.getElementById('header');
  if (header) header.style.display = display.header;
  ((document.getElementById('sidebar') || { style: {} }).style.display = display.sidebar);
  ((document.getElementById('footer') || { style: {} }).style.display = display.footer);
}

export function AppProvider({ children }) {
  const [notification, setNotification] = useState(null);
  const [tokenExist, setTokenExist] = useState(hasSession);

  const tokenRecheck = useCallback(() => {
    setTokenExist(hasSession());
  }, []);

  const Message = useCallback((text, type) => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), MESSAGE_MS);
  }, []);

  const enableHeader = useCallback(() => {
    setChromeDisplay({ header: 'grid', sidebar: 'block', footer: 'block' });
  }, []);

  const disableHeader = useCallback(() => {
    setChromeDisplay({ header: 'none', sidebar: 'none', footer: 'none' });
  }, []);

  // Swap the access/refresh tokens for new ones on a timer; sign the user out if the server refuses.
  useEffect(() => {
    tokenRecheck();
    const refreshTokens = async () => {
      if (!localStorage.getItem('refresh_token')) {
        localStorage.clear();
        return;
      }
      const tokens = {
        access: localStorage.getItem('token'),
        refresh: localStorage.getItem('refresh_token'),
      };
      const renewed = await validateToken(tokens);
      if (renewed) {
        localStorage.setItem('token', renewed.access_token);
        localStorage.setItem('refresh_token', renewed.refresh_token);
        tokenRecheck();
      } else {
        localStorage.clear();
        tokenRecheck();
        window.location = '/Login';
        Message('Unathenticate ! please login again');
      }
    };
    const timer = setInterval(refreshTokens, TOKEN_REFRESH_MS);
    return () => clearInterval(timer);
  }, [Message, tokenRecheck]);

  const value = useMemo(
    () => ({ Message, tokenExist, tokenRecheck, enableHeader, disableHeader }),
    [Message, tokenExist, tokenRecheck, enableHeader, disableHeader],
  );

  return (
    <AppContext.Provider value={value}>
      {notification ? (
        <Alert
          maxW="350px"
          status={notification.type}
          className={`${style.label} ${style.alert}`}
          id="pot"
        >
          <AlertIcon />
          {notification.text}
        </Alert>
      ) : null}
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used inside <AppProvider>');
  return value;
}
