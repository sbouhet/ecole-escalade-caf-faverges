// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
//import { getAnalytics } from "firebase/analytics"
import { getFirestore } from "firebase/firestore"
import { getFunctions } from "firebase/functions"

// dev
const firebaseConfig = {
  apiKey: "AIzaSyDAsyh3dyXTZhCKlU3F6kyxT3R-Hr3KUV0",
  authDomain: "ecole-escalade-2022-dev.firebaseapp.com",
  projectId: "ecole-escalade-2022-dev",
  storageBucket: "ecole-escalade-2022-dev.appspot.com",
  messagingSenderId: "259646490510",
  appId: "1:259646490510:web:47b90b678dbca1fe4ac6df"
}

// How to get apiKey: https://console.cloud.google.com/apis/credentials?authuser=1&project=ecole-escalade-2022&supportedpurview=project
// How to get appId and messagingSenderId: https://console.firebase.google.com/u/1/project/ecole-escalade-2022-dev/settings/general/web:ZWZiNTBlYmUtYzdhOC00NzYwLWE3MzEtMzdlMThiYzc5ODg1
// prod
//const firebaseConfig = {
//  apiKey: "AIzaSyBcwqqqBpdfc-w4drwARcAZvcddbcXpJAk",
//  authDomain: "ecole-escalade-2022.firebaseapp.com",
//  projectId: "ecole-escalade-2022",
//  storageBucket: "ecole-escalade-2022.appspot.com",
//  messagingSenderId: "550320445159",
//  appId: "1:550320445159:web:d74ac5edf10bb43e44f442"
//}


// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)
//const analytics = getAnalytics(firebaseApp)
export const db = getFirestore(firebaseApp)
export const functions = getFunctions(firebaseApp)
