/**
 * @module infrastructure/firebase
 * Compatibility barrel for infrastructure import paths.
 * Client-side Firebase SDK — server-side Admin SDK is in functions/src/firebase.
 */

export {
  firebaseClientApp,
  firebaseAdminConfig,
  // Auth
  getFirebaseAuth,
  onFirebaseAuthStateChanged,
  signOutFirebase,
  type User,
  // Firestore
  getFirebaseFirestore,
  firestoreApi,
  type Firestore,
  // App Check
  initFirebaseAppCheck,
  appCheckApi,
  type AppCheck,
  type AppCheckToken,
  // Analytics
  getFirebaseAnalytics,
  analyticsApi,
  type Analytics,
  type EventParams,
  // Performance
  getFirebasePerformance,
  performanceApi,
  type FirebasePerformance,
  type PerformanceTrace,
  // Remote Config
  getFirebaseRemoteConfig,
  remoteConfigApi,
  type RemoteConfig,
  type Value,
  // Storage
  getFirebaseStorage,
  storageApi,
  type FirebaseStorage,
  type StorageReference,
  type UploadTask,
  type FullMetadata,
  type SettableMetadata,
  type ListResult,
  // Messaging
  getFirebaseMessaging,
  messagingApi,
  type Messaging,
  type MessagePayload,
  // Functions
  getFirebaseFunctions,
  functionsApi,
  type Functions,
  type HttpsCallable,
  type HttpsCallableOptions,
  // Realtime Database
  getFirebaseDatabase,
  databaseApi,
  type Database,
  type DatabaseReference,
  type DataSnapshot,
} from "@/libs/firebase";
