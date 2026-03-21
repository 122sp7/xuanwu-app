/**
 * @package integration-firebase
 * Firebase SDK integration — unified public barrel for the entire application.
 *
 * This package IS the source of truth for all Firebase SDK wiring.
 * All Firebase SDK initialization and service helpers live in the sub-files
 * alongside this index. No re-exports from external libs/ paths.
 *
 * Usage:
 *   import { firebaseClientApp, getFirebaseFirestore } from "@integration-firebase";
 */

// ── App instances ──────────────────────────────────────────────────────────
export { firebaseClientApp } from "./client";
export { firebaseAdminConfig } from "./admin";

// ── Authentication ─────────────────────────────────────────────────────────
export {
  getFirebaseAuth,
  onFirebaseAuthStateChanged,
  signOutFirebase,
  type User,
} from "./auth";

// ── Firestore ──────────────────────────────────────────────────────────────
export {
  getFirebaseFirestore,
  firestoreApi,
  type Firestore,
} from "./firestore";

// ── App Check ─────────────────────────────────────────────────────────────
export {
  initFirebaseAppCheck,
  appCheckApi,
  type AppCheck,
  type AppCheckToken,
} from "./appcheck";

// ── Analytics ─────────────────────────────────────────────────────────────
export {
  getFirebaseAnalytics,
  analyticsApi,
  type Analytics,
  type EventParams,
} from "./analytics";

// ── Performance ────────────────────────────────────────────────────────────
export {
  getFirebasePerformance,
  performanceApi,
  type FirebasePerformance,
  type PerformanceTrace,
} from "./performance";

// ── Remote Config ──────────────────────────────────────────────────────────
export {
  getFirebaseRemoteConfig,
  remoteConfigApi,
  type RemoteConfig,
  type Value,
} from "./remote-config";

// ── Storage ────────────────────────────────────────────────────────────────
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

// ── Messaging ─────────────────────────────────────────────────────────────
export {
  getFirebaseMessaging,
  messagingApi,
  type Messaging,
  type MessagePayload,
} from "./messaging";

// ── Functions ─────────────────────────────────────────────────────────────
export {
  getFirebaseFunctions,
  functionsApi,
  type Functions,
  type HttpsCallable,
  type HttpsCallableOptions,
} from "./functions";

// ── Realtime Database ──────────────────────────────────────────────────────
export {
  getFirebaseDatabase,
  databaseApi,
  type Database,
  type DatabaseReference,
  type DataSnapshot,
} from "./database";
