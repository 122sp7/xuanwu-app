/**
 * @module lib/firebase/database
 * Firebase Realtime Database wrapper.
 */

import {
  getDatabase,
  ref,
  get,
  set,
  push,
  update,
  remove,
  onValue,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  off,
  query,
  orderByChild,
  orderByKey,
  orderByValue,
  startAt,
  startAfter,
  endAt,
  endBefore,
  equalTo,
  limitToFirst,
  limitToLast,
  serverTimestamp,
  increment,
  runTransaction,
  connectDatabaseEmulator,
  type Database,
  type DatabaseReference,
  type DataSnapshot,
} from "firebase/database";
import { firebaseClientApp } from "./client";

export type { Database, DatabaseReference, DataSnapshot };

let _database: Database | null = null;

export function getFirebaseDatabase(): Database {
  if (!_database) {
    _database = getDatabase(firebaseClientApp);
    if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
      const emulatorHost =
        process.env.NEXT_PUBLIC_FIREBASE_DATABASE_EMULATOR_HOST ?? "localhost";
      const emulatorPort = Number(
        process.env.NEXT_PUBLIC_FIREBASE_DATABASE_EMULATOR_PORT ?? "9000"
      );
      connectDatabaseEmulator(_database, emulatorHost, emulatorPort);
    }
  }
  return _database;
}

export const databaseApi = {
  ref,
  get,
  set,
  push,
  update,
  remove,
  onValue,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  off,
  query,
  orderByChild,
  orderByKey,
  orderByValue,
  startAt,
  startAfter,
  endAt,
  endBefore,
  equalTo,
  limitToFirst,
  limitToLast,
  serverTimestamp,
  increment,
  runTransaction,
};
