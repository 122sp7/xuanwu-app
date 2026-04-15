/**
 * AccountPolicy — Domain Entity.
 * Represents an access-control policy attached to an account.
 * Account-level policies trigger CUSTOM_CLAIMS refresh via TokenRefreshPort.
 * Zero external dependencies.
 */

export type PolicyEffect = "allow" | "deny";

export interface PolicyRule {
  resource: string;
  actions: string[];
  effect: PolicyEffect;
  conditions?: Record<string, string>;
}

export interface AccountPolicy {
  readonly id: string;
  readonly accountId: string;
  readonly name: string;
  readonly description: string;
  readonly rules: PolicyRule[];
  readonly isActive: boolean;
  readonly createdAt: string; // ISO-8601
  readonly updatedAt: string; // ISO-8601
  readonly traceId?: string;
}

// ─── Value Objects (Commands) ─────────────────────────────────────────────────

export interface CreatePolicyInput {
  readonly accountId: string;
  readonly name: string;
  readonly description: string;
  readonly rules: PolicyRule[];
  readonly traceId?: string;
}

export interface UpdatePolicyInput {
  readonly name?: string;
  readonly description?: string;
  readonly rules?: PolicyRule[];
  readonly isActive?: boolean;
}
