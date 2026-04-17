/**
 * @module integration-firebase
 * Public surface for the Firebase client integration package.
 */

export { firebaseClientApp } from "./client";

export {
  getFirebaseAuth,
  onFirebaseAuthStateChanged,
  signOutFirebase,
  type User,
} from "./auth";

export {
  getFirebaseFirestore,
  firestoreApi,
  type Firestore,
} from "./firestore";
