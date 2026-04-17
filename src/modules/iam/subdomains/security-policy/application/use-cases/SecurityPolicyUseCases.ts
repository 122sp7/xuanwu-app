import type { SecurityPolicySnapshot, SecurityPolicyRepository } from "../../domain/index";

export class GetSecurityPolicyUseCase {
  constructor(private readonly repo: SecurityPolicyRepository) {}

  async execute(input: { orgId: string }): Promise<SecurityPolicySnapshot | null> {
    return this.repo.findByOrgId(input.orgId);
  }
}

export class UpdateSecurityPolicyUseCase {
  constructor(private readonly repo: SecurityPolicyRepository) {}

  async execute(
    input: Omit<SecurityPolicySnapshot, "updatedAtISO">,
  ): Promise<SecurityPolicySnapshot> {
    const policy: SecurityPolicySnapshot = {
      ...input,
      updatedAtISO: new Date().toISOString(),
    };
    await this.repo.save(policy);
    return policy;
  }
}
