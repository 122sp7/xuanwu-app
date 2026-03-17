/**
 * @module functions/firebase/database
 * Firebase Admin Realtime Database wrapper.
 */

import {
  getDatabase,
  ServerValue,
  type Database,
  type Reference,
  type DataSnapshot,
} from "firebase-admin/database";
import { getAdminApp } from "./app.js";

export type { Database, Reference, DataSnapshot };

export function getAdminDatabase(): Database {
  return getDatabase(getAdminApp());
}

export const adminDatabaseApi = {
  ServerValue,
  ref: (path?: string) => getAdminDatabase().ref(path),
};
