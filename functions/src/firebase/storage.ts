/**
 * @module functions/firebase/storage
 * Firebase Admin Cloud Storage wrapper.
 */

import {
  getStorage,
  type Storage,
} from "firebase-admin/storage";
import { getAdminApp } from "./app.js";

export type { Storage };

export function getAdminStorage(): Storage {
  return getStorage(getAdminApp());
}

export const adminStorageApi = {
  /** Default bucket (configured in Firebase project). */
  bucket: (name?: string) => getAdminStorage().bucket(name),
};
