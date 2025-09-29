// This file is intentionally left blank.
// You should add your Firebase project configuration here.

// For example:

import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyAoM56hIeFuIi91s2EoroEbVc367TOlTcM",
    authDomain: "ly-project-7308c.firebaseapp.com",
    projectId: "ly-project-7308c",
    storageBucket: "ly-project-7308c.firebasestorage.app",
    messagingSenderId: "291915468031",
    appId: "1:291915468031:web:a6ab5ef46fa1b12abc90ca",
    measurementId: "G-ZCRTM3T9DN"
  };

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

export { app };


// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAoM56hIeFuIi91s2EoroEbVc367TOlTcM",
//   authDomain: "ly-project-7308c.firebaseapp.com",
//   projectId: "ly-project-7308c",
//   storageBucket: "ly-project-7308c.firebasestorage.app",
//   messagingSenderId: "291915468031",
//   appId: "1:291915468031:web:a6ab5ef46fa1b12abc90ca",
//   measurementId: "G-ZCRTM3T9DN"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// export { app }
