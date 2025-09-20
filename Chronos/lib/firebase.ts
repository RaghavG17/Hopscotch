// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAikGQVIazlsfaAeJ-xmVddT6VxwnZhPXs",
    authDomain: "sixseven-5aa55.firebaseapp.com",
    projectId: "sixseven-5aa55",
    storageBucket: "sixseven-5aa55.firebasestorage.app",
    messagingSenderId: "939319459108",
    appId: "1:939319459108:web:cd687ae48a8bcae26207b1",
    measurementId: "G-XF7DGRCSHM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
