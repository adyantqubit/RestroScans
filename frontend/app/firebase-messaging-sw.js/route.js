import firebaseConfig, { isFirebaseConfigured } from '../../src/config/firebaseConfig';

export const dynamic = 'force-static';

const FIREBASE_SDK = 'https://www.gstatic.com/firebasejs/8.10.0';

function script() {
  if (!isFirebaseConfigured) {
    return '// Push notifications are disabled: NEXT_PUBLIC_FIREBASE_* is not configured.\n';
  }
  return `importScripts('${FIREBASE_SDK}/firebase-app.js');
importScripts('${FIREBASE_SDK}/firebase-messaging.js');

firebase.initializeApp(${JSON.stringify(firebaseConfig)});

firebase.messaging().onBackgroundMessage((payload) => {
  clients.matchAll({ includeUncontrolled: true }).then((all) => {
    all.forEach((client) => client.postMessage(payload));
  });
  const notification = payload.notification || {};
  const data = payload.data || {};
  return self.registration.showNotification(notification.title || data.title || '', {
    body: notification.body || data.subtitle || '',
    data,
  });
});
`;
}

export function GET() {
  return new Response(script(), {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}
