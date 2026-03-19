/**
 * @module lib/firebase/storage
 * Firebase Cloud Storage wrapper.
 */

import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  list,
  getMetadata,
  updateMetadata,
  getBlob,
  getStream,
  type FirebaseStorage,
  type StorageReference,
  type UploadTask,
  type FullMetadata,
  type SettableMetadata,
  type ListResult,
} from "firebase/storage";
import { firebaseClientApp } from "./client";

export type {
  FirebaseStorage,
  StorageReference,
  UploadTask,
  FullMetadata,
  SettableMetadata,
  ListResult,
};

export function getFirebaseStorage(bucketUrl?: string): FirebaseStorage {
  return getStorage(firebaseClientApp, bucketUrl);
}

export const storageApi = {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  list,
  getMetadata,
  updateMetadata,
  getBlob,
  getStream,
};
