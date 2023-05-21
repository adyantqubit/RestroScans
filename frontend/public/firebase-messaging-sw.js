// importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
// importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

// firebase.initializeApp({
//   apiKey: "AIzaSyAIcy2oKuVW11_0gmv-6mYnCsQCwiop6Qg",
//   authDomain: "firstfcmmessagingproject.firebaseapp.com",
//   projectId: "firstfcmmessagingproject",
//   storageBucket: "firstfcmmessagingproject.appspot.com",
//   messagingSenderId: "553700732551",
//   appId: "1:553700732551:web:9474e08234630043a9d222",
//   measurementId: "G-S8QY4EZYBE"
// });

// const messaging = firebase.messaging();

// // messaging.setBackgroundMessageHandler(function (payload) {
// //   console.log(
// //     "[firebase-messaging-sw.js] Received background message ",
// //     payload
// //   );
// //   const notificationTitle = "Background Message Title";
// //   const notificationOptions = {
// //     body: "Background Message body.",
// //     icon: "/firebase-logo.png",
// //   };

// //   return self.registration.showNotification(
// //     notificationTitle,
// //     notificationOptions
// //   );
// // });

// messaging.onBackgroundMessage(payload => {
//   console.log("msg received===========================",payload)
//   const notificationTitle = payload.notification.title || payload.data.title;
//   const notificationOptions = {
//     body: payload.notification.body || payload.data.subtitle || '',
//     icon: 'https://firebasestorage.googleapis.com/v0/b/yes-4-web.appspot.com/o/pontonos%2Ficons%2Fandroid-chrome-192x192.png?alt=media&token=35616a6b-5e70-43a0-9284-d780793fa076',
//     data: payload.data
//   };

//   return self.registration.showNotification(notificationTitle, notificationOptions);
// });