/**
 * @module integration-firebase/client
 * Singleton Firebase app initialization for the web client.
 */

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??
    "AIzaSyBkniZGal_Lls4CR3eFuZvSVMZBe73STNs",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    "xuanwu-i-00708880-4e2d8.firebaseapp.com",
  databaseURL:
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ??
    "https://xuanwu-i-00708880-4e2d8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "xuanwu-i-00708880-4e2d8",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    "xuanwu-i-00708880-4e2d8.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "65970295651",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??
    "1:65970295651:web:4a1a83b030cb730ec93956",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "G-CJYNJP5J86",
};

export const firebaseClientApp: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
