import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAz05bLJSpVi6cyVyub-PILe-hbYj7SdKo",
  authDomain: "rubiktrainer-54c5e.firebaseapp.com",
  projectId: "rubiktrainer-54c5e",
  storageBucket: "rubiktrainer-54c5e.firebasestorage.app",
  messagingSenderId: "307665987440",
  appId: "1:307665987440:web:e526db8a96a0f63d0e51b5",
  measurementId: "G-ZKEQTLW56P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;

