import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyA0HOWr-ja4GbWdl4dZovKCZC1dYQLFK2I",
  authDomain: "firstfcmmessagingproject.firebaseapp.com",
  projectId: "firstfcmmessagingproject",
  storageBucket: "firstfcmmessagingproject.appspot.com",
  messagingSenderId: "553700732551",
  appId: "1:553700732551:web:9474e08234630043a9d222",
  measurementId: "G-S8QY4EZYBE",
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
 * Om
 */
const app = initializeApp(firebaseConfig);
const messaging = getMessaging();
export const getFCMToken = () => {
  getToken(messaging, {
    vapidKey:
      "BFBMZXfht5P5mlZ_MtL4OER7W1iZojCTNYgVAUe83trFjy4yIjLVAuxJ_IIGVlNkks9SNveg78G_GKiQBTOtnmk",
  })
    .then(function (currentToken) {
      console.log("Got current token-----", currentToken);
      if (currentToken) {
        sendTokenToServer(currentToken);
      } else {
        console.log(
          "No Instance ID token available. Request permission to generate one."
        );
        setTokenSentToServer(false);
      }
    })
    .catch(function (err) {
      console.log("An error occurred while retrieving token. ", err);
      setTokenSentToServer(false);
    });
  console.log("End get token");
};

onMessage(function (payload) {
  console.log("Message received. ", payload);
});

function sendTokenToServer(currentToken) {
  if (!isTokenSentToServer()) {
    console.log("Sending token to server...");
    // TODO(developer): Send the current token to your server.
    fetch("http://192.168.1.9:8000/api/v1/ashoka/store-fcm-token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        registration_id: currentToken,
        type: "web",
      }),
      credentials: "include",
    }).then(function (response) {
      console.log(response);
    });
    setTokenSentToServer(true);
  } else {
    console.log(
      "Token already sent to server so won't send it again " +
        "unless it changes"
    );
  }
}

function isTokenSentToServer() {
  if (window.localStorage.getItem("sentToServer") == 1) {
    return true;
  }
  return false;
}

function setTokenSentToServer(sent) {
  if (sent) {
    window.localStorage.setItem("sentToServer", 1);
  } else {
    window.localStorage.setItem("sentToServer", 0);
  }
}

/**
 * Om
 */