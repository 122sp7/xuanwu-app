import type { ResourceKind } from "../entities/ResourceQuota";

export interface ResourceQuotaDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface QuotaProvisionedEvent extends ResourceQuotaDomainEvent {
  readonly type: "workspace.resource.quota-provisioned";
  readonly payload: { readonly quotaId: string; readonly workspaceId: string; readonly resourceKind: ResourceKind; readonly limit: number };
}

export interface QuotaExceededEvent extends ResourceQuotaDomainEvent {
  readonly type: "workspace.resource.quota-exceeded";
  readonly payload: { readonly quotaId: string; readonly workspaceId: string; readonly resourceKind: ResourceKind };
}

export type ResourceQuotaDomainEventType = QuotaProvisionedEvent | QuotaExceededEvent;
