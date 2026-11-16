import { useEffect } from 'react';
import API from '../http/http_client';
import { webSocketUrl } from '../config/config';

const STORE = 'orderNotices';
const ORDER_SCREENS = [
  /^\/Dashboard$/,
  /^\/waiterDashboard$/,
  /^\/Order$/,
  /^\/OrderItem$/,
  /^\/update-order\//,
  /^\/update-order-item\//,
];

export function isOrderScreen(path) {
  return ORDER_SCREENS.some((pattern) => pattern.test(path || ''));
}

export function readNotices() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(STORE) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

export function unreadCount() {
  return readNotices().filter((notice) => !notice.seen).length;
}

export function markNoticesSeen() {
  const notices = readNotices().map((notice) => ({ ...notice, seen: true }));
  sessionStorage.setItem(STORE, JSON.stringify(notices));
  window.dispatchEvent(new Event('order-notices'));
}

function remember(event) {
  if (isOrderScreen(window.location.pathname)) return;
  const notices = readNotices().filter((notice) => notice.id !== event.id);
  notices.unshift({ ...event, seen: false });
  sessionStorage.setItem(STORE, JSON.stringify(notices.slice(0, 40)));
  window.dispatchEvent(new Event('order-notices'));
}

function tenantName() {
  try {
    return JSON.parse(localStorage.getItem('tenantInfo') || '{}').tenant_name || '';
  } catch (err) {
    return '';
  }
}

/** One restaurant socket while staff are signed in. A slow poll runs only while the socket is down. */
export function useOrderLive(enabled) {
  useEffect(() => {
    if (!enabled) return undefined;
    let after = 0;
    let primed = false;
    let connected = false;
    let closed = false;
    let socket;
    let retry;

    const apply = (event) => {
      if (!event || !event.id || event.id <= after) return;
      after = event.id;
      if (!primed) return;
      window.dispatchEvent(new CustomEvent('order-live', { detail: event }));
      remember(event);
    };

    const pull = async () => {
      try {
        const response = await API.get(`/api/v1/order-events/?after=${after}`);
        const events = response.data && response.data.data ? response.data.data.events : [];
        events.forEach(apply);
        primed = true;
      } catch (err) {
        primed = true;
      }
    };

    const openSocket = async () => {
      try {
        const response = await API.post('/api/v1/order-events/ws-ticket/');
        const ticket = response.data && response.data.data ? response.data.data.ticket : '';
        if (!ticket || closed) return;
        const params = new URLSearchParams({ ticket });
        const tenant = tenantName();
        if (tenant) params.set('tenant', tenant);
        socket = new WebSocket(webSocketUrl(`/ws/orders/?${params.toString()}`));
        socket.onopen = () => {
          connected = true;
          pull();
        };
        socket.onmessage = () => pull();
        socket.onclose = () => {
          connected = false;
          if (!closed) retry = setTimeout(openSocket, 5000);
        };
      } catch (err) {
        connected = false;
      }
    };

    const timer = setInterval(() => {
      if (!connected) pull();
    }, 20000);
    openSocket();
    return () => {
      closed = true;
      clearInterval(timer);
      clearTimeout(retry);
      if (socket) socket.close();
    };
  }, [enabled]);
}
