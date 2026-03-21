/**
 * @package integration-firebase
 * Firebase SDK integration — unified public barrel for the entire application.
 *
 * This package provides the single import path for all Firebase services:
 *   - Client App initialization
 *   - Admin SDK configuration
 *   - Authentication (Auth)
 *   - Firestore database
 *   - Cloud Storage
 *   - Cloud Functions
 *   - App Check
 *   - Analytics, Performance, Remote Config
 *   - Realtime Database
 *   - Cloud Messaging
 *
 * Server-side Admin SDK initialization lives in Cloud Functions
 * (libs/firebase/functions-python).
 *
 * Usage:
 *   import { getFirebaseFirestore, getFirebaseAuth } from "@integration-firebase";
 */

// ── App instances ──────────────────────────────────────────────────────────
export { firebaseClientApp } from "@/libs/firebase/client";
export { firebaseAdminConfig } from "@/libs/firebase/admin";

// ── Authentication ─────────────────────────────────────────────────────────
export {
  getFirebaseAuth,
  onFirebaseAuthStateChanged,
  signOutFirebase,
  type User,
} from "@/libs/firebase/auth";

// ── Firestore ──────────────────────────────────────────────────────────────
export {
  getFirebaseFirestore,
  firestoreApi,
  type Firestore,
} from "@/libs/firebase/firestore";

// ── App Check ─────────────────────────────────────────────────────────────
export {
  initFirebaseAppCheck,
  appCheckApi,
  type AppCheck,
  type AppCheckToken,
} from "@/libs/firebase/appcheck";

// ── Analytics ─────────────────────────────────────────────────────────────
export {
  getFirebaseAnalytics,
  analyticsApi,
  type Analytics,
  type EventParams,
} from "@/libs/firebase/analytics";

// ── Performance ────────────────────────────────────────────────────────────
export {
  getFirebasePerformance,
  performanceApi,
  type FirebasePerformance,
  type PerformanceTrace,
} from "@/libs/firebase/performance";

// ── Remote Config ──────────────────────────────────────────────────────────
export {
  getFirebaseRemoteConfig,
  remoteConfigApi,
  type RemoteConfig,
  type Value,
} from "@/libs/firebase/remote-config";

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
} from "@/libs/firebase/storage";

// ── Messaging ─────────────────────────────────────────────────────────────
export {
  getFirebaseMessaging,
  messagingApi,
  type Messaging,
  type MessagePayload,
} from "@/libs/firebase/messaging";

// ── Functions ─────────────────────────────────────────────────────────────
export {
  getFirebaseFunctions,
  functionsApi,
  type Functions,
  type HttpsCallable,
  type HttpsCallableOptions,
} from "@/libs/firebase/functions";

// ── Realtime Database ──────────────────────────────────────────────────────
export {
  getFirebaseDatabase,
  databaseApi,
  type Database,
  type DatabaseReference,
  type DataSnapshot,
} from "@/libs/firebase/database";
