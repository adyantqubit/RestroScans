// Created by - Ashish Dewangan
// Reason - To have push notification functionality

importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyAIcy2oKuVW11_0gmv-6mYnCsQCwiop6Qg",
  authDomain: "firstfcmmessagingproject.firebaseapp.com",
  projectId: "firstfcmmessagingproject",
  storageBucket: "firstfcmmessagingproject.appspot.com",
  messagingSenderId: "553700732551",
  appId: "1:553700732551:web:9474e08234630043a9d222",
  measurementId: "G-S8QY4EZYBE"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
    clients.matchAll({includeUncontrolled: true}).then(clients => {
      clients.forEach(client => {
        client.postMessage(payload);
      })
    })
    const notificationTitle = payload.notification.title || payload.data.title;
    const notificationOptions = {
      body: payload.notification.body || payload.data.subtitle || '',
      data: payload.data,
    };
    return self.registration.showNotification(notificationTitle, notificationOptions);
  });