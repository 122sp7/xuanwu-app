import type { SecurityPolicySnapshot, SecurityPolicyRepository } from "../../../domain/index";

export class InMemorySecurityPolicyRepository implements SecurityPolicyRepository {
  private readonly store = new Map<string, SecurityPolicySnapshot>();

  async findByOrgId(orgId: string): Promise<SecurityPolicySnapshot | null> {
    return this.store.get(orgId) ?? null;
  }

  async save(policy: SecurityPolicySnapshot): Promise<void> {
    this.store.set(policy.orgId, policy);
  }
}
