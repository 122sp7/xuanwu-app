// security-policy — domain layer
// Owns org-level security rules: password policy, MFA requirements, session limits.

export type MfaRequirement = "none" | "optional" | "required";

export interface SecurityPolicySnapshot {
  readonly policyId: string;
  readonly orgId: string;
  readonly mfaRequirement: MfaRequirement;
  readonly minPasswordLength: number;
  readonly sessionTimeoutMinutes: number;
  readonly allowedDomains: readonly string[];
  readonly updatedAtISO: string;
}

export interface SecurityPolicyRepository {
  findByOrgId(orgId: string): Promise<SecurityPolicySnapshot | null>;
  save(policy: SecurityPolicySnapshot): Promise<void>;
}
