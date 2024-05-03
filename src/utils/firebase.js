import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { get } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSBpdWIY4jztS4FLt_zJXgdA9M7bsUScY",
  authDomain: "expense-finals.firebaseapp.com",
  projectId: "expense-finals",
  storageBucket: "expense-finals.appspot.com",
  messagingSenderId: "976220574223",
  appId: "1:976220574223:web:1008bcd9d258f0e2a2497a",
  measurementId: "G-JNKG8Y3HVT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// firebase login
// firebase init
// firebase deploy