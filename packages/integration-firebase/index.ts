/**
 * @package integration-firebase
 * Firebase SDK integration — client, auth, firestore, analytics, performance,
 * app-check, remote-config, storage, messaging, database, functions.
 *
 * Import via: import { ... } from "@integration-firebase"
 * Server-only exports (admin): import { firebaseAdminConfig } from "@integration-firebase"
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
export {
  initFirebaseAppCheck,
  appCheckApi,
  type AppCheck,
  type AppCheckToken,
} from "./appcheck";
export {
  getFirebaseAnalytics,
  analyticsApi,
  type Analytics,
  type EventParams,
} from "./analytics";
export {
  getFirebasePerformance,
  performanceApi,
  type FirebasePerformance,
  type PerformanceTrace,
} from "./performance";
export {
  getFirebaseRemoteConfig,
  remoteConfigApi,
  type RemoteConfig,
  type Value,
} from "./remote-config";
export {
  getFirebaseStorage,
  storageApi,
  type FirebaseStorage,
  type StorageReference,
  type UploadTask,
  type FullMetadata,
  type SettableMetadata,
  type ListResult,
} from "./storage";
export {
  getFirebaseMessaging,
  messagingApi,
  type Messaging,
  type MessagePayload,
} from "./messaging";
export {
  getFirebaseFunctions,
  functionsApi,
  type Functions,
  type HttpsCallable,
  type HttpsCallableOptions,
} from "./functions";
export {
  getFirebaseDatabase,
  databaseApi,
  type Database,
  type DatabaseReference,
  type DataSnapshot,
} from "./database";
