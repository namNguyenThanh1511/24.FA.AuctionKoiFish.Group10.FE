// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBptDktsCGbeqyVj7gGMKmGpaIam7Gittk",
  authDomain: "swp391-koiauctionsystem.firebaseapp.com",
  projectId: "swp391-koiauctionsystem",
  storageBucket: "swp391-koiauctionsystem.appspot.com",
  messagingSenderId: "996152946405",
  appId: "1:996152946405:web:6d62fdb32e353683462e0c",
};
// Register the service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const googleprovider = new GoogleAuthProvider();
const storage = getStorage(app);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);
const auth = getAuth();

export { googleprovider, auth, app, messaging };
export default storage;
