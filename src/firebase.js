// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhWtAW1GWoq1_x-xs--ZhH3xDAWInynhc",
  authDomain: "loss-gg-19261.firebaseapp.com",
  databaseURL:
    "https://loss-gg-19261-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "loss-gg-19261",
  storageBucket: "loss-gg-19261.appspot.com",
  messagingSenderId: "159496725930",
  appId: "1:159496725930:web:e5d94f02d02ec84d2f77d3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
