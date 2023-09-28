// Created by - Ashish Dewangan
// Reason - To have push notification functionality

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { postFCMToken } from './api/Services';

const firebaseConfig = {
  apiKey: "AIzaSyCS76-CpDJ9flZMfA_DkTzxMDM7JHHQf8M",
  authDomain: "react-test-6f575.firebaseapp.com",
  databaseURL: "https://react-test-6f575-default-rtdb.firebaseio.com",
  projectId: "react-test-6f575",
  storageBucket: "react-test-6f575.appspot.com",
  messagingSenderId: "838797620744",
  appId: "1:838797620744:web:fe35139e88e9a8ad5583bd",
  measurementId: "G-H37PMXYQ5X"
};

/**
 * Rohan
 */
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
export {firebase,auth}
/**
 * Rohan
 */


/**
 * Added by - Om Shrivastava on 30-04-2023
 * Reason - To connect FCM for push notificaiton.
 */
const app = initializeApp(firebaseConfig);

// Commented by Rohan kansari - 28/9/23 
// Reason - Now websocket is in use
// const messaging = getMessaging();
// export const getFCMToken = () => {
//   getToken(messaging, {
//     vapidKey:
//       "BFBMZXfht5P5mlZ_MtL4OER7W1iZojCTNYgVAUe83trFjy4yIjLVAuxJ_IIGVlNkks9SNveg78G_GKiQBTOtnmk",
//   })
//     .then(function (currentToken) {
//       // console.log("Got current token-----", currentToken);
//       if (currentToken) {
//         localStorage.setItem('fcmToken',currentToken)
//         sendTokenToServer(currentToken);
//       } else {
//         console.log(
//           "No Instance ID token available. Request permission to generate one."
//         );
//         setTokenSentToServer(false);
//       }
//     })
//     .catch(function (err) {
//       // console.log("An error occurred while retrieving token. ", err);
//       setTokenSentToServer(false);
//     });
//   console.log("End get token");
// };

// onMessage(function (payload) {
//   console.log("Message received. ", payload);
// });

// const sendTokenToServer=async (currentToken)=> {
//   if (!isTokenSentToServer()) {
//     console.log("Sending token to server...");
//     var tenant=localStorage.getItem("tenantName")
//     var data={
//       registration_id:currentToken,
//       type:"web",
//     }
//     const response = await postFCMToken(data,tenant)
//     setTokenSentToServer(true);
//   } else {
//     console.log(
//       "Token already sent to server so won't send it again " +
//         "unless it changes"
//     );
//   }
// }

// function isTokenSentToServer() {
//   if (window.localStorage.getItem("sentToServer") == 1) {
//     return true;
//   }
//   return false;
// }

// function setTokenSentToServer(sent) {
//   if (sent) {
//     window.localStorage.setItem("sentToServer", 1);
//   } else {
//     window.localStorage.setItem("sentToServer", 0);
//   }
// }

// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     onMessage(messaging, (payload) => {
//       window.postMessage(payload,'*')
//       resolve(payload);
//     });
// };

/**
 * End of code addition by Om Shrivastava for FCM push notification on 30-04-2023
 */
// End of commetation by Rohan kansari - 28/9/23 
// Reason - Now websocket is in use