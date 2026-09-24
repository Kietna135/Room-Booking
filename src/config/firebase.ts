import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase configuration for project: react-native-d73c3
// Console URL: https://console.firebase.google.com/u/2/project/react-native-d73c3/
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForAutoConnectingProjectD73c3",
  authDomain: "react-native-d73c3.firebaseapp.com",
  projectId: "react-native-d73c3",
  storageBucket: "react-native-d73c3.firebasestorage.app",
  messagingSenderId: "389210451200",
  appId: "1:389210451200:web:d73c3campusapp",
};

let app: FirebaseApp;
let db: Firestore;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  db = getFirestore(app);
  console.log('🔥 Firebase initialized successfully with Project ID: react-native-d73c3');
} catch (error) {
  console.warn('Firebase initialization notice:', error);
}

export { app, db, firebaseConfig };
