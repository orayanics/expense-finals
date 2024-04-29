import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { get } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-jZVFXRdSrR5Uwj73eyEPGzu7Gf0szus",
  authDomain: "expense-tracker-ecf38.firebaseapp.com",
  projectId: "expense-tracker-ecf38",
  storageBucket: "expense-tracker-ecf38.appspot.com",
  messagingSenderId: "427083204060",
  appId: "1:427083204060:web:5339bf4a0a58818ddffb19"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// firebase login
// firebase init
// firebase deploy