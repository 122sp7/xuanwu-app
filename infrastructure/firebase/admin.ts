// Firebase Admin SDK - server-side only
// import * as admin from "firebase-admin";
// Initialize admin SDK with service account credentials from environment

export const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};
