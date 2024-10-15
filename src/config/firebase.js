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
  apiKey: "AIzaSyBptDktsCGbeqyVj7gGMKmGpaIam7Gittk",
  authDomain: "swp391-koiauctionsystem.firebaseapp.com",
  projectId: "swp391-koiauctionsystem",
  storageBucket: "swp391-koiauctionsystem.appspot.com",
  messagingSenderId: "996152946405",
  appId: "1:996152946405:web:6d62fdb32e353683462e0c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const googleprovider = new GoogleAuthProvider();

const storage = getStorage(app);

const auth = getAuth();
export { googleprovider, auth, app };
export default storage;
