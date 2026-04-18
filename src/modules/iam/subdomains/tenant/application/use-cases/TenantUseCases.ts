import { Tenant, createTenantId } from "../../domain/index";
import type { TenantId, TenantSnapshot, TenantRepository } from "../../domain/index";

export class ProvisionTenantUseCase {
  constructor(private readonly repo: TenantRepository) {}

  async execute(input: { orgId: string }): Promise<TenantSnapshot> {
    const tenantId: TenantId = createTenantId(`tenant-${input.orgId}`);
    const tenant = Tenant.create({ tenantId, orgId: input.orgId });
    const snapshot = tenant.getSnapshot();
    await this.repo.save(snapshot);
    return snapshot;
  }
}

export class SuspendTenantUseCase {
  constructor(private readonly repo: TenantRepository) {}

  async execute(input: { orgId: string }): Promise<TenantSnapshot> {
    const existing = await this.repo.findByOrgId(input.orgId);
    if (!existing) {
      throw new Error(`Tenant not found for org ${input.orgId}`);
    }
    const aggregate = Tenant.reconstitute(existing);
    aggregate.suspend();
    const snapshot = aggregate.getSnapshot();
    await this.repo.save(snapshot);
    return snapshot;
  }
}

export class GetTenantUseCase {
  constructor(private readonly repo: TenantRepository) {}

  async execute(input: { orgId: string }): Promise<TenantSnapshot | null> {
    return this.repo.findByOrgId(input.orgId);
  }
}
