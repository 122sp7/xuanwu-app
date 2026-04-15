import type { IdentityRepository } from "../../../domain/repositories/IdentityRepository";
import type { IdentityEntity, SignInCredentials, RegistrationInput } from "../../../domain/entities/Identity";

export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
}

/**
 * Firestore stub for IdentityRepository.
 * Auth operations (sign-in, sign-out) are driven by Firebase Auth SDK in the real adapter.
 * This stub provides Firestore-backed storage for identity documents.
 */
export class FirestoreIdentityRepository implements IdentityRepository {
  private readonly collection = "identities";
  private _currentUser: IdentityEntity | null = null;

  constructor(private readonly db: FirestoreLike) {}

  async signInWithEmailAndPassword(_credentials: SignInCredentials): Promise<IdentityEntity> {
    throw new Error("not yet implemented — requires Firebase Auth SDK");
  }

  async signInAnonymously(): Promise<IdentityEntity> {
    throw new Error("not yet implemented — requires Firebase Auth SDK");
  }

  async createUserWithEmailAndPassword(_input: RegistrationInput): Promise<IdentityEntity> {
    throw new Error("not yet implemented — requires Firebase Auth SDK");
  }

  async updateDisplayName(uid: string, displayName: string): Promise<void> {
    const doc = await this.db.get(this.collection, uid);
    if (!doc) throw new Error(`Identity ${uid} not found`);
    await this.db.set(this.collection, uid, {
      ...doc,
      displayName,
    });
  }

  async sendPasswordResetEmail(_email: string): Promise<void> {
    throw new Error("not yet implemented — requires Firebase Auth SDK");
  }

  async signOut(): Promise<void> {
    this._currentUser = null;
  }

  getCurrentUser(): IdentityEntity | null {
    return this._currentUser;
  }
}
