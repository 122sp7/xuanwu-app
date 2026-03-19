/**
 * IdentityRepository — Port (interface) for auth operations.
 * Domain layer defines this interface; Infrastructure layer implements it.
 * No Firebase SDK or framework leakage here.
 */

import type { IdentityEntity, SignInCredentials, RegistrationInput } from "../entities/Identity";

export interface IdentityRepository {
  /** Sign in with email + password. Returns the authenticated identity. */
  signInWithEmailAndPassword(credentials: SignInCredentials): Promise<IdentityEntity>;

  /** Sign in anonymously. */
  signInAnonymously(): Promise<IdentityEntity>;

  /** Register a new user. Returns the new identity. */
  createUserWithEmailAndPassword(input: RegistrationInput): Promise<IdentityEntity>;

  /** Update the display name of the current user. */
  updateDisplayName(uid: string, displayName: string): Promise<void>;

  /** Send a password reset email. */
  sendPasswordResetEmail(email: string): Promise<void>;

  /** Sign out the current user. */
  signOut(): Promise<void>;

  /** Get the currently authenticated user, or null. */
  getCurrentUser(): IdentityEntity | null;
}
