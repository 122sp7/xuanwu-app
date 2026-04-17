// session — domain layer
// Owns actor session lifecycle: creation, refresh, expiry, revocation.

export interface SessionSnapshot {
  readonly sessionId: string;
  readonly uid: string;
  readonly idToken: string;
  readonly refreshToken: string | null;
  readonly expiresAtISO: string;
  readonly createdAtISO: string;
  readonly isRevoked: boolean;
}

export interface SessionRepository {
  create(session: SessionSnapshot): Promise<void>;
  findById(sessionId: string): Promise<SessionSnapshot | null>;
  findByUid(uid: string): Promise<SessionSnapshot[]>;
  revoke(sessionId: string): Promise<void>;
  revokeAllByUid(uid: string): Promise<void>;
}
