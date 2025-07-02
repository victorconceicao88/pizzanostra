import { initializeApp } from "firebase/app";
import { 
  enableIndexedDbPersistence,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD7yP9vP9UG10r7-wugRYv-hyFvEUXNX1c",
  authDomain: "pizza-nostra-e54da.firebaseapp.com",
  projectId: "pizza-nostra-e54da",
  storageBucket: "pizza-nostra-e54da.appspot.com",
  messagingSenderId: "392686255742",
  appId: "1:392686255742:web:a7d86a9aa56f735ca7a22f",
  databaseURL: "https://pizza-nostra-e54da-default-rtdb.europe-west1.firebasedatabase.app"

};

// Inicialização otimizada
const app = initializeApp(firebaseConfig);

// Configuração robusta do Firestore
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: true, // Mantém apenas esta opção
  useFetchStreams: false,
});

// Habilita persistência offline
enableIndexedDbPersistence(db).catch((err) => {
  console.error("Persistência offline falhou:", err);
});

const auth = getAuth(app);

export { db, auth };