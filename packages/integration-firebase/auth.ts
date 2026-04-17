/**
 * @module integration-firebase/auth
 * Firebase Authentication client helpers.
 */

import {
  getAuth,
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";
import { firebaseClientApp } from "./client";

export type { User };

export const onFirebaseAuthStateChanged = onAuthStateChanged;
export const signOutFirebase = signOut;

export function getFirebaseAuth() {
  return getAuth(firebaseClientApp);
}
