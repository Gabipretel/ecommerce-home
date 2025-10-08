// Configuracion Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDjOrTJ2H25YSY_8ow8lACGb7IBFpSFom0",
  authDomain: "back-end-gg.firebaseapp.com",
  projectId: "back-end-gg",
  storageBucket: "back-end-gg.firebasestorage.app",
  messagingSenderId: "163586568927",
  appId: "1:163586568927:web:17d65a575cdb9821bc6f6a",
  measurementId: "G-86X705T5WJ"
};

// Inicializacion de  Firebase
export const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseAuth = getAuth(FirebaseApp)