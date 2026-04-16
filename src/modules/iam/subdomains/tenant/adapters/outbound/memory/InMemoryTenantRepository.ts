import type { TenantSnapshot, TenantRepository } from "../../../domain/index";

export class InMemoryTenantRepository implements TenantRepository {
  private readonly store = new Map<string, TenantSnapshot>();

  async findByOrgId(orgId: string): Promise<TenantSnapshot | null> {
    return this.store.get(orgId) ?? null;
  }

  async save(tenant: TenantSnapshot): Promise<void> {
    this.store.set(tenant.orgId, tenant);
  }
}
