import firebase from "firebase";

// const firebaseConfig = {
//   apiKey: "AIzaSyCfhpi7mRTvEnjf-yHTRg2Ilmhr8dp754k",
//   authDomain: "serverlessproject-cd914.firebaseapp.com",
//   projectId: "serverlessproject-cd914",
//   storageBucket: "serverlessproject-cd914.appspot.com",
//   messagingSenderId: "816300550661",
//   appId: "1:816300550661:web:aa339099cff73166504a6c",
// };

//janvi
const firebaseConfig = {
// apiKey: "AIzaSyBEpvHgp-mv-DG8yM76w8RqwVD__pKMCuQ",
// authDomain: "csci5410serverlessproject.firebaseapp.com",
// projectId: "csci5410serverlessproject",
// storageBucket: "csci5410serverlessproject.appspot.com",
// messagingSenderId: "800663628723",
// appId: "1:800663628723:web:36c0b831e501888f8b79c6",
  apiKey: "AIzaSyBEpvHgp-mv-DG8yM76w8RqwVD__pKMCuQ",
  authDomain: "csci5410serverlessproject.firebaseapp.com",
  projectId: "csci5410serverlessproject",
  storageBucket: "csci5410serverlessproject.appspot.com",
  messagingSenderId: "800663628723",
  appId: "1:800663628723:web:36c0b831e501888f8b79c6",
};
// firebase.default.initializeApp
const app = firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({ experimentalForceLongPolling: true });
const db = firebase.firestore()
export default db;
export const messaging = firebase.messaging(app);

// export default db;
