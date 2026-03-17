/**
 * @module infrastructure/firebase
 * Compatibility barrel for infrastructure import paths.
 */

export {
  firebaseClientApp,
  firebaseAdminConfig,
  getFirebaseAuth,
  onFirebaseAuthStateChanged,
  signOutFirebase,
  getFirebaseFirestore,
  firestoreApi,
  type User,
  type Firestore,
} from "@/lib/firebase";
