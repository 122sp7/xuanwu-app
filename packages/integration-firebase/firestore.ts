/**
 * @module integration-firebase/firestore
 * Firebase Firestore client helpers.
 */

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  runTransaction,
  writeBatch,
  increment,
  type Firestore,
} from "firebase/firestore";
import { firebaseClientApp } from "./client";

export type { Firestore };

export const firestoreApi = {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  runTransaction,
  writeBatch,
  increment,
};

export function getFirebaseFirestore(): Firestore {
  return getFirestore(firebaseClientApp);
}
