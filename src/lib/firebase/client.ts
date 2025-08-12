
"use client";

import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
    apiKey: "AIzaSyClUfp4s3j-p8kwwPrS604OKlXL2pguxO8",
    authDomain: "ecoswap-k77jk.firebaseapp.com",
    projectId: "ecoswap-k77jk",
    storageBucket: "ecoswap-k77jk.appspot.com",
    messagingSenderId: "172688661979",
    appId: "1:172688661979:web:2e835b27fa0e41c6519bfe"
};

// Initialize Firebase for client side
// Check if app is already initialized to prevent errors
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
