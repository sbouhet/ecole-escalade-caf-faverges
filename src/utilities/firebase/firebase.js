// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
//import { getAnalytics } from "firebase/analytics"
import { getFirestore } from "firebase/firestore"
import { getFunctions } from "firebase/functions"

const firebaseConfig = {
  apiKey: "AIzaSyDAsyh3dyXTZhCKlU3F6kyxT3R-Hr3KUV0",
  authDomain: "ecole-escalade-2022-dev.firebaseapp.com",
  projectId: "ecole-escalade-2022-dev",
  storageBucket: "ecole-escalade-2022-dev.appspot.com",
  messagingSenderId: "259646490510",
  appId: "1:259646490510:web:47b90b678dbca1fe4ac6df"
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)
//const analytics = getAnalytics(firebaseApp)
export const db = getFirestore(firebaseApp)
export const functions = getFunctions(firebaseApp)
