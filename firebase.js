// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// GANTI dengan konfigurasi dari Firebase Console milikmu!
const firebaseConfig = {
  apiKey: "AIzaSyBAYPMg0ijoOIfxZlLrUex_hIBlZaNXk8Q",
  authDomain: "architecture-manager-490104.firebaseapp.com",
  projectId: "architecture-manager-490104",
  storageBucket: "architecture-manager-490104.firebasestorage.app",
  messagingSenderId: "128091108713",
  appId: "1:128091108713:web:9a77876d951714a4fd79f8",
  measurementId: "G-1SZR8BFFCC"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inisialisasi layanan yang akan kita pakai
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
