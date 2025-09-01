// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_e7CPoaG1qNwiBMGtMfU_Yfn7j9Ala_o",
  authDomain: "collegeapp-e4553.firebaseapp.com",
  projectId: "collegeapp-e4553",
  storageBucket: "collegeapp-e4553.firebasestorage.app",
  messagingSenderId: "958533459199",
  appId: "1:958533459199:web:0cdbb3c012b523f8b200ca",
  measurementId: "G-G11M30TNLM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
