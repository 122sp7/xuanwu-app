/**
 * @module lib/firebase
 */

export { firebaseClientApp } from "./client";
export { firebaseAdminConfig } from "./admin";
export {
  getFirebaseAuth,
  onFirebaseAuthStateChanged,
  signOutFirebase,
  type User,
} from "./auth";
export { getFirebaseFirestore, firestoreApi, type Firestore } from "./firestore";
