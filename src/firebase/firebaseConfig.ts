// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBynBCesFCaxMnru7Y1XmSJXpf_QnNU7Zs",
  authDomain: "app-movil-e2303.firebaseapp.com",
  projectId: "app-movil-e2303",
  storageBucket: "app-movil-e2303.appspot.com",
  messagingSenderId: "80578186728",
  appId: "1:80578186728:web:e377be9cca1514689ba85d"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

// Exporta la BD de Firestore
export const db = getFirestore(app);


console.log("🔹 Firebase inicializada:", app.name);
console.log("🔹 Configuración Firebase:", firebaseConfig);
console.log("✅ Auth y Firestore configurados correctamente.");