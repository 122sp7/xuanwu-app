import { v4 as uuid } from "uuid";
import type { ApiKeyDomainEventType } from "../events/ApiKeyDomainEvent";

export type ApiKeyStatus = "active" | "revoked";

export const API_KEY_STATUSES = ["active", "revoked"] as const satisfies readonly ApiKeyStatus[];

export interface ApiKeySnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly label: string;
  readonly keyPrefix: string;
  readonly keyHash: string;
  readonly status: ApiKeyStatus;
  readonly lastUsedAtISO: string | null;
  readonly expiresAtISO: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateApiKeyInput {
  readonly workspaceId: string;
  readonly actorId: string;
  readonly label: string;
  readonly keyPrefix: string;
  readonly keyHash: string;
  readonly expiresAtISO?: string;
}

export class ApiKey {
  private readonly _domainEvents: ApiKeyDomainEventType[] = [];

  private constructor(private _props: ApiKeySnapshot) {}

  static create(id: string, input: CreateApiKeyInput): ApiKey {
    const now = new Date().toISOString();
    const key = new ApiKey({
      id,
      workspaceId: input.workspaceId,
      actorId: input.actorId,
      label: input.label,
      keyPrefix: input.keyPrefix,
      keyHash: input.keyHash,
      status: "active",
      lastUsedAtISO: null,
      expiresAtISO: input.expiresAtISO ?? null,
      createdAtISO: now,
      updatedAtISO: now,
    });
    key._domainEvents.push({
      type: "workspace.api-key.created",
      eventId: uuid(),
      occurredAt: now,
      payload: { apiKeyId: id, workspaceId: input.workspaceId },
    });
    return key;
  }

  static reconstitute(snapshot: ApiKeySnapshot): ApiKey {
    return new ApiKey({ ...snapshot });
  }

  revoke(): void {
    if (this._props.status === "revoked") throw new Error("API key is already revoked.");
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "revoked", updatedAtISO: now };
    this._domainEvents.push({
      type: "workspace.api-key.revoked",
      eventId: uuid(),
      occurredAt: now,
      payload: { apiKeyId: this._props.id, workspaceId: this._props.workspaceId },
    });
  }

  isExpired(): boolean {
    if (!this._props.expiresAtISO) return false;
    return new Date() > new Date(this._props.expiresAtISO);
  }

  get id(): string { return this._props.id; }
  get status(): ApiKeyStatus { return this._props.status; }

  getSnapshot(): Readonly<ApiKeySnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): ApiKeyDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
