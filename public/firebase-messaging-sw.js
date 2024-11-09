// Import the Firebase messaging library using importScripts
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

// Initialize Firebase app with your configuration
firebase.initializeApp({
  apiKey: "AIzaSyBptDktsCGbeqyVj7gGMKmGpaIam7Gittk",
  authDomain: "swp391-koiauctionsystem.firebaseapp.com",
  projectId: "swp391-koiauctionsystem",
  storageBucket: "swp391-koiauctionsystem.appspot.com",
  messagingSenderId: "996152946405",
  appId: "1:996152946405:web:6d62fdb32e353683462e0c",
});

const messaging = firebase.messaging();

// Optional: Define background message handler
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);
  // Customize notification if desired
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png", // Add your icon path here if needed
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
