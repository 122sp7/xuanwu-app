import { v4 as uuid } from "@lib-uuid";
import type { IdentityDomainEventType } from "../events/IdentityDomainEvent";
import { canReactivate, canSuspend, type IdentityStatus } from "../value-objects/IdentityStatus";
import { createDisplayName, createEmail, createUserId } from "../value-objects";

export interface UserIdentitySnapshot {
  readonly uid: string;
  readonly email: string | null;
  readonly displayName: string | null;
  readonly photoURL: string | null;
  readonly isAnonymous: boolean;
  readonly emailVerified: boolean;
  readonly status: IdentityStatus;
  readonly lastSignInAtISO: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateIdentityInput {
  readonly email: string | null;
  readonly displayName: string | null;
  readonly photoURL: string | null;
  readonly isAnonymous: boolean;
  readonly emailVerified: boolean;
}

export class UserIdentity {
  private readonly _domainEvents: IdentityDomainEventType[] = [];

  private constructor(private _props: UserIdentitySnapshot) {}

  static create(uid: string, input: CreateIdentityInput): UserIdentity {
    createUserId(uid);
    if (input.email !== null) {
      createEmail(input.email);
    }
    const normalizedDisplayName =
      input.displayName === null ? null : createDisplayName(input.displayName);
    const now = new Date().toISOString();
    const aggregate = new UserIdentity({
      uid,
      email: input.email,
      displayName: normalizedDisplayName ?? null,
      photoURL: input.photoURL,
      isAnonymous: input.isAnonymous,
      emailVerified: input.emailVerified,
      status: "active",
      lastSignInAtISO: null,
      createdAtISO: now,
      updatedAtISO: now,
    });
    aggregate._domainEvents.push({
      type: "platform.identity.created",
      eventId: uuid(),
      occurredAt: now,
      payload: {
        uid,
        email: input.email,
        isAnonymous: input.isAnonymous,
      },
    });
    return aggregate;
  }

  static reconstitute(snapshot: UserIdentitySnapshot): UserIdentity {
    return new UserIdentity({ ...snapshot });
  }

  signIn(): void {
    if (this._props.status !== "active") {
      throw new Error("Cannot sign in with a suspended identity.");
    }
    const now = new Date().toISOString();
    this._props = { ...this._props, lastSignInAtISO: now, updatedAtISO: now };
    this._domainEvents.push({
      type: "platform.identity.signed_in",
      eventId: uuid(),
      occurredAt: now,
      payload: { uid: this._props.uid, signedInAtISO: now },
    });
  }

  updateDisplayName(name: string): void {
    const normalizedName = createDisplayName(name);
    const previousDisplayName = this._props.displayName;
    const now = new Date().toISOString();
    this._props = { ...this._props, displayName: normalizedName, updatedAtISO: now };
    this._domainEvents.push({
      type: "platform.identity.display_name_updated",
      eventId: uuid(),
      occurredAt: now,
      payload: {
        uid: this._props.uid,
        previousDisplayName,
        displayName: normalizedName,
      },
    });
  }

  verifyEmail(): void {
    if (this._props.emailVerified) {
      throw new Error("Identity email is already verified.");
    }
    const now = new Date().toISOString();
    this._props = { ...this._props, emailVerified: true, updatedAtISO: now };
    this._domainEvents.push({
      type: "platform.identity.email_verified",
      eventId: uuid(),
      occurredAt: now,
      payload: { uid: this._props.uid, email: this._props.email },
    });
  }

  suspend(): void {
    if (!canSuspend(this._props.status)) {
      throw new Error("Identity is already suspended.");
    }
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "suspended", updatedAtISO: now };
    this._domainEvents.push({
      type: "platform.identity.suspended",
      eventId: uuid(),
      occurredAt: now,
      payload: { uid: this._props.uid },
    });
  }

  reactivate(): void {
    if (!canReactivate(this._props.status)) {
      throw new Error("Identity is not suspended.");
    }
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "active", updatedAtISO: now };
    this._domainEvents.push({
      type: "platform.identity.reactivated",
      eventId: uuid(),
      occurredAt: now,
      payload: { uid: this._props.uid },
    });
  }

  get uid(): string {
    return this._props.uid;
  }

  get email(): string | null {
    return this._props.email;
  }

  get displayName(): string | null {
    return this._props.displayName;
  }

  get isActive(): boolean {
    return this._props.status === "active";
  }

  get isAnonymous(): boolean {
    return this._props.isAnonymous;
  }

  get emailVerified(): boolean {
    return this._props.emailVerified;
  }

  getSnapshot(): Readonly<UserIdentitySnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): IdentityDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
