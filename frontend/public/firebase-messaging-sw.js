importScripts("https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyA0HOWr-ja4GbWdl4dZovKCZC1dYQLFK2I",
  authDomain: "firstfcmmessagingproject.firebaseapp.com",
  projectId: "firstfcmmessagingproject",
  storageBucket: "firstfcmmessagingproject.appspot.com",
  messagingSenderId: "553700732551",
  appId: "1:553700732551:web:9474e08234630043a9d222",
  measurementId: "G-S8QY4EZYBE",
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png",
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
