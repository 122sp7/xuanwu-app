/**
 * @module libs/firebase/firestore
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
};

export function getFirebaseFirestore() {
  return getFirestore(firebaseClientApp);
}
