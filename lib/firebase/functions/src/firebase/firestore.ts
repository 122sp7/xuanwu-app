/**
 * @module functions/firebase/firestore
 * Firebase Admin Firestore wrapper.
 */

import {
  getFirestore,
  FieldValue,
  FieldPath,
  Timestamp,
  Filter,
  type Firestore,
  type DocumentReference,
  type CollectionReference,
  type DocumentSnapshot,
  type QuerySnapshot,
  type WriteBatch,
  type Transaction,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase-admin/firestore";
import { getAdminApp } from "./app.js";

export type {
  Firestore,
  DocumentReference,
  CollectionReference,
  DocumentSnapshot,
  QuerySnapshot,
  WriteBatch,
  Transaction,
  QueryDocumentSnapshot,
  DocumentData,
};

export function getAdminFirestore(): Firestore {
  return getFirestore(getAdminApp());
}

export const adminFirestoreApi = {
  FieldValue,
  FieldPath,
  Timestamp,
  Filter,
  collection: (path: string) => getAdminFirestore().collection(path),
  doc: (path: string) => getAdminFirestore().doc(path),
  collectionGroup: (collectionId: string) =>
    getAdminFirestore().collectionGroup(collectionId),
  batch: () => getAdminFirestore().batch(),
  runTransaction: <T>(
    updateFn: (transaction: Transaction) => Promise<T>
  ) => getAdminFirestore().runTransaction(updateFn),
  getAll: (...refs: DocumentReference[]) => getAdminFirestore().getAll(...refs),
};
