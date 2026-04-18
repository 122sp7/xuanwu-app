/**
 * FirebaseAuthIdentityRepository — module-level outbound adapter.
 *
 * Implements IdentityRepository using Firebase Authentication SDK.
 * Lives at the iam module outbound boundary so that @integration-firebase
 * is allowed per ESLint boundary rules (src/modules/<context>/adapters/outbound/**).
 *
 * Domain and application layers are isolated from Firebase via this adapter.
 */

import { firebaseClientApp } from "@packages";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";

import type { IdentityRepository } from "../../subdomains/identity/domain/repositories/IdentityRepository";
import type {
  IdentityEntity,
  RegistrationInput,
  SignInCredentials,
} from "../../subdomains/identity/domain/entities/Identity";

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

export class FirebaseAuthIdentityRepository implements IdentityRepository {
  private get auth() {
    return getAuth(firebaseClientApp);
  }

  async signInWithEmailAndPassword(
    credentials: SignInCredentials,
  ): Promise<IdentityEntity> {
    const result = await signInWithEmailAndPassword(
      this.auth,
      credentials.email,
      credentials.password,
    );
    return toIdentityEntity(result.user);
  }

  async signInAnonymously(): Promise<IdentityEntity> {
    const result = await signInAnonymously(this.auth);
    return toIdentityEntity(result.user);
  }

  async createUserWithEmailAndPassword(
    input: RegistrationInput,
  ): Promise<IdentityEntity> {
    const result = await createUserWithEmailAndPassword(
      this.auth,
      input.email,
      input.password,
    );
    return toIdentityEntity(result.user);
  }

  async updateDisplayName(uid: string, displayName: string): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (currentUser && currentUser.uid === uid) {
      await updateProfile(currentUser, { displayName });
    }
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }

  getCurrentUser(): IdentityEntity | null {
    const user = this.auth.currentUser;
    return user ? toIdentityEntity(user) : null;
  }
}
