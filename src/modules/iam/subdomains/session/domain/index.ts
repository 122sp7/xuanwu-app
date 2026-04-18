// session — domain layer
// Owns actor session lifecycle: creation, refresh, expiry, revocation.
import { v4 as randomUUID } from "uuid";

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
  save(session: SessionSnapshot): Promise<void>;
  saveMany(sessions: readonly SessionSnapshot[]): Promise<void>;
  findById(sessionId: string): Promise<SessionSnapshot | null>;
  findByUid(uid: string): Promise<SessionSnapshot[]>;
}

export type SessionDomainEvent =
  | {
      readonly type: "iam.session.created";
      readonly eventId: string;
      readonly occurredAt: string;
      readonly payload: { readonly sessionId: string; readonly uid: string };
    }
  | {
      readonly type: "iam.session.revoked";
      readonly eventId: string;
      readonly occurredAt: string;
      readonly payload: { readonly sessionId: string; readonly uid: string };
    };

interface CreateSessionProps {
  readonly sessionId: string;
  readonly uid: string;
  readonly idToken: string;
  readonly refreshToken: string | null;
  readonly expiresAtISO: string;
}

export class Session {
  private _domainEvents: SessionDomainEvent[] = [];

  private constructor(private _props: SessionSnapshot) {}

  static create(input: CreateSessionProps): Session {
    const now = new Date().toISOString();
    const session = new Session({
      ...input,
      createdAtISO: now,
      isRevoked: false,
    });
    Session.assertInvariants(session._props);
    session._domainEvents.push({
      type: "iam.session.created",
      eventId: randomUUID(),
      occurredAt: now,
      payload: { sessionId: input.sessionId, uid: input.uid },
    });
    return session;
  }

  static reconstitute(snapshot: SessionSnapshot): Session {
    Session.assertInvariants(snapshot);
    return new Session({ ...snapshot });
  }

  revoke(): void {
    if (this._props.isRevoked) {
      return;
    }
    const now = new Date().toISOString();
    this._props = { ...this._props, isRevoked: true };
    this._domainEvents.push({
      type: "iam.session.revoked",
      eventId: randomUUID(),
      occurredAt: now,
      payload: { sessionId: this._props.sessionId, uid: this._props.uid },
    });
  }

  getSnapshot(): Readonly<SessionSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): readonly SessionDomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }

  private static assertInvariants(snapshot: SessionSnapshot): void {
    if (snapshot.sessionId.trim().length === 0) {
      throw new Error("Session sessionId must not be empty");
    }
    if (snapshot.uid.trim().length === 0) {
      throw new Error("Session uid must not be empty");
    }
    if (snapshot.idToken.trim().length === 0) {
      throw new Error("Session idToken must not be empty");
    }
    if (snapshot.expiresAtISO.trim().length === 0) {
      throw new Error("Session expiresAtISO must not be empty");
    }
    if (snapshot.createdAtISO.trim().length === 0) {
      throw new Error("Session createdAtISO must not be empty");
    }
  }
}
