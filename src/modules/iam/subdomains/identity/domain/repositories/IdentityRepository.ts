import type { IdentityEntity, RegistrationInput, SignInCredentials } from "../entities/Identity";

export interface IdentityRepository {
  signInWithEmailAndPassword(credentials: SignInCredentials): Promise<IdentityEntity>;
  signInAnonymously(): Promise<IdentityEntity>;
  createUserWithEmailAndPassword(input: RegistrationInput): Promise<IdentityEntity>;
  updateDisplayName(uid: string, displayName: string): Promise<void>;
  sendPasswordResetEmail(email: string): Promise<void>;
  signOut(): Promise<void>;
  getCurrentUser(): IdentityEntity | null;
}
