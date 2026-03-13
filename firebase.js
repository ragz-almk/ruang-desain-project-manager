// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// GANTI dengan konfigurasi dari Firebase Console milikmu!
const firebaseConfig = {
  apiKey: "API_KEY_KAMU",
  authDomain: "archimanage-xxx.firebaseapp.com",
  projectId: "archimanage-xxx",
  storageBucket: "archimanage-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi layanan yang akan kita pakai
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
