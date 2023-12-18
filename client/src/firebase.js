// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-4ec19.firebaseapp.com",
  projectId: "mern-estate-4ec19",
  storageBucket: "mern-estate-4ec19.appspot.com",
  messagingSenderId: "176744129239",
  appId: "1:176744129239:web:d936b91dcb78cdb4b30692"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);