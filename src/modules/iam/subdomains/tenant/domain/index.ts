// tenant — domain layer
// Owns multi-tenant data isolation: TenantId brand type and repository port.
import { v4 as randomUUID } from "uuid";
import { z } from "zod";

export const TenantIdSchema = z.string().min(1).brand("TenantId");
export type TenantId = z.infer<typeof TenantIdSchema>;
export function createTenantId(raw: string): TenantId {
  return TenantIdSchema.parse(raw);
}

export type TenantStatus = "active" | "suspended" | "terminated";

export interface TenantSnapshot {
  readonly tenantId: TenantId;
  readonly orgId: string;
  readonly status: TenantStatus;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface TenantRepository {
  findByOrgId(orgId: string): Promise<TenantSnapshot | null>;
  save(tenant: TenantSnapshot): Promise<void>;
}

export type TenantDomainEvent =
  | {
      readonly type: "iam.tenant.provisioned";
      readonly eventId: string;
      readonly occurredAt: string;
      readonly payload: { readonly tenantId: TenantId; readonly orgId: string };
    }
  | {
      readonly type: "iam.tenant.suspended";
      readonly eventId: string;
      readonly occurredAt: string;
      readonly payload: { readonly tenantId: TenantId; readonly orgId: string };
    };

interface CreateTenantProps {
  readonly tenantId: TenantId;
  readonly orgId: string;
}

export class Tenant {
  private _domainEvents: TenantDomainEvent[] = [];

  private constructor(private _props: TenantSnapshot) {}

  static create(input: CreateTenantProps): Tenant {
    const now = new Date().toISOString();
    const tenant = new Tenant({
      tenantId: input.tenantId,
      orgId: input.orgId,
      status: "active",
      createdAtISO: now,
      updatedAtISO: now,
    });
    Tenant.assertInvariants(tenant._props);
    tenant._domainEvents.push({
      type: "iam.tenant.provisioned",
      eventId: randomUUID(),
      occurredAt: now,
      payload: { tenantId: input.tenantId, orgId: input.orgId },
    });
    return tenant;
  }

  static reconstitute(snapshot: TenantSnapshot): Tenant {
    Tenant.assertInvariants(snapshot);
    return new Tenant({ ...snapshot });
  }

  suspend(): void {
    if (this._props.status === "terminated") {
      throw new Error("Cannot suspend terminated tenant");
    }
    if (this._props.status === "suspended") {
      return;
    }
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "suspended", updatedAtISO: now };
    this._domainEvents.push({
      type: "iam.tenant.suspended",
      eventId: randomUUID(),
      occurredAt: now,
      payload: { tenantId: this._props.tenantId, orgId: this._props.orgId },
    });
  }

  getSnapshot(): Readonly<TenantSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): readonly TenantDomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }

  private static assertInvariants(snapshot: TenantSnapshot): void {
    if (snapshot.orgId.trim().length === 0) {
      throw new Error("Tenant orgId must not be empty");
    }
    if (snapshot.createdAtISO.trim().length === 0 || snapshot.updatedAtISO.trim().length === 0) {
      throw new Error("Tenant timestamps must not be empty");
    }
  }
}
