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

export {
  getFirebaseFunctions,
  httpsCallable,
  type Functions,
} from "./functions";

export {
  getFirebaseStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  type FirebaseStorage,
  type StorageReference,
  type UploadResult,
  type UploadTask,
} from "./storage";
