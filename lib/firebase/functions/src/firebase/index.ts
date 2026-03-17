/**
 * @module functions/firebase
 * Firebase Admin SDK barrel.
 * Import from here inside Cloud Functions; do NOT import firebase-admin directly.
 */

export { getAdminApp } from "./app.js";

export {
  getAdminAuth,
  adminAuthApi,
  type Auth,
  type DecodedIdToken,
  type CreateRequest,
  type UpdateRequest,
} from "./auth.js";

export {
  getAdminFirestore,
  adminFirestoreApi,
  type Firestore,
  type DocumentReference,
  type CollectionReference,
  type DocumentSnapshot,
  type QuerySnapshot,
  type WriteBatch,
  type Transaction,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "./firestore.js";

export {
  getAdminDatabase,
  adminDatabaseApi,
  type Database,
  type Reference,
  type DataSnapshot,
} from "./database.js";

export {
  getAdminStorage,
  adminStorageApi,
  type Storage,
} from "./storage.js";

export {
  getAdminMessaging,
  adminMessagingApi,
  type Message,
  type MulticastMessage,
  type BatchResponse,
  type SendResponse,
  type Messaging,
} from "./messaging.js";

export {
  getAdminRemoteConfig,
  adminRemoteConfigApi,
  type RemoteConfig,
  type RemoteConfigTemplate,
  type RemoteConfigParameter,
  type RemoteConfigCondition,
} from "./remote-config.js";

export {
  getAdminAppCheck,
  adminAppCheckApi,
  type AppCheck,
  type DecodedAppCheckToken,
} from "./app-check.js";
