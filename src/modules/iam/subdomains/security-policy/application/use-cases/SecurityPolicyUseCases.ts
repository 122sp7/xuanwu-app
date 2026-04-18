import { SecurityPolicy } from "../../domain/index";
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
    const existing = await this.repo.findByOrgId(input.orgId);
    const aggregate = existing
      ? SecurityPolicy.reconstitute(existing)
      : SecurityPolicy.create({
          policyId: input.policyId,
          orgId: input.orgId,
          mfaRequirement: input.mfaRequirement,
          minPasswordLength: input.minPasswordLength,
          sessionTimeoutMinutes: input.sessionTimeoutMinutes,
          allowedDomains: input.allowedDomains,
        });

    if (existing) {
      aggregate.update({
        mfaRequirement: input.mfaRequirement,
        minPasswordLength: input.minPasswordLength,
        sessionTimeoutMinutes: input.sessionTimeoutMinutes,
        allowedDomains: input.allowedDomains,
      });
    }

    const snapshot = aggregate.getSnapshot();
    await this.repo.save(snapshot);
    return snapshot;
  }
}
