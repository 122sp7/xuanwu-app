export interface ApiKeyDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface ApiKeyCreatedEvent extends ApiKeyDomainEvent {
  readonly type: "workspace.api-key.created";
  readonly payload: { readonly apiKeyId: string; readonly workspaceId: string };
}

export interface ApiKeyRevokedEvent extends ApiKeyDomainEvent {
  readonly type: "workspace.api-key.revoked";
  readonly payload: { readonly apiKeyId: string; readonly workspaceId: string };
}

export type ApiKeyDomainEventType = ApiKeyCreatedEvent | ApiKeyRevokedEvent;
