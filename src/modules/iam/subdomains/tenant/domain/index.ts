// tenant — domain layer
// Owns multi-tenant data isolation: TenantId brand type and repository port.
import { z } from "@lib-zod";

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
