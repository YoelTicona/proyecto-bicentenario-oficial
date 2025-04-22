// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyD09OKHFuiLJRkE8EUi3iG3HghecuToDMc",
    authDomain: "bicentenario-6eeb1.firebaseapp.com",
    projectId: "bicentenario-6eeb1",
    storageBucket: "bicentenario-6eeb1.firebasestorage.app",
    messagingSenderId: "439443900050",
    appId: "1:439443900050:web:11f71de190fbe19660884b",
    measurementId: "G-VBQNXJ431R"
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
