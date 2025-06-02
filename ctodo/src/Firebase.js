// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFvrsw6qqAbsA5K8n4JaZEJ3FSfifDu8k",
  authDomain: "tododesktop-f16c2.firebaseapp.com",
  projectId: "tododesktop-f16c2",
  storageBucket: "tododesktop-f16c2.firebasestorage.app",
  messagingSenderId: "433674554906",
  appId: "1:433674554906:web:836fda44c582d9aa294ba3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {app,db,auth};