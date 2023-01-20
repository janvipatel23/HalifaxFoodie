// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

//

/**
 * Author: Janvi Patel
 * It is a firebase service worker to listen background notification of Firebase Cloud Messaing.
 * Foreground Notification - When you are on the tab you will get foreground notification
 * Background Notification - when you are out of focus from the tab then you will receive system notification.
 * This code is referenced from [1].
 */

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = firebase.initializeApp({
  apiKey: "AIzaSyBEpvHgp-mv-DG8yM76w8RqwVD__pKMCuQ",
  authDomain: "csci5410serverlessproject.firebaseapp.com",
  projectId: "csci5410serverlessproject",
  storageBucket: "csci5410serverlessproject.appspot.com",
  messagingSenderId: "800663628723",
  appId: "1:800663628723:web:36c0b831e501888f8b79c6",
});

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
