// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBynBCesFCaxMnru7Y1XmSJXpf_QnNU7Zs",
  authDomain: "app-movil-e2303.firebaseapp.com",
  projectId: "app-movil-e2303",
  storageBucket: "app-movil-e2303.firebasestorage.app",
  messagingSenderId: "80578186728",
  appId: "1:80578186728:web:e377be9cca1514689ba85d"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta la BD de Firestore
export const db = getFirestore(app);