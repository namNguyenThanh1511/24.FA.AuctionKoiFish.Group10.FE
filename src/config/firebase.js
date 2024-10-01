// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXfxXOmpxmCncmGjZN25PDHLbX8tGXFEE",
  authDomain: "koi-auction-b576c.firebaseapp.com",
  projectId: "koi-auction-b576c",
  storageBucket: "koi-auction-b576c.appspot.com",
  messagingSenderId: "388140353841",
  appId: "1:388140353841:web:4a61d26c45f8c48e208810",
  measurementId: "G-W10X4V6F2S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const googleprovider = new GoogleAuthProvider();

const storage = getStorage(app);

const auth = getAuth();
export { googleprovider, auth };
export default storage;
