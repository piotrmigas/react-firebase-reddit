import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";

firebase.initializeApp({
  apiKey: "AIzaSyCWxxIMEeL3vUx1wxwXL7oeQipw69kj21Y",
  authDomain: "reddit-c0da0.firebaseapp.com",
  projectId: "reddit-c0da0",
  storageBucket: "reddit-c0da0.appspot.com",
  messagingSenderId: "856988410476",
  appId: "1:856988410476:web:7a6dc42ddf136963e12e49",
});

export const db = firebase.firestore();
export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export const storage = firebase.storage();
export const increment = firebase.firestore.FieldValue.increment(1);
export const decrement = firebase.firestore.FieldValue.increment(-1);
