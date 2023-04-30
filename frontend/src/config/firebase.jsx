import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCtteMG6cG1sriiusPycnPaYk0lx7wedaw",
  authDomain: "react-test-6f575.firebaseapp.com",
  databaseURL: "https://react-test-6f575-default-rtdb.firebaseio.com",
  projectId: "react-test-6f575",
  storageBucket: "react-test-6f575.appspot.com",
  messagingSenderId: "838797620744",
  appId: "1:838797620744:web:fe35139e88e9a8ad5583bd",
  measurementId: "G-H37PMXYQ5X"
};

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var auth = firebase.auth();

export {firebase,auth}
