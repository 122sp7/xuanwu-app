import { v4 as uuid } from "@lib-uuid";
import type { EntitlementGrantDomainEventType } from "../events/EntitlementGrantDomainEvent";
import { createEntitlementId, canSuspend, canRevoke } from "../value-objects";
import type { EntitlementStatus } from "../value-objects";

export interface EntitlementGrantSnapshot {
  readonly id: string;
  readonly contextId: string;
  readonly featureKey: string;
  readonly quota: number | null;
  readonly status: EntitlementStatus;
  readonly grantedAt: string;
  readonly expiresAt: string | null;
  readonly updatedAtISO: string;
}

export interface CreateEntitlementGrantInput {
  readonly contextId: string;
  readonly featureKey: string;
  readonly quota?: number | null;
  readonly expiresAt?: string | null;
}

export class EntitlementGrant {
  private readonly _domainEvents: EntitlementGrantDomainEventType[] = [];

  private constructor(private _props: EntitlementGrantSnapshot) {}

  static create(id: string, input: CreateEntitlementGrantInput): EntitlementGrant {
    createEntitlementId(id);
    const now = new Date().toISOString();
    const grant = new EntitlementGrant({
      id,
      contextId: input.contextId,
      featureKey: input.featureKey,
      quota: input.quota ?? null,
      status: "active",
      grantedAt: now,
      expiresAt: input.expiresAt ?? null,
      updatedAtISO: now,
    });
    grant._domainEvents.push({
      type: "platform.entitlement.granted",
      eventId: uuid(),
      occurredAt: now,
      payload: {
        entitlementId: id,
        contextId: input.contextId,
        featureKey: input.featureKey,
        quota: input.quota ?? null,
      },
    });
    return grant;
  }

  static reconstitute(snapshot: EntitlementGrantSnapshot): EntitlementGrant {
    createEntitlementId(snapshot.id);
    return new EntitlementGrant({ ...snapshot });
  }

  suspend(): void {
    if (!canSuspend(this._props.status)) {
      throw new Error("Only active entitlement can be suspended.");
    }
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "suspended", updatedAtISO: now };
    this._domainEvents.push({
      type: "platform.entitlement.suspended",
      eventId: uuid(),
      occurredAt: now,
      payload: { entitlementId: this._props.id, contextId: this._props.contextId },
    });
  }

  revoke(): void {
    if (!canRevoke(this._props.status)) {
      throw new Error("Entitlement is already revoked.");
    }
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "revoked", updatedAtISO: now };
    this._domainEvents.push({
      type: "platform.entitlement.revoked",
      eventId: uuid(),
      occurredAt: now,
      payload: { entitlementId: this._props.id, contextId: this._props.contextId },
    });
  }

  expire(): void {
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "expired", updatedAtISO: now };
    this._domainEvents.push({
      type: "platform.entitlement.expired",
      eventId: uuid(),
      occurredAt: now,
      payload: { entitlementId: this._props.id, contextId: this._props.contextId },
    });
  }

  get id(): string { return this._props.id; }
  get contextId(): string { return this._props.contextId; }
  get featureKey(): string { return this._props.featureKey; }
  get quota(): number | null { return this._props.quota; }
  get status(): EntitlementStatus { return this._props.status; }
  get grantedAt(): string { return this._props.grantedAt; }
  get expiresAt(): string | null { return this._props.expiresAt; }
  get isActive(): boolean { return this._props.status === "active"; }

  getSnapshot(): Readonly<EntitlementGrantSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): EntitlementGrantDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
