import { v4 as uuid } from "@lib-uuid";
import type { ResourceQuotaDomainEventType } from "../events/ResourceQuotaDomainEvent";

export type ResourceKind =
  | "members"
  | "storage_bytes"
  | "ai_requests_monthly"
  | "tasks"
  | "workspaces";

export const RESOURCE_KINDS = [
  "members",
  "storage_bytes",
  "ai_requests_monthly",
  "tasks",
  "workspaces",
] as const satisfies readonly ResourceKind[];

export interface ResourceQuotaSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly resourceKind: ResourceKind;
  readonly limit: number;
  readonly current: number;
  readonly reservedAtISO: string;
  readonly updatedAtISO: string;
}

export interface ProvisionResourceQuotaInput {
  readonly workspaceId: string;
  readonly resourceKind: ResourceKind;
  readonly limit: number;
}

export class ResourceQuota {
  private readonly _domainEvents: ResourceQuotaDomainEventType[] = [];

  private constructor(private _props: ResourceQuotaSnapshot) {}

  static provision(id: string, input: ProvisionResourceQuotaInput): ResourceQuota {
    const now = new Date().toISOString();
    const quota = new ResourceQuota({
      id,
      workspaceId: input.workspaceId,
      resourceKind: input.resourceKind,
      limit: input.limit,
      current: 0,
      reservedAtISO: now,
      updatedAtISO: now,
    });
    quota._domainEvents.push({
      type: "workspace.resource.quota-provisioned",
      eventId: uuid(),
      occurredAt: now,
      payload: { quotaId: id, workspaceId: input.workspaceId, resourceKind: input.resourceKind, limit: input.limit },
    });
    return quota;
  }

  static reconstitute(snapshot: ResourceQuotaSnapshot): ResourceQuota {
    return new ResourceQuota({ ...snapshot });
  }

  consume(amount: number): void {
    if (this._props.current + amount > this._props.limit) {
      throw new Error(`Quota exceeded for '${this._props.resourceKind}'. Limit: ${this._props.limit}, Current: ${this._props.current}, Requested: ${amount}.`);
    }
    const now = new Date().toISOString();
    this._props = { ...this._props, current: this._props.current + amount, updatedAtISO: now };
  }

  release(amount: number): void {
    const newCurrent = Math.max(0, this._props.current - amount);
    const now = new Date().toISOString();
    this._props = { ...this._props, current: newCurrent, updatedAtISO: now };
  }

  isExceeded(): boolean {
    return this._props.current >= this._props.limit;
  }

  get id(): string { return this._props.id; }
  get workspaceId(): string { return this._props.workspaceId; }
  get resourceKind(): ResourceKind { return this._props.resourceKind; }
  get limit(): number { return this._props.limit; }
  get current(): number { return this._props.current; }

  getSnapshot(): Readonly<ResourceQuotaSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): ResourceQuotaDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
