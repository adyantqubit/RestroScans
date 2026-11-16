import { getApps, initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';
import firebaseConfig, { firebaseVapidKey, isFirebaseConfigured } from './config/firebaseConfig';
import { postFCMToken } from './screens/Notification/services/notificationService';

export function firebaseApp() {
  if (!isFirebaseConfigured) return null;
  const existing = getApps();
  if (existing.length) return existing[0];
  return initializeApp(firebaseConfig);
}

let messagingPromise = null;

function messaging() {
  if (!messagingPromise) {
    messagingPromise = (isFirebaseConfigured ? isSupported() : Promise.resolve(false))
      .then((supported) => {
        const app = firebaseApp();
        return supported && app ? getMessaging(app) : null;
      })
      .catch(() => null);
  }
  return messagingPromise;
}

const TOKEN_SENT_KEY = 'sentToServer';

async function sendTokenToServer(currentToken) {
  if (window.localStorage.getItem(TOKEN_SENT_KEY) === '1') {
    return;
  }
  await postFCMToken({ registration_id: currentToken, type: 'web' }, localStorage.getItem('tenantName'));
  window.localStorage.setItem(TOKEN_SENT_KEY, '1');
}

export const getFCMToken = async () => {
  const instance = await messaging();
  if (!instance) {
    return;
  }
  try {
    const currentToken = await getToken(instance, { vapidKey: firebaseVapidKey || undefined });
    if (currentToken) {
      localStorage.setItem('fcmToken', currentToken);
      await sendTokenToServer(currentToken);
    } else {
      window.localStorage.setItem(TOKEN_SENT_KEY, '0');
    }
  } catch (err) {
    window.localStorage.setItem(TOKEN_SENT_KEY, '0');
  }
};

export const onMessageListener = () =>
  messaging().then(
    (instance) =>
      new Promise((resolve) => {
        if (!instance) return;
        onMessage(instance, (payload) => {
          window.postMessage(payload, window.location.origin);
          resolve(payload);
        });
      })
  );
