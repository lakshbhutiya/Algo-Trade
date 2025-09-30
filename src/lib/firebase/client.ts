// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add your web app's Firebase configuration
// For more information on how to get this, visit:
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyAoM56hIeFuIi91s2EoroEbVc367TOlTcM",
  authDomain: "ly-project-7308c.firebaseapp.com",
  projectId: "ly-project-7308c",
  storageBucket: "ly-project-7308c.firebasestorage.app",
  messagingSenderId: "291915468031",
  appId: "1:291915468031:web:a6ab5ef46fa1b12abc90ca",
  measurementId: "G-ZCRTM3T9DN"
};
// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
