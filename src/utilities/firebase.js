// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
//import { getAnalytics } from "firebase/analytics"
import { getFirestore } from "firebase/firestore"
import { getFunctions } from "firebase/functions"

const firebaseConfig = {
  apiKey: "AIzaSyBcwqqqBpdfc-w4drwARcAZvcddbcXpJAk",
  authDomain: "ecole-escalade-2022.firebaseapp.com",
  projectId: "ecole-escalade-2022",
  storageBucket: "ecole-escalade-2022.appspot.com",
  messagingSenderId: "550320445159",
  appId: "1:550320445159:web:d74ac5edf10bb43e44f442",
  measurementId: "G-B76XH9EHLX",
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)
//const analytics = getAnalytics(firebaseApp)
export const db = getFirestore(firebaseApp)
export const functions = getFunctions(firebaseApp)
