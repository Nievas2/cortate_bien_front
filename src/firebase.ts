import { initializeApp } from "firebase/app"/* 
import { getAnalytics } from "firebase/analytics" */
import { getMessaging } from "firebase/messaging"
const firebaseConfig = {
  apiKey: "AIzaSyAmtjoBetgu4amRmN6-j7nu69PGudeUYMk",
  authDomain: "cortate-bien-4e07a.firebaseapp.com",
  projectId: "cortate-bien-4e07a",
  storageBucket: "cortate-bien-4e07a.firebasestorage.app",
  messagingSenderId: "1086710735374",
  appId: "1:1086710735374:web:adcd78933f9f012455525f",
  measurementId: "G-FHWBWLSV5K",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
/* const analytics = getAnalytics(app) */
export const messaging = getMessaging(app)
