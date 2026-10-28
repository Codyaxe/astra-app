// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4H2Ps1uyvJp6tJwuOPRDVcHlr674_Rck",
  authDomain: "aa-26-512915.firebaseapp.com",
  projectId: "aa-26-512915",
  storageBucket: "aa-26-512915.firebasestorage.app",
  messagingSenderId: "255257079903",
  appId: "1:255257079903:web:ff26fca9b0e7e42dc9abea",
  measurementId: "G-K1STE88MTP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);