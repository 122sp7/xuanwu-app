// security-policy — domain layer
// Owns org-level security rules: password policy, MFA requirements, session limits.
import { v4 as randomUUID } from "uuid";

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

export type SecurityPolicyDomainEvent =
  | {
      readonly type: "iam.security_policy.created";
      readonly eventId: string;
      readonly occurredAt: string;
      readonly payload: { readonly policyId: string; readonly orgId: string };
    }
  | {
      readonly type: "iam.security_policy.updated";
      readonly eventId: string;
      readonly occurredAt: string;
      readonly payload: { readonly policyId: string; readonly orgId: string };
    };

interface CreateSecurityPolicyProps {
  readonly policyId: string;
  readonly orgId: string;
  readonly mfaRequirement: MfaRequirement;
  readonly minPasswordLength: number;
  readonly sessionTimeoutMinutes: number;
  readonly allowedDomains: readonly string[];
}

export class SecurityPolicy {
  private _domainEvents: SecurityPolicyDomainEvent[] = [];

  private constructor(private _props: SecurityPolicySnapshot) {}

  static create(input: CreateSecurityPolicyProps): SecurityPolicy {
    const now = new Date().toISOString();
    const policy = new SecurityPolicy({
      policyId: input.policyId,
      orgId: input.orgId,
      mfaRequirement: input.mfaRequirement,
      minPasswordLength: input.minPasswordLength,
      sessionTimeoutMinutes: input.sessionTimeoutMinutes,
      allowedDomains: SecurityPolicy.normalizeDomains(input.allowedDomains),
      updatedAtISO: now,
    });
    policy._domainEvents.push({
      type: "iam.security_policy.created",
      eventId: randomUUID(),
      occurredAt: now,
      payload: { policyId: input.policyId, orgId: input.orgId },
    });
    return policy;
  }

  static reconstitute(snapshot: SecurityPolicySnapshot): SecurityPolicy {
    SecurityPolicy.assertInvariants(snapshot);
    return new SecurityPolicy({
      ...snapshot,
      allowedDomains: SecurityPolicy.normalizeDomains(snapshot.allowedDomains),
    });
  }

  update(input: {
    readonly mfaRequirement: MfaRequirement;
    readonly minPasswordLength: number;
    readonly sessionTimeoutMinutes: number;
    readonly allowedDomains: readonly string[];
  }): void {
    const next: SecurityPolicySnapshot = {
      ...this._props,
      mfaRequirement: input.mfaRequirement,
      minPasswordLength: input.minPasswordLength,
      sessionTimeoutMinutes: input.sessionTimeoutMinutes,
      allowedDomains: SecurityPolicy.normalizeDomains(input.allowedDomains),
      updatedAtISO: new Date().toISOString(),
    };
    SecurityPolicy.assertInvariants(next);
    this._props = next;
    this._domainEvents.push({
      type: "iam.security_policy.updated",
      eventId: randomUUID(),
      occurredAt: next.updatedAtISO,
      payload: { policyId: next.policyId, orgId: next.orgId },
    });
  }

  getSnapshot(): Readonly<SecurityPolicySnapshot> {
    return Object.freeze({
      ...this._props,
      allowedDomains: [...this._props.allowedDomains],
    });
  }

  pullDomainEvents(): readonly SecurityPolicyDomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }

  private static assertInvariants(snapshot: SecurityPolicySnapshot): void {
    if (snapshot.policyId.trim().length === 0) {
      throw new Error("SecurityPolicy policyId must not be empty");
    }
    if (snapshot.orgId.trim().length === 0) {
      throw new Error("SecurityPolicy orgId must not be empty");
    }
    if (snapshot.minPasswordLength < 8) {
      throw new Error("SecurityPolicy minPasswordLength must be at least 8");
    }
    if (snapshot.sessionTimeoutMinutes <= 0) {
      throw new Error("SecurityPolicy sessionTimeoutMinutes must be greater than 0");
    }
  }

  private static normalizeDomains(domains: readonly string[]): readonly string[] {
    return [...new Set(domains.map((domain) => domain.trim().toLowerCase()).filter(Boolean))];
  }
}
