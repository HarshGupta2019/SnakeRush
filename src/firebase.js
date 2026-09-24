import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
//import { signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDF6b_y_SSYyACdvVtPObDE4CnOWgFH4AE",
  authDomain: "snake-rush-61bfe.firebaseapp.com",
  projectId: "snake-rush-61bfe",
  storageBucket: "snake-rush-61bfe.firebasestorage.app",
  messagingSenderId: "246161468290",
  appId: "1:246161468290:web:0cc47426fccb8088e4fd9b",
  measurementId: "G-ESHDY592K0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);