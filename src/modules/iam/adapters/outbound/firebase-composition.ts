/**
 * firebase-composition — iam module outbound composition root.
 *
 * Wires Firebase-backed repository implementations into domain use cases.
 * This file is the ONLY entry point for Firebase SDK access within the iam
 * module. All other layers remain infrastructure-agnostic.
 *
 * ESLint: @integration-firebase is allowed here because this file lives in
 * src/modules/iam/adapters/outbound/ which matches the permitted glob.
 */

import { getFirebaseAuth, onFirebaseAuthStateChanged, signOutFirebase, getFirebaseFirestore, firestoreApi, type User } from "@packages";
import { FirebaseAuthIdentityRepository } from "./FirebaseAuthIdentityRepository";
import { FirebaseAccountQueryRepository } from "./FirebaseAccountQueryRepository";
import {
  FirestoreAccountRepository,
  type FirestoreLike,
} from "../../subdomains/account/adapters/outbound/firestore/FirestoreAccountRepository";
import {
  FirestoreOrganizationRepository,
  type OrgFirestoreLike,
} from "../../subdomains/organization/adapters/outbound/firestore/FirestoreOrganizationRepository";
import {
  SignInUseCase,
  SignInAnonymouslyUseCase,
  RegisterUseCase,
  SendPasswordResetEmailUseCase,
} from "../../subdomains/identity/application/use-cases/IdentityUseCases";
import { CreateUserAccountUseCase } from "../../subdomains/account/application/use-cases/AccountUseCases";
import { CreateOrganizationUseCase } from "../../subdomains/organization/application/use-cases/OrganizationLifecycleUseCases";
import type { AccountSnapshot } from "../../subdomains/account/domain/entities/Account";
import type { Unsubscribe } from "../../subdomains/account/domain/repositories/AccountQueryRepository";

// ─── Singleton repositories ───────────────────────────────────────────────────

let _identityRepo: FirebaseAuthIdentityRepository | undefined;
let _accountQueryRepo: FirebaseAccountQueryRepository | undefined;
let _orgRepo: FirestoreOrganizationRepository | undefined;

function getIdentityRepo(): FirebaseAuthIdentityRepository {
  if (!_identityRepo) _identityRepo = new FirebaseAuthIdentityRepository();
  return _identityRepo;
}

function getAccountQueryRepo(): FirebaseAccountQueryRepository {
  if (!_accountQueryRepo) _accountQueryRepo = new FirebaseAccountQueryRepository();
  return _accountQueryRepo;
}

function getOrgRepo(): FirestoreOrganizationRepository {
  if (!_orgRepo) _orgRepo = new FirestoreOrganizationRepository(createOrgFirestoreLikeAdapter());
  return _orgRepo;
}

// ─── FirestoreLike adapter ────────────────────────────────────────────────────
// Bridges the Firestore SDK to the FirestoreLike interface expected by
// FirestoreAccountRepository (subdomain-level adapter, technology-agnostic).

function createFirestoreLikeAdapter(): FirestoreLike {
  const { doc, getDoc, setDoc, deleteDoc } = firestoreApi;
  return {
    async get(collectionName: string, id: string): Promise<Record<string, unknown> | null> {
      const db = getFirebaseFirestore();
      const snap = await getDoc(doc(db, collectionName, id));
      return snap.exists() ? (snap.data() as Record<string, unknown>) : null;
    },
    async set(
      collectionName: string,
      id: string,
      data: Record<string, unknown>,
    ): Promise<void> {
      const db = getFirebaseFirestore();
      await setDoc(doc(db, collectionName, id), data);
    },
    async delete(collectionName: string, id: string): Promise<void> {
      const db = getFirebaseFirestore();
      await deleteDoc(doc(db, collectionName, id));
    },
  };
}

// ─── OrgFirestoreLike adapter ─────────────────────────────────────────────────
// Bridges the Firestore SDK to the OrgFirestoreLike interface for org operations
// (subcollections, etc.).

