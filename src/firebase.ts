import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const app = initializeApp({
  apiKey: 'AIzaSyCWxxIMEeL3vUx1wxwXL7oeQipw69kj21Y',
  authDomain: 'reddit-c0da0.firebaseapp.com',
  projectId: 'reddit-c0da0',
  storageBucket: 'reddit-c0da0.appspot.com',
  messagingSenderId: '856988410476',
  appId: '1:856988410476:web:7a6dc42ddf136963e12e49',
});

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const storage = getStorage(app);
