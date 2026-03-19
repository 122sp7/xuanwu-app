/**
 * FirebaseIdentityRepository — Infrastructure adapter implementing IdentityRepository port.
 * Translates Firebase Auth SDK calls into domain entities.
 * Firebase SDK only exists in this file, never in domain or application layers.
 */

import {
  getAuth,
  signInWithEmailAndPassword as fbSignIn,
  signInAnonymously as fbSignInAnonymously,
  createUserWithEmailAndPassword as fbCreateUser,
  updateProfile,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";
import { firebaseClientApp } from "@/infrastructure/firebase/client";
import type { IdentityRepository } from "../../domain/repositories/IdentityRepository";
import type {
  IdentityEntity,
  SignInCredentials,
  RegistrationInput,
} from "../../domain/entities/Identity";

// ─── Mapper: Firebase User → Domain IdentityEntity ──────────────────────────

function toIdentityEntity(user: User): IdentityEntity {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous,
    emailVerified: user.emailVerified,
  };
}

// ─── Adapter ─────────────────────────────────────────────────────────────────

export class FirebaseIdentityRepository implements IdentityRepository {
  private get auth() {
    return getAuth(firebaseClientApp);
  }

  async signInWithEmailAndPassword(
    credentials: SignInCredentials,
  ): Promise<IdentityEntity> {
    const result = await fbSignIn(this.auth, credentials.email, credentials.password);
    return toIdentityEntity(result.user);
  }

  async signInAnonymously(): Promise<IdentityEntity> {
    const result = await fbSignInAnonymously(this.auth);
    return toIdentityEntity(result.user);
  }

  async createUserWithEmailAndPassword(
    input: RegistrationInput,
  ): Promise<IdentityEntity> {
    const result = await fbCreateUser(this.auth, input.email, input.password);
    return toIdentityEntity(result.user);
  }

  async updateDisplayName(uid: string, displayName: string): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (currentUser && currentUser.uid === uid) {
      await updateProfile(currentUser, { displayName });
    }
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    await fbSendPasswordResetEmail(this.auth, email);
  }

  async signOut(): Promise<void> {
    await fbSignOut(this.auth);
  }

  getCurrentUser(): IdentityEntity | null {
    const user = this.auth.currentUser;
    return user ? toIdentityEntity(user) : null;
  }
}
