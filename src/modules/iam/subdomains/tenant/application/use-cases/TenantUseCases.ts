import type { TenantId, TenantSnapshot, TenantRepository, TenantStatus } from "../../domain/index";
import { createTenantId } from "../../domain/index";

export class ProvisionTenantUseCase {
  constructor(private readonly repo: TenantRepository) {}

  async execute(input: { orgId: string }): Promise<TenantSnapshot> {
    const tenantId: TenantId = createTenantId(`tenant-${input.orgId}`);
    const tenant: TenantSnapshot = {
      tenantId,
      orgId: input.orgId,
      status: "active",
      createdAtISO: new Date().toISOString(),
      updatedAtISO: new Date().toISOString(),
    };
    await this.repo.save(tenant);
    return tenant;
  }
}

export class SuspendTenantUseCase {
  constructor(private readonly repo: TenantRepository) {}

  async execute(input: { orgId: string }): Promise<TenantSnapshot> {
    const existing = await this.repo.findByOrgId(input.orgId);
    if (!existing) {
      throw new Error(`Tenant not found for org ${input.orgId}`);
    }
    const updated: TenantSnapshot = {
      ...existing,
      status: "suspended" as TenantStatus,
      updatedAtISO: new Date().toISOString(),
    };
    await this.repo.save(updated);
    return updated;
  }
}

export class GetTenantUseCase {
  constructor(private readonly repo: TenantRepository) {}

  async execute(input: { orgId: string }): Promise<TenantSnapshot | null> {
    return this.repo.findByOrgId(input.orgId);
  }
}
