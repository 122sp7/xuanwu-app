/**
 * @module integration-firebase/storage
 * Firebase Cloud Storage client helpers.
 */

import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  type FirebaseStorage,
  type StorageReference,
  type UploadResult,
  type UploadTask,
} from "firebase/storage";
import { firebaseClientApp } from "./client";

export type { FirebaseStorage, StorageReference, UploadResult, UploadTask };
export { ref, uploadBytes, uploadBytesResumable, getDownloadURL };

export function getFirebaseStorage(): FirebaseStorage {
  return getStorage(firebaseClientApp);
}
