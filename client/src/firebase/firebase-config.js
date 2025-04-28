import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyD09OKHFuiLJRkE8EUi3iG3HghecuToDMc",
  authDomain: "bicentenario-6eeb1.firebaseapp.com",
  projectId: "bicentenario-6eeb1",
  storageBucket: "bicentenario-6eeb1.firebasestorage.app",
  messagingSenderId: "439443900050",
  appId: "1:439443900050:web:11f71de190fbe19660884b",
  measurementId: "G-VBQNXJ431R"
};

// Initialize Firebase
// Exportas lo que usarás
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
export { app, db, auth, storage };


