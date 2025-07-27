// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
 apiKey: "AIzaSyCvTzQNNIQs9rTA7AhM5moelWkmell3hvI",
  authDomain: "nfl-calcutta-auction.firebaseapp.com",
  projectId: "nfl-calcutta-auction",
  storageBucket: "nfl-calcutta-auction.firebasestorage.app",
  messagingSenderId: "801047537210",
  appId: "1:801047537210:web:865630cb820a4f4052f703",
  measurementId: "G-1N50PGE1XF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };
export { app };