function createOrgFirestoreLikeAdapter(): OrgFirestoreLike {
  const { doc, getDoc, setDoc, deleteDoc, collection, getDocs } = firestoreApi;
  return {
    async get(col: string, id: string): Promise<Record<string, unknown> | null> {
      const db = getFirebaseFirestore();
      const snap = await getDoc(doc(db, col, id));
      return snap.exists() ? (snap.data() as Record<string, unknown>) : null;
    },
    async set(col: string, id: string, data: Record<string, unknown>): Promise<void> {
      const db = getFirebaseFirestore();
      await setDoc(doc(db, col, id), data, { merge: true });
    },
    async delete(col: string, id: string): Promise<void> {
      const db = getFirebaseFirestore();
      await deleteDoc(doc(db, col, id));
    },
    async getSubcollection(
      col: string,
      parentId: string,
      sub: string,
    ): Promise<{ id: string; data: Record<string, unknown> }[]> {
      const db = getFirebaseFirestore();
      const snap = await getDocs(collection(db, col, parentId, sub));
      return snap.docs.map((d: { id: string; data: () => Record<string, unknown> }) => ({
        id: d.id,
        data: d.data(),
      }));
    },
    async setSubdoc(
      col: string,
      parentId: string,
      sub: string,
      id: string,
      data: Record<string, unknown>,
    ): Promise<void> {
      const db = getFirebaseFirestore();
      await setDoc(doc(db, col, parentId, sub, id), data, { merge: true });
    },
    async deleteSubdoc(
      col: string,
      parentId: string,
      sub: string,
      id: string,
    ): Promise<void> {
      const db = getFirebaseFirestore();
      await deleteDoc(doc(db, col, parentId, sub, id));
    },
  };
}

// ─── Auth use-case factory ────────────────────────────────────────────────────

/**
 * Returns Firebase-backed auth use cases for use in "use client" components.
 * Each call creates fresh use-case instances sharing one repository instance.
 */
export function createClientAuthUseCases() {
  const repo = getIdentityRepo();
  return {
    signInUseCase: new SignInUseCase(repo),
    signInAnonymouslyUseCase: new SignInAnonymouslyUseCase(repo),
    registerUseCase: new RegisterUseCase(repo),
    sendPasswordResetEmailUseCase: new SendPasswordResetEmailUseCase(repo),
  };
}

// ─── Account use-case factory ─────────────────────────────────────────────────

/**
 * Returns Firebase-backed account use cases for use in "use client" components.
 */
export function createClientAccountUseCases() {
  const repo = new FirestoreAccountRepository(createFirestoreLikeAdapter());
  return {
    createUserAccountUseCase: new CreateUserAccountUseCase(repo),
  };
}

// ─── Auth state subscription ──────────────────────────────────────────────────

export type { User };

/**
 * Subscribes to Firebase auth state changes.
 * Returns an unsubscribe function.
 * For use in "use client" auth providers only.
 */
export function subscribeToAuthState(
  callback: (user: User | null) => void,
): Unsubscribe {
  const auth = getFirebaseAuth();
  return onFirebaseAuthStateChanged(auth, callback);
}

/**
 * Signs the current user out of Firebase Auth.
 */
export async function firebaseSignOut(): Promise<void> {
  await signOutFirebase(getFirebaseAuth());
}

// ─── Account subscriptions ────────────────────────────────────────────────────

/**
 * Subscribes to real-time updates for all organisation accounts associated
 * with the given userId (owned or membership).
 */
export function subscribeToAccountsForUser(
  userId: string,
  onUpdate: (accounts: Record<string, AccountSnapshot>) => void,
): Unsubscribe {
  return getAccountQueryRepo().subscribeToAccountsForUser(userId, onUpdate);
}

// ─── Organisation use-case factory ───────────────────────────────────────────

/**
 * Returns Firebase-backed organisation use cases for use in "use client"
 * components.
 */
export function createClientOrganizationUseCases() {
  return {
    createOrganizationUseCase: new CreateOrganizationUseCase(getOrgRepo()),
  };
}
